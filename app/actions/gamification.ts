"use server"

import { auth } from "@clerk/nextjs/server"
import { createClerkSupabaseClient } from "@/lib/supabaseClient"
import { Badge, UserBadge } from "@/components/playground/types"

export async function getBadges() {
    const { userId, getToken } = await auth()
    if (!userId) return { badges: [], userBadges: [] }

    const token = await getToken({ template: "supabase" })
    const supabase = createClerkSupabaseClient(token)

    // Fetch all badges
    const { data: badges, error: badgesError } = await supabase
        .from('badges')
        .select('*')
        .order('rarity', { ascending: true }) // You might want custom order

    if (badgesError) {
        console.error("Error fetching badges:", badgesError)
        return { badges: [], userBadges: [] }
    }

    // Fetch user's earned badges
    const { data: userBadges, error: userBadgesError } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', userId)

    if (userBadgesError) {
        console.error("Error fetching user badges:", userBadgesError)
        return { badges: (badges as Badge[]) || [], userBadges: [] }
    }

    return {
        badges: (badges as Badge[]) || [],
        userBadges: (userBadges as UserBadge[]) || []
    }
}

export async function awardBadge(badgeCondition: string) {
    const { userId, getToken } = await auth()
    if (!userId) return null

    const token = await getToken({ template: "supabase" })
    const supabase = createClerkSupabaseClient(token)

    // 1. Find the badge by condition
    const { data: badgeData } = await supabase
        .from('badges')
        .select('*')
        .eq('unlock_condition', badgeCondition)
        .single()

    if (!badgeData) return null

    const badge = badgeData as Badge

    // 2. Check if already earned
    const { data: existing } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', userId)
        .eq('badge_id', badge.id)
        .single()

    if (existing) return null // Already earned

    // 3. Award Badge
    const { error } = await supabase
        .from('user_badges')
        .insert({
            user_id: userId,
            badge_id: badge.id
        })

    if (error) {
        console.error(`Failed to award badge ${badge.name}:`, error)
        return null
    }

    return badge
}

// Logic to check conditions based on game events
// This would be more complex in a real app, aggregating stats from a 'game_sessions' table
// For this MVP, we will rely on client-side triggers or simplified server-checks
export async function checkBadgeEligibility(action: 'complete_challenge', payload: any) {
    // In a robust system, we would query the DB for total stats here.
    // implementation pending robust analytics
    return []
}

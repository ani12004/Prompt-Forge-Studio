"use server"

import { auth } from "@clerk/nextjs/server"
import { createClerkSupabaseClient } from "@/lib/supabaseClient"

export async function getNotifications() {
    const { getToken, userId } = await auth()

    // We use the authenticated client so RLS applies
    const token = await getToken({ template: "supabase" })
    const supabase = createClerkSupabaseClient(token)

    // Fetch Global (user_id is null) OR Personal (user_id = current)
    // The RLS policy I gave the user handles this automatically `(auth.uid() = user_id or user_id is null)`
    // So we just select * from notifications.

    // However, Supabase JS client might need explicit filter if RLS isn't perfectly trusted or for optimization?
    // Actually, RLS is enough. But let's order by created_at.

    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)

    if (error) {
        console.error("Error fetching notifications", error)
        return []
    }

    return data
}

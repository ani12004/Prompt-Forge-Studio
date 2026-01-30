"use server"

import { createAdminClient } from "@/lib/supabaseAdmin"
import { isAdmin } from "@/lib/admin"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

// Helper to ensure admin access
async function checkAdmin() {
    const isAllowed = await isAdmin()
    if (!isAllowed) {
        throw new Error("Unauthorized Access")
    }
}

export async function getAdminStats() {
    await checkAdmin()
    const supabase = createAdminClient()

    const { count: totalUsers, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

    const { count: totalMessages, error: messagesError } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true })

    const { count: unreadMessages, error: unreadError } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'unread')

    if (usersError || messagesError || unreadError) {
        console.error("Error fetching stats", usersError, messagesError, unreadError)
        return { totalUsers: 0, totalMessages: 0, unreadMessages: 0 }
    }

    return {
        totalUsers: totalUsers || 0,
        totalMessages: totalMessages || 0,
        unreadMessages: unreadMessages || 0
    }
}

export async function getUsers() {
    await checkAdmin()
    const supabase = createAdminClient()

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)

    if (error) {
        console.error("Error fetching users", error)
        return []
    }
    return data
}

export async function getContactMessages() {
    await checkAdmin()
    const supabase = createAdminClient()

    const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)

    if (error) {
        console.error("Error fetching messages", error)
        return []
    }
    return data
}

export async function sendBroadcastEmail(prevState: any, formData: FormData) {
    await checkAdmin()
    const supabase = createAdminClient()

    const subject = formData.get("subject") as string
    const message = formData.get("message") as string

    if (!subject || !message) {
        return { error: "Subject and Message are required" }
    }

    // Fetch all user emails
    const { data: users, error: fetchError } = await supabase
        .from('profiles')
        .select('email, full_name')
        .not('email', 'is', null)

    if (fetchError || !users) {
        return { error: "Failed to fetch user list" }
    }

    const allEmails = users.map(u => u.email).filter(Boolean) as string[]

    if (allEmails.length === 0) {
        return { error: "No users found to email" }
    }

    // Resend Onboarding Limitations
    const senderEmail = "PromptForge Updates <onboarding@resend.dev>"
    const allowedEmails = (process.env.ADMIN_EMAILS || "").split(",")

    let targetEmails = allEmails
    let isOnboarding = false

    if (senderEmail.includes("onboarding@resend.dev")) {
        console.log("Using Resend Onboarding Domain. Restricting recipients to ADMIN_EMAILS.")
        targetEmails = allEmails.filter(email => allowedEmails.includes(email))
        isOnboarding = true

        if (targetEmails.length === 0) {
            return { error: "Onboarding Mode: No users found in ADMIN_EMAILS list. Add your email to .env.local" }
        }

        if (targetEmails.length < allEmails.length) {
            console.warn(`Filtered out ${allEmails.length - targetEmails.length} users due to onboarding restriction.`)
        }
    }

    // Construct batch payload
    const batchPayload = targetEmails.map(email => ({
        from: senderEmail,
        to: email,
        subject: `[Announcement] ${subject}`,
        html: `
            <div style="font-family: sans-serif; padding: 20px; background: #f4f4f5;">
                <div style="background: #fff; padding: 30px; border-radius: 10px; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">${subject}</h2>
                    <div style="color: #555; white-space: pre-wrap;">${message}</div>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="color: #999; font-size: 12px;">You received this email because you are a user of PromptForge AI.</p>
                </div>
            </div>
        `
    }))

    // Chunk into 100s for Resend batch limit
    const chunkSize = 100
    let successCount = 0
    let failureCount = 0

    try {
        for (let i = 0; i < batchPayload.length; i += chunkSize) {
            const chunk = batchPayload.slice(i, i + chunkSize)
            const { data, error } = await resend.batch.send(chunk)

            if (error) {
                console.error("Batch send error", error)
                failureCount += chunk.length
                return { error: `Broadcast failed: ${error.message || error.name || "Unknown error"}` }
            } else {
                successCount += (data?.data?.length || 0)
            }
        }
    } catch (e: any) {
        console.error("Broadcast exception", e)
        return { error: `Failed to complete broadcast: ${e.message}` }
    }

    return {
        success: true,
        message: `Sent to ${successCount} users ${isOnboarding ? "(Admin Only Mode)" : ""}. Failed: ${failureCount}.`
    }
}

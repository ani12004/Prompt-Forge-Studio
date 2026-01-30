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
        .order('created_at', { ascending: false }) // Assuming created_at exists, if not maybe just order by default
        .limit(100) // Safety limit

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
        .order('created_at', { ascending: false }) // Newest first
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
        .not('email', 'is', null) // Ensure email exists

    if (fetchError || !users) {
        return { error: "Failed to fetch user list" }
    }

    const emails = users.map(u => u.email).filter(Boolean) as string[]

    if (emails.length === 0) {
        return { error: "No users found to email" }
    }

    // Send emails in batches of 50 (Resend limit is usually 100/batch but simpler to loop for now if small list, 
    // or use batch endpoint logic. For safety and simplicity with current key, 
    // we will loop. Note: Free tier might have rate limits.
    // Actually, `resend.batch.send` is better.
    // But let's act as if we are broadcasting. `bcc` is also an option if privacy is concern, 
    // but better to send individual emails or use 'to' if batching.
    // Actually, resend recommends sending individually for transactional, or batch for marketing.
    // Let's use simple loop for now as this is a "Start" feature.
    // Wait, batch API is: `resend.batch.send([{from, to, subject, html}, ...])`

    // Construct batch payload
    const batchPayload = emails.map(email => ({
        from: "PromptForge Updates <onboarding@resend.dev>", // Or update if they have a domain
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

    // Chunk into 100s if list is big (Resend max batch size)
    const chunkSize = 100
    let successCount = 0
    let failureCount = 0

    try {
        for (let i = 0; i < batchPayload.length; i += chunkSize) {
            const chunk = batchPayload.slice(i, i + chunkSize)
            const { data, error } = await resend.batch.send(chunk)

            if (error) {
                console.error("Batch send error", error)
                failureCount += chunk.length // roughly
            } else {
                successCount += (data?.data?.length || 0)
            }
        }
    } catch (e) {
        console.error("Broadcast exception", e)
        return { error: "Failed to complete broadcast" }
    }

    return {
        success: true,
        message: `Sent to ${successCount} users. Failed: ${failureCount}.`
    }
}

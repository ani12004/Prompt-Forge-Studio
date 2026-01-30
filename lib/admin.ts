import { currentUser } from "@clerk/nextjs/server"

export async function isAdmin() {
    const user = await currentUser()
    const adminEmails = process.env.ADMIN_EMAILS?.split(",") || []

    if (!user || !user.emailAddresses.length) {
        return false
    }

    const userEmail = user.emailAddresses[0].emailAddress
    return adminEmails.includes(userEmail)
}

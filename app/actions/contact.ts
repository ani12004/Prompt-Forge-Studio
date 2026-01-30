"use server"

import { Resend } from "resend"
import { z } from "zod"

const resend = new Resend(process.env.RESEND_API_KEY)

const contactFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    subject: z.string().min(1, "Subject is required"),
    message: z.string().min(10, "Message must be at least 10 characters"),
})

export type ContactFormState = {
    success?: boolean
    error?: string
    validationErrors?: {
        name?: string[]
        email?: string[]
        subject?: string[]
        message?: string[]
    }
}

export async function submitContactForm(prevState: ContactFormState, formData: FormData): Promise<ContactFormState> {
    const rawData = {
        name: formData.get("name"),
        email: formData.get("email"),
        subject: formData.get("subject"),
        message: formData.get("message"),
    }

    const validatedFields = contactFormSchema.safeParse(rawData)

    if (!validatedFields.success) {
        return {
            validationErrors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const { name, email, subject, message } = validatedFields.data
    const contactEmail = process.env.CONTACT_EMAIL

    if (!contactEmail) {
        console.error("CONTACT_EMAIL environment variable is not set")
        return { error: "Configuration error. Please try again later." }
    }

    try {
        const { error } = await resend.emails.send({
            from: "PromptForge Contact <onboarding@resend.dev>",
            to: contactEmail,
            subject: `[Contact Form] ${subject}`,
            replyTo: email,
            html: `
                <div>
                    <h2>New Contact Form Submission</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <hr />
                    <h3>Message:</h3>
                    <p>${message.replace(/\n/g, "<br>")}</p>
                </div>
            `,
        })

        if (error) {
            console.error("Resend error:", error)
            return { error: "Failed to send message. Please try again." }
        }

        return { success: true }
    } catch (error) {
        console.error("Server action error:", error)
        return { error: "Something went wrong. Please try again." }
    }
}

"use server"
import { Resend } from 'resend';
import { z } from 'zod';

// Schema for validation
const ContactSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    subject: z.string().min(5),
    message: z.string().min(10),
});

export async function sendContactEmail(prevState: any, formData: FormData) {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const rawData = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message'),
    };

    const validatedFields = ContactSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return { success: false, errors: validatedFields.error.flatten().fieldErrors };
    }

    try {
        if (!process.env.RESEND_API_KEY) {
            console.log("MOCK EMAIL SEND:", validatedFields.data);
            // Return success in dev mode without key
            return { success: true, message: "Email sent (Mock Mode)" };
        }

        const { name, email, subject, message } = validatedFields.data;

        await resend.emails.send({
            from: 'PromptForge Contact <onboarding@resend.dev>',
            to: 'delivered@resend.dev', // Replace with user's real email when verified
            subject: `[Contact Form] ${subject}`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        });

        return { success: true, message: "Email sent successfully!" };
    } catch (error) {
        return { success: false, message: "Failed to send email." };
    }
}

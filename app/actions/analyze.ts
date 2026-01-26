"use server"
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function analyzePromptIntent(prompt: string) {
    if (!prompt || prompt.length < 5) return null;

    if (!process.env.GEMINI_API_KEY) {
        // Fallback Mock Logic if no key
        await new Promise(r => setTimeout(r, 1000));
        const lower = prompt.toLowerCase();
        if (lower.includes("code") || lower.includes("python")) return "Code Generation";
        if (lower.includes("image") || lower.includes("logo")) return "Image Generation";
        if (lower.includes("write") || lower.includes("blog")) return "Content Writing";
        return "General Query";
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const systemInstruction = "You are an AI intent classifier. Analyze the user's prompt and return a SINGLE classification string from these options: 'Code Generation', 'Image Generation', 'Content Writing', 'Data Analysis', 'Creative Writing', 'General Query'. Return ONLY the classification.";

        const result = await model.generateContent([systemInstruction, `User Prompt: ${prompt}`]);
        const response = result.response;

        return response.text().trim();
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Analysis Failed";
    }
}

import { GoogleGenerativeAI } from "@google/generative-ai";

const getAIClient = () => {
    if (!process.env.GEMINI_API_KEY) throw new Error("Missing GEMINI_API_KEY");
    return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
};

interface RouterResult {
    output: string;
    modelUsed: string;
}

export async function routeAndExecutePrompt(
    systemPrompt: string,
    template: string,
    variables: Record<string, string>
): Promise<RouterResult> {
    const ai = getAIClient();

    // 1. Variable Injection
    // Replaces all occurrences of {{variable_name}} with the actual value
    let finalPrompt = template;
    for (const [key, value] of Object.entries(variables)) {
        // Use a global regex to replace all instances of the variable
        const regex = new RegExp(`{{${key}}}`, 'g');
        finalPrompt = finalPrompt.replace(regex, value);
    }

    // 2. Cascading Model Router Logic
    // Token approximation: 1 token ~= 4 chars. 
    // If the prompt is massive (>4000 chars roughly 1k tokens) or explicitly asks for deep reasoning, route to Pro.
    const isMassive = finalPrompt.length > 4000;
    const requiresDeepLogic = systemPrompt.toLowerCase().includes("step-by-step") || template.toLowerCase().includes("<think>");

    // Default to the fast, cheap model. Upgrade based on heuristics.
    const modelName = (isMassive || requiresDeepLogic)
        ? "gemini-2.0-pro-exp-02-05"
        : "gemini-2.5-flash";

    // 3. LLM Execution
    const geminiModel = ai.getGenerativeModel({
        model: modelName,
        systemInstruction: systemPrompt
    });

    const response = await geminiModel.generateContent({
        contents: [{ role: 'user', parts: [{ text: finalPrompt }] }],
        generationConfig: {
            // Hardcode temperature for the MVP. You can make this dynamic per version later.
            temperature: 0.7,
        }
    });

    const text = response.response.text();
    if (!text) {
        throw new Error("LLM returned an empty response.");
    }

    return {
        output: text,
        modelUsed: modelName
    };
}

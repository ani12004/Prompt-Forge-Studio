import { generateResponse, AIProviderName } from "./ai";
import { sanitizeForPrompt } from "./guardrails";

export interface RouterResult {
    output: string;
    modelUsed: string;
    tokensInput: number;
    tokensOutput: number;
    costMicroUsd: number;
}

export async function routeAndExecutePrompt(
    systemPrompt: string,
    template: string,
    variables: Record<string, string>,
    forcedModel?: string
): Promise<RouterResult> {

    // 1. Variable Injection
    let finalPrompt = template;
    for (const [key, value] of Object.entries(variables)) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        finalPrompt = finalPrompt.replace(regex, sanitizeForPrompt(value));
    }

    // 2. Cascading Model Router Logic
    const isMassive = finalPrompt.length > 4000;
    const requiresDeepLogic = systemPrompt.toLowerCase().includes("step-by-step") || template.toLowerCase().includes("<think>");

    const modelName = forcedModel || ((isMassive || requiresDeepLogic)
        ? "gemini-2.0-pro-exp-02-05"
        : "gemini-2.0-flash");

    // 3. Provider Resolution
    let provider: AIProviderName = "gemini";
    if (modelName.startsWith('nvidia/')) provider = "nvidia";
    else if (modelName.startsWith('groq/')) provider = "groq";
    else if (modelName.startsWith('deepseek/')) provider = "deepseek";

    // 4. Execution
    const result = await generateResponse(provider, {
        model: modelName.includes('/') ? modelName.split('/')[1] : modelName,
        prompt: finalPrompt,
        systemPrompt,
        temperature: 0.7,
    });

    return {
        output: result.output,
        modelUsed: result.modelUsed,
        tokensInput: result.usage?.promptTokens || 0,
        tokensOutput: result.usage?.completionTokens || 0,
        costMicroUsd: result.costMicroUsd || 0
    };
}

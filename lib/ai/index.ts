
import { AIProviderName, CompletionOptions, ProviderResult } from "./types";
import { AIRouter } from "./router";

const router = new AIRouter();

/**
 * Centrally managed function to generate a response from any supported AI provider.
 * @param provider - The AI provider to use (gemini, nvidia, groq, deepseek)
 * @param options - Generation options including prompt, model, and creative parameters.
 */
export async function generateResponse(
    provider: AIProviderName,
    options: CompletionOptions
): Promise<ProviderResult> {
    try {
        return await router.generateResponse(provider, options);
    } catch (error: any) {
        console.error(`[AI Router] Error with provider ${provider}:`, error);
        throw error;
    }
}

export * from "./types";

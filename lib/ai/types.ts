
export type AIProviderName = "gemini" | "nvidia" | "groq" | "deepseek";

export interface ProviderResult {
    output: string;
    modelUsed: string;
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
    costMicroUsd?: number;
}

export interface CompletionOptions {
    model: string;
    temperature?: number;
    topP?: number;
    topK?: number;
    maxTokens?: number;
    systemPrompt?: string;
    prompt: string;
    stream?: boolean;
}

export interface IAIProvider {
    name: AIProviderName;
    generateResponse(options: CompletionOptions): Promise<ProviderResult>;
}

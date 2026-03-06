
import { IAIProvider, AIProviderName, CompletionOptions, ProviderResult } from "./types";
import { GeminiProvider } from "./providers/gemini";
import { NvidiaProvider } from "./providers/nvidia";
import { GroqProvider } from "./providers/groq";

export class AIRouter {
    private providers: Map<AIProviderName, IAIProvider> = new Map();

    constructor() {
        this.registerProvider("gemini", () => new GeminiProvider());
        this.registerProvider("nvidia", () => new NvidiaProvider());
        this.registerProvider("groq", () => new GroqProvider());
    }

    private registerProvider(name: AIProviderName, factory: () => IAIProvider) {
        try {
            this.providers.set(name, factory());
        } catch (error) {
            console.error(`[AIRouter] Failed to initialize provider ${name}:`, error);
        }
    }

    async generateResponse(providerName: AIProviderName, options: CompletionOptions): Promise<ProviderResult> {
        const provider = this.providers.get(providerName);
        if (!provider) {
            throw new Error(`Provider ${providerName} not found`);
        }
        return provider.generateResponse(options);
    }
}

export const aiRouter = new AIRouter();

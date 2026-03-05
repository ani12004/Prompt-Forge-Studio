
import { BaseAIProvider } from "./base";
import { AIProviderName, CompletionOptions, ProviderResult } from "../types";

export class DeepSeekProvider extends BaseAIProvider {
    name: AIProviderName = "deepseek";

    async generateResponse(options: CompletionOptions): Promise<ProviderResult> {
        const apiKey = process.env.DEEPSEEK_API_KEY;
        if (!apiKey) throw new Error("Missing DEEPSEEK_API_KEY");

        const result = await this.fetchOpenAICompatible(
            "https://api.deepseek.com/chat/completions",
            apiKey,
            options
        );

        // Approximate cost for deepseek-chat
        const tokensInput = result.usage?.promptTokens || 0;
        const tokensOutput = result.usage?.completionTokens || 0;
        const costMicroUsd = Math.round((tokensInput * 0.1) + (tokensOutput * 0.1));

        return { ...result, costMicroUsd };
    }
}

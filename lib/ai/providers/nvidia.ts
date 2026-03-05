
import { BaseAIProvider } from "./base";
import { AIProviderName, CompletionOptions, ProviderResult } from "../types";

export class NvidiaProvider extends BaseAIProvider {
    name: AIProviderName = "nvidia";

    async generateResponse(options: CompletionOptions): Promise<ProviderResult> {
        const apiKey = process.env.NVIDIA_API_KEY;
        if (!apiKey) throw new Error("Missing NVIDIA_API_KEY");

        const result = await this.fetchOpenAICompatible(
            "https://integrate.api.nvidia.com/v1/chat/completions",
            apiKey,
            options
        );

        // Approximate NVIDIA costs (baseline)
        const tokensInput = result.usage?.promptTokens || 0;
        const tokensOutput = result.usage?.completionTokens || 0;
        const costMicroUsd = Math.round((tokensInput * 0.1) + (tokensOutput * 0.3));

        return { ...result, costMicroUsd };
    }
}

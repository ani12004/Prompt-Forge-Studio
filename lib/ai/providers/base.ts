
import { IAIProvider, AIProviderName, CompletionOptions, ProviderResult } from "../types";

export abstract class BaseAIProvider implements IAIProvider {
    abstract name: AIProviderName;

    protected async fetchOpenAICompatible(
        url: string,
        apiKey: string,
        options: CompletionOptions
    ): Promise<ProviderResult> {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: options.model,
                messages: [
                    ...(options.systemPrompt ? [{ role: "system", content: options.systemPrompt }] : []),
                    { role: "user", content: options.prompt },
                ],
                temperature: options.temperature ?? 0.7,
                top_p: options.topP ?? 0.9,
                max_tokens: options.maxTokens ?? 1024,
                stream: options.stream ?? false,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `${this.name} API error: ${response.status}`);
        }

        const data = await response.json();
        const text = data.choices[0]?.message?.content || "";

        return {
            output: text,
            modelUsed: options.model,
            usage: {
                promptTokens: data.usage?.prompt_tokens || 0,
                completionTokens: data.usage?.completion_tokens || 0,
                totalTokens: data.usage?.total_tokens || 0,
            },
        };
    }

    abstract generateResponse(options: CompletionOptions): Promise<ProviderResult>;
}

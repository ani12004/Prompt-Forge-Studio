
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

        if (!data.choices || data.choices.length === 0) {
            throw new Error(`${this.name} API error: No completion choices returned.`);
        }

        const rawText = data.choices[0]?.message?.content || "";
        const cleanText = this.beautify(rawText);

        return {
            output: cleanText,
            modelUsed: options.model,
            usage: {
                promptTokens: data.usage?.prompt_tokens || 0,
                completionTokens: data.usage?.completion_tokens || 0,
                totalTokens: data.usage?.total_tokens || 0,
            },
        };
    }

    /**
     * Cleans AI response from "dirty" formatting like Markdown blocks or JSON wrappers.
     */
    protected beautify(text: string): string {
        if (!text) return "";

        // 1. Remove Markdown JSON blocks if present
        let clean = text.replace(/```json\s?([\s\S]*?)```/g, '$1')
            .replace(/```\s?([\s\S]*?)```/g, '$1')
            .trim();

        // 2. Heuristic: If it looks like JSON, try to parse it
        if (clean.startsWith('{') && clean.endsWith('}')) {
            try {
                const parsed = JSON.parse(clean);
                // If it's a wrapped response often seen in prompt engineering tasks
                return parsed.refined_prompt || parsed.prompt || parsed.content || parsed.output || clean;
            } catch (e) {
                // Not valid JSON, return as is
            }
        }

        return clean;
    }

    abstract generateResponse(options: CompletionOptions): Promise<ProviderResult>;
}

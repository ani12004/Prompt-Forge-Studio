
import { GoogleGenerativeAI } from "@google/generative-ai";
import { IAIProvider, AIProviderName, CompletionOptions, ProviderResult } from "../types";

export class GeminiProvider implements IAIProvider {
    name: AIProviderName = "gemini";
    private genAI: GoogleGenerativeAI | null = null;
    private apiKey: string | undefined;

    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY;
    }

    private getGenAI() {
        if (!this.genAI) {
            if (!this.apiKey) throw new Error("Missing GEMINI_API_KEY: Please configure your environment variables.");
            this.genAI = new GoogleGenerativeAI(this.apiKey);
        }
        return this.genAI;
    }

    async generateResponse(options: CompletionOptions): Promise<ProviderResult> {
        const genAI = this.getGenAI();
        const model = genAI.getGenerativeModel({
            model: options.model,
            systemInstruction: options.systemPrompt,
        });

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: options.prompt }] }],
            generationConfig: {
                temperature: options.temperature ?? 0.7,
                topP: options.topP ?? 0.9,
                topK: options.topK ?? 40,
                maxOutputTokens: options.maxTokens ?? 1024,
            }
        });

        const response = await result.response;
        const text = response.text();
        const usage = response.usageMetadata;

        const tokensInput = usage?.promptTokenCount || 0;
        const tokensOutput = usage?.candidatesTokenCount || 0;

        const isPro = options.model.includes('pro');
        const costIn = isPro ? 1.25 : 0.075;
        const costOut = isPro ? 5.00 : 0.30;

        const costMicroUsd = Math.round((tokensInput * costIn) + (tokensOutput * costOut));

        const cleanText = this.beautify(text);

        return {
            output: cleanText,
            modelUsed: options.model,
            usage: {
                promptTokens: tokensInput,
                completionTokens: tokensOutput,
                totalTokens: tokensInput + tokensOutput,
            },
            costMicroUsd
        };
    }

    private beautify(text: string): string {
        if (!text) return "";
        let clean = text.replace(/```json\s?([\s\S]*?)```/g, '$1')
            .replace(/```\s?([\s\S]*?)```/g, '$1')
            .trim();
        if (clean.startsWith('{') && clean.endsWith('}')) {
            try {
                const parsed = JSON.parse(clean);
                return parsed.refined_prompt || parsed.prompt || parsed.content || parsed.output || clean;
            } catch (e) { }
        }
        return clean;
    }
}

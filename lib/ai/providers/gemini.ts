
import { GoogleGenerativeAI } from "@google/generative-ai";
import { IAIProvider, AIProviderName, CompletionOptions, ProviderResult } from "../types";

export class GeminiProvider implements IAIProvider {
    name: AIProviderName = "gemini";
    private genAI: GoogleGenerativeAI;

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error("Missing GEMINI_API_KEY");
        this.genAI = new GoogleGenerativeAI(apiKey);
    }

    async generateResponse(options: CompletionOptions): Promise<ProviderResult> {
        const model = this.genAI.getGenerativeModel({
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

        return {
            output: text,
            modelUsed: options.model,
            usage: {
                promptTokens: tokensInput,
                completionTokens: tokensOutput,
                totalTokens: tokensInput + tokensOutput,
            },
            costMicroUsd
        };
    }
}

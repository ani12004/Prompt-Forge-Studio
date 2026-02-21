export interface PromptForgeOptions {
    apiKey: string;
    baseUrl?: string;
    timeoutMs?: number;
    maxRetries?: number;
}

export interface ExecuteParams {
    versionId: string;
    variables?: Record<string, string>;
    abVersionId?: string;
    requiredSchema?: any;
}

export interface ExecuteResponse {
    success: boolean;
    data: string;
    meta: {
        model: string;
        cached: boolean;
        latencyMs: number;
        tokensInput: number;
        tokensOutput: number;
        costMicroUsd: number;
        servedVersion: string;
    };
}

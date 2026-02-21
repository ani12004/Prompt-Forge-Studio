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
        latency_ms: number;
        tokens_input: number;
        tokens_output: number;
        cost_micro_usd: number;
        served_version: string;
    };
}

import { getSupabaseAdmin } from "./supabase";

export interface PromptAnalysis {
    length: number;
    hasRedundancy: boolean;
    hasSchema: boolean;
    suggestions: string[];
}

export function analyzePrompt(prompt: string): PromptAnalysis {
    const suggestions: string[] = [];
    const lower = prompt.toLowerCase();
    const hasRedundancy = lower.includes("please") || lower.includes("kindly");
    const hasSchema = lower.includes("json") || lower.includes("schema") || lower.includes("format");

    if (hasRedundancy) suggestions.push("Remove polite filler words (e.g., 'please', 'kindly') to save tokens.");
    if (!hasSchema) suggestions.push("Consider defining a strict output schema for more predictable formatting.");
    if (prompt.length > 4000) suggestions.push("Prompt is massive. Consider splitting into a multi-step pipeline.");
    else if (prompt.length < 50) suggestions.push("Prompt is very short. Provide more context to reduce LLM hallucinations.");

    return {
        length: prompt.length,
        hasRedundancy,
        hasSchema,
        suggestions
    };
}

export async function getCostOptimizationStats() {
    const supabase = getSupabaseAdmin();
    const { data } = await supabase.from('v2_execution_logs').select('version_id, model_used, cost_micro_usd');

    let totalCost = 0;
    const promptCosts: Record<string, number> = {};
    const modelCosts: Record<string, number> = {};

    data?.forEach(log => {
        const cost = log.cost_micro_usd || 0;
        totalCost += cost;
        promptCosts[log.version_id] = (promptCosts[log.version_id] || 0) + cost;
        modelCosts[log.model_used] = (modelCosts[log.model_used] || 0) + cost;
    });

    const mostExpensivePrompts = Object.entries(promptCosts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([id, cost]) => ({ versionId: id, totalCost: cost }));

    const recommendations = [];
    if (totalCost > 0 && modelCosts['gemini-2.0-pro-exp-02-05'] > totalCost * 0.5) {
        recommendations.push("High usage of Pro model detected. Consider A/B testing Flash for cost savings on simpler tasks.");
    }

    return { totalCost, mostExpensivePrompts, modelCosts, recommendations };
}

export async function computeABTestWinRate(versionA: string, versionB: string) {
    const supabase = getSupabaseAdmin();

    const [{ count: countA }, { count: countB }] = await Promise.all([
        supabase.from('v2_execution_logs').select('*', { count: 'exact', head: true }).eq('version_id', versionA),
        supabase.from('v2_execution_logs').select('*', { count: 'exact', head: true }).eq('version_id', versionB)
    ]);

    return {
        versionA,
        versionB,
        servedA: countA || 0,
        servedB: countB || 0,
        totalServed: (countA || 0) + (countB || 0)
    };
}

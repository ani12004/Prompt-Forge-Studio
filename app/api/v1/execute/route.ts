import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { routeAndExecutePrompt } from '@/lib/router';
import { withCache } from '@/lib/cache';
import { runGuardrails, validateSchema } from '@/lib/guardrails';
import crypto from 'crypto';
import { z } from 'zod';

// Input Validation Schema using Zod
const executeSchema = z.object({
    version_id: z.string().uuid(),
    ab_version_id: z.string().uuid().optional(), // For A/B traffic split
    variables: z.record(z.string(), z.string()).default({}), // Allows optional variables
    required_schema: z.any().optional(), // For schema validation
});

export async function POST(req: Request) {
    const startTime = Date.now();

    try {
        // 1. Parse & Validate Request
        const body = await req.json();
        const parsed = executeSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid request payload", details: parsed.error.issues }, { status: 400 });
        }

        const { version_id, ab_version_id, variables, required_schema } = parsed.data;

        // A/B Testing split logic (50/50 randomly)
        const active_version_id = (ab_version_id && Math.random() > 0.5) ? ab_version_id : version_id;

        // Run Guardrails on Input Variables
        const combinedInput = Object.values(variables).join(" ");
        const guardrailResult = runGuardrails(combinedInput);
        if (!guardrailResult.passed) {
            return NextResponse.json({ error: "Guardrail blocked input", reason: guardrailResult.reason }, { status: 400 });
        }

        // 2. Fetch Prompt Definition (Bypassing RLS with Admin key for programmatic access)
        const supabase = getSupabaseAdmin();
        const { data: version, error: dbError } = await supabase
            .from('v2_prompt_versions')
            .select('system_prompt, template')
            .eq('id', active_version_id)
            .single();

        if (dbError || !version) {
            return NextResponse.json({ error: "Prompt version not found." }, { status: 404 });
        }

        // 3. Generate Exact-Match Cache Key
        // We hash the version_id + sorted variables to ensure stable keys
        const sortedVars = Object.keys(variables).sort().reduce((acc, key) => {
            acc[key] = variables[key];
            return acc;
        }, {} as Record<string, string>);

        const hashInput = JSON.stringify({ v: active_version_id, vars: sortedVars });
        const hash = crypto.createHash('md5').update(hashInput).digest('hex');
        const cacheKey = `pf:exec:${hash}`;

        // 4. Execute (With Route & Cache wrapping)
        const { data: result, cached } = await withCache(cacheKey, async () => {
            return await routeAndExecutePrompt(
                version.system_prompt,
                version.template,
                variables
            );
        });

        // Run output schema validation on generated output
        if (required_schema && !validateSchema(result.output, required_schema)) {
            // Minimal handling: skip cache and return error
            return NextResponse.json({ error: "Output failed schema validation", output: result.output }, { status: 422 });
        }

        const latencyMs = Date.now() - startTime;
        const finalCost = cached ? 0 : (result.costMicroUsd || 0);

        // 5. Asynchronous Telemetry Logging (Fire and forget to not block the response)
        supabase.from('v2_execution_logs').insert({
            version_id: active_version_id,
            latency_ms: latencyMs,
            model_used: result.modelUsed,
            cached_hit: cached,
            tokens_input: result.tokensInput || 0,
            tokens_output: result.tokensOutput || 0,
            cost_micro_usd: finalCost,
            ab_test_variant: ab_version_id ? active_version_id : null
        }).then(({ error }) => {
            if (error) console.error("[Telemetry] Failed to log execution:", error);
        });

        // 6. Return Response
        return NextResponse.json({
            success: true,
            data: result.output,
            meta: {
                model: result.modelUsed,
                cached: cached,
                latency_ms: latencyMs,
                tokens_input: result.tokensInput || 0,
                tokens_output: result.tokensOutput || 0,
                cost_micro_usd: finalCost,
                served_version: active_version_id
            }
        });

    } catch (err: any) {
        console.error("[API Error] /v1/execute:", err);
        return NextResponse.json({ error: "Internal Server Error", message: err.message }, { status: 500 });
    }
}

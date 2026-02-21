import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { routeAndExecutePrompt } from '@/lib/router';
import { withCache } from '@/lib/cache';
import crypto from 'crypto';
import { z } from 'zod';

// Input Validation Schema using Zod
const executeSchema = z.object({
    version_id: z.string().uuid(),
    variables: z.record(z.string(), z.string()).default({}), // Allows optional variables
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

        const { version_id, variables } = parsed.data;

        // 2. Fetch Prompt Definition (Bypassing RLS with Admin key for programmatic access)
        const supabase = getSupabaseAdmin();
        const { data: version, error: dbError } = await supabase
            .from('v2_prompt_versions')
            .select('system_prompt, template')
            .eq('id', version_id)
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

        const hashInput = JSON.stringify({ v: version_id, vars: sortedVars });
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

        const latencyMs = Date.now() - startTime;

        // 5. Asynchronous Telemetry Logging (Fire and forget to not block the response)
        supabase.from('v2_execution_logs').insert({
            version_id: version_id,
            latency_ms: latencyMs,
            model_used: result.modelUsed,
            cached_hit: cached
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
                latency_ms: latencyMs
            }
        });

    } catch (err: any) {
        console.error("[API Error] /v1/execute:", err);
        return NextResponse.json({ error: "Internal Server Error", message: err.message }, { status: 500 });
    }
}

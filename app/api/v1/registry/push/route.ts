import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { validateApiKey } from '@/lib/api-keys';
import { z } from 'zod';

const pushSchema = z.object({
    name: z.string().min(1),
    slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
    description: z.string().optional(),
    system_prompt: z.string(),
    template: z.string(),
    version_tag: z.string().default('v1'),
});

export async function POST(req: Request) {
    // Authenticate Request
    const apiKeyHeader = req.headers.get('x-api-key');
    if (!apiKeyHeader) {
        return NextResponse.json({ error: "Missing x-api-key header" }, { status: 401 });
    }

    const keyContext = await validateApiKey(apiKeyHeader);
    if (!keyContext || keyContext.revoked) {
        return NextResponse.json({ error: "Invalid or revoked API key" }, { status: 403 });
    }

    try {
        const body = await req.json();
        const parsed = pushSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid request payload", details: parsed.error.issues }, { status: 400 });
        }

        const { name, slug, description, system_prompt, template, version_tag } = parsed.data;
        const supabase = getSupabaseAdmin();

        // 1. Check if prompt exists for this user
        let { data: prompt, error: promptLookupError } = await supabase
            .from('v2_prompts')
            .select('id')
            .eq('user_id', keyContext.user_id)
            .eq('slug', slug)
            .maybeSingle();

        if (!prompt) {
            // Create new prompt
            const { data: newPrompt, error: createError } = await supabase
                .from('v2_prompts')
                .insert({
                    user_id: keyContext.user_id,
                    name,
                    slug,
                    description: description || ""
                })
                .select()
                .single();

            if (createError) throw createError;
            if (!newPrompt) throw new Error("Failed to create prompt record");
            prompt = newPrompt;
        }

        if (!prompt) {
            return NextResponse.json({ error: "Failed to resolve prompt record" }, { status: 500 });
        }

        // 2. Insert new version (Prompt is guaranteed to exist here)
        const { data: version, error: versionError } = await supabase
            .from('v2_prompt_versions')
            .upsert({
                prompt_id: prompt.id,
                version_tag,
                system_prompt,
                template,
                published: true
            }, {
                onConflict: 'prompt_id,version_tag'
            })
            .select()
            .single();

        if (versionError) throw versionError;

        if (!version) {
            throw new Error("Failed to create version");
        }

        return NextResponse.json({
            success: true,
            message: `Successfully pushed ${version_tag} of '${slug}'`,
            data: {
                prompt_id: prompt.id,
                version_id: version.id,
                full_name: `${keyContext.user_id}/${slug}`
            }
        });

    } catch (err: any) {
        console.error("[Registry Push] Error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

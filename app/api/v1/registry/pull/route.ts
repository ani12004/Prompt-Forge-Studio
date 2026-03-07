import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { validateApiKey } from '@/lib/api-keys';
import { z } from 'zod';

const pullSchema = z.object({
    identifier: z.string().describe("username/slug format"),
});

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const identifier = searchParams.get('identifier');

    if (!identifier) {
        return NextResponse.json({ error: "Missing identifier query parameter" }, { status: 400 });
    }

    const parts = identifier.split('/');
    if (parts.length !== 2) {
        return NextResponse.json({ error: "Invalid identifier format. Expected 'username/slug'" }, { status: 400 });
    }

    const [username, slug] = parts;

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
        const supabase = getSupabaseAdmin();

        // 1. Resolve User from Username
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('username', username)
            .maybeSingle();

        if (profileError || !profile) {
            return NextResponse.json({ error: `User '${username}' not found` }, { status: 404 });
        }

        // 2. Resolve Prompt from Slug
        const { data: prompt, error: promptError } = await supabase
            .from('v2_prompts')
            .select('id, name, description, v2_prompt_versions(id, version_tag, system_prompt, template, published)')
            .eq('user_id', profile.id)
            .eq('slug', slug)
            .maybeSingle();

        if (promptError || !prompt) {
            return NextResponse.json({ error: `Prompt '${slug}' not found for user '${username}'` }, { status: 404 });
        }

        // Filter for published versions
        const publishedVersions = prompt.v2_prompt_versions.filter((v: any) => v.published);

        if (publishedVersions.length === 0) {
            return NextResponse.json({ error: "No published versions found for this prompt" }, { status: 404 });
        }

        // Return the latest published version
        const latest = publishedVersions.sort((a: any, b: any) =>
            b.version_tag.localeCompare(a.version_tag, undefined, { numeric: true })
        )[0];

        return NextResponse.json({
            success: true,
            data: {
                id: prompt.id,
                name: prompt.name,
                description: prompt.description,
                full_name: identifier,
                version: {
                    id: latest.id,
                    tag: latest.version_tag,
                    system_prompt: latest.system_prompt,
                    template: latest.template
                }
            }
        });

    } catch (err: any) {
        console.error("[Registry Pull] Error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

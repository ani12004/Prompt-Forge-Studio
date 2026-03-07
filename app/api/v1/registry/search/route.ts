import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { validateApiKey } from '@/lib/api-keys';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '20');

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

        // Search for prompts
        // We join with profiles to get the username for the identifier
        const { data: prompts, error } = await supabase
            .from('v2_prompts')
            .select(`
                id,
                name,
                slug,
                description,
                profiles!inner(username)
            `)
            .or(`name.ilike.%${query}%,description.ilike.%${query}%,slug.ilike.%${query}%`)
            .limit(limit);

        if (error) throw error;

        const results = prompts.map((p: any) => ({
            name: p.name,
            identifier: `${p.profiles.username}/${p.slug}`,
            description: p.description
        }));

        return NextResponse.json({
            success: true,
            results
        });

    } catch (err: any) {
        console.error("[Registry Search] Error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { generateApiKey } from '@/lib/api-keys';

export async function GET(req: Request) {
    const supabase = getSupabaseAdmin();
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
        .from('v2_api_keys')
        .select('id, name, prefix, created_at, last_used_at, revoked')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ keys: data });
}

export async function POST(req: Request) {
    try {
        const { name, userId } = await req.json();
        if (!name || !userId) {
            return NextResponse.json({ error: "Missing name or userId" }, { status: 400 });
        }

        const { rawKey, keyHash, prefix } = generateApiKey();

        const supabase = getSupabaseAdmin();
        const { data, error } = await supabase
            .from('v2_api_keys')
            .insert({
                user_id: userId,
                name,
                key_hash: keyHash,
                prefix
            })
            .select('id, name, prefix, created_at')
            .single();

        if (error) throw error;

        // Return rawKey ONLY once on creation
        return NextResponse.json({
            key: data,
            rawKey: rawKey
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

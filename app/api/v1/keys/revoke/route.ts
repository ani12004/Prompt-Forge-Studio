import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        const { keyId, userId } = await req.json();
        if (!keyId || !userId) {
            return NextResponse.json({ error: "Missing keyId or userId" }, { status: 400 });
        }

        const supabase = getSupabaseAdmin();
        const { error } = await supabase
            .from('v2_api_keys')
            .update({ revoked: true })
            .eq('id', keyId)
            .eq('user_id', userId);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

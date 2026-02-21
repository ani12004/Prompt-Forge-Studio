import crypto from 'crypto';
import { getSupabaseAdmin } from './supabase';

export function generateApiKey(): { rawKey: string; keyHash: string; prefix: string } {
    const randomBytes = crypto.randomBytes(32).toString('base64url');
    const rawKey = `pf_live_${randomBytes}`;

    // Hash the raw key using SHA-256 for secure storage
    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');

    // Extract a prefix for display (pf_live_ + 8 characters)
    const prefix = rawKey.substring(0, 16);

    return { rawKey, keyHash, prefix };
}

export function hashKey(rawKey: string): string {
    return crypto.createHash('sha256').update(rawKey).digest('hex');
}

export async function validateApiKey(rawKey: string) {
    if (!rawKey || !rawKey.startsWith('pf_live_')) return null;

    const hash = hashKey(rawKey);
    const supabase = getSupabaseAdmin();

    const { data: key, error } = await supabase
        .from('v2_api_keys')
        .select('id, user_id, revoked')
        .eq('key_hash', hash)
        .single();

    if (error || !key || key.revoked) {
        return null;
    }

    // Update last_used_at asynchronously
    supabase
        .from('v2_api_keys')
        .update({ last_used_at: new Date().toISOString() })
        .eq('id', key.id)
        .then(({ error }) => {
            if (error) console.error("[API Keys] Failed to update last_used_at", error);
        });

    return key;
}

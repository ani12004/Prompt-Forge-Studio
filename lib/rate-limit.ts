import { redis } from './cache';

/**
 * Basic Fixed-Window Rate Limiter
 * @param identifier The unique ID to limit (e.g., API Key ID, IP address)
 * @param limit Maximum allowed requests in the window
 * @param windowSeconds The time window in seconds
 * @returns boolean where true = allowed, false = rate limited
 */
export async function checkRateLimit(identifier: string, limit: number, windowSeconds: number): Promise<boolean> {
    if (!redis) return true; // Fail open if Redis is not configured

    const key = `ratelimit:${identifier}`;

    try {
        const current = await redis.incr(key);
        if (current === 1) {
            await redis.expire(key, windowSeconds);
        }
        return current <= limit;
    } catch (err) {
        console.error("[RateLimit] Error connecting to Redis:", err);
        return true; // Fail open on Redis errors to prevent blocking traffic
    }
}

import { Redis } from '@upstash/redis';

// Initialize Redis only if keys are present
const getRedisClient = () => {
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
        console.warn("Redis credentials missing. Caching disabled.");
        return null;
    }
    return new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
};

const redis = getRedisClient();

export async function withCache<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlSeconds = 3600 // 1 Hour default
): Promise<{ data: T, cached: boolean }> {

    if (!redis) {
        // If Redis isn't configured, just run the LLM
        const data = await fetcher();
        return { data, cached: false };
    }

    try {
        // 1. Check Cache
        const cachedData = await redis.get<T>(key);
        if (cachedData) {
            return { data: cachedData, cached: true };
        }

        // 2. Cache Miss: Execute the fetcher (LLM call)
        const data = await fetcher();

        // 3. Store Async (fire and forget, don't await)
        redis.set(key, data, { ex: ttlSeconds }).catch(err =>
            console.error("[Cache] Failed to set key:", key, err)
        );

        return { data, cached: false };
    } catch (err) {
        console.error("[Cache] Redis Error. Falling back to fetcher.", err);
        const data = await fetcher();
        return { data, cached: false };
    }
}

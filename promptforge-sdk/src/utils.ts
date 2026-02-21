import { TimeoutError } from './errors';

export async function fetchWithTimeout(url: string | URL, options: RequestInit & { timeoutMs?: number }): Promise<Response> {
    const { timeoutMs, ...fetchOptions } = options;
    if (!timeoutMs) return fetch(url, fetchOptions);

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const response = await fetch(url, {
            ...fetchOptions,
            signal: controller.signal,
        });
        return response;
    } catch (err: any) {
        if (err.name === 'AbortError') {
            throw new TimeoutError(`Request timed out after ${timeoutMs}ms`);
        }
        throw err;
    } finally {
        clearTimeout(id);
    }
}

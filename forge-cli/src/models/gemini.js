const logger = require('../core/logger');

/**
 * Gemini model driver.
 * Routes through the Prompt Forge Studio API proxy.
 * The server-side handles the actual Gemini API key and call.
 */
async function generate(prompt, config = {}) {
    const apiKey = config.apiKey;
    if (!apiKey) {
        throw new Error('Prompt Forge API Key missing. Run :key to set it.');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const { getConfig } = require('../config');
    const localConfig = getConfig() || {};
    const baseUrl = localConfig.host || 'https://prompt-forge-studio.vercel.app';
    const url = `${baseUrl}/api/v1/cli`;

    // Server-side router uses actual Gemini model names
    const requestBody = {
        prompt,
        model: 'gemini-2.5-flash'
    };

    logger.debug('Gemini Request (via Prompt Forge proxy)', {
        url,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': '***REDACTED***' },
        body: requestBody
    });

    const start = Date.now();

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey
            },
            body: JSON.stringify(requestBody),
            signal: controller.signal
        });

        clearTimeout(timeoutId);
        const latency = Date.now() - start;

        logger.debug('Gemini Response', { status: response.status, latency });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            logger.debug('Gemini Error Body', { body: JSON.stringify(errorData) });

            if (process.env.DEBUG === 'true') {
                const chalk = require('chalk');
                console.log(chalk.dim(`  [DEBUG] Gemini → HTTP ${response.status} | ${latency}ms`));
                console.log(chalk.dim(`  [DEBUG] Error: ${JSON.stringify(errorData)}`));
            }

            const error = new Error(errorData.error || errorData.message || `Gemini API Error: ${response.statusText}`);
            error.status = response.status;
            throw error;
        }

        const data = await response.json();
        logger.debug('Gemini Raw Response', { body: JSON.stringify(data) });

        if (!data.success) {
            const err = new Error(data.error || 'Failed to generate content via Gemini');
            err.status = 500;
            throw err;
        }

        if (process.env.DEBUG === 'true') {
            const chalk = require('chalk');
            console.log(chalk.dim(`  [DEBUG] Gemini → HTTP 200 | ${latency}ms | Model: ${data.meta?.model}`));
            console.log(chalk.dim(`  [DEBUG] Tokens: in=${data.meta?.tokens_input || 0} out=${data.meta?.tokens_output || 0}`));
        }

        return {
            text: data.data,
            metadata: {
                tokensInput: data.meta?.tokens_input,
                tokensOutput: data.meta?.tokens_output,
                costMicroUsd: data.meta?.cost_micro_usd
            }
        };

    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            const e = new Error('Gemini API timeout (15s)');
            e.status = null;
            throw e;
        }
        throw error;
    }
}

module.exports = { generate };

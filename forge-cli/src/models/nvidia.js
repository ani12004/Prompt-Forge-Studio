const logger = require('../core/logger');

/**
 * Nvidia model driver.
 * Routes through the Prompt Forge Studio API proxy.
 * The server-side handles the actual Nvidia API key and call.
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

    // Server-side router requires 'nvidia/' prefix to route to Nvidia API
    const requestBody = {
        prompt,
        model: 'nvidia/nemotron-3-nano-30b-a3b'
    };

    logger.debug('Nvidia Request (via Prompt Forge proxy)', {
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

        logger.debug('Nvidia Response', { status: response.status, latency });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            logger.debug('Nvidia Error Body', { body: JSON.stringify(errorData) });

            if (process.env.DEBUG === 'true') {
                const chalk = require('chalk');
                console.log(chalk.dim(`  [DEBUG] Nvidia → HTTP ${response.status} | ${latency}ms`));
                console.log(chalk.dim(`  [DEBUG] Error: ${JSON.stringify(errorData)}`));
            }

            const error = new Error(errorData.error || errorData.message || `Nvidia API Error: ${response.statusText}`);
            error.status = response.status;
            throw error;
        }

        const data = await response.json();
        logger.debug('Nvidia Raw Response', { body: JSON.stringify(data) });

        if (!data.success) {
            const err = new Error(data.error || 'Failed to generate content via Nvidia');
            err.status = 500;
            throw err;
        }

        if (process.env.DEBUG === 'true') {
            const chalk = require('chalk');
            console.log(chalk.dim(`  [DEBUG] Nvidia → HTTP 200 | ${latency}ms | Model: ${data.meta?.model}`));
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
            const e = new Error('Nvidia API timeout (15s)');
            e.status = null;
            throw e;
        }
        throw error;
    }
}

module.exports = { generate };

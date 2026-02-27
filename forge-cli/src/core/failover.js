const logger = require('./logger');
const { recordSuccess, recordFailure, getPrioritizedModels } = require('./health-tracker');
const gemini = require('../models/gemini');
const nvidia = require('../models/nvidia');

const MODELS = {
    gemini,
    nvidia
};

const MAX_RETRIES = 2;
const BACKOFF_MS = [500, 1000]; // Exponential backoff for 2 retries

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function attemptGeneration(prompt, modelName, apiKey) {
    const model = MODELS[modelName];
    if (!model) {
        throw new Error(`Model ${modelName} is not implemented`);
    }

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
            logger.debug(`Attempt ${attempt + 1}/${MAX_RETRIES + 1} with ${modelName}`);

            const start = Date.now();
            const result = await model.generate(prompt, { apiKey });
            const latency = Date.now() - start;

            recordSuccess(modelName, latency);

            return {
                text: result.text,
                metadata: {
                    model: modelName,
                    latency,
                    ...result.metadata
                }
            };
        } catch (error) {
            const status = error.status;

            logger.warn(`Failure with ${modelName} on attempt ${attempt + 1}`, {
                status,
                message: error.message
            });

            // Fast fail scenarios
            if (status === 401 || status === 403) {
                logger.error(`Critical Auth Error with ${modelName}: ${status}`);
                recordFailure(modelName);
                throw new Error(`Authentication error (${status}) with ${modelName}. Invalid API Key?`);
            }

            // Retry scenarios: 429, 500+, Timeout (status undefined)
            if (attempt < MAX_RETRIES) {
                const waitMs = BACKOFF_MS[attempt] || 1000;
                logger.info(`Retrying ${modelName} in ${waitMs}ms...`);
                await sleep(waitMs);
            } else {
                recordFailure(modelName);
                if (status) {
                    throw new Error(`${modelName} API failed after ${MAX_RETRIES + 1} attempts. HTTP ${status}: ${error.message}`);
                } else {
                    throw new Error(`${modelName} API failed after ${MAX_RETRIES + 1} attempts. Network or Timeout error: ${error.message}`);
                }
            }
        }
    }
}

async function generateWithFailover(prompt, primaryModel, autoFailover, apiKey) {
    const sequence = autoFailover ? getPrioritizedModels(primaryModel) : [primaryModel];
    let lastError = null;

    for (const modelName of sequence) {
        logger.info(`Starting generation with ${modelName}`);

        try {
            return await attemptGeneration(prompt, modelName, apiKey);
        } catch (err) {
            lastError = err;
            logger.warn(`${modelName} completely failed. Moving to next if available.`);
            // Only move to failover if autoFailover is true. 
            // In our sequence logic, sequence only contains >1 element if autoFailover is true.
        }
    }

    logger.error('All failover attempts exhausted');
    throw new Error(`All failover attempts exhausted.\nLast error: ${lastError.message}`);
}

module.exports = {
    generateWithFailover
};

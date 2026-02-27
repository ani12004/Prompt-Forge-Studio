const fs = require('fs');
const path = require('path');
const os = require('os');
const logger = require('./logger');

const FORGE_HOME = path.join(os.homedir(), '.forge');
const HEALTH_FILE = path.join(FORGE_HOME, 'health.json');

const DEFAULT_HEALTH = {
    nvidia: { lastSuccess: null, lastFailure: null, avgLatency: 0, failCount: 0, successCount: 0, totalLatency: 0 },
    gemini: { lastSuccess: null, lastFailure: null, avgLatency: 0, failCount: 0, successCount: 0, totalLatency: 0 }
};

function ensureForgeHomeDir() {
    if (!fs.existsSync(FORGE_HOME)) {
        fs.mkdirSync(FORGE_HOME, { recursive: true });
    }
}

function getHealthData() {
    if (!fs.existsSync(HEALTH_FILE)) {
        return { ...DEFAULT_HEALTH };
    }
    try {
        const raw = fs.readFileSync(HEALTH_FILE, 'utf8');
        return JSON.parse(raw);
    } catch (err) {
        return { ...DEFAULT_HEALTH };
    }
}

function saveHealthData(data) {
    ensureForgeHomeDir();
    fs.writeFileSync(HEALTH_FILE, JSON.stringify(data, null, 2));
}

function recordSuccess(modelName, latency) {
    const data = getHealthData();
    if (!data[modelName]) data[modelName] = { ...DEFAULT_HEALTH[modelName] };

    const stats = data[modelName];
    stats.lastSuccess = new Date().toISOString();
    stats.successCount += 1;
    stats.totalLatency += latency;
    stats.avgLatency = Math.round(stats.totalLatency / stats.successCount);

    saveHealthData(data);
    logger.debug(`Health tracking updated (SUCCESS) for ${modelName}`, { latency, newAvg: stats.avgLatency });
}

function recordFailure(modelName) {
    const data = getHealthData();
    if (!data[modelName]) data[modelName] = { ...DEFAULT_HEALTH[modelName] };

    const stats = data[modelName];
    stats.lastFailure = new Date().toISOString();
    stats.failCount += 1;

    saveHealthData(data);
    logger.debug(`Health tracking updated (FAILURE) for ${modelName}`, { count: stats.failCount });
}

function getModelHealth(modelName) {
    const data = getHealthData();
    return data[modelName] || { ...DEFAULT_HEALTH[modelName] };
}

function getPrioritizedModels(primary) {
    const data = getHealthData();
    const allModels = Object.keys(data);

    // Sort all healthy models by latency
    const healthy = allModels.filter(m => {
        const d = data[m];
        // Deem offline if consecutive failures in short burst
        return true; // For now keep it simple: fallback order based on config or latency
    }).sort((a, b) => {
        // Prefer lower average latency
        if (data[a].avgLatency !== 0 && data[b].avgLatency !== 0) {
            return data[a].avgLatency - data[b].avgLatency;
        }
        return 0;
    });

    const others = healthy.filter(m => m !== primary);
    return [primary, ...others];
}

module.exports = {
    recordSuccess,
    recordFailure,
    getModelHealth,
    getPrioritizedModels,
    getHealthData
};

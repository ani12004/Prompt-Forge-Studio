const fs = require('fs');
const path = require('path');
const os = require('os');

const FORGE_HOME = path.join(os.homedir(), '.forge');
const LOG_FILE = path.join(FORGE_HOME, 'logs.json');
const MAX_LOG_SIZE = 5 * 1024 * 1024; // 5MB

function ensureForgeHomeDir() {
    if (!fs.existsSync(FORGE_HOME)) {
        fs.mkdirSync(FORGE_HOME, { recursive: true });
    }
}

function rotateLogs() {
    if (fs.existsSync(LOG_FILE)) {
        const stats = fs.statSync(LOG_FILE);
        if (stats.size > MAX_LOG_SIZE) {
            const archiveFile = path.join(FORGE_HOME, `logs-${Date.now()}.json`);
            fs.renameSync(LOG_FILE, archiveFile);
        }
    }
}

function writeLog(entry) {
    try {
        ensureForgeHomeDir();
        rotateLogs();

        let logs = [];
        if (fs.existsSync(LOG_FILE)) {
            const raw = fs.readFileSync(LOG_FILE, 'utf8');
            if (raw.trim() !== '') {
                try { logs = JSON.parse(raw); } catch (e) { /* ignore corrupt */ }
            }
        }

        logs.push(entry);

        // Keep last 1000 logs max for the active file to avoid slow JSON ops
        if (logs.length > 1000) {
            logs = logs.slice(-1000);
        }

        fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
    } catch (e) {
        // Silent fail on logger error to prevent CLI crash
    }
}

const logger = {
    info: (message, meta = {}) => {
        writeLog({ level: 'info', timestamp: new Date().toISOString(), message, ...meta });
    },
    warn: (message, meta = {}) => {
        writeLog({ level: 'warn', timestamp: new Date().toISOString(), message, ...meta });
    },
    error: (message, meta = {}) => {
        writeLog({ level: 'error', timestamp: new Date().toISOString(), message, ...meta });
    },
    debug: (message, meta = {}) => {
        if (process.env.DEBUG === 'true') {
            writeLog({ level: 'debug', timestamp: new Date().toISOString(), message, ...meta });
        }
    }
};

module.exports = logger;

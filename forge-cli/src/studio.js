const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const { requireAuth, setAuth } = require('./auth');
const { generateWithFailover } = require('./core/failover');
const { getHealthData } = require('./core/health-tracker');
const logger = require('./core/logger');
const {
    showBanner,
    showBottomStatusBar,
    showModelComparison,
    formatAIResponse,
    showInfoBox,
    showErrorBox
} = require('./ui');

const AVAILABLE_MODELS = ['nvidia', 'gemini'];

let state = {
    model: 'nvidia', // Primary model preference
    status: 'Online',
    latency: null,
    autoFailover: true,
    debug: false,
    history: []
};

async function startStudio() {
    showBanner();
    await requireAuth();

    // Load existing environment logic or saved config
    // Checking DEBUG environment manually if set before launch
    if (process.env.DEBUG === 'true') {
        state.debug = true;
    }

    refreshStatusBar();
    await studioLoop();
}

function refreshStatusBar() {
    showBottomStatusBar(
        state.model,
        state.status,
        state.latency,
        state.autoFailover,
        state.debug
    );
}

async function handleDoctor() {
    showInfoBox('Running Diagnostics...');
    const auth = await requireAuth();
    const apiKey = auth.promptforge;

    // Check API Key existence
    if (!apiKey) {
        showErrorBox('API Key Map', 'Missing API key. Run :key to configure.');
        return;
    }

    const testPrompt = 'Hi';
    const healthResults = [];

    for (const m of AVAILABLE_MODELS) {
        const spinner = ora(`Testing connectivity for ${chalk.cyan(m)}...`).start();
        const start = Date.now();
        try {
            await require('./models/' + m).generate(testPrompt, { apiKey });
            const lat = Date.now() - start;
            spinner.succeed(`${m} is healthy (${lat}ms)`);
            healthResults.push({ name: m, status: 'Active', avgLatency: lat, successCount: 1, failCount: 0 });
        } catch (err) {
            spinner.fail(`${m} failed: ${err.message}`);
            healthResults.push({ name: m, status: 'Offline', avgLatency: 0, successCount: 0, failCount: 1 });
        }
    }

    showModelComparison(healthResults);
}

async function handleBenchmark() {
    const { promptInput } = await inquirer.prompt([
        {
            type: 'input',
            name: 'promptInput',
            message: 'Enter prompt for benchmark:',
            validate: (i) => i.trim() ? true : 'Please enter a prompt'
        }
    ]);

    const auth = await requireAuth();
    showInfoBox('Benchmarking all providers...');

    const results = [];
    for (const m of AVAILABLE_MODELS) {
        const spinner = ora(`Evaluating ${chalk.cyan(m)}...`).start();
        const start = Date.now();
        try {
            const res = await require('./models/' + m).generate(promptInput, { apiKey: auth.promptforge });
            const lat = Date.now() - start;
            spinner.succeed(`${m} completed in ${lat}ms`);
            results.push({
                name: m,
                status: 'OK',
                latency: lat,
                tokensIn: res.metadata?.tokensInput || 0,
                tokensOut: res.metadata?.tokensOutput || 0,
                preview: (res.text || '').replace(/\n/g, ' ').substring(0, 80),
                error: null
            });
        } catch (err) {
            const lat = Date.now() - start;
            spinner.fail(`${m} failed (${lat}ms)`);
            results.push({
                name: m,
                status: 'FAIL',
                latency: lat,
                tokensIn: 0,
                tokensOut: 0,
                preview: '',
                error: err.message
            });
        }
    }

    // Build full report table
    const Table = require('cli-table3');
    const table = new Table({
        head: [
            chalk.cyan('Provider'),
            chalk.cyan('Status'),
            chalk.cyan('Latency'),
            chalk.cyan('Tokens (In/Out)'),
            chalk.cyan('Response Preview')
        ],
        colWidths: [12, 8, 12, 18, 45],
        wordWrap: true
    });

    results.forEach(r => {
        const statusText = r.status === 'OK' ? chalk.green('✓ OK') : chalk.red('✗ FAIL');
        const latencyText = `${r.latency}ms`;
        const tokensText = r.status === 'OK' ? `${r.tokensIn} / ${r.tokensOut}` : '-';
        const preview = r.status === 'OK' ? chalk.dim(r.preview + '...') : chalk.red(r.error?.substring(0, 40) || 'Unknown error');
        table.push([r.name, statusText, latencyText, tokensText, preview]);
    });

    console.log('\n' + chalk.cyan.bold('  Benchmark Report') + '\n');
    console.log(table.toString());

    // Winner summary
    const successes = results.filter(r => r.status === 'OK');
    if (successes.length > 0) {
        const fastest = successes.reduce((a, b) => a.latency < b.latency ? a : b);
        console.log(`\n  ${chalk.green('⚡ Fastest:')} ${chalk.bold(fastest.name)} at ${fastest.latency}ms`);
    }
    const failures = results.filter(r => r.status === 'FAIL');
    if (failures.length > 0) {
        console.log(`  ${chalk.red('✗ Failed:')}  ${failures.map(f => f.name).join(', ')}`);
    }
    console.log('');
}

async function handleHealth() {
    const data = getHealthData();
    const mapped = Object.keys(data).map(modelName => {
        const d = data[modelName];
        let cStatus = 'Online';
        if (d.failCount > d.successCount && d.failCount > 0) cStatus = 'Offline';
        else if (d.avgLatency > 1500) cStatus = 'Degraded';

        return {
            name: modelName,
            status: cStatus,
            avgLatency: d.avgLatency,
            successCount: d.successCount,
            failCount: d.failCount
        };
    });

    showModelComparison(mapped);
}

async function handleHistory() {
    if (state.history.length === 0) {
        showInfoBox('History is empty for this session.');
        return;
    }

    console.log(chalk.cyan.bold('\nSession History:'));
    state.history.forEach((h, i) => {
        console.log(`${chalk.gray(i + 1 + '.')} ${chalk.white(h.prompt)}`);
        console.log(chalk.dim(`   → [${h.model}] ${h.latency}ms\n`));
    });
}

async function handleCommand(input) {
    const cmd = input.trim().toLowerCase();

    switch (cmd) {
        case ':help':
            console.log(chalk.cyan.bold('\n  Available Commands:\n'));
            console.log(`  ${chalk.white(':help')}       ${chalk.dim('Show this help menu')}`);
            console.log(`  ${chalk.white(':model')}      ${chalk.dim('Switch primary AI model')}`);
            console.log(`  ${chalk.white(':auto')}       ${chalk.dim('Toggle auto-failover ON/OFF')}`);
            console.log(`  ${chalk.white(':debug')}      ${chalk.dim('Toggle debug mode ON/OFF')}`);
            console.log(`  ${chalk.white(':doctor')}     ${chalk.dim('Run connectivity diagnostics')}`);
            console.log(`  ${chalk.white(':benchmark')}  ${chalk.dim('Compare all models on same prompt')}`);
            console.log(`  ${chalk.white(':health')}     ${chalk.dim('Show model health statistics')}`);
            console.log(`  ${chalk.white(':history')}    ${chalk.dim('Show session prompt history')}`);
            console.log(`  ${chalk.white(':key')}        ${chalk.dim('Set your Prompt Forge API key')}`);
            console.log(`  ${chalk.white(':clear')}      ${chalk.dim('Clear the terminal')}`);
            console.log(`  ${chalk.white(':exit')}       ${chalk.dim('Exit Forge Studio')}`);
            console.log(chalk.dim('\n  Get your API key at:'));
            console.log(chalk.cyan('  https://prompt-forge-studio.vercel.app\n'));
            break;

        case ':exit':
            console.log(chalk.cyan('\nExiting Forge Studio. Goodbye!\n'));
            process.exit(0);
            break;

        case ':clear':
            console.clear();
            refreshStatusBar();
            break;

        case ':auto':
            state.autoFailover = !state.autoFailover;
            showInfoBox(`Auto-failover is now ${state.autoFailover ? 'ON' : 'OFF'}`);
            refreshStatusBar();
            break;

        case ':debug':
            state.debug = !state.debug;
            process.env.DEBUG = state.debug ? 'true' : 'false';
            showInfoBox(`Debug mode is now ${state.debug ? 'ON' : 'OFF'}`);
            refreshStatusBar();
            break;

        case ':model':
            const { selectedModel } = await inquirer.prompt([{
                type: 'list',
                name: 'selectedModel',
                message: 'Select a primary model:',
                choices: AVAILABLE_MODELS
            }]);
            state.model = selectedModel;
            refreshStatusBar();
            break;

        case ':doctor':
            await handleDoctor();
            refreshStatusBar();
            break;

        case ':benchmark':
            await handleBenchmark();
            refreshStatusBar();
            break;

        case ':health':
            await handleHealth();
            refreshStatusBar();
            break;

        case ':history':
            await handleHistory();
            refreshStatusBar();
            break;

        case ':key':
            const { key } = await inquirer.prompt([{
                type: 'password',
                name: 'key',
                message: `Enter new Prompt Forge API Key:`,
                mask: '*'
            }]);
            setAuth(key);
            showInfoBox(`API Key updated safely.`);
            break;

        default:
            if (cmd.startsWith(':')) {
                showErrorBox('Unknown Command', `Command ${cmd} not recognized. Type :exit to quit.`);
            } else {
                await processPrompt(input);
            }
    }
}

async function processPrompt(input) {
    const auth = await requireAuth();
    const spinner = ora(`Generating with ${chalk.cyan(state.model)}...`).start();

    try {
        const result = await generateWithFailover(input, state.model, state.autoFailover, auth.promptforge);
        spinner.stop();

        // Check if failover triggered
        if (result.metadata.model !== state.model) {
            showInfoBox(`Warning: Responded using Fallback Model: ${result.metadata.model}`);
        }

        formatAIResponse(result.text, result.metadata);

        // Update states
        state.status = 'Online';
        state.latency = result.metadata.latency;
        state.history.push({
            prompt: input,
            model: result.metadata.model,
            latency: result.metadata.latency
        });

    } catch (error) {
        spinner.stop();
        showErrorBox('Generation Failed', error.message || String(error));
        logger.error('Prompt processing failed', { error: error.message });

        state.status = 'Offline';
        state.latency = null;
    }

    refreshStatusBar();
}

async function studioLoop() {
    while (true) {
        const { promptInput } = await inquirer.prompt([
            {
                type: 'input',
                name: 'promptInput',
                message: chalk.magenta.bold('forge> '),
                prefix: ''
            }
        ]);

        if (!promptInput.trim()) continue;

        await handleCommand(promptInput);
    }
}

module.exports = {
    startStudio
};

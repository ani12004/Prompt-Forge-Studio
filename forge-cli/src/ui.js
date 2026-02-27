const figlet = require('figlet');
const gradient = require('gradient-string');
const boxen = require('boxen');
const chalk = require('chalk');
const Table = require('cli-table3');

function showBanner() {
    const bannerText = figlet.textSync('FORGE STUDIO', { font: 'Standard', horizontalLayout: 'fitted' });
    console.log(gradient.pastel.multiline(bannerText));
}

function showBottomStatusBar(model, status, latency, autoFailover, debugMode) {
    const statusColor = status === 'Online' ? chalk.green('Online')
        : status === 'Degraded' ? chalk.yellow('Degraded')
            : chalk.red(status);

    const autoText = autoFailover ? chalk.green('ON') : chalk.red('OFF');
    const debugText = debugMode ? chalk.green('ON') : chalk.gray('OFF');
    const latencyText = latency ? `${latency}ms` : '-';

    const bar = [
        chalk.cyan(`Model: ${model}`),
        `Status: ${statusColor}`,
        chalk.gray(`Latency: ${latencyText}`),
        chalk.gray(`Auto: ${autoText}`),
        chalk.gray(`Debug: ${debugText}`)
    ].join(chalk.dim(' | '));

    console.log('\n' + bar + '\n');
}

function showModelComparison(modelsInfo) {
    const table = new Table({
        head: [chalk.cyan('Provider'), chalk.cyan('Status'), chalk.cyan('Latency'), chalk.cyan('Success Count'), chalk.cyan('Fail Measure')],
        chars: {
            'top': '─', 'top-mid': '┬', 'top-left': '┌', 'top-right': '┐',
            'bottom': '─', 'bottom-mid': '┴', 'bottom-left': '└', 'bottom-right': '┘',
            'left': '│', 'left-mid': '├', 'mid': '─', 'mid-mid': '┼',
            'right': '│', 'right-mid': '┤', 'middle': '│'
        }
    });

    modelsInfo.forEach(info => {
        let statusColor, latencyDisplay;

        if (info.status === 'Active' || info.status === 'Online') {
            statusColor = chalk.green(info.status);
            latencyDisplay = info.avgLatency ? chalk.white(`${info.avgLatency}ms (avg)`) : '-';
        } else if (info.status === 'Degraded') {
            statusColor = chalk.yellow(info.status);
            latencyDisplay = info.avgLatency ? chalk.yellow(`${info.avgLatency}ms (avg)`) : '-';
        } else {
            statusColor = chalk.red(info.status);
            latencyDisplay = chalk.dim('-');
        }

        table.push([
            info.name,
            statusColor,
            latencyDisplay,
            chalk.green(info.successCount),
            chalk.red(info.failCount)
        ]);
    });

    console.log('\n' + table.toString() + '\n');
}

function formatAIResponse(text, metadata = {}) {
    const metaText = Object.keys(metadata).length > 0
        ? chalk.dim(`\n\n---\n[Model: ${metadata.model || 'unknown'} | Latency: ${metadata.latency || 0}ms]`)
        : '';

    const boxedResponse = boxen(chalk.white(text) + metaText, {
        padding: 1,
        margin: { top: 1, bottom: 1 },
        borderStyle: 'round',
        borderColor: 'cyan',
        title: chalk.cyan.bold(' AI Response '),
        titleAlignment: 'left'
    });

    console.log(boxedResponse);
}

function showErrorBox(title, message) {
    console.log(
        boxen(chalk.red(message), {
            padding: 1,
            margin: 1,
            borderStyle: 'double',
            borderColor: 'red',
            title: chalk.red.bold(` Error: ${title} `)
        })
    );
}

function showInfoBox(message) {
    console.log(
        boxen(chalk.white(message), {
            padding: 1,
            margin: 1,
            borderStyle: 'round',
            borderColor: 'blue'
        })
    );
}

module.exports = {
    showBanner,
    showBottomStatusBar,
    showModelComparison,
    formatAIResponse,
    showErrorBox,
    showInfoBox
};

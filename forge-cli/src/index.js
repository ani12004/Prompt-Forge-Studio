#!/usr/bin/env node

const { program } = require('commander');
const { initProject } = require('./init');
const { startStudio } = require('./studio');
const { showBanner } = require('./ui');
const fs = require('fs');
const path = require('path');
const pkg = require('../package.json');

program
    .name('forge')
    .description('Prompt Forge Studio - Professional Terminal-Native Prompt Engineering Studio')
    .version(pkg.version);

// Command: init
program
    .command('init [project]')
    .description('Initialize a new Forge project')
    .action((project) => {
        initProject(project || 'prompt-forge-project');
    });

// Command: pull
program
    .command('pull <identifier>')
    .description('Pull a prompt from the registry (e.g., user/slug)')
    .action((identifier) => {
        const { pullPrompt } = require('./registry');
        pullPrompt(identifier);
    });

// Command: push
program
    .command('push <file>')
    .description('Push a local prompt version to the registry')
    .action((file) => {
        const { pushPrompt } = require('./registry');
        pushPrompt(file);
    });

// Command: search
program
    .command('search <query>')
    .description('Search the global prompt registry')
    .action((query) => {
        const { searchRegistry } = require('./registry');
        searchRegistry(query);
    });

// Default behavior: Studio mode
program
    .action(() => {
        const isProjectDir = fs.existsSync(path.join(process.cwd(), 'forge.config.json'));

        showBanner();

        if (!isProjectDir) {
            console.log('\nWarning: Not inside a Forge project. Run `forge init <project>` to set one up.\n');
        }

        startStudio();
    });

program.parse(process.argv);

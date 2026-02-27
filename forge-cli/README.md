# Forge CLI Studio

Professional terminal-native Prompt Engineering and AI Model Evaluation Studio.

Powered by [Prompt Forge Studio](https://prompt-forge-studio.vercel.app).

## Installation

```bash
npm install -g prompt-forge-ai-cli
```

## Quick Start

```bash
# Initialize a new project
forge init my-project
cd my-project

# Launch studio mode
forge
```

On first launch you will be asked for your **Prompt Forge API Key**.
Get yours at: [https://prompt-forge-studio.vercel.app](https://prompt-forge-studio.vercel.app)

## Studio Commands

| Command | Description |
|-------------|--------------------------------------|
| `:help` | Show all available commands |
| `:model` | Switch primary AI model |
| `:auto` | Toggle auto-failover ON/OFF |
| `:debug` | Toggle debug mode ON/OFF |
| `:doctor` | Run connectivity diagnostics |
| `:benchmark`| Compare all models on same prompt |
| `:health` | Show model health statistics |
| `:history` | Show session prompt history |
| `:key` | Set your Prompt Forge API key |
| `:clear` | Clear the terminal |
| `:exit` | Exit Forge Studio |

## Features

- **Intelligent Failover** — auto-retries with exponential backoff, cascades to backup model
- **Multi-Model Support** — NVIDIA and Google Gemini via Prompt Forge proxy
- **Debug Mode** — view HTTP status, latency, tokens, raw errors in real-time
- **Health Tracking** — persistent stats in `~/.forge/health.json`
- **Structured Logging** — JSON logs with rotation at `~/.forge/logs.json`
- **Benchmark** — side-by-side model comparison with latency and token report
- **Doctor** — one-command connectivity diagnostics

## Architecture

```
src/
├── index.js              # CLI entrypoint
├── studio.js             # Interactive REPL shell
├── ui.js                 # Terminal UI components
├── auth.js               # API key management
├── config.js             # Project config loader
├── init.js               # Project scaffolding
├── core/
│   ├── logger.js         # Structured JSON logging
│   ├── health-tracker.js # Provider health tracking
│   └── failover.js       # Retry + failover engine
└── models/
    ├── gemini.js          # Gemini model driver
    └── nvidia.js          # NVIDIA model driver
```

## Requirements

- Node.js >= 18.0.0

## License

ISC

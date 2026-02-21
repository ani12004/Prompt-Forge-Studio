# promptforge-server-sdk

[![npm version](https://img.shields.io/npm/v/promptforge-server-sdk.svg)](https://www.npmjs.com/package/promptforge-server-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Official Node.js / Edge SDK for Prompt Forge Studio API.

## Full Documentation

For a complete guide on how to use this SDK and the REST API, please refer to the [Documentation Page](https://promptforge.com/docs).

## Quick Start

### Installation

```sh
npm install promptforge-server-sdk
```

### Usage

```ts
import { PromptForgeClient } from 'promptforge-server-sdk';

const client = new PromptForgeClient({
  apiKey: 'pf_...', // process.env.PROMPTFORGE_API_KEY
});

const response = await client.execute({
  versionId: '123e4567-e89b-12d3-a456-426614174000',
  variables: { user_name: 'Alice' }
});

console.log(response.data);
```

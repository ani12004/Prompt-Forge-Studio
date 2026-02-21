# @promptforge/sdk

Official Node.js / Edge SDK for Prompt Forge Studio API.

## Installation

```sh
npm install @promptforge/sdk
```

## Usage

```ts
import { PromptForgeClient } from '@promptforge/sdk';

const client = new PromptForgeClient({
  apiKey: 'pf_...', // process.env.PROMPTFORGE_API_KEY
});

const response = await client.execute({
  versionId: '123e4567-e89b-12d3-a456-426614174000',
  variables: { user_name: 'Alice' }
});

console.log(response.data);
```

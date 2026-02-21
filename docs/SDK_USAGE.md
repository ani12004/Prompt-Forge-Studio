# PromptForge SDK & API Usage Guide

PromptForge Studio V2 is a "Prompt-as-a-Service" platform. This guide explains how to integrate your saved prompts into your own applications using either our Node.js SDK or our standard REST API.

---

## 1. Prerequisites

Before you can execute prompts programmatically, you must:

1.  **Generate an API Key**: Go to the **Settings** sidebar in PromptForge Studio and generate a new API Key.
2.  **Save a Prompt**: Create and save a prompt in the **Studio**. Note the **Version ID** generated after saving.

---

## 2. Using the Node.js / TypeScript SDK

The easiest way to integrate PromptForge into your Node.js or Edge environment (Vercel, Cloudflare, etc.) is using the `promptforge-server-sdk`.

### Installation

```bash
npm install promptforge-server-sdk
```

### Basic Usage

Initialize the client with your API key and execute a prompt by its `version_id`.

```typescript
import { PromptForgeClient } from 'promptforge-server-sdk';

const pf = new PromptForgeClient({
  apiKey: 'pf_live_...', // Your API Key from Settings
});

async function main() {
  const response = await pf.execute({
    versionId: 'your-saved-version-id', // Found in Studio history
    variables: {
      user_query: "How do I bake a cake?",
      tone: "friendly"
    }
  });

  if (response.success) {
    console.log("LLM Response:", response.data);
    console.log("Model Used:", response.meta.model);
    console.log("Latency (ms):", response.meta.latencyMs);
  } else {
    console.error("Error:", response.message);
  }
}

main();
```

---

## 3. Using the REST API

If you are using a language other than JavaScript, you can call our REST API directly.

### Authentication
All requests must include your API Key in the headers.

**Header Name**: `X-API-Key`  
**Header Value**: `pf_live_your_key_here`

### Execute Prompt

**Endpoint**: `POST /api/v1/execute`

**Request Body**:
```json
{
  "version_id": "YOUR_VERSION_ID",
  "variables": {
    "key1": "value1",
    "key2": "value2"
  }
}
```

**Example Curl Request**:

```bash
curl -X POST https://your-promptforge-domain.com/api/v1/execute \
  -H "X-API-Key: pf_live_..." \
  -H "Content-Type: application/json" \
  -d '{
    "version_id": "123e4567-e89b-12d3-a456-426614174000",
    "variables": { "name": "DeepMind" }
  }'
```

**Response Format**:
```json
{
  "success": true,
  "data": {
    "output": "The response from the LLM...",
    "modelUsed": "gemini-2.0-flash",
    "cached": false
  }
}
```

---

## 4. Features

### Dynamic Variable Injection
Any text wrapped in double curly braces `{{variable_name}}` in your Studio prompt will automatically be replaced by the values you pass in the `variables` object.

### Cascading Model Routing
PromptForge automatically routes your requests to the best-performing model based on the complexity and length of your prompt.

### Semantic Caching (Enterprise Only)
If enabled, PromptForge will check if a semantically similar request has been made recently. If a 98% match is found, the cached result is returned instantly, saving you LLM costs and reducing latency to <50ms.

---

## 6. SDK vs API: When to Use?

| Feature | Node.js SDK | REST API |
| :--- | :--- | :--- |
| **Language** | JavaScript/TypeScript | Any (Python, Go, etc.) |
| **TypeScript** | Native Support | Manual Types |
| **Caching** | Built-in | Manual |
| **Ease of Use** | High (Method calls) | Moderate (HTTP requests) |
| **Best For** | Next.js, Node, Vercel | Python, PHP, Microservices |

---

## 7. Best Practices (Do's & Don'ts)

### ✅ The Do's
- **Use Environment Variables**: Always store your API keys in `.env` files (e.g. `PROMPTFORGE_API_KEY`).
- **Check Success Flag**: Always verify `result.success` before attempting to access `result.data`.
- **Use TypeScript**: If using the SDK, take advantage of our internal types for better IDE autocompletion.
- **Implement Singletons**: In serverless environments, initialize the `PromptForgeClient` once and reuse it to optimize memory.

### ❌ The Don'ts
- **Never Call from Client-Side**: Do not call the SDK or API from the browser. Your API keys will be exposed to users in the Network tab.
- **Don't Hardcode Prompts**: Keep your prompt logic in **PromptForge Studio** and reference them by **Version ID**. This allows you to update prompts without redeploying code.
- **Don't Ignore Metadata**: Fields like `meta.latency_ms` and `meta.tokens_input` are vital for monitoring performance and costs.

---

## 8. Troubleshooting

- **401 Unauthorized**: Ensure your `X-API-Key` is correct and active.
- **404 Version Not Found**: Ensure the `version_id` exists in your workspace.
- **500 Internal Error**: This usually indicates an issue with the underlying LLM provider or a rate limit being hit. Check your PromptForge dashboard for detailed logs.

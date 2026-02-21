"use client"

import React from "react"
import { Package, Server, Zap, ExternalLink } from "lucide-react"
import { CodeBlock } from "./DocumentationLayout"

export function SDKDocumentationContent() {
    return (
        <div className="space-y-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Node.js SDK</h1>
                <p className="text-gray-400 text-lg">
                    High-performance integration for Node.js and Edge environments.
                </p>
            </div>

            {/* SDK Installation */}
            <section id="sdk-install" className="scroll-mt-32 space-y-6">
                <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                    <Package className="h-8 w-8 text-blue-500" />
                    Installation
                </h2>
                <p className="text-gray-400 text-lg">
                    The PromptForge Server SDK is the fastest way to integrate with our engine. It handles token caching, retries, and high-performance routing out of the box.
                </p>
                <div className="p-6 bg-[#0F0F12] border border-white/10 rounded-2xl font-mono text-lg text-blue-400 group relative overflow-hidden">
                    <div className="absolute inset-y-0 left-0 w-1 bg-blue-500" />
                    npm install promptforge-server-sdk
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-4">
                    <a
                        href="https://www.npmjs.com/package/promptforge-server-sdk"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors"
                    >
                        View on npm Registry <ExternalLink className="h-3 w-3" />
                    </a>
                </div>
            </section>

            {/* SDK Initialization */}
            <section id="sdk-usage" className="scroll-mt-32 space-y-6">
                <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                    <Server className="h-8 w-8 text-emerald-500" />
                    Initialization
                </h2>
                <CodeBlock
                    code={`import { PromptForgeClient } from 'promptforge-server-sdk';

// Initialize with your secret API key
const pf = new PromptForgeClient({
  apiKey: process.env.PROMPTFORGE_API_KEY,
  timeoutMs: 30000, // Optional 30s timeout
});`}
                />
            </section>

            {/* SDK Execution */}
            <section id="sdk-execute" className="scroll-mt-32 space-y-6">
                <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                    <Zap className="h-8 w-8 text-amber-500" />
                    Executing Prompts
                </h2>
                <p className="text-gray-400">
                    The <code className="text-brand-purple">execute</code> method is your primary interface. It accepts a version ID and dynamic variables.
                </p>
                <CodeBlock
                    code={`async function runPrompt() {
  const result = await pf.execute({
    versionId: 'c123-abc-456', // Unique prompt version ID
    variables: {
      topic: 'Quantum Computing',
      difficulty: 'Expert'
    }
  });

  if (result.success) {
    console.log(result.data); // The generated response
    console.log(\`Latency: \${result.meta.latencyMs}ms\`);
  }
}`}
                />
            </section>

            {/* Types */}
            <section id="sdk-types" className="scroll-mt-32 space-y-6">
                <h2 className="text-3xl font-bold text-white tracking-tight">Return Types</h2>
                <CodeBlock
                    language="typescript"
                    code={`interface PromptResponse {
  success: boolean;
  data: string;
  meta: {
    model: string;
    latencyMs: number;
    cached: boolean;
    tokens?: {
      input: number;
      output: number;
    }
  }
}`}
                />
            </section>
        </div>
    )
}

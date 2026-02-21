"use client"

import React from "react"
import { Terminal, Shield, Globe } from "lucide-react"
import { CodeBlock, ParamItem } from "./DocumentationLayout"

export function APIDocumentationContent() {
    return (
        <div className="space-y-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">REST API Reference</h1>
                <p className="text-gray-400 text-lg">
                    A language-agnostic interface for executing prompts at scale.
                </p>
            </div>

            {/* API Authentication */}
            <section id="api-auth" className="scroll-mt-32 space-y-6">
                <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                    <Shield className="h-8 w-8 text-red-500" />
                    Authentication
                </h2>
                <p className="text-gray-400 text-lg">
                    Pass your API key in the custom <code className="text-brand-purple">x-api-key</code> header for all REST requests.
                </p>
                <div className="p-6 bg-[#0F0F12] border border-white/10 rounded-2xl font-mono text-sm text-gray-300">
                    <span className="text-gray-500">GET /v1/ping</span>
                    <br />
                    x-api-key: pf_live_9283...
                </div>
            </section>

            {/* API Endpoint */}
            <section id="api-endpoint" className="scroll-mt-32 space-y-6">
                <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                    <Globe className="h-8 w-8 text-blue-400" />
                    Main Execution Endpoint
                </h2>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                    <span className="px-3 py-1 rounded bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold">POST</span>
                    <code className="text-white font-mono text-lg">/api/v1/execute</code>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Required Body</h4>
                        <ul className="space-y-3">
                            <ParamItem name="version_id" type="UUID" required description="ID found in Studio History." />
                            <ParamItem name="variables" type="Map" description="Dynamic template values." />
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Optional Meta</h4>
                        <ul className="space-y-3">
                            <ParamItem name="ab_version_id" type="UUID" description="For A/B experiment routing." />
                        </ul>
                    </div>
                </div>
            </section>

            {/* API Response Example */}
            <section id="api-response" className="scroll-mt-32 space-y-6">
                <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                    <Terminal className="h-8 w-8 text-amber-500" />
                    Response Format
                </h2>
                <CodeBlock
                    language="json"
                    code={`{
  "success": true,
  "data": "The LLM output text goes here...",
  "meta": {
    "model": "gemini-2.0-flash",
    "cached": false,
    "latency_ms": 1240,
    "tokens_input": 45,
    "tokens_output": 112
  }
}`}
                />
            </section>
        </div>
    )
}

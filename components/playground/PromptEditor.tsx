"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface PromptEditorProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export function PromptEditor({ value, onChange, disabled }: PromptEditorProps) {
    return (
        <div className="relative h-full flex flex-col font-mono text-sm bg-[#0A0A0A] rounded-xl border border-white/10 overflow-hidden group focus-within:border-brand-purple/50 transition-colors">
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/[0.02]">
                <span className="text-gray-500 text-xs uppercase tracking-wider font-bold">Input</span>
                <span className="text-xs text-gray-600">{value.length} chars</span>
            </div>
            <textarea
                className="flex-1 w-full h-full bg-transparent p-4 resize-none focus:outline-none text-gray-300 placeholder:text-gray-700 leading-relaxed"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Type your prompt here..."
                spellCheck={false}
                disabled={disabled}
            />
            {/* Corner Accent */}
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-brand-purple/10 rounded-tl-xl pointer-events-none" />
        </div>
    )
}

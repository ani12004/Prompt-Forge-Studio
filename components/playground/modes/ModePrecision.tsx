"use client"

import React, { useState } from "react"
import { PrecisionChallenge } from "../types"
import { PromptEditor } from "../PromptEditor"
import { Button } from "@/components/ui/Button"
import { Check, X, Crosshair } from "lucide-react"

interface ModePrecisionProps {
    challenge: PrecisionChallenge;
    onComplete: (xp: number) => void;
}

export function ModePrecision({ challenge, onComplete }: ModePrecisionProps) {
    const [prompt, setPrompt] = useState("")
    const [report, setReport] = useState<boolean[] | null>(null)

    const checkConstraints = () => {
        const results = challenge.constraints.map(c => {
            if (c.type === 'length') {
                const words = prompt.trim().split(/\s+/).length
                return words === c.value || (typeof c.value === 'number' && words <= c.value) // Simplified check
            }
            if (c.type === 'contains') return prompt.includes(String(c.value))
            if (c.type === 'not_contains') return !prompt.includes(String(c.value))
            if (c.type === 'regex') return new RegExp(String(c.value)).test(prompt)
            return false
        })

        setReport(results)

        if (results.every(r => r)) {
            // Success
            onComplete(challenge.xpReward)
        }
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px]">
            {/* Left: Input */}
            <div className="flex flex-col gap-4">
                <div className="glass-panel p-6 rounded-2xl border border-white/10 flex-1 flex flex-col">
                    <div className="mb-4">
                        <h3 className="font-bold text-white mb-1">Strict Requirements</h3>
                        <p className="text-gray-400 text-sm">{challenge.task}</p>
                    </div>

                    <div className="flex-1 mb-4">
                        <PromptEditor value={prompt} onChange={setPrompt} />
                    </div>

                    <Button onClick={checkConstraints} className="bg-brand-purple w-full">
                        <Crosshair className="h-4 w-4 mr-2" />
                        Verify Output
                    </Button>
                </div>
            </div>

            {/* Right: Constraint Checklist */}
            <div className="glass-panel p-8 rounded-2xl border border-white/10 bg-[#0F0F12]">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6">Constraint Checklist</h3>

                <div className="space-y-4">
                    {challenge.constraints.map((c, i) => {
                        const isPass = report ? report[i] : null;
                        return (
                            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                <span className="text-gray-300 font-mono text-sm">{c.message}</span>
                                {isPass === true && <Check className="h-5 w-5 text-green-500" />}
                                {isPass === false && <X className="h-5 w-5 text-red-500" />}
                                {isPass === null && <div className="h-2 w-2 rounded-full bg-gray-700" />}
                            </div>
                        )
                    })}
                </div>

                {report && report.every(r => r) && (
                    <div className="mt-8 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-center animate-in zoom-in">
                        <h4 className="text-green-400 font-bold mb-1">Perfect Precision!</h4>
                        <p className="text-green-500/70 text-sm">All constraints satisfied.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

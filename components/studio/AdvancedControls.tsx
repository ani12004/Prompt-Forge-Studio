"use client"

import React from "react"
import { Slider } from "@/components/ui/Slider"
import { motion } from "framer-motion"
import { Info } from "lucide-react"

export interface GranularOptions {
    temperature: number
    topP: number
    topK: number
}

interface AdvancedControlsProps {
    options: GranularOptions
    onChange: (options: GranularOptions) => void
}

export function AdvancedControls({ options, onChange }: AdvancedControlsProps) {
    const handleChange = (key: keyof GranularOptions, value: number) => {
        onChange({ ...options, [key]: value })
    }

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[#0F0F0F] border-t border-white/5 p-6 rounded-b-xl space-y-6"
        >
            <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Granular Configuration</h3>
                <div className="group relative">
                    <Info className="h-3 w-3 text-gray-500 cursor-help" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-black border border-white/10 rounded-lg text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                        Adjusting these values controls the creativity (Temperature), diversity (Top-P), and probability filtering (Top-K) of the AI model.
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Temperature */}
                <div className="space-y-3">
                    <Slider
                        label="Temperature"
                        value={options.temperature}
                        min={0}
                        max={1}
                        step={0.1}
                        valueDisplay={options.temperature}
                        onChange={(e) => handleChange("temperature", parseFloat(e.target.value))}
                    />
                    <p className="text-[10px] text-gray-500 leading-tight">
                        Controls randomness. Higher values (0.8+) make output more random/creative. Lower values (0.2) make it more focused/deterministic.
                    </p>
                </div>

                {/* Top P */}
                <div className="space-y-3">
                    <Slider
                        label="Top P"
                        value={options.topP}
                        min={0}
                        max={1}
                        step={0.05}
                        valueDisplay={options.topP}
                        onChange={(e) => handleChange("topP", parseFloat(e.target.value))}
                    />
                    <p className="text-[10px] text-gray-500 leading-tight">
                        Nucleus sampling. Limits user pool to top P probability mass. 0.95 is standard for balanced generation.
                    </p>
                </div>

                {/* Top K */}
                <div className="space-y-3">
                    <Slider
                        label="Top K"
                        value={options.topK}
                        min={1}
                        max={100}
                        step={1}
                        valueDisplay={options.topK}
                        onChange={(e) => handleChange("topK", parseInt(e.target.value))}
                    />
                    <p className="text-[10px] text-gray-500 leading-tight">
                        Limits the next token selection to the top K most likely tokens. Lower values reduce risk of hallucinations.
                    </p>
                </div>
            </div>
        </motion.div>
    )
}

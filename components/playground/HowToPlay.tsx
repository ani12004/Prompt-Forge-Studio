"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Target, Zap, Swords, Hammer, ArrowRight } from "lucide-react"

interface HowToPlayProps {
    mode: 'fixer' | 'builder' | 'battle' | 'precision';
    onClose: () => void;
}

const INSTRUCTIONS = {
    fixer: {
        title: "Prompt Fixer",
        icon: Zap,
        steps: [
            { title: "Analyze", desc: "Read the 'Broken Prompt' and identify what's missing (context, constraints, or clarity)." },
            { title: "Repair", desc: "Rewrite the prompt to meet the hidden success criteria." },
            { title: "Verify", desc: "Submit your fix. The AI will judge if it meets the requirements." },
        ]
    },
    builder: {
        title: "Prompt Builder",
        icon: Hammer,
        steps: [
            { title: "Construct", desc: "Follow the guided steps to build a robust prompt from scratch." },
            { title: "Iterate", desc: "Each step adds a layer of depth: Persona, Task, Context, and Constraints." },
            { title: "Master", desc: "Learn the structural patterns of expert prompt engineers." },
        ]
    },
    battle: {
        title: "Prompt Battle",
        icon: Swords,
        steps: [
            { title: "Compare", desc: "Review two distinct prompts (A & B) for the same scenario." },
            { title: "Predict", desc: "Uses your intuition to guess which one produces higher quality output." },
            { title: "Learn", desc: "See the AI's evaluation and understand why one iteration won." },
        ]
    },
    precision: {
        title: "Accuracy Challenge",
        icon: Target,
        steps: [
            { title: "Target", desc: "You are given a specific output goal and strict constraints." },
            { title: "Refine", desc: "Write a prompt that forces the AI to adhere to these constraints exactly." },
            { title: "Score", desc: "100% accuracy is required. No hallucinations allowed." },
        ]
    }
}

export function HowToPlay({ mode, onClose }: HowToPlayProps) {
    const content = INSTRUCTIONS[mode]
    const Icon = content.icon

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-2xl bg-[#0F0F0F] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-purple via-blue-500 to-brand-purple opacity-50" />

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="p-8">
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-xl bg-brand-purple/10 flex items-center justify-center border border-brand-purple/20">
                                <Icon className="w-6 h-6 text-brand-purple" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">How to Play: {content.title}</h2>
                                <p className="text-sm text-gray-400">Master the mechanics to earn XP & Badges</p>
                            </div>
                        </div>

                        {/* Steps */}
                        <div className="grid md:grid-cols-3 gap-4 mb-8">
                            {content.steps.map((step, i) => (
                                <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5 relative group hover:border-brand-purple/30 transition-colors">
                                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#0F0F0F] border border-white/10 rounded-full flex items-center justify-center text-xs font-bold text-gray-500 group-hover:text-brand-purple group-hover:border-brand-purple/50 transition-colors">
                                        {i + 1}
                                    </div>
                                    <h3 className="font-bold text-white mb-2">{step.title}</h3>
                                    <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="bg-gradient-to-r from-brand-purple/10 to-transparent p-4 rounded-xl flex items-center gap-3 border border-brand-purple/20">
                            <div className="w-8 h-8 rounded-full bg-brand-purple/20 flex items-center justify-center shrink-0">
                                <Target className="w-4 h-4 text-brand-purple" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-white font-medium">Pro Tip</p>
                                <p className="text-xs text-gray-400">Complete challenges without hints to earn the "Precision Engineer" badge.</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-brand-purple hover:bg-brand-purple/90 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2"
                            >
                                START PLAYING <ArrowRight className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}

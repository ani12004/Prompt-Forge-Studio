"use client"

import React from "react"
import { ArrowLeft, Trophy, Star } from "lucide-react"
import { motion } from "framer-motion"

interface GameShellProps {
    title: string;
    description: string;
    xp: number;
    level: number;
    onBack: () => void;
    onHowToPlay: () => void;
    children: React.ReactNode;
}

export function GameShell({ title, description, xp, level, onBack, onHowToPlay, children }: GameShellProps) {
    const xpForNextLevel = level * 1000;
    const xpProgress = (xp % 1000) / 10; // Simple % calculation

    return (
        <div className="min-h-screen flex flex-col pt-24 px-4 md:px-8 pb-8">
            <header className="max-w-7xl mx-auto w-full mb-8 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <button
                        onClick={onBack}
                        className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors text-gray-400 hover:text-white"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-1">{title}</h1>
                        <p className="text-sm text-gray-400">{description}</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <button
                        onClick={onHowToPlay}
                        className="text-xs font-bold text-gray-400 hover:text-white transition-colors border border-white/10 hover:bg-white/5 px-3 py-1.5 rounded-lg flex items-center gap-2"
                    >
                        <span className="w-4 h-4 rounded-full border border-gray-500 flex items-center justify-center text-[10px] font-mono">?</span>
                        HOW TO PLAY
                    </button>

                    <div className="h-8 w-px bg-white/5" />

                    <div className="text-right">
                        <div className="text-xs font-medium text-brand-purple uppercase tracking-wider mb-1">Level {level}</div>
                        <div className="w-48 h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${xpProgress}%` }}
                                className="h-full bg-brand-purple"
                            />
                        </div>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                        <Trophy className="h-6 w-6 text-amber-500" />
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto w-full flex-1">
                {children}
            </main>
        </div>
    )
}

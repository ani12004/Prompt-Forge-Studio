"use client"

import React from "react"
import { GameMode } from "./types"
import { Trophy, Wrench, Hammer, Swords, Crosshair, Crown } from "lucide-react"

interface PlaygroundLandingProps {
    onSelectMode: (mode: GameMode) => void;
    userLevel: number;
    userXp: number;
}

export function PlaygroundLanding({ onSelectMode, userLevel, userXp }: PlaygroundLandingProps) {
    const modes = [
        {
            id: 'fixer',
            title: 'Prompt Fixer',
            description: 'Debug and repair broken prompts. Learn to identify vagueness and missing constraints.',
            icon: Wrench,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20'
        },
        {
            id: 'builder',
            title: 'Prompt Builder',
            description: 'Construct robust prompts step-by-step using industry-standard templates.',
            icon: Hammer,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/20'
        },
        {
            id: 'battle',
            title: 'Prompt Battle',
            description: 'Compare two prompts and bet on the winner. Develop intuition for model behavior.',
            icon: Swords,
            color: 'text-red-400',
            bg: 'bg-red-500/10',
            border: 'border-red-500/20'
        },
        {
            id: 'precision',
            title: 'Accuracy Challenge',
            description: 'Write prompts that adhere to strict constraints. Master control and output formatting.',
            icon: Crosshair,
            color: 'text-green-400',
            bg: 'bg-green-500/10',
            border: 'border-green-500/20'
        }
    ]

    return (
        <div className="max-w-6xl mx-auto py-12 px-6">
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-purple/10 border border-brand-purple/20 mb-6">
                    <Crown className="h-4 w-4 text-brand-purple" />
                    <span className="text-sm font-medium text-brand-purple">Level {userLevel} Prompt Engineer</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                    Master the Art of <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-blue-500">Prompt Engineering</span>
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                    Choose a training module below to start earning XP and unlocking advanced techniques.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {modes.map((mode) => (
                    <button
                        key={mode.id}
                        onClick={() => onSelectMode(mode.id as GameMode)}
                        className={`group relative p-8 rounded-3xl border ${mode.border} ${mode.bg} hover:bg-opacity-20 transition-all text-left overflow-hidden`}
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <mode.icon className="h-32 w-32" />
                        </div>

                        <div className="relative z-10">
                            <div className={`h-12 w-12 rounded-xl ${mode.bg} border ${mode.border} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                <mode.icon className={`h-6 w-6 ${mode.color}`} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">{mode.title}</h3>
                            <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                                {mode.description}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}

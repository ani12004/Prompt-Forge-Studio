"use client"

import React, { useState } from "react"
import { CHALLENGES } from "./data/challenges"
import { GameMode, Challenge } from "./types"
import { PlaygroundLanding } from "./PlaygroundLanding"
import { GameShell } from "./GameShell"
import { ModeFixer } from "./modes/ModeFixer"
import { ModeBuilder } from "./modes/ModeBuilder"
import { ModeBattle } from "./modes/ModeBattle"
import { ModePrecision } from "./modes/ModePrecision"


export function PlaygroundClient() {
    // Game State
    const [mode, setMode] = useState<GameMode | null>(null)
    const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null)
    const [xp, setXp] = useState(0)

    const userLevel = Math.floor(xp / 1000) + 1

    // Get challenges for active mode
    const modeChallenges = mode ? CHALLENGES.filter(c => c.mode === mode) : []
    const activeChallenge = activeChallengeId ? CHALLENGES.find(c => c.id === activeChallengeId) : null

    // Handlers
    const handleSelectMode = (m: GameMode) => {
        setMode(m)
        // Auto-select first challenge or next incomplete one
        const first = CHALLENGES.find(c => c.mode === m)
        if (first) setActiveChallengeId(first.id)
    }

    const handleComplete = (reward: number) => {
        setXp(prev => prev + reward)
        // Logic to move to next challenge could go here
        // For now, simple alert or toast
        // alert(`Challenge Complete! +${reward} XP`)
    }

    const handleBack = () => {
        setMode(null)
        setActiveChallengeId(null)
    }

    // Render Landing
    if (!mode || !activeChallenge) {
        return (
            <div className="min-h-screen bg-[#020204] pt-24 pb-12">
                <PlaygroundLanding
                    onSelectMode={handleSelectMode}
                    userLevel={userLevel}
                    userXp={xp}
                />
            </div>
        )
    }

    // Render Game Shell
    return (
        <div className="bg-[#020204] min-h-screen">
            <GameShell
                title={activeChallenge.title}
                description={activeChallenge.description}
                xp={xp}
                level={userLevel}
                onBack={handleBack}
            >
                {mode === 'fixer' && <ModeFixer challenge={activeChallenge as any} onComplete={handleComplete} />}
                {mode === 'builder' && <ModeBuilder challenge={activeChallenge as any} onComplete={handleComplete} />}
                {mode === 'battle' && <ModeBattle challenge={activeChallenge as any} onComplete={handleComplete} />}
                {mode === 'precision' && <ModePrecision challenge={activeChallenge as any} onComplete={handleComplete} />}
            </GameShell>
        </div>
    )
}

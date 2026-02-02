"use client"

import React, { useState } from "react"
import { BattleChallenge } from "../types"
import { Button } from "@/components/ui/Button"
import { Trophy, XCircle, CheckCircle } from "lucide-react"

interface ModeBattleProps {
    challenge: BattleChallenge;
    onComplete: (xp: number) => void;
}

export function ModeBattle({ challenge, onComplete }: ModeBattleProps) {
    const [selected, setSelected] = useState<'A' | 'B' | null>(null)
    const [revealed, setRevealed] = useState(false)

    const handleSelect = (choice: 'A' | 'B') => {
        setSelected(choice)
        setRevealed(true)
    }

    const isCorrect = selected === challenge.winner

    return (
        <div className="h-[650px] flex flex-col">
            <div className="text-center mb-6">
                <span className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-400 mb-2">Scenario</span>
                <p className="text-xl text-white font-medium">"{challenge.scenario}"</p>
            </div>

            <div className="grid grid-cols-2 gap-6 flex-1">
                {/* Option A */}
                <div
                    onClick={() => !revealed && handleSelect('A')}
                    className={`
                        relative group rounded-2xl border p-6 cursor-pointer transition-all duration-300 flex flex-col
                        ${revealed && challenge.winner === 'A' ? 'border-green-500 bg-green-500/10' : ''}
                        ${revealed && challenge.winner !== 'A' && selected === 'A' ? 'border-red-500 bg-red-500/10' : ''}
                        ${!revealed ? 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-brand-purple/50' : ''}
                    `}
                >
                    <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white">A</div>
                    <div className="mt-8 text-lg text-gray-200 font-medium leading-relaxed font-mono">
                        "{challenge.promptA.text}"
                    </div>

                    {revealed && (
                        <div className="mt-auto pt-6 border-t border-white/5 animate-in fade-in slide-in-from-bottom-2">
                            <p className={`text-sm ${challenge.winner === 'A' ? 'text-green-400' : 'text-red-400'}`}>
                                {challenge.promptA.logic}
                            </p>
                        </div>
                    )}
                </div>

                {/* Option B */}
                <div
                    onClick={() => !revealed && handleSelect('B')}
                    className={`
                        relative group rounded-2xl border p-6 cursor-pointer transition-all duration-300 flex flex-col
                        ${revealed && challenge.winner === 'B' ? 'border-green-500 bg-green-500/10' : ''}
                        ${revealed && challenge.winner !== 'B' && selected === 'B' ? 'border-red-500 bg-red-500/10' : ''}
                        ${!revealed ? 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-brand-purple/50' : ''}
                    `}
                >
                    <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white">B</div>
                    <div className="mt-8 text-lg text-gray-200 font-medium leading-relaxed font-mono">
                        "{challenge.promptB.text}"
                    </div>

                    {revealed && (
                        <div className="mt-auto pt-6 border-t border-white/5 animate-in fade-in slide-in-from-bottom-2">
                            <p className={`text-sm ${challenge.winner === 'B' ? 'text-green-400' : 'text-red-400'}`}>
                                {challenge.promptB.logic}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Result Overlay */}
            {revealed && (
                <div className="fixed bottom-12 left-1/2 -translate-x-1/2 bg-[#18181b] border border-white/10 p-6 rounded-2xl shadow-2xl max-w-2xl w-full z-50 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-start gap-4">
                        <div className={`mt-1 p-2 rounded-full ${isCorrect ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                            {isCorrect ? <CheckCircle className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
                        </div>
                        <div className="flex-1">
                            <h3 className={`text-lg font-bold mb-1 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                                {isCorrect ? 'Correct! Good Eye.' : 'Not quite.'}
                            </h3>
                            <p className="text-gray-300 text-sm leading-relaxed mb-4">
                                {challenge.explanation}
                            </p>
                            <Button className="w-full bg-white text-black hover:bg-gray-200" onClick={() => onComplete(isCorrect ? challenge.xpReward : 10)}>
                                {isCorrect ? `Claim ${challenge.xpReward} XP` : 'Continue'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

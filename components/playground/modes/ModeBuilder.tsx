"use client"

import React, { useState } from "react"
import { BuilderChallenge } from "../types"
import { Button } from "@/components/ui/Button"
import { ArrowRight, Check, FileText } from "lucide-react"

interface ModeBuilderProps {
    challenge: BuilderChallenge;
    onComplete: (xp: number) => void;
}

export function ModeBuilder({ challenge, onComplete }: ModeBuilderProps) {
    const [stepData, setStepData] = useState<Record<string, string>>({})
    const [currentStep, setCurrentStep] = useState(0)

    const activeStep = challenge.steps[currentStep]
    const isLastStep = currentStep === challenge.steps.length - 1

    const handleNext = () => {
        if (isLastStep) {
            onComplete(challenge.xpReward)
        } else {
            setCurrentStep(prev => prev + 1)
        }
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[600px]">
            {/* Left: Inputs */}
            <div className="lg:col-span-7 flex flex-col gap-6">
                {/* Progress Stepper */}
                <div className="flex items-center gap-2 mb-4">
                    {challenge.steps.map((step, idx) => (
                        <div key={step.id} className={`flex-1 h-1 rounded-full transition-colors ${idx <= currentStep ? 'bg-brand-purple' : 'bg-white/10'}`} />
                    ))}
                </div>

                <div className="glass-panel p-8 rounded-2xl border border-white/10 flex-1 flex flex-col">
                    <div className="mb-6">
                        <span className="text-xs font-bold text-brand-purple uppercase tracking-wider">Step {currentStep + 1} of {challenge.steps.length}</span>
                        <h3 className="text-2xl font-bold text-white mt-1">{activeStep.label}</h3>
                        <p className="text-gray-400 mt-2">{activeStep.guidance}</p>
                    </div>

                    <textarea
                        className="flex-1 w-full bg-black/20 p-4 rounded-xl resize-none focus:outline-none focus:ring-1 focus:ring-brand-purple/50 border border-white/5 text-white placeholder:text-gray-700 leading-relaxed font-mono"
                        placeholder={activeStep.placeholder}
                        value={stepData[activeStep.id] || ''}
                        onChange={(e) => setStepData({ ...stepData, [activeStep.id]: e.target.value })}
                    />

                    <div className="mt-6 flex justify-end">
                        <Button
                            onClick={handleNext}
                            disabled={!stepData[activeStep.id]}
                            className="bg-brand-purple hover:bg-brand-purple/90"
                        >
                            {isLastStep ? "Complete Build" : "Next Step"}
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Right: Live Preview */}
            <div className="lg:col-span-5">
                <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-[#0F0F12] h-full flex flex-col">
                    <div className="flex items-center gap-2 mb-4 text-gray-400">
                        <FileText className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Prompt Preview</span>
                    </div>

                    <div className="flex-1 bg-black/30 rounded-xl p-4 font-mono text-sm text-gray-300 whitespace-pre-wrap border border-white/5 overflow-y-auto custom-scrollbar">
                        {challenge.steps.map(step => {
                            const val = stepData[step.id];
                            if (!val) return null;
                            return (
                                <div key={step.id} className="mb-4 animate-in fade-in slide-in-from-left-2">
                                    <span className="text-brand-purple/70 text-xs font-bold block mb-1">#{step.label.toUpperCase()}</span>
                                    {val}
                                </div>
                            )
                        })}
                        {Object.keys(stepData).length === 0 && (
                            <span className="text-gray-700 italic">Start typing to build your prompt...</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

"use client"
import { motion } from "framer-motion"
import { Sparkles, Brain, Code2, CheckCircle2 } from "lucide-react"

export function CognitiveStatus() {
    return (
        <div className="h-full flex flex-col items-center justify-center relative overflow-hidden bg-[#0A0A0A]">

            {/* Visual Pulse Center */}
            <div className="relative mb-8">
                <motion.div
                    className="absolute inset-0 bg-brand-purple/20 blur-xl rounded-full"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
                <div className="w-16 h-16 bg-[#0F0F0F] border border-white/10 rounded-2xl flex items-center justify-center relative z-10 shadow-2xl">
                    <Sparkles className="w-6 h-6 text-brand-purple animate-pulse" />
                </div>
            </div>

            {/* Processing Steps */}
            <div className="space-y-4 w-full max-w-xs relative z-10">
                <ProcessingStep label="Analyzing Intent & Goal..." delay={0} />
                <ProcessingStep label="Restructuring Logic Flow..." delay={0.8} />
                <ProcessingStep label="Refining Constraints & Tone..." delay={1.6} />
                <ProcessingStep label="Finalizing Engineered Output..." delay={2.4} />
            </div>

            {/* Background Data Stream (Visual decoration) */}
            <div className="absolute inset-0 pointer-events-none opacity-5">
                <div className="absolute top-0 left-10 w-[1px] h-full bg-gradient-to-b from-transparent via-white to-transparent" />
                <div className="absolute top-0 right-10 w-[1px] h-full bg-gradient-to-b from-transparent via-white to-transparent" />
            </div>
        </div>
    )
}

function ProcessingStep({ label, delay }: { label: string, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay, duration: 0.5 }}
            className="flex items-center gap-3"
        >
            <motion.div
                className="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center"
                initial={{ borderColor: "rgba(255,255,255,0.2)" }}
                animate={{
                    borderColor: ["rgba(255,255,255,0.2)", "#7C3AED", "#10B981"],
                    backgroundColor: ["transparent", "rgba(124, 58, 237, 0.2)", "rgba(16, 185, 129, 0.2)"]
                }}
                transition={{ delay: delay, duration: 1.5, times: [0, 0.3, 1] }}
            >
                <div className="w-1 h-1 bg-current rounded-full" />
            </motion.div>
            <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">{label}</span>
        </motion.div>
    )
}

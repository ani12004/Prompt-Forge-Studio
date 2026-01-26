"use client"
import { motion } from "framer-motion"

interface LiveAnalysisProps {
    score: number
}

export function LiveAnalysis({ score }: LiveAnalysisProps) {
    // Determine color based on score
    const getColor = (s: number) => {
        if (s < 30) return "bg-red-500"
        if (s < 70) return "bg-yellow-500"
        return "bg-brand-purple"
    }

    const label = score < 30 ? "WEAK" : score < 70 ? "DECENT" : "STRONG"

    return (
        <div className="flex flex-col gap-1 w-full max-w-[100px]">
            <div className="flex justify-between text-[10px] font-mono text-gray-600 uppercase tracking-wider">
                <span>Signal</span>
                <span>{label}</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    className={`h-full ${getColor(score)} shadow-[0_0_10px_currentColor]`}
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ type: "spring", stiffness: 100 }}
                />
            </div>
        </div>
    )
}

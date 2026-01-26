"use client"
import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface PricingToggleProps {
    isYearly: boolean
    onToggle: (checked: boolean) => void
}

export function PricingToggle({ isYearly, onToggle }: PricingToggleProps) {
    return (
        <div className="flex items-center justify-center gap-4">
            <span className={cn("text-sm font-medium transition-colors", !isYearly ? "text-white" : "text-gray-400")}>
                Monthly
            </span>
            <button
                onClick={() => onToggle(!isYearly)}
                className="relative h-8 w-14 rounded-full bg-white/10 p-1 transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-brand-purple cursor-pointer ring-offset-2 ring-offset-[#0A0A0A]"
                role="switch"
                aria-checked={isYearly}
            >
                <motion.div
                    className="h-6 w-6 rounded-full bg-brand-purple shadow-glow"
                    animate={{ x: isYearly ? 24 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
            </button>
            <span className={cn("text-sm font-medium transition-colors", isYearly ? "text-white" : "text-gray-400")}>
                Yearly <span className="ml-1 text-xs text-brand-purple font-bold">(-20%)</span>
            </span>
        </div>
    )
}

"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface SelectProps {
    options: string[] | { label: string; value: string }[]
    value: string
    onChange: (value: string) => void
    placeholder?: string
    className?: string
    label?: string
}

export function Select({ options, value, onChange, placeholder = "Select an option", className, label }: SelectProps) {
    const [isOpen, setIsOpen] = React.useState(false)
    const containerRef = React.useRef<HTMLDivElement>(null)

    const normalizedOptions = options.map(opt =>
        typeof opt === 'string' ? { label: opt, value: opt } : opt
    )

    const selectedOption = normalizedOptions.find(opt => opt.value === value)

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div className={cn("relative w-full", className)} ref={containerRef}>
            {label && (
                <label className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">
                    {label}
                </label>
            )}

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full h-14 px-6 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-left transition-all hover:bg-white/[0.05] hover:border-white/10 group focus:outline-none focus:border-brand-purple/50",
                    isOpen && "border-brand-purple/50 bg-white/[0.05]"
                )}
            >
                <span className={cn("text-base", !selectedOption && "text-gray-500")}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown className={cn(
                    "h-5 w-5 text-gray-500 transition-transform duration-300 group-hover:text-brand-purple",
                    isOpen && "rotate-180 text-brand-purple"
                )} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Overlay to detect clicks */}
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute z-50 w-full mt-3 p-2 rounded-2xl bg-[#0F0F0F] border border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden"
                        >
                            <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
                                {normalizedOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => {
                                            onChange(option.value)
                                            setIsOpen(false)
                                        }}
                                        className={cn(
                                            "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all group/item mb-1 last:mb-0",
                                            value === option.value
                                                ? "bg-brand-purple/20 text-brand-purple"
                                                : "text-gray-400 hover:bg-white/5 hover:text-white"
                                        )}
                                    >
                                        <span>{option.label}</span>
                                        {value === option.value && (
                                            <Check className="h-4 w-4" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

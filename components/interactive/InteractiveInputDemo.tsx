"use client"
import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, ArrowRight, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUser } from "@clerk/nextjs"
import { analyzePromptIntent } from "@/app/actions/analyze"

const GHOST_TEXTS = [
    "Write a python script to parse CSV...",
    "Generate a cyberpunk city description...",
    "Explain quantum entanglement to a 5-year-old...",
    "Design a marketing email for a SaaS product..."
]

export function InteractiveInputDemo() {
    const { isSignedIn } = useUser()
    const [text, setText] = React.useState("")
    const [placeholder, setPlaceholder] = React.useState("")
    const [ghostIndex, setGhostIndex] = React.useState(0)
    const [charIndex, setCharIndex] = React.useState(0)
    const [isDeleting, setIsDeleting] = React.useState(false)
    const [isAnalyzing, setIsAnalyzing] = React.useState(false)
    const [intent, setIntent] = React.useState<string | null>(null)

    // Typewriter effect
    React.useEffect(() => {
        if (text) return

        const currentFullText = GHOST_TEXTS[ghostIndex]
        let timeout: NodeJS.Timeout

        const type = () => {
            if (isDeleting) {
                setPlaceholder(currentFullText.substring(0, charIndex - 1))
                setCharIndex(prev => prev - 1)

                if (charIndex <= 0) {
                    setIsDeleting(false)
                    setGhostIndex((prev) => (prev + 1) % GHOST_TEXTS.length)
                    timeout = setTimeout(type, 500) // Pause before typing next
                } else {
                    timeout = setTimeout(type, 50) // Deleting speed
                }
            } else {
                setPlaceholder(currentFullText.substring(0, charIndex + 1))
                setCharIndex(prev => prev + 1)

                if (charIndex >= currentFullText.length) {
                    setIsDeleting(true)
                    timeout = setTimeout(type, 2000) // Pause at end of text
                } else {
                    timeout = setTimeout(type, 80) // Typing speed
                }
            }
        }

        timeout = setTimeout(type, 100)
        return () => clearTimeout(timeout)
    }, [text, charIndex, isDeleting, ghostIndex])

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value)
        setIntent(null)
        setIsAnalyzing(false)

        if (e.target.value.length > 10) {
            setIsAnalyzing(true)
            const timer = setTimeout(async () => {
                const result = await analyzePromptIntent(e.target.value)
                setIntent(result)
                setIsAnalyzing(false)
            }, 800)
            return () => clearTimeout(timer)
        } else {
            setIsAnalyzing(false)
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto mt-24 mb-16 relative z-20"> {/* Increased spacing */}
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-purple to-brand-violet rounded-2xl opacity-20 group-hover:opacity-40 blur transition duration-500" />
                <div className="relative bg-[#0A0A0A] border border-white/10 rounded-xl p-3 flex items-center shadow-2xl">

                    {/* Status Indicator */}
                    <div className="pl-4 pr-3 flex items-center justify-center min-w-[40px]">
                        {isAnalyzing ? (
                            <Loader2 className="h-5 w-5 text-brand-purple animate-spin" />
                        ) : intent ? (
                            <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                        ) : (
                            <Sparkles className="h-5 w-5 text-gray-500" />
                        )}
                    </div>

                    <div className="flex-1 relative h-12 flex items-center">
                        <input
                            type="text"
                            value={text}
                            onChange={handleInput}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    const target = isSignedIn ? "/studio" : "/signup"
                                    window.location.href = `${target}?prompt=${encodeURIComponent(text)}`
                                }
                            }}
                            className="w-full h-full bg-transparent border-none focus:border-none focus:ring-0 outline-none text-white placeholder-transparent text-lg font-medium pr-4"
                        />

                        {/* Custom Placeholder / Ghost Text */}
                        {!text && (
                            <div className="absolute inset-0 flex items-center text-gray-600 pointer-events-none text-lg">
                                <span>{placeholder}</span>
                                <span className="w-[2px] h-6 bg-brand-purple/50 animate-pulse ml-1" />
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => {
                            const target = isSignedIn ? "/studio" : "/signup"
                            window.location.href = `${target}?prompt=${encodeURIComponent(text)}`
                        }}
                        className="bg-white text-black p-2 rounded-lg hover:scale-105 active:scale-95 transition-all ml-2"
                    >
                        <ArrowRight className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Intent Badge */}
            <AnimatePresence>
                {intent && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute -bottom-12 left-4 text-xs font-medium text-brand-purple flex items-center gap-2 bg-brand-purple/10 px-3 py-1 rounded-full border border-brand-purple/20"
                    >
                        <Sparkles className="h-3 w-3" />
                        Detected Intent: {intent}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

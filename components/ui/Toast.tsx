"use client"
import { useEffect, useState } from "react"
import { CheckCircle2, XCircle } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

export type ToastType = "success" | "error"

interface ToastProps {
    message: string
    type: ToastType
    isVisible: boolean
    onClose: () => void
}

export function Toast({ message, type, isVisible, onClose }: ToastProps) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose()
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [isVisible, onClose])

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md border border-white/10 bg-[#1A1A1A]"
                >
                    {type === "success" ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className="text-white text-sm font-medium">{message}</span>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

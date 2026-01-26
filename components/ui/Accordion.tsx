"use client"
import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

interface AccordionItemProps {
    title: string
    children: React.ReactNode
    defaultOpen?: boolean
}

export function AccordionItem({ title, children, defaultOpen = false }: AccordionItemProps) {
    const [isOpen, setIsOpen] = React.useState(defaultOpen)

    return (
        <div className="border-b border-white/10 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between py-4 text-left text-lg font-bold text-white transition-colors hover:text-brand-purple focus:outline-none focus-visible:text-brand-purple group"
                aria-expanded={isOpen}
            >
                <span className="group-hover:translate-x-1 transition-transform duration-200">{title}</span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-gray-500 group-hover:text-brand-purple"
                >
                    <ChevronDown className="h-5 w-5" />
                </motion.div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="pb-6 text-gray-400 leading-relaxed pl-2 border-l-2 border-brand-purple/20 ml-1">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export function Accordion({ items }: { items: { title: string, content: React.ReactNode }[] }) {
    return (
        <div className="w-full max-w-3xl mx-auto flex flex-col">
            {items.map((item, i) => (
                <AccordionItem key={i} title={item.title}>{item.content}</AccordionItem>
            ))}
        </div>
    )
}

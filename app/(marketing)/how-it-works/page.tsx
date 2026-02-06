"use client"

import React, { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import {
    Cpu,
    Zap,
    FlaskConical,
    Rocket,
    ArrowRight,
    CheckCircle2,
    Sparkles
} from "lucide-react"
import Link from "next/link"

export default function HowItWorksPage() {
    return (
        <div className="min-h-screen bg-[#020204] font-sans text-slate-300 selection:bg-brand-purple/30 pb-32 overflow-hidden">

            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'url("/noise.png")' }}></div>
            <div className="fixed top-0 left-0 w-full h-[500px] bg-brand-purple/10 blur-[120px] pointer-events-none" />

            {/* Hero Section */}
            <section className="pt-40 pb-20 px-6 container mx-auto max-w-5xl text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-brand-purple mb-6">
                        <Sparkles className="h-3 w-3" />
                        <span>Workflow Guide</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-medium text-white mb-6 tracking-tight leading-tight">
                        From Vague Idea to <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-violet to-brand-purple">Production Prompt</span>
                    </h1>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        PromptForge isn't just a text editor. It's a structured environment for engineering intelligence. Here is how you master the workflow.
                    </p>
                </motion.div>
            </section>

            {/* Workflow Timeline */}
            <div className="container mx-auto px-6 max-w-5xl relative z-10">
                {/* Vertical Line */}
                <div className="absolute left-6 md:left-1/2 top-10 bottom-10 w-px bg-gradient-to-b from-transparent via-brand-purple/50 to-transparent md:-translate-x-1/2 z-0 hidden md:block" />

                <div className="space-y-32">
                    <WorkflowStep
                        number="01"
                        title="Define the Intent"
                        description="Start by describing what you want in plain English. Our system analyzes your ambiguity and suggests the structural constraints needed for stability."
                        icon={<Cpu className="h-6 w-6 text-white" />}
                        color="bg-brand-purple"
                        align="left"
                    >
                        <div className="bg-[#0A0A0E] border border-white/10 rounded-lg p-4 font-mono text-xs text-gray-400">
                            <div className="flex gap-2 mb-2 border-b border-white/5 pb-2">
                                <span className="text-red-400">Input:</span>
                                <span>"Write a blog post about AI."</span>
                            </div>
                            <div className="flex gap-2 text-emerald-400">
                                <span className="text-brand-purple">Refined:</span>
                                <span>"Act as a technical writer. Create a 1500-word article on LLM architectures for potential investors, focusing on scalability and cost..."</span>
                            </div>
                        </div>
                    </WorkflowStep>

                    <WorkflowStep
                        number="02"
                        title="Engineer & Optimize"
                        description="Use the Studio to tweak parameters. Adjust temperature for creativity or determinism. Apply known reasoning frameworks like Chain-of-Thought or Tree-of-Thoughts with one click."
                        icon={<Zap className="h-6 w-6 text-white" />}
                        color="bg-blue-500"
                        align="right"
                    >
                        <div className="grid grid-cols-2 gap-2">
                            {['Chain of Thought', 'Tree of Thoughts', 'Few-Shot', 'ReAct'].map(tag => (
                                <div key={tag} className="bg-white/5 rounded px-3 py-2 text-xs text-gray-300 border border-white/5 flex items-center gap-2">
                                    <CheckCircle2 className="h-3 w-3 text-blue-400" /> {tag}
                                </div>
                            ))}
                        </div>
                    </WorkflowStep>

                    <WorkflowStep
                        number="03"
                        title="A/B Test Logic"
                        description="Don't guess. Run your prompt against different models or variations. Our Arena mode runs them in parallel and scores them based on logic, not just vibes."
                        icon={<FlaskConical className="h-6 w-6 text-white" />}
                        color="bg-amber-500"
                        align="left"
                    >
                        <div className="relative h-24 bg-[#0A0A0E] rounded-lg border border-white/10 overflow-hidden flex items-center justify-center gap-8">
                            <div className="text-center group">
                                <div className="text-xs text-gray-500 mb-1">Model A</div>
                                <div className="text-2xl font-bold text-gray-700 group-hover:text-red-400 transition-colors">82%</div>
                            </div>
                            <div className="h-8 w-px bg-white/10" />
                            <div className="text-center group">
                                <div className="text-xs text-gray-500 mb-1">Model B</div>
                                <div className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">97%</div>
                            </div>
                        </div>
                    </WorkflowStep>

                    <WorkflowStep
                        number="04"
                        title="Deploy & Version"
                        description="Once verified, commit your prompt to the library. Get a stable API endpoint or copy the structured JSON. Every change is tracked in git-style version control."
                        icon={<Rocket className="h-6 w-6 text-white" />}
                        color="bg-emerald-500"
                        align="right"
                    >
                        <div className="flex flex-col gap-2">
                            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-2 rounded text-xs font-mono flex justify-between items-center">
                                <span>v3.4.2 - Production</span>
                                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            </div>
                            <div className="bg-white/5 border border-white/5 text-gray-500 px-3 py-2 rounded text-xs font-mono">
                                <span>v3.4.1 - Staging (Archived)</span>
                            </div>
                        </div>
                    </WorkflowStep>
                </div>
            </div>

            {/* CTA */}
            <section className="mt-40 text-center px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-3xl text-white font-medium mb-8">Ready to engineer intelligence?</h2>
                    <Link href="/studio">
                        <button className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-brand-purple text-white hover:bg-brand-purple/90 transition-all font-medium text-lg shadow-lg shadow-brand-purple/20">
                            Start Building Now
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </Link>
                </motion.div>
            </section>

        </div>
    )
}

function WorkflowStep({ number, title, description, icon, color, align, children }: any) {
    const isLeft = align === 'left';
    return (
        <div className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 ${!isLeft ? 'md:flex-row-reverse' : ''}`}>

            {/* Content Side */}
            <motion.div
                className={`flex-1 text-center ${isLeft ? 'md:text-right' : 'md:text-left'}`}
                initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
            >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl ${color} shadow-lg shadow-${color}/20 mb-6 md:mb-0 md:hidden`}>
                    {icon}
                </div>
                <h3 className="text-4xl font-bold text-white/5 mb-2">{number}</h3>
                <h2 className="text-2xl text-white font-bold mb-4">{title}</h2>
                <p className="text-gray-400 leading-relaxed max-w-md mx-auto md:mx-0">{description}</p>
            </motion.div>

            {/* Center Node (Desktop) */}
            <div className="relative hidden md:flex items-center justify-center z-10">
                <div className={`w-14 h-14 rounded-2xl ${color} shadow-[0_0_30px_-5px_rgba(0,0,0,0.5)] flex items-center justify-center relative z-20 border border-white/10`}>
                    {icon}
                </div>
                {/* Glowing Halo */}
                <div className={`absolute inset-0 ${color} blur-xl opacity-40`} />
            </div>

            {/* Visual Side */}
            <motion.div
                className="flex-1 w-full"
                initial={{ opacity: 0, scale: 0.9, x: isLeft ? 50 : -50 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            >
                <div className="glass-card p-6 rounded-xl border border-white/10 hover:border-brand-purple/30 transition-colors duration-500 relative overflow-hidden group">
                    {/* Hover gradient sweep */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    {children}
                </div>
            </motion.div>

        </div>
    )
}

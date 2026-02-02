"use client"

import React from "react"
import { Sparkles, Shield, Sliders, GitBranch, Trophy, Gamepad2, ArrowRight } from "lucide-react"
import { Metadata } from "next"
import { motion } from "framer-motion"
import Link from "next/link"

// Inline Metadata logic workaround for client component
// In a real app with nextjs app dir, we might split this if we strictly need server metadata
// allowing 'use client' for motion. For now we assume the layout provides generic metadata or we accept client-rendering limits.

export default function FeaturesPage() {
    return (
        <div className="min-h-screen bg-[#020204] font-sans text-slate-300 selection:bg-brand-purple/30 pb-32">

            {/* Background Texture */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'url("/noise.png")' }}></div>

            {/* Section 1: Intelligent Introduction */}
            <section className="pt-40 pb-32 px-6 container mx-auto max-w-5xl text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-white mb-8 tracking-tight leading-tight">
                        Tools designed to make you think better, <br className="hidden md:block" />
                        <span className="text-gray-500">not just type harder.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        PromptForge is a thinking system. It deconstructs your intent,
                        architects your constraints, and benchmarks your results.
                    </p>
                </motion.div>
            </section>

            {/* Section 2: Mental Models */}
            <div className="container mx-auto px-6 max-w-6xl space-y-32 relative z-10">

                {/* Group A: Understand */}
                <FeatureGroup
                    label="Understand"
                    description="Deconstruct ambiguity before it costs you tokens."
                    delay={0.2}
                >
                    <FeatureCard
                        icon={<Sparkles className="h-5 w-5 text-amber-300" />}
                        title="Deep Intent Analysis"
                        description="Our heuristic engine decodes vague requests into structured intent, identifying missing context before generation."
                    />
                    <FeatureCard
                        icon={<Shield className="h-5 w-5 text-emerald-300" />}
                        title="Security Consultant"
                        description="Automatically detects injection risks and vague constraints that could lead to hallucinations."
                    />
                </FeatureGroup>

                <DividerInsight text="Most people prompt randomly. Experts prompt deliberately." />

                {/* Group B: Build */}
                <FeatureGroup
                    label="Build"
                    description="Architecture, not just text generation."
                    delay={0.4}
                >
                    <FeatureCard
                        icon={<Sliders className="h-5 w-5 text-cyan-300" />}
                        title="Granular Controls"
                        description="Adjust temperature, top-p, and cognitive depth. We translate your sliders into system-prompt constraints."
                    />
                    <FeatureCard
                        icon={<GitBranch className="h-5 w-5 text-purple-300" />}
                        title="Version History"
                        description="Every iteration is committed. Rollback to any previous state with a visual diff of changes."
                    />
                </FeatureGroup>

                <DividerInsight text="Good prompts are designed, not guessed." />

                {/* Group C: Compete */}
                <FeatureGroup
                    label="Compete"
                    description="Data-driven decisions, not vibe-based guessing."
                    delay={0.6}
                >
                    <FeatureCard
                        icon={<Trophy className="h-5 w-5 text-rose-300" />}
                        title="A/B Testing Arena"
                        description="Run prompts head-to-head. Our scoring engine declares a winner based on reasoning clarity and logic."
                    />
                    <FeatureCard
                        icon={<Gamepad2 className="h-5 w-5 text-indigo-300" />}
                        title="The Playground"
                        description="Gamified mastery. Fix broken prompts, battle AI predictions, and earn badges to prove your skills."
                    />
                </FeatureGroup>
            </div>

            {/* Section 4: Confident Closing */}
            <section className="mt-40 text-center px-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                >
                    <p className="text-2xl text-white font-medium mb-8">PromptForge grows with you.</p>
                    <Link href="/playground">
                        <button className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all font-medium text-sm">
                            Explore Playground
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </Link>
                </motion.div>
            </section>

        </div>
    )
}

// ------------------------------------------------------------------
// Sub-components
// ------------------------------------------------------------------

function FeatureGroup({ label, description, children, delay }: { label: string, description: string, children: React.ReactNode, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay, ease: "easeOut" }}
        >
            <div className="mb-8 pl-1">
                <span className="text-xs font-bold text-brand-purple uppercase tracking-widest mb-2 block">{label}</span>
                <p className="text-xl md:text-2xl text-white font-medium">{description}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
                {children}
            </div>
        </motion.div>
    )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="group relative p-8 rounded-xl border border-white/[0.05] bg-white/[0.02] backdrop-blur-sm overflow-hidden hover:border-white/10 hover:bg-white/[0.04] transition-all duration-500">
            {/* Hover Glow */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-brand-purple/10 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <div className="relative z-10">
                <div className="mb-6 inline-flex p-3 rounded-lg bg-white/[0.05] border border-white/[0.05] group-hover:scale-105 transition-transform duration-300">
                    {icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-brand-purple transition-colors duration-300">{title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm group-hover:text-gray-400 transition-colors duration-300">
                    {description}
                </p>

                {/* Micro Link */}
                <div className="mt-6 pt-6 border-t border-white/[0.05] flex items-center text-xs font-medium text-gray-600 group-hover:text-gray-400 transition-colors">
                    <span>Explore this capability</span>
                    <ArrowRight className="h-3 w-3 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </div>
            </div>
        </div>
    )
}

function DividerInsight({ text }: { text: string }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex justify-center py-12 opacity-50"
        >
            <p className="font-mono text-sm text-gray-600 tracking-wide text-center max-w-xs">{text}</p>
        </motion.div>
    )
}

"use client"

import React from "react"
import { motion } from "framer-motion"
import {
    Zap,
    Shield,
    Layers,
    Activity,
    Cpu,
    Code2,
    Network,
    Server,
    ArrowRight,
    Target
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import Link from "next/link"

export default function AboutPage() {
    return (
        <div className="flex flex-col gap-32 pb-32 overflow-hidden selection:bg-brand-purple/30">
            {/* Hero Section */}
            <section className="relative pt-32 lg:pt-48 pb-16 px-6">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[600px] bg-brand-purple/10 blur-[120px] rounded-full opacity-50 pointer-events-none" />
                <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-brand-indigo/10 blur-[80px] rounded-full pointer-events-none" />

                <div className="container mx-auto max-w-5xl text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/20 mb-8"
                    >
                        <Target className="h-4 w-4 text-brand-purple" />
                        <span className="text-xs font-bold text-brand-purple uppercase tracking-wider">The Engine Room</span>
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 text-white">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="block"
                        >
                            Engineering the
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple via-brand-violet to-brand-indigo block mt-2 pb-2"
                        >
                            Language of AI
                        </motion.span>
                    </h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed"
                    >
                        PromptForge Studio is the middleware layer between raw human intent and large language model execution. We build infrastructure, not just interfaces.
                    </motion.p>
                </div>
            </section>

            {/* Core Metrics Abstract Syntax */}
            <FadeInSection>
                <section className="container mx-auto px-6 max-w-6xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                        <MetricCard icon={<Cpu />} label="Multi-Model Routing" value="Active" />
                        <MetricCard icon={<Zap />} label="Avg. Optimization" value="< 200ms" />
                        <MetricCard icon={<Shield />} label="Security Protocol" value="Enterprise" />
                        <MetricCard icon={<Activity />} label="Availability" value="99.9%" />
                    </div>
                </section>
            </FadeInSection>

            {/* What We Do / Architecture Section */}
            <FadeInSection>
                <section className="container mx-auto px-6 max-w-7xl">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                Breaking the <br />
                                <span className="text-brand-purple">ambiguity bottleneck.</span>
                            </h2>
                            <div className="space-y-6 text-lg text-gray-400 leading-relaxed">
                                <p>
                                    The future isn't constrained by AI capability—it's constrained by how effectively humans communicate with it. Vague inputs yield hallucinations, bloated tokens, and unpredictable formatting.
                                </p>
                                <p>
                                    PromptForge replaces the guesswork with a <strong>heuristic-driven refinement engine</strong>. We parse unstructured intent, apply industry-standard constraints (like JSON schematics and zero-shot structural formatting), and output production-ready intelligence.
                                </p>
                            </div>
                            <ul className="mt-8 space-y-4">
                                {['Automated Intent Parsing', 'Granular Token Control', 'Immutable Version History'].map((item) => (
                                    <li key={item} className="flex items-center gap-3 text-gray-300">
                                        <div className="bg-brand-purple/20 p-1 rounded-sm border border-brand-purple/30">
                                            <Code2 className="h-4 w-4 text-brand-purple" />
                                        </div>
                                        <span className="font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="order-1 lg:order-2">
                            {/* Abstract Component Art */}
                            <div className="relative aspect-square max-w-md mx-auto">
                                <div className="absolute inset-0 bg-gradient-to-tr from-brand-purple/20 to-transparent rounded-3xl blur-2xl" />
                                <Card className="absolute inset-0 border-white/10 bg-[#0A0A0A]/80 flex flex-col justify-between p-8 overflow-hidden z-10">
                                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                        <div className="flex gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                            <div className="w-3 h-3 rounded-full bg-green-500/50" />
                                        </div>
                                        <Network className="text-white/20 h-5 w-5" />
                                    </div>
                                    <div className="space-y-4 flex-1 mt-8">
                                        <div className="h-4 w-3/4 bg-white/5 rounded" />
                                        <div className="h-4 w-1/2 bg-white/5 rounded" />
                                        <div className="h-4 w-5/6 bg-white/5 rounded" />
                                        <div className="flex gap-4 mt-8">
                                            <div className="h-10 w-24 bg-brand-purple/20 border border-brand-purple/30 rounded-lg animate-pulse" />
                                            <div className="h-10 w-32 bg-white/5 rounded-lg" />
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-white/5 font-mono text-xs text-brand-purple flex justify-between">
                                        <span>STATUS: [200 OK]</span>
                                        <span>OPTIMIZED</span>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>
            </FadeInSection>

            {/* Differentiators / Values Grid */}
            <FadeInSection>
                <section className="container mx-auto px-6 max-w-7xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">The Forge Protocol</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">Built strictly for developers and professional prompt engineers.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <ValueCard
                            icon={<Layers />}
                            title="A/B Testing Arena"
                            desc="Don't guess which prompt works better. Pit structural variations against each other using our side-by-side execution environment."
                        />
                        <ValueCard
                            icon={<Server />}
                            title="Agnostic Infrastructure"
                            desc="We route seamlessly between Google Gemini and NVIDIA NIMs. Optimize locally, deploy globally to the model of your choice."
                        />
                        <ValueCard
                            icon={<Shield />}
                            title="Enterprise Security"
                            desc="Enforced Row-Level Security (RLS) via Supabase ensures your prompt logic remains your intellectual property."
                        />
                    </div>
                </section>
            </FadeInSection>

            {/* Footer CTA */}
            <FadeInSection>
                <section className="container mx-auto px-6 max-w-4xl">
                    <Card className="relative p-12 md:p-16 text-center border-brand-purple/30 bg-brand-purple/5 overflow-hidden group">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-purple/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 relative z-10">Stop writing. Start engineering.</h2>
                        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto relative z-10">
                            Join the modern pipeline for prompt creation, versioning, and execution.
                        </p>
                        <Link href="/studio" className="relative z-10">
                            <Button size="lg" className="h-14 px-10 text-lg shadow-glow hover:scale-105 transition-all duration-300 bg-brand-purple hover:bg-brand-purple/90 rounded-full">
                                Access The Studio <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </Card>
                </section>
            </FadeInSection>
        </div>
    )
}

function MetricCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <Card variant="static" className="p-6 flex flex-col items-center justify-center text-center bg-white/[0.02] border-white/5 hover:border-brand-purple/30 transition-colors group">
            <div className="mb-4 p-3 rounded-xl bg-white/5 text-brand-purple group-hover:scale-110 group-hover:bg-brand-purple/10 transition-all duration-300">
                {icon}
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-white mb-2">{value}</div>
            <div className="text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">{label}</div>
        </Card>
    )
}

function ValueCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <Card variant="feature" className="p-8 h-full bg-[#0A0A0A] border-white/5 group">
            <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white mb-6 group-hover:bg-brand-purple/10 group-hover:text-brand-purple transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-4 group-hover:text-brand-purple transition-colors">{title}</h3>
            <p className="text-gray-400 leading-relaxed">{desc}</p>
        </Card>
    )
}

function FadeInSection({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            {children}
        </motion.div>
    )
}

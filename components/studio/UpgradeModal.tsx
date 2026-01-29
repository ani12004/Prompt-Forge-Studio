"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, Sparkles, Zap } from "lucide-react";

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        {/* Modal Content */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking modal
                            className="bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden"
                        >
                            {/* Decorative Gradients */}
                            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-purple/50 to-transparent" />
                            <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-purple/20 blur-3xl rounded-full" />

                            <div className="p-6 relative z-10">
                                {/* Close Button */}
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
                                >
                                    <X className="w-4 h-4" />
                                </button>

                                {/* Icon / Header */}
                                <div className="mb-6 flex justify-center">
                                    <div className="w-16 h-16 rounded-full bg-brand-purple/10 flex items-center justify-center border border-brand-purple/20 shadow-glow-sm">
                                        <Zap className="w-8 h-8 text-brand-purple" />
                                    </div>
                                </div>

                                <div className="text-center space-y-3 mb-8">
                                    <h2 className="text-2xl font-bold text-white tracking-tight">
                                        Unlock Unlimited Potential
                                    </h2>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        You've hit the monthly limit on the Free plan. <br />
                                        Upgrade to Pro for unlimited prompts, faster generations, and exclusive models.
                                    </p>
                                </div>

                                {/* Features List (Optional, keeps it punchy) */}
                                <div className="space-y-3 mb-8">
                                    {[
                                        "Unlimited Prompt Generations",
                                        "Access to Granular & Expert Modes",
                                        "Priority Access during high traffic"
                                    ].map((feature, i) => (
                                        <div key={i} className="flex items-center gap-3 text-sm text-gray-300">
                                            <Sparkles className="w-4 h-4 text-brand-purple/70" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Actions */}
                                <div className="space-y-3">
                                    <Link
                                        href="/pricing"
                                        className="block w-full py-3 px-4 bg-brand-purple hover:bg-brand-purple/90 text-white text-center font-medium rounded-lg transition-all shadow-glow-sm hover:shadow-glow-md"
                                    >
                                        Upgrade to Pro
                                    </Link>
                                    <button
                                        onClick={onClose}
                                        className="block w-full py-3 px-4 bg-transparent hover:bg-white/5 text-gray-400 hover:text-white text-center font-medium rounded-lg transition-colors text-sm"
                                    >
                                        Maybe Later
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

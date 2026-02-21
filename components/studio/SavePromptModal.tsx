"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Save, AlertTriangle } from "lucide-react"
import { savePrompt } from "@/app/actions/save-prompt"

interface SavePromptModalProps {
    isOpen: boolean
    onClose: () => void
    template: string
    onSaved: (promptId: string, versionId: string, name: string) => void
}

export function SavePromptModal({ isOpen, onClose, template, onSaved }: SavePromptModalProps) {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [versionTag, setVersionTag] = useState("v1.0")
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState("")

    if (!isOpen) return null

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (!name.trim()) {
            setError("Prompt name is required")
            return
        }

        setIsSaving(true)
        try {
            // For MVP, we use a basic system prompt. The next feature iteration will allow customizing this.
            const result = await savePrompt({
                name,
                description,
                systemPrompt: "You are a highly capable AI assistant.",
                template: template,
                versionTag
            })

            if (result.success && result.promptId && result.versionId) {
                onSaved(result.promptId, result.versionId, name)
                onClose()
            } else {
                setError(result.error || "Failed to save prompt")
            }
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center p-4"
                    >
                        <div className="pointer-events-auto bg-[#0F0F0F] border border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-white/5 flex justify-between items-start bg-white/[0.02]">
                                <div>
                                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Save className="w-5 h-5 text-brand-purple" />
                                        Save Prompt
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">Store this template in your Workspace to use via API.</p>
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="p-6 space-y-4">
                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex gap-2 items-center text-red-400 text-sm">
                                        <AlertTriangle className="w-4 h-4 shrink-0" />
                                        <p>{error}</p>
                                    </div>
                                )}

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Prompt Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g. Email Summarizer"
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/50 transition-all placeholder:text-gray-600"
                                        maxLength={100}
                                        required
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Description (Optional)</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="What does this prompt do?"
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/50 transition-all placeholder:text-gray-600 resize-none h-20"
                                        maxLength={255}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Version Tag</label>
                                    <input
                                        type="text"
                                        value={versionTag}
                                        onChange={(e) => setVersionTag(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/50 transition-all font-mono"
                                        maxLength={20}
                                        required
                                    />
                                </div>

                                <div className="pt-4 border-t border-white/5 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving || !name.trim() || !versionTag.trim()}
                                        className="flex-1 flex justify-center items-center gap-2 bg-brand-purple text-white px-4 py-2.5 rounded-lg font-bold text-sm disabled:opacity-50 hover:bg-brand-purple/90 transition-all shadow-[0_0_15px_rgba(124,58,237,0.25)]"
                                    >
                                        {isSaving ? "Saving..." : "Save Prompt"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

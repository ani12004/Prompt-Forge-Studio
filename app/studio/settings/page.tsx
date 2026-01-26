"use client"

import { Settings, User, Bell, Key, Shield, Monitor } from "lucide-react"

export default function SettingsPage() {
    return (
        <div className="h-full flex flex-col p-8 max-w-4xl mx-auto overflow-y-auto">
            <header className="mb-10">
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <Settings className="h-8 w-8 text-brand-purple" />
                    Studio Settings
                </h1>
                <p className="text-gray-400">Manage your preferences and workspace configuration.</p>
            </header>

            <div className="space-y-6">
                {/* General Settings */}
                <section className="p-6 rounded-xl bg-[#0F0F0F] border border-white/10">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Monitor className="h-5 w-5 text-blue-400" />
                        Appearance
                    </h2>

                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <div className="text-white font-medium">Theme</div>
                            <div className="text-sm text-gray-400">Customize your studio interface</div>
                        </div>
                        <select className="bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-brand-purple">
                            <option>Dark (Default)</option>
                            <option>Midnight</option>
                            <option>OLED</option>
                        </select>
                    </div>
                </section>

                {/* API Settings */}
                <section className="p-6 rounded-xl bg-[#0F0F0F] border border-white/10">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Key className="h-5 w-5 text-yellow-400" />
                        API Configuration
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">OpenAI API Key (Optional)</label>
                            <input
                                type="password"
                                placeholder="sk-..."
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-brand-purple placeholder:text-gray-700"
                            />
                            <p className="text-xs text-gray-500 mt-2">Used for running improved models directly from your account.</p>
                        </div>
                    </div>
                </section>

                {/* Account Settings */}
                <section className="p-6 rounded-xl bg-[#0F0F0F] border border-white/10">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <User className="h-5 w-5 text-green-400" />
                        Account
                    </h2>

                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-white font-medium">Data Export</div>
                            <div className="text-sm text-gray-400">Download all your prompt history</div>
                        </div>
                        <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors text-sm">
                            Export Data
                        </button>
                    </div>
                </section>

                <div className="text-center pt-8 text-gray-600 text-sm">
                    PromptForge Hub v1.0.2 • <span className="hover:text-gray-400 cursor-pointer">Changelog</span>
                </div>
            </div>
        </div>
    )
}

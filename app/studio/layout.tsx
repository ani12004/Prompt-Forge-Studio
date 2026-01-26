import { UserButton } from "@clerk/nextjs"
import { Sparkles, History, Settings, Home, LogOut } from "lucide-react"
import Link from "next/link"

export default function StudioLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen bg-[#050508] overflow-hidden">
            {/* Background Gradients */}
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-brand-purple/10 via-brand-dark to-brand-dark pointer-events-none z-0" />

            {/* Sidebar */}
            <aside className="w-16 md:w-64 border-r border-white/5 bg-white/[0.02] backdrop-blur-xl flex flex-col justify-between p-4 z-10 relative">
                <div className="flex flex-col gap-8">
                    {/* Logo Area */}
                    <div className="flex items-center gap-3 pl-2">
                        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-brand-purple to-brand-indigo flex items-center justify-center overflow-hidden shadow-lg shadow-brand-purple/20">
                            <Sparkles className="h-4 w-4 text-white fill-white/20" />
                        </div>
                        <span className="text-lg font-bold text-white hidden md:block tracking-tight">PromptForge</span>
                    </div>

                    {/* Nav Items */}
                    <nav className="flex flex-col gap-2">
                        <Link href="/studio" className="flex items-center gap-3 p-3 rounded-xl bg-brand-purple/10 text-brand-purple border border-brand-purple/20 shadow-glow-sm">
                            <Sparkles className="h-5 w-5" />
                            <span className="hidden md:block font-medium">Editor</span>
                        </Link>
                        <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200">
                            <Home className="h-5 w-5" />
                            <span className="hidden md:block font-medium">Dashboard</span>
                        </Link>
                        <Link href="/studio/history" className="flex items-center gap-3 p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200">
                            <History className="h-5 w-5" />
                            <span className="hidden md:block font-medium">History</span>
                        </Link>
                        <Link href="/studio/settings" className="flex items-center gap-3 p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200">
                            <Settings className="h-5 w-5" />
                            <span className="hidden md:block font-medium">Settings</span>
                        </Link>
                    </nav>
                </div>

                {/* User Profile */}
                <div className="p-2 flex items-center gap-3 border-t border-white/5 pt-4">
                    <UserButton afterSignOutUrl="/"
                        appearance={{
                            elements: {
                                avatarBox: "h-9 w-9 border-2 border-white/10"
                            }
                        }}
                    />
                    <div className="hidden md:flex flex-col">
                        <span className="text-sm font-medium text-white">My Account</span>
                        <span className="text-xs text-brand-purple font-medium">Pro Plan</span>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto relative z-10 w-full">
                {children}
            </main>
        </div>
    )
}

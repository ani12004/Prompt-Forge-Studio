"use client"

import * as React from "react"
import Link from "next/link"
import { useUser, useClerk } from "@clerk/nextjs"
import { Settings, User, LayoutDashboard, LogOut, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { getUserSubscription } from "@/app/actions/subscription"

export function UserMenu() {
    const { user } = useUser()
    const [tier, setTier] = React.useState<string | null>(null)

    React.useEffect(() => {
        getUserSubscription().then(setTier)
    }, [])

    if (!user) return null

    return (
        <div className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-full bg-[#18181b] border border-white/5">
            <div className="h-8 w-8 rounded-full bg-brand-purple/20 border border-brand-purple/30 overflow-hidden relative">
                {user.imageUrl ? (
                    <img
                        src={user.imageUrl}
                        alt={user.fullName || "User"}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center text-brand-purple text-xs font-bold">
                        {(user.firstName || user.username || "U").charAt(0).toUpperCase()}
                    </div>
                )}
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-medium text-white leading-none">
                    {user.firstName || user.username}
                </span>
                <span className="text-[10px] font-bold text-brand-purple uppercase tracking-wider mt-0.5">
                    {tier === 'pro' ? 'Pro Plan' : 'Free Plan'}
                </span>
            </div>
        </div>
    )
}

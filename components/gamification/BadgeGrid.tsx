"use client"

import React, { useState } from "react"
import { Badge, UserBadge } from "@/components/playground/types"
import { BadgeCard } from "./BadgeCard"
import { Search, Filter } from "lucide-react"

interface BadgeGridProps {
    badges: Badge[]
    userBadges: UserBadge[]
}

export function BadgeGrid({ badges, userBadges }: BadgeGridProps) {
    const [filter, setFilter] = useState<'All' | 'Earned' | 'Locked'>('All')

    // Helper map for O(1) lookup
    const userBadgeMap = new Map(userBadges.map(ub => [ub.badge_id, ub]))

    const filteredBadges = badges.filter(badge => {
        const isEarned = userBadgeMap.has(badge.id)
        if (filter === 'Earned') return isEarned
        if (filter === 'Locked') return !isEarned
        return true
    })

    const earnedCount = userBadges.length
    const totalCount = badges.length
    const progress = Math.round((earnedCount / totalCount) * 100) || 0

    return (
        <div className="space-y-6">
            {/* Header / Filter Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="flex bg-black/40 p-1 rounded-lg border border-white/5">
                        {['All', 'Earned', 'Locked'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f as any)}
                                className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${filter === f ? "bg-white/10 text-white shadow-sm" : "text-gray-500 hover:text-gray-300"}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="flex-1 md:w-64">
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-brand-purple transition-all duration-1000 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <div className="flex justify-between mt-1.5">
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest">Collection Progress</span>
                            <span className="text-[10px] text-brand-purple font-mono">{earnedCount} / {totalCount}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredBadges.map(badge => (
                    <BadgeCard
                        key={badge.id}
                        badge={badge}
                        userBadge={userBadgeMap.get(badge.id)}
                    />
                ))}
            </div>

            {filteredBadges.length === 0 && (
                <div className="py-12 text-center text-gray-500">
                    <p className="text-sm">No badges found for this filter.</p>
                </div>
            )}
        </div>
    )
}

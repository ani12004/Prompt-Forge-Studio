import React from "react"
import { Badge, UserBadge } from "@/components/playground/types"
import { Lock, Trophy, Wrench, Hammer, Swords, Crosshair, Zap, Crown, Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface BadgeCardProps {
    badge: Badge
    userBadge?: UserBadge | null
}

const RARITY_COLORS = {
    Common: "text-gray-400 border-gray-700 bg-gray-500/10",
    Skilled: "text-blue-400 border-blue-500/30 bg-blue-500/10",
    Advanced: "text-green-400 border-green-500/30 bg-green-500/10",
    Expert: "text-orange-400 border-orange-500/30 bg-orange-500/10",
    Legendary: "text-amber-400 border-amber-500/50 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.2)]",
}

const ICON_MAP: Record<string, any> = {
    'Trophy': Trophy,
    'Wrench': Wrench,
    'Hammer': Hammer,
    'Swords': Swords,
    'Crosshair': Crosshair,
    'Zap': Zap,
    'Crown': Crown,
    'Star': Star
}

export function BadgeCard({ badge, userBadge }: BadgeCardProps) {
    const isUnlocked = !!userBadge
    const isImage = badge.icon.includes("/") || badge.icon.includes(".")

    // Resolve Icon Component
    const IconComponent = ICON_MAP[badge.icon] || Trophy

    return (
        <div className="group relative">
            <div className={cn(
                "relative flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 w-full aspect-square",
                isUnlocked ? RARITY_COLORS[badge.rarity] : "border-white/5 bg-white/[0.02] opacity-50 grayscale hover:opacity-75 hover:grayscale-0",
                isUnlocked ? "hover:scale-105" : ""
            )}>
                {/* Icon or Image */}
                <div className={cn(
                    "w-16 h-16 flex items-center justify-center mb-3 transition-transform duration-500",
                    isUnlocked ? "drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" : "",
                    isUnlocked && badge.rarity === 'Legendary' ? "animate-pulse" : ""
                )}>
                    {isImage ? (
                        <div className="relative w-full h-full">
                            <img
                                src={badge.icon}
                                alt={badge.name}
                                className={cn("w-full h-full object-contain", !isUnlocked && "brightness-0 invert opacity-30")}
                            />
                            {!isUnlocked && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Lock className="w-6 h-6 text-white/50" />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center",
                            isUnlocked ? "bg-white/5 shadow-inner" : "bg-white/5"
                        )}>
                            {isUnlocked ? (
                                <IconComponent className={cn("w-6 h-6", RARITY_COLORS[badge.rarity].split(' ')[0])} />
                            ) : (
                                <Lock className="w-5 h-5 text-gray-600" />
                            )}
                        </div>
                    )}
                </div>

                {/* Name */}
                <h4 className="text-xs font-bold text-center leading-tight mb-1">{badge.name}</h4>
                <p className="text-[10px] uppercase tracking-wider opacity-60 font-mono">{badge.rarity}</p>

                {/* Glow Effect for unlocked */}
                {isUnlocked && (
                    <div className={cn(
                        "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
                        "bg-gradient-to-tr from-white/5 to-transparent"
                    )} />
                )}
            </div>

            {/* Hover Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 p-3 rounded-lg bg-[#0F0F0F] border border-white/10 shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 translate-y-2 group-hover:translate-y-0">
                <div className="text-xs font-medium text-white mb-1">{badge.name}</div>
                <div className="text-[10px] text-gray-400 leading-relaxed mb-2">{badge.description}</div>
                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <span className={cn("text-[9px] px-1.5 py-0.5 rounded border uppercase tracking-wider", RARITY_COLORS[badge.rarity].replace("bg-", "text-").replace("shadow-", ""))}>
                        {badge.rarity}
                    </span>
                    {isUnlocked && (
                        <span className="text-[9px] text-gray-500">
                            {new Date(userBadge.earned_at).toLocaleDateString()}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}

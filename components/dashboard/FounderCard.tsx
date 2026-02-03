"use client"

import React from "react"
import { Github, Linkedin } from "lucide-react"
import { Card } from "@/components/ui/Card"
import Image from "next/image"

interface FounderCardProps {
    onClick?: () => void
}

export function FounderCard({ onClick }: FounderCardProps) {
    return (
        <Card
            variant="interactive"
            onClick={onClick}
            className="p-8 text-center group bg-[#0A0A0A] border-white/5 hover:border-brand-purple/30 max-w-2xl w-full cursor-pointer transition-all duration-300 hover:-translate-y-1"
        >
            <div className="w-40 h-40 rounded-full bg-white/5 mx-auto mb-6 overflow-hidden transition-all duration-500 border-2 border-white/10 group-hover:border-brand-purple/50 shadow-xl group-hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] relative">
                <Image
                    src="/anil_suthar_profile.jpg"
                    alt="Anil Suthar"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
            </div>

            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-brand-purple transition-colors">
                Anil Suthar
            </h3>

            <p className="text-sm text-gray-500 mb-6 uppercase tracking-wider font-semibold">
                Founder & CEO
            </p>

            <div className="flex justify-center gap-5 opacity-80 group-hover:opacity-100 transition-all duration-300">
                <a href="https://github.com/ani12004" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                    <Github className="h-5 w-5 text-gray-400 hover:text-white transition-colors hover:scale-110" />
                </a>
                <a href="https://www.linkedin.com/in/sutharani738/" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                    <Linkedin className="h-5 w-5 text-gray-400 hover:text-white transition-colors hover:scale-110" />
                </a>
            </div>
        </Card>
    )
}

"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "./Navbar"
import { Footer } from "./Footer"

export function Shell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    // Check if we are in the studio or dashboard
    // The user specifically asked to remove footer from "studio stuffs".
    // I will exclude it for /studio routes.
    const isStudio = pathname?.startsWith("/studio")

    return (
        <>
            <Navbar />
            <main className="min-h-screen pt-24">
                {children}
            </main>
            {!isStudio && <Footer />}
        </>
    )
}

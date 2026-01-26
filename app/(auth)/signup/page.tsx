"use client"
import { SignUp, useUser } from "@clerk/nextjs"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, Suspense } from "react"
import { Loader2 } from "lucide-react"

function SignupContent() {
    const { isSignedIn, isLoaded } = useUser()
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            const prompt = searchParams.get("prompt")
            const destination = prompt ? `/dashboard?prompt=${encodeURIComponent(prompt)}` : "/dashboard"
            router.push(destination)
        }
    }, [isLoaded, isSignedIn, router, searchParams])

    if (!isLoaded || isSignedIn) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#0A0A0A]">
                <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
            </div>
        )
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#050508] py-12 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-purple/10 blur-[120px] rounded-full opacity-30 pointer-events-none" />

            <div className="relative z-10 w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white mb-2">Join PromptForge</h1>
                    <p className="text-gray-400">Master the art of AI communication.</p>
                </div>

                <div className="glass-panel p-1 rounded-2xl border border-white/10 bg-white/[0.02] shadow-2xl">
                    <SignUp
                        routing="hash"
                        appearance={{
                            elements: {
                                card: "bg-transparent shadow-none border-none",
                                rootBox: "w-full",
                                headerTitle: "hidden",
                                headerSubtitle: "hidden",
                                socialButtonsBlockButton: "bg-white/5 border border-white/10 text-white hover:bg-white/10 active:bg-white/5",
                                socialButtonsBlockButtonText: "text-white font-medium",
                                dividerLine: "bg-white/10",
                                dividerText: "text-gray-500",
                                formFieldLabel: "text-gray-400",
                                formFieldInput: "bg-white/5 border-white/10 text-white focus:border-brand-purple",
                                footerActionLink: "text-brand-purple hover:text-brand-violet",
                                formButtonPrimary: "bg-brand-purple hover:bg-brand-purple/90 text-white !shadow-glow font-medium normal-case"
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default function SignupPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center bg-[#0A0A0A]">
                <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
            </div>
        }>
            <SignupContent />
        </Suspense>
    )
}

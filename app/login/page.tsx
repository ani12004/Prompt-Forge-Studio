"use client"

import { useSignIn } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Loader2, Github } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import Link from "next/link"

export default function LoginPage() {
    const { isLoaded, signIn, setActive } = useSignIn()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!isLoaded) return

        setIsLoading(true)
        setError("")

        try {
            const result = await signIn.create({
                identifier: email,
                password,
            })

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId })
                router.push("/dashboard")
            } else {
                console.error("Login incomplete", result)
                setError("Login failed. Please check your credentials.")
            }
        } catch (err: any) {
            console.error("Login error", err)
            setError(err.errors?.[0]?.message || "Something went wrong. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        if (!isLoaded) return
        setIsLoading(true)
        try {
            await signIn.authenticateWithRedirect({
                strategy: "oauth_google",
                redirectUrl: "/sso-callback",
                redirectUrlComplete: "/dashboard",
            })
        } catch (err: any) {
            console.error("Google Login error", err)
            setError(err.errors?.[0]?.message || "Google login failed.")
            setIsLoading(false)
        }
    }

    const handleGitHubLogin = async () => {
        if (!isLoaded) return
        setIsLoading(true)
        try {
            await signIn.authenticateWithRedirect({
                strategy: "oauth_github",
                redirectUrl: "/sso-callback",
                redirectUrlComplete: "/dashboard",
            })
        } catch (err: any) {
            console.error("GitHub Login error", err)
            setError(err.errors?.[0]?.message || "GitHub login failed.")
            setIsLoading(false)
        }
    }

    const clerkReady = isLoaded

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#050508] py-12 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-purple/10 blur-[120px] rounded-full opacity-30 pointer-events-none" />

            <div className="relative z-10 w-full max-w-md px-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-gray-400">Sign in to continue to PromptForge</p>
                </div>

                <div className="glass-panel p-8 rounded-2xl border border-white/10 bg-white/[0.02] shadow-2xl backdrop-blur-xl">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                variant="secondary"
                                className="w-full h-11 flex items-center justify-center gap-2"
                                onClick={handleGoogleLogin}
                                disabled={isLoading || !clerkReady}
                            >
                                <svg className="h-5 w-5" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                Google
                            </Button>
                            <Button
                                variant="secondary"
                                className="w-full h-11 flex items-center justify-center gap-2"
                                onClick={handleGitHubLogin}
                                disabled={isLoading || !clerkReady}
                            >
                                <Github className="h-5 w-5" />
                                GitHub
                            </Button>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-white/10" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-[#0b0b0e] px-2 text-gray-500">Or continue with email</span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="Email address"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading || !clerkReady}
                            />
                            <Input
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading || !clerkReady}
                            />

                            {error && (
                                <div className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full h-11 text-base"
                                disabled={isLoading || !clerkReady}
                            >
                                {isLoading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </form>
                    </div>
                </div>

                <div className="mt-6 text-center text-sm">
                    <span className="text-gray-500">Don&apos;t have an account? </span>
                    <Link href="/signup" className="text-brand-purple hover:text-brand-violet font-medium transition-colors">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    )
}

import Link from "next/link"

export default function LegalLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="container mx-auto px-6 py-12 md:py-24">
            <div className="flex flex-col md:flex-row gap-12">
                <aside className="w-full md:w-64 shrink-0">
                    <div className="sticky top-32">
                        <h3 className="font-bold text-white mb-6 uppercase text-xs tracking-wider text-gray-500">Legal Documents</h3>
                        <nav className="flex flex-col gap-1">
                            <Link href="/terms" className="px-4 py-2 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors text-sm font-medium">
                                Terms of Use
                            </Link>
                            <Link href="/privacy" className="px-4 py-2 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors text-sm font-medium">
                                Privacy Policy
                            </Link>
                        </nav>
                    </div>
                </aside>

                <main className="flex-1 max-w-3xl">
                    {children}
                </main>
            </div>
        </div>
    )
}

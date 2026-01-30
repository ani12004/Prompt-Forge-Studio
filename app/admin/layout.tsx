import { isAdmin } from "@/lib/admin"
import { redirect } from "next/navigation"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const isAllowed = await isAdmin()

    if (!isAllowed) {
        redirect("/")
    }

    return (
        <div className="min-h-screen pt-24 pb-12 bg-[#050508] text-white">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-purple to-purple-400">
                        Admin Dashboard
                    </h1>
                    <p className="text-gray-400">Manage users and broadcasts</p>
                </div>
                {children}
            </div>
        </div>
    )
}

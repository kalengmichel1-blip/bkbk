import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, FileText, PlusCircle, LogOut } from 'lucide-react'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/admin/login')
    }

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className="w-64 bg-black border-r border-white/10 flex flex-col fixed h-full z-10">
                <div className="p-6 border-b border-white/10">
                    <Link href="/" className="text-xl font-bold tracking-tighter">
                        ADMIN
                    </Link>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link
                        href="/admin/dashboard"
                        className="flex items-center gap-3 px-4 py-2 rounded hover:bg-white/5 text-gray-300 hover:text-white transition-colors"
                    >
                        <LayoutDashboard size={20} />
                        Dashboard
                    </Link>
                    <Link
                        href="/admin/new"
                        className="flex items-center gap-3 px-4 py-2 rounded hover:bg-white/5 text-gray-300 hover:text-white transition-colors"
                    >
                        <PlusCircle size={20} />
                        New Article
                    </Link>
                    <div className="pt-4 mt-4 border-t border-white/10">
                        <div className="px-4 py-2 text-xs text-gray-500 uppercase font-semibold">
                            Account
                        </div>
                        <form action="/auth/signout" method="post">
                            <button
                                type="submit"
                                className="w-full flex items-center gap-3 px-4 py-2 rounded hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors"
                            >
                                <LogOut size={20} />
                                Sign Out
                            </button>
                        </form>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    )
}

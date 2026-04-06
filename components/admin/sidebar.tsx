import Link from 'next/link'
import { LayoutDashboard, FileText, PlusSquare, Users, Settings } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { canManageUsers } from '@/lib/utils/permissions'

export async function AdminSidebar() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const role = user?.user_metadata?.role

    return (
        <aside className="w-64 bg-black border-r border-white/10 flex flex-col fixed h-full z-10">
            <div className="p-6 border-b border-white/10">
                <Link href="/admin" className="text-xl font-serif font-bold tracking-tighter text-white">
                    Team BKBK
                    <span className="block text-xs font-sans font-normal text-gray-500 mt-1 tracking-widest uppercase">Admin Console</span>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                <Link
                    href="/admin/dashboard"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-all group"
                >
                    <LayoutDashboard size={20} className="group-hover:text-brand-gold transition-colors" />
                    Dashboard
                </Link>

                <Link
                    href="/admin/dashboard" // Reusing dashboard for list for now
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-all group"
                >
                    <FileText size={20} className="group-hover:text-brand-gold transition-colors" />
                    Articles
                </Link>

                <Link
                    href="/admin/new"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-all group"
                >
                    <PlusSquare size={20} className="group-hover:text-brand-gold transition-colors" />
                    New Article
                </Link>

                {canManageUsers(role) && (
                    <Link
                        href="/admin/users"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-all group"
                    >
                        <Users size={20} className="group-hover:text-brand-gold transition-colors" />
                        Users
                    </Link>
                )}

                <Link
                    href="/admin/settings"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-all group"
                >
                    <Settings size={20} className="group-hover:text-brand-gold transition-colors" />
                    Settings
                </Link>
            </nav>

            <div className="p-4 border-t border-white/10">
                <form action="/auth/signout" method="post">
                    <button
                        type="submit"
                        className="flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors w-full px-4 py-2"
                    >
                        <span className="transform rotate-180">➜</span> Sign Out
                    </button>
                </form>
            </div>
        </aside>
    )
}

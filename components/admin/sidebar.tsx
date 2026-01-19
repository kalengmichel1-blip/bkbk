"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FileText, Users, Settings, LogOut, PlusSquare } from "lucide-react"

const menuItems = [
    { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { title: "Articles", href: "/admin/dashboard", icon: FileText }, // Assuming /admin/dashboard lists articles, or should be /admin/articles? 
    // Wait, existing structure has /admin/dashboard. I'll rely on existing paths for now.
    { title: "New Article", href: "/admin/new", icon: PlusSquare },
    { title: "Users", href: "/admin/users", icon: Users },
    { title: "Settings", href: "/admin/settings", icon: Settings }, // Helper link, might not exist yet
]

export function AdminSidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-64 bg-charcoal-900 text-white min-h-screen flex flex-col fixed left-0 top-0 border-r border-charcoal-800">
            <div className="p-6 border-b border-charcoal-800">
                <h1 className="text-xl font-serif font-bold tracking-wide">Team BKBK</h1>
                <p className="text-xs text-brand-gold uppercase tracking-widest mt-1">Admin Console</p>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                                    ? "bg-brand-red text-white shadow-lg"
                                    : "text-gray-400 hover:bg-charcoal-800 hover:text-white"
                                }`}
                        >
                            <item.icon className={`h-5 w-5 ${isActive ? "text-white" : "text-gray-500 group-hover:text-white"}`} />
                            <span className="font-medium text-sm">{item.title}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-charcoal-800">
                <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-400 hover:bg-red-900/20 hover:text-red-400 transition-colors">
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium text-sm">Sign Out</span>
                </button>
            </div>
        </aside>
    )
}

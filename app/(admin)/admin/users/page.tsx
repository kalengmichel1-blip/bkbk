import { getUsers } from './actions'
import { UserForm } from '@/components/admin/user-form'
import { EditUserDialog } from '@/components/admin/edit-user-dialog'
import { User, Shield, Calendar } from 'lucide-react'
import { format } from 'date-fns'

import { createSessionClient } from '@/lib/appwrite/server'
import { redirect } from 'next/navigation'
import { canManageUsers } from '@/lib/utils/permissions'

export default async function UsersPage() {
    const { account } = await createSessionClient()
    
    if (!account) {
        redirect('/admin/dashboard')
    }

    const user = await account.get().catch(() => null);

    // Server-side permission check
    if (!user || !canManageUsers(user.prefs?.role)) {
        redirect('/admin/dashboard')
    }

    const users = await getUsers()

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
                    <p className="text-gray-400 mt-1">Manage access and onboard new administrators.</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* User List - Main content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                            <h3 className="font-bold flex items-center gap-2">
                                <User size={18} className="text-brand-gold" />
                                Active Users
                            </h3>
                            <span className="text-xs bg-brand-gold/20 text-brand-gold px-2 py-1 rounded-full font-mono">
                                {users.length}
                            </span>
                        </div>
                        <table className="w-full text-left">
                            <thead className="bg-black/20 text-xs text-gray-400 uppercase">
                                <tr>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {users.map((user: any) => (
                                    <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-charcoal to-black border border-white/10 flex items-center justify-center text-xs font-bold text-gray-400">
                                                    {user.full_name?.charAt(0) || user.username?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm text-white">{user.full_name || 'Unknown'}</p>
                                                    <p className="text-xs text-gray-500">@{user.username}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.role === 'admin' ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold bg-purple-500/20 text-purple-400 border border-purple-500/20 uppercase">
                                                    <Shield size={10} />
                                                    Admin
                                                </span>
                                            ) : user.role === 'editor' ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/20 uppercase">
                                                    <User size={10} />
                                                    Editor
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold bg-gray-500/20 text-gray-400 border border-gray-500/20 uppercase">
                                                    <User size={10} />
                                                    {user.role || 'Staff'}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-400">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={12} />
                                                {format(new Date(user.created_at || new Date()), 'MMM d, yyyy')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <EditUserDialog user={user} />
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Sidebar - Onboarding Form */}
                <div className="lg:col-span-1">
                    <div className="sticky top-8">
                        <UserForm />
                    </div>
                </div>
            </div>
        </div>
    )
}

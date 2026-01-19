'use client'

import { useState } from 'react'
import { updateUser } from '@/app/(admin)/admin/users/actions'
import { Loader2, Save, X, Edit2 } from 'lucide-react'

type User = {
    id: string
    full_name: string
    email?: string
    username: string
    role: string
}

export function EditUserDialog({ user }: { user: User }) {
    const [isOpen, setIsOpen] = useState(false)
    const [firstName, setFirstName] = useState(user.full_name || '')
    const [role, setRole] = useState(user.role || 'staff')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        const res = await updateUser(user.id, firstName, role)

        if (res.error) {
            setMessage({ type: 'error', text: res.error })
        } else {
            setMessage({ type: 'success', text: 'User updated successfully!' })
            setIsOpen(false)
        }
        setLoading(false)
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                title="Edit User"
            >
                <Edit2 size={16} />
            </button>
        )
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-gray-900 border border-white/10 rounded-xl w-full max-w-md shadow-2xl relative">
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    <X size={20} />
                </button>

                <div className="p-6">
                    <h2 className="text-xl font-bold mb-1">Edit User</h2>
                    <p className="text-sm text-gray-400 mb-6 font-mono text-xs">{user.id}</p>

                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Name</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                className="w-full p-3 rounded-lg border border-white/10 bg-black/20 text-white focus:outline-none focus:border-brand-gold"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Role</label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full p-3 rounded-lg border border-white/10 bg-black/20 text-white focus:outline-none focus:border-brand-gold"
                            >
                                <option value="admin">Admin (Full Access)</option>
                                <option value="editor">Editor (Can Publish)</option>
                                <option value="staff">Staff (Draft Only)</option>
                            </select>
                        </div>

                        {message && (
                            <div className={`p-3 rounded text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                {message.text}
                            </div>
                        )}

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 rounded text-gray-400 hover:text-white hover:bg-white/5 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-brand-gold text-black font-bold px-4 py-2 rounded hover:bg-yellow-500 transition-colors flex items-center gap-2"
                            >
                                {loading && <Loader2 className="animate-spin w-4 h-4" />}
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

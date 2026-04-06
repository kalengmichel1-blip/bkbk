'use client'

import { useState } from 'react'
import { createClient } from '@/lib/appwrite/client'
import { Loader2, Lock, User, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(null)

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            setLoading(false)
            return
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters")
            setLoading(false)
            return
        }

        const { account } = createClient()

        try {
            await account.updatePassword(password)
            setSuccess("Password updated successfully")
            setPassword('')
            setConfirmPassword('')
        } catch (error: any) {
            setError(error.message)
        }
        
        setLoading(false)
    }

    return (
        <div>
            <div className="mb-8 border-b border-white/10 pb-6">
                <h1 className="text-3xl font-bold mb-2">Settings</h1>
                <p className="text-gray-400">Manage your account and preferences.</p>
            </div>

            <div className="space-y-8">
                {/* Profile Section (Placeholder) */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-blue-500/20 text-blue-400 rounded-full">
                            <User size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">Profile Information</h3>
                            <p className="text-gray-400 text-sm">Update your account details.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-black/20 rounded border border-white/5">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Role</label>
                            <p className="font-mono text-sm">Administrator</p>
                        </div>
                        <div className="p-4 bg-black/20 rounded border border-white/5">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Email</label>
                            <p className="font-mono text-sm">HIDDEN</p>
                        </div>
                    </div>
                </div>

                {/* Password Section */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-brand-gold/20 text-brand-gold rounded-full">
                            <Lock size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">Security</h3>
                            <p className="text-gray-400 text-sm">Update your password.</p>
                        </div>
                    </div>

                    <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">New Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                className="w-full p-3 rounded-lg border border-white/10 bg-white/5 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                className="w-full p-3 rounded-lg border border-white/10 bg-white/5 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        {error && <div className="bg-red-500/10 text-red-400 p-3 rounded border border-red-500/20 text-sm">{error}</div>}
                        {success && <div className="bg-green-500/10 text-green-400 p-3 rounded border border-green-500/20 text-sm">{success}</div>}

                        <button
                            type="submit"
                            disabled={loading || !password}
                            className="bg-brand-gold text-charcoal-900 font-bold px-6 py-3 rounded-lg hover:bg-yellow-500 transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg"
                        >
                            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <><Save size={18} /> Update Password</>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

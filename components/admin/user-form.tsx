'use client'

import { useState } from 'react'
import { createUser } from '@/app/(admin)/admin/users/actions'
import { Loader2, UserPlus, CheckCircle, AlertCircle } from 'lucide-react'

export function UserForm() {
    const [firstName, setFirstName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        const res = await createUser(firstName, email, password)

        if (res.error) {
            setMessage({ type: 'error', text: res.error })
        } else {
            setMessage({ type: 'success', text: 'User created successfully!' })
            setFirstName('')
            setEmail('')
            setPassword('')
        }
        setLoading(false)
    }

    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-xl">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
                <div className="p-2 bg-brand-gold/20 rounded-full text-brand-gold">
                    <UserPlus className="w-4 h-4" />
                </div>
                Invite New User
            </h2>
            <form onSubmit={handleCreate} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Name</label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        placeholder="Full Name"
                        className="w-full p-3 rounded-lg border border-white/10 bg-black/20 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition-all"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="user@example.com"
                        className="w-full p-3 rounded-lg border border-white/10 bg-black/20 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition-all"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Default Password</label>
                    <input
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Strong password"
                        className="w-full p-3 rounded-lg border border-white/10 bg-black/20 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition-all"
                    />
                </div>

                {message && (
                    <div className={`p-3 rounded text-sm flex items-start gap-2 ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                        {message.type === 'success' ? <CheckCircle size={16} className="mt-0.5" /> : <AlertCircle size={16} className="mt-0.5" />}
                        {message.text}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 flex justify-center items-center gap-2 shadow-lg"
                >
                    {loading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Create Account'}
                </button>
            </form>

            <div className="mt-4 pt-4 border-t border-white/5 text-xs text-gray-500 leading-relaxed">
                New users can log in immediately with these credentials.
            </div>
        </div>
    )
}

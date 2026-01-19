'use client'

import { useState } from 'react'
import { createUser } from './actions'
import { Loader2, UserPlus, CheckCircle, AlertCircle } from 'lucide-react'

export default function UsersPage() {
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
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-serif font-bold tracking-tight">Team Management</h1>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <UserPlus className="w-5 h-5" />
                    Onboard New Team Member
                </h2>
                <form onSubmit={handleCreate} className="space-y-4 max-w-lg">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-300">Name</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            placeholder="Full Name"
                            className="w-full p-3 rounded bg-black/50 border border-white/10 text-white focus:border-white/30 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-300">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="user@example.com"
                            className="w-full p-3 rounded bg-black/50 border border-white/10 text-white focus:border-white/30 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-300">Default Password</label>
                        <input
                            type="text"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Strong password"
                            className="w-full p-3 rounded bg-black/50 border border-white/10 text-white focus:border-white/30 outline-none"
                        />
                    </div>

                    {message && (
                        <div className={`p-4 rounded flex items-center gap-2 ${message.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                            {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                            {message.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-white text-black font-bold py-3 px-6 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading && <Loader2 className="animate-spin w-4 h-4" />}
                        Create Account
                    </button>
                </form>
            </div>

            <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm text-blue-200">
                <p><strong>Note:</strong> Created users will be able to log in to this dashboard immediately using the credentials you provide here.</p>
            </div>
        </div>
    )
}

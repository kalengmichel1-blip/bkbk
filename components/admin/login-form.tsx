'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loginAction } from '@/app/(admin)/admin/actions'
import { Loader2 } from 'lucide-react'

export function LoginForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const result = await loginAction(formData)

        if (result.error) {
            setError(result.error)
            setLoading(false)
        } else {
            router.push('/admin/dashboard')
            router.refresh()
        }
    }

    return (
        <form onSubmit={handleLogin} className="space-y-4 w-full max-w-md">
            <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email</label>
                <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@example.com"
                    className="w-full p-3 rounded-lg border border-white/10 bg-white/5 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition-all"
                />
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Password</label>
                <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full p-3 rounded-lg border border-white/10 bg-white/5 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition-all"
                />
            </div>

            <div className="flex justify-end">
                <a href="/admin/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                    Forgot Password?
                </a>
            </div>

            {error && <div className="bg-red-50 text-red-600 p-3 rounded border border-red-200 text-sm">{error}</div>}
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-gold text-charcoal-900 font-bold py-3 rounded-lg hover:bg-yellow-500 transition-all disabled:opacity-50 flex justify-center items-center shadow-lg hover:shadow-brand-gold/20"
            >
                {loading ? <Loader2 className="animate-spin" /> : 'Sign In'}
            </button>
        </form>
    )
}

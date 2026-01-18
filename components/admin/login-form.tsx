'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

export function LoginForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            router.push('/admin/dashboard')
            router.refresh()
        }
    }

    return (
        <form onSubmit={handleLogin} className="space-y-4 w-full max-w-md">
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter admin email"
                    className="w-full p-3 rounded-md border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all shadow-sm"
                />
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter password"
                    className="w-full p-3 rounded-md border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all shadow-sm"
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
                className="w-full bg-brand-charcoal text-white font-bold py-3 rounded hover:bg-black transition-colors disabled:opacity-50 flex justify-center items-center shadow-lg hover:shadow-xl"
            >
                {loading ? <Loader2 className="animate-spin" /> : 'Login'}
            </button>
        </form>
    )
}

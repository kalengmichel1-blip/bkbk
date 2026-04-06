'use client'

import { useState } from 'react'
import { createClient } from '@/lib/appwrite/client'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        // Determine the redirect URL (use the current window origin in the browser, specifically targeting the update-password page)
        // We fallback to a hardcoded values if window is undefined (SSR), though this is a client component.
        // Ideally, we want https://kikayabinkarubi.net/auth/callback?next=/admin/update-password

        const origin = window.location.origin
        const redirectTo = `${origin}/auth/callback?next=/admin/update-password`

        const { account } = createClient()

        try {
            await account.createRecovery(
                email,
                redirectTo
            )
            setMessage({ type: 'success', text: 'Check your email for the password reset link.' })
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message })
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <Link href="/admin/login" className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                </Link>

                <h1 className="text-2xl font-serif font-bold mb-2 text-gray-900">Reset Password</h1>
                <p className="text-gray-600 mb-6 text-sm">Enter your email address to receive a password reset link.</p>

                <form onSubmit={handleReset} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Enter your email"
                            className="w-full p-3 rounded-md border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all shadow-sm"
                        />
                    </div>

                    {message && (
                        <div className={`p-3 rounded text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                            {message.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-charcoal text-white font-bold py-3 rounded hover:bg-black transition-colors disabled:opacity-50 flex justify-center items-center shadow-lg hover:shadow-xl"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Send Reset Link'}
                    </button>
                </form>
            </div>
        </div>
    )
}

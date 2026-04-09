'use client'

import { useState } from 'react'
import { seedPosts } from '@/app/(admin)/admin/actions'
import { RefreshCw, Download } from 'lucide-react'

export function ImportButton() {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const handleImport = async () => {
        if (!confirm('This will import/update posts from content/posts.json. Continue?')) return

        setLoading(true)
        setMessage('')
        try {
            const result = await seedPosts()
            setMessage(`Success! Imported ${result.count} posts.`)
            // Refresh logic is handled by server action revalidatePath
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : 'Import failed';
            setMessage(`Error: ${msg}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-end gap-2">
            <button
                onClick={handleImport}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50 transition-colors text-sm font-medium"
            >
                {loading ? <RefreshCw className="animate-spin" size={16} /> : <Download size={16} />}
                {loading ? 'Importing...' : 'Import Legacy Content'}
            </button>
            {message && <p className="text-xs text-white/70">{message}</p>}
        </div>
    )
}

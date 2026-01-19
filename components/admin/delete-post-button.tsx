'use client'

import { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { deletePost } from '@/app/(admin)/admin/actions'

export function DeletePostButton({ id }: { id: string }) {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
            try {
                setIsDeleting(true)
                await deletePost(id)
            } catch (error) {
                alert('Failed to delete post')
                console.error(error)
                setIsDeleting(false)
            }
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 hover:bg-red-500/10 rounded text-red-400 hover:text-red-300 disabled:opacity-50"
            title="Delete"
        >
            {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
        </button>
    )
}

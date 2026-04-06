'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, X, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface Props {
    value: string
    onChange: (url: string) => void
}

import { uploadImage } from '@/app/(admin)/admin/upload/action'

export function ImageUploader({ value, onChange }: Props) {
    const [uploading, setUploading] = useState(false)

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true)
            const file = e.target.files?.[0]
            if (!file) return

            const formData = new FormData()
            formData.append('file', file)

            const result = await uploadImage(formData)

            if (result.error) {
                throw new Error(result.error)
            }

            if (result.url) {
                onChange(result.url)
            }
        } catch (error: any) {
            alert(`Error uploading image: ${error.message}`)
            console.error(error)
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="space-y-4">
            <div className="border-2 border-dashed border-white/10 rounded-lg p-8 flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 transition-colors relative">
                {value ? (
                    <div className="relative w-full aspect-video">
                        <Image
                            src={value}
                            alt="Featured image"
                            fill
                            className="object-cover rounded"
                        />
                        <button
                            onClick={() => onChange('')}
                            className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ) : (
                    <label className="cursor-pointer flex flex-col items-center w-full h-full">
                        {uploading ? (
                            <Loader2 className="animate-spin mb-2" />
                        ) : (
                            <Upload className="mb-2" />
                        )}
                        <span className="text-sm font-medium">
                            {uploading ? 'Uploading...' : 'Click to upload featured image'}
                        </span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleUpload}
                            disabled={uploading}
                            className="hidden"
                        />
                    </label>
                )}
            </div>
        </div>
    )
}

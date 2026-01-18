'use server'

import { createAdminClient } from '@/lib/supabase/admin'

export async function uploadImage(formData: FormData) {
    const file = formData.get('file') as File
    if (!file) {
        return { error: 'No file provided' }
    }

    const supabase = createAdminClient()
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${fileName}`

    // Convert file to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    const { data, error } = await supabase.storage
        .from('images')
        .upload(filePath, buffer, {
            contentType: file.type,
            upsert: false
        })

    if (error) {
        console.error('Upload error:', error)
        return { error: error.message }
    }

    const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

    return { success: true, url: publicUrl }
}

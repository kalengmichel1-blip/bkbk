'use server'

import { createAdminClient } from '@/lib/appwrite/server'
import { ID } from 'node-appwrite'
import { InputFile } from 'node-appwrite/file'

const STORAGE_BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID!

export async function uploadImage(formData: FormData) {
    const file = formData.get('file') as File
    if (!file) {
        return { error: 'No file provided' }
    }

    const { storage } = await createAdminClient()
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    try {
        const uploadedFile = await storage.createFile(
            STORAGE_BUCKET_ID,
            ID.unique(),
            InputFile.fromBuffer(buffer, fileName)
        )

        // Generate a public URL using the endpoint + project ID
        // Or using Appwrite Storage SDK
        // Warning: Requires NEXT_PUBLIC_APPWRITE_ENDPOINT and NEXT_PUBLIC_APPWRITE_PROJECT
        const publicUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${STORAGE_BUCKET_ID}/files/${uploadedFile.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`

        return { success: true, url: publicUrl }
    } catch (error) {
        console.error('Upload error:', error)
        const message = error instanceof Error ? error.message : 'Upload failed';
        return { error: message }
    }
}

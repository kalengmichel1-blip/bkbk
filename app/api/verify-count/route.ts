import { createAdminClient } from '@/lib/appwrite/server'
import { NextResponse } from 'next/server'
import { Query } from 'node-appwrite'

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!
const POSTS_COLLECTION = process.env.NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID!

export async function GET() {
    const { databases } = await createAdminClient()

    try {
        const result = await databases.listDocuments(DB_ID, POSTS_COLLECTION, [Query.limit(1)]);
        return NextResponse.json({ count: result.total })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Server error';
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

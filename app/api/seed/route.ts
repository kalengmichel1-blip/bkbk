import { createSessionClient } from '@/lib/appwrite/server'
import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'
import { ID } from 'node-appwrite'

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!
const POSTS_COLLECTION = process.env.NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID!

export async function GET() {
    const { account, databases } = await createSessionClient()
    const user = account ? await account.get().catch(() => null) : null

    if (!user || !databases) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const jsonDirectory = path.join(process.cwd(), 'content')
        const fileContents = fs.readFileSync(jsonDirectory + '/posts.json', 'utf8')
        const posts = JSON.parse(fileContents)

interface SeedPost {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    featured_image_url: string;
    date: string;
}

        const formattedPosts = (posts as SeedPost[]).map((post) => ({
            // We can't easily preserve the ID if it conflicts with existing auto-increment, 
            // but we can try letting Supabase handle IDs or mapping them if crucial.
            // For simplicity and avoiding conflicts, let's let Supabase generate new IDs 
            // or just try to insert. If these are "legacy" posts, maybe we want to keep IDs?
            // Let's omit ID to be safe and let Supabase generate new ones, 
            // UNLESS the user explicitly wants to keep them. 
            // Given "older articles", preserving IDs might be nice for URLs if they depended on it,
            // but the slug is the main identifier for URLs usually.
            // Let's use the slug as the unique key.

            title: post.title.replace(/&#8220;|&#8221;/g, '"').replace(/&#8217;/g, "'").replace(/&nbsp;/g, ' '), // Basic cleanup
            slug: post.slug,
            content: post.content,
            excerpt: post.excerpt,
            featured_image: post.featured_image_url,
            status: 'published',
            published_at: post.date,
            created_at: post.date,
            author_id: user.$id
        }))

        for (const post of formattedPosts) {
            try {
                await databases.createDocument(DB_ID, POSTS_COLLECTION, ID.unique(), post);
            } catch (err) {
                console.error('Appwrite error:', err)
                const message = err instanceof Error ? err.message : 'Import failed';
                return NextResponse.json({ error: message }, { status: 500 })
            }
        }

        return NextResponse.json({ message: `Successfully imported ${posts.length} posts` })

    } catch (error) {
        console.error('Import error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

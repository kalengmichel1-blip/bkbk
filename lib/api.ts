import { createClient } from '@/lib/appwrite/client'
import { Query } from 'node-appwrite'

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!
const POSTS_COLLECTION = process.env.NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID!

export interface Post {
    id: string
    title: string
    slug: string
    excerpt: string
    content: string
    date: string
    featuredImage: string
    author: {
        name: string
        avatar: string
    }
}

interface AppwritePost {
    $id: string
    id?: number | string
    title: string
    slug: string
    excerpt: string
    content: string
    published_at?: string
    created_at?: string
    $createdAt?: string
    featured_image: string
    author?: {
        full_name: string | null
        avatar_url: string | null
        username: string | null
    }
}

export async function getAllPosts(): Promise<Post[]> {
    const { databases } = createClient()

    try {
        const { documents: data } = await databases.listDocuments(DB_ID, POSTS_COLLECTION, [
            Query.equal('status', 'published'),
            Query.orderDesc('published_at')
        ])

        if (!data) return []

        return (data as unknown as AppwritePost[]).map((post) => ({
            id: (post.$id || post.id || '').toString(),
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            content: post.content,
            date: post.published_at || post.created_at || post.$createdAt || '',
            featuredImage: post.featured_image,
            author: {
                name: post.author?.full_name || 'Team BKBK',
                avatar: post.author?.avatar_url || '',
            },
        }))
    } catch (error) {
        console.error('Error fetching all posts:', error)
        return []
    }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
    const { databases } = createClient()

    try {
        const { documents } = await databases.listDocuments(DB_ID, POSTS_COLLECTION, [
            Query.equal('slug', slug),
            Query.limit(1)
        ])

        if (!documents || documents.length === 0) return null

        const post = documents[0] as unknown as AppwritePost

        return {
            id: (post.$id || post.id || '').toString(),
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            content: post.content,
            date: post.published_at || post.created_at || post.$createdAt || '',
            featuredImage: post.featured_image,
            author: {
                name: post.author?.full_name || 'Team BKBK',
                avatar: post.author?.avatar_url || '',
            },
        }
    } catch (error) {
        console.error('Error fetching post by slug:', error)
        return null
    }
}

export async function getMorePosts(slug: string, limit = 3): Promise<Post[]> {
    const { databases } = createClient()

    try {
        const { documents: data } = await databases.listDocuments(DB_ID, POSTS_COLLECTION, [
            Query.equal('status', 'published'),
            Query.notEqual('slug', slug),
            Query.orderDesc('published_at'),
            Query.limit(limit)
        ])

        if (!data) return []

        return (data as unknown as AppwritePost[]).map((post) => ({
            id: (post.$id || post.id || '').toString(),
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            content: post.content,
            date: post.published_at || post.created_at || post.$createdAt || '',
            featuredImage: post.featured_image,
            author: {
                name: post.author?.full_name || 'Team BKBK',
                avatar: post.author?.avatar_url || '',
            },
        }))
    } catch (error) {
        console.error('Error fetching more posts:', error)
        return []
    }
}

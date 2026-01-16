import { createClient } from '@/lib/supabase/client'

// Replicating the shape or simplifying? Let's simplify and I will update components.
// The components seem to use a lot of WP specific nesting. I'll define a clean interface.

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

interface SupabasePost {
    id: number
    title: string
    slug: string
    excerpt: string
    content: string
    published_at: string
    created_at: string
    featured_image: string
    author: {
        full_name: string | null
        avatar_url: string | null
        username: string | null
    }
}

export async function getAllPosts(): Promise<Post[]> {
    const supabase = createClient()

    const { data } = await supabase
        .from('posts')
        .select('*, author:profiles(full_name, avatar_url, username)')
        .eq('status', 'published')
        .order('published_at', { ascending: false })

    if (!data) return []

    return (data as unknown as SupabasePost[]).map((post) => ({
        id: post.id.toString(), // Post interface uses string ID
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        date: post.published_at || post.created_at,
        featuredImage: post.featured_image,
        author: {
            name: post.author?.full_name || 'Team BKBK', // Fallback
            avatar: post.author?.avatar_url || '',
        },
    }))
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
    const supabase = createClient()

    const { data } = await supabase
        .from('posts')
        .select('*, author:profiles(full_name, avatar_url, username)')
        .eq('slug', slug)
        // .eq('status', 'published') // Allow drafts if previewing? For now strictly published for public.
        .single()

    if (!data) return null

    const post = data as unknown as SupabasePost

    return {
        id: post.id.toString(),
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        date: post.published_at || post.created_at,
        featuredImage: post.featured_image,
        author: {
            name: post.author?.full_name || 'Team BKBK',
            avatar: post.author?.avatar_url || '',
        },
    }
}

export async function getMorePosts(slug: string, limit = 3): Promise<Post[]> {
    const supabase = createClient()

    const { data } = await supabase
        .from('posts')
        .select('*, author:profiles(full_name, avatar_url, username)')
        .eq('status', 'published')
        .neq('slug', slug)
        .order('published_at', { ascending: false })
        .limit(limit)

    if (!data) return []

    return (data as unknown as SupabasePost[]).map((post) => ({
        id: post.id.toString(),
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        date: post.published_at || post.created_at,
        featuredImage: post.featured_image,
        author: {
            name: post.author?.full_name || 'Team BKBK',
            avatar: post.author?.avatar_url || '',
        },
    }))
}

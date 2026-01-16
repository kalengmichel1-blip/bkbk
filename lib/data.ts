import { createClient } from "@supabase/supabase-js";

export interface Post {
    id: number;
    date: string;
    slug: string;
    title: string;
    content: string;
    excerpt: string;
    author_id: string;
    author_name: string;
    categories: number[];
    featured_media_id: number;
    featured_image_url: string | null;
    category_names?: string[];
}

export interface Category {
    id: number;
    count: number;
    description: string;
    link: string;
    name: string;
    slug: string;
    taxonomy: string;
    parent: number;
}

export function getCategoryName(_id: number): string {
    return "News";
}

// Create a safe client for static generation/public fetching
const getSupabase = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Return a dummy client if config is missing or invalid to allow build to pass
    if (!url || !key || url === 'your-project-url' || !url.startsWith('http')) {
        console.warn('Supabase not configured. Returning mock client.');
        return {
            from: () => ({
                select: () => ({
                    eq: () => ({
                        single: async () => ({ data: null, error: null }),
                        order: () => ({ limit: async () => ({ data: [] }) }),
                    }),
                    order: () => ({ limit: async () => ({ data: [] }) }),
                }),
            })
        } as any;
    }

    return createClient(url, key);
}

function mapSupabasePost(post: any): Post {
    return {
        id: post.id,
        date: post.published_at || post.created_at,
        slug: post.slug,
        title: post.title,
        content: post.content || '',
        excerpt: post.excerpt || '',
        author_id: post.author_id,
        author_name: post.author?.full_name || 'Team BKBK',
        categories: [],
        featured_media_id: 0,
        featured_image_url: post.featured_image,
        category_names: ['News'],
    };
}

export async function getAllPosts(): Promise<Post[]> {
    const supabase = getSupabase();
    const { data } = await supabase
        .from('posts')
        .select('*, author:profiles(full_name)')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

    if (!data) return [];

    // @ts-ignore
    return data.map(mapSupabasePost);
}

export async function getLatestPosts(count: number): Promise<Post[]> {
    const supabase = getSupabase();
    const { data } = await supabase
        .from('posts')
        .select('*, author:profiles(full_name)')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(count);

    if (!data) return [];

    // @ts-ignore
    return data.map(mapSupabasePost);
}

export async function getPostsByCategory(_slug: string): Promise<Post[]> {
    return getAllPosts();
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
    const supabase = getSupabase();
    const { data } = await supabase
        .from('posts')
        .select('*, author:profiles(full_name)')
        .eq('slug', slug)
        .single();

    if (!data) return undefined;

    // @ts-ignore
    return mapSupabasePost(data);
}

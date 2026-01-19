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
    const url = 'https://xhlioblejhalazlgvpiq.supabase.co';
    const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhobGlvYmxlamhhbGF6bGd2cGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MjQ0ODUsImV4cCI6MjA4NDAwMDQ4NX0.l_Se7PL3ELAdo5jawWxTsCYiCQB5y5l_lW2KxUBhFtU';

    // Return a dummy client if config is missing or invalid to allow build to pass
    if (!url || !key) {
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

import { getBackfillImage } from "@/lib/image-map";

function mapSupabasePost(post: any): Post {
    // 1. Direct ID Override (Highest Priority)
    let finalImage = getBackfillImage(post.id);

    // 2. Keyword fallback
    // We only apply fallback if the current image is BROKEN (null, wp-content, wikimedia)
    // AND it is NOT a fresh upload to Supabase Storage.
    const isBroken = !post.featured_image || post.featured_image.includes('wp-content') || post.featured_image.includes('wikimedia');
    const isSupabaseUpload = post.featured_image && post.featured_image.includes('supabase.co');

    if (!finalImage && isBroken && !isSupabaseUpload) {
        // Note: Removed the aggressive "post.id > 560" check because it was overwriting valid new uploads.

        const t = post.title.toLowerCase();

        if (t.includes('trump') || t.includes('usa') || t.includes('washington') || t.includes('états-unis')) finalImage = '/assets/trump.jpg';
        else if (t.includes('tshisekedi') || t.includes('fatshi') || t.includes('chef de l\'etat')) finalImage = '/assets/tshisekedi.jpg';
        else if (t.includes('kabila') || t.includes('jkk')) finalImage = '/assets/kabila.jpg';
        else if (t.includes('kagame') || t.includes('rwanda')) finalImage = '/assets/kagame.jpg';
        else if (t.includes('covid') || t.includes('coronavirus') || t.includes('santé') || t.includes('virus') || t.includes('épidémie')) finalImage = '/assets/covid.png';
        else if (t.includes('music') || t.includes('musique') || t.includes('jazz') || t.includes('artiste') || t.includes('album')) finalImage = '/assets/music.png';
        else if (t.includes('sadc')) finalImage = '/assets/sadc-flag.svg';
        else if (t.includes('eac')) finalImage = '/assets/eac-flag.svg';
        else if (t.includes('rdc') || t.includes('congo') || t.includes('kinshasa')) finalImage = '/assets/drc-flag.svg';
        else if (t.includes('onu') || t.includes('un ') || t.includes('nations unies')) finalImage = '/assets/un-flag.svg';

        // 3. Catch-all for "Top 100" (heuristic) if still undefined
        // If we really want to ensure they have an image, fallback to DRC flag
        if (!finalImage) {
            finalImage = '/assets/drc-flag.svg';
        }
    }

    // 3. Fallback to DB value if valid, or keep override
    finalImage = finalImage || post.featured_image;

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
        featured_image_url: finalImage,
        category_names: ['News'],
    };
}

export async function getAllPosts(): Promise<Post[]> {
    const supabase = getSupabase();

    // Note: 'author:profiles(full_name)' join removed due to prod schema issue
    const { data } = await supabase
        .from('posts')
        .select('*')
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
        .select('*')
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
        .select('*')
        .eq('slug', slug)
        .single();

    if (!data) return undefined;

    // @ts-ignore
    return mapSupabasePost(data);
}

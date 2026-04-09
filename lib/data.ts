import { createClient } from "@/lib/appwrite/client";
import { Query } from "node-appwrite";

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const POSTS_COLLECTION = process.env.NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID!;

export interface Post {
    id: string | number;
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

export function getCategoryName(_categoryId: number): string {
    return "News";
}

// Create a safe client for static generation/public fetching
const getAppwrite = () => {
    // If we're missing config, we can optionally handle it, though Appwrite will throw
    return createClient();
}

import { getBackfillImage } from "@/lib/image-map";

interface AppwriteDocument {
    $id?: string;
    $createdAt?: string;
    id?: number | string;
    title: string;
    slug: string;
    content?: string;
    excerpt?: string;
    published_at?: string;
    created_at?: string;
    featured_image?: string;
    author_id?: string;
    author?: {
        full_name?: string | null;
        avatar_url?: string | null;
    };
}

function mapSupabasePost(post: AppwriteDocument): Post {
    // 1. Direct ID Override (Highest Priority) — only applies for legacy numeric IDs
    let finalImage = typeof post.id === 'number' ? getBackfillImage(post.id) : null;

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
    finalImage = finalImage ?? post.featured_image ?? null;

    return {
        id: post.$id || post.id || 0, // Support Appwrite ID or legacy ID if preserved
        date: post.published_at || post.created_at || post.$createdAt || '',
        slug: post.slug,
        title: post.title,
        content: post.content || '',
        excerpt: post.excerpt || '',
        author_id: post.author_id || '',
        author_name: post.author?.full_name || 'Team BKBK',
        categories: [],
        featured_media_id: 0,
        featured_image_url: finalImage,
        category_names: ['News'],
    };
}

export async function getAllPosts(): Promise<Post[]> {
    const { databases } = getAppwrite();

    try {
        const { documents } = await databases.listDocuments(DB_ID, POSTS_COLLECTION, [
            Query.equal('status', 'published'),
            Query.orderDesc('published_at'),
            Query.limit(100),
        ]);

        return (documents as unknown as AppwriteDocument[]).map(mapSupabasePost);
    } catch (e) {
        console.error("Error fetching all posts:", e);
        return [];
    }
}

export async function getLatestPosts(count: number): Promise<Post[]> {
    const { databases } = getAppwrite();

    try {
        const { documents } = await databases.listDocuments(DB_ID, POSTS_COLLECTION, [
            Query.equal('status', 'published'),
            Query.orderDesc('published_at'),
            Query.limit(count)
        ]);

        return (documents as unknown as AppwriteDocument[]).map(mapSupabasePost);
    } catch (e) {
        console.error("Error fetching latest posts:", e);
        return [];
    }
}

export async function getPostsByCategory(_categorySlug: string): Promise<Post[]> {
    return getAllPosts();
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
    const { databases } = getAppwrite();

    try {
        const { documents } = await databases.listDocuments(DB_ID, POSTS_COLLECTION, [
            Query.equal('slug', slug),
            Query.limit(1)
        ]);

        if (documents.length === 0) return undefined;

        return mapSupabasePost(documents[0] as unknown as AppwriteDocument);
    } catch (e) {
        console.error("Error fetching post by slug:", e);
        return undefined;
    }
}

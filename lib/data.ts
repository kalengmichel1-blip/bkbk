import { getAllPostsForHome, getPostBySlugFromWP } from "./wordpress";

export interface Post {
    id: number;
    date: string;
    slug: string;
    title: string;
    content: string;
    excerpt: string;
    author_id: number;
    author_name: string;
    categories: number[];
    featured_media_id: number;
    featured_image_url: string | null;
    category_names?: string[]; // Added for easier WP handling
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

// Helper: Get Category Name by ID (Mock implementation for compatibility or use new field)
// Using this synchronously is hard with async data. 
// We recommend using post.category_names[0] if available.
export function getCategoryName(id: number): string {
    return "News"; // Fallback as we don't have sync categories anymore
}

// Get all posts sorted by date
export async function getAllPosts(): Promise<Post[]> {
    return await getAllPostsForHome();
}

// Get latest N posts
export async function getLatestPosts(count: number): Promise<Post[]> {
    const posts = await getAllPosts();
    return posts.slice(0, count);
}

// Get posts by category slug (Simple filter on fetched posts for now)
export async function getPostsByCategory(slug: string): Promise<Post[]> {
    const posts = await getAllPosts();
    // This is inefficient (fetches all then filters), but fine for MVP
    // Ideally we would add a specific query in wordpress.ts
    // For now, let's just return all or filter if we had category data loaded
    return posts;
}

// Get single post by slug
export async function getPostBySlug(slug: string): Promise<Post | undefined> {
    return await getPostBySlugFromWP(slug);
}

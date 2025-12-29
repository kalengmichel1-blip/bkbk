import postsData from "@/content/posts.json";
import categoriesData from "@/content/categories.json";
import { compareDesc, parseISO } from "date-fns";

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

// Cast imported JSON to types
const posts = postsData as Post[];
const categories = categoriesData as Category[];

// Helper: Get Category Name by ID
export function getCategoryName(id: number): string {
    const cat = categories.find((c) => c.id === id);
    return cat ? cat.name : "News";
}

// Helper: Get Category Slug by ID
export function getCategorySlug(id: number): string {
    const cat = categories.find((c) => c.id === id);
    return cat ? cat.slug : "news";
}

// Get all posts sorted by date
export function getAllPosts(): Post[] {
    return posts.sort((a, b) => compareDesc(parseISO(a.date), parseISO(b.date)));
}

// Get latest N posts
export function getLatestPosts(count: number): Post[] {
    return getAllPosts().slice(0, count);
}

// Get posts by category slug
export function getPostsByCategory(slug: string): Post[] {
    const cat = categories.find((c) => c.slug === slug);
    if (!cat) return [];
    return getAllPosts().filter((p) => p.categories.includes(cat.id));
}

// Get single post by slug
export function getPostBySlug(slug: string): Post | undefined {
    return posts.find((p) => p.slug === slug);
}

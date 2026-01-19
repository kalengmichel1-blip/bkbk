import Link from "next/link";
import { getPostsByCategory } from "@/lib/data";
import { NewsGrid } from "@/components/news-grid";
import { ArrowLeft } from "lucide-react";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    // Pre-render common categories
    // This would ideally come from a CMS or config
    const predefinedCategories = ["news", "analysis", "opinion", "la-plume-de-bkbk", "call-of-duties", "la-voix-des-autres"];
    return predefinedCategories.map((slug) => ({
        slug: slug,
    }));
}

export default async function CategoryPage({ params }: PageProps) {
    const { slug } = await params;

    // Note: Local data lookup might be loose with slug matching, so we ensure exact match or fallback
    const posts = await getPostsByCategory(slug);
    // Get pretty name: currently our helper takes ID, but we can infer or use a slug mapper.
    // For now, let's just capitalize or use a map if getCategoryName fails us without an ID.
    const categoryName = slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());

    if (posts.length === 0) {
        // It's possible we have a valid category but no posts, or invalid category.
        // For a better UX, we'll show empty state rather than 404 if it's a known route, 
        // but strictly for "old articles not seen", filtering by known slugs is key.
    }

    return (
        <div className="bg-white min-h-screen pb-20">
            <div className="container mx-auto px-4 py-8 md:py-12">
                <header className="mb-12 border-b border-gray-100 pb-8">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <Link href="/" className="hover:text-brand-red flex items-center gap-1">
                            <ArrowLeft className="h-4 w-4" /> Back to Home
                        </Link>
                        <span>/</span>
                        <span className="text-gray-900 font-medium capitalize">{categoryName}</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
                        {categoryName}
                    </h1>
                    <p className="text-gray-500 text-lg max-w-2xl">
                        Explore the latest updates, analysis, and perspectives in {categoryName}.
                    </p>
                </header>

                {posts.length > 0 ? (
                    <NewsGrid posts={posts} />
                ) : (
                    <div className="py-20 text-center">
                        <p className="text-gray-500">No articles found in this category.</p>
                        <Link href="/" className="text-brand-red hover:underline mt-2 inline-block">
                            Return to Home
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

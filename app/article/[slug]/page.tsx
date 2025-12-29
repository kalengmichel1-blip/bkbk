import Link from "next/link";
import Image from "next/image";
import { getPostBySlug, getCategoryName, getAllPosts } from "@/lib/data";
import { notFound } from "next/navigation";
import { format, parseISO } from "date-fns";
import { ArrowLeft, Clock, Share2 } from "lucide-react";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const posts = getAllPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export default async function ArticlePage({ params }: PageProps) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const categoryName = post.categories.length > 0 ? getCategoryName(post.categories[0]) : "News";

    return (
        <article className="bg-white min-h-screen pb-20">
            {/* Progress Bar (Optional - can be added later as client component) */}

            {/* Header / Hero for Article */}
            <header className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <Link href="/" className="hover:text-brand-red flex items-center gap-1">
                        <ArrowLeft className="h-4 w-4" /> Back to News
                    </Link>
                    <span>/</span>
                    <span className="text-brand-red font-bold uppercase tracking-wider">{categoryName}</span>
                </div>

                <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 leading-tight mb-6">
                    <span dangerouslySetInnerHTML={{ __html: post.title }} />
                </h1>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-6 border-t border-b border-gray-100 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 relative bg-gray-200 rounded-full flex-shrink-0 overflow-hidden">
                            <Image
                                src="/bkbk-portrait.jpg"
                                alt={post.author_name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900">By {post.author_name}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {format(parseISO(post.date), "MMMM d, yyyy • h:mm a")}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button className="p-2 text-gray-400 hover:text-brand-blue transition-colors rounded-full hover:bg-gray-50 border border-gray-200">
                            <Share2 className="h-4 w-4" />
                        </button>
                        {/* Add more social share buttons here */}
                    </div>
                </div>
            </header>

            {/* Featured Image */}
            {post.featured_image_url && (
                <div className="container mx-auto px-4 max-w-5xl mb-12">
                    <div className="relative aspect-video w-full overflow-hidden rounded-sm shadow-sm">
                        <Image
                            src={post.featured_image_url}
                            alt={post.title}
                            fill
                            className="object-cover"
                            priority
                            unoptimized
                        />
                    </div>
                </div>
            )}

            {/* Article Body */}
            <main className="container mx-auto px-4 max-w-3xl">
                <div
                    className="prose prose-lg prose-slate max-w-none md:prose-xl font-serif leading-loose text-gray-800 
            prose-headings:font-serif prose-headings:font-bold prose-headings:text-gray-900
            prose-a:text-brand-red prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-sm prose-img:shadow-sm"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Tags / Footer of Article */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                    {/* Can add tags here if migrated */}
                    <div className="bg-gray-50 p-8 rounded-sm text-center">
                        <h3 className="font-serif font-bold text-xl mb-2">Subscribe to Team BKBK</h3>
                        <p className="text-gray-600 mb-4">Get the latest analysis delivered to your inbox.</p>
                        {/* Placeholder for Newsletter Form */}
                        <button className="bg-brand-red text-white px-6 py-2 rounded-sm font-medium hover:bg-red-800 transition-colors">
                            Subscribe
                        </button>
                    </div>
                </div>
            </main>
        </article>
    );
}

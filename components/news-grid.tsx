import Link from "next/link";
import Image from "next/image";
import { Post, getCategoryName } from "@/lib/data";
import { format, parseISO } from "date-fns";

interface NewsGridProps {
    posts: Post[];
    title?: string;
}

export function NewsGrid({ posts, title }: NewsGridProps) {
    if (posts.length === 0) return null;

    return (
        <section className="mb-12">
            {title && (
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">
                    {title}
                </h2>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => {
                    const categoryName = post.categories.length > 0 ? getCategoryName(post.categories[0]) : "News";

                    return (
                        <article key={post.id} className="group flex flex-col h-full">
                            {/* Image */}
                            <div className="relative aspect-video w-full overflow-hidden bg-gray-100 rounded-sm mb-4">
                                {post.featured_image_url ? (
                                    <Image
                                        src={post.featured_image_url}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300">
                                        <span className="text-xs uppercase">No Image</span>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex flex-col flex-grow">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-brand-red font-bold uppercase tracking-wider text-[10px]">
                                        {categoryName}
                                    </span>
                                    <span className="text-gray-300 text-[10px]">|</span>
                                    <span className="text-gray-400 text-[10px] uppercase">
                                        {format(parseISO(post.date), "MMM d, yyyy")}
                                    </span>
                                </div>

                                <Link href={`/article/${post.slug}`} className="block mb-2">
                                    <h3 className="text-xl font-serif font-bold text-gray-900 leading-snug group-hover:text-brand-blue transition-colors">
                                        <span dangerouslySetInnerHTML={{ __html: post.title }} />
                                    </h3>
                                </Link>

                                <div
                                    className="text-gray-500 text-sm line-clamp-3 serif-body mb-4 flex-grow"
                                    dangerouslySetInnerHTML={{ __html: post.excerpt }}
                                />
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}

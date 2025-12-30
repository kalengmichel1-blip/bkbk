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

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8 md:gap-y-12">
                {posts.map((post) => {
                    const categoryName = post.categories.length > 0 ? getCategoryName(post.categories[0]) : "News";

                    return (
                        <article key={post.id} className="group flex flex-col h-full bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-100/50 rounded-sm p-4 border border-transparent hover:border-gray-100">
                            {/* Image */}
                            <div className="relative aspect-[3/2] w-full overflow-hidden bg-gray-100 rounded-sm mb-6 shadow-sm">
                                {post.featured_image_url ? (
                                    <Image
                                        src={post.featured_image_url}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300">
                                        <span className="text-xs uppercase font-medium tracking-widest">No Image</span>
                                    </div>
                                )}
                                {/* Category Badge Overlay */}
                                <div className="absolute top-0 left-0 bg-brand-red text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    {categoryName}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex flex-col flex-grow">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-gray-400 text-[10px] uppercase tracking-widest font-medium">
                                        {format(parseISO(post.date), "MMM d, yyyy")}
                                    </span>
                                    <span className="w-0.5 h-0.5 bg-gray-300 rounded-full"></span>
                                    <span className="text-brand-blue/60 text-[10px] uppercase tracking-widest font-bold">
                                        Read Time: ~5m
                                    </span>
                                </div>

                                <Link href={`/article/${post.slug}`} className="block mb-3">
                                    <h3 className="text-xl font-serif font-bold text-gray-900 leading-[1.3] group-hover:text-brand-blue transition-colors">
                                        <span dangerouslySetInnerHTML={{ __html: post.title }} />
                                    </h3>
                                </Link>

                                <div
                                    className="text-gray-500 text-sm leading-relaxed serif-body mb-5 flex-grow line-clamp-3"
                                    dangerouslySetInnerHTML={{ __html: post.excerpt }}
                                />

                                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between opacity-60 group-hover:opacity-100 transition-opacity">
                                    <span className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">By {post.author_name}</span>
                                    <span className="text-brand-red text-lg">→</span>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}

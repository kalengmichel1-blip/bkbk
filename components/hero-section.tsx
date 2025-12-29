"use client";

import Link from "next/link";
import Image from "next/image";
import { Post, getCategoryName } from "@/lib/data";
import { format, parseISO } from "date-fns";
import { HeroGlobe } from "./hero-globe";

interface HeroSectionProps {
    post: Post;
}

export function HeroSection({ post }: HeroSectionProps) {
    const categoryName = post.categories.length > 0 ? getCategoryName(post.categories[0]) : "News";

    return (
        <section className="border-b border-gray-200 pb-12 mb-12 relative overflow-hidden">
            <div className="grid md:grid-cols-12 gap-8 items-start relative z-10">
                {/* Main Content (Text) */}
                <div className="md:col-span-8 lg:col-span-8 order-2 md:order-1 relative min-h-[400px] flex flex-col justify-center">
                    <HeroGlobe />
                    <div className="relative z-20 bg-white/80 backdrop-blur-sm p-4 rounded-sm -ml-4">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-brand-red font-bold uppercase tracking-wider text-xs">
                                {categoryName}
                            </span>
                            <span className="text-gray-400 text-xs">|</span>
                            <span className="text-gray-500 text-xs uppercase tracking-wider">
                                {format(parseISO(post.date), "MMMM d, yyyy")}
                            </span>
                        </div>

                        <Link href={`/article/${post.slug}`} className="group">
                            <h1 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 leading-tight mb-4 group-hover:text-brand-blue transition-colors">
                                <span dangerouslySetInnerHTML={{ __html: post.title }} />
                            </h1>
                        </Link>

                        <div
                            className="text-lg text-gray-600 serif-body leading-relaxed mb-6 line-clamp-3"
                            dangerouslySetInnerHTML={{ __html: post.excerpt }}
                        />

                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-900 uppercase">By {post.author_name}</span>
                        </div>
                    </div>
                </div>

                {/* Featured Image */}
                <div className="md:col-span-4 lg:col-span-4 order-1 md:order-2">
                    {post.featured_image_url ? (
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 rounded-sm">
                            <Image
                                src={post.featured_image_url}
                                alt={post.title}
                                fill
                                className="object-cover transition-transform duration-700 hover:scale-105"
                                priority
                                unoptimized // For external images
                            />
                        </div>
                    ) : (
                        <div className="aspect-[4/3] w-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                            No Image
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

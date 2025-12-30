"use client";

import Link from "next/link";
import Image from "next/image";
import { Post, getCategoryName } from "@/lib/data";
import { format, parseISO } from "date-fns";
import { HeroGlobe } from "./hero-globe";
import { KineticText } from "@/components/kinetic-text";

interface HeroSectionProps {
    post: Post;
}

export function HeroSection({ post }: HeroSectionProps) {
    const categoryName = post.categories.length > 0 ? getCategoryName(post.categories[0]) : "News";

    return (
        <section className="border-b border-gray-200 pb-12 mb-12 relative overflow-hidden">
            <div className="grid md:grid-cols-12 gap-8 items-start relative z-10">
                {/* Main Content (Text) */}
                <div className="md:col-span-8 lg:col-span-8 order-2 md:order-1 relative min-h-[400px] md:min-h-[450px] flex flex-col justify-center">
                    <HeroGlobe />
                    <div className="relative z-20 bg-white/70 backdrop-blur-xl p-6 md:p-10 rounded-sm shadow-2xl border border-white/40 border-l-4 border-l-brand-red -ml-0 md:-ml-8 max-w-2xl transform transition-transform duration-700 hover:translate-x-2">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-brand-red font-bold uppercase tracking-[0.2em] text-xs">
                                {categoryName}
                            </span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span className="text-gray-500 text-xs uppercase tracking-widest font-medium">
                                {format(parseISO(post.date), "MMMM d, yyyy")}
                            </span>
                        </div>

                        <Link href={`/article/${post.slug}`} className="group block">
                            <KineticText className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 leading-[1.1] mb-6 group-hover:text-brand-blue transition-colors">
                                {post.title}
                            </KineticText>
                        </Link>

                        <div
                            className="text-lg text-gray-600 serif-body leading-relaxed mb-8 line-clamp-3 md:line-clamp-4 max-w-xl"
                            dangerouslySetInnerHTML={{ __html: post.excerpt }}
                        />

                        <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                            <div className="flex items-center gap-3">
                                <div className="h-px w-8 bg-gray-300"></div>
                                <span className="text-xs font-bold text-gray-900 uppercase tracking-widest">By {post.author_name}</span>
                            </div>

                            <Link href={`/article/${post.slug}`} className="group/btn flex items-center gap-2 text-brand-blue font-bold uppercase text-xs tracking-widest hover:text-brand-red transition-colors">
                                Read Story
                                <span className="block w-4 h-px bg-current transition-all group-hover/btn:w-8"></span>
                            </Link>
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

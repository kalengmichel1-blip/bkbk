"use client";

import Marquee from "react-fast-marquee";
import { getAllPosts } from "@/lib/data";

export function BreakingNewsTicker() {
    // We can't access server data directly in client component like this in all setups, 
    // but if data is static and imported it works. 
    // Better pattern: passed as props. But for speed and since data.ts is local:
    const posts = getAllPosts().slice(0, 5);

    return (
        <div className="bg-brand-red text-white py-2 overflow-hidden border-b border-white/10 relative z-20">
            <Marquee gradient={false} speed={40}>
                {posts.map((post, i) => (
                    <span key={i} className="mx-8 font-bold uppercase tracking-widest text-xs flex items-center">
                        <span className="w-2 h-2 bg-white rounded-full mr-3 animate-pulse" />
                        {post.title}
                    </span>
                ))}
                {/* Placeholder if no posts */}
                {posts.length === 0 && (
                    <span className="mx-8 font-bold uppercase tracking-widest text-xs">
                        BREAKING NEWS: TEAM BKBK LIVE UPDATES
                    </span>
                )}
            </Marquee>
        </div>
    );
}

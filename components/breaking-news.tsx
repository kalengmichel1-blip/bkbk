"use client";

import Marquee from "react-fast-marquee";
import { useState, useEffect } from "react";

export function BreakingNewsTicker() {
    const [news, setNews] = useState<{ title: string; link: string }[]>([]);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await fetch('/api/breaking-news');
                const data = await res.json();
                if (data.news && Array.isArray(data.news)) {
                    setNews(data.news);
                }
            } catch (error) {
                console.error("Failed to fetch breaking news:", error);
            }
        };

        fetchNews();
    }, []);

    // Fallback if no news loaded yet
    const displayPosts = news.length > 0 ? news : [
        { title: "BREAKING NEWS: UPDATES ON AFRICAN POLITICS Loading...", link: "#" }
    ];

    return (
        <div className="bg-brand-red text-white py-2 overflow-hidden border-b border-white/10 relative z-20">
            <Marquee gradient={false} speed={40}>
                {displayPosts.map((post, i) => (
                    <span key={i} className="mx-8 font-bold uppercase tracking-widest text-xs flex items-center">
                        <span className="w-2 h-2 bg-white rounded-full mr-3 animate-pulse" />
                        {post.title}
                    </span>
                ))}
            </Marquee>
        </div>
    );
}

"use client";

import Marquee from "react-fast-marquee";
import { useState, useEffect } from "react";

export function BreakingNewsTicker() {
    const [news, setNews] = useState<{ title: string; link: string }[]>([]);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                // BBC Africa News RSS Feed via RSS2JSON proxy
                // Note: We use a proxy because we cannot fetch XML directly from the browser (CORS)
                const RSS_URL = 'http://feeds.bbci.co.uk/news/world/africa/rss.xml';
                const PROXY_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;

                const res = await fetch(PROXY_URL);
                const data = await res.json();

                if (data.status === 'ok' && data.items && Array.isArray(data.items)) {
                    const mappedNews = data.items.map((item: { title: string; link: string }) => ({
                        title: item.title,
                        link: item.link
                    }));
                    setNews(mappedNews);
                } else {
                    throw new Error("Invalid RSS response");
                }
            } catch (error) {
                console.error("Failed to fetch breaking news:", error);
                // Fallback to static news if API fails
                setNews([
                    { title: "DRC Elections: Latest updates from Kinshasa", link: "#" },
                    { title: "Economic Growth: Mining sector sees 5% increase", link: "#" },
                    { title: "Diplomacy: President Tshisekedi meets with regional leaders", link: "#" }
                ]);
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

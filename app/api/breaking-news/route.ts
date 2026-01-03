import Parser from 'rss-parser';
import { NextResponse } from 'next/server';

// Initialize RSS Parser
const parser = new Parser();

export async function GET() {
    try {
        // BBC Africa News RSS Feed
        const feedUrl = 'http://feeds.bbci.co.uk/news/world/africa/rss.xml';

        const feed = await parser.parseURL(feedUrl);

        if (!feed || !feed.items) {
            throw new Error('Invalid feed structure');
        }

        // Extract recent items (limit to 10)
        const newsItems = feed.items.slice(0, 10).map(item => ({
            title: item.title || 'Breaking News',
            link: item.link || '#',
            pubDate: item.pubDate || new Date().toISOString(),
        }));

        // Add a backup static item if feed is empty
        if (newsItems.length === 0) {
            newsItems.push({
                title: "BREAKING: UPDATES ON AFRICAN POLITICS COMING SOON",
                link: "#",
                pubDate: new Date().toISOString()
            });
        }

        return NextResponse.json({ news: newsItems });
    } catch (error) {
        console.error('Error fetching RSS feed:', error);

        // Return a safe fallback so the ticker always has content
        return NextResponse.json({
            news: [{
                title: "Updates on African Politics coming soon...",
                link: "#",
                pubDate: new Date().toISOString()
            }]
        });
    }
}

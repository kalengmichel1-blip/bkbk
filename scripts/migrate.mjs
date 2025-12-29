import fs from 'fs';
import path from 'path';

const API_BASE = 'https://kikayabinkarubi.net/index.php?rest_route=/wp/v2';
const OUTPUT_DIR = path.join(process.cwd(), 'content');

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function fetchAllPosts() {
    let page = 1;
    let allPosts = [];
    let totalPages = 1;

    console.log('Starting migration...');

    while (page <= totalPages) {
        try {
            // Build URL correctly handling existing query params
            // Start with base
            let url = `${API_BASE}/posts`;
            // Add separator
            const separator = API_BASE.includes('?') ? '&' : '?';
            url += separator;
            // Add params
            url += `per_page=20&page=${page}&_embed`;

            const res = await fetch(url);

            if (!res.ok) throw new Error(`Failed to fetch page ${page}: ${res.statusText}`);

            const totalPagesHeader = res.headers.get('x-wp-totalpages');
            if (totalPagesHeader) {
                totalPages = parseInt(totalPagesHeader, 10);
            }

            const posts = await res.json();
            if (!Array.isArray(posts)) {
                console.error('Expected array of posts, got:', posts);
                break;
            }

            console.log(`Fetched page ${page} of ${totalPages} (${posts.length} posts)`);

            // Process and push
            const simplifiedPosts = posts.map(p => {
                let imageUrl = null;
                if (p._embedded && p._embedded['wp:featuredmedia'] && p._embedded['wp:featuredmedia'][0]) {
                    imageUrl = p._embedded['wp:featuredmedia'][0].source_url;
                }

                let authorName = 'Unknown';
                if (p._embedded && p._embedded['author'] && p._embedded['author'][0]) {
                    authorName = p._embedded['author'][0].name;
                }

                return {
                    id: p.id,
                    date: p.date,
                    slug: p.slug,
                    title: p.title.rendered,
                    content: p.content.rendered,
                    excerpt: p.excerpt.rendered,
                    author_id: p.author,
                    author_name: authorName,
                    categories: p.categories,
                    featured_media_id: p.featured_media,
                    featured_image_url: imageUrl
                };
            });

            allPosts.push(...simplifiedPosts);
            page++;
        } catch (error) {
            console.error('Error fetching posts:', error);
            // If page 1 fails, it's critical. If others fail, maybe we can continues?
            // But usually pagination failure means we are done or blocked.
            break;
        }
    }

    // Save to file
    if (allPosts.length > 0) {
        fs.writeFileSync(path.join(OUTPUT_DIR, 'posts.json'), JSON.stringify(allPosts, null, 2));
        console.log(`Migration complete. Saved ${allPosts.length} posts.`);
    } else {
        console.error('No posts fetched.');
    }
}

fetchAllPosts();

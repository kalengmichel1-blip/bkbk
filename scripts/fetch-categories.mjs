import fs from 'fs';
import path from 'path';

const API_BASE = 'https://kikayabinkarubi.net/index.php?rest_route=/wp/v2';
const OUTPUT_DIR = path.join(process.cwd(), 'content');

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function fetchCategories() {
    console.log('Fetching categories...');
    try {
        // Build URL
        const separator = API_BASE.includes('?') ? '&' : '?';
        const url = `${API_BASE}/categories${separator}per_page=100`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch categories: ${res.statusText}`);

        const categories = await res.json();
        console.log(`Fetched ${categories.length} categories.`);

        fs.writeFileSync(path.join(OUTPUT_DIR, 'categories.json'), JSON.stringify(categories, null, 2));
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

fetchCategories();

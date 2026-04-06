import { createClient } from "@supabase/supabase-js";
import fs from 'fs';

const url = 'https://xhlioblejhalazlgvpiq.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhobGlvYmxlamhhbGF6bGd2cGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MjQ0ODUsImV4cCI6MjA4NDAwMDQ4NX0.l_Se7PL3ELAdo5jawWxTsCYiCQB5y5l_lW2KxUBhFtU';

const supabase = createClient(url, key);

// Using local paths now
const IMAGE_MAP = {
    // People
    'tshisekedi': '/images/backfill/tshisekedi.jpg',
    'kabila': '/images/backfill/kabila.jpg',
    'kagame': '/images/backfill/kagame.jpg', // Need to ensure this exists!
    'trump': '/images/backfill/trump.jpg',
    'bemba': '/images/backfill/bemba.jpg', // Placeholder? Or skip.

    // Organizations / Places
    'sadc': '/images/backfill/sadc-flag.svg',
    'eac': '/images/backfill/eac-flag.svg',
    'un': '/images/backfill/un-flag.svg',
    'rdc': '/images/backfill/drc-flag.svg',
    'congo': '/images/backfill/drc-flag.svg',
    'rwanda': '/images/backfill/rwanda-flag.svg',
    'usa': '/images/backfill/usa-flag.svg',
    'washington': '/images/backfill/trump.jpg', // Re-use Trump for Washington

    // Generic fallback
    'default': '/images/backfill/drc-flag.svg'
};

async function generateSQL() {
    const { data: posts, error } = await supabase
        .from('posts')
        .select('id, title, featured_image')
        .eq('status', 'published');

    if (error) { console.error(error); return; }

    // Filter for posts that are EITHER null OR use external wikimedia links (to migrate them)
    const target = posts.filter(p =>
        !p.featured_image ||
        p.featured_image.trim() === '' ||
        p.featured_image.includes('wikimedia.org')
    );

    console.log(`Generating local-path SQL for ${target.length} posts...`);

    let sqlContent = "-- Backfill missing images using LOCAL paths\n";
    sqlContent += "BEGIN;\n\n";

    for (const post of target) {
        const titleLower = post.title.toLowerCase();
        let selectedImage = IMAGE_MAP['default'];

        if (titleLower.includes('trump') || titleLower.includes('usa') || titleLower.includes('washington')) selectedImage = IMAGE_MAP['trump'];
        else if (titleLower.includes('tshisekedi') || titleLower.includes('fatshi') || titleLower.includes('chef de l\'etat')) selectedImage = IMAGE_MAP['tshisekedi'];
        else if (titleLower.includes('kabila') || titleLower.includes('jkk')) selectedImage = IMAGE_MAP['kabila'];
        // Use generic fallback for Kagame/Rwanda if specific image not dl'd yet, or use flags
        else if (titleLower.includes('sadc')) selectedImage = IMAGE_MAP['sadc'];
        else if (titleLower.includes('eac')) selectedImage = IMAGE_MAP['default']; // Use DRC flag fallback if no EAC flag

        const safeTitle = post.title.replace(/'/g, "''");

        sqlContent += `-- Update for: ${safeTitle}\n`;
        sqlContent += `UPDATE posts SET featured_image = '${selectedImage}' WHERE id = ${post.id};\n\n`;
    }

    sqlContent += "COMMIT;\n";

    fs.writeFileSync('backfill_local_images.sql', sqlContent);
    console.log("SQL file generated: backfill_local_images.sql");
}

generateSQL();

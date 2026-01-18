import { createClient } from "@supabase/supabase-js";
import fs from 'fs';

const url = 'https://xhlioblejhalazlgvpiq.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhobGlvYmxlamhhbGF6bGd2cGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MjQ0ODUsImV4cCI6MjA4NDAwMDQ4NX0.l_Se7PL3ELAdo5jawWxTsCYiCQB5y5l_lW2KxUBhFtU';

const supabase = createClient(url, key);

const IMAGE_MAP = {
    // People
    'tshisekedi': 'https://commons.wikimedia.org/wiki/Special:FilePath/F%C3%A9lix_Tshisekedi_-_2019_(cropped).jpg',
    'kabila': 'https://commons.wikimedia.org/wiki/Special:FilePath/Joseph_Kabila_April_2016.jpg',
    'kagame': 'https://commons.wikimedia.org/wiki/Special:FilePath/President_Paul_Kagame_(portrait).jpg',
    'trump': 'https://commons.wikimedia.org/wiki/Special:FilePath/Donald_Trump_official_portrait.jpg',
    'bemba': 'https://commons.wikimedia.org/wiki/Special:FilePath/Jean-Pierre_Bemba_-_2016.png',

    // Organizations / Places
    'sadc': 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_SADC.svg',
    'eac': 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_the_East_African_Community.svg',
    'un': 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_the_United_Nations.svg',
    'rdc': 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_the_Democratic_Republic_of_the_Congo.svg',
    'congo': 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_the_Democratic_Republic_of_the_Congo.svg',
    'rwanda': 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Rwanda.svg',
    'usa': 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_the_United_States.svg',
    'washington': 'https://commons.wikimedia.org/wiki/Special:FilePath/WhiteHouseSouthFacade.JPG',

    // Generic fallback
    'default': 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_the_Democratic_Republic_of_the_Congo.svg'
};

async function generateSQL() {
    const { data: posts, error } = await supabase
        .from('posts')
        .select('id, title, featured_image')
        .eq('status', 'published')
    //.is('featured_image', null); // Fetch all to be safe? No, just nulls or empties

    if (error) { console.error(error); return; }

    const missing = posts.filter(p => !p.featured_image || p.featured_image.trim() === '');
    console.log(`Generating SQL for ${missing.length} posts...`);

    let sqlContent = "-- Backfill missing images for Team BKBK\n";
    sqlContent += "BEGIN;\n\n";

    for (const post of missing) {
        const titleLower = post.title.toLowerCase();
        let selectedImage = IMAGE_MAP['default'];

        if (titleLower.includes('trump') || titleLower.includes('usa') || titleLower.includes('washington')) selectedImage = IMAGE_MAP['trump'];
        else if (titleLower.includes('tshisekedi') || titleLower.includes('fatshi') || titleLower.includes('chef de l\'etat')) selectedImage = IMAGE_MAP['tshisekedi'];
        else if (titleLower.includes('kabila') || titleLower.includes('jkk')) selectedImage = IMAGE_MAP['kabila'];
        else if (titleLower.includes('kagame') || titleLower.includes('rwanda')) selectedImage = IMAGE_MAP['kagame'];
        else if (titleLower.includes('bemba')) selectedImage = IMAGE_MAP['bemba'];
        else if (titleLower.includes('sadc')) selectedImage = IMAGE_MAP['sadc'];
        else if (titleLower.includes('eac')) selectedImage = IMAGE_MAP['eac'];

        // Basic SQL escape (single quotes only)
        const safeTitle = post.title.replace(/'/g, "''");

        sqlContent += `-- Update for: ${safeTitle}\n`;
        sqlContent += `UPDATE posts SET featured_image = '${selectedImage}' WHERE id = ${post.id};\n\n`;
    }

    sqlContent += "COMMIT;\n";

    fs.writeFileSync('backfill_images.sql', sqlContent);
    console.log("SQL file generated: backfill_images.sql");
}

generateSQL();

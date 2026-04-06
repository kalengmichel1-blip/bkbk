import { createClient } from "@supabase/supabase-js";

const url = 'https://xhlioblejhalazlgvpiq.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhobGlvYmxlamhhbGF6bGd2cGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MjQ0ODUsImV4cCI6MjA4NDAwMDQ4NX0.l_Se7PL3ELAdo5jawWxTsCYiCQB5y5l_lW2KxUBhFtU';

const supabase = createClient(url, key);

// Wikipedia Special:FilePath redirects to the raw image.
// We use 'width' param if we were using the MediaWiki API, but direct FilePath is usually full res.
// Ideally, we'd use a thumb service, but for this backfill, full res (or redirected URL) is fine.
const IMAGE_MAP = {
    // People
    'tshisekedi': 'https://commons.wikimedia.org/wiki/Special:FilePath/F%C3%A9lix_Tshisekedi_-_2019_(cropped).jpg',
    'kabila': 'https://commons.wikimedia.org/wiki/Special:FilePath/Joseph_Kabila_April_2016.jpg',
    'kagame': 'https://commons.wikimedia.org/wiki/Special:FilePath/President_Paul_Kagame_(portrait).jpg',
    'trump': 'https://commons.wikimedia.org/wiki/Special:FilePath/Donald_Trump_official_portrait.jpg',
    'bemba': 'https://commons.wikimedia.org/wiki/Special:FilePath/Jean-Pierre_Bemba_-_2016.png', // Reasonable guess or generic pol
    'kamerhe': 'https://commons.wikimedia.org/wiki/Special:FilePath/Vital_Kamerhe_2017.jpg',
    'katumbi': 'https://commons.wikimedia.org/wiki/Special:FilePath/Moise_Katumbi_2016.jpg',

    // Organizations / Places
    'sadc': 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_SADC.svg',
    'eac': 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_the_East_African_Community.svg',
    'un': 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_the_United_Nations.svg',
    'onu': 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_the_United_Nations.svg',
    'rdc': 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_the_Democratic_Republic_of_the_Congo.svg',
    'congo': 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_the_Democratic_Republic_of_the_Congo.svg',
    'rwanda': 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Rwanda.svg',
    'usa': 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_the_United_States.svg',
    'washington': 'https://commons.wikimedia.org/wiki/Special:FilePath/WhiteHouseSouthFacade.JPG',

    // Generic fallback
    'default': 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_the_Democratic_Republic_of_the_Congo.svg'
};

async function backfillImages() {
    // 1. Fetch missing images posts
    const { data: posts, error } = await supabase
        .from('posts')
        .select('id, title, slug, featured_image')
        .eq('status', 'published')
        .is('featured_image', null); // Only fetch nulls (or check empty string locally if needed)

    if (error) {
        console.error('Error fetching posts:', error);
        return;
    }

    // Also filter empty strings if any
    const missing = posts.filter(p => !p.featured_image || p.featured_image.trim() === '');
    console.log(`Found ${missing.length} posts to backfill.`);

    let updatedCount = 0;

    for (const post of missing) {
        const titleLower = post.title.toLowerCase();
        let selectedImage = IMAGE_MAP['default'];

        // Keyword matching (Order matters: specific people first, then orgs, then places)
        if (titleLower.includes('trump') || titleLower.includes('usa') || titleLower.includes('washington')) selectedImage = IMAGE_MAP['trump']; // Prioritize Trump for "Accord Trump"
        else if (titleLower.includes('tshisekedi') || titleLower.includes('fatshi') || titleLower.includes('chef de l\'etat')) selectedImage = IMAGE_MAP['tshisekedi'];
        else if (titleLower.includes('kabila') || titleLower.includes('jkk')) selectedImage = IMAGE_MAP['kabila'];
        else if (titleLower.includes('kagame') || titleLower.includes('rwanda')) selectedImage = IMAGE_MAP['kagame']; // Rwanda articles often feature Kagame
        else if (titleLower.includes('bemba')) selectedImage = IMAGE_MAP['bemba'];
        else if (titleLower.includes('sadc')) selectedImage = IMAGE_MAP['sadc'];
        else if (titleLower.includes('eac')) selectedImage = IMAGE_MAP['eac'];


        console.log(`[${post.id}] "${post.title.substring(0, 30)}..." -> ${selectedImage.split('/').pop()}`);

        const { error: updateError } = await supabase
            .from('posts')
            .update({ featured_image: selectedImage })
            .eq('id', post.id);

        if (updateError) {
            console.error(`  Failed to update post ${post.id}:`, updateError.message);
        } else {
            updatedCount++;
        }
    }

    console.log(`Backfilled ${updatedCount} posts.`);
}

backfillImages();

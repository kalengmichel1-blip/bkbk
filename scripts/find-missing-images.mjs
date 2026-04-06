import { createClient } from "@supabase/supabase-js";

const url = 'https://xhlioblejhalazlgvpiq.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhobGlvYmxlamhhbGF6bGd2cGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MjQ0ODUsImV4cCI6MjA4NDAwMDQ4NX0.l_Se7PL3ELAdo5jawWxTsCYiCQB5y5l_lW2KxUBhFtU';

const supabase = createClient(url, key);

async function checkMissingImages() {
    const { data: posts, error } = await supabase
        .from('posts')
        .select('id, title, slug, featured_image')
        .eq('status', 'published');

    if (error) {
        console.error('Error fetching posts:', error);
        return;
    }

    const missing = posts.filter(p => !p.featured_image);

    console.log(`Found ${missing.length} published posts with missing images.`);
    missing.forEach(p => {
        console.log(`- [${p.id}] ${p.title} (slug: ${p.slug})`);
    });
}

checkMissingImages();

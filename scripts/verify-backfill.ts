import { createClient } from "@supabase/supabase-js";

const url = 'https://xhlioblejhalazlgvpiq.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhobGlvYmxlamhhbGF6bGd2cGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MjQ0ODUsImV4cCI6MjA4NDAwMDQ4NX0.l_Se7PL3ELAdo5jawWxTsCYiCQB5y5l_lW2KxUBhFtU';

const supabase = createClient(url, key);

// IDs of articles that were previously missing images
const sampleIds = [25, 242, 247, 652, 280, 222];

async function verifyImages() {
    const { data: posts, error } = await supabase
        .from('posts')
        .select('id, title, featured_image')
        .in('id', sampleIds);

    if (error) {
        console.error(error);
        return;
    }

    console.log("Verification Sample:");
    posts.forEach(p => {
        // Extract filename for readability
        const filename = p.featured_image ? p.featured_image.split('/').pop() : 'NULL';
        console.log(`[${p.id}] "${p.title.substring(0, 40)}..."\n    -> Image: ${filename}`);
    });
}

verifyImages();

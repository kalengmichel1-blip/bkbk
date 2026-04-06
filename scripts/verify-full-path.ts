import { createClient } from "@supabase/supabase-js";

const url = 'https://xhlioblejhalazlgvpiq.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhobGlvYmxlamhhbGF6bGd2cGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MjQ0ODUsImV4cCI6MjA4NDAwMDQ4NX0.l_Se7PL3ELAdo5jawWxTsCYiCQB5y5l_lW2KxUBhFtU';

const supabase = createClient(url, key);

// ID 25 -> Should be Trump
const sampleIds = [25, 242];

async function verifyImages() {
    const { data: posts, error } = await supabase
        .from('posts')
        .select('id, title, featured_image')
        .in('id', sampleIds);

    if (error) { console.error(error); return; }

    console.log("--- DB STATUS (FULL PATH) ---");
    posts.forEach(p => {
        console.log(`ID ${p.id}: ${p.featured_image}`);
    });
    console.log("-----------------");
}

verifyImages();

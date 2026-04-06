import { createClient } from "@supabase/supabase-js";

const url = 'https://xhlioblejhalazlgvpiq.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhobGlvYmxlamhhbGF6bGd2cGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MjQ0ODUsImV4cCI6MjA4NDAwMDQ4NX0.l_Se7PL3ELAdo5jawWxTsCYiCQB5y5l_lW2KxUBhFtU';

const supabase = createClient(url, key);

async function listTop100() {
    const { data: posts, error } = await supabase
        .from('posts')
        .select('id, title, featured_image')
        .eq('status', 'published')
        .order('published_at', { ascending: false }) // "First 100" usually means latest
        .limit(100);

    if (error) { console.error(error); return; }

    console.log("--- TOP 100 ARTICLES ---");
    posts.forEach(p => {
        console.log(`[${p.id}] ${p.title}`);
    });
    console.log("-----------------");
}

listTop100();

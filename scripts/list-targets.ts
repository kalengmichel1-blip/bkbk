import { createClient } from "@supabase/supabase-js";

const url = 'https://xhlioblejhalazlgvpiq.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhobGlvYmxlamhhbGF6bGd2cGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MjQ0ODUsImV4cCI6MjA4NDAwMDQ4NX0.l_Se7PL3ELAdo5jawWxTsCYiCQB5y5l_lW2KxUBhFtU';

const supabase = createClient(url, key);

async function listArticles() {
    const { data: posts, error } = await supabase
        .from('posts')
        .select('id, title, featured_image')
        .eq('status', 'published')
        .order('id', { ascending: true });

    if (error) { console.error(error); return; }

    console.log("--- ARTICLE LIST ---");
    posts.forEach(p => {
        // Only show ones we likely need to fix (missing image OR wp-content)
        if (!p.featured_image || p.featured_image.includes('wp-content')) {
            console.log(`ID: ${p.id} | Title: ${p.title} | Current: ${p.featured_image}`);
        }
    });
    console.log("-----------------");
}

listArticles();

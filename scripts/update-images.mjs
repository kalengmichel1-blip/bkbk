import { createClient } from "@supabase/supabase-js";

const url = 'https://xhlioblejhalazlgvpiq.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhobGlvYmxlamhhbGF6bGd2cGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MjQ0ODUsImV4cCI6MjA4NDAwMDQ4NX0.l_Se7PL3ELAdo5jawWxTsCYiCQB5y5l_lW2KxUBhFtU';

const supabase = createClient(url, key);

// ID -> Image URL map
// TO BE FILLED BY AGENT
const updates = [
    // Example: { id: 1, url: '...' },
];

async function updateImages() {
    if (updates.length === 0) {
        console.log("No updates to apply.");
        return;
    }

    console.log(`Applying ${updates.length} updates...`);

    for (const update of updates) {
        const { error } = await supabase
            .from('posts')
            .update({ featured_image: update.url })
            .eq('id', update.id);

        if (error) {
            console.error(`Error updating post ${update.id}:`, error);
        } else {
            console.log(`Updated post ${update.id}`);
        }
    }
    console.log("Done.");
}

updateImages();

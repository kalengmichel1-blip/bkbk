import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xhlioblejhalazlgvpiq.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhobGlvYmxlamhhbGF6bGd2cGlxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQyNDQ4NSwiZXhwIjoyMDg0MDAwNDg1fQ.h8jGoUV8_kLJShc1XKvxhGWpjm2AoddC8AcOqFTKv8E'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupStorage() {
    console.log('Checking storage buckets...')

    const { data: buckets, error } = await supabase.storage.listBuckets()

    if (error) {
        console.error('Error listing buckets:', error.message)
        return
    }

    const imagesBucket = buckets.find(b => b.name === 'images')

    if (!imagesBucket) {
        console.log("Bucket 'images' not found. Creating...")
        const { data, error: createError } = await supabase.storage.createBucket('images', {
            public: true,
            fileSizeLimit: 5242880, // 5MB
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
        })

        if (createError) {
            console.error("Error creating bucket:", createError.message)
        } else {
            console.log("Bucket 'images' created successfully.")
        }
    } else {
        console.log("Bucket 'images' already exists.")
        // Ensure it is public
        if (!imagesBucket.public) {
            console.log("Updating bucket to be public...")
            await supabase.storage.updateBucket('images', { public: true })
        }
    }

    // Note: Policies are handled by SQL schema usually, but since the bucket creation works,
    // we assume the user has the 'Authenticated users can upload images' policy from schema.sql.
    // We can't easily check policies via JS client without SQL editor access.
    console.log("Storage setup complete.")
}

setupStorage()

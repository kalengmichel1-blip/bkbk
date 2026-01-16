
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

export async function GET() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const jsonDirectory = path.join(process.cwd(), 'content')
        const fileContents = fs.readFileSync(jsonDirectory + '/posts.json', 'utf8')
        const posts = JSON.parse(fileContents)

        const formattedPosts = posts.map((post: any) => ({
            // We can't easily preserve the ID if it conflicts with existing auto-increment, 
            // but we can try letting Supabase handle IDs or mapping them if crucial.
            // For simplicity and avoiding conflicts, let's let Supabase generate new IDs 
            // or just try to insert. If these are "legacy" posts, maybe we want to keep IDs?
            // Let's omit ID to be safe and let Supabase generate new ones, 
            // UNLESS the user explicitly wants to keep them. 
            // Given "older articles", preserving IDs might be nice for URLs if they depended on it,
            // but the slug is the main identifier for URLs usually.
            // Let's use the slug as the unique key.

            title: post.title.replace(/&#8220;|&#8221;/g, '"').replace(/&#8217;/g, "'").replace(/&nbsp;/g, ' '), // Basic cleanup
            slug: post.slug,
            content: post.content,
            excerpt: post.excerpt,
            featured_image: post.featured_image_url,
            status: 'published',
            published_at: post.date,
            created_at: post.date,
            author_id: user.id
        }))

        // Insert in batches or one by one to handle errors gracefully?
        // Let's try a bulk insert first.
        const { error } = await supabase.from('posts').upsert(formattedPosts, {
            onConflict: 'slug',
            ignoreDuplicates: false
        })

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ message: `Successfully imported ${posts.length} posts` })

    } catch (error) {
        console.error('Import error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

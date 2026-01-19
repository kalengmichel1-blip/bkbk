import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// WordPress GraphQL query
const WP_QUERY = `
  query AllPosts {
    posts(first: 100) {
      nodes {
        title
        slug
        date
        excerpt
        content
        featuredImage {
          node {
            sourceUrl
          }
        }
        author {
          node {
            name
          }
        }
      }
    }
  }
`

export async function GET(request: Request) {
    // Check auth
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    // Middleware handles this
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch from WordPress
    const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL
    if (!wpUrl) {
        return NextResponse.json({ error: 'Missing WP URL' }, { status: 500 })
    }

    try {
        const res = await fetch(wpUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: WP_QUERY }),
        })
        const json = await res.json()
        const posts = json.data?.posts?.nodes

        if (!posts) {
            return NextResponse.json({ message: 'No posts found in WP' })
        }

        let importedCount = 0
        let errors = []

        for (const post of (posts as any[])) {
            // Map WP post to Supabase schema
            const { error } = await supabase.from('posts').upsert({
                slug: post.slug, // specific collision handling? upsert handles unique slug constraint by updating
                title: post.title,
                content: post.content,
                excerpt: post.excerpt,
                published_at: post.date,
                featured_image: post.featuredImage?.node?.sourceUrl || null,
                status: 'published', // Assume published for migrated content
                author_id: user.id, // Assign to current admin for now
            }, { onConflict: 'slug' })

            if (error) {
                errors.push({ slug: post.slug, error: error.message })
            } else {
                importedCount++
            }
        }

        return NextResponse.json({
            success: true,
            imported: importedCount,
            failed: errors.length,
            errors
        })

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

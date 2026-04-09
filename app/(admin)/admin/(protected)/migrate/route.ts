import { createSessionClient } from '@/lib/appwrite/server'
import { NextResponse } from 'next/server'
import { ID } from 'node-appwrite'

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!
const POSTS_COLLECTION = process.env.NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID!

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
    const { account, databases } = await createSessionClient()
    const user = account ? await account.get().catch(() => null) : null

    if (!user || !databases) {
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

interface WPPost {
    slug: string;
    title: string;
    content: string;
    excerpt: string;
    date: string;
    featuredImage?: { node?: { sourceUrl?: string } };
}

        let importedCount = 0
        const errors: { slug: string; error: string }[] = []

        for (const post of (posts as WPPost[])) {
            try {
                await databases.createDocument(DB_ID, POSTS_COLLECTION, ID.unique(), {
                    slug: post.slug, 
                    title: post.title,
                    content: post.content,
                    excerpt: post.excerpt,
                    published_at: post.date,
                    featured_image: post.featuredImage?.node?.sourceUrl || null,
                    status: 'published', 
                    author_id: user.$id,
                })
                importedCount++
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Import failed';
                errors.push({ slug: post.slug, error: message })
            }
        }

        return NextResponse.json({
            success: true,
            imported: importedCount,
            failed: errors.length,
            errors
        })

    } catch (err) {
        const message = err instanceof Error ? err.message : 'Migration failed';
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

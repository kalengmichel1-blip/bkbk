'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { canDeletePost } from '@/lib/utils/permissions'

export async function createPost(formData: FormData) {
    const supabase = await createClient()

    const title = formData.get('title') as string
    const slug = formData.get('slug') as string
    const content = formData.get('content') as string
    const excerpt = formData.get('excerpt') as string
    const featured_image = formData.get('featured_image') as string
    const status = formData.get('status') as string

    const { error } = await supabase.from('posts').insert({
        title,
        slug,
        content,
        excerpt,
        featured_image,
        status,
    })

    if (error) {
        console.error('Error creating post:', error)
        throw new Error('Failed to create post')
    }

    revalidatePath('/admin/dashboard')
    revalidatePath('/')
    redirect('/admin/dashboard')
}

export async function updatePost(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const id = formData.get('id') as string
    const title = formData.get('title') as string
    const slug = formData.get('slug') as string
    const excerpt = formData.get('excerpt') as string
    const content = formData.get('content') as string
    let status = formData.get('status') as string
    const category = formData.get('category') as string
    const featured_image = formData.get('featured_image') as string

    // Enforce permissions: Staff can only create drafts
    const role = user.user_metadata?.role
    if (role === 'staff' && status === 'published') {
        status = 'draft' // Force draft
    }

    const { error } = await supabase
        .from('posts')
        .update({
            title,
            slug,
            excerpt,
            content,
            status,
            category,
            featured_image,
            published_at: status === 'published' ? new Date().toISOString() : null,
            updated_at: new Date().toISOString()
        })
        .eq('id', id)

    if (error) {
        console.error('Error updating post:', error)
        throw new Error('Failed to update post')
    }

    revalidatePath('/admin/dashboard')
    revalidatePath('/')
    redirect('/admin/dashboard')
}

export async function deletePost(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !canDeletePost(user.user_metadata?.role)) {
        return { error: 'Unauthorized: Only admins can delete posts' }
    }

    const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/dashboard')
    revalidatePath('/')
    return { success: true }
}

export async function seedPosts() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const path = await import('path')
    const fs = await import('fs')

    try {
        const jsonDirectory = path.join(process.cwd(), 'content')
        const fileContents = fs.readFileSync(path.join(jsonDirectory, 'posts.json'), 'utf8')
        const posts = JSON.parse(fileContents)

        const formattedPosts = posts.map((post: any) => ({
            title: post.title.replace(/&#8220;|&#8221;/g, '"').replace(/&#8217;/g, "'").replace(/&nbsp;/g, ' '),
            slug: post.slug,
            content: post.content,
            excerpt: post.excerpt,
            featured_image: post.featured_image_url,
            status: 'published',
            published_at: post.date,
            created_at: post.date,
            author_id: user.id
        }))

        const batchSize = 50
        for (let i = 0; i < formattedPosts.length; i += batchSize) {
            const batch = formattedPosts.slice(i, i + batchSize)
            const { error } = await supabase.from('posts').upsert(batch, {
                onConflict: 'slug',
                ignoreDuplicates: false
            })

            if (error) {
                console.error(`Seed error at batch ${i}:`, error)
                throw new Error(`Failed at batch ${i}: ${error.message}`)
            }
        }



        revalidatePath('/admin/dashboard')
        return { success: true, count: posts.length }
    } catch (e: any) {
        console.error('Seed exception:', e)
        throw new Error(e.message || 'Failed to seed posts')
    }
}

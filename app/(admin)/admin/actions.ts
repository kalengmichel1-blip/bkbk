'use server'

import { createSessionClient, createAdminClient } from '@/lib/appwrite/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { canDeletePost } from '@/lib/utils/permissions'
import { ID } from 'node-appwrite'

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!
const POSTS_COLLECTION = process.env.NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID!

export async function loginAction(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    // We must use admin client to create session, as we don't have a session yet
    const { account } = await createAdminClient();
    
    try {
        const session = await account.createEmailPasswordSession(email, password);
        
        const cookieStore = await import('next/headers').then(m => m.cookies());
        cookieStore.set('appwrite-session', session.secret, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: new Date(session.expire).getTime() - Date.now(),
        });
        
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function logoutAction() {
    const { account } = await createSessionClient();
    const cookieStore = await import('next/headers').then(m => m.cookies());
    
    try {
        if (account) {
            await account.deleteSession('current');
        }
    } catch (e) {
        console.error('Logout error:', e);
    }
    
    cookieStore.delete('appwrite-session');
    redirect('/admin');
}

export async function createPost(formData: FormData) {
    const { databases } = await createSessionClient()

    if (!databases) {
        throw new Error('Unauthorized')
    }

    const title = formData.get('title') as string
    const slug = formData.get('slug') as string
    const content = formData.get('content') as string
    const excerpt = formData.get('excerpt') as string
    const featured_image = formData.get('featured_image') as string
    const status = formData.get('status') as string

    try {
        await databases.createDocument(DB_ID, POSTS_COLLECTION, ID.unique(), {
            title,
            slug,
            content,
            excerpt,
            featured_image,
            status,
        })
    } catch (error: any) {
        console.error('Error creating post:', error)
        throw new Error('Failed to create post')
    }

    revalidatePath('/admin/dashboard')
    revalidatePath('/')
    redirect('/admin/dashboard')
}

export async function updatePost(formData: FormData) {
    const { databases, account } = await createSessionClient()

    if (!databases || !account) {
        return { error: 'Unauthorized' }
    }

    const user = await account.get().catch(() => null);

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
    const role = user.prefs?.role
    if (role === 'staff' && status === 'published') {
        status = 'draft' // Force draft
    }

    try {
        await databases.updateDocument(DB_ID, POSTS_COLLECTION, id, {
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
    } catch (error: any) {
        console.error('Error updating post:', error)
        throw new Error('Failed to update post')
    }

    revalidatePath('/admin/dashboard')
    revalidatePath('/')
    redirect('/admin/dashboard')
}

export async function deletePost(id: string) {
    const { databases, account } = await createSessionClient()

    if (!databases || !account) {
        return { error: 'Unauthorized' }
    }

    const user = await account.get().catch(() => null);

    if (!user || !canDeletePost(user.prefs?.role)) {
        return { error: 'Unauthorized: Only admins can delete posts' }
    }

    try {
        await databases.deleteDocument(DB_ID, POSTS_COLLECTION, id)
    } catch (error: any) {
        return { error: error.message }
    }

    revalidatePath('/admin/dashboard')
    revalidatePath('/')
    return { success: true }
}

export async function seedPosts() {
    const { databases, account } = await createSessionClient()

    if (!databases || !account) {
        throw new Error('Unauthorized')
    }

    const user = await account.get().catch(() => null);

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
            author_id: user.$id
        }))

        const batchSize = 50
        for (let i = 0; i < formattedPosts.length; i += batchSize) {
            const batch = formattedPosts.slice(i, i + batchSize)
            
            // Appwrite does not have native upsert by slug in a single batch array,
            // we have to insert documents one by one or create a custom function.
            // Using a simple loop here:
            for (const item of batch) {
                try {
                    await databases.createDocument(DB_ID, POSTS_COLLECTION, ID.unique(), item);
                } catch (err: any) {
                    console.error(`Seed loop error mapping item ${item.slug}:`, err);
                    // continue seeding other posts
                }
            }
        }



        revalidatePath('/admin/dashboard')
        return { success: true, count: posts.length }
    } catch (e: any) {
        console.error('Seed exception:', e)
        throw new Error(e.message || 'Failed to seed posts')
    }
}

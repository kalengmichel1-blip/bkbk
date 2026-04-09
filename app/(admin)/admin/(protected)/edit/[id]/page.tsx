import { createSessionClient } from '@/lib/appwrite/server'
import { ArticleForm } from '@/components/admin/article-form'
import { notFound } from 'next/navigation'

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!
const POSTS_COLLECTION = process.env.NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID!

interface Props {
    params: Promise<{ id: string }>
}

export default async function EditArticlePage({ params }: Props) {
    const { id } = await params
    const { databases, account } = await createSessionClient()

    let post = null;
    let error = null;

    try {
        if (databases) {
            post = await databases.getDocument(DB_ID, POSTS_COLLECTION, id);
        }
    } catch(err) {
        error = err;
    }

    console.log(`Edit Page [${id}] error:`, error)
    console.log(`Edit Page [${id}] post found:`, !!post)


    if (!post) {
        notFound()
    }

    const user = account ? await account.get().catch(() => null) : null
    const role = user?.prefs?.role

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Edit Article</h1>
            <ArticleForm post={{
                id: post.$id,
                title: (post.title as string) ?? '',
                slug: (post.slug as string) ?? '',
                content: (post.content as string) ?? '',
                excerpt: (post.excerpt as string) ?? '',
                featured_image: (post.featured_image as string) ?? '',
                status: (post.status as string) ?? 'draft',
            }} role={role} />
        </div>
    )
}

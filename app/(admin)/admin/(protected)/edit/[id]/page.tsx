import { createClient } from '@/lib/supabase/server'
import { ArticleForm } from '@/components/admin/article-form'
import { notFound } from 'next/navigation'

interface Props {
    params: Promise<{ id: string }>
}

export default async function EditArticlePage({ params }: Props) {
    const { id } = await params
    const supabase = await createClient()

    const { data: post, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()

    console.log(`Edit Page [${id}] error:`, error)
    console.log(`Edit Page [${id}] post found:`, !!post)


    if (!post) {
        notFound()
    }

    const { data: { user } } = await supabase.auth.getUser()
    const role = user?.user_metadata?.role

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Edit Article</h1>
            <ArticleForm post={{ ...post, id: String(post.id) }} role={role} />
        </div>
    )
}

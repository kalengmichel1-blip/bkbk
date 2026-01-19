import { ArticleForm } from '@/components/admin/article-form'
import { createClient } from '@/lib/supabase/server'

export default async function NewArticlePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const role = user?.user_metadata?.role

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Create New Article</h1>
            <ArticleForm role={role} />
        </div>
    )
}

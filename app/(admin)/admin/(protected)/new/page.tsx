import { ArticleForm } from '@/components/admin/article-form'
import { createSessionClient } from '@/lib/appwrite/server'

export default async function NewArticlePage() {
    const { account } = await createSessionClient()
    const user = account ? await account.get().catch(() => null) : null
    const role = user?.prefs?.role

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Create New Article</h1>
            <ArticleForm role={role} />
        </div>
    )
}

import { createSessionClient, createAdminClient } from '@/lib/appwrite/server'
import { Query } from 'node-appwrite'
import Link from 'next/link'
import { Plus, Pencil, Eye, TrendingUp, Globe } from 'lucide-react'
import { DeletePostButton } from '@/components/admin/delete-post-button'
import { ImportButton } from '@/components/admin/import-button'

import { format } from 'date-fns'
import { canDeletePost } from '@/lib/utils/permissions'

interface Post {
    id: string
    title: string
    slug: string
    created_at: string
    status: string
}

export default async function DashboardPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>
}) {
    const params = await searchParams
    const page = Number(params.page) || 1
    const pageSize = 20
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { account } = await createSessionClient()
    let user = null
    try {
        if (account) user = await account.get()
    } catch (e) {}

    const { databases } = await createAdminClient()
    let posts: Post[] = []
    let totalPages = 0

    try {
        const result = await databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
            process.env.NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID!,
            [
                Query.limit(pageSize),
                Query.offset(from),
                Query.orderDesc('published_at')
            ]
        )
        posts = result.documents.map(d => ({
            id: d.$id,
            title: d.title,
            slug: d.slug,
            created_at: d.created_at || d.published_at || d.$createdAt,
            status: d.status
        }))
        totalPages = Math.ceil(result.total / pageSize)
    } catch (e) {
        const message = e instanceof Error ? e.message : 'Failed to fetch posts';
        return (
            <div className="p-4 bg-red-500/10 text-red-500 rounded border border-red-500/20">
                Error fetching posts: {message}
            </div>
        )
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <div className="flex gap-4">
                    <ImportButton />
                    <Link
                        href="/admin/new"
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded transition-colors"
                    >
                        <Plus size={20} />
                        New Article
                    </Link>
                </div>
            </div>

            {/* Articles Table */}
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Pencil size={18} className="text-gray-400" />
                Articles
            </h2>


            <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden mb-6">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-xs text-gray-400 uppercase">
                        <tr>
                            <th className="px-6 py-4">Title</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {posts?.map((post) => (
                            <tr key={post.id} className="hover:bg-white/5">
                                <td className="px-6 py-4 font-medium">{post.title}</td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-2 py-1 rounded text-xs font-bold ${post.status === 'published'
                                            ? 'bg-green-500/20 text-green-400'
                                            : 'bg-yellow-500/20 text-yellow-400'
                                            }`}
                                    >
                                        {post.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-400">
                                    {format(new Date(post.created_at), 'MMM d, yyyy')}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link
                                            href={`/article/${post.slug}`}
                                            target="_blank"
                                            className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-white"
                                            title="View"
                                        >
                                            <Eye size={18} />
                                        </Link>
                                        <Link
                                            href={`/admin/edit/${post.id}`}
                                            className="p-2 hover:bg-white/10 rounded text-blue-400 hover:text-blue-300"
                                            title="Edit"
                                        >
                                            <Pencil size={18} />
                                        </Link>
                                        {canDeletePost(user?.prefs?.role || 'admin') && (
                                            <DeletePostButton id={post.id} />
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {(!posts || posts.length === 0) && (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                    No articles found. Create your first one!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                    {page > 1 && (
                        <Link
                            href={`/admin/dashboard?page=${page - 1}`}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded transition-colors"
                        >
                            Previous
                        </Link>
                    )}
                    <span className="px-4 py-2 text-gray-400">
                        Page {page} of {totalPages}
                    </span>
                    {page < totalPages && (
                        <Link
                            href={`/admin/dashboard?page=${page + 1}`}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded transition-colors"
                        >
                            Next
                        </Link>
                    )}
                </div>
            )}
        </div>
    )
}

'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import RichTextEditor from '@/components/editor/rich-text-editor'
import { ImageUploader } from '@/components/admin/image-uploader'
import { createPost, updatePost } from '@/app/(admin)/admin/actions'
import { Loader2 } from 'lucide-react'

// Helper for slug generation
function slugify(text: string) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
}

interface Post {
    id?: string
    title: string
    slug: string
    content: string
    excerpt: string
    featured_image: string
    status: string
}

import { canPublishPost } from '@/lib/utils/permissions'

interface Props {
    post?: Post
    role?: string
}

function SubmitButton({ isDraft, role }: { isDraft: boolean; role?: string }) {
    const { pending } = useFormStatus()

    // If not draft (i.e. Publish) and user cannot publish, disable it
    if (!isDraft && !canPublishPost(role)) {
        return null // Don't even show publish button for staff
    }

    return (
        <button
            type="submit"
            disabled={pending}
            name="status"
            value={isDraft ? 'draft' : 'published'}
            className={`px-6 py-2 rounded-full font-bold transition-colors disabled:opacity-50 flex items-center gap-2 ${isDraft
                ? 'bg-white/10 hover:bg-white/20 text-white'
                : 'bg-white text-black hover:bg-gray-200'
                }`}
        >
            {pending && <Loader2 className="animate-spin" size={16} />}
            {isDraft ? 'Save Draft' : 'Publish'}
        </button>
    )
}

export function ArticleForm({ post, role }: Props) {
    const [title, setTitle] = useState(post?.title || '')
    const [slug, setSlug] = useState(post?.slug || '')
    const [content, setContent] = useState(post?.content || '')
    const [excerpt, setExcerpt] = useState(post?.excerpt || '')
    const [featuredImage, setFeaturedImage] = useState(post?.featured_image || '')

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value
        setTitle(newTitle)
        // Automatically sync slug with title as requested
        setSlug(slugify(newTitle))
    }

    const handleSubmit = async (formData: FormData) => {
        if (post) {
            await updatePost(formData)
        } else {
            await createPost(formData)
        }
    }

    return (
        <form action={handleSubmit} className="max-w-7xl mx-auto pb-20 px-4">
            {post && <input type="hidden" name="id" value={post.id} />}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Title Section */}
                    <div className="group relative bg-zinc-900 border-2 border-white/20 p-8 rounded-2xl shadow-2xl">
                        <label className="block text-sm font-black uppercase tracking-widest text-blue-300 mb-4">
                            Article Headline
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={title}
                            onChange={handleTitleChange}
                            required
                            placeholder="ENTER A TITLE..."
                            className="w-full text-4xl md:text-5xl font-black bg-black/50 border-2 border-white/20 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 px-6 py-6 placeholder-white/30 text-white transition-all tracking-tight leading-tight"
                        />
                    </div>

                    {/* Content Section */}
                    <div className="bg-zinc-900 border-2 border-white/20 rounded-2xl shadow-xl overflow-hidden">
                        <div className="bg-zinc-800/50 p-4 border-b-2 border-white/10 flex justify-between items-center">
                            <label className="text-xl font-bold text-white">
                                Story Content
                            </label>
                            <span className="text-xs font-bold uppercase bg-white/10 px-3 py-1 rounded-full text-white/80">Editor</span>
                        </div>

                        <div className="p-1">
                            <input type="hidden" name="content" value={content} />
                            <div className="prose-editor min-h-[500px] bg-black/40">
                                <RichTextEditor content={content} onChange={setContent} />
                            </div>
                        </div>
                    </div>

                    {/* Excerpt Section */}
                    <div className="bg-zinc-900 border-2 border-white/20 p-8 rounded-2xl shadow-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <label className="text-xl font-bold text-white">Excerpt</label>
                        </div>
                        <p className="text-base text-zinc-300 mb-4 font-medium">
                            Summary for cards and SEO.
                        </p>
                        <textarea
                            name="excerpt"
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            rows={4}
                            className="w-full p-6 text-xl rounded-xl bg-black/50 border-2 border-white/20 focus:border-blue-500 focus:bg-black/80 outline-none transition-all text-white leading-relaxed shadow-inner placeholder:text-white/30"
                            placeholder="Write a brief summary here..."
                        />
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">
                    {/* Publishing Card */}
                    <div className="bg-zinc-900 border-2 border-white/20 p-6 rounded-2xl shadow-2xl sticky top-6 z-20">
                        <h3 className="font-bold text-xl mb-6 border-b-2 border-white/10 pb-4 text-white flex items-center gap-3">
                            Publishing
                        </h3>

                        <div className="space-y-6">
                            <div className="bg-black/40 p-5 rounded-xl border border-white/10">
                                <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-3">
                                    URL Slug
                                </label>
                                <input
                                    type="text"
                                    name="slug"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    required
                                    className="w-full bg-transparent border-none focus:ring-0 p-0 text-base font-mono text-blue-300 placeholder-white/30"
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 pt-2">
                                <SubmitButton isDraft={false} role={role} />
                                <SubmitButton isDraft={true} role={role} />
                            </div>
                        </div>
                    </div>

                    {/* Featured Image Card */}
                    <div className="bg-zinc-900 border-2 border-white/20 p-6 rounded-2xl shadow-xl">
                        <h3 className="font-bold text-xl mb-6 border-b-2 border-white/10 pb-4 text-white">Featured Image</h3>
                        <input type="hidden" name="featured_image" value={featuredImage} />
                        <div className="bg-black/40 rounded-xl p-4 border-2 border-dashed border-white/20">
                            <ImageUploader value={featuredImage} onChange={setFeaturedImage} />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}

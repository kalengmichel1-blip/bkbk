'use client'

import { type Editor } from '@tiptap/react'
import {
    Bold,
    Italic,
    Strikethrough,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
    Code,
} from 'lucide-react'

type Props = {
    editor: Editor | null
}

export function Toolbar({ editor }: Props) {
    if (!editor) {
        return null
    }

    return (
        <div className="flex flex-wrap gap-2 border-b border-white/10 p-2 mb-2">
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={`p-1 rounded ${editor.isActive('bold') ? 'bg-white/20' : 'hover:bg-white/10'}`}
                type="button"
            >
                <Bold size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={`p-1 rounded ${editor.isActive('italic') ? 'bg-white/20' : 'hover:bg-white/10'}`}
                type="button"
            >
                <Italic size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
                className={`p-1 rounded ${editor.isActive('strike') ? 'bg-white/20' : 'hover:bg-white/10'}`}
                type="button"
            >
                <Strikethrough size={18} />
            </button>
            <div className="w-px bg-white/10 mx-1" />
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`p-1 rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-white/20' : 'hover:bg-white/10'}`}
                type="button"
            >
                <Heading1 size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-1 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-white/20' : 'hover:bg-white/10'}`}
                type="button"
            >
                <Heading2 size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`p-1 rounded ${editor.isActive('heading', { level: 3 }) ? 'bg-white/20' : 'hover:bg-white/10'}`}
                type="button"
            >
                <Heading3 size={18} />
            </button>
            <div className="w-px bg-white/10 mx-1" />
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-1 rounded ${editor.isActive('bulletList') ? 'bg-white/20' : 'hover:bg-white/10'}`}
                type="button"
            >
                <List size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-1 rounded ${editor.isActive('orderedList') ? 'bg-white/20' : 'hover:bg-white/10'}`}
                type="button"
            >
                <ListOrdered size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`p-1 rounded ${editor.isActive('blockquote') ? 'bg-white/20' : 'hover:bg-white/10'}`}
                type="button"
            >
                <Quote size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={`p-1 rounded ${editor.isActive('codeBlock') ? 'bg-white/20' : 'hover:bg-white/10'}`}
                type="button"
            >
                <Code size={18} />
            </button>
            <div className="w-px bg-white/10 mx-1" />
            <button
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
                className="p-1 rounded hover:bg-white/10 disabled:opacity-50"
                type="button"
            >
                <Undo size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
                className="p-1 rounded hover:bg-white/10 disabled:opacity-50"
                type="button"
            >
                <Redo size={18} />
            </button>
        </div>
    )
}

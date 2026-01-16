'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { Toolbar } from './toolbar'

interface Props {
    content: string
    onChange: (content: string) => void
}

export default function RichTextEditor({ content, onChange }: Props) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.configure({
                inline: true,
                allowBase64: true, // For now, allow base64 or usage of URLs
            }),
        ],
        content: content,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[300px] p-6 text-white text-lg leading-relaxed [&_*]:text-white [&_p]:text-white [&_h1]:text-white [&_h2]:text-white [&_h3]:text-white placeholder-white/40',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
    })

    return (
        <div className="border border-white/10 rounded-lg overflow-hidden bg-white/5">
            <Toolbar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    )
}

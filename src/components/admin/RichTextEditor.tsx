'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import { useEffect, useRef } from 'react'

interface RichTextEditorProps {
  name: string
  defaultValue?: string
  placeholder?: string
  dir?: 'ltr' | 'rtl'
  required?: boolean
}

export function RichTextEditor({
  name,
  defaultValue = '',
  placeholder = 'Start writing...',
  dir = 'ltr',
  required = false,
}: RichTextEditorProps) {
  const hiddenRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      Placeholder.configure({ placeholder }),
      CharacterCount,
    ],
    content: defaultValue,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      if (hiddenRef.current) {
        hiddenRef.current.value = editor.getHTML()
      }
    },
    editorProps: {
      attributes: {
        dir,
        class: [
          'prose prose-sm max-w-none min-h-[200px] p-4 focus:outline-none text-[#231f20]',
          dir === 'rtl' ? 'text-right' : 'text-left',
        ].join(' '),
      },
    },
  })

  // Sync initial value to hidden input after mount
  useEffect(() => {
    if (hiddenRef.current) {
      hiddenRef.current.value = defaultValue
    }
  }, [defaultValue])

  const count = editor?.storage.characterCount.characters() ?? 0

  return (
    <div
      className="border border-[#e5e0d6] rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#231f20] focus-within:border-[#231f20] transition-all bg-white"
      dir={dir}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 px-3 py-2 bg-[#F5F3EE] border-b border-[#e5e0d6]">
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleBold().run()}
          active={editor?.isActive('bold')}
          title="Bold"
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          active={editor?.isActive('italic')}
          title="Italic"
        >
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          active={editor?.isActive('strike')}
          title="Strikethrough"
        >
          <s>S</s>
        </ToolbarButton>
        <div className="w-px h-5 bg-[#e5e0d6] mx-1" />
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor?.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor?.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          H3
        </ToolbarButton>
        <div className="w-px h-5 bg-[#e5e0d6] mx-1" />
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          active={editor?.isActive('bulletList')}
          title="Bullet list"
        >
          • List
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          active={editor?.isActive('orderedList')}
          title="Numbered list"
        >
          1. List
        </ToolbarButton>
        <div className="w-px h-5 bg-[#e5e0d6] mx-1" />
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          active={editor?.isActive('blockquote')}
          title="Blockquote"
        >
          ❝
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().setHorizontalRule().run()}
          active={false}
          title="Divider"
        >
          ─
        </ToolbarButton>
        <div className="w-px h-5 bg-[#e5e0d6] mx-1" />
        <ToolbarButton
          onClick={() => editor?.chain().focus().undo().run()}
          active={false}
          title="Undo"
          disabled={!editor?.can().undo()}
        >
          ↩
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().redo().run()}
          active={false}
          title="Redo"
          disabled={!editor?.can().redo()}
        >
          ↪
        </ToolbarButton>
      </div>

      {/* Editor area */}
      <EditorContent editor={editor} />

      {/* Character count + hidden input */}
      <div className="px-3 py-1.5 bg-[#F5F3EE] border-t border-[#FEF6CC] flex justify-end">
        <span className="text-3xs text-[#5C5A55] font-mono">{count} characters</span>
      </div>

      <input ref={hiddenRef} type="hidden" name={name} required={required} />
    </div>
  )
}

function ToolbarButton({
  onClick,
  active,
  title,
  disabled = false,
  children,
}: {
  onClick: () => void
  active?: boolean
  title: string
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={[
        'px-2 py-1 rounded text-xs font-bold transition-all',
        active
          ? 'bg-[#231f20] text-white'
          : 'text-[#5C5A55] hover:bg-[#FEF6CC] disabled:opacity-40 disabled:cursor-not-allowed',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

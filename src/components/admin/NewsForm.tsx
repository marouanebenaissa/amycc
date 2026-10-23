'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { RichTextEditor } from '@/components/admin/RichTextEditor'
import { FormField, Input, Textarea, Select, SectionDivider } from '@/components/admin/FormControls'
import { createNewsArticle, updateNewsArticle } from '@/lib/actions/content'

const CATEGORIES = [
  { value: 'association', label: 'Association News' },
  { value: 'press', label: 'Press Release' },
  { value: 'culture', label: 'Culture & Arts' },
  { value: 'youth', label: 'Youth' },
  { value: 'event', label: 'Event Announcement' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'other', label: 'Other' },
]

interface NewsTranslation {
  locale: string
  title: string
  excerpt?: string | null
  content: string
}

interface ArticleData {
  id: string
  slug: string
  category: string
  cover_image?: string | null
  news_translations?: NewsTranslation[]
}

interface NewsFormProps {
  article?: ArticleData
}

export function NewsForm({ article }: NewsFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [activeLocale, setActiveLocale] = useState<'ar' | 'fr' | 'en'>('ar')

  const getTranslation = (locale: string) =>
    article?.news_translations?.find((t) => t.locale === locale)

  const arTrans = getTranslation('ar')
  const frTrans = getTranslation('fr')
  const enTrans = getTranslation('en')

  async function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      try {
        if (article) {
          await updateNewsArticle(article.id, formData)
        } else {
          await createNewsArticle(formData)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      }
    })
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* General */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">General</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="URL Slug" required hint="Auto-generated from English title if blank">
            <Input
              name="slug"
              defaultValue={article?.slug}
              placeholder="association-news-title"
              pattern="[a-z0-9-]+"
            />
          </FormField>
          <FormField label="Category" required>
            <Select
              name="category"
              defaultValue={article?.category || 'association'}
              options={CATEGORIES}
            />
          </FormField>
        </div>
        <FormField label="Cover Image URL" hint="Direct image URL (Supabase Storage or external)">
          <Input
            name="cover_image"
            type="url"
            defaultValue={article?.cover_image || ''}
            placeholder="https://..."
          />
        </FormField>
      </div>

      {/* Translations */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Content</h2>
          <div className="flex gap-2">
            {(['ar', 'fr', 'en'] as const).map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => setActiveLocale(loc)}
                className={[
                  'px-3 py-1.5 text-xs font-bold rounded-lg transition-colors',
                  activeLocale === loc
                    ? 'bg-[#0068ff] text-white'
                    : 'text-slate-500 hover:bg-slate-100',
                ].join(' ')}
              >
                {loc.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Arabic */}
        <div className={activeLocale === 'ar' ? 'space-y-4' : 'hidden'}>
          <SectionDivider title="Arabic (العربية) — RTL" />
          <FormField label="Title (Arabic)" required>
            <Input
              name="title_ar"
              dir="rtl"
              defaultValue={arTrans?.title || ''}
              placeholder="عنوان المقال"
            />
          </FormField>
          <FormField label="Excerpt (Arabic)" hint="Short summary shown in news listing">
            <Textarea
              name="excerpt_ar"
              dir="rtl"
              rows={2}
              defaultValue={arTrans?.excerpt || ''}
              placeholder="ملخص المقال..."
            />
          </FormField>
          <FormField label="Article Body (Arabic)" required>
            <RichTextEditor
              name="content_ar"
              defaultValue={arTrans?.content || ''}
              placeholder="اكتب محتوى المقال هنا..."
              dir="rtl"
              required
            />
          </FormField>
        </div>

        {/* French */}
        <div className={activeLocale === 'fr' ? 'space-y-4' : 'hidden'}>
          <SectionDivider title="French (Français) — LTR" />
          <FormField label="Title (French)" required>
            <Input
              name="title_fr"
              defaultValue={frTrans?.title || ''}
              placeholder="Titre de l'article"
            />
          </FormField>
          <FormField label="Excerpt (French)" hint="Short summary shown in news listing">
            <Textarea
              name="excerpt_fr"
              rows={2}
              defaultValue={frTrans?.excerpt || ''}
              placeholder="Résumé de l'article..."
            />
          </FormField>
          <FormField label="Article Body (French)" required>
            <RichTextEditor
              name="content_fr"
              defaultValue={frTrans?.content || ''}
              placeholder="Rédigez le contenu de l'article ici..."
              required
            />
          </FormField>
        </div>

        {/* English */}
        <div className={activeLocale === 'en' ? 'space-y-4' : 'hidden'}>
          <SectionDivider title="English — LTR" />
          <FormField label="Title (English)" required>
            <Input
              name="title_en"
              defaultValue={enTrans?.title || ''}
              placeholder="Article title"
            />
          </FormField>
          <FormField label="Excerpt (English)" hint="Short summary shown in news listing">
            <Textarea
              name="excerpt_en"
              rows={2}
              defaultValue={enTrans?.excerpt || ''}
              placeholder="Article summary..."
            />
          </FormField>
          <FormField label="Article Body (English)" required>
            <RichTextEditor
              name="content_en"
              defaultValue={enTrans?.content || ''}
              placeholder="Write the article body here..."
              required
            />
          </FormField>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 text-sm font-bold text-white bg-[#0068ff] rounded-xl hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? 'Saving…' : article ? 'Update Article' : 'Create Article'}
        </button>
      </div>
    </form>
  )
}

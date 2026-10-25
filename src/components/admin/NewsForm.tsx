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
        <div className="p-4 rounded-xl bg-[#fae4dc] border border-[#f2c2b0] text-[#c85a32] text-xs font-bold">
          {error}
        </div>
      )}

      {/* General */}
      <div className="bg-white rounded-2xl border border-[#e5e0d6] p-6 space-y-5 shadow-2xs">
        <h2 className="text-xs font-bold text-[#08242a] uppercase tracking-wider">General Information</h2>
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
        <FormField label="Cover Image URL" hint="Direct image URL or /uploads path">
          <Input
            name="cover_image"
            type="text"
            defaultValue={article?.cover_image || ''}
            placeholder="/uploads/... or https://..."
          />
        </FormField>
      </div>

      {/* Translations */}
      <div className="bg-white rounded-2xl border border-[#e5e0d6] p-6 space-y-5 shadow-2xs">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-[#08242a] uppercase tracking-wider">Trilingual Article Content</h2>
          <div className="flex gap-1.5 p-1 rounded-xl bg-[#faf7f2] border border-[#e5e0d6]">
            {(['ar', 'fr', 'en'] as const).map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => setActiveLocale(loc)}
                className={[
                  'px-3 py-1.5 text-xs font-bold rounded-lg transition-all',
                  activeLocale === loc
                    ? 'bg-[#0d3b43] text-white shadow-xs'
                    : 'text-[#445457] hover:bg-[#f4ede2]',
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
              placeholder="عنوان المقال أو البيان الصحفي"
            />
          </FormField>
          <FormField label="Excerpt (Arabic)" hint="Short summary shown in news listing">
            <Textarea
              name="excerpt_ar"
              dir="rtl"
              rows={2}
              defaultValue={arTrans?.excerpt || ''}
              placeholder="ملخص موجز للمقال..."
            />
          </FormField>
          <FormField label="Article Body (Arabic) — TipTap Rich Text" required>
            <RichTextEditor
              name="content_ar"
              defaultValue={arTrans?.content || ''}
              placeholder="اكتب محتوى المقال مع التنسيق الغني هنا..."
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
          <FormField label="Article Body (French) — TipTap Rich Text" required>
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
          <FormField label="Article Body (English) — TipTap Rich Text" required>
            <RichTextEditor
              name="content_en"
              defaultValue={enTrans?.content || ''}
              placeholder="Write the article body with rich styling here..."
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
          className="px-5 py-2.5 text-xs font-bold text-[#445457] border border-[#cfc7b9] rounded-xl hover:bg-[#faf7f2] transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 text-xs font-bold text-white bg-[#0d3b43] hover:bg-[#14505b] active:scale-98 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-subtle hover:shadow-card"
        >
          {isPending ? 'Saving…' : article ? 'Update Article' : 'Create Article'}
        </button>
      </div>
    </form>
  )
}

'use client'

import { useState, useTransition, useRef } from 'react'
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
  const [coverImage, setCoverImage] = useState(article?.cover_image || '')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setUploadError('يرجى اختيار ملف صورة صالح (JPEG, PNG, WebP, GIF)')
      return
    }

    setUploadingImage(true)
    setUploadError(null)

    try {
      const data = new FormData()
      data.append('file', file)

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: data,
      })

      const json = await res.json()
      if (!res.ok || !json.url) {
        throw new Error(json.error || 'فشل رفع الصورة')
      }

      setCoverImage(json.url)
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'حدث خطأ أثناء رفع الصورة')
    } finally {
      setUploadingImage(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

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
        <div className="p-4 rounded-xl bg-[#fde8e7] border border-[#fde8e7] text-[#bd3227] text-xs font-bold">
          {error}
        </div>
      )}

      {/* General */}
      <div className="bg-white rounded-2xl border border-[#e5e0d6] p-6 space-y-5 shadow-2xs">
        <h2 className="text-xs font-bold text-[#231f20] uppercase tracking-wider">General Information</h2>
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
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-[#231f20]">
              Cover Image URL / صورة المقال أو الخبر
            </label>
            <span className="text-3xs text-[#5C5A55]">
              Direct image URL or /uploads path
            </span>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <input
                name="cover_image"
                type="text"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="/uploads/... or https://..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#cfc7b9] text-xs font-mono bg-white text-[#231f20] focus:outline-none focus:border-[#231f20] transition-colors"
              />
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingImage}
              className="px-4 py-2.5 rounded-xl text-xs font-extrabold text-white bg-[#231f20] hover:bg-[#d2a82b] active:scale-98 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-xs"
            >
              <span>{uploadingImage ? '⏳' : '📥'}</span>
              <span>{uploadingImage ? 'جاري الاستيراد...' : 'Import / استيراد صورة'}</span>
            </button>

            {coverImage && (
              <button
                type="button"
                onClick={() => setCoverImage('')}
                className="px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors shrink-0 cursor-pointer"
                title="إزالة الصورة"
              >
                ✕ إزالة
              </button>
            )}
          </div>

          {uploadError && (
            <p className="text-3xs text-rose-600 font-bold mt-1.5 flex items-center gap-1">
              <span>⚠️</span>
              <span>{uploadError}</span>
            </p>
          )}

          {coverImage && (
            <div className="mt-3 p-3 rounded-2xl border border-[#e5e0d6] bg-[#F5F3EE] flex items-center gap-3 max-w-md">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#e5e0d6] bg-black/5 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverImage}
                  alt="Cover Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-3xs font-extrabold uppercase text-[#231f20] block">
                  معاينة الغلاف (Live Preview)
                </span>
                <span className="text-3xs font-mono text-[#5C5A55] truncate block">
                  {coverImage}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Translations */}
      <div className="bg-white rounded-2xl border border-[#e5e0d6] p-6 space-y-5 shadow-2xs">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-[#231f20] uppercase tracking-wider">Trilingual Article Content</h2>
          <div className="flex gap-1.5 p-1 rounded-xl bg-[#F5F3EE] border border-[#e5e0d6]">
            {(['ar', 'fr', 'en'] as const).map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => setActiveLocale(loc)}
                className={[
                  'px-3 py-1.5 text-xs font-bold rounded-lg transition-all',
                  activeLocale === loc
                    ? 'bg-[#231f20] text-white shadow-xs'
                    : 'text-[#5C5A55] hover:bg-[#FEF6CC]',
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
          className="px-5 py-2.5 text-xs font-bold text-[#5C5A55] border border-[#cfc7b9] rounded-xl hover:bg-[#F5F3EE] transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 text-xs font-bold text-white bg-[#231f20] hover:bg-[#d2a82b] active:scale-98 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-subtle hover:shadow-card"
        >
          {isPending ? 'Saving…' : article ? 'Update Article' : 'Create Article'}
        </button>
      </div>
    </form>
  )
}

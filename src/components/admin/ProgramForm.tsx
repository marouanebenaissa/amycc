'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { FormField, Input, Textarea, Select, SectionDivider } from '@/components/admin/FormControls'
import { createProgram, updateProgram } from '@/lib/actions/content'

const CATEGORIES = [
  { value: 'arts', label: 'Arts & Creativity' },
  { value: 'music', label: 'Music' },
  { value: 'theatre', label: 'Theatre & Performing Arts' },
  { value: 'culture', label: 'Culture & Heritage' },
  { value: 'youth', label: 'Youth Empowerment' },
  { value: 'volunteer', label: 'Volunteering' },
  { value: 'education', label: 'Educational & Artistic Development' },
  { value: 'other', label: 'Other' },
]

interface ProgramTranslation {
  locale: string
  title: string
  description?: string | null
}

interface ProgramData {
  id: string
  slug: string
  category: string
  city?: string | null
  cover_image?: string | null
  start_date?: string | null
  end_date?: string | null
  program_translations?: ProgramTranslation[]
}

interface ProgramFormProps {
  program?: ProgramData
}

export function ProgramForm({ program }: ProgramFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [activeLocale, setActiveLocale] = useState<'ar' | 'fr' | 'en'>('ar')

  const getTranslation = (locale: string) =>
    program?.program_translations?.find((t) => t.locale === locale)

  const arTrans = getTranslation('ar')
  const frTrans = getTranslation('fr')
  const enTrans = getTranslation('en')

  async function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      try {
        if (program) {
          await updateProgram(program.id, formData)
        } else {
          await createProgram(formData)
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

      {/* Basic fields */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">General</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="URL Slug" required hint="Lowercase, hyphens only (auto-generated if blank)">
            <Input
              name="slug"
              defaultValue={program?.slug}
              placeholder="youth-music-workshop"
              pattern="[a-z0-9-]+"
            />
          </FormField>
          <FormField label="Category" required>
            <Select
              name="category"
              defaultValue={program?.category || 'arts'}
              options={CATEGORIES}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField label="City" hint="Leave blank for national scope">
            <Input name="city" defaultValue={program?.city || ''} placeholder="Casablanca" />
          </FormField>
          <FormField label="Start Date">
            <Input
              name="start_date"
              type="date"
              defaultValue={program?.start_date?.slice(0, 10) || ''}
            />
          </FormField>
          <FormField label="End Date">
            <Input
              name="end_date"
              type="date"
              defaultValue={program?.end_date?.slice(0, 10) || ''}
            />
          </FormField>
        </div>

        <FormField label="Cover Image URL" hint="Paste a direct image link (Supabase Storage or external)">
          <Input
            name="cover_image"
            type="url"
            defaultValue={program?.cover_image || ''}
            placeholder="https://..."
          />
        </FormField>
      </div>

      {/* Translations */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Translations</h2>
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
              placeholder="عنوان البرنامج"
            />
          </FormField>
          <FormField label="Description (Arabic)">
            <Textarea
              name="description_ar"
              dir="rtl"
              defaultValue={arTrans?.description || ''}
              placeholder="وصف البرنامج..."
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
              placeholder="Titre du programme"
            />
          </FormField>
          <FormField label="Description (French)">
            <Textarea
              name="description_fr"
              defaultValue={frTrans?.description || ''}
              placeholder="Description du programme..."
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
              placeholder="Program title"
            />
          </FormField>
          <FormField label="Description (English)">
            <Textarea
              name="description_en"
              defaultValue={enTrans?.description || ''}
              placeholder="Program description..."
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
          {isPending ? 'Saving…' : program ? 'Update Program' : 'Create Program'}
        </button>
      </div>
    </form>
  )
}

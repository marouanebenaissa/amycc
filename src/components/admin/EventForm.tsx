'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { FormField, Input, Textarea, SectionDivider } from '@/components/admin/FormControls'
import { createEvent, updateEvent } from '@/lib/actions/content'

interface EventTranslation {
  locale: string
  title: string
  description?: string | null
}

interface EventData {
  id: string
  slug: string
  start_date: string
  end_date?: string | null
  venue?: string | null
  city?: string | null
  capacity?: number | null
  registration_open: boolean
  registration_deadline?: string | null
  cover_image?: string | null
  event_translations?: EventTranslation[]
}

interface EventFormProps {
  event?: EventData
}

export function EventForm({ event }: EventFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [activeLocale, setActiveLocale] = useState<'ar' | 'fr' | 'en'>('ar')

  const getTranslation = (locale: string) =>
    event?.event_translations?.find((t) => t.locale === locale)

  const arTrans = getTranslation('ar')
  const frTrans = getTranslation('fr')
  const enTrans = getTranslation('en')

  // Convert ISO string to datetime-local input format
  const toDatetimeLocal = (iso?: string | null) =>
    iso ? iso.replace('Z', '').slice(0, 16) : ''

  async function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      try {
        if (event) {
          await updateEvent(event.id, formData)
        } else {
          await createEvent(formData)
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
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Event Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="URL Slug" required hint="Auto-generated from English title if blank">
            <Input
              name="slug"
              defaultValue={event?.slug}
              placeholder="summer-music-festival"
              pattern="[a-z0-9-]+"
            />
          </FormField>
          <FormField label="City">
            <Input name="city" defaultValue={event?.city || ''} placeholder="Casablanca" />
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Start Date & Time" required>
            <Input
              name="start_date"
              type="datetime-local"
              defaultValue={toDatetimeLocal(event?.start_date)}
              required
            />
          </FormField>
          <FormField label="End Date & Time">
            <Input
              name="end_date"
              type="datetime-local"
              defaultValue={toDatetimeLocal(event?.end_date)}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Venue / Location">
            <Input
              name="venue"
              defaultValue={event?.venue || ''}
              placeholder="Cultural Center, Hall A"
            />
          </FormField>
          <FormField label="Capacity" hint="Leave blank for unlimited">
            <Input
              name="capacity"
              type="number"
              min="0"
              defaultValue={event?.capacity?.toString() || ''}
              placeholder="100"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Registration Deadline">
            <Input
              name="registration_deadline"
              type="datetime-local"
              defaultValue={toDatetimeLocal(event?.registration_deadline)}
            />
          </FormField>
          <FormField label="Registration Status">
            <label className="flex items-center gap-3 pt-2 cursor-pointer">
              <input
                type="checkbox"
                name="registration_open"
                value="true"
                defaultChecked={event?.registration_open ?? false}
                className="w-4 h-4 rounded border-slate-300 text-[#0068ff] focus:ring-[#0068ff]"
              />
              <span className="text-sm text-slate-700">Open for registration</span>
            </label>
          </FormField>
        </div>

        <FormField label="Cover Image URL" hint="Direct image URL">
          <Input
            name="cover_image"
            type="url"
            defaultValue={event?.cover_image || ''}
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
            <Input name="title_ar" dir="rtl" defaultValue={arTrans?.title || ''} placeholder="عنوان الفعالية" />
          </FormField>
          <FormField label="Description (Arabic)">
            <Textarea name="description_ar" dir="rtl" defaultValue={arTrans?.description || ''} placeholder="وصف الفعالية..." />
          </FormField>
        </div>

        {/* French */}
        <div className={activeLocale === 'fr' ? 'space-y-4' : 'hidden'}>
          <SectionDivider title="French (Français) — LTR" />
          <FormField label="Title (French)" required>
            <Input name="title_fr" defaultValue={frTrans?.title || ''} placeholder="Titre de l'événement" />
          </FormField>
          <FormField label="Description (French)">
            <Textarea name="description_fr" defaultValue={frTrans?.description || ''} placeholder="Description de l'événement..." />
          </FormField>
        </div>

        {/* English */}
        <div className={activeLocale === 'en' ? 'space-y-4' : 'hidden'}>
          <SectionDivider title="English — LTR" />
          <FormField label="Title (English)" required>
            <Input name="title_en" defaultValue={enTrans?.title || ''} placeholder="Event title" />
          </FormField>
          <FormField label="Description (English)">
            <Textarea name="description_en" defaultValue={enTrans?.description || ''} placeholder="Event description..." />
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
          {isPending ? 'Saving…' : event ? 'Update Event' : 'Create Event'}
        </button>
      </div>
    </form>
  )
}

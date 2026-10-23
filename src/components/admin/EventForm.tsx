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
        <div className="p-4 rounded-xl bg-[#fae4dc] border border-[#f2c2b0] text-[#c85a32] text-xs font-bold">
          {error}
        </div>
      )}

      {/* General */}
      <div className="bg-white rounded-2xl border border-[#e5e0d6] p-6 space-y-5 shadow-2xs">
        <h2 className="text-xs font-bold text-[#08242a] uppercase tracking-wider">Event Scheduling & Capacity</h2>

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
          <FormField label="Capacity (Attendees)" hint="Leave blank for unlimited capacity">
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
          <FormField label="Registration Availability">
            <label className="flex items-center gap-3 pt-2 cursor-pointer">
              <input
                type="checkbox"
                name="registration_open"
                value="true"
                defaultChecked={event?.registration_open ?? false}
                className="w-4 h-4 rounded border-[#cfc7b9] text-[#0d3b43] focus:ring-[#0d3b43]"
              />
              <span className="text-xs font-bold text-[#08242a]">Open for attendee registration</span>
            </label>
          </FormField>
        </div>

        <FormField label="Cover Image URL" hint="Direct image link">
          <Input
            name="cover_image"
            type="url"
            defaultValue={event?.cover_image || ''}
            placeholder="https://images.unsplash.com/..."
          />
        </FormField>
      </div>

      {/* Translations */}
      <div className="bg-white rounded-2xl border border-[#e5e0d6] p-6 space-y-5 shadow-2xs">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-[#08242a] uppercase tracking-wider">Trilingual Event Descriptions</h2>
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
            <Input name="title_ar" dir="rtl" defaultValue={arTrans?.title || ''} placeholder="عنوان الفعالية بالعربية" />
          </FormField>
          <FormField label="Description (Arabic)">
            <Textarea name="description_ar" dir="rtl" defaultValue={arTrans?.description || ''} placeholder="تفاصيل الفعالية والبرنامج..." />
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
          className="px-5 py-2.5 text-xs font-bold text-[#445457] border border-[#cfc7b9] rounded-xl hover:bg-[#faf7f2] transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 text-xs font-bold text-white bg-[#0d3b43] hover:bg-[#14505b] active:scale-98 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-subtle hover:shadow-card"
        >
          {isPending ? 'Saving…' : event ? 'Update Event' : 'Create Event'}
        </button>
      </div>
    </form>
  )
}

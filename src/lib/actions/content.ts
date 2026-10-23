'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

// ============================================================
// Helpers
// ============================================================

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')
  return { supabase, user }
}

// ============================================================
// Zod schemas
// ============================================================

const programSchema = z.object({
  slug: z.string().min(1).max(100),
  category: z.string().min(1),
  city: z.string().optional(),
  cover_image: z.string().url().optional().or(z.literal('')),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  // Translations
  title_ar: z.string().min(1, 'Arabic title is required'),
  description_ar: z.string().optional(),
  title_fr: z.string().min(1, 'French title is required'),
  description_fr: z.string().optional(),
  title_en: z.string().min(1, 'English title is required'),
  description_en: z.string().optional(),
})

const newsSchema = z.object({
  slug: z.string().min(1).max(100),
  category: z.string().min(1),
  cover_image: z.string().url().optional().or(z.literal('')),
  // Translations
  title_ar: z.string().min(1, 'Arabic title is required'),
  excerpt_ar: z.string().optional(),
  content_ar: z.string().min(1, 'Arabic content is required'),
  title_fr: z.string().min(1, 'French title is required'),
  excerpt_fr: z.string().optional(),
  content_fr: z.string().min(1, 'French content is required'),
  title_en: z.string().min(1, 'English title is required'),
  excerpt_en: z.string().optional(),
  content_en: z.string().min(1, 'English content is required'),
})

const eventSchema = z.object({
  slug: z.string().min(1).max(100),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().optional(),
  venue: z.string().optional(),
  city: z.string().optional(),
  capacity: z.coerce.number().int().min(0).optional(),
  registration_open: z.coerce.boolean().optional(),
  registration_deadline: z.string().optional(),
  cover_image: z.string().url().optional().or(z.literal('')),
  // Translations
  title_ar: z.string().min(1, 'Arabic title is required'),
  description_ar: z.string().optional(),
  title_fr: z.string().min(1, 'French title is required'),
  description_fr: z.string().optional(),
  title_en: z.string().min(1, 'English title is required'),
  description_en: z.string().optional(),
})

// ============================================================
// PROGRAMS
// ============================================================

export async function createProgram(formData: FormData): Promise<void> {
  const { supabase, user } = await requireAdmin()

  const raw = {
    slug: (formData.get('slug') as string)?.trim() || slugify(formData.get('title_en') as string || ''),
    category: formData.get('category') as string,
    city: (formData.get('city') as string) || undefined,
    cover_image: (formData.get('cover_image') as string) || undefined,
    start_date: (formData.get('start_date') as string) || undefined,
    end_date: (formData.get('end_date') as string) || undefined,
    title_ar: formData.get('title_ar') as string,
    description_ar: formData.get('description_ar') as string,
    title_fr: formData.get('title_fr') as string,
    description_fr: formData.get('description_fr') as string,
    title_en: formData.get('title_en') as string,
    description_en: formData.get('description_en') as string,
  }

  const parsed = programSchema.safeParse(raw)
  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((e) => e.message).join(', '))
  }

  const d = parsed.data

  const { data: program, error: progErr } = await supabase
    .from('programs')
    .insert({
      slug: d.slug,
      category: d.category,
      city: d.city || null,
      cover_image: d.cover_image || null,
      start_date: d.start_date || null,
      end_date: d.end_date || null,
      created_by: user.id,
    })
    .select('id')
    .single()

  if (progErr) throw new Error(progErr.message)

  const translations = [
    { locale: 'ar', title: d.title_ar, description: d.description_ar },
    { locale: 'fr', title: d.title_fr, description: d.description_fr },
    { locale: 'en', title: d.title_en, description: d.description_en },
  ].map((t) => ({ ...t, program_id: program.id }))

  const { error: transErr } = await supabase.from('program_translations').insert(translations)
  if (transErr) throw new Error(transErr.message)

  revalidatePath('/admin/programs')
  revalidatePath('/ar/programs')
  revalidatePath('/fr/programs')
  revalidatePath('/en/programs')
  redirect('/admin/programs')
}

export async function updateProgram(id: string, formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin()

  const raw = {
    slug: (formData.get('slug') as string)?.trim(),
    category: formData.get('category') as string,
    city: (formData.get('city') as string) || undefined,
    cover_image: (formData.get('cover_image') as string) || undefined,
    start_date: (formData.get('start_date') as string) || undefined,
    end_date: (formData.get('end_date') as string) || undefined,
    title_ar: formData.get('title_ar') as string,
    description_ar: formData.get('description_ar') as string,
    title_fr: formData.get('title_fr') as string,
    description_fr: formData.get('description_fr') as string,
    title_en: formData.get('title_en') as string,
    description_en: formData.get('description_en') as string,
  }

  const parsed = programSchema.safeParse(raw)
  if (!parsed.success) throw new Error(parsed.error.issues.map((e) => e.message).join(', '))

  const d = parsed.data

  const { error: progErr } = await supabase
    .from('programs')
    .update({
      slug: d.slug,
      category: d.category,
      city: d.city || null,
      cover_image: d.cover_image || null,
      start_date: d.start_date || null,
      end_date: d.end_date || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (progErr) throw new Error(progErr.message)

  for (const t of [
    { locale: 'ar', title: d.title_ar, description: d.description_ar },
    { locale: 'fr', title: d.title_fr, description: d.description_fr },
    { locale: 'en', title: d.title_en, description: d.description_en },
  ]) {
    await supabase
      .from('program_translations')
      .upsert(
        { program_id: id, locale: t.locale, title: t.title, description: t.description || null },
        { onConflict: 'program_id,locale' }
      )
  }

  revalidatePath('/admin/programs')
  revalidatePath('/ar/programs')
  redirect('/admin/programs')
}

export async function deleteProgram(id: string): Promise<void> {
  const { supabase } = await requireAdmin()
  await supabase.from('programs').delete().eq('id', id)
  revalidatePath('/admin/programs')
  revalidatePath('/ar/programs')
}

// ============================================================
// NEWS ARTICLES
// ============================================================

export async function createNewsArticle(formData: FormData): Promise<void> {
  const { supabase, user } = await requireAdmin()

  const raw = {
    slug: (formData.get('slug') as string)?.trim() || slugify(formData.get('title_en') as string || ''),
    category: formData.get('category') as string,
    cover_image: (formData.get('cover_image') as string) || undefined,
    title_ar: formData.get('title_ar') as string,
    excerpt_ar: (formData.get('excerpt_ar') as string) || undefined,
    content_ar: formData.get('content_ar') as string,
    title_fr: formData.get('title_fr') as string,
    excerpt_fr: (formData.get('excerpt_fr') as string) || undefined,
    content_fr: formData.get('content_fr') as string,
    title_en: formData.get('title_en') as string,
    excerpt_en: (formData.get('excerpt_en') as string) || undefined,
    content_en: formData.get('content_en') as string,
  }

  const parsed = newsSchema.safeParse(raw)
  if (!parsed.success) throw new Error(parsed.error.issues.map((e) => e.message).join(', '))

  const d = parsed.data

  const { data: article, error: artErr } = await supabase
    .from('news_articles')
    .insert({
      slug: d.slug,
      category: d.category,
      cover_image: d.cover_image || null,
      author_id: user.id,
    })
    .select('id')
    .single()

  if (artErr) throw new Error(artErr.message)

  const translations = [
    { locale: 'ar', title: d.title_ar, excerpt: d.excerpt_ar, content: d.content_ar },
    { locale: 'fr', title: d.title_fr, excerpt: d.excerpt_fr, content: d.content_fr },
    { locale: 'en', title: d.title_en, excerpt: d.excerpt_en, content: d.content_en },
  ].map((t) => ({ ...t, article_id: article.id }))

  const { error: transErr } = await supabase.from('news_translations').insert(translations)
  if (transErr) throw new Error(transErr.message)

  revalidatePath('/admin/news')
  revalidatePath('/ar/news')
  redirect('/admin/news')
}

export async function updateNewsArticle(id: string, formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin()

  const raw = {
    slug: (formData.get('slug') as string)?.trim(),
    category: formData.get('category') as string,
    cover_image: (formData.get('cover_image') as string) || undefined,
    title_ar: formData.get('title_ar') as string,
    excerpt_ar: (formData.get('excerpt_ar') as string) || undefined,
    content_ar: formData.get('content_ar') as string,
    title_fr: formData.get('title_fr') as string,
    excerpt_fr: (formData.get('excerpt_fr') as string) || undefined,
    content_fr: formData.get('content_fr') as string,
    title_en: formData.get('title_en') as string,
    excerpt_en: (formData.get('excerpt_en') as string) || undefined,
    content_en: formData.get('content_en') as string,
  }

  const parsed = newsSchema.safeParse(raw)
  if (!parsed.success) throw new Error(parsed.error.issues.map((e) => e.message).join(', '))

  const d = parsed.data

  await supabase
    .from('news_articles')
    .update({ slug: d.slug, category: d.category, cover_image: d.cover_image || null, updated_at: new Date().toISOString() })
    .eq('id', id)

  for (const t of [
    { locale: 'ar', title: d.title_ar, excerpt: d.excerpt_ar, content: d.content_ar },
    { locale: 'fr', title: d.title_fr, excerpt: d.excerpt_fr, content: d.content_fr },
    { locale: 'en', title: d.title_en, excerpt: d.excerpt_en, content: d.content_en },
  ]) {
    await supabase
      .from('news_translations')
      .upsert(
        { article_id: id, locale: t.locale, title: t.title, excerpt: t.excerpt || null, content: t.content },
        { onConflict: 'article_id,locale' }
      )
  }

  revalidatePath('/admin/news')
  revalidatePath('/ar/news')
  redirect('/admin/news')
}

export async function deleteNewsArticle(id: string): Promise<void> {
  const { supabase } = await requireAdmin()
  await supabase.from('news_articles').delete().eq('id', id)
  revalidatePath('/admin/news')
}

// ============================================================
// EVENTS
// ============================================================

export async function createEvent(formData: FormData): Promise<void> {
  const { supabase, user } = await requireAdmin()

  const raw = {
    slug: (formData.get('slug') as string)?.trim() || slugify(formData.get('title_en') as string || ''),
    start_date: formData.get('start_date') as string,
    end_date: (formData.get('end_date') as string) || undefined,
    venue: (formData.get('venue') as string) || undefined,
    city: (formData.get('city') as string) || undefined,
    capacity: formData.get('capacity') as string,
    registration_open: formData.get('registration_open') as string,
    registration_deadline: (formData.get('registration_deadline') as string) || undefined,
    cover_image: (formData.get('cover_image') as string) || undefined,
    title_ar: formData.get('title_ar') as string,
    description_ar: (formData.get('description_ar') as string) || undefined,
    title_fr: formData.get('title_fr') as string,
    description_fr: (formData.get('description_fr') as string) || undefined,
    title_en: formData.get('title_en') as string,
    description_en: (formData.get('description_en') as string) || undefined,
  }

  const parsed = eventSchema.safeParse(raw)
  if (!parsed.success) throw new Error(parsed.error.issues.map((e) => e.message).join(', '))

  const d = parsed.data

  const { data: event, error: evErr } = await supabase
    .from('events')
    .insert({
      slug: d.slug,
      start_date: d.start_date,
      end_date: d.end_date || null,
      venue: d.venue || null,
      city: d.city || null,
      capacity: d.capacity ?? null,
      registration_open: d.registration_open ?? false,
      registration_deadline: d.registration_deadline || null,
      cover_image: d.cover_image || null,
      created_by: user.id,
    })
    .select('id')
    .single()

  if (evErr) throw new Error(evErr.message)

  const translations = [
    { locale: 'ar', title: d.title_ar, description: d.description_ar },
    { locale: 'fr', title: d.title_fr, description: d.description_fr },
    { locale: 'en', title: d.title_en, description: d.description_en },
  ].map((t) => ({ ...t, event_id: event.id }))

  const { error: transErr } = await supabase.from('event_translations').insert(translations)
  if (transErr) throw new Error(transErr.message)

  revalidatePath('/admin/events')
  revalidatePath('/ar/events')
  redirect('/admin/events')
}

export async function updateEvent(id: string, formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin()

  const raw = {
    slug: (formData.get('slug') as string)?.trim(),
    start_date: formData.get('start_date') as string,
    end_date: (formData.get('end_date') as string) || undefined,
    venue: (formData.get('venue') as string) || undefined,
    city: (formData.get('city') as string) || undefined,
    capacity: formData.get('capacity') as string,
    registration_open: formData.get('registration_open') as string,
    registration_deadline: (formData.get('registration_deadline') as string) || undefined,
    cover_image: (formData.get('cover_image') as string) || undefined,
    title_ar: formData.get('title_ar') as string,
    description_ar: (formData.get('description_ar') as string) || undefined,
    title_fr: formData.get('title_fr') as string,
    description_fr: (formData.get('description_fr') as string) || undefined,
    title_en: formData.get('title_en') as string,
    description_en: (formData.get('description_en') as string) || undefined,
  }

  const parsed = eventSchema.safeParse(raw)
  if (!parsed.success) throw new Error(parsed.error.issues.map((e) => e.message).join(', '))

  const d = parsed.data

  await supabase
    .from('events')
    .update({
      slug: d.slug,
      start_date: d.start_date,
      end_date: d.end_date || null,
      venue: d.venue || null,
      city: d.city || null,
      capacity: d.capacity ?? null,
      registration_open: d.registration_open ?? false,
      registration_deadline: d.registration_deadline || null,
      cover_image: d.cover_image || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  for (const t of [
    { locale: 'ar', title: d.title_ar, description: d.description_ar },
    { locale: 'fr', title: d.title_fr, description: d.description_fr },
    { locale: 'en', title: d.title_en, description: d.description_en },
  ]) {
    await supabase
      .from('event_translations')
      .upsert(
        { event_id: id, locale: t.locale, title: t.title, description: t.description || null },
        { onConflict: 'event_id,locale' }
      )
  }

  revalidatePath('/admin/events')
  revalidatePath('/ar/events')
  redirect('/admin/events')
}

export async function deleteEvent(id: string): Promise<void> {
  const { supabase } = await requireAdmin()
  await supabase.from('events').delete().eq('id', id)
  revalidatePath('/admin/events')
}

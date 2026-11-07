import type { MetadataRoute } from 'next'
import { locales } from '@/lib/i18n/config'
import { getSiteUrl } from '@/lib/seo/config'
import { createPublicClient } from '@/lib/supabase/public'

export const revalidate = 3600 // Revalidate sitemap hourly

interface RouteDefinition {
  path: string
  priority: number
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl()

  const staticRoutes: RouteDefinition[] = [
    { path: '', priority: 1.0, changeFrequency: 'daily' },
    { path: '/about', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/programs', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/annual-program', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/events', priority: 0.9, changeFrequency: 'daily' },
    { path: '/news', priority: 0.9, changeFrequency: 'daily' },
    { path: '/team', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/impact', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/partnerships', priority: 0.85, changeFrequency: 'monthly' },
    { path: '/membership', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/support', priority: 0.85, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/faq', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/privacy', priority: 0.5, changeFrequency: 'yearly' },
  ]

  // Default dynamic slugs
  const defaultProgramSlugs = [
    'youth-in-action',
    'arts-heritage-workshops',
    'theatre-scenic-expression',
    'musical-heritage-revival',
  ]
  const defaultEventSlugs = ['AMYCC-Association-Launch-Event']
  const defaultNewsSlugs = ['official-launch', 'youth-in-action-call', 'theatre-workshops-launch']

  let programSlugs = defaultProgramSlugs
  let eventSlugs = defaultEventSlugs
  let newsSlugs = defaultNewsSlugs

  try {
    const supabase = createPublicClient()

    const [progRes, evtRes, newsRes] = await Promise.allSettled([
      supabase.from('programs').select('slug').eq('status', 'published'),
      supabase.from('events').select('slug').or('status.eq.published,status.is.null'),
      supabase.from('news_articles').select('slug').eq('status', 'published'),
    ])

    if (progRes.status === 'fulfilled' && progRes.value.data && progRes.value.data.length > 0) {
      const dbSlugs = progRes.value.data.map((p) => p.slug).filter(Boolean)
      programSlugs = Array.from(new Set([...programSlugs, ...dbSlugs]))
    }

    if (evtRes.status === 'fulfilled' && evtRes.value.data && evtRes.value.data.length > 0) {
      const dbSlugs = evtRes.value.data.map((e) => e.slug).filter(Boolean)
      eventSlugs = Array.from(new Set([...eventSlugs, ...dbSlugs]))
    }

    if (newsRes.status === 'fulfilled' && newsRes.value.data && newsRes.value.data.length > 0) {
      const dbSlugs = newsRes.value.data.map((n) => n.slug).filter(Boolean)
      newsSlugs = Array.from(new Set([...newsSlugs, ...dbSlugs]))
    }
  } catch {
    // Graceful fallback to default slugs
  }

  const allRoutes: RouteDefinition[] = [
    ...staticRoutes,
    ...programSlugs.map((slug) => ({
      path: `/programs/${slug}`,
      priority: 0.85,
      changeFrequency: 'weekly' as const,
    })),
    ...eventSlugs.map((slug) => ({
      path: `/events/${slug}`,
      priority: 0.85,
      changeFrequency: 'weekly' as const,
    })),
    ...newsSlugs.map((slug) => ({
      path: `/news/${slug}`,
      priority: 0.85,
      changeFrequency: 'weekly' as const,
    })),
  ]

  const sitemapEntries: MetadataRoute.Sitemap = []
  const now = new Date()

  for (const route of allRoutes) {
    const alternateLanguages: Record<string, string> = {}
    for (const loc of locales) {
      alternateLanguages[loc] = `${baseUrl}/${loc}${route.path}`
    }
    alternateLanguages['x-default'] = `${baseUrl}/ar${route.path}`

    for (const locale of locales) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route.path}`,
        lastModified: now,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages: alternateLanguages,
        },
      })
    }
  }

  return sitemapEntries
}

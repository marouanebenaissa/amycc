import type { MetadataRoute } from 'next'
import { locales } from '@/lib/i18n/config'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://amycc.org'

  const pages = [
    '',
    '/about',
    '/programs',
    '/programs/youth-in-action',
    '/programs/arts-heritage-workshops',
    '/events',
    '/news',
    '/news/official-launch',
    '/membership',
    '/partnerships',
    '/support',
    '/contact',
    '/privacy',
    '/faq',
  ]

  const sitemapEntries: MetadataRoute.Sitemap = []

  for (const page of pages) {
    for (const locale of locales) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1.0 : page === '/programs' || page === '/membership' ? 0.9 : 0.7,
      })
    }
  }

  return sitemapEntries
}

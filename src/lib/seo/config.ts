import type { Metadata } from 'next'
import { locales, type Locale, defaultLocale } from '@/lib/i18n/config'

export const SITE_URL = 'https://amycc.vercel.app'

export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    return envUrl.replace(/\/$/, '')
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return SITE_URL
}

export const SITE_NAME: Record<Locale, string> = {
  ar: 'جمعية روح الفنون والثقافة (AMYCC) — مراكش، المملكة المغربية',
  fr: 'Association Esprit des Arts et de la Culture (AMYCC) — Marrakech, Maroc',
  en: 'Spirit of Arts & Culture Association (AMYCC) — Marrakech, Morocco',
}

export const TARGET_KEYWORDS: Record<Locale, string[]> = {
  ar: [
    'جمعية ثقافية مراكش',
    'تطوع الشباب المغرب',
    'جمعية روح الفنون والثقافة',
    'تمكين الشباب بالمغرب',
    'التراث المغربي الأصيل مراكش',
    'المسرح والفنون التشكيلية مراكش',
    'المجتمع المدني المغرب',
    'ورشات فنية مجانية مراكش',
    'مبادرة شباب في العمل',
    'العمل الجمعوي والتطوعي مراكش',
  ],
  fr: [
    'association culturelle Marrakech',
    'bénévolat jeunesse Maroc',
    'association Esprit des Arts et de la Culture',
    'autonomisation des jeunes Maroc',
    'patrimoine culturel marocain Marrakech',
    'théâtre et arts plastiques Marrakech',
    'société civile marocaine',
    'ateliers artistiques Marrakech',
    'Jeunesse en Action Maroc',
    'ONG culturelle Maroc',
  ],
  en: [
    'cultural association Marrakech',
    'youth arts nonprofit Morocco',
    'youth volunteering Morocco',
    'Spirit of Arts and Culture Association',
    'Moroccan cultural heritage preservation',
    'youth empowerment Marrakech',
    'theatre and fine arts workshops Morocco',
    'Moroccan civil society NGO',
    'Youth in Action initiative',
    'nonprofit cultural organization Morocco',
  ],
}

export const DEFAULT_OG_IMAGE = {
  url: `${SITE_URL}/logo.png`,
  width: 1200,
  height: 630,
  alt: 'AMYCC — Spirit of Arts & Culture Association | جمعية روح الفنون والثقافة بمراكش',
}

export function constructCanonical(locale: string, path: string = ''): string {
  const baseUrl = getSiteUrl()
  const cleanPath = path ? (path.startsWith('/') ? path : `/${path}`) : ''
  return `${baseUrl}/${locale}${cleanPath}`
}

export function constructAlternates(path: string = '') {
  const baseUrl = getSiteUrl()
  const cleanPath = path ? (path.startsWith('/') ? path : `/${path}`) : ''

  const languages: Record<string, string> = {}
  for (const loc of locales) {
    languages[loc] = `${baseUrl}/${loc}${cleanPath}`
  }
  // x-default points to Arabic as the primary institutional language or root path
  languages['x-default'] = `${baseUrl}/ar${cleanPath}`

  return {
    languages,
  }
}

export interface MetadataOptions {
  title: string
  description: string
  path?: string
  locale: string
  image?: string
  imageAlt?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  keywords?: string[]
  noIndex?: boolean
}

export function constructMetadata({
  title,
  description,
  path = '',
  locale,
  image,
  imageAlt,
  type = 'website',
  publishedTime,
  modifiedTime,
  keywords,
  noIndex = false,
}: MetadataOptions): Metadata {
  const baseUrl = getSiteUrl()
  const validLocale = (locales.includes(locale as Locale) ? locale : defaultLocale) as Locale
  const siteName = SITE_NAME[validLocale]
  const canonicalUrl = constructCanonical(validLocale, path)
  const alternates = constructAlternates(path)

  const selectedKeywords = keywords || TARGET_KEYWORDS[validLocale]
  const ogImageUrl = image
    ? (image.startsWith('http') ? image : `${baseUrl}${image.startsWith('/') ? image : `/${image}`}`)
    : DEFAULT_OG_IMAGE.url
  const ogImageAlt = imageAlt || title

  return {
    title,
    description,
    keywords: selectedKeywords,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: canonicalUrl,
      languages: alternates.languages,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName,
      locale: validLocale === 'ar' ? 'ar_MA' : validLocale === 'fr' ? 'fr_MA' : 'en_US',
      alternateLocale: validLocale === 'ar' ? ['fr_MA', 'en_US'] : validLocale === 'fr' ? ['ar_MA', 'en_US'] : ['ar_MA', 'fr_MA'],
      type,
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
      creator: '@amycc_morocco',
      site: '@amycc_morocco',
    },
  }
}

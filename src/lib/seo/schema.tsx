import React from 'react'
import { getSiteUrl } from './config'

export interface BreadcrumbItem {
  name: string
  url?: string
  path?: string
}

export interface EventSchemaParams {
  name: string
  description: string
  startDate: string
  endDate?: string | null
  venue?: string | null
  city?: string | null
  imageUrl?: string | null
  url: string
  locale?: string
}

export interface ArticleSchemaParams {
  headline: string
  description: string
  publishedAt?: string | null
  modifiedAt?: string | null
  imageUrl?: string | null
  url: string
  locale?: string
}

export interface FaqSchemaItem {
  q: string
  a: string
}

export function getOrganizationJsonLd(locale: string = 'ar') {
  const siteUrl = getSiteUrl()
  const isAr = locale === 'ar'
  const isFr = locale === 'fr'

  return {
    '@context': 'https://schema.org',
    '@type': ['NGO', 'Organization'],
    '@id': `${siteUrl}/#organization`,
    name: isAr
      ? 'جمعية روح الفنون والثقافة (AMYCC)'
      : isFr
      ? "Association Esprit des Arts et de la Culture (AMYCC)"
      : 'Spirit of Arts & Culture Association (AMYCC)',
    alternateName: [
      'AMYCC',
      'جمعية روح الفنون والثقافة بمراكش',
      'Association Esprit des Arts et de la Culture Maroc',
      'AMYCC Morocco',
    ],
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    image: `${siteUrl}/logo.png`,
    description: isAr
      ? 'جمعية ثقافية شبابية غير ربحية بمراكش، تأسست بموجب الظهير الشريف رقم 1.58.376، تُعنى بتأطير الشباب، الإبداع المسرحي والفني، وصون التراث المغربي الأصيل.'
      : isFr
      ? "Organisation non gouvernementale à but non lucratif basée à Marrakech, dédiée à l'autonomisation culturelle des jeunes, la création théâtrale et la valorisation du patrimoine marocain."
      : 'Moroccan cultural and youth empowerment nonprofit NGO based in Marrakech, dedicated to youth artistic expression, theatre, and heritage preservation.',
    email: 'contact@amycc.org',
    telephone: '+212 5 24 00 00 00',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'شارع محمد السادس، جليز',
      addressLocality: 'مراكش (Marrakech)',
      addressRegion: 'Marrakech-Safi',
      postalCode: '40000',
      addressCountry: 'MA',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '31.6295',
      longitude: '-7.9811',
    },
    foundingDate: '2026',
    areaServed: {
      '@type': 'Country',
      name: 'Morocco',
    },
    knowsLanguage: ['ar', 'fr', 'en'],
    sameAs: [
      'https://facebook.com/amycc.morocco',
      'https://instagram.com/amycc.morocco',
      'https://linkedin.com/company/amycc',
      'https://youtube.com/@amycc',
      'https://x.com/amycc_morocco',
      'https://tiktok.com/@amycc',
    ],
  }
}

export function getWebsiteJsonLd(locale: string = 'ar') {
  const siteUrl = getSiteUrl()
  const siteName =
    locale === 'ar'
      ? 'جمعية روح الفنون والثقافة — AMYCC مراكش'
      : locale === 'fr'
      ? 'Association Esprit des Arts et de la Culture — AMYCC Marrakech'
      : 'Spirit of Arts and Culture Association — AMYCC Marrakech'

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: siteUrl,
    name: siteName,
    inLanguage: ['ar', 'fr', 'en'],
    publisher: {
      '@id': `${siteUrl}/#organization`,
    },
  }
}

export function getEventJsonLd(params: EventSchemaParams) {
  const siteUrl = getSiteUrl()
  const venueName = params.venue || 'المركب الثقافي والمسرحي، مراكش'
  const cityName = params.city || 'Marrakech, Morocco'
  const imageUrl = params.imageUrl
    ? (params.imageUrl.startsWith('http') ? params.imageUrl : `${siteUrl}${params.imageUrl}`)
    : `${siteUrl}/logo.png`

  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: params.name,
    description: params.description,
    startDate: params.startDate,
    endDate: params.endDate || params.startDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: venueName,
      address: {
        '@type': 'PostalAddress',
        addressLocality: cityName,
        addressRegion: 'Marrakech-Safi',
        addressCountry: 'MA',
      },
    },
    image: [imageUrl],
    organizer: {
      '@type': 'Organization',
      name: 'جمعية روح الفنون والثقافة (AMYCC)',
      url: siteUrl,
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'MAD',
      availability: 'https://schema.org/InStock',
      url: params.url,
      validFrom: '2026-01-01T00:00:00Z',
    },
  }
}

export function getArticleJsonLd(params: ArticleSchemaParams) {
  const siteUrl = getSiteUrl()
  const imageUrl = params.imageUrl
    ? (params.imageUrl.startsWith('http') ? params.imageUrl : `${siteUrl}${params.imageUrl}`)
    : `${siteUrl}/logo.png`
  const pubDate = params.publishedAt || new Date().toISOString()

  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': params.url,
    },
    headline: params.headline,
    description: params.description,
    image: [imageUrl],
    datePublished: pubDate,
    dateModified: params.modifiedAt || pubDate,
    author: {
      '@type': 'Organization',
      name: 'جمعية روح الفنون والثقافة (AMYCC)',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'AMYCC Press & Media',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    inLanguage: params.locale || 'ar',
  }
}

export function getBreadcrumbJsonLd(items: BreadcrumbItem[], _locale?: string) {
  const siteUrl = getSiteUrl()
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => {
      const fullUrl = item.url
        ? item.url
        : item.path
        ? `${siteUrl}${item.path.startsWith('/') ? '' : '/'}${item.path}`
        : siteUrl

      return {
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: fullUrl,
      }
    }),
  }
}

export function getFaqJsonLd(items: FaqSchemaItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  }
}

export function JsonLd({ data }: { data: Record<string, unknown> | Array<Record<string, unknown>> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

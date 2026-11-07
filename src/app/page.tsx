import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import type { Metadata } from 'next'
import { defaultLocale, locales, type Locale } from '@/lib/i18n/config'
import { constructMetadata } from '@/lib/seo/config'
import { METADATA_CATALOG } from '@/lib/seo/metadata-catalog'

export async function generateMetadata(): Promise<Metadata> {
  const meta = METADATA_CATALOG.home.ar
  return constructMetadata({
    title: meta.title,
    description: meta.description,
    path: '',
    locale: defaultLocale,
  })
}

export default async function RootPage() {
  const headerList = await headers()
  const acceptLanguage = headerList.get('accept-language') || ''

  let targetLocale: Locale = defaultLocale

  // Parse and match language preference from client Accept-Language header
  if (acceptLanguage) {
    const preferredLocales = acceptLanguage.split(',').map((item) => {
      const [code] = item.trim().split(';')
      return code.split('-')[0].toLowerCase()
    })

    for (const pref of preferredLocales) {
      if (locales.includes(pref as Locale)) {
        targetLocale = pref as Locale
        break
      }
    }
  }

  redirect(`/${targetLocale}`)
}

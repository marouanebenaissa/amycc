import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isValidLocale, localeDir, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import '../globals.css'

export async function generateStaticParams() {
  return [{ locale: 'ar' }, { locale: 'fr' }, { locale: 'en' }]
}

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await props.params
  if (!isValidLocale(locale)) return {}
  const dict = await getDictionary(locale)
  return {
    title: { default: dict.meta.home_title, template: `%s | AMYCC` },
    description: dict.meta.home_description,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
    alternates: {
      languages: {
        ar: '/ar',
        fr: '/fr',
        en: '/en',
      },
    },
    openGraph: {
      siteName: dict.meta.site_name,
      locale,
    },
  }
}

export default async function LocaleLayout(props: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await props.params
  if (!isValidLocale(locale)) notFound()

  const dir = localeDir[locale as Locale]

  return (
    <html lang={locale} dir={dir} className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+Arabic:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex flex-col min-h-full">
        {props.children}
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isValidLocale, localeDir, type Locale } from '@/lib/i18n/config'
import { Sora, Cairo } from 'next/font/google'
import { constructMetadata } from '@/lib/seo/config'
import { METADATA_CATALOG } from '@/lib/seo/metadata-catalog'
import '../globals.css'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
})

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-arabic',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
})

export async function generateStaticParams() {
  return [{ locale: 'ar' }, { locale: 'fr' }, { locale: 'en' }]
}

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await props.params
  if (!isValidLocale(locale)) return {}

  const validLocale = locale as Locale
  const meta = METADATA_CATALOG.home[validLocale]

  const baseMeta = constructMetadata({
    title: meta.title,
    description: meta.description,
    path: '',
    locale: validLocale,
  })

  return {
    ...baseMeta,
    title: {
      default: meta.title,
      template: validLocale === 'ar' ? '%s | AMYCC مراكش' : '%s | AMYCC Marrakech',
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
    <html
      lang={locale}
      dir={dir}
      className={`h-full ${sora.variable} ${cairo.variable}`}
    >
      <head>
        <meta name="theme-color" content="#181516" />
        <meta name="apple-mobile-web-app-title" content="AMYCC" />
      </head>
      <body className="flex flex-col min-h-full bg-[#FAF8F5] text-[#231f20] antialiased selection:bg-[#bd3227]/20 selection:text-[#231f20]">
        {props.children}
      </body>
    </html>
  )
}

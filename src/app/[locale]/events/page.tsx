import type { Metadata } from 'next'
import Link from 'next/link'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { createPublicClient } from '@/lib/supabase/public'
import { getEventsPageSettings } from '@/lib/settings'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'
import { Flaticon } from '@/components/ui/Flaticon'
import { EventsCatalog, type EventItemData } from '@/components/events/EventsCatalog'
import { constructMetadata, getSiteUrl } from '@/lib/seo/config'
import { METADATA_CATALOG } from '@/lib/seo/metadata-catalog'
import { getBreadcrumbJsonLd, JsonLd } from '@/lib/seo/schema'
import { locales, type Locale, defaultLocale } from '@/lib/i18n/config'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await props.params
  const validLocale = (locales.includes(locale as Locale) ? locale : defaultLocale) as Locale
  const meta = METADATA_CATALOG.events[validLocale]

  return constructMetadata({
    title: meta.title,
    description: meta.description,
    path: '/events',
    locale: validLocale,
    keywords: meta.keywords,
  })
}

export default async function EventsPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const dict = await getDictionary(locale)
  const isAr = locale === 'ar'
  const isFr = locale === 'fr'

  const [pageSettings, dbEvents] = await Promise.all([
    getEventsPageSettings(),
    (async (): Promise<EventItemData[]> => {
      try {
        const supabase = createPublicClient()
        const { data } = await supabase
          .from('events')
          .select(
            'id, slug, start_date, end_date, venue, city, capacity, registration_open, cover_image, status, event_translations(locale, title, description)'
          )
          .or('status.eq.published,status.is.null')
          .order('start_date', { ascending: true })

        if (data && data.length > 0) {
          // Format translations according to current locale
          return data.map((ev) => {
            const translations = Array.isArray(ev.event_translations) ? ev.event_translations : []
            const currentTrans =
              translations.find((t) => t.locale === locale) ||
              translations.find((t) => t.locale === 'ar') ||
              translations[0] || { title: ev.slug, description: '' }

            return {
              id: ev.id,
              slug: ev.slug,
              start_date: ev.start_date,
              end_date: ev.end_date,
              venue: ev.venue,
              city: ev.city,
              capacity: ev.capacity,
              registration_open: ev.registration_open,
              cover_image: ev.cover_image,
              event_translations: [
                {
                  locale,
                  title: currentTrans.title || ev.slug,
                  description: currentTrans.description || '',
                },
              ],
            }
          })
        }
      } catch {
        // Fallback gracefully
      }
      return []
    })(),
  ])

  const displayEvents = dbEvents
  const hasHeroImage = Boolean(
    pageSettings.hero.hasHeroImage &&
      pageSettings.hero.imageUrl &&
      pageSettings.hero.imageUrl.trim() !== ''
  )

  const siteUrl = getSiteUrl()
  const breadcrumbSchema = getBreadcrumbJsonLd([
    { name: isAr ? 'الرئيسية' : isFr ? 'Accueil' : 'Home', url: `${siteUrl}/${locale}` },
    { name: isAr ? 'الفعاليات الثقافية' : isFr ? 'Événements' : 'Events', url: `${siteUrl}/${locale}/events` },
  ])

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <Header locale={locale} dict={dict} />

      <main id="main-content" className="flex-1 bg-[#FAF8F5]">
        {/* ========================================================= */}
        {/* Moroccan Cinematic Ambient Hero Section (Clean Non-Green) */}
        {/* ========================================================= */}
        <section
          className={`relative overflow-hidden border-b transition-colors ${
            hasHeroImage
              ? 'min-h-[500px] sm:min-h-[540px] lg:min-h-[600px] flex items-center bg-[#231f20] text-white pt-16 pb-24 lg:pt-20 lg:pb-32 border-[#231f20]'
              : 'bg-gradient-to-b from-[#F5F3EE] via-[#F5F3EE] to-[#F5F3EE] border-[#e5e0d6] pt-16 pb-20 lg:pt-20 lg:pb-28 text-[#231f20]'
          }`}
        >
          {/* Background Layer */}
          {hasHeroImage ? (
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
              <ImageWithFallback
                src={pageSettings.hero.imageUrl!}
                fallbackSrc="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1920&q=80"
                alt={isAr ? pageSettings.hero.titleAr : isFr ? pageSettings.hero.titleFr : pageSettings.hero.titleEn}
                fill
                priority
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-black/45" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/55 to-black/90" />
              <div className="absolute inset-0 moroccan-star-pattern opacity-15 pointer-events-none" />
              <div className="absolute top-1/4 start-1/4 w-96 h-96 bg-[#bd3227]/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-10 end-10 w-96 h-96 bg-[#ffd22f]/20 rounded-full blur-3xl pointer-events-none" />
            </div>
          ) : (
            <>
              <div className="absolute inset-0 moroccan-pattern-light opacity-60 pointer-events-none" aria-hidden="true" />
              <div className="absolute top-1/3 start-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#bd3227]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 end-12 w-72 h-72 bg-[#ffd22f]/15 rounded-full blur-3xl pointer-events-none" />
            </>
          )}

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            {/* Top Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {(pageSettings.hero.tagAr || pageSettings.hero.tagFr || pageSettings.hero.tagEn) && (
                <span
                  className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-2xs backdrop-blur-md ${
                    hasHeroImage
                      ? 'bg-white/10 border border-white/20 text-[#ffd22f]'
                      : 'bg-[#bd3227]/10 border border-[#bd3227]/20 text-[#bd3227]'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${hasHeroImage ? 'bg-[#ffd22f]' : 'bg-[#bd3227]'} animate-pulse`}
                  />
                  <span>
                    {isAr
                      ? pageSettings.hero.tagAr
                      : isFr
                      ? pageSettings.hero.tagFr
                      : pageSettings.hero.tagEn}
                  </span>
                </span>
              )}

              {(pageSettings.hero.badgeAr || pageSettings.hero.badgeFr || pageSettings.hero.badgeEn) && (
                <span
                  className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-2xs backdrop-blur-md ${
                    hasHeroImage
                      ? 'bg-white/10 border border-white/20 text-white'
                      : 'bg-[#231f20]/5 border border-[#231f20]/15 text-[#231f20]'
                  }`}
                >
                  <span>🇲🇦</span>
                  <span>
                    {isAr
                      ? pageSettings.hero.badgeAr
                      : isFr
                      ? pageSettings.hero.badgeFr
                      : pageSettings.hero.badgeEn}
                  </span>
                </span>
              )}
            </div>

            {/* Headline */}
            <h1
              className={`text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-tight ${
                hasHeroImage ? 'text-white drop-shadow-md' : 'text-[#231f20]'
              }`}
            >
              {isAr
                ? pageSettings.hero.titleAr
                : isFr
                ? pageSettings.hero.titleFr
                : pageSettings.hero.titleEn}
            </h1>

            {/* Subtitle */}
            {(isAr ? pageSettings.hero.subtitleAr : isFr ? pageSettings.hero.subtitleFr : pageSettings.hero.subtitleEn) && (
              <p
                className={`text-base sm:text-xl font-bold max-w-3xl mx-auto leading-relaxed ${
                  hasHeroImage ? 'text-[#ffd22f]' : 'text-[#bd3227]'
                }`}
              >
                {isAr
                  ? pageSettings.hero.subtitleAr
                  : isFr
                  ? pageSettings.hero.subtitleFr
                  : pageSettings.hero.subtitleEn}
              </p>
            )}

            {/* Description */}
            <p
              className={`text-sm sm:text-base max-w-3xl mx-auto leading-relaxed font-medium ${
                hasHeroImage ? 'text-white/85' : 'text-[#5C5A55]'
              }`}
            >
              {isAr
                ? pageSettings.hero.descriptionAr
                : isFr
                ? pageSettings.hero.descriptionFr
                : pageSettings.hero.descriptionEn}
            </p>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#events-catalog"
                className={`px-6 py-3.5 rounded-xl font-bold transition-all text-xs sm:text-sm shadow-card hover:scale-105 active:scale-95 flex items-center gap-2 ${
                  hasHeroImage
                    ? 'text-[#231f20] bg-[#ffd22f] hover:bg-[#ffd22f]'
                    : 'text-white bg-[#bd3227] hover:bg-[#a3261c]'
                }`}
              >
                <Flaticon name="calendar" size={15} />
                <span>
                  {isAr
                    ? pageSettings.hero.primaryBtnTextAr
                    : isFr
                    ? pageSettings.hero.primaryBtnTextFr
                    : pageSettings.hero.primaryBtnTextEn}
                </span>
              </a>

              <Link
                href={`/${locale}/annual-program`}
                className={`px-6 py-3.5 rounded-xl font-bold transition-all text-xs sm:text-sm hover:scale-105 active:scale-95 ${
                  hasHeroImage
                    ? 'text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md'
                    : 'text-[#231f20] bg-white hover:bg-[#FAF8F5] border border-[#cfc7b9] shadow-2xs'
                }`}
              >
                {isAr ? 'البرنامج السنوي للموسم' : isFr ? 'Programme Annuel' : 'Annual Program'}
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 4 Overlapping Key Indicators (KPIs)                       */}
        {/* ========================================================= */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 lg:-mt-12 relative z-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {pageSettings.stats.map((stat) => (
              <div
                key={stat.id}
                className="luxury-card p-5 sm:p-6 text-center flex flex-col justify-between items-center group bg-white shadow-card border border-[#e5e0d6] hover:border-[#bd3227]/40 transition-all rounded-2xl"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] flex items-center justify-center p-2 mb-3 shadow-2xs group-hover:scale-110 transition-transform overflow-hidden">
                  <Flaticon icon={stat.icon} size={24} className="text-[#bd3227]" />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-[#231f20] mb-1 tracking-tight">
                  {isAr
                    ? (stat.valueAr || stat.value)
                    : isFr
                    ? (stat.valueFr || (stat.value === 'فوري' ? 'Immédiat' : stat.value))
                    : (stat.valueEn || (stat.value === 'فوري' ? 'Instant' : stat.value))}
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#5C5A55] leading-snug">
                  {isAr ? stat.labelAr : isFr ? stat.labelFr : stat.labelEn}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* Interactive Events Catalog with Search & Filters          */}
        {/* ========================================================= */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <EventsCatalog
            events={displayEvents}
            locale={locale}
          />
        </section>

        {/* ========================================================= */}
        {/* Suggest Event / Institutional Collaboration CTA Banner    */}
        {/* ========================================================= */}
        <section className="py-20 bg-white border-t border-[#e5e0d6] relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#231f20] via-[#231f20] to-[#231f20] text-white p-8 sm:p-12 lg:p-14 shadow-card text-center space-y-6">
              <div className="absolute inset-0 moroccan-pattern-dark opacity-20 pointer-events-none" aria-hidden="true" />
              
              <div className="relative z-10 space-y-4 max-w-3xl mx-auto">
                <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-white/10 text-[#ffd22f] border border-white/20 backdrop-blur-sm">
                  {isAr
                    ? pageSettings.cta.badgeAr
                    : isFr
                    ? pageSettings.cta.badgeFr
                    : pageSettings.cta.badgeEn}
                </span>

                <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                  {isAr
                    ? pageSettings.cta.titleAr
                    : isFr
                    ? pageSettings.cta.titleFr
                    : pageSettings.cta.titleEn}
                </h2>

                <p className="text-xs sm:text-base text-white/80 leading-relaxed font-medium">
                  {isAr
                    ? pageSettings.cta.descAr
                    : isFr
                    ? pageSettings.cta.descFr
                    : pageSettings.cta.descEn}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                  <Link
                    href={
                      pageSettings.cta.primaryBtnUrl.startsWith('/')
                        ? `/${locale}${pageSettings.cta.primaryBtnUrl}`
                        : pageSettings.cta.primaryBtnUrl
                    }
                    className="px-6 py-3.5 rounded-xl font-bold text-[#231f20] bg-[#ffd22f] hover:bg-[#ffd22f] transition-all text-xs sm:text-sm shadow-card hover:scale-105 active:scale-95"
                  >
                    {isAr
                      ? pageSettings.cta.primaryBtnTextAr
                      : isFr
                      ? pageSettings.cta.primaryBtnTextFr
                      : pageSettings.cta.primaryBtnTextEn}
                  </Link>

                  <Link
                    href={
                      pageSettings.cta.secondaryBtnUrl.startsWith('/')
                        ? `/${locale}${pageSettings.cta.secondaryBtnUrl}`
                        : pageSettings.cta.secondaryBtnUrl
                    }
                    className="px-6 py-3.5 rounded-xl font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all text-xs sm:text-sm hover:scale-105 active:scale-95"
                  >
                    {isAr
                      ? pageSettings.cta.secondaryBtnTextAr
                      : isFr
                      ? pageSettings.cta.secondaryBtnTextFr
                      : pageSettings.cta.secondaryBtnTextEn}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} dict={dict} />
    </>
  )
}

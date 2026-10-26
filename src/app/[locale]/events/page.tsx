import type { Metadata } from 'next'
import Link from 'next/link'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { createPublicClient } from '@/lib/supabase/public'
import { getEventsPageSettings } from '@/lib/settings'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'
import { EventsCatalog, type EventItemData } from '@/components/events/EventsCatalog'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await props.params
  const config = await getEventsPageSettings()
  const isAr = locale === 'ar'
  const isFr = locale === 'fr'

  const title = isAr
    ? `${config.hero.titleAr} | جمعية روح الفنون والثقافة`
    : isFr
    ? `${config.hero.titleFr} | Association Esprit des Arts et de la Culture`
    : `${config.hero.titleEn} | Spirit of Arts and Culture Association`

  const description = isAr
    ? config.hero.descriptionAr
    : isFr
    ? config.hero.descriptionFr
    : config.hero.descriptionEn

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
  }
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
            'id, slug, start_date, end_date, venue, city, capacity, registration_open, cover_image, event_translations(locale, title, description)'
          )
          .eq('status', 'published')
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

  // Sample default events if none in DB
  const defaultSampleEvents: EventItemData[] = [
    {
      id: 'e-1',
      slug: 'performing-arts-masterclass',
      start_date: '2026-11-15T16:00:00Z',
      venue: isAr ? 'المركز الثقافي' : isFr ? 'Centre Culturel' : 'Cultural Center',
      city: isAr ? 'الرباط' : isFr ? 'Rabat' : 'Rabat',
      capacity: 40,
      registration_open: true,
      cover_image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=800&q=80',
      event_translations: [
        {
          title: isAr
            ? 'ورشة المسرح والأداء التعبيري للشباب'
            : isFr
            ? 'Atelier Théâtre & Expression Scénique'
            : 'Theatre & Performing Arts Youth Masterclass',
          description: isAr
            ? 'تدريب عملي تفاعلي على تقنيات الارتجال المسرحي، الإلقاء، والتحكم في الفضاء الركحي تحت إشراف أطر فنية معتمدة.'
            : isFr
            ? 'Formation pratique et interactive aux techniques d\'improvisation théâtrale et d\'expression corporelle.'
            : 'Interactive hands-on masterclass focusing on dramatic improvisation, vocal delivery, and stage presence.',
        },
      ],
    },
    {
      id: 'e-2',
      slug: 'heritage-music-evening',
      start_date: '2026-12-05T18:30:00Z',
      venue: isAr ? 'فضاء الفنون والعروض' : isFr ? 'Espace des Arts et Spectacles' : 'Arts & Performance Hall',
      city: isAr ? 'الدار البيضاء' : isFr ? 'Casablanca' : 'Casablanca',
      capacity: 80,
      registration_open: true,
      cover_image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
      event_translations: [
        {
          title: isAr
            ? 'أمسية التراث الموسيقي المغربي الأصيل'
            : isFr
            ? 'Soirée du Patrimoine Musical Marocain'
            : 'Moroccan Heritage Music Evening',
          description: isAr
            ? 'حفل موسيقي شبابي يحتفي بالروافد الموسيقية المغربية الأصيلة، بمشاركة مواهب صاعدة في العزف والغناء التراثي.'
            : isFr
            ? 'Concert acoustique célébrant la richesse des mélodies marocaines traditionnelles avec de jeunes talents.'
            : 'An acoustic celebration of authentic Moroccan musical roots featuring promising emerging young musicians.',
        },
      ],
    },
    {
      id: 'e-3',
      slug: 'youth-creative-forum',
      start_date: '2026-12-20T10:00:00Z',
      venue: isAr ? 'دار الشباب والأنشطة الثقافية' : isFr ? 'Maison des Jeunes et de la Culture' : 'Youth & Cultural Center',
      city: isAr ? 'مراكش' : isFr ? 'Marrakech' : 'Marrakech',
      capacity: 60,
      registration_open: true,
      cover_image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
      event_translations: [
        {
          title: isAr
            ? 'ملتقى مبادرة شباب في العمل للتطوع الثقافي'
            : isFr
            ? 'Forum Jeunesse en Action pour le Bénévolat'
            : 'Youth in Action Cultural Volunteering Forum',
          description: isAr
            ? 'يوم دراسي وورشات تدريبية تجمع متطوعي مبادرة شباب في العمل لتقييم المبادرات وتخطيط الأنشطة الثقافية المقبلة.'
            : isFr
            ? 'Journée d\'échange et de formation réunissant les bénévoles de Jeunesse en Action pour planifier les projets.'
            : 'A full-day strategy and workshop gathering bringing Youth in Action volunteers together to co-design upcoming initiatives.',
        },
      ],
    },
  ]

  const displayEvents = dbEvents.length > 0 ? dbEvents : defaultSampleEvents
  const hasHeroImage = Boolean(
    pageSettings.hero.hasHeroImage &&
      pageSettings.hero.imageUrl &&
      pageSettings.hero.imageUrl.trim() !== ''
  )

  return (
    <>
      <Header locale={locale} dict={dict} />

      <main id="main-content" className="flex-1 bg-[#faf7f2]">
        {/* ========================================================= */}
        {/* Moroccan Cinematic Ambient Hero Section (Clean Non-Green) */}
        {/* ========================================================= */}
        <section
          className={`relative overflow-hidden border-b transition-colors ${
            hasHeroImage
              ? 'min-h-[500px] sm:min-h-[540px] lg:min-h-[600px] flex items-center bg-[#1c1917] text-white pt-16 pb-24 lg:pt-20 lg:pb-32 border-[#292524]'
              : 'bg-gradient-to-b from-[#faf7f2] via-[#f7f2e9] to-[#faf7f2] border-[#e5e0d6] pt-16 pb-20 lg:pt-20 lg:pb-28 text-[#08242a]'
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
              <div className="absolute top-1/4 start-1/4 w-96 h-96 bg-[#c85a32]/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-10 end-10 w-96 h-96 bg-[#f4ce83]/20 rounded-full blur-3xl pointer-events-none" />
            </div>
          ) : (
            <>
              <div className="absolute inset-0 moroccan-pattern-light opacity-60 pointer-events-none" aria-hidden="true" />
              <div className="absolute top-1/3 start-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#c85a32]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 end-12 w-72 h-72 bg-[#f4ce83]/15 rounded-full blur-3xl pointer-events-none" />
            </>
          )}

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            {/* Top Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {(pageSettings.hero.tagAr || pageSettings.hero.tagFr || pageSettings.hero.tagEn) && (
                <span
                  className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-2xs backdrop-blur-md ${
                    hasHeroImage
                      ? 'bg-white/10 border border-white/20 text-[#f4ce83]'
                      : 'bg-[#c85a32]/10 border border-[#c85a32]/20 text-[#c85a32]'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${hasHeroImage ? 'bg-[#f4ce83]' : 'bg-[#c85a32]'} animate-pulse`}
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
                      : 'bg-[#08242a]/5 border border-[#08242a]/15 text-[#08242a]'
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
                hasHeroImage ? 'text-white drop-shadow-md' : 'text-[#08242a]'
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
                  hasHeroImage ? 'text-[#f4ce83]' : 'text-[#c85a32]'
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
                hasHeroImage ? 'text-white/85' : 'text-[#5f7174]'
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
                    ? 'text-[#08242a] bg-[#f4ce83] hover:bg-[#eec26e]'
                    : 'text-white bg-[#c85a32] hover:bg-[#b04b26]'
                }`}
              >
                <span>📅</span>
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
                    : 'text-[#08242a] bg-white hover:bg-[#faf7f2] border border-[#cfc7b9] shadow-2xs'
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
                className="luxury-card p-5 sm:p-6 text-center flex flex-col justify-between items-center group bg-white shadow-card border border-[#e5e0d6] hover:border-[#c85a32]/40 transition-all rounded-2xl"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#faf7f2] border border-[#e5e0d6] flex items-center justify-center p-2 mb-3 shadow-2xs group-hover:scale-110 transition-transform overflow-hidden text-2xl">
                  {stat.icon}
                </div>
                <div className="text-3xl sm:text-4xl font-black text-[#08242a] mb-1 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#5f7174] leading-snug">
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
            buttonLabel={dict.events.register}
          />
        </section>

        {/* ========================================================= */}
        {/* Suggest Event / Institutional Collaboration CTA Banner    */}
        {/* ========================================================= */}
        <section className="py-20 bg-white border-t border-[#e5e0d6] relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0d3b43] via-[#0f4650] to-[#08242a] text-white p-8 sm:p-12 lg:p-14 shadow-card text-center space-y-6">
              <div className="absolute inset-0 moroccan-pattern-dark opacity-20 pointer-events-none" aria-hidden="true" />
              
              <div className="relative z-10 space-y-4 max-w-3xl mx-auto">
                <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-white/10 text-[#f4ce83] border border-white/20 backdrop-blur-sm">
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
                    className="px-6 py-3.5 rounded-xl font-bold text-[#08242a] bg-[#f4ce83] hover:bg-[#eec26e] transition-all text-xs sm:text-sm shadow-card hover:scale-105 active:scale-95"
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

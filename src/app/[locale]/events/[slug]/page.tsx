import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { createPublicClient } from '@/lib/supabase/public'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'
import { EventRegistrationForm } from '@/components/events/EventRegistrationForm'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

interface EventDetailData {
  id: string
  slug: string
  start_date: string
  end_date?: string | null
  venue?: string | null
  city?: string | null
  capacity?: number | null
  registration_open: boolean
  registration_deadline?: string | null
  cover_image?: string | null
  status?: string | null
  event_translations?: {
    locale: string
    title: string
    description?: string | null
  }[]
  event_registrations?: { count: number }[]
}

export async function generateStaticParams() {
  const locales = ['ar', 'fr', 'en']
  const slugs = ['AMYCC-Association-Launch-Event']
  const params: { locale: string; slug: string }[] = []

  for (const locale of locales) {
    for (const slug of slugs) {
      params.push({ locale, slug })
    }
  }

  return params
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await props.params

  try {
    const supabase = createPublicClient()
    const { data: event } = await supabase
      .from('events')
      .select('slug, cover_image, event_translations(locale, title, description)')
      .eq('slug', slug)
      .single()

    if (event) {
      const trans =
        event.event_translations?.find((t) => t.locale === locale) ||
        event.event_translations?.find((t) => t.locale === 'ar') ||
        event.event_translations?.[0]

      const title = `${trans?.title || event.slug} | جمعية روح الفنون والثقافة`
      const description =
        trans?.description ||
        'فعالية ثقافية وفنية تنظمها جمعية روح الفنون والثقافة (AMYCC)'

      return {
        title,
        description,
        openGraph: {
          title,
          description,
          images: event.cover_image ? [{ url: event.cover_image }] : undefined,
        },
      }
    }
  } catch {
    // Fallback
  }

  return {
    title: 'تفاصيل الفعالية | جمعية روح الفنون والثقافة',
  }
}

export default async function EventDetailPage(props: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await props.params
  const dict = await getDictionary(locale)
  const isAr = locale === 'ar'
  const isFr = locale === 'fr'

  let event: EventDetailData | null = null

  try {
    const supabase = createPublicClient()
    const { data } = await supabase
      .from('events')
      .select(
        'id, slug, start_date, end_date, venue, city, capacity, registration_open, registration_deadline, cover_image, status, event_translations(locale, title, description), event_registrations(count)'
      )
      .eq('slug', slug)
      .single()

    if (data) {
      event = data as unknown as EventDetailData
    }
  } catch (err) {
    console.error('Error fetching event detail:', err)
  }

  if (!event) {
    notFound()
  }

  const translations = Array.isArray(event.event_translations)
    ? event.event_translations
    : []

  const currentTrans =
    translations.find((t) => t.locale === locale) ||
    translations.find((t) => t.locale === 'ar') ||
    translations[0] || {
      title: event.slug,
      description: '',
    }

  const title = currentTrans.title || event.slug
  const description = currentTrans.description || ''

  const startDateObj = new Date(event.start_date)
  const formattedFullDate = startDateObj.toLocaleDateString(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const formattedTime = startDateObj.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <>
      <Header locale={locale} dict={dict} />

      <main id="main-content" className="flex-1 bg-[#FAF8F5] py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
          {/* Breadcrumb Navigation & Back Link */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <nav className="flex items-center gap-2 text-2xs sm:text-xs text-[#5C5A55] font-medium">
              <Link href={`/${locale}`} className="hover:text-[#231f20] transition-colors">
                {isAr ? 'الرئيسية' : isFr ? 'Accueil' : 'Home'}
              </Link>
              <span>/</span>
              <Link href={`/${locale}/events`} className="hover:text-[#231f20] transition-colors">
                {isAr ? 'الفعاليات الثقافية' : isFr ? 'Événements' : 'Events'}
              </Link>
              <span>/</span>
              <span className="text-[#231f20] font-bold truncate max-w-xs sm:max-w-md">
                {title}
              </span>
            </nav>

            <Link
              href={`/${locale}/events`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#231f20] bg-white border border-[#e5e0d6] hover:bg-[#FAF8F5] transition-all shadow-2xs"
            >
              <span>{isAr ? '→' : '←'}</span>
              <span>{isAr ? 'العودة لكافة الفعاليات' : isFr ? 'Tous les événements' : 'Back to Events'}</span>
            </Link>
          </div>

          {/* Event Header Banner */}
          <div className="bg-white rounded-3xl border border-[#e5e0d6] p-6 sm:p-10 shadow-card space-y-6">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="px-3.5 py-1.5 rounded-xl text-2xs sm:text-xs font-black bg-[#231f20] text-white flex items-center gap-1.5">
                <span>📅</span>
                <span>{formattedFullDate}</span>
              </span>

              <span className="px-3 py-1.5 rounded-xl text-2xs sm:text-xs font-bold bg-[#FAF8F5] border border-[#e5e0d6] text-[#231f20] flex items-center gap-1.5">
                <span>📍</span>
                <span>{event.venue || (isAr ? 'المركز الثقافي' : 'Cultural Center')} {event.city ? `• ${event.city}` : ''}</span>
              </span>

              <span
                className={`px-3 py-1.5 rounded-xl text-2xs sm:text-xs font-black flex items-center gap-1.5 ${
                  event.registration_open
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${event.registration_open ? 'bg-emerald-600 animate-pulse' : 'bg-slate-400'}`} />
                <span>
                  {event.registration_open
                    ? isAr
                      ? 'التسجيل مفتوح'
                      : isFr
                      ? 'Inscriptions ouvertes'
                      : 'Registration Open'
                    : isAr
                    ? 'التسجيل مغلق'
                    : isFr
                    ? 'Inscriptions fermées'
                    : 'Closed'}
                </span>
              </span>

              {event.capacity && (
                <span className="px-3 py-1.5 rounded-xl text-2xs sm:text-xs font-bold bg-[#FAF8F5] text-[#5C5A55]">
                  👥 {isAr ? `الطاقة: ${event.capacity} مقعد` : isFr ? `Capacité : ${event.capacity} places` : `Capacity: ${event.capacity}`}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#231f20] leading-tight tracking-tight">
              {title}
            </h1>
          </div>

          {/* Two-Column Main Layout: (Poster + Article) and (Registration Form + Highlights) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left/Main Column: Poster & Article (7 or 8 cols on desktop) */}
            <div className="lg:col-span-7 space-y-8">
              {/* 1. Poster Card */}
              <div className="rounded-3xl border border-[#e5e0d6] bg-white overflow-hidden shadow-card">
                <div className="p-4 sm:p-5 border-b border-[#E5E0D6] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🎨</span>
                    <h2 className="text-xs sm:text-sm font-black text-[#231f20]">
                      {isAr ? 'البوستر والملصق الرسمي للفعالية' : isFr ? 'Affiche officielle' : 'Official Event Poster'}
                    </h2>
                  </div>
                  <span className="text-3xs font-extrabold uppercase px-2.5 py-1 rounded-md bg-[#FAF8F5] text-[#5C5A55]">
                    AMYCC Official
                  </span>
                </div>

                <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-[#231f20] overflow-hidden">
                  {event.cover_image ? (
                    <ImageWithFallback
                      src={event.cover_image}
                      fallbackSrc="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80"
                      alt={title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 65vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#231f20] via-[#231f20] to-[#181516] flex flex-col items-center justify-center p-8 text-center text-white">
                      <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-4xl mb-4 shadow-xl">
                        🎭
                      </div>
                      <span className="text-lg sm:text-xl font-black max-w-md">
                        {title}
                      </span>
                      <span className="text-xs text-white/75 mt-2 font-mono">
                        جمعية روح الفنون والثقافة • AMYCC
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Badge on Poster */}
                  <div className="absolute bottom-4 start-4 end-4 flex items-center justify-between text-white text-xs font-bold">
                    <span className="px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/20">
                      📍 {event.venue || 'الفضاء الثقافي'} {event.city ? `• ${event.city}` : ''}
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-[#bd3227] text-white shadow-md">
                      🕒 {formattedTime}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. Article / Detailed Description */}
              <div className="bg-white rounded-3xl border border-[#e5e0d6] p-6 sm:p-10 shadow-card space-y-6">
                <div className="flex items-center gap-2.5 pb-4 border-b border-[#E5E0D6]">
                  <span className="w-2 h-6 bg-[#bd3227] rounded-full" />
                  <h2 className="text-lg sm:text-xl font-black text-[#231f20]">
                    {isAr ? 'عن الفعالية والبرنامج التفصيلي' : isFr ? 'À propos de l\'événement' : 'About the Event'}
                  </h2>
                </div>

                {description ? (
                  <div className="text-xs sm:text-sm leading-relaxed text-[#334155] whitespace-pre-line space-y-4 font-normal">
                    {description}
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm text-[#5C5A55] leading-relaxed">
                    {isAr
                      ? 'تنظم جمعية روح الفنون والثقافة هذه الفعالية ضمن برنامجها الثقافي والفني الرامي إلى تحفيز الإبداع الشبابي وتعزيز قيم المواطنة والمشاركة المجتمعية.'
                      : 'An initiative organized by the Spirit of Arts and Culture Association (AMYCC) to foster youth expression and cultural vitality.'}
                  </p>
                )}

                {/* Guidelines Box */}
                <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] space-y-3">
                  <h3 className="text-xs sm:text-sm font-black text-[#231f20] flex items-center gap-2">
                    <span>📌</span>
                    <span>{isAr ? 'إرشادات وشروط المشاركة' : isFr ? 'Consignes importantes' : 'Important Guidelines'}</span>
                  </h3>
                  <ul className="text-2xs sm:text-xs text-[#5C5A55] space-y-2 font-medium">
                    <li className="flex items-start gap-2">
                      <span className="text-[#231f20] font-bold">✓</span>
                      <span>{isAr ? 'يرجى مراجعة تفاصيل وشروط التذاكر الموضحة في برنامج وبطاقة الفعالية.' : isFr ? 'Veuillez consulter les conditions et modalités indiquées dans le programme.' : 'Please check the terms and ticket conditions detailed in the event program.'}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#231f20] font-bold">✓</span>
                      <span>{isAr ? 'يرجى ملء النموذج الجانبي لتأكيد تسجيلك واستلام تذكرة الحضور الرسمية.' : 'Please complete the form to confirm your seat and receive your ticket.'}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#231f20] font-bold">✓</span>
                      <span>{isAr ? 'يرجى الحضور إلى عين المكان 15 دقيقة قبل انطلاق الفعالية لتسهيل الاستقبال وتأكيد الدخول.' : 'Please arrive 15 minutes before the start time.'}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right/Sidebar Column: Registration Form & Quick Info (5 or 4 cols on desktop) */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-8">
              {/* Registration Form Component */}
              <EventRegistrationForm
                eventId={event.id}
                eventTitle={title}
                registrationOpen={event.registration_open}
                locale={locale}
              />

              {/* Event Metadata Card */}
              <div className="bg-white rounded-3xl border border-[#e5e0d6] p-6 shadow-2xs space-y-4">
                <h3 className="text-xs font-black text-[#231f20] uppercase tracking-wider pb-3 border-b border-[#E5E0D6]">
                  {isAr ? 'بطاقة الفعالية' : isFr ? 'Fiche événement' : 'Event Quick Facts'}
                </h3>

                <div className="space-y-3 text-2xs sm:text-xs">
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-[#5C5A55] font-bold">{isAr ? 'المنظم:' : isFr ? 'Organisateur :' : 'Organizer:'}</span>
                    <span className="text-[#231f20] font-bold text-end">
                      {isAr
                        ? 'جمعية روح الفنون والثقافة (AMYCC)'
                        : isFr
                        ? 'Association Esprit des Arts et de la Culture (AMYCC)'
                        : 'Spirit of Arts and Culture Association (AMYCC)'}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <span className="text-[#5C5A55] font-bold">{isAr ? 'التاريخ:' : isFr ? 'Date :' : 'Date:'}</span>
                    <span className="text-[#231f20] font-bold text-end">{formattedFullDate}</span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <span className="text-[#5C5A55] font-bold">{isAr ? 'التوقيت:' : isFr ? 'Horaire :' : 'Time:'}</span>
                    <span className="text-[#231f20] font-bold text-end">{formattedTime}</span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <span className="text-[#5C5A55] font-bold">{isAr ? 'الفضاء:' : isFr ? 'Lieu :' : 'Venue:'}</span>
                    <span className="text-[#231f20] font-bold text-end">{event.venue || (isAr ? 'المركز الثقافي' : isFr ? 'Centre culturel' : 'Cultural Center')}</span>
                  </div>

                  {event.city && (
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-[#5C5A55] font-bold">{isAr ? 'المدينة:' : isFr ? 'Ville :' : 'City:'}</span>
                      <span className="text-[#231f20] font-bold text-end">{event.city}</span>
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-4 pt-2 border-t border-[#E5E0D6]">
                    <span className="text-[#5C5A55] font-bold">{isAr ? 'التذاكر والدخول:' : isFr ? 'Billetterie :' : 'Admission:'}</span>
                    <span className="px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-[#e5e0d6] text-[#231f20] font-black text-3xs">
                      {isAr ? 'حسب الفعالية والتذكرة' : isFr ? 'Selon l\'événement' : 'According to event'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer locale={locale} dict={dict} />
    </>
  )
}

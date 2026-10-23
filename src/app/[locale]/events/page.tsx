import { getDictionary } from '@/lib/i18n/dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { createPublicClient } from '@/lib/supabase/public'
import { EventRegistrationModal } from '@/components/events/EventRegistrationModal'
import Link from 'next/link'

interface EventItem {
  id: string
  slug: string
  start_date: string
  end_date?: string | null
  venue?: string | null
  city?: string | null
  capacity?: number | null
  registration_open: boolean
  event_translations?: {
    title: string
    description?: string | null
  }[]
}

export default async function EventsPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const dict = await getDictionary(locale)
  const isAr = locale === 'ar'
  const isFr = locale === 'fr'

  let events: EventItem[] = []

  try {
    const supabase = createPublicClient()
    const { data } = await supabase
      .from('events')
      .select('id, slug, start_date, end_date, venue, city, capacity, registration_open, event_translations!inner(title, description)')
      .eq('status', 'published')
      .eq('event_translations.locale', locale)
      .order('start_date', { ascending: true })

    if (data && data.length > 0) {
      events = data as unknown as EventItem[]
    }
  } catch {
    // Graceful fallback during static build
  }

  // Fallback sample events if none in DB yet
  const defaultEvents: EventItem[] = [
    {
      id: 'e-1',
      slug: 'performing-arts-masterclass',
      start_date: '2026-11-15T16:00:00Z',
      venue: isAr ? 'المركز الثقافي' : 'Cultural Center',
      city: isAr ? 'المغرب' : 'Morocco',
      capacity: 40,
      registration_open: true,
      event_translations: [
        {
          title: isAr ? 'ورشة المسرح والأداء التعبيري للشباب' : isFr ? 'Atelier Théâtre & Expression Scénique' : 'Theatre & Performing Arts Youth Masterclass',
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
      venue: isAr ? 'فضاء الفنون والعروض' : 'Arts & Performance Hall',
      city: isAr ? 'المغرب' : 'Morocco',
      capacity: 80,
      registration_open: true,
      event_translations: [
        {
          title: isAr ? 'أمسية التراث الموسيقي المغربي الأصيل' : isFr ? 'Soirée du Patrimoine Musical Marocain' : 'Moroccan Heritage Music Evening',
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
      venue: isAr ? 'دار الشباب والأنشطة الثقافية' : 'Youth & Cultural Center',
      city: isAr ? 'المغرب' : 'Morocco',
      capacity: 60,
      registration_open: true,
      event_translations: [
        {
          title: isAr ? 'ملتقى مبادرة شباب في العمل للتطوع الثقافي' : isFr ? 'Forum Jeunesse en Action pour le Bénévolat' : 'Youth in Action Cultural Volunteering Forum',
          description: isAr
            ? 'يوم دراسي وورشات تدريبية تجمع متطوعي مبادرة شباب في العمل لتقييم المبادرات وتخطيط الأنشطة الثقافية المقبلة.'
            : isFr
            ? 'Journée d\'échange et de formation réunissant les bénévoles de Jeunesse en Action pour planifier les projets.'
            : 'A full-day strategy and workshop gathering bringing Youth in Action volunteers together to co-design upcoming initiatives.',
        },
      ],
    },
  ]

  const displayEvents = events.length > 0 ? events : defaultEvents

  return (
    <>
      <Header locale={locale} dict={dict} />

      <main id="main-content" className="flex-1 bg-[#faf7f2]">
        {/* Header Banner */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#faf7f2] via-[#f7f2e9] to-[#faf7f2] border-b border-[#e5e0d6] py-16 lg:py-24 text-center">
          <div className="absolute inset-0 moroccan-pattern-light opacity-50 pointer-events-none" aria-hidden="true" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#c85a32]">
              AMYCC Events
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#08242a] tracking-tight">
              {dict.events.title}
            </h1>
            <p className="text-base sm:text-lg text-[#445457] max-w-2xl mx-auto font-medium">
              {isAr
                ? 'استكشف الفعاليات الثقافية والورشات الفنية القادمة وسجل حضورك مجاناً وبشكل مباشر.'
                : 'Explore upcoming cultural events, masterclasses, and register your attendance directly.'}
            </p>
          </div>
        </section>

        {/* Events Grid */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="flex items-center justify-between mb-10 pb-4 border-b border-[#e5e0d6]">
            <div>
              <h2 className="text-xl font-black text-[#08242a]">
                {dict.events.upcoming}
              </h2>
              <span className="text-3xs text-[#5f7174]">
                {isAr ? 'حجز مباشر وفوري للمقاعد' : 'Real-time seat reservation'}
              </span>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white border border-[#e5e0d6] text-[#08242a] shadow-2xs">
              {displayEvents.length} {isAr ? 'فعاليات مجدولة' : 'Scheduled Events'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayEvents.map((ev) => {
              const trans = ev.event_translations?.[0] || { title: ev.slug, description: '' }
              const dateObj = new Date(ev.start_date)
              const formattedDate = dateObj.toLocaleDateString(locale, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })

              return (
                <div
                  key={ev.id}
                  className="rounded-3xl border border-[#e5e0d6] bg-white p-7 shadow-subtle hover:shadow-card hover:border-[#cfc7b9] transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top Status & Date */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 rounded-full text-3xs font-bold bg-[#faf7f2] border border-[#e5e0d6] text-[#0d3b43]">
                        📅 {dateObj.toLocaleDateString(locale, { month: 'short', day: 'numeric' })}
                      </span>
                      <span
                        className={`text-3xs font-bold px-2.5 py-0.5 rounded-full ${
                          ev.registration_open
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {ev.registration_open ? (isAr ? 'التسجيل مفتوح' : 'Open') : 'Closed'}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-[#08242a] mb-2 leading-snug">
                      {trans.title}
                    </h3>

                    {/* Venue & City */}
                    <div className="space-y-1 text-2xs text-[#5f7174] mb-4">
                      <div className="flex items-center gap-1.5">
                        <span>📍</span>
                        <span>{ev.venue || 'Cultural Center'} • {ev.city || 'Morocco'}</span>
                      </div>
                      {ev.capacity && (
                        <div className="flex items-center gap-1.5 text-3xs text-[#819598]">
                          <span>👥</span>
                          <span>{isAr ? `الطاقة الاستيعابية: ${ev.capacity} مقعد` : `Capacity: ${ev.capacity} seats`}</span>
                        </div>
                      )}
                    </div>

                    {trans.description && (
                      <p className="text-xs text-[#445457] leading-relaxed mb-6 line-clamp-3">
                        {trans.description}
                      </p>
                    )}
                  </div>

                  {/* Register Button with Modal */}
                  <div className="pt-4 border-t border-[#f4ede2]">
                    {ev.registration_open ? (
                      <EventRegistrationModal
                        eventId={ev.id}
                        eventTitle={trans.title}
                        eventDate={formattedDate}
                        eventVenue={ev.venue || ev.city || undefined}
                        locale={locale}
                        buttonLabel={dict.events.register}
                        className="w-full py-3 px-4 rounded-xl font-bold text-white bg-[#0d3b43] hover:bg-[#14505b] active:scale-95 transition-all text-xs shadow-xs flex items-center justify-center gap-2"
                      />
                    ) : (
                      <span className="block text-center py-2.5 text-2xs text-[#819598] font-semibold bg-[#faf7f2] rounded-xl">
                        {isAr ? 'التسجيل مغلق حالياً' : 'Registration Closed'}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Suggest Event or Host Workshop Banner */}
        <section className="bg-white border-t border-[#e5e0d6] py-16 text-center">
          <div className="max-w-4xl mx-auto px-4 space-y-4">
            <h2 className="text-2xl font-black text-[#08242a]">
              {isAr ? 'هل ترغب في اقتراح ورشة عمل أو شراكة فنية؟' : 'Propose a Workshop or Cultural Collaboration'}
            </h2>
            <p className="text-xs sm:text-sm text-[#5f7174] max-w-xl mx-auto leading-relaxed">
              {isAr
                ? 'ترحب جمعية روح الفنون والثقافة بالمقترحات الإبداعية من الفنانين والمدربين والمراكز الثقافية.'
                : 'AMYCC welcomes creative proposals from artists, trainers, and cultural institutions.'}
            </p>
            <div className="pt-2">
              <Link
                href={`/${locale}/partnerships`}
                className="inline-flex items-center px-6 py-3 rounded-xl font-bold text-xs text-white bg-[#c85a32] hover:bg-[#b84e27] transition-all shadow-subtle gap-2"
              >
                <span>{dict.partnerships.apply}</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} dict={dict} />
    </>
  )
}

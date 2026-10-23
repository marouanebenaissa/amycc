import { getDictionary } from '@/lib/i18n/dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { createPublicClient } from '@/lib/supabase/public'
import Link from 'next/link'

interface ProgramItem {
  id: string
  slug: string
  category: string
  city?: string | null
  program_translations?: {
    title: string
    description?: string | null
  }[]
}

interface EventItem {
  id: string
  slug: string
  start_date: string
  venue?: string | null
  city?: string | null
  registration_open: boolean
  event_translations?: {
    title: string
    description?: string | null
  }[]
}

interface NewsItem {
  id: string
  slug: string
  category: string
  published_at?: string | null
  news_translations?: {
    title: string
    excerpt?: string | null
  }[]
}

export default async function HomePage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const dict = await getDictionary(locale)

  let featuredPrograms: ProgramItem[] = []
  let upcomingEvents: EventItem[] = []
  let latestNews: NewsItem[] = []

  try {
    const supabase = createPublicClient()

    // Query published programs
    const { data: progData } = await supabase
      .from('programs')
      .select('id, slug, category, city, program_translations!inner(title, description)')
      .eq('status', 'published')
      .eq('program_translations.locale', locale)
      .limit(3)
    if (progData) featuredPrograms = progData as unknown as ProgramItem[]

    // Query published events
    const { data: evData } = await supabase
      .from('events')
      .select('id, slug, start_date, venue, city, registration_open, event_translations!inner(title, description)')
      .eq('status', 'published')
      .eq('event_translations.locale', locale)
      .order('start_date', { ascending: true })
      .limit(2)
    if (evData) upcomingEvents = evData as unknown as EventItem[]

    // Query published news
    const { data: newsData } = await supabase
      .from('news_articles')
      .select('id, slug, category, published_at, news_translations!inner(title, excerpt)')
      .eq('status', 'published')
      .eq('news_translations.locale', locale)
      .order('published_at', { ascending: false })
      .limit(2)
    if (newsData) latestNews = newsData as unknown as NewsItem[]
  } catch {
    // Graceful build-time fallback
  }

  // Fallback initial programs if none published in database yet
  if (featuredPrograms.length === 0) {
    featuredPrograms = [
      {
        id: '1',
        slug: 'youth-in-action',
        category: 'youth',
        city: 'Morocco',
        program_translations: [
          {
            title: locale === 'ar' ? 'مبادرة شباب في العمل' : locale === 'fr' ? 'Initiative Jeunesse en Action' : 'Youth in Action Initiative',
            description: locale === 'ar' ? 'مبادرة تطوعية تهدف إلى إشراك الشباب في الأنشطة الثقافية والمجتمعية.' : locale === 'fr' ? 'Une initiative bénévole visant à engager les jeunes dans des activités culturelles.' : 'A volunteering initiative aiming to engage youth in cultural activities.',
          },
        ],
      },
      {
        id: '2',
        slug: 'arts-heritage-workshops',
        category: 'arts',
        city: 'Morocco',
        program_translations: [
          {
            title: locale === 'ar' ? 'ورشات الفنون والتراث' : locale === 'fr' ? 'Ateliers des Arts et du Patrimoine' : 'Arts & Heritage Workshops',
            description: locale === 'ar' ? 'ورشات تفاعلية لاستكشاف الفنون التشكيلية والمسرح والموسيقى.' : locale === 'fr' ? 'Des ateliers interactifs pour explorer les arts plastiques, le théâtre et la musique.' : 'Interactive workshops exploring visual arts, theatre, and music.',
          },
        ],
      },
    ]
  }

  const areasList = [
    { key: 'arts', title: dict.areas.arts, desc: dict.areas.arts_desc, icon: '🎨' },
    { key: 'music', title: dict.areas.music, desc: dict.areas.music_desc, icon: '🎵' },
    { key: 'theatre', title: dict.areas.theatre, desc: dict.areas.theatre_desc, icon: '🎭' },
    { key: 'culture', title: dict.areas.culture, desc: dict.areas.culture_desc, icon: '🏛️' },
    { key: 'youth', title: dict.areas.youth, desc: dict.areas.youth_desc, icon: '🚀' },
    { key: 'community', title: dict.areas.community, desc: dict.areas.community_desc, icon: '🤝' },
  ]

  return (
    <>
      <Header locale={locale} dict={dict} />

      <main id="main-content" className="flex flex-col flex-1 bg-[#faf7f2]">

        {/* 1. HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#faf7f2] via-[#f4ede2] to-[#faf7f2] border-b border-[#e5e0d6] py-20 lg:py-32">
          {/* Subtle decorative Moroccan pattern backdrop */}
          <div className="absolute inset-0 moroccan-pattern-light opacity-60 pointer-events-none" aria-hidden="true" />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Verification & Identity Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0d3b43]/10 border border-[#0d3b43]/20 text-[#0d3b43] text-xs font-bold mb-8">
              <span className="w-2 h-2 rounded-full bg-[#c85a32] animate-pulse" />
              <span>{dict.home.intro_badge}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#08242a] tracking-tight leading-tight mb-6">
              {dict.hero.title}
            </h1>

            <p className="text-lg sm:text-xl text-[#445457] max-w-3xl mx-auto leading-relaxed mb-10 font-medium">
              {dict.hero.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={`/${locale}/programs`}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white bg-[#0d3b43] hover:bg-[#14505b] active:scale-95 transition-all shadow-card hover:shadow-card-hover"
              >
                {dict.hero.cta_primary}
              </Link>
              <Link
                href={`/${locale}/membership`}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-[#0d3b43] bg-white hover:bg-[#f4ede2] border border-[#cfc7b9] transition-all shadow-subtle"
              >
                {dict.hero.cta_secondary}
              </Link>
            </div>
          </div>
        </section>

        {/* 2. INTRODUCTION & CORE VALUES */}
        <section className="py-20 lg:py-28 bg-white border-b border-[#e5e0d6]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-[#c85a32]">
                {dict.about.title}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#08242a] mt-2 mb-4">
                {dict.home.intro_title}
              </h2>
              <p className="text-base sm:text-lg text-[#445457] leading-relaxed">
                {dict.home.intro_p1}
              </p>
            </div>

            {/* Mission, Vision, Values Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Mission */}
              <div className="bg-[#faf7f2] p-8 rounded-2xl border border-[#e5e0d6] shadow-subtle hover:shadow-card transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-[#0d3b43] text-white flex items-center justify-center font-bold text-xl mb-5 shadow-xs">
                  ✦
                </div>
                <h3 className="text-xl font-bold text-[#08242a] mb-3">
                  {dict.about.mission_title}
                </h3>
                <p className="text-sm text-[#445457] leading-relaxed">
                  {dict.about.description}
                </p>
              </div>

              {/* Vision */}
              <div className="bg-[#faf7f2] p-8 rounded-2xl border border-[#c85a32]/30 shadow-subtle hover:shadow-card transition-shadow relative overflow-hidden">
                <div className="absolute top-0 end-0 w-20 h-20 bg-[#fae4dc] rounded-bl-full pointer-events-none" />
                <div className="w-12 h-12 rounded-xl bg-[#c85a32] text-white flex items-center justify-center font-bold text-xl mb-5 shadow-xs relative z-10">
                  ★
                </div>
                <h3 className="text-xl font-bold text-[#08242a] mb-3 relative z-10">
                  {dict.about.vision_title}
                </h3>
                <p className="text-sm text-[#445457] leading-relaxed relative z-10">
                  {dict.hero.subtitle}
                </p>
              </div>

              {/* Values */}
              <div className="bg-[#faf7f2] p-8 rounded-2xl border border-[#e5e0d6] shadow-subtle hover:shadow-card transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-[#d99b26] text-white flex items-center justify-center font-bold text-xl mb-5 shadow-xs">
                  ♥
                </div>
                <h3 className="text-xl font-bold text-[#08242a] mb-3">
                  {dict.about.values_title}
                </h3>
                <p className="text-sm text-[#445457] leading-relaxed">
                  {dict.footer.description}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. SIX CORE AREAS OF WORK */}
        <section className="py-20 lg:py-28 bg-[#faf7f2] border-b border-[#e5e0d6]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-[#0d3b43]">
                AMYCC Morocco
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#08242a] mt-2 mb-4">
                {dict.home.areas_title}
              </h2>
              <p className="text-base text-[#445457] leading-relaxed">
                {dict.home.areas_subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {areasList.map(({ key, title, desc, icon }) => (
                <div
                  key={key}
                  className="bg-white p-7 rounded-2xl border border-[#e5e0d6] shadow-subtle hover:shadow-card hover:border-[#cfc7b9] transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-3xl mb-4 block" aria-hidden="true">
                      {icon}
                    </span>
                    <h3 className="text-lg font-bold text-[#08242a] mb-2">{title}</h3>
                    <p className="text-xs sm:text-sm text-[#445457] leading-relaxed mb-4">{desc}</p>
                  </div>
                  <div>
                    <Link
                      href={`/${locale}/programs`}
                      className="inline-flex items-center text-xs font-bold text-[#c85a32] hover:text-[#b84e27]"
                    >
                      {dict.programs.learn_more} →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. YOUTH IN ACTION INITIATIVE SPOTLIGHT */}
        <section className="py-16 lg:py-20 bg-[#0d3b43] text-white relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#14505b] text-[#f4ce83] border border-[#268292]/40">
                  {dict.home.youth_badge}
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                  {dict.home.youth_title}
                </h2>
                <p className="text-sm sm:text-base text-[#d8f0f4] max-w-2xl leading-relaxed">
                  {dict.home.youth_desc}
                </p>
              </div>
              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
                <Link
                  href={`/${locale}/volunteer`}
                  className="px-6 py-3.5 rounded-xl font-bold text-center text-[#08242a] bg-[#f4ce83] hover:bg-white active:scale-95 transition-all shadow-md"
                >
                  {dict.volunteer.apply}
                </Link>
                <Link
                  href={`/${locale}/about`}
                  className="px-6 py-3.5 rounded-xl font-bold text-center text-white border border-[#268292] hover:bg-[#14505b] transition-all"
                >
                  {dict.about.title}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 5. FEATURED PROGRAMS (DYNAMIC FROM DB) */}
        <section className="py-20 lg:py-28 bg-white border-b border-[#e5e0d6]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#c85a32]">
                  {dict.programs.title}
                </span>
                <h2 className="text-3xl font-extrabold text-[#08242a] mt-1">
                  {dict.home.featured_programs}
                </h2>
              </div>
              <Link
                href={`/${locale}/programs`}
                className="text-xs font-bold text-[#0d3b43] hover:text-[#c85a32] transition-colors"
              >
                {dict.programs.view_all} →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredPrograms.map((prog) => {
                const trans = prog.program_translations?.[0] || { title: prog.slug, description: '' }
                return (
                  <div
                    key={prog.id}
                    className="p-8 rounded-2xl bg-[#faf7f2] border border-[#e5e0d6] shadow-subtle hover:shadow-card transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#d8f0f4] text-[#0d3b43] capitalize">
                          {prog.category}
                        </span>
                        <span className="text-xs font-medium text-[#5f7174]">
                          {prog.city || 'Morocco'}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-[#08242a] mb-3">
                        {trans.title}
                      </h3>
                      {trans.description && (
                        <p className="text-sm text-[#445457] leading-relaxed mb-6">
                          {trans.description}
                        </p>
                      )}
                    </div>
                    <div>
                      <Link
                        href={`/${locale}/programs/${prog.slug}`}
                        className="inline-flex items-center text-sm font-bold text-[#c85a32] hover:text-[#b84e27]"
                      >
                        {dict.programs.learn_more} →
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* 6. UPCOMING EVENTS & RECENT NEWS (DYNAMIC GRID) */}
        <section className="py-20 lg:py-28 bg-[#faf7f2] border-b border-[#e5e0d6]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

              {/* Events Column */}
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-extrabold text-[#08242a]">
                    {dict.home.upcoming_events}
                  </h2>
                  <Link
                    href={`/${locale}/events`}
                    className="text-xs font-bold text-[#0d3b43] hover:underline"
                  >
                    {dict.events.view_all} →
                  </Link>
                </div>

                {upcomingEvents.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingEvents.map((ev) => {
                      const trans = ev.event_translations?.[0] || { title: ev.slug, description: '' }
                      return (
                        <div
                          key={ev.id}
                          className="p-6 rounded-2xl bg-white border border-[#e5e0d6] shadow-subtle"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-[#0d3b43]">
                              {new Date(ev.start_date).toLocaleDateString(locale)}
                            </span>
                            <span
                              className={`text-2xs font-bold px-2.5 py-0.5 rounded-full ${
                                ev.registration_open
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {ev.registration_open ? dict.events.register : 'Closed'}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-[#08242a] mb-1">{trans.title}</h3>
                          <p className="text-xs text-[#5f7174]">
                            {ev.venue || ev.city || 'Morocco'}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="p-8 rounded-2xl bg-white border border-[#e5e0d6] text-center text-[#5f7174]">
                    <p className="text-sm">{dict.events.no_events}</p>
                    <Link
                      href={`/${locale}/membership`}
                      className="inline-block mt-4 text-xs font-bold text-[#c85a32] hover:underline"
                    >
                      {dict.membership.apply} →
                    </Link>
                  </div>
                )}
              </div>

              {/* News Column */}
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-extrabold text-[#08242a]">
                    {dict.home.latest_news}
                  </h2>
                  <Link
                    href={`/${locale}/news`}
                    className="text-xs font-bold text-[#0d3b43] hover:underline"
                  >
                    {dict.news.view_all} →
                  </Link>
                </div>

                {latestNews.length > 0 ? (
                  <div className="space-y-4">
                    {latestNews.map((art) => {
                      const trans = art.news_translations?.[0] || { title: art.slug, excerpt: '' }
                      return (
                        <div
                          key={art.id}
                          className="p-6 rounded-2xl bg-white border border-[#e5e0d6] shadow-subtle hover:shadow-card transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-2xs font-bold px-2 py-0.5 rounded bg-[#fae4dc] text-[#c85a32] capitalize">
                              {art.category}
                            </span>
                            {art.published_at && (
                              <span className="text-2xs text-[#5f7174]">
                                {new Date(art.published_at).toLocaleDateString(locale)}
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-bold text-[#08242a] mb-2">
                            <Link href={`/${locale}/news/${art.slug}`} className="hover:text-[#c85a32] transition-colors">
                              {trans.title}
                            </Link>
                          </h3>
                          {trans.excerpt && (
                            <p className="text-xs text-[#445457] leading-relaxed line-clamp-2">
                              {trans.excerpt}
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="p-8 rounded-2xl bg-white border border-[#e5e0d6] text-center text-[#5f7174]">
                    <p className="text-sm">
                      {locale === 'ar' ? 'سيتم نشر المستجدات والبيانات الصحفية قريباً.' : 'Official announcements will be published soon.'}
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>
        </section>

        {/* 7. PARTNERS & COLLABORATIONS SECTION */}
        <section className="py-20 lg:py-24 bg-white border-b border-[#e5e0d6]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[#c85a32]">
              {dict.partners.title}
            </span>
            <h2 className="text-3xl font-extrabold text-[#08242a] mt-2 mb-4">
              {dict.home.partners_title}
            </h2>
            <p className="text-sm sm:text-base text-[#445457] max-w-2xl mx-auto mb-12">
              {dict.home.partners_desc}
            </p>

            {/* Verified Partner Categories Placeholder Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-10">
              {[
                { title: locale === 'ar' ? 'المراكز الثقافية' : 'Cultural Centers', desc: 'National & International' },
                { title: locale === 'ar' ? 'المؤسسات التعليمية' : 'Educational Institutes', desc: 'Schools & Universities' },
                { title: locale === 'ar' ? 'المجتمع المدني' : 'Civil Society', desc: 'NGOs & Associations' },
                { title: locale === 'ar' ? 'القطاع الخاص' : 'Private Sector', desc: 'Cultural Sponsorship' },
              ].map((tier, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-[#faf7f2] border border-[#e5e0d6] flex flex-col justify-center items-center text-center"
                >
                  <span className="text-xs font-bold text-[#08242a] mb-1">{tier.title}</span>
                  <span className="text-3xs text-[#5f7174] uppercase tracking-wider">{tier.desc}</span>
                </div>
              ))}
            </div>

            <Link
              href={`/${locale}/partnerships`}
              className="inline-flex items-center px-6 py-3 rounded-xl font-bold text-xs text-white bg-[#0d3b43] hover:bg-[#14505b] transition-all shadow-subtle"
            >
              {dict.partners.apply_partnership} →
            </Link>
          </div>
        </section>

        {/* 8. COMMUNITY & MEMBERSHIP CTA */}
        <section className="py-16 bg-[#faf7f2]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#08242a] mb-4">
              {dict.home.cta_title}
            </h2>
            <p className="text-sm sm:text-base text-[#445457] max-w-xl mx-auto mb-8">
              {dict.home.cta_desc}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={`/${locale}/membership`}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white bg-[#c85a32] hover:bg-[#b84e27] active:scale-95 transition-all shadow-card"
              >
                {dict.membership.apply}
              </Link>
              <Link
                href={`/${locale}/volunteer`}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-[#0d3b43] bg-white border border-[#cfc7b9] hover:bg-[#f4ede2] transition-all"
              >
                {dict.volunteer.apply}
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer locale={locale} dict={dict} />
    </>
  )
}

import { getDictionary } from '@/lib/i18n/dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getTopBarSettings, getHeroSettings, getFlagshipProgramSettings, getFaqSettings, getAreasSettings } from '@/lib/settings'
import { createPublicClient } from '@/lib/supabase/public'
import { FaqAccordion } from '@/components/home/FaqAccordion'
import { AreasSection } from '@/components/home/AreasSection'
import { EventRegistrationModal } from '@/components/events/EventRegistrationModal'
import { IconWithFallback } from '@/components/ui/IconWithFallback'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'
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

function resolveLocaleUrl(url: string | undefined, loc: string): string {
  if (!url) return `/${loc}`
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:') || url.startsWith('#')) {
    return url
  }
  const clean = url.startsWith('/') ? url : `/${url}`
  if (clean.startsWith(`/${loc}/`) || clean === `/${loc}`) return clean
  return `/${loc}${clean}`
}

export default async function HomePage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const [dict, topBar, hero, flagship] = await Promise.all([
    getDictionary(locale),
    getTopBarSettings(),
    getHeroSettings(),
    getFlagshipProgramSettings(),
  ])
  const isAr = locale === 'ar'
  const isFr = locale === 'fr'

  const heroTag = isAr ? hero.tagAr : isFr ? hero.tagFr : hero.tagEn
  const heroTitle = isAr ? hero.titleAr : isFr ? hero.titleFr : hero.titleEn
  const heroDesc = isAr ? hero.descriptionAr : isFr ? hero.descriptionFr : hero.descriptionEn
  const heroCtaPrimary = isAr ? hero.ctaPrimaryTextAr : isFr ? hero.ctaPrimaryTextFr : hero.ctaPrimaryTextEn
  const heroCtaSecondary = isAr ? hero.ctaSecondaryTextAr : isFr ? hero.ctaSecondaryTextFr : hero.ctaSecondaryTextEn
  const heroBottomStrip = isAr ? hero.bottomStripAr : isFr ? hero.bottomStripFr : hero.bottomStripEn

  const flagshipBadge = isAr ? flagship.badgeAr : isFr ? flagship.badgeFr : flagship.badgeEn
  const flagshipTitle = isAr ? flagship.titleAr : isFr ? flagship.titleFr : flagship.titleEn
  const flagshipDesc = isAr ? flagship.descriptionAr : isFr ? flagship.descriptionFr : flagship.descriptionEn
  const flagshipCaption = isAr ? flagship.imageCaptionAr : isFr ? flagship.imageCaptionFr : flagship.imageCaptionEn

  const step1Title = isAr ? flagship.step1TitleAr : isFr ? flagship.step1TitleFr : flagship.step1TitleEn
  const step1Desc = isAr ? flagship.step1DescAr : isFr ? flagship.step1DescFr : flagship.step1DescEn

  const step2Title = isAr ? flagship.step2TitleAr : isFr ? flagship.step2TitleFr : flagship.step2TitleEn
  const step2Desc = isAr ? flagship.step2DescAr : isFr ? flagship.step2DescFr : flagship.step2DescEn

  const step3Title = isAr ? flagship.step3TitleAr : isFr ? flagship.step3TitleFr : flagship.step3TitleEn
  const step3Desc = isAr ? flagship.step3DescAr : isFr ? flagship.step3DescFr : flagship.step3DescEn

  const step4Title = isAr ? flagship.step4TitleAr : isFr ? flagship.step4TitleFr : flagship.step4TitleEn
  const step4Desc = isAr ? flagship.step4DescAr : isFr ? flagship.step4DescFr : flagship.step4DescEn

  const flagshipCtaPrimary = isAr ? flagship.ctaPrimaryTextAr : isFr ? flagship.ctaPrimaryTextFr : flagship.ctaPrimaryTextEn
  const flagshipCtaSecondary = isAr ? flagship.ctaSecondaryTextAr : isFr ? flagship.ctaSecondaryTextFr : flagship.ctaSecondaryTextEn

  let featuredPrograms: ProgramItem[] = []
  let upcomingEvents: EventItem[] = []
  let latestNews: NewsItem[] = []

  try {
    const supabase = createPublicClient()

    // 1. Query published programs
    const { data: progData } = await supabase
      .from('programs')
      .select('id, slug, category, city, program_translations!inner(title, description)')
      .eq('status', 'published')
      .eq('program_translations.locale', locale)
      .limit(3)
    if (progData) featuredPrograms = progData as unknown as ProgramItem[]

    // 2. Query published events
    const { data: evData } = await supabase
      .from('events')
      .select('id, slug, start_date, venue, city, registration_open, event_translations!inner(title, description)')
      .or('status.eq.published,status.is.null')
      .eq('event_translations.locale', locale)
      .order('start_date', { ascending: true })
      .limit(3)
    if (evData) upcomingEvents = evData as unknown as EventItem[]

    // 3. Query published news
    const { data: newsData } = await supabase
      .from('news_articles')
      .select('id, slug, category, published_at, news_translations!inner(title, excerpt)')
      .eq('status', 'published')
      .eq('news_translations.locale', locale)
      .order('published_at', { ascending: false })
      .limit(3)
    if (newsData) latestNews = newsData as unknown as NewsItem[]
  } catch {
    // Graceful fallback during static generation if database is disconnected
  }

  // Fallback initial programs if none in DB yet
  if (featuredPrograms.length === 0) {
    featuredPrograms = [
      {
        id: 'p-1',
        slug: 'youth-in-action',
        category: 'youth',
        city: isAr ? 'مختلف المدن المغربية' : isFr ? 'Plusieurs villes marocaines' : 'Various Moroccan Cities',
        program_translations: [
          {
            title: isAr ? 'مبادرة شباب في العمل (Youth in Action)' : isFr ? 'Initiative Jeunesse en Action' : 'Youth in Action Initiative',
            description: isAr
              ? 'برنامج رائد ومستدام لتأهيل وتأطير الطاقات الشابة في مجالات القيادة الثقافية، تنظيم التظاهرات الفنية، والعمل التطوعي الميداني.'
              : isFr
              ? 'Un programme civique et culturel phare pour former et mobiliser les jeunes dans le leadership artistique et le bénévolat.'
              : 'Our flagship civic initiative empowering young Moroccans to co-create and lead cultural events, artistic workshops, and community volunteering.',
          },
        ],
      },
      {
        id: 'p-2',
        slug: 'arts-heritage-workshops',
        category: 'arts',
        city: isAr ? 'المغرب' : 'Morocco',
        program_translations: [
          {
            title: isAr ? 'ورشات الفنون والتراث الأصيل' : isFr ? 'Ateliers des Arts & du Patrimoine' : 'Arts & Moroccan Heritage Workshops',
            description: isAr
              ? 'محترفات تفاعلية لتعليم الفنون التشكيلية، الخط العربي، صون التراث الموسيقي المغربي، ونقل الخبرات بين الأجيال.'
              : isFr
              ? 'Des ateliers immersifs dédiés aux arts plastiques, à la calligraphie et à la préservation du patrimoine musical marocain.'
              : 'Interactive masterclasses covering visual arts, calligraphy, and safeguarding Moroccan musical traditions across generations.',
          },
        ],
      },
      {
        id: 'p-3',
        slug: 'theatre-expression-forum',
        category: 'theatre',
        city: isAr ? 'المغرب' : 'Morocco',
        program_translations: [
          {
            title: isAr ? 'محترفات المسرح وفنون العرض' : isFr ? 'Laboratoire du Théâtre & Arts de la Scène' : 'Theatre & Performing Arts Lab',
            description: isAr
              ? 'فضاء إبداعي لتدريب الشباب على تقنيات الارتجال المسرحي، الإلقاء، السينوغرافيا، وبناء العروض التعبيرية الهادفة.'
              : isFr
              ? 'Espace d\'entraînement aux techniques d\'improvisation théâtrale, d\'élocution et de scénographie pour la jeunesse.'
              : 'Creative development platform training youth in dramatic improvisation, voice projection, and community stage productions.',
          },
        ],
      },
    ]
  }

  // Fallback initial events if none in DB yet
  if (upcomingEvents.length === 0) {
    upcomingEvents = [
      {
        id: 'e-1',
        slug: 'performing-arts-masterclass',
        start_date: '2026-11-15T16:00:00Z',
        venue: isAr ? 'المركز الثقافي' : 'Cultural Center',
        city: isAr ? 'المغرب' : 'Morocco',
        registration_open: true,
        event_translations: [
          {
            title: isAr ? 'ورشة المسرح والأداء التعبيري للشباب' : isFr ? 'Atelier Théâtre & Expression Scénique' : 'Theatre & Performing Arts Youth Masterclass',
            description: isAr
              ? 'تدريب عملي على تقنيات الإلقاء والتعبير الجسدي والارتجال المسرحي تحت إشراف أطر فنية متخصصة.'
              : isFr
              ? 'Formation pratique aux techniques scéniques et à l\'improvisation théâtrale.'
              : 'Practical workshop on voice projection, stage movement, and dramatic improvisation.',
          },
        ],
      },
      {
        id: 'e-2',
        slug: 'heritage-music-evening',
        start_date: '2026-12-05T18:30:00Z',
        venue: isAr ? 'قاعة العروض الفنية' : 'Art Exhibition Hall',
        city: isAr ? 'المغرب' : 'Morocco',
        registration_open: true,
        event_translations: [
          {
            title: isAr ? 'أمسية التراث الموسيقي المغربي الأصيل' : isFr ? 'Soirée du Patrimoine Musical Marocain' : 'Moroccan Heritage Music Evening',
            description: isAr
              ? 'حفل موسيقي شبابي يحتفي بالروافد الموسيقية المغربية الأصيلة بمشاركة مواهب صاعدة.'
              : isFr
              ? 'Concert acoustique célébrant la diversité des musiques marocaines traditionnelles.'
              : 'Acoustic musical celebration highlighting traditional Moroccan musical diversity.',
          },
        ],
      },
      {
        id: 'e-3',
        slug: 'youth-creative-forum',
        start_date: '2026-12-20T10:00:00Z',
        venue: isAr ? 'فضاء الفنون' : 'Arts Space',
        city: isAr ? 'المغرب' : 'Morocco',
        registration_open: true,
        event_translations: [
          {
            title: isAr ? 'ملتقى الشباب المبدع ومعرض الفنون التشكيلية' : isFr ? 'Forum des Jeunes Créateurs & Exposition Visuelle' : 'Youth Creative Forum & Visual Arts Exhibition',
            description: isAr
              ? 'معرض تفاعلي وورشات حية تتيح للفنانين الشباب عرض إبداعاتهم والتواصل المباشر مع الجمهور والمهتمين.'
              : isFr
              ? 'Exposition vivante et ateliers interactifs permettant aux jeunes artistes de présenter leurs créations.'
              : 'Interactive exhibition and live masterclasses giving young Moroccan artists a platform to showcase their creations.',
          },
        ],
      },
    ]
  }

  // Fallback initial news if none in DB yet
  if (latestNews.length === 0) {
    latestNews = [
      {
        id: 'n-1',
        slug: 'official-launch',
        category: 'announcement',
        published_at: '2026-10-15T10:00:00Z',
        news_translations: [
          {
            title: isAr ? 'إطلاق المنصة الرقمية الرسمية لجمعية روح الفنون والثقافة (AMYCC)' : isFr ? 'Lancement officiel de la plateforme numérique de l\'AMYCC' : 'Official Launch of the AMYCC Digital Platform',
            excerpt: isAr
              ? 'تعلن الجمعية عن تدشين موقعها الإلكتروني التفاعلي بـ 3 لغات لتيسير الانخراط والتطوع ومتابعة الأنشطة الثقافية.'
              : isFr
              ? 'L\'association inaugure sa plateforme trilingue pour faciliter les adhésions et l\'engagement bénévole.'
              : 'AMYCC officially unveils its trilingual web platform to foster community engagement and cultural participation.',
          },
        ],
      },
      {
        id: 'n-2',
        slug: 'youth-in-action-call',
        category: 'initiative',
        published_at: '2026-10-20T14:30:00Z',
        news_translations: [
          {
            title: isAr ? 'فتح باب التطوع في مبادرة "شباب في العمل" لموسم 2026' : isFr ? 'Appel à bénévoles pour l\'initiative "Jeunesse en Action" 2026' : 'Open Call for Volunteers: "Youth in Action" 2026 Initiative',
            excerpt: isAr
              ? 'دعوة مفتوحة لكافة الشباب والشابات بالمغرب للمشاركة في تنظيم وتأطير الفعاليات الثقافية واكتساب خبرات ميدانية معتمدة.'
              : isFr
              ? 'Appel ouvert aux jeunes du Royaume pour s\'investir dans des projets culturels et acquérir une expérience certifiée.'
              : 'Open invitation for youth across Morocco to co-organize civic and cultural events while earning recognized leadership experience.',
          },
        ],
      },
      {
        id: 'n-3',
        slug: 'cultural-partnerships-expansion',
        category: 'partnerships',
        published_at: '2026-10-22T09:00:00Z',
        news_translations: [
          {
            title: isAr ? 'بناء شبكة شراكات مؤسساتية لتعزيز الإشعاع الثقافي الوطني' : isFr ? 'Développement de partenariats institutionnels culturels et éducatifs' : 'Building Institutional Partnerships for Moroccan Arts & Culture',
            excerpt: isAr
              ? 'توسيع نطاق التعاون مع المراكز الثقافية والمؤسسات التعليمية لتعميم الورشات الفنية المجانية بمختلف الجهات.'
              : isFr
              ? 'Expansion des collaborations avec les acteurs culturels pour démocratiser l\'accès aux ateliers artistiques.'
              : 'Expanding joint initiatives with cultural centers and academic institutions to democratize access to arts masterclasses.',
          },
        ],
      },
    ]
  }

  // Dynamic Areas of Intervention from database settings
  const areasConfig = await getAreasSettings()

  // Dynamic FAQs from database settings
  const faqSettings = await getFaqSettings()
  const activeHomeFaqs = faqSettings.items.filter(
    (item) => item.published !== false && item.showOnHome !== false
  )

  const homeFaqs = activeHomeFaqs.map((item) => ({
    q: isAr
      ? item.questionAr
      : isFr
      ? (item.questionFr || item.questionAr)
      : (item.questionEn || item.questionAr),
    a: isAr
      ? item.answerAr
      : isFr
      ? (item.answerFr || item.answerAr)
      : (item.answerEn || item.answerAr),
  }))

  return (
    <>
      <Header locale={locale} dict={dict} topBar={topBar} />

      <main id="main-content" className="flex flex-col flex-1 bg-[#faf7f2]">

        {/* ============================================================
            1. HERO SECTION — Full-bleed Morocco88 Style Cinematic Banner
            ============================================================ */}
        <section className="relative overflow-hidden min-h-[620px] sm:min-h-[700px] lg:min-h-[760px] flex items-center bg-[#08242a] text-white">
          {/* Full-bleed background photo layer */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {hero.imageUrl ? (
              <>
                <ImageWithFallback
                  src={hero.imageUrl}
                  fallbackSrc="/images/youth-in-action.jpg"
                  alt="AMYCC Hero Banner"
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover object-center"
                />
                {/* Cinematic Morocco88 Vignette Overlays: clear faces + dark text backdrop */}
                <div className="absolute inset-0 bg-black/35" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#08242a]/90 via-[#08242a]/50 to-transparent rtl:bg-gradient-to-l" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08242a]/80 via-transparent to-black/20" />
              </>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#08242a] via-[#0d3b43] to-[#08242a]">
                <div className="absolute inset-0 moroccan-star-pattern opacity-15 pointer-events-none" />
                <div className="absolute top-1/4 start-1/4 w-96 h-96 bg-[#c85a32]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-10 end-10 w-96 h-96 bg-[#f4ce83]/10 rounded-full blur-3xl pointer-events-none" />
              </div>
            )}
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 sm:py-24 lg:py-28">
            <div className="max-w-3xl space-y-6 text-start">
              {/* Category Eyebrow Tag (Morocco88 style golden uppercase) */}
              {heroTag && (
                <div className="inline-block">
                  <span className="text-[#f4ce83] text-xs sm:text-sm font-extrabold tracking-widest uppercase font-mono">
                    {heroTag}
                  </span>
                </div>
              )}

              {/* Grand Bold Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.18] tracking-tight whitespace-pre-line font-arabic drop-shadow-sm">
                {heroTitle}
              </h1>

              {/* Narrative Story Description */}
              <p className="text-base sm:text-lg lg:text-xl text-[#d8f0f4]/95 leading-relaxed font-normal max-w-2xl">
                {heroDesc}
              </p>

              {/* Action Buttons Cluster (Pill-shaped buttons like Morocco88) */}
              <div className="flex flex-wrap items-center gap-4 pt-2 sm:pt-4">
                <Link
                  href={resolveLocaleUrl(hero.ctaPrimaryUrl, locale)}
                  className="px-8 py-3.5 rounded-full font-bold text-[#08242a] bg-[#f4ce83] hover:bg-[#eabf66] active:scale-98 transition-all shadow-lg text-sm sm:text-base inline-flex items-center gap-2 group"
                >
                  <span>{heroCtaPrimary}</span>
                  <span className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" aria-hidden="true">
                    {isAr ? '←' : '→'}
                  </span>
                </Link>

                {heroCtaSecondary && (
                  <Link
                    href={resolveLocaleUrl(hero.ctaSecondaryUrl, locale)}
                    className="px-8 py-3.5 rounded-full font-bold text-white bg-transparent border-2 border-white/80 hover:bg-white/10 active:scale-98 transition-all text-sm sm:text-base inline-flex items-center gap-2"
                  >
                    <span>{heroCtaSecondary}</span>
                  </Link>
                )}
              </div>

              {/* Bottom Credibility Sub-strip with golden accent vertical line */}
              {heroBottomStrip && (
                <div className="pt-6 sm:pt-8 flex items-center gap-3 text-xs sm:text-sm text-[#d8f0f4]/85 font-medium border-t border-white/15 mt-8">
                  <span className="w-1 h-5 sm:h-6 bg-[#f4ce83] rounded-full inline-block shrink-0" aria-hidden="true" />
                  <p className="leading-snug">{heroBottomStrip}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ============================================================
            2. INSTITUTIONAL FOUNDATIONS BAR (4 Verified Pillars)
            ============================================================ */}
        <section className="bg-white border-b border-[#e5e0d6] py-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="p-5 rounded-2xl bg-[#faf7f2] border border-[#e5e0d6] shadow-2xs hover:border-[#0d3b43]/30 transition-all">
                <div className="text-3xl sm:text-4xl font-black text-[#0d3b43]">2026</div>
                <div className="text-xs font-bold text-[#08242a] mt-1.5">
                  {isAr ? 'سنة التأسيس الرسمية بالمغرب' : 'Foundation Year in Morocco'}
                </div>
                <div className="text-3xs text-[#819598] mt-1 font-medium">
                  {isAr ? 'تأسيس جمعوي مدني' : 'Nonprofit Association'}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#faf7f2] border border-[#e5e0d6] shadow-2xs hover:border-[#c85a32]/30 transition-all">
                <div className="text-3xl sm:text-4xl font-black text-[#c85a32]">6</div>
                <div className="text-xs font-bold text-[#08242a] mt-1.5">
                  {isAr ? 'مجالات عمل فني وثقافي' : 'Core Cultural Domains'}
                </div>
                <div className="text-3xs text-[#819598] mt-1 font-medium">
                  {isAr ? 'فنون، موسيقى، مسرح، تطوع' : 'Arts, Music, Theatre, Civic'}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#faf7f2] border border-[#e5e0d6] shadow-2xs hover:border-[#d99b26]/30 transition-all">
                <div className="text-3xl sm:text-4xl font-black text-[#d99b26]">3</div>
                <div className="text-xs font-bold text-[#08242a] mt-1.5">
                  {isAr ? 'لغات تواصل معتمدة' : 'Official Platform Languages'}
                </div>
                <div className="text-3xs text-[#819598] mt-1 font-medium">
                  العربية • Français • English
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#faf7f2] border border-[#e5e0d6] shadow-2xs hover:border-[#0d3b43]/30 transition-all">
                <div className="text-3xl sm:text-4xl font-black text-[#0d3b43]">100%</div>
                <div className="text-xs font-bold text-[#08242a] mt-1.5">
                  {isAr ? 'عمل مدني غير ربحي' : 'Civic Non-Profit Mission'}
                </div>
                <div className="text-3xs text-[#819598] mt-1 font-medium">
                  {isAr ? 'لخدمة الثقافة والشباب' : 'Serving Youth & Culture'}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            3. ABOUT AMYCC — Mission, Vision & Core Values
            ============================================================ */}
        <section className="py-20 lg:py-28 bg-[#faf7f2] border-b border-[#e5e0d6]">
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

            {/* Mission, Vision, Values 3-Card Architecture */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Mission */}
              <div className="luxury-card p-8 flex flex-col justify-between group">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#0d3b43] text-white flex items-center justify-center font-bold text-xl mb-6 shadow-xs p-2.5 overflow-hidden group-hover:scale-105 transition-transform">
                    <IconWithFallback
                      src="/icons/mission.png"
                      fallbackEmoji="✦"
                      alt={dict.about.mission_title}
                      size={32}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-black text-[#08242a] mb-3">
                    {dict.about.mission_title}
                  </h3>
                  <p className="text-sm text-[#445457] leading-relaxed">
                    {isAr
                      ? 'تؤمن الجمعية بأن لكل شاب موهبة وقدرات إبداعية تستحق الاكتشاف والرعاية، وتعمل انطلاقاً من مدينة مراكش على صقل الطاقات الفنية وتمكين الشباب في خدمة المجتمع.'
                      : dict.about.description}
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-[#f4ede2]">
                  <Link
                    href={`/${locale}/about#mission`}
                    className="text-xs font-bold text-[#0d3b43] hover:text-[#c85a32] transition-colors"
                  >
                    {isAr ? 'اكتشف رسالتنا الكاملة' : 'Read Our Full Mission'} →
                  </Link>
                </div>
              </div>

              {/* Vision */}
              <div className="luxury-card p-8 border-2 border-[#c85a32]/30 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute top-0 end-0 w-24 h-24 bg-[#fae4dc] rounded-bl-full pointer-events-none" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-[#c85a32] text-white flex items-center justify-center font-bold text-xl mb-6 shadow-xs p-2.5 overflow-hidden group-hover:scale-105 transition-transform">
                    <IconWithFallback
                      src="/icons/vision.png"
                      fallbackEmoji="★"
                      alt={dict.about.vision_title}
                      size={32}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-black text-[#08242a] mb-3">
                    {dict.about.vision_title}
                  </h3>
                  <p className="text-sm text-[#445457] leading-relaxed">
                    {isAr
                      ? 'أن تصبح جمعية رائدة في الفنون والتمكين، عبر شبكة متكاملة من الفروع تنطلق إقليمياً وتمتد لمختلف جهات المملكة وصولاً للمستوى الوطني والدولي.'
                      : dict.hero.subtitle}
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-[#f4ede2] relative z-10">
                  <Link
                    href={`/${locale}/about#vision`}
                    className="text-xs font-bold text-[#c85a32] hover:underline"
                  >
                    {isAr ? 'استكشف خارطة الرؤية' : 'Explore Vision Roadmap'} →
                  </Link>
                </div>
              </div>

              {/* Values */}
              <div className="luxury-card p-8 flex flex-col justify-between group">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#d99b26] text-white flex items-center justify-center font-bold text-xl mb-6 shadow-xs p-2.5 overflow-hidden group-hover:scale-105 transition-transform">
                    <IconWithFallback
                      src="/icons/values.png"
                      fallbackEmoji="♥"
                      alt={dict.about.values_title}
                      size={32}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-black text-[#08242a] mb-3">
                    {dict.about.values_title}
                  </h3>
                  <p className="text-sm text-[#445457] leading-relaxed">
                    {isAr
                      ? 'تستند الجمعية إلى 7 قيم أساسية: الإبداع، الشمولية، التضامن، التعليم والتطوير، الاحترام والتنوع، التعاون والشراكة، والشفافية والمسؤولية.'
                      : dict.footer.description}
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-[#f4ede2]">
                  <Link
                    href={`/${locale}/about#values`}
                    className="text-xs font-bold text-[#d99b26] hover:text-[#08242a] transition-colors"
                  >
                    {isAr ? 'تفاصيل قيمنا الـ 7' : 'Our 7 Core Values'} →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            CULTURAL MANIFESTO BANNER (INTERACTIVE EDITORIAL QUOTE)
            ============================================================ */}
        <section className="bg-gradient-to-r from-[#0d3b43] via-[#08242a] to-[#0d3b43] py-14 px-4 text-center text-white relative overflow-hidden border-y border-[#14505b]">
          <div className="absolute inset-0 moroccan-pattern opacity-10 pointer-events-none" />
          <div className="max-w-4xl mx-auto relative z-10 space-y-3">
            <span className="text-3xl block text-[#f4ce83]">❝</span>
            <blockquote className="text-xl sm:text-2xl lg:text-3xl font-extrabold leading-snug tracking-tight text-[#fdfcf9]">
              {isAr
                ? '«الفنون ليست مجرد تعبير جمالي، بل هي رافعة حقيقية للتنمية البشرية، وإطلاق طاقات الشباب، وترسيخ الهوية والتنوع الثقافي المغربي»'
                : isFr
                ? '« Les arts ne sont pas seulement une expression esthétique, mais un véritable levier d\'émancipation et de cohésion sociale »'
                : '“Arts and culture are vital catalysts for human development, youth leadership, and civic empowerment across Morocco.”'}
            </blockquote>
            <p className="text-xs font-bold text-[#aedfe7] uppercase tracking-widest pt-2">
              — {isAr ? 'جمعية روح الفنون والثقافة (AMYCC)' : 'Spirit of Arts & Culture Association'}
            </p>
          </div>
        </section>

        {/* ============================================================
            4. SIX CORE DOMAINS OF WORK (مجالات التدخل الستة)
            ============================================================ */}
        <AreasSection
          locale={locale}
          sectionTitle={
            isAr
              ? areasConfig.sectionTitleAr || dict.home.areas_title
              : isFr
              ? areasConfig.sectionTitleFr || dict.home.areas_title
              : areasConfig.sectionTitleEn || dict.home.areas_title
          }
          sectionSubtitle={
            isAr
              ? areasConfig.sectionSubtitleAr || dict.home.areas_subtitle
              : isFr
              ? areasConfig.sectionSubtitleFr || dict.home.areas_subtitle
              : areasConfig.sectionSubtitleEn || dict.home.areas_subtitle
          }
          eyebrowText={
            isAr
              ? areasConfig.eyebrowAr || 'مجالات النشاط الجمعوي'
              : isFr
              ? areasConfig.eyebrowFr || "Domaines d'Activité"
              : areasConfig.eyebrowEn || 'Core Disciplines'
          }
          learnMoreText={dict.programs.learn_more}
          showInitiativesGlobally={areasConfig.showInitiativesGlobally !== false}
          configuredItems={areasConfig.items}
        />

        {/* ============================================================
            5. FLAGSHIP PROGRAM INITIATIVE SPOTLIGHT (البرنامج الرائد)
            ============================================================ */}
        {flagship.enabled && (
          <section className="py-20 lg:py-24 bg-[#08242a] text-white relative overflow-hidden">
            {/* Subtle Decorative Pattern */}
            <div className="absolute inset-0 moroccan-pattern opacity-15 pointer-events-none" aria-hidden="true" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                {/* Spotlight Content */}
                <div className="lg:col-span-7 space-y-6">
                  {flagshipBadge && (
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-[#14505b] text-[#f4ce83] border border-[#268292]/40">
                      <span>★</span>
                      <span>{flagshipBadge}</span>
                    </div>
                  )}

                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                    {flagshipTitle}
                  </h2>

                  <p className="text-sm sm:text-base text-[#d8f0f4] leading-relaxed">
                    {flagshipDesc}
                  </p>

                  {/* 4-Step Volunteering Journey */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                    <div className="p-4 rounded-2xl bg-[#0d3b43]/80 border border-[#14505b] flex items-start gap-3 hover:border-[#f4ce83]/50 transition-colors">
                      <span className="w-7 h-7 rounded-lg bg-[#c85a32] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">1</span>
                      <div>
                        <span className="font-bold text-xs block text-white">{step1Title}</span>
                        <span className="text-3xs text-[#74bfcd]">{step1Desc}</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#0d3b43]/80 border border-[#14505b] flex items-start gap-3 hover:border-[#f4ce83]/50 transition-colors">
                      <span className="w-7 h-7 rounded-lg bg-[#c85a32] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">2</span>
                      <div>
                        <span className="font-bold text-xs block text-white">{step2Title}</span>
                        <span className="text-3xs text-[#74bfcd]">{step2Desc}</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#0d3b43]/80 border border-[#14505b] flex items-start gap-3 hover:border-[#f4ce83]/50 transition-colors">
                      <span className="w-7 h-7 rounded-lg bg-[#c85a32] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">3</span>
                      <div>
                        <span className="font-bold text-xs block text-white">{step3Title}</span>
                        <span className="text-3xs text-[#74bfcd]">{step3Desc}</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#0d3b43]/80 border border-[#14505b] flex items-start gap-3 hover:border-[#f4ce83]/50 transition-colors">
                      <span className="w-7 h-7 rounded-lg bg-[#c85a32] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">4</span>
                      <div>
                        <span className="font-bold text-xs block text-white">{step4Title}</span>
                        <span className="text-3xs text-[#74bfcd]">{step4Desc}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-3">
                    {flagshipCtaPrimary && (
                      <Link
                        href={resolveLocaleUrl(flagship.ctaPrimaryUrl, locale)}
                        className="px-8 py-3.5 rounded-xl font-bold text-center text-[#08242a] bg-[#f4ce83] hover:bg-white active:scale-95 transition-all shadow-md text-xs sm:text-sm"
                      >
                        {flagshipCtaPrimary}
                      </Link>
                    )}
                    {flagshipCtaSecondary && (
                      <Link
                        href={resolveLocaleUrl(flagship.ctaSecondaryUrl, locale)}
                        className="px-6 py-3.5 rounded-xl font-bold text-center text-white border border-[#268292] hover:bg-[#14505b] transition-all text-xs sm:text-sm"
                      >
                        {flagshipCtaSecondary}
                      </Link>
                    )}
                  </div>
                </div>

                {/* Visual Spotlight Card — Grand Cultural Poster Showcase */}
                <div className="lg:col-span-5 relative flex justify-center">
                  {/* Subtle warm ambient glow behind poster */}
                  <div
                    className="absolute -inset-2 bg-gradient-to-tr from-[#f4ce83]/25 via-[#c85a32]/20 to-[#0d3b43]/30 rounded-[2.5rem] blur-2xl -z-10 opacity-70"
                    aria-hidden="true"
                  />

                  <div className="w-full max-w-md relative rounded-3xl p-3.5 bg-white/10 border border-white/20 backdrop-blur-md shadow-2xl">
                    <div className="relative aspect-[3/4] sm:aspect-[4/5] min-h-[460px] sm:min-h-[520px] lg:min-h-[580px] rounded-2xl overflow-hidden bg-[#0d3b43]">
                      {flagship.imageUrl ? (
                        <>
                          <ImageWithFallback
                            src={flagship.imageUrl}
                            fallbackSrc="/images/youth-in-action.jpg"
                            alt={flagshipTitle || 'Flagship Program'}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 480px"
                            className="object-cover object-center"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#08242a] via-[#08242a]/30 to-black/20 opacity-85" />
                          <div className="absolute bottom-5 start-5 end-5 text-white">
                            {flagship.imageSubcaption && (
                              <span className="text-3xs text-[#f4ce83] font-bold uppercase tracking-widest block mb-1">
                                {flagship.imageSubcaption}
                              </span>
                            )}
                            {flagshipCaption && (
                              <span className="text-base sm:text-lg font-black block leading-snug drop-shadow-md">
                                {flagshipCaption}
                              </span>
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-white/80">
                          <span className="text-xs font-bold">{flagshipTitle}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>
        )}

        {/* ============================================================
            6. FEATURED PROGRAMS (DYNAMIC FROM DATABASE)
            ============================================================ */}
        <section className="py-20 lg:py-28 bg-[#faf7f2] border-b border-[#e5e0d6]">
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
                className="text-xs font-bold text-[#0d3b43] hover:text-[#c85a32] transition-colors flex items-center gap-1"
              >
                <span>{dict.programs.view_all}</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredPrograms.map((prog) => {
                const trans = prog.program_translations?.[0] || { title: prog.slug, description: '' }
                return (
                  <div
                    key={prog.id}
                    className="p-7 rounded-3xl bg-white border border-[#e5e0d6] shadow-subtle hover:shadow-card hover:border-[#cfc7b9] transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 rounded-full text-3xs font-bold bg-[#d8f0f4] text-[#0d3b43] capitalize">
                          {prog.category}
                        </span>
                        <span className="text-3xs font-medium text-[#5f7174] flex items-center gap-1">
                          <span>📍</span>
                          <span>{prog.city || 'Morocco'}</span>
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-[#08242a] mb-3 leading-snug">
                        {trans.title}
                      </h3>
                      {trans.description && (
                        <p className="text-xs text-[#445457] leading-relaxed mb-6 line-clamp-3">
                          {trans.description}
                        </p>
                      )}
                    </div>
                    <div className="pt-4 border-t border-[#f4ede2]">
                      <Link
                        href={`/${locale}/programs/${prog.slug}`}
                        className="inline-flex items-center text-xs font-bold text-[#c85a32] hover:text-[#b84e27] transition-colors"
                      >
                        <span>{dict.programs.learn_more}</span>
                        <span aria-hidden="true" className="ms-1">→</span>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ============================================================
            7. UPCOMING EVENTS & LIVE REGISTRATION MODAL
            ============================================================ */}
        <section className="py-20 lg:py-28 bg-white border-b border-[#e5e0d6]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#0d3b43]">
                  {dict.events.title}
                </span>
                <h2 className="text-3xl font-extrabold text-[#08242a] mt-1">
                  {dict.home.upcoming_events}
                </h2>
                <p className="text-xs sm:text-sm text-[#5f7174] mt-1">
                  {isAr ? 'حجز مباشر ومجاني للمقاعد في الورشات والتظاهرات الثقافية' : 'Live registration for upcoming cultural events & masterclasses'}
                </p>
              </div>
              <Link
                href={`/${locale}/events`}
                className="text-xs font-bold text-[#0d3b43] hover:text-[#c85a32] transition-colors flex items-center gap-1"
              >
                <span>{dict.events.view_all}</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((ev) => {
                const trans = ev.event_translations?.[0] || { title: ev.slug, description: '' }
                const formattedDate = new Date(ev.start_date).toLocaleDateString(locale, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })

                return (
                  <div
                    key={ev.id}
                    className="p-7 rounded-3xl bg-[#faf7f2] border border-[#e5e0d6] shadow-subtle hover:shadow-card transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-[#0d3b43] flex items-center gap-1.5">
                          <span>📅</span>
                          <span>{formattedDate}</span>
                        </span>
                        <span
                          className={`text-3xs font-bold px-2.5 py-0.5 rounded-full ${
                            ev.registration_open
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {ev.registration_open ? (isAr ? 'التسجيل مفتوح' : 'Registration Open') : 'Closed'}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-[#08242a] mb-2 leading-snug hover:text-[#c85a32] transition-colors">
                        <Link href={`/${locale}/events/${ev.slug}`}>
                          {trans.title}
                        </Link>
                      </h3>

                      <p className="text-2xs text-[#5f7174] flex items-center gap-1 mb-4">
                        <span>📍</span>
                        <span>{ev.venue || ev.city || 'Morocco'}</span>
                      </p>

                      {trans.description && (
                        <p className="text-xs text-[#445457] leading-relaxed mb-6 line-clamp-3">
                          {trans.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-4 border-t border-[#e5e0d6] flex items-center gap-2">
                      <Link
                        href={`/${locale}/events/${ev.slug}`}
                        className="py-2.5 px-3 rounded-xl font-bold text-xs text-[#08242a] bg-[#faf7f2] hover:bg-[#eae4d9] border border-[#e5e0d6] transition-colors flex items-center justify-center gap-1"
                      >
                        <span>{isAr ? 'المقال والبوستر' : 'Details'}</span>
                        <span>{isAr ? '←' : '→'}</span>
                      </Link>

                      {ev.registration_open ? (
                        <EventRegistrationModal
                          eventId={ev.id}
                          eventTitle={trans.title}
                          eventDescription={trans.description || ''}
                          eventDate={formattedDate}
                          eventVenue={ev.venue || ev.city || undefined}
                          locale={locale}
                          buttonLabel={dict.events.register}
                          className="flex-1 py-2.5 px-3 rounded-xl font-bold text-white bg-[#0d3b43] hover:bg-[#14505b] active:scale-95 transition-all text-xs shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                        />
                      ) : (
                        <span className="flex-1 block text-center py-2 text-2xs text-[#819598] font-semibold bg-[#faf7f2] rounded-xl border border-[#e5e0d6]">
                          {isAr ? 'اكتملت المقاعد' : 'Fully Booked'}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ============================================================
            8. LATEST NEWS & PRESS (الأخبار والبيانات الصحفية)
            ============================================================ */}
        <section className="py-20 lg:py-28 bg-[#faf7f2] border-b border-[#e5e0d6]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#c85a32]">
                  {dict.news.title}
                </span>
                <h2 className="text-3xl font-extrabold text-[#08242a] mt-1">
                  {dict.home.latest_news}
                </h2>
              </div>
              <Link
                href={`/${locale}/news`}
                className="text-xs font-bold text-[#0d3b43] hover:text-[#c85a32] transition-colors flex items-center gap-1"
              >
                <span>{dict.news.view_all}</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestNews.map((art) => {
                const trans = art.news_translations?.[0] || { title: art.slug, excerpt: '' }
                return (
                  <div
                    key={art.id}
                    className="p-7 rounded-3xl bg-white border border-[#e5e0d6] shadow-subtle hover:shadow-card transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-3xs font-bold px-2.5 py-0.5 rounded-full bg-[#fae4dc] text-[#c85a32] capitalize">
                          {art.category}
                        </span>
                        {art.published_at && (
                          <span className="text-3xs text-[#819598] font-mono">
                            {new Date(art.published_at).toLocaleDateString(locale)}
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-[#08242a] mb-3 leading-snug">
                        <Link href={`/${locale}/news/${art.slug}`} className="hover:text-[#c85a32] transition-colors">
                          {trans.title}
                        </Link>
                      </h3>

                      {trans.excerpt && (
                        <p className="text-xs text-[#445457] leading-relaxed line-clamp-3 mb-6">
                          {trans.excerpt}
                        </p>
                      )}
                    </div>

                    <div className="pt-4 border-t border-[#f4ede2]">
                      <Link
                        href={`/${locale}/news/${art.slug}`}
                        className="text-xs font-bold text-[#0d3b43] hover:text-[#c85a32] transition-colors flex items-center gap-1"
                      >
                        <span>{dict.news.read_more}</span>
                        <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ============================================================
            9. FAQ SECTION — Interactive Accordion
            ============================================================ */}
        <section className="py-20 lg:py-28 bg-white border-b border-[#e5e0d6]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-[#c85a32]">
                AMYCC FAQ
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#08242a] mt-2 mb-4">
                {isAr ? 'الأسئلة الشائعة حول الجمعية والأنشطة' : isFr ? 'Foire Aux Questions' : 'Frequently Asked Questions'}
              </h2>
              <p className="text-sm text-[#5f7174] max-w-xl mx-auto">
                {isAr
                  ? 'إجابات واضحة عن كيفية الانخراط، التطوع في شباب في العمل، وحضور الفعاليات الثقافية.'
                  : 'Clear answers on membership, volunteering, and institutional partnership opportunities.'}
              </p>
            </div>

            <FaqAccordion items={homeFaqs} />

            <div className="text-center mt-10">
              <Link
                href={`/${locale}/faq`}
                className="text-xs font-bold text-[#0d3b43] hover:text-[#c85a32] transition-colors inline-flex items-center gap-1"
              >
                <span>{isAr ? 'عرض جميع الأسئلة والإرشادات' : 'View full FAQ page'}</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ============================================================
            10. PARTNERSHIPS & INSTITUTIONAL COLLABORATION
            ============================================================ */}
        <section className="py-20 lg:py-24 bg-[#faf7f2] border-b border-[#e5e0d6]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[#c85a32]">
              {dict.partners.title}
            </span>
            <h2 className="text-3xl font-extrabold text-[#08242a] mt-2 mb-4">
              {dict.home.partners_title}
            </h2>
            <p className="text-sm sm:text-base text-[#445457] max-w-2xl mx-auto mb-12 leading-relaxed">
              {dict.home.partners_desc}
            </p>

            {/* Verified Partner Categories Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-10">
              {[
                { title: isAr ? 'المراكز الثقافية ودور الشباب' : 'Cultural & Youth Centers', desc: isAr ? 'وطنياً ودولياً' : 'National & International', icon: '🏛️', iconImg: '/icons/centers.png' },
                { title: isAr ? 'المؤسسات التعليمية' : 'Educational Institutes', desc: isAr ? 'مدارس وجامعات' : 'Schools & Universities', icon: '🎓', iconImg: '/icons/education.png' },
                { title: isAr ? 'منظمات المجتمع المدني' : 'Civil Society Organizations', desc: isAr ? 'جمعيات ومنظمات' : 'NGOs & Associations', icon: '🤝', iconImg: '/icons/ngo.png' },
                { title: isAr ? 'الرعاية المؤسسية والقطاع الخاص' : 'Private Sector Sponsorship', desc: isAr ? 'دعم ثقافي واجتماعي' : 'Cultural Sponsorship', icon: '🏢', iconImg: '/icons/sponsors.png' },
              ].map((tier, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-white border border-[#e5e0d6] shadow-subtle hover:shadow-card transition-all flex flex-col justify-center items-center text-center group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#faf7f2] border border-[#e5e0d6] flex items-center justify-center p-2 mb-3 shadow-2xs group-hover:scale-105 transition-transform overflow-hidden">
                    <IconWithFallback
                      src={tier.iconImg}
                      fallbackEmoji={tier.icon}
                      alt={tier.title}
                      size={28}
                      className="w-full h-full object-contain text-2xl"
                    />
                  </div>
                  <span className="text-xs font-bold text-[#08242a] mb-1 leading-snug">{tier.title}</span>
                  <span className="text-3xs text-[#819598] font-medium">{tier.desc}</span>
                </div>
              ))}
            </div>

            <Link
              href={`/${locale}/partnerships`}
              className="inline-flex items-center px-7 py-3.5 rounded-xl font-bold text-xs text-white bg-[#0d3b43] hover:bg-[#14505b] active:scale-95 transition-all shadow-subtle gap-2"
            >
              <span>{dict.partners.apply_partnership}</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* ============================================================
            11. FINAL HIGH-IMPACT CALL TO ACTION
            ============================================================ */}
        <section className="py-20 lg:py-24 bg-gradient-to-br from-[#0d3b43] via-[#08242a] to-[#04161a] text-white relative overflow-hidden">
          <div className="absolute inset-0 moroccan-pattern opacity-10 pointer-events-none" aria-hidden="true" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
            <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold bg-[#14505b] text-[#f4ce83] border border-[#268292]/40">
              {isAr ? 'انضم إلى مسيرة روح الفنون والثقافة 2026' : 'Join the Cultural Journey'}
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
              {dict.home.cta_title}
            </h2>

            <p className="text-sm sm:text-base text-[#d8f0f4] max-w-2xl mx-auto leading-relaxed">
              {dict.home.cta_desc}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href={`/${locale}/membership`}
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white bg-[#c85a32] hover:bg-[#b84e27] active:scale-95 transition-all shadow-card text-center text-sm"
              >
                {dict.membership.apply}
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="w-full sm:w-auto px-6 py-4 rounded-xl font-bold text-white border border-[#268292] hover:bg-[#14505b] transition-all text-center text-sm"
              >
                {dict.nav.contact}
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer locale={locale} dict={dict} />
    </>
  )
}

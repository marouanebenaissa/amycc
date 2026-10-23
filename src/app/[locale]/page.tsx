import { getDictionary } from '@/lib/i18n/dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { createPublicClient } from '@/lib/supabase/public'
import { FaqAccordion } from '@/components/home/FaqAccordion'
import { EventRegistrationModal } from '@/components/events/EventRegistrationModal'
import Link from 'next/link'
import Image from 'next/image'

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
  const isAr = locale === 'ar'
  const isFr = locale === 'fr'

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
      .eq('status', 'published')
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
              ? 'البرنامج التطوعي الرائد لتمكين الشباب المغربي من القيادة الثقافية وتنظيم التظاهرات الفنية وخدمة المجتمع المحلي.'
              : isFr
              ? 'Programme bénévole phare engageant les jeunes dans le leadership culturel et l\'animation de proximité.'
              : 'Our flagship volunteering program empowering young Moroccans in cultural leadership and community civic engagement.',
          },
        ],
      },
      {
        id: 'p-2',
        slug: 'arts-heritage-workshops',
        category: 'arts',
        city: isAr ? 'المملكة المغربية' : 'Morocco',
        program_translations: [
          {
            title: isAr ? 'ورشات الفنون والتراث الإبداعي' : isFr ? 'Ateliers des Arts et du Patrimoine' : 'Arts & Creative Heritage Workshops',
            description: isAr
              ? 'مساحات تدريبية تفاعلية للشباب والناشئة في الفنون التشكيلية، التعبير المسرحي، والموسيقى التراثية المغربية.'
              : isFr
              ? 'Ateliers interactifs de formation pour jeunes en arts visuels, théâtre dramatique et musique patrimoniale.'
              : 'Interactive masterclasses for youth exploring visual arts, dramatic theatre, and Moroccan musical heritage.',
          },
        ],
      },
      {
        id: 'p-3',
        slug: 'cultural-dialogue-forum',
        category: 'culture',
        city: isAr ? 'المملكة المغربية' : 'Morocco',
        program_translations: [
          {
            title: isAr ? 'ملتقى الحوار الثقافي والتنوع' : isFr ? 'Forum du Dialogue Culturel' : 'Cultural Dialogue Forum',
            description: isAr
              ? 'ندوات وأمسيات فكرية تجمع الفاعلين الثقافيين والشباب لمناقشة دور الثقافة والفنون في التنمية المستدامة.'
              : isFr
              ? 'Rencontres et débats réunissant acteurs culturels et jeunes autour du rôle de l\'art dans le développement.'
              : 'Conferences and roundtables bringing cultural leaders and youth together to explore culture as a catalyst for growth.',
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
              ? 'تعلن الجمعية عن تدشين موقعها الإلكتروني التفاعلي بـ 3 لغات لتيسير الانخراط والتطوع ومتابعة الأنشطة.'
              : isFr
              ? 'L\'association inaugure sa plateforme trilingue pour faciliter les adhésions et l\'engagement bénévole.'
              : 'AMYCC officially unveils its trilingual web platform to foster community engagement and cultural participation.',
          },
        ],
      },
    ]
  }

  // 6 Core Disciplines
  const areasList = [
    {
      key: 'arts',
      title: dict.areas.arts,
      desc: dict.areas.arts_desc,
      icon: '🎨',
      color: 'bg-[#faf7f2] border-[#e5e0d6]',
      accent: 'text-[#c85a32]',
    },
    {
      key: 'music',
      title: dict.areas.music,
      desc: dict.areas.music_desc,
      icon: '🎵',
      color: 'bg-[#faf7f2] border-[#e5e0d6]',
      accent: 'text-[#0d3b43]',
    },
    {
      key: 'theatre',
      title: dict.areas.theatre,
      desc: dict.areas.theatre_desc,
      icon: '🎭',
      color: 'bg-[#faf7f2] border-[#e5e0d6]',
      accent: 'text-[#d99b26]',
    },
    {
      key: 'culture',
      title: dict.areas.culture,
      desc: dict.areas.culture_desc,
      icon: '🏛️',
      color: 'bg-[#faf7f2] border-[#e5e0d6]',
      accent: 'text-[#0d3b43]',
    },
    {
      key: 'youth',
      title: dict.areas.youth,
      desc: dict.areas.youth_desc,
      icon: '🚀',
      color: 'bg-[#faf7f2] border-[#e5e0d6]',
      accent: 'text-[#c85a32]',
    },
    {
      key: 'community',
      title: dict.areas.community,
      desc: dict.areas.community_desc,
      icon: '🤝',
      color: 'bg-[#faf7f2] border-[#e5e0d6]',
      accent: 'text-[#0d3b43]',
    },
  ]

  // FAQs
  const homeFaqs = isAr
    ? [
        {
          q: 'ما هي جمعية روح الفنون والثقافة (AMYCC)؟',
          a: 'جمعية غير ربحية مغربية تأسست سنة 2026، تُعنى بالنهوض بالمشهد الثقافي والفني وتنمية المواهب الشابة عبر المسرح والموسيقى والفنون التشكيلية والتطوع المجتمعي بمختلف المدن المغربية.',
        },
        {
          q: 'ما هي مبادرة "شباب في العمل" وكيف يمكنني التطوع فيها؟',
          a: 'هي المبادرة الرائدة التي أطلقتها الجمعية لتمكين الشباب والشابات من المشاركة الميدانية في تأطير وتنظيم التظاهرات الفنية والثقافية. يمكنك ملء استمارة التطوع المباشرة عبر الموقع، وسيتواصل معك منسق المبادرة.',
        },
        {
          q: 'كيف يمكنني الانخراط كعضو سنوي في الجمعية؟',
          a: 'تفتح الجمعية باب العضوية لكافة المبدعين والمهتمين بالعمل الثقافي. يمكنك تعبئة استمارة الانخراط الإلكترونية من خلال صفحة "العضوية"، وستتم معالجة طلبك والمصادقة عليه من طرف مكتب الجمعية.',
        },
        {
          q: 'كيف يمكن للمؤسسات والمراكز الثقافية والمدارس عقد شراكة مع AMYCC؟',
          a: 'تعتمد الجمعية سياسة الانفتاح المؤسساتي مع كافة المتدخلين في الشأن التربوي والشبابي والثقافي. تتيح صفحة "الشراكات" تقديم مقترح تعاون رسمي، وسيقوم مسؤول الشراكات بمتابعة المقترح ودراسة آفاق التعاون المشترك.',
        },
      ]
    : isFr
    ? [
        {
          q: 'Qu\'est-ce que l\'Association Esprit des Arts et de la Culture (AMYCC) ?',
          a: 'Une organisation marocaine à but non lucratif fondée en 2026, dédiée à l\'épanouissement culturel, aux arts vivants, au patrimoine musical et à l\'autonomisation des jeunes à travers le Maroc.',
        },
        {
          q: 'Qu\'est-ce que l\'initiative "Jeunesse en Action" ?',
          a: 'C\'est notre programme bénévole phare permettant aux jeunes de s\'engager concrètement dans l\'organisation d\'événements culturels et de développer leurs compétences de leadership communautaire.',
        },
        {
          q: 'Comment devenir membre adhérent de l\'AMYCC ?',
          a: 'Remplissez le formulaire d\'adhésion en ligne sur notre site. Votre candidature sera examinée par le bureau de l\'association conformément à nos statuts.',
        },
        {
          q: 'Comment proposer un partenariat institutionnel ?',
          a: 'Les centres culturels, établissements scolaires et entreprises peuvent soumettre une proposition de partenariat directement via notre portail institutionnel.',
        },
      ]
    : [
        {
          q: 'What is the Spirit of Arts & Culture Association (AMYCC)?',
          a: 'A Moroccan nonprofit association founded in 2026 dedicated to promoting visual arts, theatre, music, cultural heritage, and youth empowerment across Moroccan cities.',
        },
        {
          q: 'What is the "Youth in Action" volunteering initiative?',
          a: 'It is our flagship civic initiative empowering young Moroccans to co-create and lead cultural events, workshops, and community outreach projects.',
        },
        {
          q: 'How can I become an active member of AMYCC?',
          a: 'Submit an online membership application through our portal. Applications are promptly reviewed by the association\'s board in accordance with our bylaws.',
        },
        {
          q: 'How can organizations establish a partnership with AMYCC?',
          a: 'Cultural centers, educational institutes, and private sponsors can submit formal collaboration proposals via our dedicated partnerships page.',
        },
      ]

  return (
    <>
      <Header locale={locale} dict={dict} />

      <main id="main-content" className="flex flex-col flex-1 bg-[#faf7f2]">

        {/* ============================================================
            1. HERO SECTION — Asymmetric Master Editorial Showcase
            ============================================================ */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#faf7f2] via-[#f7f2e9] to-[#faf7f2] border-b border-[#e5e0d6] pt-12 pb-16 lg:pt-20 lg:pb-28">
          {/* Subtle decorative Moroccan pattern overlay */}
          <div className="absolute inset-0 moroccan-pattern-light opacity-40 pointer-events-none" aria-hidden="true" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

              {/* Text & Content Column (7 cols) */}
              <div className="lg:col-span-7 space-y-6 text-start">
                {/* Official Verification Pill */}
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0d3b43]/10 border border-[#0d3b43]/20 text-[#0d3b43] text-xs font-bold shadow-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#c85a32] animate-pulse" />
                  <span>
                    {isAr
                      ? 'جمعية روح الفنون والثقافة — المملكة المغربية • تأسست 2026'
                      : isFr
                      ? 'Association Esprit des Arts et de la Culture — Maroc (Fondée 2026)'
                      : 'Spirit of Arts & Culture Association — Morocco (Founded 2026)'}
                  </span>
                </div>

                {/* Grand Cultural Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#08242a] tracking-tight leading-[1.15]">
                  <span className="block">
                    {dict.hero.title}
                  </span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c85a32] via-[#bd7d12] to-[#c85a32] text-3xl sm:text-4xl lg:text-5xl block mt-2">
                    {dict.hero.subtitle}
                  </span>
                </h1>

                {/* Mission Summary */}
                <p className="text-base sm:text-lg text-[#445457] leading-relaxed max-w-2xl font-medium">
                  {isAr
                    ? 'منصة ثقافية ومدنية غير ربحية تُعنى بتنمية المواهب، رعاية الفنون التشكيلية والموسيقى والمسرح، وتمكين الشباب عبر مبادرة "شباب في العمل" وشبكة شراكات وطنية ودولية واعدة.'
                    : dict.home.intro_p1}
                </p>

                {/* Action Buttons Cluster */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                  <Link
                    href={`/${locale}/programs`}
                    className="px-7 py-4 rounded-xl font-bold text-white bg-[#0d3b43] hover:bg-[#14505b] active:scale-98 transition-all shadow-card hover:shadow-card-hover text-center text-sm inline-flex items-center justify-center gap-2 group"
                  >
                    <span>{dict.hero.cta_primary}</span>
                    <span className="group-hover:translate-x-1 transition-transform" aria-hidden="true">
                      {isAr ? '←' : '→'}
                    </span>
                  </Link>

                  <Link
                    href={`/${locale}/volunteer`}
                    className="px-7 py-4 rounded-xl font-bold text-[#08242a] bg-[#f4ce83] hover:bg-[#fae0a5] active:scale-98 transition-all shadow-subtle text-center text-sm inline-flex items-center justify-center gap-2"
                  >
                    <span>🤝</span>
                    <span>{dict.volunteer.apply}</span>
                  </Link>

                  <Link
                    href={`/${locale}/membership`}
                    className="px-5 py-4 rounded-xl font-bold text-[#0d3b43] bg-white hover:bg-[#faf7f2] border border-[#cfc7b9] transition-all text-center text-sm inline-flex items-center justify-center gap-1.5"
                  >
                    <span>{dict.membership.apply}</span>
                    <span aria-hidden="true">↗</span>
                  </Link>
                </div>

                {/* Key Institutional Trust Chips */}
                <div className="pt-4 border-t border-[#e5e0d6]/70 flex flex-wrap gap-4 text-2xs font-bold text-[#5f7174]">
                  <span className="flex items-center gap-1.5">
                    <span className="text-[#c85a32]">✓</span>
                    <span>{isAr ? 'جمعية غير ربحية مسجلة بالمغرب' : 'Registered Moroccan Non-Profit'}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-[#0d3b43]">✓</span>
                    <span>{isAr ? '6 مجالات إبداعية وثقافية' : '6 Cultural Disciplines'}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-[#d99b26]">✓</span>
                    <span>{isAr ? 'مبادرة شباب في العمل للتطوع' : 'Youth in Action Program'}</span>
                  </span>
                </div>
              </div>

              {/* Visual Showcase Feature (5 cols) */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  {/* Outer Art Border with Moroccan Warm Glow */}
                  <div className="relative rounded-3xl p-3 bg-white/80 border-2 border-[#e5e0d6] shadow-card-hover backdrop-blur-xs overflow-hidden">
                    {/* Main Cultural Card */}
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#08242a]">
                      <Image
                        src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80"
                        alt="AMYCC Youth in Action & Cultural Expression"
                        fill
                        sizes="(max-width: 768px) 100vw, 40vw"
                        className="object-cover transition-transform duration-700 hover:scale-105"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#08242a] via-[#08242a]/30 to-transparent" />

                      {/* Brand Seal Overlay in Corner */}
                      <div className="absolute top-4 start-4 flex items-center gap-2.5 p-2 rounded-2xl bg-white/95 backdrop-blur-md shadow-md border border-[#e5e0d6]">
                        <div className="w-10 h-10 rounded-xl bg-[#0d3b43] p-1.5 flex items-center justify-center shrink-0">
                          <Image
                            src="/logo.png"
                            alt="AMYCC Seal"
                            width={32}
                            height={32}
                            className="object-contain"
                          />
                        </div>
                        <div className="pe-2">
                          <span className="font-black text-xs block text-[#08242a] leading-tight">
                            AMYCC
                          </span>
                          <span className="text-4xs font-bold text-[#c85a32] block">
                            {isAr ? 'روح الفنون والثقافة' : 'Spirit of Arts & Culture'}
                          </span>
                        </div>
                      </div>

                      {/* Bottom Banner Inside Photo */}
                      <div className="absolute bottom-4 start-4 end-4 p-3.5 rounded-xl bg-[#08242a]/85 backdrop-blur-md border border-[#14505b]/60 text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-3xs uppercase tracking-wider text-[#74bfcd] font-extrabold block">
                              {isAr ? 'المبادرة التطوعية الرائدة' : 'Flagship Volunteering Initiative'}
                            </span>
                            <span className="text-xs font-bold block text-white mt-0.5">
                              {isAr ? 'مبادرة شباب في العمل (Youth in Action)' : 'Youth in Action Program'}
                            </span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full text-4xs font-black bg-[#c85a32] text-white">
                            2026
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Floating Glass Accent Pill (Bottom) */}
                    <div className="mt-3 p-3.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                        <span className="text-xs font-bold text-[#08242a]">
                          {isAr ? 'التطوع والانخراط مفتوح للجميع' : 'Membership & Volunteering Open'}
                        </span>
                      </div>
                      <Link
                        href={`/${locale}/volunteer`}
                        className="text-2xs font-extrabold text-[#c85a32] hover:underline"
                      >
                        {dict.volunteer.apply} →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ============================================================
            2. INSTITUTIONAL FOUNDATIONS BAR (4 Verified Pillars)
            ============================================================ */}
        <section className="bg-white border-b border-[#e5e0d6] py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="p-4 rounded-2xl bg-[#faf7f2] border border-[#e5e0d6]">
                <div className="text-2xl sm:text-3xl font-black text-[#0d3b43]">2026</div>
                <div className="text-xs font-bold text-[#08242a] mt-1">
                  {isAr ? 'سنة التأسيس الرسمية بالمغرب' : 'Foundation Year in Morocco'}
                </div>
                <div className="text-3xs text-[#819598] mt-0.5 font-medium">
                  {isAr ? 'تأسيس جمعوي مدني' : 'Nonprofit Association'}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#faf7f2] border border-[#e5e0d6]">
                <div className="text-2xl sm:text-3xl font-black text-[#c85a32]">6</div>
                <div className="text-xs font-bold text-[#08242a] mt-1">
                  {isAr ? 'مجالات عمل فني وثقافي' : 'Core Cultural Domains'}
                </div>
                <div className="text-3xs text-[#819598] mt-0.5 font-medium">
                  {isAr ? 'فنون، موسيقى، مسرح، تطوع' : 'Arts, Music, Theatre, Civic'}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#faf7f2] border border-[#e5e0d6]">
                <div className="text-2xl sm:text-3xl font-black text-[#d99b26]">3</div>
                <div className="text-xs font-bold text-[#08242a] mt-1">
                  {isAr ? 'لغات تواصل معتمدة' : 'Official Platform Languages'}
                </div>
                <div className="text-3xs text-[#819598] mt-0.5 font-medium">
                  العربية • Français • English
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#faf7f2] border border-[#e5e0d6]">
                <div className="text-2xl sm:text-3xl font-black text-[#0d3b43]">100%</div>
                <div className="text-xs font-bold text-[#08242a] mt-1">
                  {isAr ? 'عمل مدني غير ربحي' : 'Civic Non-Profit Mission'}
                </div>
                <div className="text-3xs text-[#819598] mt-0.5 font-medium">
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
              <div className="bg-white p-8 rounded-3xl border border-[#e5e0d6] shadow-subtle hover:shadow-card hover:border-[#0d3b43]/30 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#0d3b43] text-white flex items-center justify-center font-bold text-xl mb-6 shadow-xs">
                    ✦
                  </div>
                  <h3 className="text-xl font-black text-[#08242a] mb-3">
                    {dict.about.mission_title}
                  </h3>
                  <p className="text-sm text-[#445457] leading-relaxed">
                    {isAr
                      ? 'رعاية الإبداع الفني والموسيقي والمسرحي، تمكين الشباب وصقل مهاراتهم، وتيسير الولوج الثقافي لجميع فئات المجتمع في مختلف المدن المغربية.'
                      : dict.about.description}
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-[#f4ede2]">
                  <Link
                    href={`/${locale}/about`}
                    className="text-xs font-bold text-[#0d3b43] hover:text-[#c85a32] transition-colors"
                  >
                    {isAr ? 'عن الجمعية وأهدافها' : 'Learn more about us'} →
                  </Link>
                </div>
              </div>

              {/* Vision */}
              <div className="bg-white p-8 rounded-3xl border-2 border-[#c85a32]/30 shadow-subtle hover:shadow-card transition-all flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 end-0 w-24 h-24 bg-[#fae4dc] rounded-bl-full pointer-events-none" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-[#c85a32] text-white flex items-center justify-center font-bold text-xl mb-6 shadow-xs">
                    ★
                  </div>
                  <h3 className="text-xl font-black text-[#08242a] mb-3">
                    {dict.about.vision_title}
                  </h3>
                  <p className="text-sm text-[#445457] leading-relaxed">
                    {isAr
                      ? 'بناء مجتمع مغربي متفاعل ومبدع يحتفي بالتنوع الثقافي والتراثي، ويجعل من الفنون رافعة حقيقية للتنمية البشرية والتماسك الاجتماعي.'
                      : dict.hero.subtitle}
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-[#f4ede2] relative z-10">
                  <Link
                    href={`/${locale}/programs`}
                    className="text-xs font-bold text-[#c85a32] hover:underline"
                  >
                    {isAr ? 'استكشف رؤيتنا ميدانياً' : 'Discover our vision'} →
                  </Link>
                </div>
              </div>

              {/* Values */}
              <div className="bg-white p-8 rounded-3xl border border-[#e5e0d6] shadow-subtle hover:shadow-card hover:border-[#d99b26]/50 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#d99b26] text-white flex items-center justify-center font-bold text-xl mb-6 shadow-xs">
                    ♥
                  </div>
                  <h3 className="text-xl font-black text-[#08242a] mb-3">
                    {dict.about.values_title}
                  </h3>
                  <p className="text-sm text-[#445457] leading-relaxed">
                    {isAr
                      ? 'الإبداع الحر، التطوع المسؤول، المواطنة الإيجابية، الشفافية المؤسساتية، والشراكة الفاعلة مع مختلف الفاعلين الثقافيين والتربويين.'
                      : dict.footer.description}
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-[#f4ede2]">
                  <Link
                    href={`/${locale}/membership`}
                    className="text-xs font-bold text-[#d99b26] hover:text-[#08242a] transition-colors"
                  >
                    {isAr ? 'شاركنا هذه القيم وانخرط معنا' : 'Join our values'} →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            4. SIX CORE DOMAINS OF WORK (مجالات التدخل الستة)
            ============================================================ */}
        <section className="py-20 lg:py-28 bg-white border-b border-[#e5e0d6]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-[#0d3b43]">
                {isAr ? 'مجالات النشاط الجمعوي' : 'Core Disciplines'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#08242a] mt-2 mb-4">
                {dict.home.areas_title}
              </h2>
              <p className="text-base text-[#445457] leading-relaxed">
                {dict.home.areas_subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {areasList.map(({ key, title, desc, icon, accent }) => (
                <div
                  key={key}
                  className="bg-[#faf7f2] p-7 rounded-3xl border border-[#e5e0d6] shadow-subtle hover:shadow-card hover:border-[#cfc7b9] transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-white border border-[#e5e0d6] flex items-center justify-center text-3xl mb-5 shadow-2xs group-hover:scale-105 transition-transform">
                      {icon}
                    </div>
                    <h3 className={`text-xl font-black text-[#08242a] mb-2.5 ${accent}`}>
                      {title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#445457] leading-relaxed mb-6">
                      {desc}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-[#e5e0d6]">
                    <Link
                      href={`/${locale}/programs`}
                      className="inline-flex items-center text-xs font-bold text-[#0d3b43] hover:text-[#c85a32] transition-colors"
                    >
                      <span>{dict.programs.learn_more}</span>
                      <span aria-hidden="true" className="ms-1">→</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            5. YOUTH IN ACTION INITIATIVE SPOTLIGHT (شباب في العمل)
            ============================================================ */}
        <section className="py-20 lg:py-24 bg-[#08242a] text-white relative overflow-hidden">
          {/* Subtle Decorative Pattern */}
          <div className="absolute inset-0 moroccan-pattern opacity-15 pointer-events-none" aria-hidden="true" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

              {/* Spotlight Content */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-[#14505b] text-[#f4ce83] border border-[#268292]/40">
                  <span>★</span>
                  <span>{dict.home.youth_badge}</span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                  {dict.home.youth_title}
                </h2>

                <p className="text-sm sm:text-base text-[#d8f0f4] leading-relaxed">
                  {dict.home.youth_desc}
                </p>

                {/* 4-Step Volunteering Journey */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  <div className="p-3.5 rounded-xl bg-[#0d3b43]/80 border border-[#14505b] flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-[#c85a32] text-white flex items-center justify-center font-bold text-xs shrink-0">1</span>
                    <div>
                      <span className="font-bold text-xs block text-white">التقديم السهل عبر المنصة</span>
                      <span className="text-3xs text-[#74bfcd]">تعبئة استمارة التطوع الإلكترونية</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0d3b43]/80 border border-[#14505b] flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-[#c85a32] text-white flex items-center justify-center font-bold text-xs shrink-0">2</span>
                    <div>
                      <span className="font-bold text-xs block text-white">المواكبة والتأطير الميداني</span>
                      <span className="text-3xs text-[#74bfcd]">جلسات توجيه وصقل المهارات القيادية</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0d3b43]/80 border border-[#14505b] flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-[#c85a32] text-white flex items-center justify-center font-bold text-xs shrink-0">3</span>
                    <div>
                      <span className="font-bold text-xs block text-white">تنظيم التظاهرات الفنية</span>
                      <span className="text-3xs text-[#74bfcd]">المشاركة الفاعلة في الورش والمهرجانات</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0d3b43]/80 border border-[#14505b] flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-[#c85a32] text-white flex items-center justify-center font-bold text-xs shrink-0">4</span>
                    <div>
                      <span className="font-bold text-xs block text-white">شهادة تطوع وتجربة موثقة</span>
                      <span className="text-3xs text-[#74bfcd]">إثراء المسار الأكاديمي والمهني</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-3">
                  <Link
                    href={`/${locale}/volunteer`}
                    className="px-8 py-3.5 rounded-xl font-bold text-center text-[#08242a] bg-[#f4ce83] hover:bg-white active:scale-95 transition-all shadow-md text-xs sm:text-sm"
                  >
                    {dict.volunteer.apply}
                  </Link>
                  <Link
                    href={`/${locale}/about`}
                    className="px-6 py-3.5 rounded-xl font-bold text-center text-white border border-[#268292] hover:bg-[#14505b] transition-all text-xs sm:text-sm"
                  >
                    {dict.about.title}
                  </Link>
                </div>
              </div>

              {/* Visual Spotlight Card */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-3xl p-3 bg-white/10 border border-white/20 backdrop-blur-md shadow-2xl">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=1200&q=80"
                      alt="Youth in Action Performing Arts"
                      fill
                      sizes="(max-width: 768px) 100vw, 40vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#08242a] to-transparent opacity-80" />
                    <div className="absolute bottom-4 start-4 end-4 text-white">
                      <span className="text-3xs text-[#f4ce83] font-bold uppercase tracking-wider block">
                        AMYCC Morocco
                      </span>
                      <span className="text-sm font-bold block mt-1">
                        {isAr ? 'طاقات شبابية تقود المشهد الثقافي' : 'Youth Leadership in Arts & Culture'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

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

                      <h3 className="text-lg font-bold text-[#08242a] mb-2 leading-snug">
                        {trans.title}
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

                    <div className="pt-4 border-t border-[#e5e0d6]">
                      {ev.registration_open ? (
                        <EventRegistrationModal
                          eventId={ev.id}
                          eventTitle={trans.title}
                          eventDate={formattedDate}
                          eventVenue={ev.venue || ev.city || undefined}
                          locale={locale}
                          buttonLabel={dict.events.register}
                          className="w-full py-2.5 px-4 rounded-xl font-bold text-white bg-[#0d3b43] hover:bg-[#14505b] active:scale-95 transition-all text-xs shadow-xs flex items-center justify-center gap-2"
                        />
                      ) : (
                        <span className="block text-center py-2 text-2xs text-[#819598] font-semibold">
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
                { title: isAr ? 'المراكز الثقافية ودور الشباب' : 'Cultural & Youth Centers', desc: isAr ? 'وطنياً ودولياً' : 'National & International', icon: '🏛️' },
                { title: isAr ? 'المؤسسات التعليمية' : 'Educational Institutes', desc: isAr ? 'مدارس وجامعات' : 'Schools & Universities', icon: '🎓' },
                { title: isAr ? 'منظمات المجتمع المدني' : 'Civil Society Organizations', desc: isAr ? 'جمعيات ومنظمات' : 'NGOs & Associations', icon: '🤝' },
                { title: isAr ? 'الرعاية المؤسسية والقطاع الخاص' : 'Private Sector Sponsorship', desc: isAr ? 'دعم ثقافي واجتماعي' : 'Cultural Sponsorship', icon: '🏢' },
              ].map((tier, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-white border border-[#e5e0d6] shadow-subtle hover:shadow-card transition-all flex flex-col justify-center items-center text-center"
                >
                  <span className="text-2xl mb-2">{tier.icon}</span>
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
                href={`/${locale}/volunteer`}
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-[#08242a] bg-[#f4ce83] hover:bg-white active:scale-95 transition-all text-center text-sm"
              >
                {dict.volunteer.apply}
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

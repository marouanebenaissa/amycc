import { getDictionary } from '@/lib/i18n/dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getTopBarSettings } from '@/lib/settings'
import { createPublicClient } from '@/lib/supabase/public'
import { FaqAccordion } from '@/components/home/FaqAccordion'
import { EventRegistrationModal } from '@/components/events/EventRegistrationModal'
import { IconWithFallback } from '@/components/ui/IconWithFallback'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'
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
  const [dict, topBar] = await Promise.all([
    getDictionary(locale),
    getTopBarSettings(),
  ])
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
        city: isAr ? 'مراكش ومختلف المدن المغربية' : isFr ? 'Marrakech et plusieurs villes marocaines' : 'Marrakech & Moroccan Cities',
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
        city: isAr ? 'مراكش' : 'Marrakech',
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
        city: isAr ? 'مراكش' : 'Marrakech',
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
        venue: isAr ? 'فضاء الفنون والإبداع' : 'Arts Space',
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
              ? 'تعلن الجمعية عن تدشين موقعها الإلكتروني التفاعلي بـ 3 لغات لتيسير الانخراط والتطوع ومتابعة الأنشطة الثقافية بالمغرب وخارجه.'
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
            title: isAr ? 'بناء شبكة شراكات مؤسساتية لتعزيز الإشعاع الثقافي الوطني والدولي' : isFr ? 'Développement de partenariats institutionnels culturels et éducatifs' : 'Building Institutional Partnerships for Moroccan Arts & Culture',
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

  // The 7 Official Core Values from the Marrakech Foundation Charter
  const coreValues = [
    {
      num: '01',
      name: isAr ? 'الإبداع' : isFr ? 'Créativité' : 'Creativity',
      desc: isAr
        ? 'تشجيع التعبير الفني والابتكار وتنمية الخيال لدى الشباب، وإتاحة الفرص لاكتشاف مواهبهم وتطوير قدراتهم.'
        : isFr
        ? 'Encourager l\'expression artistique, l\'innovation et l\'imagination chez les jeunes.'
        : 'Encouraging artistic expression, innovation, and creative imagination among youth.',
      icon: '🎨',
      badgeColor: 'bg-[#fae4dc] text-[#c85a32] border-[#c85a32]/25',
    },
    {
      num: '02',
      name: isAr ? 'الشمولية' : isFr ? 'Inclusion' : 'Inclusivity',
      desc: isAr
        ? 'توفير بيئة مفتوحة ومرحبة تتيح للجميع المشاركة والاستفادة من أنشطة الجمعية دون أي تمييز.'
        : isFr
        ? 'Offrir un environnement ouvert et accueillant permettant à tous de participer sans discrimination.'
        : 'Providing an open, welcoming environment enabling all to participate without discrimination.',
      icon: '🌐',
      badgeColor: 'bg-[#d8f0f4] text-[#0d3b43] border-[#0d3b43]/25',
    },
    {
      num: '03',
      name: isAr ? 'التضامن' : isFr ? 'Solidarité' : 'Solidarity',
      desc: isAr
        ? 'تعزيز التعاون والتكافل والعمل التطوعي، وتشجيع المبادرات الهادفة لخدمة المجتمع ومساندة الفئات المحتاجة.'
        : isFr
        ? 'Renforcer la solidarité, l\'entraide et le bénévolat au service des personnes vulnérables.'
        : 'Fostering solidarity, mutual aid, and civic volunteering to support communities in need.',
      icon: '🤝',
      badgeColor: 'bg-[#fdf2db] text-[#99620b] border-[#d99b26]/30',
    },
    {
      num: '04',
      name: isAr ? 'التعليم والتطوير' : isFr ? 'Éducation & Développement' : 'Education & Growth',
      desc: isAr
        ? 'دعم التعلم المستمر واكتساب المهارات وتنمية القدرات الشخصية والفنية والثقافية للشباب.'
        : isFr
        ? 'Soutenir l\'apprentissage continu, l\'acquisition de compétences et l\'épanouissement personnel.'
        : 'Supporting continuous learning, artistic skill acquisition, and personal empowerment.',
      icon: '📚',
      badgeColor: 'bg-[#eaf0f1] text-[#14505b] border-[#14505b]/25',
    },
    {
      num: '05',
      name: isAr ? 'الاحترام والتنوع' : isFr ? 'Respect & Diversité' : 'Respect & Diversity',
      desc: isAr
        ? 'تقدير الاختلافات وصون التراث المغربي، وتشجيع الحوار والتبادل الثقافي والانفتاح على الثقافات العالمية.'
        : isFr
        ? 'Valoriser la diversité, préserver le patrimoine marocain et encourager le dialogue interculturel.'
        : 'Honoring cultural diversity, safeguarding Moroccan heritage, and fostering intercultural dialogue.',
      icon: '🕊️',
      badgeColor: 'bg-[#fae4dc] text-[#c85a32] border-[#c85a32]/25',
    },
    {
      num: '06',
      name: isAr ? 'التعاون والشراكة' : isFr ? 'Coopération & Partenariat' : 'Cooperation & Partnership',
      desc: isAr
        ? 'بناء علاقات تعاون فعالة مع المؤسسات والجمعيات محلياً ووطنياً ودولياً لتعزيز الأثر المجتمعي المستدام.'
        : isFr
        ? 'Nouer des partenariats stratégiques avec les institutions locales, nationales et internationales.'
        : 'Building impactful collaborations with local, national, and international institutions.',
      icon: '🏛️',
      badgeColor: 'bg-[#d8f0f4] text-[#0d3b43] border-[#0d3b43]/25',
    },
    {
      num: '07',
      name: isAr ? 'الشفافية والمسؤولية' : isFr ? 'Transparence & Responsabilité' : 'Transparency & Accountability',
      desc: isAr
        ? 'الالتزام بالنزاهة والوضوح في تدبير موارد الجمعية وتنفيذ أنشطتها، وتحمل المسؤولية تجاه المجتمع والشركاء.'
        : isFr
        ? 'Engagement envers l\'intégrité, la clarté dans la gestion des ressources et la redevabilité publique.'
        : 'Commitment to integrity, sound resource management, and responsibility toward society.',
      icon: '⚖️',
      badgeColor: 'bg-[#fdf2db] text-[#99620b] border-[#d99b26]/30',
    },
  ]

  // 6 Core Disciplines with elevated artistic metadata and custom icons
  const areasList = [
    {
      code: '01',
      key: 'arts',
      title: dict.areas.arts,
      desc: dict.areas.arts_desc,
      icon: '🎨',
      iconImg: '/icons/arts.png',
      tag: isAr ? 'محترفات تشكيلية ومعارض' : 'Visual & Fine Arts',
      accent: 'border-[#c85a32]/30 text-[#c85a32]',
      bgGlow: 'from-[#fae4dc]/50 to-transparent',
    },
    {
      code: '02',
      key: 'music',
      title: dict.areas.music,
      desc: dict.areas.music_desc,
      icon: '🎵',
      iconImg: '/icons/music.png',
      tag: isAr ? 'تراث وأداء موسيقي' : 'Heritage & Musical Arts',
      accent: 'border-[#0d3b43]/30 text-[#0d3b43]',
      bgGlow: 'from-[#d8f0f4]/50 to-transparent',
    },
    {
      code: '03',
      key: 'theatre',
      title: dict.areas.theatre,
      desc: dict.areas.theatre_desc,
      icon: '🎭',
      iconImg: '/icons/theatre.png',
      tag: isAr ? 'تعبير مسرحي وارتجال' : 'Theatre & Scenic Expression',
      accent: 'border-[#d99b26]/40 text-[#99620b]',
      bgGlow: 'from-[#fdf2db]/50 to-transparent',
    },
    {
      code: '04',
      key: 'culture',
      title: dict.areas.culture,
      desc: dict.areas.culture_desc,
      icon: '🏛️',
      iconImg: '/icons/culture.png',
      tag: isAr ? 'صون الذاكرة والتراث' : 'Moroccan Cultural Heritage',
      accent: 'border-[#0d3b43]/30 text-[#0d3b43]',
      bgGlow: 'from-[#d8f0f4]/50 to-transparent',
    },
    {
      code: '05',
      key: 'youth',
      title: dict.areas.youth,
      desc: dict.areas.youth_desc,
      icon: '🚀',
      iconImg: '/icons/youth.png',
      tag: isAr ? 'تكوين وقيادة شبابية' : 'Youth Leadership & Skills',
      accent: 'border-[#c85a32]/30 text-[#c85a32]',
      bgGlow: 'from-[#fae4dc]/50 to-transparent',
    },
    {
      code: '06',
      key: 'community',
      title: dict.areas.community,
      desc: dict.areas.community_desc,
      icon: '🤝',
      iconImg: '/icons/community.png',
      tag: isAr ? 'مبادرة شباب في العمل' : 'Civic Volunteering Program',
      accent: 'border-[#d99b26]/40 text-[#99620b]',
      bgGlow: 'from-[#fdf2db]/50 to-transparent',
    },
  ]

  // Home FAQs
  const homeFaqs = isAr
    ? [
        {
          q: 'ما هي جمعية روح الفنون والثقافة (AMYCC) وما هو إطارها القانوني؟',
          a: 'جمعية روح الفنون والثقافة هي جمعية مدنية مغربية غير ربحية تأسست سنة 2026 بمدينة مراكش، تعمل في إطار الظهير الشريف رقم 1.58.376 المنظم لحق تأسيس الجمعيات بالمملكة المغربية، وتهدف إلى رعاية الفنون، صون التراث الثقافي، وتمكين الشباب من خلال المبادرات الإبداعية والمجتمعية.',
        },
        {
          q: 'ما هي مبادرة "شباب في العمل" (Youth in Action) وكيف يمكنني الانضمام؟',
          a: 'هي المبادرة التطوعية والمجتمعية الرائدة للجمعية، تهدف إلى إشراك الشباب في تخطيط وتنظيم الفعاليات الثقافية والورشات الفنية. يمكنك التقديم مجاناً عبر ملء استمارة التطوع المتاحة على المنصة، وتمنح الجمعية شواهد تطوع وتجربة جمعوية معتمدة لكافة المشاركين.',
        },
        {
          q: 'كيف يمكن الانخراط والحصول على بطاقة العضوية في الجمعية؟',
          a: 'يمكن للراغبين في الانخراط تعبئة استمارة العضوية الإلكترونية في قسم "العضوية". تتم دراسة الطلبات من طرف مكتب الجمعية وفقاً لمقتضيات النظام الأساسي والداخلي، ويتم التواصل مع مقدم الطلب لتأكيد انخراطه السنوي.',
        },
        {
          q: 'كيف يمكن للمؤسسات والمراكز الثقافية والتعليمية عقد شراكة مع AMYCC؟',
          a: 'نرحب بجميع الشراكات الهادفة مع المراكز الثقافية، دور الشباب، المدارس، الجامعات، والجهات الراعية من القطاع الخاص. يمكن تقديم مقترح شراكة مؤسساتية عبر صفحة الشراكات على المنصة أو التواصل المباشر عبر البريد الرسمي contact@amycc.org.',
        },
      ]
    : isFr
    ? [
        {
          q: 'Qu\'est-ce que l\'Association AMYCC et quel est son statut légal ?',
          a: 'L\'Association Esprit des Arts et de la Culture (AMYCC) est une organisation marocaine à but non lucratif fondée en 2026 à Marrakech. Elle œuvre pour la promotion des arts, la sauvegarde du patrimoine culturel et l\'autonomisation des jeunes à travers le Royaume.',
        },
        {
          q: 'Comment participer à l\'initiative "Jeunesse en Action" ?',
          a: 'Il s\'agit de notre initiative citoyenne phare. Vous pouvez postuler en ligne via notre formulaire de bénévolat pour participer activement à l\'organisation d\'événements et recevoir une attestation certifiée d\'engagement civique.',
        },
        {
          q: 'Comment devenir membre adhérent de l\'AMYCC ?',
          a: 'Remplissez le formulaire d\'adhésion en ligne. Votre candidature sera examinée par le bureau exécutif conformément aux statuts de l\'association.',
        },
        {
          q: 'Comment proposer un partenariat institutionnel avec l\'association ?',
          a: 'Nous collaborons étroitement avec les centres culturels, universités, écoles et mécènes. Déposez votre projet via notre page dédiée aux partenariats ou écrivez-nous à contact@amycc.org.',
        },
      ]
    : [
        {
          q: 'What is the Spirit of Arts & Culture Association (AMYCC)?',
          a: 'A Moroccan nonprofit association founded in 2026 in Marrakech, dedicated to promoting visual arts, theatre, music, cultural heritage, and youth empowerment across Moroccan cities.',
        },
        {
          q: 'What is the "Youth in Action" volunteering initiative?',
          a: 'It is our flagship civic initiative empowering young Moroccans to co-create and lead cultural events, workshops, and community outreach projects with official volunteering certificates.',
        },
        {
          q: 'How can I become an active member of AMYCC?',
          a: 'Submit an online membership application through our portal. Applications are promptly reviewed by the association\'s executive board in accordance with our bylaws.',
        },
        {
          q: 'How can organizations establish a partnership with AMYCC?',
          a: 'Cultural centers, educational institutes, and private sponsors can submit formal collaboration proposals via our dedicated partnerships page or email us directly at contact@amycc.org.',
        },
      ]

  return (
    <>
      <Header locale={locale} dict={dict} topBar={topBar} />

      <main id="main-content" className="flex flex-col flex-1 bg-[#faf7f2]">

        {/* ============================================================
            1. HERO SECTION — Grand Cultural Portal & Editorial Showcase
            ============================================================ */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#faf7f2] via-[#f7f2e9] to-[#faf7f2] border-b border-[#e5e0d6] pt-10 pb-16 lg:pt-16 lg:pb-24">
          {/* Subtle decorative Moroccan pattern overlay */}
          <div className="absolute inset-0 moroccan-star-pattern opacity-60 pointer-events-none" aria-hidden="true" />

          {/* Ambient Lighting Glows */}
          <div className="absolute top-1/4 start-1/4 w-96 h-96 bg-[#c85a32]/6 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 end-10 w-96 h-96 bg-[#0d3b43]/6 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">

              {/* Text & Content Column (7 cols) */}
              <div className="lg:col-span-7 space-y-6 text-start">
                {/* Official Verification Pill */}
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-[#e5e0d6] text-[#0d3b43] text-xs font-bold shadow-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#c85a32] animate-pulse" />
                  <span className="font-mono text-3xs px-2 py-0.5 rounded-md bg-[#f4ede2] text-[#c85a32] font-black">
                    2026
                  </span>
                  <span>
                    {isAr
                      ? 'المملكة المغربية • جمعية مدنية غير ربحية — تأسست بمراكش 2026'
                      : isFr
                      ? 'Royaume du Maroc • Association Civile à But Non Lucratif (Fondée à Marrakech 2026)'
                      : 'Kingdom of Morocco • Civic Non-Profit Association (Founded in Marrakech 2026)'}
                  </span>
                </div>

                {/* Grand Cultural Headline */}
                <div className="space-y-3">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#08242a] tracking-tight leading-[1.2]">
                    <span className="block text-[#0d3b43]">
                      {isAr ? 'جمعية روح الفنون والثقافة (AMYCC)' : dict.hero.title}
                    </span>
                    <span className="block text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#c85a32] mt-2">
                      {isAr
                        ? 'رعاية الإبداع المعاصر، صون التراث المغربي الأصيل، وتمكين الشباب'
                        : dict.hero.subtitle}
                    </span>
                  </h1>
                </div>

                {/* Mission Summary Paragraph */}
                <p className="text-base sm:text-lg text-[#445457] leading-relaxed max-w-2xl font-medium">
                  {isAr
                    ? 'منصة ثقافية وفنية مدنية غير ربحية تأسست سنة 2026 بمدينة مراكش، تكرّس جهودها لاكتشاف المواهب الشابة، صون التراث الموسيقي والمسرحي، وتأهيل الأجيال الصاعدة عبر مبادرة "شباب في العمل" وشبكة شراكات وطنية ودولية مستدامة.'
                    : dict.home.intro_p1}
                </p>

                {/* Action Buttons Cluster */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                  <Link
                    href={`/${locale}/programs`}
                    className="px-7 py-4 rounded-xl font-bold text-white bg-[#0d3b43] hover:bg-[#14505b] active:scale-98 transition-all shadow-card hover:shadow-card-hover text-center text-sm inline-flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <span>{dict.hero.cta_primary}</span>
                    <span className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" aria-hidden="true">
                      {isAr ? '←' : '→'}
                    </span>
                  </Link>

                  <Link
                    href={`/${locale}/membership`}
                    className="px-7 py-4 rounded-xl font-bold text-[#08242a] bg-[#f4ce83] hover:bg-[#fae0a5] active:scale-98 transition-all shadow-subtle text-center text-sm inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{dict.membership.apply}</span>
                    <span aria-hidden="true">↗</span>
                  </Link>

                  <Link
                    href={`/${locale}/programs/youth-in-action`}
                    className="px-5 py-4 rounded-xl font-bold text-[#0d3b43] bg-white border border-[#e5e0d6] hover:border-[#0d3b43] hover:bg-[#f4ede2] transition-all text-center text-xs sm:text-sm inline-flex items-center justify-center gap-2"
                  >
                    <span>★ {isAr ? 'مبادرة شباب في العمل' : 'Youth in Action'}</span>
                  </Link>
                </div>

                {/* Key Institutional Trust Chips */}
                <div className="pt-4 border-t border-[#e5e0d6]/70 flex flex-wrap gap-3 text-2xs font-bold text-[#5f7174]">
                  <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-[#e5e0d6] shadow-2xs">
                    <span className="text-[#c85a32] font-black">✓</span>
                    <span>{isAr ? 'إطار قانوني خاضع للظهير الشريف 1.58.376' : 'Registered Non-Profit Under Dahir 1.58.376'}</span>
                  </span>
                  <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-[#e5e0d6] shadow-2xs">
                    <span className="text-[#0d3b43] font-black">✓</span>
                    <span>{isAr ? '6 مجالات إبداعية وثقافية متكاملة' : '6 Core Cultural Disciplines'}</span>
                  </span>
                  <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-[#e5e0d6] shadow-2xs">
                    <span className="text-[#d99b26] font-black">✓</span>
                    <span>{isAr ? 'شواهد تطوع وتجربة جمعوية معتمدة' : 'Official Volunteering Certificates'}</span>
                  </span>
                </div>
              </div>

              {/* Visual Showcase Feature (5 cols) — Prestigious Cultural Composition */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  {/* Outer Art Border with Moroccan Warm Shadow */}
                  <div className="relative rounded-3xl p-3.5 bg-white/95 border-2 border-[#e5e0d6] shadow-card-hover backdrop-blur-xs overflow-hidden">
                    {/* Main Cultural Photo Card */}
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#08242a]">
                      <ImageWithFallback
                        src="/images/hero.png"
                        fallbackSrc="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80"
                        alt="AMYCC Youth in Action & Cultural Expression"
                        fill
                        sizes="(max-width: 768px) 100vw, 40vw"
                        className="object-cover transition-transform duration-700 hover:scale-105"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#08242a] via-[#08242a]/30 to-transparent" />

                      {/* Official Seal Badge in Top Corner */}
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

                      {/* Season 2026 Ticker Inside Photo */}
                      <div className="absolute bottom-4 start-4 end-4 p-3.5 rounded-xl bg-[#08242a]/90 backdrop-blur-md border border-[#14505b]/70 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                          <div className="min-w-0">
                            <span className="text-3xs uppercase tracking-wider text-[#f4ce83] font-black block">
                              {isAr ? 'الموسم الثقافي 2026 — مراكش' : 'Cultural Season 2026 — Marrakech'}
                            </span>
                            <span className="text-xs font-bold block text-white mt-0.5 truncate">
                              {isAr ? 'مبادرة شباب في العمل (Youth in Action)' : 'Youth in Action Initiative'}
                            </span>
                          </div>
                          <span className="px-2.5 py-1 rounded-full text-4xs font-black bg-[#c85a32] text-white shrink-0 ms-2">
                            {isAr ? 'مفتوح' : 'Active'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Access Strip Below Photo */}
                    <div className="mt-3.5 p-3.5 rounded-2xl bg-[#faf7f2] border border-[#e5e0d6] flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-bold text-[#08242a]">
                          {isAr ? 'باب العضوية والتطوع مفتوح لجميع الشباب' : 'Open Membership & Volunteering 2026'}
                        </span>
                      </div>
                      <Link
                        href={`/${locale}/membership`}
                        className="text-2xs font-extrabold text-[#c85a32] hover:underline shrink-0"
                      >
                        {dict.membership.apply} ←
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ============================================================
            2. INSTITUTIONAL BENCHMARKS & PILLARS STRIP
            ============================================================ */}
        <section className="bg-white border-b border-[#e5e0d6] py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Benchmark 1 */}
              <div className="p-6 rounded-2xl bg-[#faf7f2] border border-[#e5e0d6] shadow-2xs hover:border-[#0d3b43]/40 transition-all flex flex-col justify-between group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl sm:text-3xl font-black text-[#0d3b43]">2026</span>
                  <span className="w-9 h-9 rounded-xl bg-white border border-[#e5e0d6] flex items-center justify-center text-sm shadow-2xs group-hover:scale-110 transition-transform">
                    🏛️
                  </span>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#08242a]">
                    {isAr ? 'سنة التأسيس بمراكش' : 'Foundation Year in Marrakech'}
                  </h3>
                  <p className="text-3xs text-[#5f7174] mt-1 font-medium">
                    {isAr ? 'انطلاقة مدنية نحو مختلف جهات المملكة' : 'Civic journey originating from Marrakech'}
                  </p>
                </div>
              </div>

              {/* Benchmark 2 */}
              <div className="p-6 rounded-2xl bg-[#faf7f2] border border-[#e5e0d6] shadow-2xs hover:border-[#c85a32]/40 transition-all flex flex-col justify-between group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl sm:text-3xl font-black text-[#c85a32]">6</span>
                  <span className="w-9 h-9 rounded-xl bg-white border border-[#e5e0d6] flex items-center justify-center text-sm shadow-2xs group-hover:scale-110 transition-transform">
                    🎨
                  </span>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#08242a]">
                    {isAr ? 'مجالات عمل إبداعية' : 'Core Creative Disciplines'}
                  </h3>
                  <p className="text-3xs text-[#5f7174] mt-1 font-medium">
                    {isAr ? 'مسرح، موسيقى، فنون تشكيلية، وتراث' : 'Visual arts, theatre, music & heritage'}
                  </p>
                </div>
              </div>

              {/* Benchmark 3 */}
              <div className="p-6 rounded-2xl bg-[#faf7f2] border border-[#e5e0d6] shadow-2xs hover:border-[#d99b26]/40 transition-all flex flex-col justify-between group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl sm:text-3xl font-black text-[#99620b]">100%</span>
                  <span className="w-9 h-9 rounded-xl bg-white border border-[#e5e0d6] flex items-center justify-center text-sm shadow-2xs group-hover:scale-110 transition-transform">
                    🤝
                  </span>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#08242a]">
                    {isAr ? 'عمل مدني غير ربحي' : '100% Non-Profit Civic Mission'}
                  </h3>
                  <p className="text-3xs text-[#5f7174] mt-1 font-medium">
                    {isAr ? 'تطوع وإبداع في خدمة الصالح العام' : 'Empowering communities through arts'}
                  </p>
                </div>
              </div>

              {/* Benchmark 4 */}
              <div className="p-6 rounded-2xl bg-[#faf7f2] border border-[#e5e0d6] shadow-2xs hover:border-[#0d3b43]/40 transition-all flex flex-col justify-between group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl sm:text-3xl font-black text-[#0d3b43]">3</span>
                  <span className="w-9 h-9 rounded-xl bg-white border border-[#e5e0d6] flex items-center justify-center text-sm shadow-2xs group-hover:scale-110 transition-transform">
                    🌐
                  </span>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#08242a]">
                    {isAr ? 'لغات تواصل رسمية' : '3 Official Languages'}
                  </h3>
                  <p className="text-3xs text-[#5f7174] mt-1 font-medium">
                    العربية • Français • English
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            3. FOUNDATIONS SHOWCASE: Mission, Vision & The 7 Core Values
            ============================================================ */}
        <section className="py-20 lg:py-28 bg-[#faf7f2] border-b border-[#e5e0d6]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
              <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-[#c85a32] bg-[#fae4dc] border border-[#c85a32]/20">
                {isAr ? 'الميثاق التأسيسي والهوية المؤسسية' : 'Charter & Institutional Identity'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#08242a] tracking-tight">
                {isAr ? 'رسالتنا، رؤيتنا الاستراتيجية، وقيمنا السبع الأساسية' : dict.home.intro_title}
              </h2>
              <p className="text-base text-[#445457] leading-relaxed">
                {isAr
                  ? 'من مدينة مراكش تنطلق مبادراتنا لبناء صرح ثقافي مستدام يجمع الشباب حول قيم الإبداع والتنوع والتضامن الوطني.'
                  : dict.home.intro_p1}
              </p>
            </div>

            {/* 3-Card Master Pillars Architecture */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* 1. الرسالة (Our Mission) */}
              <div className="luxury-card p-8 flex flex-col justify-between group relative overflow-hidden">
                <div className="space-y-5">
                  <div className="w-14 h-14 rounded-2xl bg-[#0d3b43] text-white flex items-center justify-center text-2xl shadow-xs group-hover:scale-105 transition-transform">
                    <IconWithFallback
                      src="/icons/mission.png"
                      fallbackEmoji="✦"
                      alt={dict.about.mission_title}
                      size={32}
                    />
                  </div>

                  <div>
                    <span className="text-3xs font-black uppercase tracking-wider text-[#c85a32] block mb-1">
                      {isAr ? 'الركيزة الأولى' : 'Pillar 01'}
                    </span>
                    <h3 className="text-2xl font-black text-[#08242a]">
                      {dict.about.mission_title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-[#445457] leading-relaxed">
                    {isAr
                      ? 'تؤمن جمعية روح الفنون والثقافة (AMYCC) بأن لكل شاب موهبة وقدرات إبداعية تستحق الاكتشاف والرعاية والتطوير، وأن الفن والثقافة يشكلان وسيلة أساسية للتعبير عن الذات وتنمية المهارات وتعزيز التواصل بين أفراد المجتمع.'
                      : dict.about.description}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-[#f4ede2] text-xs font-semibold text-[#08242a]">
                    <div className="flex items-center gap-2">
                      <span className="text-[#c85a32]">✓</span>
                      <span>{isAr ? 'اكتشاف المواهب وصقل القدرات الإبداعية' : 'Discovering & nurturing young artistic talent'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#c85a32]">✓</span>
                      <span>{isAr ? 'صون التراث الثقافي المغربي والتعريف به' : 'Safeguarding & promoting Moroccan cultural heritage'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#c85a32]">✓</span>
                      <span>{isAr ? 'بناء شراكات فعالة وطنياً ودولياً' : 'Building impactful national & international partnerships'}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-[#f4ede2]">
                  <Link
                    href={`/${locale}/about`}
                    className="text-xs font-bold text-[#0d3b43] hover:text-[#c85a32] transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>{isAr ? 'اكتشف رسالتنا الكاملة' : 'Read Our Full Mission'}</span>
                    <span aria-hidden="true">←</span>
                  </Link>
                </div>
              </div>

              {/* 2. الرؤية (Our Vision - 3 Horizons) */}
              <div className="luxury-card p-8 border-2 border-[#c85a32]/35 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute top-0 end-0 w-32 h-32 bg-[#fae4dc]/50 rounded-bl-full pointer-events-none" />

                <div className="space-y-5 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-[#c85a32] text-white flex items-center justify-center text-2xl shadow-xs group-hover:scale-105 transition-transform">
                    <IconWithFallback
                      src="/icons/vision.png"
                      fallbackEmoji="★"
                      alt={dict.about.vision_title}
                      size={32}
                    />
                  </div>

                  <div>
                    <span className="text-3xs font-black uppercase tracking-wider text-[#c85a32] block mb-1">
                      {isAr ? 'الركيزة الثانية' : 'Pillar 02'}
                    </span>
                    <h3 className="text-2xl font-black text-[#08242a]">
                      {dict.about.vision_title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-[#445457] leading-relaxed">
                    {isAr
                      ? 'تطمح جمعية روح الفنون والثقافة إلى أن تصبح جمعية رائدة في مجال الفنون والثقافة وتمكين الشباب، عبر بناء شبكة متكاملة من الفروع تنطلق إقليمياً وتمتد عبر آفاق ثلاث:'
                      : dict.hero.subtitle}
                  </p>

                  {/* 3 Expansion Horizons */}
                  <div className="space-y-2.5 pt-2">
                    <div className="p-3 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-[#0d3b43] text-white font-black text-3xs flex items-center justify-center shrink-0">1</span>
                      <div>
                        <span className="text-xs font-bold block text-[#08242a]">{isAr ? 'المستوى الإقليمي' : 'Regional Horizon'}</span>
                        <span className="text-3xs text-[#5f7174]">{isAr ? 'انطلاقة من مراكش وتثبيت الحضور' : 'Headquarters in Marrakech'}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-[#c85a32] text-white font-black text-3xs flex items-center justify-center shrink-0">2</span>
                      <div>
                        <span className="text-xs font-bold block text-[#08242a]">{isAr ? 'المستوى الوطني' : 'National Horizon'}</span>
                        <span className="text-3xs text-[#5f7174]">{isAr ? 'امتداد نحو مختلف جهات المملكة' : 'Expansion across all Moroccan regions'}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-[#d99b26] text-white font-black text-3xs flex items-center justify-center shrink-0">3</span>
                      <div>
                        <span className="text-xs font-bold block text-[#08242a]">{isAr ? 'المستوى الدولي' : 'International Horizon'}</span>
                        <span className="text-3xs text-[#5f7174]">{isAr ? 'شراكات وفروع عابرة للحدود' : 'Cross-border cultural exchanges & branches'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-[#f4ede2] relative z-10">
                  <Link
                    href={`/${locale}/about`}
                    className="text-xs font-bold text-[#c85a32] hover:underline inline-flex items-center gap-1.5"
                  >
                    <span>{isAr ? 'استكشف خارطة الرؤية الكاملة' : 'Explore Vision Roadmap'}</span>
                    <span aria-hidden="true">←</span>
                  </Link>
                </div>
              </div>

              {/* 3. القيم السبع الأساسية (Our 7 Core Values) */}
              <div className="luxury-card p-8 flex flex-col justify-between group relative overflow-hidden">
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#d99b26] text-white flex items-center justify-center text-2xl shadow-xs group-hover:scale-105 transition-transform">
                    <IconWithFallback
                      src="/icons/values.png"
                      fallbackEmoji="♥"
                      alt={dict.about.values_title}
                      size={32}
                    />
                  </div>

                  <div>
                    <span className="text-3xs font-black uppercase tracking-wider text-[#99620b] block mb-1">
                      {isAr ? 'الركيزة الثالثة' : 'Pillar 03'}
                    </span>
                    <h3 className="text-2xl font-black text-[#08242a]">
                      {isAr ? 'قيمنا الـ 7 الأساسية' : dict.about.values_title}
                    </h3>
                  </div>

                  <p className="text-xs text-[#5f7174] leading-relaxed">
                    {isAr
                      ? 'تستند الجمعية في عملها إلى منظومة متكاملة من 7 مبادئ سامية تُوجّه كافة أنشطتها ومشاريعها:'
                      : 'Our 7 foundational principles guiding our civic and cultural initiatives across Morocco:'}
                  </p>

                  {/* 7 Core Values Interactive List */}
                  <div className="space-y-2 pt-1 max-h-[310px] overflow-y-auto pe-1">
                    {coreValues.map((val) => (
                      <div
                        key={val.num}
                        className="p-2.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] hover:border-[#c85a32]/30 transition-all text-start"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-xs font-bold text-[#08242a] flex items-center gap-1.5">
                            <span>{val.icon}</span>
                            <span>{val.name}</span>
                          </span>
                          <span className={`text-4xs font-mono font-bold px-1.5 py-0.5 rounded border ${val.badgeColor}`}>
                            {val.num}
                          </span>
                        </div>
                        <p className="text-3xs text-[#5f7174] leading-snug">
                          {val.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#f4ede2]">
                  <Link
                    href={`/${locale}/about`}
                    className="text-xs font-bold text-[#99620b] hover:text-[#08242a] transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>{isAr ? 'قراءة تفاصيل الميثاق' : 'Learn More About Our Charter'}</span>
                    <span aria-hidden="true">←</span>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ============================================================
            4. CULTURAL MANIFESTO BANNER (INTERACTIVE EDITORIAL QUOTE)
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
            5. SIX CORE DOMAINS OF WORK (مجالات التدخل الستة)
            ============================================================ */}
        <section className="py-20 lg:py-28 bg-white border-b border-[#e5e0d6]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
              <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-[#0d3b43] bg-[#d8f0f4] border border-[#0d3b43]/20">
                {isAr ? 'مجالات النشاط الجمعوي' : 'Core Disciplines'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#08242a]">
                {dict.home.areas_title}
              </h2>
              <p className="text-base text-[#445457] leading-relaxed">
                {dict.home.areas_subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {areasList.map(({ code, key, title, desc, icon, iconImg, tag, accent, bgGlow }) => (
                <div
                  key={key}
                  className="bg-[#faf7f2] p-7 rounded-3xl border border-[#e5e0d6] shadow-subtle hover:shadow-card hover:border-[#cfc7b9] transition-all flex flex-col justify-between group relative overflow-hidden"
                >
                  <div className={`absolute top-0 end-0 w-32 h-32 bg-gradient-to-bl ${bgGlow} rounded-bl-full pointer-events-none`} />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-14 h-14 rounded-2xl bg-white border border-[#e5e0d6] flex items-center justify-center p-2.5 text-3xl shadow-2xs group-hover:scale-105 transition-transform overflow-hidden">
                        <IconWithFallback
                          src={iconImg}
                          fallbackEmoji={icon}
                          alt={title}
                          size={36}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-3xs font-black text-[#819598]">{code}</span>
                        <span className={`text-4xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full border bg-white ${accent}`}>
                          {tag}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-xl font-black text-[#08242a] mb-2.5">
                      {title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#445457] leading-relaxed mb-6">
                      {desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#e5e0d6] relative z-10 flex items-center justify-between">
                    <Link
                      href={`/${locale}/programs`}
                      className="inline-flex items-center text-xs font-bold text-[#0d3b43] hover:text-[#c85a32] transition-colors"
                    >
                      <span>{dict.programs.learn_more}</span>
                      <span aria-hidden="true" className="ms-1">←</span>
                    </Link>
                    <span className="text-3xs text-[#819598] font-medium">AMYCC 2026</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            6. YOUTH IN ACTION INITIATIVE SPOTLIGHT (شباب في العمل)
            ============================================================ */}
        <section className="py-20 lg:py-24 bg-[#08242a] text-white relative overflow-hidden">
          {/* Subtle Decorative Moroccan Pattern */}
          <div className="absolute inset-0 moroccan-pattern opacity-15 pointer-events-none" aria-hidden="true" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

              {/* Spotlight Content (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#14505b] text-[#f4ce83] border border-[#268292]/40 shadow-xs">
                  <span>★</span>
                  <span>{dict.home.youth_badge} — AMYCC 2026</span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                  {dict.home.youth_title}
                </h2>

                <p className="text-sm sm:text-base text-[#d8f0f4] leading-relaxed">
                  {dict.home.youth_desc}
                </p>

                {/* 4-Step Volunteering Journey */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  <div className="p-4 rounded-2xl bg-[#0d3b43]/80 border border-[#14505b] flex items-start gap-3 hover:border-[#f4ce83]/50 transition-colors">
                    <span className="w-8 h-8 rounded-xl bg-[#c85a32] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">01</span>
                    <div>
                      <span className="font-bold text-xs block text-white">{isAr ? 'التقديم السهل عبر المنصة' : 'Online Registration'}</span>
                      <span className="text-3xs text-[#74bfcd] leading-tight block mt-0.5">{isAr ? 'تعبئة استمارة التطوع الإلكترونية بـ 3 لغات' : 'Simple trilingual online application'}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#0d3b43]/80 border border-[#14505b] flex items-start gap-3 hover:border-[#f4ce83]/50 transition-colors">
                    <span className="w-8 h-8 rounded-xl bg-[#c85a32] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">02</span>
                    <div>
                      <span className="font-bold text-xs block text-white">{isAr ? 'المواكبة والتأطير الميداني' : 'Field Training & Mentorship'}</span>
                      <span className="text-3xs text-[#74bfcd] leading-tight block mt-0.5">{isAr ? 'ورشات تدريب وصقل المهارات القيادية' : 'Artistic & leadership development masterclasses'}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#0d3b43]/80 border border-[#14505b] flex items-start gap-3 hover:border-[#f4ce83]/50 transition-colors">
                    <span className="w-8 h-8 rounded-xl bg-[#c85a32] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">03</span>
                    <div>
                      <span className="font-bold text-xs block text-white">{isAr ? 'تنظيم التظاهرات الفنية' : 'Event Production'}</span>
                      <span className="text-3xs text-[#74bfcd] leading-tight block mt-0.5">{isAr ? 'المشاركة الفاعلة في تنظيم المهرجانات والملتقيات' : 'Hands-on cultural coordination & workshops'}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#0d3b43]/80 border border-[#14505b] flex items-start gap-3 hover:border-[#f4ce83]/50 transition-colors">
                    <span className="w-8 h-8 rounded-xl bg-[#c85a32] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">04</span>
                    <div>
                      <span className="font-bold text-xs block text-white">{isAr ? 'شهادة تطوع وتجربة موثقة' : 'Certified Experience'}</span>
                      <span className="text-3xs text-[#74bfcd] leading-tight block mt-0.5">{isAr ? 'إثراء المسار الأكاديمي والمهني برصيد معتمد' : 'Formal volunteering certificate & network'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-3">
                  <Link
                    href={`/${locale}/programs/youth-in-action`}
                    className="px-8 py-3.5 rounded-xl font-bold text-center text-[#08242a] bg-[#f4ce83] hover:bg-white active:scale-95 transition-all shadow-md text-xs sm:text-sm cursor-pointer"
                  >
                    {isAr ? 'قدّم للتطوع في المبادرة الآن' : 'Apply for Youth in Action'}
                  </Link>
                  <Link
                    href={`/${locale}/about`}
                    className="px-6 py-3.5 rounded-xl font-bold text-center text-white border border-[#268292] hover:bg-[#14505b] transition-all text-xs sm:text-sm cursor-pointer"
                  >
                    {dict.about.title}
                  </Link>
                </div>
              </div>

              {/* Visual Spotlight Card (5 cols) */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-3xl p-3 bg-white/10 border border-white/20 backdrop-blur-md shadow-2xl">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                    <ImageWithFallback
                      src="/images/youth-in-action.jpg"
                      fallbackSrc="https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=1200&q=80"
                      alt="Youth in Action Performing Arts"
                      fill
                      sizes="(max-width: 768px) 100vw, 40vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#08242a] to-transparent opacity-80" />
                    <div className="absolute bottom-4 start-4 end-4 text-white">
                      <span className="text-3xs text-[#f4ce83] font-bold uppercase tracking-wider block">
                        AMYCC Morocco — 2026
                      </span>
                      <span className="text-sm font-bold block mt-1">
                        {isAr ? 'طاقات شبابية تقود المشهد الثقافي والمجتمعي' : 'Youth Leadership in Arts & Culture'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ============================================================
            7. FEATURED PROGRAMS (DYNAMIC FROM DATABASE)
            ============================================================ */}
        <section className="py-20 lg:py-28 bg-[#faf7f2] border-b border-[#e5e0d6]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#c85a32]">
                  {dict.programs.title}
                </span>
                <h2 className="text-3xl font-extrabold text-[#08242a] mt-1">
                  {dict.home.featured_programs}
                </h2>
                <p className="text-xs sm:text-sm text-[#5f7174] mt-1">
                  {isAr ? 'محترفات وورشات فنية مستمرة لصقل المواهب والقدرات' : 'Curated masterclasses and ongoing cultural initiatives'}
                </p>
              </div>
              <Link
                href={`/${locale}/programs`}
                className="text-xs font-bold text-[#0d3b43] hover:text-[#c85a32] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>{dict.programs.view_all}</span>
                <span aria-hidden="true">←</span>
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
                        <span aria-hidden="true" className="ms-1">←</span>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ============================================================
            8. UPCOMING EVENTS & LIVE REGISTRATION MODAL
            ============================================================ */}
        <section className="py-20 lg:py-28 bg-white border-b border-[#e5e0d6]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                className="text-xs font-bold text-[#0d3b43] hover:text-[#c85a32] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>{dict.events.view_all}</span>
                <span aria-hidden="true">←</span>
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
                          {ev.registration_open ? (isAr ? 'التسجيل مفتوح مجاناً' : 'Free Registration Open') : 'Closed'}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-[#08242a] mb-2 leading-snug">
                        {trans.title}
                      </h3>

                      <p className="text-2xs text-[#5f7174] flex items-center gap-1 mb-4">
                        <span>📍</span>
                        <span>{ev.venue || ev.city || (isAr ? 'مراكش، المغرب' : 'Marrakech, Morocco')}</span>
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
                          className="w-full py-2.5 px-4 rounded-xl font-bold text-white bg-[#0d3b43] hover:bg-[#14505b] active:scale-95 transition-all text-xs shadow-xs flex items-center justify-center gap-2 cursor-pointer"
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
            9. LATEST NEWS & PRESS STATEMENTS
            ============================================================ */}
        <section className="py-20 lg:py-28 bg-[#faf7f2] border-b border-[#e5e0d6]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#c85a32]">
                  {dict.news.title}
                </span>
                <h2 className="text-3xl font-extrabold text-[#08242a] mt-1">
                  {dict.home.latest_news}
                </h2>
                <p className="text-xs sm:text-sm text-[#5f7174] mt-1">
                  {isAr ? 'متابعة إعلامية لأنشطة الجمعية وبلاغات الرأي العام' : 'Official press coverage and media announcements'}
                </p>
              </div>
              <Link
                href={`/${locale}/news`}
                className="text-xs font-bold text-[#0d3b43] hover:text-[#c85a32] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>{dict.news.view_all}</span>
                <span aria-hidden="true">←</span>
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
                        <span aria-hidden="true">←</span>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ============================================================
            10. FAQ SECTION WITH DEDICATED SUPPORT CARD
            ============================================================ */}
        <section className="py-20 lg:py-28 bg-white border-b border-[#e5e0d6]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

              {/* Accordion Column (8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#c85a32]">
                    AMYCC FAQ
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-[#08242a] mt-2 mb-3">
                    {isAr ? 'الأسئلة الشائعة حول الجمعية والأنشطة' : isFr ? 'Foire Aux Questions' : 'Frequently Asked Questions'}
                  </h2>
                  <p className="text-sm text-[#5f7174]">
                    {isAr
                      ? 'إجابات واضحة عن كيفية الانخراط، التطوع في مبادرة شباب في العمل، وحضور الفعاليات الثقافية.'
                      : 'Clear answers on membership, volunteering, and institutional partnership opportunities.'}
                  </p>
                </div>

                <FaqAccordion items={homeFaqs} />

                <div className="pt-2">
                  <Link
                    href={`/${locale}/faq`}
                    className="text-xs font-bold text-[#0d3b43] hover:text-[#c85a32] transition-colors inline-flex items-center gap-1"
                  >
                    <span>{isAr ? 'عرض دليل الأسئلة الكامل' : 'View full FAQ page'}</span>
                    <span aria-hidden="true">←</span>
                  </Link>
                </div>
              </div>

              {/* Sticky Official Support Card (4 cols) */}
              <div className="lg:col-span-4 bg-[#faf7f2] p-7 rounded-3xl border border-[#e5e0d6] shadow-subtle space-y-5">
                <div className="w-12 h-12 rounded-2xl bg-[#0d3b43] text-white flex items-center justify-center text-xl shadow-xs">
                  💬
                </div>

                <div>
                  <h3 className="text-lg font-black text-[#08242a]">
                    {isAr ? 'هل لديك استفسار خاص؟' : 'Have a Specific Question?'}
                  </h3>
                  <p className="text-xs text-[#5f7174] mt-1.5 leading-relaxed">
                    {isAr
                      ? 'فريق إدارة الجمعية يرحب بأسئلتكم ومقترحاتكم المتعلقة بالبرامج والعضويات والشراكات المؤسساتية.'
                      : 'Our team is ready to assist you regarding memberships, events, and partnership inquiries.'}
                  </p>
                </div>

                <div className="space-y-3 pt-2 text-xs">
                  <div className="p-3.5 rounded-xl bg-white border border-[#e5e0d6]">
                    <span className="block text-3xs font-bold text-[#819598] uppercase">البريد الإلكتروني الرسمي</span>
                    <a href="mailto:contact@amycc.org" className="font-bold text-[#0d3b43] hover:underline">
                      contact@amycc.org
                    </a>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border border-[#e5e0d6]">
                    <span className="block text-3xs font-bold text-[#819598] uppercase">المقر والمدينة</span>
                    <span className="font-bold text-[#08242a]">
                      {isAr ? 'مراكش، المملكة المغربية' : 'Marrakech, Morocco'}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/${locale}/contact`}
                  className="w-full py-3 px-4 rounded-xl font-bold text-center text-white bg-[#0d3b43] hover:bg-[#14505b] active:scale-95 transition-all text-xs block shadow-xs"
                >
                  {dict.nav.contact}
                </Link>
              </div>

            </div>
          </div>
        </section>

        {/* ============================================================
            11. PARTNERSHIPS & INSTITUTIONAL COLLABORATION
            ============================================================ */}
        <section className="py-20 lg:py-24 bg-[#faf7f2] border-b border-[#e5e0d6]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
                { title: isAr ? 'الرعاية والمسؤولية المجتمعية' : 'Private Sector Sponsorship', desc: isAr ? 'دعم ثقافي واجتماعي' : 'Cultural Sponsorship', icon: '🏢', iconImg: '/icons/sponsors.png' },
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
              className="inline-flex items-center px-7 py-3.5 rounded-xl font-bold text-xs text-white bg-[#0d3b43] hover:bg-[#14505b] active:scale-95 transition-all shadow-subtle gap-2 cursor-pointer"
            >
              <span>{dict.partners.apply_partnership}</span>
              <span aria-hidden="true">←</span>
            </Link>
          </div>
        </section>

        {/* ============================================================
            12. FINAL HIGH-IMPACT CALL TO ACTION
            ============================================================ */}
        <section className="py-20 lg:py-24 bg-gradient-to-br from-[#0d3b43] via-[#08242a] to-[#04161a] text-white relative overflow-hidden">
          <div className="absolute inset-0 moroccan-pattern opacity-10 pointer-events-none" aria-hidden="true" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
            <span className="inline-block px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#14505b] text-[#f4ce83] border border-[#268292]/40 shadow-xs">
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
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white bg-[#c85a32] hover:bg-[#b84e27] active:scale-95 transition-all shadow-card text-center text-sm cursor-pointer"
              >
                {dict.membership.apply}
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="w-full sm:w-auto px-6 py-4 rounded-xl font-bold text-white border border-[#268292] hover:bg-[#14505b] transition-all text-center text-sm cursor-pointer"
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

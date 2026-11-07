import type { Metadata } from 'next'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { constructMetadata, getSiteUrl } from '@/lib/seo/config'
import { METADATA_CATALOG } from '@/lib/seo/metadata-catalog'
import { getBreadcrumbJsonLd, JsonLd } from '@/lib/seo/schema'
import { locales, type Locale, defaultLocale } from '@/lib/i18n/config'
import Link from 'next/link'
import { Flaticon } from '@/components/ui/Flaticon'

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await props.params
  const validLocale = (locales.includes(locale as Locale) ? locale : defaultLocale) as Locale
  const meta = METADATA_CATALOG.about[validLocale]

  return constructMetadata({
    title: meta.title,
    description: meta.description,
    path: '/about',
    locale: validLocale,
    keywords: meta.keywords,
  })
}

export default async function AboutPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const dict = await getDictionary(locale)
  const isAr = locale === 'ar'
  const isFr = locale === 'fr'

  const siteUrl = getSiteUrl()
  const breadcrumbSchema = getBreadcrumbJsonLd([
    { name: isAr ? 'الرئيسية' : isFr ? 'Accueil' : 'Home', url: `${siteUrl}/${locale}` },
    { name: isAr ? 'من نحن' : isFr ? 'À Propos' : 'About Us', url: `${siteUrl}/${locale}/about` },
  ])

  // The 7 Official Core Values (قيمنا الجوهرية)
  const values = [
    {
      key: 'creativity',
      number: '01',
      title: isAr
        ? 'الإبداع والابتكار'
        : isFr
        ? 'Créativité & Innovation'
        : 'Creativity & Innovation',
      desc: isAr
        ? 'تشجيع التعبير الفني والابتكار وتنمية الخيال لدى الشباب، وإتاحة الفرص لهم لاكتشاف مواهبهم وتطوير قدراتهم الإبداعية.'
        : isFr
        ? "Encourager l'expression artistique, l'innovation et l'imagination des jeunes, en leur offrant des opportunités pour révéler leurs talents et développer leur potentiel créatif."
        : 'Fostering artistic expression, innovation, and imagination among youth, providing opportunities to discover talents and develop creative abilities.',
      icon: '🎨',
      badge: isAr
        ? 'تعبير فني أصيل'
        : isFr
        ? 'Expression artistique'
        : 'Artistic Expression',
      borderClass: 'border-[#bd3227]/30 hover:border-[#bd3227]',
      accentBg: 'bg-[#bd3227]/10 text-[#bd3227]',
      glowColor: 'from-[#fde8e7]/50 to-transparent',
    },
    {
      key: 'inclusivity',
      number: '02',
      title: isAr
        ? 'الشمولية والإنصاف'
        : isFr
        ? 'Inclusivité & Équité'
        : 'Inclusivity & Equity',
      desc: isAr
        ? 'توفير بيئة مفتوحة ومرحبة تتيح للجميع المشاركة والاستفادة من أنشطة الجمعية دون أي تمييز أو إقصاء.'
        : isFr
        ? 'Offrir un environnement ouvert et accueillant permettant à tous de participer et de bénéficier des activités sans discrimination.'
        : 'Providing an open, welcoming environment that enables everyone to participate and benefit from activities without discrimination.',
      icon: '🌐',
      badge: isAr
        ? 'فضاء متاح للجميع'
        : isFr
        ? 'Ouvert à tous'
        : 'Open to All',
      borderClass: 'border-[#231f20]/30 hover:border-[#231f20]',
      accentBg: 'bg-[#231f20]/10 text-[#231f20]',
      glowColor: 'from-[#FEF6CC]/50 to-transparent',
    },
    {
      key: 'solidarity',
      number: '03',
      title: isAr
        ? 'التضامن والتكافل'
        : isFr
        ? 'Solidarité & Entraide'
        : 'Solidarity & Mutual Aid',
      desc: isAr
        ? 'تعزيز التعاون والتكافل والعمل التطوعي، وتشجيع المبادرات الهادفة إلى خدمة المجتمع ومساندة الفئات المحتاجة.'
        : isFr
        ? "Renforcer l'entraide, le bénévolat et encourager les initiatives visant à servir la société et soutenir les populations vulnérables."
        : 'Promoting cooperation, mutual support, and civic volunteering, encouraging initiatives that serve the community and support those in need.',
      icon: '🤝',
      badge: isAr
        ? 'تطوع وأثر مجتمعي'
        : isFr
        ? 'Impact social'
        : 'Civic Impact',
      borderClass: 'border-[#d2a82b]/30 hover:border-[#d2a82b]',
      accentBg: 'bg-[#d2a82b]/10 text-[#d2a82b]',
      glowColor: 'from-[#FEF6CC]/50 to-transparent',
    },
    {
      key: 'education',
      number: '04',
      title: isAr
        ? 'التعليم والتطوير المستمر'
        : isFr
        ? 'Éducation & Développement'
        : 'Education & Growth',
      desc: isAr
        ? 'دعم التعلم المستمر واكتساب المهارات وتنمية القدرات الشخصية والفنية والثقافية للشباب على يد مدربين محترفين.'
        : isFr
        ? "Soutenir l'apprentissage continu, l'acquisition de compétences et le développement personnel, artistique et culturel des jeunes."
        : 'Supporting continuous learning, skill acquisition, and personal, artistic, and cultural development for young people.',
      icon: '📚',
      badge: isAr
        ? 'صقل وتأهيل الكفاءات'
        : isFr
        ? 'Formation continue'
        : 'Capacity Building',
      borderClass: 'border-[#d2a82b]/30 hover:border-[#d2a82b]',
      accentBg: 'bg-[#d2a82b]/10 text-[#d2a82b]',
      glowColor: 'from-[#FEF6CC]/50 to-transparent',
    },
    {
      key: 'respect_diversity',
      number: '05',
      title: isAr
        ? 'الاحترام والتنوع الثقافي'
        : isFr
        ? 'Respect & Diversité'
        : 'Respect & Diversity',
      desc: isAr
        ? 'تقدير الاختلافات الثقافية والفكرية، واحترام الهوية والتراث المغربي، وتشجيع الحوار والتبادل الثقافي والانفتاح على العالم.'
        : isFr
        ? "Valoriser les diversités culturelles et intellectuelles, respecter l'identité et le patrimoine marocains, et encourager le dialogue interculturel."
        : 'Appreciating cultural and intellectual differences, honoring Moroccan identity and heritage, and encouraging intercultural dialogue.',
      icon: '🕊️',
      badge: isAr
        ? 'حوار وانفتاح إنساني'
        : isFr
        ? 'Dialogue culturel'
        : 'Intercultural Dialogue',
      borderClass: 'border-[#bd3227]/30 hover:border-[#bd3227]',
      accentBg: 'bg-[#bd3227]/10 text-[#bd3227]',
      glowColor: 'from-[#fde8e7]/50 to-transparent',
    },
    {
      key: 'partnership',
      number: '06',
      title: isAr
        ? 'التعاون والشراكة المؤسساتية'
        : isFr
        ? 'Coopération & Partenariat'
        : 'Collaboration & Partnerships',
      desc: isAr
        ? 'بناء علاقات تعاون فعالة مع المؤسسات والجمعيات والفاعلين المحليين والوطنيين والدوليين، لتطوير المبادرات وتعزيز أثرها.'
        : isFr
        ? "Bâtir des partenariats constructifs avec les institutions, associations et acteurs locaux, nationaux et internationaux pour démultiplier l'impact culturel."
        : 'Building effective partnerships with civic institutions, associations, and local, national, and international stakeholders.',
      icon: '🏛️',
      badge: isAr
        ? 'جسور تعاون مستدامة'
        : isFr
        ? 'Alliances durables'
        : 'Strategic Alliances',
      borderClass: 'border-[#231f20]/30 hover:border-[#231f20]',
      accentBg: 'bg-[#231f20]/10 text-[#231f20]',
      glowColor: 'from-[#FEF6CC]/50 to-transparent',
    },
    {
      key: 'transparency',
      number: '07',
      title: isAr
        ? 'الشفافية والمسؤولية'
        : isFr
        ? 'Transparence & Responsabilité'
        : 'Transparency & Accountability',
      desc: isAr
        ? 'الالتزام بالنزاهة والوضوح في تدبير موارد الجمعية وتنفيذ أنشطتها، وتحمل كامل المسؤولية تجاه المنخرطين والشركاء والمجتمع.'
        : isFr
        ? "Respecter l'intégrité et la rigueur dans la gestion des ressources et la mise en œuvre des actions, avec une responsabilité totale envers les bénéficiaires."
        : 'Committing to integrity and openness in managing resources and executing programs, upholding accountability to beneficiaries, partners, and society.',
      icon: '⚖️',
      badge: isAr
        ? 'نزاهة ومسؤولية تامة'
        : isFr
        ? 'Intégrité & Rigueur'
        : 'Integrity & Accountability',
      borderClass: 'border-[#d2a82b]/30 hover:border-[#d2a82b]',
      accentBg: 'bg-[#d2a82b]/10 text-[#d2a82b]',
      glowColor: 'from-[#FEF6CC]/50 to-transparent',
    },
  ]

  // Strategic Objectives (الأهداف الاستراتيجية الستة)
  const objectives = isAr
    ? [
        {
          num: '01',
          icon: '🎨',
          title: 'رعاية الفنون والإبداع',
          desc: 'توفير فضاءات للتعبير الفني وصقل مهارات المواهب الصاعدة في الفنون التشكيلية، الموسيقى، والمسرح.',
          tag: 'صقل المواهب',
        },
        {
          num: '02',
          icon: '🚀',
          title: 'تمكين الشباب والمواطنة الفاعلة',
          desc: 'إشراك الشباب في الشأن الثقافي وتطوير قدراتهم القيادية والحياتية من خلال مبادرة "شباب في العمل".',
          tag: 'قيادة شبابية',
        },
        {
          num: '03',
          icon: '🏛️',
          title: 'تثمين وصون التراث المغربي',
          desc: 'حماية الذاكرة الجماعية والموروث الفني والموسيقي والشفهي الأصيل، والتعريف به وطنياً ودولياً.',
          tag: 'هوية وأصالة',
        },
        {
          num: '04',
          icon: '📍',
          title: 'العدالة المجالية في الولوج للثقافة',
          desc: 'توسيع دائرة الأنشطة والورشات لتشمل مختلف المدن والجهات والمناطق الحضرية والقروية دون تمييز.',
          tag: 'تكافؤ الفرص',
        },
        {
          num: '05',
          icon: '🤝',
          title: 'بناء الشراكات المؤسساتية',
          desc: 'التعاون المستدام مع المؤسسات التعليمية، المراكز الثقافية، دور الشباب، والهيئات الوطنية والدولية.',
          tag: 'تحالفات استراتيجية',
        },
        {
          num: '06',
          icon: '🌱',
          title: 'العمل التطوعي والتكافل المجتمعي',
          desc: 'ترسيخ ثقافة العمل التضامني واستثمار طاقات الشباب لخدمة الصالح العام وبناء التماسك الاجتماعي.',
          tag: 'تضامن مدني',
        },
      ]
    : isFr
    ? [
        {
          num: '01',
          icon: '🎨',
          title: 'Promotion des arts et de la créativité',
          desc: "Création d'espaces d'expression artistique et formation des jeunes talents en arts visuels, musique et théâtre.",
          tag: 'Talents émergents',
        },
        {
          num: '02',
          icon: '🚀',
          title: 'Autonomisation des jeunes & citoyenneté',
          desc: "Engagement civique et développement du leadership des jeunes à travers l'initiative Jeunesse en Action.",
          tag: 'Leadership civique',
        },
        {
          num: '03',
          icon: '🏛️',
          title: 'Valorisation du patrimoine marocain',
          desc: "Préservation et diffusion de la richesse culturelle, musicale et orale marocaine à l'échelle nationale et internationale.",
          tag: 'Patrimoine & Identité',
        },
        {
          num: '04',
          icon: '📍',
          title: "Démocratisation de l'accès culturel",
          desc: "Déploiement d'activités artistiques dans différentes villes et régions du Royaume en garantissant l'équité territoriale.",
          tag: 'Équité territoriale',
        },
        {
          num: '05',
          icon: '🤝',
          title: 'Partenariats institutionnels',
          desc: 'Collaboration durable avec les centres culturels, universités, écoles et acteurs de la société civile.',
          tag: 'Alliances durables',
        },
        {
          num: '06',
          icon: '🌱',
          title: 'Solidarité et cohésion sociale',
          desc: 'Ancrage de la culture du volontariat comme levier de cohésion sociale et de développement humain durable.',
          tag: 'Engagement civique',
        },
      ]
    : [
        {
          num: '01',
          icon: '🎨',
          title: 'Fostering Arts & Creativity',
          desc: 'Providing supportive creative spaces and masterclasses in visual arts, theatre, and musical expression.',
          tag: 'Talent Nurturing',
        },
        {
          num: '02',
          icon: '🚀',
          title: 'Youth Empowerment & Civic Action',
          desc: 'Engaging youth in cultural leadership through our flagship Youth in Action initiative.',
          tag: 'Youth Leadership',
        },
        {
          num: '03',
          icon: '🏛️',
          title: 'Celebrating Moroccan Heritage',
          desc: 'Safeguarding and promoting Moroccan tangible and intangible cultural traditions nationally and globally.',
          tag: 'Heritage & Identity',
        },
        {
          num: '04',
          icon: '📍',
          title: 'Inclusive Cultural Access',
          desc: 'Expanding workshops and events across multiple Moroccan cities, urban neighborhoods, and rural communities.',
          tag: 'Territorial Equity',
        },
        {
          num: '05',
          icon: '🤝',
          title: 'Institutional Partnerships',
          desc: 'Building sustainable bridges with cultural centers, educational institutions, and civic organizations.',
          tag: 'Strategic Alliances',
        },
        {
          num: '06',
          icon: '🌱',
          title: 'Community Solidarity',
          desc: 'Instilling a spirit of civic solidarity and empowering young people to serve their communities through arts.',
          tag: 'Civic Solidarity',
        },
      ]

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <Header locale={locale} dict={dict} />

      <main id="main-content" className="flex-1 bg-[#FAF8F5]">
        {/* ============================================================
            1. PAGE HERO HEADER WITH MOROCCAN GEOMETRIC ACCENTS
            ============================================================ */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#F5F3EE] via-[#FEF6CC] to-[#F5F3EE] border-b border-[#e5e0d6] pt-14 pb-16 lg:pt-20 lg:pb-24">
          <div className="absolute inset-0 moroccan-pattern-light opacity-60 pointer-events-none" aria-hidden="true" />

          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute top-1/4 start-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#bd3227]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 end-10 w-72 h-72 bg-[#231f20]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-[#5C5A55]">
              <Link href={`/${locale}`} className="hover:text-[#231f20] transition-colors">
                {isAr ? 'الرئيسية' : isFr ? 'Accueil' : 'Home'}
              </Link>
              <span>/</span>
              <span className="text-[#5C5A55]">{isAr ? 'عن الجمعية' : isFr ? 'Association' : 'About'}</span>
              <span>/</span>
              <span className="text-[#bd3227]">{isAr ? 'من نحن' : isFr ? 'Qui sommes-nous' : 'About Us'}</span>
            </nav>

            {/* Badges Bar */}
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#231f20]/10 border border-[#231f20]/20 text-[#231f20] text-xs font-bold shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#bd3227] animate-pulse" />
                <span>
                  {isAr
                    ? 'جمعية غير ربحية رسمية بالمغرب • تأسست 2026'
                    : isFr
                    ? 'Association officielle à but non lucratif au Maroc • Fondée en 2026'
                    : 'Official Non-Profit Association in Morocco • Est. 2026'}
                </span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#d2a82b]/10 border border-[#d2a82b]/20 text-[#d2a82b] text-xs font-bold shadow-2xs">
                <Flaticon name="pin" size={13} className="text-[#d2a82b]" />
                <span>
                  {isAr
                    ? 'الانطلاق: مراكش الحمراء 🇲🇦'
                    : isFr
                    ? 'Lancement : Marrakech la Rouge 🇲🇦'
                    : 'Origin: Marrakech, Morocco 🇲🇦'}
                </span>
              </span>
            </div>

            {/* Main Headline */}
            <div className="text-center max-w-4xl mx-auto space-y-4">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#231f20] tracking-tight leading-tight">
                {isAr ? (
                  <>
                    رعاية الإبداع، تمكين الشباب، <br />
                    <span className="text-[#bd3227]">وصون التراث الثقافي المغربي</span>
                  </>
                ) : isFr ? (
                  <>
                    Cultiver la Créativité, Émanciper la Jeunesse <br />
                    <span className="text-[#bd3227]">& Célébrer le Patrimoine Marocain</span>
                  </>
                ) : (
                  <>
                    Nurturing Creativity, Empowering Youth <br />
                    <span className="text-[#bd3227]">& Celebrating Moroccan Heritage</span>
                  </>
                )}
              </h1>

              <p className="text-sm sm:text-lg text-[#5C5A55] max-w-3xl mx-auto leading-relaxed font-medium">
                {isAr
                  ? 'جمعية روح الفنون والثقافة (AMYCC) منظمة مدنية مغربية غير ربحية، تأسست عام 2026، تعمل برؤية متجددة للنهوض بالمشهد الثقافي والفني وتأهيل الطاقات الشبابية عبر محترفات الإبداع والمبادرات الميدانية.'
                  : isFr
                  ? "L'Association Marocaine des Jeunes, Culture & Créativité (AMYCC) est une organisation citoyenne à but non lucratif fondée en 2026, dédiée à l'émancipation culturelle, à l'éclosion des talents et à la cohésion sociale à travers des ateliers d'art et des initiatives citoyennes."
                  : 'The Moroccan Association for Youth, Culture & Creativity (AMYCC) is an official non-profit organization founded in 2026, dedicated to advancing arts, cultural access, and civic empowerment across Morocco.'}
              </p>
            </div>

            {/* Interactive In-Page Navigation Pills */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <a
                href="#profile"
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white border border-[#cfc7b9] text-[#231f20] hover:border-[#bd3227] hover:text-[#bd3227] transition-colors shadow-2xs"
              >
                {isAr ? '🏷️ الهوية والنبذة' : isFr ? '🏷️ Identité & Statut' : '🏷️ Identity'}
              </a>
              <a
                href="#values"
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white border border-[#cfc7b9] text-[#231f20] hover:border-[#bd3227] hover:text-[#bd3227] transition-colors shadow-2xs"
              >
                {isAr ? '💎 قيمنا الجوهرية (7)' : isFr ? '💎 Valeurs Piliers (7)' : '💎 Core Values (7)'}
              </a>
              <a
                href="#mission"
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white border border-[#cfc7b9] text-[#231f20] hover:border-[#bd3227] hover:text-[#bd3227] transition-colors shadow-2xs"
              >
                {isAr ? '🎯 رسالتنا الميدانية' : isFr ? '🎯 Notre Mission' : '🎯 Our Mission'}
              </a>
              <a
                href="#vision"
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white border border-[#cfc7b9] text-[#231f20] hover:border-[#bd3227] hover:text-[#bd3227] transition-colors shadow-2xs"
              >
                {isAr ? '🔭 رؤيتنا المستقبلية' : isFr ? '🔭 Vision Stratégique' : '🔭 Our Vision'}
              </a>
              <a
                href="#roadmap"
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white border border-[#cfc7b9] text-[#231f20] hover:border-[#bd3227] hover:text-[#bd3227] transition-colors shadow-2xs"
              >
                {isAr ? '🗺️ خارطة التوسع' : isFr ? '🗺️ Feuille de Route' : '🗺️ Roadmap'}
              </a>
              <a
                href="#objectives"
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white border border-[#cfc7b9] text-[#231f20] hover:border-[#bd3227] hover:text-[#bd3227] transition-colors shadow-2xs"
              >
                {isAr ? '🎯 أهدافنا (6)' : isFr ? '🎯 Nos Objectifs (6)' : '🎯 Objectives (6)'}
              </a>
              <a
                href="#governance"
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white border border-[#cfc7b9] text-[#231f20] hover:border-[#bd3227] hover:text-[#bd3227] transition-colors shadow-2xs"
              >
                {isAr ? '🏛️ الهيكلة والتنظيم' : isFr ? '🏛️ Organisation' : '🏛️ Structure'}
              </a>
            </div>
          </div>
        </section>

        {/* ============================================================
            2. KEY METRICS & INSTITUTIONAL STRIP
            ============================================================ */}
        <section className="py-12 bg-white border-b border-[#e5e0d6]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {/* Card 1: 2026 */}
              <div className="p-5 sm:p-6 rounded-3xl bg-[#FAF8F5] border border-[#e5e0d6] hover:border-[#231f20]/30 transition-all text-center flex flex-col justify-between group shadow-2xs">
                <span className="text-xs font-bold text-[#5C5A55] block mb-1">
                  {isAr ? 'سنة التأسيس الرسمي' : isFr ? 'Année de Fondation' : 'Foundation Year'}
                </span>
                <div className="min-h-[3rem] flex items-center justify-center">
                  <span className="text-2xl sm:text-3xl font-black text-[#231f20] group-hover:scale-105 transition-transform block">
                    2026
                  </span>
                </div>
                <p className="text-xs text-[#5C5A55] leading-relaxed mt-2 text-balance">
                  {isAr
                    ? 'جمعية مدنية غير ربحية تأسست بالمغرب'
                    : isFr
                    ? 'Association citoyenne à but non lucratif au Maroc'
                    : 'Nonprofit cultural association founded in Morocco.'}
                </p>
              </div>

              {/* Card 2: Marrakech • Morocco */}
              <div className="p-5 sm:p-6 rounded-3xl bg-[#FAF8F5] border border-[#e5e0d6] hover:border-[#bd3227]/30 transition-all text-center flex flex-col justify-between group shadow-2xs">
                <span className="text-xs font-bold text-[#5C5A55] block mb-1">
                  {isAr ? 'نقطة الانطلاق والنطاق' : isFr ? 'Point de Départ & Rayonnement' : 'Origin & Reach'}
                </span>
                <div className="min-h-[3rem] flex items-center justify-center">
                  <span className="text-base sm:text-lg xl:text-xl font-black text-[#bd3227] group-hover:scale-105 transition-transform block text-center leading-tight text-balance">
                    {isAr ? 'مراكش • المغرب' : isFr ? 'Marrakech • Maroc' : 'Marrakech • Morocco'}
                  </span>
                </div>
                <p className="text-xs text-[#5C5A55] leading-relaxed mt-2 text-balance">
                  {isAr
                    ? 'من مراكش نحو مختلف جهات المملكة وشراكات دولية'
                    : isFr
                    ? 'De Marrakech vers les régions du Royaume et à l’international'
                    : 'From Marrakech across Morocco with global partnerships.'}
                </p>
              </div>

              {/* Card 3: 7 Core Values */}
              <div className="p-5 sm:p-6 rounded-3xl bg-[#FAF8F5] border border-[#e5e0d6] hover:border-[#d2a82b]/30 transition-all text-center flex flex-col justify-between group shadow-2xs">
                <span className="text-xs font-bold text-[#5C5A55] block mb-1">
                  {isAr ? 'المنظومة التوجيهية' : isFr ? 'Cadre d’Orientation' : 'Core Framework'}
                </span>
                <div className="min-h-[3rem] flex items-center justify-center">
                  <span className="text-base sm:text-lg xl:text-xl font-black text-[#d2a82b] group-hover:scale-105 transition-transform block text-center leading-tight">
                    {isAr ? '7 قيم موجهة' : isFr ? '7 Valeurs' : '7 Values'}
                  </span>
                </div>
                <p className="text-xs text-[#5C5A55] leading-relaxed mt-2 text-balance">
                  {isAr
                    ? 'الإبداع، الشمولية، التضامن، والشفافية'
                    : isFr
                    ? 'Créativité, inclusion, solidarité et transparence'
                    : 'Creativity, Inclusivity, Solidarity & Transparency.'}
                </p>
              </div>

              {/* Card 4: Youth in Action */}
              <div className="p-5 sm:p-6 rounded-3xl bg-[#FAF8F5] border border-[#e5e0d6] hover:border-[#231f20]/30 transition-all text-center flex flex-col justify-between group shadow-2xs">
                <span className="text-xs font-bold text-[#5C5A55] block mb-1">
                  {isAr ? 'البرنامج الرائد والمبادرة' : isFr ? 'Programme Phare' : 'Flagship Initiative'}
                </span>
                <div className="min-h-[3rem] flex items-center justify-center">
                  <span className="text-base sm:text-lg xl:text-xl font-black text-[#231f20] group-hover:scale-105 transition-transform block text-center leading-tight">
                    {isAr ? 'شباب في العمل' : isFr ? 'Jeunesse en Action' : 'Youth in Action'}
                  </span>
                </div>
                <p className="text-xs text-[#5C5A55] leading-relaxed mt-2 text-balance">
                  {isAr
                    ? 'التمكين القيادي والتطوع الميداني للشباب'
                    : isFr
                    ? 'Leadership civique et volontariat culturel des jeunes'
                    : 'Civic volunteering & cultural leadership framework.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            3. INSTITUTIONAL PROFILE & IDENTITY (نبذة تعريفية وهوية مؤسساتية)
            ============================================================ */}
        <section id="profile" className="py-20 bg-[#FAF8F5] border-b border-[#e5e0d6] scroll-mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-4xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#231f20] px-3.5 py-1.5 rounded-full bg-[#231f20]/10 border border-[#231f20]/20">
                {isAr ? 'النبذة والهوية المؤسساتية' : isFr ? 'Profil & Statut Institutionnel' : 'Institutional Profile & Charter'}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#231f20] leading-snug text-balance">
                {isAr
                  ? 'من نحن؟ — جمعية روح الفنون والثقافة المغربية'
                  : isFr
                  ? 'Qui Sommes-Nous ? — L’Identité AMYCC'
                  : 'Who We Are — The AMYCC Identity'}
              </h2>
              <p className="text-sm sm:text-base text-[#5C5A55] leading-relaxed max-w-3xl mx-auto text-balance">
                {isAr
                  ? 'منظمة مدنية مستقلة تأسست بروح وطنية مسؤولة للنهوض بالعمل الثقافي والاجتماعي وتأهيل الشباب ليكونوا قادة التغيير الإيجابي.'
                  : isFr
                  ? 'Organisation citoyenne indépendante œuvrant avec engagement pour le rayonnement culturel et l’autonomisation des jeunes au Maroc.'
                  : 'An independent civic organization founded with deep Moroccan cultural roots to elevate artistic expression and empower youth.'}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Left Column: Comprehensive Story & Legal Definition */}
              <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-[#e5e0d6] shadow-subtle space-y-6 flex flex-col justify-between">
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <span className="w-12 h-12 rounded-2xl bg-[#231f20] text-white flex items-center justify-center shadow-xs">
                      <Flaticon name="museum" size={24} className="text-[#ffd22f]" />
                    </span>
                    <div>
                      <h3 className="text-xl font-black text-[#231f20]">
                        {isAr ? 'الإطار القانوني والتنظيمي' : isFr ? 'Cadre Légal & Réglementaire' : 'Legal & Non-Profit Foundation'}
                      </h3>
                      <span className="text-xs text-[#5C5A55] font-bold">
                        {isAr
                          ? 'منظمة جمعوية خاضعة للظهير الشريف بالمملكة المغربية'
                          : isFr
                          ? 'Association régie par le Dahir royal au Royaume du Maroc'
                          : 'Duly registered Moroccan non-profit organization'}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-[#5C5A55] leading-relaxed">
                    {isAr
                      ? 'تأسست جمعية روح الفنون والثقافة (AMYCC) عام 2026 بمدينة مراكش كجمعية مدنية غير ربحية مستقلة، وفقًا لمقتضيات الظهير الشريف رقم 1.58.376 المنظم لحق تأسيس الجمعيات بالمملكة المغربية، والأنظمة الأساسية المعمول بها وطنيًا.'
                      : isFr
                      ? "L’Association Marocaine des Jeunes, Culture & Créativité (AMYCC) a été constituée en 2026 à Marrakech en tant qu'organisation citoyenne à but non lucratif, conformément au Dahir n° 1-58-376 régissant le droit d'association au Royaume du Maroc."
                      : 'The Spirit of Arts & Culture Association (AMYCC) was officially founded in 2026 in Marrakech as an independent non-profit association, governed by Dahir No. 1.58.376 regulating civic associations in the Kingdom of Morocco.'}
                  </p>

                  <p className="text-sm text-[#5C5A55] leading-relaxed">
                    {isAr
                      ? 'تسعى الجمعية إلى خلق دينامية ثقافية مستدامة تجمع بين حماية التراث المغربي المتنوع بروافده (العربية، الأمازيغية، الحسانية، والأندلسية)، وبين مواكبة التيارات الفنية المعاصرة وتمكين الشباب في مهن الفنون والإبداع والتواصل الرقمي.'
                      : isFr
                      ? "L’association impulse une dynamique culturelle durable unissant la valorisation du patrimoine marocain pluraliste (arabe, amazigh, hassani et andalou) à l’initiation aux arts contemporains et au numérique."
                      : 'The association strives to generate sustainable cultural dynamics uniting Moroccan heritage preservation with contemporary creative masterclasses, civic volunteering, and professional development.'}
                  </p>
                </div>

                <div className="pt-6 border-t border-[#E5E0D6] flex flex-wrap items-center justify-between gap-3 text-xs text-[#5C5A55]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-bold text-[#231f20]">
                      {isAr ? 'الحالة: نشطة ورسمية' : isFr ? 'Statut : Active & Enregistrée' : 'Status: Active & Registered'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flaticon name="scroll" size={14} className="text-[#d2a82b]" />
                    <span>
                      {isAr ? 'النظام الأساسي والداخلي مصادق عليه' : isFr ? 'Statuts & Règlement Approuvés' : 'Official Bylaws Approved'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: 3 Strategic Hallmarks */}
              <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
                <div className="p-6 rounded-3xl bg-white border border-[#e5e0d6] shadow-2xs hover:border-[#bd3227]/40 transition-all space-y-2">
                  <div className="flex items-center gap-2.5">
                    <Flaticon name="pin" size={20} className="text-[#bd3227]" />
                    <h4 className="text-base font-black text-[#231f20]">
                      {isAr ? 'مراكش — منطلق استراتيجي' : isFr ? 'Marrakech — Tremplin Stratégique' : 'Marrakech — The Launchpad'}
                    </h4>
                  </div>
                  <p className="text-xs text-[#5C5A55] leading-relaxed">
                    {isAr
                      ? 'تم اختيار مراكش كنواة انطلاق لعمقها التاريخي والثقافي ومكانتها كعاصمة عالمية للفنون، لتمتد المبادرات تدريجيًا نحو كافة جهات المملكة.'
                      : isFr
                      ? 'Marrakech a été choisie pour son rayonnement historique et artistique mondial, servant de berceau pour un déploiement national.'
                      : 'Chosen for its deep historical depth and position as a cultural capital, serving as the springboard to nationwide reach.'}
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-[#e5e0d6] shadow-2xs hover:border-[#231f20]/40 transition-all space-y-2">
                  <div className="flex items-center gap-2.5">
                    <Flaticon name="handshake" size={20} className="text-[#231f20]" />
                    <h4 className="text-base font-black text-[#231f20]">
                      {isAr ? 'العمل التشاركي والمؤسساتي' : isFr ? 'Écosystème Collaboratif' : 'Collaborative Ecosystem'}
                    </h4>
                  </div>
                  <p className="text-xs text-[#5C5A55] leading-relaxed">
                    {isAr
                      ? 'نعمل بالشراكة الوثيقة مع دور الشباب، المراكز الثقافية، المؤسسات التعليمية، والجامعات لضمان إتاحة الورشات للجميع دون حواجز.'
                      : isFr
                      ? 'Nous collaborons étroitement avec les maisons de jeunes, centres culturels et universités pour assurer l’accès gratuit et inclusif aux arts.'
                      : 'Partnering actively with youth centers, cultural institutions, and schools to ensure open, cost-free arts accessibility.'}
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-[#e5e0d6] shadow-2xs hover:border-[#d2a82b]/40 transition-all space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">⚖️</span>
                    <h4 className="text-base font-black text-[#231f20]">
                      {isAr ? 'النزاهة والشفافية التامة' : isFr ? 'Intégrité & Transparence' : 'Integrity & Transparency'}
                    </h4>
                  </div>
                  <p className="text-xs text-[#5C5A55] leading-relaxed">
                    {isAr
                      ? 'التزام مطلق بالنزاهة والمسؤولية، التدبير المالي والإداري المدقق، ونشر التقارير الأدبية والمالية للمنخرطين والشركاء.'
                      : isFr
                      ? 'Engagement rigoureux envers la transparence administrative et financière, avec publication annuelle des bilans moraux et financiers.'
                      : 'Uncompromising commitment to integrity, transparent resource management, and annual public reporting.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            4. أولاً: قيمنا الجوهرية (OUR 7 CORE VALUES)
            ============================================================ */}
        <section id="values" className="py-20 bg-white border-b border-[#e5e0d6] scroll-mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#bd3227] px-3.5 py-1.5 rounded-full bg-[#bd3227]/10 border border-[#bd3227]/20">
                {isAr ? 'أولاً: قيمنا الجوهرية' : isFr ? 'I. Nos Valeurs Piliers' : 'I. Our Core Values'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#231f20]">
                {isAr
                  ? 'المنظومة الأخلاقية والمبادئ الموجهة لأنشطتنا'
                  : isFr
                  ? 'Charte Éthique & Principes Directeurs'
                  : 'Core Values Guiding Our Cultural Work'}
              </h2>
              <p className="text-sm sm:text-base text-[#5C5A55] leading-relaxed">
                {isAr
                  ? 'تستند جمعية روح الفنون والثقافة (AMYCC) في كافة تدخلاتها الميدانية إلى سبع قيم أساسية تشكل البوصلة الأخلاقية والمهنية لعملنا:'
                  : isFr
                  ? 'L’Association AMYCC fonde l’ensemble de ses interventions citoyennes sur sept valeurs fondamentales qui constituent notre boussole morale et professionnelle :'
                  : 'The Spirit of Arts & Culture Association (AMYCC) is guided by seven fundamental values shaping all its programs:'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((v, idx) => (
                <div
                  key={v.key}
                  className={`p-7 rounded-3xl bg-[#FAF8F5] border transition-all duration-300 flex flex-col justify-between group shadow-subtle hover:shadow-card hover:-translate-y-1 relative overflow-hidden ${
                    v.borderClass
                  } ${idx === 6 ? 'md:col-span-2 lg:col-span-3' : ''}`}
                >
                  <div className={`absolute top-0 end-0 w-32 h-32 bg-gradient-to-bl ${v.glowColor} rounded-bl-full pointer-events-none`} />

                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="w-12 h-12 rounded-2xl bg-white border border-[#e5e0d6] flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
                        <Flaticon icon={v.icon} size={24} className="text-[#bd3227]" />
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${v.accentBg}`}>
                          {v.badge}
                        </span>
                        <span className="text-xs font-black text-[#5C5A55] font-mono">
                          #{v.number}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-[#231f20] mb-2 leading-snug">
                        {v.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#5C5A55] leading-relaxed">
                        {v.desc}
                      </p>
                    </div>
                  </div>

                  <div className="relative z-10 pt-4 mt-4 border-t border-[#e5e0d6] flex items-center justify-between text-xs font-bold text-[#5C5A55]">
                    <span>
                      {isAr
                        ? 'ركيزة أخلاقية لـ AMYCC'
                        : isFr
                        ? 'Pilier éthique AMYCC'
                        : 'AMYCC Ethical Pillar'}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#bd3227]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            5. ثانياً: رسالتنا (OUR MISSION)
            ============================================================ */}
        <section id="mission" className="py-20 bg-[#FAF8F5] border-b border-[#e5e0d6] scroll-mt-16 relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#231f20] px-3.5 py-1.5 rounded-full bg-[#231f20]/10 border border-[#231f20]/20">
                {isAr ? 'ثانياً: رسالتنا' : isFr ? 'II. Notre Mission' : 'II. Our Mission'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#231f20]">
                {isAr ? 'رسالة جمعية روح الفنون والثقافة' : isFr ? 'Mission Institutionnelle AMYCC' : 'AMYCC Institutional Mission'}
              </h2>
              <p className="text-sm sm:text-base text-[#5C5A55] leading-relaxed">
                {isAr
                  ? 'رؤية عملية تستثمر في طاقات الشباب الفنية وتجعل من الثقافة محركاً للتنمية الإنسانية والتماسك الاجتماعي.'
                  : isFr
                  ? 'Une vision d’action qui investit dans l’énergie créative des jeunes pour faire de la culture un levier d’émancipation humaine et de cohésion sociale.'
                  : 'Actionable mission empowering youth through arts, cultivating civic belonging, and revitalizing community life.'}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Pillar Quote Container */}
              <div className="lg:col-span-5 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#231f20] via-[#231f20] to-[#181516] text-white flex flex-col justify-between shadow-card relative overflow-hidden">
                <div className="absolute top-0 end-0 w-64 h-64 bg-[#bd3227]/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 start-0 w-48 h-48 bg-[#d2a82b]/10 rounded-full blur-2xl pointer-events-none" />

                <div className="space-y-5 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-[#bd3227] text-white flex items-center justify-center font-bold text-2xl shadow-xs">
                    ✦
                  </div>

                  <span className="text-xs font-bold uppercase tracking-wider text-[#ffd22f] block">
                    {isAr ? 'المبدأ الجوهري المؤسس' : isFr ? 'Postulat Fondateur' : 'Founding Premise'}
                  </span>

                  <h3 className="text-xl sm:text-2xl font-black leading-snug text-white">
                    {isAr
                      ? 'لكل شاب موهبة وقدرات إبداعية تستحق الاكتشاف والرعاية والتطوير'
                      : isFr
                      ? 'Chaque jeune possède un potentiel créatif unique qui mérite d’être révélé et valorisé'
                      : 'Every young person has talent deserving discovery, care, and development'}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#E2DED6] leading-relaxed">
                    {isAr
                      ? 'يشكل الفن والثقافة وسيلة أساسية للتعبير عن الذات وتنمية المهارات وتعزيز التواصل الإيجابي بين أفراد المجتمع، وصقل الحس النقدي والجمالي.'
                      : isFr
                      ? 'L’art et la culture sont des passerelles majeures d’expression de soi, d’acquisition de compétences et de renforcement du lien social.'
                      : 'Art and culture are vital vehicles for self-expression, skill acquisition, and community cohesion.'}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#d2a82b] text-xs font-bold text-[#ffd22f] flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2">
                    <span>📍</span>
                    <span>
                      {isAr
                        ? 'انطلاقاً من مراكش نحو مختلف جهات المملكة'
                        : isFr
                        ? 'De Marrakech vers l’ensemble des régions marocaines'
                        : 'From Marrakech to all Moroccan Regions'}
                    </span>
                  </div>
                  <span className="font-mono font-bold">AMYCC 2026</span>
                </div>
              </div>

              {/* Narrative Content with 3 Action Pillars */}
              <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
                <div className="p-7 rounded-3xl bg-white border border-[#e5e0d6] shadow-subtle space-y-2.5 hover:border-[#231f20]/30 transition-all">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-[#231f20]/10 text-[#231f20] flex items-center justify-center font-black text-xs">
                      01
                    </span>
                    <h4 className="text-base font-black text-[#231f20]">
                      {isAr
                        ? 'المبدأ الأساسي والإيمان بقدرات الشباب'
                        : isFr
                        ? 'Confiance Fondamentale dans la Jeunesse'
                        : 'Foundational Belief in Youth Potential'}
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-[#5C5A55] leading-relaxed">
                    {isAr
                      ? 'تؤمن جمعية روح الفنون والثقافة (AMYCC) بأن لكل شاب موهبة وقدرات إبداعية تستحق الاكتشاف والرعاية والتطوير، وأن الفن والثقافة يشكلان وسيلة أساسية للتعبير عن الذات وتنمية المهارات وتعزيز التواصل بين أفراد المجتمع.'
                      : isFr
                      ? 'L’AMYCC a la certitude que chaque jeune recèle une créativité prometteuse. La culture constitue un vecteur indispensable d’épanouissement personnel et d’empathie collective.'
                      : 'AMYCC believes every young person holds creative capacity worthy of discovery and growth, establishing culture as a driver for positive human development.'}
                  </p>
                </div>

                <div className="p-7 rounded-3xl bg-white border border-[#e5e0d6] shadow-subtle space-y-2.5 hover:border-[#bd3227]/30 transition-all">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-[#bd3227]/10 text-[#bd3227] flex items-center justify-center font-black text-xs">
                      02
                    </span>
                    <h4 className="text-base font-black text-[#231f20]">
                      {isAr
                        ? 'مسارات العمل الميداني والتأهيل'
                        : isFr
                        ? 'Parcours d’Apprentissage & Ateliers de Terrain'
                        : 'Field Operations & Capacity Building'}
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-[#5C5A55] leading-relaxed">
                    {isAr
                      ? 'ومن هذا المنطلق، تعمل الجمعية على توفير فرص للشباب لاكتشاف مواهبهم وصقل قدراتهم في مختلف المجالات الفنية والثقافية، من خلال التكوين والورشات الإبداعية والأنشطة التربوية والمبادرات التطوعية والاجتماعية، بما يعزز ثقتهم بأنفسهم ويشجعهم على المشاركة الفعالة في خدمة المجتمع.'
                      : isFr
                      ? 'L’association déploie des ateliers de formation artistique, des programmes socio-éducatifs et des actions citoyennes renforçant la confiance en soi et l’engagement civique des jeunes.'
                      : 'The association creates high-quality workshops, educational programs, and volunteer avenues equipping youth with both technical artistic mastery and essential life skills.'}
                  </p>
                </div>

                <div className="p-7 rounded-3xl bg-white border border-[#e5e0d6] shadow-subtle space-y-2.5 hover:border-[#d2a82b]/30 transition-all">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-[#d2a82b]/10 text-[#d2a82b] flex items-center justify-center font-black text-xs">
                      03
                    </span>
                    <h4 className="text-base font-black text-[#231f20]">
                      {isAr
                        ? 'الانطلاق المستدام والتعاون والشراكات'
                        : isFr
                        ? 'Action Durable & Partenariats Stratégiques'
                        : 'Sustainable Launch & Strategic Partnerships'}
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-[#5C5A55] leading-relaxed">
                    {isAr
                      ? 'وانطلاقًا من مدينة مراكش، تسعى الجمعية إلى تطوير مبادرات مستدامة تستجيب لاحتياجات الشباب، وصون التراث الثقافي المغربي والتعريف به، وتشجيع التبادل الثقافي والانفتاح على التجارب المختلفة، إلى جانب بناء شراكات فعالة على المستويين الوطني والدولي، إيمانًا منها بأن الاستثمار في قدرات الشباب يساهم في بناء مجتمع أكثر إبداعًا وتنوعًا وتضامنًا.'
                      : isFr
                      ? 'Depuis Marrakech, l’AMYCC construit des projets durables répondant aux aspirations des jeunes, valorisant le patrimoine national et forgeant des partenariats au Maroc comme à l’international.'
                      : 'Originating from Marrakech, AMYCC develops long-term initiatives, promotes intercultural dialogue, and crafts partnerships across Morocco and internationally.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            6. ثالثاً: رؤيتنا (OUR VISION & EXPANSION ROADMAP)
            ============================================================ */}
        <section id="vision" className="py-20 bg-white border-b border-[#e5e0d6] scroll-mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#d2a82b] px-3.5 py-1.5 rounded-full bg-[#d2a82b]/10 border border-[#d2a82b]/20">
                {isAr ? 'ثالثاً: رؤيتنا' : isFr ? 'III. Notre Vision' : 'III. Our Vision'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#231f20]">
                {isAr
                  ? 'الرؤية المستقبلية لجمعية روح الفنون والثقافة'
                  : isFr
                  ? 'Vision Stratégique de l’AMYCC'
                  : 'Long-Term Strategic Vision'}
              </h2>
              <p className="text-sm sm:text-base text-[#5C5A55] leading-relaxed">
                {isAr
                  ? 'طموح مؤسساتي يرتكز على بناء شبكة وطنية رائدة تمتد نحو آفاق دولية مع صون الأصالة المغربية.'
                  : isFr
                  ? 'Une ambition institutionnelle fondée sur un réseau national fédérateur, ouvert sur le monde et ancré dans les traditions marocaines.'
                  : 'An institutional ambition grounded in territorial equity, international bridges, and authentic roots.'}
              </p>
            </div>

            {/* 3 Full Vision Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="p-8 rounded-3xl bg-[#FAF8F5] border-2 border-[#231f20]/30 shadow-subtle hover:shadow-card hover:-translate-y-1 transition-all flex flex-col justify-between space-y-5">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="w-12 h-12 rounded-2xl bg-[#231f20] text-white flex items-center justify-center font-black text-xl shadow-xs">
                      01
                    </span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#231f20]/10 text-[#231f20]">
                      {isAr ? 'تدرج جغرافي' : isFr ? 'Réseau Évolutif' : 'Staged Network'}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-[#231f20]">
                    {isAr ? 'الريادة والشبكة المتكاملة' : isFr ? 'Leadership & Réseau Intégré' : 'Leadership & Integrated Network'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C5A55] leading-relaxed">
                    {isAr
                      ? 'تطمح جمعية روح الفنون والثقافة (AMYCC) إلى أن تصبح جمعية رائدة في مجال الفنون والثقافة وتمكين الشباب، من خلال بناء شبكة متكاملة من الفروع والمبادرات تنطلق من المستوى الإقليمي، وتمتد إلى مختلف جهات المملكة المغربية، وصولًا إلى المستوى الوطني، ثم التوسع نحو بلدان أخرى عبر إحداث فروع وشراكات دولية.'
                      : isFr
                      ? 'L’AMYCC ambitionne de devenir une référence dans l’émancipation culturelle en tissant un réseau de sections et de projets débutant à l’échelle provinciale, s’élargissant aux régions, puis au niveau national et international.'
                      : 'AMYCC envisions becoming a leading cultural organization by constructing an integrated network of chapters starting provincially, expanding across all Moroccan regions, and scaling globally.'}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#e5e0d6] text-xs font-bold text-[#231f20]">
                  {isAr ? '✓ تدرج هيكلي منظم' : isFr ? '✓ Croissance structurée' : '✓ Structured Growth'}
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-[#FAF8F5] border-2 border-[#bd3227]/30 shadow-subtle hover:shadow-card hover:-translate-y-1 transition-all flex flex-col justify-between space-y-5">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="w-12 h-12 rounded-2xl bg-[#bd3227] text-white flex items-center justify-center font-black text-xl shadow-xs">
                      02
                    </span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#bd3227]/10 text-[#bd3227]">
                      {isAr ? 'تكافؤ الفرص' : isFr ? 'Équité Territoriale' : 'Territorial Equity'}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-[#231f20]">
                    {isAr ? 'ترسيخ الحضور وتكافؤ الفرص' : isFr ? 'Ancrage Local & Égalité d’Accès' : 'Equitable Cultural Access'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C5A55] leading-relaxed">
                    {isAr
                      ? 'ونسعى إلى ترسيخ حضور الجمعية في مختلف المناطق، وتوفير فرص متكافئة للشباب لاكتشاف مواهبهم وتطوير قدراتهم والمشاركة في الحياة الثقافية والاجتماعية، مع تعزيز التعاون وتبادل الخبرات بين الفروع داخل المغرب وخارجه.'
                      : isFr
                      ? 'Nous œuvrons pour un ancrage fort dans divers territoires, garantissant un accès juste aux opportunités créatives et favorisant l’échange d’expériences entre antennes.'
                      : 'We strive to establish an enduring footprint across diverse territories, ensuring fair access for young people to discover skills and participate in cultural enrichment.'}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#e5e0d6] text-xs font-bold text-[#bd3227]">
                  {isAr ? '✓ عدالة مجالية ثقافية' : isFr ? '✓ Justice territoriale' : '✓ Territorial Justice'}
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-[#FAF8F5] border-2 border-[#d2a82b]/30 shadow-subtle hover:shadow-card hover:-translate-y-1 transition-all flex flex-col justify-between space-y-5">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="w-12 h-12 rounded-2xl bg-[#d2a82b] text-white flex items-center justify-center font-black text-xl shadow-xs">
                      03
                    </span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#d2a82b]/10 text-[#d2a82b]">
                      {isAr ? 'أفق عالمي' : isFr ? 'Horizon Mondial' : 'Global Reach'}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-[#231f20]">
                    {isAr ? 'الاستدامة والامتداد الدولي' : isFr ? 'Pérennité & Rayonnement Mondial' : 'Global Bridges & Human Development'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C5A55] leading-relaxed">
                    {isAr
                      ? 'ونطمح إلى بناء منظمة مستدامة ذات امتداد دولي، تجمع الشباب حول قيم الإبداع والتنوع والتضامن، وتجعل من الفن والثقافة وسيلتين للتنمية الإنسانية والتقارب بين الشعوب، مع الحفاظ على الهوية والتراث المغربي والانفتاح على الثقافات العالمية.'
                      : isFr
                      ? 'Nous voulons bâtir une organisation pérenne d’envergure internationale, unissant les jeunesses autour de la créativité et de la solidarité, passerelle entre les peuples et valorisation de l’identité marocaine.'
                      : 'We aspire to cultivate an internationally reaching organization uniting youth around creativity, using arts as bridges for intercultural dialogue and friendship.'}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#e5e0d6] text-xs font-bold text-[#d2a82b]">
                  {isAr ? '✓ هوية أصيلة وانفتاح عالمي' : isFr ? '✓ Identité et ouverture' : '✓ Authentic Roots, Global Reach'}
                </div>
              </div>
            </div>

            {/* Strategic Staging Roadmap Bar (خارطة التدرج الاستراتيجي) */}
            <div id="roadmap" className="p-8 sm:p-10 rounded-3xl bg-[#231f20] text-white space-y-8 scroll-mt-20 relative overflow-hidden">
              <div className="absolute top-0 end-0 w-80 h-80 bg-[#bd3227]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="text-center max-w-2xl mx-auto space-y-2 relative z-10">
                <span className="text-xs font-bold uppercase tracking-wider text-[#ffd22f] px-3.5 py-1.5 rounded-full bg-[#ffd22f]/10 border border-[#ffd22f]/20">
                  {isAr ? 'خارطة التوسع والتدرج الجغرافي' : isFr ? 'Déploiement Territorial Échelonné' : 'Strategic Network Phasing'}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  {isAr ? 'المسار المرحلي لنمو جمعية AMYCC' : isFr ? 'Feuille de Route Stratégique AMYCC' : 'Phased Expansion Roadmap'}
                </h3>
                <p className="text-xs sm:text-sm text-[#E2DED6] leading-relaxed">
                  {isAr
                    ? 'خطة مرحلية مدروسة تضمن التوسع المتوازن وتعميق الأثر الثقافي خطوة بخطوة'
                    : isFr
                    ? 'Un plan méthodique en 4 étapes assurant un enracinement solide et un impact culturel pérenne'
                    : 'A systematic 4-phase rollout ensuring balanced community grounding and durable scaling.'}
                </p>
              </div>

              {/* 4 Connected Phases Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 relative z-10">
                <div className="p-5 rounded-2xl bg-[#231f20] border border-[#d2a82b] space-y-3 relative group hover:border-[#ffd22f]/60 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#ffd22f] text-[#231f20]">
                      {isAr ? 'المرحلة 01' : isFr ? 'Phase 01' : 'Phase 01'}
                    </span>
                    <span className="text-xs">📍</span>
                  </div>
                  <h4 className="font-black text-base text-white">
                    {isAr ? 'المستوى الإقليمي' : isFr ? 'Échelle Provinciale' : 'Provincial Launch'}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#E2DED6] leading-relaxed">
                    {isAr
                      ? 'ترسيخ الحضور والانطلاق من مدينة مراكش ونواحيها عبر محترفات نموذجية وشراكات محلية.'
                      : isFr
                      ? 'Ancrage initial à Marrakech et ses environs à travers des ateliers pilotes et des partenariats locaux.'
                      : 'Marrakech foundation, launching flagship model workshops and building municipal alliances.'}
                  </p>
                  <div className="pt-2 text-xs font-bold text-[#ffd22f]">
                    {isAr ? '● جاري التفعيل' : isFr ? '● En cours de réalisation' : '● In Progress'}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#231f20] border border-[#d2a82b] space-y-3 relative group hover:border-[#ffd22f]/60 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#ffd22f] text-[#231f20]">
                      {isAr ? 'المرحلة 02' : isFr ? 'Phase 02' : 'Phase 02'}
                    </span>
                    <span className="text-xs">🏛️</span>
                  </div>
                  <h4 className="font-black text-base text-white">
                    {isAr ? 'جهات المملكة' : isFr ? 'Régions du Maroc' : 'Regional Reach'}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#E2DED6] leading-relaxed">
                    {isAr
                      ? 'الامتداد نحو مختلف جهات المغرب بالشراكة مع المراكز الثقافية ودور الشباب والفضاءات الجمعوية.'
                      : isFr
                      ? 'Extension vers plusieurs régions du Royaume en partenariat avec les centres culturels et maisons de jeunes.'
                      : 'Expanding across Moroccan regions through institutional pacts with cultural hubs.'}
                  </p>
                  <div className="pt-2 text-xs font-bold text-[#ffd22f]">
                    {isAr ? '○ أفق التوسع' : isFr ? '○ Étape programmée' : '○ Target Milestone'}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#231f20] border border-[#d2a82b] space-y-3 relative group hover:border-[#ffd22f]/60 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#d2a82b] text-[#231f20]">
                      {isAr ? 'المرحلة 03' : isFr ? 'Phase 03' : 'Phase 03'}
                    </span>
                    <span className="text-xs">🇲🇦</span>
                  </div>
                  <h4 className="font-black text-base text-white">
                    {isAr ? 'المستوى الوطني' : isFr ? 'Échelle Nationale' : 'National Scale'}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#E2DED6] leading-relaxed">
                    {isAr
                      ? 'بناء شبكة وطنية موحدة للفروع، وتنسيق مهرجانات وملتقيات كبرى تجمع مبدعي الوطن.'
                      : isFr
                      ? 'Création d’un réseau national structuré, organisation de grands festivals et rencontres de jeunes créateurs.'
                      : 'Unified national chapter framework, large-scale annual showcases, and nation-wide civic volunteer network.'}
                  </p>
                  <div className="pt-2 text-xs font-bold text-[#d2a82b]">
                    {isAr ? '○ الهدف الوطني' : isFr ? '○ Objectif national' : '○ Strategic Goal'}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#231f20] border border-[#d2a82b] space-y-3 relative group hover:border-[#ffd22f]/60 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#bd3227] text-white">
                      {isAr ? 'المرحلة 04' : isFr ? 'Phase 04' : 'Phase 04'}
                    </span>
                    <span className="text-xs">🌍</span>
                  </div>
                  <h4 className="font-black text-base text-white">
                    {isAr ? 'الامتداد الدولي' : isFr ? 'Rayonnement International' : 'Global Reach'}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#E2DED6] leading-relaxed">
                    {isAr
                      ? 'إحداث فروع بالخارج، وإبرام شراكات دولية للتبادل الثقافي ومشاركة الشباب بالمهرجانات العالمية.'
                      : isFr
                      ? 'Création d’antennes à l’étranger, échanges culturels avec la diaspora et participation aux festivals mondiaux.'
                      : 'International chapters, diaspora engagement, and cross-cultural exchanges celebrating Moroccan culture.'}
                  </p>
                  <div className="pt-2 text-xs font-bold text-[#bd3227]">
                    {isAr ? '○ الأفق العالمي' : isFr ? '○ Horizon mondial' : '○ Global Horizon'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            7. STRATEGIC OBJECTIVES (الأهداف الاستراتيجية الستة)
            ============================================================ */}
        <section id="objectives" className="py-20 bg-[#FAF8F5] border-b border-[#e5e0d6] scroll-mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#231f20] px-3.5 py-1.5 rounded-full bg-[#231f20]/10 border border-[#231f20]/20">
                {isAr ? 'أهدافنا الاستراتيجية' : isFr ? 'Nos Objectifs Stratégiques' : 'Strategic Objectives'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#231f20]">
                {isAr ? 'الأهداف المؤسسية لجمعية روح الفنون والثقافة' : isFr ? 'Objectifs Majeurs de l’Association AMYCC' : 'AMYCC Core Strategic Goals'}
              </h2>
              <p className="text-sm sm:text-base text-[#5C5A55] leading-relaxed">
                {isAr
                  ? 'ستة أهداف استراتيجية محددة بدقة توجه كافة المشاريع والبرامج الميدانية للجمعية:'
                  : isFr
                  ? 'Six objectifs clés guidant l’ensemble de nos ateliers d’art, projets citoyens et coopérations :'
                  : 'Six clear strategic objectives directing all field initiatives, masterclasses, and partnerships:'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {objectives.map((obj, idx) => (
                <div
                  key={idx}
                  className="p-7 rounded-3xl bg-white border border-[#e5e0d6] shadow-subtle hover:shadow-card hover:-translate-y-1 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
                        <Flaticon icon={obj.icon} size={24} className="text-[#231f20]" />
                      </span>
                      <span className="text-xs font-black text-[#231f20] font-mono px-2.5 py-0.5 rounded-full bg-[#231f20]/10">
                        {isAr ? `الهدف ${obj.num}` : isFr ? `Objectif ${obj.num}` : `Goal ${obj.num}`}
                      </span>
                    </div>

                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#bd3227] block mb-1">
                        {obj.tag}
                      </span>
                      <h3 className="text-base sm:text-lg font-black text-[#231f20] mb-2 leading-snug">
                        {obj.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#5C5A55] leading-relaxed">
                        {obj.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#E5E0D6] flex items-center justify-between text-xs font-bold text-[#5C5A55]">
                    <span>{isAr ? 'محور عمل رسمي' : isFr ? 'Axe prioritaire officiel' : 'Official Priority'}</span>
                    <span className="text-[#231f20]">✓</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            8. FLAGSHIP PROGRAM SPOTLIGHT (مبادرة شباب في العمل)
            ============================================================ */}
        <section className="py-16 bg-gradient-to-r from-[#231f20] via-[#231f20] to-[#181516] text-white relative overflow-hidden">
          <div className="absolute inset-0 moroccan-star-pattern opacity-10 pointer-events-none" />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="space-y-3 max-w-2xl text-center lg:text-start">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#bd3227] text-white">
                  <span>★</span>
                  <span>
                    {isAr
                      ? 'البرنامج الرائد والمبادرة الميدانية'
                      : isFr
                      ? 'Programme Phare & Action Citoyenne'
                      : 'Flagship Civic Initiative'}
                  </span>
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  {isAr
                    ? 'مبادرة شباب في العمل — AMYCC'
                    : isFr
                    ? 'Initiative Jeunesse en Action — AMYCC'
                    : 'Youth in Action Initiative — AMYCC'}
                </h3>
                <p className="text-xs sm:text-sm text-[#E2DED6] leading-relaxed">
                  {isAr
                    ? 'الذراع التطوعي والميداني للجمعية، يهدف إلى إشراك الشباب والشابات في القيادة الثقافية وتنظيم الفعاليات وصقل مهارات العمل الجماعي وخدمة المجتمع.'
                    : isFr
                    ? 'Le bras volontaire et actif de l’AMYCC, engageant les jeunes dans le leadership culturel, la gestion d’événements et le service communautaire.'
                    : 'The civic and volunteer backbone of AMYCC, empowering young leaders to organize local cultural events and build valuable transferable skills.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Link
                  href={`/${locale}/programs/youth-in-action`}
                  className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-[#bd3227] hover:bg-[#a3261c] text-white transition-all shadow-xs cursor-pointer"
                >
                  {isAr
                    ? 'استكشف مبادرة شباب في العمل ←'
                    : isFr
                    ? 'Découvrir Jeunesse en Action →'
                    : 'Discover Youth in Action →'}
                </Link>
                <Link
                  href={`/${locale}/membership`}
                  className="px-5 py-3 rounded-xl text-xs sm:text-sm font-bold bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all cursor-pointer"
                >
                  {isAr ? 'تطوع معنا' : isFr ? 'Devenir Bénévole' : 'Volunteer With Us'}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            9. ORGANIZATIONAL STRUCTURE & MANAGEMENT (الهيكلة والتنظيم الإداري)
            ============================================================ */}
        <section id="governance" className="py-20 bg-white border-b border-[#e5e0d6] scroll-mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#bd3227] px-3.5 py-1.5 rounded-full bg-[#bd3227]/10 border border-[#bd3227]/20">
                {isAr ? 'الهيكلة والتنظيم الإداري' : isFr ? 'Organisation & Structuration' : 'Organizational Architecture'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#231f20]">
                {isAr ? 'الهيكلة التنظيمية للجمعية' : isFr ? 'Architecture Démocratique & Direction' : 'Organizational Architecture'}
              </h2>
              <p className="text-sm sm:text-base text-[#5C5A55] leading-relaxed">
                {isAr
                  ? 'هيكلة ديمقراطية وشفافة تسهر على تسيير البرامج وتطبيق النظام الأساسي للجمعية بأعلى معايير النزاهة والمسؤولية:'
                  : isFr
                  ? 'Une organisation participative et transparente appliquant rigoureusement les statuts officiels de l’association :'
                  : 'Democratic and transparent organizational structure managing programs in accordance with association bylaws:'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="p-8 rounded-3xl bg-[#FAF8F5] border border-[#e5e0d6] shadow-subtle text-center space-y-4 hover:border-[#231f20]/40 transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-[#231f20]/10 text-[#231f20] flex items-center justify-center mx-auto shadow-2xs">
                    <Flaticon name="museum" size={28} className="text-[#231f20]" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#231f20] block">
                    {isAr ? 'الهيئة العليا' : isFr ? 'Instance Suprême' : 'Supreme Body'}
                  </span>
                  <h3 className="text-lg font-black text-[#231f20]">
                    {isAr ? 'الجمع العام' : isFr ? 'Assemblée Générale' : 'General Assembly'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C5A55] leading-relaxed">
                    {isAr
                      ? 'أعلى هيئة تقريرية في الجمعية، تضم كافة الأعضاء المنخرطين، وتصادق على التقارير الأدبية والمالية وانتخاب المكتب التنفيذي.'
                      : isFr
                      ? 'Instance souveraine réunissant tous les membres adhérents, adoptant les rapports moraux et financiers et élisant le bureau exécutif.'
                      : 'Supreme decision-making body comprising all active members, approving annual narrative and financial reports.'}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#e5e0d6] text-xs font-bold text-[#5C5A55]">
                  {isAr ? 'الديمقراطية التشاركية' : isFr ? 'Démocratie Participative' : 'Participatory Democracy'}
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-[#FAF8F5] border border-[#e5e0d6] shadow-subtle text-center space-y-4 hover:border-[#bd3227]/40 transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-[#bd3227]/10 text-[#bd3227] flex items-center justify-center mx-auto shadow-2xs">
                    <Flaticon name="users" size={28} className="text-[#bd3227]" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#bd3227] block">
                    {isAr ? 'التسيير والتنفيذ' : isFr ? 'Direction & Gestion' : 'Executive Leadership'}
                  </span>
                  <h3 className="text-lg font-black text-[#231f20]">
                    {isAr ? 'المكتب التنفيذي' : isFr ? 'Bureau Exécutif' : 'Executive Board'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C5A55] leading-relaxed">
                    {isAr
                      ? 'الهيئة المسؤولة عن التدبير اليومي، تنفيذ القرارات، تمثيل الجمعية قانونيًا، والإشراف المباشر على المبادرات والشراكات.'
                      : isFr
                      ? 'Organe élu en charge de l’administration quotidienne, de la représentation légale et de la conduite des partenariats.'
                      : 'Elected executive board responsible for day-to-day management, legal representation, and strategic implementation.'}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#e5e0d6] text-xs font-bold text-[#5C5A55]">
                  {isAr ? 'الإشراف والتمثيل القانوني' : isFr ? 'Représentation Légale' : 'Legal Oversight'}
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-[#FAF8F5] border border-[#e5e0d6] shadow-subtle text-center space-y-4 hover:border-[#d2a82b]/40 transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-[#d2a82b]/10 text-[#d2a82b] flex items-center justify-center mx-auto shadow-2xs">
                    <Flaticon name="palette" size={28} className="text-[#d2a82b]" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#d2a82b] block">
                    {isAr ? 'المحاور الميدانية' : isFr ? 'Pôles d’Action' : 'Action Hubs'}
                  </span>
                  <h3 className="text-lg font-black text-[#231f20]">
                    {isAr ? 'اللجان الوظيفية والميدانية' : isFr ? 'Commissions Thématiques' : 'Specialized Working Committees'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C5A55] leading-relaxed">
                    {isAr
                      ? 'لجان متخصصة في الفنون البصرية، الموسيقى والتراث، المسرح، الإعلام والتواصل، ولجنة تنسيق مبادرة شباب في العمل.'
                      : isFr
                      ? 'Commissions dédiées aux arts plastiques, musique, théâtre, médias et à la coordination de l’initiative Jeunesse en Action.'
                      : 'Working committees dedicated to performing arts, music, media, and Youth in Action coordination.'}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#e5e0d6] text-xs font-bold text-[#5C5A55]">
                  {isAr ? 'التنفيذ الميداني التخصصي' : isFr ? 'Expertise & Coordination' : 'Specialized Operations'}
                </div>
              </div>
            </div>

            {/* Meet Team Shortcut */}
            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-start">
                <h4 className="text-sm font-bold text-[#231f20]">
                  {isAr
                    ? 'هل تود التعرف على فريق العمل والمكتب التنفيذي للجمعية؟'
                    : isFr
                    ? 'Envie de faire connaissance avec notre bureau exécutif et notre équipe ?'
                    : 'Interested in meeting our leadership team and board?'}
                </h4>
                <p className="text-xs text-[#5C5A55]">
                  {isAr
                    ? 'اطلع على سير أعضاء المكتب التنفيذي واللجان الفنية في صفحة فريق العمل'
                    : isFr
                    ? 'Découvrez les parcours et responsabilités de nos membres sur la page dédiée à l’équipe.'
                    : 'Discover the profiles and bios of our executive leadership on the team page.'}
                </p>
              </div>
              <Link
                href={`/${locale}/team`}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#231f20] text-white hover:bg-[#d2a82b] transition-all shrink-0 cursor-pointer"
              >
                {isAr
                  ? 'فريق العمل والمكتب التنفيذي ←'
                  : isFr
                  ? 'Découvrir Notre Équipe ←'
                  : 'Meet Our Team →'}
              </Link>
            </div>
          </div>
        </section>

        {/* ============================================================
            10. TRANSPARENCY & INTEGRITY CHARTER (ميثاق الشفافية والمسؤولية)
            ============================================================ */}
        <section id="charter" className="py-16 bg-[#FAF8F5] border-b border-[#e5e0d6] scroll-mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#e5e0d6] shadow-subtle space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E0D6]">
                <div className="flex items-center gap-3">
                  <span className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-2xl flex items-center justify-center shadow-2xs">
                    ⚖️
                  </span>
                  <div>
                    <h3 className="text-lg font-black text-[#231f20]">
                      {isAr
                        ? 'ميثاق النزاهة والشفافية والمسؤولية'
                        : isFr
                        ? 'Charte de Transparence & d’Intégrité'
                        : 'Charter of Integrity & Transparency'}
                    </h3>
                    <span className="text-xs font-bold text-[#5C5A55]">
                      {isAr
                        ? 'التزام أخلاقي وقانوني صارم تجاه المجتمع والشركاء'
                        : isFr
                        ? 'Engagement éthique et juridique ferme envers la communauté et les partenaires'
                        : 'Ethical and transparent management pledge'}
                    </span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold self-start sm:self-auto">
                  <span>✓</span>
                  <span>{isAr ? 'التزام رسمي مصادق عليه' : isFr ? 'Engagement Officiel Validé' : 'Officially Certified'}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#5C5A55]">
                <div className="space-y-1.5">
                  <span className="font-bold text-[#231f20] block">
                    {isAr
                      ? '1. التدبير المالي الدقيق'
                      : isFr
                      ? '1. Rigueur Comptable & Budgétaire'
                      : '1. Rigorous Financial Auditing'}
                  </span>
                  <p className="leading-relaxed">
                    {isAr
                      ? 'توثيق كافة الموارد والمصارف بحسابات بنكية رسمية وإجراءات محاسبية مضبوطة تخضع للافتحاص السنوي.'
                      : isFr
                      ? 'Comptabilité certifiée, transactions bancaires transparentes et audit financier lors de chaque assemblée annuelle.'
                      : 'Official banking controls and verified bookkeeping subject to annual general assembly audit.'}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="font-bold text-[#231f20] block">
                    {isAr
                      ? '2. التقارير الدورية المفتوحة'
                      : isFr
                      ? '2. Bilans Publics & Accessibles'
                      : '2. Open Narrative & Financial Reporting'}
                  </span>
                  <p className="leading-relaxed">
                    {isAr
                      ? 'نشر التقريرين الأدبي والمالي سنوياً وإتاحة حصيلة الأنشطة والمشاريع للمنخرطين والرأي العام.'
                      : isFr
                      ? 'Diffusion des rapports d’activité et financiers auprès des adhérents, partenaires et du public.'
                      : 'Annual narrative and financial reports shared openly with active members and institutional sponsors.'}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="font-bold text-[#231f20] block">
                    {isAr
                      ? '3. تكافؤ الفرص وعدم التمييز'
                      : isFr
                      ? '3. Égalité des Chances & Inclusion'
                      : '3. Equal Access & Impartiality'}
                  </span>
                  <p className="leading-relaxed">
                    {isAr
                      ? 'ضمان استفادة جميع الشباب والناشئة من برامج وورشات الجمعية دون أي تمييز مجالي أو اجتماعي.'
                      : isFr
                      ? 'Accès garanti et équitable à l’ensemble de nos ateliers sans distinction sociale, géographique ou de genre.'
                      : 'Guaranteed access to cultural workshops for all youth without spatial, economic, or social barriers.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            11. DUAL HIGH-CONVERSION CTA
            ============================================================ */}
        <section className="py-16 lg:py-20 bg-gradient-to-br from-[#231f20] to-[#181516] text-white relative overflow-hidden">
          <div className="absolute top-0 end-0 w-96 h-96 bg-[#bd3227]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 start-0 w-80 h-80 bg-[#231f20]/30 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#bd3227]/20 border border-[#bd3227]/40 text-[#fde8e7] text-xs font-bold">
              <span>✦</span>
              <span>
                {isAr
                  ? 'كن جزءاً من مسيرة الإبداع والتغيير الثقافي'
                  : isFr
                  ? 'Participez à la dynamique culturelle au Maroc'
                  : 'Be Part of the Cultural Movement in Morocco'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              {isAr ? (
                <>
                  أبواب الجمعية مفتوحة للمبدعين، المتطوعين، <br />
                  <span className="text-[#ffd22f]">والشركاء المؤسساتيين في كل ربوع المغرب</span>
                </>
              ) : isFr ? (
                <>
                  Nos portes sont ouvertes aux créateurs, bénévoles <br />
                  <span className="text-[#ffd22f]">& partenaires institutionnels à travers le Maroc</span>
                </>
              ) : (
                <>
                  Open Doors for Artists, Volunteers <br />
                  <span className="text-[#ffd22f]">& Institutional Partners Across Morocco</span>
                </>
              )}
            </h2>

            <p className="text-xs sm:text-base text-[#E2DED6] max-w-2xl mx-auto leading-relaxed">
              {isAr
                ? 'سواء كنت شاباً موهوباً يبحث عن صقل قدراته، فناناً يرغب في مشاركة خبرته، متطوعاً يسعى لخدمة المجتمع، أو مؤسسة ترغب في بناء شراكة هادفة، نرحب بك معنا.'
                : isFr
                ? 'Que vous soyez un jeune désireux de développer ses talents, un artiste partageant son savoir, un bénévole engagé ou une institution partenaire, soyez les bienvenus à l’AMYCC.'
                : 'Whether you are a budding artist, an experienced mentor, a dedicated volunteer, or an institution seeking collaborative cultural impact, AMYCC welcomes you.'}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href={`/${locale}/membership`}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-black text-white bg-[#bd3227] hover:bg-[#a3261c] active:scale-95 transition-all text-xs sm:text-sm shadow-card cursor-pointer"
              >
                {dict.membership.apply}
              </Link>

              <Link
                href={`/${locale}/programs/youth-in-action`}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-white bg-[#231f20] hover:bg-[#d2a82b] border border-[#d2a82b]/50 transition-all text-xs sm:text-sm cursor-pointer"
              >
                {isAr
                  ? 'مبادرة شباب في العمل'
                  : isFr
                  ? 'Initiative Jeunesse en Action'
                  : 'Youth in Action Hub'}
              </Link>

              <Link
                href={`/${locale}/partnerships`}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-[#ffd22f] border border-[#ffd22f]/40 hover:bg-[#ffd22f]/10 transition-all text-xs sm:text-sm cursor-pointer"
              >
                {dict.nav.partnerships}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} dict={dict} />
    </>
  )
}

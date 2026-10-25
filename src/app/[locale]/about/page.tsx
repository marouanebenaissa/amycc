import { getDictionary } from '@/lib/i18n/dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'

export default async function AboutPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const dict = await getDictionary(locale)
  const isAr = locale === 'ar'
  const isFr = locale === 'fr'

  // The 7 Official Core Values (أولاً: قيمنا)
  const values = [
    {
      key: 'creativity',
      number: '01',
      title: isAr ? 'الإبداع والابتكار' : isFr ? 'Créativité & Innovation' : 'Creativity & Innovation',
      desc: isAr
        ? 'تشجيع التعبير الفني والابتكار وتنمية الخيال لدى الشباب، وإتاحة الفرص لهم لاكتشاف مواهبهم وتطوير قدراتهم الإبداعية.'
        : isFr
        ? "Encourager l'expression artistique, l'innovation et l'imagination des jeunes, en leur offrant des opportunités pour révéler leurs talents et développer leur potentiel créatif."
        : 'Fostering artistic expression, innovation, and imagination among youth, providing opportunities to discover talents and develop creative abilities.',
      icon: '🎨',
      badgeAr: 'تعبير فني أصيل',
      badgeFr: 'Expression',
      badgeEn: 'Artistic Expression',
      borderClass: 'border-[#c85a32]/30 hover:border-[#c85a32]',
      accentBg: 'bg-[#c85a32]/10 text-[#c85a32]',
      glowColor: 'from-[#fae4dc]/50 to-transparent',
    },
    {
      key: 'inclusivity',
      number: '02',
      title: isAr ? 'الشمولية والإنصاف' : isFr ? 'Inclusivité & Équité' : 'Inclusivity & Equity',
      desc: isAr
        ? 'توفير بيئة مفتوحة ومرحبة تتيح للجميع المشاركة والاستفادة من أنشطة الجمعية دون أي تمييز أو إقصاء.'
        : isFr
        ? 'Offrir un environnement ouvert et accueillant permettant à tous de participer et de bénéficier des activités sans discrimination.'
        : 'Providing an open, welcoming environment that enables everyone to participate and benefit from activities without discrimination.',
      icon: '🌐',
      badgeAr: 'فضاء متاح للجميع',
      badgeFr: 'Ouvert à tous',
      badgeEn: 'Open to All',
      borderClass: 'border-[#0d3b43]/30 hover:border-[#0d3b43]',
      accentBg: 'bg-[#0d3b43]/10 text-[#0d3b43]',
      glowColor: 'from-[#d8f0f4]/50 to-transparent',
    },
    {
      key: 'solidarity',
      number: '03',
      title: isAr ? 'التضامن والتكافل' : isFr ? 'Solidarité & Entraide' : 'Solidarity & Mutual Aid',
      desc: isAr
        ? 'تعزيز التعاون والتكافل والعمل التطوعي، وتشجيع المبادرات الهادفة إلى خدمة المجتمع ومساندة الفئات المحتاجة.'
        : isFr
        ? "Renforcer l'entraide, le bénévolat et encourager les initiatives visant à servir la société et soutenir les populations vulnérables."
        : 'Promoting cooperation, mutual support, and civic volunteering, encouraging initiatives that serve the community and support those in need.',
      icon: '🤝',
      badgeAr: 'تطوع وأثر مجتمعي',
      badgeFr: 'Impact social',
      badgeEn: 'Civic Impact',
      borderClass: 'border-[#d99b26]/30 hover:border-[#d99b26]',
      accentBg: 'bg-[#d99b26]/10 text-[#d99b26]',
      glowColor: 'from-[#fdf2db]/50 to-transparent',
    },
    {
      key: 'education',
      number: '04',
      title: isAr ? 'التعليم والتطوير المستمر' : isFr ? 'Éducation & Développement' : 'Education & Growth',
      desc: isAr
        ? 'دعم التعلم المستمر واكتساب المهارات وتنمية القدرات الشخصية والفنية والثقافية للشباب على يد مدربين محترفين.'
        : isFr
        ? "Soutenir l'apprentissage continu, l'acquisition de compétences et le développement personnel, artistique et culturel des jeunes."
        : 'Supporting continuous learning, skill acquisition, and personal, artistic, and cultural development for young people.',
      icon: '📚',
      badgeAr: 'صقل وتأهيل الكفاءات',
      badgeFr: 'Formation continue',
      badgeEn: 'Capacity Building',
      borderClass: 'border-[#1c6875]/30 hover:border-[#1c6875]',
      accentBg: 'bg-[#1c6875]/10 text-[#1c6875]',
      glowColor: 'from-[#d8f0f4]/50 to-transparent',
    },
    {
      key: 'respect_diversity',
      number: '05',
      title: isAr ? 'الاحترام والتنوع الثقافي' : isFr ? 'Respect & Diversité' : 'Respect & Diversity',
      desc: isAr
        ? 'تقدير الاختلافات الثقافية والفكرية، واحترام الهوية والتراث المغربي، وتشجيع الحوار والتبادل الثقافي والانفتاح على العالم.'
        : isFr
        ? "Valoriser les diversités culturelles et intellectuelles, respecter l'identité et le patrimoine marocains, et encourager le dialogue interculturel."
        : 'Appreciating cultural and intellectual differences, honoring Moroccan identity and heritage, and encouraging intercultural dialogue.',
      icon: '🕊️',
      badgeAr: 'حوار وانفتاح إنساني',
      badgeFr: 'Dialogue culturel',
      badgeEn: 'Intercultural Dialogue',
      borderClass: 'border-[#c85a32]/30 hover:border-[#c85a32]',
      accentBg: 'bg-[#c85a32]/10 text-[#c85a32]',
      glowColor: 'from-[#fae4dc]/50 to-transparent',
    },
    {
      key: 'partnership',
      number: '06',
      title: isAr ? 'التعاون والشراكة المؤسساتية' : isFr ? 'Coopération & Partenariat' : 'Collaboration & Partnerships',
      desc: isAr
        ? 'بناء علاقات تعاون فعالة مع المؤسسات والجمعيات والفاعلين المحليين والوطنيين والدوليين، لتطوير المبادرات وتعزيز أثرها.'
        : isFr
        ? "Bâtir des partenariats constructifs avec les institutions, associations et acteurs locaux, nationaux et internationaux pour démultiplier l'impact culturel."
        : 'Building effective partnerships with civic institutions, associations, and local, national, and international stakeholders.',
      icon: '🏛️',
      badgeAr: 'جسور تعاون مستدامة',
      badgeFr: 'Alliances durables',
      badgeEn: 'Strategic Alliances',
      borderClass: 'border-[#0d3b43]/30 hover:border-[#0d3b43]',
      accentBg: 'bg-[#0d3b43]/10 text-[#0d3b43]',
      glowColor: 'from-[#d8f0f4]/50 to-transparent',
    },
    {
      key: 'transparency',
      number: '07',
      title: isAr ? 'الشفافية والمسؤولية والحكامة' : isFr ? 'Transparence & Responsabilité' : 'Transparency & Accountability',
      desc: isAr
        ? 'الالتزام بالنزاهة والوضوح في تدبير موارد الجمعية وتنفيذ أنشطتها، وتحمل كامل المسؤولية تجاه المنخرطين والشركاء والمجتمع.'
        : isFr
        ? "Respecter l'intégrité et la rigueur dans la gestion des ressources et la mise en œuvre des actions, avec une responsabilité totale envers les bénéficiaires."
        : 'Committing to integrity and openness in managing resources and executing programs, upholding accountability to beneficiaries, partners, and society.',
      icon: '⚖️',
      badgeAr: 'حكامة ونزاهة تامة',
      badgeFr: 'Gouvernance rigoureuse',
      badgeEn: 'Good Governance',
      borderClass: 'border-[#d99b26]/30 hover:border-[#d99b26]',
      accentBg: 'bg-[#d99b26]/10 text-[#d99b26]',
      glowColor: 'from-[#fdf2db]/50 to-transparent',
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
          title: 'Autonomisation des jeunes',
          desc: "Engagement civique et développement du leadership des jeunes à travers l'initiative Jeunesse en Action.",
          tag: 'Leadership',
        },
        {
          num: '03',
          icon: '🏛️',
          title: 'Valorisation du patrimoine marocain',
          desc: "Préservation et diffusion de la richesse culturelle et musicale marocaine à l'échelle nationale et internationale.",
          tag: 'Patrimoine',
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
          tag: 'Alliances',
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
      <Header locale={locale} dict={dict} />

      <main id="main-content" className="flex-1 bg-[#faf7f2]">
        {/* ============================================================
            1. PAGE HERO HEADER WITH MOROCCAN GEOMETRIC ACCENTS
            ============================================================ */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#faf7f2] via-[#f5ede1] to-[#faf7f2] border-b border-[#e5e0d6] pt-14 pb-16 lg:pt-20 lg:pb-24">
          <div className="absolute inset-0 moroccan-pattern-light opacity-60 pointer-events-none" aria-hidden="true" />
          
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute top-1/4 start-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#c85a32]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 end-10 w-72 h-72 bg-[#0d3b43]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center justify-center gap-2 text-3xs sm:text-2xs font-bold text-[#5f7174]">
              <Link href={`/${locale}`} className="hover:text-[#0d3b43] transition-colors">
                {isAr ? 'الرئيسية' : isFr ? 'Accueil' : 'Home'}
              </Link>
              <span>/</span>
              <span className="text-[#819598]">{isAr ? 'عن الجمعية' : isFr ? 'Association' : 'About'}</span>
              <span>/</span>
              <span className="text-[#c85a32]">{isAr ? 'من نحن' : isFr ? 'Qui sommes-nous' : 'About Us'}</span>
            </nav>

            {/* Badges Bar */}
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d3b43]/10 border border-[#0d3b43]/20 text-[#0d3b43] text-2xs sm:text-xs font-bold shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#c85a32] animate-pulse" />
                <span>{isAr ? 'جمعية غير ربحية رسمية بالمغرب • تأسست 2026' : 'Official Non-Profit Association in Morocco • Est. 2026'}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#d99b26]/10 border border-[#d99b26]/20 text-[#99620b] text-2xs sm:text-xs font-bold shadow-2xs">
                <span>📍</span>
                <span>{isAr ? 'الانطلاق: مراكش الحمراء 🇲🇦' : 'Origin: Marrakech, Morocco 🇲🇦'}</span>
              </span>
            </div>

            {/* Main Headline */}
            <div className="text-center max-w-4xl mx-auto space-y-4">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#08242a] tracking-tight leading-tight">
                {isAr ? (
                  <>
                    رعاية الإبداع، تمكين الشباب، <br />
                    <span className="text-[#c85a32]">وصون التراث الثقافي المغربي</span>
                  </>
                ) : isFr ? (
                  <>
                    Cultiver la Créativité, Émanciper la Jeunesse <br />
                    <span className="text-[#c85a32]">& Célébrer le Patrimoine Marocain</span>
                  </>
                ) : (
                  <>
                    Nurturing Creativity, Empowering Youth <br />
                    <span className="text-[#c85a32]">& Celebrating Moroccan Heritage</span>
                  </>
                )}
              </h1>

              <p className="text-sm sm:text-lg text-[#445457] max-w-3xl mx-auto leading-relaxed font-medium">
                {isAr
                  ? 'جمعية روح الفنون والثقافة (AMYCC) منظمة مدنية مغربية غير ربحية، تأسست عام 2026، تعمل برؤية متجددة للنهوض بالمشهد الثقافي والفني وتأهيل الطاقات الشبابية عبر محترفات الإبداع والمبادرات الميدانية.'
                  : isFr
                  ? "L'Association Marocaine des Jeunes, Culture & Créativité (AMYCC) est une organisation citoyenne à but non lucratif fondée en 2026, dédiée à l'émancipation culturelle, à l'éclosion des talents et à la cohésion sociale."
                  : 'The Moroccan Association for Youth, Culture & Creativity (AMYCC) is an official non-profit organization founded in 2026, dedicated to advancing arts, cultural access, and civic empowerment across Morocco.'}
              </p>
            </div>

            {/* Interactive In-Page Navigation Pills */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <a
                href="#profile"
                className="px-3.5 py-1.5 rounded-xl text-3xs sm:text-xs font-bold bg-white border border-[#cfc7b9] text-[#0d3b43] hover:border-[#c85a32] hover:text-[#c85a32] transition-colors shadow-2xs"
              >
                {isAr ? '🏷️ الهوية والنبذة' : 'Identity'}
              </a>
              <a
                href="#values"
                className="px-3.5 py-1.5 rounded-xl text-3xs sm:text-xs font-bold bg-white border border-[#cfc7b9] text-[#0d3b43] hover:border-[#c85a32] hover:text-[#c85a32] transition-colors shadow-2xs"
              >
                {isAr ? '💎 قيمنا الحاكمة (7)' : 'Core Values (7)'}
              </a>
              <a
                href="#mission"
                className="px-3.5 py-1.5 rounded-xl text-3xs sm:text-xs font-bold bg-white border border-[#cfc7b9] text-[#0d3b43] hover:border-[#c85a32] hover:text-[#c85a32] transition-colors shadow-2xs"
              >
                {isAr ? '🎯 رسالتنا الميدانية' : 'Our Mission'}
              </a>
              <a
                href="#vision"
                className="px-3.5 py-1.5 rounded-xl text-3xs sm:text-xs font-bold bg-white border border-[#cfc7b9] text-[#0d3b43] hover:border-[#c85a32] hover:text-[#c85a32] transition-colors shadow-2xs"
              >
                {isAr ? '🔭 رؤيتنا المستقبلية' : 'Our Vision'}
              </a>
              <a
                href="#roadmap"
                className="px-3.5 py-1.5 rounded-xl text-3xs sm:text-xs font-bold bg-white border border-[#cfc7b9] text-[#0d3b43] hover:border-[#c85a32] hover:text-[#c85a32] transition-colors shadow-2xs"
              >
                {isAr ? '🗺️ خارطة التوسع' : 'Roadmap'}
              </a>
              <a
                href="#objectives"
                className="px-3.5 py-1.5 rounded-xl text-3xs sm:text-xs font-bold bg-white border border-[#cfc7b9] text-[#0d3b43] hover:border-[#c85a32] hover:text-[#c85a32] transition-colors shadow-2xs"
              >
                {isAr ? '🎯 أهدافنا (6)' : 'Objectives'}
              </a>
              <a
                href="#governance"
                className="px-3.5 py-1.5 rounded-xl text-3xs sm:text-xs font-bold bg-white border border-[#cfc7b9] text-[#0d3b43] hover:border-[#c85a32] hover:text-[#c85a32] transition-colors shadow-2xs"
              >
                {isAr ? '🏛️ الحكامة والهيكلة' : 'Governance'}
              </a>
            </div>
          </div>
        </section>

        {/* ============================================================
            2. KEY METRICS & INSTITUTIONAL STRIP
            ============================================================ */}
        <section className="py-10 bg-white border-b border-[#e5e0d6]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="p-5 sm:p-6 rounded-3xl bg-[#faf7f2] border border-[#e5e0d6] hover:border-[#0d3b43]/30 transition-all text-center group">
                <span className="text-3xs font-extrabold uppercase tracking-wider text-[#5f7174] block mb-1">
                  {isAr ? 'سنة التأسيس الرسمي' : 'Foundation Year'}
                </span>
                <span className="text-3xl sm:text-4xl font-black text-[#0d3b43] group-hover:scale-105 transition-transform block">
                  2026
                </span>
                <p className="text-2xs sm:text-xs text-[#5f7174] mt-1.5 leading-snug">
                  {isAr ? 'جمعية مدنية غير ربحية تأسست بالمغرب' : 'Nonprofit cultural association founded in Morocco.'}
                </p>
              </div>

              <div className="p-5 sm:p-6 rounded-3xl bg-[#faf7f2] border border-[#e5e0d6] hover:border-[#c85a32]/30 transition-all text-center group">
                <span className="text-3xs font-extrabold uppercase tracking-wider text-[#5f7174] block mb-1">
                  {isAr ? 'نقطة الانطلاق والنطاق' : 'Origin & Reach'}
                </span>
                <span className="text-2xl sm:text-3xl font-black text-[#c85a32] group-hover:scale-105 transition-transform block">
                  {isAr ? 'مراكش • المغرب' : 'Marrakech • Morocco'}
                </span>
                <p className="text-2xs sm:text-xs text-[#5f7174] mt-1.5 leading-snug">
                  {isAr
                    ? 'من مراكش نحو مختلف جهات المملكة وشراكات دولية'
                    : 'From Marrakech across Morocco with global partnerships.'}
                </p>
              </div>

              <div className="p-5 sm:p-6 rounded-3xl bg-[#faf7f2] border border-[#e5e0d6] hover:border-[#d99b26]/30 transition-all text-center group">
                <span className="text-3xs font-extrabold uppercase tracking-wider text-[#5f7174] block mb-1">
                  {isAr ? 'المنظومة التوجيهية' : 'Core Framework'}
                </span>
                <span className="text-3xl sm:text-4xl font-black text-[#d99b26] group-hover:scale-105 transition-transform block">
                  7 {isAr ? 'قيم حاكمة' : 'Values'}
                </span>
                <p className="text-2xs sm:text-xs text-[#5f7174] mt-1.5 leading-snug">
                  {isAr ? 'الإبداع، الشمولية، التضامن، والحكامة' : 'Creativity, Inclusivity, Solidarity & Integrity.'}
                </p>
              </div>

              <div className="p-5 sm:p-6 rounded-3xl bg-[#faf7f2] border border-[#e5e0d6] hover:border-[#0d3b43]/30 transition-all text-center group">
                <span className="text-3xs font-extrabold uppercase tracking-wider text-[#5f7174] block mb-1">
                  {isAr ? 'البرنامج الرائد والمبادرة' : 'Flagship Initiative'}
                </span>
                <span className="text-xl sm:text-2xl font-black text-[#0d3b43] group-hover:scale-105 transition-transform block mt-0.5">
                  {isAr ? 'شباب في العمل' : 'Youth in Action'}
                </span>
                <p className="text-2xs sm:text-xs text-[#5f7174] mt-1.5 leading-snug">
                  {isAr ? 'التمكين القيادي والتطوع الميداني للشباب' : 'Civic volunteering & cultural leadership framework.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            3. INSTITUTIONAL PROFILE & IDENTITY (نبذة تعريفية وهوية مؤسساتية)
            ============================================================ */}
        <section id="profile" className="py-20 bg-[#faf7f2] border-b border-[#e5e0d6] scroll-mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#0d3b43] px-3.5 py-1.5 rounded-full bg-[#0d3b43]/10 border border-[#0d3b43]/20">
                {isAr ? 'النبذة والهوية المؤسساتية' : 'Institutional Profile & Charter'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#08242a]">
                {isAr ? 'من نحن؟ — جمعية روح الفنون والثقافة المغربية' : 'Who We Are — The AMYCC Identity'}
              </h2>
              <p className="text-sm sm:text-base text-[#445457] leading-relaxed">
                {isAr
                  ? 'منظمة مدنية مستقلة تأسست بروح وطنية مسؤولة للنهوض بالعمل الثقافي والاجتماعي وتأهيل الشباب ليكونوا قادة التغيير الإيجابي.'
                  : 'An independent civic organization founded with deep Moroccan cultural roots to elevate artistic expression and empower youth.'}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Left Column: Comprehensive Story & Legal Definition */}
              <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-[#e5e0d6] shadow-subtle space-y-6 flex flex-col justify-between">
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <span className="w-12 h-12 rounded-2xl bg-[#0d3b43] text-white flex items-center justify-center font-black text-xl shadow-xs">
                      🏛️
                    </span>
                    <div>
                      <h3 className="text-xl font-black text-[#08242a]">
                        {isAr ? 'الإطار القانوني والتنظيمي' : 'Legal & Non-Profit Foundation'}
                      </h3>
                      <span className="text-3xs text-[#819598] font-bold">
                        {isAr ? 'منظمة جمعوية خاضعة للظهير الشريف بالمملكة المغربية' : 'Duly registered Moroccan non-profit organization'}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-[#445457] leading-relaxed">
                    {isAr
                      ? 'تأسست جمعية روح الفنون والثقافة (AMYCC) عام 2026 بمدينة مراكش كجمعية مدنية غير ربحية مستقلة، وفقًا لمقتضيات الظهير الشريف رقم 1.58.376 المنظم لحق تأسيس الجمعيات بالمملكة المغربية، والأنظمة الأساسية المعمول بها وطنيًا.'
                      : "L'AMYCC est une association marocaine à but non lucratif, légalement constituée à Marrakech en 2026 conformément au Dahir régissant le droit d'association au Royaume du Maroc."}
                  </p>

                  <p className="text-sm text-[#445457] leading-relaxed">
                    {isAr
                      ? 'تسعى الجمعية إلى خلق دينامية ثقافية مستدامة تجمع بين حماية التراث المغربي المتنوع بروافده (العربية، الأمازيغية، الحسانية، والأندلسية)، وبين مواكبة التيارات الفنية المعاصرة وتمكين الشباب في مهن الفنون والإبداع والتواصل الرقمي.'
                      : 'The association strives to generate sustainable cultural dynamics uniting Moroccan heritage preservation with contemporary creative masterclasses, civic volunteering, and professional development.'}
                  </p>
                </div>

                <div className="pt-6 border-t border-[#f0ebe1] flex flex-wrap items-center justify-between gap-3 text-3xs text-[#5f7174]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-bold text-[#08242a]">{isAr ? 'الحالة: نشطة ورسمية' : 'Status: Active & Registered'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📜</span>
                    <span>{isAr ? 'النظام الأساسي والداخلي مصادق عليه' : 'Official Bylaws Approved'}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: 3 Strategic Hallmarks */}
              <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
                <div className="p-6 rounded-3xl bg-white border border-[#e5e0d6] shadow-2xs hover:border-[#c85a32]/40 transition-all space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">📍</span>
                    <h4 className="text-base font-black text-[#08242a]">
                      {isAr ? 'مراكش — منطلق استراتيجي' : 'Marrakech — The Launchpad'}
                    </h4>
                  </div>
                  <p className="text-xs text-[#5f7174] leading-relaxed">
                    {isAr
                      ? 'تم اختيار مراكش كنواة انطلاق لعمقها التاريخي والثقافي ومكانتها كعاصمة عالمية للفنون، لتمتد المبادرات تدريجيًا نحو كافة جهات المملكة.'
                      : 'Chosen for its deep historical depth and position as a cultural capital, serving as the springboard to nationwide reach.'}
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-[#e5e0d6] shadow-2xs hover:border-[#0d3b43]/40 transition-all space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">🤝</span>
                    <h4 className="text-base font-black text-[#08242a]">
                      {isAr ? 'العمل التشاركي والمؤسساتي' : 'Collaborative Ecosystem'}
                    </h4>
                  </div>
                  <p className="text-xs text-[#5f7174] leading-relaxed">
                    {isAr
                      ? 'نعمل بالشراكة الوثيقة مع دور الشباب، المراكز الثقافية، المؤسسات التعليمية، والجامعات لضمان إتاحة الورشات للجميع دون حواجز.'
                      : 'Partnering actively with youth centers, cultural institutions, and schools to ensure open, cost-free arts accessibility.'}
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-[#e5e0d6] shadow-2xs hover:border-[#d99b26]/40 transition-all space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">⚖️</span>
                    <h4 className="text-base font-black text-[#08242a]">
                      {isAr ? 'النزاهة والشفافية التامة' : 'Integrity & Transparency'}
                    </h4>
                  </div>
                  <p className="text-xs text-[#5f7174] leading-relaxed">
                    {isAr
                      ? 'التزام مطلق بالحكامة الرشيدة، التدبير المالي والإداري المدقق، ونشر التقارير الأدبية والمالية للمنخرطين والشركاء.'
                      : 'Uncompromising commitment to good governance, transparent resource management, and annual public reporting.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            4. أولاً: قيمنا الحاكمة (OUR 7 CORE VALUES)
            ============================================================ */}
        <section id="values" className="py-20 bg-white border-b border-[#e5e0d6] scroll-mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#c85a32] px-3.5 py-1.5 rounded-full bg-[#c85a32]/10 border border-[#c85a32]/20">
                {isAr ? 'أولاً: قيمنا الحاكمة' : 'I. Our Core Values'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#08242a]">
                {isAr ? 'المنظومة الأخلاقية والمبادئ الموجهة لأنشطتنا' : 'Core Values Guiding Our Cultural Work'}
              </h2>
              <p className="text-sm sm:text-base text-[#445457] leading-relaxed">
                {isAr
                  ? 'تستند جمعية روح الفنون والثقافة (AMYCC) في كافة تدخلاتها الميدانية إلى سبع قيم أساسية تشكل البوصلة الأخلاقية والمهنية لعملنا:'
                  : 'The Spirit of Arts & Culture Association (AMYCC) is guided by seven fundamental values shaping all its programs:'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((v, idx) => (
                <div
                  key={v.key}
                  className={`p-7 rounded-3xl bg-[#faf7f2] border transition-all duration-300 flex flex-col justify-between group shadow-subtle hover:shadow-card hover:-translate-y-1 relative overflow-hidden ${
                    v.borderClass
                  } ${idx === 6 ? 'md:col-span-2 lg:col-span-3' : ''}`}
                >
                  <div className={`absolute top-0 end-0 w-32 h-32 bg-gradient-to-bl ${v.glowColor} rounded-bl-full pointer-events-none`} />

                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="w-12 h-12 rounded-2xl bg-white border border-[#e5e0d6] flex items-center justify-center text-2xl shadow-2xs group-hover:scale-110 transition-transform">
                        {v.icon}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-4xs font-black uppercase tracking-wider ${v.accentBg}`}>
                          {isAr ? v.badgeAr : isFr ? v.badgeFr : v.badgeEn}
                        </span>
                        <span className="text-xs font-black text-[#819598] font-mono">
                          #{v.number}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-[#08242a] mb-2 leading-snug">
                        {v.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#445457] leading-relaxed">
                        {v.desc}
                      </p>
                    </div>
                  </div>

                  <div className="relative z-10 pt-4 mt-4 border-t border-[#e5e0d6] flex items-center justify-between text-4xs font-bold text-[#819598] uppercase tracking-wider">
                    <span>AMYCC Ethical Pillar</span>
                    <span className="w-2 h-2 rounded-full bg-[#c85a32]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            5. ثانياً: رسالتنا (OUR MISSION)
            ============================================================ */}
        <section id="mission" className="py-20 bg-[#faf7f2] border-b border-[#e5e0d6] scroll-mt-16 relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#0d3b43] px-3.5 py-1.5 rounded-full bg-[#0d3b43]/10 border border-[#0d3b43]/20">
                {isAr ? 'ثانياً: رسالتنا' : 'II. Our Mission'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#08242a]">
                {isAr ? 'رسالة جمعية روح الفنون والثقافة' : 'AMYCC Institutional Mission'}
              </h2>
              <p className="text-sm sm:text-base text-[#445457] leading-relaxed">
                {isAr
                  ? 'رؤية عملية تستثمر في طاقات الشباب الفنية وتجعل من الثقافة محركاً للتنمية الإنسانية والتماسك الاجتماعي.'
                  : 'Actionable mission empowering youth through arts, cultivating civic belonging, and revitalizing community life.'}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Pillar Quote Container */}
              <div className="lg:col-span-5 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#0d3b43] via-[#08242a] to-[#04161a] text-white flex flex-col justify-between shadow-card relative overflow-hidden">
                <div className="absolute top-0 end-0 w-64 h-64 bg-[#c85a32]/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 start-0 w-48 h-48 bg-[#d99b26]/10 rounded-full blur-2xl pointer-events-none" />

                <div className="space-y-5 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-[#c85a32] text-white flex items-center justify-center font-bold text-2xl shadow-xs">
                    ✦
                  </div>

                  <span className="text-4xs font-extrabold uppercase tracking-widest text-[#f4ce83] block">
                    {isAr ? 'المبدأ الجوهري المؤسس' : 'Founding Premise'}
                  </span>

                  <h3 className="text-xl sm:text-2xl font-black leading-snug text-white">
                    {isAr
                      ? 'لكل شاب موهبة وقدرات إبداعية تستحق الاكتشاف والرعاية والتطوير'
                      : 'Every young person has talent deserving discovery, care, and development'}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#d8f0f4] leading-relaxed">
                    {isAr
                      ? 'يشكل الفن والثقافة وسيلة أساسية للتعبير عن الذات وتنمية المهارات وتعزيز التواصل الإيجابي بين أفراد المجتمع، وصقل الحس النقدي والجمالي.'
                      : 'Art and culture are vital vehicles for self-expression, skill acquisition, and community cohesion.'}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#14505b] text-3xs text-[#f4ce83] flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2">
                    <span>📍</span>
                    <span>{isAr ? 'انطلاقاً من مراكش نحو مختلف جهات المملكة' : 'From Marrakech to all Moroccan Regions'}</span>
                  </div>
                  <span className="font-mono font-bold">AMYCC 2026</span>
                </div>
              </div>

              {/* Narrative Content with 3 Action Pillars */}
              <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
                <div className="p-7 rounded-3xl bg-white border border-[#e5e0d6] shadow-subtle space-y-2.5 hover:border-[#0d3b43]/30 transition-all">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-[#0d3b43]/10 text-[#0d3b43] flex items-center justify-center font-black text-xs">
                      01
                    </span>
                    <h4 className="text-base font-black text-[#08242a]">
                      {isAr ? 'المبدأ الأساسي والإيمان بقدرات الشباب' : 'Foundational Belief in Youth Potential'}
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-[#445457] leading-relaxed">
                    {isAr
                      ? 'تؤمن جمعية روح الفنون والثقافة (AMYCC) بأن لكل شاب موهبة وقدرات إبداعية تستحق الاكتشاف والرعاية والتطوير، وأن الفن والثقافة يشكلان وسيلة أساسية للتعبير عن الذات وتنمية المهارات وتعزيز التواصل بين أفراد المجتمع.'
                      : 'AMYCC believes every young person holds creative capacity worthy of discovery and growth, establishing culture as a driver for positive human development.'}
                  </p>
                </div>

                <div className="p-7 rounded-3xl bg-white border border-[#e5e0d6] shadow-subtle space-y-2.5 hover:border-[#c85a32]/30 transition-all">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-[#c85a32]/10 text-[#c85a32] flex items-center justify-center font-black text-xs">
                      02
                    </span>
                    <h4 className="text-base font-black text-[#08242a]">
                      {isAr ? 'مسارات العمل الميداني والتأهيل' : 'Field Operations & Capacity Building'}
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-[#445457] leading-relaxed">
                    {isAr
                      ? 'ومن هذا المنطلق، تعمل الجمعية على توفير فرص للشباب لاكتشاف مواهبهم وصقل قدراتهم في مختلف المجالات الفنية والثقافية، من خلال التكوين والورشات الإبداعية والأنشطة التربوية والمبادرات التطوعية والاجتماعية، بما يعزز ثقتهم بأنفسهم ويشجعهم على المشاركة الفعالة في خدمة المجتمع.'
                      : 'The association creates high-quality workshops, educational programs, and volunteer avenues equipping youth with both technical artistic mastery and essential life skills.'}
                  </p>
                </div>

                <div className="p-7 rounded-3xl bg-white border border-[#e5e0d6] shadow-subtle space-y-2.5 hover:border-[#d99b26]/30 transition-all">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-[#d99b26]/10 text-[#99620b] flex items-center justify-center font-black text-xs">
                      03
                    </span>
                    <h4 className="text-base font-black text-[#08242a]">
                      {isAr ? 'الانطلاق المستدام والتعاون والشراكات' : 'Sustainable Launch & Strategic Partnerships'}
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-[#445457] leading-relaxed">
                    {isAr
                      ? 'وانطلاقًا من مدينة مراكش، تسعى الجمعية إلى تطوير مبادرات مستدامة تستجيب لاحتياجات الشباب، وصون التراث الثقافي المغربي والتعريف به، وتشجيع التبادل الثقافي والانفتاح على التجارب المختلفة، إلى جانب بناء شراكات فعالة على المستويين الوطني والدولي، إيمانًا منها بأن الاستثمار في قدرات الشباب يساهم في بناء مجتمع أكثر إبداعًا وتنوعًا وتضامنًا.'
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
              <span className="text-xs font-bold uppercase tracking-widest text-[#d99b26] px-3.5 py-1.5 rounded-full bg-[#d99b26]/10 border border-[#d99b26]/20">
                {isAr ? 'ثالثاً: رؤيتنا' : 'III. Our Vision'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#08242a]">
                {isAr ? 'الرؤية المستقبلية لجمعية روح الفنون والثقافة' : 'Long-Term Strategic Vision'}
              </h2>
              <p className="text-sm sm:text-base text-[#445457] leading-relaxed">
                {isAr
                  ? 'طموح مؤسساتي يرتكز على بناء شبكة وطنية رائدة تمتد نحو آفاق دولية مع صون الأصالة المغربية.'
                  : 'An institutional ambition grounded in territorial equity, international bridges, and authentic roots.'}
              </p>
            </div>

            {/* 3 Full Vision Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="p-8 rounded-3xl bg-[#faf7f2] border-2 border-[#0d3b43]/30 shadow-subtle hover:shadow-card hover:-translate-y-1 transition-all flex flex-col justify-between space-y-5">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="w-12 h-12 rounded-2xl bg-[#0d3b43] text-white flex items-center justify-center font-black text-xl shadow-xs">
                      01
                    </span>
                    <span className="text-4xs font-bold px-2.5 py-1 rounded-full bg-[#0d3b43]/10 text-[#0d3b43]">
                      {isAr ? 'تدرج جغرافي' : 'Staged Network'}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-[#08242a]">
                    {isAr ? 'الريادة والشبكة المتكاملة' : 'Leadership & Integrated Network'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#445457] leading-relaxed">
                    {isAr
                      ? 'تطمح جمعية روح الفنون والثقافة (AMYCC) إلى أن تصبح جمعية رائدة في مجال الفنون والثقافة وتمكين الشباب، من خلال بناء شبكة متكاملة من الفروع والمبادرات تنطلق من المستوى الإقليمي، وتمتد إلى مختلف جهات المملكة المغربية، وصولًا إلى المستوى الوطني، ثم التوسع نحو بلدان أخرى عبر إحداث فروع وشراكات دولية.'
                      : 'AMYCC envisions becoming a leading cultural organization by constructing an integrated network of chapters starting provincially, expanding across all Moroccan regions, and scaling globally.'}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#e5e0d6] text-3xs font-extrabold uppercase text-[#0d3b43]">
                  {isAr ? '✓ تدرج هيكلي منظم' : 'Structured Growth'}
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-[#faf7f2] border-2 border-[#c85a32]/30 shadow-subtle hover:shadow-card hover:-translate-y-1 transition-all flex flex-col justify-between space-y-5">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="w-12 h-12 rounded-2xl bg-[#c85a32] text-white flex items-center justify-center font-black text-xl shadow-xs">
                      02
                    </span>
                    <span className="text-4xs font-bold px-2.5 py-1 rounded-full bg-[#c85a32]/10 text-[#c85a32]">
                      {isAr ? 'تكافؤ الفرص' : 'Territorial Equity'}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-[#08242a]">
                    {isAr ? 'ترسيخ الحضور وتكافؤ الفرص' : 'Equitable Cultural Access'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#445457] leading-relaxed">
                    {isAr
                      ? 'ونسعى إلى ترسيخ حضور الجمعية في مختلف المناطق، وتوفير فرص متكافئة للشباب لاكتشاف مواهبهم وتطوير قدراتهم والمشاركة في الحياة الثقافية والاجتماعية، مع تعزيز التعاون وتبادل الخبرات بين الفروع داخل المغرب وخارجه.'
                      : 'We strive to establish an enduring footprint across diverse territories, ensuring fair access for young people to discover skills and participate in cultural enrichment.'}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#e5e0d6] text-3xs font-extrabold uppercase text-[#c85a32]">
                  {isAr ? '✓ عدالة مجالية ثقافية' : 'Territorial Justice'}
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-[#faf7f2] border-2 border-[#d99b26]/30 shadow-subtle hover:shadow-card hover:-translate-y-1 transition-all flex flex-col justify-between space-y-5">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="w-12 h-12 rounded-2xl bg-[#d99b26] text-white flex items-center justify-center font-black text-xl shadow-xs">
                      03
                    </span>
                    <span className="text-4xs font-bold px-2.5 py-1 rounded-full bg-[#d99b26]/10 text-[#99620b]">
                      {isAr ? 'أفق عالمي' : 'Global Reach'}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-[#08242a]">
                    {isAr ? 'الاستدامة والامتداد الدولي' : 'Global Bridges & Human Development'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#445457] leading-relaxed">
                    {isAr
                      ? 'ونطمح إلى بناء منظمة مستدامة ذات امتداد دولي، تجمع الشباب حول قيم الإبداع والتنوع والتضامن، وتجعل من الفن والثقافة وسيلتين للتنمية الإنسانية والتقارب بين الشعوب، مع الحفاظ على الهوية والتراث المغربي والانفتاح على الثقافات العالمية.'
                      : 'We aspire to cultivate an internationally reaching organization uniting youth around creativity, using arts as bridges for intercultural dialogue and friendship.'}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#e5e0d6] text-3xs font-extrabold uppercase text-[#d99b26]">
                  {isAr ? '✓ هوية أصيلة وانفتاح عالمي' : 'Authentic Roots, Global Reach'}
                </div>
              </div>
            </div>

            {/* Strategic Staging Roadmap Bar (خارطة التدرج الاستراتيجي) */}
            <div id="roadmap" className="p-8 sm:p-10 rounded-3xl bg-[#08242a] text-white space-y-8 scroll-mt-20 relative overflow-hidden">
              <div className="absolute top-0 end-0 w-80 h-80 bg-[#c85a32]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="text-center max-w-2xl mx-auto space-y-2 relative z-10">
                <span className="text-3xs font-bold uppercase tracking-widest text-[#f4ce83] px-3 py-1 rounded-full bg-[#f4ce83]/10 border border-[#f4ce83]/20">
                  {isAr ? 'خارطة التوسع والتدرج الجغرافي' : 'Strategic Network Phasing'}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  {isAr ? 'المسار المرحلي لنمو جمعية AMYCC' : 'Phased Expansion Roadmap'}
                </h3>
                <p className="text-xs sm:text-sm text-[#d8f0f4] leading-relaxed">
                  {isAr
                    ? 'خطة مرحلية مدروسة تضمن التوسع المتوازن وتعميق الأثر الثقافي خطوة بخطوة'
                    : 'A systematic 4-phase rollout ensuring balanced community grounding and durable scaling.'}
                </p>
              </div>

              {/* 4 Connected Phases Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 relative z-10">
                <div className="p-5 rounded-2xl bg-[#0d3b43] border border-[#14505b] space-y-3 relative group hover:border-[#f4ce83]/60 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-4xs font-black bg-[#f4ce83] text-[#08242a]">
                      {isAr ? 'المرحلة 01' : 'Phase 01'}
                    </span>
                    <span className="text-xs">📍</span>
                  </div>
                  <h4 className="font-black text-base text-white">
                    {isAr ? 'المستوى الإقليمي' : 'Provincial Launch'}
                  </h4>
                  <p className="text-3xs sm:text-2xs text-[#d8f0f4] leading-relaxed">
                    {isAr
                      ? 'ترسيخ الحضور والانطلاق من مدينة مراكش ونواحيها عبر محترفات نموذجية وشراكات محلية.'
                      : 'Marrakech foundation, launching flagship model workshops and building municipal alliances.'}
                  </p>
                  <div className="pt-2 text-4xs font-bold text-[#f4ce83]">
                    {isAr ? '● جاري التفعيل' : '● In Progress'}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#0d3b43] border border-[#14505b] space-y-3 relative group hover:border-[#f4ce83]/60 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-4xs font-black bg-[#74bfcd] text-[#08242a]">
                      {isAr ? 'المرحلة 02' : 'Phase 02'}
                    </span>
                    <span className="text-xs">🏛️</span>
                  </div>
                  <h4 className="font-black text-base text-white">
                    {isAr ? 'جهات المملكة' : 'Regional Reach'}
                  </h4>
                  <p className="text-3xs sm:text-2xs text-[#d8f0f4] leading-relaxed">
                    {isAr
                      ? 'الامتداد نحو مختلف جهات المغرب بالشراكة مع المراكز الثقافية ودور الشباب والفضاءات الجمعوية.'
                      : 'Expanding across Moroccan regions through institutional pacts with cultural hubs.'}
                  </p>
                  <div className="pt-2 text-4xs font-bold text-[#74bfcd]">
                    {isAr ? '○ أفق التوسع' : '○ Target Milestone'}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#0d3b43] border border-[#14505b] space-y-3 relative group hover:border-[#f4ce83]/60 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-4xs font-black bg-[#aedfe7] text-[#08242a]">
                      {isAr ? 'المرحلة 03' : 'Phase 03'}
                    </span>
                    <span className="text-xs">🇲🇦</span>
                  </div>
                  <h4 className="font-black text-base text-white">
                    {isAr ? 'المستوى الوطني' : 'National Scale'}
                  </h4>
                  <p className="text-3xs sm:text-2xs text-[#d8f0f4] leading-relaxed">
                    {isAr
                      ? 'بناء شبكة وطنية موحدة للفروع، وتنسيق مهرجانات وملتقيات كبرى تجمع مبدعي الوطن.'
                      : 'Unified national chapter framework, large-scale annual showcases, and nation-wide civic volunteer network.'}
                  </p>
                  <div className="pt-2 text-4xs font-bold text-[#aedfe7]">
                    {isAr ? '○ الهدف الوطني' : '○ Strategic Goal'}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#0d3b43] border border-[#14505b] space-y-3 relative group hover:border-[#f4ce83]/60 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-4xs font-black bg-[#c85a32] text-white">
                      {isAr ? 'المرحلة 04' : 'Phase 04'}
                    </span>
                    <span className="text-xs">🌍</span>
                  </div>
                  <h4 className="font-black text-base text-white">
                    {isAr ? 'الامتداد الدولي' : 'Global Reach'}
                  </h4>
                  <p className="text-3xs sm:text-2xs text-[#d8f0f4] leading-relaxed">
                    {isAr
                      ? 'إحداث فروع بالخارج، وإبرام شراكات دولية للتبادل الثقافي ومشاركة الشباب بالمهرجانات العالمية.'
                      : 'International chapters, diaspora engagement, and cross-cultural exchanges celebrating Moroccan culture.'}
                  </p>
                  <div className="pt-2 text-4xs font-bold text-[#c85a32]">
                    {isAr ? '○ الأفق العالمي' : '○ Global Horizon'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            7. STRATEGIC OBJECTIVES (الأهداف الاستراتيجية الستة)
            ============================================================ */}
        <section id="objectives" className="py-20 bg-[#faf7f2] border-b border-[#e5e0d6] scroll-mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#0d3b43] px-3.5 py-1.5 rounded-full bg-[#0d3b43]/10 border border-[#0d3b43]/20">
                {isAr ? 'أهدافنا الاستراتيجية' : 'Strategic Objectives'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#08242a]">
                {isAr ? 'الأهداف المؤسسية لجمعية روح الفنون والثقافة' : 'AMYCC Core Strategic Goals'}
              </h2>
              <p className="text-sm sm:text-base text-[#445457] leading-relaxed">
                {isAr
                  ? 'ستة أهداف استراتيجية محددة بدقة توجه كافة المشاريع والبرامج الميدانية للجمعية:'
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
                      <span className="w-12 h-12 rounded-2xl bg-[#faf7f2] border border-[#e5e0d6] flex items-center justify-center text-2xl shadow-2xs group-hover:scale-110 transition-transform">
                        {obj.icon}
                      </span>
                      <span className="text-xs font-black text-[#0d3b43] font-mono px-2.5 py-0.5 rounded-full bg-[#0d3b43]/10">
                        Goal {obj.num}
                      </span>
                    </div>

                    <div>
                      <span className="text-4xs font-bold uppercase tracking-wider text-[#c85a32] block mb-1">
                        {obj.tag}
                      </span>
                      <h3 className="text-base sm:text-lg font-black text-[#08242a] mb-2 leading-snug">
                        {obj.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#445457] leading-relaxed">
                        {obj.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#f0ebe1] flex items-center justify-between text-4xs font-bold text-[#819598]">
                    <span>{isAr ? 'محور عمل رسمي' : 'Official Priority'}</span>
                    <span className="text-[#0d3b43]">✓</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            8. FLAGSHIP PROGRAM SPOTLIGHT (مبادرة شباب في العمل)
            ============================================================ */}
        <section className="py-16 bg-gradient-to-r from-[#0d3b43] via-[#08242a] to-[#04161a] text-white relative overflow-hidden">
          <div className="absolute inset-0 moroccan-star-pattern opacity-10 pointer-events-none" />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="space-y-3 max-w-2xl text-center lg:text-start">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-4xs font-bold bg-[#c85a32] text-white">
                  <span>★</span>
                  <span>{isAr ? 'البرنامج الرائد والمبادرة الميدانية' : 'Flagship Civic Initiative'}</span>
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  {isAr ? 'مبادرة شباب في العمل — AMYCC' : 'Youth in Action Initiative — AMYCC'}
                </h3>
                <p className="text-xs sm:text-sm text-[#d8f0f4] leading-relaxed">
                  {isAr
                    ? 'الذراع التطوعي والميداني للجمعية، يهدف إلى إشراك الشباب والشابات في القيادة الثقافية وتنظيم الفعاليات وصقل مهارات العمل الجماعي وخدمة المجتمع.'
                    : 'The civic and volunteer backbone of AMYCC, empowering young leaders to organize local cultural events and build valuable transferable skills.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Link
                  href={`/${locale}/programs/youth-in-action`}
                  className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-[#c85a32] hover:bg-[#b84e27] text-white transition-all shadow-xs cursor-pointer"
                >
                  {isAr ? 'استكشف مبادرة شباب في العمل ←' : 'Discover Youth in Action →'}
                </Link>
                <Link
                  href={`/${locale}/membership`}
                  className="px-5 py-3 rounded-xl text-xs sm:text-sm font-bold bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all cursor-pointer"
                >
                  {isAr ? 'تطوع معنا' : 'Volunteer With Us'}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            9. ORGANIZATIONAL STRUCTURE & GOVERNANCE (الحكامة والهيكلة الإدارية)
            ============================================================ */}
        <section id="governance" className="py-20 bg-white border-b border-[#e5e0d6] scroll-mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#c85a32] px-3.5 py-1.5 rounded-full bg-[#c85a32]/10 border border-[#c85a32]/20">
                {isAr ? 'الحكامة والهيكلة الإدارية' : 'Governance & Architecture'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#08242a]">
                {isAr ? 'الهيكلة التنظيمية والحكامة الديمقراطية' : 'Organizational Architecture'}
              </h2>
              <p className="text-sm sm:text-base text-[#445457] leading-relaxed">
                {isAr
                  ? 'هيكلة ديمقراطية وشفافة تسهر على تسيير البرامج وتطبيق النظام الأساسي للجمعية بأعلى معايير النزاهة والمسؤولية:'
                  : 'Democratic and transparent governance structure managing programs in accordance with association bylaws:'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="p-8 rounded-3xl bg-[#faf7f2] border border-[#e5e0d6] shadow-subtle text-center space-y-4 hover:border-[#0d3b43]/40 transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-[#0d3b43]/10 text-[#0d3b43] text-2xl flex items-center justify-center mx-auto shadow-2xs">
                    🏛️
                  </div>
                  <span className="text-4xs font-bold uppercase tracking-wider text-[#0d3b43] block">
                    {isAr ? 'الهيئة العليا' : 'Supreme Body'}
                  </span>
                  <h3 className="text-lg font-black text-[#08242a]">
                    {isAr ? 'الجمع العام' : 'General Assembly'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#445457] leading-relaxed">
                    {isAr
                      ? 'أعلى هيئة تقريرية في الجمعية، تضم كافة الأعضاء المنخرطين، وتصادق على التقارير الأدبية والمالية وانتخاب المكتب التنفيذي.'
                      : 'Supreme decision-making body comprising all active members, approving annual narrative and financial reports.'}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#e5e0d6] text-3xs font-bold text-[#819598]">
                  {isAr ? 'الديمقراطية التشاركية' : 'Participatory Democracy'}
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-[#faf7f2] border border-[#e5e0d6] shadow-subtle text-center space-y-4 hover:border-[#c85a32]/40 transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-[#c85a32]/10 text-[#c85a32] text-2xl flex items-center justify-center mx-auto shadow-2xs">
                    👥
                  </div>
                  <span className="text-4xs font-bold uppercase tracking-wider text-[#c85a32] block">
                    {isAr ? 'التسيير والتنفيذ' : 'Executive Leadership'}
                  </span>
                  <h3 className="text-lg font-black text-[#08242a]">
                    {isAr ? 'المكتب التنفيذي' : 'Executive Board'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#445457] leading-relaxed">
                    {isAr
                      ? 'الهيئة المسؤولة عن التدبير اليومي، تنفيذ القرارات، تمثيل الجمعية قانونيًا، والإشراف المباشر على المبادرات والشراكات.'
                      : 'Elected executive board responsible for day-to-day management, legal representation, and strategic implementation.'}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#e5e0d6] text-3xs font-bold text-[#819598]">
                  {isAr ? 'الإشراف والتمثيل القانوني' : 'Legal Oversight'}
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-[#faf7f2] border border-[#e5e0d6] shadow-subtle text-center space-y-4 hover:border-[#d99b26]/40 transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-[#d99b26]/10 text-[#99620b] text-2xl flex items-center justify-center mx-auto shadow-2xs">
                    🎨
                  </div>
                  <span className="text-4xs font-bold uppercase tracking-wider text-[#99620b] block">
                    {isAr ? 'المحاور الميدانية' : 'Action Hubs'}
                  </span>
                  <h3 className="text-lg font-black text-[#08242a]">
                    {isAr ? 'اللجان الوظيفية والميدانية' : 'Specialized Working Committees'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#445457] leading-relaxed">
                    {isAr
                      ? 'لجان متخصصة في الفنون البصرية، الموسيقى والتراث، المسرح، الإعلام والتواصل، ولجنة تنسيق مبادرة شباب في العمل.'
                      : 'Working committees dedicated to performing arts, music, media, and Youth in Action coordination.'}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#e5e0d6] text-3xs font-bold text-[#819598]">
                  {isAr ? 'التنفيذ الميداني التخصصي' : 'Specialized Operations'}
                </div>
              </div>
            </div>

            {/* Meet Team Shortcut */}
            <div className="p-6 rounded-2xl bg-[#faf7f2] border border-[#e5e0d6] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-start">
                <h4 className="text-sm font-bold text-[#08242a]">
                  {isAr ? 'هل تود التعرف على فريق العمل والمكتب التنفيذي للجمعية؟' : 'Interested in meeting our leadership team and board?'}
                </h4>
                <p className="text-xs text-[#5f7174]">
                  {isAr
                    ? 'اطلع على سير أعضاء المكتب التنفيذي واللجان الفنية في صفحة فريق العمل'
                    : 'Discover the profiles and bios of our executive leadership on the team page.'}
                </p>
              </div>
              <Link
                href={`/${locale}/team`}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#0d3b43] text-white hover:bg-[#14505b] transition-all shrink-0 cursor-pointer"
              >
                {isAr ? 'فريق العمل والمكتب التنفيذي ←' : 'Meet Our Team →'}
              </Link>
            </div>
          </div>
        </section>

        {/* ============================================================
            10. TRANSPARENCY & INTEGRITY CHARTER (ميثاق الشفافية والمسؤولية)
            ============================================================ */}
        <section id="charter" className="py-16 bg-[#faf7f2] border-b border-[#e5e0d6] scroll-mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#e5e0d6] shadow-subtle space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#f0ebe1]">
                <div className="flex items-center gap-3">
                  <span className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-2xl flex items-center justify-center shadow-2xs">
                    ⚖️
                  </span>
                  <div>
                    <h3 className="text-lg font-black text-[#08242a]">
                      {isAr ? 'ميثاق النزاهة والشفافية والحكامة الرشيدة' : 'Charter of Integrity & Governance'}
                    </h3>
                    <span className="text-3xs text-[#819598] font-bold">
                      {isAr ? 'التزام أخلاقي وقانوني صارم تجاه المجتمع والشركاء' : 'Ethical and transparent management pledge'}
                    </span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-3xs font-bold self-start sm:self-auto">
                  <span>✓</span>
                  <span>{isAr ? 'التزام رسمي مصادق عليه' : 'Officially Certified'}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#445457]">
                <div className="space-y-1.5">
                  <span className="font-bold text-[#08242a] block">
                    {isAr ? '1. التدبير المالي الدقيق' : '1. Rigorous Financial Auditing'}
                  </span>
                  <p className="leading-relaxed">
                    {isAr
                      ? 'توثيق كافة الموارد والمصارف بحسابات بنكية رسمية وإجراءات محاسبية مضبوطة تخضع للافتحاص السنوي.'
                      : 'Official banking controls and verified bookkeeping subject to annual general assembly audit.'}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="font-bold text-[#08242a] block">
                    {isAr ? '2. التقارير الدورية المفتوحة' : '2. Open Narrative & Financial Reporting'}
                  </span>
                  <p className="leading-relaxed">
                    {isAr
                      ? 'نشر التقريرين الأدبي والمالي سنوياً وإتاحة حصيلة الأنشطة والمشاريع للمنخرطين والرأي العام.'
                      : 'Annual narrative and financial reports shared openly with active members and institutional sponsors.'}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="font-bold text-[#08242a] block">
                    {isAr ? '3. تكافؤ الفرص وعدم التمييز' : '3. Equal Access & Impartiality'}
                  </span>
                  <p className="leading-relaxed">
                    {isAr
                      ? 'ضمان استفادة جميع الشباب والناشئة من برامج وورشات الجمعية دون أي تمييز مجالي أو اجتماعي.'
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
        <section className="py-16 lg:py-20 bg-gradient-to-br from-[#08242a] to-[#04161a] text-white relative overflow-hidden">
          <div className="absolute top-0 end-0 w-96 h-96 bg-[#c85a32]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 start-0 w-80 h-80 bg-[#0d3b43]/30 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c85a32]/20 border border-[#c85a32]/40 text-[#fae4dc] text-xs font-bold">
              <span>✦</span>
              <span>{isAr ? 'كن جزءاً من مسيرة الإبداع والتغيير الثقافي' : 'Be Part of the Cultural Movement in Morocco'}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              {isAr ? (
                <>
                  أبواب الجمعية مفتوحة للمبدعين، المتطوعين، <br />
                  <span className="text-[#f4ce83]">والشركاء المؤسساتيين في كل ربوع المغرب</span>
                </>
              ) : (
                'Open Doors for Artists, Volunteers, and Partners across Morocco'
              )}
            </h2>

            <p className="text-xs sm:text-base text-[#d8f0f4] max-w-2xl mx-auto leading-relaxed">
              {isAr
                ? 'سواء كنت شاباً موهوباً يبحث عن صقل قدراته، فناناً يرغب في مشاركة خبرته، متطوعاً يسعى لخدمة المجتمع، أو مؤسسة ترغب في بناء شراكة هادفة، نرحب بك معنا.'
                : 'Whether you are a budding artist, a committed volunteer, or an institution seeking collaborative cultural impact, AMYCC welcomes you.'}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href={`/${locale}/membership`}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-black text-white bg-[#c85a32] hover:bg-[#b84e27] active:scale-95 transition-all text-xs sm:text-sm shadow-card cursor-pointer"
              >
                {dict.membership.apply}
              </Link>

              <Link
                href={`/${locale}/programs/youth-in-action`}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-white bg-[#0d3b43] hover:bg-[#14505b] border border-[#268292]/50 transition-all text-xs sm:text-sm cursor-pointer"
              >
                {isAr ? 'مبادرة شباب في العمل' : 'Youth in Action Hub'}
              </Link>

              <Link
                href={`/${locale}/partnerships`}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-[#f4ce83] border border-[#f4ce83]/40 hover:bg-[#f4ce83]/10 transition-all text-xs sm:text-sm cursor-pointer"
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

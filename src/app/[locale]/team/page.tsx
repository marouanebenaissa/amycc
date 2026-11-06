import { getDictionary } from '@/lib/i18n/dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import { getTeamSettings, getCommissionsSettings, defaultTeamHeroConfig } from '@/lib/settings'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'

export const revalidate = 0

export default async function TeamPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const dict = await getDictionary(locale)
  const isAr = locale === 'ar'
  const isFr = locale === 'fr'

  // Fetch dynamic team configuration & commissions from site settings (Supabase / defaults)
  const [teamSettings, commissionsSettings] = await Promise.all([
    getTeamSettings(),
    getCommissionsSettings(),
  ])

  const enabledMembers = teamSettings.members.filter((m) => m.enabled !== false)

  // Executive Board Members (fallback to default statutory members if empty)
  const executiveMembers =
    enabledMembers.filter((m) => m.category === 'executive').length > 0
      ? enabledMembers.filter((m) => m.category === 'executive')
      : enabledMembers
  // Committee Coordinators & Working Members
  const committeeMembers = enabledMembers.filter((m) => m.category === 'committee')
  // Advisory Board & Mentors
  const advisorMembers = enabledMembers.filter((m) => m.category === 'advisor')

  // Dynamic Commissions & Section texts
  const commTag = isAr ? commissionsSettings.sectionTagAr : isFr ? (commissionsSettings.sectionTagFr || commissionsSettings.sectionTagAr) : (commissionsSettings.sectionTagEn || commissionsSettings.sectionTagAr)
  const commTitle = isAr ? commissionsSettings.sectionTitleAr : isFr ? (commissionsSettings.sectionTitleFr || commissionsSettings.sectionTitleAr) : (commissionsSettings.sectionTitleEn || commissionsSettings.sectionTitleAr)
  const commDesc = isAr ? commissionsSettings.sectionDescAr : isFr ? (commissionsSettings.sectionDescFr || commissionsSettings.sectionDescAr) : (commissionsSettings.sectionDescEn || commissionsSettings.sectionDescAr)
  const activeCommissions = commissionsSettings.items.filter((item) => item.enabled !== false)

  // Dynamic Team Hero Settings
  const teamHero = teamSettings.hero || defaultTeamHeroConfig
  const heroImageUrl = teamHero.imageUrl
  const hasHeroImage = Boolean(teamHero.showImage !== false && heroImageUrl)

  // Hero texts with trilingual fallbacks
  const heroBadge1 = isAr
    ? (teamHero.badge1Ar || defaultTeamHeroConfig.badge1Ar)
    : isFr
    ? (teamHero.badge1Fr || teamHero.badge1Ar || defaultTeamHeroConfig.badge1Fr)
    : (teamHero.badge1En || teamHero.badge1Ar || defaultTeamHeroConfig.badge1En)

  const heroBadge2 = isAr
    ? (teamHero.badge2Ar || defaultTeamHeroConfig.badge2Ar)
    : isFr
    ? (teamHero.badge2Fr || teamHero.badge2Ar || defaultTeamHeroConfig.badge2Fr)
    : (teamHero.badge2En || teamHero.badge2Ar || defaultTeamHeroConfig.badge2En)

  const heroTitle = isAr
    ? (teamHero.titleAr || defaultTeamHeroConfig.titleAr)
    : isFr
    ? (teamHero.titleFr || teamHero.titleAr || defaultTeamHeroConfig.titleFr)
    : (teamHero.titleEn || teamHero.titleAr || defaultTeamHeroConfig.titleEn)

  const heroDesc = isAr
    ? (teamHero.descriptionAr || defaultTeamHeroConfig.descriptionAr)
    : isFr
    ? (teamHero.descriptionFr || teamHero.descriptionAr || defaultTeamHeroConfig.descriptionFr)
    : (teamHero.descriptionEn || teamHero.descriptionAr || defaultTeamHeroConfig.descriptionEn)

  // The 4 Collective Leadership Principles
  const principles = [
    {
      num: '01',
      title: isAr ? 'الديمقراطية التشاركية' : isFr ? 'Démocratie Participative' : 'Participatory Democracy',
      desc: isAr
        ? 'اتخاذ القرارات بروح التوافق والتشاور المستمر بين المكتب التنفيذي واللجان الفنية، وإشراك كافة الأعضاء في بلورة المشاريع.'
        : isFr
        ? 'Prise de décision collective, consultation continue et implication des membres dans l’élaboration et l’évaluation des projets.'
        : 'Consensus-driven decision making, regular consultations across committees, and inclusive engagement in program design.',
      icon: '🗳️',
    },
    {
      num: '02',
      title: isAr ? 'ربط المسؤولية بالمحاسبة' : isFr ? 'Responsabilité & Rigueur' : 'Accountability & Integrity',
      desc: isAr
        ? 'كل مهمة إدارية أو فنية تخضع للتقييم الموضوعي الدوري، مع تقديم تقارير مفصلة تعكس حجم الأثر المحقق في الميدان بكل نزاهة.'
        : isFr
        ? 'Chaque responsabilité fait l’objet d’un bilan périodique rigoureux, garantissant la conformité morale et opérationnelle.'
        : 'Every mandate is subject to transparent milestone reviews, upholding institutional integrity and verified field impact.',
      icon: '⚖️',
    },
    {
      num: '03',
      title: isAr ? 'التداول وصناعة القادة' : isFr ? 'Alternance & Relève' : 'Rotation & Youth Leadership',
      desc: isAr
        ? 'إفساح المجال أمام الطاقات الشابة لتحمل أدوار قيادية داخل اللجان، وتشجيع المبادرات الفردية والجماعية لضمان استدامة العمل.'
        : isFr
        ? 'Promotion active des jeunes vers des responsabilités dirigeantes pour assurer le renouvellement continu et l’innovation.'
        : 'Empowering young leaders to take ownership of committee responsibilities, fostering continuous renewal and civic succession.',
      icon: '🌱',
    },
    {
      num: '04',
      title: isAr ? 'الشفافية والوضوح المؤسساتي' : isFr ? 'Transparence Absolue' : 'Institutional Transparency',
      desc: isAr
        ? 'التزام مطلق بإتاحة السجلات الإدارية والتقارير المالية للجمع العام والشركاء، ونشر حصيلة البرامج السنوية للرأي العام.'
        : isFr
        ? 'Accès ouvert aux bilans administratifs et financiers lors de chaque assemblée générale et communication publique des résultats.'
        : 'Complete openness of narrative and financial reports before the general assembly, partners, and public stakeholders.',
      icon: '💎',
    },
  ]

  return (
    <>
      <Header locale={locale} dict={dict} />

      <main id="main-content" className="flex-1 bg-[#FAF8F5]">
        {/* ============================================================
            1. HERO BANNER (Full-Bleed Moroccan Cinematic Hero or Ambient Pattern)
            ============================================================ */}
        <section className={`relative overflow-hidden border-b transition-colors ${
          hasHeroImage
            ? 'min-h-[540px] sm:min-h-[580px] lg:min-h-[640px] flex items-center bg-[#231f20] text-white pt-16 pb-20 lg:pt-24 lg:pb-28 border-[#231f20]'
            : 'bg-gradient-to-b from-[#F5F3EE] via-[#FEF6CC] to-[#F5F3EE] border-[#e5e0d6] pt-14 pb-16 lg:pt-20 lg:pb-24'
        }`}>
          {/* Background Layer */}
          {hasHeroImage ? (
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
              <ImageWithFallback
                src={heroImageUrl!}
                fallbackSrc="/images/youth-in-action.jpg"
                alt="AMYCC Team Hero Banner"
                fill
                priority
                sizes="100vw"
                className="object-cover object-center"
              />
              {/* Cinematic Moroccan Vignette & Dark Backdrops for perfect high-contrast typography */}
              <div className="absolute inset-0 bg-black/45" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#231f20]/95 via-[#231f20]/70 to-[#231f20]/95" />
              <div className="absolute inset-0 moroccan-star-pattern opacity-15 pointer-events-none" />
              <div className="absolute top-1/4 start-1/4 w-96 h-96 bg-[#bd3227]/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-10 end-10 w-96 h-96 bg-[#ffd22f]/15 rounded-full blur-3xl pointer-events-none" />
            </div>
          ) : (
            <>
              <div className="absolute inset-0 moroccan-pattern-light opacity-60 pointer-events-none" aria-hidden="true" />
              <div className="absolute top-1/3 start-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#bd3227]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 end-12 w-72 h-72 bg-[#231f20]/10 rounded-full blur-3xl pointer-events-none" />
            </>
          )}

          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            {/* Breadcrumb Navigation */}
            <nav className={`flex items-center justify-center gap-2 text-xs sm:text-sm font-bold ${
              hasHeroImage ? 'text-white/80' : 'text-[#5C5A55]'
            }`}>
              <Link href={`/${locale}`} className={`${hasHeroImage ? 'hover:text-white' : 'hover:text-[#231f20]'} transition-colors`}>
                {isAr ? 'الرئيسية' : isFr ? 'Accueil' : 'Home'}
              </Link>
              <span>/</span>
              <Link href={`/${locale}/about`} className={`${hasHeroImage ? 'hover:text-white' : 'hover:text-[#231f20]'} transition-colors`}>
                {isAr ? 'عن الجمعية' : isFr ? 'Association' : 'About'}
              </Link>
              <span>/</span>
              <span className={hasHeroImage ? 'text-[#ffd22f]' : 'text-[#bd3227]'}>
                {isAr ? 'فريق العمل والهيكلة' : isFr ? 'Équipe & Direction' : 'Our Team & Structure'}
              </span>
            </nav>

            {/* Badges Bar */}
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {heroBadge1 && (
                <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-2xs backdrop-blur-md ${
                  hasHeroImage
                    ? 'bg-white/10 border border-white/20 text-white'
                    : 'bg-[#231f20]/10 border border-[#231f20]/20 text-[#231f20]'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${hasHeroImage ? 'bg-[#ffd22f]' : 'bg-[#bd3227]'} animate-pulse`} />
                  <span>{heroBadge1}</span>
                </span>
              )}

              {heroBadge2 && (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-2xs backdrop-blur-md ${
                  hasHeroImage
                    ? 'bg-white/10 border border-white/20 text-[#ffd22f]'
                    : 'bg-[#d2a82b]/10 border border-[#d2a82b]/20 text-[#d2a82b]'
                }`}>
                  <span>📍</span>
                  <span>{heroBadge2}</span>
                </span>
              )}
            </div>

            {/* Main Headline */}
            <div className="text-center max-w-4xl mx-auto space-y-4">
              <h1 className={`text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight whitespace-pre-line ${
                hasHeroImage ? 'text-white drop-shadow-sm' : 'text-[#231f20]'
              }`}>
                {heroTitle}
              </h1>

              <p className={`text-sm sm:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed text-balance ${
                hasHeroImage ? 'text-[#E2DED6]/95 font-normal' : 'text-[#5C5A55] font-medium'
              }`}>
                {heroDesc}
              </p>
            </div>

            {/* In-Page Quick Navigation */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <a
                href="#executive-board"
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-2xs ${
                  hasHeroImage
                    ? 'bg-white/10 hover:bg-white hover:text-[#231f20] text-white border border-white/25 backdrop-blur-md'
                    : 'bg-white border border-[#cfc7b9] text-[#231f20] hover:border-[#bd3227] hover:text-[#bd3227]'
                }`}
              >
                {isAr ? '🏛️ المكتب التنفيذي (6)' : isFr ? '🏛️ Bureau Exécutif (6)' : '🏛️ Executive Board (6)'}
              </a>
              <a
                href="#commissions"
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-2xs ${
                  hasHeroImage
                    ? 'bg-white/10 hover:bg-white hover:text-[#231f20] text-white border border-white/25 backdrop-blur-md'
                    : 'bg-white border border-[#cfc7b9] text-[#231f20] hover:border-[#bd3227] hover:text-[#bd3227]'
                }`}
              >
                {isAr ? '🎨 اللجان الوظيفية (6)' : isFr ? '🎨 Commissions Thématiques (6)' : '🎨 Specialized Commissions (6)'}
              </a>
              <a
                href="#architecture"
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-2xs ${
                  hasHeroImage
                    ? 'bg-white/10 hover:bg-white hover:text-[#231f20] text-white border border-white/25 backdrop-blur-md'
                    : 'bg-white border border-[#cfc7b9] text-[#231f20] hover:border-[#bd3227] hover:text-[#bd3227]'
                }`}
              >
                {isAr ? '⚖️ الهيكلة التشاركية' : isFr ? '⚖️ Modèle Démocratique' : '⚖️ Democratic Model'}
              </a>
              <a
                href="#principles"
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-2xs ${
                  hasHeroImage
                    ? 'bg-white/10 hover:bg-white hover:text-[#231f20] text-white border border-white/25 backdrop-blur-md'
                    : 'bg-white border border-[#cfc7b9] text-[#231f20] hover:border-[#bd3227] hover:text-[#bd3227]'
                }`}
              >
                {isAr ? '💎 مبادئ التسيير (4)' : isFr ? '💎 Piliers de Leadership (4)' : '💎 Leadership Pillars (4)'}
              </a>
              <a
                href="#join"
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-2xs ${
                  hasHeroImage
                    ? 'bg-[#ffd22f] hover:bg-[#ffd22f] text-[#231f20] border border-[#ffd22f]'
                    : 'bg-white border border-[#cfc7b9] text-[#231f20] hover:border-[#bd3227] hover:text-[#bd3227]'
                }`}
              >
                {isAr ? '🚀 انضم لفريقنا' : isFr ? '🚀 Nous Rejoindre' : '🚀 Join Our Team'}
              </a>
            </div>
          </div>
        </section>

        {/* ============================================================
            2. INSTITUTIONAL METRICS & CAPACITY STRIP (4 CARDS)
            ============================================================ */}
        <section className="py-12 bg-white border-b border-[#e5e0d6]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {/* Card 1: 6 Statutory Roles */}
              <div className="p-5 sm:p-6 rounded-3xl bg-[#FAF8F5] border border-[#e5e0d6] hover:border-[#231f20]/30 transition-all text-center flex flex-col justify-between group shadow-2xs">
                <span className="text-xs font-bold text-[#5C5A55] block mb-1">
                  {isAr ? 'المكتب التنفيذي المنتخب' : isFr ? 'Bureau Exécutif Élu' : 'Elected Executive Board'}
                </span>
                <div className="min-h-[3rem] flex items-center justify-center">
                  <span className="text-xl sm:text-2xl font-black text-[#231f20] group-hover:scale-105 transition-transform block whitespace-nowrap">
                    {isAr ? '6 مناصب قانونية' : isFr ? '6 Postes Statutaires' : '6 Statutory Roles'}
                  </span>
                </div>
                <p className="text-xs text-[#5C5A55] leading-relaxed mt-2 text-balance">
                  {isAr
                    ? 'تسيير إداري ومالي مطابق لظهير تأسيس الجمعيات بالمغرب'
                    : isFr
                    ? 'Direction administrative conforme au Dahir associatif marocain'
                    : 'Administrative management governed by Moroccan non-profit law.'}
                </p>
              </div>

              {/* Card 2: 6 Specialized Hubs */}
              <div className="p-5 sm:p-6 rounded-3xl bg-[#FAF8F5] border border-[#e5e0d6] hover:border-[#bd3227]/30 transition-all text-center flex flex-col justify-between group shadow-2xs">
                <span className="text-xs font-bold text-[#5C5A55] block mb-1">
                  {isAr ? 'اللجان الميدانية المتخصصة' : isFr ? 'Commissions Thématiques' : 'Specialized Commissions'}
                </span>
                <div className="min-h-[3rem] flex items-center justify-center">
                  <span className="text-xl sm:text-2xl font-black text-[#bd3227] group-hover:scale-105 transition-transform block whitespace-nowrap">
                    {isAr ? '6 محاور وظيفية' : isFr ? '6 Pôles d’Action' : '6 Functional Hubs'}
                  </span>
                </div>
                <p className="text-xs text-[#5C5A55] leading-relaxed mt-2 text-balance">
                  {isAr
                    ? 'الفنون التشكيلية، المسرح، الموسيقى، الإعلام، والتطوع والتكوين'
                    : isFr
                    ? 'Arts visuels, théâtre, musique, médias, volontariat et formation'
                    : 'Visual arts, theatre, music, media, volunteering, and training.'}
                </p>
              </div>

              {/* Card 3: 100% Civic Volunteering */}
              <div className="p-5 sm:p-6 rounded-3xl bg-[#FAF8F5] border border-[#e5e0d6] hover:border-[#d2a82b]/30 transition-all text-center flex flex-col justify-between group shadow-2xs">
                <span className="text-xs font-bold text-[#5C5A55] block mb-1">
                  {isAr ? 'روح العمل الجمعوي' : isFr ? 'Engagement Associatif' : 'Civic Dedication'}
                </span>
                <div className="min-h-[3rem] flex items-center justify-center">
                  <span className="text-xl sm:text-2xl font-black text-[#d2a82b] group-hover:scale-105 transition-transform block whitespace-nowrap">
                    {isAr ? '100% تطوع مدني' : isFr ? '100% Volontariat' : '100% Civic Service'}
                  </span>
                </div>
                <p className="text-xs text-[#5C5A55] leading-relaxed mt-2 text-balance">
                  {isAr
                    ? 'عطاء غير ربحي تحركه المسؤولية الأخلاقية والوطنية تجاه الشباب'
                    : isFr
                    ? 'Engagement désintéressé guidé par la passion culturelle'
                    : 'Non-profit dedication driven by cultural passion and civic mission.'}
                </p>
              </div>

              {/* Card 4: Geographic Scope */}
              <div className="p-5 sm:p-6 rounded-3xl bg-[#FAF8F5] border border-[#e5e0d6] hover:border-[#231f20]/30 transition-all text-center flex flex-col justify-between group shadow-2xs">
                <span className="text-xs font-bold text-[#5C5A55] block mb-1">
                  {isAr ? 'النطاق والمقر' : isFr ? 'Siège & Rayonnement' : 'Headquarters & Scope'}
                </span>
                <div className="min-h-[3rem] flex items-center justify-center">
                  <span className="text-xl sm:text-2xl font-black text-[#231f20] group-hover:scale-105 transition-transform block whitespace-nowrap">
                    {isAr ? 'مراكش • جهات المغرب' : isFr ? 'Marrakech • Maroc' : 'Marrakech • Morocco'}
                  </span>
                </div>
                <p className="text-xs text-[#5C5A55] leading-relaxed mt-2 text-balance">
                  {isAr
                    ? 'انطلاق من مراكش الحمراء مع الانفتاح على كافة جهات المملكة'
                    : isFr
                    ? 'Ancrage à Marrakech avec extension vers toutes les régions'
                    : 'Grounded in Marrakech with phased expansion across all regions.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            3. EXECUTIVE BOARD SECTION (المكتب التنفيذي للجمعية)
            ============================================================ */}
        <section id="executive-board" className="py-20 bg-[#FAF8F5] border-b border-[#e5e0d6] scroll-mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#231f20] px-3.5 py-1.5 rounded-full bg-[#231f20]/10 border border-[#231f20]/20">
                {isAr ? 'الجهاز التنفيذي والإداري' : isFr ? 'Instance Exécutive & Légale' : 'Executive & Statutory Body'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#231f20]">
                {isAr ? 'المكتب التنفيذي لجمعية روح الفنون والثقافة' : isFr ? 'Bureau Exécutif de l’AMYCC' : 'Executive Board of AMYCC'}
              </h2>
              <p className="text-sm sm:text-base text-[#5C5A55] leading-relaxed text-balance">
                {isAr
                  ? 'يتولى المكتب التنفيذي، المنتخب وفق مقتضيات الظهير الشريف رقم 1.58.376 المنظم للحق في تأسيس الجمعيات بالمملكة المغربية والنظام الأساسي للجمعية، التدبير اليومي، تمثيل الجمعية رسمياً، ومتابعة تنفيذ القرارات التشاركية الصادرة عن الجمع العام.'
                  : isFr
                  ? 'Élu conformément au Dahir n° 1-58-376 et aux statuts officiels, le bureau exécutif assure la gestion quotidienne, la représentation légale et la mise en œuvre rigoureuse des orientations adoptées.'
                  : 'Governed by Moroccan Dahir No. 1.58.376 and statutory bylaws, the elected executive board manages day-to-day operations, legal representation, and the faithful implementation of General Assembly resolutions.'}
              </p>
            </div>

            {/* Executive Board Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {executiveMembers.map((member) => {
                const name = isAr ? member.nameAr : isFr ? (member.nameFr || member.nameAr) : (member.nameEn || member.nameAr)
                const role = isAr ? member.roleAr : isFr ? (member.roleFr || member.roleAr) : (member.roleEn || member.roleAr)
                const titleStatus = isAr ? member.titleStatusAr : isFr ? (member.titleStatusFr || member.titleStatusAr) : (member.titleStatusEn || member.titleStatusAr)
                const desc = isAr ? member.descAr : isFr ? (member.descFr || member.descAr) : (member.descEn || member.descAr)
                const duties = (isAr ? member.dutiesAr : isFr ? (member.dutiesFr?.length ? member.dutiesFr : member.dutiesAr) : (member.dutiesEn?.length ? member.dutiesEn : member.dutiesAr)) || []

                // Dynamic badge palettes per officer role
                const isPresident = member.id === 'president' || role.includes('رئيس')
                const isSecretary = member.id.includes('secretary') || role.includes('كاتب')
                const isTreasurer = member.id.includes('treasurer') || role.includes('مال')

                const roleBadgeStyle = isPresident
                  ? 'bg-[#231f20] text-white shadow-[#231f20]/20'
                  : isSecretary
                  ? 'bg-[#bd3227] text-white shadow-[#bd3227]/20'
                  : isTreasurer
                  ? 'bg-[#d2a82b] text-white shadow-[#d2a82b]/20'
                  : 'bg-[#d2a82b] text-white shadow-[#d2a82b]/20'

                // Clean initial for executive monogram avatar
                const rawName = (name || role || '').replace(/^(ذ\.|د\.|أستاذ|أستاذة|الدكتور|الدكتورة)\s*/, '').trim()
                const initial = rawName ? rawName.charAt(0) : '✦'

                return (
                  <div
                    key={member.id}
                    className="group relative rounded-3xl bg-white border border-[#e5e0d6] hover:border-[#231f20]/30 shadow-subtle hover:shadow-xl hover:-translate-y-2 transition-all duration-300 p-6 sm:p-7 space-y-5"
                  >
                    {/* 1. Portrait Avatar & Details */}
                    <div className="flex flex-col items-center text-center">
                      <div className="relative group/photo mb-3">
                        {member.photoUrl ? (
                          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-2 border-[#e5e0d6] shadow-md ring-4 ring-[#F5F3EE] group-hover:ring-[#bd3227]/30 transition-all relative bg-neutral-100">
                            <ImageWithFallback
                              src={member.photoUrl}
                              alt={name || role}
                              width={128}
                              height={128}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        ) : (
                          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-[#F5F3EE] via-white to-[#FEF6CC] border-2 border-[#e5e0d6] shadow-md ring-4 ring-[#F5F3EE] flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                            <div className="absolute inset-0 moroccan-pattern-light opacity-60" />
                            <span className="text-4xl sm:text-5xl font-black text-[#231f20] relative z-10 font-arabic">
                              {initial}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Member Full Name */}
                      {name ? (
                        <h3 className="text-xl sm:text-2xl font-black text-[#231f20] tracking-tight group-hover:text-[#bd3227] transition-colors leading-tight">
                          {name}
                        </h3>
                      ) : (
                        <h3 className="text-lg sm:text-xl font-bold text-[#5C5A55] italic">
                          {isAr ? 'عضوية معتمدة' : 'Mandat Nominatif'}
                        </h3>
                      )}

                      {/* Role Pill Badge */}
                      <div className="mt-2.5 flex items-center justify-center">
                        <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black shadow-xs ${roleBadgeStyle}`}>
                          <span>{role}</span>
                        </span>
                      </div>

                      {/* Mandate / Scope */}
                      {titleStatus && (
                        <p className="text-2xs sm:text-xs font-bold text-[#5C5A55] uppercase tracking-wider mt-2 max-w-xs">
                          {titleStatus}
                        </p>
                      )}
                    </div>

                    {/* 2. Bio / Editorial Description */}
                    {desc && (
                      <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D6] text-xs sm:text-sm text-[#5C5A55] leading-relaxed text-center sm:text-start">
                        {desc}
                      </div>
                    )}

                    {/* 3. Core Duties / Focus Responsibilities */}
                    {duties.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-[#E5E0D6]">
                        <span className="text-2xs font-bold text-[#5C5A55] uppercase tracking-wider block">
                          {isAr ? 'أبرز الصلاحيات والمهام:' : isFr ? 'Missions & Responsabilités :' : 'Key Responsibilities:'}
                        </span>
                        <ul className="space-y-1.5">
                          {duties.map((duty, dIdx) => (
                            <li
                              key={dIdx}
                              className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-[#e5e0d6] hover:border-[#231f20]/30 transition-colors text-xs text-[#231f20] font-medium shadow-2xs"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-[#bd3227] shrink-0" />
                              <span className="leading-snug">{duty}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ============================================================
            4. THE SPECIALIZED COMMISSIONS (اللجان الوظيفية والميدانية)
            ============================================================ */}
        <section id="commissions" className="py-20 bg-white border-b border-[#e5e0d6] scroll-mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#bd3227] px-3.5 py-1.5 rounded-full bg-[#bd3227]/10 border border-[#bd3227]/20">
                {commTag}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#231f20]">
                {commTitle}
              </h2>
              <p className="text-sm sm:text-base text-[#5C5A55] leading-relaxed text-balance">
                {commDesc}
              </p>
            </div>

            {/* Commissions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {activeCommissions.map((comm) => {
                const title = isAr ? comm.titleAr : isFr ? (comm.titleFr || comm.titleAr) : (comm.titleEn || comm.titleAr)
                const tag = isAr ? comm.tagAr : isFr ? (comm.tagFr || comm.tagAr) : (comm.tagEn || comm.tagAr)
                const desc = isAr ? comm.descAr : isFr ? (comm.descFr || comm.descAr) : (comm.descEn || comm.descAr)
                const points = (isAr ? comm.pointsAr : isFr ? (comm.pointsFr?.length ? comm.pointsFr : comm.pointsAr) : (comm.pointsEn?.length ? comm.pointsEn : comm.pointsAr)) || []
                const targetLocales = isAr ? comm.targetLocalesAr : isFr ? (comm.targetLocalesFr || comm.targetLocalesAr) : (comm.targetLocalesEn || comm.targetLocalesAr)
                const statusBadge = isAr ? comm.statusBadgeAr : isFr ? (comm.statusBadgeFr || comm.statusBadgeAr) : (comm.statusBadgeEn || comm.statusBadgeAr)

                return (
                  <div
                    key={comm.id}
                    className={`p-7 rounded-3xl bg-[#FAF8F5] border ${comm.borderClass || 'border-[#bd3227]/30 hover:border-[#bd3227]'} shadow-subtle hover:shadow-card hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden`}
                  >
                    <div className="space-y-4">
                      {/* Header: Icon & Category Tag */}
                      <div className="flex items-center justify-between">
                        <span className="w-14 h-14 rounded-2xl bg-white border border-[#e5e0d6] flex items-center justify-center text-3xl shadow-2xs group-hover:scale-110 transition-transform">
                          {comm.icon}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${comm.accentBg || 'bg-[#bd3227]/10'} ${comm.accentColor || 'text-[#bd3227]'} border border-current/20`}>
                          {tag}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-xl font-black text-[#231f20] mb-2 leading-snug">
                          {title}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#5C5A55] leading-relaxed">
                          {desc}
                        </p>
                      </div>

                      {/* Operational Pillars Checklist */}
                      {points.length > 0 && (
                        <div className="space-y-2 pt-3 border-t border-[#e5e0d6]">
                          <span className="text-2xs font-bold text-[#5C5A55] uppercase tracking-wider block">
                            {isAr ? 'أبرز التدخلات والأنشطة الميدانية:' : isFr ? 'Interventions Clés sur le Terrain :' : 'Key Field Interventions:'}
                          </span>
                          <ul className="space-y-1.5 text-xs text-[#231f20]">
                            {points.map((pt, pIdx) => (
                              <li key={pIdx} className="flex items-start gap-2.5 p-2 rounded-xl bg-white border border-[#e5e0d6] shadow-2xs">
                                <span className={`${comm.accentColor || 'text-[#bd3227]'} font-bold text-sm shrink-0 leading-none`}>✦</span>
                                <span className="leading-snug">{pt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Commission Target Locales Footer */}
                    <div className="pt-4 mt-6 border-t border-[#e5e0d6] flex items-center justify-between text-2xs font-bold text-[#5C5A55]">
                      <span>{targetLocales || (isAr ? 'فضاءات الثقافة ودور الشباب' : 'Centres Culturels & Jeunesse')}</span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-3xs font-bold border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>{statusBadge || (isAr ? 'تأطير نشط' : 'Actif')}</span>
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Specialized Coordinators / Committee Members (when configured in admin) */}
            {committeeMembers.length > 0 && (
              <div className="pt-8 border-t border-[#e5e0d6] space-y-6">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <h3 className="text-xl sm:text-2xl font-black text-[#231f20]">
                    {isAr ? 'منسقو ومؤطرو اللجان الوظيفية' : isFr ? 'Coordinateurs & Encadrants des Commissions' : 'Commission Coordinators & Mentors'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C5A55]">
                    {isAr
                      ? 'كفاءات ميدانية شابة تسهر على التسيير العملياتي للبرامج والورشات الفنية'
                      : isFr
                      ? 'Énergies de terrain assurant l’animation opérationnelle des projets culturels'
                      : 'Dedicated coordinators driving creative operations across artistic workshops'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {committeeMembers.map((member) => {
                    const name = isAr ? member.nameAr : isFr ? (member.nameFr || member.nameAr) : (member.nameEn || member.nameAr)
                    const role = isAr ? member.roleAr : isFr ? (member.roleFr || member.roleAr) : (member.roleEn || member.roleAr)
                    const titleStatus = isAr ? member.titleStatusAr : isFr ? (member.titleStatusFr || member.titleStatusAr) : (member.titleStatusEn || member.titleStatusAr)
                    const badgeStatus = isAr ? member.badgeStatusAr : isFr ? (member.badgeStatusFr || member.badgeStatusAr) : (member.badgeStatusEn || member.badgeStatusAr)
                    const desc = isAr ? member.descAr : isFr ? (member.descFr || member.descAr) : (member.descEn || member.descAr)
                    const duties = (isAr ? member.dutiesAr : isFr ? (member.dutiesFr?.length ? member.dutiesFr : member.dutiesAr) : (member.dutiesEn?.length ? member.dutiesEn : member.dutiesAr)) || []

                    return (
                      <div
                        key={member.id}
                        className={`p-6 rounded-3xl bg-white border ${member.colorClass} shadow-subtle hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group`}
                      >
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            {member.photoUrl ? (
                              <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-xs ring-2 ring-[#bd3227]/20 group-hover:ring-[#bd3227]/50 transition-all shrink-0 relative bg-neutral-100">
                                <ImageWithFallback
                                  src={member.photoUrl}
                                  alt={name || role}
                                  width={56}
                                  height={56}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                              </div>
                            ) : (
                              <span className="w-14 h-14 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] flex items-center justify-center text-2xl shadow-2xs group-hover:scale-110 transition-transform shrink-0">
                                {member.icon || '👤'}
                              </span>
                            )}

                            <div className="min-w-0">
                              <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${member.accentBg}`}>
                                {badgeStatus || (isAr ? 'تأطير وتنسيق' : isFr ? 'Coordination' : 'Coordination')}
                              </span>
                              {name && (
                                <h4 className="text-base font-black text-[#231f20] mt-1 truncate">
                                  {name}
                                </h4>
                              )}
                              <div className={`font-bold ${name ? 'text-xs text-[#bd3227]' : 'text-base font-black text-[#231f20] mt-1'}`}>
                                {role}
                              </div>
                            </div>
                          </div>

                          {titleStatus && (
                            <div className="text-xs font-bold text-[#5C5A55] uppercase tracking-wider">
                              {titleStatus}
                            </div>
                          )}

                          {desc && (
                            <p className="text-xs text-[#5C5A55] leading-relaxed">
                              {desc}
                            </p>
                          )}

                          {duties.length > 0 && (
                            <ul className="space-y-1 pt-2 border-t border-[#E5E0D6] text-xs text-[#5C5A55]">
                              {duties.map((duty, dIdx) => (
                                <li key={dIdx} className="flex items-start gap-1.5">
                                  <span className="text-emerald-600 font-bold">✓</span>
                                  <span>{duty}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Advisory Board & Mentors (when configured in admin) */}
        {advisorMembers.length > 0 && (
          <section id="advisors" className="py-20 bg-white border-b border-[#e5e0d6] scroll-mt-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              <div className="text-center max-w-3xl mx-auto space-y-3">
                <span className="text-xs font-bold uppercase tracking-widest text-[#d2a82b] px-3.5 py-1.5 rounded-full bg-[#d2a82b]/10 border border-[#d2a82b]/20">
                  {isAr ? 'الخبرة والمواكبة الاستراتيجية' : isFr ? 'Conseil & Mentorat' : 'Advisory & Mentorship'}
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-[#231f20]">
                  {isAr ? 'الهيئة الاستشارية والخبراء' : isFr ? 'Cercle Consultatif & Experts' : 'Advisory & Mentorship Circle'}
                </h2>
                <p className="text-sm sm:text-base text-[#5C5A55] leading-relaxed text-balance">
                  {isAr
                    ? 'شخصيات ثقافية وفنية وأكاديمية تواكب مسيرة الجمعية بخبرتها وتقدم التوجيه والمشورة لتطوير المبادرات المجتمعية.'
                    : isFr
                    ? 'Personnalités culturelles et académiques apportant leur expertise et conseil pour enrichir les initiatives associatives.'
                    : 'Eminent cultural and academic figures lending their seasoned guidance and mentorship to AMYCC community initiatives.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {advisorMembers.map((member) => {
                  const name = isAr ? member.nameAr : isFr ? (member.nameFr || member.nameAr) : (member.nameEn || member.nameAr)
                  const role = isAr ? member.roleAr : isFr ? (member.roleFr || member.roleAr) : (member.roleEn || member.roleAr)
                  const titleStatus = isAr ? member.titleStatusAr : isFr ? (member.titleStatusFr || member.titleStatusAr) : (member.titleStatusEn || member.titleStatusAr)
                  const badgeStatus = isAr ? member.badgeStatusAr : isFr ? (member.badgeStatusFr || member.badgeStatusAr) : (member.badgeStatusEn || member.badgeStatusAr)
                  const desc = isAr ? member.descAr : isFr ? (member.descFr || member.descAr) : (member.descEn || member.descAr)

                  return (
                    <div
                      key={member.id}
                      className={`p-6 rounded-3xl bg-[#FAF8F5] border ${member.colorClass} shadow-subtle hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group`}
                    >
                      <div className="space-y-4">
                        <div className="flex items-center gap-3.5">
                          {member.photoUrl ? (
                            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-xs ring-2 ring-[#d2a82b]/30 group-hover:ring-[#d2a82b]/60 transition-all shrink-0 relative bg-neutral-100">
                              <ImageWithFallback
                                src={member.photoUrl}
                                alt={name || role}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                          ) : (
                            <span className="w-16 h-16 rounded-2xl bg-white border border-[#e5e0d6] flex items-center justify-center text-3xl shadow-2xs group-hover:scale-110 transition-transform shrink-0">
                              {member.icon || '🌟'}
                            </span>
                          )}

                          <div className="min-w-0">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${member.accentBg}`}>
                              {badgeStatus || (isAr ? 'عضوية شرفية واستشارية' : isFr ? 'Membre Consultatif' : 'Advisory Member')}
                            </span>
                            {name && (
                              <h3 className="text-base sm:text-lg font-black text-[#231f20] mt-1 truncate">
                                {name}
                              </h3>
                            )}
                            <div className={`font-bold ${name ? 'text-xs text-[#bd3227]' : 'text-base font-black text-[#231f20] mt-1'}`}>
                              {role}
                            </div>
                          </div>
                        </div>

                        {titleStatus && (
                          <div className="text-xs font-bold text-[#5C5A55] uppercase tracking-wider">
                            {titleStatus}
                          </div>
                        )}

                        {desc && (
                          <p className="text-xs sm:text-sm text-[#5C5A55] leading-relaxed">
                            {desc}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* ============================================================
            5. DEMOCRATIC ARCHITECTURE & PARTICIPATORY MODEL
            ============================================================ */}
        <section id="architecture" className="py-20 bg-[#FAF8F5] border-b border-[#e5e0d6] scroll-mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#231f20] px-3.5 py-1.5 rounded-full bg-[#231f20]/10 border border-[#231f20]/20">
                {isAr ? 'هندسة التسيير الديمقراطي' : isFr ? 'Architecture Démocratique' : 'Democratic Architecture'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#231f20]">
                {isAr ? 'كيف يتم تدبير وتسيير جمعية AMYCC؟' : isFr ? 'Comment Fonctionne l’Organisation de l’AMYCC ?' : 'How AMYCC Governance Operates'}
              </h2>
              <p className="text-sm sm:text-base text-[#5C5A55] leading-relaxed text-balance">
                {isAr
                  ? 'ترتكز جمعية روح الفنون والثقافة على نموذج تسيير تشاركي شفاف ثلاثي المستويات، يضمن سيادة الجمع العام، كفاءة المكتب التنفيذي، ودينامية اللجان الميدانية.'
                  : isFr
                  ? 'L’AMYCC repose sur un modèle à trois niveaux garantissant la souveraineté de l’assemblée générale, la rigueur du bureau exécutif et le dynamisme des commissions de terrain.'
                  : 'AMYCC operates on a three-tier participatory framework ensuring the sovereignty of the General Assembly, the executive rigor of the board, and the creative autonomy of field commissions.'}
              </p>
            </div>

            {/* 3-Tier Hierarchy Flow */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative">
              {/* Level 1: General Assembly */}
              <div className="p-8 rounded-3xl bg-white border-2 border-[#231f20]/30 shadow-subtle flex flex-col justify-between space-y-5 relative">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="w-12 h-12 rounded-2xl bg-[#231f20] text-white flex items-center justify-center font-black text-xl shadow-xs">
                      1
                    </span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#231f20]/10 text-[#231f20]">
                      {isAr ? 'الهيئة التقريرية العليا' : isFr ? 'Instance Suprême' : 'Supreme Governing Body'}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-[#231f20]">
                    {isAr ? 'الجمع العام السنوي' : isFr ? 'Assemblée Générale Ordinaire' : 'Annual General Assembly'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C5A55] leading-relaxed">
                    {isAr
                      ? 'يضم كافة الأعضاء المنخرطين بالجمعية. يعتبر أعلى سلطة تقريرية؛ يصادق على التقريرين الأدبي والمالي بعد المناقشة، ينتخب أعضاء المكتب التنفيذي، ويحدد التوجهات والبرامج السنوية العامة.'
                      : isFr
                      ? 'Réunit l’ensemble des adhérents. Instance souveraine qui délibère et vote les bilans moraux et financiers, élit les dirigeants du bureau et oriente la feuille de route annuelle.'
                      : 'Comprises all active registered members. The sovereign decision-maker: debates and approves moral and financial reports, elects executive officers, and sets strategic priorities.'}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#e5e0d6] text-xs font-bold text-[#231f20]">
                  {isAr ? '✓ سيادة القانون والديمقراطية المباشرة' : isFr ? '✓ Démocratie directe et souveraineté' : '✓ Direct participatory sovereignty'}
                </div>
              </div>

              {/* Level 2: Executive Board */}
              <div className="p-8 rounded-3xl bg-white border-2 border-[#bd3227]/30 shadow-subtle flex flex-col justify-between space-y-5 relative">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="w-12 h-12 rounded-2xl bg-[#bd3227] text-white flex items-center justify-center font-black text-xl shadow-xs">
                      2
                    </span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#bd3227]/10 text-[#bd3227]">
                      {isAr ? 'التدبير والتسيير اليومي' : isFr ? 'Direction & Gestion' : 'Executive Management'}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-[#231f20]">
                    {isAr ? 'المكتب التنفيذي المنتخب' : isFr ? 'Bureau Exécutif Élu' : 'Elected Executive Board'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C5A55] leading-relaxed">
                    {isAr
                      ? 'الهيئة التنفيذية المسؤولة عن التدبير الإداري، المالي، والقانوني للجمعية. تسهر على تنزيل قرارات الجمع العام، إبرام اتفاقيات الشراكة، وتنسيق ودعم أعمال اللجان الوظيفية المتخصصة.'
                      : isFr
                      ? 'Organe exécutif en charge de l’administration légale, financière et matérielle. Il met en œuvre les résolutions votées, signe les accords de partenariat et coordonne les commissions.'
                      : 'Executive body responsible for legal, financial, and administrative operations. Executes General Assembly resolutions, secures partnerships, and coordinates commissions.'}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#e5e0d6] text-xs font-bold text-[#bd3227]">
                  {isAr ? '✓ تنفيذ القرارات والتمثيل القانوني' : isFr ? '✓ Représentation et exécution rigoureuse' : '✓ Faithful execution and representation'}
                </div>
              </div>

              {/* Level 3: Commissions & Working Groups */}
              <div className="p-8 rounded-3xl bg-white border-2 border-[#d2a82b]/30 shadow-subtle flex flex-col justify-between space-y-5 relative">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="w-12 h-12 rounded-2xl bg-[#d2a82b] text-white flex items-center justify-center font-black text-xl shadow-xs">
                      3
                    </span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#d2a82b]/10 text-[#d2a82b]">
                      {isAr ? 'التنفيذ الميداني والإبداعي' : isFr ? 'Action & Terrain' : 'Field Operations & Creativity'}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-[#231f20]">
                    {isAr ? 'اللجان الوظيفية ومجموعات العمل' : isFr ? 'Commissions Thématiques & Volontariat' : 'Functional Commissions & Action Groups'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C5A55] leading-relaxed">
                    {isAr
                      ? 'أطر فنية ومتطوعون مؤهلون يقودون الورشات المباشرة في الفنون والمسرح والموسيقى والإعلام، وينسقون مبادرة "شباب في العمل" لخدمة الناشئة والمجتمع في مختلف مدن وقرى المغرب.'
                      : isFr
                      ? 'Artistes, éducateurs et volontaires encadrant directement les ateliers artistiques et pilotant l’initiative Jeunesse en Action auprès des jeunes dans les quartiers et villes.'
                      : 'Artists, cultural educators, and dedicated volunteers leading workshops on the ground, mobilizing Youth in Action to empower communities across Morocco.'}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#e5e0d6] text-xs font-bold text-[#d2a82b]">
                  {isAr ? '✓ إتاحة الفنون والتمكين المباشر' : isFr ? '✓ Démocratisation culturelle concrète' : '✓ Community cultural access & outreach'}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            6. COLLECTIVE LEADERSHIP PRINCIPLES (4 PILLARS)
            ============================================================ */}
        <section id="principles" className="py-20 bg-white border-b border-[#e5e0d6] scroll-mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#bd3227] px-3.5 py-1.5 rounded-full bg-[#bd3227]/10 border border-[#bd3227]/20">
                {isAr ? 'الركائز التسييرية' : isFr ? 'Valeurs de Leadership' : 'Leadership Framework'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#231f20]">
                {isAr ? 'مبادئ القيادة والعمل الجماعي بالجمعية' : isFr ? 'Principes de Direction & de Travail Collectif' : 'Principles of Collective Leadership'}
              </h2>
              <p className="text-sm sm:text-base text-[#5C5A55] leading-relaxed text-balance">
                {isAr
                  ? 'ترتكز كل خطوة تنظيمية داخل الجمعية على أربعة مبادئ مؤسساتية راسخة تضمن استقلالية العمل المدني، نقاء التدبير، وتكافؤ الفرص لجميع الشباب.'
                  : isFr
                  ? 'Toute action organisationnelle au sein de l’AMYCC s’appuie sur quatre piliers garantissant l’indépendance, la rigueur et l’égalité des chances pour tous.'
                  : 'Every organisational step within AMYCC is anchored on four institutional pillars guaranteeing civic independence, integrity, and fair opportunity.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {principles.map((p) => (
                <div
                  key={p.num}
                  className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#e5e0d6] hover:border-[#231f20]/30 shadow-subtle hover:shadow-card hover:-translate-y-1 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="w-12 h-12 rounded-2xl bg-white border border-[#e5e0d6] flex items-center justify-center text-2xl shadow-2xs group-hover:scale-110 transition-transform">
                        {p.icon}
                      </span>
                      <span className="text-xs font-black text-[#5C5A55] font-mono">
                        #{p.num}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-black text-[#231f20] mb-2 leading-snug">
                        {p.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#5C5A55] leading-relaxed">
                        {p.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#e5e0d6] text-xs font-bold text-[#231f20]">
                    {isAr ? '● ركيزة عمل ملزمة' : isFr ? '● Principe Inviolable' : '● Core Standard'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            7. JOIN THE TEAM & VOLUNTEER CTA (انضم إلينا)
            ============================================================ */}
        <section id="join" className="py-16 lg:py-20 bg-gradient-to-br from-[#231f20] via-[#231f20] to-[#181516] text-white relative overflow-hidden scroll-mt-16">
          <div className="absolute top-0 end-0 w-96 h-96 bg-[#bd3227]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 start-0 w-80 h-80 bg-[#d2a82b]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 moroccan-star-pattern opacity-10 pointer-events-none" />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#bd3227]/20 border border-[#bd3227]/40 text-[#fde8e7] text-xs font-bold">
              <span>✦</span>
              <span>
                {isAr
                  ? 'أبواب الجمعية ولجانها مفتوحة للطاقات المغربية'
                  : isFr
                  ? 'Rejoignez l’Aventure Humaine & Culturelle de l’AMYCC'
                  : 'Join the Cultural and Volunteer Movement of AMYCC'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              {isAr ? (
                <>
                  هل تملك موهبة فنية، شغفاً بالتأطير، <br />
                  <span className="text-[#ffd22f]">أو رغبة في المساهمة في تنمية مجتمعك؟</span>
                </>
              ) : isFr ? (
                <>
                  Vous êtes artiste, animateur culturel ou jeune engagé ? <br />
                  <span className="text-[#ffd22f]">Contribuez au renouveau culturel du Maroc avec nous</span>
                </>
              ) : (
                <>
                  Passionate About Cultural Mentorship & Civic Impact? <br />
                  <span className="text-[#ffd22f]">Shape Morocco’s Cultural Landscape with AMYCC</span>
                </>
              )}
            </h2>

            <p className="text-xs sm:text-base text-[#E2DED6] max-w-2xl mx-auto leading-relaxed text-balance">
              {isAr
                ? 'سواء كنت ترغب في الانخراط كعضو نشيط بالجمعية، الانضمام لإحدى اللجان الفنية الست، أو قيادة المبادرات التطوعية ضمن برنامج "شباب في العمل"، نرحب بطاقتك وأفكارك لصناعة أثر ثقافي مستدام.'
                : isFr
                ? 'Que vous souhaitiez adhérer en tant que membre actif, vous investir dans l’une de nos six commissions ou encadrer des bénévoles de Jeunesse en Action, nous vous accueillons avec enthousiasme.'
                : 'Whether you wish to apply for formal membership, join one of our six specialized artistic commissions, or guide field volunteers in Youth in Action, AMYCC warmly welcomes your passion.'}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href={`/${locale}/membership`}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-black text-white bg-[#bd3227] hover:bg-[#a3261c] active:scale-95 transition-all text-xs sm:text-sm shadow-card cursor-pointer"
              >
                {isAr ? 'تقديم طلب الانخراط والعضوية' : isFr ? 'Adhérer à l’Association' : 'Apply for Membership'}
              </Link>

              <Link
                href={`/${locale}/programs/youth-in-action`}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-white bg-[#231f20] hover:bg-[#d2a82b] border border-[#d2a82b]/50 transition-all text-xs sm:text-sm cursor-pointer"
              >
                {isAr ? 'مبادرة شباب في العمل (التطوع)' : isFr ? 'Jeunesse en Action (Bénévolat)' : 'Youth in Action (Volunteering)'}
              </Link>

              <Link
                href={`/${locale}/contact`}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-[#ffd22f] border border-[#ffd22f]/40 hover:bg-[#ffd22f]/10 transition-all text-xs sm:text-sm cursor-pointer"
              >
                {isAr ? 'تواصل مع مكتب الجمعية' : isFr ? 'Contacter le Bureau' : 'Contact the Board'}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} dict={dict} />
    </>
  )
}

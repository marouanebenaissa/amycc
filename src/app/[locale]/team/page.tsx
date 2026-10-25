import { getDictionary } from '@/lib/i18n/dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import { getTeamSettings, getCommissionsSettings } from '@/lib/settings'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'

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

      <main id="main-content" className="flex-1 bg-[#faf7f2]">
        {/* ============================================================
            1. HERO BANNER WITH MOROCCAN PATTERN & AMBIENT GLOW
            ============================================================ */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#faf7f2] via-[#f5ede1] to-[#faf7f2] border-b border-[#e5e0d6] pt-14 pb-16 lg:pt-20 lg:pb-24">
          <div className="absolute inset-0 moroccan-pattern-light opacity-60 pointer-events-none" aria-hidden="true" />
          
          <div className="absolute top-1/3 start-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#c85a32]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 end-12 w-72 h-72 bg-[#0d3b43]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-[#5f7174]">
              <Link href={`/${locale}`} className="hover:text-[#0d3b43] transition-colors">
                {isAr ? 'الرئيسية' : isFr ? 'Accueil' : 'Home'}
              </Link>
              <span>/</span>
              <Link href={`/${locale}/about`} className="hover:text-[#0d3b43] transition-colors">
                {isAr ? 'عن الجمعية' : isFr ? 'Association' : 'About'}
              </Link>
              <span>/</span>
              <span className="text-[#c85a32]">
                {isAr ? 'فريق العمل والهيكلة' : isFr ? 'Équipe & Direction' : 'Our Team & Structure'}
              </span>
            </nav>

            {/* Badges Bar */}
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d3b43]/10 border border-[#0d3b43]/20 text-[#0d3b43] text-xs font-bold shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#c85a32] animate-pulse" />
                <span>
                  {isAr
                    ? 'الهيكل الإداري والتنظيمي المعتمد • جمعية AMYCC'
                    : isFr
                    ? 'Structure Administrative & Organisationnelle • AMYCC'
                    : 'Official Organizational Leadership • AMYCC'}
                </span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#d99b26]/10 border border-[#d99b26]/20 text-[#99620b] text-xs font-bold shadow-2xs">
                <span>📍</span>
                <span>
                  {isAr
                    ? 'تأطير وطني بروح شبابية مسؤولة 🇲🇦'
                    : isFr
                    ? 'Engagement Civique & Jeunesse 🇲🇦'
                    : 'Nationwide Civic Leadership 🇲🇦'}
                </span>
              </span>
            </div>

            {/* Main Headline */}
            <div className="text-center max-w-4xl mx-auto space-y-4">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#08242a] tracking-tight leading-tight">
                {isAr ? (
                  <>
                    طاقات شبابية وكفاءات ثقافية <br />
                    <span className="text-[#c85a32]">تقود مسيرة الإبداع والتأهيل الميداني</span>
                  </>
                ) : isFr ? (
                  <>
                    Énergies Jeunes & Compétences Culturelles <br />
                    <span className="text-[#c85a32]">au Service de l’Art et de l’Engagement</span>
                  </>
                ) : (
                  <>
                    Youth Energy & Cultural Leadership <br />
                    <span className="text-[#c85a32]">Driving Artistic Innovation in Morocco</span>
                  </>
                )}
              </h1>

              <p className="text-sm sm:text-base text-[#445457] max-w-3xl mx-auto leading-relaxed font-medium text-balance">
                {isAr
                  ? 'يتألف فريق عمل جمعية روح الفنون والثقافة (AMYCC) من مكتب تنفيذي منتخب ولجان فنية متخصصة تجمع بين الخبرة الميدانية، الشغف الفني، والالتزام الصارم بمبادئ الشفافية والمسؤولية لخدمة قضايا الشباب والتراث المغربي.'
                  : isFr
                  ? "L'équipe de l'Association Marocaine des Jeunes, Culture & Créativité (AMYCC) réunit un bureau exécutif élu et des commissions spécialisées engagées pour l'animation culturelle, la valorisation du patrimoine et la formation des jeunes."
                  : 'The team of the Spirit of Arts & Culture Association (AMYCC) comprises an elected executive board and specialized committees dedicated to arts education, heritage celebration, and empowering young creatives across Morocco.'}
              </p>
            </div>

            {/* In-Page Quick Navigation */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <a
                href="#executive-board"
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white border border-[#cfc7b9] text-[#0d3b43] hover:border-[#c85a32] hover:text-[#c85a32] transition-colors shadow-2xs"
              >
                {isAr ? '🏛️ المكتب التنفيذي (6)' : isFr ? '🏛️ Bureau Exécutif (6)' : '🏛️ Executive Board (6)'}
              </a>
              <a
                href="#commissions"
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white border border-[#cfc7b9] text-[#0d3b43] hover:border-[#c85a32] hover:text-[#c85a32] transition-colors shadow-2xs"
              >
                {isAr ? '🎨 اللجان الوظيفية (6)' : isFr ? '🎨 Commissions Thématiques (6)' : '🎨 Specialized Commissions (6)'}
              </a>
              <a
                href="#architecture"
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white border border-[#cfc7b9] text-[#0d3b43] hover:border-[#c85a32] hover:text-[#c85a32] transition-colors shadow-2xs"
              >
                {isAr ? '⚖️ الهيكلة التشاركية' : isFr ? '⚖️ Modèle Démocratique' : '⚖️ Democratic Model'}
              </a>
              <a
                href="#principles"
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white border border-[#cfc7b9] text-[#0d3b43] hover:border-[#c85a32] hover:text-[#c85a32] transition-colors shadow-2xs"
              >
                {isAr ? '💎 مبادئ التسيير (4)' : isFr ? '💎 Piliers de Leadership (4)' : '💎 Leadership Pillars (4)'}
              </a>
              <a
                href="#join"
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white border border-[#cfc7b9] text-[#0d3b43] hover:border-[#c85a32] hover:text-[#c85a32] transition-colors shadow-2xs"
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
              <div className="p-5 sm:p-6 rounded-3xl bg-[#faf7f2] border border-[#e5e0d6] hover:border-[#0d3b43]/30 transition-all text-center flex flex-col justify-between group shadow-2xs">
                <span className="text-xs font-bold text-[#5f7174] block mb-1">
                  {isAr ? 'المكتب التنفيذي المنتخب' : isFr ? 'Bureau Exécutif Élu' : 'Elected Executive Board'}
                </span>
                <div className="min-h-[3rem] flex items-center justify-center">
                  <span className="text-xl sm:text-2xl font-black text-[#0d3b43] group-hover:scale-105 transition-transform block whitespace-nowrap">
                    {isAr ? '6 مناصب قانونية' : isFr ? '6 Postes Statutaires' : '6 Statutory Roles'}
                  </span>
                </div>
                <p className="text-xs text-[#5f7174] leading-relaxed mt-2 text-balance">
                  {isAr
                    ? 'تسيير إداري ومالي مطابق لظهير تأسيس الجمعيات بالمغرب'
                    : isFr
                    ? 'Direction administrative conforme au Dahir associatif marocain'
                    : 'Administrative management governed by Moroccan non-profit law.'}
                </p>
              </div>

              {/* Card 2: 6 Specialized Hubs */}
              <div className="p-5 sm:p-6 rounded-3xl bg-[#faf7f2] border border-[#e5e0d6] hover:border-[#c85a32]/30 transition-all text-center flex flex-col justify-between group shadow-2xs">
                <span className="text-xs font-bold text-[#5f7174] block mb-1">
                  {isAr ? 'اللجان الميدانية المتخصصة' : isFr ? 'Commissions Thématiques' : 'Specialized Commissions'}
                </span>
                <div className="min-h-[3rem] flex items-center justify-center">
                  <span className="text-xl sm:text-2xl font-black text-[#c85a32] group-hover:scale-105 transition-transform block whitespace-nowrap">
                    {isAr ? '6 محاور وظيفية' : isFr ? '6 Pôles d’Action' : '6 Functional Hubs'}
                  </span>
                </div>
                <p className="text-xs text-[#5f7174] leading-relaxed mt-2 text-balance">
                  {isAr
                    ? 'الفنون التشكيلية، المسرح، الموسيقى، الإعلام، والتطوع والتكوين'
                    : isFr
                    ? 'Arts visuels, théâtre, musique, médias, volontariat et formation'
                    : 'Visual arts, theatre, music, media, volunteering, and training.'}
                </p>
              </div>

              {/* Card 3: 100% Civic Volunteering */}
              <div className="p-5 sm:p-6 rounded-3xl bg-[#faf7f2] border border-[#e5e0d6] hover:border-[#d99b26]/30 transition-all text-center flex flex-col justify-between group shadow-2xs">
                <span className="text-xs font-bold text-[#5f7174] block mb-1">
                  {isAr ? 'روح العمل الجمعوي' : isFr ? 'Engagement Associatif' : 'Civic Dedication'}
                </span>
                <div className="min-h-[3rem] flex items-center justify-center">
                  <span className="text-xl sm:text-2xl font-black text-[#d99b26] group-hover:scale-105 transition-transform block whitespace-nowrap">
                    {isAr ? '100% تطوع مدني' : isFr ? '100% Volontariat' : '100% Civic Service'}
                  </span>
                </div>
                <p className="text-xs text-[#5f7174] leading-relaxed mt-2 text-balance">
                  {isAr
                    ? 'عطاء غير ربحي تحركه المسؤولية الأخلاقية والوطنية تجاه الشباب'
                    : isFr
                    ? 'Engagement désintéressé guidé par la passion culturelle'
                    : 'Non-profit dedication driven by cultural passion and civic mission.'}
                </p>
              </div>

              {/* Card 4: Geographic Scope */}
              <div className="p-5 sm:p-6 rounded-3xl bg-[#faf7f2] border border-[#e5e0d6] hover:border-[#0d3b43]/30 transition-all text-center flex flex-col justify-between group shadow-2xs">
                <span className="text-xs font-bold text-[#5f7174] block mb-1">
                  {isAr ? 'النطاق والمقر' : isFr ? 'Siège & Rayonnement' : 'Headquarters & Scope'}
                </span>
                <div className="min-h-[3rem] flex items-center justify-center">
                  <span className="text-xl sm:text-2xl font-black text-[#0d3b43] group-hover:scale-105 transition-transform block whitespace-nowrap">
                    {isAr ? 'مراكش • جهات المغرب' : isFr ? 'Marrakech • Maroc' : 'Marrakech • Morocco'}
                  </span>
                </div>
                <p className="text-xs text-[#5f7174] leading-relaxed mt-2 text-balance">
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
        <section id="executive-board" className="py-20 bg-[#faf7f2] border-b border-[#e5e0d6] scroll-mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#0d3b43] px-3.5 py-1.5 rounded-full bg-[#0d3b43]/10 border border-[#0d3b43]/20">
                {isAr ? 'الجهاز التنفيذي والإداري' : isFr ? 'Instance Exécutive & Légale' : 'Executive & Statutory Body'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#08242a]">
                {isAr ? 'المكتب التنفيذي لجمعية روح الفنون والثقافة' : isFr ? 'Bureau Exécutif de l’AMYCC' : 'Executive Board of AMYCC'}
              </h2>
              <p className="text-sm sm:text-base text-[#445457] leading-relaxed text-balance">
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
                const badgeStatus = isAr ? member.badgeStatusAr : isFr ? (member.badgeStatusFr || member.badgeStatusAr) : (member.badgeStatusEn || member.badgeStatusAr)
                const desc = isAr ? member.descAr : isFr ? (member.descFr || member.descAr) : (member.descEn || member.descAr)
                const duties = (isAr ? member.dutiesAr : isFr ? (member.dutiesFr?.length ? member.dutiesFr : member.dutiesAr) : (member.dutiesEn?.length ? member.dutiesEn : member.dutiesAr)) || []

                // Dynamic executive gradients and badge palettes per officer role
                const isPresident = member.id === 'president' || role.includes('رئيس')
                const isSecretary = member.id.includes('secretary') || role.includes('كاتب')
                const isTreasurer = member.id.includes('treasurer') || role.includes('مال')

                const gradientHeader = isPresident
                  ? 'from-[#08242a] via-[#0d3b43] to-[#14505b]'
                  : isSecretary
                  ? 'from-[#7d3016] via-[#b84e27] to-[#c85a32]'
                  : isTreasurer
                  ? 'from-[#99620b] via-[#bd7d12] to-[#d99b26]'
                  : 'from-[#08242a] via-[#1c6875] to-[#268292]'

                const roleBadgeStyle = isPresident
                  ? 'bg-[#0d3b43] text-white shadow-[#0d3b43]/20'
                  : isSecretary
                  ? 'bg-[#c85a32] text-white shadow-[#c85a32]/20'
                  : isTreasurer
                  ? 'bg-[#99620b] text-white shadow-[#99620b]/20'
                  : 'bg-[#1c6875] text-white shadow-[#1c6875]/20'

                // Clean initial for executive monogram avatar
                const rawName = (name || role || '').replace(/^(ذ\.|د\.|أستاذ|أستاذة|الدكتور|الدكتورة)\s*/, '').trim()
                const initial = rawName ? rawName.charAt(0) : '✦'

                return (
                  <div
                    key={member.id}
                    className="group relative rounded-3xl bg-white border border-[#e5e0d6] hover:border-[#0d3b43]/30 shadow-subtle hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                  >
                    <div>
                      {/* 1. Moroccan Cover Header Banner */}
                      <div className={`relative h-28 bg-gradient-to-r ${gradientHeader} p-4 flex items-start justify-between overflow-hidden`}>
                        <div className="absolute inset-0 moroccan-star-pattern opacity-25 pointer-events-none" />
                        <div className="absolute -bottom-8 -end-8 w-28 h-28 rounded-full bg-white/10 blur-xl pointer-events-none" />
                        
                        {/* Top Badge: Statutory Mandate */}
                        <span className="relative z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[#08242a] text-2xs font-black shadow-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>{badgeStatus || (isAr ? 'عضوية معتمدة' : isFr ? 'Mandat Statutaire' : 'Statutory Mandate')}</span>
                        </span>

                        {/* Insignia Emblem Icon */}
                        <span className="relative z-10 w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-sm shadow-xs text-white">
                          {member.icon || '🏛️'}
                        </span>
                      </div>

                      {/* 2. Elevated Portrait Avatar & Details */}
                      <div className="px-6 sm:px-7 pb-6 space-y-4">
                        {/* Overlapping Avatar Frame */}
                        <div className="-mt-14 flex flex-col items-center text-center">
                          <div className="relative group/photo mb-3">
                            {member.photoUrl ? (
                              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border-4 border-white shadow-lg ring-2 ring-[#0d3b43]/15 group-hover:ring-[#c85a32]/50 transition-all relative bg-neutral-100">
                                <ImageWithFallback
                                  src={member.photoUrl}
                                  alt={name || role}
                                  width={112}
                                  height={112}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                              </div>
                            ) : (
                              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-[#faf7f2] via-white to-[#f4ede2] border-4 border-white shadow-lg ring-2 ring-[#0d3b43]/15 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                                <div className="absolute inset-0 moroccan-pattern-light opacity-60" />
                                <span className="text-3xl sm:text-4xl font-black text-[#08242a] relative z-10 font-arabic">
                                  {initial}
                                </span>
                              </div>
                            )}

                            {/* Corner Insignia Badge */}
                            <span className="absolute -bottom-1 -end-1 w-7 h-7 rounded-full bg-white shadow-md border border-[#e5e0d6] flex items-center justify-center text-xs">
                              {member.icon || '👤'}
                            </span>
                          </div>

                          {/* Member Full Name */}
                          {name ? (
                            <h3 className="text-xl sm:text-2xl font-black text-[#08242a] tracking-tight group-hover:text-[#c85a32] transition-colors leading-tight">
                              {name}
                            </h3>
                          ) : (
                            <h3 className="text-lg sm:text-xl font-bold text-[#819598] italic">
                              {isAr ? 'عضوية معتمدة' : 'Mandat Nominatif'}
                            </h3>
                          )}

                          {/* Role Pill Badge */}
                          <div className="mt-2 flex items-center justify-center">
                            <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black shadow-xs ${roleBadgeStyle}`}>
                              <span>{role}</span>
                            </span>
                          </div>

                          {/* Mandate / Scope */}
                          {titleStatus && (
                            <p className="text-2xs sm:text-xs font-bold text-[#5f7174] uppercase tracking-wider mt-2 max-w-xs">
                              {titleStatus}
                            </p>
                          )}
                        </div>

                        {/* 3. Bio / Editorial Description */}
                        {desc && (
                          <div className="p-3.5 rounded-2xl bg-[#faf7f2] border border-[#f0ebe1] text-xs sm:text-sm text-[#445457] leading-relaxed text-center sm:text-start">
                            {desc}
                          </div>
                        )}

                        {/* 4. Core Duties / Focus Responsibilities */}
                        {duties.length > 0 && (
                          <div className="space-y-2 pt-2 border-t border-[#f0ebe1]">
                            <span className="text-2xs font-bold text-[#819598] uppercase tracking-wider block">
                              {isAr ? 'أبرز الصلاحيات والمهام:' : isFr ? 'Missions & Responsabilités :' : 'Key Responsibilities:'}
                            </span>
                            <ul className="space-y-1.5">
                              {duties.map((duty, dIdx) => (
                                <li
                                  key={dIdx}
                                  className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-[#e5e0d6] hover:border-[#0d3b43]/30 transition-colors text-xs text-[#08242a] font-medium shadow-2xs"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#c85a32] shrink-0" />
                                  <span className="leading-snug">{duty}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 5. Card Footer with Moroccan Legal Stamp */}
                    <div className="px-6 py-3.5 bg-[#faf7f2]/80 border-t border-[#f0ebe1] flex items-center justify-between text-2xs font-bold text-[#819598]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>{isAr ? 'المملكة المغربية • الظهير 1.58.376' : isFr ? 'Dahir n° 1-58-376 • Maroc' : 'Dahir 1.58.376 • Morocco'}</span>
                      </div>
                      <span className="text-3xs px-2 py-0.5 rounded-md bg-white border border-[#e5e0d6] text-[#0d3b43] font-bold">
                        {isAr ? 'مكتب شرعي' : 'Mandat Officiel'}
                      </span>
                    </div>
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
              <span className="text-xs font-bold uppercase tracking-widest text-[#c85a32] px-3.5 py-1.5 rounded-full bg-[#c85a32]/10 border border-[#c85a32]/20">
                {commTag}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#08242a]">
                {commTitle}
              </h2>
              <p className="text-sm sm:text-base text-[#445457] leading-relaxed text-balance">
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
                    className={`p-7 rounded-3xl bg-[#faf7f2] border ${comm.borderClass || 'border-[#c85a32]/30 hover:border-[#c85a32]'} shadow-subtle hover:shadow-card hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden`}
                  >
                    <div className="space-y-4">
                      {/* Header: Icon & Category Tag */}
                      <div className="flex items-center justify-between">
                        <span className="w-14 h-14 rounded-2xl bg-white border border-[#e5e0d6] flex items-center justify-center text-3xl shadow-2xs group-hover:scale-110 transition-transform">
                          {comm.icon}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${comm.accentBg || 'bg-[#c85a32]/10'} ${comm.accentColor || 'text-[#c85a32]'} border border-current/20`}>
                          {tag}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-xl font-black text-[#08242a] mb-2 leading-snug">
                          {title}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#445457] leading-relaxed">
                          {desc}
                        </p>
                      </div>

                      {/* Operational Pillars Checklist */}
                      {points.length > 0 && (
                        <div className="space-y-2 pt-3 border-t border-[#e5e0d6]">
                          <span className="text-2xs font-bold text-[#819598] uppercase tracking-wider block">
                            {isAr ? 'أبرز التدخلات والأنشطة الميدانية:' : isFr ? 'Interventions Clés sur le Terrain :' : 'Key Field Interventions:'}
                          </span>
                          <ul className="space-y-1.5 text-xs text-[#08242a]">
                            {points.map((pt, pIdx) => (
                              <li key={pIdx} className="flex items-start gap-2.5 p-2 rounded-xl bg-white border border-[#e5e0d6] shadow-2xs">
                                <span className={`${comm.accentColor || 'text-[#c85a32]'} font-bold text-sm shrink-0 leading-none`}>✦</span>
                                <span className="leading-snug">{pt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Commission Target Locales Footer */}
                    <div className="pt-4 mt-6 border-t border-[#e5e0d6] flex items-center justify-between text-2xs font-bold text-[#819598]">
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
                  <h3 className="text-xl sm:text-2xl font-black text-[#08242a]">
                    {isAr ? 'منسقو ومؤطرو اللجان الوظيفية' : isFr ? 'Coordinateurs & Encadrants des Commissions' : 'Commission Coordinators & Mentors'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5f7174]">
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
                              <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-xs ring-2 ring-[#c85a32]/20 group-hover:ring-[#c85a32]/50 transition-all shrink-0 relative bg-neutral-100">
                                <ImageWithFallback
                                  src={member.photoUrl}
                                  alt={name || role}
                                  width={56}
                                  height={56}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                              </div>
                            ) : (
                              <span className="w-14 h-14 rounded-2xl bg-[#faf7f2] border border-[#e5e0d6] flex items-center justify-center text-2xl shadow-2xs group-hover:scale-110 transition-transform shrink-0">
                                {member.icon || '👤'}
                              </span>
                            )}

                            <div className="min-w-0">
                              <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${member.accentBg}`}>
                                {badgeStatus || (isAr ? 'تأطير وتنسيق' : isFr ? 'Coordination' : 'Coordination')}
                              </span>
                              {name && (
                                <h4 className="text-base font-black text-[#08242a] mt-1 truncate">
                                  {name}
                                </h4>
                              )}
                              <div className={`font-bold ${name ? 'text-xs text-[#c85a32]' : 'text-base font-black text-[#08242a] mt-1'}`}>
                                {role}
                              </div>
                            </div>
                          </div>

                          {titleStatus && (
                            <div className="text-xs font-bold text-[#819598] uppercase tracking-wider">
                              {titleStatus}
                            </div>
                          )}

                          {desc && (
                            <p className="text-xs text-[#445457] leading-relaxed">
                              {desc}
                            </p>
                          )}

                          {duties.length > 0 && (
                            <ul className="space-y-1 pt-2 border-t border-[#f0ebe1] text-xs text-[#5f7174]">
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
                <span className="text-xs font-bold uppercase tracking-widest text-[#d99b26] px-3.5 py-1.5 rounded-full bg-[#d99b26]/10 border border-[#d99b26]/20">
                  {isAr ? 'الخبرة والمواكبة الاستراتيجية' : isFr ? 'Conseil & Mentorat' : 'Advisory & Mentorship'}
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-[#08242a]">
                  {isAr ? 'الهيئة الاستشارية والخبراء' : isFr ? 'Cercle Consultatif & Experts' : 'Advisory & Mentorship Circle'}
                </h2>
                <p className="text-sm sm:text-base text-[#445457] leading-relaxed text-balance">
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
                      className={`p-6 rounded-3xl bg-[#faf7f2] border ${member.colorClass} shadow-subtle hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group`}
                    >
                      <div className="space-y-4">
                        <div className="flex items-center gap-3.5">
                          {member.photoUrl ? (
                            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-xs ring-2 ring-[#d99b26]/30 group-hover:ring-[#d99b26]/60 transition-all shrink-0 relative bg-neutral-100">
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
                              <h3 className="text-base sm:text-lg font-black text-[#08242a] mt-1 truncate">
                                {name}
                              </h3>
                            )}
                            <div className={`font-bold ${name ? 'text-xs text-[#c85a32]' : 'text-base font-black text-[#08242a] mt-1'}`}>
                              {role}
                            </div>
                          </div>
                        </div>

                        {titleStatus && (
                          <div className="text-xs font-bold text-[#819598] uppercase tracking-wider">
                            {titleStatus}
                          </div>
                        )}

                        {desc && (
                          <p className="text-xs sm:text-sm text-[#445457] leading-relaxed">
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
        <section id="architecture" className="py-20 bg-[#faf7f2] border-b border-[#e5e0d6] scroll-mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#0d3b43] px-3.5 py-1.5 rounded-full bg-[#0d3b43]/10 border border-[#0d3b43]/20">
                {isAr ? 'هندسة التسيير الديمقراطي' : isFr ? 'Architecture Démocratique' : 'Democratic Architecture'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#08242a]">
                {isAr ? 'كيف يتم تدبير وتسيير جمعية AMYCC؟' : isFr ? 'Comment Fonctionne l’Organisation de l’AMYCC ?' : 'How AMYCC Governance Operates'}
              </h2>
              <p className="text-sm sm:text-base text-[#445457] leading-relaxed text-balance">
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
              <div className="p-8 rounded-3xl bg-white border-2 border-[#0d3b43]/30 shadow-subtle flex flex-col justify-between space-y-5 relative">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="w-12 h-12 rounded-2xl bg-[#0d3b43] text-white flex items-center justify-center font-black text-xl shadow-xs">
                      1
                    </span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#0d3b43]/10 text-[#0d3b43]">
                      {isAr ? 'الهيئة التقريرية العليا' : isFr ? 'Instance Suprême' : 'Supreme Governing Body'}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-[#08242a]">
                    {isAr ? 'الجمع العام السنوي' : isFr ? 'Assemblée Générale Ordinaire' : 'Annual General Assembly'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#445457] leading-relaxed">
                    {isAr
                      ? 'يضم كافة الأعضاء المنخرطين بالجمعية. يعتبر أعلى سلطة تقريرية؛ يصادق على التقريرين الأدبي والمالي بعد المناقشة، ينتخب أعضاء المكتب التنفيذي، ويحدد التوجهات والبرامج السنوية العامة.'
                      : isFr
                      ? 'Réunit l’ensemble des adhérents. Instance souveraine qui délibère et vote les bilans moraux et financiers, élit les dirigeants du bureau et oriente la feuille de route annuelle.'
                      : 'Comprises all active registered members. The sovereign decision-maker: debates and approves moral and financial reports, elects executive officers, and sets strategic priorities.'}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#e5e0d6] text-xs font-bold text-[#0d3b43]">
                  {isAr ? '✓ سيادة القانون والديمقراطية المباشرة' : isFr ? '✓ Démocratie directe et souveraineté' : '✓ Direct participatory sovereignty'}
                </div>
              </div>

              {/* Level 2: Executive Board */}
              <div className="p-8 rounded-3xl bg-white border-2 border-[#c85a32]/30 shadow-subtle flex flex-col justify-between space-y-5 relative">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="w-12 h-12 rounded-2xl bg-[#c85a32] text-white flex items-center justify-center font-black text-xl shadow-xs">
                      2
                    </span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#c85a32]/10 text-[#c85a32]">
                      {isAr ? 'التدبير والتسيير اليومي' : isFr ? 'Direction & Gestion' : 'Executive Management'}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-[#08242a]">
                    {isAr ? 'المكتب التنفيذي المنتخب' : isFr ? 'Bureau Exécutif Élu' : 'Elected Executive Board'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#445457] leading-relaxed">
                    {isAr
                      ? 'الهيئة التنفيذية المسؤولة عن التدبير الإداري، المالي، والقانوني للجمعية. تسهر على تنزيل قرارات الجمع العام، إبرام اتفاقيات الشراكة، وتنسيق ودعم أعمال اللجان الوظيفية المتخصصة.'
                      : isFr
                      ? 'Organe exécutif en charge de l’administration légale, financière et matérielle. Il met en œuvre les résolutions votées, signe les accords de partenariat et coordonne les commissions.'
                      : 'Executive body responsible for legal, financial, and administrative operations. Executes General Assembly resolutions, secures partnerships, and coordinates commissions.'}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#e5e0d6] text-xs font-bold text-[#c85a32]">
                  {isAr ? '✓ تنفيذ القرارات والتمثيل القانوني' : isFr ? '✓ Représentation et exécution rigoureuse' : '✓ Faithful execution and representation'}
                </div>
              </div>

              {/* Level 3: Commissions & Working Groups */}
              <div className="p-8 rounded-3xl bg-white border-2 border-[#d99b26]/30 shadow-subtle flex flex-col justify-between space-y-5 relative">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="w-12 h-12 rounded-2xl bg-[#d99b26] text-white flex items-center justify-center font-black text-xl shadow-xs">
                      3
                    </span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#d99b26]/10 text-[#99620b]">
                      {isAr ? 'التنفيذ الميداني والإبداعي' : isFr ? 'Action & Terrain' : 'Field Operations & Creativity'}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-[#08242a]">
                    {isAr ? 'اللجان الوظيفية ومجموعات العمل' : isFr ? 'Commissions Thématiques & Volontariat' : 'Functional Commissions & Action Groups'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#445457] leading-relaxed">
                    {isAr
                      ? 'أطر فنية ومتطوعون مؤهلون يقودون الورشات المباشرة في الفنون والمسرح والموسيقى والإعلام، وينسقون مبادرة "شباب في العمل" لخدمة الناشئة والمجتمع في مختلف مدن وقرى المغرب.'
                      : isFr
                      ? 'Artistes, éducateurs et volontaires encadrant directement les ateliers artistiques et pilotant l’initiative Jeunesse en Action auprès des jeunes dans les quartiers et villes.'
                      : 'Artists, cultural educators, and dedicated volunteers leading workshops on the ground, mobilizing Youth in Action to empower communities across Morocco.'}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#e5e0d6] text-xs font-bold text-[#d99b26]">
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
              <span className="text-xs font-bold uppercase tracking-widest text-[#c85a32] px-3.5 py-1.5 rounded-full bg-[#c85a32]/10 border border-[#c85a32]/20">
                {isAr ? 'الركائز التسييرية' : isFr ? 'Valeurs de Leadership' : 'Leadership Framework'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#08242a]">
                {isAr ? 'مبادئ القيادة والعمل الجماعي بالجمعية' : isFr ? 'Principes de Direction & de Travail Collectif' : 'Principles of Collective Leadership'}
              </h2>
              <p className="text-sm sm:text-base text-[#445457] leading-relaxed text-balance">
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
                  className="p-6 rounded-3xl bg-[#faf7f2] border border-[#e5e0d6] hover:border-[#0d3b43]/30 shadow-subtle hover:shadow-card hover:-translate-y-1 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="w-12 h-12 rounded-2xl bg-white border border-[#e5e0d6] flex items-center justify-center text-2xl shadow-2xs group-hover:scale-110 transition-transform">
                        {p.icon}
                      </span>
                      <span className="text-xs font-black text-[#819598] font-mono">
                        #{p.num}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-black text-[#08242a] mb-2 leading-snug">
                        {p.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#445457] leading-relaxed">
                        {p.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#e5e0d6] text-xs font-bold text-[#0d3b43]">
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
        <section id="join" className="py-16 lg:py-20 bg-gradient-to-br from-[#08242a] via-[#0d3b43] to-[#04161a] text-white relative overflow-hidden scroll-mt-16">
          <div className="absolute top-0 end-0 w-96 h-96 bg-[#c85a32]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 start-0 w-80 h-80 bg-[#d99b26]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 moroccan-star-pattern opacity-10 pointer-events-none" />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c85a32]/20 border border-[#c85a32]/40 text-[#fae4dc] text-xs font-bold">
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
                  <span className="text-[#f4ce83]">أو رغبة في المساهمة في تنمية مجتمعك؟</span>
                </>
              ) : isFr ? (
                <>
                  Vous êtes artiste, animateur culturel ou jeune engagé ? <br />
                  <span className="text-[#f4ce83]">Contribuez au renouveau culturel du Maroc avec nous</span>
                </>
              ) : (
                <>
                  Passionate About Cultural Mentorship & Civic Impact? <br />
                  <span className="text-[#f4ce83]">Shape Morocco’s Cultural Landscape with AMYCC</span>
                </>
              )}
            </h2>

            <p className="text-xs sm:text-base text-[#d8f0f4] max-w-2xl mx-auto leading-relaxed text-balance">
              {isAr
                ? 'سواء كنت ترغب في الانخراط كعضو نشيط بالجمعية، الانضمام لإحدى اللجان الفنية الست، أو قيادة المبادرات التطوعية ضمن برنامج "شباب في العمل"، نرحب بطاقتك وأفكارك لصناعة أثر ثقافي مستدام.'
                : isFr
                ? 'Que vous souhaitiez adhérer en tant que membre actif, vous investir dans l’une de nos six commissions ou encadrer des bénévoles de Jeunesse en Action, nous vous accueillons avec enthousiasme.'
                : 'Whether you wish to apply for formal membership, join one of our six specialized artistic commissions, or guide field volunteers in Youth in Action, AMYCC warmly welcomes your passion.'}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href={`/${locale}/membership`}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-black text-white bg-[#c85a32] hover:bg-[#b84e27] active:scale-95 transition-all text-xs sm:text-sm shadow-card cursor-pointer"
              >
                {isAr ? 'تقديم طلب الانخراط والعضوية' : isFr ? 'Adhérer à l’Association' : 'Apply for Membership'}
              </Link>

              <Link
                href={`/${locale}/programs/youth-in-action`}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-white bg-[#0d3b43] hover:bg-[#14505b] border border-[#268292]/50 transition-all text-xs sm:text-sm cursor-pointer"
              >
                {isAr ? 'مبادرة شباب في العمل (التطوع)' : isFr ? 'Jeunesse en Action (Bénévolat)' : 'Youth in Action (Volunteering)'}
              </Link>

              <Link
                href={`/${locale}/contact`}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-[#f4ce83] border border-[#f4ce83]/40 hover:bg-[#f4ce83]/10 transition-all text-xs sm:text-sm cursor-pointer"
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

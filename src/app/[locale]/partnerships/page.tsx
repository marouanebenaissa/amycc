import type { Metadata } from 'next'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'
import { PartnershipForm } from '@/components/forms/PartnershipForm'
import { PartnersDirectory } from '@/components/partnerships/PartnersDirectory'
import { getPartnershipsPageSettings } from '@/lib/settings'
import { constructMetadata } from '@/lib/seo/config'
import { METADATA_CATALOG, type SupportedLocale } from '@/lib/seo/metadata-catalog'
import { getBreadcrumbJsonLd, JsonLd } from '@/lib/seo/schema'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await props.params
  const safeLocale = (['ar', 'fr', 'en'].includes(locale) ? locale : 'ar') as SupportedLocale
  const meta = METADATA_CATALOG.partnerships[safeLocale]

  return constructMetadata({
    title: meta.title,
    description: meta.description,
    path: '/partnerships',
    locale: safeLocale,
    keywords: meta.keywords,
  })
}

export default async function PartnershipsPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const dict = await getDictionary(locale)
  const isAr = locale === 'ar'
  const isFr = locale === 'fr'
  const config = await getPartnershipsPageSettings()

  const hasHeroImage = Boolean(
    config.hero.hasHeroImage &&
      config.hero.imageUrl &&
      config.hero.imageUrl.trim() !== ''
  )

  const breadcrumbSchema = getBreadcrumbJsonLd(
    [
      {
        name: isAr ? 'الشراكات المؤسسية' : isFr ? 'Partenariats' : 'Partnerships',
        path: `/${locale}/partnerships`,
      },
    ],
    locale
  )

  const steps = [
    {
      num: '01',
      titleAr: 'إيداع المقترح الأولي',
      titleFr: 'Dépôt du projet',
      titleEn: 'Proposal Submission',
      descAr: 'تعبئة استمارة الشراكة أدناه مع تفاصيل الأهداف، الفئات المستهدفة، والإطار العام للتعاون.',
      descFr: 'Remplir le formulaire avec les objectifs, publics cibles et le cadre général de collaboration.',
      descEn: 'Complete the online proposal form with objectives, target groups, and collaboration scope.',
      icon: '📝',
    },
    {
      num: '02',
      titleAr: 'جلسة دراسة وتنسيق',
      titleFr: 'Étude et cadrage',
      titleEn: 'Review & Scope',
      descAr: 'دراسة المقترح من لدن قطب الشراكات والتنسيق لعقد جلسة عمل لتحديد الجدوى وصيغ العمل المشترك.',
      descFr: 'Examen par le pôle partenariats et tenue d’une séance de cadrage pour préciser les synergies.',
      descEn: 'Evaluation by our alliances desk followed by a discovery meeting to align objectives.',
      icon: '🔍',
    },
    {
      num: '03',
      titleAr: 'توقيع اتفاقية الشراكة',
      titleFr: 'Signature de convention',
      titleEn: 'Agreement Signing',
      descAr: 'صياغة اتفاقية إطار أو اتفاقية خاصة تحدد الالتزامات المتبادلة، الجدولة الزمنية، ومؤشرات الأداء.',
      descFr: 'Formalisation de la convention définissant les engagements mutuels, le calendrier et les indicateurs.',
      descEn: 'Formalizing a partnership convention detailing shared commitments, timeline, and deliverables.',
      icon: '✍️',
    },
    {
      num: '04',
      titleAr: 'التنفيذ والتقييم المشترك',
      titleFr: 'Déploiement et bilan',
      titleEn: 'Rollout & Evaluation',
      descAr: 'إطلاق البرامج المشتركة ميدانياً مع متابعة دورية وتقييم نهائي للأثر الثقافي والمجتمعي.',
      descFr: 'Mise en œuvre sur le terrain avec suivi continu et bilan conjoint d’impact culturel et citoyen.',
      descEn: 'Joint on-the-ground rollout with ongoing monitoring and institutional impact reporting.',
      icon: '🚀',
    },
  ]

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <Header locale={locale} dict={dict} />

      <main id="main-content" className="flex-1 bg-[#FAF8F5]">
        {/* ========================================================= */}
        {/* Hero Section: Institutional Moroccan Aesthetic */}
        {/* ========================================================= */}
        <section
          className={`relative overflow-hidden border-b transition-colors ${
            hasHeroImage
              ? 'min-h-[520px] sm:min-h-[580px] lg:min-h-[640px] flex items-center bg-[#231f20] text-white pt-16 pb-24 lg:pt-20 lg:pb-32 border-[#231f20]'
              : 'bg-gradient-to-b from-[#F5F3EE] via-[#F5F3EE] to-[#F5F3EE] border-[#e5e0d6] pt-16 pb-20 lg:pt-20 lg:pb-28 text-[#231f20]'
          }`}
        >
          {hasHeroImage ? (
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
              <ImageWithFallback
                src={config.hero.imageUrl}
                fallbackSrc="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1920&q=80"
                alt={isAr ? config.hero.titleAr : isFr ? config.hero.titleFr : config.hero.titleEn}
                fill
                priority
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-black/60" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/55 to-black/90" />
              <div className="absolute inset-0 moroccan-star-pattern opacity-15 pointer-events-none" />
              <div className="absolute top-1/4 start-1/4 w-96 h-96 bg-[#bd3227]/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-10 end-10 w-96 h-96 bg-[#ffd22f]/20 rounded-full blur-3xl pointer-events-none" />
            </div>
          ) : (
            <>
              <div className="absolute inset-0 moroccan-pattern-light opacity-50 pointer-events-none" aria-hidden="true" />
              <div className="absolute top-1/4 start-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#bd3227]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 end-12 w-72 h-72 bg-[#ffd22f]/15 rounded-full blur-3xl pointer-events-none" />
            </>
          )}

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            {/* Top Category Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full shadow-2xs backdrop-blur-md">
              <span
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold ${
                  hasHeroImage
                    ? 'bg-white/10 border border-white/20 text-[#ffd22f]'
                    : 'bg-[#bd3227]/10 border border-[#bd3227]/20 text-[#bd3227]'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${hasHeroImage ? 'bg-[#ffd22f]' : 'bg-[#bd3227]'} animate-pulse`} />
                <span>{isAr ? config.hero.tagAr : isFr ? config.hero.tagFr : config.hero.tagEn}</span>
              </span>
            </div>

            {/* Main Headline */}
            <h1
              className={`text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-tight ${
                hasHeroImage ? 'text-white drop-shadow-md' : 'text-[#231f20]'
              }`}
            >
              {isAr ? config.hero.titleAr : isFr ? config.hero.titleFr : config.hero.titleEn}
            </h1>

            {/* Subtitle / Promise */}
            <p
              className={`text-lg sm:text-xl font-semibold max-w-3xl mx-auto leading-relaxed ${
                hasHeroImage ? 'text-[#ffd22f]' : 'text-[#bd3227]'
              }`}
            >
              {isAr ? config.hero.subtitleAr : isFr ? config.hero.subtitleFr : config.hero.subtitleEn}
            </p>

            {/* Detailed Description */}
            <p
              className={`text-sm sm:text-base max-w-3xl mx-auto leading-relaxed font-medium ${
                hasHeroImage ? 'text-stone-300' : 'text-[#5C5A55]'
              }`}
            >
              {isAr ? config.hero.descriptionAr : isFr ? config.hero.descriptionFr : config.hero.descriptionEn}
            </p>

            {/* Dual CTAs */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <a
                href={config.hero.primaryBtnUrl || '#proposal-form'}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base bg-[#bd3227] text-white hover:bg-[#a3261c] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>{isAr ? config.hero.primaryBtnTextAr : isFr ? config.hero.primaryBtnTextFr : config.hero.primaryBtnTextEn}</span>
                <span className="rtl:rotate-180 transition-transform">→</span>
              </a>

              {config.hero.brochureUrl && config.hero.brochureUrl.trim() !== '' && (
                <a
                  href={config.hero.brochureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base border transition-all ${
                    hasHeroImage
                      ? 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                      : 'bg-white hover:bg-stone-50 text-[#231f20] border-[#e5e0d6] shadow-2xs'
                  }`}
                >
                  <span>📄</span>
                  <span>{isAr ? config.hero.brochureBtnTextAr : isFr ? config.hero.brochureBtnTextFr : config.hero.brochureBtnTextEn}</span>
                </a>
              )}
            </div>

            {/* Institutional Badge Pill */}
            {config.hero.badgeAr && (
              <div className="pt-2">
                <span
                  className={`inline-block text-xs font-semibold px-4 py-1 rounded-full ${
                    hasHeroImage ? 'text-stone-400 bg-stone-900/60' : 'text-[#5C5A55] bg-[#F4EFE6]'
                  }`}
                >
                  {isAr ? config.hero.badgeAr : isFr ? config.hero.badgeFr : config.hero.badgeEn}
                </span>
              </div>
            )}
          </div>
        </section>

        {/* ========================================================= */}
        {/* Key Metrics / Impact Numbers */}
        {/* ========================================================= */}
        {config.stats && config.stats.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-10 relative z-20">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {config.stats.map((stat) => (
                <div
                  key={stat.id}
                  className="bg-white p-5 sm:p-6 rounded-2xl border border-[#e5e0d6] shadow-sm hover:shadow-md transition-all text-center flex flex-col items-center justify-center group"
                >
                  <span className="text-2xl sm:text-3xl mb-2 group-hover:scale-110 transition-transform select-none" aria-hidden="true">
                    {stat.icon}
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-[#231f20] tracking-tight">
                    {isAr ? (stat.valueAr || stat.value) : isFr ? (stat.valueFr || stat.value) : (stat.valueEn || stat.value)}
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-[#5C5A55] mt-1">
                    {isAr ? stat.labelAr : isFr ? stat.labelFr : stat.labelEn}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* Pillars of Cooperation */}
        {/* ========================================================= */}
        {config.pillars && config.pillars.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#bd3227] bg-[#bd3227]/10 px-3.5 py-1 rounded-full">
                {isAr ? 'محاور العمل المشترك' : isFr ? 'Axes Stratégiques' : 'Strategic Focus Areas'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#231f20]">
                {isAr
                  ? 'محاور ومجالات التعاون الاستراتيجي'
                  : isFr
                  ? 'Piliers et Domaines de Coopération Stratégique'
                  : 'Strategic Cooperation Pillars & Frameworks'}
              </h2>
              <p className="text-sm sm:text-base text-[#5C5A55] font-medium leading-relaxed">
                {isAr
                  ? 'نفتح آفاق الشراكة الثقافية والفنية في 4 محاور رئيسية تعزز الإبداع الشبابي والتنمية المستدامة.'
                  : isFr
                  ? 'Nous ouvrons la voie à des alliances culturelles durables autour de 4 axes prioritaires au service des jeunes créateurs.'
                  : 'Fostering impactful cultural and educational alliances across 4 key strategic domains.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {config.pillars.map((pillar) => (
                <div
                  key={pillar.id}
                  className="bg-white p-7 sm:p-8 rounded-3xl border border-[#e5e0d6] hover:border-[#bd3227]/30 shadow-subtle hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] flex items-center justify-center text-2xl select-none group-hover:scale-110 transition-transform">
                        {pillar.icon}
                      </span>
                      <span className="text-3xs sm:text-2xs font-bold uppercase tracking-wider text-[#bd3227] bg-[#bd3227]/10 px-3 py-1 rounded-full">
                        {isAr ? pillar.tagAr : isFr ? pillar.tagFr : pillar.tagEn}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-[#231f20]">
                      {isAr ? pillar.titleAr : isFr ? pillar.titleFr : pillar.titleEn}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#5C5A55] leading-relaxed font-medium">
                      {isAr ? pillar.descriptionAr : isFr ? pillar.descriptionFr : pillar.descriptionEn}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-[#E5E0D6] mt-6 flex items-center justify-between text-xs font-bold text-[#bd3227]">
                    <span>{isAr ? 'برمجة وتنفيذ مشترك' : isFr ? 'Co-programmation' : 'Joint Curation'}</span>
                    <span className="rtl:rotate-180 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* Approved Partners Directory: Moving Images Carousel */}
        {/* ========================================================= */}
        {config.partners && config.partners.length > 0 && (
          <section className="bg-gradient-to-b from-[#F5F3EE] via-[#F5F3EE] to-[#F5F3EE] border-y border-[#e5e0d6] py-16 sm:py-20 overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8 sm:mb-12 space-y-3">
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#bd3227] bg-[#bd3227]/10 px-3.5 py-1 rounded-full">
                {isAr ? 'شبكة الحلفاء' : isFr ? 'Réseau de Partenaires' : 'Alliances Network'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#231f20]">
                {isAr
                  ? 'دليل الشركاء المعتمدين'
                  : isFr
                  ? 'Réseau des Partenaires Officiels'
                  : 'Official Partners & Alliances Network'}
              </h2>
              <p className="text-sm sm:text-base text-[#5C5A55] font-medium leading-relaxed max-w-3xl mx-auto">
                {isAr
                  ? 'نعتز بالتعاون مع نخبة من المؤسسات الثقافية، الأكاديمية، والمدنية لتوسيع الأثر المجتمعي وبناء مبادرات نوعية.'
                  : isFr
                  ? 'Fiers de collaborer avec des institutions culturelles, académiques et citoyennes d’excellence pour démultiplier notre impact.'
                  : 'Proud to collaborate with leading cultural institutions, universities, and civil society to scale creative impact.'}
              </p>
            </div>

            <div className="w-full">
              <PartnersDirectory partners={config.partners} locale={locale} />
            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* Mutual Benefits & Shared Value */}
        {/* ========================================================= */}
        {config.benefits && config.benefits.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#bd3227] bg-[#bd3227]/10 px-3.5 py-1 rounded-full">
                {isAr ? 'القيمة المشتركة' : isFr ? 'Valeur Partagée' : 'Mutual Value'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#231f20]">
                {isAr
                  ? 'لماذا الشراكة مع جمعية روح الفنون والثقافة؟'
                  : isFr
                  ? 'Pourquoi bâtir une alliance avec l’AMYCC ?'
                  : 'Why Partner with Spirit of Arts and Culture Association?'}
              </h2>
              <p className="text-sm sm:text-base text-[#5C5A55] font-medium leading-relaxed">
                {isAr
                  ? 'نضمن لشركائنا إطاراً نموذجياً من التعاون المؤسساتي، الأثر الميداني الملموس، والالتزام الصارم بمعايير الجودة الثقافية.'
                  : isFr
                  ? 'Nous garantissons un cadre exemplaire de coopération, un impact terrain mesurable et une exigence artistique rigoureuse.'
                  : 'We ensure a trusted framework of cooperation, measurable community impact, and high artistic standards.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {config.benefits.map((benefit) => (
                <div
                  key={benefit.id}
                  className="bg-white p-6 rounded-3xl border border-[#e5e0d6] shadow-subtle hover:shadow-md transition-all flex flex-col space-y-3 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] flex items-center justify-center text-2xl select-none group-hover:scale-110 transition-transform">
                    {benefit.icon}
                  </div>
                  <h3 className="text-base font-bold text-[#231f20]">
                    {isAr ? benefit.titleAr : isFr ? benefit.titleFr : benefit.titleEn}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C5A55] leading-relaxed font-medium">
                    {isAr ? benefit.descriptionAr : isFr ? benefit.descriptionFr : benefit.descriptionEn}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* 4-Step Partnership Journey */}
        {/* ========================================================= */}
        <section className="bg-white border-y border-[#e5e0d6] py-16 sm:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#bd3227] bg-[#bd3227]/10 px-3.5 py-1 rounded-full">
                {isAr ? 'منهجية العمل' : isFr ? 'Processus Collaboratif' : 'Partnership Journey'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#231f20]">
                {isAr
                  ? 'مسار الشراكة في 4 خطوات واضحة'
                  : isFr
                  ? 'Le parcours de partenariat en 4 étapes'
                  : 'Our 4-Step Collaborative Journey'}
              </h2>
              <p className="text-sm sm:text-base text-[#5C5A55] font-medium leading-relaxed">
                {isAr
                  ? 'من أول فكرة إلى الأثر الميداني الملموس، نتبع منهجية عمل شفافة ومرنة تضمن نجاح المبادرات المشتركة.'
                  : isFr
                  ? 'De la première idée au déploiement terrain, une démarche transparente garantissant l’excellence de nos synergies.'
                  : 'From initial concept to tangible cultural impact, a clear and agile framework ensuring project success.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {steps.map((st, idx) => (
                <div
                  key={st.num}
                  className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#e5e0d6] relative flex flex-col space-y-3 hover:border-[#bd3227]/30 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black tracking-widest text-[#bd3227] bg-white px-2.5 py-1 rounded-lg border border-[#e5e0d6]">
                      {st.num}
                    </span>
                    <span className="text-2xl select-none group-hover:scale-110 transition-transform">
                      {st.icon}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#231f20] pt-1">
                    {isAr ? st.titleAr : isFr ? st.titleFr : st.titleEn}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#5C5A55] leading-relaxed font-medium">
                    {isAr ? st.descAr : isFr ? st.descFr : st.descEn}
                  </p>

                  {idx < 3 && (
                    <div className="hidden lg:block absolute -end-3 top-1/2 -translate-y-1/2 z-10 text-[#bd3227]/40 text-lg font-bold rtl:rotate-180">
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* Proposal Submission Section */}
        {/* ========================================================= */}
        <section id="proposal-form" className="scroll-mt-12 max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#bd3227] bg-[#bd3227]/10 px-3.5 py-1 rounded-full">
              {isAr ? 'طلب شراكة' : isFr ? 'Demande de Partenariat' : 'Proposal Intake'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#231f20]">
              {isAr ? 'تقديم مقترح شراكة رسمي' : isFr ? 'Formulaire officiel de proposition' : 'Official Partnership Proposal Form'}
            </h2>
            <p className="text-sm sm:text-base text-[#5C5A55] font-medium leading-relaxed">
              {isAr
                ? 'يرجى ملء النموذج أدناه بتفاصيل مؤسستكم ونوع التعاون المقترح. تلتزم الجمعية بدراسة كافة الملفات والتواصل معكم خلال 5 أيام عمل.'
                : isFr
                ? 'Veuillez renseigner ce formulaire avec les informations de votre organisation. Notre équipe s’engage à vous répondre sous 5 jours ouvrés.'
                : 'Please complete the form below with your organization details. Our alliances team commits to reviewing and responding within 5 business days.'}
            </p>
          </div>

          <PartnershipForm locale={locale} />
        </section>

        {/* ========================================================= */}
        {/* Direct Institutional Contact Card */}
        {/* ========================================================= */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">
          <div className="bg-gradient-to-br from-[#231f20] to-[#231f20] text-white p-8 sm:p-10 rounded-3xl shadow-xl relative overflow-hidden border border-[#231f20]">
            <div className="absolute inset-0 moroccan-star-pattern opacity-10 pointer-events-none" />
            <div className="absolute top-0 end-0 w-80 h-80 bg-[#bd3227]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <span className="text-2xs sm:text-xs font-bold uppercase tracking-widest text-[#ffd22f]">
                  {isAr ? config.cta.badgeAr : isFr ? config.cta.badgeFr : config.cta.badgeEn}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                  {isAr ? config.cta.titleAr : isFr ? config.cta.titleFr : config.cta.titleEn}
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  {isAr ? config.cta.descriptionAr : isFr ? config.cta.descriptionFr : config.cta.descriptionEn}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
                {config.cta.email && (
                  <a
                    href={`mailto:${config.cta.email}`}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/15 transition-all text-center justify-center backdrop-blur-xs"
                  >
                    <span>✉️</span>
                    <span>{config.cta.email}</span>
                  </a>
                )}

                {config.cta.phone && (
                  <a
                    href={`tel:${config.cta.phone}`}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#bd3227] hover:bg-[#a3261c] text-white font-bold text-xs sm:text-sm transition-all text-center justify-center shadow-md"
                  >
                    <span>📞</span>
                    <span dir="ltr">{config.cta.phone}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} dict={dict} />
    </>
  )
}

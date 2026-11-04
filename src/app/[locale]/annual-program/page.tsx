import { getDictionary } from '@/lib/i18n/dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'
import { getAnnualProgramSettings, defaultAnnualProgramConfig } from '@/lib/settings'
import { AnnualProgramTimeline } from '@/components/annual-program/AnnualProgramTimeline'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AnnualProgramPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const [dict, config] = await Promise.all([
    getDictionary(locale),
    getAnnualProgramSettings(),
  ])

  const isAr = locale === 'ar'
  const isFr = locale === 'fr'

  const hero = config.hero || defaultAnnualProgramConfig.hero
  const stats = config.stats || defaultAnnualProgramConfig.stats
  const pillars = config.pillars || defaultAnnualProgramConfig.pillars
  const quarters = config.quarters || defaultAnnualProgramConfig.quarters
  const cta = config.cta || defaultAnnualProgramConfig.cta

  const hasHeroImage = Boolean(hero.showImage !== false && hero.imageUrl && hero.imageUrl.trim() !== '')

  // Localized values for Hero
  const heroYear = hero.year || '2026'
  const heroTag = isAr ? hero.tagAr : isFr ? (hero.tagFr || hero.tagAr) : (hero.tagEn || hero.tagAr)
  const heroBadge = isAr ? hero.badgeAr : isFr ? (hero.badgeFr || hero.badgeAr) : (hero.badgeEn || hero.badgeAr)
  const heroTitle = isAr ? hero.titleAr : isFr ? (hero.titleFr || hero.titleAr) : (hero.titleEn || hero.titleAr)
  const heroDesc = isAr ? hero.descriptionAr : isFr ? (hero.descriptionFr || hero.descriptionAr) : (hero.descriptionEn || hero.descriptionAr)
  const brochureLabel = isAr ? (hero.brochureLabelAr || 'تحميل دليل البرنامج السنوي (PDF)') : isFr ? (hero.brochureLabelFr || 'Télécharger la brochure annuelle (PDF)') : (hero.brochureLabelEn || 'Download Annual Brochure (PDF)')

  // Localized values for CTA
  const ctaBadge = isAr ? cta.badgeAr : isFr ? (cta.badgeFr || cta.badgeAr) : (cta.badgeEn || cta.badgeAr)
  const ctaTitle = isAr ? cta.titleAr : isFr ? (cta.titleFr || cta.titleAr) : (cta.titleEn || cta.titleAr)
  const ctaDesc = isAr ? cta.descAr : isFr ? (cta.descFr || cta.descAr) : (cta.descEn || cta.descAr)
  const ctaPrimaryText = isAr ? cta.primaryBtnTextAr : isFr ? (cta.primaryBtnTextFr || cta.primaryBtnTextAr) : (cta.primaryBtnTextEn || cta.primaryBtnTextAr)
  const ctaSecondaryText = isAr ? cta.secondaryBtnTextAr : isFr ? (cta.secondaryBtnTextFr || cta.secondaryBtnTextAr) : (cta.secondaryBtnTextEn || cta.secondaryBtnTextAr)

  return (
    <>
      <Header locale={locale} dict={dict} />

      <main id="main-content" className="flex-1 bg-[#FAF8F5]">
        {/* ============================================================
            1. HERO BANNER (Full-Bleed Moroccan Cinematic Hero or Ambient Pattern)
            ============================================================ */}
        <section
          className={`relative overflow-hidden border-b transition-colors ${
            hasHeroImage
              ? 'min-h-[500px] sm:min-h-[560px] lg:min-h-[620px] flex items-center bg-[#231f20] text-white pt-16 pb-24 lg:pt-20 lg:pb-32 border-[#231f20]'
              : 'bg-gradient-to-b from-[#F5F3EE] via-[#F5F3EE] to-[#F5F3EE] border-[#e5e0d6] pt-16 pb-20 lg:pt-20 lg:pb-28 text-[#231f20]'
          }`}
        >
          {/* Background Layer */}
          {hasHeroImage ? (
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
              <ImageWithFallback
                src={hero.imageUrl!}
                fallbackSrc="/images/youth-in-action.jpg"
                alt="AMYCC Annual Program Hero Banner"
                fill
                priority
                sizes="100vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-black/45" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#231f20]/90 via-[#231f20]/65 to-[#231f20]/95" />
              <div className="absolute inset-0 moroccan-star-pattern opacity-15 pointer-events-none" />
              <div className="absolute top-1/4 start-1/4 w-96 h-96 bg-[#bd3227]/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-10 end-10 w-96 h-96 bg-[#ffd22f]/20 rounded-full blur-3xl pointer-events-none" />
            </div>
          ) : (
            <>
              <div className="absolute inset-0 moroccan-pattern-light opacity-60 pointer-events-none" aria-hidden="true" />
              <div className="absolute top-1/3 start-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#bd3227]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 end-12 w-72 h-72 bg-[#231f20]/10 rounded-full blur-3xl pointer-events-none" />
            </>
          )}

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center w-full">
            {/* Breadcrumb Navigation */}
            <nav
              className={`flex items-center justify-center gap-2 text-xs sm:text-sm font-bold ${
                hasHeroImage ? 'text-white/80' : 'text-[#5C5A55]'
              }`}
            >
              <Link
                href={`/${locale}`}
                className={`transition-colors ${hasHeroImage ? 'hover:text-white' : 'hover:text-[#231f20]'}`}
              >
                {isAr ? 'الرئيسية' : isFr ? 'Accueil' : 'Home'}
              </Link>
              <span>/</span>
              <span className={hasHeroImage ? 'text-[#ffd22f]' : 'text-[#bd3227]'}>
                {isAr ? 'البرنامج السنوي 2026' : isFr ? 'Programme Annuel 2026' : 'Annual Program 2026'}
              </span>
            </nav>

            {/* Badges Bar */}
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <span
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black shadow-2xs backdrop-blur-md ${
                  hasHeroImage
                    ? 'bg-[#bd3227] text-white shadow-sm'
                    : 'bg-[#bd3227] text-white'
                }`}
              >
                <span>🗓️</span>
                <span>{heroYear}</span>
              </span>

              {heroTag && (
                <span
                  className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-2xs backdrop-blur-md ${
                    hasHeroImage
                      ? 'bg-white/10 border border-white/20 text-[#ffd22f]'
                      : 'bg-[#bd3227]/10 border border-[#bd3227]/20 text-[#bd3227]'
                  }`}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${hasHeroImage ? 'bg-[#ffd22f]' : 'bg-[#bd3227]'} animate-pulse`}
                  />
                  <span>{heroTag}</span>
                </span>
              )}

              {heroBadge && (
                <span
                  className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-2xs backdrop-blur-md ${
                    hasHeroImage
                      ? 'bg-white/10 border border-white/20 text-white'
                      : 'bg-[#231f20]/10 border border-[#231f20]/20 text-[#231f20]'
                  }`}
                >
                  <span>🇲🇦</span>
                  <span>{heroBadge}</span>
                </span>
              )}
            </div>

            {/* Headline Title */}
            <h1
              className={`text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight whitespace-pre-line ${
                hasHeroImage ? 'text-white drop-shadow-md' : 'text-[#231f20]'
              }`}
            >
              {heroTitle}
            </h1>

            {/* Description */}
            <p
              className={`text-base sm:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed text-balance ${
                hasHeroImage ? 'text-[#E2DED6]/95 font-normal drop-shadow-xs' : 'text-[#5C5A55] font-medium'
              }`}
            >
              {heroDesc}
            </p>

            {/* Action Buttons in Hero */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              {hero.brochureUrl ? (
                <a
                  href={hero.brochureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-black text-xs sm:text-sm text-[#231f20] bg-[#ffd22f] hover:bg-[#ffd22f] active:scale-98 transition-all shadow-md"
                >
                  <span>📄</span>
                  <span>{brochureLabel}</span>
                  <span>↓</span>
                </a>
              ) : (
                <Link
                  href={`/${locale}/events`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-black text-xs sm:text-sm text-[#231f20] bg-[#ffd22f] hover:bg-[#ffd22f] active:scale-98 transition-all shadow-md"
                >
                  <span>📅</span>
                  <span>{dict.events.view_all}</span>
                  <span className="rtl:rotate-180">→</span>
                </Link>
              )}

              <Link
                href={`/${locale}/membership`}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                  hasHeroImage
                    ? 'text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md'
                    : 'text-[#231f20] bg-white hover:bg-[#FAF8F5] border border-[#e5e0d6]'
                }`}
              >
                <span>👥</span>
                <span>{dict.membership.apply}</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ============================================================
            2. IMPACT STATS RIBBON (CMS DRIVEN)
            ============================================================ */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-12 relative z-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {stats.map((st) => {
              const label = isAr ? st.labelAr : isFr ? (st.labelFr || st.labelAr) : (st.labelEn || st.labelAr)
              return (
                <div
                  key={st.id}
                  className="p-5 sm:p-6 rounded-3xl bg-white border border-[#e5e0d6] hover:border-[#231f20]/40 shadow-subtle hover:shadow-lg transition-all text-center flex flex-col justify-center items-center group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#231f20]/10 text-[#231f20] flex items-center justify-center text-2xl mb-2.5 group-hover:scale-110 transition-transform">
                    {st.icon || '📌'}
                  </div>
                  <span className="text-2xl sm:text-3xl font-black text-[#231f20] tracking-tight block">
                    {st.value}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#5C5A55] mt-1 leading-snug">
                    {label}
                  </span>
                </div>
              )
            })}
          </div>
        </section>

        {/* ============================================================
            3. STRATEGIC THEMATIC PILLARS (المحاور الاستراتيجية الأربعة للموسم)
            ============================================================ */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 lg:pt-20">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
            <span className="inline-block px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#bd3227]/10 text-[#bd3227] border border-[#bd3227]/20">
              {isAr ? 'رؤية ومحاور الموسم الثقافي 2026' : isFr ? 'Axes Stratégiques 2026' : 'Strategic Thematic Pillars'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#231f20] tracking-tight">
              {isAr
                ? 'أربعة محاور كبرى تقود مسيرة الإبداع والتأهيل الميداني'
                : isFr
                ? 'Quatre axes majeurs pour l’épanouissement culturel et citoyen'
                : 'Four Strategic Pillars Driving Cultural Innovation & Leadership'}
            </h2>
            <p className="text-xs sm:text-sm text-[#5C5A55] leading-relaxed">
              {isAr
                ? 'برمجة متكاملة تستهدف تمكين الشباب وصون التراث المغربي عبر مجالات الفن والأداء والتطوع المسؤول.'
                : isFr
                ? 'Une programmation globale alliant transmission patrimoniale, excellence artistique et engagement civique.'
                : 'A cohesive framework fostering Moroccan heritage, artistic expression, and civic volunteering.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar) => {
              const title = isAr ? pillar.titleAr : isFr ? (pillar.titleFr || pillar.titleAr) : (pillar.titleEn || pillar.titleAr)
              const desc = isAr ? pillar.descAr : isFr ? (pillar.descFr || pillar.descAr) : (pillar.descEn || pillar.descAr)

              return (
                <div
                  key={pillar.id}
                  className="p-6 rounded-3xl bg-white border border-[#e5e0d6] hover:border-[#231f20]/40 shadow-subtle hover:shadow-card transition-all flex flex-col justify-between group space-y-4"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      {pillar.icon || '🎨'}
                    </div>
                    <h3 className="text-base font-black text-[#231f20] group-hover:text-[#231f20] transition-colors leading-snug">
                      {title}
                    </h3>
                    <p className="text-xs text-[#5C5A55] leading-relaxed">
                      {desc}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#E5E0D6] text-3xs font-bold text-[#5C5A55]">
                    AMYCC Season 2026
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ============================================================
            4. INTERACTIVE 4 SEASONS QUARTERLY TIMELINE (CMS DRIVEN)
            ============================================================ */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <AnnualProgramTimeline
            quarters={quarters}
            locale={locale}
            dict={dict}
          />
        </section>

        {/* ============================================================
            5. DOWNLOADABLE ANNUAL PROSPECTUS / PDF SHOWCASE
            ============================================================ */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#F5F3EE] via-[#F5F3EE] to-[#F5F3EE] border border-[#e5e0d6] shadow-subtle flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-start sm:items-center gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-[#231f20] text-white flex items-center justify-center text-3xl sm:text-4xl shadow-md shrink-0">
                📑
              </div>
              <div className="space-y-1.5">
                <span className="text-3xs font-black uppercase tracking-wider text-[#bd3227]">
                  {isAr ? 'الوثيقة التوجيهية الرسمية' : isFr ? 'Document Officiel' : 'Official Framework Document'}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#231f20]">
                  {isAr ? 'دليل وأجندة البرنامج السنوي 2026' : isFr ? 'Brochure et Calendrier de la Saison 2026' : 'Annual Program Roadmap & Prospectus'}
                </h3>
                <p className="text-xs sm:text-sm text-[#5C5A55] max-w-xl leading-relaxed">
                  {isAr
                    ? 'يتضمن الدليل التفصيلي مواعيد المحترفات، معايير المشاركة، بطاقات التوصيف الفني، وآليات التعاون المشترك مع المؤسسات.'
                    : isFr
                    ? 'Retrouvez les fiches descriptives des ateliers, les dates clés, les critères de participation et les modalités de partenariat.'
                    : 'Includes detailed masterclass timetables, participation criteria, technical profiles, and institutional partnership frameworks.'}
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-3 w-full md:w-auto">
              {hero.brochureUrl ? (
                <a
                  href={hero.brochureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-black text-xs sm:text-sm text-white bg-[#231f20] hover:bg-[#d2a82b] active:scale-98 transition-all shadow-md cursor-pointer"
                >
                  <span>📥</span>
                  <span>{brochureLabel}</span>
                </a>
              ) : (
                <Link
                  href={`/${locale}/contact`}
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-black text-xs sm:text-sm text-white bg-[#231f20] hover:bg-[#d2a82b] active:scale-98 transition-all shadow-md cursor-pointer"
                >
                  <span>📩</span>
                  <span>{isAr ? 'اطلب النسخة الرسمية للدليل' : isFr ? 'Demander la brochure officielle' : 'Request Official Brochure'}</span>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* ============================================================
            6. INSTITUTIONAL COLLABORATION & HOSTING CTA BANNER (CMS DRIVEN)
            ============================================================ */}
        <section className="bg-gradient-to-br from-[#231f20] via-[#231f20] to-[#d2a82b] text-white py-16 lg:py-20 relative overflow-hidden">
          <div className="absolute inset-0 moroccan-star-pattern opacity-15 pointer-events-none" />
          <div className="absolute top-0 end-0 w-96 h-96 bg-[#bd3227]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 start-0 w-96 h-96 bg-[#ffd22f]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
            {ctaBadge && (
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-[#ffd22f] text-[#231f20] shadow-xs">
                {ctaBadge}
              </span>
            )}

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              {ctaTitle}
            </h2>

            <p className="text-sm sm:text-base text-[#E2DED6]/90 max-w-2xl mx-auto leading-relaxed">
              {ctaDesc}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href={`/${locale}${cta.primaryBtnUrl || '/events'}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-black text-xs sm:text-sm text-[#231f20] bg-[#ffd22f] hover:bg-[#ffd22f] active:scale-98 transition-all shadow-md cursor-pointer"
              >
                <span>{ctaPrimaryText}</span>
                <span className="rtl:rotate-180">→</span>
              </Link>

              <Link
                href={`/${locale}${cta.secondaryBtnUrl || '/membership'}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all cursor-pointer"
              >
                <span>{ctaSecondaryText}</span>
              </Link>

              <Link
                href={`/${locale}/partnerships`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-xs sm:text-sm text-[#ffd22f] hover:text-white transition-colors"
              >
                <span>{dict.partnerships.title}</span>
                <span className="rtl:rotate-180">↗</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} dict={dict} />
    </>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { IconWithFallback } from '@/components/ui/IconWithFallback'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'
import { getImpactSettings } from '@/lib/settings'
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
  const meta = METADATA_CATALOG.impact[safeLocale]

  return constructMetadata({
    title: meta.title,
    description: meta.description,
    path: '/impact',
    locale: safeLocale,
    keywords: meta.keywords,
  })
}

export default async function ImpactPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const dict = await getDictionary(locale)
  const isAr = locale === 'ar'
  const isFr = locale === 'fr'
  const config = await getImpactSettings()
  const hasHeroImage = Boolean(
    config.hero.hasHeroImage &&
      config.hero.heroImageUrl &&
      config.hero.heroImageUrl.trim() !== ''
  )

  const breadcrumbSchema = getBreadcrumbJsonLd(
    [
      {
        name: isAr ? 'الأثر والمؤشرات' : isFr ? 'Impact & Indicateurs' : 'Impact & Metrics',
        path: `/${locale}/impact`,
      },
    ],
    locale
  )

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <Header locale={locale} dict={dict} />

      <main id="main-content" className="flex-1 bg-[#FAF8F5]">
        {/* ========================================================= */}
        {/* Moroccan Cinematic Ambient Hero Section (Clean Non-Green) */}
        {/* ========================================================= */}
        <section
          className={`relative overflow-hidden border-b transition-colors ${
            hasHeroImage
              ? 'min-h-[500px] sm:min-h-[540px] lg:min-h-[600px] flex items-center bg-[#231f20] text-white pt-16 pb-24 lg:pt-20 lg:pb-32 border-[#231f20]'
              : 'bg-gradient-to-b from-[#F5F3EE] via-[#F5F3EE] to-[#F5F3EE] border-[#e5e0d6] pt-16 pb-20 lg:pt-20 lg:pb-28 text-[#231f20]'
          }`}
        >
          {/* Custom Hero Image with Overlay */}
          {hasHeroImage ? (
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
              <ImageWithFallback
                src={config.hero.heroImageUrl}
                fallbackSrc="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1920&q=80"
                alt={isAr ? config.hero.titleAr : isFr ? config.hero.titleFr : config.hero.titleEn}
                fill
                priority
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-black/45" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/55 to-black/90" />
              <div className="absolute inset-0 moroccan-star-pattern opacity-15 pointer-events-none" />
              <div className="absolute top-1/4 start-1/4 w-96 h-96 bg-[#bd3227]/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-10 end-10 w-96 h-96 bg-[#ffd22f]/20 rounded-full blur-3xl pointer-events-none" />
            </div>
          ) : (
            <>
              <div className="absolute inset-0 moroccan-pattern-light opacity-60 pointer-events-none" aria-hidden="true" />
              <div className="absolute top-1/3 start-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#bd3227]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 end-12 w-72 h-72 bg-[#ffd22f]/15 rounded-full blur-3xl pointer-events-none" />
            </>
          )}

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full shadow-2xs backdrop-blur-md">
              <span
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold ${
                  hasHeroImage
                    ? 'bg-white/10 border border-white/20 text-[#ffd22f]'
                    : 'bg-[#bd3227]/10 border border-[#bd3227]/20 text-[#bd3227]'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${hasHeroImage ? 'bg-[#ffd22f]' : 'bg-[#bd3227]'} animate-pulse`} />
                <span>{isAr ? config.hero.badgeAr : isFr ? config.hero.badgeFr : config.hero.badgeEn}</span>
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

            {/* Subtitle */}
            {(isAr ? config.hero.subtitleAr : isFr ? config.hero.subtitleFr : config.hero.subtitleEn) && (
              <p
                className={`text-base sm:text-xl font-bold max-w-3xl mx-auto leading-relaxed ${
                  hasHeroImage ? 'text-[#ffd22f]' : 'text-[#bd3227]'
                }`}
              >
                {isAr ? config.hero.subtitleAr : isFr ? config.hero.subtitleFr : config.hero.subtitleEn}
              </p>
            )}

            {/* Detailed Description */}
            <p
              className={`text-sm sm:text-base max-w-3xl mx-auto leading-relaxed font-medium ${
                hasHeroImage ? 'text-white/85' : 'text-[#5C5A55]'
              }`}
            >
              {isAr ? config.hero.descriptionAr : isFr ? config.hero.descriptionFr : config.hero.descriptionEn}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href={config.hero.primaryBtnUrl.startsWith('/') ? `/${locale}${config.hero.primaryBtnUrl}` : config.hero.primaryBtnUrl}
                className={`px-6 py-3.5 rounded-xl font-bold transition-all text-xs sm:text-sm shadow-card hover:scale-105 active:scale-95 ${
                  hasHeroImage
                    ? 'text-[#231f20] bg-[#ffd22f] hover:bg-[#ffd22f]'
                    : 'text-white bg-[#bd3227] hover:bg-[#a3261c]'
                }`}
              >
                {isAr ? config.hero.primaryBtnTextAr : isFr ? config.hero.primaryBtnTextFr : config.hero.primaryBtnTextEn}
              </Link>

              {config.hero.reportPdfUrl && (
                <a
                  href={config.hero.reportPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold transition-all text-xs sm:text-sm hover:scale-105 active:scale-95 ${
                    hasHeroImage
                      ? 'text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md'
                      : 'text-[#231f20] bg-white hover:bg-[#FAF8F5] border border-[#cfc7b9] shadow-2xs'
                  }`}
                >
                  <span>📄</span>
                  <span>{isAr ? config.hero.secondaryBtnTextAr : isFr ? config.hero.secondaryBtnTextFr : config.hero.secondaryBtnTextEn}</span>
                </a>
              )}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* Key Impact Indicators (KPIs) - Overlapping Banner         */}
        {/* ========================================================= */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 lg:-mt-12 relative z-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {config.metrics.map((metric) => (
              <div
                key={metric.id}
                className="luxury-card p-5 sm:p-6 text-center flex flex-col justify-between items-center group bg-white shadow-card border border-[#e5e0d6] hover:border-[#bd3227]/40 transition-all rounded-2xl"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] flex items-center justify-center p-2 mb-3 shadow-2xs group-hover:scale-110 transition-transform overflow-hidden">
                  <IconWithFallback
                    src={metric.iconSrc}
                    fallbackEmoji={metric.icon}
                    alt={isAr ? metric.labelAr : isFr ? metric.labelFr : metric.labelEn}
                    size={28}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-[#231f20] mb-1 tracking-tight">
                  {metric.value}
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#231f20] leading-snug mb-1">
                  {isAr ? metric.labelAr : isFr ? metric.labelFr : metric.labelEn}
                </div>
                <div className="text-3xs sm:text-2xs text-[#5C5A55] font-semibold leading-relaxed">
                  {isAr ? metric.subtextAr : isFr ? metric.subtextFr : metric.subtextEn}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* Strategic Pillars of Impact (محاور صناعة الأثر)             */}
        {/* ========================================================= */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl mx-auto text-center mb-14 space-y-3">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#bd3227] px-3.5 py-1 rounded-full bg-[#F4EFE6] border border-[#fde8e7]">
              {isAr ? 'محاور العمل الاستراتيجي' : isFr ? 'Axes Stratégiques' : 'Strategic Impact Pillars'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#231f20]">
              {isAr
                ? 'رؤية متكاملة للنهوض بالثقافة وتمكين الشباب'
                : isFr
                ? 'Une Vision Intégrée pour la Culture et la Jeunesse'
                : 'A Holistic Vision for Cultural & Youth Development'}
            </h2>
            <p className="text-xs sm:text-base text-[#5C5A55] leading-relaxed max-w-2xl mx-auto">
              {isAr
                ? 'تستند كل ورشة وكل فعالية تنظمها الجمعية إلى معايير واضحة لتحقيق الفائدة الملموسة للمشاركين والمجتمع بالمملكة المغربية.'
                : isFr
                ? 'Chaque atelier et événement est pensé pour générer des retombées civiques et artistiques concrètes au Maroc.'
                : 'Every workshop, performance, and festival is designed to generate measurable civic and artistic benefits.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {config.pillars.map((pillar) => {
              const badge = isAr ? pillar.badgeAr : isFr ? pillar.badgeFr : pillar.badgeEn
              const title = isAr ? pillar.titleAr : isFr ? pillar.titleFr : pillar.titleEn
              const desc = isAr ? pillar.descAr : isFr ? pillar.descFr : pillar.descEn

              return (
                <div
                  key={pillar.id}
                  className="luxury-card p-6 sm:p-8 bg-white border border-[#e5e0d6] rounded-2xl flex flex-col justify-between group hover:border-[#bd3227]/40 hover:shadow-card transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] flex items-center justify-center p-2.5 shadow-2xs group-hover:scale-105 transition-transform overflow-hidden">
                        <IconWithFallback
                          src={pillar.iconSrc}
                          fallbackEmoji={pillar.icon}
                          alt={title}
                          size={28}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      {badge && (
                        <span className="px-3 py-1 rounded-full text-3xs font-extrabold bg-[#F4EFE6] text-[#bd3227] border border-[#fde8e7]">
                          {badge}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-[#231f20] mb-3 leading-snug">
                      {title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5C5A55] leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ========================================================= */}
        {/* Featured Impact Story / Youth in Action Spotlight         */}
        {/* ========================================================= */}
        <section className="bg-white border-y border-[#e5e0d6] py-20 relative overflow-hidden">
          <div className="absolute inset-0 moroccan-pattern-light opacity-30 pointer-events-none" aria-hidden="true" />
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* Text & Testimonial Column */}
              <div className="lg:col-span-7 space-y-6">
                <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-[#F4EFE6] text-[#bd3227] border border-[#fde8e7]">
                  {isAr ? config.spotlight.badgeAr : isFr ? config.spotlight.badgeFr : config.spotlight.badgeEn}
                </span>

                <h2 className="text-2xl sm:text-4xl font-black text-[#231f20] leading-tight">
                  {isAr ? config.spotlight.titleAr : isFr ? config.spotlight.titleFr : config.spotlight.titleEn}
                </h2>

                <p className="text-xs sm:text-base text-[#5C5A55] leading-relaxed">
                  {isAr ? config.spotlight.descAr : isFr ? config.spotlight.descFr : config.spotlight.descEn}
                </p>

                {/* Quote Box */}
                {(isAr ? config.spotlight.quoteAr : isFr ? config.spotlight.quoteFr : config.spotlight.quoteEn) && (
                  <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF8F5] border-r-4 border-l-0 rtl:border-r-4 ltr:border-l-4 ltr:border-r-0 border-[#bd3227] shadow-2xs space-y-3">
                    <p className="text-xs sm:text-sm font-semibold italic text-[#231f20] leading-relaxed">
                      &ldquo;{isAr ? config.spotlight.quoteAr : isFr ? config.spotlight.quoteFr : config.spotlight.quoteEn}&rdquo;
                    </p>
                    {(isAr ? config.spotlight.quoteAuthorAr : isFr ? config.spotlight.quoteAuthorFr : config.spotlight.quoteAuthorEn) && (
                      <div className="text-3xs sm:text-2xs font-bold text-[#bd3227]">
                        — {isAr ? config.spotlight.quoteAuthorAr : isFr ? config.spotlight.quoteAuthorFr : config.spotlight.quoteAuthorEn}
                      </div>
                    )}
                  </div>
                )}

                {/* CTAs */}
                <div className="flex flex-wrap gap-4 pt-2">
                  <Link
                    href={
                      config.spotlight.primaryBtnUrl.startsWith('/')
                        ? `/${locale}${config.spotlight.primaryBtnUrl}`
                        : config.spotlight.primaryBtnUrl
                    }
                    className="px-6 py-3 rounded-xl font-bold text-white bg-[#bd3227] hover:bg-[#a3261c] transition-all text-xs shadow-xs hover:scale-105 active:scale-95"
                  >
                    {isAr ? config.spotlight.primaryBtnTextAr : isFr ? config.spotlight.primaryBtnTextFr : config.spotlight.primaryBtnTextEn}
                  </Link>

                  <Link
                    href={
                      config.spotlight.secondaryBtnUrl.startsWith('/')
                        ? `/${locale}${config.spotlight.secondaryBtnUrl}`
                        : config.spotlight.secondaryBtnUrl
                    }
                    className="px-6 py-3 rounded-xl font-bold text-[#231f20] bg-[#FAF8F5] border border-[#cfc7b9] hover:bg-[#F4EFE6] transition-all text-xs hover:scale-105 active:scale-95"
                  >
                    {isAr ? config.spotlight.secondaryBtnTextAr : isFr ? config.spotlight.secondaryBtnTextFr : config.spotlight.secondaryBtnTextEn}
                  </Link>
                </div>
              </div>

              {/* Visual Spotlight Column */}
              <div className="lg:col-span-5">
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-[#e5e0d6] shadow-card bg-[#231f20] group">
                  <ImageWithFallback
                    src={config.spotlight.imageUrl || '/images/youth-in-action.jpg'}
                    fallbackSrc="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80"
                    alt={isAr ? config.spotlight.titleAr : isFr ? config.spotlight.titleFr : config.spotlight.titleEn}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#231f20]/85 via-[#231f20]/30 to-transparent" />
                  <div className="absolute bottom-4 start-4 end-4 text-white p-2">
                    <span className="text-3xs text-[#ffd22f] font-bold uppercase tracking-wider block">
                      AMYCC Impact 2026
                    </span>
                    <span className="text-xs sm:text-sm font-bold block mt-1">
                      {isAr ? config.spotlight.imageCaptionAr : isFr ? config.spotlight.imageCaptionFr : config.spotlight.imageCaptionEn}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* Impact Methodology (منهجية ودورة صناعة الأثر)             */}
        {/* ========================================================= */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl mx-auto text-center mb-14 space-y-3">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#bd3227] px-3.5 py-1 rounded-full bg-[#F4EFE6] border border-[#fde8e7]">
              {isAr ? config.methodology.badgeAr : isFr ? config.methodology.badgeFr : config.methodology.badgeEn}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#231f20]">
              {isAr ? config.methodology.titleAr : isFr ? config.methodology.titleFr : config.methodology.titleEn}
            </h2>
            <p className="text-xs sm:text-base text-[#5C5A55] leading-relaxed max-w-2xl mx-auto">
              {isAr ? config.methodology.descAr : isFr ? config.methodology.descFr : config.methodology.descEn}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {config.methodology.steps.map((step) => {
              const title = isAr ? step.titleAr : isFr ? step.titleFr : step.titleEn
              const desc = isAr ? step.descAr : isFr ? step.descFr : step.descEn

              return (
                <div
                  key={step.id}
                  className="bg-white p-6 rounded-2xl border border-[#e5e0d6] shadow-2xs hover:shadow-card transition-all flex flex-col justify-between group relative"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl sm:text-3xl font-black text-[#bd3227]/25 group-hover:text-[#bd3227] transition-colors">
                        {step.stepNumber}
                      </span>
                      <span className="text-xl p-2 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6]">
                        {step.icon}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-[#231f20] mb-2 leading-snug">
                      {title}
                    </h3>

                    <p className="text-xs text-[#5C5A55] leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ========================================================= */}
        {/* Civil Society Transparency & Integrity Section           */}
        {/* ========================================================= */}
        <section className="bg-[#FAF8F5] border-y border-[#e5e0d6] py-16 lg:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12 space-y-3">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#bd3227] px-3.5 py-1 rounded-full bg-white border border-[#e5e0d6]">
                {isAr ? config.transparency.badgeAr : isFr ? config.transparency.badgeFr : config.transparency.badgeEn}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#231f20]">
                {isAr ? config.transparency.titleAr : isFr ? config.transparency.titleFr : config.transparency.titleEn}
              </h2>
              <p className="text-xs sm:text-sm text-[#5C5A55] leading-relaxed max-w-2xl mx-auto">
                {isAr ? config.transparency.descAr : isFr ? config.transparency.descFr : config.transparency.descEn}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {config.transparency.items.map((item) => {
                const title = isAr ? item.titleAr : isFr ? item.titleFr : item.titleEn
                const desc = isAr ? item.descAr : isFr ? item.descFr : item.descEn

                return (
                  <div
                    key={item.id}
                    className="p-5 sm:p-6 rounded-2xl bg-white border border-[#e5e0d6] shadow-2xs flex items-start gap-4 hover:border-[#bd3227]/30 transition-all"
                  >
                    <div className="text-2xl p-2.5 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6] shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-extrabold text-[#231f20] mb-1">
                        {title}
                      </h3>
                      <p className="text-xs text-[#5C5A55] leading-relaxed">
                        {desc}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* Institutional Partnership & Amplification CTA Banner      */}
        {/* ========================================================= */}
        <section className="py-20 bg-[#FAF8F5] relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#231f20] via-[#231f20] to-[#231f20] text-white p-8 sm:p-12 lg:p-14 shadow-card text-center space-y-6">
              <div className="absolute inset-0 moroccan-pattern-dark opacity-20 pointer-events-none" aria-hidden="true" />
              
              <div className="relative z-10 space-y-4 max-w-3xl mx-auto">
                <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-white/10 text-[#ffd22f] border border-white/20 backdrop-blur-sm">
                  {isAr ? config.cta.badgeAr : isFr ? config.cta.badgeFr : config.cta.badgeEn}
                </span>

                <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                  {isAr ? config.cta.titleAr : isFr ? config.cta.titleFr : config.cta.titleEn}
                </h2>

                <p className="text-xs sm:text-base text-white/80 leading-relaxed font-medium">
                  {isAr ? config.cta.descAr : isFr ? config.cta.descFr : config.cta.descEn}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                  <Link
                    href={config.cta.primaryBtnUrl.startsWith('/') ? `/${locale}${config.cta.primaryBtnUrl}` : config.cta.primaryBtnUrl}
                    className="px-6 py-3.5 rounded-xl font-bold text-[#231f20] bg-[#ffd22f] hover:bg-[#ffd22f] transition-all text-xs sm:text-sm shadow-card hover:scale-105 active:scale-95"
                  >
                    {isAr ? config.cta.primaryBtnTextAr : isFr ? config.cta.primaryBtnTextFr : config.cta.primaryBtnTextEn}
                  </Link>

                  <Link
                    href={config.cta.secondaryBtnUrl.startsWith('/') ? `/${locale}${config.cta.secondaryBtnUrl}` : config.cta.secondaryBtnUrl}
                    className="px-6 py-3.5 rounded-xl font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all text-xs sm:text-sm hover:scale-105 active:scale-95"
                  >
                    {isAr ? config.cta.secondaryBtnTextAr : isFr ? config.cta.secondaryBtnTextFr : config.cta.secondaryBtnTextEn}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} dict={dict} />
    </>
  )
}

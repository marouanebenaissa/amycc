import type { Metadata } from 'next'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'
import { MembershipForm } from '@/components/forms/MembershipForm'
import { Flaticon } from '@/components/ui/Flaticon'
import { getMembershipPageSettings } from '@/lib/settings'
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
  const meta = METADATA_CATALOG.membership[safeLocale]

  return constructMetadata({
    title: meta.title,
    description: meta.description,
    path: '/membership',
    locale: safeLocale,
    keywords: meta.keywords,
  })
}

export default async function MembershipPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const dict = await getDictionary(locale)
  const isAr = locale === 'ar'
  const isFr = locale === 'fr'
  const config = await getMembershipPageSettings()

  const hasHeroImage = Boolean(
    config.hero.hasHeroImage &&
      config.hero.imageUrl &&
      config.hero.imageUrl.trim() !== ''
  )

  const activeTiers = (config.tiers || []).filter((t) => t.active !== false)

  const breadcrumbSchema = getBreadcrumbJsonLd(
    [
      {
        name: isAr ? 'الانخراط والعضوية' : isFr ? 'Adhésion' : 'Membership',
        path: `/${locale}/membership`,
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
        {/* HERO SECTION: Moroccan Institutional Portal               */}
        {/* ========================================================= */}
        <section
          className={`relative overflow-hidden border-b transition-colors ${
            hasHeroImage
              ? 'min-h-[500px] sm:min-h-[560px] lg:min-h-[600px] flex items-center bg-[#231f20] text-white pt-16 pb-20 lg:pt-20 lg:pb-28 border-[#231f20]'
              : 'bg-gradient-to-b from-[#F5F3EE] via-[#F5F3EE] to-[#F5F3EE] border-[#e5e0d6] pt-16 pb-20 lg:pt-20 lg:pb-28 text-[#231f20]'
          }`}
        >
          {hasHeroImage ? (
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
              <ImageWithFallback
                src={config.hero.imageUrl}
                fallbackSrc="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1920&q=80"
                alt={
                  isAr
                    ? 'الانخراط والعضوية السنوية في جمعية روح الفنون والثقافة بمراكش'
                    : isFr
                    ? 'Adhésion et carte de membre annuelle AMYCC Marrakech'
                    : 'Annual Membership and Youth Engagement AMYCC Marrakech'
                }
                fill
                priority
                className="object-cover object-center scale-105 filter brightness-[0.32] contrast-105"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#231f20] via-[#231f20]/70 to-[#231f20]/80"
                aria-hidden="true"
              />
              <div
                className="absolute inset-0 moroccan-pattern opacity-10 mix-blend-overlay"
                aria-hidden="true"
              />
            </div>
          ) : (
            <div
              className="absolute inset-0 moroccan-pattern-light opacity-50 pointer-events-none"
              aria-hidden="true"
            />
          )}

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            {/* Badges strip */}
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <span
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-2xs font-extrabold uppercase tracking-widest ${
                  hasHeroImage
                    ? 'bg-white/10 text-amber-300 border border-white/20 backdrop-blur-md'
                    : 'bg-[#231f20]/10 text-[#231f20] border border-[#231f20]/20'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {isAr ? config.hero.tagAr : isFr ? config.hero.tagFr : config.hero.tagEn}
              </span>

              <span
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-2xs font-bold ${
                  hasHeroImage
                    ? 'bg-[#bd3227]/80 text-white backdrop-blur-md'
                    : 'bg-[#bd3227]/10 text-[#bd3227]'
                }`}
              >
                {isAr ? config.hero.badgeAr : isFr ? config.hero.badgeFr : config.hero.badgeEn}
              </span>
            </div>

            {/* Main Title */}
            <h1
              className={`text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.18] max-w-4xl mx-auto ${
                hasHeroImage ? 'text-white' : 'text-[#231f20]'
              }`}
            >
              {isAr ? config.hero.titleAr : isFr ? config.hero.titleFr : config.hero.titleEn}
            </h1>

            {/* Subtitle */}
            <p
              className={`text-base sm:text-lg max-w-3xl mx-auto font-medium leading-relaxed ${
                hasHeroImage ? 'text-slate-200' : 'text-[#5C5A55]'
              }`}
            >
              {isAr
                ? config.hero.subtitleAr
                : isFr
                ? config.hero.subtitleFr
                : config.hero.subtitleEn}
            </p>

            {/* Detailed Description */}
            <p
              className={`text-xs sm:text-sm max-w-3xl mx-auto leading-relaxed pt-1 ${
                hasHeroImage ? 'text-slate-300/90' : 'text-[#5C5A55]'
              }`}
            >
              {isAr
                ? config.hero.descriptionAr
                : isFr
                ? config.hero.descriptionFr
                : config.hero.descriptionEn}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <a
                href={config.hero.primaryBtnUrl || '#membership-form'}
                className="px-8 py-3.5 rounded-2xl text-xs sm:text-sm font-black bg-[#bd3227] text-white hover:bg-[#a3261c] active:scale-98 transition-all shadow-lg shadow-[#bd3227]/25 flex items-center gap-2 cursor-pointer"
              >
                <span>
                  {isAr
                    ? config.hero.primaryBtnTextAr
                    : isFr
                    ? config.hero.primaryBtnTextFr
                    : config.hero.primaryBtnTextEn}
                </span>
                <span className="text-xs">↓</span>
              </a>

              <a
                href={config.hero.secondaryBtnUrl || '#membership-tiers'}
                className={`px-7 py-3.5 rounded-2xl text-xs sm:text-sm font-bold border transition-all active:scale-98 ${
                  hasHeroImage
                    ? 'border-white/30 text-white hover:bg-white/10 backdrop-blur-md'
                    : 'border-[#231f20]/30 text-[#231f20] hover:bg-[#231f20]/5'
                }`}
              >
                <span>
                  {isAr
                    ? config.hero.secondaryBtnTextAr
                    : isFr
                    ? config.hero.secondaryBtnTextFr
                    : config.hero.secondaryBtnTextEn}
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* STATS STRIP: 3 Key Metrics                                */}
        {/* ========================================================= */}
        <section className="relative -mt-8 max-w-5xl mx-auto px-4 sm:px-6 z-20">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(config.stats || []).map((stat, idx) => (
              <div
                key={stat.id || idx}
                className="p-6 rounded-2xl bg-white border border-[#e5e0d6] shadow-md flex items-center gap-4 hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#231f20]/10 text-[#231f20] flex items-center justify-center text-2xl font-bold shrink-0">
                  {stat.icon}
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-[#231f20]">
                    {stat.value}
                  </div>
                  <div className="text-xs text-[#5C5A55] font-bold mt-0.5 leading-snug">
                    {isAr ? stat.labelAr : isFr ? stat.labelFr : stat.labelEn}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* MEMBERSHIP TIERS GRID: Cards & Pricing Matrix              */}
        {/* ========================================================= */}
        <section id="membership-tiers" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-2xs font-extrabold uppercase tracking-widest text-[#bd3227]">
              {isAr
                ? 'فئات وبطاقات الانخراط'
                : isFr
                ? 'Catégories d’Adhésion'
                : 'Membership Tiers & Passes'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#231f20]">
              {isAr
                ? 'اختر بطاقة العضوية المناسبة لمسارك واهتماماتك'
                : isFr
                ? 'Choisissez le statut correspondant à vos aspirations'
                : 'Select the Membership Tier Matching Your Aspirations'}
            </h2>
            <p className="text-xs sm:text-sm text-[#5C5A55]">
              {isAr
                ? 'تتيح الجمعية أربع صيغ قانونية للانخراط تضمن التنوع والشمولية وتتيح لكل فاعل ثقافي وفنان وطالب المساهمة وفق طاقته.'
                : isFr
                ? 'L’AMYCC propose des catégories statutaires adaptées garantissant participation active et équité.'
                : 'Our statutory tiers enable every artist, student, and cultural catalyst to engage meaningfully.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {activeTiers.map((tier) => {
              const name = isAr ? tier.nameAr : isFr ? tier.nameFr : tier.nameEn
              const badge = isAr ? tier.badgeAr : isFr ? tier.badgeFr : tier.badgeEn
              const fee = isAr ? tier.feeAr : isFr ? tier.feeFr : tier.feeEn
              const period = isAr ? tier.periodAr : isFr ? tier.periodFr : tier.periodEn
              const desc = isAr
                ? tier.descriptionAr
                : isFr
                ? tier.descriptionFr
                : tier.descriptionEn
              const benefits = isAr
                ? tier.benefitsAr
                : isFr
                ? tier.benefitsFr
                : tier.benefitsEn

              return (
                <div
                  key={tier.id}
                  className={`relative rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between ${
                    tier.recommended
                      ? 'bg-gradient-to-b from-[#F5F3EE] via-white to-[#F5F3EE] border-2 border-[#bd3227] shadow-xl hover:-translate-y-1'
                      : 'bg-white border border-[#e5e0d6] shadow-sm hover:shadow-md hover:-translate-y-1'
                  }`}
                >
                  {/* Top Badge */}
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-3">
                      <span className="text-3xs font-extrabold uppercase tracking-wider text-[#bd3227] truncate">
                        {badge || (isAr ? 'عضوية معتمدة' : 'Official Tier')}
                      </span>
                      {tier.recommended && (
                        <span className="px-2 py-0.5 rounded-full text-3xs font-black bg-[#bd3227] text-white shrink-0">
                          ⭐ {isAr ? 'الأكثر طلباً' : 'Recommandé'}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-black text-[#231f20] mb-2 leading-snug">
                      {name}
                    </h3>

                    {/* Fee */}
                    <div className="flex items-baseline gap-1.5 mb-3">
                      <span className="text-2xl font-black text-[#231f20]">{fee}</span>
                      <span className="text-3xs text-[#5C5A55] font-medium">/ {period}</span>
                    </div>

                    <p className="text-xs text-[#5C5A55] leading-relaxed mb-5 min-h-[48px]">
                      {desc}
                    </p>

                    {/* Benefits List */}
                    <div className="space-y-2 border-t border-[#E5E0D6] pt-4 mb-6">
                      <span className="text-3xs font-black uppercase text-[#231f20] block mb-2">
                        {isAr
                          ? 'الامتيازات والحقوق الممنوحة:'
                          : isFr
                          ? 'Droits & Avantages :'
                          : 'Included Benefits:'}
                      </span>
                      {(benefits || []).map((b, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-2 text-xs text-[#231f20]">
                          <Flaticon name="check" size={13} className="text-emerald-600 font-bold mt-0.5 shrink-0" />
                          <span className="leading-snug">{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Select CTA */}
                  <a
                    href="#membership-form"
                    className={`w-full py-3 px-4 rounded-xl text-xs font-bold text-center block transition-all active:scale-98 ${
                      tier.recommended
                        ? 'bg-[#bd3227] text-white hover:bg-[#a3261c] shadow-md shadow-[#bd3227]/20'
                        : 'bg-[#FAF8F5] text-[#231f20] hover:bg-[#231f20] hover:text-white border border-[#e5e0d6]'
                    }`}
                  >
                    {isAr
                      ? 'تقديم طلب الانخراط'
                      : isFr
                      ? 'Choisir cette adhésion'
                      : 'Apply for this Tier'}
                  </a>
                </div>
              )
            })}
          </div>
        </section>

        {/* ========================================================= */}
        {/* CORE BENEFITS: 6-Card Feature Matrix                       */}
        {/* ========================================================= */}
        <section className="bg-gradient-to-b from-[#F5F3EE] via-[#F5F3EE] to-[#F5F3EE] border-y border-[#e5e0d6] py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-2xs font-extrabold uppercase tracking-widest text-[#bd3227]">
                {isAr ? 'امتيازات العضوية' : isFr ? 'Avantages de l’Adhésion' : 'Member Privileges'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#231f20]">
                {isAr
                  ? 'ماذا تمنحك العضوية في جمعية روح الفنون والثقافة؟'
                  : isFr
                  ? 'Que vous apporte l’adhésion à l’AMYCC ?'
                  : 'What Membership at AMYCC Offers You'}
              </h2>
              <p className="text-xs sm:text-sm text-[#5C5A55]">
                {isAr
                  ? 'تكرس الجمعية نموذجاً تشاركياً يضع العضو في قلب التفكير والإنتاج الثقافي والتأثير المجتمعي.'
                  : isFr
                  ? 'Un modèle participatif plaçant chaque adhérent au cœur de la création artistique.'
                  : 'A participatory paradigm empowering members at the core of artistic production.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(config.benefits || []).map((benefit, idx) => (
                <div
                  key={benefit.id || idx}
                  className="p-6 rounded-3xl bg-white border border-[#e5e0d6] shadow-2xs hover:shadow-md transition-shadow space-y-3"
                >
                  <span className="w-12 h-12 rounded-2xl bg-[#231f20]/10 text-[#231f20] flex items-center justify-center text-xl font-bold">
                    {benefit.icon}
                  </span>
                  <h3 className="text-base font-black text-[#231f20]">
                    {isAr
                      ? benefit.titleAr
                      : isFr
                      ? benefit.titleFr
                      : benefit.titleEn}
                  </h3>
                  <p className="text-xs text-[#5C5A55] leading-relaxed">
                    {isAr
                      ? benefit.descriptionAr
                      : isFr
                      ? benefit.descriptionFr
                      : benefit.descriptionEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* ADMISSION STEPPER: 4-Step Process                          */}
        {/* ========================================================= */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-2xs font-extrabold uppercase tracking-widest text-[#bd3227]">
              {isAr ? 'مسطرة القبول' : isFr ? 'Procédure d’Admission' : 'Admission Pathway'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#231f20]">
              {isAr
                ? 'أربع خطوات ميسرة نحو تثبيت عضويتك'
                : isFr
                ? 'Quatre étapes simples pour valider votre adhésion'
                : 'Four Clear Steps to Full Membership'}
            </h2>
            <p className="text-xs sm:text-sm text-[#5C5A55]">
              {isAr
                ? 'تتم معالجة كافة الطلبات وفق مبادئ الشفافية والتدبير الرشيد المنصوص عليها في النظام الأساسي.'
                : isFr
                ? 'Chaque demande est examinée avec rigueur et transparence selon nos statuts.'
                : 'All submissions are processed transparently under association bylaws.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(config.steps || []).map((step, idx) => (
              <div
                key={step.id || idx}
                className="relative p-6 rounded-3xl bg-white border border-[#e5e0d6] shadow-2xs hover:shadow-md transition-shadow space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-2xl bg-[#231f20] text-white flex items-center justify-center text-sm font-black shadow-2xs">
                    {idx + 1}
                  </span>
                  <span className="text-3xs font-extrabold tracking-widest uppercase text-[#bd3227]">
                    {isAr ? `المرحلة 0${idx + 1}` : `Étape 0${idx + 1}`}
                  </span>
                </div>

                <h3 className="text-base font-black text-[#231f20] pt-1">
                  {isAr ? step.titleAr : isFr ? step.titleFr : step.titleEn}
                </h3>

                <p className="text-xs text-[#5C5A55] leading-relaxed">
                  {isAr
                    ? step.descriptionAr
                    : isFr
                    ? step.descriptionFr
                    : step.descriptionEn}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* STATUTORY CRITERIA: Legal Bylaws Box                       */}
        {/* ========================================================= */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-12">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e5e0d6] shadow-2xs space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-[#bd3227]/10 text-[#bd3227] flex items-center justify-center font-bold">
                <Flaticon name="scroll" size={18} />
              </span>
              <div>
                <span className="text-3xs font-extrabold uppercase tracking-widest text-[#bd3227] block">
                  {isAr ? 'النظام الأساسي والداخلي' : isFr ? 'Cadre Statutaire' : 'Statutory Framework'}
                </span>
                <h3 className="text-base sm:text-lg font-black text-[#231f20]">
                  {isAr
                    ? config.requirements.titleAr
                    : isFr
                    ? config.requirements.titleFr
                    : config.requirements.titleEn}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {(isAr
                ? config.requirements.itemsAr
                : isFr
                ? config.requirements.itemsFr
                : config.requirements.itemsEn
              ).map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D6] text-xs text-[#231f20]"
                >
                  <Flaticon name="check" size={13} className="text-emerald-600 font-bold mt-0.5 shrink-0" />
                  <span className="leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* APPLICATION FORM                                           */}
        {/* ========================================================= */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          <MembershipForm locale={locale} tiers={config.tiers} />
        </section>

        {/* ========================================================= */}
        {/* SUPPORT & INQUIRIES BOX                                    */}
        {/* ========================================================= */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-[#231f20] to-[#231f20] text-white shadow-xl relative overflow-hidden text-center space-y-4">
            <div
              className="absolute inset-0 moroccan-pattern opacity-10 mix-blend-overlay pointer-events-none"
              aria-hidden="true"
            />
            <span className="inline-block px-3 py-1 rounded-full text-3xs font-extrabold uppercase tracking-widest bg-white/10 text-amber-300 border border-white/20">
              {isAr ? config.cta.badgeAr : isFr ? config.cta.badgeFr : config.cta.badgeEn}
            </span>
            <h3 className="text-xl sm:text-3xl font-black max-w-xl mx-auto leading-tight">
              {isAr ? config.cta.titleAr : isFr ? config.cta.titleFr : config.cta.titleEn}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              {isAr
                ? config.cta.descriptionAr
                : isFr
                ? config.cta.descriptionFr
                : config.cta.descriptionEn}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              {config.cta.email && (
                <a
                  href={`mailto:${config.cta.email}`}
                  className="px-5 py-2.5 rounded-xl bg-white text-[#231f20] hover:bg-slate-100 font-bold text-xs transition-colors flex items-center gap-2"
                >
                  <Flaticon name="mail" size={13} className="text-[#bd3227] shrink-0" />
                  <span>{config.cta.email}</span>
                </a>
              )}
              {config.cta.phone && (
                <a
                  href={`tel:${config.cta.phone}`}
                  className="px-5 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 font-bold text-xs border border-white/20 transition-colors flex items-center gap-2"
                  dir="ltr"
                >
                  <Flaticon name="phone" size={13} className="text-[#ffd22f] shrink-0" />
                  <span>{config.cta.phone}</span>
                </a>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} dict={dict} />
    </>
  )
}

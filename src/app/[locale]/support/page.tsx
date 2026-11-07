import type { Metadata } from 'next'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'
import { SupportForm } from '@/components/forms/SupportForm'
import { OnlineDonationHub } from '@/components/support/OnlineDonationHub'
import { getSupportPageSettings } from '@/lib/settings'
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
  const meta = METADATA_CATALOG.support[safeLocale]

  return constructMetadata({
    title: meta.title,
    description: meta.description,
    path: '/support',
    locale: safeLocale,
    keywords: meta.keywords,
  })
}

export default async function SupportPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const dict = await getDictionary(locale)
  const isAr = locale === 'ar'
  const isFr = locale === 'fr'
  const config = await getSupportPageSettings()

  const hasHeroImage = Boolean(
    config.hero.hasHeroImage &&
      config.hero.imageUrl &&
      config.hero.imageUrl.trim() !== ''
  )

  const activePackages = (config.packages || []).filter((p) => p.active !== false)

  const breadcrumbSchema = getBreadcrumbJsonLd(
    [
      {
        name: isAr ? 'الدعم والرعاية' : isFr ? 'Soutien & Don' : 'Support & Sponsorship',
        path: `/${locale}/support`,
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
        {/* HERO SECTION: Moroccan Patronage & Cultural Portal        */}
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
                fallbackSrc="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1920&q=80"
                alt={
                  isAr
                    ? 'دعم ورعاية المبادرات الثقافية والشبابية - جمعية روح الفنون والثقافة بمراكش'
                    : isFr
                    ? 'Soutien et Mécénat Culturel pour la Jeunesse - AMYCC Marrakech'
                    : 'Cultural Patronage and Youth Sponsorship AMYCC Marrakech Morocco'
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

            {/* Title */}
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

            {/* Description */}
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
                href={config.hero.primaryBtnUrl || '#online-donation'}
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
                href={config.hero.secondaryBtnUrl || '#bank-transfer'}
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
        {/* STATS STRIP                                               */}
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
        {/* ONLINE DONATION & PAYMENT HUB                             */}
        {/* ========================================================= */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <span className="text-2xs font-extrabold uppercase tracking-widest text-[#bd3227]">
              {isAr ? 'المساهمة الفورية المباشرة' : isFr ? 'Don Direct & Sécurisé' : 'Direct Giving Hub'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#231f20]">
              {isAr
                ? 'اختر طريقة المساهمة التي تناسبك'
                : isFr
                ? 'Soutenez nos actions selon vos préférences'
                : 'Choose Your Preferred Giving Method'}
            </h2>
            <p className="text-xs sm:text-sm text-[#5C5A55]">
              {isAr
                ? 'نوفر لكم منصة دفع إلكتروني آمنة ومشفرة بالكامل بالبطاقة البنكية، بالإضافة إلى إمكانية التحويل البنكي المباشر مع توثيق قانوني فوري.'
                : isFr
                ? 'Paiement en ligne sécurisé par carte bancaire ou virement officiel avec délivrance immédiate de reçu.'
                : 'Fully encrypted card transactions via Moroccan switch CMI or direct official wire transfer.'}
            </p>
          </div>

          <OnlineDonationHub config={config} locale={locale} />
        </section>

        {/* ========================================================= */}
        {/* PATRONAGE PACKAGES: Strategic Cultural Sponsorship        */}
        {/* ========================================================= */}
        {activePackages.length > 0 && (
          <section id="patronage-packages" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-2xs font-extrabold uppercase tracking-widest text-[#bd3227]">
                {isAr
                  ? 'باقات الرعاية الثقافية المؤسساتية'
                  : isFr
                  ? 'Programmes de Mécénat Culturel'
                  : 'Corporate & Patronage Programs'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#231f20]">
                {isAr
                  ? 'رعاية موسم أو إنتاج فني متكامل'
                  : isFr
                  ? 'Parrainez une saison ou une production artistique'
                  : 'Sponsor an Entire Creative Season or Production'}
              </h2>
              <p className="text-xs sm:text-sm text-[#5C5A55]">
                {isAr
                  ? 'صيغ رعاية نموذجية للمؤسسات والشركات الراعية تمنح امتيازات حضور وتواصل واسعة وتساهم في إحداث أثر ثقافي مستدام.'
                  : isFr
                  ? 'Formules de mécénat dédiées aux entreprises et bienfaiteurs avec reconnaissance officielle.'
                  : 'Tailored patronage packages offering institutional visibility and long-term civic impact.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {activePackages.map((pkg) => {
                const name = isAr ? pkg.nameAr : isFr ? pkg.nameFr : pkg.nameEn
                const badge = isAr ? pkg.badgeAr : isFr ? pkg.badgeFr : pkg.badgeEn
                const period = isAr ? pkg.periodAr : isFr ? pkg.periodFr : pkg.periodEn
                const desc = isAr ? pkg.descriptionAr : isFr ? pkg.descriptionFr : pkg.descriptionEn
                const impact = isAr ? pkg.impactAr : isFr ? pkg.impactFr : pkg.impactEn
                const privileges = isAr
                  ? pkg.privilegesAr
                  : isFr
                  ? pkg.privilegesFr
                  : pkg.privilegesEn

                return (
                  <div
                    key={pkg.id}
                    className={`relative rounded-3xl p-6 sm:p-7 transition-all duration-300 flex flex-col justify-between ${
                      pkg.recommended
                        ? 'bg-gradient-to-b from-[#F5F3EE] via-white to-[#F5F3EE] border-2 border-[#bd3227] shadow-xl hover:-translate-y-1'
                        : 'bg-white border border-[#e5e0d6] shadow-sm hover:shadow-md hover:-translate-y-1'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-3">
                        <span className="text-3xs font-extrabold uppercase tracking-wider text-[#bd3227] truncate">
                          {badge || (isAr ? 'باقة رعاية' : 'Patronage')}
                        </span>
                        {pkg.recommended && (
                          <span className="px-2 py-0.5 rounded-full text-3xs font-black bg-[#bd3227] text-white shrink-0">
                            ⭐ {isAr ? 'الأكثر طلباً' : 'Recommandé'}
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-black text-[#231f20] mb-2 leading-snug">
                        {name}
                      </h3>

                      <div className="flex items-baseline gap-1.5 mb-3">
                        <span className="text-2xl sm:text-3xl font-black text-[#231f20]">
                          {pkg.amount.toLocaleString()} {pkg.currency}
                        </span>
                        <span className="text-3xs text-[#5C5A55] font-medium">/ {period}</span>
                      </div>

                      <p className="text-xs text-[#5C5A55] leading-relaxed mb-4 min-h-[48px]">
                        {desc}
                      </p>

                      <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] mb-5">
                        <span className="text-3xs font-black text-[#bd3227] block mb-1">
                          {isAr ? 'الأثر الميداني المباشر:' : isFr ? 'Impact direct financé :' : 'Direct Impact Funded:'}
                        </span>
                        <p className="text-xs text-[#231f20] font-medium leading-snug">
                          {impact}
                        </p>
                      </div>

                      <div className="space-y-2 border-t border-[#E5E0D6] pt-4 mb-6">
                        <span className="text-3xs font-black uppercase text-[#231f20] block mb-2">
                          {isAr ? 'الامتيازات الممنوحة للراعي:' : isFr ? 'Avantages du mécène :' : 'Patron Privileges:'}
                        </span>
                        {(privileges || []).map((pr, prIdx) => (
                          <div key={prIdx} className="flex items-start gap-2 text-xs text-[#231f20]">
                            <span className="text-emerald-600 font-bold shrink-0">✓</span>
                            <span className="leading-snug">{pr}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <a
                      href="#support-form"
                      className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold text-center block transition-all active:scale-98 ${
                        pkg.recommended
                          ? 'bg-[#bd3227] text-white hover:bg-[#a3261c] shadow-md shadow-[#bd3227]/20'
                          : 'bg-[#FAF8F5] text-[#231f20] hover:bg-[#231f20] hover:text-white border border-[#e5e0d6]'
                      }`}
                    >
                      {isAr
                        ? 'طلب رعاية هذه الباقة'
                        : isFr
                        ? 'Sélectionner ce programme'
                        : 'Sponsor this Package'}
                    </a>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* IMPACT PILLARS: Where Donations Go                         */}
        {/* ========================================================= */}
        <section className="bg-gradient-to-b from-[#F5F3EE] via-[#F5F3EE] to-[#F5F3EE] border-y border-[#e5e0d6] py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-2xs font-extrabold uppercase tracking-widest text-[#bd3227]">
                {isAr ? 'أوجه صرف التبرعات' : isFr ? 'Affectation des Fonds' : 'Where Your Support Goes'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#231f20]">
                {isAr
                  ? 'أربعة محاور ثقافية ومجتمعية رئيسية'
                  : isFr
                  ? 'Quatre piliers d’impact culturel et citoyen'
                  : 'Four Core Cultural & Civic Pillars'}
              </h2>
              <p className="text-xs sm:text-sm text-[#5C5A55]">
                {isAr
                  ? 'توجه كافة المساهمات لدعم المبدعين والناشئة وصون التراث المغربي.'
                  : isFr
                  ? 'Tous les dons soutiennent directement les talents et le patrimoine vivant.'
                  : 'All donations directly sustain youth empowerment and Moroccan living heritage.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(config.pillars || []).map((p, idx) => (
                <div
                  key={p.id || idx}
                  className="p-6 rounded-3xl bg-white border border-[#e5e0d6] shadow-2xs hover:shadow-md transition-shadow space-y-3"
                >
                  <span className="w-12 h-12 rounded-2xl bg-[#231f20]/10 text-[#231f20] flex items-center justify-center text-xl font-bold">
                    {p.icon}
                  </span>
                  <h3 className="text-base font-black text-[#231f20]">
                    {isAr ? p.titleAr : isFr ? p.titleFr : p.titleEn}
                  </h3>
                  <p className="text-xs text-[#5C5A55] leading-relaxed">
                    {isAr ? p.descriptionAr : isFr ? p.descriptionFr : p.descriptionEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* LEGAL & FISCAL TRANSPARENCY FAQS                          */}
        {/* ========================================================= */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-2xs font-extrabold uppercase tracking-widest text-[#bd3227]">
              {isAr ? 'النزاهة والتدبير الرشيد' : isFr ? 'Transparence & Éthique' : 'Financial Integrity'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#231f20]">
              {isAr
                ? 'الشفافية المالية والإطار القانوني للتبرعات'
                : isFr
                ? 'Cadre Juridique et Traçabilité des Dons'
                : 'Legal Framework & Transparency Standards'}
            </h2>
          </div>

          <div className="space-y-4">
            {(config.transparencyFaqs || []).map((faq, idx) => (
              <div
                key={faq.id || idx}
                className="p-6 rounded-3xl bg-white border border-[#e5e0d6] shadow-2xs space-y-2"
              >
                <div className="flex items-start gap-3">
                  <span className="text-base text-[#bd3227] mt-0.5">ℹ️</span>
                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-[#231f20]">
                      {isAr ? faq.questionAr : isFr ? faq.questionFr : faq.questionEn}
                    </h3>
                    <p className="text-xs text-[#5C5A55] leading-relaxed pt-1">
                      {isAr ? faq.answerAr : isFr ? faq.answerFr : faq.answerEn}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* IN-KIND / TRANSFER DECLARATION FORM                       */}
        {/* ========================================================= */}
        <section id="support-form" className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
            <span className="text-2xs font-extrabold uppercase tracking-widest text-[#bd3227]">
              {isAr ? 'إشعار الدعم والمساهمات العينية' : isFr ? 'Notification de Don' : 'Support Notification'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#231f20]">
              {isAr
                ? 'إشعار بالتحويل البنكي أو تقديم مساهمة عينية'
                : isFr
                ? 'Déclarez votre virement ou don en nature'
                : 'Notify Wire Transfer or In-Kind Support'}
            </h2>
          </div>

          <SupportForm locale={locale} />
        </section>

        {/* ========================================================= */}
        {/* PATRONAGE DESK CONTACT BOX                                */}
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
              {isAr ? config.cta.descriptionAr : isFr ? config.cta.descriptionFr : config.cta.descriptionEn}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              {config.cta.email && (
                <a
                  href={`mailto:${config.cta.email}`}
                  className="px-5 py-2.5 rounded-xl bg-white text-[#231f20] hover:bg-slate-100 font-bold text-xs transition-colors flex items-center gap-2"
                >
                  <span>✉️</span>
                  <span>{config.cta.email}</span>
                </a>
              )}
              {config.cta.phone && (
                <a
                  href={`tel:${config.cta.phone}`}
                  className="px-5 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 font-bold text-xs border border-white/20 transition-colors flex items-center gap-2"
                  dir="ltr"
                >
                  <span>📞</span>
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

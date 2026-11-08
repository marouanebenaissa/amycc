import type { Metadata } from 'next'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ContactForm } from '@/components/forms/ContactForm'
import { getContactSettings, defaultContactConfig } from '@/lib/settings'
import { constructMetadata, getSiteUrl } from '@/lib/seo/config'
import { METADATA_CATALOG } from '@/lib/seo/metadata-catalog'
import { getBreadcrumbJsonLd, JsonLd } from '@/lib/seo/schema'
import { locales, type Locale, defaultLocale } from '@/lib/i18n/config'
import Link from 'next/link'
import { ProIcon } from '@/components/ui/ProIcon'

export const revalidate = 0

export const dynamic = 'force-dynamic'

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await props.params
  const validLocale = (locales.includes(locale as Locale) ? locale : defaultLocale) as Locale
  const meta = METADATA_CATALOG.contact[validLocale]

  return constructMetadata({
    title: meta.title,
    description: meta.description,
    path: '/contact',
    locale: validLocale,
    keywords: meta.keywords,
  })
}

export default async function ContactPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const [dict, contactConfig] = await Promise.all([
    getDictionary(locale),
    getContactSettings(),
  ])

  const isAr = locale === 'ar'
  const isFr = locale === 'fr'

  const hero = contactConfig.hero || defaultContactConfig.hero
  const channels = contactConfig.channels || defaultContactConfig.channels
  const social = contactConfig.social || defaultContactConfig.social
  const formTopics = contactConfig.formTopics || defaultContactConfig.formTopics

  // Trilingual values
  const heroTag = isAr ? hero.tagAr : isFr ? (hero.tagFr || hero.tagAr) : (hero.tagEn || hero.tagAr)
  const heroBadge = isAr ? hero.badgeAr : isFr ? (hero.badgeFr || hero.badgeAr) : (hero.badgeEn || hero.badgeAr)
  const heroTitle = isAr ? hero.titleAr : isFr ? (hero.titleFr || hero.titleAr) : (hero.titleEn || hero.titleAr)
  const heroDesc = isAr ? hero.descriptionAr : isFr ? (hero.descriptionFr || hero.descriptionAr) : (hero.descriptionEn || hero.descriptionAr)

  const address = isAr ? channels.addressAr : isFr ? (channels.addressFr || channels.addressAr) : (channels.addressEn || channels.addressAr)
  const city = isAr ? channels.cityAr : isFr ? (channels.cityFr || channels.cityAr) : (channels.cityEn || channels.cityAr)
  const workingHours = isAr ? channels.workingHoursAr : isFr ? (channels.workingHoursFr || channels.workingHoursAr) : (channels.workingHoursEn || channels.workingHoursAr)
  const responseTime = isAr ? channels.responseTimeAr : isFr ? (channels.responseTimeFr || channels.responseTimeAr) : (channels.responseTimeEn || channels.responseTimeAr)

  // Clean WhatsApp number link
  const cleanWaNumber = (channels.whatsapp || '').replace(/[^0-9]/g, '')
  const whatsappUrl = cleanWaNumber ? `https://wa.me/${cleanWaNumber}` : undefined

  const siteUrl = getSiteUrl()
  const breadcrumbSchema = getBreadcrumbJsonLd([
    { name: isAr ? 'الرئيسية' : isFr ? 'Accueil' : 'Home', url: `${siteUrl}/${locale}` },
    { name: isAr ? 'اتصل بنا' : isFr ? 'Contact' : 'Contact Us', url: `${siteUrl}/${locale}/contact` },
  ])

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <Header locale={locale} dict={dict} />

      <main id="main-content" className="flex-1 bg-[#FAF8F5]">
        {/* ============================================================
            1. HERO BANNER WITH MOROCCAN PATTERN & AMBIENT GLOW
            ============================================================ */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#F5F3EE] via-[#F5F3EE] to-[#F5F3EE] border-b border-[#e5e0d6] pt-16 pb-24 lg:pt-20 lg:pb-32 text-[#231f20]">
          <div className="absolute inset-0 moroccan-pattern-light opacity-60 pointer-events-none" aria-hidden="true" />
          <div className="absolute top-1/3 start-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#bd3227]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 end-12 w-72 h-72 bg-[#231f20]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center">
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-[#5C5A55]">
              <Link href={`/${locale}`} className="hover:text-[#231f20] transition-colors">
                {isAr ? 'الرئيسية' : isFr ? 'Accueil' : 'Home'}
              </Link>
              <span>/</span>
              <span className="text-[#bd3227]">
                {isAr ? 'اتصل بنا' : isFr ? 'Contact' : 'Contact Us'}
              </span>
            </nav>

            {/* Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {heroTag && (
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold shadow-2xs bg-[#bd3227]/10 border border-[#bd3227]/20 text-[#bd3227]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#bd3227] animate-pulse" />
                  <span>{heroTag}</span>
                </span>
              )}

              {heroBadge && (
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-bold shadow-2xs bg-[#231f20]/10 border border-[#231f20]/20 text-[#231f20]">
                  <ProIcon name="pin" size={13} className="text-[#231f20]" />
                  <span>{heroBadge}</span>
                </span>
              )}
            </div>

            {/* Headline Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#231f20] tracking-tight leading-tight whitespace-pre-line">
              {heroTitle}
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg lg:text-xl text-[#5C5A55] max-w-3xl mx-auto leading-relaxed font-medium text-balance">
              {heroDesc}
            </p>
          </div>
        </section>

        {/* ============================================================
            2. THE 4 OFFICIAL CONTACT PILLARS (INTERACTIVE CARDS)
            ============================================================ */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-14 relative z-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Card 1: Official Email */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#e5e0d6] hover:border-[#231f20]/40 shadow-subtle hover:shadow-lg transition-all text-center flex flex-col justify-between group min-h-[260px]">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#231f20]/10 text-[#231f20] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <ProIcon name="mail" size={28} className="text-[#231f20]" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#5C5A55] uppercase tracking-wider block mb-2">
                  {isAr ? 'البريد الإلكتروني الرسمي' : isFr ? 'Email Institutionnel' : 'Official Email'}
                </span>
                <a
                  href={`mailto:${channels.primaryEmail}`}
                  className="text-sm sm:text-base font-mono font-bold text-[#231f20] group-hover:text-[#bd3227] transition-colors block break-all"
                >
                  {channels.primaryEmail}
                </a>
                {channels.secondaryEmail && channels.secondaryEmail.trim() !== '.' && channels.secondaryEmail.trim().length > 1 && (
                  <a
                    href={`mailto:${channels.secondaryEmail}`}
                    className="text-xs sm:text-sm font-mono text-[#5C5A55] hover:text-[#231f20] block mt-1.5 break-all"
                  >
                    {channels.secondaryEmail}
                  </a>
                )}
              </div>
              <div className="mt-5 pt-3.5 border-t border-[#E5E0D6]">
                <a
                  href={`mailto:${channels.primaryEmail}`}
                  className="text-xs sm:text-sm font-bold text-[#231f20] group-hover:underline inline-flex items-center gap-1.5"
                >
                  <span>{isAr ? 'إرسال بريد مباشر' : 'Send Direct Email'}</span>
                  <span className="rtl:rotate-180">→</span>
                </a>
              </div>
            </div>

            {/* Card 2: Phone & WhatsApp */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#e5e0d6] hover:border-[#bd3227]/40 shadow-subtle hover:shadow-lg transition-all text-center flex flex-col justify-between group min-h-[260px]">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#bd3227]/10 text-[#bd3227] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <ProIcon name="phone" size={28} className="text-[#bd3227]" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#5C5A55] uppercase tracking-wider block mb-2">
                  {isAr ? 'الهاتف والتواصل المباشر' : isFr ? 'Téléphone & Direct' : 'Direct Call & Line'}
                </span>
                <a
                  href={`tel:${channels.phone}`}
                  className="text-sm sm:text-base font-mono font-bold text-[#231f20] group-hover:text-[#bd3227] transition-colors block"
                  dir="ltr"
                >
                  {channels.phone}
                </a>
                {channels.whatsapp && channels.whatsapp.trim() !== '.' && channels.whatsapp.trim().length > 1 && (
                  <span className="text-xs sm:text-sm text-[#128c7e] font-bold block mt-1.5" dir="ltr">
                    WhatsApp: {channels.whatsapp}
                  </span>
                )}
              </div>
              <div className="mt-5 pt-3.5 border-t border-[#E5E0D6]">
                {whatsappUrl ? (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm font-bold text-[#128c7e] hover:underline inline-flex items-center gap-1.5"
                  >
                    <span>{isAr ? 'محادثة عبر واتساب' : 'Chat on WhatsApp'}</span>
                    <span className="rtl:rotate-180">↗</span>
                  </a>
                ) : (
                  <a
                    href={`tel:${channels.phone}`}
                    className="text-xs sm:text-sm font-bold text-[#bd3227] group-hover:underline inline-flex items-center gap-1.5"
                  >
                    <span>{isAr ? 'اتصال مباشر' : 'Call Now'}</span>
                    <span className="rtl:rotate-180">→</span>
                  </a>
                )}
              </div>
            </div>

            {/* Card 3: Headquarters & City */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#e5e0d6] hover:border-[#d2a82b]/40 shadow-subtle hover:shadow-lg transition-all text-center flex flex-col justify-between group min-h-[260px]">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#d2a82b]/10 text-[#d2a82b] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <ProIcon name="culture" size={28} className="text-[#d2a82b]" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#5C5A55] uppercase tracking-wider block mb-2">
                  {isAr ? 'المقر والنطاق الجغرافي' : isFr ? 'Siège & Rayonnement' : 'Headquarters & Scope'}
                </span>
                <span className="text-sm sm:text-base font-black text-[#231f20] block">
                  {city}
                </span>
                <p className="text-xs sm:text-sm text-[#5C5A55] leading-relaxed mt-1.5 line-clamp-2">
                  {address}
                </p>
              </div>
              <div className="mt-5 pt-3.5 border-t border-[#E5E0D6]">
                {channels.mapLinkUrl ? (
                  <a
                    href={channels.mapLinkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm font-bold text-[#d2a82b] hover:underline inline-flex items-center gap-1.5"
                  >
                    <span>{isAr ? 'فتح على خرائط Google' : 'Open in Maps'}</span>
                    <span className="rtl:rotate-180">↗</span>
                  </a>
                ) : (
                  <span className="text-xs sm:text-sm font-bold text-[#5C5A55]">
                    {isAr ? 'مراكش الحمراء 🇲🇦' : 'Marrakech, Morocco 🇲🇦'}
                  </span>
                )}
              </div>
            </div>

            {/* Card 4: Working Hours & SLA */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#e5e0d6] hover:border-emerald-600/40 shadow-subtle hover:shadow-lg transition-all text-center flex flex-col justify-between group min-h-[260px]">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <ProIcon name="calendar" size={28} className="text-emerald-700" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#5C5A55] uppercase tracking-wider block mb-2">
                  {isAr ? 'أوقات العمل وسرعة الرد' : isFr ? 'Horaires & Réactivité' : 'Hours & Response SLA'}
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#231f20] block leading-relaxed">
                  {workingHours}
                </span>
                <span className="text-xs sm:text-sm text-emerald-700 font-bold block mt-1.5">
                  ● {responseTime}
                </span>
              </div>
              <div className="mt-5 pt-3.5 border-t border-[#E5E0D6] flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-emerald-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{isAr ? 'فريق الإنصات نشط' : 'Listening Team Active'}</span>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            3. MAIN SECTION: CONTACT FORM & INTERACTIVE LOCATION/SOCIAL
            ============================================================ */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left/Main Column: Professional Contact Form (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <ContactForm
                locale={locale}
                topics={formTopics}
                responseTime={responseTime}
              />
            </div>

            {/* Right/Secondary Column: Location, Map, Socials, & Help Desk (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Location & Map Showcase */}
              <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#e5e0d6] shadow-subtle space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#231f20]/10 text-[#231f20] flex items-center justify-center">
                    <ProIcon name="map" size={24} className="text-[#231f20]" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#231f20]">
                      {isAr ? 'المقر الإداري للجمعية' : isFr ? 'Siège Administratif' : 'Administrative Headquarters'}
                    </h3>
                    <span className="text-xs sm:text-sm font-bold text-[#5C5A55]">
                      {city}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-[#5C5A55] leading-relaxed">
                  {address}
                </p>

                {/* Map Display or Visual Location Card */}
                {channels.mapEmbedUrl ? (
                  <div className="rounded-2xl overflow-hidden border border-[#e5e0d6] aspect-video">
                    <iframe
                      src={channels.mapEmbedUrl}
                      title="AMYCC Location Map"
                      className="w-full h-full border-0"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="relative rounded-2xl overflow-hidden border border-[#e5e0d6] p-6 bg-gradient-to-br from-[#231f20] to-[#d2a82b] text-white space-y-3">
                    <div className="absolute inset-0 moroccan-star-pattern opacity-15 pointer-events-none" />
                    <div className="relative z-10">
                      <span className="text-xs uppercase tracking-widest text-[#ffd22f] font-bold block mb-1">
                        AMYCC Headquarters
                      </span>
                      <h4 className="text-sm sm:text-base font-black">
                        {isAr ? 'مراكش الحمراء • المملكة المغربية' : 'Marrakech, Kingdom of Morocco'}
                      </h4>
                      <p className="text-xs text-[#E2DED6]/90 mt-1 leading-relaxed">
                        {isAr
                          ? 'استقبال المرتفقين والشركاء يتم بموعد مسبق أو خلال أوقات الاستقبال الرسمية.'
                          : 'Public reception by appointment during statutory business hours.'}
                      </p>
                      {channels.mapLinkUrl && (
                        <a
                          href={channels.mapLinkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3.5 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#ffd22f] hover:bg-[#ffd22f] text-[#231f20] text-xs sm:text-sm font-bold transition-all shadow-xs"
                        >
                          <ProIcon name="pin" size={13} className="text-[#231f20]" />
                          <span>{isAr ? 'الاتجاهات عبر خرائط Google' : 'Get Directions on Google Maps'}</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Social Channels Hub */}
              <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#e5e0d6] shadow-subtle space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E0D6]">
                  <h3 className="text-base font-black text-[#231f20] flex items-center gap-2">
                    <ProIcon name="globe" size={16} className="text-[#231f20]" />
                    <span>{isAr ? 'تابع الجمعية على المنصات الرقمية' : 'Official Social Channels'}</span>
                  </h3>
                  <span className="text-xs font-mono text-[#5C5A55]">@amycc.morocco</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {social.facebook && (
                    <a
                      href={social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3.5 rounded-xl bg-[#FAF8F5] hover:bg-[#1877f2] text-[#231f20] hover:text-white transition-all flex items-center gap-2.5 text-xs sm:text-sm font-bold group border border-[#e5e0d6]"
                    >
                      <ProIcon name="facebook" size={16} className="text-[#1877f2] group-hover:text-white" />
                      <span>Facebook</span>
                    </a>
                  )}

                  {social.instagram && (
                    <a
                      href={social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3.5 rounded-xl bg-[#FAF8F5] hover:bg-[#e4405f] text-[#231f20] hover:text-white transition-all flex items-center gap-2.5 text-xs sm:text-sm font-bold group border border-[#e5e0d6]"
                    >
                      <ProIcon name="instagram" size={16} className="text-[#e4405f] group-hover:text-white" />
                      <span>Instagram</span>
                    </a>
                  )}

                  {social.linkedin && (
                    <a
                      href={social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3.5 rounded-xl bg-[#FAF8F5] hover:bg-[#0a66c2] text-[#231f20] hover:text-white transition-all flex items-center gap-2.5 text-xs sm:text-sm font-bold group border border-[#e5e0d6]"
                    >
                      <ProIcon name="linkedin" size={16} className="text-[#0a66c2] group-hover:text-white" />
                      <span>LinkedIn</span>
                    </a>
                  )}

                  {social.youtube && (
                    <a
                      href={social.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3.5 rounded-xl bg-[#FAF8F5] hover:bg-[#ff0000] text-[#231f20] hover:text-white transition-all flex items-center gap-2.5 text-xs sm:text-sm font-bold group border border-[#e5e0d6]"
                    >
                      <ProIcon name="youtube" size={16} className="text-[#ff0000] group-hover:text-white" />
                      <span>YouTube</span>
                    </a>
                  )}

                  {social.twitter && (
                    <a
                      href={social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3.5 rounded-xl bg-[#FAF8F5] hover:bg-black text-[#231f20] hover:text-white transition-all flex items-center gap-2.5 text-xs sm:text-sm font-bold group border border-[#e5e0d6]"
                    >
                      <ProIcon name="twitter" size={16} className="text-black group-hover:text-white" />
                      <span>X (Twitter)</span>
                    </a>
                  )}

                  {social.tiktok && (
                    <a
                      href={social.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3.5 rounded-xl bg-[#FAF8F5] hover:bg-black text-[#231f20] hover:text-white transition-all flex items-center gap-2.5 text-xs sm:text-sm font-bold group border border-[#e5e0d6]"
                    >
                      <ProIcon name="music" size={16} className="text-black group-hover:text-white" />
                      <span>TikTok</span>
                    </a>
                  )}

                  {social.whatsapp && (
                    <a
                      href={social.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3.5 rounded-xl bg-[#FAF8F5] hover:bg-[#25D366] text-[#231f20] hover:text-white transition-all flex items-center gap-2.5 text-xs sm:text-sm font-bold group border border-[#e5e0d6]"
                    >
                      <ProIcon name="whatsapp" size={16} className="text-[#25D366] group-hover:text-white transition-colors" />
                      <span>WhatsApp</span>
                    </a>
                  )}
                </div>
              </div>


            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} dict={dict} contactEmail={channels.primaryEmail} />
    </>
  )
}

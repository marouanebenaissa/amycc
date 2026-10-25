import { getDictionary } from '@/lib/i18n/dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ContactForm } from '@/components/forms/ContactForm'
import { getContactSettings, defaultContactConfig } from '@/lib/settings'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

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

  return (
    <>
      <Header locale={locale} dict={dict} />

      <main id="main-content" className="flex-1 bg-[#faf7f2]">
        {/* ============================================================
            1. HERO BANNER WITH MOROCCAN PATTERN & AMBIENT GLOW
            ============================================================ */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#faf7f2] via-[#f7f2e9] to-[#faf7f2] border-b border-[#e5e0d6] py-16 lg:py-20 text-[#08242a]">
          <div className="absolute inset-0 moroccan-pattern-light opacity-60 pointer-events-none" aria-hidden="true" />
          <div className="absolute top-1/3 start-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#c85a32]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 end-12 w-72 h-72 bg-[#0d3b43]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center">
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-[#5f7174]">
              <Link href={`/${locale}`} className="hover:text-[#0d3b43] transition-colors">
                {isAr ? 'الرئيسية' : isFr ? 'Accueil' : 'Home'}
              </Link>
              <span>/</span>
              <span className="text-[#c85a32]">
                {isAr ? 'اتصل بنا' : isFr ? 'Contact' : 'Contact Us'}
              </span>
            </nav>

            {/* Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {heroTag && (
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-2xs bg-[#c85a32]/10 border border-[#c85a32]/20 text-[#c85a32]">
                  <span className="w-2 h-2 rounded-full bg-[#c85a32] animate-pulse" />
                  <span>{heroTag}</span>
                </span>
              )}

              {heroBadge && (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-2xs bg-[#0d3b43]/10 border border-[#0d3b43]/20 text-[#0d3b43]">
                  <span>📍</span>
                  <span>{heroBadge}</span>
                </span>
              )}
            </div>

            {/* Headline Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#08242a] tracking-tight leading-tight whitespace-pre-line">
              {heroTitle}
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-[#445457] max-w-3xl mx-auto leading-relaxed font-medium text-balance">
              {heroDesc}
            </p>
          </div>
        </section>

        {/* ============================================================
            2. THE 4 OFFICIAL CONTACT PILLARS (INTERACTIVE CARDS)
            ============================================================ */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {/* Card 1: Official Email */}
            <div className="p-6 rounded-3xl bg-white border border-[#e5e0d6] hover:border-[#0d3b43]/40 shadow-subtle hover:shadow-lg transition-all text-center flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#0d3b43]/10 text-[#0d3b43] flex items-center justify-center text-xl mx-auto mb-3 group-hover:scale-110 transition-transform">
                  ✉️
                </div>
                <span className="text-2xs font-bold text-[#819598] uppercase tracking-wider block mb-1">
                  {isAr ? 'البريد الإلكتروني الرسمي' : isFr ? 'Email Institutionnel' : 'Official Email'}
                </span>
                <a
                  href={`mailto:${channels.primaryEmail}`}
                  className="text-xs sm:text-sm font-mono font-bold text-[#08242a] group-hover:text-[#c85a32] transition-colors block break-all"
                >
                  {channels.primaryEmail}
                </a>
                {channels.secondaryEmail && (
                  <a
                    href={`mailto:${channels.secondaryEmail}`}
                    className="text-3xs font-mono text-[#819598] hover:text-[#08242a] block mt-1 break-all"
                  >
                    {channels.secondaryEmail}
                  </a>
                )}
              </div>
              <div className="mt-4 pt-3 border-t border-[#f0ebe1]">
                <a
                  href={`mailto:${channels.primaryEmail}`}
                  className="text-2xs font-bold text-[#0d3b43] group-hover:underline inline-flex items-center gap-1"
                >
                  <span>{isAr ? 'إرسال بريد مباشر' : 'Send Direct Email'}</span>
                  <span className="rtl:rotate-180">→</span>
                </a>
              </div>
            </div>

            {/* Card 2: Phone & WhatsApp */}
            <div className="p-6 rounded-3xl bg-white border border-[#e5e0d6] hover:border-[#c85a32]/40 shadow-subtle hover:shadow-lg transition-all text-center flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#c85a32]/10 text-[#c85a32] flex items-center justify-center text-xl mx-auto mb-3 group-hover:scale-110 transition-transform">
                  📞
                </div>
                <span className="text-2xs font-bold text-[#819598] uppercase tracking-wider block mb-1">
                  {isAr ? 'الهاتف والتواصل المباشر' : isFr ? 'Téléphone & Direct' : 'Direct Call & Line'}
                </span>
                <a
                  href={`tel:${channels.phone}`}
                  className="text-xs sm:text-sm font-mono font-bold text-[#08242a] group-hover:text-[#c85a32] transition-colors block"
                  dir="ltr"
                >
                  {channels.phone}
                </a>
                {channels.whatsapp && (
                  <span className="text-3xs text-[#128c7e] font-bold block mt-1" dir="ltr">
                    WhatsApp: {channels.whatsapp}
                  </span>
                )}
              </div>
              <div className="mt-4 pt-3 border-t border-[#f0ebe1]">
                {whatsappUrl ? (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-2xs font-bold text-[#128c7e] hover:underline inline-flex items-center gap-1"
                  >
                    <span>{isAr ? 'محادثة عبر واتساب' : 'Chat on WhatsApp'}</span>
                    <span className="rtl:rotate-180">↗</span>
                  </a>
                ) : (
                  <a
                    href={`tel:${channels.phone}`}
                    className="text-2xs font-bold text-[#c85a32] group-hover:underline inline-flex items-center gap-1"
                  >
                    <span>{isAr ? 'اتصال مباشر' : 'Call Now'}</span>
                    <span className="rtl:rotate-180">→</span>
                  </a>
                )}
              </div>
            </div>

            {/* Card 3: Headquarters & City */}
            <div className="p-6 rounded-3xl bg-white border border-[#e5e0d6] hover:border-[#99620b]/40 shadow-subtle hover:shadow-lg transition-all text-center flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#d99b26]/10 text-[#99620b] flex items-center justify-center text-xl mx-auto mb-3 group-hover:scale-110 transition-transform">
                  🏛️
                </div>
                <span className="text-2xs font-bold text-[#819598] uppercase tracking-wider block mb-1">
                  {isAr ? 'المقر والنطاق الجغرافي' : isFr ? 'Siège & Rayonnement' : 'Headquarters & Scope'}
                </span>
                <span className="text-xs font-bold text-[#08242a] block">
                  {city}
                </span>
                <p className="text-3xs text-[#5f7174] leading-relaxed mt-1 line-clamp-2">
                  {address}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#f0ebe1]">
                {channels.mapLinkUrl ? (
                  <a
                    href={channels.mapLinkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-2xs font-bold text-[#99620b] hover:underline inline-flex items-center gap-1"
                  >
                    <span>{isAr ? 'فتح على خرائط Google' : 'Open in Maps'}</span>
                    <span className="rtl:rotate-180">↗</span>
                  </a>
                ) : (
                  <span className="text-2xs font-bold text-[#5f7174]">
                    {isAr ? 'مراكش الحمراء 🇲🇦' : 'Marrakech, Morocco 🇲🇦'}
                  </span>
                )}
              </div>
            </div>

            {/* Card 4: Working Hours & SLA */}
            <div className="p-6 rounded-3xl bg-white border border-[#e5e0d6] hover:border-emerald-600/40 shadow-subtle hover:shadow-lg transition-all text-center flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl mx-auto mb-3 group-hover:scale-110 transition-transform">
                  ⏱️
                </div>
                <span className="text-2xs font-bold text-[#819598] uppercase tracking-wider block mb-1">
                  {isAr ? 'أوقات العمل وسرعة الرد' : isFr ? 'Horaires & Réactivité' : 'Hours & Response SLA'}
                </span>
                <span className="text-xs font-bold text-[#08242a] block leading-tight">
                  {workingHours}
                </span>
                <span className="text-3xs text-emerald-700 font-bold block mt-1">
                  ● {responseTime}
                </span>
              </div>
              <div className="mt-4 pt-3 border-t border-[#f0ebe1] flex items-center justify-center gap-1.5 text-2xs font-bold text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
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
                  <div className="w-10 h-10 rounded-xl bg-[#0d3b43]/10 text-[#0d3b43] flex items-center justify-center text-lg">
                    🗺️
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#08242a]">
                      {isAr ? 'المقر الإداري للجمعية' : isFr ? 'Siège Administratif' : 'Administrative Headquarters'}
                    </h3>
                    <span className="text-2xs text-[#819598]">
                      {city}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#445457] leading-relaxed">
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
                  <div className="relative rounded-2xl overflow-hidden border border-[#e5e0d6] p-6 bg-gradient-to-br from-[#08242a] to-[#14505b] text-white space-y-3">
                    <div className="absolute inset-0 moroccan-star-pattern opacity-15 pointer-events-none" />
                    <div className="relative z-10">
                      <span className="text-2xs uppercase tracking-widest text-[#f4ce83] font-bold block mb-1">
                        AMYCC Headquarters
                      </span>
                      <h4 className="text-sm font-black">
                        {isAr ? 'مراكش الحمراء • المملكة المغربية' : 'Marrakech, Kingdom of Morocco'}
                      </h4>
                      <p className="text-3xs text-[#d8f0f4]/80 mt-1">
                        {isAr
                          ? 'استقبال المرتفقين والشركاء يتم بموعد مسبق أو خلال أوقات الاستقبال الرسمية.'
                          : 'Public reception by appointment during statutory business hours.'}
                      </p>
                      {channels.mapLinkUrl && (
                        <a
                          href={channels.mapLinkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#f4ce83] hover:bg-[#eabf66] text-[#08242a] text-2xs font-bold transition-all shadow-xs"
                        >
                          <span>📍</span>
                          <span>{isAr ? 'الاتجاهات عبر خرائط Google' : 'Get Directions on Google Maps'}</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Social Channels Hub */}
              <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#e5e0d6] shadow-subtle space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#f0ebe1]">
                  <h3 className="text-sm font-black text-[#08242a] flex items-center gap-2">
                    <span>🌐</span>
                    <span>{isAr ? 'تابع الجمعية على المنصات الرقمية' : 'Official Social Channels'}</span>
                  </h3>
                  <span className="text-3xs text-[#819598]">@amycc.morocco</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {social.facebook && (
                    <a
                      href={social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-[#faf7f2] hover:bg-[#1877f2] text-[#08242a] hover:text-white transition-all flex items-center gap-2 text-xs font-bold group border border-[#e5e0d6]"
                    >
                      <span className="text-sm">📘</span>
                      <span>Facebook</span>
                    </a>
                  )}

                  {social.instagram && (
                    <a
                      href={social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-[#faf7f2] hover:bg-[#e4405f] text-[#08242a] hover:text-white transition-all flex items-center gap-2 text-xs font-bold group border border-[#e5e0d6]"
                    >
                      <span className="text-sm">📸</span>
                      <span>Instagram</span>
                    </a>
                  )}

                  {social.linkedin && (
                    <a
                      href={social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-[#faf7f2] hover:bg-[#0a66c2] text-[#08242a] hover:text-white transition-all flex items-center gap-2 text-xs font-bold group border border-[#e5e0d6]"
                    >
                      <span className="text-sm">💼</span>
                      <span>LinkedIn</span>
                    </a>
                  )}

                  {social.youtube && (
                    <a
                      href={social.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-[#faf7f2] hover:bg-[#ff0000] text-[#08242a] hover:text-white transition-all flex items-center gap-2 text-xs font-bold group border border-[#e5e0d6]"
                    >
                      <span className="text-sm">▶️</span>
                      <span>YouTube</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Quick Institutional Guides (Help before writing) */}
              <div className="p-6 rounded-3xl bg-[#faf7f2] border border-[#e5e0d6] space-y-3">
                <span className="text-2xs font-bold text-[#819598] uppercase tracking-wider block">
                  {isAr ? 'روابط وخدمات سريعة' : 'Quick Institutional Services'}
                </span>

                <ul className="space-y-2 text-xs font-medium">
                  <li>
                    <Link
                      href={`/${locale}/membership`}
                      className="p-2.5 rounded-xl bg-white border border-[#e5e0d6] hover:border-[#0d3b43] text-[#08242a] hover:text-[#0d3b43] flex items-center justify-between transition-colors shadow-2xs"
                    >
                      <span>👥 {isAr ? 'طلب الانخراط والعضوية بالجمعية' : 'Membership Application'}</span>
                      <span className="text-3xs text-[#819598] rtl:rotate-180">→</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/${locale}/programs/youth-in-action`}
                      className="p-2.5 rounded-xl bg-white border border-[#e5e0d6] hover:border-[#c85a32] text-[#08242a] hover:text-[#c85a32] flex items-center justify-between transition-colors shadow-2xs"
                    >
                      <span>🤝 {isAr ? 'التطوع في مبادرة شباب في العمل' : 'Youth in Action Volunteering'}</span>
                      <span className="text-3xs text-[#819598] rtl:rotate-180">→</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/${locale}/partnerships`}
                      className="p-2.5 rounded-xl bg-white border border-[#e5e0d6] hover:border-[#99620b] text-[#08242a] hover:text-[#99620b] flex items-center justify-between transition-colors shadow-2xs"
                    >
                      <span>🏛️ {isAr ? 'دليل الشراكات والتعاون الثقافي' : 'Institutional Partnerships'}</span>
                      <span className="text-3xs text-[#819598] rtl:rotate-180">→</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/${locale}/faq`}
                      className="p-2.5 rounded-xl bg-white border border-[#e5e0d6] hover:border-[#0d3b43] text-[#08242a] hover:text-[#0d3b43] flex items-center justify-between transition-colors shadow-2xs"
                    >
                      <span>❓ {isAr ? 'الأسئلة الشائعة والأجوبة الفورية' : 'Frequently Asked Questions'}</span>
                      <span className="text-3xs text-[#819598] rtl:rotate-180">→</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} dict={dict} />
    </>
  )
}

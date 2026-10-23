'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'
import type { Dictionary } from '@/lib/i18n/dictionaries'

interface FooterProps {
  locale: string
  dict: Dictionary
}

export function Footer({ locale, dict }: FooterProps) {
  const currentYear = 2026
  const isAr = locale === 'ar'
  const isFr = locale === 'fr'

  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'success'>('idle')

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsletterEmail || !newsletterEmail.includes('@')) return
    setNewsletterStatus('success')
  }

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Section 1: عن الجمعية والحكامة (About Us & Governance)
  const aboutLinks = [
    { key: 'home', label: dict.nav.home, path: '' },
    { key: 'about', label: dict.nav.about, path: 'about' },
    {
      key: 'team',
      label: isAr ? 'فريق العمل والحكامة' : isFr ? 'Notre Équipe & Gouvernance' : 'Our Team & Governance',
      path: 'team',
    },
    {
      key: 'impact',
      label: isAr ? 'مؤشرات الأثر والتمكين' : isFr ? "Indicateurs d'Impact" : 'Community Impact & Metrics',
      path: 'impact',
    },
    {
      key: 'partnerships',
      label: isAr ? 'الشركاء والتعاون' : isFr ? 'Partenariats Institutionnels' : 'Partnerships & Network',
      path: 'partnerships',
    },
  ]

  // Section 2: البرامج والمواسم (Programs & Cultural Initiatives)
  const programsLinks = [
    {
      key: 'programs',
      label: isAr ? 'دليل البرامج الثقافية' : isFr ? 'Nos Programmes' : 'Cultural Programs Directory',
      path: 'programs',
    },
    {
      key: 'annual_program',
      label: isAr ? 'البرنامج السنوي لموسم 2026' : isFr ? 'Programme Annuel 2026' : 'Annual Program 2026',
      path: 'annual-program',
    },
    {
      key: 'youth_in_action',
      label: isAr ? 'مبادرة شباب في العمل' : isFr ? 'Initiative Jeunesse en Action' : 'Youth in Action Initiative',
      path: 'programs/youth-in-action',
    },
    {
      key: 'workshops',
      label: isAr ? 'محترفات الفنون والتراث' : isFr ? 'Ateliers Arts & Patrimoine' : 'Arts & Heritage Workshops',
      path: 'programs/arts-heritage-workshops',
    },
  ]

  // Section 3: استكشف والمستجدات (Explore & Public Agenda)
  const exploreLinks = [
    {
      key: 'events',
      label: isAr ? 'الفعاليات والملتقيات' : isFr ? 'Événements & Rencontres' : 'Events & Gatherings',
      path: 'events',
    },
    {
      key: 'news',
      label: isAr ? 'الأخبار والبيانات الرسمية' : isFr ? 'Actualités & Communiqués' : 'News & Official Statements',
      path: 'news',
    },
    {
      key: 'support',
      label: isAr ? 'دعم ومساندة الأنشطة' : isFr ? 'Soutenir nos actions' : 'Support Our Mission',
      path: 'support',
    },
    {
      key: 'faq',
      label: isAr ? 'الأسئلة الشائعة (FAQ)' : isFr ? 'Questions Fréquentes' : 'Frequently Asked Questions',
      path: 'faq',
    },
  ]

  // Section 4: الانخراط والقانوني (Engagement, Trust & Legal)
  const legalLinks = [
    {
      key: 'membership',
      label: isAr ? 'طلب الانخراط والعضوية' : isFr ? "Demande d'Adhésion" : 'Membership Application',
      path: 'membership',
    },
    {
      key: 'privacy',
      label: isAr ? 'سياسة الخصوصية (قانون 09-08)' : isFr ? 'Politique de Confidentialité' : 'Privacy Policy',
      path: 'privacy',
    },
    {
      key: 'contact',
      label: isAr ? 'قنوات الاتصال المعتمدة' : isFr ? 'Coordonnées & Contact' : 'Official Contact Channels',
      path: 'contact',
    },
  ]

  return (
    <footer
      className="bg-[#05181c] text-[#d8f0f4] border-t border-[#14505b]/40 relative overflow-hidden text-start"
      aria-label="Site Footer"
    >
      {/* Top Moroccan Accent Gradient Strip */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#c85a32] via-[#d99b26] to-[#0d3b43]" />

      {/* ============================================================
          1. PRE-FOOTER: CULTURAL DISPATCH & NEWSLETTER SHOWCASE
          ============================================================ */}
      <div className="border-b border-[#14505b]/40 bg-[#08242a]/80 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Newsletter Pitch */}
            <div className="lg:col-span-6 space-y-1.5 text-start">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#14505b]/60 border border-[#268292]/40 text-[10px] font-extrabold uppercase tracking-widest text-[#f4ce83]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f4ce83] animate-pulse" />
                <span>{isAr ? 'النشرة الثقافية الدورية' : isFr ? 'Lettre Culturelle' : 'Cultural Dispatch'}</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                {isAr
                  ? 'ابقَ متصلاً بالنبض الثقافي والفني بالمغرب'
                  : isFr
                  ? 'Restez connecté au dynamisme culturel au Maroc'
                  : 'Stay Connected to Morocco’s Cultural Movement'}
              </h3>
              <p className="text-[11px] text-[#aedfe7] leading-relaxed max-w-xl">
                {isAr
                  ? 'توصل بأجندة الفعاليات، محترفات الفنون والمسرح، ومستجدات البرامج الشبابية فور الإعلان عنها.'
                  : isFr
                  ? 'Recevez l’agenda de nos festivals, ateliers artistiques et initiatives citoyennes.'
                  : 'Get cultural agendas, theatre and arts workshops, and youth initiatives delivered directly to you.'}
              </p>
            </div>

            {/* Newsletter Input Form */}
            <div className="lg:col-span-6">
              {newsletterStatus === 'success' ? (
                <div className="p-3.5 rounded-xl bg-[#0a2d34] border border-[#f4ce83]/50 text-start flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#f4ce83] text-[#08242a] flex items-center justify-center font-black text-xs shrink-0">
                    ✓
                  </span>
                  <div>
                    <span className="font-bold text-[11px] text-white block">
                      {isAr ? 'تم تسجيل بريدك بنجاح في النشرة الثقافية' : 'Subscribed successfully'}
                    </span>
                    <span className="text-[10px] text-[#74bfcd]">
                      {isAr ? 'شكراً لاهتمامك بمواكبة أنشطة جمعية روح الفنون والثقافة.' : 'Thank you for following AMYCC.'}
                    </span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-1.5">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      required
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder={isAr ? 'أدخل بريدك الإلكتروني الرسمي...' : 'Enter your email address...'}
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#0a2d34] border border-[#1c6875] text-[11px] text-white placeholder-[#5f7174] focus:outline-none focus:border-[#f4ce83] focus:ring-1 focus:ring-[#f4ce83] transition-all"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl text-[11px] font-bold text-white bg-[#c85a32] hover:bg-[#b84e27] active:scale-95 transition-all shadow-card whitespace-nowrap shrink-0 flex items-center justify-center gap-1.5"
                    >
                      <span>{isAr ? 'اشترك الآن' : isFr ? "S'abonner" : 'Subscribe'}</span>
                      <span aria-hidden="true">{isAr ? '←' : '→'}</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-[#74bfcd] text-start">
                    {isAr
                      ? 'نحترم خصوصيتك وفق مقتضيات القانون 09-08. يمكنك إلغاء الاشتراك في أي وقت.'
                      : 'Respecting your privacy under Law 09-08. Unsubscribe at any time.'}
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          2. MAIN SITEMAP ARCHITECTURE (4 WELL-PROPORTIONED COLUMNS)
          ============================================================ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8">

          {/* Col 1: Brand & Official Identity (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-4 text-start">
            <Logo locale={locale} variant="dark" />

            <p className="text-[11px] text-[#aedfe7] leading-relaxed max-w-sm">
              {dict.footer.description}
            </p>

            {/* Official Moroccan Institutional Badges */}
            <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-[#74bfcd]">
              <span className="px-2 py-0.5 rounded-md bg-[#08242a] border border-[#14505b] font-medium">
                {isAr ? 'تأسست سنة 2026' : isFr ? 'Fondée en 2026' : 'Founded 2026'}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[#08242a] border border-[#14505b] font-medium">
                {isAr ? 'المملكة المغربية' : isFr ? 'Royaume du Maroc' : 'Kingdom of Morocco'}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[#08242a] border border-[#14505b] font-medium">
                {isAr ? 'جمعية غير ربحية' : isFr ? 'Association à but non lucratif' : 'Nonprofit'}
              </span>
            </div>

            {/* Official Contact Micro-Card */}
            <div className="p-3 rounded-xl bg-[#08242a] border border-[#14505b] text-[11px] text-[#aedfe7] space-y-1.5 max-w-sm">
              <div className="flex items-center gap-2">
                <span className="text-[#f4ce83] text-xs">✉</span>
                <a
                  href="mailto:contact@amycc.org"
                  className="hover:text-white transition-colors underline-offset-2 hover:underline font-mono"
                >
                  contact@amycc.org
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#f4ce83] text-xs">📍</span>
                <span>
                  {isAr
                    ? 'المملكة المغربية • أنشطة ممتدة بمختلف المدن المغربية'
                    : 'Kingdom of Morocco • Activities across Moroccan cities'}
                </span>
              </div>
            </div>

            {/* Official Social Media Channels */}
            <div className="pt-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#74bfcd] block mb-2">
                {isAr ? 'تابعنا على المنصات الرسمية' : 'Official Social Channels'}
              </span>
              <div className="flex items-center gap-2">
                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-lg bg-[#08242a] border border-[#14505b] hover:border-[#f4ce83] hover:text-[#f4ce83] text-[#aedfe7] flex items-center justify-center transition-all hover:scale-105"
                  aria-label="Facebook"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-lg bg-[#08242a] border border-[#14505b] hover:border-[#f4ce83] hover:text-[#f4ce83] text-[#aedfe7] flex items-center justify-center transition-all hover:scale-105"
                  aria-label="Instagram"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-lg bg-[#08242a] border border-[#14505b] hover:border-[#f4ce83] hover:text-[#f4ce83] text-[#aedfe7] flex items-center justify-center transition-all hover:scale-105"
                  aria-label="YouTube"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-lg bg-[#08242a] border border-[#14505b] hover:border-[#f4ce83] hover:text-[#f4ce83] text-[#aedfe7] flex items-center justify-center transition-all hover:scale-105"
                  aria-label="LinkedIn"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: عن الجمعية والحكامة (2 cols on lg) */}
          <div className="lg:col-span-2 text-start">
            <h4 className="font-bold text-[11px] uppercase tracking-wider text-[#f4ce83] mb-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f4ce83]" />
              <span>{isAr ? 'عن الجمعية' : isFr ? "L'Association" : 'About AMYCC'}</span>
            </h4>
            <ul className="space-y-2">
              {aboutLinks.map((item) => (
                <li key={item.key}>
                  <Link
                    href={`/${locale}${item.path ? `/${item.path}` : ''}`}
                    className="text-[12px] text-[#aedfe7] hover:text-white transition-all flex items-center gap-1.5 group"
                  >
                    <span className="text-[#1c6875] group-hover:text-[#f4ce83] group-hover:translate-x-0.5 transition-transform" aria-hidden="true">
                      {isAr ? '‹' : '›'}
                    </span>
                    <span className="group-hover:underline underline-offset-4">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: البرامج والمواسم (3 cols on lg) */}
          <div className="lg:col-span-3 text-start">
            <h4 className="font-bold text-[11px] uppercase tracking-wider text-[#f4ce83] mb-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f4ce83]" />
              <span>{isAr ? 'البرامج والمبادرات' : isFr ? 'Programmes & Agenda' : 'Programs & Seasons'}</span>
            </h4>
            <ul className="space-y-2">
              {programsLinks.map((item) => (
                <li key={item.key}>
                  <Link
                    href={`/${locale}/${item.path}`}
                    className="text-[12px] text-[#aedfe7] hover:text-white transition-all flex items-center gap-1.5 group"
                  >
                    <span className="text-[#1c6875] group-hover:text-[#f4ce83] group-hover:translate-x-0.5 transition-transform" aria-hidden="true">
                      {isAr ? '‹' : '›'}
                    </span>
                    <span className="group-hover:underline underline-offset-4">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Quick Micro Callout: Annual Season */}
            <div className="mt-4 p-2.5 rounded-lg bg-[#08242a] border border-[#14505b] text-[10px] space-y-1">
              <span className="font-bold text-[#f4ce83] block">
                {isAr ? 'الموسم الثقافي 2026' : 'Cultural Season 2026'}
              </span>
              <p className="text-[#74bfcd] leading-tight line-clamp-2">
                {isAr
                  ? 'أجندة سنوية متكاملة تحتفي بالتراث المغربي وإبداع الشباب.'
                  : 'An integrated annual agenda celebrating Moroccan heritage.'}
              </p>
              <Link
                href={`/${locale}/annual-program`}
                className="inline-block text-[#f4ce83] hover:underline font-bold mt-0.5"
              >
                {isAr ? 'استعرض الأجندة ←' : 'View Agenda →'}
              </Link>
            </div>
          </div>

          {/* Col 4: استكشف والانخراط (3 cols on lg) */}
          <div className="lg:col-span-3 text-start space-y-5">
            <div>
              <h4 className="font-bold text-[11px] uppercase tracking-wider text-[#f4ce83] mb-3 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f4ce83]" />
                <span>{isAr ? 'استكشف والمستجدات' : isFr ? 'Explorer & Actualités' : 'Explore & News'}</span>
              </h4>
              <ul className="space-y-2">
                {exploreLinks.map((item) => (
                  <li key={item.key}>
                    <Link
                      href={`/${locale}/${item.path}`}
                      className="text-[12px] text-[#aedfe7] hover:text-white transition-all flex items-center gap-1.5 group"
                    >
                      <span className="text-[#1c6875] group-hover:text-[#f4ce83] group-hover:translate-x-0.5 transition-transform" aria-hidden="true">
                        {isAr ? '‹' : '›'}
                      </span>
                      <span className="group-hover:underline underline-offset-4">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-[11px] uppercase tracking-wider text-[#f4ce83] mb-2.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f4ce83]" />
                <span>{isAr ? 'الانخراط والقانوني' : isFr ? 'Adhésion & Légal' : 'Membership & Legal'}</span>
              </h4>
              <ul className="space-y-1.5">
                {legalLinks.map((item) => (
                  <li key={item.key}>
                    <Link
                      href={`/${locale}/${item.path}`}
                      className="text-[12px] text-[#aedfe7] hover:text-white transition-all flex items-center gap-1.5 group"
                    >
                      <span className="text-[#1c6875] group-hover:text-[#f4ce83] group-hover:translate-x-0.5 transition-transform" aria-hidden="true">
                        {isAr ? '‹' : '›'}
                      </span>
                      <span className="group-hover:underline underline-offset-4">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Elevated CTA Button */}
              <div className="mt-3">
                <Link
                  href={`/${locale}/membership`}
                  className="inline-flex items-center justify-center w-full py-2 px-3 rounded-lg text-[11px] font-bold text-white bg-[#c85a32] hover:bg-[#b84e27] active:scale-95 transition-all shadow-card gap-1.5 group"
                >
                  <span>{dict.membership.apply}</span>
                  <span className="group-hover:translate-x-0.5 transition-transform" aria-hidden="true">
                    ↗
                  </span>
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* ============================================================
            3. INSTITUTIONAL BOTTOM BAR WITH REFINED TYPOGRAPHY & BUTTONS
            ============================================================ */}
        <div className="mt-8 pt-5 border-t border-[#14505b]/50 flex flex-col lg:flex-row items-center justify-between gap-3 text-[11px] text-[#74bfcd]">
          {/* Copyright notice */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f4ce83] shrink-0" />
            <p className="whitespace-nowrap">
              © {currentYear} AMYCC — {isAr ? 'جمعية روح الفنون والثقافة' : 'Spirit of Arts & Culture Association'} • {dict.footer.rights}
            </p>
          </div>

          {/* Quick Direct Text Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[11px] text-[#8ec8d2]">
            <Link href={`/${locale}`} className="hover:text-white transition-colors">
              {dict.nav.home}
            </Link>
            <span className="text-[#1c6875]">•</span>
            <Link href={`/${locale}/about`} className="hover:text-white transition-colors">
              {dict.nav.about}
            </Link>
            <span className="text-[#1c6875]">•</span>
            <Link href={`/${locale}/programs`} className="hover:text-white transition-colors">
              {dict.nav.programs}
            </Link>
            <span className="text-[#1c6875]">•</span>
            <Link href={`/${locale}/events`} className="hover:text-white transition-colors">
              {dict.nav.events}
            </Link>
            <span className="text-[#1c6875]">•</span>
            <Link href={`/${locale}/news`} className="hover:text-white transition-colors">
              {dict.nav.news}
            </Link>
            <span className="text-[#1c6875]">•</span>
            <Link href={`/${locale}/membership`} className="hover:text-white transition-colors">
              {dict.nav.membership}
            </Link>
            <span className="text-[#1c6875]">•</span>
            <Link href={`/${locale}/privacy`} className="hover:text-white transition-colors">
              {dict.footer.privacy}
            </Link>
            <span className="text-[#1c6875]">•</span>
            <Link href={`/${locale}/faq`} className="hover:text-white transition-colors">
              {dict.nav.faq}
            </Link>
            <span className="text-[#1c6875]">•</span>
            <Link href={`/${locale}/contact`} className="hover:text-white transition-colors">
              {dict.nav.contact}
            </Link>
          </div>

          {/* Right side controls: Back to top + Admin portal */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#08242a] border border-[#14505b] hover:border-[#f4ce83] text-[#aedfe7] hover:text-white transition-all text-[11px] font-semibold whitespace-nowrap shadow-2xs"
              aria-label={isAr ? 'العودة إلى أعلى الصفحة' : 'Back to top'}
            >
              <span>{isAr ? 'العودة للأعلى' : isFr ? 'Haut de page' : 'Back to top'}</span>
              <span aria-hidden="true">↑</span>
            </button>

            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#08242a] text-[#5e9ea9] hover:text-[#f4ce83] border border-[#14505b]/60 hover:border-[#f4ce83]/50 transition-colors text-[11px] font-medium whitespace-nowrap shadow-2xs"
              title={isAr ? 'بوابة إدارة المنصة' : 'Admin Portal'}
            >
              <span>🔒</span>
              <span>{isAr ? 'الإدارة' : 'Admin'}</span>
            </Link>
          </div>
        </div>

      </div>
    </footer>
  )
}

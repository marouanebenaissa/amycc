'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'
import type { Dictionary } from '@/lib/i18n/dictionaries'

interface FooterProps {
  locale: string
  dict: Dictionary
  contactEmail?: string
  initialSocial?: {
    facebook?: string
    instagram?: string
    linkedin?: string
    youtube?: string
    twitter?: string
    tiktok?: string
    whatsapp?: string
  }
}

export function Footer({ locale, dict, contactEmail: initialEmail, initialSocial }: FooterProps) {
  const currentYear = 2026
  const isAr = locale === 'ar'
  const isFr = locale === 'fr'

  const [contactEmail, setContactEmail] = useState<string>(initialEmail || '')
  const [socialLinks, setSocialLinks] = useState<{
    facebook?: string
    instagram?: string
    linkedin?: string
    youtube?: string
    twitter?: string
    tiktok?: string
    whatsapp?: string
  }>(initialSocial || {
    facebook: 'https://facebook.com/amycc.marrakech',
    instagram: 'https://instagram.com/amycc.officiel',
    linkedin: 'https://linkedin.com/company/amycc-marrakech',
    youtube: 'https://youtube.com/@amycc-marrakech',
  })
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    fetch('/api/settings/contact')
      .then((r) => r.json())
      .then((data) => {
        if (data?.channels?.primaryEmail && !initialEmail) {
          setContactEmail(data.channels.primaryEmail)
        }
        if (data?.social) {
          setSocialLinks((prev) => ({
            ...prev,
            ...data.social,
          }))
        }
      })
      .catch(() => {})
  }, [initialEmail])

  const displayEmail = contactEmail || initialEmail || 'contact@amycc.org'

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) return
    setSubscribed(true)
  }

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // 1. Column "عن الجمعية" (About AMYCC)
  const aboutLinks = [
    { label: isAr ? 'من نحن' : isFr ? 'À propos de nous' : 'About Us', path: 'about' },
    { label: isAr ? 'فريق العمل' : isFr ? 'Notre équipe' : 'Our Team', path: 'team' },
    { label: isAr ? 'الأثر المجتمعي' : isFr ? 'Notre impact' : 'Community Impact', path: 'impact' },
    { label: isAr ? 'الشراكات المؤسسية' : isFr ? 'Partenariats' : 'Partnerships', path: 'partnerships' },
    { label: isAr ? 'الأسئلة الشائعة' : isFr ? 'FAQ' : 'FAQ', path: 'faq' },
  ]

  // 2. Column "البرامج والفعاليات" (Programs & Events)
  const programLinks = [
    { label: isAr ? 'دليل جميع البرامج' : isFr ? 'Tous les programmes' : 'All Programs', path: 'programs' },
    { label: isAr ? 'البرنامج السنوي 2026' : isFr ? 'Programme annuel 2026' : 'Annual Program 2026', path: 'annual-program' },
    { label: isAr ? 'مبادرة شباب في العمل' : isFr ? 'Jeunesse en Action' : 'Youth in Action', path: 'programs/youth-in-action' },
    { label: isAr ? 'محترفات الفنون والتراث' : isFr ? 'Ateliers Arts & Patrimoine' : 'Arts & Heritage Workshops', path: 'programs/arts-heritage-workshops' },
    { label: isAr ? 'الفعاليات الثقافية' : isFr ? 'Événements culturels' : 'Cultural Events', path: 'events' },
    { label: isAr ? 'الأخبار والمستجدات' : isFr ? 'Actualités & Presse' : 'News & Press', path: 'news' },
  ]

  // 3. Column "الانخراط والدعم" (Get Involved & Support)
  const actionLinks = [
    { label: isAr ? 'طلب العضوية والانخراط' : isFr ? 'Rejoindre / Adhésion' : 'Join / Membership', path: 'membership', highlight: true },
    { label: isAr ? 'الدعم ورعاية المبادرات' : isFr ? 'Soutien & Mécénat' : 'Support & Patronage', path: 'support', highlight: false },
    { label: isAr ? 'تواصل معنا' : isFr ? 'Contactez-nous' : 'Contact Us', path: 'contact', highlight: false },
    { label: isAr ? 'سياسة الخصوصية' : isFr ? 'Politique de confidentialité' : 'Privacy Policy', path: 'privacy', highlight: false },
  ]

  return (
    <footer className="bg-[#181516] text-[#e2ded6] pt-14 pb-8 border-t border-[#d2a82b]/30 text-start">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* ============================================================
            1. TOP 4 BALANCED COLUMNS
            ============================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">

          {/* Col 1: Brand & Contact Info (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Logo locale={locale} variant="dark" />

            <p className="text-xs text-[#cfcac2] leading-relaxed max-w-sm pt-1">
              {isAr
                ? 'تجمع جمعية روح الفنون والثقافة (AMYCC) الشباب حول الإبداع الفني، الموسيقى، المسرح، وصون التراث المغربي والتمكين المجتمعي.'
                : isFr
                ? "L'AMYCC rassemble les jeunes autour de la créativité artistique, de la musique, du théâtre, du patrimoine et de l'autonomisation citoyenne."
                : 'AMYCC brings young people together through arts, music, theatre, Moroccan heritage preservation, and youth empowerment.'}
            </p>

            {/* Quick Contact & Location */}
            <div className="pt-1 space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-3xs text-[#ffd22f]">✉️</span>
                <a
                  href={`mailto:${displayEmail}`}
                  className="text-xs text-[#cfcac2] hover:text-[#ffd22f] transition-colors font-mono"
                >
                  {displayEmail}
                </a>
              </div>
              <div className="flex items-center gap-2 text-2xs text-[#8a857b]">
                <span className="text-3xs text-[#d2a82b]">📍</span>
                <span>{isAr ? 'مراكش • المملكة المغربية' : 'Marrakech • Kingdom of Morocco'}</span>
              </div>
            </div>

            {/* Social Media Buttons */}
            <div className="pt-2">
              <span className="text-3xs uppercase tracking-wider text-[#8a857b] font-bold block mb-2">
                {isAr ? 'تابعنا على الشبكات' : isFr ? 'Suivez-nous' : 'Follow Us'}
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {(() => {
                  const socialItems = [
                    {
                      key: 'facebook',
                      label: 'Facebook',
                      url: socialLinks.facebook,
                      svg: (
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      ),
                    },
                    {
                      key: 'youtube',
                      label: 'YouTube',
                      url: socialLinks.youtube,
                      svg: (
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                      ),
                    },
                    {
                      key: 'linkedin',
                      label: 'LinkedIn',
                      url: socialLinks.linkedin,
                      svg: (
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      ),
                    },
                    {
                      key: 'instagram',
                      label: 'Instagram',
                      url: socialLinks.instagram,
                      svg: (
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      ),
                    },
                    {
                      key: 'twitter',
                      label: 'X (Twitter)',
                      url: socialLinks.twitter,
                      svg: (
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      ),
                    },
                    {
                      key: 'tiktok',
                      label: 'TikTok',
                      url: socialLinks.tiktok,
                      svg: (
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                        </svg>
                      ),
                    },
                    {
                      key: 'whatsapp',
                      label: 'WhatsApp',
                      url: socialLinks.whatsapp,
                      svg: (
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.204 8.204 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.216 8.216 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.51 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.25-1.49-1.4-1.74-.14-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.54.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.16-.48-.29z" />
                        </svg>
                      ),
                    },
                  ]

                  const activeItems = socialItems.filter((item) => item.url && item.url.trim().length > 0)
                  const itemsToRender = activeItems.length > 0 ? activeItems : socialItems.slice(0, 4)

                  return itemsToRender.map((item) => (
                    <a
                      key={item.key}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-xl bg-[#231f20] border border-[#383334] text-[#cfcac2] hover:bg-[#bd3227] hover:border-[#bd3227] hover:text-white flex items-center justify-center transition-all hover:scale-105 shadow-2xs"
                      aria-label={item.label}
                      title={item.label}
                    >
                      {item.svg}
                    </a>
                  ))
                })()}
              </div>
            </div>
          </div>

          {/* Col 2: About Association (2.5 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5 border-b border-[#d2a82b]/30 pb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffd22f]" />
              <span>{isAr ? 'عن الجمعية' : isFr ? "L'Association" : 'About Us'}</span>
            </h3>
            <ul className="space-y-2">
              {aboutLinks.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={`/${locale}/${item.path}`}
                    className="text-xs text-[#cfcac2] hover:text-[#ffd22f] transition-colors block py-0.5"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Programs & Events (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5 border-b border-[#d2a82b]/30 pb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffd22f]" />
              <span>{isAr ? 'البرامج والفعاليات' : isFr ? 'Programmes & Événements' : 'Programs & Events'}</span>
            </h3>
            <ul className="space-y-2">
              {programLinks.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={`/${locale}/${item.path}`}
                    className="text-xs text-[#cfcac2] hover:text-[#ffd22f] transition-colors block py-0.5"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Action & Support Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5 border-b border-[#d2a82b]/30 pb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffd22f]" />
              <span>{isAr ? 'الانخراط والدعم' : isFr ? 'Rejoindre & Soutien' : 'Get Involved'}</span>
            </h3>
            <ul className="space-y-2">
              {actionLinks.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={`/${locale}/${item.path}`}
                    className={`text-xs block py-0.5 transition-colors ${
                      item.highlight
                        ? 'text-[#ffd22f] font-bold hover:underline'
                        : 'text-[#cfcac2] hover:text-[#ffd22f]'
                    }`}
                  >
                    {item.label} {item.highlight && '↗'}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* ============================================================
            2. HORIZONTAL COMPACT CULTURAL NEWSLETTER STRIP
            ============================================================ */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#231f20] border border-[#d2a82b]/30 shadow-lg">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
            {/* Title & Subtitle */}
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="text-sm">📬</span>
                <h4 className="text-sm font-bold text-white">
                  {isAr
                    ? 'النشرة الثقافية لجمعية روح الفنون والثقافة (AMYCC)'
                    : isFr
                    ? "Lettre culturelle de l'AMYCC"
                    : 'AMYCC Cultural Newsletter'}
                </h4>
              </div>
              <p className="text-2xs text-[#8a857b] leading-relaxed">
                {isAr
                  ? 'مواكبة الورشات، الفعاليات الفنية، والمبادرات الشبابية في بريدك مباشرة وبدون إزعاج.'
                  : isFr
                  ? 'Suivez les ateliers, événements artistiques et initiatives jeunesse directement dans votre boîte mail.'
                  : 'Cultural highlights, workshops, and youth initiatives delivered directly to your inbox.'}
              </p>
            </div>

            {/* Form */}
            <div className="w-full lg:w-auto shrink-0">
              {subscribed ? (
                <div className="px-4 py-2.5 rounded-xl bg-[#181516] border border-[#ffd22f]/50 text-xs text-[#ffd22f] font-bold flex items-center gap-2">
                  <span>✓</span>
                  <span>
                    {isAr
                      ? 'تم تسجيل بريدك بنجاح، شكراً لاهتمامك!'
                      : 'Thank you for subscribing!'}
                  </span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-stretch gap-2 w-full lg:w-96">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      isAr
                        ? 'أدخل بريدك الإلكتروني...'
                        : isFr
                        ? 'Votre adresse e-mail...'
                        : 'Enter your email address...'
                    }
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#181516] border border-[#383334] text-xs text-white placeholder-[#78736a] focus:outline-none focus:border-[#ffd22f] transition-all"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#bd3227] hover:bg-[#a3261c] active:scale-95 transition-all shadow-md shrink-0"
                  >
                    {isAr ? 'اشتراك' : isFr ? "S'abonner" : 'Subscribe'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================
            3. MINIMAL BOTTOM BAR
            ============================================================ */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-2xs text-[#8a857b] border-t border-[#383334]">
          <p className="whitespace-nowrap">
            © {currentYear} AMYCC — {dict.footer.rights}
          </p>

          <div className="flex items-center gap-3 text-2xs">
            <Link href={`/${locale}/privacy`} className="hover:text-white transition-colors">
              {dict.footer.privacy}
            </Link>
            <span className="text-[#383334]">•</span>
            <Link href={`/${locale}/faq`} className="hover:text-white transition-colors">
              {dict.nav.faq}
            </Link>
            <span className="text-[#383334]">•</span>
            <Link href={`/${locale}/contact`} className="hover:text-white transition-colors">
              {dict.nav.contact}
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 font-semibold text-[#cfcac2] hover:text-[#ffd22f] transition-colors"
              aria-label={isAr ? 'العودة إلى أعلى الصفحة' : 'Back to top'}
            >
              <span>{isAr ? 'العودة للأعلى' : 'Back to top'}</span>
              <span>↑</span>
            </button>

            <Link
              href="/admin/login"
              className="text-[#8a857b] hover:text-[#ffd22f] transition-colors text-3xs flex items-center gap-1 font-mono"
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

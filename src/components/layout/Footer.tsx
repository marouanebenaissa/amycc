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

  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

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

  // Program Column Links (عمود البرامج)
  const programLinks = [
    { label: isAr ? 'جميع البرامج' : isFr ? 'Tous les programmes' : 'All Programs', path: 'programs' },
    { label: isAr ? 'البرنامج السنوي' : isFr ? 'Programme annuel' : 'Annual Program', path: 'annual-program' },
    { label: isAr ? 'مبادرة شباب في العمل' : isFr ? 'Jeunesse en Action' : 'Youth in Action', path: 'programs/youth-in-action' },
    { label: isAr ? 'محترفات الفنون والتراث' : isFr ? 'Ateliers Arts & Patrimoine' : 'Arts & Heritage Workshops', path: 'programs/arts-heritage-workshops' },
    { label: isAr ? 'الأثر المجتمعي' : isFr ? 'Notre impact' : 'Community Impact', path: 'impact' },
    { label: isAr ? 'طلب العضوية والانخراط' : isFr ? 'Rejoindre / Adhésion' : 'Join / Membership', path: 'membership' },
  ]

  // Explore Column Links (عمود استكشف)
  const exploreLinks = [
    { label: isAr ? 'من نحن' : isFr ? 'À propos' : 'About Us', path: 'about' },
    { label: isAr ? 'فريقنا' : isFr ? 'Notre équipe' : 'Our Team', path: 'team' },
    { label: isAr ? 'الفعاليات' : isFr ? 'Événements' : 'Events', path: 'events' },
    { label: isAr ? 'الأخبار والمستجدات' : isFr ? 'Actualités' : 'News', path: 'news' },
    { label: isAr ? 'الشراكات' : isFr ? 'Partenariats' : 'Partnerships', path: 'partnerships' },
    { label: isAr ? 'الدعم والرعاية' : isFr ? 'Soutien' : 'Support', path: 'support' },
    { label: isAr ? 'الأسئلة الشائعة' : isFr ? 'FAQ' : 'FAQ', path: 'faq' },
    { label: isAr ? 'تواصل معنا' : isFr ? 'Contact' : 'Contact', path: 'contact' },
  ]

  return (
    <footer className="bg-[#051419] text-[#d8f0f4] pt-14 pb-8 border-t border-[#14505b]/40 text-start">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* ============================================================
            1. TOP 4 COLUMNS (MOROCCO88 INSPIRED CLEAN HIERARCHY)
            ============================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">

          {/* Col 1: Brand & Contact Info (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Logo locale={locale} variant="dark" />

            <p className="text-xs text-[#aedfe7] leading-relaxed max-w-sm pt-1">
              {isAr
                ? 'تجمع جمعية روح الفنون والثقافة (AMYCC) الشباب حول الإبداع الفني، الموسيقى، المسرح، وصون التراث المغربي والتمكين المجتمعي.'
                : isFr
                ? "L'AMYCC rassemble les jeunes autour de la créativité artistique, de la musique, du théâtre, du patrimoine et de l'autonomisation citoyenne."
                : 'AMYCC brings young people together through arts, music, theatre, Moroccan heritage preservation, and youth empowerment.'}
            </p>

            <div className="pt-2 space-y-1">
              <span className="text-xs font-bold text-white block">
                {isAr ? 'تواصل معنا' : 'Contact'}
              </span>
              <a
                href="mailto:contact@amycc.org"
                className="text-xs text-[#74bfcd] hover:text-[#f4ce83] transition-colors block font-mono"
              >
                contact@amycc.org
              </a>
              <span className="text-2xs text-[#5f7174] block">
                {isAr ? 'مراكش • المملكة المغربية' : 'Marrakech • Kingdom of Morocco'}
              </span>
            </div>
          </div>

          {/* Col 2: PROGRAM (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
              {isAr ? 'البرامج' : isFr ? 'PROGRAMMES' : 'PROGRAM'}
            </h3>
            <ul className="space-y-2">
              {programLinks.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={`/${locale}/${item.path}`}
                    className="text-xs text-[#aedfe7] hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: EXPLORE (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
              {isAr ? 'استكشف' : isFr ? 'EXPLORER' : 'EXPLORE'}
            </h3>
            <ul className="space-y-2">
              {exploreLinks.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={`/${locale}/${item.path}`}
                    className="text-xs text-[#aedfe7] hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: FOLLOW US (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
              {isAr ? 'تابعنا' : isFr ? 'SUIVEZ-NOUS' : 'FOLLOW US'}
            </h3>
            <p className="text-xs text-[#aedfe7] leading-relaxed">
              {isAr
                ? 'تابع آخر أخبار وفعاليات الجمعية.'
                : isFr
                ? "Suivez les dernières actualités d'AMYCC."
                : 'Follow the latest AMYCC news.'}
            </p>

            {/* Circular Social Buttons */}
            <div className="flex items-center gap-2.5 pt-1">
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#0a242a] border border-[#1c6875]/60 hover:bg-[#c85a32] hover:border-[#c85a32] text-[#aedfe7] hover:text-white flex items-center justify-center transition-all hover:scale-105 shadow-2xs"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#0a242a] border border-[#1c6875]/60 hover:bg-[#c85a32] hover:border-[#c85a32] text-[#aedfe7] hover:text-white flex items-center justify-center transition-all hover:scale-105 shadow-2xs"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#0a242a] border border-[#1c6875]/60 hover:bg-[#c85a32] hover:border-[#c85a32] text-[#aedfe7] hover:text-white flex items-center justify-center transition-all hover:scale-105 shadow-2xs"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

        </div>

        {/* ============================================================
            2. THE MOROCCO88 STYLE SUBSCRIPTION CARD
            ============================================================ */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#091f26] border border-[#14505b]/60 shadow-xl space-y-4">
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-white">
              {isAr
                ? 'اشترك لمتابعة جديد جمعية روح الفنون والثقافة (AMYCC)'
                : isFr
                ? "Abonnez-vous aux dernières actualités d'AMYCC"
                : 'Subscribe for the latest from AMYCC'}
            </h3>
            <p className="text-xs text-[#aedfe7]">
              {isAr
                ? 'أخبار الفعاليات، ورشات الإبداع والموسيقى، وأنشطة الشباب تصلك مباشرة.'
                : isFr
                ? 'Actualités, événements, ateliers et temps forts livrés directement dans votre boîte.'
                : 'News, events, workshops and cultural highlights delivered directly to your inbox.'}
            </p>
          </div>

          {subscribed ? (
            <div className="p-4 rounded-xl bg-[#0d3b43] border border-[#f4ce83]/40 text-xs text-white flex items-center gap-2">
              <span className="text-[#f4ce83] font-bold">✓</span>
              <span>
                {isAr
                  ? 'تم تسجيل اشتراكك بنجاح. شكراً لاهتمامك بمواكبة أنشطة AMYCC.'
                  : 'Thank you for subscribing to AMYCC updates.'}
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-3">
              {/* First Name Input (Optional) */}
              <div>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder={
                    isAr
                      ? 'الاسم الشخصي (اختياري)'
                      : isFr
                      ? 'Prénom (optionnel)'
                      : 'First name (optional)'
                  }
                  className="w-full px-4 py-3 rounded-xl bg-[#051419] border border-[#1c6875]/50 text-xs text-white placeholder-[#5f7174] focus:outline-none focus:border-[#f4ce83] transition-all"
                />
              </div>

              {/* Email + Subscribe Button Row */}
              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    isAr
                      ? 'بريدك الإلكتروني'
                      : isFr
                      ? 'Votre e-mail'
                      : 'Your email'
                  }
                  className="flex-1 px-4 py-3 rounded-xl bg-[#051419] border border-[#1c6875]/50 text-xs text-white placeholder-[#5f7174] focus:outline-none focus:border-[#f4ce83] transition-all"
                />
                <button
                  type="submit"
                  className="px-8 py-3 rounded-xl text-xs font-bold text-white bg-[#c85a32] hover:bg-[#b84e27] active:scale-95 transition-all shadow-md shrink-0"
                >
                  {isAr ? 'اشتراك' : isFr ? "S'abonner" : 'Subscribe'}
                </button>
              </div>

              <p className="text-[10px] text-[#74bfcd]">
                {isAr
                  ? 'بالاشتراك، أنت توافق على تلقي مستجدات AMYCC. يمكنك إلغاء الاشتراك في أي وقت.'
                  : isFr
                  ? "En vous abonnant, vous acceptez de recevoir les actualités d'AMYCC. Désabonnement à tout moment."
                  : 'By subscribing, you agree to receive AMYCC updates. You may request to unsubscribe at any time.'}
              </p>
            </form>
          )}
        </div>

        {/* ============================================================
            3. MINIMAL BOTTOM BAR
            ============================================================ */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#74bfcd] border-t border-[#14505b]/40">
          <p className="whitespace-nowrap">
            © {currentYear} AMYCC — {dict.footer.rights}
          </p>

          <div className="flex items-center gap-4 text-xs">
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

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#aedfe7] hover:text-white transition-colors"
              aria-label={isAr ? 'العودة إلى أعلى الصفحة' : 'Back to top'}
            >
              <span>{isAr ? 'العودة للأعلى' : 'Back to top'}</span>
              <span>↑</span>
            </button>

            <Link
              href="/admin/login"
              className="text-[#48828c] hover:text-[#f4ce83] transition-colors text-[11px]"
              title={isAr ? 'بوابة إدارة المنصة' : 'Admin Portal'}
            >
              🔒 {isAr ? 'الإدارة' : 'Admin'}
            </Link>
          </div>
        </div>

      </div>
    </footer>
  )
}

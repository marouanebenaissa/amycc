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

  // Section 1: عن الجمعية (About Us & Governance)
  const aboutLinks = [
    { key: 'home', label: dict.nav.home, path: '' },
    { key: 'about', label: dict.nav.about, path: 'about' },
    { key: 'team', label: dict.nav.team, path: 'team' },
    { key: 'impact', label: dict.nav.impact, path: 'impact' },
    { key: 'contact', label: dict.nav.contact, path: 'contact' },
  ]

  // Section 2: البرامج والفعاليات (Programs, Agenda & Activities)
  const programsLinks = [
    { key: 'programs', label: dict.nav.programs, path: 'programs' },
    { key: 'annual_program', label: dict.nav.annual_program, path: 'annual-program' },
    {
      key: 'youth_in_action',
      label: isAr ? 'مبادرة شباب في العمل' : isFr ? 'Jeunesse en Action' : 'Youth in Action',
      path: 'programs/youth-in-action',
    },
    {
      key: 'workshops',
      label: isAr ? 'محترفات الفنون والتراث' : isFr ? 'Ateliers Arts & Patrimoine' : 'Arts & Heritage Workshops',
      path: 'programs/arts-heritage-workshops',
    },
    { key: 'events', label: dict.nav.events, path: 'events' },
    { key: 'news', label: dict.nav.news, path: 'news' },
  ]

  // Section 3: المشاركة والشراكات (Get Involved & Partnerships)
  const involvementLinks = [
    { key: 'membership', label: dict.nav.membership, path: 'membership' },
    { key: 'partnerships', label: dict.nav.partnerships, path: 'partnerships' },
    { key: 'support', label: dict.nav.support, path: 'support' },
    { key: 'faq', label: dict.nav.faq, path: 'faq' },
  ]

  // Section 4: الشفافية والقانوني (Legal & Institutional Support)
  const legalLinks = [
    { key: 'privacy', label: dict.footer.privacy, path: 'privacy' },
    { key: 'faq', label: dict.nav.faq, path: 'faq' },
    { key: 'contact', label: dict.nav.contact, path: 'contact' },
  ]

  return (
    <footer className="bg-[#08242a] text-[#d8f0f4] border-t border-[#14505b]/40 relative overflow-hidden" aria-label="Site Footer">
      {/* Top Moroccan Accent Gradient Strip */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#c85a32] via-[#d99b26] to-[#0d3b43]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        {/* Main 5-Column Sitemap Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-8 lg:gap-8">

          {/* Col 1: Brand & Official Identity (3 cols on lg) */}
          <div className="lg:col-span-3 space-y-4">
            <Logo locale={locale} variant="dark" />
            <p className="text-xs text-[#aedfe7] leading-relaxed max-w-sm">
              {dict.footer.description}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2 text-3xs text-[#74bfcd]">
              <span className="px-2.5 py-1 rounded-md bg-[#0a2d34] border border-[#14505b]">
                {isAr ? 'تأسست سنة 2026' : isFr ? 'Fondée en 2026' : 'Founded 2026'}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#0a2d34] border border-[#14505b]">
                {isAr ? 'المملكة المغربية' : isFr ? 'Royaume du Maroc' : 'Kingdom of Morocco'}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#0a2d34] border border-[#14505b]">
                {isAr ? 'جمعية غير ربحية' : isFr ? 'Association à but non lucratif' : 'Nonprofit Association'}
              </span>
            </div>

            {/* Quick Official Contact details */}
            <div className="pt-2 text-3xs text-[#74bfcd] space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[#f4ce83]">✉</span>
                <a href="mailto:contact@amycc.org" className="hover:text-white transition-colors underline-offset-2 hover:underline">
                  contact@amycc.org
                </a>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#f4ce83]">📍</span>
                <span>{isAr ? 'المملكة المغربية' : isFr ? 'Royaume du Maroc' : 'Morocco'}</span>
              </div>
            </div>
          </div>

          {/* Col 2: عن الجمعية (2 cols on lg) */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#f4ce83] mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f4ce83]" />
              <span>{isAr ? 'عن الجمعية' : isFr ? "L'Association" : 'About Us'}</span>
            </h3>
            <ul className="space-y-2.5">
              {aboutLinks.map((item) => (
                <li key={item.key}>
                  <Link
                    href={`/${locale}${item.path ? `/${item.path}` : ''}`}
                    className="text-xs text-[#aedfe7] hover:text-white hover:underline underline-offset-4 transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="text-[#1c6875] group-hover:text-[#f4ce83] transition-colors" aria-hidden="true">›</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: البرامج والمواسم (3 cols on lg) */}
          <div className="lg:col-span-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#f4ce83] mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f4ce83]" />
              <span>{isAr ? 'البرامج والفعاليات' : isFr ? 'Programmes & Agenda' : 'Programs & Activities'}</span>
            </h3>
            <ul className="space-y-2.5">
              {programsLinks.map((item) => (
                <li key={item.key}>
                  <Link
                    href={`/${locale}/${item.path}`}
                    className="text-xs text-[#aedfe7] hover:text-white hover:underline underline-offset-4 transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="text-[#1c6875] group-hover:text-[#f4ce83] transition-colors" aria-hidden="true">›</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: المشاركة والشراكات (2 cols on lg) */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#f4ce83] mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f4ce83]" />
              <span>{isAr ? 'الانخراط والتعاون' : isFr ? 'Engagement & Partenariat' : 'Get Involved'}</span>
            </h3>
            <ul className="space-y-2.5">
              {involvementLinks.map((item) => (
                <li key={item.key}>
                  <Link
                    href={`/${locale}/${item.path}`}
                    className="text-xs text-[#aedfe7] hover:text-white hover:underline underline-offset-4 transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="text-[#1c6875] group-hover:text-[#f4ce83] transition-colors" aria-hidden="true">›</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Quick Membership CTA Button in Footer */}
            <div className="mt-5">
              <Link
                href={`/${locale}/membership`}
                className="inline-flex items-center justify-center w-full py-2 px-3 rounded-lg text-3xs font-bold text-white bg-[#c85a32] hover:bg-[#b84e27] transition-all shadow-xs"
              >
                {dict.membership.apply} ↗
              </Link>
            </div>
          </div>

          {/* Col 5: المساعدة والقانوني (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#f4ce83] mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f4ce83]" />
              <span>{isAr ? 'المساعدة والقانوني' : isFr ? 'Assistance & Légal' : 'Legal & Support'}</span>
            </h3>
            <ul className="space-y-2.5">
              {legalLinks.map((item) => (
                <li key={item.key}>
                  <Link
                    href={`/${locale}/${item.path}`}
                    className="text-xs text-[#aedfe7] hover:text-white hover:underline underline-offset-4 transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="text-[#1c6875] group-hover:text-[#f4ce83] transition-colors" aria-hidden="true">›</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Micro Badge for Initiative Youth in Action */}
            <div className="p-3 rounded-xl bg-[#0a2d34] border border-[#14505b] text-3xs space-y-1.5">
              <span className="font-bold text-[#f4ce83] block">
                {isAr ? 'مبادرة شباب في العمل' : 'Youth in Action'}
              </span>
              <p className="text-[#74bfcd] leading-tight line-clamp-2">
                {isAr
                  ? 'برنامج رائد لإشراك الشباب في القيادة الثقافية والتطوع.'
                  : 'Empowering youth through cultural civic leadership.'}
              </p>
              <Link
                href={`/${locale}/programs/youth-in-action`}
                className="inline-block text-[#f4ce83] hover:underline font-bold"
              >
                {isAr ? 'اكتشف التفاصيل ←' : 'Learn more →'}
              </Link>
            </div>
          </div>

        </div>

        {/* Institutional Bottom Bar */}
        <div className="mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-3xs text-[#74bfcd] border-t border-[#14505b]/60">
          <p>
            © {currentYear} AMYCC — {isAr ? 'جمعية روح الفنون والثقافة' : 'Spirit of Arts & Culture Association'} • {dict.footer.rights}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <Link href={`/${locale}`} className="hover:text-white transition-colors">
              {dict.nav.home}
            </Link>
            <span>•</span>
            <Link href={`/${locale}/about`} className="hover:text-white transition-colors">
              {dict.nav.about}
            </Link>
            <span>•</span>
            <Link href={`/${locale}/programs`} className="hover:text-white transition-colors">
              {dict.nav.programs}
            </Link>
            <span>•</span>
            <Link href={`/${locale}/events`} className="hover:text-white transition-colors">
              {dict.nav.events}
            </Link>
            <span>•</span>
            <Link href={`/${locale}/news`} className="hover:text-white transition-colors">
              {dict.nav.news}
            </Link>
            <span>•</span>
            <Link href={`/${locale}/membership`} className="hover:text-white transition-colors">
              {dict.nav.membership}
            </Link>
            <span>•</span>
            <Link href={`/${locale}/privacy`} className="hover:text-white transition-colors">
              {dict.footer.privacy}
            </Link>
            <span>•</span>
            <Link href={`/${locale}/faq`} className="hover:text-white transition-colors">
              {dict.nav.faq}
            </Link>
            <span>•</span>
            <Link href={`/${locale}/contact`} className="hover:text-white transition-colors">
              {dict.nav.contact}
            </Link>
          </div>

          <div className="text-4xs text-[#48828c]">
            <Link href="/admin/login" className="hover:text-[#aedfe7] transition-colors" title="Administration Portal">
              {isAr ? 'بوابة الإدارة 🔒' : 'Admin Portal 🔒'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

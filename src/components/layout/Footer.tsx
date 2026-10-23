import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'
import type { Dictionary } from '@/lib/i18n/dictionaries'

interface FooterProps {
  locale: string
  dict: Dictionary
}

export function Footer({ locale, dict }: FooterProps) {
  const currentYear = 2026

  const exploreLinks = [
    { key: 'about' as const, path: 'about' },
    { key: 'programs' as const, path: 'programs' },
    { key: 'events' as const, path: 'events' },
    { key: 'news' as const, path: 'news' },
    { key: 'gallery' as const, path: 'gallery' },
  ]

  const actionLinks = [
    { key: 'membership' as const, path: 'membership' },
    { key: 'volunteer' as const, path: 'volunteer' },
    { key: 'partnerships' as const, path: 'partnerships' },
    { key: 'support' as const, path: 'support' },
  ]

  return (
    <footer className="bg-[#08242a] text-[#d8f0f4] border-t border-[#14505b]/40 relative overflow-hidden">
      {/* Top accent gradient bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#c85a32] via-[#d99b26] to-[#0d3b43]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Association Identity Column */}
          <div className="lg:col-span-2 space-y-4">
            <Logo locale={locale} variant="dark" />
            <p className="text-sm text-[#aedfe7] leading-relaxed max-w-sm">
              {dict.footer.description}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-2 text-2xs text-[#74bfcd]">
              <span className="px-2.5 py-1 rounded-md bg-[#0a2d34] border border-[#14505b]">
                {locale === 'ar' ? 'تأسست سنة 2026' : 'Founded 2026'}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#0a2d34] border border-[#14505b]">
                {locale === 'ar' ? 'المملكة المغربية' : 'Kingdom of Morocco'}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#0a2d34] border border-[#14505b]">
                {locale === 'ar' ? 'جمعية غير ربحية' : 'Nonprofit Association'}
              </span>
            </div>
          </div>

          {/* Explore Links */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest text-[#f4ce83] mb-4">
              {locale === 'ar' ? 'استكشف' : locale === 'fr' ? 'Explorer' : 'Explore'}
            </h3>
            <ul className="space-y-2.5">
              {exploreLinks.map(({ key, path }) => (
                <li key={key}>
                  <Link
                    href={`/${locale}/${path}`}
                    className="text-sm text-[#aedfe7] hover:text-white transition-colors"
                  >
                    {dict.nav[key]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get Involved Links */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest text-[#f4ce83] mb-4">
              {dict.volunteer.subtitle}
            </h3>
            <ul className="space-y-2.5">
              {actionLinks.map(({ key, path }) => (
                <li key={key}>
                  <Link
                    href={`/${locale}/${path}`}
                    className="text-sm text-[#aedfe7] hover:text-white transition-colors"
                  >
                    {dict.nav[key]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Initiative & Contact */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest text-[#f4ce83] mb-4">
              {dict.volunteer.initiative}
            </h3>
            <p className="text-xs text-[#74bfcd] leading-relaxed mb-4">
              {locale === 'ar'
                ? 'مبادرة رائدة تهدف إلى إشراك الشباب المغربي في الأنشطة الثقافية والمبادرات المجتمعية التطوعية.'
                : 'A flagship initiative engaging youth in cultural participation and volunteering.'}
            </p>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center text-xs font-bold text-[#f4ce83] hover:text-white transition-colors"
            >
              {dict.nav.contact} →
            </Link>
          </div>
        </div>

        {/* Legal & Bottom bar */}
        <div className="mt-14 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#74bfcd] border-t border-[#14505b]/60">
          <p>
            © {currentYear} AMYCC — {dict.footer.rights}
          </p>
          <div className="flex items-center gap-6">
            <Link href={`/${locale}/privacy`} className="hover:text-white transition-colors">
              {dict.footer.privacy}
            </Link>
            <Link href={`/${locale}/faq`} className="hover:text-white transition-colors">
              FAQ
            </Link>
            <Link href={`/${locale}/contact`} className="hover:text-white transition-colors">
              {dict.nav.contact}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

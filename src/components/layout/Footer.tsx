import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'
import type { Dictionary } from '@/lib/i18n/dictionaries'

interface FooterProps {
  locale: string
  dict: Dictionary
}

export function Footer({ locale, dict }: FooterProps) {
  const currentYear = 2026

  const quickLinks = [
    { key: 'about' as const, path: 'about' },
    { key: 'programs' as const, path: 'programs' },
    { key: 'events' as const, path: 'events' },
    { key: 'news' as const, path: 'news' },
  ]

  const getInvolvedLinks = [
    { key: 'membership' as const, path: 'membership' },
    { key: 'volunteer' as const, path: 'volunteer' },
    { key: 'partnerships' as const, path: 'partnerships' },
    { key: 'support' as const, path: 'support' },
  ]

  return (
    <footer className="bg-[#0a0f1d] text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <Logo locale={locale} variant="dark" className="mb-4" />
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              {dict.footer.description}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-4">
              {dict.nav.home}
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map(({ key, path }) => (
                <li key={key}>
                  <Link
                    href={`/${locale}/${path}`}
                    className="text-sm text-slate-300 hover:text-[#0068ff] transition-colors"
                  >
                    {dict.nav[key]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get involved */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-4">
              {dict.volunteer.subtitle}
            </h3>
            <ul className="space-y-2.5">
              {getInvolvedLinks.map(({ key, path }) => (
                <li key={key}>
                  <Link
                    href={`/${locale}/${path}`}
                    className="text-sm text-slate-300 hover:text-[#0068ff] transition-colors"
                  >
                    {dict.nav[key]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 border-t border-slate-800/80">
          <p>
            © {currentYear} AMYCC — {dict.footer.rights}
          </p>
          <div className="flex items-center gap-6">
            <Link href={`/${locale}/privacy`} className="hover:text-slate-300 transition-colors">
              {dict.footer.privacy}
            </Link>
            <Link href={`/${locale}/contact`} className="hover:text-slate-300 transition-colors">
              {dict.nav.contact}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

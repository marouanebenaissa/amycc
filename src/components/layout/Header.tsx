import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'
import { LanguageSwitcher } from '@/components/navigation/LanguageSwitcher'
import type { Dictionary } from '@/lib/i18n/dictionaries'

interface HeaderProps {
  locale: string
  dict: Dictionary
}

const navLinks = [
  { key: 'about' as const, path: 'about' },
  { key: 'programs' as const, path: 'programs' },
  { key: 'events' as const, path: 'events' },
  { key: 'news' as const, path: 'news' },
  { key: 'volunteer' as const, path: 'volunteer' },
  { key: 'contact' as const, path: 'contact' },
]

export function Header({ locale, dict }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Skip to main content — accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:start-3 px-4 py-2 rounded-lg text-sm font-semibold bg-[#0068ff] text-white z-50 shadow-md"
      >
        {dict.common.skip_to_content}
      </a>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Logo locale={locale} />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7" aria-label="Main navigation">
            {navLinks.map(({ key, path }) => (
              <Link
                key={key}
                href={`/${locale}/${path}`}
                className="text-sm font-semibold text-slate-700 hover:text-[#0068ff] transition-colors"
              >
                {dict.nav[key]}
              </Link>
            ))}
          </nav>

          {/* Right side: Language switcher + CTA */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher currentLocale={locale} />
            <Link
              href={`/${locale}/membership`}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#0068ff] hover:bg-[#0054d1] transition-all shadow-sm hover:shadow"
            >
              {dict.membership.apply}
            </Link>

            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:text-[#0068ff] hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

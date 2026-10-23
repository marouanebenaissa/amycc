'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from '@/components/ui/Logo'
import { LanguageSwitcher } from '@/components/navigation/LanguageSwitcher'
import type { Dictionary } from '@/lib/i18n/dictionaries'

interface HeaderProps {
  locale: string
  dict: Dictionary
}

export function Header({ locale, dict }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const [prevPathname, setPrevPathname] = useState(pathname)

  // Close mobile menu on route change during render (React 19 pattern)
  if (prevPathname !== pathname) {
    setPrevPathname(pathname)
    setMobileMenuOpen(false)
  }

  // Track scroll position for subtle elevation
  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  const navLinks = [
    { key: 'about' as const, path: 'about' },
    { key: 'programs' as const, path: 'programs' },
    { key: 'events' as const, path: 'events' },
    { key: 'news' as const, path: 'news' },
    { key: 'volunteer' as const, path: 'volunteer' },
    { key: 'partnerships' as const, path: 'partnerships' },
    { key: 'contact' as const, path: 'contact' },
  ]

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#faf7f2]/95 backdrop-blur-md border-b border-[#e5e0d6] shadow-sm'
          : 'bg-[#faf7f2] border-b border-[#ebe1d1]'
      }`}
    >
      {/* Skip to main content — accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:start-3 px-4 py-2 rounded-xl text-xs font-bold bg-[#c85a32] text-white z-50 shadow-md"
      >
        {dict.common.skip_to_content}
      </a>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Logo locale={locale} />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7" aria-label="Main navigation">
            {navLinks.map(({ key, path }) => {
              const fullPath = `/${locale}/${path}`
              const isActive = pathname.startsWith(fullPath)
              return (
                <Link
                  key={key}
                  href={fullPath}
                  className={`text-sm font-bold transition-colors ${
                    isActive
                      ? 'text-[#c85a32]'
                      : 'text-[#1b2628] hover:text-[#0d3b43]'
                  }`}
                >
                  {dict.nav[key]}
                </Link>
              )
            })}
          </nav>

          {/* Right side: Language switcher + Primary CTA */}
          <div className="flex items-center gap-3.5">
            <LanguageSwitcher currentLocale={locale} />

            <Link
              href={`/${locale}/membership`}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0d3b43] hover:bg-[#14505b] active:scale-95 transition-all shadow-subtle hover:shadow-card"
            >
              {dict.membership.apply}
            </Link>

            {/* Mobile menu toggle button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl text-[#0d3b43] hover:bg-[#ebe1d1] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c85a32]"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {mobileMenuOpen ? (
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-20 z-40 bg-[#08242a]/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#faf7f2] border-b border-[#e5e0d6] shadow-xl p-6 max-h-[calc(100vh-5rem)] overflow-y-auto">
            <nav className="flex flex-col space-y-3" aria-label="Mobile Navigation">
              {navLinks.map(({ key, path }) => {
                const fullPath = `/${locale}/${path}`
                const isActive = pathname.startsWith(fullPath)
                return (
                  <Link
                    key={key}
                    href={fullPath}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-xl text-base font-bold transition-colors ${
                      isActive
                        ? 'bg-[#d8f0f4] text-[#0d3b43]'
                        : 'text-[#1b2628] hover:bg-[#f4ede2]'
                    }`}
                  >
                    {dict.nav[key]}
                  </Link>
                )
              })}

              <div className="pt-4 border-t border-[#e5e0d6] space-y-3">
                <Link
                  href={`/${locale}/membership`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-[#c85a32] hover:bg-[#b84e27] transition-all shadow-card"
                >
                  {dict.membership.apply}
                </Link>
                <Link
                  href={`/${locale}/volunteer`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl text-sm font-bold text-[#0d3b43] bg-white border border-[#cfc7b9] hover:bg-[#f4ede2] transition-all"
                >
                  {dict.volunteer.apply}
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

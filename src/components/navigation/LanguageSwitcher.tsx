'use client'

import { useRouter, usePathname } from 'next/navigation'
import { locales, localeNames, type Locale } from '@/lib/i18n/config'

interface LanguageSwitcherProps {
  currentLocale: string
  variant?: 'light' | 'dark'
}

export function LanguageSwitcher({ currentLocale, variant = 'light' }: LanguageSwitcherProps) {
  const router = useRouter()
  const pathname = usePathname()
  const isDark = variant === 'dark'

  function switchLocale(newLocale: Locale) {
    if (newLocale === currentLocale) return
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.push(segments.join('/'))
  }

  return (
    <div
      className={`inline-flex items-center p-1 rounded-xl transition-colors ${
        isDark
          ? 'bg-[#0a2d34] border border-[#14505b]/60'
          : 'bg-[#f4ede2] border border-[#e5e0d6]'
      }`}
      role="navigation"
      aria-label="Language selector"
    >
      {locales.map((locale) => {
        const isCurrent = locale === currentLocale
        return (
          <button
            key={locale}
            type="button"
            onClick={() => switchLocale(locale)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              isCurrent
                ? isDark
                  ? 'bg-[#c85a32] text-white shadow-xs'
                  : 'bg-[#0d3b43] text-white shadow-xs'
                : isDark
                ? 'text-[#d8f0f4] hover:text-white hover:bg-[#14505b]/50'
                : 'text-[#445457] hover:text-[#0d3b43] hover:bg-[#ebe1d1]'
            }`}
            aria-current={isCurrent ? 'true' : undefined}
            aria-label={localeNames[locale]}
            title={localeNames[locale]}
          >
            {locale.toUpperCase()}
          </button>
        )
      })}
    </div>
  )
}

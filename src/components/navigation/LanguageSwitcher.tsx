'use client'

import { useRouter, usePathname } from 'next/navigation'
import { locales, localeNames, type Locale } from '@/lib/i18n/config'

interface LanguageSwitcherProps {
  currentLocale: string
}

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const router = useRouter()
  const pathname = usePathname()

  function switchLocale(newLocale: Locale) {
    if (newLocale === currentLocale) return
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.push(segments.join('/'))
  }

  return (
    <div
      className="inline-flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200"
      role="navigation"
      aria-label="Language selector"
    >
      {locales.map((locale) => {
        const isActive = locale === currentLocale
        return (
          <button
            key={locale}
            onClick={() => switchLocale(locale)}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              isActive
                ? 'bg-[#0068ff] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
            aria-current={isActive ? 'true' : undefined}
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

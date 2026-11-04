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
      className="inline-flex items-center p-1 rounded-xl bg-[#F4EFE6] border border-[#e5e0d6]"
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
                ? 'bg-[#231f20] text-white shadow-xs'
                : 'text-[#5C5A55] hover:text-[#231f20] hover:bg-[#F4EFE6]'
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

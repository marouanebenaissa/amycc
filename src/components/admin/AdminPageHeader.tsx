'use client'

import Link from 'next/link'
import { useAdminLocale } from './AdminLocaleContext'

interface AdminPageHeaderProps {
  backHref?: string
  backTitle?: { ar: string; fr: string; en: string }
  title: { ar: string; fr: string; en: string }
  subtitle?: { ar: string; fr: string; en: string }
}

export function AdminPageHeader({
  backHref,
  backTitle,
  title,
  subtitle,
}: AdminPageHeaderProps) {
  const { locale, dir } = useAdminLocale()

  return (
    <div className="flex items-center gap-3" dir={dir}>
      {backHref && (
        <Link
          href={backHref}
          className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors shrink-0"
          title={backTitle?.[locale] || backTitle?.ar || 'Back'}
        >
          <svg
            className={`w-5 h-5 ${dir === 'rtl' ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
      )}
      <div>
        <h1 className="text-2xl font-extrabold text-[#181516]">
          {title[locale] || title.ar}
        </h1>
        {subtitle && (
          <p className="text-xs text-slate-500 mt-0.5">
            {subtitle[locale] || subtitle.ar}
          </p>
        )}
      </div>
    </div>
  )
}

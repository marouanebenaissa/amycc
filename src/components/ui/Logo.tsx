import Link from 'next/link'
import Image from 'next/image'

interface LogoProps {
  locale: string
  className?: string
  compact?: boolean
  variant?: 'light' | 'dark'
}

export function Logo({
  locale,
  className = '',
  compact = false,
  variant = 'light',
}: LogoProps) {
  const isDark = variant === 'dark'

  return (
    <Link
      href={`/${locale}`}
      className={`group flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0068ff] focus-visible:ring-offset-2 rounded-lg transition-transform ${className}`}
      aria-label="AMYCC — الرئيسية"
    >
      <div
        className={`relative flex items-center justify-center shrink-0 overflow-hidden rounded-xl border p-1 shadow-2xs transition-transform group-hover:scale-105 ${
          isDark
            ? 'bg-slate-900 border-slate-700/80'
            : 'bg-white border-slate-200/80'
        }`}
        style={{
          width: compact ? '38px' : '46px',
          height: compact ? '38px' : '46px',
        }}
      >
        <Image
          src="/logo.png"
          alt="AMYCC Logo"
          width={compact ? 32 : 40}
          height={compact ? 32 : 40}
          className="object-contain w-auto h-auto max-w-full max-h-full"
          priority
        />
      </div>
      {!compact && (
        <div className="flex flex-col leading-tight">
          <span
            className={`font-extrabold text-base tracking-tight transition-colors ${
              isDark
                ? 'text-white group-hover:text-blue-400'
                : 'text-[#0a0f1d] group-hover:text-[#0068ff]'
            }`}
          >
            AMYCC
          </span>
          <span
            className={`text-xs font-medium ${
              isDark ? 'text-slate-400' : 'text-[#475569]'
            }`}
          >
            جمعية روح الفنون والثقافة
          </span>
        </div>
      )}
    </Link>
  )
}

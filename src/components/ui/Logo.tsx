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
      className={`group flex items-center gap-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c85a32] focus-visible:ring-offset-2 rounded-xl transition-all ${className}`}
      aria-label="AMYCC — الرئيسية"
    >
      {/* Visual Seal / Logo Container */}
      <div
        className={`relative flex items-center justify-center shrink-0 overflow-hidden rounded-xl border p-1 shadow-2xs transition-transform group-hover:scale-105 ${
          isDark
            ? 'bg-[#0a2d34] border-[#14505b]/60 shadow-teal-950/40'
            : 'bg-white border-[#e5e0d6] shadow-subtle'
        }`}
        style={{
          width: compact ? '40px' : '48px',
          height: compact ? '40px' : '48px',
        }}
      >
        <Image
          src="/logo.png"
          alt="AMYCC Logo"
          width={compact ? 34 : 42}
          height={compact ? 34 : 42}
          className="object-contain w-auto h-auto max-w-full max-h-full"
          priority
        />
      </div>

      {/* Typography Identity */}
      {!compact && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black text-lg tracking-tight transition-colors ${
                isDark
                  ? 'text-white group-hover:text-[#f4ce83]'
                  : 'text-[#0d3b43] group-hover:text-[#c85a32]'
              }`}
            >
              AMYCC
            </span>
            <span
              className={`text-3xs font-bold uppercase tracking-widest px-1.5 py-0.5 rounded ${
                isDark
                  ? 'bg-[#14505b] text-[#f4ce83]'
                  : 'bg-[#d8f0f4] text-[#0d3b43]'
              }`}
            >
              2026
            </span>
          </div>
          <span
            className={`text-xs font-semibold ${
              isDark ? 'text-[#aedfe7]' : 'text-[#445457]'
            }`}
          >
            {locale === 'ar'
              ? 'جمعية روح الفنون والثقافة'
              : locale === 'fr'
              ? 'Esprit des Arts et de la Culture'
              : 'Spirit of Arts & Culture'}
          </span>
        </div>
      )}
    </Link>
  )
}

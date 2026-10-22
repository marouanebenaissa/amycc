import Link from 'next/link'

interface LogoProps {
  locale: string
  className?: string
  compact?: boolean
}

export function Logo({ locale, className = '', compact = false }: LogoProps) {
  return (
    <Link
      href={`/${locale}`}
      className={`group flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0068ff] focus-visible:ring-offset-2 rounded-lg transition-transform ${className}`}
      aria-label="AMYCC — الرئيسية"
    >
      {/* Brand Icon / Logo Placeholder */}
      <div
        className="flex items-center justify-center rounded-xl font-extrabold text-white shadow-sm transition-all group-hover:scale-105"
        style={{
          width: compact ? '38px' : '44px',
          height: compact ? '38px' : '44px',
          backgroundColor: '#0068ff',
          fontSize: compact ? '15px' : '18px',
          letterSpacing: '-0.03em',
          flexShrink: 0,
        }}
        aria-hidden="true"
      >
        AM
      </div>
      {!compact && (
        <div className="flex flex-col leading-tight">
          <span className="font-extrabold text-base tracking-tight text-[#0a0f1d] group-hover:text-[#0068ff] transition-colors">
            AMYCC
          </span>
          <span className="text-xs font-medium text-[#475569]">
            جمعية روح الفنون والثقافة
          </span>
        </div>
      )}
    </Link>
  )
}

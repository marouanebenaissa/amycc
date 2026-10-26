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
      className={`group inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c85a32] focus-visible:ring-offset-2 rounded-2xl transition-all ${className}`}
      aria-label="AMYCC — الرئيسية"
    >
      {/* Visual Seal / Official Logo Only */}
      <div
        className={`relative flex items-center justify-center shrink-0 overflow-hidden rounded-2xl border p-1 shadow-2xs transition-all duration-200 group-hover:scale-105 ${
          isDark
            ? 'bg-[#0a2d34] border-[#14505b]/60 shadow-teal-950/40'
            : 'bg-white border-[#e5e0d6] shadow-subtle'
        }`}
        style={{
          width: compact ? '42px' : '52px',
          height: compact ? '42px' : '52px',
        }}
      >
        <Image
          src="/logo.png"
          alt="AMYCC Logo"
          width={compact ? 36 : 46}
          height={compact ? 36 : 46}
          className="object-contain w-auto h-auto max-w-full max-h-full"
          priority
        />
      </div>
    </Link>
  )
}

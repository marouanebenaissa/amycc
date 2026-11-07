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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  variant = 'light',
}: LogoProps) {
  const isAr = locale === 'ar'
  const isFr = locale === 'fr'
  const ariaLabel = isAr
    ? 'جمعية روح الفنون والثقافة بمراكش — الصفحة الرئيسية'
    : isFr
    ? 'AMYCC Marrakech — Accueil'
    : 'AMYCC Marrakech — Home'

  const logoAlt = isAr
    ? 'شعار جمعية روح الفنون والثقافة بمراكش AMYCC'
    : isFr
    ? 'Logo officiel AMYCC - Association Esprit des Arts et de la Culture Marrakech'
    : 'AMYCC Official Logo - Spirit of Arts & Culture Marrakech'

  return (
    <Link
      href={`/${locale}`}
      className={`group inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bd3227] focus-visible:ring-offset-2 rounded-xl transition-all ${className}`}
      aria-label={ariaLabel}
    >
      {/* Visual Seal / Official Logo Standalone Without Frame */}
      <div
        className="relative flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105"
        style={{
          width: compact ? '40px' : '52px',
          height: compact ? '40px' : '52px',
        }}
      >
        <Image
          src="/logo.png"
          alt={logoAlt}
          width={compact ? 40 : 52}
          height={compact ? 40 : 52}
          className="object-contain w-auto h-auto max-w-full max-h-full"
          priority
        />
      </div>
    </Link>
  )
}

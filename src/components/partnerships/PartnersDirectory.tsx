'use client'

import { useMemo, useState } from 'react'
import type { PartnerItemConfig } from '@/lib/settings'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'

interface PartnersDirectoryProps {
  partners: PartnerItemConfig[]
  locale: string
}

export function PartnersDirectory({ partners, locale }: PartnersDirectoryProps) {
  const isAr = locale === 'ar'
  const isFr = locale === 'fr'
  const [isPaused, setIsPaused] = useState(false)

  // Filter only active partners
  const activePartners = useMemo(() => {
    return partners.filter((p) => p.active !== false)
  }, [partners])

  // Build two identical halves for a mathematically seamless 50% infinite loop
  const marqueeItems = useMemo(() => {
    if (activePartners.length === 0) return []
    const repeatCount = Math.max(2, Math.ceil(6 / activePartners.length))
    const half: PartnerItemConfig[] = []
    for (let i = 0; i < repeatCount; i++) {
      half.push(...activePartners)
    }
    return [...half, ...half]
  }, [activePartners])

  if (activePartners.length === 0) return null

  return (
    <div className="space-y-4 w-full">
      {/* Moving Images Container with Gradient Fade Edges */}
      <div className="relative w-full overflow-hidden py-4 select-none">
        {/* Left & Right Smooth Gradient Masks */}
        <div
          className="absolute inset-y-0 start-0 w-16 sm:w-28 md:w-36 bg-gradient-to-r from-[#f7f2e9] via-[#f7f2e9]/80 to-transparent z-10 pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute inset-y-0 end-0 w-16 sm:w-28 md:w-36 bg-gradient-to-l from-[#f7f2e9] via-[#f7f2e9]/80 to-transparent z-10 pointer-events-none"
          aria-hidden="true"
        />

        {/* The Continuous Infinite Marquee Track */}
        <div
          dir="ltr"
          className="flex items-center gap-6 sm:gap-8 w-max animate-marquee-continuous hover:[animation-play-state:paused]"
          style={isPaused ? { animationPlayState: 'paused' } : undefined}
        >
          {marqueeItems.map((partner, idx) => {
            const name =
              (isAr ? partner.nameAr : isFr ? partner.nameFr : partner.nameEn) || partner.nameAr

            const card = (
              <div className="group/card relative w-60 sm:w-72 h-44 sm:h-52 bg-white rounded-3xl border border-[#e5e0d6] p-3 shadow-2xs hover:shadow-xl hover:border-[#c85a32]/50 transition-all duration-300 flex flex-col justify-between shrink-0 overflow-hidden cursor-pointer">
                {/* Moving Picture Container */}
                <div className="relative w-full flex-1 rounded-2xl overflow-hidden bg-[#faf7f2] border border-[#f0eae1]">
                  <ImageWithFallback
                    src={partner.logoUrl}
                    fallbackSrc="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80"
                    alt={name}
                    fill
                    className="object-cover group-hover/card:scale-108 transition-transform duration-700 ease-out"
                    sizes="(max-width: 640px) 240px, 288px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-40 group-hover/card:opacity-20 transition-opacity" />
                </div>

                {/* Partner Name Label */}
                <div className="pt-2 px-1 text-center" dir={isAr ? 'rtl' : 'ltr'}>
                  <span className="text-xs sm:text-sm font-bold text-[#08242a] group-hover/card:text-[#c85a32] transition-colors truncate block">
                    {name}
                  </span>
                </div>
              </div>
            )

            return partner.websiteUrl ? (
              <a
                key={`${partner.id}-${idx}`}
                href={partner.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={name}
                className="block shrink-0 focus:outline-hidden"
              >
                {card}
              </a>
            ) : (
              <div key={`${partner.id}-${idx}`} className="shrink-0" title={name}>
                {card}
              </div>
            )
          })}
        </div>
      </div>

      {/* Subtle Controls & Indicator */}
      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => setIsPaused((prev) => !prev)}
          className="inline-flex items-center gap-2 text-3xs sm:text-2xs font-bold text-[#65777a] hover:text-[#08242a] bg-white/80 hover:bg-white px-3.5 py-1.5 rounded-full border border-[#e5e0d6] shadow-2xs transition-all cursor-pointer"
          title={isPaused ? 'تشغيل الحركة' : 'إيقاف الحركة مؤقتاً'}
        >
          <span>{isPaused ? '▶️' : '⏸️'}</span>
          <span>
            {isPaused
              ? isAr
                ? 'تشغيل الحركة التلقائية'
                : isFr
                ? 'Reprendre le défilement'
                : 'Resume Auto-Scroll'
              : isAr
              ? 'إيقاف مؤقت (أو مرر المؤشر)'
              : isFr
              ? 'Pause (ou survolez)'
              : 'Pause (or hover)'}
          </span>
        </button>
      </div>
    </div>
  )
}

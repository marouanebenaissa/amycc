'use client'

import { useMemo } from 'react'
import type { PartnerItemConfig } from '@/lib/settings'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'

interface PartnersDirectoryProps {
  partners: PartnerItemConfig[]
  locale: string
}

export function PartnersDirectory({ partners, locale }: PartnersDirectoryProps) {
  const isAr = locale === 'ar'
  const isFr = locale === 'fr'

  // Filter only active partners
  const activePartners = useMemo(() => {
    return partners.filter((p) => p.active !== false)
  }, [partners])

  // Build a continuous block repeated to guarantee at least 16 items (~5,000px wide).
  // Two identical blocks (Block A + Block B) are rendered inside an outer container with dir="ltr".
  // The outer track translates smoothly from 0% to -50%, seamlessly streaming cards with ZERO gap or void.
  const marqueeBlock = useMemo(() => {
    if (activePartners.length === 0) return []
    const minItems = 16
    const repeatCount = Math.max(2, Math.ceil(minItems / activePartners.length))
    const block: PartnerItemConfig[] = []
    for (let i = 0; i < repeatCount; i++) {
      block.push(...activePartners)
    }
    return block
  }, [activePartners])

  if (activePartners.length === 0) return null

  const renderPublicCard = (partner: PartnerItemConfig, key: string, isClone = false) => {
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
        key={key}
        href={partner.websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        title={name}
        className="block shrink-0 focus:outline-hidden"
        tabIndex={isClone ? -1 : undefined}
      >
        {card}
      </a>
    ) : (
      <div key={key} className="shrink-0" title={name}>
        {card}
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Moving Images Container with Gradient Fade Edges - dir="ltr" fixes RTL alignment clipping */}
      <div dir="ltr" className="relative w-full overflow-hidden py-4 select-none">
        {/* Left & Right Smooth Gradient Masks */}
        <div
          className="absolute inset-y-0 left-0 w-16 sm:w-28 md:w-36 bg-gradient-to-r from-[#f7f2e9] via-[#f7f2e9]/80 to-transparent z-10 pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute inset-y-0 right-0 w-16 sm:w-28 md:w-36 bg-gradient-to-l from-[#f7f2e9] via-[#f7f2e9]/80 to-transparent z-10 pointer-events-none"
          aria-hidden="true"
        />

        {/* The Continuous Infinite Marquee Track (Smooth, Continuous, Never Disappearing) */}
        <div className="flex w-max animate-marquee-continuous hover:[animation-play-state:paused]">
          {/* Block A */}
          <div className="flex items-center gap-6 shrink-0 pr-6">
            {marqueeBlock.map((partner, idx) =>
              renderPublicCard(partner, `a-${partner.id}-${idx}`)
            )}
          </div>

          {/* Block B (Identical clone for seamless 50% infinite translation) */}
          <div className="flex items-center gap-6 shrink-0 pr-6" aria-hidden="true">
            {marqueeBlock.map((partner, idx) =>
              renderPublicCard(partner, `b-${partner.id}-${idx}`, true)
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

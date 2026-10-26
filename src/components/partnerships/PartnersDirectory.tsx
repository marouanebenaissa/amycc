'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import type { PartnerItemConfig, PartnerTier } from '@/lib/settings'

interface PartnersDirectoryProps {
  partners: PartnerItemConfig[]
  locale: string
}

export function PartnersDirectory({ partners, locale }: PartnersDirectoryProps) {
  const isAr = locale === 'ar'
  const isFr = locale === 'fr'

  const [selectedTier, setSelectedTier] = useState<string>('all')

  const tiers = useMemo(() => {
    return [
      { id: 'all', labelAr: 'كافة الشركاء', labelFr: 'Tous les partenaires', labelEn: 'All Partners' },
      { id: 'cultural', labelAr: 'مراكز ثقافية وفنية', labelFr: 'Centres Culturels', labelEn: 'Cultural Centers' },
      { id: 'educational', labelAr: 'جامعات ومؤسسات تعليمية', labelFr: 'Universités & Écoles', labelEn: 'Universities & Schools' },
      { id: 'civil_society', labelAr: 'مجتمع مدني وجمعيات', labelFr: 'Société Civile', labelEn: 'Civil Society' },
      { id: 'institutional', labelAr: 'هيئات عمومية', labelFr: 'Institutions Publiques', labelEn: 'Public Entities' },
      { id: 'sponsor', labelAr: 'رعاية وقطاع خاص', labelFr: 'Mécénat & Entreprises', labelEn: 'Corporate CSR' },
    ]
  }, [])

  const tierBadges: Record<PartnerTier, { ar: string; fr: string; en: string }> = {
    institutional: { ar: 'مؤسساتي وعمومي', fr: 'Institutionnel', en: 'Institutional' },
    cultural: { ar: 'مركز ثقافي وفني', fr: 'Culturel & Artistique', en: 'Cultural & Arts' },
    educational: { ar: 'تعليمي وجامعي', fr: 'Éducatif & Universitaire', en: 'Educational & Academic' },
    civil_society: { ar: 'مجتمع مدني وجمعيات', fr: 'Société Civile', en: 'Civil Society' },
    sponsor: { ar: 'رعاية وقطاع خاص', fr: 'Mécénat & Sponsor', en: 'Corporate Sponsor' },
  }

  // Filter only active partners
  const activePartners = useMemo(() => {
    return partners.filter((p) => p.active !== false)
  }, [partners])

  const filteredPartners = useMemo(() => {
    if (selectedTier === 'all') return activePartners
    return activePartners.filter((p) => p.tier === selectedTier)
  }, [activePartners, selectedTier])

  if (activePartners.length === 0) return null

  return (
    <div className="space-y-8">
      {/* Filter Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none flex-wrap">
        {tiers.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSelectedTier(t.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedTier === t.id
                ? 'bg-[#0d3b43] text-white shadow-xs'
                : 'bg-white text-[#445457] border border-[#e5e0d6] hover:bg-[#faf7f2]'
            }`}
          >
            {isAr ? t.labelAr : isFr ? t.labelFr : t.labelEn}
          </button>
        ))}
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredPartners.map((partner) => {
          const name =
            (isAr ? partner.nameAr : isFr ? partner.nameFr : partner.nameEn) || partner.nameAr
          const desc =
            (isAr
              ? partner.descriptionAr
              : isFr
              ? partner.descriptionFr
              : partner.descriptionEn) || partner.descriptionAr
          const tierInfo = tierBadges[partner.tier] || tierBadges.cultural
          const tierLabel = isAr ? tierInfo.ar : isFr ? tierInfo.fr : tierInfo.en

          return (
            <div
              key={partner.id}
              className="group bg-white rounded-2xl border border-[#e5e0d6] p-6 hover:shadow-subtle hover:border-[#0d3b43]/30 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="relative w-16 h-16 rounded-xl border border-[#e5e0d6] overflow-hidden bg-[#faf7f2] group-hover:scale-105 transition-transform duration-300">
                    {partner.logoUrl ? (
                      <Image
                        src={partner.logoUrl}
                        alt={name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">
                        🏛️
                      </div>
                    )}
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-4xs font-extrabold bg-[#faf7f2] border border-[#e5e0d6] text-[#c85a32]">
                    {tierLabel}
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-[#08242a] text-sm leading-snug group-hover:text-[#0d3b43] transition-colors">
                    {name}
                  </h4>
                  {desc && (
                    <p className="text-2xs text-[#5f7174] mt-2 line-clamp-3 leading-relaxed">
                      {desc}
                    </p>
                  )}
                </div>
              </div>

              {partner.websiteUrl && (
                <div className="pt-4 mt-4 border-t border-[#f4ede2]">
                  <a
                    href={partner.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-2xs font-bold text-[#0d3b43] hover:text-[#c85a32] transition-colors"
                  >
                    <span>
                      {isAr ? 'زيارة الموقع الرسمي' : isFr ? 'Site officiel' : 'Visit Website'}
                    </span>
                    <span className="text-3xs">↗</span>
                  </a>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

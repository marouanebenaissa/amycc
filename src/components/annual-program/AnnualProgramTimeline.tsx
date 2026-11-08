'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { AnnualProgramQuarter } from '@/lib/settings'
import { IconWithFallback } from '@/components/ui/IconWithFallback'
import { ProIcon } from '@/components/ui/ProIcon'

interface AnnualProgramTimelineProps {
  quarters: AnnualProgramQuarter[]
  locale: string
  dict: {
    events?: {
      register?: string
      view_all?: string
    }
  }
}

export function AnnualProgramTimeline({ quarters, locale, dict }: AnnualProgramTimelineProps) {
  const isAr = locale === 'ar'
  const isFr = locale === 'fr'
  const [selectedQuarterId, setSelectedQuarterId] = useState<string>('all')

  const visibleQuarters = selectedQuarterId === 'all'
    ? quarters
    : quarters.filter((q) => q.id === selectedQuarterId)

  const registerText = dict.events?.register || (isAr ? 'سجل في الفعالية' : isFr ? "S'inscrire" : 'Register')

  return (
    <div className="space-y-8">
      {/* Quarter Filter Pills */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#e5e0d6] shadow-subtle flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🗓️</span>
          <div>
            <h3 className="text-xs sm:text-sm font-black text-[#231f20]">
              {isAr ? 'تصفح البرمجة الفصلية للموسم' : isFr ? 'Parcourir les saisons trimestrielles' : 'Browse Quarterly Roadmap'}
            </h3>
            <span className="text-3xs text-[#5C5A55]">
              {isAr ? 'اختر فصلاً محدداً أو استعرض كافة المحطات' : isFr ? 'Sélectionnez un trimestre ou affichez tout' : 'Filter by quarter or view full annual roadmap'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <button
            type="button"
            onClick={() => setSelectedQuarterId('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedQuarterId === 'all'
                ? 'bg-[#231f20] text-white shadow-xs'
                : 'bg-[#FAF8F5] text-[#5C5A55] hover:bg-[#F4EFE6] border border-[#e5e0d6]'
            }`}
          >
            {isAr ? 'كافة الفصول (4 مواسم)' : isFr ? 'Toutes les saisons (4)' : 'All Quarters (4)'}
          </button>

          {quarters.map((q) => {
            const qTitle = isAr ? q.quarterAr : isFr ? (q.quarterFr || q.quarterAr) : (q.quarterEn || q.quarterAr)
            const isActive = selectedQuarterId === q.id
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setSelectedQuarterId(q.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#231f20] text-white shadow-xs'
                    : 'bg-[#FAF8F5] text-[#5C5A55] hover:bg-[#F4EFE6] border border-[#e5e0d6]'
                }`}
              >
                <ProIcon icon={q.icon || 'calendar'} size={14} />
                <span>{qTitle}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Quarters Timeline Cards */}
      <div className="space-y-10">
        {visibleQuarters.map((quarter) => {
          const quarterTitle = isAr ? quarter.quarterAr : isFr ? (quarter.quarterFr || quarter.quarterAr) : (quarter.quarterEn || quarter.quarterAr)
          const period = isAr ? quarter.periodAr : isFr ? (quarter.periodFr || quarter.periodAr) : (quarter.periodEn || quarter.periodAr)
          const badge = isAr ? quarter.badgeAr : isFr ? (quarter.badgeFr || quarter.badgeAr) : (quarter.badgeEn || quarter.badgeAr)
          const theme = isAr ? quarter.themeAr : isFr ? (quarter.themeFr || quarter.themeAr) : (quarter.themeEn || quarter.themeAr)

          return (
            <div
              key={quarter.id}
              className={`p-6 sm:p-10 rounded-3xl bg-white border-2 transition-all space-y-6 shadow-subtle hover:shadow-card ${quarter.color || 'border-[#231f20]/30'}`}
            >
              {/* Quarter Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E5E0D6] gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] flex items-center justify-center text-2xl shadow-2xs overflow-hidden shrink-0">
                    <IconWithFallback
                      src={quarter.iconSrc}
                      fallbackEmoji={quarter.icon || '🗓️'}
                      alt={quarterTitle}
                      size={28}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-xl sm:text-2xl font-black text-[#231f20]">
                        {quarterTitle}
                      </h2>
                      {badge && (
                        <span className={`text-3xs font-black uppercase tracking-wider px-3 py-1 rounded-full ${quarter.accentBg || 'bg-[#F4EFE6] text-[#231f20]'}`}>
                          {badge}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-[#5C5A55] mt-0.5 block">
                      {period}
                    </span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#FAF8F5] border border-[#e5e0d6] text-[#5C5A55] self-start sm:self-auto">
                  <span>🇲🇦</span>
                  <span>{isAr ? 'المملكة المغربية • مختلف الجهات' : isFr ? 'Royaume du Maroc • National' : 'Kingdom of Morocco • Nationwide'}</span>
                </div>
              </div>

              {/* Theme Slogan */}
              {theme && (
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6]/70 flex items-center gap-3">
                  <span className="text-base text-[#bd3227]">✨</span>
                  <p className="text-xs sm:text-sm font-bold text-[#5C5A55]">
                    <span className="text-[#231f20] font-black ms-1">{isAr ? 'شعار الفصل:' : isFr ? 'Thématique du trimestre :' : 'Quarter Focus:'}</span>
                    {' '}{theme}
                  </p>
                </div>
              )}

              {/* Event Highlights List for this Season */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                {quarter.events.map((event) => {
                  const eventTitle = isAr ? event.titleAr : isFr ? (event.titleFr || event.titleAr) : (event.titleEn || event.titleAr)
                  const eventDesc = isAr ? event.descAr : isFr ? (event.descFr || event.descAr) : (event.descEn || event.descAr)
                  const eventCategory = isAr ? event.categoryAr : isFr ? (event.categoryFr || event.categoryAr) : (event.categoryEn || event.categoryAr)
                  const eventVenue = isAr ? event.venueAr : isFr ? (event.venueFr || event.venueAr) : (event.venueEn || event.venueAr)

                  const statusConfig = {
                    completed: {
                      label: isAr ? 'منجزة ✓' : isFr ? 'Réalisée ✓' : 'Completed ✓',
                      style: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    },
                    in_progress: {
                      label: isAr ? 'جارية حالياً ⏳' : isFr ? 'En cours ⏳' : 'In Progress ⏳',
                      style: 'bg-amber-50 text-amber-700 border-amber-200',
                    },
                    upcoming: {
                      label: isAr ? 'مرتقبة 📅' : isFr ? 'À venir 📅' : 'Upcoming 📅',
                      style: 'bg-[#F4EFE6] text-[#231f20] border-[#ffd22f]/40',
                    },
                  }[event.status || 'upcoming']

                  return (
                    <div
                      key={event.id}
                      className="p-5 sm:p-6 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] flex flex-col justify-between hover:border-[#cfc7b9] hover:bg-white transition-all space-y-4 group shadow-2xs"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          {eventCategory && (
                            <span className="inline-block text-3xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white border border-[#e5e0d6] text-[#231f20]">
                              {eventCategory}
                            </span>
                          )}

                          <span className={`text-4xs font-bold px-2 py-0.5 rounded-full border ${statusConfig.style}`}>
                            {statusConfig.label}
                          </span>
                        </div>

                        {event.highlight && (
                          <span className="inline-flex items-center gap-1 text-3xs font-black text-[#bd3227]">
                            <span>★</span>
                            <span>{isAr ? 'محطة بارزة' : isFr ? 'Temps fort' : 'Key Highlight'}</span>
                          </span>
                        )}

                        <h3 className="text-sm sm:text-base font-black text-[#231f20] leading-snug group-hover:text-[#231f20] transition-colors">
                          {eventTitle}
                        </h3>

                        {eventDesc && (
                          <p className="text-xs text-[#5C5A55] leading-relaxed line-clamp-3">
                            {eventDesc}
                          </p>
                        )}

                        {eventVenue && (
                          <div className="flex items-center gap-1.5 text-3xs text-[#5C5A55] font-medium pt-1">
                            <span>📍</span>
                            <span>{eventVenue}</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-[#e5e0d6]/70 flex items-center justify-between text-xs">
                        <span className="text-3xs text-[#5C5A55] font-bold">AMYCC 2026</span>
                        <Link
                          href={`/${locale}/events`}
                          className="font-bold text-[#bd3227] hover:text-[#8f1f16] inline-flex items-center gap-1 transition-colors group-hover:translate-x-0.5"
                        >
                          <span>{registerText}</span>
                          <span className="rtl:rotate-180">→</span>
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

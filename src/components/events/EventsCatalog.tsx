'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'
import { ProIcon } from '@/components/ui/ProIcon'

export interface EventItemData {
  id: string
  slug: string
  start_date: string
  end_date?: string | null
  venue?: string | null
  city?: string | null
  capacity?: number | null
  registration_open: boolean
  cover_image?: string | null
  event_translations?: {
    locale?: string
    title: string
    description?: string | null
  }[]
}

interface EventsCatalogProps {
  events: EventItemData[]
  locale: string
}

export function EventsCatalog({ events, locale }: EventsCatalogProps) {
  const isAr = locale === 'ar'
  const isFr = locale === 'fr'

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'open' | 'closed'>('all')
  const [selectedCity, setSelectedCity] = useState<string>('all')

  // Extract unique cities
  const uniqueCities = useMemo(() => {
    const set = new Set<string>()
    events.forEach((ev) => {
      if (ev.city && ev.city.trim() !== '') {
        set.add(ev.city.trim())
      }
    })
    return Array.from(set)
  }, [events])

  // Filtered list
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const trans = ev.event_translations?.[0] || { title: ev.slug, description: '' }
      const title = (trans.title || '').toLowerCase()
      const desc = (trans.description || '').toLowerCase()
      const venue = (ev.venue || '').toLowerCase()
      const city = (ev.city || '').toLowerCase()
      const q = searchQuery.toLowerCase().trim()

      // Search match
      if (q && !title.includes(q) && !desc.includes(q) && !venue.includes(q) && !city.includes(q)) {
        return false
      }

      // Registration status filter
      if (selectedFilter === 'open' && !ev.registration_open) return false
      if (selectedFilter === 'closed' && ev.registration_open) return false

      // City filter
      if (selectedCity !== 'all' && (ev.city || '').trim() !== selectedCity) {
        return false
      }

      return true
    })
  }, [events, searchQuery, selectedFilter, selectedCity])

  return (
    <div id="events-catalog" className="space-y-8 scroll-mt-24">
      {/* Search & Filters Controls */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#e5e0d6] shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <span className="absolute start-4 top-1/2 -translate-y-1/2 text-slate-400 select-none flex items-center">
              <ProIcon name="search" size={15} />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isAr
                  ? 'ابحث بالاسم، المدينة، أو فضاء العرض...'
                  : isFr
                  ? 'Rechercher par titre, ville ou lieu...'
                  : 'Search by title, city, or venue...'
              }
              className="w-full ps-11 pe-4 py-3 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] text-xs sm:text-sm text-[#231f20] focus:bg-white focus:border-[#bd3227] focus:ring-1 focus:ring-[#bd3227] outline-none transition-all placeholder:text-slate-400 font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 px-2 py-1"
              >
                ✕
              </button>
            )}
          </div>

          {/* Status Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-[#FAF8F5] rounded-2xl border border-[#e5e0d6] overflow-x-auto shrink-0">
            <button
              type="button"
              onClick={() => setSelectedFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedFilter === 'all'
                  ? 'bg-[#231f20] text-white shadow-xs'
                  : 'text-[#5C5A55] hover:text-[#231f20]'
              }`}
            >
              {isAr ? 'كافة الفعاليات' : isFr ? 'Tous les événements' : 'All Events'}
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter('open')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                selectedFilter === 'open'
                  ? 'bg-[#bd3227] text-white shadow-xs'
                  : 'text-[#5C5A55] hover:text-[#231f20]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>{isAr ? 'التسجيل مفتوح' : isFr ? 'Inscriptions ouvertes' : 'Registration Open'}</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter('closed')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedFilter === 'closed'
                  ? 'bg-[#5C5A55] text-white shadow-xs'
                  : 'text-[#5C5A55] hover:text-[#231f20]'
              }`}
            >
              {isAr ? 'مكتملة / مغلقة' : isFr ? 'Inscriptions closes' : 'Completed / Closed'}
            </button>
          </div>
        </div>

        {/* Cities Filter (if there are multiple cities) */}
        {uniqueCities.length > 0 && (
          <div className="flex items-center gap-2 pt-2 border-t border-[#E5E0D6] overflow-x-auto pb-1 text-2xs sm:text-xs">
            <span className="text-[#5C5A55] font-bold shrink-0 flex items-center gap-1">
              <ProIcon name="pin" size={13} className="text-[#bd3227] shrink-0" />
              <span>{isAr ? 'تصفية حسب المدينة:' : isFr ? 'Filtrer par ville :' : 'Filter by city:'}</span>
            </span>
            <button
              type="button"
              onClick={() => setSelectedCity('all')}
              className={`px-3 py-1 rounded-lg font-bold transition-all whitespace-nowrap ${
                selectedCity === 'all'
                  ? 'bg-[#231f20] text-white'
                  : 'bg-[#FAF8F5] text-[#5C5A55] hover:bg-[#F4EFE6]'
              }`}
            >
              {isAr ? 'جميع المدن' : isFr ? 'Toutes les villes' : 'All Cities'}
            </button>
            {uniqueCities.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => setSelectedCity(city)}
                className={`px-3 py-1 rounded-lg font-bold transition-all whitespace-nowrap ${
                  selectedCity === city
                    ? 'bg-[#231f20] text-white'
                    : 'bg-[#FAF8F5] text-[#5C5A55] hover:bg-[#F4EFE6]'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Events Results Count */}
      <div className="flex items-center justify-between px-2 text-xs font-bold text-[#5C5A55]">
        <span>
          {isAr
            ? `عرض ${filteredEvents.length} من أصل ${events.length} فعالية مجدولة`
            : isFr
            ? `Affichage de ${filteredEvents.length} sur ${events.length} événements`
            : `Showing ${filteredEvents.length} of ${events.length} scheduled events`}
        </span>
        {(searchQuery || selectedFilter !== 'all' || selectedCity !== 'all') && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('')
              setSelectedFilter('all')
              setSelectedCity('all')
            }}
            className="text-[#bd3227] hover:underline"
          >
            {isAr ? 'إعادة ضبط الفلاتر' : isFr ? 'Réinitialiser les filtres' : 'Reset filters'}
          </button>
        )}
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredEvents.map((ev) => {
            const trans = ev.event_translations?.[0] || { title: ev.slug, description: '' }
            const dateObj = new Date(ev.start_date)

            return (
              <div
                key={ev.id}
                className="rounded-3xl border border-[#e5e0d6] bg-white overflow-hidden shadow-card hover:shadow-xl hover:border-[#cfc7b9] transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Event Cover Photo or Ambient Pattern Header */}
                  <div className="relative aspect-[16/9] w-full bg-[#231f20] overflow-hidden">
                    {ev.cover_image ? (
                      <ImageWithFallback
                        src={ev.cover_image}
                        fallbackSrc="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80"
                        alt={trans.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#231f20] via-[#231f20] to-[#231f20] flex items-center justify-center p-6 text-center">
                        <div className="absolute inset-0 moroccan-pattern-dark opacity-25" />
                        <span className="relative">
                          <ProIcon name="theatre" size={40} className="text-[#ffd22f]" />
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#231f20]/90 via-transparent to-transparent" />

                    {/* Date Tag Floating over Photo */}
                    <div className="absolute top-3.5 start-3.5 z-10">
                      <span className="px-3 py-1.5 rounded-xl text-3xs font-black bg-white/95 backdrop-blur-md border border-white/20 text-[#231f20] shadow-md flex items-center gap-1.5">
                        <ProIcon name="calendar" size={12} className="text-[#bd3227] shrink-0" />
                        <span>
                          {dateObj.toLocaleDateString(locale, { month: 'short', day: 'numeric' })}
                        </span>
                      </span>
                    </div>

                    {/* Registration Status Badge */}
                    <div className="absolute top-3.5 end-3.5 z-10">
                      <span
                        className={`text-3xs font-extrabold px-3 py-1.5 rounded-xl backdrop-blur-md shadow-md ${
                          ev.registration_open
                            ? 'bg-[#bd3227] text-white border border-[#fce4e3]'
                            : 'bg-black/60 text-white/80 border border-white/20'
                        }`}
                      >
                        {ev.registration_open
                          ? isAr
                            ? 'التسجيل مفتوح'
                            : isFr
                            ? 'Inscriptions ouvertes'
                            : 'Registration Open'
                          : isAr
                          ? 'مغلق حالياً'
                          : isFr
                          ? 'Complet / Fermé'
                          : 'Closed'}
                      </span>
                    </div>

                    {/* Bottom overlay: City & Venue */}
                    <div className="absolute bottom-2.5 start-3.5 end-3.5 text-white z-10 flex items-center justify-between text-3xs font-semibold">
                      <span className="truncate flex items-center gap-1.5">
                        <ProIcon name="pin" size={12} className="text-[#ffd22f] shrink-0" />
                        <span>{ev.venue || (isAr ? 'المركز الثقافي' : 'Cultural Center')}</span>
                      </span>
                      {ev.city && (
                        <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-xs font-bold shrink-0">
                          {ev.city}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 space-y-3">
                    <h3 className="text-lg sm:text-xl font-black text-[#231f20] leading-snug line-clamp-2 group-hover:text-[#bd3227] transition-colors">
                      <Link href={`/${locale}/events/${ev.slug}`} className="hover:underline">
                        {trans.title}
                      </Link>
                    </h3>

                    {/* Capacity Indicator */}
                    {ev.capacity && (
                      <div className="flex items-center gap-2 text-2xs text-[#5C5A55] font-medium pt-1">
                        <ProIcon name="users" size={13} className="text-[#5C5A55] shrink-0" />
                        <span>
                          {isAr
                            ? `الطاقة الاستيعابية: ${ev.capacity} مقعد`
                            : isFr
                            ? `Capacité : ${ev.capacity} places`
                            : `Capacity: ${ev.capacity} seats`}
                        </span>
                      </div>
                    )}

                    {trans.description && (
                      <p className="text-xs text-[#5C5A55] leading-relaxed line-clamp-3">
                        {trans.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Action Button */}
                <div className="p-6 pt-0">
                  <div className="pt-4 border-t border-[#E5E0D6]">
                    <Link
                      href={`/${locale}/events/${ev.slug}`}
                      className={`w-full py-3 px-4 rounded-xl font-extrabold text-center text-xs transition-all flex items-center justify-center gap-2 shadow-2xs group-hover:shadow-md ${
                        ev.registration_open
                          ? 'text-white bg-[#bd3227] hover:bg-[#a3261c] active:scale-98'
                          : 'text-[#231f20] bg-[#FAF8F5] hover:bg-[#F4EFE6] border border-[#e5e0d6]'
                      }`}
                    >
                      <span>
                        {ev.registration_open
                          ? isAr
                            ? 'تفاصيل الفعالية والتسجيل'
                            : isFr
                            ? 'Détails & Inscription'
                            : 'Event Details & Register'
                          : isAr
                          ? 'عرض تفاصيل الفعالية'
                          : isFr
                          ? 'Voir les détails'
                          : 'View Details'}
                      </span>
                      <span className="transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5">
                        {isAr ? '←' : '→'}
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : events.length === 0 ? (
        /* Empty State when no events exist in database */
        <div className="bg-white rounded-3xl border border-[#e5e0d6] p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] flex items-center justify-center text-[#bd3227]">
            <ProIcon name="calendar" size={32} />
          </div>
          <h3 className="text-base font-extrabold text-[#231f20]">
            {isAr
              ? 'لا توجد فعاليات معلنة حالياً'
              : isFr
              ? 'Aucun événement programmé actuellement'
              : 'No events currently scheduled'}
          </h3>
          <p className="text-xs text-[#5C5A55]">
            {isAr
              ? 'ترقبوا الإعلان عن ورشاتنا ومواعيد أنشطتنا الثقافية والفنية القادمة قريباً!'
              : isFr
              ? 'Restez à l\'écoute pour nos prochains ateliers et événements culturels !'
              : 'Stay tuned for upcoming workshops and cultural initiatives!'}
          </p>
        </div>
      ) : (
        /* Empty State when filter yields 0 matches */
        <div className="bg-white rounded-3xl border border-[#e5e0d6] p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] flex items-center justify-center text-[#bd3227]">
            <ProIcon name="search" size={32} />
          </div>
          <h3 className="text-base font-extrabold text-[#231f20]">
            {isAr
              ? 'لم يتم العثور على فعاليات تطابق البحث'
              : isFr
              ? 'Aucun événement ne correspond à vos critères'
              : 'No events match your search criteria'}
          </h3>
          <p className="text-xs text-[#5C5A55]">
            {isAr
              ? 'جرّب تغيير كلمات البحث أو إعادة ضبط فلاتر الحالة والمدينة.'
              : isFr
              ? 'Essayez de modifier votre recherche ou de réinitialiser les filtres.'
              : 'Try adjusting your search terms or resetting the city and status filters.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('')
              setSelectedFilter('all')
              setSelectedCity('all')
            }}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#231f20] hover:bg-[#231f20] transition-all cursor-pointer"
          >
            {isAr ? 'إعادة ضبط الفلاتر' : isFr ? 'Réinitialiser les filtres' : 'Reset filters'}
          </button>
        </div>
      )}
    </div>
  )
}

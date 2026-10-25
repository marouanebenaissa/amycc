'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export interface ProgramDisplayItem {
  id: string
  slug: string
  category: string
  city?: string | null
  cover_image?: string | null
  start_date?: string | null
  end_date?: string | null
  title: string
  description?: string | null
  objectives?: string | null
  target_audience?: string | null
  activities?: string | null
}

interface ProgramsCatalogProps {
  programs: ProgramDisplayItem[]
  locale: string
  dict: {
    programs: {
      learn_more: string
      view_all: string
    }
  }
}

const CATEGORY_MAP: Record<string, { ar: string; fr: string; en: string; icon: string }> = {
  all: { ar: 'كافة البرامج والمبادرات', fr: 'Tous les programmes', en: 'All Programs', icon: '✨' },
  arts: { ar: 'الفنون التشكيلية والتراث الإبداعي', fr: 'Arts plastiques & Créativité', en: 'Visual Arts & Creative Heritage', icon: '🎨' },
  music: { ar: 'التراث الموسيقي المغربي', fr: 'Patrimoine Musical', en: 'Musical Heritage', icon: '🎵' },
  theatre: { ar: 'المسرح وفنون الأداء التعبيري', fr: 'Théâtre & Arts Scéniques', en: 'Theatre & Stage Arts', icon: '🎭' },
  culture: { ar: 'صون التراث والهوية الثقافية', fr: 'Culture & Sauvegarde', en: 'Culture & Heritage', icon: '🏛️' },
  youth: { ar: 'تمكين الشباب والقيادة المجتمعية', fr: 'Autonomisation des Jeunes', en: 'Youth Empowerment', icon: '🚀' },
  volunteer: { ar: 'العمل التطوعي والتضامني', fr: 'Bénévolat & Solidarité', en: 'Volunteering & Civic Action', icon: '🤝' },
  education: { ar: 'التكوين والتطوير الفني', fr: 'Formation Artistique', en: 'Artistic Education', icon: '📚' },
}

function ProgramCoverImage({
  coverImage,
  title,
  category,
}: {
  coverImage?: string | null
  title: string
  category: string
}) {
  const [imgError, setImgError] = useState(false)

  if (!coverImage || imgError) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="absolute inset-0 moroccan-star-pattern opacity-15 pointer-events-none" />
        <span className="text-4xl sm:text-5xl mb-2 group-hover:scale-110 transition-transform">
          {CATEGORY_MAP[category]?.icon || '🎨'}
        </span>
        <span className="text-xs sm:text-sm font-bold text-[#f4ce83] uppercase tracking-wider">
          AMYCC Cultural Initiative
        </span>
      </div>
    )
  }

  return (
    <Image
      src={coverImage}
      alt={title}
      fill
      unoptimized
      onError={() => setImgError(true)}
      className="object-cover group-hover:scale-105 transition-transform duration-500"
      sizes="(max-width: 768px) 100vw, 50vw"
    />
  )
}

export function ProgramsCatalog({ programs, locale, dict }: ProgramsCatalogProps) {
  const isAr = locale === 'ar'
  const isFr = locale === 'fr'
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Derive unique categories present in the programs list
  const availableCategories = ['all', ...Array.from(new Set(programs.map((p) => p.category)))]

  const filteredPrograms = programs.filter((p) => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory
    const query = searchQuery.trim().toLowerCase()
    if (!query) return matchesCategory

    const matchesSearch =
      p.title.toLowerCase().includes(query) ||
      (p.description && p.description.toLowerCase().includes(query)) ||
      (p.objectives && p.objectives.toLowerCase().includes(query)) ||
      (p.city && p.city.toLowerCase().includes(query))

    return matchesCategory && matchesSearch
  })

  function getCategoryLabel(catKey: string) {
    const mapped = CATEGORY_MAP[catKey]
    if (!mapped) return catKey
    return isAr ? mapped.ar : isFr ? mapped.fr : mapped.en
  }

  function getCategoryIcon(catKey: string) {
    return CATEGORY_MAP[catKey]?.icon || '🎨'
  }

  return (
    <div className="space-y-10">
      {/* Search and Category Filter Toolbar */}
      <div className="p-6 rounded-3xl bg-white border border-[#e5e0d6] shadow-subtle space-y-6">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#08242a]">
              {isAr ? 'دليل البرامج والمبادرات الثقافية' : isFr ? 'Répertoire des Programmes Culturels' : 'Cultural Programs & Initiatives Directory'}
            </h2>
            <p className="text-xs sm:text-sm text-[#5f7174] mt-0.5">
              {isAr
                ? 'استكشف مسارات التكوين الفني، مبادرات التطوع، وورشات صون التراث بمختلف جهات المملكة.'
                : isFr
                ? 'Découvrez nos cycles artistiques, programmes bénévoles et ateliers patrimoniaux.'
                : 'Explore artistic masterclasses, volunteering drives, and heritage preservation labs.'}
            </p>
          </div>

          <div className="relative min-w-[260px] sm:min-w-[320px]">
            <span className="absolute inset-y-0 start-3.5 flex items-center pointer-events-none text-base text-[#819598]">
              🔍
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'ابحث في البرامج والورشات...' : isFr ? 'Rechercher un programme...' : 'Search programs...'}
              className="w-full ps-10 pe-4 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-xs sm:text-sm text-[#08242a] focus:bg-white focus:outline-none focus:border-[#0d3b43] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 end-3 flex items-center text-xs text-[#819598] hover:text-[#08242a]"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Filter Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {availableCategories.map((catKey) => {
            const isActive = activeCategory === catKey
            return (
              <button
                key={catKey}
                type="button"
                onClick={() => setActiveCategory(catKey)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0d3b43] text-white shadow-xs'
                    : 'bg-[#faf7f2] text-[#445457] hover:bg-[#f0ebe1] hover:text-[#08242a] border border-[#e5e0d6]'
                }`}
              >
                <span>{getCategoryIcon(catKey)}</span>
                <span>{getCategoryLabel(catKey)}</span>
                {catKey === 'all' && (
                  <span className={`px-2 py-0.5 rounded-full text-3xs font-black ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#e5e0d6] text-[#08242a]'
                  }`}>
                    {programs.length}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Program Results Count Status */}
      <div className="flex items-center justify-between px-2 text-xs font-bold text-[#5f7174]">
        <span>
          {isAr
            ? `عرض ${filteredPrograms.length} من أصل ${programs.length} برنامج ومبادرة`
            : isFr
            ? `Affichage de ${filteredPrograms.length} sur ${programs.length} programmes et initiatives`
            : `Showing ${filteredPrograms.length} of ${programs.length} programs`}
        </span>
        {activeCategory !== 'all' && (
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className="text-[#c85a32] hover:underline cursor-pointer"
          >
            {isAr ? 'عرض الكل' : isFr ? 'Tout afficher' : 'Show All'}
          </button>
        )}
      </div>

      {/* Programs Grid */}
      {filteredPrograms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {filteredPrograms.map((prog) => {
            return (
              <div
                key={prog.id}
                className="rounded-3xl border border-[#e5e0d6] bg-white overflow-hidden shadow-subtle hover:shadow-card hover:border-[#cfc7b9] transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Program Cover Banner or Artistic Abstract Visual */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-[#08242a] via-[#14505b] to-[#0d3b43]">
                    <ProgramCoverImage
                      coverImage={prog.cover_image}
                      title={prog.title}
                      category={prog.category}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Floating Badges */}
                    <div className="absolute top-4 inset-x-4 flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white/95 text-[#0d3b43] backdrop-blur-md shadow-xs">
                        <span>{getCategoryIcon(prog.category)}</span>
                        <span>{getCategoryLabel(prog.category)}</span>
                      </span>

                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-[#08242a]/80 text-white backdrop-blur-md">
                        <span>📍</span>
                        <span>{prog.city || (isAr ? 'المملكة المغربية' : isFr ? 'Royaume du Maroc' : 'Morocco')}</span>
                      </span>
                    </div>

                    {/* Title in Image Overlay (mobile/compact) */}
                    <div className="absolute bottom-4 inset-x-4">
                      <h3 className="text-lg sm:text-xl font-black text-white leading-snug drop-shadow-md line-clamp-2">
                        {prog.title}
                      </h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 sm:p-7 space-y-4">
                    {prog.description && (
                      <p className="text-sm text-[#445457] leading-relaxed line-clamp-3">
                        {prog.description}
                      </p>
                    )}

                    {/* Objectives & Audience Pills */}
                    {(prog.objectives || prog.target_audience) && (
                      <div className="p-4 rounded-2xl bg-[#faf7f2] border border-[#e5e0d6] space-y-2.5 text-xs">
                        {prog.objectives && (
                          <div className="space-y-0.5">
                            <span className="font-bold text-[#08242a] flex items-center gap-1.5">
                              <span>🎯</span>
                              <span>{isAr ? 'الأهداف والمخرجات:' : isFr ? 'Objectifs et résultats :' : 'Key Objectives:'}</span>
                            </span>
                            <p className="text-[#5f7174] leading-relaxed line-clamp-2 ps-5">
                              {prog.objectives}
                            </p>
                          </div>
                        )}

                        {prog.target_audience && (
                          <div className="space-y-0.5 pt-2 border-t border-[#f0ebe1]">
                            <span className="font-bold text-[#08242a] flex items-center gap-1.5">
                              <span>👥</span>
                              <span>{isAr ? 'الفئة المستهدفة:' : isFr ? 'Public cible :' : 'Target Audience:'}</span>
                            </span>
                            <p className="text-[#5f7174] leading-relaxed line-clamp-2 ps-5">
                              {prog.target_audience}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="p-6 sm:p-7 pt-0 border-t border-[#f0ebe1] flex items-center justify-between gap-3 mt-4">
                  <Link
                    href={`/${locale}/programs/${prog.slug}`}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#c85a32] hover:text-[#9c3f1e] transition-colors"
                  >
                    <span>{dict.programs.learn_more}</span>
                    <span className="rtl:rotate-180">→</span>
                  </Link>

                  <Link
                    href={`/${locale}/contact`}
                    className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-[#0d3b43] bg-[#faf7f2] hover:bg-[#0d3b43] hover:text-white border border-[#e5e0d6] transition-all shadow-2xs"
                  >
                    {isAr ? 'استفسر أو انخرط' : isFr ? 'Participer ou s\'informer' : 'Inquire or Join'}
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="p-12 sm:p-16 rounded-3xl bg-white border border-[#e5e0d6] text-center space-y-4">
          <span className="text-4xl sm:text-5xl block">🔍</span>
          <h3 className="text-xl font-black text-[#08242a]">
            {isAr ? 'لم يتم العثور على مبادرات مطابقة لبحثك' : isFr ? 'Aucun programme correspondant trouvé' : 'No matching programs found'}
          </h3>
          <p className="text-sm text-[#5f7174] max-w-md mx-auto leading-relaxed">
            {isAr
              ? 'يرجى تجربة كلمات بحث أخرى أو تصفح كافة البرامج والمشاريع الثقافية للجمعية.'
              : isFr
              ? 'Veuillez essayer d’autres mots-clés ou parcourir l’ensemble des programmes.'
              : 'Try different search keywords or view all ongoing cultural programs.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveCategory('all')
              setSearchQuery('')
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0d3b43] text-white text-xs sm:text-sm font-bold hover:bg-[#14505b] transition-all cursor-pointer shadow-xs"
          >
            {isAr ? 'إعادة ضبط البحث والتصنيف' : isFr ? 'Réinitialiser les filtres' : 'Reset Filters'}
          </button>
        </div>
      )}
    </div>
  )
}

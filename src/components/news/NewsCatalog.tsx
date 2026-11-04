'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'

export interface NewsItemData {
  id: string
  slug: string
  category: string
  cover_image?: string | null
  published_at?: string | null
  status?: string | null
  news_translations?: {
    locale?: string
    title: string
    excerpt?: string | null
  }[]
}

interface NewsCatalogProps {
  articles: NewsItemData[]
  locale: string
  readMoreLabel?: string
}

export function NewsCatalog({ articles, locale, readMoreLabel }: NewsCatalogProps) {
  const isAr = locale === 'ar'
  const isFr = locale === 'fr'

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = useMemo(() => {
    return [
      {
        id: 'all',
        labelAr: 'جميع المستجدات',
        labelFr: 'Toutes les actualités',
        labelEn: 'All News',
      },
      {
        id: 'press',
        labelAr: 'بيانات صحفية',
        labelFr: 'Communiqués de presse',
        labelEn: 'Press Releases',
      },
      {
        id: 'association',
        labelAr: 'أخبار الجمعية',
        labelFr: 'Vie associative',
        labelEn: 'Association Life',
      },
      {
        id: 'culture',
        labelAr: 'ثقافة وتراث',
        labelFr: 'Arts & Patrimoine',
        labelEn: 'Culture & Arts',
      },
      {
        id: 'youth',
        labelAr: 'مبادرات الشباب',
        labelFr: 'Jeunesse en action',
        labelEn: 'Youth Initiatives',
      },
      {
        id: 'partnership',
        labelAr: 'شراكات وتنسيق',
        labelFr: 'Partenariats',
        labelEn: 'Partnerships',
      },
    ]
  }, [])

  // Filter articles based on search query and category
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const trans = art.news_translations?.[0] || { title: '', excerpt: '' }
      const title = (trans.title || '').toLowerCase()
      const excerpt = (trans.excerpt || '').toLowerCase()
      const slug = (art.slug || '').toLowerCase()
      const q = searchQuery.toLowerCase().trim()

      const matchesSearch = !q || title.includes(q) || excerpt.includes(q) || slug.includes(q)

      const matchesCategory =
        selectedCategory === 'all' ||
        art.category?.toLowerCase() === selectedCategory.toLowerCase()

      return matchesSearch && matchesCategory
    })
  }, [articles, searchQuery, selectedCategory])

  // Featured/Spotlight article is the very first one when no search is active
  const isFiltering = Boolean(searchQuery.trim() || selectedCategory !== 'all')
  const featuredArticle = !isFiltering && filteredArticles.length > 0 ? filteredArticles[0] : null
  const regularArticles = featuredArticle
    ? filteredArticles.slice(1)
    : filteredArticles

  // Helper function to format category badge
  const getCategoryMeta = (cat: string) => {
    switch (cat?.toLowerCase()) {
      case 'press':
        return {
          label: isAr ? 'بيان صحفي' : isFr ? 'Communiqué' : 'Press Release',
          badgeClass: 'bg-[#fde8e7] text-[#bd3227] border-[#fde8e7]',
          icon: '📰',
        }
      case 'culture':
        return {
          label: isAr ? 'ثقافة وتراث' : isFr ? 'Culture & Arts' : 'Culture & Heritage',
          badgeClass: 'bg-[#F4EFE6] text-[#231f20] border-[#E5E0D6]',
          icon: '🎭',
        }
      case 'youth':
        return {
          label: isAr ? 'مبادرة شبابية' : isFr ? 'Jeunesse' : 'Youth in Action',
          badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          icon: '🌱',
        }
      case 'partnership':
        return {
          label: isAr ? 'شراكة وتعاون' : isFr ? 'Partenariat' : 'Partnership',
          badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
          icon: '🤝',
        }
      default:
        return {
          label: isAr ? 'خبر الجمعية' : isFr ? 'Vie associative' : 'Association News',
          badgeClass: 'bg-[#FAF8F5] text-[#231f20] border-[#e5e0d6]',
          icon: '🏛️',
        }
    }
  }

  // Calculate estimated reading time
  const getReadingTime = (text?: string | null) => {
    if (!text) return isAr ? 'دقيقتان' : '2 min'
    const words = text.trim().split(/\s+/).length
    const minutes = Math.max(1, Math.ceil(words / 150))
    return isAr ? `${minutes} دقائق قراءة` : `${minutes} min de lecture`
  }

  return (
    <div id="news-catalog" className="space-y-10">
      {/* Search & Category Filter Controls */}
      <div className="bg-white rounded-3xl border border-[#e5e0d6] p-4 sm:p-6 shadow-card space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isAr
                ? 'ابحث في العناوين، البيانات الصحفية، أو المستجدات...'
                : isFr
                ? 'Rechercher un article, un communiqué ou une annonce...'
                : 'Search articles, press releases, or keywords...'
            }
            className="w-full ps-11 pe-4 py-3 sm:py-3.5 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] text-xs sm:text-sm text-[#231f20] placeholder-[#5C5A55] focus:bg-white focus:border-[#231f20] focus:outline-none transition-all"
          />
          <span className="absolute start-4 top-1/2 -translate-y-1/2 text-base pointer-events-none text-[#5C5A55]">
            🔍
          </span>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute end-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#5C5A55] hover:text-[#231f20]"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id
            const label = isAr ? cat.labelAr : isFr ? cat.labelFr : cat.labelEn
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-black shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#231f20] text-white shadow-2xs scale-102'
                    : 'bg-[#FAF8F5] text-[#5C5A55] hover:bg-[#F4EFE6] border border-[#e5e0d6]'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Results Count & Reset */}
      <div className="flex items-center justify-between px-2 text-xs font-bold text-[#5C5A55]">
        <span>
          {isAr
            ? `عرض ${filteredArticles.length} من أصل ${articles.length} مادة إخبارية`
            : isFr
            ? `Affichage de ${filteredArticles.length} sur ${articles.length} publications`
            : `Showing ${filteredArticles.length} of ${articles.length} articles`}
        </span>
        {isFiltering && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory('all')
            }}
            className="text-[#bd3227] hover:underline cursor-pointer"
          >
            {isAr ? 'إعادة ضبط التصفية' : isFr ? 'Réinitialiser les filtres' : 'Reset filters'}
          </button>
        )}
      </div>

      {/* Featured / Lead Article Spotlight (When applicable) */}
      {featuredArticle && (
        <div className="relative group rounded-3xl border border-[#e5e0d6] bg-white overflow-hidden shadow-card hover:shadow-xl hover:border-[#cfc7b9] transition-all">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Visual Cover */}
            <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto lg:min-h-[380px] bg-[#231f20] overflow-hidden">
              {featuredArticle.cover_image ? (
                <ImageWithFallback
                  src={featuredArticle.cover_image}
                  fallbackSrc="https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80"
                  alt={featuredArticle.news_translations?.[0]?.title || featuredArticle.slug}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#231f20] via-[#231f20] to-[#181516] flex items-center justify-center p-8 text-center">
                  <div className="absolute inset-0 moroccan-pattern-dark opacity-20" />
                  <span className="relative text-5xl">📰</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Spotlight Badge */}
              <div className="absolute top-4 start-4 z-10 flex items-center gap-2">
                <span className="px-3.5 py-1.5 rounded-xl text-3xs font-black bg-[#bd3227] text-white shadow-md flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span>{isAr ? 'مقال مميز' : isFr ? 'À la une' : 'Featured Story'}</span>
                </span>
              </div>
            </div>

            {/* Content & Narrative */}
            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  {(() => {
                    const meta = getCategoryMeta(featuredArticle.category)
                    return (
                      <span className={`px-3 py-1 rounded-full text-3xs font-black border ${meta.badgeClass}`}>
                        {meta.icon} {meta.label}
                      </span>
                    )
                  })()}

                  {featuredArticle.published_at && (
                    <span className="text-3xs text-[#5C5A55] font-mono flex items-center gap-1">
                      <span>📅</span>
                      <span>
                        {new Date(featuredArticle.published_at).toLocaleDateString(locale, {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </span>
                  )}

                  <span className="text-3xs text-[#5C5A55] font-bold">
                    ⏱️ {getReadingTime(featuredArticle.news_translations?.[0]?.excerpt)}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#231f20] leading-tight group-hover:text-[#bd3227] transition-colors">
                  <Link href={`/${locale}/news/${featuredArticle.slug}`}>
                    {featuredArticle.news_translations?.[0]?.title || featuredArticle.slug}
                  </Link>
                </h2>

                {featuredArticle.news_translations?.[0]?.excerpt && (
                  <p className="text-xs sm:text-sm text-[#5C5A55] leading-relaxed line-clamp-4">
                    {featuredArticle.news_translations[0].excerpt}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-[#E5E0D6] flex items-center justify-between">
                <Link
                  href={`/${locale}/news/${featuredArticle.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-extrabold text-xs text-white bg-[#231f20] hover:bg-[#d2a82b] active:scale-98 transition-all shadow-xs"
                >
                  <span>{readMoreLabel || (isAr ? 'قراءة المقال بالكامل' : isFr ? 'Lire l’article complet' : 'Read Full Story')}</span>
                  <span className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                    {isAr ? '←' : '→'}
                  </span>
                </Link>

                <span className="text-3xs font-mono text-[#5C5A55] font-bold">
                  AMYCC Editorial
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Regular Articles Grid */}
      {regularArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {regularArticles.map((art) => {
            const trans = art.news_translations?.[0] || { title: art.slug, excerpt: '' }
            const meta = getCategoryMeta(art.category)
            const dateFormatted = art.published_at
              ? new Date(art.published_at).toLocaleDateString(locale, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : null

            return (
              <article
                key={art.id}
                className="rounded-3xl border border-[#e5e0d6] bg-white overflow-hidden shadow-card hover:shadow-xl hover:border-[#cfc7b9] transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Article Thumbnail */}
                  <div className="relative aspect-[16/10] w-full bg-[#231f20] overflow-hidden">
                    {art.cover_image ? (
                      <ImageWithFallback
                        src={art.cover_image}
                        fallbackSrc="https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80"
                        alt={trans.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#231f20] via-[#231f20] to-[#231f20] flex items-center justify-center p-6 text-center">
                        <div className="absolute inset-0 moroccan-pattern-dark opacity-20" />
                        <span className="relative text-3xl">📰</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                    {/* Category Overlay Tag */}
                    <div className="absolute top-3.5 start-3.5 z-10">
                      <span className={`px-2.5 py-1 rounded-lg text-3xs font-black shadow-md border backdrop-blur-md ${meta.badgeClass}`}>
                        {meta.icon} {meta.label}
                      </span>
                    </div>

                    {/* Reading Time Overlay */}
                    <div className="absolute bottom-2.5 start-3.5 z-10 text-white text-3xs font-bold drop-shadow">
                      ⏱️ {getReadingTime(trans.excerpt)}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-3">
                    {dateFormatted && (
                      <div className="text-3xs text-[#5C5A55] font-mono flex items-center gap-1">
                        <span>📅</span>
                        <span>{dateFormatted}</span>
                      </div>
                    )}

                    <h3 className="text-base sm:text-lg font-black text-[#231f20] leading-snug line-clamp-2 group-hover:text-[#bd3227] transition-colors">
                      <Link href={`/${locale}/news/${art.slug}`} className="hover:underline">
                        {trans.title}
                      </Link>
                    </h3>

                    {trans.excerpt && (
                      <p className="text-xs text-[#5C5A55] leading-relaxed line-clamp-3">
                        {trans.excerpt}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 pt-0">
                  <div className="pt-4 border-t border-[#E5E0D6] flex items-center justify-between">
                    <Link
                      href={`/${locale}/news/${art.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-black text-[#231f20] group-hover:text-[#bd3227] transition-colors"
                    >
                      <span>{readMoreLabel || (isAr ? 'قراءة المزيد' : isFr ? 'Lire la suite' : 'Read More')}</span>
                      <span className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                        {isAr ? '←' : '→'}
                      </span>
                    </Link>

                    <span className="text-4xs font-mono font-bold text-[#5C5A55] uppercase tracking-wider">
                      AMYCC Press
                    </span>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#e5e0d6] p-12 text-center max-w-md mx-auto space-y-4 shadow-card">
          <div className="text-4xl">📰</div>
          <h3 className="text-base font-extrabold text-[#231f20]">
            {isAr
              ? 'لم يتم العثور على أية مقالات'
              : isFr
              ? 'Aucun article trouvé'
              : 'No articles found'}
          </h3>
          <p className="text-xs text-[#5C5A55]">
            {isAr
              ? 'لم تتطابق أي نتائج مع معايير البحث المحددة. جرب استخدام كلمات مفتاحية أخرى.'
              : isFr
              ? 'Aucun résultat ne correspond à votre recherche. Essayez d’autres mots-clés.'
              : 'No results match your search filters. Try clearing your search or keywords.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory('all')
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#231f20] text-white hover:bg-[#d2a82b] transition-all cursor-pointer"
          >
            {isAr ? 'عرض كافة المقالات' : isFr ? 'Voir tous les articles' : 'View all articles'}
          </button>
        </div>
      ) : null}
    </div>
  )
}

'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useAdminLocale } from './AdminLocaleContext'

export interface AdminPageItem {
  key: string
  titleAr: string
  titleFr: string
  titleEn: string
  path: string
  icon: string
  category: string
  descriptionAr: string
  descriptionFr?: string
  descriptionEn?: string
  directAdminUrl?: string
  status?: string
}

interface AdminPagesClientProps {
  pages: AdminPageItem[]
  onUpdateStatus?: (pageKey: string, status: string) => Promise<void>
}

export function AdminPagesClient({ pages }: AdminPagesClientProps) {
  const { isAr, isFr } = useAdminLocale()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const t = {
    title: isAr
      ? 'دليل الصفحات والأقسام المؤسسية'
      : isFr
      ? 'Répertoire des Pages & Sections'
      : 'Pages & Sections Directory',
    subtitle: isAr
      ? 'مركز إدارة كافة صفحات الموقع، حالة نشرها، روابط المعاينة باللغات الثلاث، والإدارة التحريرية المباشرة.'
      : isFr
      ? 'Supervision centrale de l\'ensemble des pages, statut de publication et accès direct aux éditeurs.'
      : 'Central directory for managing all public pages, preview links in 3 languages, and CMS shortcuts.',
    badge: isAr ? 'هندسة المحتوى' : isFr ? 'Architecture CMS' : 'CMS Architecture',
    searchPlaceholder: isAr
      ? 'بحث في الصفحات والأقسام...'
      : isFr
      ? 'Rechercher une page ou section...'
      : 'Search pages and sections...',
    allCategories: isAr ? 'كافة الصفحات' : isFr ? 'Toutes les pages' : 'All Pages',
    previewAr: isAr ? 'عربي ↗' : 'AR ↗',
    previewFr: 'FR ↗',
    previewEn: 'EN ↗',
    editAction: isAr ? 'تعديل المحتوى ⚙️' : isFr ? 'Éditer ⚙️' : 'Edit CMS ⚙️',
    statusActive: isAr ? 'منشور ونشط' : isFr ? 'Publié' : 'Published',
    totalPages: (c: number) =>
      isAr ? `${c} صفحة رسمية` : isFr ? `${c} pages officielles` : `${c} official pages`,
    noPages: isAr
      ? 'لا توجد صفحات تطابق معايير البحث الحالية.'
      : isFr
      ? 'Aucune page ne correspond à votre recherche.'
      : 'No pages match your search criteria.',
  }

  const categories = [
    { id: 'all', labelAr: 'الكل', labelFr: 'Tous', labelEn: 'All' },
    { id: 'مؤسسي', labelAr: 'مؤسسي', labelFr: 'Institutionnel', labelEn: 'Institutional' },
    { id: 'أنشطة', labelAr: 'أنشطة وبرامج', labelFr: 'Programmes & Activités', labelEn: 'Programs & Activities' },
    { id: 'إعلام', labelAr: 'إعلام وتواصل', labelFr: 'Médias & Contact', labelEn: 'Media & Outreach' },
    { id: 'مشاركة', labelAr: 'عضوية وتطوع', labelFr: 'Adhésion & Bénévolat', labelEn: 'Involvement' },
    { id: 'قانوني', labelAr: 'قانوني وسياسات', labelFr: 'Légal & Conditions', labelEn: 'Legal & Policies' },
  ]

  const filteredPages = pages.filter((page) => {
    const pageTitle = isAr ? page.titleAr : isFr ? page.titleFr : page.titleEn
    const matchesCategory =
      selectedCategory === 'all' || page.category === selectedCategory
    const matchesSearch =
      !searchQuery.trim() ||
      pageTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.descriptionAr.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesSearch
  })

  function getPageUrl(path: string, lang: string) {
    if (!path) return `/${lang}`
    return `/${lang}/${path}`
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1c191a] via-[#241f20] to-[#161314] text-white p-6 sm:p-8 shadow-xl border border-white/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/15 text-3xs font-extrabold uppercase tracking-widest text-[#ffd22f]">
              <span>📄</span>
              <span>{t.badge}</span>
              <span>•</span>
              <span className="font-mono text-white/70">14 Public Routes</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {t.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#e5e0d6]/90 max-w-2xl leading-relaxed">
              {t.subtitle}
            </p>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-white/10 border border-white/15 text-xs font-bold text-white backdrop-blur-xs self-start md:self-auto">
            {t.totalPages(filteredPages.length)}
          </div>
        </div>
      </div>

      {/* Categories & Search Filter */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e5e0d6] shadow-2xs space-y-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => {
            const catLabel = isAr ? cat.labelAr : isFr ? cat.labelFr : cat.labelEn
            const isSelected = selectedCategory === cat.id

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#231f20] text-white shadow-xs'
                    : 'bg-[#FAF8F5] text-[#5C5A55] hover:bg-[#FEF6CC] hover:text-[#231f20]'
                }`}
              >
                {catLabel}
              </button>
            )
          })}
        </div>

        {/* Search Input */}
        <div className="relative">
          <span className="absolute inset-y-0 start-3 flex items-center text-xs text-[#5C5A55] pointer-events-none">
            🔍
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full ps-9 pe-4 py-2.5 rounded-xl border border-[#e5e0d6] bg-[#FAF8F5] text-xs sm:text-sm font-medium text-[#231f20] placeholder-[#5C5A55]/60 focus:bg-white focus:border-[#bd3227] focus:outline-hidden transition-all"
          />
        </div>
      </div>

      {/* Pages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPages.length > 0 ? (
          filteredPages.map((page) => {
            const title = isAr ? page.titleAr : isFr ? page.titleFr : page.titleEn
            const desc = isAr
              ? page.descriptionAr
              : isFr && page.descriptionFr
              ? page.descriptionFr
              : page.descriptionEn || page.descriptionAr

            return (
              <div
                key={page.key}
                className="bg-white p-5 sm:p-6 rounded-3xl border border-[#e5e0d6] shadow-2xs hover:shadow-card hover:border-[#bd3227]/30 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="w-11 h-11 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                      {page.icon}
                    </span>

                    <span className="px-2.5 py-0.5 rounded-full text-4xs font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                      ✓ {t.statusActive}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-[#231f20] mb-1 group-hover:text-[#bd3227] transition-colors">
                    {title}
                  </h3>
                  <p className="text-3xs text-[#5C5A55] leading-relaxed mb-4">
                    {desc}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-[#e5e0d6]/70">
                  {/* Trilingual Preview Links */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-4xs text-[#5C5A55] font-bold">معاينة:</span>
                    <Link
                      href={getPageUrl(page.path, 'ar')}
                      target="_blank"
                      className="px-2 py-0.5 rounded-md bg-[#FAF8F5] hover:bg-[#231f20] hover:text-white border border-[#e5e0d6] text-3xs font-bold text-[#231f20] transition-colors"
                    >
                      {t.previewAr}
                    </Link>
                    <Link
                      href={getPageUrl(page.path, 'fr')}
                      target="_blank"
                      className="px-2 py-0.5 rounded-md bg-[#FAF8F5] hover:bg-[#231f20] hover:text-white border border-[#e5e0d6] text-3xs font-bold text-[#231f20] transition-colors"
                    >
                      {t.previewFr}
                    </Link>
                    <Link
                      href={getPageUrl(page.path, 'en')}
                      target="_blank"
                      className="px-2 py-0.5 rounded-md bg-[#FAF8F5] hover:bg-[#231f20] hover:text-white border border-[#e5e0d6] text-3xs font-bold text-[#231f20] transition-colors"
                    >
                      {t.previewEn}
                    </Link>
                  </div>

                  {/* Direct Admin Edit Shortcut if available */}
                  {page.directAdminUrl && (
                    <Link
                      href={page.directAdminUrl}
                      className="w-full py-2 px-3 rounded-xl bg-[#FAF8F5] hover:bg-[#bd3227] hover:text-white text-[#231f20] border border-[#e5e0d6] text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <span>{t.editAction}</span>
                    </Link>
                  )}
                </div>
              </div>
            )
          })
        ) : (
          <div className="col-span-full p-12 text-center text-[#5C5A55] bg-white rounded-3xl border border-[#e5e0d6]">
            <span className="text-3xl block mb-2">📄</span>
            <p className="font-semibold text-xs">{t.noPages}</p>
          </div>
        )}
      </div>
    </div>
  )
}

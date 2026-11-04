'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import type { NewsPageConfig, NewsPageStatItem } from '@/lib/settings'

export interface AdminNewsArticleItem {
  id: string
  slug: string
  category: string
  status?: string | null
  cover_image?: string | null
  published_at?: string | null
  created_at?: string | null
  news_translations?: {
    locale?: string
    title: string
    excerpt?: string | null
  }[]
}

interface NewsAdminTabsProps {
  initialArticles: AdminNewsArticleItem[]
  initialConfig: NewsPageConfig
  onDeleteArticle?: (id: string) => Promise<{ success: boolean; error?: string } | void>
}

export function NewsAdminTabs({
  initialArticles,
  initialConfig,
  onDeleteArticle,
}: NewsAdminTabsProps) {
  const router = useRouter()
  // Tab Navigation: 'articles' or 'page-settings'
  const [activeTab, setActiveTab] = useState<'articles' | 'page-settings'>('articles')

  // Search & Filter state for Articles
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')

  // Articles state
  const [articles, setArticles] = useState<AdminNewsArticleItem[]>(initialArticles)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [seedingArticles, setSeedingArticles] = useState(false)

  // Page Settings state
  const [config, setConfig] = useState<NewsPageConfig>(initialConfig)
  const [activeLangTab, setActiveLangTab] = useState<'ar' | 'fr' | 'en'>('ar')
  const [savingConfig, setSavingConfig] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // -------------------------------------------------------------
  // Filtered Articles
  // -------------------------------------------------------------
  const filteredArticles = articles.filter((art) => {
    const title = (art.news_translations?.[0]?.title || '').toLowerCase()
    const slug = (art.slug || '').toLowerCase()
    const q = searchQuery.toLowerCase().trim()
    const matchesSearch = !q || title.includes(q) || slug.includes(q)

    const matchesCategory =
      selectedCategory === 'all' || art.category?.toLowerCase() === selectedCategory.toLowerCase()

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && art.status === 'published') ||
      (statusFilter === 'draft' && art.status !== 'published')

    return matchesSearch && matchesCategory && matchesStatus
  })

  // Quick Metrics
  const totalArticles = articles.length
  const publishedCount = articles.filter((a) => a.status === 'published').length
  const draftCount = totalArticles - publishedCount

  // -------------------------------------------------------------
  // Handlers for Articles List
  // -------------------------------------------------------------
  async function handleToggleStatus(articleId: string, currentStatus?: string | null) {
    const nextStatus = currentStatus === 'published' ? 'draft' : 'published'
    setTogglingId(articleId)

    try {
      const res = await fetch(`/api/admin/news/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: articleId, status: nextStatus }),
      })

      if (!res.ok) {
        throw new Error('فشل تحديث حالة المقال')
      }

      setArticles((prev) =>
        prev.map((a) =>
          a.id === articleId
            ? {
                ...a,
                status: nextStatus,
                published_at: nextStatus === 'published' ? new Date().toISOString() : a.published_at,
              }
            : a
        )
      )
    } catch {
      // Fallback reload if API route is not present
      window.location.reload()
    } finally {
      setTogglingId(null)
    }
  }

  async function handleDeleteArticle(articleId: string, articleTitle: string) {
    if (
      !confirm(
        `هل أنت متأكد من رغبتك في حذف المقال "${articleTitle}" نهائياً؟\nسيتم حذف نصوص المقال وترجماته وصورته من الموقع.`
      )
    ) {
      return
    }

    setDeletingId(articleId)
    const backupList = [...articles]
    setArticles((prev) => prev.filter((a) => a.id !== articleId))

    try {
      let success = false
      let errorMessage = ''

      // 1. Try REST API endpoint with query param
      try {
        const apiRes = await fetch(`/api/admin/news?id=${encodeURIComponent(articleId)}`, {
          method: 'DELETE',
        })
        const data = await apiRes.json().catch(() => null)
        if (apiRes.ok && data?.success) {
          success = true
        } else if (data?.error) {
          errorMessage = data.error
        }
      } catch {
        // Fallback below
      }

      // 2. Try REST API endpoint with dynamic path
      if (!success) {
        try {
          const apiRes2 = await fetch(`/api/admin/news/${encodeURIComponent(articleId)}`, {
            method: 'DELETE',
          })
          const data2 = await apiRes2.json().catch(() => null)
          if (apiRes2.ok && data2?.success) {
            success = true
          } else if (data2?.error) {
            errorMessage = data2.error
          }
        } catch {
          // Fallback below
        }
      }

      // 3. Fallback to Server Action
      if (!success && onDeleteArticle) {
        const actionRes = await onDeleteArticle(articleId)
        if (!actionRes || (typeof actionRes === 'object' && actionRes.success !== false)) {
          success = true
        } else if (typeof actionRes === 'object' && actionRes.error) {
          errorMessage = actionRes.error
        }
      }

      if (success) {
        setFeedback({
          type: 'success',
          message: `تم حذف مقال "${articleTitle}" بنجاح وإزالته من النظام والموقع.`,
        })
        router.refresh()
      } else {
        throw new Error(errorMessage || 'فشل حذف المقال من قاعدة البيانات.')
      }
    } catch (err: unknown) {
      setArticles(backupList)
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'حدث خطأ أثناء محاولة حذف المقال.',
      })
    } finally {
      setDeletingId(null)
    }
  }

  async function handleSeedDefaultArticles() {
    if (
      !confirm(
        'هل ترغب في استيراد وتحديث المقالات النموذجية الرسمية الثلاث؟ سيتم حفظها في قاعدة البيانات فوراً.'
      )
    ) {
      return
    }

    setSeedingArticles(true)
    try {
      const res = await fetch('/api/admin/news/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'فشل استيراد المقالات')
      }

      if (Array.isArray(data.articles)) {
        setArticles(data.articles)
      } else {
        window.location.reload()
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'حدث خطأ أثناء استيراد المقالات')
    } finally {
      setSeedingArticles(false)
    }
  }

  // -------------------------------------------------------------
  // Handlers for Page Settings
  // -------------------------------------------------------------
  function updateHero<K extends keyof NewsPageConfig['hero']>(
    field: K,
    val: NewsPageConfig['hero'][K]
  ) {
    setConfig((prev) => ({
      ...prev,
      hero: { ...prev.hero, [field]: val },
    }))
  }

  function updateCta<K extends keyof NewsPageConfig['cta']>(
    field: K,
    val: NewsPageConfig['cta'][K]
  ) {
    setConfig((prev) => ({
      ...prev,
      cta: { ...prev.cta, [field]: val },
    }))
  }

  function updateStat(index: number, field: keyof NewsPageStatItem, val: string) {
    setConfig((prev) => {
      const nextStats = [...prev.stats]
      if (nextStats[index]) {
        nextStats[index] = { ...nextStats[index], [field]: val }
      }
      return { ...prev, stats: nextStats }
    })
  }

  async function handleHeroImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('يرجى اختيار ملف صورة صالح (JPEG, PNG, WebP)')
      return
    }

    setUploadingImage(true)
    try {
      const data = new FormData()
      data.append('file', file)

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: data,
      })

      const json = await res.json()
      if (!res.ok || !json.url) {
        throw new Error(json.error || 'فشل رفع الصورة')
      }

      updateHero('imageUrl', json.url)
      updateHero('hasHeroImage', true)
      setFeedback({ type: 'success', message: 'تم رفع صورة هيدر الأخبار بنجاح وتفعيلها!' })
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'حدث خطأ أثناء رفع الصورة',
      })
    } finally {
      setUploadingImage(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function handleSaveConfig() {
    setSavingConfig(true)
    setFeedback(null)

    try {
      const res = await fetch('/api/settings/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })

      const json = await res.json()
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'فشل حفظ الإعدادات')
      }

      setFeedback({
        type: 'success',
        message: 'تم حفظ ونشر إعدادات صفحة الأخبار بنجاح عبر المنصة!',
      })
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'حدث خطأ أثناء حفظ الإعدادات',
      })
    } finally {
      setSavingConfig(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#e5e0d6]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">📰</span>
            <h1 className="text-2xl font-black text-[#231f20]">
              إدارة الأخبار والمركز الإعلامي
            </h1>
          </div>
          <p className="text-xs text-[#5C5A55]">
            نشر البيانات الصحفية، متابعة المقالات الثقافية، وتخصيص واجهة صفحة الأخبار بالكامل
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center p-1 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] shadow-2xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('articles')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'articles'
                ? 'bg-[#231f20] text-white shadow-xs'
                : 'text-[#5C5A55] hover:bg-[#F4EFE6]'
            }`}
          >
            <span>📑</span>
            <span>قائمة الأخبار والمقالات ({articles.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('page-settings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'page-settings'
                ? 'bg-[#231f20] text-white shadow-xs'
                : 'text-[#5C5A55] hover:bg-[#F4EFE6]'
            }`}
          >
            <span>⚙️</span>
            <span>تخصيص واجهة صفحة الأخبار (CMS)</span>
          </button>
        </div>
      </div>

      {/* Global Feedback notification banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between shadow-2xs transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span>{feedback.type === 'success' ? '✓' : '⚠️'}</span>
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs font-black opacity-60 hover:opacity-100 p-1 cursor-pointer"
            title="إغلاق التنبيه"
          >
            ✕
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 1: ARTICLES MANAGEMENT                                */}
      {/* ========================================================= */}
      {activeTab === 'articles' && (
        <div className="space-y-6">
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#e5e0d6] shadow-2xs">
              <span className="text-3xs font-extrabold uppercase text-[#5C5A55] block mb-1">
                إجمالي المواد الإخبارية
              </span>
              <span className="text-2xl font-black text-[#231f20]">{totalArticles}</span>
              <span className="text-3xs text-[#5C5A55] block mt-1">مقالات وبيانات مسجلة</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#e5e0d6] shadow-2xs">
              <span className="text-3xs font-extrabold uppercase text-emerald-700 block mb-1">
                منشور حالياً (Live)
              </span>
              <span className="text-2xl font-black text-emerald-800">{publishedCount}</span>
              <span className="text-3xs text-[#5C5A55] block mt-1">يظهر للعموم في الموقع</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#e5e0d6] shadow-2xs">
              <span className="text-3xs font-extrabold uppercase text-amber-700 block mb-1">
                مسودات قيد الإعداد (Drafts)
              </span>
              <span className="text-2xl font-black text-amber-800">{draftCount}</span>
              <span className="text-3xs text-[#5C5A55] block mt-1">غير منشورة بعد</span>
            </div>
          </div>

          {/* Action & Filter Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e5e0d6] shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Search Box */}
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="بحث في المقالات بالعنوان أو الرابط..."
                  className="w-full ps-9 pe-4 py-2 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5] focus:bg-white focus:border-[#231f20] outline-none transition-all"
                />
                <span className="absolute start-3 top-1/2 -translate-y-1/2 text-xs text-[#5C5A55]">
                  🔍
                </span>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-xs text-[#5C5A55] hover:text-[#231f20]"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Status Filter & Add Article CTA */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | 'published' | 'draft')}
                  className="px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs font-bold bg-[#FAF8F5] text-[#231f20] outline-none"
                >
                  <option value="all">كافة الحالات</option>
                  <option value="published">المنشورة فقط</option>
                  <option value="draft">المسودات فقط</option>
                </select>

                <button
                  type="button"
                  disabled={seedingArticles}
                  onClick={handleSeedDefaultArticles}
                  className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#FAF8F5] border border-[#e5e0d6] text-[#231f20] text-xs font-bold rounded-xl hover:bg-[#F4EFE6] active:scale-98 transition-all shadow-2xs disabled:opacity-50 cursor-pointer"
                  title="استيراد وتحديث المقالات النموذجية الرسمية الثلاث"
                >
                  <span>📥</span>
                  <span>{seedingArticles ? 'جارٍ الاستيراد...' : 'استيراد المقالات النموذجية'}</span>
                </button>

                <Link
                  href="/admin/news/new"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#231f20] text-white text-xs font-bold rounded-xl hover:bg-[#d2a82b] active:scale-98 transition-all shadow-xs"
                >
                  <span>✍️</span>
                  <span>كتابة مقال جديد</span>
                </Link>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-2xs">
              {[
                { id: 'all', label: 'الكل' },
                { id: 'press', label: 'بيان صحفي' },
                { id: 'association', label: 'أخبار الجمعية' },
                { id: 'culture', label: 'ثقافة وتراث' },
                { id: 'youth', label: 'شباب' },
                { id: 'partnership', label: 'شراكات' },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer shrink-0 ${
                    selectedCategory === c.id
                      ? 'bg-[#231f20] text-white shadow-2xs'
                      : 'bg-[#FAF8F5] text-[#5C5A55] hover:bg-[#F4EFE6]'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Articles Table */}
          <div className="bg-white rounded-2xl border border-[#e5e0d6] overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs text-[#231f20]">
                <thead className="bg-[#FAF8F5] border-b border-[#e5e0d6] text-3xs uppercase tracking-wider text-[#5C5A55] font-black">
                  <tr>
                    <th className="px-6 py-4 text-start">المقال والغلاف</th>
                    <th className="px-6 py-4 text-start">التصنيف</th>
                    <th className="px-6 py-4 text-start">تاريخ النشر</th>
                    <th className="px-6 py-4 text-start">الحالة</th>
                    <th className="px-6 py-4 text-start">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#FEF6CC]">
                  {filteredArticles.length > 0 ? (
                    filteredArticles.map((art) => {
                      const title = art.news_translations?.[0]?.title || art.slug
                      const dateObj = art.published_at ? new Date(art.published_at) : null

                      return (
                        <tr key={art.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-12 h-12 rounded-xl bg-[#231f20] overflow-hidden shrink-0 border border-[#e5e0d6]">
                                {art.cover_image ? (
                                  <Image
                                    src={art.cover_image}
                                    alt={title}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-lg">
                                    📰
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-extrabold text-[#231f20] text-xs sm:text-sm">
                                  {title}
                                </div>
                                <div className="text-[#5C5A55] text-3xs font-mono">
                                  /{art.slug}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 rounded-md text-3xs font-extrabold bg-[#FAF8F5] border border-[#e5e0d6] text-[#231f20]">
                              {art.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold block text-[#231f20]">
                              {dateObj
                                ? dateObj.toLocaleDateString('ar-MA', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                  })
                                : 'مسودة'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              type="button"
                              disabled={togglingId === art.id}
                              onClick={() => handleToggleStatus(art.id, art.status)}
                              className={`px-3 py-1 rounded-full text-3xs font-extrabold cursor-pointer transition-all disabled:opacity-60 ${
                                art.status === 'published'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {togglingId === art.id
                                ? 'جارٍ التحديث...'
                                : art.status === 'published'
                                ? 'منشور (Live) ✓'
                                : 'مسودة (Draft) ✕'}
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <a
                                href={`/ar/news/${art.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1.5 rounded-lg text-2xs font-bold bg-[#FAF8F5] border border-[#e5e0d6] text-[#231f20] hover:bg-[#F4EFE6] transition-colors flex items-center gap-1"
                                title="معاينة المقال في الموقع"
                              >
                                <span>معاينة</span>
                                <span className="text-3xs">↗</span>
                              </a>
                              <Link
                                href={`/admin/news/${art.id}/edit`}
                                className="px-3 py-1.5 rounded-lg text-2xs font-bold bg-[#FAF8F5] border border-[#e5e0d6] text-[#231f20] hover:bg-[#F4EFE6] transition-colors"
                              >
                                تعديل
                              </Link>
                              <button
                                type="button"
                                disabled={deletingId === art.id}
                                onClick={() => handleDeleteArticle(art.id, title)}
                                className="px-3 py-1.5 rounded-lg text-2xs font-bold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors disabled:opacity-50 cursor-pointer"
                              >
                                {deletingId === art.id ? 'جارٍ الحذف...' : 'حذف'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        {articles.length === 0 ? (
                          <div className="max-w-md mx-auto space-y-3">
                            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] flex items-center justify-center text-xl">
                              📰
                            </div>
                            <h3 className="text-sm font-extrabold text-[#231f20]">
                              لا توجد مقالات مسجلة في قاعدة البيانات حالياً
                            </h3>
                            <p className="text-xs text-[#5C5A55] leading-relaxed">
                              يمكنك البدء بكتابة مقال إخباري جديد، أو استيراد المقالات النموذجية الرسمية الثلاث (الإطلاق الرسمي، تطوع شباب في العمل، ورشات المسرح) لتظهر في لوحة التحكم والموقع مباشرة.
                            </p>
                            <div className="flex items-center justify-center gap-3 pt-2">
                              <button
                                type="button"
                                disabled={seedingArticles}
                                onClick={handleSeedDefaultArticles}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-[#231f20] text-white text-xs font-bold rounded-xl hover:bg-[#d2a82b] transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                              >
                                <span>📥</span>
                                <span>{seedingArticles ? 'جارٍ الاستيراد...' : 'استيراد المقالات النموذجية الآن'}</span>
                              </button>
                              <Link
                                href="/admin/news/new"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-[#FAF8F5] border border-[#e5e0d6] text-[#231f20] text-xs font-bold rounded-xl hover:bg-[#F4EFE6] transition-all"
                              >
                                <span>✍️</span>
                                <span>كتابة مقال جديد</span>
                              </Link>
                            </div>
                          </div>
                        ) : (
                          <span className="text-[#5C5A55] text-xs">
                            لا توجد مقالات مطابقة لمعايير البحث حالياً.
                          </span>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: NEWS PAGE CMS SETTINGS                             */}
      {/* ========================================================= */}
      {activeTab === 'page-settings' && (
        <div className="space-y-6">
          {/* Language Selector Bar */}
          <div className="bg-white p-4 rounded-2xl border border-[#e5e0d6] shadow-2xs flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#231f20]">
              لغة التحرير والمعاينة:
            </span>
            <div className="flex gap-1.5 p-1 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6]">
              {(['ar', 'fr', 'en'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveLangTab(lang)}
                  className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer ${
                    activeLangTab === lang
                      ? 'bg-[#231f20] text-white shadow-xs'
                      : 'text-[#5C5A55] hover:bg-[#F4EFE6]'
                  }`}
                >
                  {lang === 'ar' ? 'العربية (AR)' : lang === 'fr' ? 'Français (FR)' : 'English (EN)'}
                </button>
              ))}
            </div>
          </div>

          {/* Hero Section Config */}
          <div className="bg-white p-6 rounded-2xl border border-[#e5e0d6] shadow-2xs space-y-4">
            <h3 className="text-sm font-extrabold text-[#231f20] pb-2 border-b border-[#E5E0D6] flex items-center gap-2">
              <span>🖼️</span>
              <span>واجهة الهيدر الرئيسي لصفحة الأخبار (Hero Section)</span>
            </h3>

            {/* Hero Image Settings */}
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#231f20] block">
                    تفعيل صورة خلفية هيدر الأخبار
                  </span>
                  <span className="text-3xs text-[#5C5A55]">
                    عند التفعيل، تظهر صورة بانورامية عالية الدقة في رأس صفحة الأخبار مع نمط مغربي أنيق
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.hero.hasHeroImage}
                    onChange={(e) => updateHero('hasHeroImage', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#231f20]" />
                </label>
              </div>

              {config.hero.hasHeroImage && (
                <div className="pt-3 border-t border-[#e5e0d6] space-y-3">
                  <div>
                    <label className="block text-2xs font-bold text-[#231f20] mb-1">
                      رابط صورة الهيدر (URL):
                    </label>
                    <input
                      type="text"
                      value={config.hero.imageUrl}
                      onChange={(e) => updateHero('imageUrl', e.target.value)}
                      placeholder="/uploads/news-hero.jpg أو رابط خارجي https://..."
                      className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs focus:border-[#231f20] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-2xs font-bold text-[#231f20] mb-1">
                      أو رفع صورة من جهازك مباشرة:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleHeroImageUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="w-full px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#231f20] hover:bg-[#d2a82b] disabled:opacity-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {uploadingImage ? 'جاري الرفع...' : '📁 اختيار ملف من الجهاز ورفعه'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Multilingual Text Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-2xs font-bold text-[#231f20] mb-1">
                  الوسم العلوي (Tag):
                </label>
                <input
                  type="text"
                  value={
                    activeLangTab === 'ar'
                      ? config.hero.tagAr
                      : activeLangTab === 'fr'
                      ? config.hero.tagFr
                      : config.hero.tagEn
                  }
                  onChange={(e) =>
                    updateHero(
                      activeLangTab === 'ar' ? 'tagAr' : activeLangTab === 'fr' ? 'tagFr' : 'tagEn',
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs outline-none focus:border-[#231f20]"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-[#231f20] mb-1">
                  الشارة البارزة (Badge):
                </label>
                <input
                  type="text"
                  value={
                    activeLangTab === 'ar'
                      ? config.hero.badgeAr
                      : activeLangTab === 'fr'
                      ? config.hero.badgeFr
                      : config.hero.badgeEn
                  }
                  onChange={(e) =>
                    updateHero(
                      activeLangTab === 'ar'
                        ? 'badgeAr'
                        : activeLangTab === 'fr'
                        ? 'badgeFr'
                        : 'badgeEn',
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs outline-none focus:border-[#231f20]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-2xs font-bold text-[#231f20] mb-1">
                  العنوان الرئيسي (Title):
                </label>
                <input
                  type="text"
                  value={
                    activeLangTab === 'ar'
                      ? config.hero.titleAr
                      : activeLangTab === 'fr'
                      ? config.hero.titleFr
                      : config.hero.titleEn
                  }
                  onChange={(e) =>
                    updateHero(
                      activeLangTab === 'ar'
                        ? 'titleAr'
                        : activeLangTab === 'fr'
                        ? 'titleFr'
                        : 'titleEn',
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs font-bold outline-none focus:border-[#231f20]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-2xs font-bold text-[#231f20] mb-1">
                  العنوان الفرعي (Subtitle):
                </label>
                <input
                  type="text"
                  value={
                    activeLangTab === 'ar'
                      ? config.hero.subtitleAr
                      : activeLangTab === 'fr'
                      ? config.hero.subtitleFr
                      : config.hero.subtitleEn
                  }
                  onChange={(e) =>
                    updateHero(
                      activeLangTab === 'ar'
                        ? 'subtitleAr'
                        : activeLangTab === 'fr'
                        ? 'subtitleFr'
                        : 'subtitleEn',
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs outline-none focus:border-[#231f20]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-2xs font-bold text-[#231f20] mb-1">
                  الوصف التقديمي (Description):
                </label>
                <textarea
                  rows={3}
                  value={
                    activeLangTab === 'ar'
                      ? config.hero.descriptionAr
                      : activeLangTab === 'fr'
                      ? config.hero.descriptionFr
                      : config.hero.descriptionEn
                  }
                  onChange={(e) =>
                    updateHero(
                      activeLangTab === 'ar'
                        ? 'descriptionAr'
                        : activeLangTab === 'fr'
                        ? 'descriptionFr'
                        : 'descriptionEn',
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs outline-none focus:border-[#231f20]"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-[#231f20] mb-1">
                  نص الزر الرئيسي:
                </label>
                <input
                  type="text"
                  value={
                    activeLangTab === 'ar'
                      ? config.hero.primaryBtnTextAr
                      : activeLangTab === 'fr'
                      ? config.hero.primaryBtnTextFr
                      : config.hero.primaryBtnTextEn
                  }
                  onChange={(e) =>
                    updateHero(
                      activeLangTab === 'ar'
                        ? 'primaryBtnTextAr'
                        : activeLangTab === 'fr'
                        ? 'primaryBtnTextFr'
                        : 'primaryBtnTextEn',
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs outline-none focus:border-[#231f20]"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-[#231f20] mb-1">
                  رابط الزر الرئيسي:
                </label>
                <input
                  type="text"
                  value={config.hero.primaryBtnUrl}
                  onChange={(e) => updateHero('primaryBtnUrl', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs outline-none focus:border-[#231f20]"
                />
              </div>
            </div>
          </div>

          {/* 4 Impact Stats */}
          <div className="bg-white p-6 rounded-2xl border border-[#e5e0d6] shadow-2xs space-y-4">
            <h3 className="text-sm font-extrabold text-[#231f20] pb-2 border-b border-[#E5E0D6] flex items-center gap-2">
              <span>📊</span>
              <span>مؤشرات وأرقام المركز الإعلامي الأربعة (4 Media KPIs)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {config.stats.map((stat, idx) => (
                <div
                  key={stat.id}
                  className="p-4 rounded-xl border border-[#e5e0d6] bg-[#FAF8F5] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xs font-black text-[#231f20]">
                      مؤشر {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={stat.icon}
                      onChange={(e) => updateStat(idx, 'icon', e.target.value)}
                      className="w-10 px-2 py-1 rounded text-center border border-[#e5e0d6] text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-3xs font-bold text-[#231f20] mb-1">
                      القيمة ({activeLangTab.toUpperCase()}):
                    </label>
                    <input
                      type="text"
                      value={
                        activeLangTab === 'ar'
                          ? (stat.valueAr ?? stat.value)
                          : activeLangTab === 'fr'
                          ? (stat.valueFr ?? stat.value)
                          : (stat.valueEn ?? stat.value)
                      }
                      onChange={(e) => {
                        const val = e.target.value
                        if (activeLangTab === 'ar') {
                          updateStat(idx, 'valueAr', val)
                          updateStat(idx, 'value', val)
                        } else if (activeLangTab === 'fr') {
                          updateStat(idx, 'valueFr', val)
                        } else {
                          updateStat(idx, 'valueEn', val)
                        }
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#e5e0d6] text-xs font-bold bg-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-3xs font-bold text-[#231f20] mb-1">
                      العنوان ({activeLangTab.toUpperCase()}):
                    </label>
                    <input
                      type="text"
                      value={
                        activeLangTab === 'ar'
                          ? stat.labelAr
                          : activeLangTab === 'fr'
                          ? stat.labelFr
                          : stat.labelEn
                      }
                      onChange={(e) =>
                        updateStat(
                          idx,
                          activeLangTab === 'ar'
                            ? 'labelAr'
                            : activeLangTab === 'fr'
                            ? 'labelFr'
                            : 'labelEn',
                          e.target.value
                        )
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#e5e0d6] text-xs bg-white outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Banner Config */}
          <div className="bg-white p-6 rounded-2xl border border-[#e5e0d6] shadow-2xs space-y-4">
            <h3 className="text-sm font-extrabold text-[#231f20] pb-2 border-b border-[#E5E0D6] flex items-center gap-2">
              <span>📣</span>
              <span>بانر العلاقات الصحفية والإعلامية (Press & Media CTA)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-2xs font-bold text-[#231f20] mb-1">
                  شارة البانر:
                </label>
                <input
                  type="text"
                  value={
                    activeLangTab === 'ar'
                      ? config.cta.badgeAr
                      : activeLangTab === 'fr'
                      ? config.cta.badgeFr
                      : config.cta.badgeEn
                  }
                  onChange={(e) =>
                    updateCta(
                      activeLangTab === 'ar' ? 'badgeAr' : activeLangTab === 'fr' ? 'badgeFr' : 'badgeEn',
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs outline-none focus:border-[#231f20]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-2xs font-bold text-[#231f20] mb-1">
                  عنوان البانر:
                </label>
                <input
                  type="text"
                  value={
                    activeLangTab === 'ar'
                      ? config.cta.titleAr
                      : activeLangTab === 'fr'
                      ? config.cta.titleFr
                      : config.cta.titleEn
                  }
                  onChange={(e) =>
                    updateCta(
                      activeLangTab === 'ar' ? 'titleAr' : activeLangTab === 'fr' ? 'titleFr' : 'titleEn',
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs font-bold outline-none focus:border-[#231f20]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-2xs font-bold text-[#231f20] mb-1">
                  نص الدعوة:
                </label>
                <textarea
                  rows={3}
                  value={
                    activeLangTab === 'ar'
                      ? config.cta.descAr
                      : activeLangTab === 'fr'
                      ? config.cta.descFr
                      : config.cta.descEn
                  }
                  onChange={(e) =>
                    updateCta(
                      activeLangTab === 'ar' ? 'descAr' : activeLangTab === 'fr' ? 'descFr' : 'descEn',
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs outline-none focus:border-[#231f20]"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-[#231f20] mb-1">
                  نص الزر الأساسي:
                </label>
                <input
                  type="text"
                  value={
                    activeLangTab === 'ar'
                      ? config.cta.primaryBtnTextAr
                      : activeLangTab === 'fr'
                      ? config.cta.primaryBtnTextFr
                      : config.cta.primaryBtnTextEn
                  }
                  onChange={(e) =>
                    updateCta(
                      activeLangTab === 'ar'
                        ? 'primaryBtnTextAr'
                        : activeLangTab === 'fr'
                        ? 'primaryBtnTextFr'
                        : 'primaryBtnTextEn',
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs outline-none focus:border-[#231f20]"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-[#231f20] mb-1">
                  رابط الزر الأساسي:
                </label>
                <input
                  type="text"
                  value={config.cta.primaryBtnUrl}
                  onChange={(e) => updateCta('primaryBtnUrl', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs outline-none focus:border-[#231f20]"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-[#231f20] mb-1">
                  نص الزر الثانوي:
                </label>
                <input
                  type="text"
                  value={
                    activeLangTab === 'ar'
                      ? config.cta.secondaryBtnTextAr
                      : activeLangTab === 'fr'
                      ? config.cta.secondaryBtnTextFr
                      : config.cta.secondaryBtnTextEn
                  }
                  onChange={(e) =>
                    updateCta(
                      activeLangTab === 'ar'
                        ? 'secondaryBtnTextAr'
                        : activeLangTab === 'fr'
                        ? 'secondaryBtnTextFr'
                        : 'secondaryBtnTextEn',
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs outline-none focus:border-[#231f20]"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-[#231f20] mb-1">
                  رابط الزر الثانوي:
                </label>
                <input
                  type="text"
                  value={config.cta.secondaryBtnUrl}
                  onChange={(e) => updateCta('secondaryBtnUrl', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs outline-none focus:border-[#231f20]"
                />
              </div>
            </div>
          </div>

          {/* Sticky Save Action Bar */}
          <div className="sticky bottom-4 z-30 p-4 rounded-2xl bg-[#231f20]/95 backdrop-blur-md border border-white/20 shadow-xl flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold">
                تأكد من حفظ التغييرات ليتم تطبيقها ونشرها فوراً على الموقع
              </span>
            </div>

            <button
              type="button"
              disabled={savingConfig}
              onClick={handleSaveConfig}
              className="px-6 py-2.5 rounded-xl font-black text-xs bg-[#bd3227] hover:bg-[#a3261c] disabled:opacity-50 text-white transition-all shadow-md cursor-pointer flex items-center gap-2"
            >
              <span>💾</span>
              <span>{savingConfig ? 'جارٍ الحفظ والنشر...' : 'حفظ ونشر التعديلات'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

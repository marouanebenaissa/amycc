'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { EventsPageConfig, EventsPageStatItem } from '@/lib/settings'
import { saveEventsPageConfiguration } from '@/lib/actions/admin'

export interface RegistrationItem {
  id: string
  full_name: string
  email: string
  phone?: string | null
  status: string
  created_at: string
}

export interface AdminEventRow {
  id: string
  slug: string
  start_date: string
  end_date?: string | null
  venue?: string | null
  city?: string | null
  capacity?: number | null
  registration_open: boolean
  cover_image?: string | null
  status?: string | null
  event_translations?: {
    locale?: string
    title: string
    description?: string | null
  }[]
  event_registrations?: RegistrationItem[] | { count: number }[]
}

interface EventsAdminTabsProps {
  events: AdminEventRow[]
  initialPageConfig: EventsPageConfig
  defaultPageConfig?: EventsPageConfig
  onToggleRegistration: (id: string, currentOpen: boolean) => Promise<void>
  onDeleteEvent: (id: string) => Promise<{ success: boolean; error?: string } | void>
}

export function EventsAdminTabs({
  events,
  initialPageConfig,
  onToggleRegistration,
  onDeleteEvent,
}: EventsAdminTabsProps) {
  const router = useRouter()
  const [activeMainTab, setActiveMainTab] = useState<'events_list' | 'cms_header'>('events_list')
  const [eventList, setEventList] = useState<AdminEventRow[]>(events)
  const [prevEvents, setPrevEvents] = useState<AdminEventRow[]>(events)
  if (events !== prevEvents) {
    setPrevEvents(events)
    setEventList(events)
  }

  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [config, setConfig] = useState<EventsPageConfig>(initialPageConfig)
  const [activeLangTab, setActiveLangTab] = useState<'ar' | 'fr' | 'en'>('ar')
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [searchFilter, setSearchFilter] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  function updateHero<K extends keyof EventsPageConfig['hero']>(
    field: K,
    val: EventsPageConfig['hero'][K]
  ) {
    setConfig((prev) => ({
      ...prev,
      hero: { ...prev.hero, [field]: val },
    }))
  }

  function updateCta<K extends keyof EventsPageConfig['cta']>(
    field: K,
    val: EventsPageConfig['cta'][K]
  ) {
    setConfig((prev) => ({
      ...prev,
      cta: { ...prev.cta, [field]: val },
    }))
  }

  function updateStat(index: number, field: keyof EventsPageStatItem, val: string) {
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
      setFeedback({ type: 'success', message: 'تم رفع صورة هيدر الفعاليات بنجاح وتفعيلها!' })
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
    setSaving(true)
    setFeedback(null)
    try {
      const res = await saveEventsPageConfiguration(config)
      if (res.success) {
        router.refresh()
        setFeedback({
          type: 'success',
          message: 'تم حفظ إعدادات وواجهة صفحة الفعاليات بنجاح وتحديث الموقع العام فوراً!',
        })
      } else {
        setFeedback({
          type: 'error',
          message: res.error || 'حدث خطأ أثناء حفظ الإعدادات',
        })
      }
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'فشل حفظ الإعدادات',
      })
    } finally {
      setSaving(false)
    }
  }

  // Filter events in table
  const filteredEvents = eventList.filter((ev) => {
    const trans = ev.event_translations?.find((t) => t.locale === 'ar') || ev.event_translations?.[0]
    const title = (trans?.title || ev.slug).toLowerCase()
    const city = (ev.city || '').toLowerCase()
    const venue = (ev.venue || '').toLowerCase()
    const q = searchFilter.toLowerCase().trim()
    return !q || title.includes(q) || city.includes(q) || venue.includes(q)
  })

  // Calculate total registrations
  const totalRegistrationsCount = eventList.reduce((acc, ev) => {
    if (!ev.event_registrations) return acc
    if (Array.isArray(ev.event_registrations) && ev.event_registrations.length > 0) {
      if ('count' in (ev.event_registrations[0] as object)) {
        return acc + ((ev.event_registrations[0] as { count: number }).count || 0)
      }
      return acc + ev.event_registrations.length
    }
    return acc
  }, 0)

  async function handleToggleRegistration(id: string, currentOpen: boolean) {
    setTogglingId(id)
    setEventList((prev) =>
      prev.map((e) => (e.id === id ? { ...e, registration_open: !currentOpen } : e))
    )
    try {
      await onToggleRegistration(id, currentOpen)
      router.refresh()
    } catch (err: unknown) {
      setEventList((prev) =>
        prev.map((e) => (e.id === id ? { ...e, registration_open: currentOpen } : e))
      )
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'فشل تغيير حالة بوابة التسجيل',
      })
    } finally {
      setTogglingId(null)
    }
  }

  async function handleDeleteEvent(id: string, title: string) {
    if (
      !confirm(
        `هل أنت متأكد من رغبتك في حذف فعالية "${title}" نهائياً؟\nسيتم حذف كافة الترجمات وبيانات التسجيل المرتبطة بها.`
      )
    ) {
      return
    }

    setDeletingId(id)
    const backupList = [...eventList]
    setEventList((prev) => prev.filter((e) => e.id !== id))

    try {
      // 1. Try direct REST API endpoint first
      let success = false
      let errorMessage = ''

      try {
        const apiRes = await fetch(`/api/admin/events?id=${encodeURIComponent(id)}`, {
          method: 'DELETE',
        })
        const data = await apiRes.json().catch(() => null)
        if (apiRes.ok && data?.success) {
          success = true
        } else if (data?.error) {
          errorMessage = data.error
        }
      } catch {
        // Fallback to server action below
      }

      // 2. If API route did not complete, invoke server action fallback
      if (!success && onDeleteEvent) {
        const actionRes = await onDeleteEvent(id)
        if (!actionRes || (typeof actionRes === 'object' && actionRes.success !== false)) {
          success = true
        } else if (typeof actionRes === 'object' && actionRes.error) {
          errorMessage = actionRes.error
        }
      }

      if (success) {
        setFeedback({
          type: 'success',
          message: `تم حذف فعالية "${title}" بنجاح وإزالتها من النظام والموقع.`,
        })
        router.refresh()
      } else {
        throw new Error(errorMessage || 'فشل حذف الفعالية من قاعدة البيانات')
      }
    } catch (err: unknown) {
      setEventList(backupList)
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'حدث خطأ أثناء محاولة حذف الفعالية',
      })
    } finally {
      setDeletingId(null)
    }
  }

  function exportEventRegistrationsToCSV(event: AdminEventRow) {
    const trans = event.event_translations?.find((t) => t.locale === 'ar') || event.event_translations?.[0]
    const eventTitle = trans?.title || event.slug
    const regs = (Array.isArray(event.event_registrations) ? event.event_registrations : []) as RegistrationItem[]

    const validRegs = regs.filter((r) => r && 'full_name' in r)
    if (validRegs.length === 0) {
      alert(`لا توجد تسجيلات حضور مسجلة لفعالية "${eventTitle}" حتى الآن.`)
      return
    }

    const csvRows = [
      ['رقم المرجع (ID)', 'الاسم الكامل', 'البريد الإلكتروني', 'رقم الهاتف', 'الفعالية', 'المدينة', 'تاريخ التسجيل', 'الحالة'].join(','),
    ]

    validRegs.forEach((r) => {
      const row = [
        `"${r.id}"`,
        `"${(r.full_name || '').replace(/"/g, '""')}"`,
        `"${(r.email || '').replace(/"/g, '""')}"`,
        `"${(r.phone || '').replace(/"/g, '""')}"`,
        `"${eventTitle.replace(/"/g, '""')}"`,
        `"${(event.city || '').replace(/"/g, '""')}"`,
        `"${new Date(r.created_at).toLocaleString('ar-MA')}"`,
        `"${r.status || 'مؤكد'}"`,
      ]
      csvRows.push(row.join(','))
    })

    const csvContent = '\uFEFF' + csvRows.join('\r\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    const cleanTitle = eventTitle.slice(0, 30).replace(/[/\\?%*:|"<>]/g, '_')
    link.setAttribute('download', `AMYCC-حضور-${cleanTitle}-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  function exportAllRegistrationsToCSV() {
    const allRows: { event: AdminEventRow; reg: RegistrationItem }[] = []
    eventList.forEach((ev) => {
      if (Array.isArray(ev.event_registrations)) {
        ev.event_registrations.forEach((r) => {
          if (r && 'full_name' in r) {
            allRows.push({ event: ev, reg: r as RegistrationItem })
          }
        })
      }
    })

    if (allRows.length === 0) {
      alert('لا توجد أي تسجيلات حضور مسجلة في كافة الفعاليات حتى الآن.')
      return
    }

    const csvRows = [
      ['رقم المرجع (ID)', 'الاسم الكامل', 'البريد الإلكتروني', 'رقم الهاتف', 'الفعالية', 'المدينة', 'تاريخ الفعالية', 'تاريخ التسجيل', 'الحالة'].join(','),
    ]

    allRows.forEach(({ event, reg }) => {
      const trans = event.event_translations?.find((t) => t.locale === 'ar') || event.event_translations?.[0]
      const eventTitle = trans?.title || event.slug
      const row = [
        `"${reg.id}"`,
        `"${(reg.full_name || '').replace(/"/g, '""')}"`,
        `"${(reg.email || '').replace(/"/g, '""')}"`,
        `"${(reg.phone || '').replace(/"/g, '""')}"`,
        `"${eventTitle.replace(/"/g, '""')}"`,
        `"${(event.city || '').replace(/"/g, '""')}"`,
        `"${new Date(event.start_date).toLocaleDateString('ar-MA')}"`,
        `"${new Date(reg.created_at).toLocaleString('ar-MA')}"`,
        `"${reg.status || 'مؤكد'}"`,
      ]
      csvRows.push(row.join(','))
    })

    const csvContent = '\uFEFF' + csvRows.join('\r\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `AMYCC-كافة-المسجلين-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Primary Section Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-1.5 bg-white rounded-2xl border border-[#e5e0d6] shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveMainTab('events_list')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
              activeMainTab === 'events_list'
                ? 'bg-[#231f20] text-white shadow-sm'
                : 'text-[#5C5A55] hover:text-[#231f20] hover:bg-[#FAF8F5]'
            }`}
          >
            <span>📅</span>
            <span>قائمة الفعاليات والمواعيد ({eventList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab('cms_header')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
              activeMainTab === 'cms_header'
                ? 'bg-[#bd3227] text-white shadow-sm'
                : 'text-[#5C5A55] hover:text-[#231f20] hover:bg-[#FAF8F5]'
            }`}
          >
            <span>✨</span>
            <span>تخصيص واجهة ورأس صفحة الفعاليات (Events CMS)</span>
          </button>
        </div>

        <Link
          href="/ar/events"
          target="_blank"
          className="px-4 py-2 rounded-xl text-xs font-bold text-[#bd3227] bg-[#F4EFE6] hover:bg-[#F4EFE6] transition-colors flex items-center gap-1.5"
        >
          <span>معاينة صفحة الفعاليات</span>
          <span>↗</span>
        </Link>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs font-bold flex items-center justify-between border ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <span>{feedback.message}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-sm font-bold opacity-60 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 1: EVENTS LIST & REGISTRATIONS GATE                              */}
      {/* ==================================================================== */}
      {activeMainTab === 'events_list' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <span className="absolute start-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                🔍
              </span>
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="ابحث في الفعاليات بالاسم، المدينة، أو الفضاء..."
                className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-[#e5e0d6] bg-white text-xs outline-none focus:border-[#bd3227]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
              <button
                type="button"
                onClick={exportAllRegistrationsToCSV}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 active:scale-98 text-white text-xs font-bold rounded-xl transition-all shadow-subtle cursor-pointer"
                title="تحميل جدول كافة المسجلين في جميع الفعاليات بصيغة CSV المتوافقة مع Microsoft Excel"
              >
                <span>📥</span>
                <span>تحميل قائمة المسجلين (CSV)</span>
                <span className="px-1.5 py-0.5 rounded-full bg-emerald-700 text-3xs font-black">
                  {totalRegistrationsCount}
                </span>
              </button>

              <Link
                href="/admin/events/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#231f20] text-white text-xs font-bold rounded-xl hover:bg-[#231f20] active:scale-98 transition-all shadow-subtle hover:shadow-card"
              >
                <span>+</span>
                <span>إضافة فعالية جديدة (New Event)</span>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5e0d6] overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs text-[#231f20]">
                <thead className="bg-[#FAF8F5] border-b border-[#e5e0d6] text-3xs uppercase tracking-wider text-[#5C5A55] font-bold">
                  <tr>
                    <th className="px-6 py-4 text-start">الفعالية</th>
                    <th className="px-6 py-4 text-start">التاريخ والفضاء</th>
                    <th className="px-6 py-4 text-start">المقاعد والحجوزات</th>
                    <th className="px-6 py-4 text-start">بوابة التسجيل</th>
                    <th className="px-6 py-4 text-start">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#FEF6CC]">
                  {filteredEvents.length > 0 ? (
                    filteredEvents.map((ev) => {
                      const trans = ev.event_translations?.find((t) => t.locale === 'ar') || ev.event_translations?.[0]
                      const title = trans?.title || ev.slug
                      const regCount = ev.event_registrations
                        ? Array.isArray(ev.event_registrations) &&
                          ev.event_registrations.length > 0 &&
                          'count' in (ev.event_registrations[0] as object)
                          ? (ev.event_registrations[0] as { count: number }).count
                          : ev.event_registrations.length
                        : 0
                      const dateObj = new Date(ev.start_date)

                      return (
                        <tr key={ev.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-[#231f20] overflow-hidden shrink-0 relative border border-[#e5e0d6]">
                                {ev.cover_image ? (
                                  <Image
                                    src={ev.cover_image}
                                    alt={title}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-lg">
                                    🎭
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-extrabold text-[#231f20] text-xs sm:text-sm">
                                  {title}
                                </div>
                                <div className="text-[#5C5A55] text-3xs font-mono">
                                  /{ev.slug}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold block text-[#231f20]">
                              {dateObj.toLocaleDateString('ar-MA', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                            <span className="text-[#5C5A55] text-3xs">
                              {ev.venue || 'المركز الثقافي'} {ev.city ? `• ${ev.city}` : ''}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5">
                              <span className="font-black text-[#231f20] text-sm">
                                {regCount}
                              </span>
                              <span className="text-[#5C5A55] text-3xs">
                                / {ev.capacity ? `${ev.capacity} مقعد` : 'غير محدد'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              type="button"
                              disabled={togglingId === ev.id}
                              onClick={() => handleToggleRegistration(ev.id, ev.registration_open)}
                              className={`px-3 py-1 rounded-full text-3xs font-extrabold cursor-pointer transition-all disabled:opacity-60 ${
                                ev.registration_open
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {togglingId === ev.id
                                ? 'جارٍ التحديث...'
                                : ev.registration_open
                                ? 'مفتوح (Open) ✓'
                                : 'مغلق (Closed) ✕'}
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                title="تحميل لائحة الحضور لهذه الفعالية بصيغة CSV المتوافقة مع Excel"
                                onClick={() => exportEventRegistrationsToCSV(ev)}
                                className="px-2.5 py-1.5 rounded-lg text-2xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <span>📥</span>
                                <span>لائحة الحضور ({regCount})</span>
                              </button>
                              <Link
                                href={`/admin/events/${ev.id}/edit`}
                                className="px-3 py-1.5 rounded-lg text-2xs font-bold bg-[#FAF8F5] border border-[#e5e0d6] text-[#231f20] hover:bg-[#F4EFE6] transition-colors"
                              >
                                تعديل
                              </Link>
                              <button
                                type="button"
                                disabled={deletingId === ev.id}
                                onClick={() => handleDeleteEvent(ev.id, title)}
                                className="px-3 py-1.5 rounded-lg text-2xs font-bold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors disabled:opacity-50 cursor-pointer"
                              >
                                {deletingId === ev.id ? 'جارٍ الحذف...' : 'حذف'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-[#5C5A55]">
                        لا توجد فعاليات مسجلة حالياً. اضغط على &quot;إضافة فعالية جديدة&quot; لبدء الجدولة.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: EVENTS PAGE HERO & SETTINGS CMS                               */}
      {/* ==================================================================== */}
      {activeMainTab === 'cms_header' && (
        <div className="space-y-6">
          {/* Language Switcher Bar */}
          <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-[#e5e0d6] shadow-2xs">
            <div className="text-2xs font-bold text-[#5C5A55] flex items-center gap-2">
              <span>🌐</span>
              <span>اختر لغة إدخال النصوص (Trilingual Input Selector):</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveLangTab('ar')}
                className={`px-3.5 py-1.5 rounded-lg text-2xs font-black transition-colors ${
                  activeLangTab === 'ar'
                    ? 'bg-[#231f20] text-white shadow-xs'
                    : 'bg-[#FAF8F5] text-[#5C5A55] hover:bg-[#F4EFE6]'
                }`}
              >
                العربية (AR)
              </button>
              <button
                type="button"
                onClick={() => setActiveLangTab('fr')}
                className={`px-3.5 py-1.5 rounded-lg text-2xs font-black transition-colors ${
                  activeLangTab === 'fr'
                    ? 'bg-[#231f20] text-white shadow-xs'
                    : 'bg-[#FAF8F5] text-[#5C5A55] hover:bg-[#F4EFE6]'
                }`}
              >
                Français (FR)
              </button>
              <button
                type="button"
                onClick={() => setActiveLangTab('en')}
                className={`px-3.5 py-1.5 rounded-lg text-2xs font-black transition-colors ${
                  activeLangTab === 'en'
                    ? 'bg-[#231f20] text-white shadow-xs'
                    : 'bg-[#FAF8F5] text-[#5C5A55] hover:bg-[#F4EFE6]'
                }`}
              >
                English (EN)
              </button>
            </div>
          </div>

          {/* Hero Simulation Preview */}
          <div className="bg-white p-6 rounded-2xl border border-[#e5e0d6] shadow-2xs space-y-4">
            <h3 className="text-sm font-extrabold text-[#231f20] flex items-center gap-2">
              <span>👁️</span>
              <span>معاينة حية ومباشرة لهيدر صفحة الفعاليات (Live Hero Simulation)</span>
            </h3>

            <div
              className={`relative rounded-2xl overflow-hidden p-8 sm:p-12 text-center min-h-[280px] flex flex-col justify-center items-center shadow-inner transition-colors ${
                config.hero.hasHeroImage && config.hero.imageUrl
                  ? 'bg-[#231f20] text-white'
                  : 'bg-gradient-to-b from-[#F5F3EE] via-[#F5F3EE] to-[#F5F3EE] border border-[#e5e0d6] text-[#231f20]'
              }`}
            >
              {config.hero.hasHeroImage && config.hero.imageUrl ? (
                <>
                  <Image
                    src={config.hero.imageUrl}
                    alt="Hero Preview"
                    fill
                    className="object-cover object-center"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/45" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/55 to-black/90 pointer-events-none" />
                </>
              ) : (
                <>
                  <div className="absolute inset-0 moroccan-pattern-light opacity-60 pointer-events-none" />
                  <div className="absolute top-1/3 start-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#bd3227]/10 rounded-full blur-3xl pointer-events-none" />
                </>
              )}

              <div className="relative z-10 max-w-3xl space-y-3">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-2xs font-bold ${
                    config.hero.hasHeroImage && config.hero.imageUrl
                      ? 'bg-white/10 text-[#ffd22f] border border-white/20'
                      : 'bg-[#F4EFE6] text-[#bd3227] border border-[#fde8e7]'
                  }`}
                >
                  {activeLangTab === 'ar'
                    ? config.hero.badgeAr
                    : activeLangTab === 'fr'
                    ? config.hero.badgeFr
                    : config.hero.badgeEn}
                </span>

                <h1
                  className={`text-2xl sm:text-4xl font-black leading-tight ${
                    config.hero.hasHeroImage && config.hero.imageUrl ? 'text-white' : 'text-[#231f20]'
                  }`}
                >
                  {activeLangTab === 'ar'
                    ? config.hero.titleAr
                    : activeLangTab === 'fr'
                    ? config.hero.titleFr
                    : config.hero.titleEn}
                </h1>

                {(activeLangTab === 'ar'
                  ? config.hero.subtitleAr
                  : activeLangTab === 'fr'
                  ? config.hero.subtitleFr
                  : config.hero.subtitleEn) && (
                  <p
                    className={`text-xs sm:text-sm font-bold ${
                      config.hero.hasHeroImage && config.hero.imageUrl ? 'text-[#ffd22f]' : 'text-[#bd3227]'
                    }`}
                  >
                    {activeLangTab === 'ar'
                      ? config.hero.subtitleAr
                      : activeLangTab === 'fr'
                      ? config.hero.subtitleFr
                      : config.hero.subtitleEn}
                  </p>
                )}

                <p
                  className={`text-2xs sm:text-xs line-clamp-3 leading-relaxed ${
                    config.hero.hasHeroImage && config.hero.imageUrl ? 'text-white/80' : 'text-[#5C5A55]'
                  }`}
                >
                  {activeLangTab === 'ar'
                    ? config.hero.descriptionAr
                    : activeLangTab === 'fr'
                    ? config.hero.descriptionFr
                    : config.hero.descriptionEn}
                </p>

                <div className="pt-2">
                  <span
                    className={`px-5 py-2.5 rounded-xl text-2xs font-bold shadow-md inline-flex items-center gap-1.5 ${
                      config.hero.hasHeroImage && config.hero.imageUrl
                        ? 'bg-[#ffd22f] text-[#231f20]'
                        : 'bg-[#bd3227] text-white'
                    }`}
                  >
                    <span>📅</span>
                    <span>
                      {activeLangTab === 'ar'
                        ? config.hero.primaryBtnTextAr
                        : activeLangTab === 'fr'
                        ? config.hero.primaryBtnTextFr
                        : config.hero.primaryBtnTextEn}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image Controls */}
          <div className="bg-white p-6 rounded-2xl border border-[#e5e0d6] shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E0D6]">
              <div>
                <h3 className="text-sm font-extrabold text-[#231f20]">
                  صورة خلفية الهيدر (Hero Background Image)
                </h3>
                <p className="text-3xs text-[#5C5A55]">
                  ارفع صورة مخصصة عالية الدقة تمثل الأمسيات والورشات الفنية بالمغرب.
                </p>
              </div>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={config.hero.hasHeroImage}
                  onChange={(e) => updateHero('hasHeroImage', e.target.checked)}
                  className="w-4 h-4 text-[#231f20] rounded focus:ring-[#231f20]"
                />
                <span className="text-xs font-bold text-[#231f20]">
                  تفعيل صورة الخلفية
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-2xs font-bold text-[#231f20] mb-1">
                  رابط الصورة (Image URL):
                </label>
                <input
                  type="text"
                  value={config.hero.imageUrl}
                  onChange={(e) => updateHero('imageUrl', e.target.value)}
                  placeholder="/uploads/hero-events.jpg أو رابط خارجي https://..."
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
                    className="w-full px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#231f20] hover:bg-[#d2a82b] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                  >
                    {uploadingImage ? 'جاري الرفع...' : '📁 اختيار ملف من الجهاز ورفعه'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Multilingual Text Inputs */}
          <div className="bg-white p-6 rounded-2xl border border-[#e5e0d6] shadow-2xs space-y-4">
            <h3 className="text-sm font-extrabold text-[#231f20] pb-2 border-b border-[#E5E0D6]">
              نصوص الهيدر والعناوين باللغة المختارة ({activeLangTab.toUpperCase()})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-2xs font-bold text-[#231f20] mb-1">
                  الشارة (Badge):
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

              <div>
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
                  الوصف التفصيلي (Description):
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
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs leading-relaxed outline-none focus:border-[#231f20]"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-[#231f20] mb-1">
                  نص زر الفعاليات الرئيسي:
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
            </div>
          </div>

          {/* 4 Impact Stats */}
          <div className="bg-white p-6 rounded-2xl border border-[#e5e0d6] shadow-2xs space-y-4">
            <h3 className="text-sm font-extrabold text-[#231f20] pb-2 border-b border-[#E5E0D6]">
              مؤشرات وأرقام الفعاليات الأربعة (4 Impact Stats)
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
                      className="w-10 px-2 py-1 rounded text-center border border-[#e5e0d6] text-xs"
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
                          ? (stat.valueFr ?? (stat.value === 'فوري' ? 'Immédiat' : stat.value))
                          : (stat.valueEn ?? (stat.value === 'فوري' ? 'Instant' : stat.value))
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

          {/* Suggest Event / Partnership CTA Banner */}
          <div className="bg-white p-6 rounded-2xl border border-[#e5e0d6] shadow-2xs space-y-4">
            <h3 className="text-sm font-extrabold text-[#231f20] pb-2 border-b border-[#E5E0D6]">
              بانر اقتراح فعالية والشراكة الفنية (Partnership CTA Banner)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-2xs font-bold text-[#231f20] mb-1">
                  الشارة ({activeLangTab.toUpperCase()}):
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
                  عنوان البانر ({activeLangTab.toUpperCase()}):
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
                  نص الدعوة ({activeLangTab.toUpperCase()}):
                </label>
                <textarea
                  rows={2}
                  value={
                    activeLangTab === 'ar'
                      ? config.cta.descAr
                      : activeLangTab === 'fr'
                      ? config.cta.descFr
                      : config.cta.descEn
                  }
                  onChange={(e) =>
                    updateCta(
                      activeLangTab === 'ar'
                        ? 'descAr'
                        : activeLangTab === 'fr'
                        ? 'descFr'
                        : 'descEn',
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs leading-relaxed outline-none focus:border-[#231f20]"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-[#231f20] mb-1">
                  نص الزر الأول ({activeLangTab.toUpperCase()}):
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
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-[#231f20] mb-1">
                  رابط الزر الأول:
                </label>
                <input
                  type="text"
                  value={config.cta.primaryBtnUrl}
                  onChange={(e) => updateCta('primaryBtnUrl', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Save Bar for Immediate Action */}
      <div className="sticky bottom-4 z-40 p-3 bg-white/95 backdrop-blur-md rounded-2xl border border-[#e5e0d6] shadow-card flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-2xs font-bold text-[#231f20]">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>لوحة التحكم نشطة — التعديلات جاهزة للحفظ والنشر الفوري</span>
        </div>
        <div className="flex items-center gap-2">


          <button
            type="button"
            onClick={handleSaveConfig}
            disabled={saving}
            className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-[#231f20] hover:bg-[#d2a82b] disabled:opacity-50 transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            {saving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>جاري الحفظ...</span>
              </>
            ) : (
              <>
                <span>💾</span>
                <span>حفظ التعديلات ونشرها فوراً</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

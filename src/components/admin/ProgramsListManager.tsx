'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAdminLocale } from './AdminLocaleContext'
import { PROGRAM_STRINGS } from './ProgramsAdminTabs'

export interface AdminProgramRow {
  id: string
  slug: string
  category: string
  city?: string | null
  cover_image?: string | null
  status: string
  created_at?: string
  program_translations?: {
    locale: string
    title: string
    description?: string | null
  }[]
}

interface ProgramsListManagerProps {
  initialPrograms: AdminProgramRow[]
  onUpdateStatus: (id: string, newStatus: string) => Promise<void>
  onDeleteProgram: (id: string) => Promise<void>
}

export function ProgramsListManager({
  initialPrograms,
  onUpdateStatus,
  onDeleteProgram,
}: ProgramsListManagerProps) {
  const { locale, dir } = useAdminLocale()
  const tr = PROGRAM_STRINGS[locale] || PROGRAM_STRINGS.ar

  const [programs, setPrograms] = useState<AdminProgramRow[]>(initialPrograms)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)

  const filteredPrograms = programs.filter((prog) => {
    const arTitle = prog.program_translations?.find((t) => t.locale === 'ar')?.title || ''
    const enTitle = prog.program_translations?.find((t) => t.locale === 'en')?.title || ''
    const frTitle = prog.program_translations?.find((t) => t.locale === 'fr')?.title || ''

    const matchesSearch =
      arTitle.toLowerCase().includes(search.toLowerCase()) ||
      enTitle.toLowerCase().includes(search.toLowerCase()) ||
      frTitle.toLowerCase().includes(search.toLowerCase()) ||
      prog.slug.toLowerCase().includes(search.toLowerCase()) ||
      (prog.city && prog.city.toLowerCase().includes(search.toLowerCase()))

    const matchesCategory = selectedCategory === 'all' || prog.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || prog.status === selectedStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  async function handleToggleStatus(id: string, currentStatus: string) {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published'
    setActionLoadingId(id)
    try {
      await onUpdateStatus(id, newStatus)
      setPrograms((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
      )
    } catch {
      alert(locale === 'ar' ? 'تعذر تحديث حالة البرنامج' : 'Failed to update program status')
    } finally {
      setActionLoadingId(null)
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(tr.deleteConfirm(title))) {
      return
    }
    setActionLoadingId(id)
    try {
      await onDeleteProgram(id)
      setPrograms((prev) => prev.filter((p) => p.id !== id))
    } catch {
      alert(locale === 'ar' ? 'تعذر حذف البرنامج' : 'Failed to delete program')
    } finally {
      setActionLoadingId(null)
    }
  }

  return (
    <div className="space-y-6" dir={dir}>
      {/* Search & Filter Toolbar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#e5e0d6] shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex-1 relative">
          <span className="absolute inset-y-0 start-3.5 flex items-center pointer-events-none text-sm text-[#5C5A55]">
            🔍
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={tr.searchPlaceholder}
            className="w-full ps-10 pe-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6] text-xs sm:text-sm text-[#231f20] focus:bg-white focus:outline-none focus:border-[#231f20] transition-colors"
          />
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6] text-xs font-bold text-[#231f20] focus:bg-white focus:outline-none focus:border-[#231f20] cursor-pointer"
          >
            <option value="all">{tr.filterAllCategories} ({programs.length})</option>
            <option value="arts">{tr.categories.arts}</option>
            <option value="music">{tr.categories.music}</option>
            <option value="theatre">{tr.categories.theatre}</option>
            <option value="youth">{tr.categories.youth}</option>
            <option value="volunteer">{tr.categories.volunteer}</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6] text-xs font-bold text-[#231f20] focus:bg-white focus:outline-none focus:border-[#231f20] cursor-pointer"
          >
            <option value="all">{tr.filterAllStatuses}</option>
            <option value="published">{tr.statusPublished}</option>
            <option value="draft">{tr.statusDraft}</option>
          </select>

          <Link
            href="/admin/programs/new"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#231f20] text-white text-xs font-bold rounded-xl hover:bg-[#d2a82b] active:scale-98 transition-all shadow-xs"
          >
            <span>+</span>
            <span>{tr.addNewProgram}</span>
          </Link>
        </div>
      </div>

      {/* Mobile Cards View (< md) */}
      <div className="md:hidden space-y-3">
        {filteredPrograms.length > 0 ? (
          filteredPrograms.map((prog) => {
            const localizedTrans = prog.program_translations?.find((t) => t.locale === locale)
            const arTrans = prog.program_translations?.find((t) => t.locale === 'ar')
            const frTrans = prog.program_translations?.find((t) => t.locale === 'fr')
            const enTrans = prog.program_translations?.find((t) => t.locale === 'en')
            const title = localizedTrans?.title || arTrans?.title || frTrans?.title || enTrans?.title || prog.slug

            return (
              <div
                key={prog.id}
                className="bg-white p-4 rounded-2xl border border-[#e5e0d6] shadow-2xs space-y-3"
              >
                <div className="flex items-start gap-3">
                  {prog.cover_image ? (
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-[#e5e0d6] shrink-0 bg-white">
                      <Image
                        src={prog.cover_image}
                        alt={title}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-[#231f20]/10 text-[#231f20] flex items-center justify-center text-xl shrink-0">
                      🎨
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="font-black text-sm text-[#231f20] leading-tight">{title}</div>
                    <div className="text-[#5C5A55] text-3xs font-mono mt-0.5 truncate">
                      /{prog.slug}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-3xs font-bold text-[#bd3227]">
                        {tr.categories[prog.category] || prog.category}
                      </span>
                      <span className="text-[#5C5A55] text-3xs">
                        📍 {prog.city || tr.nationalScope}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#e5e0d6]">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-3xs font-bold ${
                      prog.status === 'published'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {prog.status === 'published' ? tr.publishedPublic : tr.draftInternal}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/admin/programs/${prog.id}/edit`}
                      className="px-2.5 py-1 rounded-lg text-2xs font-bold bg-[#FAF8F5] text-[#231f20] hover:bg-[#F4EFE6] border border-[#e5e0d6]"
                    >
                      {tr.actionEdit}
                    </Link>

                    <Link
                      href={`/${locale}/programs/${prog.slug}`}
                      target="_blank"
                      className="px-2.5 py-1 rounded-lg text-2xs font-bold text-[#231f20] hover:underline"
                    >
                      {tr.actionPreview}
                    </Link>

                    <button
                      type="button"
                      disabled={actionLoadingId === prog.id}
                      onClick={() => handleToggleStatus(prog.id, prog.status)}
                      className={`px-2.5 py-1 rounded-lg text-2xs font-bold transition-colors cursor-pointer ${
                        prog.status === 'published'
                          ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      {prog.status === 'published' ? tr.actionDisable : tr.actionPublish}
                    </button>

                    <button
                      type="button"
                      disabled={actionLoadingId === prog.id}
                      onClick={() => handleDelete(prog.id, title)}
                      className="px-2.5 py-1 rounded-lg text-2xs font-bold text-rose-600 hover:bg-rose-50"
                    >
                      {tr.actionDelete}
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="p-8 text-center bg-white rounded-2xl border border-[#e5e0d6] text-xs text-[#5C5A55]">
            {tr.noProgramsFound}
          </div>
        )}
      </div>

      {/* Desktop Table View (>= md) */}
      <div className="hidden md:block bg-white rounded-3xl border border-[#e5e0d6] overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs text-[#231f20]">
            <thead className="bg-[#FAF8F5] border-b border-[#e5e0d6] text-2xs uppercase tracking-wider text-[#5C5A55] font-bold">
              <tr>
                <th className="px-6 py-4 text-start">{tr.colProgram}</th>
                <th className="px-6 py-4 text-start">{tr.colCategoryCity}</th>
                <th className="px-6 py-4 text-start">{tr.colStatus}</th>
                <th className="px-6 py-4 text-center">{tr.colActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FEF6CC]">
              {filteredPrograms.length > 0 ? (
                filteredPrograms.map((prog) => {
                  const localizedTrans = prog.program_translations?.find((t) => t.locale === locale)
                  const arTrans = prog.program_translations?.find((t) => t.locale === 'ar')
                  const frTrans = prog.program_translations?.find((t) => t.locale === 'fr')
                  const enTrans = prog.program_translations?.find((t) => t.locale === 'en')
                  const title = localizedTrans?.title || arTrans?.title || frTrans?.title || enTrans?.title || prog.slug

                  return (
                    <tr key={prog.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          {prog.cover_image ? (
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#e5e0d6] shrink-0 bg-white">
                              <Image
                                src={prog.cover_image}
                                alt={title}
                                fill
                                unoptimized
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-[#231f20]/10 text-[#231f20] flex items-center justify-center text-xl shrink-0">
                              🎨
                            </div>
                          )}

                          <div>
                            <div className="font-black text-sm text-[#231f20]">{title}</div>
                            {arTrans?.title && arTrans.title !== title && (
                              <div className="text-[#5C5A55] text-2xs font-arabic">{arTrans.title}</div>
                            )}
                            <div className="text-[#5C5A55] text-3xs font-mono">/{prog.slug}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-bold text-xs text-[#231f20] block">
                          {tr.categories[prog.category] || prog.category}
                        </span>
                        <span className="text-[#5C5A55] text-3xs">
                          📍 {prog.city || tr.nationalScope}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-2xs font-bold ${
                            prog.status === 'published'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {prog.status === 'published' ? tr.publishedPublic : tr.draftInternal}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                          <Link
                            href={`/admin/programs/${prog.id}/edit`}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#FAF8F5] text-[#231f20] hover:bg-[#F4EFE6] border border-[#e5e0d6] transition-colors"
                          >
                            {tr.actionEdit}
                          </Link>

                          <Link
                            href={`/${locale}/programs/${prog.slug}`}
                            target="_blank"
                            className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#231f20] hover:underline"
                            title={tr.actionPreview}
                          >
                            {tr.actionPreview}
                          </Link>

                          <button
                            type="button"
                            disabled={actionLoadingId === prog.id}
                            onClick={() => handleToggleStatus(prog.id, prog.status)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                              prog.status === 'published'
                                ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            }`}
                          >
                            {prog.status === 'published' ? tr.actionDisable : tr.actionPublish}
                          </button>

                          <button
                            type="button"
                            disabled={actionLoadingId === prog.id}
                            onClick={() => handleDelete(prog.id, title)}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            {tr.actionDelete}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-[#5C5A55]">
                    <span className="text-3xl block mb-2">🎨</span>
                    <p className="text-sm font-bold text-[#231f20]">{tr.noProgramsFound}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

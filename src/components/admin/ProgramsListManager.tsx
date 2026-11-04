'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

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

const CATEGORY_NAMES: Record<string, string> = {
  arts: 'الفنون التشكيلية',
  music: 'التراث الموسيقي',
  theatre: 'المسرح وفنون الأداء',
  culture: 'الثقافة والتراث',
  youth: 'تمكين الشباب',
  volunteer: 'العمل التطوعي',
  education: 'التكوين الفني',
  other: 'أخرى',
}

export function ProgramsListManager({
  initialPrograms,
  onUpdateStatus,
  onDeleteProgram,
}: ProgramsListManagerProps) {
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
      alert('تعذر تحديث حالة البرنامج')
    } finally {
      setActionLoadingId(null)
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`هل أنت متأكد من حذف البرنامج: "${title}"؟ لا يمكن التراجع عن هذا الإجراء.`)) {
      return
    }
    setActionLoadingId(id)
    try {
      await onDeleteProgram(id)
      setPrograms((prev) => prev.filter((p) => p.id !== id))
    } catch {
      alert('تعذر حذف البرنامج')
    } finally {
      setActionLoadingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Search & Filter Toolbar */}
      <div className="p-5 rounded-3xl bg-white border border-[#e5e0d6] shadow-subtle flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex-1 relative">
          <span className="absolute inset-y-0 start-3.5 flex items-center pointer-events-none text-sm text-[#5C5A55]">
            🔍
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="البحث في البرامج بالاسم، الرابط، أو المدينة..."
            className="w-full ps-10 pe-4 py-2.5 rounded-xl bg-[#F5F3EE] border border-[#e5e0d6] text-xs sm:text-sm text-[#231f20] focus:bg-white focus:outline-none focus:border-[#231f20]"
          />
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-[#F5F3EE] border border-[#e5e0d6] text-xs font-bold text-[#231f20] focus:bg-white focus:outline-none focus:border-[#231f20]"
          >
            <option value="all">كل المجالات ({programs.length})</option>
            <option value="arts">فنون تشكيلية</option>
            <option value="music">موسيقى وتراث</option>
            <option value="theatre">مسرح وأداء</option>
            <option value="youth">تمكين الشباب</option>
            <option value="volunteer">عمل تطوعي</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-[#F5F3EE] border border-[#e5e0d6] text-xs font-bold text-[#231f20] focus:bg-white focus:outline-none focus:border-[#231f20]"
          >
            <option value="all">كل الحالات</option>
            <option value="published">المنشورة فقط</option>
            <option value="draft">المسودات</option>
          </select>

          <Link
            href="/admin/programs/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#231f20] text-white text-xs font-bold rounded-xl hover:bg-[#d2a82b] active:scale-98 transition-all shadow-xs"
          >
            <span>+</span>
            <span>برنامج جديد</span>
          </Link>
        </div>
      </div>

      {/* Programs List */}
      <div className="bg-white rounded-3xl border border-[#e5e0d6] overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs text-[#231f20]">
            <thead className="bg-[#F5F3EE] border-b border-[#e5e0d6] text-2xs uppercase tracking-wider text-[#5C5A55] font-bold">
              <tr>
                <th className="px-6 py-4 text-start">البرنامج (العنوان والرابط)</th>
                <th className="px-6 py-4 text-start">المجال / المدينة</th>
                <th className="px-6 py-4 text-start">الحالة</th>
                <th className="px-6 py-4 text-start">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FEF6CC]">
              {filteredPrograms.length > 0 ? (
                filteredPrograms.map((prog) => {
                  const arTrans = prog.program_translations?.find((t) => t.locale === 'ar')
                  const enTrans = prog.program_translations?.find((t) => t.locale === 'en')
                  const title = arTrans?.title || enTrans?.title || prog.slug

                  return (
                    <tr key={prog.id} className="hover:bg-[#F5F3EE]/60 transition-colors">
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
                            {enTrans?.title && enTrans.title !== title && (
                              <div className="text-[#5C5A55] text-2xs">{enTrans.title}</div>
                            )}
                            <div className="text-[#5C5A55] text-3xs font-mono">/{prog.slug}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-bold text-xs text-[#231f20] block">
                          {CATEGORY_NAMES[prog.category] || prog.category}
                        </span>
                        <span className="text-[#5C5A55] text-3xs">
                          📍 {prog.city || 'نطاق وطني'}
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
                          {prog.status === 'published' ? '● منشور ومتاح للعموم' : '○ مسودة داخلية'}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link
                            href={`/admin/programs/${prog.id}/edit`}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#F5F3EE] text-[#231f20] hover:bg-[#FEF6CC] border border-[#e5e0d6] transition-colors"
                          >
                            تعديل
                          </Link>

                          <Link
                            href={`/ar/programs/${prog.slug}`}
                            target="_blank"
                            className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#231f20] hover:underline"
                            title="معاينة في الموقع"
                          >
                            معاينة ↗
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
                            {prog.status === 'published' ? 'تعطيل' : 'نشر'}
                          </button>

                          <button
                            type="button"
                            disabled={actionLoadingId === prog.id}
                            onClick={() => handleDelete(prog.id, title)}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            حذف
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
                    <p className="text-sm font-bold text-[#231f20]">لم يتم العثور على برامج مطابقة</p>
                    <p className="text-xs text-[#5C5A55] mt-1">
                      يمكنك إضافة برنامج جديد أو تعديل خيارات البحث والتصفية.
                    </p>
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

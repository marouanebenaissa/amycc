'use client'

import { useState } from 'react'
import type { FaqItemConfig } from '@/lib/settings'
import { saveFaqConfiguration } from '@/lib/actions/admin'

interface FaqManagerProps {
  initialItems: FaqItemConfig[]
  defaultItems?: FaqItemConfig[]
}

const CATEGORY_MAP: Record<string, { labelAr: string; color: string }> = {
  general: { labelAr: 'عامة', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  membership: { labelAr: 'العضوية والانخراط', color: 'bg-blue-50 text-blue-800 border-blue-200' },
  volunteering: { labelAr: 'التطوع — شباب في العمل', color: 'bg-amber-50 text-amber-800 border-amber-200' },
  partnerships: { labelAr: 'الشراكات المؤسسية', color: 'bg-purple-50 text-purple-800 border-purple-200' },
  events: { labelAr: 'الفعاليات والتذاكر', color: 'bg-rose-50 text-rose-800 border-rose-200' },
}

export function FaqManager({ initialItems }: FaqManagerProps) {
  const [items, setItems] = useState<FaqItemConfig[]>(initialItems)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [saving, setSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<FaqItemConfig | null>(null)
  const [modalForm, setModalForm] = useState<Partial<FaqItemConfig>>({
    questionAr: '',
    questionFr: '',
    questionEn: '',
    answerAr: '',
    answerFr: '',
    answerEn: '',
    category: 'general',
    showOnHome: true,
    published: true,
  })

  // Open modal for new item
  function handleAddNew() {
    setEditingItem(null)
    setModalForm({
      id: `faq-${Date.now()}`,
      questionAr: '',
      questionFr: '',
      questionEn: '',
      answerAr: '',
      answerFr: '',
      answerEn: '',
      category: 'general',
      showOnHome: true,
      published: true,
      order: items.length + 1,
    })
    setIsModalOpen(true)
  }

  // Open modal for editing existing item
  function handleEdit(item: FaqItemConfig) {
    setEditingItem(item)
    setModalForm({ ...item })
    setIsModalOpen(true)
  }

  // Save modal form
  function handleModalSave(e: React.FormEvent) {
    e.preventDefault()
    if (!modalForm.questionAr?.trim() || !modalForm.answerAr?.trim()) {
      alert('يرجى ملء السؤال والجواب باللغة العربية على الأقل.')
      return
    }

    if (editingItem) {
      // Update existing
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? ({
                ...item,
                ...modalForm,
              } as FaqItemConfig)
            : item
        )
      )
    } else {
      // Add new
      const newItem: FaqItemConfig = {
        id: modalForm.id || `faq-${Date.now()}`,
        questionAr: modalForm.questionAr || '',
        questionFr: modalForm.questionFr || '',
        questionEn: modalForm.questionEn || '',
        answerAr: modalForm.answerAr || '',
        answerFr: modalForm.answerFr || '',
        answerEn: modalForm.answerEn || '',
        category: (modalForm.category || 'general') as FaqItemConfig['category'],
        showOnHome: modalForm.showOnHome ?? true,
        published: modalForm.published ?? true,
        order: items.length + 1,
      }
      setItems((prev) => [...prev, newItem])
    }

    setIsModalOpen(false)
    setHasUnsavedChanges(true)
  }

  // Delete item
  function handleDelete(id: string) {
    if (!window.confirm('هل أنت متأكد من حذف هذا السؤال؟ لن يتم اعتماده حتى تضغط على "حفظ التغييرات".')) {
      return
    }
    setItems((prev) =>
      prev
        .filter((item) => item.id !== id)
        .map((item, idx) => ({ ...item, order: idx + 1 }))
    )
    setHasUnsavedChanges(true)
  }

  // Reorder items
  function moveItem(index: number, direction: 'up' | 'down') {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= items.length) return

    const newItems = [...items]
    const temp = newItems[index]
    newItems[index] = newItems[targetIndex]
    newItems[targetIndex] = temp

    // Re-assign 1-based order
    const reordered = newItems.map((item, idx) => ({ ...item, order: idx + 1 }))
    setItems(reordered)
    setHasUnsavedChanges(true)
  }

  // Toggle showOnHome
  function toggleShowOnHome(id: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, showOnHome: !item.showOnHome } : item
      )
    )
    setHasUnsavedChanges(true)
  }

  // Toggle published
  function togglePublished(id: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, published: !item.published } : item
      )
    )
    setHasUnsavedChanges(true)
  }

  // Save all to database
  async function handleSaveAll() {
    setSaving(true)
    setSuccessMessage(null)
    setErrorMessage(null)

    try {
      const result = await saveFaqConfiguration(items)
      if (!result.success) {
        throw new Error(result.error || 'فشل حفظ الأسئلة الشائعة')
      }
      setSuccessMessage('تم حفظ وتحديث الأسئلة الشائعة بنجاح في قاعدة البيانات والصفحة الرئيسية!')
      setHasUnsavedChanges(false)
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'حدث خطأ أثناء الحفظ'
      setErrorMessage(msg)
    } finally {
      setSaving(false)
    }
  }

  // Filtered items
  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory
    const q = searchQuery.toLowerCase().trim()
    const matchesSearch =
      !q ||
      item.questionAr.toLowerCase().includes(q) ||
      (item.questionFr && item.questionFr.toLowerCase().includes(q)) ||
      (item.questionEn && item.questionEn.toLowerCase().includes(q)) ||
      item.answerAr.toLowerCase().includes(q)
    return matchesCategory && matchesSearch
  })

  // Statistics
  const totalCount = items.length
  const homeCount = items.filter((i) => i.showOnHome && i.published).length
  const publishedCount = items.filter((i) => i.published).length

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions Bar */}
      <div className="bg-white rounded-3xl border border-[#e5e0d6] p-6 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">❓</span>
              <h2 className="text-lg font-black text-[#231f20]">
                إدارة الأسئلة الشائعة (FAQ CMS)
              </h2>
            </div>
            <p className="text-xs text-[#5C5A55] mt-1">
              تحكم كامل في الأسئلة الشائعة المعروضة في الصفحة الرئيسية وصفحة الأسئلة الشائعة بثلاث لغات.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleAddNew}
              className="px-4 py-2.5 rounded-xl font-bold text-white bg-[#231f20] hover:bg-[#d2a82b] active:scale-98 transition-all text-xs inline-flex items-center gap-2 shadow-2xs cursor-pointer"
            >
              <svg className="w-4 h-4 text-[#ffd22f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span>إضافة سؤال جديد</span>
            </button>

            <button
              type="button"
              onClick={handleSaveAll}
              disabled={saving}
              className={`px-5 py-2.5 rounded-xl font-black text-xs inline-flex items-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-60 ${
                hasUnsavedChanges
                  ? 'bg-[#bd3227] hover:bg-[#a3261c] text-white animate-pulse'
                  : 'bg-[#231f20] hover:bg-[#231f20] text-white'
              }`}
            >
              {saving ? (
                <>
                  <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                <>
                  <span>💾</span>
                  <span>حفظ كافة التغييرات {hasUnsavedChanges ? '*' : ''}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#E5E0D6]">
          <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6]">
            <span className="text-3xs font-bold text-[#5C5A55] block">إجمالي الأسئلة</span>
            <span className="text-xl font-black text-[#231f20]">{totalCount}</span>
          </div>
          <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6]">
            <span className="text-3xs font-bold text-[#5C5A55] block">معروض في الرئيسية</span>
            <span className="text-xl font-black text-[#231f20]">{homeCount}</span>
          </div>
          <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6]">
            <span className="text-3xs font-bold text-[#5C5A55] block">منشور ومرئي</span>
            <span className="text-xl font-black text-emerald-700">{publishedCount}</span>
          </div>
          <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6]">
            <span className="text-3xs font-bold text-[#5C5A55] block">حالة التعديلات</span>
            <span className={`text-xs font-bold block mt-1 ${hasUnsavedChanges ? 'text-[#bd3227]' : 'text-emerald-700'}`}>
              {hasUnsavedChanges ? '⚠️ تعديلات غير محفوظة' : '✓ كافة التغييرات محفوظة'}
            </span>
          </div>
        </div>

        {/* Notification alerts */}
        {successMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
            <span>✓ {successMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs font-bold flex items-center gap-2">
            <span>✕ {errorMessage}</span>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-2xl p-4 border border-[#e5e0d6]">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث في نصوص الأسئلة والإجابات..."
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e5e0d6] focus:border-[#231f20] outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute end-2.5 top-2.5 text-xs text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-3xs font-bold transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#231f20] text-white shadow-2xs'
                : 'bg-[#FAF8F5] text-[#5C5A55] hover:bg-[#F4EFE6]'
            }`}
          >
            الكل ({items.length})
          </button>
          {Object.entries(CATEGORY_MAP).map(([catKey, { labelAr }]) => {
            const count = items.filter((i) => i.category === catKey).length
            return (
              <button
                key={catKey}
                type="button"
                onClick={() => setSelectedCategory(catKey)}
                className={`px-3 py-1.5 rounded-xl text-3xs font-bold transition-all cursor-pointer ${
                  selectedCategory === catKey
                    ? 'bg-[#231f20] text-white shadow-2xs'
                    : 'bg-[#FAF8F5] text-[#5C5A55] hover:bg-[#F4EFE6]'
                }`}
              >
                {labelAr} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3.5">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-[#e5e0d6]">
            <span className="text-3xl block mb-2">🔍</span>
            <h3 className="text-sm font-bold text-[#231f20]">لم يتم العثور على أي أسئلة مطابقة</h3>
            <p className="text-3xs text-[#5C5A55] mt-1">جرب تغيير عبارة البحث أو اختيار تصنيف مختلف.</p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const catInfo = CATEGORY_MAP[item.category] || CATEGORY_MAP.general
            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border p-5 transition-all shadow-subtle ${
                  item.published ? 'border-[#e5e0d6]' : 'border-gray-200 opacity-60 bg-gray-50/50'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Left: Reordering & Index */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex flex-col items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveItem(items.findIndex((i) => i.id === item.id), 'up')}
                        disabled={items.findIndex((i) => i.id === item.id) === 0}
                        className="w-6 h-6 rounded-md bg-[#FAF8F5] hover:bg-[#e5e0d6] disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center text-3xs font-bold text-[#231f20] cursor-pointer"
                        title="تحريك لأعلى"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() => moveItem(items.findIndex((i) => i.id === item.id), 'down')}
                        disabled={items.findIndex((i) => i.id === item.id) === items.length - 1}
                        className="w-6 h-6 rounded-md bg-[#FAF8F5] hover:bg-[#e5e0d6] disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center text-3xs font-bold text-[#231f20] cursor-pointer"
                        title="تحريك لأسفل"
                      >
                        ▼
                      </button>
                    </div>

                    <span className="w-8 h-8 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6] flex items-center justify-center text-xs font-black text-[#231f20]">
                      #{item.order}
                    </span>
                  </div>

                  {/* Middle: Content */}
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-4xs font-bold border ${catInfo.color}`}>
                        {catInfo.labelAr}
                      </span>

                      {/* Homepage toggle pill */}
                      <button
                        type="button"
                        onClick={() => toggleShowOnHome(item.id)}
                        className={`px-2.5 py-0.5 rounded-full text-4xs font-bold border transition-colors cursor-pointer ${
                          item.showOnHome
                            ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                            : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
                        }`}
                        title="انقر للتبديل بين إظهار / إخفاء من الصفحة الرئيسية"
                      >
                        {item.showOnHome ? '★ يظهر بالرئيسية' : 'صفحة الأسئلة فقط'}
                      </button>

                      {/* Published toggle pill */}
                      <button
                        type="button"
                        onClick={() => togglePublished(item.id)}
                        className={`px-2.5 py-0.5 rounded-full text-4xs font-bold border transition-colors cursor-pointer ${
                          item.published
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                        }`}
                        title="انقر للتبديل بين منشور / مسودة"
                      >
                        {item.published ? '✓ منشور' : '✕ مسودة (مخفي)'}
                      </button>
                    </div>

                    <h4 className="text-sm font-bold text-[#231f20] leading-snug">
                      {item.questionAr}
                    </h4>

                    <p className="text-xs text-[#5C5A55] leading-relaxed">
                      {item.answerAr}
                    </p>

                    {/* Multilingual Indicators */}
                    <div className="pt-2 flex flex-wrap items-center gap-3 text-4xs text-[#5C5A55]">
                      <span className={item.questionFr ? 'text-emerald-700 font-bold' : 'text-gray-400'}>
                        {item.questionFr ? '✓ الفرنسية متوفرة' : '○ لا توجد ترجمة فرنسية'}
                      </span>
                      <span>•</span>
                      <span className={item.questionEn ? 'text-emerald-700 font-bold' : 'text-gray-400'}>
                        {item.questionEn ? '✓ الإنجليزية متوفرة' : '○ لا توجد ترجمة إنجليزية'}
                      </span>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 self-end lg:self-start shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEdit(item)}
                      className="px-3 py-1.5 rounded-xl text-3xs font-bold bg-[#FAF8F5] border border-[#e5e0d6] hover:bg-[#231f20] hover:text-white transition-all text-[#231f20] cursor-pointer inline-flex items-center gap-1"
                    >
                      <span>✏️</span>
                      <span>تعديل</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-1.5 rounded-xl text-3xs font-bold bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition-all cursor-pointer inline-flex items-center gap-1"
                    >
                      <span>🗑️</span>
                      <span>حذف</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* ============================================================
          EDIT / ADD MODAL
          ============================================================ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#e5e0d6] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E0D6]">
              <div className="flex items-center gap-2">
                <span className="text-xl">❓</span>
                <h3 className="text-base font-black text-[#231f20]">
                  {editingItem ? 'تعديل السؤال والإجابة' : 'إضافة سؤال جديد'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#FAF8F5] text-[#5C5A55] hover:text-[#231f20] flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleModalSave} className="space-y-4">
              {/* Category & Visibility Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6]">
                <div>
                  <label className="block text-3xs font-bold text-[#5C5A55] mb-1">
                    التصنيف (Category)
                  </label>
                  <select
                    value={modalForm.category || 'general'}
                    onChange={(e) =>
                      setModalForm({
                        ...modalForm,
                        category: e.target.value as FaqItemConfig['category'],
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#e5e0d6] bg-white focus:border-[#231f20] outline-none"
                  >
                    <option value="general">عامة (General)</option>
                    <option value="membership">العضوية والانخراط (Membership)</option>
                    <option value="volunteering">التطوع — شباب في العمل (Volunteering)</option>
                    <option value="partnerships">الشراكات المؤسسية (Partnerships)</option>
                    <option value="events">الفعاليات والتذاكر (Events)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    id="modalShowOnHome"
                    type="checkbox"
                    checked={modalForm.showOnHome ?? true}
                    onChange={(e) =>
                      setModalForm({ ...modalForm, showOnHome: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-[#231f20] focus:ring-[#231f20]"
                  />
                  <label htmlFor="modalShowOnHome" className="text-3xs font-bold text-[#5C5A55] cursor-pointer">
                    عرض بالرئيسية (Home)
                  </label>
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    id="modalPublished"
                    type="checkbox"
                    checked={modalForm.published ?? true}
                    onChange={(e) =>
                      setModalForm({ ...modalForm, published: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-600"
                  />
                  <label htmlFor="modalPublished" className="text-3xs font-bold text-[#5C5A55] cursor-pointer">
                    نشر السؤال (Published)
                  </label>
                </div>
              </div>

              {/* Arabic (Required) */}
              <div className="space-y-3 p-4 rounded-2xl bg-amber-50/40 border border-amber-200/60">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <span>🇲🇦</span>
                  <span>اللغة العربية (إلزامية — الركيزة الأساسية)</span>
                </div>
                <div>
                  <label className="block text-3xs font-bold text-[#5C5A55] mb-1">
                    السؤال بالعربية *
                  </label>
                  <input
                    type="text"
                    required
                    value={modalForm.questionAr || ''}
                    onChange={(e) => setModalForm({ ...modalForm, questionAr: e.target.value })}
                    placeholder="مثال: كيف يمكنني الانخراط في الجمعية؟"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e5e0d6] focus:border-[#231f20] outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="block text-3xs font-bold text-[#5C5A55] mb-1">
                    الإجابة بالعربية *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={modalForm.answerAr || ''}
                    onChange={(e) => setModalForm({ ...modalForm, answerAr: e.target.value })}
                    placeholder="اكتب الإجابة المفصلة والواضحة هنا..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e5e0d6] focus:border-[#231f20] outline-none bg-white leading-relaxed"
                  />
                </div>
              </div>

              {/* French (Optional) */}
              <div className="space-y-3 p-4 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6]">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#231f20]">
                  <span>🇫🇷</span>
                  <span>الترجمة بالفرنسية (Français — اختياري)</span>
                </div>
                <div>
                  <label className="block text-3xs font-bold text-[#5C5A55] mb-1">
                    Question en Français
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={modalForm.questionFr || ''}
                    onChange={(e) => setModalForm({ ...modalForm, questionFr: e.target.value })}
                    placeholder="ex: Comment devenir membre de l'AMYCC ?"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e5e0d6] focus:border-[#231f20] outline-none bg-white text-left font-sans"
                  />
                </div>
                <div>
                  <label className="block text-3xs font-bold text-[#5C5A55] mb-1">
                    Réponse en Français
                  </label>
                  <textarea
                    dir="ltr"
                    rows={2}
                    value={modalForm.answerFr || ''}
                    onChange={(e) => setModalForm({ ...modalForm, answerFr: e.target.value })}
                    placeholder="Réponse détaillée..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e5e0d6] focus:border-[#231f20] outline-none bg-white text-left font-sans leading-relaxed"
                  />
                </div>
              </div>

              {/* English (Optional) */}
              <div className="space-y-3 p-4 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6]">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#231f20]">
                  <span>🇬🇧</span>
                  <span>الترجمة بالإنجليزية (English — اختياري)</span>
                </div>
                <div>
                  <label className="block text-3xs font-bold text-[#5C5A55] mb-1">
                    Question in English
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={modalForm.questionEn || ''}
                    onChange={(e) => setModalForm({ ...modalForm, questionEn: e.target.value })}
                    placeholder="e.g. How can I become an active member?"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e5e0d6] focus:border-[#231f20] outline-none bg-white text-left font-sans"
                  />
                </div>
                <div>
                  <label className="block text-3xs font-bold text-[#5C5A55] mb-1">
                    Answer in English
                  </label>
                  <textarea
                    dir="ltr"
                    rows={2}
                    value={modalForm.answerEn || ''}
                    onChange={(e) => setModalForm({ ...modalForm, answerEn: e.target.value })}
                    placeholder="Detailed answer..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e5e0d6] focus:border-[#231f20] outline-none bg-white text-left font-sans leading-relaxed"
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E5E0D6]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#5C5A55] bg-[#FAF8F5] hover:bg-[#F4EFE6] transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#231f20] hover:bg-[#d2a82b] transition-all cursor-pointer shadow-xs"
                >
                  {editingItem ? 'تحديث في القائمة' : 'إضافة إلى القائمة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

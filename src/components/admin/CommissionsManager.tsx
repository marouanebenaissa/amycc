'use client'

import { useState } from 'react'
import type { CommissionsConfig, CommissionItemConfig } from '@/lib/settings'
import { saveCommissionsConfiguration } from '@/lib/actions/admin'

interface CommissionsManagerProps {
  initialConfig: CommissionsConfig
  defaultItems?: CommissionItemConfig[]
}

const COLOR_OPTIONS = [
  { label: 'طيني مراكشي (فنون وميدان)', border: 'border-[#c85a32]/30 hover:border-[#c85a32]', text: 'text-[#c85a32]', bg: 'bg-[#c85a32]/10' },
  { label: 'بترولي داكن (مسرح وتنظيم)', border: 'border-[#0d3b43]/30 hover:border-[#0d3b43]', text: 'text-[#0d3b43]', bg: 'bg-[#0d3b43]/10' },
  { label: 'ذهبي / خردلي (تراث وموسيقى)', border: 'border-[#d99b26]/30 hover:border-[#d99b26]', text: 'text-[#99620b]', bg: 'bg-[#d99b26]/10' },
  { label: 'أزرق تركوازي (إعلام وتوثيق)', border: 'border-[#1c6875]/30 hover:border-[#1c6875]', text: 'text-[#1c6875]', bg: 'bg-[#1c6875]/10' },
  { label: 'كحلي / رمادي (تكوين وريادة)', border: 'border-[#08242a]/30 hover:border-[#08242a]', text: 'text-[#08242a]', bg: 'bg-[#08242a]/10' },
  { label: 'زمردي / أخضر (تطوع وبيئة)', border: 'border-emerald-600/30 hover:border-emerald-600', text: 'text-emerald-700', bg: 'bg-emerald-50' },
]

export function CommissionsManager({ initialConfig, defaultItems = [] }: CommissionsManagerProps) {
  const [config, setConfig] = useState<CommissionsConfig>(initialConfig)
  const [saving, setSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showSectionSettings, setShowSectionSettings] = useState(false)

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<CommissionItemConfig | null>(null)
  const [modalTab, setModalTab] = useState<'info' | 'points'>('info')
  const [langTab, setLangTab] = useState<'ar' | 'fr' | 'en'>('ar')

  // Form State
  const [modalForm, setModalForm] = useState<Partial<CommissionItemConfig>>({
    id: '',
    titleAr: '',
    titleFr: '',
    titleEn: '',
    tagAr: '',
    tagFr: '',
    tagEn: '',
    descAr: '',
    descFr: '',
    descEn: '',
    icon: '🎨',
    borderClass: 'border-[#c85a32]/30 hover:border-[#c85a32]',
    accentColor: 'text-[#c85a32]',
    accentBg: 'bg-[#c85a32]/10',
    pointsAr: [],
    pointsFr: [],
    pointsEn: [],
    targetLocalesAr: 'فضاءات الثقافة ودور الشباب',
    targetLocalesFr: 'Centres Culturels & Jeunesse',
    targetLocalesEn: 'Community & Cultural Hubs',
    statusBadgeAr: 'تأطير نشط',
    statusBadgeFr: 'Actif',
    statusBadgeEn: 'Active',
    order: 1,
    enabled: true,
  })

  // Inputs for adding points in modal
  const [newPointAr, setNewPointAr] = useState('')
  const [newPointFr, setNewPointFr] = useState('')
  const [newPointEn, setNewPointEn] = useState('')

  // Open modal for editing
  function handleEdit(item: CommissionItemConfig) {
    setEditingItem(item)
    setModalForm({
      ...item,
      pointsAr: [...(item.pointsAr || [])],
      pointsFr: [...(item.pointsFr || [])],
      pointsEn: [...(item.pointsEn || [])],
    })
    setModalTab('info')
    setIsModalOpen(true)
  }

  // Open modal for adding new commission
  function handleAddNew() {
    setEditingItem(null)
    const newId = `commission-${Date.now()}`
    setModalForm({
      id: newId,
      titleAr: '',
      titleFr: '',
      titleEn: '',
      tagAr: 'محور فني وتأطيري',
      tagFr: 'Commission Thématique',
      tagEn: 'Specialized Commission',
      descAr: '',
      descFr: '',
      descEn: '',
      icon: '🎨',
      borderClass: 'border-[#c85a32]/30 hover:border-[#c85a32]',
      accentColor: 'text-[#c85a32]',
      accentBg: 'bg-[#c85a32]/10',
      pointsAr: [],
      pointsFr: [],
      pointsEn: [],
      targetLocalesAr: 'فضاءات الثقافة ودور الشباب',
      targetLocalesFr: 'Centres Culturels & Jeunesse',
      targetLocalesEn: 'Community & Cultural Hubs',
      statusBadgeAr: 'تأطير نشط',
      statusBadgeFr: 'Actif',
      statusBadgeEn: 'Active',
      order: config.items.length + 1,
      enabled: true,
    })
    setModalTab('info')
    setIsModalOpen(true)
  }

  // Save Modal Form
  function handleModalSave(e: React.FormEvent) {
    e.preventDefault()
    if (!modalForm.titleAr?.trim()) {
      alert('يرجى تحديد عنوان اللجنة بالعربية على الأقل.')
      return
    }

    const updatedItem: CommissionItemConfig = {
      id: modalForm.id || `commission-${Date.now()}`,
      titleAr: modalForm.titleAr || '',
      titleFr: modalForm.titleFr || '',
      titleEn: modalForm.titleEn || '',
      tagAr: modalForm.tagAr || '',
      tagFr: modalForm.tagFr || '',
      tagEn: modalForm.tagEn || '',
      descAr: modalForm.descAr || '',
      descFr: modalForm.descFr || '',
      descEn: modalForm.descEn || '',
      icon: modalForm.icon || '🎨',
      borderClass: modalForm.borderClass || 'border-[#c85a32]/30 hover:border-[#c85a32]',
      accentColor: modalForm.accentColor || 'text-[#c85a32]',
      accentBg: modalForm.accentBg || 'bg-[#c85a32]/10',
      pointsAr: modalForm.pointsAr || [],
      pointsFr: modalForm.pointsFr || [],
      pointsEn: modalForm.pointsEn || [],
      targetLocalesAr: modalForm.targetLocalesAr || 'فضاءات الثقافة ودور الشباب',
      targetLocalesFr: modalForm.targetLocalesFr || 'Centres Culturels & Jeunesse',
      targetLocalesEn: modalForm.targetLocalesEn || 'Community & Cultural Hubs',
      statusBadgeAr: modalForm.statusBadgeAr || 'تأطير نشط',
      statusBadgeFr: modalForm.statusBadgeFr || 'Actif',
      statusBadgeEn: modalForm.statusBadgeEn || 'Active',
      order: modalForm.order || config.items.length + 1,
      enabled: modalForm.enabled !== false,
    }

    if (editingItem) {
      setConfig((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.id === editingItem.id ? updatedItem : item
        ),
      }))
    } else {
      setConfig((prev) => ({
        ...prev,
        items: [...prev.items, updatedItem],
      }))
    }

    setIsModalOpen(false)
    setHasUnsavedChanges(true)
  }

  // Delete Commission
  function handleDelete(id: string) {
    if (!window.confirm('هل أنت متأكد من حذف هذه اللجنة؟ لن يتم تطبيق الحذف حتى تضغط «حفظ كافة التغييرات».')) {
      return
    }
    setConfig((prev) => ({
      ...prev,
      items: prev.items
        .filter((item) => item.id !== id)
        .map((item, idx) => ({ ...item, order: idx + 1 })),
    }))
    setHasUnsavedChanges(true)
  }

  // Reorder
  function moveItem(index: number, direction: 'up' | 'down') {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= config.items.length) return

    const newItems = [...config.items]
    const temp = newItems[index]
    newItems[index] = newItems[targetIndex]
    newItems[targetIndex] = temp

    const updated = newItems.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }))

    setConfig((prev) => ({
      ...prev,
      items: updated,
    }))
    setHasUnsavedChanges(true)
  }

  // Toggle Enabled
  function toggleEnabled(id: string) {
    setConfig((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      ),
    }))
    setHasUnsavedChanges(true)
  }

  // Reset to default
  function handleResetToDefaults() {
    if (!window.confirm('هل أنت متأكد من استعادة اللجان الافتراضية الست؟ سيتم استبدال أي تعديلات غير محفوظة.')) {
      return
    }
    setConfig((prev) => ({
      ...prev,
      items: defaultItems.length > 0 ? defaultItems : initialConfig.items,
    }))
    setHasUnsavedChanges(true)
  }

  // Save all to database
  async function handleSaveAll() {
    setSaving(true)
    setSuccessMessage(null)
    setErrorMessage(null)

    try {
      const res = await saveCommissionsConfiguration(config)
      if (!res.success) {
        throw new Error(res.error || 'تعذر حفظ بيانات اللجان')
      }

      setHasUnsavedChanges(false)
      setSuccessMessage('تم حفظ بيانات اللجان الوظيفية وفرق التأطير بنجاح في الموقع!')
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'حدث خطأ غير متوقع أثناء الحفظ')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-[#e5e0d6] shadow-2xs">
          <span className="text-3xs font-bold text-[#819598] block">إجمالي اللجان الميدانية</span>
          <span className="text-2xl font-black text-[#08242a]">{config.items.length}</span>
          <span className="text-3xs text-[#5f7174] block mt-0.5">محاور وظيفية متخصصة</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-emerald-500/30 shadow-2xs">
          <span className="text-3xs font-bold text-emerald-700 block">اللجان النشطة</span>
          <span className="text-2xl font-black text-emerald-600">
            {config.items.filter((item) => item.enabled).length}
          </span>
          <span className="text-3xs text-[#5f7174] block mt-0.5">ظاهرة في الصفحة العامة</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#c85a32]/30 shadow-2xs">
          <span className="text-3xs font-bold text-[#c85a32] block">إجمالي الأنشطة والتدخلات</span>
          <span className="text-2xl font-black text-[#c85a32]">
            {config.items.reduce((acc, item) => acc + (item.pointsAr?.length || 0), 0)}
          </span>
          <span className="text-3xs text-[#5f7174] block mt-0.5">محور عمل وتأطير ميداني</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#0d3b43]/30 shadow-2xs">
          <span className="text-3xs font-bold text-[#0d3b43] block">نطاق التدخل الميداني</span>
          <span className="text-lg font-black text-[#0d3b43] truncate block mt-1">دور الشباب • مراكز</span>
          <span className="text-3xs text-[#5f7174] block mt-0.5">فضاءات ثقافية بالمغرب</span>
        </div>
      </div>

      {/* Header Actions Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-[#e5e0d6] shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSectionSettings(!showSectionSettings)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
              showSectionSettings
                ? 'bg-[#0d3b43] text-white border-[#0d3b43]'
                : 'bg-[#faf7f2] hover:bg-[#eae4d9] text-[#08242a] border-[#e5e0d6]'
            }`}
          >
            ⚙️ عنوان ومقدمة القسم العام
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddNew}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#c85a32] hover:bg-[#a64522] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <span>+</span>
            <span>إضافة لجنة جديدة</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={saving}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
              hasUnsavedChanges
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white animate-pulse'
                : 'bg-[#0d3b43] hover:bg-[#14505b] text-white'
            }`}
          >
            <span>💾</span>
            <span>{saving ? 'جارٍ الحفظ...' : 'حفظ التغييرات'}</span>
            {hasUnsavedChanges && (
              <span className="w-2 h-2 rounded-full bg-amber-300 animate-ping" />
            )}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between shadow-2xs">
          <span>✓ {successMessage}</span>
          <button onClick={() => setSuccessMessage(null)} className="text-emerald-600 hover:text-emerald-900">✕</button>
        </div>
      )}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center justify-between shadow-2xs">
          <span>✕ {errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="text-red-600 hover:text-red-900">✕</button>
        </div>
      )}

      {/* Unsaved Changes Banner */}
      {hasUnsavedChanges && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>لديك تعديلات غير محفوظة على اللجان الوظيفية! انقر على زر «حفظ التغييرات» لتثبيتها في الموقع العام.</span>
          </div>
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-3xs font-bold"
          >
            حفظ الآن
          </button>
        </div>
      )}

      {/* Section Header Settings Drawer */}
      {showSectionSettings && (
        <div className="p-5 rounded-2xl bg-white border border-[#0d3b43]/30 shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-[#f0ebe1] pb-3">
            <div>
              <h3 className="text-sm font-black text-[#08242a]">
                تعديل نصوص ترويسة قسم اللجان الوظيفية في صفحة الموقع
              </h3>
              <p className="text-3xs text-[#819598]">
                العنوان الرئيسي، الشارة العلوية، والفقرة التمهيدية المعروضة فوق بطاقات اللجان
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowSectionSettings(false)}
              className="text-xs text-[#819598] hover:text-[#08242a]"
            >
              ✕ إغلاق
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#08242a] mb-1">
                الشارة العلوية (بالعربية)
              </label>
              <input
                type="text"
                value={config.sectionTagAr || ''}
                onChange={(e) => {
                  setConfig((prev) => ({ ...prev, sectionTagAr: e.target.value }))
                  setHasUnsavedChanges(true)
                }}
                className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] bg-[#faf7f2] text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#08242a] mb-1">
                العنوان الرئيسي للقسم (بالعربية)
              </label>
              <input
                type="text"
                value={config.sectionTitleAr || ''}
                onChange={(e) => {
                  setConfig((prev) => ({ ...prev, sectionTitleAr: e.target.value }))
                  setHasUnsavedChanges(true)
                }}
                className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] bg-[#faf7f2] text-xs font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#08242a] mb-1">
              الفقرة التعريفية للقسم (بالعربية)
            </label>
            <textarea
              rows={2}
              value={config.sectionDescAr || ''}
              onChange={(e) => {
                setConfig((prev) => ({ ...prev, sectionDescAr: e.target.value }))
                setHasUnsavedChanges(true)
              }}
              className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] bg-[#faf7f2] text-xs"
            />
          </div>
        </div>
      )}

      {/* Commissions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {config.items.map((item, index) => (
          <div
            key={item.id}
            className={`p-5 rounded-2xl bg-white border ${
              item.enabled ? item.borderClass : 'border-gray-200 opacity-60'
            } shadow-2xs hover:shadow-subtle transition-all flex flex-col justify-between group relative`}
          >
            <div className="space-y-4">
              {/* Header: Icon & Category Tag + Reorder */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-12 h-12 rounded-2xl bg-[#faf7f2] border border-[#e5e0d6] flex items-center justify-center text-2xl shadow-2xs">
                    {item.icon}
                  </span>
                  <div>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-3xs font-bold ${item.accentBg} ${item.accentColor}`}>
                      {item.tagAr}
                    </span>
                    <h3 className="text-sm font-black text-[#08242a] mt-1 leading-snug">
                      {item.titleAr}
                    </h3>
                  </div>
                </div>

                {/* Reorder Buttons */}
                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveItem(index, 'up')}
                    className="w-6 h-6 rounded-md bg-[#faf7f2] hover:bg-[#eae4d9] text-[#08242a] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-3xs font-bold transition-colors"
                    title="تحريك لأعلى"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    disabled={index === config.items.length - 1}
                    onClick={() => moveItem(index, 'down')}
                    className="w-6 h-6 rounded-md bg-[#faf7f2] hover:bg-[#eae4d9] text-[#08242a] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-3xs font-bold transition-colors"
                    title="تحريك لأسفل"
                  >
                    ▼
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-[#5f7174] line-clamp-2 leading-relaxed">
                {item.descAr}
              </p>

              {/* Points Preview */}
              {item.pointsAr && item.pointsAr.length > 0 && (
                <div className="space-y-1 pt-2 border-t border-[#f0ebe1]">
                  <span className="text-3xs font-bold text-[#819598] block">أبرز الأنشطة الميدانية:</span>
                  <ul className="text-3xs text-[#5f7174] space-y-1">
                    {item.pointsAr.slice(0, 2).map((point, pIdx) => (
                      <li key={pIdx} className="truncate flex items-center gap-1.5">
                        <span className={`${item.accentColor} font-bold`}>✦</span>
                        <span>{point}</span>
                      </li>
                    ))}
                    {item.pointsAr.length > 2 && (
                      <li className="text-3xs text-[#819598] italic">
                        +{item.pointsAr.length - 2} أنشطة إضافية...
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="pt-3 mt-4 border-t border-[#f0ebe1] flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleEdit(item)}
                  className="px-2.5 py-1 rounded-lg bg-[#faf7f2] hover:bg-[#0d3b43] hover:text-white text-[#08242a] text-3xs font-bold transition-all cursor-pointer"
                >
                  ✏️ تعديل
                </button>
                <button
                  type="button"
                  onClick={() => toggleEnabled(item.id)}
                  className={`px-2 py-1 rounded-lg text-3xs font-bold transition-all ${
                    item.enabled
                      ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {item.enabled ? 'مفعّلة' : 'معطّلة'}
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                className="px-2 py-1 rounded-lg text-red-600 hover:bg-red-50 text-3xs font-bold transition-colors cursor-pointer"
                title="حذف اللجنة"
              >
                🗑️ حذف
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Tools */}
      <div className="flex items-center justify-between p-4 bg-[#faf7f2] rounded-2xl border border-[#e5e0d6] text-xs">
        <span className="text-3xs text-[#819598]">
          التعديلات المحفوظة هنا تنعكس فوراً في قسم اللجان الميدانية بصفحة فريق العمل.
        </span>
        <button
          type="button"
          onClick={handleResetToDefaults}
          className="text-3xs font-bold text-[#819598] hover:text-[#c85a32] underline"
        >
          استعادة اللجان الافتراضية الست
        </button>
      </div>

      {/* ============================================================
          ADD / EDIT COMMISSION MODAL
          ============================================================ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#e5e0d6]">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-[#e5e0d6] px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{editingItem ? '✏️' : '➕'}</span>
                <div>
                  <h2 className="text-base font-black text-[#08242a]">
                    {editingItem ? `تعديل: ${editingItem.titleAr}` : 'إضافة لجنة وظيفية جديدة'}
                  </h2>
                  <p className="text-3xs text-[#5f7174]">
                    حدد الاسم، الوسم، والأنشطة والتدخلات الميدانية
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#faf7f2] hover:bg-[#eae4d9] text-[#08242a] flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="px-6 pt-4 pb-2 border-b border-[#f0ebe1] flex items-center gap-2">
              <button
                type="button"
                onClick={() => setModalTab('info')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  modalTab === 'info'
                    ? 'bg-[#0d3b43] text-white shadow-xs'
                    : 'bg-[#faf7f2] text-[#445457] hover:bg-[#eae4d9]'
                }`}
              >
                1. بيانات وهوية اللجنة
              </button>
              <button
                type="button"
                onClick={() => setModalTab('points')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  modalTab === 'points'
                    ? 'bg-[#0d3b43] text-white shadow-xs'
                    : 'bg-[#faf7f2] text-[#445457] hover:bg-[#eae4d9]'
                }`}
              >
                2. التدخلات والأنشطة الميدانية ({modalForm.pointsAr?.length || 0})
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleModalSave} className="p-6 space-y-5">
              {/* TAB 1: BASIC INFO */}
              {modalTab === 'info' && (
                <div className="space-y-4">
                  {/* Language Tab */}
                  <div className="flex items-center justify-between pb-2 border-b border-[#f0ebe1]">
                    <span className="text-3xs font-bold text-[#819598]">لغة الإدخال الحالية:</span>
                    <div className="flex items-center gap-1">
                      {(['ar', 'fr', 'en'] as const).map((lng) => (
                        <button
                          key={lng}
                          type="button"
                          onClick={() => setLangTab(lng)}
                          className={`px-2.5 py-1 rounded-lg text-3xs font-bold uppercase transition-all ${
                            langTab === lng
                              ? 'bg-[#c85a32] text-white'
                              : 'bg-[#faf7f2] text-[#5f7174] hover:bg-[#eae4d9]'
                          }`}
                        >
                          {lng}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Trilingual inputs */}
                  {langTab === 'ar' && (
                    <div className="space-y-3 p-4 rounded-2xl bg-[#faf7f2] border border-[#e5e0d6]">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-[#08242a] mb-1">
                            عنوان اللجنة (بالعربية) *
                          </label>
                          <input
                            type="text"
                            required
                            value={modalForm.titleAr || ''}
                            onChange={(e) => setModalForm((prev) => ({ ...prev, titleAr: e.target.value }))}
                            placeholder="مثال: لجنة الفنون البصرية والتشكيلية"
                            className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] bg-white text-xs text-[#08242a] focus:outline-none focus:border-[#0d3b43]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#08242a] mb-1">
                            وسم التصنيف (بالعربية)
                          </label>
                          <input
                            type="text"
                            value={modalForm.tagAr || ''}
                            onChange={(e) => setModalForm((prev) => ({ ...prev, tagAr: e.target.value }))}
                            placeholder="مثال: محترفات إبداعية"
                            className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] bg-white text-xs text-[#08242a] focus:outline-none focus:border-[#0d3b43]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#08242a] mb-1">
                          وصف دور وأهداف اللجنة (بالعربية)
                        </label>
                        <textarea
                          rows={3}
                          value={modalForm.descAr || ''}
                          onChange={(e) => setModalForm((prev) => ({ ...prev, descAr: e.target.value }))}
                          placeholder="تأطير ورشات الرسم التشكيلي، الصباغة المائية والزيتية..."
                          className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] bg-white text-xs text-[#08242a] focus:outline-none focus:border-[#0d3b43]"
                        />
                      </div>
                    </div>
                  )}

                  {langTab === 'fr' && (
                    <div className="space-y-3 p-4 rounded-2xl bg-[#faf7f2] border border-[#e5e0d6]">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-[#08242a] mb-1">
                            Nom de la Commission (FR)
                          </label>
                          <input
                            type="text"
                            value={modalForm.titleFr || ''}
                            onChange={(e) => setModalForm((prev) => ({ ...prev, titleFr: e.target.value }))}
                            placeholder="Ex: Commission Arts Visuels"
                            className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] bg-white text-xs text-[#08242a] focus:outline-none focus:border-[#0d3b43]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#08242a] mb-1">
                            Tag / Catégorie (FR)
                          </label>
                          <input
                            type="text"
                            value={modalForm.tagFr || ''}
                            onChange={(e) => setModalForm((prev) => ({ ...prev, tagFr: e.target.value }))}
                            placeholder="Ex: Ateliers Créatifs"
                            className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] bg-white text-xs text-[#08242a] focus:outline-none focus:border-[#0d3b43]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#08242a] mb-1">
                          Description (FR)
                        </label>
                        <textarea
                          rows={3}
                          value={modalForm.descFr || ''}
                          onChange={(e) => setModalForm((prev) => ({ ...prev, descFr: e.target.value }))}
                          placeholder="Description des ateliers et objectifs..."
                          className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] bg-white text-xs text-[#08242a] focus:outline-none focus:border-[#0d3b43]"
                        />
                      </div>
                    </div>
                  )}

                  {langTab === 'en' && (
                    <div className="space-y-3 p-4 rounded-2xl bg-[#faf7f2] border border-[#e5e0d6]">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-[#08242a] mb-1">
                            Commission Title (EN)
                          </label>
                          <input
                            type="text"
                            value={modalForm.titleEn || ''}
                            onChange={(e) => setModalForm((prev) => ({ ...prev, titleEn: e.target.value }))}
                            placeholder="Ex: Visual Arts Committee"
                            className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] bg-white text-xs text-[#08242a] focus:outline-none focus:border-[#0d3b43]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#08242a] mb-1">
                            Tag (EN)
                          </label>
                          <input
                            type="text"
                            value={modalForm.tagEn || ''}
                            onChange={(e) => setModalForm((prev) => ({ ...prev, tagEn: e.target.value }))}
                            placeholder="Ex: Creative Labs"
                            className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] bg-white text-xs text-[#08242a] focus:outline-none focus:border-[#0d3b43]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#08242a] mb-1">
                          Description (EN)
                        </label>
                        <textarea
                          rows={3}
                          value={modalForm.descEn || ''}
                          onChange={(e) => setModalForm((prev) => ({ ...prev, descEn: e.target.value }))}
                          placeholder="Brief overview of the commission's activities..."
                          className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] bg-white text-xs text-[#08242a] focus:outline-none focus:border-[#0d3b43]"
                        />
                      </div>
                    </div>
                  )}

                  {/* Icon & Theme Selector */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-[#08242a] mb-1">
                        رمز الأيقونة (إيموجي)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={modalForm.icon || '🎨'}
                          onChange={(e) => setModalForm((prev) => ({ ...prev, icon: e.target.value }))}
                          className="w-16 text-center text-xl py-1.5 rounded-xl border border-[#e5e0d6] bg-white focus:outline-none"
                        />
                        <div className="flex flex-wrap gap-1">
                          {['🎨', '🎭', '🎵', '📸', '🚀', '📚', '🎪', '🎻', '🎬', '🌟'].map((ico) => (
                            <button
                              key={ico}
                              type="button"
                              onClick={() => setModalForm((prev) => ({ ...prev, icon: ico }))}
                              className="w-7 h-7 rounded-lg bg-[#faf7f2] hover:bg-[#eae4d9] flex items-center justify-center text-sm"
                            >
                              {ico}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#08242a] mb-1">
                        نمط الألوان والحدود
                      </label>
                      <select
                        value={modalForm.borderClass}
                        onChange={(e) => {
                          const opt = COLOR_OPTIONS.find((o) => o.border === e.target.value)
                          setModalForm((prev) => ({
                            ...prev,
                            borderClass: e.target.value,
                            accentColor: opt?.text || 'text-[#c85a32]',
                            accentBg: opt?.bg || 'bg-[#c85a32]/10',
                          }))
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] bg-white text-xs text-[#08242a] focus:outline-none"
                      >
                        {COLOR_OPTIONS.map((opt) => (
                          <option key={opt.border} value={opt.border}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: INTERVENTIONS / POINTS */}
              {modalTab === 'points' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-[#faf7f2] border border-[#e5e0d6] space-y-4">
                    <span className="text-xs font-bold text-[#08242a] block">
                      أبرز التدخلات والأنشطة الميدانية للجنة
                    </span>

                    {/* Arabic Points */}
                    <div className="space-y-2">
                      <label className="block text-3xs font-bold text-[#0d3b43]">
                        الأنشطة بالعربية ({modalForm.pointsAr?.length || 0})
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newPointAr}
                          onChange={(e) => setNewPointAr(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              if (newPointAr.trim()) {
                                setModalForm((prev) => ({
                                  ...prev,
                                  pointsAr: [...(prev.pointsAr || []), newPointAr.trim()],
                                }))
                                setNewPointAr('')
                              }
                            }
                          }}
                          placeholder="أدخل نشاطاً ميدانياً واضغط إضافة..."
                          className="flex-1 px-3 py-1.5 rounded-xl border border-[#e5e0d6] bg-white text-xs focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (newPointAr.trim()) {
                              setModalForm((prev) => ({
                                ...prev,
                                pointsAr: [...(prev.pointsAr || []), newPointAr.trim()],
                              }))
                              setNewPointAr('')
                            }
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#0d3b43] text-white text-xs font-bold"
                        >
                          إضافة
                        </button>
                      </div>

                      <div className="space-y-1.5 max-h-36 overflow-y-auto">
                        {modalForm.pointsAr?.map((pt, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-[#e5e0d6] text-xs"
                          >
                            <span className="leading-relaxed">✦ {pt}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setModalForm((prev) => ({
                                  ...prev,
                                  pointsAr: prev.pointsAr?.filter((_, i) => i !== idx),
                                }))
                              }}
                              className="text-red-500 hover:text-red-700 text-3xs font-bold px-1.5"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* French Points */}
                    <div className="space-y-2 pt-2 border-t border-[#e5e0d6]">
                      <label className="block text-3xs font-bold text-[#c85a32]">
                        Points en Français ({modalForm.pointsFr?.length || 0})
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newPointFr}
                          onChange={(e) => setNewPointFr(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              if (newPointFr.trim()) {
                                setModalForm((prev) => ({
                                  ...prev,
                                  pointsFr: [...(prev.pointsFr || []), newPointFr.trim()],
                                }))
                                setNewPointFr('')
                              }
                            }
                          }}
                          placeholder="Ajouter une action en français..."
                          className="flex-1 px-3 py-1.5 rounded-xl border border-[#e5e0d6] bg-white text-xs focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (newPointFr.trim()) {
                              setModalForm((prev) => ({
                                ...prev,
                                pointsFr: [...(prev.pointsFr || []), newPointFr.trim()],
                              }))
                              setNewPointFr('')
                            }
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#c85a32] text-white text-xs font-bold"
                        >
                          Ajouter
                        </button>
                      </div>

                      <div className="space-y-1.5 max-h-28 overflow-y-auto">
                        {modalForm.pointsFr?.map((pt, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-[#e5e0d6] text-xs"
                          >
                            <span className="leading-relaxed">✦ {pt}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setModalForm((prev) => ({
                                  ...prev,
                                  pointsFr: prev.pointsFr?.filter((_, i) => i !== idx),
                                }))
                              }}
                              className="text-red-500 hover:text-red-700 text-3xs font-bold px-1.5"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* English Points */}
                    <div className="space-y-2 pt-2 border-t border-[#e5e0d6]">
                      <label className="block text-3xs font-bold text-[#1c6875]">
                        Interventions in English ({modalForm.pointsEn?.length || 0})
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newPointEn}
                          onChange={(e) => setNewPointEn(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              if (newPointEn.trim()) {
                                setModalForm((prev) => ({
                                  ...prev,
                                  pointsEn: [...(prev.pointsEn || []), newPointEn.trim()],
                                }))
                                setNewPointEn('')
                              }
                            }
                          }}
                          placeholder="Add an intervention in English..."
                          className="flex-1 px-3 py-1.5 rounded-xl border border-[#e5e0d6] bg-white text-xs focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (newPointEn.trim()) {
                              setModalForm((prev) => ({
                                ...prev,
                                pointsEn: [...(prev.pointsEn || []), newPointEn.trim()],
                              }))
                              setNewPointEn('')
                            }
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#1c6875] text-white text-xs font-bold"
                        >
                          Add
                        </button>
                      </div>

                      <div className="space-y-1.5 max-h-28 overflow-y-auto">
                        {modalForm.pointsEn?.map((pt, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-[#e5e0d6] text-xs"
                          >
                            <span className="leading-relaxed">✦ {pt}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setModalForm((prev) => ({
                                  ...prev,
                                  pointsEn: prev.pointsEn?.filter((_, i) => i !== idx),
                                }))
                              }}
                              className="text-red-500 hover:text-red-700 text-3xs font-bold px-1.5"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Status Active Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#faf7f2] border border-[#e5e0d6]">
                <div>
                  <span className="block text-xs font-bold text-[#08242a]">تفعيل ظهور اللجنة في الموقع</span>
                  <span className="block text-3xs text-[#819598]">عند التعطيل، تبقى اللجنة محفوظة في لوحة التحكم وتختفي من الصفحة العامة.</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={modalForm.enabled !== false}
                    onChange={(e) => setModalForm((prev) => ({ ...prev, enabled: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-[#e5e0d6] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#faf7f2] hover:bg-[#eae4d9] text-[#08242a] text-xs font-bold transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0d3b43] hover:bg-[#14505b] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  {editingItem ? 'تحديث بيانات اللجنة' : 'إضافة اللجنة للقائمة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

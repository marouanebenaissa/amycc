'use client'

import { useState, useRef } from 'react'
import type { TeamConfig, TeamMemberConfig } from '@/lib/settings'
import { saveTeamConfiguration } from '@/lib/actions/admin'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'

interface TeamManagerProps {
  initialConfig: TeamConfig
  defaultMembers?: TeamMemberConfig[]
}

const CATEGORIES = [
  { key: 'all', labelAr: 'الكل (جميع الأعضاء)', labelEn: 'All' },
  { key: 'executive', labelAr: 'المكتب التنفيذي (الأعضاء الأساسيون)', labelEn: 'Executive Board' },
  { key: 'committee', labelAr: 'اللجان الوظيفية وفرق التأطير', labelEn: 'Committees & Coordinators' },
  { key: 'advisor', labelAr: 'الهيئة الاستشارية والخبراء', labelEn: 'Advisors & Mentors' },
] as const

const COLOR_OPTIONS = [
  { label: 'بترولي (رئيسي)', border: 'border-[#0d3b43]/30 hover:border-[#0d3b43]', badge: 'bg-[#0d3b43]/10 text-[#0d3b43]' },
  { label: 'طيني مراكشي', border: 'border-[#c85a32]/30 hover:border-[#c85a32]', badge: 'bg-[#c85a32]/10 text-[#c85a32]' },
  { label: 'ذهبي / خردلي', border: 'border-[#d99b26]/30 hover:border-[#d99b26]', badge: 'bg-[#d99b26]/10 text-[#99620b]' },
  { label: 'أزرق داكن', border: 'border-[#1c6875]/30 hover:border-[#1c6875]', badge: 'bg-[#1c6875]/10 text-[#1c6875]' },
  { label: 'زمردي / زيتوني', border: 'border-emerald-600/30 hover:border-emerald-600', badge: 'bg-emerald-50 text-emerald-800' },
  { label: 'نيلي / كحلي', border: 'border-[#08242a]/30 hover:border-[#08242a]', badge: 'bg-[#08242a]/10 text-[#08242a]' },
]

export function TeamManager({ initialConfig, defaultMembers = [] }: TeamManagerProps) {
  const [config, setConfig] = useState<TeamConfig>(initialConfig)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [saving, setSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMemberConfig | null>(null)
  const [modalTab, setModalTab] = useState<'info' | 'photo' | 'duties'>('info')
  const [langTab, setLangTab] = useState<'ar' | 'fr' | 'en'>('ar')

  // Form State
  const [modalForm, setModalForm] = useState<Partial<TeamMemberConfig>>({
    id: '',
    nameAr: '',
    nameFr: '',
    nameEn: '',
    roleAr: '',
    roleFr: '',
    roleEn: '',
    category: 'executive',
    titleStatusAr: '',
    titleStatusFr: '',
    titleStatusEn: '',
    badgeStatusAr: 'عضوية معتمدة بالنظام الأساسي',
    badgeStatusFr: 'Mandat Statutaire',
    badgeStatusEn: 'Statutory Mandate',
    descAr: '',
    descFr: '',
    descEn: '',
    dutiesAr: [],
    dutiesFr: [],
    dutiesEn: [],
    photoUrl: '',
    icon: '👤',
    colorClass: 'border-[#0d3b43]/30 hover:border-[#0d3b43]',
    accentBg: 'bg-[#0d3b43]/10 text-[#0d3b43]',
    order: 1,
    enabled: true,
  })

  // Inputs for adding duties in modal
  const [newDutyAr, setNewDutyAr] = useState('')
  const [newDutyFr, setNewDutyFr] = useState('')
  const [newDutyEn, setNewDutyEn] = useState('')

  // Uploading Photo State
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Direct card upload reference
  const cardFileInputRef = useRef<HTMLInputElement>(null)
  const [activeUploadMemberId, setActiveUploadMemberId] = useState<string | null>(null)

  // Open modal for editing
  function handleEdit(member: TeamMemberConfig) {
    setEditingMember(member)
    setModalForm({
      ...member,
      dutiesAr: [...(member.dutiesAr || [])],
      dutiesFr: [...(member.dutiesFr || [])],
      dutiesEn: [...(member.dutiesEn || [])],
    })
    setModalTab('info')
    setUploadError(null)
    setIsModalOpen(true)
  }

  // Open modal for adding new member
  function handleAddNew(defaultCategory: 'executive' | 'committee' | 'advisor' = 'executive') {
    setEditingMember(null)
    const newId = `member-${Date.now()}`
    setModalForm({
      id: newId,
      nameAr: '',
      nameFr: '',
      nameEn: '',
      roleAr: '',
      roleFr: '',
      roleEn: '',
      category: defaultCategory,
      titleStatusAr: '',
      titleStatusFr: '',
      titleStatusEn: '',
      badgeStatusAr: defaultCategory === 'executive' ? 'عضوية معتمدة بالنظام الأساسي' : 'فريق التأطير والتنسيق',
      badgeStatusFr: defaultCategory === 'executive' ? 'Mandat Statutaire' : 'Pôle Coordination',
      badgeStatusEn: defaultCategory === 'executive' ? 'Statutory Mandate' : 'Coordination Team',
      descAr: '',
      descFr: '',
      descEn: '',
      dutiesAr: [],
      dutiesFr: [],
      dutiesEn: [],
      photoUrl: '',
      icon: '👤',
      colorClass: 'border-[#0d3b43]/30 hover:border-[#0d3b43]',
      accentBg: 'bg-[#0d3b43]/10 text-[#0d3b43]',
      order: config.members.length + 1,
      enabled: true,
    })
    setModalTab('info')
    setUploadError(null)
    setIsModalOpen(true)
  }

  // Handle Photo Upload inside Modal
  async function handlePhotoFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingPhoto(true)
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'فشل رفع الصورة. يرجى التأكد من الحجم والصيغة.')
      }

      setModalForm((prev) => ({
        ...prev,
        photoUrl: data.url,
      }))
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'حدث خطأ أثناء رفع الصورة')
    } finally {
      setUploadingPhoto(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // Handle Quick Photo Upload directly from card
  async function handleQuickUpload(memberId: string, file: File) {
    setActiveUploadMemberId(memberId)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'فشل رفع الصورة')
      }

      setConfig((prev) => ({
        ...prev,
        members: prev.members.map((m) =>
          m.id === memberId ? { ...m, photoUrl: data.url } : m
        ),
      }))
      setHasUnsavedChanges(true)
      setSuccessMessage('تم رفع وتحديث صورة العضو مباشرة!')
      setTimeout(() => setSuccessMessage(null), 3500)
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'تعذر رفع الصورة')
      setTimeout(() => setErrorMessage(null), 4000)
    } finally {
      setActiveUploadMemberId(null)
      if (cardFileInputRef.current) cardFileInputRef.current.value = ''
    }
  }

  // Remove Photo from modal form
  function handleRemovePhoto() {
    setModalForm((prev) => ({
      ...prev,
      photoUrl: '',
    }))
  }

  // Save Modal Form
  function handleModalSave(e: React.FormEvent) {
    e.preventDefault()
    if (!modalForm.roleAr?.trim()) {
      alert('يرجى تحديد المهمة أو المنصب بالعربية على الأقل.')
      return
    }

    const updatedMember: TeamMemberConfig = {
      id: modalForm.id || `member-${Date.now()}`,
      nameAr: modalForm.nameAr || '',
      nameFr: modalForm.nameFr || '',
      nameEn: modalForm.nameEn || '',
      roleAr: modalForm.roleAr || '',
      roleFr: modalForm.roleFr || '',
      roleEn: modalForm.roleEn || '',
      category: (modalForm.category as 'executive' | 'committee' | 'advisor') || 'executive',
      titleStatusAr: modalForm.titleStatusAr || '',
      titleStatusFr: modalForm.titleStatusFr || '',
      titleStatusEn: modalForm.titleStatusEn || '',
      badgeStatusAr: modalForm.badgeStatusAr || '',
      badgeStatusFr: modalForm.badgeStatusFr || '',
      badgeStatusEn: modalForm.badgeStatusEn || '',
      descAr: modalForm.descAr || '',
      descFr: modalForm.descFr || '',
      descEn: modalForm.descEn || '',
      dutiesAr: modalForm.dutiesAr || [],
      dutiesFr: modalForm.dutiesFr || [],
      dutiesEn: modalForm.dutiesEn || [],
      photoUrl: modalForm.photoUrl || '',
      icon: modalForm.icon || '👤',
      colorClass: modalForm.colorClass || 'border-[#0d3b43]/30 hover:border-[#0d3b43]',
      accentBg: modalForm.accentBg || 'bg-[#0d3b43]/10 text-[#0d3b43]',
      order: modalForm.order || config.members.length + 1,
      enabled: modalForm.enabled !== false,
    }

    if (editingMember) {
      setConfig((prev) => ({
        ...prev,
        members: prev.members.map((m) =>
          m.id === editingMember.id ? updatedMember : m
        ),
      }))
    } else {
      setConfig((prev) => ({
        ...prev,
        members: [...prev.members, updatedMember],
      }))
    }

    setIsModalOpen(false)
    setHasUnsavedChanges(true)
  }

  // Delete Member
  function handleDelete(id: string) {
    if (!window.confirm('هل أنت متأكد من حذف هذا العضو من الهيكلة؟ لن يتم تطبيق الحذف حتى تضغط "حفظ كافة التغييرات".')) {
      return
    }
    setConfig((prev) => ({
      ...prev,
      members: prev.members
        .filter((m) => m.id !== id)
        .map((m, idx) => ({ ...m, order: idx + 1 })),
    }))
    setHasUnsavedChanges(true)
  }

  // Reorder
  function moveMember(index: number, direction: 'up' | 'down') {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= config.members.length) return

    const newMembers = [...config.members]
    const temp = newMembers[index]
    newMembers[index] = newMembers[targetIndex]
    newMembers[targetIndex] = temp

    // Update order numbers
    const updated = newMembers.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }))

    setConfig((prev) => ({
      ...prev,
      members: updated,
    }))
    setHasUnsavedChanges(true)
  }

  // Toggle Enabled
  function toggleEnabled(id: string) {
    setConfig((prev) => ({
      ...prev,
      members: prev.members.map((m) =>
        m.id === id ? { ...m, enabled: !m.enabled } : m
      ),
    }))
    setHasUnsavedChanges(true)
  }

  // Reset to default
  function handleResetToDefaults() {
    if (!window.confirm('هل أنت متأكد من استعادة أعضاء الهيكلة الافتراضية؟ سيتم استبدال التعديلات غير المحفوظة.')) {
      return
    }
    setConfig({
      members: defaultMembers.length > 0 ? defaultMembers : initialConfig.members,
    })
    setHasUnsavedChanges(true)
  }

  // Save all to database
  async function handleSaveAll() {
    setSaving(true)
    setSuccessMessage(null)
    setErrorMessage(null)

    try {
      const res = await saveTeamConfiguration(config)
      if (!res.success) {
        throw new Error(res.error || 'تعذر حفظ بيانات الفريق')
      }

      setHasUnsavedChanges(false)
      setSuccessMessage('تم حفظ بيانات الفريق وهيكلة الأعضاء وصورهم بنجاح في المنصة!')
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'حدث خطأ غير متوقع أثناء الحفظ')
    } finally {
      setSaving(false)
    }
  }

  // Filtered members by category
  const filteredMembers = config.members.filter((m) => {
    if (selectedCategory === 'all') return true
    return m.category === selectedCategory
  })

  // Quick stats
  const totalCount = config.members.length
  const executiveCount = config.members.filter((m) => m.category === 'executive').length
  const committeeCount = config.members.filter((m) => m.category === 'committee').length
  const advisorCount = config.members.filter((m) => m.category === 'advisor').length
  const withPhotosCount = config.members.filter((m) => Boolean(m.photoUrl)).length

  return (
    <div className="space-y-6">
      {/* Hidden file input for quick card upload */}
      <input
        ref={cardFileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file && activeUploadMemberId) {
            handleQuickUpload(activeUploadMemberId, file)
          }
        }}
      />

      {/* Top Banner & Quick Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-[#e5e0d6] shadow-2xs">
          <span className="text-3xs font-bold text-[#819598] block">إجمالي الأعضاء</span>
          <span className="text-2xl font-black text-[#08242a]">{totalCount}</span>
          <span className="text-3xs text-[#5f7174] block mt-0.5">مسجل في الهيكلة</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#0d3b43]/30 shadow-2xs">
          <span className="text-3xs font-bold text-[#0d3b43] block">المكتب التنفيذي</span>
          <span className="text-2xl font-black text-[#0d3b43]">{executiveCount}</span>
          <span className="text-3xs text-[#5f7174] block mt-0.5">مناصب أساسية</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#c85a32]/30 shadow-2xs">
          <span className="text-3xs font-bold text-[#c85a32] block">اللجان والتأطير</span>
          <span className="text-2xl font-black text-[#c85a32]">{committeeCount}</span>
          <span className="text-3xs text-[#5f7174] block mt-0.5">منسقون ومؤطرون</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#d99b26]/30 shadow-2xs">
          <span className="text-3xs font-bold text-[#99620b] block">الهيئة الاستشارية</span>
          <span className="text-2xl font-black text-[#d99b26]">{advisorCount}</span>
          <span className="text-3xs text-[#5f7174] block mt-0.5">خبراء ومرشدون</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-emerald-500/30 shadow-2xs col-span-2 sm:col-span-1">
          <span className="text-3xs font-bold text-emerald-700 block">الصور المرفوعة</span>
          <span className="text-2xl font-black text-emerald-600">{withPhotosCount} / {totalCount}</span>
          <span className="text-3xs text-[#5f7174] block mt-0.5">صورة شخصية معتمدة</span>
        </div>
      </div>

      {/* Action Header Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-[#e5e0d6] shadow-2xs">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat.key
                  ? 'bg-[#0d3b43] text-white shadow-xs'
                  : 'bg-[#faf7f2] text-[#445457] hover:bg-[#eae4d9]'
              }`}
            >
              {cat.labelAr}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleAddNew(selectedCategory === 'committee' ? 'committee' : selectedCategory === 'advisor' ? 'advisor' : 'executive')}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#c85a32] hover:bg-[#a64522] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <span>+</span>
            <span>إضافة عضو جديد</span>
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
            <span>لديك تعديلات غير محفوظة على هيكلة الفريق أو الصور! انقر على زر «حفظ التغييرات» لتثبيتها في الواجهة العامة.</span>
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

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMembers.map((member) => {
          const globalIndex = config.members.findIndex((m) => m.id === member.id)
          const isUploadingThisCard = activeUploadMemberId === member.id

          return (
            <div
              key={member.id}
              className={`p-5 rounded-2xl bg-white border ${
                member.enabled ? member.colorClass : 'border-gray-200 opacity-60'
              } shadow-2xs hover:shadow-subtle transition-all flex flex-col justify-between group relative`}
            >
              <div className="space-y-4">
                {/* Header: Photo / Avatar + Quick Upload + Actions */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Member Photo or Icon */}
                    <div className="relative group/avatar shrink-0">
                      {member.photoUrl ? (
                        <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-xs ring-2 ring-[#0d3b43]/20 relative bg-neutral-100">
                          <ImageWithFallback
                            src={member.photoUrl}
                            alt={member.nameAr || member.roleAr}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-[#faf7f2] border border-[#e5e0d6] flex items-center justify-center text-3xl shadow-2xs">
                          {member.icon || '👤'}
                        </div>
                      )}

                      {/* Quick upload overlay button */}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveUploadMemberId(member.id)
                          cardFileInputRef.current?.click()
                        }}
                        disabled={isUploadingThisCard}
                        title="رفع أو تغيير صورة العضو"
                        className="absolute -bottom-1 -end-1 w-6 h-6 rounded-full bg-[#0d3b43] hover:bg-[#c85a32] text-white flex items-center justify-center text-3xs shadow-xs transition-colors cursor-pointer"
                      >
                        {isUploadingThisCard ? '⏳' : '📷'}
                      </button>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`inline-block px-2 py-0.5 rounded-md text-3xs font-bold ${member.accentBg}`}>
                          {member.badgeStatusAr || (member.category === 'executive' ? 'المكتب التنفيذي' : 'اللجنة')}
                        </span>
                        {!member.enabled && (
                          <span className="px-1.5 py-0.5 rounded-md text-3xs font-bold bg-gray-100 text-gray-500">
                            مخفي
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-black text-[#08242a] mt-1 truncate">
                        {member.nameAr ? member.nameAr : <span className="text-[#819598] font-normal italic">لم يحدد الاسم بعد</span>}
                      </h3>
                      <p className="text-xs font-bold text-[#c85a32] truncate">
                        {member.roleAr}
                      </p>
                    </div>
                  </div>

                  {/* Ordering Arrows */}
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={globalIndex === 0}
                      onClick={() => moveMember(globalIndex, 'up')}
                      className="w-6 h-6 rounded-md bg-[#faf7f2] hover:bg-[#eae4d9] text-[#08242a] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-3xs font-bold transition-colors"
                      title="تحريك لأعلى"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      disabled={globalIndex === config.members.length - 1}
                      onClick={() => moveMember(globalIndex, 'down')}
                      className="w-6 h-6 rounded-md bg-[#faf7f2] hover:bg-[#eae4d9] text-[#08242a] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-3xs font-bold transition-colors"
                      title="تحريك لأسفل"
                    >
                      ▼
                    </button>
                  </div>
                </div>

                {/* Scope & Mandate */}
                {member.titleStatusAr && (
                  <div className="text-3xs font-bold text-[#819598] uppercase tracking-wider">
                    {member.titleStatusAr}
                  </div>
                )}

                {/* Bio / Description */}
                {member.descAr && (
                  <p className="text-xs text-[#5f7174] line-clamp-2 leading-relaxed">
                    {member.descAr}
                  </p>
                )}

                {/* Duties Preview */}
                {member.dutiesAr && member.dutiesAr.length > 0 && (
                  <div className="space-y-1 pt-2 border-t border-[#f0ebe1]">
                    <span className="text-3xs font-bold text-[#819598] block">المهام الأساسية:</span>
                    <ul className="text-3xs text-[#5f7174] space-y-0.5">
                      {member.dutiesAr.slice(0, 2).map((duty, dIdx) => (
                        <li key={dIdx} className="truncate flex items-center gap-1.5">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>{duty}</span>
                        </li>
                      ))}
                      {member.dutiesAr.length > 2 && (
                        <li className="text-3xs text-[#819598] italic">
                          +{member.dutiesAr.length - 2} مهام إضافية...
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 mt-4 border-t border-[#f0ebe1] flex items-center justify-between text-xs gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveUploadMemberId(member.id)
                      cardFileInputRef.current?.click()
                    }}
                    disabled={isUploadingThisCard}
                    className="px-2.5 py-1 rounded-lg bg-[#0d3b43]/10 hover:bg-[#0d3b43] text-[#0d3b43] hover:text-white text-3xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    title="رفع أو تغيير صورة العضو"
                  >
                    <span>📷</span>
                    <span>{isUploadingThisCard ? 'جارٍ الرفع...' : member.photoUrl ? 'تغيير الصورة' : 'رفع صورة'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEdit(member)}
                    className="px-2.5 py-1 rounded-lg bg-[#faf7f2] hover:bg-[#0d3b43] hover:text-white text-[#08242a] text-3xs font-bold transition-all cursor-pointer"
                  >
                    ✏️ تعديل
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleEnabled(member.id)}
                    className={`px-2 py-1 rounded-lg text-3xs font-bold transition-all ${
                      member.enabled
                        ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {member.enabled ? 'مفعّل' : 'معطّل'}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(member.id)}
                  className="px-2 py-1 rounded-lg text-red-600 hover:bg-red-50 text-3xs font-bold transition-colors cursor-pointer shrink-0"
                  title="حذف العضو"
                >
                  🗑️ حذف
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredMembers.length === 0 && (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-[#e5e0d6] space-y-3">
          <span className="text-4xl block">👥</span>
          <h3 className="text-base font-bold text-[#08242a]">لا يوجد أعضاء في هذا القسم بعد</h3>
          <p className="text-xs text-[#5f7174] max-w-md mx-auto">
            يمكنك إضافة أعضاء جدد، تحديد أدوارهم، ورفع صورهم الرسمية لعرضهم في الصفحة العامة لفريق العمل.
          </p>
          <button
            type="button"
            onClick={() => handleAddNew(selectedCategory === 'committee' ? 'committee' : selectedCategory === 'advisor' ? 'advisor' : 'executive')}
            className="px-4 py-2 rounded-xl bg-[#c85a32] text-white text-xs font-bold hover:bg-[#a64522] transition-colors"
          >
            + إضافة أول عضو في هذا التصنيف
          </button>
        </div>
      )}

      {/* Footer Tools */}
      <div className="flex items-center justify-between p-4 bg-[#faf7f2] rounded-2xl border border-[#e5e0d6] text-xs">
        <span className="text-3xs text-[#819598]">
          الهيكلة الرسمية متوافقة مع مقتضيات الظهير الشريف رقم 1.58.376 المنظم للجمعيات بالمملكة المغربية.
        </span>
        <button
          type="button"
          onClick={handleResetToDefaults}
          className="text-3xs font-bold text-[#819598] hover:text-[#c85a32] underline"
        >
          استعادة الهيكلة الافتراضية
        </button>
      </div>

      {/* ============================================================
          ADD / EDIT MEMBER MODAL
          ============================================================ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#e5e0d6]">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-[#e5e0d6] px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {editingMember ? '✏️' : '➕'}
                </span>
                <div>
                  <h2 className="text-base font-black text-[#08242a]">
                    {editingMember ? `تعديل بيانات: ${editingMember.nameAr || editingMember.roleAr}` : 'إضافة عضو جديد للهيكلة'}
                  </h2>
                  <p className="text-3xs text-[#5f7174]">
                    حدد الاسم، المنصب، الصورة الشخصية، والمهام المنوطة به
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

            {/* Modal Navigation Tabs */}
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
                1. البيانات الأساسية والرتبة
              </button>
              <button
                type="button"
                onClick={() => setModalTab('photo')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  modalTab === 'photo'
                    ? 'bg-[#0d3b43] text-white shadow-xs'
                    : 'bg-[#faf7f2] text-[#445457] hover:bg-[#eae4d9]'
                }`}
              >
                <span>2. الصورة الشخصية</span>
                {modalForm.photoUrl && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
              </button>
              <button
                type="button"
                onClick={() => setModalTab('duties')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  modalTab === 'duties'
                    ? 'bg-[#0d3b43] text-white shadow-xs'
                    : 'bg-[#faf7f2] text-[#445457] hover:bg-[#eae4d9]'
                }`}
              >
                3. المهام والمسؤوليات ({modalForm.dutiesAr?.length || 0})
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleModalSave} className="p-6 space-y-5">
              {/* TAB 1: BASIC INFO */}
              {modalTab === 'info' && (
                <div className="space-y-4">
                  {/* Category Selection */}
                  <div>
                    <label className="block text-xs font-bold text-[#08242a] mb-1.5">
                      التصنيف والهيئة التنظيمية *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        { key: 'executive', label: 'المكتب التنفيذي', desc: 'مناصب قانونية أساسية' },
                        { key: 'committee', label: 'اللجان والتأطير', desc: 'منسقو ومؤطرو الورش' },
                        { key: 'advisor', label: 'الهيئة الاستشارية', desc: 'خبراء ورواد شرفيون' },
                      ].map((cat) => (
                        <button
                          key={cat.key}
                          type="button"
                          onClick={() => setModalForm((prev) => ({ ...prev, category: cat.key as 'executive' | 'committee' | 'advisor' }))}
                          className={`p-3 rounded-xl border text-start transition-all ${
                            modalForm.category === cat.key
                              ? 'border-[#0d3b43] bg-[#0d3b43]/5 ring-1 ring-[#0d3b43]'
                              : 'border-[#e5e0d6] hover:bg-[#faf7f2]'
                          }`}
                        >
                          <span className="block text-xs font-bold text-[#08242a]">{cat.label}</span>
                          <span className="block text-3xs text-[#819598]">{cat.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Language Selector for Text Fields */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#f0ebe1]">
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

                  {/* Trilingual Name & Role */}
                  {langTab === 'ar' && (
                    <div className="space-y-3 p-4 rounded-2xl bg-[#faf7f2] border border-[#e5e0d6]">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-[#08242a] mb-1">
                            اسم العضو (بالعربية)
                          </label>
                          <input
                            type="text"
                            value={modalForm.nameAr || ''}
                            onChange={(e) => setModalForm((prev) => ({ ...prev, nameAr: e.target.value }))}
                            placeholder="مثال: ذ. أحمد المرابط"
                            className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] bg-white text-xs text-[#08242a] focus:outline-none focus:border-[#0d3b43]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#08242a] mb-1">
                            المهمة أو المنصب (بالعربية) *
                          </label>
                          <input
                            type="text"
                            required
                            value={modalForm.roleAr || ''}
                            onChange={(e) => setModalForm((prev) => ({ ...prev, roleAr: e.target.value }))}
                            placeholder="مثال: رئيس الجمعية / منسق الورشات المسرحية"
                            className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] bg-white text-xs text-[#08242a] focus:outline-none focus:border-[#0d3b43]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-[#08242a] mb-1">
                            نطاق الصلاحيات (عنوان فرعي)
                          </label>
                          <input
                            type="text"
                            value={modalForm.titleStatusAr || ''}
                            onChange={(e) => setModalForm((prev) => ({ ...prev, titleStatusAr: e.target.value }))}
                            placeholder="مثال: التمثيل القانوني والتوجيه الاستراتيجي"
                            className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] bg-white text-xs text-[#08242a] focus:outline-none focus:border-[#0d3b43]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#08242a] mb-1">
                            شارة العضوية
                          </label>
                          <input
                            type="text"
                            value={modalForm.badgeStatusAr || ''}
                            onChange={(e) => setModalForm((prev) => ({ ...prev, badgeStatusAr: e.target.value }))}
                            placeholder="مثال: عضوية معتمدة بالنظام الأساسي"
                            className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] bg-white text-xs text-[#08242a] focus:outline-none focus:border-[#0d3b43]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#08242a] mb-1">
                          نبذة تعريفية ودور العضو (بالعربية)
                        </label>
                        <textarea
                          rows={2}
                          value={modalForm.descAr || ''}
                          onChange={(e) => setModalForm((prev) => ({ ...prev, descAr: e.target.value }))}
                          placeholder="ملخص عن الدور الإداري أو الميداني للعضو داخل الجمعية..."
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
                            Nom & Prénom (FR)
                          </label>
                          <input
                            type="text"
                            value={modalForm.nameFr || ''}
                            onChange={(e) => setModalForm((prev) => ({ ...prev, nameFr: e.target.value }))}
                            placeholder="Ex: Ahmed El Mourabit"
                            className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] bg-white text-xs text-[#08242a] focus:outline-none focus:border-[#0d3b43]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#08242a] mb-1">
                            Poste / Rôle (FR)
                          </label>
                          <input
                            type="text"
                            value={modalForm.roleFr || ''}
                            onChange={(e) => setModalForm((prev) => ({ ...prev, roleFr: e.target.value }))}
                            placeholder="Ex: Président(e) de l’Association"
                            className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] bg-white text-xs text-[#08242a] focus:outline-none focus:border-[#0d3b43]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-[#08242a] mb-1">
                            Champ de responsabilité (FR)
                          </label>
                          <input
                            type="text"
                            value={modalForm.titleStatusFr || ''}
                            onChange={(e) => setModalForm((prev) => ({ ...prev, titleStatusFr: e.target.value }))}
                            placeholder="Ex: Représentation Légale & Stratégie"
                            className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] bg-white text-xs text-[#08242a] focus:outline-none focus:border-[#0d3b43]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#08242a] mb-1">
                            Badge statutaire (FR)
                          </label>
                          <input
                            type="text"
                            value={modalForm.badgeStatusFr || ''}
                            onChange={(e) => setModalForm((prev) => ({ ...prev, badgeStatusFr: e.target.value }))}
                            placeholder="Ex: Mandat Statutaire"
                            className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] bg-white text-xs text-[#08242a] focus:outline-none focus:border-[#0d3b43]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#08242a] mb-1">
                          Présentation & Bio (FR)
                        </label>
                        <textarea
                          rows={2}
                          value={modalForm.descFr || ''}
                          onChange={(e) => setModalForm((prev) => ({ ...prev, descFr: e.target.value }))}
                          placeholder="Description des responsabilités..."
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
                            Full Name (EN)
                          </label>
                          <input
                            type="text"
                            value={modalForm.nameEn || ''}
                            onChange={(e) => setModalForm((prev) => ({ ...prev, nameEn: e.target.value }))}
                            placeholder="Ex: Ahmed El Mourabit"
                            className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] bg-white text-xs text-[#08242a] focus:outline-none focus:border-[#0d3b43]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#08242a] mb-1">
                            Title / Role (EN)
                          </label>
                          <input
                            type="text"
                            value={modalForm.roleEn || ''}
                            onChange={(e) => setModalForm((prev) => ({ ...prev, roleEn: e.target.value }))}
                            placeholder="Ex: President of the Association"
                            className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] bg-white text-xs text-[#08242a] focus:outline-none focus:border-[#0d3b43]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-[#08242a] mb-1">
                            Mandate / Scope (EN)
                          </label>
                          <input
                            type="text"
                            value={modalForm.titleStatusEn || ''}
                            onChange={(e) => setModalForm((prev) => ({ ...prev, titleStatusEn: e.target.value }))}
                            placeholder="Ex: Legal Representation & Strategic Direction"
                            className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] bg-white text-xs text-[#08242a] focus:outline-none focus:border-[#0d3b43]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#08242a] mb-1">
                            Badge (EN)
                          </label>
                          <input
                            type="text"
                            value={modalForm.badgeStatusEn || ''}
                            onChange={(e) => setModalForm((prev) => ({ ...prev, badgeStatusEn: e.target.value }))}
                            placeholder="Ex: Statutory Mandate"
                            className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] bg-white text-xs text-[#08242a] focus:outline-none focus:border-[#0d3b43]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#08242a] mb-1">
                          Bio & Summary (EN)
                        </label>
                        <textarea
                          rows={2}
                          value={modalForm.descEn || ''}
                          onChange={(e) => setModalForm((prev) => ({ ...prev, descEn: e.target.value }))}
                          placeholder="Brief description of the officer's mandate..."
                          className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] bg-white text-xs text-[#08242a] focus:outline-none focus:border-[#0d3b43]"
                        />
                      </div>
                    </div>
                  )}

                  {/* Icon & Color Styling */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-[#08242a] mb-1">
                        رمز الأيقونة (إيموجي كبديل للصورة)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={modalForm.icon || '👤'}
                          onChange={(e) => setModalForm((prev) => ({ ...prev, icon: e.target.value }))}
                          className="w-16 text-center text-xl py-1.5 rounded-xl border border-[#e5e0d6] bg-white focus:outline-none"
                        />
                        <div className="flex flex-wrap gap-1">
                          {['🏛️', '📜', '💼', '🤝', '📋', '⚖️', '🎨', '🎭', '🎵', '📸', '👤', '🌟'].map((ico) => (
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
                        نمط الألوان والشارة
                      </label>
                      <select
                        value={modalForm.colorClass}
                        onChange={(e) => {
                          const opt = COLOR_OPTIONS.find((o) => o.border === e.target.value)
                          setModalForm((prev) => ({
                            ...prev,
                            colorClass: e.target.value,
                            accentBg: opt?.badge || 'bg-[#0d3b43]/10 text-[#0d3b43]',
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

              {/* TAB 2: PHOTO UPLOAD */}
              {modalTab === 'photo' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-[#faf7f2] border border-[#e5e0d6] space-y-4">
                    <span className="text-xs font-bold text-[#08242a] block">
                      صورة العضو الشخصية أو الرسمية
                    </span>
                    <p className="text-3xs text-[#5f7174]">
                      يتم حفظ الصور المرفوعة في سحابة التخزين وتنسيقها تلقائياً بشكل دائري أو بطاقي مع تأثير تكبير احترافي.
                    </p>

                    {/* Preview Box */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white rounded-2xl border border-[#e5e0d6]">
                      {modalForm.photoUrl ? (
                        <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-[#0d3b43] shadow-md relative group shrink-0">
                          <ImageWithFallback
                            src={modalForm.photoUrl}
                            alt="معاينة الصورة"
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-2xl bg-[#faf7f2] border border-dashed border-[#819598] flex flex-col items-center justify-center text-[#819598] shrink-0">
                          <span className="text-2xl mb-1">👤</span>
                          <span className="text-3xs font-bold">بدون صورة</span>
                        </div>
                      )}

                      <div className="flex-1 space-y-2 text-start">
                        {modalForm.photoUrl ? (
                          <>
                            <div className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                              <span>✓ تم ربط الصورة بنجاح:</span>
                            </div>
                            <p className="text-3xs text-[#819598] break-all font-mono">
                              {modalForm.photoUrl}
                            </p>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploadingPhoto}
                                className="px-3 py-1.5 rounded-xl bg-[#0d3b43] text-white text-3xs font-bold hover:bg-[#14505b] transition-colors"
                              >
                                {uploadingPhoto ? 'جارٍ الاستبدال...' : 'استبدال الصورة'}
                              </button>
                              <button
                                type="button"
                                onClick={handleRemovePhoto}
                                className="px-3 py-1.5 rounded-xl bg-red-50 text-red-600 text-3xs font-bold hover:bg-red-100 transition-colors"
                              >
                                حذف الصورة
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <p className="text-xs text-[#5f7174]">
                              انقر أدناه لاختيار صورة من جهازك (JPG, PNG, WEBP) بحد أقصى 5 ميغابايت.
                            </p>
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={uploadingPhoto}
                              className="px-4 py-2 rounded-xl bg-[#c85a32] text-white text-xs font-bold hover:bg-[#a64522] transition-colors flex items-center gap-2"
                            >
                              <span>📷</span>
                              <span>{uploadingPhoto ? 'جارٍ رفع الصورة...' : 'اختر صورة لرفعها الآن'}</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Hidden Native File Input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      className="hidden"
                      onChange={handlePhotoFileChange}
                    />

                    {uploadError && (
                      <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-bold">
                        ✕ {uploadError}
                      </div>
                    )}

                    {/* Direct URL Input Option */}
                    <div className="pt-3 border-t border-[#e5e0d6]">
                      <label className="block text-3xs font-bold text-[#819598] mb-1">
                        أو أدخل رابط الصورة المباشر (URL):
                      </label>
                      <input
                        type="url"
                        value={modalForm.photoUrl || ''}
                        onChange={(e) => setModalForm((prev) => ({ ...prev, photoUrl: e.target.value }))}
                        placeholder="https://... أو /uploads/photo.jpg"
                        className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] bg-white text-xs text-[#08242a] focus:outline-none focus:border-[#0d3b43] font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: DUTIES & RESPONSIBILITIES */}
              {modalTab === 'duties' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-[#faf7f2] border border-[#e5e0d6] space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#08242a] block">
                        قائمة المهام والمسؤوليات النظامية
                      </span>
                      <span className="text-3xs text-[#819598]">
                        تظهر في بطاقة العضو في الموقع العام
                      </span>
                    </div>

                    {/* Arabic Duties */}
                    <div className="space-y-2">
                      <label className="block text-3xs font-bold text-[#0d3b43]">
                        المهام بالعربية ({modalForm.dutiesAr?.length || 0})
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newDutyAr}
                          onChange={(e) => setNewDutyAr(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              if (newDutyAr.trim()) {
                                setModalForm((prev) => ({
                                  ...prev,
                                  dutiesAr: [...(prev.dutiesAr || []), newDutyAr.trim()],
                                }))
                                setNewDutyAr('')
                              }
                            }
                          }}
                          placeholder="أدخل مهمة جديدة واضغط إضافة..."
                          className="flex-1 px-3 py-1.5 rounded-xl border border-[#e5e0d6] bg-white text-xs focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (newDutyAr.trim()) {
                              setModalForm((prev) => ({
                                ...prev,
                                dutiesAr: [...(prev.dutiesAr || []), newDutyAr.trim()],
                              }))
                              setNewDutyAr('')
                            }
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#0d3b43] text-white text-xs font-bold"
                        >
                          إضافة
                        </button>
                      </div>

                      <div className="space-y-1.5 max-h-36 overflow-y-auto">
                        {modalForm.dutiesAr?.map((duty, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-[#e5e0d6] text-xs"
                          >
                            <span className="leading-relaxed">✓ {duty}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setModalForm((prev) => ({
                                  ...prev,
                                  dutiesAr: prev.dutiesAr?.filter((_, i) => i !== idx),
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

                    {/* French Duties */}
                    <div className="space-y-2 pt-2 border-t border-[#e5e0d6]">
                      <label className="block text-3xs font-bold text-[#c85a32]">
                        Missions en Français ({modalForm.dutiesFr?.length || 0})
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newDutyFr}
                          onChange={(e) => setNewDutyFr(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              if (newDutyFr.trim()) {
                                setModalForm((prev) => ({
                                  ...prev,
                                  dutiesFr: [...(prev.dutiesFr || []), newDutyFr.trim()],
                                }))
                                setNewDutyFr('')
                              }
                            }
                          }}
                          placeholder="Ajouter une mission en français..."
                          className="flex-1 px-3 py-1.5 rounded-xl border border-[#e5e0d6] bg-white text-xs focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (newDutyFr.trim()) {
                              setModalForm((prev) => ({
                                ...prev,
                                dutiesFr: [...(prev.dutiesFr || []), newDutyFr.trim()],
                              }))
                              setNewDutyFr('')
                            }
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#c85a32] text-white text-xs font-bold"
                        >
                          Ajouter
                        </button>
                      </div>

                      <div className="space-y-1.5 max-h-28 overflow-y-auto">
                        {modalForm.dutiesFr?.map((duty, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-[#e5e0d6] text-xs"
                          >
                            <span className="leading-relaxed">✓ {duty}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setModalForm((prev) => ({
                                  ...prev,
                                  dutiesFr: prev.dutiesFr?.filter((_, i) => i !== idx),
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

                    {/* English Duties */}
                    <div className="space-y-2 pt-2 border-t border-[#e5e0d6]">
                      <label className="block text-3xs font-bold text-[#1c6875]">
                        Responsibilities in English ({modalForm.dutiesEn?.length || 0})
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newDutyEn}
                          onChange={(e) => setNewDutyEn(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              if (newDutyEn.trim()) {
                                setModalForm((prev) => ({
                                  ...prev,
                                  dutiesEn: [...(prev.dutiesEn || []), newDutyEn.trim()],
                                }))
                                setNewDutyEn('')
                              }
                            }
                          }}
                          placeholder="Add a statutory duty in English..."
                          className="flex-1 px-3 py-1.5 rounded-xl border border-[#e5e0d6] bg-white text-xs focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (newDutyEn.trim()) {
                              setModalForm((prev) => ({
                                ...prev,
                                dutiesEn: [...(prev.dutiesEn || []), newDutyEn.trim()],
                              }))
                              setNewDutyEn('')
                            }
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#1c6875] text-white text-xs font-bold"
                        >
                          Add
                        </button>
                      </div>

                      <div className="space-y-1.5 max-h-28 overflow-y-auto">
                        {modalForm.dutiesEn?.map((duty, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-[#e5e0d6] text-xs"
                          >
                            <span className="leading-relaxed">✓ {duty}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setModalForm((prev) => ({
                                  ...prev,
                                  dutiesEn: prev.dutiesEn?.filter((_, i) => i !== idx),
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
                  <span className="block text-xs font-bold text-[#08242a]">تفعيل ظهور العضو في الموقع</span>
                  <span className="block text-3xs text-[#819598]">عند التعطيل، يبقى العضو محفوظاً في لوحة التحكم ويختفي من الصفحة العامة.</span>
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
                  {editingMember ? 'تحديث بيانات العضو' : 'إضافة العضو للقائمة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

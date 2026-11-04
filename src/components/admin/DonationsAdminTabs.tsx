'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'
import type {
  SupportPageConfig,
  PatronagePackageItem,
  SupportStatItem,
  SupportPillarItem,
  SupportFaqItem,
} from '@/lib/settings'
import { CsvExportButton } from '@/components/admin/CsvExportButton'
import { saveSupportPageConfiguration } from '@/lib/actions/admin'

export interface DonationRecordRow {
  id: string
  donor_name: string
  donor_email: string
  donor_phone?: string | null
  support_type: string
  amount?: number | null
  currency: string
  notes?: string | null
  status: string
  created_at: string
}

interface DonationsAdminTabsProps {
  initialDonations: DonationRecordRow[]
  initialConfig: SupportPageConfig
  onUpdateStatus?: (id: string, status: string) => Promise<void>
  onDeleteRecord?: (id: string) => Promise<void>
}

export function DonationsAdminTabs({
  initialDonations,
  initialConfig,
  onUpdateStatus,
  onDeleteRecord,
}: DonationsAdminTabsProps) {
  const router = useRouter()

  // Tabs: 'donations' | 'gateway-and-bank' | 'packages' | 'page-settings' | 'integration-guide'
  const [activeTab, setActiveTab] = useState<
    'donations' | 'gateway-and-bank' | 'packages' | 'page-settings' | 'integration-guide'
  >('donations')

  // CMS State
  const [config, setConfig] = useState<SupportPageConfig>(initialConfig)
  const [prevInitialConfig, setPrevInitialConfig] = useState<SupportPageConfig>(initialConfig)
  if (prevInitialConfig !== initialConfig) {
    setPrevInitialConfig(initialConfig)
    setConfig(initialConfig)
  }

  const [activeLangTab, setActiveLangTab] = useState<'ar' | 'fr' | 'en'>('ar')

  // Donations State & Filters
  const [donations, setDonations] = useState<DonationRecordRow[]>(initialDonations)
  const [searchDonation, setSearchDonation] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [viewingRecord, setViewingRecord] = useState<DonationRecordRow | null>(null)
  const [processingId, setProcessingId] = useState<string | null>(null)

  // Package Modal (Add / Edit)
  const [editingPackage, setEditingPackage] = useState<PatronagePackageItem | null>(null)
  const [isAddingPackage, setIsAddingPackage] = useState(false)
  const [packageForm, setPackageForm] = useState<PatronagePackageItem>({
    id: '',
    nameAr: '',
    nameFr: '',
    nameEn: '',
    badgeAr: '',
    badgeFr: '',
    badgeEn: '',
    amount: 5000,
    currency: 'MAD',
    periodAr: 'موسم ثقافي كامل',
    periodFr: 'Saison culturelle complète',
    periodEn: 'Full Cultural Season',
    descriptionAr: '',
    descriptionFr: '',
    descriptionEn: '',
    impactAr: '',
    impactFr: '',
    impactEn: '',
    privilegesAr: [],
    privilegesFr: [],
    privilegesEn: [],
    recommended: false,
    active: true,
    order: 1,
  })

  // Multiline privilege helpers for package form
  const [packagePrivilegesArText, setPackagePrivilegesArText] = useState('')
  const [packagePrivilegesFrText, setPackagePrivilegesFrText] = useState('')
  const [packagePrivilegesEnText, setPackagePrivilegesEnText] = useState('')

  // Loading & Feedback
  const [savingConfig, setSavingConfig] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const heroFileInputRef = useRef<HTMLInputElement>(null)

  // -------------------------------------------------------------
  // Donations Handlers & Metrics
  // -------------------------------------------------------------
  const filteredDonations = donations.filter((d) => {
    const q = searchDonation.toLowerCase().trim()
    const matchesSearch =
      !q ||
      d.donor_name.toLowerCase().includes(q) ||
      d.donor_email.toLowerCase().includes(q) ||
      (d.donor_phone && d.donor_phone.toLowerCase().includes(q)) ||
      (d.notes && d.notes.toLowerCase().includes(q))

    const matchesStatus = statusFilter === 'all' || d.status === statusFilter
    const matchesType = typeFilter === 'all' || d.support_type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const totalDonationsCount = donations.length
  const totalAmountMad = donations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0)
  const pendingCount = donations.filter((d) => d.status === 'pending').length
  const confirmedCount = donations.filter((d) => d.status === 'confirmed' || d.status === 'approved').length

  async function handleStatusChange(id: string, newStatus: string) {
    setProcessingId(id)
    try {
      if (onUpdateStatus) {
        await onUpdateStatus(id, newStatus)
      } else {
        const res = await fetch(`/api/admin/applications/status`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ table: 'donation_records', id, status: newStatus }),
        })
        if (!res.ok) throw new Error('Status update failed')
      }
      setDonations((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
      )
      if (viewingRecord?.id === id) {
        setViewingRecord((prev) => (prev ? { ...prev, status: newStatus } : null))
      }
      setFeedback({
        type: 'success',
        message: 'تم تحديث حالة المساهمة بنجاح.',
      })
    } catch {
      setFeedback({
        type: 'error',
        message: 'حدث خطأ أثناء محاولة تحديث الحالة.',
      })
    } finally {
      setProcessingId(null)
    }
  }

  async function handleDeleteDonation(id: string, donorName: string) {
    if (!confirm(`هل أنت متأكد من حذف سجل المساهمة المقدمة من "${donorName}" نهائياً؟`)) {
      return
    }

    setProcessingId(id)
    try {
      if (onDeleteRecord) {
        await onDeleteRecord(id)
      } else {
        const res = await fetch(`/api/admin/applications/delete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ table: 'donation_records', id }),
        })
        if (!res.ok) throw new Error('Delete failed')
      }
      setDonations((prev) => prev.filter((d) => d.id !== id))
      if (viewingRecord?.id === id) setViewingRecord(null)
      setFeedback({
        type: 'success',
        message: 'تم حذف السجل بنجاح.',
      })
    } catch {
      setFeedback({
        type: 'error',
        message: 'فشل حذف السجل.',
      })
    } finally {
      setProcessingId(null)
    }
  }

  const exportData = donations.map((d) => ({
    ID: d.id,
    DonorName: d.donor_name,
    Email: d.donor_email,
    Phone: d.donor_phone || '',
    SupportType: d.support_type,
    Amount: d.amount ?? 0,
    Currency: d.currency,
    Notes: d.notes || '',
    Status: d.status,
    ReceivedAt: d.created_at,
  }))

  // -------------------------------------------------------------
  // Packages Modal Logic
  // -------------------------------------------------------------
  function openAddPackageModal() {
    setIsAddingPackage(true)
    setEditingPackage(null)
    setPackageForm({
      id: `package-${Date.now()}`,
      nameAr: '',
      nameFr: '',
      nameEn: '',
      badgeAr: '',
      badgeFr: '',
      badgeEn: '',
      amount: 10000,
      currency: 'MAD',
      periodAr: 'موسم ثقافي كامل',
      periodFr: 'Saison culturelle complète',
      periodEn: 'Full Cultural Season',
      descriptionAr: '',
      descriptionFr: '',
      descriptionEn: '',
      impactAr: '',
      impactFr: '',
      impactEn: '',
      privilegesAr: [],
      privilegesFr: [],
      privilegesEn: [],
      recommended: false,
      active: true,
      order: (config.packages || []).length + 1,
    })
    setPackagePrivilegesArText('')
    setPackagePrivilegesFrText('')
    setPackagePrivilegesEnText('')
  }

  function openEditPackageModal(pkg: PatronagePackageItem) {
    setEditingPackage(pkg)
    setIsAddingPackage(false)
    setPackageForm({ ...pkg })
    setPackagePrivilegesArText((pkg.privilegesAr || []).join('\n'))
    setPackagePrivilegesFrText((pkg.privilegesFr || []).join('\n'))
    setPackagePrivilegesEnText((pkg.privilegesEn || []).join('\n'))
  }

  function handleSavePackageModal() {
    if (!packageForm.nameAr.trim()) {
      alert('يرجى إدخال اسم باقة الرعاية بالعربية.')
      return
    }

    const privilegesAr = packagePrivilegesArText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
    const privilegesFr = packagePrivilegesFrText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
    const privilegesEn = packagePrivilegesEnText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)

    const updatedPackage: PatronagePackageItem = {
      ...packageForm,
      privilegesAr,
      privilegesFr,
      privilegesEn,
    }

    let nextPackages: PatronagePackageItem[]
    if (editingPackage) {
      nextPackages = (config.packages || []).map((p) =>
        p.id === updatedPackage.id ? updatedPackage : p
      )
    } else {
      nextPackages = [...(config.packages || []), updatedPackage]
    }

    setConfig((prev) => ({
      ...prev,
      packages: nextPackages,
    }))

    setEditingPackage(null)
    setIsAddingPackage(false)
    setFeedback({
      type: 'success',
      message: 'تم تحديث باقة الرعاية في الواجهة. تذكر الضغط على "حفظ جميع التغييرات" لتثبيتها.',
    })
  }

  function handleDeletePackage(id: string) {
    if (!confirm('هل أنت متأكد من حذف هذه الباقة؟')) return
    setConfig((prev) => ({
      ...prev,
      packages: (prev.packages || []).filter((p) => p.id !== id),
    }))
    setFeedback({
      type: 'success',
      message: 'تم حذف الباقة. يرجى الضغط على "حفظ جميع التغييرات" لتأكيد الحفظ على المنصة.',
    })
  }

  function handleTogglePackageActive(id: string) {
    setConfig((prev) => ({
      ...prev,
      packages: (prev.packages || []).map((p) =>
        p.id === id ? { ...p, active: !p.active } : p
      ),
    }))
  }

  // -------------------------------------------------------------
  // Image Upload Handlers
  // -------------------------------------------------------------
  async function handleHeroImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const data = new FormData()
      data.append('file', file)

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: data,
      })

      const json = await res.json()
      if (res.ok && json.url) {
        setConfig((prev) => ({
          ...prev,
          hero: {
            ...prev.hero,
            imageUrl: json.url,
            hasHeroImage: true,
          },
        }))
        setFeedback({
          type: 'success',
          message: 'تم رفع صورة غلاف صفحة الدعم بنجاح.',
        })
      } else {
        throw new Error(json.error || 'Failed to upload')
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'فشل رفع الصورة'
      setFeedback({
        type: 'error',
        message,
      })
    } finally {
      setUploadingImage(false)
      if (heroFileInputRef.current) heroFileInputRef.current.value = ''
    }
  }

  // -------------------------------------------------------------
  // Global Save Handler
  // -------------------------------------------------------------
  async function handleSaveAll() {
    setSavingConfig(true)
    setFeedback(null)

    try {
      const res = await saveSupportPageConfiguration(config)
      if (!res.success) {
        throw new Error(res.error || 'فشل حفظ الإعدادات')
      }

      setFeedback({
        type: 'success',
        message: 'تم حفظ كافة إعدادات الدعم وبوابات الأداء بنجاح وتحديث الواجهة العامة.',
      })
      router.refresh()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'حدث خطأ أثناء الحفظ'
      setFeedback({
        type: 'error',
        message,
      })
    } finally {
      setSavingConfig(false)
    }
  }

  // -------------------------------------------------------------
  // Field Update Helpers
  // -------------------------------------------------------------
  function updateHero<K extends keyof SupportPageConfig['hero']>(
    field: K,
    val: SupportPageConfig['hero'][K]
  ) {
    setConfig((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        [field]: val,
      },
    }))
  }

  function updateGateway<K extends keyof SupportPageConfig['paymentGateway']>(
    field: K,
    val: SupportPageConfig['paymentGateway'][K]
  ) {
    setConfig((prev) => ({
      ...prev,
      paymentGateway: {
        ...prev.paymentGateway,
        [field]: val,
      },
    }))
  }

  function updateBank<K extends keyof SupportPageConfig['bankTransfer']>(
    field: K,
    val: SupportPageConfig['bankTransfer'][K]
  ) {
    setConfig((prev) => ({
      ...prev,
      bankTransfer: {
        ...prev.bankTransfer,
        [field]: val,
      },
    }))
  }

  function updateStat(index: number, patch: Partial<SupportStatItem>) {
    setConfig((prev) => {
      const nextStats = [...prev.stats]
      nextStats[index] = { ...nextStats[index], ...patch }
      return { ...prev, stats: nextStats }
    })
  }

  function updatePillar(index: number, patch: Partial<SupportPillarItem>) {
    setConfig((prev) => {
      const next = [...prev.pillars]
      next[index] = { ...next[index], ...patch }
      return { ...prev, pillars: next }
    })
  }

  function updateFaq(index: number, patch: Partial<SupportFaqItem>) {
    setConfig((prev) => {
      const next = [...prev.transparencyFaqs]
      next[index] = { ...next[index], ...patch }
      return { ...prev, transparencyFaqs: next }
    })
  }

  function updateCta<K extends keyof SupportPageConfig['cta']>(
    field: K,
    val: SupportPageConfig['cta'][K]
  ) {
    setConfig((prev) => ({
      ...prev,
      cta: {
        ...prev.cta,
        [field]: val,
      },
    }))
  }

  return (
    <div className="space-y-8" dir="rtl">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e5e0d6] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#231f20] animate-pulse" />
            <span className="text-2xs font-extrabold tracking-widest uppercase text-[#bd3227]">
              منظومة الرعاية والدعم والتحصيل المالي
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#231f20]">
            إدارة الدعم والمساهمات وبوابات الأداء
          </h1>
          <p className="text-xs text-[#5C5A55] mt-1 font-medium max-w-2xl">
            متابعة إشعارات الدعم والتبرعات، ضبط بوابة الأداء الإلكتروني المباشر (CMI / Stripe)، الحساب البنكي الرسمي، وباقات الرعاية الثقافية.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <a
            href="/ar/support"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl text-xs font-bold text-[#231f20] bg-white border border-[#231f20]/30 hover:bg-[#231f20]/5 transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <span>معاينة صفحة الدعم</span>
            <span className="text-3xs">↗</span>
          </a>

          <button
            onClick={handleSaveAll}
            disabled={savingConfig}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#231f20] text-white hover:bg-[#d2a82b] active:scale-98 transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm cursor-pointer"
          >
            {savingConfig ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>جاري الحفظ...</span>
              </>
            ) : (
              <>
                <span>💾</span>
                <span>حفظ التعديلات</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold border flex items-center justify-between gap-3 shadow-2xs animate-fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-red-50 text-red-900 border-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span>{feedback.type === 'success' ? '✓' : '⚠️'}</span>
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs opacity-60 hover:opacity-100 font-black cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Tabs Segment Control */}
      <div className="bg-[#F4EFE6] p-1.5 rounded-2xl flex flex-wrap gap-1 border border-[#e5e0d6]">
        <button
          onClick={() => setActiveTab('donations')}
          className={`flex-1 min-w-[140px] py-3 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'donations'
              ? 'bg-white text-[#231f20] shadow-2xs'
              : 'text-[#5C5A55] hover:text-[#231f20]'
          }`}
        >
          <span>📥</span>
          <span>المساهمات والتبرعات</span>
          <span
            className={`px-2 py-0.5 rounded-full text-3xs font-black ${
              activeTab === 'donations'
                ? 'bg-[#231f20] text-white'
                : 'bg-[#e5e0d6] text-[#5C5A55]'
            }`}
          >
            {totalDonationsCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('gateway-and-bank')}
          className={`flex-1 min-w-[140px] py-3 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'gateway-and-bank'
              ? 'bg-white text-[#231f20] shadow-2xs'
              : 'text-[#5C5A55] hover:text-[#231f20]'
          }`}
        >
          <span>💳</span>
          <span>بوابة الأداء والحساب البنكي</span>
          {config.paymentGateway.enabled && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('packages')}
          className={`flex-1 min-w-[140px] py-3 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'packages'
              ? 'bg-white text-[#231f20] shadow-2xs'
              : 'text-[#5C5A55] hover:text-[#231f20]'
          }`}
        >
          <span>🏆</span>
          <span>باقات الرعاية الثقافية</span>
          <span
            className={`px-2 py-0.5 rounded-full text-3xs font-black ${
              activeTab === 'packages' ? 'bg-[#bd3227] text-white' : 'bg-[#e5e0d6] text-[#5C5A55]'
            }`}
          >
            {(config.packages || []).length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('page-settings')}
          className={`flex-1 min-w-[140px] py-3 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'page-settings'
              ? 'bg-white text-[#231f20] shadow-2xs'
              : 'text-[#5C5A55] hover:text-[#231f20]'
          }`}
        >
          <span>🎨</span>
          <span>تخصيص الواجهة (CMS)</span>
        </button>

        <button
          onClick={() => setActiveTab('integration-guide')}
          className={`flex-1 min-w-[140px] py-3 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'integration-guide'
              ? 'bg-white text-[#231f20] shadow-2xs border-b-2 border-[#bd3227]'
              : 'text-[#5C5A55] hover:text-[#231f20]'
          }`}
        >
          <span>📖</span>
          <span>دليل الربط وتوجيه CMI</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: DONATIONS & PLEDGES                                */}
      {/* ========================================================= */}
      {activeTab === 'donations' && (
        <div className="space-y-6">
          {/* Counters */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-[#e5e0d6] shadow-2xs flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-[#231f20]/10 text-[#231f20] flex items-center justify-center text-lg font-bold">
                📥
              </span>
              <div>
                <div className="text-xl font-black text-[#231f20]">{totalDonationsCount}</div>
                <div className="text-3xs text-[#5C5A55] font-bold">إجمالي إشعارات الدعم</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#e5e0d6] shadow-2xs flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center text-lg font-bold">
                💰
              </span>
              <div>
                <div className="text-xl font-black text-emerald-700">
                  {totalAmountMad.toLocaleString()} MAD
                </div>
                <div className="text-3xs text-[#5C5A55] font-bold">مجموع المبالغ المصرح بها</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#e5e0d6] shadow-2xs flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center text-lg font-bold">
                ⏳
              </span>
              <div>
                <div className="text-xl font-black text-amber-700">{pendingCount}</div>
                <div className="text-3xs text-[#5C5A55] font-bold">قيد التحقق والتوثيق</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#e5e0d6] shadow-2xs flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center text-lg font-bold">
                ✅
              </span>
              <div>
                <div className="text-xl font-black text-emerald-700">{confirmedCount}</div>
                <div className="text-3xs text-[#5C5A55] font-bold">مساهمات مؤكدة قانونياً</div>
              </div>
            </div>
          </div>

          {/* Search, Filter & CSV Export */}
          <div className="bg-white p-4 rounded-2xl border border-[#e5e0d6] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <input
                  type="text"
                  value={searchDonation}
                  onChange={(e) => setSearchDonation(e.target.value)}
                  placeholder="بحث باسم الداعم، البريد، الهاتف، أو الملاحظات..."
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-[#e5e0d6] text-xs outline-none focus:border-[#231f20] bg-[#FAF8F5]"
                />
                <span className="absolute right-3.5 top-2.5 text-slate-400">🔍</span>
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-[#e5e0d6] text-xs font-bold text-[#231f20] bg-[#FAF8F5] outline-none"
              >
                <option value="all">كل الحالات ({totalDonationsCount})</option>
                <option value="pending">قيد الانتظار ({pendingCount})</option>
                <option value="confirmed">مؤكد ومستلم ({confirmedCount})</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-[#e5e0d6] text-xs font-bold text-[#231f20] bg-[#FAF8F5] outline-none"
              >
                <option value="all">كافة أنواع الدعم</option>
                <option value="financial">دعم مالي (Financial)</option>
                <option value="in_kind">مساهمة عينية (In-Kind)</option>
                <option value="sponsorship">رعاية فعالية (Sponsorship)</option>
                <option value="equipment">تجهيزات ومعدات (Equipment)</option>
                <option value="venue">استضافة فضاء (Venue)</option>
              </select>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <CsvExportButton data={exportData} filename="amycc-donation-records" />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-[#e5e0d6] overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs text-[#231f20]">
                <thead className="bg-[#FAF8F5] border-b border-[#e5e0d6] text-2xs uppercase tracking-wider text-[#5C5A55] font-bold">
                  <tr>
                    <th className="px-6 py-4 text-start">الداعم / الهيئة</th>
                    <th className="px-6 py-4 text-start">نوع المساهمة والقيمة</th>
                    <th className="px-6 py-4 text-start">الملاحظات وتفاصيل الدعم</th>
                    <th className="px-6 py-4 text-start">الحالة</th>
                    <th className="px-6 py-4 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#FEF6CC]">
                  {filteredDonations.length > 0 ? (
                    filteredDonations.map((d) => (
                      <tr key={d.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-[#231f20] text-xs">{d.donor_name}</div>
                          <a
                            href={`mailto:${d.donor_email}`}
                            className="text-3xs text-[#5C5A55] hover:text-[#231f20] transition-colors block font-mono"
                          >
                            {d.donor_email}
                          </a>
                          {d.donor_phone && (
                            <a
                              href={`tel:${d.donor_phone}`}
                              className="text-3xs text-[#5C5A55] font-mono hover:text-[#231f20] transition-colors block"
                              dir="ltr"
                            >
                              {d.donor_phone}
                            </a>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <span className="font-bold block text-[#231f20] capitalize">
                            {d.support_type.replace('_', ' ')}
                          </span>
                          {d.amount ? (
                            <span className="text-xs font-black text-[#bd3227]">
                              {d.amount.toLocaleString()} {d.currency}
                            </span>
                          ) : (
                            <span className="text-3xs text-[#5C5A55]">مساهمة عينية / لوجستية</span>
                          )}
                        </td>

                        <td className="px-6 py-4 max-w-xs">
                          <p
                            className="truncate text-[#5C5A55] text-xs cursor-pointer hover:text-[#231f20]"
                            title={d.notes || '—'}
                            onClick={() => setViewingRecord(d)}
                          >
                            {d.notes || '—'}
                          </p>
                          <span className="text-3xs text-slate-400 block mt-0.5">
                            {new Date(d.created_at).toLocaleDateString('ar-MA')}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-2xs font-bold ${
                              d.status === 'confirmed' || d.status === 'approved'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {d.status === 'confirmed' || d.status === 'approved'
                              ? 'مؤكد ومستلم'
                              : 'قيد الانتظار'}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setViewingRecord(d)}
                              className="px-2.5 py-1 rounded-lg text-2xs font-bold bg-[#FAF8F5] text-[#231f20] hover:bg-[#F4EFE6] border border-[#e5e0d6] transition-colors cursor-pointer"
                              title="عرض ملف المساهمة"
                            >
                              عرض
                            </button>

                            {d.status !== 'confirmed' && (
                              <button
                                disabled={processingId === d.id}
                                onClick={() => handleStatusChange(d.id, 'confirmed')}
                                className="px-2.5 py-1 rounded-lg text-2xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors disabled:opacity-50 cursor-pointer"
                              >
                                تأكيد الاستلام
                              </button>
                            )}

                            <button
                              disabled={processingId === d.id}
                              onClick={() => handleDeleteDonation(d.id, d.donor_name)}
                              className="px-2 py-1 rounded-lg text-2xs font-bold text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                              title="حذف نهائي"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-[#5C5A55]">
                        لا توجد إشعارات مساهمة مسجلة تطابق معايير البحث الحالية.
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
      {/* TAB 2: PAYMENT GATEWAY & BANK SETTINGS                    */}
      {/* ========================================================= */}
      {activeTab === 'gateway-and-bank' && (
        <div className="space-y-8">
          {/* Section: Master Gateway Switch & Environment */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e5e0d6] shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E0D6] pb-5">
              <div>
                <span className="text-2xs font-bold uppercase tracking-wider text-[#bd3227]">
                  بوابة الأداء الإلكتروني المباشر
                </span>
                <h2 className="text-lg font-black text-[#231f20]">
                  الربط مع مركز النقديات CMI / Stripe
                </h2>
                <p className="text-xs text-[#5C5A55] mt-0.5">
                  تمكين المتبرعين من الأداء الفوري الآمن بالبطاقات البنكية المغربية والدولية (3D-Secure).
                </p>
              </div>

              {/* Master toggle */}
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <span className="text-xs font-bold text-[#231f20]">
                  {config.paymentGateway.enabled ? 'بوابة الدفع مفعلة' : 'بوابة الدفع معطلة'}
                </span>
                <input
                  type="checkbox"
                  checked={config.paymentGateway.enabled}
                  onChange={(e) => updateGateway('enabled', e.target.checked)}
                  className="w-5 h-5 text-[#231f20] rounded"
                />
              </label>
            </div>

            {/* Provider and Mode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-2xs font-extrabold text-[#231f20] mb-1.5">
                  مزود بوابة الدفع (Gateway Provider)
                </label>
                <select
                  value={config.paymentGateway.provider}
                  onChange={(e) =>
                    updateGateway('provider', e.target.value as 'cmi' | 'stripe' | 'both')
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e0d6] text-xs font-bold text-[#231f20] bg-[#FAF8F5] outline-none"
                >
                  <option value="cmi">🇲🇦 CMI (Centre Monétique Interbancaire - المغربي)</option>
                  <option value="stripe">💳 Stripe (الدولي)</option>
                  <option value="both">كلاهما (CMI + Stripe)</option>
                </select>
              </div>

              <div>
                <label className="block text-2xs font-extrabold text-[#231f20] mb-1.5">
                  بيئة التشغيل (Environment Mode)
                </label>
                <select
                  value={config.paymentGateway.mode}
                  onChange={(e) => updateGateway('mode', e.target.value as 'test' | 'live')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e0d6] text-xs font-bold text-[#231f20] bg-[#FAF8F5] outline-none"
                >
                  <option value="test">🧪 بيئة الاختبار والمحاكاة (Sandbox / Test Mode)</option>
                  <option value="live">🚀 بيئة الإنتاج الحقيقية (Live / Production Mode)</option>
                </select>
              </div>
            </div>

            {/* CMI Settings Block */}
            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-base">🇲🇦</span>
                <h3 className="text-xs font-extrabold text-[#231f20] uppercase tracking-wider">
                  إعدادات الربط مع CMI (Centre Monétique Interbancaire)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-3xs font-bold text-[#5C5A55] mb-1">
                    معرف التاجر (Merchant ID / Client ID)
                  </label>
                  <input
                    type="text"
                    value={config.paymentGateway.cmiConfig.merchantId}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        paymentGateway: {
                          ...prev.paymentGateway,
                          cmiConfig: { ...prev.paymentGateway.cmiConfig, merchantId: e.target.value },
                        },
                      }))
                    }
                    placeholder="مثال: 600000000"
                    className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs font-mono bg-white"
                  />
                </div>

                <div>
                  <label className="block text-3xs font-bold text-[#5C5A55] mb-1">
                    المفتاح السري للتوقيع (Store Key / Hash Salt)
                  </label>
                  <input
                    type="password"
                    value={config.paymentGateway.cmiConfig.storeKey}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        paymentGateway: {
                          ...prev.paymentGateway,
                          cmiConfig: { ...prev.paymentGateway.cmiConfig, storeKey: e.target.value },
                        },
                      }))
                    }
                    placeholder="المفتاح السري المشترك من CMI"
                    className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs font-mono bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-3xs font-bold text-[#5C5A55] mb-1">
                    رابط بوابة الأداء CMI (Gateway URL)
                  </label>
                  <input
                    type="text"
                    value={config.paymentGateway.cmiConfig.gatewayUrl}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        paymentGateway: {
                          ...prev.paymentGateway,
                          cmiConfig: { ...prev.paymentGateway.cmiConfig, gatewayUrl: e.target.value },
                        },
                      }))
                    }
                    placeholder="https://testpayment.cmi.co.ma/fim/est3Dgate"
                    className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs font-mono bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Preset amounts */}
            <div className="pt-2">
              <label className="block text-2xs font-extrabold text-[#231f20] mb-1.5">
                مبالغ التبرع السريع المقترحة (بالدرهم المغربي - مفصولة بفواصل)
              </label>
              <input
                type="text"
                value={(config.paymentGateway.presetAmounts || []).join(', ')}
                onChange={(e) => {
                  const amounts = e.target.value
                    .split(',')
                    .map((s) => Number(s.trim()))
                    .filter((n) => !isNaN(n) && n > 0)
                  updateGateway('presetAmounts', amounts)
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e0d6] text-xs font-mono bg-[#FAF8F5]"
              />
            </div>
          </div>

          {/* Section: Official Bank Account (RIB / IBAN / SWIFT) */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e5e0d6] shadow-2xs space-y-6">
            <div className="border-b border-[#E5E0D6] pb-4">
              <span className="text-2xs font-bold uppercase tracking-wider text-[#bd3227]">
                الحساب البنكي الرسمي للجمعية
              </span>
              <h2 className="text-lg font-black text-[#231f20]">
                بيانات التحويل البنكي المباشر (Virement Bancaire)
              </h2>
              <p className="text-xs text-[#5C5A55] mt-0.5">
                البيانات البنكية الرسمية التي تظهر في الواجهة للمتبرعين والمؤسسات الراغبة بالتحويل المباشر.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-2xs font-extrabold text-[#231f20] mb-1.5">
                  اسم المؤسسة البنكية (Bank Name)
                </label>
                <input
                  type="text"
                  value={config.bankTransfer.bankName}
                  onChange={(e) => updateBank('bankName', e.target.value)}
                  placeholder="مثال: التجاري وفا بنك (Attijariwafa Bank)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5] font-bold"
                />
              </div>

              <div>
                <label className="block text-2xs font-extrabold text-[#231f20] mb-1.5">
                  اسم الحساب والمستفيد (Account Holder)
                </label>
                <input
                  type="text"
                  value={config.bankTransfer.accountHolder}
                  onChange={(e) => updateBank('accountHolder', e.target.value)}
                  placeholder="جمعية روح الفنون والثقافة (AMYCC)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5] font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-2xs font-extrabold text-[#231f20] mb-1.5">
                  رقم الحساب البنكي المغربي RIB (24 رقماً)
                </label>
                <input
                  type="text"
                  value={config.bankTransfer.rib}
                  onChange={(e) => updateBank('rib', e.target.value)}
                  placeholder="007 810 0001234567890123 45"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e0d6] text-xs font-mono bg-[#FAF8F5] font-black text-[#231f20]"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-2xs font-extrabold text-[#231f20] mb-1.5">
                  رقم الحساب الدولي IBAN
                </label>
                <input
                  type="text"
                  value={config.bankTransfer.iban}
                  onChange={(e) => updateBank('iban', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e0d6] text-xs font-mono bg-[#FAF8F5]"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-2xs font-extrabold text-[#231f20] mb-1.5">
                  رمز السويفت الدولي SWIFT / BIC
                </label>
                <input
                  type="text"
                  value={config.bankTransfer.swift}
                  onChange={(e) => updateBank('swift', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e0d6] text-xs font-mono bg-[#FAF8F5]"
                  dir="ltr"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-2xs font-extrabold text-[#231f20] mb-1.5">
                  الوكالة والمدينة (Agency)
                </label>
                <input
                  type="text"
                  value={config.bankTransfer.agency}
                  onChange={(e) => updateBank('agency', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-2xs font-extrabold text-[#231f20] mb-1.5">
                  إرشادات وتوجيهات التحويل البنكي (العربية)
                </label>
                <textarea
                  rows={2}
                  value={config.bankTransfer.instructionsAr}
                  onChange={(e) => updateBank('instructionsAr', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: PATRONAGE PACKAGES                                 */}
      {/* ========================================================= */}
      {activeTab === 'packages' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#e5e0d6] shadow-2xs">
            <div>
              <h2 className="text-base font-extrabold text-[#231f20]">
                باقات ومسارات الرعاية الثقافية (Patronage Packages)
              </h2>
              <p className="text-xs text-[#5C5A55] mt-0.5">
                تحديد صيغ الرعاية الموجهة للمؤسسات والشركات والشخصيات الراغبة في تمويل مواسم وبرامج محددة.
              </p>
            </div>
            <button
              onClick={openAddPackageModal}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#bd3227] text-white hover:bg-[#a3261c] transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <span>+</span>
              <span>إضافة باقة رعاية جديدة</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(config.packages || []).map((pkg, idx) => (
              <div
                key={pkg.id || idx}
                className={`relative rounded-3xl p-6 transition-all border flex flex-col justify-between ${
                  pkg.recommended
                    ? 'bg-gradient-to-b from-[#F5F3EE] via-white to-[#F5F3EE] border-[#bd3227] shadow-sm'
                    : 'bg-white border-[#e5e0d6] shadow-2xs'
                } ${!pkg.active ? 'opacity-60 bg-slate-50' : ''}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-3xs font-extrabold tracking-wider uppercase text-[#bd3227]">
                      {pkg.badgeAr || 'باقة رعاية'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {pkg.recommended && (
                        <span className="px-2 py-0.5 rounded-full text-3xs font-black bg-[#bd3227] text-white">
                          ⭐ الأكثر طلباً
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded-full text-3xs font-bold ${
                          pkg.active !== false
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {pkg.active !== false ? 'مفعلة' : 'معطلة'}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-[#231f20] mb-2">{pkg.nameAr}</h3>

                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl font-black text-[#231f20]">
                      {pkg.amount.toLocaleString()} {pkg.currency}
                    </span>
                    <span className="text-xs text-[#5C5A55] font-medium">/ {pkg.periodAr}</span>
                  </div>

                  <p className="text-xs text-[#5C5A55] leading-relaxed mb-4">
                    {pkg.descriptionAr}
                  </p>

                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6] mb-5">
                    <span className="text-3xs font-black text-[#bd3227] block mb-1">
                      الأثر الميداني المباشر:
                    </span>
                    <p className="text-xs text-[#231f20] font-medium leading-snug">
                      {pkg.impactAr}
                    </p>
                  </div>

                  <div className="space-y-1.5 border-t border-[#E5E0D6] pt-4 mb-6">
                    <span className="text-3xs font-extrabold uppercase text-[#231f20] block mb-1">
                      الامتيازات الممنوحة للراعي:
                    </span>
                    {(pkg.privilegesAr || []).map((pr, prIdx) => (
                      <div key={prIdx} className="flex items-start gap-2 text-xs text-[#231f20]">
                        <span className="text-emerald-600 font-bold shrink-0">✓</span>
                        <span className="leading-snug">{pr}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#e5e0d6]">
                  <button
                    type="button"
                    onClick={() => handleTogglePackageActive(pkg.id)}
                    className="text-2xs font-bold text-[#5C5A55] hover:text-[#231f20] transition-colors cursor-pointer"
                  >
                    {pkg.active !== false ? 'إخفاء الباقة' : 'تفعيل الباقة'}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditPackageModal(pkg)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#231f20] text-white hover:bg-[#d2a82b] transition-all cursor-pointer shadow-2xs"
                    >
                      تعديل
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePackage(pkg.id)}
                      className="px-2 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: CMS PAGE SETTINGS                                  */}
      {/* ========================================================= */}
      {activeTab === 'page-settings' && (
        <div className="space-y-8">
          {/* Trilingual Selector */}
          <div className="bg-white p-4 rounded-2xl border border-[#e5e0d6] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
            <div>
              <span className="text-2xs font-bold uppercase tracking-wider text-[#bd3227] block">
                تعدد اللغات والمحتوى
              </span>
              <h2 className="text-sm font-black text-[#231f20]">
                اختر لغة التحرير والتعديل للواجهة
              </h2>
            </div>

            <div className="flex items-center bg-[#F4EFE6] p-1 rounded-xl border border-[#e5e0d6]">
              <button
                type="button"
                onClick={() => setActiveLangTab('ar')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeLangTab === 'ar'
                    ? 'bg-[#231f20] text-white shadow-2xs'
                    : 'text-[#5C5A55] hover:text-[#231f20]'
                }`}
              >
                العربية
              </button>
              <button
                type="button"
                onClick={() => setActiveLangTab('fr')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeLangTab === 'fr'
                    ? 'bg-[#231f20] text-white shadow-2xs'
                    : 'text-[#5C5A55] hover:text-[#231f20]'
                }`}
              >
                Français
              </button>
              <button
                type="button"
                onClick={() => setActiveLangTab('en')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeLangTab === 'en'
                    ? 'bg-[#231f20] text-white shadow-2xs'
                    : 'text-[#5C5A55] hover:text-[#231f20]'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* Hero Section */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e5e0d6] shadow-2xs space-y-6">
            <div className="border-b border-[#E5E0D6] pb-4">
              <span className="text-2xs font-bold uppercase tracking-wider text-[#bd3227]">
                البانر والواجهة الرئيسية
              </span>
              <h3 className="text-lg font-black text-[#231f20]">قسم الترحيب (Hero Section)</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-2xs font-extrabold text-[#231f20] mb-1.5">
                  الوسم العلوي ({activeLangTab.toUpperCase()})
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5]"
                />
              </div>

              <div>
                <label className="block text-2xs font-extrabold text-[#231f20] mb-1.5">
                  شارة الجمعية ({activeLangTab.toUpperCase()})
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
                      activeLangTab === 'ar' ? 'badgeAr' : activeLangTab === 'fr' ? 'badgeFr' : 'badgeEn',
                      e.target.value
                    )
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-2xs font-extrabold text-[#231f20] mb-1.5">
                  العنوان الرئيسي الكبير ({activeLangTab.toUpperCase()})
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
                      activeLangTab === 'ar' ? 'titleAr' : activeLangTab === 'fr' ? 'titleFr' : 'titleEn',
                      e.target.value
                    )
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5] font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-2xs font-extrabold text-[#231f20] mb-1.5">
                  العنوان الفرعي الإيضاحي ({activeLangTab.toUpperCase()})
                </label>
                <textarea
                  rows={2}
                  value={
                    activeLangTab === 'ar'
                      ? config.hero.subtitleAr
                      : activeLangTab === 'fr'
                      ? config.hero.subtitleFr
                      : config.hero.subtitleEn
                  }
                  onChange={(e) =>
                    updateHero(
                      activeLangTab === 'ar' ? 'subtitleAr' : activeLangTab === 'fr' ? 'subtitleFr' : 'subtitleEn',
                      e.target.value
                    )
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-2xs font-extrabold text-[#231f20] mb-1.5">
                  النص التعريفي التفصيلي ({activeLangTab.toUpperCase()})
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
                      activeLangTab === 'ar' ? 'descriptionAr' : activeLangTab === 'fr' ? 'descriptionFr' : 'descriptionEn',
                      e.target.value
                    )
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5]"
                />
              </div>

              {/* Hero Image */}
              <div className="sm:col-span-2 pt-2 border-t border-[#E5E0D6]">
                <label className="block text-2xs font-extrabold text-[#231f20] mb-1.5">
                  صورة غلاف البانر (Hero Image)
                </label>
                <input
                  ref={heroFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleHeroImageUpload}
                  className="hidden"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={config.hero.imageUrl}
                    onChange={(e) => updateHero('imageUrl', e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#e5e0d6] text-xs font-mono bg-[#FAF8F5]"
                  />
                  <button
                    type="button"
                    disabled={uploadingImage}
                    onClick={() => heroFileInputRef.current?.click()}
                    className="px-4 py-2.5 bg-[#231f20] text-white text-xs font-bold rounded-xl hover:bg-[#d2a82b] active:scale-98 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-2xs"
                  >
                    <span>{uploadingImage ? '⏳' : '📁'}</span>
                    <span>{uploadingImage ? 'جاري التحميل...' : 'رفع صورة من الجهاز'}</span>
                  </button>
                </div>

                {config.hero.imageUrl && (
                  <div className="relative w-full h-36 mt-3 rounded-2xl overflow-hidden border border-[#e5e0d6]">
                    <ImageWithFallback
                      src={config.hero.imageUrl}
                      alt="Hero Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e5e0d6] shadow-2xs space-y-6">
            <div className="border-b border-[#E5E0D6] pb-4">
              <span className="text-2xs font-bold uppercase tracking-wider text-[#bd3227]">
                أرقام الأثر الثقافي
              </span>
              <h3 className="text-lg font-black text-[#231f20]">
                المؤشرات الثلاثة الكبرى (Impact Metrics)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {(config.stats || []).map((stat, idx) => (
                <div key={stat.id || idx} className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={stat.icon}
                      onChange={(e) => updateStat(idx, { icon: e.target.value })}
                      className="w-12 px-2 py-1.5 text-center text-sm rounded-lg border border-[#e5e0d6] bg-white"
                    />
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => updateStat(idx, { value: e.target.value })}
                      className="flex-1 px-3 py-1.5 text-sm font-black text-[#231f20] rounded-lg border border-[#e5e0d6] bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-3xs font-bold text-[#5C5A55] mb-1">
                      الوصف ({activeLangTab.toUpperCase()})
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
                        updateStat(idx, {
                          [activeLangTab === 'ar'
                            ? 'labelAr'
                            : activeLangTab === 'fr'
                            ? 'labelFr'
                            : 'labelEn']: e.target.value,
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-[#e5e0d6] text-xs bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pillars Section */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e5e0d6] shadow-2xs space-y-6">
            <div className="border-b border-[#E5E0D6] pb-4">
              <span className="text-2xs font-bold uppercase tracking-wider text-[#bd3227]">
                أوجه صرف وتوجيه التبرعات
              </span>
              <h3 className="text-lg font-black text-[#231f20]">
                محاور التأثير الثقافي (Impact Pillars)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {(config.pillars || []).map((p, idx) => (
                <div key={p.id || idx} className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={p.icon}
                      onChange={(e) => updatePillar(idx, { icon: e.target.value })}
                      className="w-10 px-2 py-1 text-center text-sm rounded-lg border border-[#e5e0d6] bg-white"
                    />
                    <input
                      type="text"
                      value={
                        activeLangTab === 'ar'
                          ? p.titleAr
                          : activeLangTab === 'fr'
                          ? p.titleFr
                          : p.titleEn
                      }
                      onChange={(e) =>
                        updatePillar(idx, {
                          [activeLangTab === 'ar'
                            ? 'titleAr'
                            : activeLangTab === 'fr'
                            ? 'titleFr'
                            : 'titleEn']: e.target.value,
                        })
                      }
                      className="flex-1 px-3 py-1.5 text-xs font-bold text-[#231f20] rounded-lg border border-[#e5e0d6] bg-white"
                    />
                  </div>

                  <textarea
                    rows={2}
                    value={
                      activeLangTab === 'ar'
                        ? p.descriptionAr
                        : activeLangTab === 'fr'
                        ? p.descriptionFr
                        : p.descriptionEn
                    }
                    onChange={(e) =>
                      updatePillar(idx, {
                        [activeLangTab === 'ar'
                          ? 'descriptionAr'
                          : activeLangTab === 'fr'
                          ? 'descriptionFr'
                          : 'descriptionEn']: e.target.value,
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-[#e5e0d6] text-xs bg-white outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Legal Transparency FAQs */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e5e0d6] shadow-2xs space-y-6">
            <div className="border-b border-[#E5E0D6] pb-4">
              <span className="text-2xs font-bold uppercase tracking-wider text-[#bd3227]">
                الشفافية والامتثال القانوني
              </span>
              <h3 className="text-lg font-black text-[#231f20]">
                أسئلة الشفافية والوصل الضريبي والقانوني
              </h3>
            </div>

            <div className="space-y-4">
              {(config.transparencyFaqs || []).map((faq, idx) => (
                <div key={faq.id || idx} className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] space-y-2">
                  <input
                    type="text"
                    value={
                      activeLangTab === 'ar'
                        ? faq.questionAr
                        : activeLangTab === 'fr'
                        ? faq.questionFr
                        : faq.questionEn
                    }
                    onChange={(e) =>
                      updateFaq(idx, {
                        [activeLangTab === 'ar'
                          ? 'questionAr'
                          : activeLangTab === 'fr'
                          ? 'questionFr'
                          : 'questionEn']: e.target.value,
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-[#e5e0d6] text-xs font-bold bg-white"
                  />
                  <textarea
                    rows={3}
                    value={
                      activeLangTab === 'ar'
                        ? faq.answerAr
                        : activeLangTab === 'fr'
                        ? faq.answerFr
                        : faq.answerEn
                    }
                    onChange={(e) =>
                      updateFaq(idx, {
                        [activeLangTab === 'ar'
                          ? 'answerAr'
                          : activeLangTab === 'fr'
                          ? 'answerFr'
                          : 'answerEn']: e.target.value,
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-[#e5e0d6] text-xs bg-white"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Patronage Desk & Contact CTA */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e5e0d6] shadow-2xs space-y-5">
            <div className="border-b border-[#E5E0D6] pb-3">
              <span className="text-2xs font-extrabold uppercase tracking-widest text-[#bd3227]">
                مكتب رعاية المشاريع والتواصل
              </span>
              <h3 className="text-lg font-black text-[#231f20]">
                صندوق الاتصال الخاص بالجهات الراعية والشركاء
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-2xs font-bold text-[#5C5A55] mb-1">
                  شارة الترويسة ({activeLangTab.toUpperCase()})
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
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs bg-white"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-[#5C5A55] mb-1">
                  العنوان الرئيسي ({activeLangTab.toUpperCase()})
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
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs font-bold bg-white"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-[#5C5A55] mb-1">
                  الوصف التفصيلي ({activeLangTab.toUpperCase()})
                </label>
                <textarea
                  rows={2}
                  value={
                    activeLangTab === 'ar'
                      ? config.cta.descriptionAr
                      : activeLangTab === 'fr'
                      ? config.cta.descriptionFr
                      : config.cta.descriptionEn
                  }
                  onChange={(e) =>
                    updateCta(
                      activeLangTab === 'ar'
                        ? 'descriptionAr'
                        : activeLangTab === 'fr'
                        ? 'descriptionFr'
                        : 'descriptionEn',
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-2xs font-bold text-[#5C5A55] mb-1">
                    البريد الإلكتروني المخصص للرعاية
                  </label>
                  <input
                    type="email"
                    value={config.cta.email}
                    onChange={(e) => updateCta('email', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs bg-white font-mono"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-bold text-[#5C5A55] mb-1">
                    الهاتف المباشر لأمين المال أو مكتب الرعاية
                  </label>
                  <input
                    type="text"
                    value={config.cta.phone}
                    onChange={(e) => updateCta('phone', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs bg-white font-mono"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: INTEGRATION GUIDE (HOW-TO FOR CMI & PAYMENT)       */}
      {/* ========================================================= */}
      {activeTab === 'integration-guide' && (
        <div className="space-y-8">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e5e0d6] shadow-2xs space-y-6">
            <div className="border-b border-[#E5E0D6] pb-4">
              <span className="text-2xs font-extrabold uppercase tracking-widest text-[#bd3227]">
                دليل الربط والتفعيل الرسمي
              </span>
              <h2 className="text-xl font-black text-[#231f20] mt-1">
                دليل إدماج بوابة الأداء CMI (Centre Monétique Interbancaire) للجمعية
              </h2>
              <p className="text-xs text-[#5C5A55] mt-1">
                خطوات واضحة لتفعيل الدفع الإلكتروني بالبطاقات البنكية المغربية والدولية بما يتوافق مع القوانين المنظمة للعمل الجمعوي.
              </p>
            </div>

            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#231f20] text-white flex items-center justify-center font-bold text-xs">
                  1
                </span>
                <h3 className="text-sm font-black text-[#231f20]">
                  فتح ملف تاجر إلكتروني لدى مركز النقديات CMI
                </h3>
              </div>
              <p className="text-xs text-[#5C5A55] leading-relaxed">
                تتقدم الجمعية بطلب فتح حساب تاجر (Contrat de Vente à Distance) لدى CMI بالتعاون مع بنكها (Attijariwafa Bank، البنك الشعبي، إلخ).
              </p>
              <div className="pt-2">
                <span className="text-3xs font-extrabold uppercase text-[#231f20] block mb-1">
                  الوثائق القانونية المطلوبة:
                </span>
                <ul className="text-xs text-[#5C5A55] space-y-1 list-disc list-inside">
                  <li>نسخة من القانون الأساسي للجمعية ومحضر آخر جمع عام لانتخاب المكتب التنفيذي.</li>
                  <li>وصل الإيداع القانوني النهائي المسلم من السلطات المحلية المختصة.</li>
                  <li>شهادة بنكية للحساب الجاري (Attestation de RIB) باسم الجمعية.</li>
                  <li>قرار المكتب التنفيذي بتفويض رئيس الجمعية وأمين المال لتوقيع عقد CMI.</li>
                </ul>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#231f20] text-white flex items-center justify-center font-bold text-xs">
                  2
                </span>
                <h3 className="text-sm font-black text-[#231f20]">
                  الحصول على المفاتيح وضبط الإعدادات في لوحة التحكم
                </h3>
              </div>
              <p className="text-xs text-[#5C5A55] leading-relaxed">
                بعد توقيع العقد، يزودكم CMI بمعرف التاجر <strong>(Merchant ID)</strong> والمفتاح السري المشترك <strong>(Store Key)</strong>. أدخلهما في لسان تبويب &quot;بوابة الأداء والحساب البنكي&quot; أعلاه.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#231f20] text-white flex items-center justify-center font-bold text-xs">
                  3
                </span>
                <h3 className="text-sm font-black text-[#231f20]">
                  عناوين الروابط المرجعية (Callback & Webhook URLs)
                </h3>
              </div>
              <p className="text-xs text-[#5C5A55] leading-relaxed">
                قدم هذه الروابط المجهزة تلقائياً لفريق الدعم التقني في CMI لإتمام التفعيل:
              </p>
              <div className="space-y-2 text-xs font-mono">
                <div className="p-3 rounded-xl bg-white border border-[#e5e0d6]">
                  <span className="text-3xs text-[#5C5A55] block">رابط الإشعار الآمن المباشر (Server-to-Server Callback):</span>
                  <span className="text-[#231f20] font-bold">https://amycc.org/api/donations/cmi-callback</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#e5e0d6]">
                  <span className="text-3xs text-[#5C5A55] block">رابط العودة عند نجاح المعاملة (OK Return URL):</span>
                  <span className="text-[#231f20] font-bold">https://amycc.org/ar/support?status=success</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#e5e0d6]">
                  <span className="text-3xs text-[#5C5A55] block">رابط العودة عند إلغاء أو فشل المعاملة (Fail Return URL):</span>
                  <span className="text-[#231f20] font-bold">https://amycc.org/ar/support?status=failed</span>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#231f20] text-white flex items-center justify-center font-bold text-xs">
                  4
                </span>
                <h3 className="text-sm font-black text-[#231f20]">
                  بطاقات الاختبار في بيئة التجربة (CMI Sandbox Test Cards)
                </h3>
              </div>
              <p className="text-xs text-[#5C5A55] leading-relaxed">
                في بيئة الاختبار التجريبية (Test Mode)، يمكنك استخدام بطاقات CMI الوهمية:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-white border border-[#e5e0d6]">
                  <span className="text-3xs text-[#5C5A55] block">بطاقة مغربية ناجحة (Visa/CMI):</span>
                  <span className="text-[#231f20] font-bold">4000 0000 0000 0001</span>
                  <span className="text-3xs text-[#5C5A55] block mt-0.5">Exp: 12/28 | CVV: 123 | OTP: 123456</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#e5e0d6]">
                  <span className="text-3xs text-[#5C5A55] block">بطاقة مرفوضة (رصيد غير كاف):</span>
                  <span className="text-[#231f20] font-bold">4000 0000 0000 0002</span>
                  <span className="text-3xs text-[#5C5A55] block mt-0.5">Exp: 12/28 | CVV: 123</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Save Action Bar */}
      <div className="sticky bottom-4 z-40 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-[#e5e0d6] shadow-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-[#231f20]">
            لوحة إعدادات الدعم وبوابات الأداء جاهزة للحفظ
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setConfig(initialConfig)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-[#5C5A55] hover:text-[#231f20] transition-colors cursor-pointer"
          >
            إلغاء التغييرات
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={savingConfig}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#231f20] text-white hover:bg-[#d2a82b] active:scale-98 transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm cursor-pointer"
          >
            {savingConfig ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>جاري الحفظ...</span>
              </>
            ) : (
              <>
                <span>💾</span>
                <span>حفظ جميع التغييرات</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: VIEW DONATION DETAILS                            */}
      {/* ========================================================= */}
      {viewingRecord && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#e5e0d6] shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#E5E0D6] pb-4">
              <div>
                <span className="text-2xs font-extrabold uppercase tracking-widest text-[#bd3227]">
                  بطاقة إشعار الدعم والمساهمة
                </span>
                <h3 className="text-xl font-black text-[#231f20]">{viewingRecord.donor_name}</h3>
              </div>
              <button
                onClick={() => setViewingRecord(null)}
                className="w-8 h-8 rounded-full bg-[#FAF8F5] hover:bg-[#F4EFE6] flex items-center justify-center text-sm font-bold text-[#231f20] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6]">
                <span className="text-3xs text-[#5C5A55] font-bold block mb-1">البريد الإلكتروني</span>
                <a href={`mailto:${viewingRecord.donor_email}`} className="font-bold text-[#231f20] hover:underline font-mono">
                  {viewingRecord.donor_email}
                </a>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6]">
                <span className="text-3xs text-[#5C5A55] font-bold block mb-1">الهاتف للتواصل</span>
                <span className="font-bold text-[#231f20] font-mono" dir="ltr">
                  {viewingRecord.donor_phone || 'غير مسجل'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6]">
                <span className="text-3xs text-[#5C5A55] font-bold block mb-1">نوع المساهمة</span>
                <span className="font-bold text-[#231f20] capitalize">
                  {viewingRecord.support_type.replace('_', ' ')}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6]">
                <span className="text-3xs text-[#5C5A55] font-bold block mb-1">المبلغ المصرح به</span>
                <span className="font-black text-[#bd3227] text-sm">
                  {viewingRecord.amount ? `${viewingRecord.amount.toLocaleString()} ${viewingRecord.currency}` : 'مساهمة عينية'}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] space-y-2">
              <span className="text-2xs font-extrabold text-[#231f20] block">
                ملاحظات وتفاصيل المبادرة:
              </span>
              <p className="text-xs text-[#231f20] leading-relaxed whitespace-pre-line font-medium">
                {viewingRecord.notes || 'لا توجد ملاحظات إضافية.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E5E0D6]">
              <div className="flex items-center gap-2">
                <span className="text-2xs font-bold text-[#5C5A55]">الحالة:</span>
                <span
                  className={`px-3 py-1 rounded-full text-2xs font-bold ${
                    viewingRecord.status === 'confirmed' || viewingRecord.status === 'approved'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {viewingRecord.status === 'confirmed' || viewingRecord.status === 'approved'
                    ? 'مؤكد ومستلم'
                    : 'قيد الانتظار'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {viewingRecord.status !== 'confirmed' && (
                  <button
                    disabled={processingId === viewingRecord.id}
                    onClick={() => handleStatusChange(viewingRecord.id, 'confirmed')}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-all cursor-pointer shadow-2xs"
                  >
                    تأكيد استلام المساهمة
                  </button>
                )}

                <button
                  disabled={processingId === viewingRecord.id}
                  onClick={() => handleDeleteDonation(viewingRecord.id, viewingRecord.donor_name)}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  حذف
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: ADD / EDIT PATRONAGE PACKAGE                     */}
      {/* ========================================================= */}
      {(isAddingPackage || editingPackage) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#e5e0d6] shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#E5E0D6] pb-4">
              <div>
                <span className="text-2xs font-extrabold uppercase tracking-widest text-[#bd3227]">
                  {editingPackage ? 'تعديل باقة رعاية' : 'إضافة باقة رعاية جديدة'}
                </span>
                <h3 className="text-xl font-black text-[#231f20]">
                  {editingPackage ? packageForm.nameAr || 'تعديل الباقة' : 'باقة رعاية جديدة'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setEditingPackage(null)
                  setIsAddingPackage(false)
                }}
                className="w-8 h-8 rounded-full bg-[#FAF8F5] hover:bg-[#F4EFE6] flex items-center justify-center text-sm font-bold text-[#231f20] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-2xs font-extrabold text-[#231f20] mb-1">
                    اسم الباقة (العربية) *
                  </label>
                  <input
                    type="text"
                    value={packageForm.nameAr}
                    onChange={(e) => setPackageForm((p) => ({ ...p, nameAr: e.target.value }))}
                    placeholder="مثال: راعي محترفات الشباب"
                    className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5] font-bold"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-extrabold text-[#231f20] mb-1">
                    (Français)
                  </label>
                  <input
                    type="text"
                    value={packageForm.nameFr}
                    onChange={(e) => setPackageForm((p) => ({ ...p, nameFr: e.target.value }))}
                    placeholder="Ex: Parrain des Ateliers"
                    className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5]"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-extrabold text-[#231f20] mb-1">
                    (English)
                  </label>
                  <input
                    type="text"
                    value={packageForm.nameEn}
                    onChange={(e) => setPackageForm((p) => ({ ...p, nameEn: e.target.value }))}
                    placeholder="Ex: Youth Workshops Patron"
                    className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-2xs font-extrabold text-[#231f20] mb-1">
                    المبلغ (بالدرهم)
                  </label>
                  <input
                    type="number"
                    value={packageForm.amount}
                    onChange={(e) => setPackageForm((p) => ({ ...p, amount: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5] font-bold text-[#bd3227]"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-extrabold text-[#231f20] mb-1">
                    العملة
                  </label>
                  <input
                    type="text"
                    value={packageForm.currency}
                    onChange={(e) => setPackageForm((p) => ({ ...p, currency: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-2xs font-extrabold text-[#231f20] mb-1">
                    النطاق والمدة (العربية)
                  </label>
                  <input
                    type="text"
                    value={packageForm.periodAr}
                    onChange={(e) => setPackageForm((p) => ({ ...p, periodAr: e.target.value }))}
                    placeholder="موسم ثقافي كامل"
                    className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-2xs font-extrabold text-[#231f20] mb-1">
                  نبذة عن باقة الرعاية (العربية)
                </label>
                <textarea
                  rows={2}
                  value={packageForm.descriptionAr}
                  onChange={(e) => setPackageForm((p) => ({ ...p, descriptionAr: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5]"
                />
              </div>

              <div>
                <label className="block text-2xs font-extrabold text-[#231f20] mb-1">
                  الأثر الميداني المباشر الذي تحققه (العربية)
                </label>
                <input
                  type="text"
                  value={packageForm.impactAr}
                  onChange={(e) => setPackageForm((p) => ({ ...p, impactAr: e.target.value }))}
                  placeholder="مثال: إنتاج عرض مسرحي ختامي مجاني يستفيد منه 25 شاباً"
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5]"
                />
              </div>

              <div>
                <label className="block text-2xs font-extrabold text-[#231f20] mb-1">
                  الامتيازات الممنوحة للراعي (العربية - سطر لكل امتياز)
                </label>
                <textarea
                  rows={3}
                  value={packagePrivilegesArText}
                  onChange={(e) => setPackagePrivilegesArText(e.target.value)}
                  placeholder="إدراج الشعار في المطبوعات الرسمية&#10;دعوات VIP لحضور العروض&#10;وصل إبراء مالي وقانوني معتمد"
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-[#231f20] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={packageForm.recommended || false}
                    onChange={(e) => setPackageForm((p) => ({ ...p, recommended: e.target.checked }))}
                    className="rounded text-[#bd3227] focus:ring-[#bd3227]"
                  />
                  <span>تمييز كـ &quot;الباقة الأكثر طلباً&quot; ⭐</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-[#231f20] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={packageForm.active !== false}
                    onChange={(e) => setPackageForm((p) => ({ ...p, active: e.target.checked }))}
                    className="rounded text-[#231f20] focus:ring-[#231f20]"
                  />
                  <span>تفعيل الباقة في الواجهة العامة</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E0D6]">
              <button
                type="button"
                onClick={() => {
                  setEditingPackage(null)
                  setIsAddingPackage(false)
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#5C5A55] hover:text-[#231f20] transition-colors cursor-pointer"
              >
                إلغاء
              </button>

              <button
                type="button"
                onClick={handleSavePackageModal}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#231f20] text-white hover:bg-[#d2a82b] active:scale-98 transition-all shadow-2xs cursor-pointer"
              >
                تأكيد الباقة في القائمة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

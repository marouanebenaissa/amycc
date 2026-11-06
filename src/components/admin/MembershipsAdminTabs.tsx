'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'
import type {
  MembershipPageConfig,
  MembershipTierConfig,
  MembershipStatItem,
  MembershipBenefitItem,
  MembershipStepItem,
} from '@/lib/settings'
import { CsvExportButton } from '@/components/admin/CsvExportButton'
import { saveMembershipPageConfiguration } from '@/lib/actions/admin'
import { useAdminLocale } from './AdminLocaleContext'

export interface MembershipApplicationRow {
  id: string
  full_name: string
  email: string
  phone: string
  city: string
  profession?: string | null
  interests?: string[] | null
  motivation: string
  status: string
  created_at: string
}

interface MembershipsAdminTabsProps {
  initialApplications: MembershipApplicationRow[]
  initialConfig: MembershipPageConfig
  onUpdateStatus?: (id: string, status: string) => Promise<void>
  onDeleteApplication?: (id: string) => Promise<void>
}

const MEMBERSHIP_STRINGS = {
  ar: {
    badge: 'منظومة تدبير شؤون الأعضاء والانخراط',
    title: 'إدارة العضوية والانخراط السنوي',
    subtitle: 'متابعة طلبات الانخراط الواردة، مراجعة فئات وبطاقات العضوية، وتخصيص محتوى واجهة العضوية العامة باللغات الثلاث.',
    previewPage: 'معاينة الصفحة العامة',
    saveChanges: 'حفظ التعديلات',
    saving: 'جاري الحفظ...',
    tabApplications: 'طلبات الانخراط الواردة',
    tabTiers: 'فئات وبطاقات الانخراط',
    tabCms: 'تخصيص الواجهة (CMS)',
    searchPlaceholder: 'بحث بالاسم، البريد، الهاتف، أو المدينة...',
    filterAll: 'كافة الحالات',
    statusPending: 'قيد المراجعة',
    statusApproved: 'مقبول ومعتمد',
    statusRejected: 'مرفوض',
    exportCsv: 'تصدير البيانات (CSV)',
    colApplicant: 'المترشح للانخراط',
    colContact: 'بيانات التواصل',
    colCity: 'المدينة والمهنة',
    colMotivation: 'رسالة الدوافع',
    colStatus: 'الحالة الإدارية',
    colActions: 'الإجراءات',
    viewDetails: 'عرض التفاصيل',
    delete: 'حذف',
    noAppsFound: 'لا توجد طلبات انخراط واردة حالياً.',
  },
  fr: {
    badge: 'Système de Gestion des Adhésions & Membres',
    title: 'Gestion des Adhésions & Cartes Annuelles',
    subtitle: 'Traitement des demandes d\'adhésion, gestion des formules de cartes et personnalisation intégrale de la page.',
    previewPage: 'Voir la Page Publique',
    saveChanges: 'Enregistrer',
    saving: 'Enregistrement...',
    tabApplications: 'Demandes d\'Adhésion',
    tabTiers: 'Formules & Cartes d\'Adhésion',
    tabCms: 'Configuration CMS',
    searchPlaceholder: 'Rechercher nom, email, téléphone, ville...',
    filterAll: 'Tous les statuts',
    statusPending: 'En attente',
    statusApproved: 'Approuvé',
    statusRejected: 'Refusé',
    exportCsv: 'Exporter (CSV)',
    colApplicant: 'Candidat / Adhérent',
    colContact: 'Coordonnées',
    colCity: 'Ville & Profession',
    colMotivation: 'Motivation',
    colStatus: 'Statut',
    colActions: 'Actions',
    viewDetails: 'Détails',
    delete: 'Supprimer',
    noAppsFound: 'Aucune demande d\'adhésion trouvée.',
  },
  en: {
    badge: 'Member Services & Annual Membership Engine',
    title: 'Annual Membership & Member Services',
    subtitle: 'Process annual membership submissions, curate membership card tiers, and configure public page CMS content.',
    previewPage: 'Visit Public Page',
    saveChanges: 'Save Changes',
    saving: 'Saving...',
    tabApplications: 'Incoming Applications',
    tabTiers: 'Membership Tiers & Cards',
    tabCms: 'Page CMS Settings',
    searchPlaceholder: 'Search by applicant name, email, city...',
    filterAll: 'All Statuses',
    statusPending: 'Pending',
    statusApproved: 'Approved',
    statusRejected: 'Rejected',
    exportCsv: 'Export (CSV)',
    colApplicant: 'Applicant',
    colContact: 'Contact Info',
    colCity: 'City & Profession',
    colMotivation: 'Motivation',
    colStatus: 'Status',
    colActions: 'Actions',
    viewDetails: 'View Details',
    delete: 'Delete',
    noAppsFound: 'No membership applications found.',
  },
}

export function MembershipsAdminTabs({
  initialApplications,
  initialConfig,
  onUpdateStatus,
  onDeleteApplication,
}: MembershipsAdminTabsProps) {
  const router = useRouter()
  const { locale, dir } = useAdminLocale()
  const tr = MEMBERSHIP_STRINGS[locale] || MEMBERSHIP_STRINGS.ar

  // Tabs: 'applications' | 'tiers' | 'page-settings'
  const [activeTab, setActiveTab] = useState<'applications' | 'tiers' | 'page-settings'>('applications')

  // CMS State
  const [config, setConfig] = useState<MembershipPageConfig>(initialConfig)
  const [prevInitialConfig, setPrevInitialConfig] = useState<MembershipPageConfig>(initialConfig)
  if (prevInitialConfig !== initialConfig) {
    setPrevInitialConfig(initialConfig)
    setConfig(initialConfig)
  }

  const [activeLangTab, setActiveLangTab] = useState<'ar' | 'fr' | 'en'>('ar')

  // Applications State & Filters
  const [applications, setApplications] = useState<MembershipApplicationRow[]>(initialApplications)
  const [searchApplication, setSearchApplication] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [viewingApp, setViewingApp] = useState<MembershipApplicationRow | null>(null)
  const [processingAppId, setProcessingAppId] = useState<string | null>(null)

  // Tier Modal (Add / Edit)
  const [editingTier, setEditingTier] = useState<MembershipTierConfig | null>(null)
  const [isAddingTier, setIsAddingTier] = useState(false)
  const [tierForm, setTierForm] = useState<MembershipTierConfig>({
    id: '',
    nameAr: '',
    nameFr: '',
    nameEn: '',
    badgeAr: '',
    badgeFr: '',
    badgeEn: '',
    feeAr: '200 درهم',
    feeFr: '200 MAD',
    feeEn: '200 MAD',
    periodAr: 'سنوياً',
    periodFr: 'Par an',
    periodEn: 'Annual',
    descriptionAr: '',
    descriptionFr: '',
    descriptionEn: '',
    benefitsAr: [],
    benefitsFr: [],
    benefitsEn: [],
    recommended: false,
    active: true,
    order: 1,
  })

  // Multiline benefit helpers for tier form modal
  const [tierBenefitsArText, setTierBenefitsArText] = useState('')
  const [tierBenefitsFrText, setTierBenefitsFrText] = useState('')
  const [tierBenefitsEnText, setTierBenefitsEnText] = useState('')

  // Loading & Feedback
  const [savingConfig, setSavingConfig] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const heroFileInputRef = useRef<HTMLInputElement>(null)

  // -------------------------------------------------------------
  // Applications Handlers & Metrics
  // -------------------------------------------------------------
  const filteredApplications = applications.filter((app) => {
    const q = searchApplication.toLowerCase().trim()
    const matchesSearch =
      !q ||
      app.full_name.toLowerCase().includes(q) ||
      app.email.toLowerCase().includes(q) ||
      app.phone.toLowerCase().includes(q) ||
      app.city.toLowerCase().includes(q) ||
      (app.profession && app.profession.toLowerCase().includes(q)) ||
      (app.motivation && app.motivation.toLowerCase().includes(q))

    const matchesStatus = statusFilter === 'all' || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalAppsCount = applications.length
  const pendingAppsCount = applications.filter((a) => a.status === 'pending').length
  const approvedAppsCount = applications.filter((a) => a.status === 'approved').length
  const rejectedAppsCount = applications.filter((a) => a.status === 'rejected').length

  async function handleStatusChange(id: string, newStatus: string) {
    setProcessingAppId(id)
    try {
      if (onUpdateStatus) {
        await onUpdateStatus(id, newStatus)
      } else {
        const res = await fetch(`/api/admin/applications/status`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ table: 'membership_applications', id, status: newStatus }),
        })
        if (!res.ok) throw new Error('Status update failed')
      }
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
      )
      if (viewingApp?.id === id) {
        setViewingApp((prev) => (prev ? { ...prev, status: newStatus } : null))
      }
      setFeedback({
        type: 'success',
        message: 'تم تحديث حالة طلب الانخراط بنجاح.',
      })
    } catch {
      setFeedback({
        type: 'error',
        message: 'حدث خطأ أثناء محاولة تحديث الحالة.',
      })
    } finally {
      setProcessingAppId(null)
    }
  }

  async function handleDeleteApp(id: string, applicantName: string) {
    if (!confirm(`هل أنت متأكد من حذف طلب الانخراط المقدم من "${applicantName}" نهائياً؟`)) {
      return
    }

    setProcessingAppId(id)
    try {
      if (onDeleteApplication) {
        await onDeleteApplication(id)
      } else {
        const res = await fetch(`/api/admin/applications/delete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ table: 'membership_applications', id }),
        })
        if (!res.ok) throw new Error('Delete failed')
      }
      setApplications((prev) => prev.filter((a) => a.id !== id))
      if (viewingApp?.id === id) setViewingApp(null)
      setFeedback({
        type: 'success',
        message: 'تم حذف طلب الانخراط بنجاح.',
      })
    } catch {
      setFeedback({
        type: 'error',
        message: 'فشل حذف طلب الانخراط.',
      })
    } finally {
      setProcessingAppId(null)
    }
  }

  const exportData = applications.map((app) => ({
    ID: app.id,
    FullName: app.full_name,
    Email: app.email,
    Phone: app.phone,
    City: app.city,
    Profession: app.profession || '',
    Interests: (app.interests || []).join('; '),
    Motivation: app.motivation,
    Status: app.status,
    AppliedAt: app.created_at,
  }))

  // -------------------------------------------------------------
  // Tiers Modal Logic
  // -------------------------------------------------------------
  function openAddTierModal() {
    setIsAddingTier(true)
    setEditingTier(null)
    setTierForm({
      id: `tier-${Date.now()}`,
      nameAr: '',
      nameFr: '',
      nameEn: '',
      badgeAr: '',
      badgeFr: '',
      badgeEn: '',
      feeAr: '150 درهم',
      feeFr: '150 MAD',
      feeEn: '150 MAD',
      periodAr: 'سنوياً',
      periodFr: 'Par an',
      periodEn: 'Annual',
      descriptionAr: '',
      descriptionFr: '',
      descriptionEn: '',
      benefitsAr: [],
      benefitsFr: [],
      benefitsEn: [],
      recommended: false,
      active: true,
      order: (config.tiers || []).length + 1,
    })
    setTierBenefitsArText('')
    setTierBenefitsFrText('')
    setTierBenefitsEnText('')
  }

  function openEditTierModal(tier: MembershipTierConfig) {
    setEditingTier(tier)
    setIsAddingTier(false)
    setTierForm({ ...tier })
    setTierBenefitsArText((tier.benefitsAr || []).join('\n'))
    setTierBenefitsFrText((tier.benefitsFr || []).join('\n'))
    setTierBenefitsEnText((tier.benefitsEn || []).join('\n'))
  }

  function handleSaveTierModal() {
    if (!tierForm.nameAr.trim()) {
      alert('يرجى إدخال مسمى الفئة بالعربية.')
      return
    }

    const benefitsAr = tierBenefitsArText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
    const benefitsFr = tierBenefitsFrText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
    const benefitsEn = tierBenefitsEnText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)

    const updatedTier: MembershipTierConfig = {
      ...tierForm,
      benefitsAr,
      benefitsFr,
      benefitsEn,
    }

    let nextTiers: MembershipTierConfig[]
    if (editingTier) {
      nextTiers = (config.tiers || []).map((t) => (t.id === updatedTier.id ? updatedTier : t))
    } else {
      nextTiers = [...(config.tiers || []), updatedTier]
    }

    setConfig((prev) => ({
      ...prev,
      tiers: nextTiers,
    }))

    setEditingTier(null)
    setIsAddingTier(false)
    setFeedback({
      type: 'success',
      message: 'تم تحديث قائمة فئات العضوية في الواجهة. تذكر الضغط على "حفظ جميع التغييرات" لتثبيتها.',
    })
  }

  function handleDeleteTier(id: string) {
    if (!confirm('هل أنت متأكد من حذف هذه الفئة من العضوية؟')) return
    setConfig((prev) => ({
      ...prev,
      tiers: (prev.tiers || []).filter((t) => t.id !== id),
    }))
    setFeedback({
      type: 'success',
      message: 'تم حذف الفئة. يرجى الضغط على "حفظ جميع التغييرات" لتأكيد الحفظ على المنصة.',
    })
  }

  function handleToggleTierActive(id: string) {
    setConfig((prev) => ({
      ...prev,
      tiers: (prev.tiers || []).map((t) => (t.id === id ? { ...t, active: !t.active } : t)),
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
          message: 'تم رفع صورة واجهة العضوية بنجاح.',
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
      const res = await saveMembershipPageConfiguration(config)
      if (!res.success) {
        throw new Error(res.error || 'فشل حفظ الإعدادات')
      }

      setFeedback({
        type: 'success',
        message: 'تم حفظ كافة إعدادات وفئات صفحة العضوية بنجاح وتحديث الواجهة العامة.',
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
  function updateHero<K extends keyof MembershipPageConfig['hero']>(
    field: K,
    val: MembershipPageConfig['hero'][K]
  ) {
    setConfig((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        [field]: val,
      },
    }))
  }

  function updateStat(index: number, patch: Partial<MembershipStatItem>) {
    setConfig((prev) => {
      const nextStats = [...prev.stats]
      nextStats[index] = { ...nextStats[index], ...patch }
      return { ...prev, stats: nextStats }
    })
  }

  function updateBenefit(index: number, patch: Partial<MembershipBenefitItem>) {
    setConfig((prev) => {
      const next = [...prev.benefits]
      next[index] = { ...next[index], ...patch }
      return { ...prev, benefits: next }
    })
  }

  function updateStep(index: number, patch: Partial<MembershipStepItem>) {
    setConfig((prev) => {
      const next = [...prev.steps]
      next[index] = { ...next[index], ...patch }
      return { ...prev, steps: next }
    })
  }

  function updateCta<K extends keyof MembershipPageConfig['cta']>(
    field: K,
    val: MembershipPageConfig['cta'][K]
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
    <div className="space-y-8" dir={dir}>
      {/* Top Header & Main Navigation Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e5e0d6] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#231f20] animate-pulse" />
            <span className="text-2xs font-extrabold tracking-widest uppercase text-[#bd3227]">
              {tr.badge}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#231f20]">
            {tr.title}
          </h1>
          <p className="text-xs text-[#5C5A55] mt-1 font-medium max-w-2xl">
            {tr.subtitle}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <a
            href={`/${locale}/membership`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl text-xs font-bold text-[#231f20] bg-white border border-[#231f20]/30 hover:bg-[#231f20]/5 transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <span>{tr.previewPage}</span>
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
                <span>{tr.saving}</span>
              </>
            ) : (
              <>
                <span>💾</span>
                <span>{tr.saveChanges}</span>
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
          onClick={() => setActiveTab('applications')}
          className={`flex-1 min-w-[160px] py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'applications'
              ? 'bg-white text-[#231f20] shadow-2xs'
              : 'text-[#5C5A55] hover:text-[#231f20]'
          }`}
        >
          <span>📋</span>
          <span>{tr.tabApplications}</span>
          <span
            className={`px-2 py-0.5 rounded-full text-3xs font-black ${
              activeTab === 'applications'
                ? 'bg-[#231f20] text-white'
                : 'bg-[#e5e0d6] text-[#5C5A55]'
            }`}
          >
            {totalAppsCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('tiers')}
          className={`flex-1 min-w-[160px] py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'tiers'
              ? 'bg-white text-[#231f20] shadow-2xs'
              : 'text-[#5C5A55] hover:text-[#231f20]'
          }`}
        >
          <span>💳</span>
          <span>{tr.tabTiers}</span>
          <span
            className={`px-2 py-0.5 rounded-full text-3xs font-black ${
              activeTab === 'tiers' ? 'bg-[#bd3227] text-white' : 'bg-[#e5e0d6] text-[#5C5A55]'
            }`}
          >
            {(config.tiers || []).length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('page-settings')}
          className={`flex-1 min-w-[160px] py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'page-settings'
              ? 'bg-white text-[#231f20] shadow-2xs'
              : 'text-[#5C5A55] hover:text-[#231f20]'
          }`}
        >
          <span>🎨</span>
          <span>{tr.tabCms}</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: APPLICATIONS LIST */}
      {/* ========================================================= */}
      {activeTab === 'applications' && (
        <div className="space-y-6">
          {/* Metrics Counters */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-[#e5e0d6] shadow-2xs flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-[#231f20]/10 text-[#231f20] flex items-center justify-center text-lg font-bold">
                📥
              </span>
              <div>
                <div className="text-xl font-black text-[#231f20]">{totalAppsCount}</div>
                <div className="text-3xs text-[#5C5A55] font-bold">{tr.tabApplications}</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#e5e0d6] shadow-2xs flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center text-lg font-bold">
                ⏳
              </span>
              <div>
                <div className="text-xl font-black text-amber-700">{pendingAppsCount}</div>
                <div className="text-3xs text-[#5C5A55] font-bold">{tr.statusPending}</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#e5e0d6] shadow-2xs flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center text-lg font-bold">
                ✅
              </span>
              <div>
                <div className="text-xl font-black text-emerald-700">{approvedAppsCount}</div>
                <div className="text-3xs text-[#5C5A55] font-bold">{tr.statusApproved}</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#e5e0d6] shadow-2xs flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-red-500/10 text-red-700 flex items-center justify-center text-lg font-bold">
                🛑
              </span>
              <div>
                <div className="text-xl font-black text-red-700">{rejectedAppsCount}</div>
                <div className="text-3xs text-[#5C5A55] font-bold">{tr.statusRejected}</div>
              </div>
            </div>
          </div>

          {/* Search, Filter & CSV Export */}
          <div className="bg-white p-4 rounded-2xl border border-[#e5e0d6] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[220px]">
                <input
                  type="text"
                  value={searchApplication}
                  onChange={(e) => setSearchApplication(e.target.value)}
                  placeholder={tr.searchPlaceholder}
                  className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-[#e5e0d6] text-xs outline-none focus:border-[#231f20] bg-[#FAF8F5]"
                />
                <span className="absolute start-3.5 top-2.5 text-slate-400">🔍</span>
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl border border-[#e5e0d6] text-xs font-bold text-[#231f20] bg-[#FAF8F5] outline-none"
              >
                <option value="all">{tr.filterAll} ({totalAppsCount})</option>
                <option value="pending">{tr.statusPending} ({pendingAppsCount})</option>
                <option value="approved">{tr.statusApproved} ({approvedAppsCount})</option>
                <option value="rejected">{tr.statusRejected} ({rejectedAppsCount})</option>
              </select>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <CsvExportButton data={exportData} filename="amycc-membership-applications" />
            </div>
          </div>

          {/* Applications Table */}
          <div className="bg-white rounded-2xl border border-[#e5e0d6] overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs text-[#231f20]">
                <thead className="bg-[#FAF8F5] border-b border-[#e5e0d6] text-2xs uppercase tracking-wider text-[#5C5A55] font-bold">
                  <tr>
                    <th className="px-6 py-4 text-start">{tr.colApplicant}</th>
                    <th className="px-6 py-4 text-start">{tr.colCity}</th>
                    <th className="px-6 py-4 text-start">مجالات الاهتمام</th>
                    <th className="px-6 py-4 text-start">{tr.colMotivation}</th>
                    <th className="px-6 py-4 text-start">{tr.colStatus}</th>
                    <th className="px-6 py-4 text-center">{tr.colActions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#FEF6CC]">
                  {filteredApplications.length > 0 ? (
                    filteredApplications.map((app) => (
                      <tr key={app.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                        {/* Applicant details */}
                        <td className="px-6 py-4">
                          <div className="font-bold text-[#231f20] text-xs">{app.full_name}</div>
                          <a
                            href={`mailto:${app.email}`}
                            className="text-3xs text-[#5C5A55] hover:text-[#231f20] transition-colors block font-mono"
                          >
                            {app.email}
                          </a>
                          <a
                            href={`tel:${app.phone}`}
                            className="text-3xs text-[#5C5A55] font-mono hover:text-[#231f20] transition-colors block"
                            dir="ltr"
                          >
                            {app.phone}
                          </a>
                        </td>

                        {/* City / Profession */}
                        <td className="px-6 py-4">
                          <span className="font-semibold block text-[#231f20]">{app.city}</span>
                          <span className="text-[#5C5A55] text-3xs font-medium">
                            {app.profession || '—'}
                          </span>
                        </td>

                        {/* Interests */}
                        <td className="px-6 py-4 max-w-[200px]">
                          <div className="flex flex-wrap gap-1">
                            {Array.isArray(app.interests) && app.interests.length > 0 ? (
                              app.interests.map((interest, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded-full text-3xs font-bold bg-[#FAF8F5] border border-[#e5e0d6] text-[#231f20]"
                                >
                                  {interest}
                                </span>
                              ))
                            ) : (
                              <span className="text-3xs text-slate-400">—</span>
                            )}
                          </div>
                        </td>

                        {/* Motivation */}
                        <td className="px-6 py-4 max-w-xs">
                          <p
                            className="truncate text-[#5C5A55] text-xs cursor-pointer hover:text-[#231f20]"
                            title={app.motivation}
                            onClick={() => setViewingApp(app)}
                          >
                            {app.motivation}
                          </p>
                          <span className="text-3xs text-slate-400 block mt-0.5">
                            {new Date(app.created_at).toLocaleDateString('ar-MA')}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-2xs font-bold ${
                              app.status === 'approved'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : app.status === 'rejected'
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {app.status === 'approved'
                              ? tr.statusApproved
                              : app.status === 'rejected'
                              ? tr.statusRejected
                              : tr.statusPending}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setViewingApp(app)}
                              className="px-2.5 py-1 rounded-lg text-2xs font-bold bg-[#FAF8F5] text-[#231f20] hover:bg-[#F4EFE6] border border-[#e5e0d6] transition-colors cursor-pointer"
                              title={tr.viewDetails}
                            >
                              {tr.viewDetails}
                            </button>

                            {app.status !== 'approved' && (
                              <button
                                disabled={processingAppId === app.id}
                                onClick={() => handleStatusChange(app.id, 'approved')}
                                className="px-2.5 py-1 rounded-lg text-2xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors disabled:opacity-50 cursor-pointer"
                              >
                                {tr.statusApproved}
                              </button>
                            )}

                            {app.status !== 'rejected' && (
                              <button
                                disabled={processingAppId === app.id}
                                onClick={() => handleStatusChange(app.id, 'rejected')}
                                className="px-2.5 py-1 rounded-lg text-2xs font-bold bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-colors disabled:opacity-50 cursor-pointer"
                              >
                                {tr.statusRejected}
                              </button>
                            )}

                            <button
                              disabled={processingAppId === app.id}
                              onClick={() => handleDeleteApp(app.id, app.full_name)}
                              className="px-2 py-1 rounded-lg text-2xs font-bold text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                              title={tr.delete}
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-[#5C5A55]">
                        {tr.noAppsFound}
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
      {/* TAB 2: MEMBERSHIP TIERS & CARDS */}
      {/* ========================================================= */}
      {activeTab === 'tiers' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#e5e0d6] shadow-2xs">
            <div>
              <h2 className="text-base font-extrabold text-[#231f20]">
                فئات وبطاقات الانخراط السنوي
              </h2>
              <p className="text-xs text-[#5C5A55] mt-0.5">
                تحديد واجبات الانخراط، الامتيازات الممنوحة، والشروط الخاصة بكل فئة من فئات العضوية في الجمعية.
              </p>
            </div>
            <button
              onClick={openAddTierModal}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#bd3227] text-white hover:bg-[#a3261c] transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <span>+</span>
              <span>إضافة فئة عضوية جديدة</span>
            </button>
          </div>

          {/* Tiers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {(config.tiers || []).map((tier, idx) => (
              <div
                key={tier.id || idx}
                className={`relative rounded-3xl p-6 transition-all border flex flex-col justify-between ${
                  tier.recommended
                    ? 'bg-gradient-to-b from-[#F5F3EE] via-white to-[#F5F3EE] border-[#bd3227] shadow-sm'
                    : 'bg-white border-[#e5e0d6] shadow-2xs'
                } ${!tier.active ? 'opacity-60 bg-slate-50' : ''}`}
              >
                {/* Header badges */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#231f20]" />
                      <span className="text-3xs font-extrabold tracking-wider uppercase text-[#bd3227]">
                        {tier.badgeAr || 'فئة معتمدة'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {tier.recommended && (
                        <span className="px-2.5 py-0.5 rounded-full text-3xs font-black bg-[#bd3227] text-white shadow-2xs">
                          ⭐ الأكثر ترشيحاً
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded-full text-3xs font-bold ${
                          tier.active !== false
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {tier.active !== false ? 'مفعلة بالواجهة' : 'معطلة مؤقتاً'}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-[#231f20] mb-2">{tier.nameAr}</h3>

                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl font-black text-[#231f20]">{tier.feeAr}</span>
                    <span className="text-xs text-[#5C5A55] font-medium">/ {tier.periodAr}</span>
                  </div>

                  <p className="text-xs text-[#5C5A55] leading-relaxed mb-5">
                    {tier.descriptionAr}
                  </p>

                  {/* Benefits checklist */}
                  <div className="space-y-2 border-t border-[#E5E0D6] pt-4 mb-6">
                    <span className="text-2xs font-extrabold uppercase text-[#231f20] block mb-2">
                      الامتيازات والصلاحيات القانونية:
                    </span>
                    {(tier.benefitsAr || []).map((b, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2 text-xs text-[#231f20]">
                        <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                        <span className="leading-snug">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#e5e0d6]">
                  <button
                    type="button"
                    onClick={() => handleToggleTierActive(tier.id)}
                    className="text-2xs font-bold text-[#5C5A55] hover:text-[#231f20] transition-colors cursor-pointer"
                  >
                    {tier.active !== false ? 'إخفاء الفئة مؤقتاً' : 'تفعيل الفئة بالواجهة'}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditTierModal(tier)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#231f20] text-white hover:bg-[#d2a82b] transition-all cursor-pointer shadow-2xs"
                    >
                      تعديل
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteTier(tier.id)}
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
      {/* TAB 3: CMS & PAGE SETTINGS */}
      {/* ========================================================= */}
      {activeTab === 'page-settings' && (
        <div className="space-y-8">
          {/* Trilingual Switcher for CMS Fields */}
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

          {/* SECTION 1: HERO */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e5e0d6] shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-[#E5E0D6] pb-4">
              <div>
                <span className="text-2xs font-bold uppercase tracking-wider text-[#bd3227]">
                  واجهة الترحيب
                </span>
                <h3 className="text-lg font-black text-[#231f20]">قسم البانر الرئيسي (Hero)</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Hero Section</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Tag / Category */}
              <div>
                <label className="block text-2xs font-extrabold text-[#231f20] mb-1.5">
                  الوسم التعريفي العلوي ({activeLangTab.toUpperCase()})
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5] outline-none focus:border-[#231f20]"
                />
              </div>

              {/* Badge */}
              <div>
                <label className="block text-2xs font-extrabold text-[#231f20] mb-1.5">
                  شارة التميز والمؤسسة ({activeLangTab.toUpperCase()})
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5] outline-none focus:border-[#231f20]"
                />
              </div>

              {/* Main Title */}
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5] font-bold outline-none focus:border-[#231f20]"
                />
              </div>

              {/* Subtitle */}
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5] outline-none focus:border-[#231f20]"
                />
              </div>

              {/* Detailed Description */}
              <div className="sm:col-span-2">
                <label className="block text-2xs font-extrabold text-[#231f20] mb-1.5">
                  النص التعريفي التفصيلي بميثاق العضوية ({activeLangTab.toUpperCase()})
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5] outline-none focus:border-[#231f20]"
                />
              </div>

              {/* Hero Image */}
              <div className="sm:col-span-2 pt-2 border-t border-[#E5E0D6]">
                <label className="block text-2xs font-extrabold text-[#231f20] mb-1.5">
                  صورة الغلاف البانورامي (Hero Image)
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
                    placeholder="https://images.unsplash.com/... أو مسار الصورة"
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#e5e0d6] text-xs font-mono bg-[#FAF8F5] outline-none"
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

              {/* Primary & Secondary Buttons */}
              <div>
                <label className="block text-2xs font-extrabold text-[#231f20] mb-1.5">
                  نص الزر الرئيسي ({activeLangTab.toUpperCase()})
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5] outline-none"
                />
              </div>

              <div>
                <label className="block text-2xs font-extrabold text-[#231f20] mb-1.5">
                  رابط الزر الرئيسي (Anchor Link)
                </label>
                <input
                  type="text"
                  value={config.hero.primaryBtnUrl}
                  onChange={(e) => updateHero('primaryBtnUrl', e.target.value)}
                  placeholder="#membership-form"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e0d6] text-xs font-mono bg-[#FAF8F5] outline-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: STATS */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e5e0d6] shadow-2xs space-y-6">
            <div className="border-b border-[#E5E0D6] pb-4">
              <span className="text-2xs font-bold uppercase tracking-wider text-[#bd3227]">
                أرقام ومؤشرات الانخراط
              </span>
              <h3 className="text-lg font-black text-[#231f20]">
                المؤشرات الثلاثة الكبرى (Key Metrics)
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
                      placeholder="رمز"
                      className="w-12 px-2 py-1.5 text-center text-sm rounded-lg border border-[#e5e0d6] bg-white"
                    />
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => updateStat(idx, { value: e.target.value })}
                      placeholder="القيمة مثل +250"
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

          {/* SECTION 3: BENEFITS */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e5e0d6] shadow-2xs space-y-6">
            <div className="border-b border-[#E5E0D6] pb-4">
              <span className="text-2xs font-bold uppercase tracking-wider text-[#bd3227]">
                مزايا وحقوق العضو
              </span>
              <h3 className="text-lg font-black text-[#231f20]">
                شبكة الامتيازات الستة (Benefits Grid)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {(config.benefits || []).map((b, idx) => (
                <div key={b.id || idx} className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={b.icon}
                      onChange={(e) => updateBenefit(idx, { icon: e.target.value })}
                      className="w-10 px-2 py-1 text-center text-sm rounded-lg border border-[#e5e0d6] bg-white"
                    />
                    <input
                      type="text"
                      value={
                        activeLangTab === 'ar'
                          ? b.titleAr
                          : activeLangTab === 'fr'
                          ? b.titleFr
                          : b.titleEn
                      }
                      onChange={(e) =>
                        updateBenefit(idx, {
                          [activeLangTab === 'ar'
                            ? 'titleAr'
                            : activeLangTab === 'fr'
                            ? 'titleFr'
                            : 'titleEn']: e.target.value,
                        })
                      }
                      placeholder="عنوان الامتياز"
                      className="flex-1 px-3 py-1.5 text-xs font-bold text-[#231f20] rounded-lg border border-[#e5e0d6] bg-white"
                    />
                  </div>

                  <textarea
                    rows={2}
                    value={
                      activeLangTab === 'ar'
                        ? b.descriptionAr
                        : activeLangTab === 'fr'
                        ? b.descriptionFr
                        : b.descriptionEn
                    }
                    onChange={(e) =>
                      updateBenefit(idx, {
                        [activeLangTab === 'ar'
                          ? 'descriptionAr'
                          : activeLangTab === 'fr'
                          ? 'descriptionFr'
                          : 'descriptionEn']: e.target.value,
                      })
                    }
                    placeholder="شرح الامتياز"
                    className="w-full px-3 py-1.5 rounded-lg border border-[#e5e0d6] text-xs bg-white outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 4: STEPS */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e5e0d6] shadow-2xs space-y-6">
            <div className="border-b border-[#E5E0D6] pb-4">
              <span className="text-2xs font-bold uppercase tracking-wider text-[#bd3227]">
                مسار العضوية
              </span>
              <h3 className="text-lg font-black text-[#231f20]">
                المراحل الأربعة لقبول الانخراط (4-Step Admission)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {(config.steps || []).map((s, idx) => (
                <div key={s.id || idx} className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] space-y-3">
                  <div className="w-7 h-7 rounded-full bg-[#231f20] text-white flex items-center justify-center font-bold text-xs">
                    {idx + 1}
                  </div>
                  <input
                    type="text"
                    value={
                      activeLangTab === 'ar'
                        ? s.titleAr
                        : activeLangTab === 'fr'
                        ? s.titleFr
                        : s.titleEn
                    }
                    onChange={(e) =>
                      updateStep(idx, {
                        [activeLangTab === 'ar'
                          ? 'titleAr'
                          : activeLangTab === 'fr'
                          ? 'titleFr'
                          : 'titleEn']: e.target.value,
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-[#e5e0d6] text-xs font-bold bg-white"
                  />
                  <textarea
                    rows={2}
                    value={
                      activeLangTab === 'ar'
                        ? s.descriptionAr
                        : activeLangTab === 'fr'
                        ? s.descriptionFr
                        : s.descriptionEn
                    }
                    onChange={(e) =>
                      updateStep(idx, {
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

          {/* SECTION 5: REQUIREMENTS */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e5e0d6] shadow-2xs space-y-6">
            <div className="border-b border-[#E5E0D6] pb-4">
              <span className="text-2xs font-bold uppercase tracking-wider text-[#bd3227]">
                الشروط القانونية
              </span>
              <h3 className="text-lg font-black text-[#231f20]">
                معايير وشروط الانخراط المنصوص عليها
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-2xs font-extrabold text-[#231f20] mb-1.5">
                  عنوان فقرة الشروط ({activeLangTab.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={
                    activeLangTab === 'ar'
                      ? config.requirements.titleAr
                      : activeLangTab === 'fr'
                      ? config.requirements.titleFr
                      : config.requirements.titleEn
                  }
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      requirements: {
                        ...prev.requirements,
                        [activeLangTab === 'ar'
                          ? 'titleAr'
                          : activeLangTab === 'fr'
                          ? 'titleFr'
                          : 'titleEn']: e.target.value,
                      },
                    }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5] font-bold"
                />
              </div>

              <div>
                <label className="block text-2xs font-extrabold text-[#231f20] mb-1.5">
                  بنود الشروط (سطر لكل بند) ({activeLangTab.toUpperCase()})
                </label>
                <textarea
                  rows={4}
                  value={
                    activeLangTab === 'ar'
                      ? (config.requirements.itemsAr || []).join('\n')
                      : activeLangTab === 'fr'
                      ? (config.requirements.itemsFr || []).join('\n')
                      : (config.requirements.itemsEn || []).join('\n')
                  }
                  onChange={(e) => {
                    const lines = e.target.value
                      .split('\n')
                      .map((l) => l.trim())
                      .filter(Boolean)
                    setConfig((prev) => ({
                      ...prev,
                      requirements: {
                        ...prev.requirements,
                        [activeLangTab === 'ar'
                          ? 'itemsAr'
                          : activeLangTab === 'fr'
                          ? 'itemsFr'
                          : 'itemsEn']: lines,
                      },
                    }))
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5] outline-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 6: CTA / SUPPORT */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e5e0d6] shadow-2xs space-y-6">
            <div className="border-b border-[#E5E0D6] pb-4">
              <span className="text-2xs font-bold uppercase tracking-wider text-[#bd3227]">
                المساعدة والتواصل
              </span>
              <h3 className="text-lg font-black text-[#231f20]">
                صندوق الاستفسار والدعم (Inquiry CTA)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-2xs font-extrabold text-[#231f20] mb-1.5">
                  شارة الصندوق ({activeLangTab.toUpperCase()})
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5]"
                />
              </div>

              <div>
                <label className="block text-2xs font-extrabold text-[#231f20] mb-1.5">
                  عنوان الصندوق ({activeLangTab.toUpperCase()})
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5] font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-2xs font-extrabold text-[#231f20] mb-1.5">
                  نص الدعم والمساعدة ({activeLangTab.toUpperCase()})
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5]"
                />
              </div>

              <div>
                <label className="block text-2xs font-extrabold text-[#231f20] mb-1.5">
                  البريد الإلكتروني للرد
                </label>
                <input
                  type="email"
                  value={config.cta.email}
                  onChange={(e) => updateCta('email', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5]"
                />
              </div>

              <div>
                <label className="block text-2xs font-extrabold text-[#231f20] mb-1.5">
                  الهاتف للتواصل المباشر
                </label>
                <input
                  type="text"
                  value={config.cta.phone}
                  onChange={(e) => updateCta('phone', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5]"
                />
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
            لوحة تحكم العضوية جاهزة للحفظ المباشر
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
      {/* MODAL 1: APPLICATION DETAILS VIEW */}
      {/* ========================================================= */}
      {viewingApp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#e5e0d6] shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#E5E0D6] pb-4">
              <div>
                <span className="text-2xs font-extrabold uppercase tracking-widest text-[#bd3227]">
                  بطاقة فحص طلب الانخراط
                </span>
                <h3 className="text-xl font-black text-[#231f20]">{viewingApp.full_name}</h3>
              </div>
              <button
                onClick={() => setViewingApp(null)}
                className="w-8 h-8 rounded-full bg-[#FAF8F5] hover:bg-[#F4EFE6] flex items-center justify-center text-sm font-bold text-[#231f20] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6]">
                <span className="text-3xs text-[#5C5A55] font-bold block mb-1">
                  البريد الإلكتروني
                </span>
                <a
                  href={`mailto:${viewingApp.email}`}
                  className="font-bold text-[#231f20] hover:underline"
                >
                  {viewingApp.email}
                </a>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6]">
                <span className="text-3xs text-[#5C5A55] font-bold block mb-1">الهاتف</span>
                <a
                  href={`tel:${viewingApp.phone}`}
                  className="font-bold text-[#231f20] hover:underline font-mono"
                  dir="ltr"
                >
                  {viewingApp.phone}
                </a>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6]">
                <span className="text-3xs text-[#5C5A55] font-bold block mb-1">المدينة</span>
                <span className="font-bold text-[#231f20]">{viewingApp.city}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6]">
                <span className="text-3xs text-[#5C5A55] font-bold block mb-1">
                  المهنة أو التخصص
                </span>
                <span className="font-bold text-[#231f20]">
                  {viewingApp.profession || 'غير محدد'}
                </span>
              </div>
            </div>

            {/* Interests tags */}
            <div>
              <span className="text-2xs font-extrabold uppercase text-[#231f20] block mb-2">
                المجالات الفنية والاهتمامات المختارة:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {Array.isArray(viewingApp.interests) && viewingApp.interests.length > 0 ? (
                  viewingApp.interests.map((it, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full text-2xs font-bold bg-[#FAF8F5] border border-[#e5e0d6] text-[#231f20]"
                    >
                      {it}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">لم يتم تحديد اهتمامات خاصة</span>
                )}
              </div>
            </div>

            {/* Motivation statement */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] space-y-2">
              <span className="text-2xs font-extrabold text-[#231f20] block">
                دوافع الانخراط ورسالة المترشح:
              </span>
              <p className="text-xs text-[#231f20] leading-relaxed whitespace-pre-line font-medium">
                {viewingApp.motivation}
              </p>
            </div>

            {/* Current Status and Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E5E0D6]">
              <div className="flex items-center gap-2">
                <span className="text-2xs font-bold text-[#5C5A55]">الحالة الحالية:</span>
                <span
                  className={`px-3 py-1 rounded-full text-2xs font-bold ${
                    viewingApp.status === 'approved'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : viewingApp.status === 'rejected'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {viewingApp.status === 'approved'
                    ? 'مقبول'
                    : viewingApp.status === 'rejected'
                    ? 'مرفوض'
                    : 'قيد الانتظار'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {viewingApp.status !== 'approved' && (
                  <button
                    disabled={processingAppId === viewingApp.id}
                    onClick={() => handleStatusChange(viewingApp.id, 'approved')}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-all cursor-pointer shadow-2xs"
                  >
                    قبول واعتماد الطلب
                  </button>
                )}

                {viewingApp.status !== 'rejected' && (
                  <button
                    disabled={processingAppId === viewingApp.id}
                    onClick={() => handleStatusChange(viewingApp.id, 'rejected')}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 text-white hover:bg-red-700 transition-all cursor-pointer shadow-2xs"
                  >
                    رفض الطلب
                  </button>
                )}

                <button
                  disabled={processingAppId === viewingApp.id}
                  onClick={() => handleDeleteApp(viewingApp.id, viewingApp.full_name)}
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
      {/* MODAL 2: ADD / EDIT MEMBERSHIP TIER */}
      {/* ========================================================= */}
      {(isAddingTier || editingTier) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#e5e0d6] shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#E5E0D6] pb-4">
              <div>
                <span className="text-2xs font-extrabold uppercase tracking-widest text-[#bd3227]">
                  {editingTier ? 'تعديل فئة عضوية' : 'إضافة فئة عضوية جديدة'}
                </span>
                <h3 className="text-xl font-black text-[#231f20]">
                  {editingTier ? tierForm.nameAr || 'تعديل الفئة' : 'فئة عضوية جديدة'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setEditingTier(null)
                  setIsAddingTier(false)
                }}
                className="w-8 h-8 rounded-full bg-[#FAF8F5] hover:bg-[#F4EFE6] flex items-center justify-center text-sm font-bold text-[#231f20] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-2xs font-extrabold text-[#231f20] mb-1">
                    مسمى الفئة (العربية) *
                  </label>
                  <input
                    type="text"
                    value={tierForm.nameAr}
                    onChange={(e) => setTierForm((p) => ({ ...p, nameAr: e.target.value }))}
                    placeholder="مثال: عضو فاعل وممارس"
                    className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5] font-bold"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-extrabold text-[#231f20] mb-1">
                    (Français)
                  </label>
                  <input
                    type="text"
                    value={tierForm.nameFr}
                    onChange={(e) => setTierForm((p) => ({ ...p, nameFr: e.target.value }))}
                    placeholder="Ex: Membre Actif"
                    className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5]"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-extrabold text-[#231f20] mb-1">
                    (English)
                  </label>
                  <input
                    type="text"
                    value={tierForm.nameEn}
                    onChange={(e) => setTierForm((p) => ({ ...p, nameEn: e.target.value }))}
                    placeholder="Ex: Active Member"
                    className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5]"
                  />
                </div>
              </div>

              {/* Fee & Period */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-2xs font-extrabold text-[#231f20] mb-1">
                    الواجب (العربية)
                  </label>
                  <input
                    type="text"
                    value={tierForm.feeAr}
                    onChange={(e) => setTierForm((p) => ({ ...p, feeAr: e.target.value }))}
                    placeholder="200 درهم"
                    className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5]"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-extrabold text-[#231f20] mb-1">
                    الواجب (FR/EN)
                  </label>
                  <input
                    type="text"
                    value={tierForm.feeFr}
                    onChange={(e) =>
                      setTierForm((p) => ({ ...p, feeFr: e.target.value, feeEn: e.target.value }))
                    }
                    placeholder="200 MAD"
                    className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5]"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-extrabold text-[#231f20] mb-1">
                    الدورية (العربية)
                  </label>
                  <input
                    type="text"
                    value={tierForm.periodAr}
                    onChange={(e) => setTierForm((p) => ({ ...p, periodAr: e.target.value }))}
                    placeholder="سنوياً"
                    className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5]"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-extrabold text-[#231f20] mb-1">
                    الدورية (FR/EN)
                  </label>
                  <input
                    type="text"
                    value={tierForm.periodFr}
                    onChange={(e) =>
                      setTierForm((p) => ({
                        ...p,
                        periodFr: e.target.value,
                        periodEn: e.target.value === 'Par an' ? 'Annual' : e.target.value,
                      }))
                    }
                    placeholder="Par an"
                    className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5]"
                  />
                </div>
              </div>

              {/* Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-2xs font-extrabold text-[#231f20] mb-1">
                    شارة الفئة (العربية)
                  </label>
                  <input
                    type="text"
                    value={tierForm.badgeAr || ''}
                    onChange={(e) => setTierForm((p) => ({ ...p, badgeAr: e.target.value }))}
                    placeholder="الفئة الأكثر تميزاً"
                    className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5]"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-extrabold text-[#231f20] mb-1">
                    (Français)
                  </label>
                  <input
                    type="text"
                    value={tierForm.badgeFr || ''}
                    onChange={(e) => setTierForm((p) => ({ ...p, badgeFr: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5]"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-extrabold text-[#231f20] mb-1">
                    (English)
                  </label>
                  <input
                    type="text"
                    value={tierForm.badgeEn || ''}
                    onChange={(e) => setTierForm((p) => ({ ...p, badgeEn: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5]"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <label className="block text-2xs font-extrabold text-[#231f20] mb-1">
                  نبذة تعريفية بالفئة والمستهدفين (العربية)
                </label>
                <textarea
                  rows={2}
                  value={tierForm.descriptionAr}
                  onChange={(e) => setTierForm((p) => ({ ...p, descriptionAr: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-extrabold text-[#231f20] mb-1">
                    (Français)
                  </label>
                  <textarea
                    rows={2}
                    value={tierForm.descriptionFr}
                    onChange={(e) => setTierForm((p) => ({ ...p, descriptionFr: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5]"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-extrabold text-[#231f20] mb-1">
                    (English)
                  </label>
                  <textarea
                    rows={2}
                    value={tierForm.descriptionEn}
                    onChange={(e) => setTierForm((p) => ({ ...p, descriptionEn: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5]"
                  />
                </div>
              </div>

              {/* Benefits Multiline */}
              <div>
                <label className="block text-2xs font-extrabold text-[#231f20] mb-1">
                  قائمة الامتيازات (العربية - سطر لكل امتياز)
                </label>
                <textarea
                  rows={3}
                  value={tierBenefitsArText}
                  onChange={(e) => setTierBenefitsArText(e.target.value)}
                  placeholder="بطاقة عضوية رقمية ومطبوعة&#10;حق التصويت بالجمع العام&#10;أولوية في التسجيل بالمحترفات"
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-extrabold text-[#231f20] mb-1">
                    الامتيازات (Français)
                  </label>
                  <textarea
                    rows={2}
                    value={tierBenefitsFrText}
                    onChange={(e) => setTierBenefitsFrText(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5]"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-extrabold text-[#231f20] mb-1">
                    الامتيازات (English)
                  </label>
                  <textarea
                    rows={2}
                    value={tierBenefitsEnText}
                    onChange={(e) => setTierBenefitsEnText(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5]"
                  />
                </div>
              </div>

              {/* Options */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-[#231f20] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tierForm.recommended || false}
                    onChange={(e) => setTierForm((p) => ({ ...p, recommended: e.target.checked }))}
                    className="rounded text-[#bd3227] focus:ring-[#bd3227]"
                  />
                  <span>تمييز كـ &quot;الفئة الأكثر ترشيحاً&quot; ⭐</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-[#231f20] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tierForm.active !== false}
                    onChange={(e) => setTierForm((p) => ({ ...p, active: e.target.checked }))}
                    className="rounded text-[#231f20] focus:ring-[#231f20]"
                  />
                  <span>تفعيل الفئة في الواجهة العامة</span>
                </label>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E0D6]">
              <button
                type="button"
                onClick={() => {
                  setEditingTier(null)
                  setIsAddingTier(false)
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#5C5A55] hover:text-[#231f20] transition-colors cursor-pointer"
              >
                إلغاء
              </button>

              <button
                type="button"
                onClick={handleSaveTierModal}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#231f20] text-white hover:bg-[#d2a82b] active:scale-98 transition-all shadow-2xs cursor-pointer"
              >
                تأكيد الفئة في القائمة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

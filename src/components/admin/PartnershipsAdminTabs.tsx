'use client'

import { useState, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'
import type {
  PartnershipsPageConfig,
  PartnerItemConfig,
  PartnerTier,
  PartnershipStatItem,
  PartnershipPillarItem,
  PartnershipBenefitItem,
} from '@/lib/settings'
import { CsvExportButton } from '@/components/admin/CsvExportButton'
import { savePartnershipsPageConfiguration } from '@/lib/actions/admin'
import { useAdminLocale } from './AdminLocaleContext'

export interface PartnershipInquiryRow {
  id: string
  organization_name: string
  organization_type: string
  contact_name: string
  email: string
  phone?: string | null
  city: string
  country: string
  proposal: string
  status: string
  created_at: string
}

interface PartnershipsAdminTabsProps {
  initialInquiries: PartnershipInquiryRow[]
  initialConfig: PartnershipsPageConfig
  onUpdateStatus?: (id: string, status: string) => Promise<void>
  onDeleteInquiry?: (id: string) => Promise<void>
}

const PARTNERSHIP_STRINGS = {
  ar: {
    pageTitle: 'إدارة الشراكات والتعاون المؤسساتي',
    pageSubtitle: 'معالجة مقترحات التعاون الواردة، إدارة شبكة الشركاء المعتمدين، وتخصيص واجهة صفحة الشراكات بالكامل',
    tabPartners: 'دليل الشركاء والصور المتحركة',
    tabInquiries: 'مقترحات الشراكة',
    tabCms: 'تخصيص الواجهة (CMS)',
    marqueeTitle: 'دليل الشركاء وشريط الصور المتحركة',
    marqueeSubtitle: 'معاينة وإدارة حركة صور الشركاء المعروضة في شريط الواجهة العامة، مع إمكانية التعديل والإضافة والحذف',
    liveMarquee: 'شريط الصور المتحركة الحي (المعروض في الموقع حالياً)',
    activePartnersMoving: 'صور نشطة تتحرك في الموقع',
    noActivePartners: 'لا توجد صور شركاء معروضة حالياً. اضغط على "إضافة شريك وصورة جديدة" لبدء العرض.',
    addPartner: 'إضافة شريك وصورة جديدة +',
    clearAllPartners: 'حذف كافة الشركاء',
    partnersListTitle: 'قائمة وتفاصيل الشركاء المعتمدين',
    searchPartnerPlaceholder: 'بحث في اسم الشريك...',
    colImage: 'الصورة',
    colPartnerName: 'اسم الشريك',
    colTier: 'التصنيف',
    colMarqueeStatus: 'شريط الحركة',
    colActions: 'الإجراءات',
    activeInMarquee: 'نشط في الموقع ✓',
    hiddenFromMarquee: 'مخفي ✕',
    edit: 'تعديل',
    delete: 'حذف',
    hide: 'إخفاء',
    show: 'تفعيل',
    noPartnersFound: 'لا توجد نتائج مطابقة لبحثك.',
    // Inquiries
    totalInquiries: 'إجمالي المقترحات',
    pendingInquiries: 'قيد المراجعة',
    approvedInquiries: 'مقبولة ومعتمدة',
    declinedInquiries: 'مرفوضة أو مؤرشفة',
    searchInquiryPlaceholder: 'بحث في المقترحات، المؤسسة، أو المسؤول...',
    filterAllStatus: 'كافة الحالات',
    filterAllTypes: 'كافة التصنيفات',
    exportCsv: 'تصدير البيانات (CSV)',
    colOrg: 'المؤسسة / الجهة',
    colContact: 'المسؤول والاتصال',
    colCity: 'المدينة والدولة',
    colProposal: 'المقترح',
    colStatus: 'الحالة',
    colDate: 'تاريخ الإرسال',
    noInquiriesFound: 'لا توجد مقترحات شراكة واردة حالياً.',
    statusPending: 'قيد المراجعة',
    statusUnderReview: 'جاري الفحص',
    statusApproved: 'تمت الموافقة',
    statusDeclined: 'مرفوض',
    statusArchived: 'مؤرشف',
    viewDetails: 'عرض التفاصيل',
    saveChanges: 'حفظ كافة التغييرات',
    saving: 'جارٍ الحفظ...',
  },
  fr: {
    pageTitle: 'Partenariats & Coopération Institutionnelle',
    pageSubtitle: 'Traitement des propositions reçues, gestion de l\'annuaire des partenaires et personnalisation CMS',
    tabPartners: 'Annuaire des Partenaires & Marquee',
    tabInquiries: 'Propositions Reçues',
    tabCms: 'Configuration CMS',
    marqueeTitle: 'Bande Défilante des Partenaires',
    marqueeSubtitle: 'Aperçu en temps réel des logos et photos de partenaires affichés sur le site public',
    liveMarquee: 'Bande Défilante en Direct (Site Public)',
    activePartnersMoving: 'logos actifs affichés sur le site',
    noActivePartners: 'Aucun partenaire affiché actuellement. Cliquez sur "Ajouter un partenaire" pour commencer.',
    addPartner: 'Ajouter un Partenaire +',
    clearAllPartners: 'Supprimer tous les partenaires',
    partnersListTitle: 'Liste des Partenaires Agréés',
    searchPartnerPlaceholder: 'Rechercher un partenaire...',
    colImage: 'Logo / Photo',
    colPartnerName: 'Nom du Partenaire',
    colTier: 'Catégorie',
    colMarqueeStatus: 'Visibilité',
    colActions: 'Actions',
    activeInMarquee: 'Actif sur le site ✓',
    hiddenFromMarquee: 'Masqué ✕',
    edit: 'Modifier',
    delete: 'Supprimer',
    hide: 'Masquer',
    show: 'Activer',
    noPartnersFound: 'Aucun partenaire ne correspond à votre recherche.',
    // Inquiries
    totalInquiries: 'Total des Propositions',
    pendingInquiries: 'En Attente',
    approvedInquiries: 'Approuvées',
    declinedInquiries: 'Refusées / Archivées',
    searchInquiryPlaceholder: 'Rechercher organisation, contact...',
    filterAllStatus: 'Tous les statuts',
    filterAllTypes: 'Tous les types',
    exportCsv: 'Exporter (CSV)',
    colOrg: 'Organisation',
    colContact: 'Personne de Contact',
    colCity: 'Ville / Pays',
    colProposal: 'Proposition',
    colStatus: 'Statut',
    colDate: 'Reçu le',
    noInquiriesFound: 'Aucune proposition de partenariat reçue.',
    statusPending: 'En attente',
    statusUnderReview: 'En examen',
    statusApproved: 'Approuvé',
    statusDeclined: 'Refusé',
    statusArchived: 'Archivé',
    viewDetails: 'Détails',
    saveChanges: 'Enregistrer les Modifications',
    saving: 'Enregistrement...',
  },
  en: {
    pageTitle: 'Institutional Partnerships & Cooperation',
    pageSubtitle: 'Review incoming partnership inquiries, manage official partners marquee, and configure page CMS',
    tabPartners: 'Partners Directory & Marquee',
    tabInquiries: 'Partnership Inquiries',
    tabCms: 'Page CMS Settings',
    marqueeTitle: 'Live Partner Logo Marquee',
    marqueeSubtitle: 'Real-time preview and management of rotating partner logos and photos on the public website',
    liveMarquee: 'Live Infinite Marquee (Public Website)',
    activePartnersMoving: 'active logos rotating on website',
    noActivePartners: 'No partner logos currently displayed. Click "Add New Partner" to begin.',
    addPartner: 'Add New Partner +',
    clearAllPartners: 'Clear All Partners',
    partnersListTitle: 'Official Partners Directory',
    searchPartnerPlaceholder: 'Search partner by name...',
    colImage: 'Logo / Photo',
    colPartnerName: 'Partner Name',
    colTier: 'Category',
    colMarqueeStatus: 'Marquee Status',
    colActions: 'Actions',
    activeInMarquee: 'Active in Marquee ✓',
    hiddenFromMarquee: 'Hidden ✕',
    edit: 'Edit',
    delete: 'Delete',
    hide: 'Hide',
    show: 'Enable',
    noPartnersFound: 'No partners matched your search.',
    // Inquiries
    totalInquiries: 'Total Proposals',
    pendingInquiries: 'Under Review',
    approvedInquiries: 'Approved',
    declinedInquiries: 'Declined / Archived',
    searchInquiryPlaceholder: 'Search organization, contact...',
    filterAllStatus: 'All Statuses',
    filterAllTypes: 'All Categories',
    exportCsv: 'Export (CSV)',
    colOrg: 'Organization',
    colContact: 'Contact Person',
    colCity: 'City / Country',
    colProposal: 'Proposal',
    colStatus: 'Status',
    colDate: 'Received Date',
    noInquiriesFound: 'No partnership proposals received yet.',
    statusPending: 'Pending',
    statusUnderReview: 'Under Review',
    statusApproved: 'Approved',
    statusDeclined: 'Declined',
    statusArchived: 'Archived',
    viewDetails: 'View Details',
    saveChanges: 'Save All Changes',
    saving: 'Saving...',
  },
}

export function PartnershipsAdminTabs({
  initialInquiries,
  initialConfig,
  onUpdateStatus,
  onDeleteInquiry,
}: PartnershipsAdminTabsProps) {
  const router = useRouter()
  const { locale, isAr, isFr } = useAdminLocale()
  const tr = PARTNERSHIP_STRINGS[locale] || PARTNERSHIP_STRINGS.ar

  // Tabs: 'partners', 'inquiries', 'page-settings'
  const [activeTab, setActiveTab] = useState<'partners' | 'inquiries' | 'page-settings'>('partners')

  // Partners State & CMS State
  const [config, setConfig] = useState<PartnershipsPageConfig>(initialConfig)
  const [prevInitialConfig, setPrevInitialConfig] = useState<PartnershipsPageConfig>(initialConfig)
  if (prevInitialConfig !== initialConfig) {
    setPrevInitialConfig(initialConfig)
    setConfig(initialConfig)
  }
  const [activeLangTab, setActiveLangTab] = useState<'ar' | 'fr' | 'en'>('ar')
  const [searchPartner, setSearchPartner] = useState('')

  // Filter only active partners for the live marquee preview
  const activePartnersList = useMemo(() => {
    return (config.partners || []).filter((p) => p.active !== false)
  }, [config.partners])

  const activePartnersCount = activePartnersList.length

  // Guarantee at least 16 items in the block so that even with only 1 or 2 partners,
  // each block is 5,000+ pixels wide and cards NEVER run out or leave any blank gaps on wide screens.
  const adminMarqueeBlock = useMemo(() => {
    if (activePartnersList.length === 0) return []
    const minItems = 16
    const repeatCount = Math.max(2, Math.ceil(minItems / activePartnersList.length))
    const block: PartnerItemConfig[] = []
    for (let i = 0; i < repeatCount; i++) {
      block.push(...activePartnersList)
    }
    return block
  }, [activePartnersList])

  // Inquiries State
  const [inquiries, setInquiries] = useState<PartnershipInquiryRow[]>(initialInquiries)
  const [searchInquiry, setSearchInquiry] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [viewingInquiry, setViewingInquiry] = useState<PartnershipInquiryRow | null>(null)
  const [processingInquiryId, setProcessingInquiryId] = useState<string | null>(null)

  // Partner Modal (Add/Edit)
  const [editingPartner, setEditingPartner] = useState<PartnerItemConfig | null>(null)
  const [isAddingPartner, setIsAddingPartner] = useState(false)
  const [partnerForm, setPartnerForm] = useState<PartnerItemConfig>({
    id: '',
    nameAr: '',
    nameFr: '',
    nameEn: '',
    tier: 'cultural',
    logoUrl: '',
    websiteUrl: '',
    descriptionAr: '',
    descriptionFr: '',
    descriptionEn: '',
    active: true,
  })

  // Loading & Feedback
  const [savingConfig, setSavingConfig] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const heroFileInputRef = useRef<HTMLInputElement>(null)
  const logoFileInputRef = useRef<HTMLInputElement>(null)

  // -------------------------------------------------------------
  // Inquiries Logic & Filters
  // -------------------------------------------------------------
  const filteredInquiries = inquiries.filter((inq) => {
    const q = searchInquiry.toLowerCase().trim()
    const matchesSearch =
      !q ||
      inq.organization_name.toLowerCase().includes(q) ||
      inq.contact_name.toLowerCase().includes(q) ||
      inq.city.toLowerCase().includes(q) ||
      inq.email.toLowerCase().includes(q)

    const matchesStatus = statusFilter === 'all' || inq.status === statusFilter
    const matchesType = typeFilter === 'all' || inq.organization_type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const totalInquiries = inquiries.length
  const pendingCount = inquiries.filter((i) => i.status === 'pending' || i.status === 'under_review').length
  const approvedCount = inquiries.filter((i) => i.status === 'approved').length
  const declinedCount = inquiries.filter((i) => i.status === 'declined' || i.status === 'archived').length

  async function handleStatusChange(id: string, newStatus: string) {
    setProcessingInquiryId(id)
    try {
      if (onUpdateStatus) {
        await onUpdateStatus(id, newStatus)
      }
      setInquiries((prev) =>
        prev.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq))
      )
      setFeedback({
        type: 'success',
        message: 'تم تحديث حالة مقترح الشراكة بنجاح.',
      })
    } catch {
      setFeedback({
        type: 'error',
        message: 'حدث خطأ أثناء محاولة تحديث الحالة.',
      })
    } finally {
      setProcessingInquiryId(null)
    }
  }

  async function handleDeleteInquiry(id: string, orgName: string) {
    if (!confirm(`هل أنت متأكد من حذف مقترح الشراكة المقدم من "${orgName}" نهائياً؟`)) {
      return
    }

    setProcessingInquiryId(id)
    try {
      if (onDeleteInquiry) {
        await onDeleteInquiry(id)
      }
      setInquiries((prev) => prev.filter((i) => i.id !== id))
      if (viewingInquiry?.id === id) setViewingInquiry(null)
      setFeedback({
        type: 'success',
        message: `تم حذف مقترح الشراكة بنجاح.`,
      })
    } catch {
      setFeedback({
        type: 'error',
        message: 'فشل حذف مقترح الشراكة.',
      })
    } finally {
      setProcessingInquiryId(null)
    }
  }

  // -------------------------------------------------------------
  // Partners Logic (Tab 2)
  // -------------------------------------------------------------
  const filteredPartners = (config.partners || []).filter((p) => {
    const q = searchPartner.toLowerCase().trim()
    if (!q) return true
    return (
      p.nameAr.toLowerCase().includes(q) ||
      p.nameFr.toLowerCase().includes(q) ||
      p.nameEn.toLowerCase().includes(q)
    )
  })

  function openAddPartnerModal() {
    setPartnerForm({
      id: `partner-${Date.now()}`,
      nameAr: '',
      nameFr: '',
      nameEn: '',
      tier: 'cultural',
      logoUrl: '',
      websiteUrl: '',
      descriptionAr: '',
      descriptionFr: '',
      descriptionEn: '',
      active: true,
      order: (config.partners?.length || 0) + 1,
    })
    setIsAddingPartner(true)
    setEditingPartner(null)
  }

  function openEditPartnerModal(partner: PartnerItemConfig) {
    setPartnerForm({ ...partner })
    setEditingPartner(partner)
    setIsAddingPartner(false)
  }

  async function handleSavePartnerSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!partnerForm.nameAr.trim()) {
      alert('يرجى إدخال اسم الشريك بالعربية على الأقل.')
      return
    }

    let updatedPartners: PartnerItemConfig[]
    if (editingPartner) {
      updatedPartners = config.partners.map((p) =>
        p.id === editingPartner.id ? { ...partnerForm } : p
      )
    } else {
      updatedPartners = [
        ...config.partners,
        {
          ...partnerForm,
          id: partnerForm.id || `partner-${Date.now()}`,
          nameFr: partnerForm.nameFr || partnerForm.nameAr,
          nameEn: partnerForm.nameEn || partnerForm.nameAr,
        },
      ]
    }

    const updatedConfig = { ...config, partners: updatedPartners }
    setConfig(updatedConfig)
    setEditingPartner(null)
    setIsAddingPartner(false)

    // Save configuration automatically
    await persistConfig(updatedConfig, 'تم حفظ وتحديث بيانات الشريك بنجاح.')
  }

  async function handleDeletePartner(partnerId: string, partnerName: string) {
    if (!confirm(`هل أنت متأكد من إزالة الشريك "${partnerName}" من دليل الشركاء؟`)) {
      return
    }

    const currentPartners = config.partners || []
    const updatedPartners = currentPartners.filter((p) => p.id !== partnerId)
    const updatedConfig = { ...config, partners: updatedPartners }
    setConfig(updatedConfig)
    await persistConfig(updatedConfig, `تمت إزالة الشريك "${partnerName}" من الدليل بنجاح.`)
  }

  async function handleClearAllPartners() {
    if (
      !confirm(
        'هل أنت متأكد من حذف وإزالة كافة الشركاء من الدليل؟ لن يظهر أي شريك في شريط الموقع حتى تقوم بإضافة شركاء جدد.'
      )
    ) {
      return
    }

    const updatedConfig = {
      ...config,
      partners: [],
    }
    setConfig(updatedConfig)
    await persistConfig(updatedConfig, 'تم إفراغ دليل الشركاء وحذف كافة الشركاء بنجاح.')
  }

  async function handleTogglePartnerActive(partnerId: string) {
    const updatedPartners = config.partners.map((p) =>
      p.id === partnerId ? { ...p, active: !p.active } : p
    )
    const updatedConfig = { ...config, partners: updatedPartners }
    setConfig(updatedConfig)
    await persistConfig(updatedConfig, 'تم تحديث حالة ظهور الشريك في الموقع.')
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
      if (!res.ok || !json.url) {
        throw new Error(json.error || 'فشل رفع صورة الغلاف')
      }

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
        message: 'تم استيراد ورفع صورة الغلاف بنجاح.',
      })
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'حدث خطأ أثناء رفع الصورة',
      })
    } finally {
      setUploadingImage(false)
      if (heroFileInputRef.current) heroFileInputRef.current.value = ''
    }
  }

  async function handlePartnerLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingLogo(true)
    try {
      const data = new FormData()
      data.append('file', file)

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: data,
      })

      const json = await res.json()
      if (!res.ok || !json.url) {
        throw new Error(json.error || 'فشل رفع شعار الشريك')
      }

      setPartnerForm((prev) => ({
        ...prev,
        logoUrl: json.url,
      }))
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'حدث خطأ أثناء رفع الشعار')
    } finally {
      setUploadingLogo(false)
      if (logoFileInputRef.current) logoFileInputRef.current.value = ''
    }
  }

  // -------------------------------------------------------------
  // Page Settings Handlers (Tab 3)
  // -------------------------------------------------------------
  function updateHero<K extends keyof PartnershipsPageConfig['hero']>(
    field: K,
    val: PartnershipsPageConfig['hero'][K]
  ) {
    setConfig((prev) => ({
      ...prev,
      hero: { ...prev.hero, [field]: val },
    }))
  }

  function updateCta<K extends keyof PartnershipsPageConfig['cta']>(
    field: K,
    val: PartnershipsPageConfig['cta'][K]
  ) {
    setConfig((prev) => ({
      ...prev,
      cta: { ...prev.cta, [field]: val },
    }))
  }

  function updateStat(index: number, field: keyof PartnershipStatItem, val: string) {
    setConfig((prev) => {
      const nextStats = [...prev.stats]
      nextStats[index] = { ...nextStats[index], [field]: val }
      return { ...prev, stats: nextStats }
    })
  }

  function updatePillar(index: number, field: keyof PartnershipPillarItem, val: string) {
    setConfig((prev) => {
      const nextPillars = [...prev.pillars]
      nextPillars[index] = { ...nextPillars[index], [field]: val }
      return { ...prev, pillars: nextPillars }
    })
  }

  function updateBenefit(index: number, field: keyof PartnershipBenefitItem, val: string) {
    setConfig((prev) => {
      const nextBenefits = [...prev.benefits]
      nextBenefits[index] = { ...nextBenefits[index], [field]: val }
      return { ...prev, benefits: nextBenefits }
    })
  }

  async function persistConfig(targetConfig: PartnershipsPageConfig, successMsg?: string) {
    setSavingConfig(true)
    setFeedback(null)

    try {
      const res = await savePartnershipsPageConfiguration(targetConfig)
      if (!res.success) {
        throw new Error(res.error || 'فشل حفظ الإعدادات')
      }

      setFeedback({
        type: 'success',
        message: successMsg || 'تم حفظ ونشر كافة إعدادات صفحة الشراكات بنجاح!',
      })
      router.refresh()
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'حدث خطأ أثناء حفظ الإعدادات',
      })
    } finally {
      setSavingConfig(false)
    }
  }

  const exportData = inquiries.map((inq) => ({
    ID: inq.id,
    Organization: inq.organization_name,
    Type: inq.organization_type,
    ContactPerson: inq.contact_name,
    Email: inq.email,
    Phone: inq.phone || '',
    City: inq.city,
    Country: inq.country,
    Proposal: inq.proposal,
    Status: inq.status,
    ReceivedAt: inq.created_at,
  }))

  const tierLabels: Record<PartnerTier, { ar: string; fr: string; en: string }> = {
    institutional: { ar: 'مؤسساتي وعمومي', fr: 'Institutionnel', en: 'Institutional' },
    cultural: { ar: 'مركز ثقافي وفني', fr: 'Culturel & Artistique', en: 'Cultural & Arts' },
    educational: { ar: 'تعليمي وجامعي', fr: 'Éducatif & Universitaire', en: 'Educational & Academic' },
    civil_society: { ar: 'مجتمع مدني وجمعيات', fr: 'Société Civile', en: 'Civil Society' },
    sponsor: { ar: 'رعاية وقطاع خاص', fr: 'Mécénat & Sponsor', en: 'Corporate Sponsor' },
  }

  const renderAdminCard = (partner: PartnerItemConfig, key: string, isClone = false) => (
    <div
      key={key}
      className={`group/card relative w-64 sm:w-72 h-56 bg-white rounded-3xl border p-3.5 shadow-2xs hover:shadow-xl hover:border-[#bd3227]/50 transition-all flex flex-col justify-between shrink-0 overflow-hidden ${
        partner.active ? 'border-[#e5e0d6]' : 'border-rose-200 bg-rose-50/30 opacity-70'
      }`}
    >
      {/* Partner Photo */}
      <div className="relative w-full h-32 rounded-2xl overflow-hidden bg-[#FAF8F5] border border-[#E5E0D6]">
        <ImageWithFallback
          src={partner.logoUrl}
          fallbackSrc="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80"
          alt={partner.nameAr}
          fill
          className="object-cover group-hover/card:scale-108 transition-transform duration-700 ease-out"
          sizes="(max-width: 640px) 240px, 288px"
        />
        <div className="absolute top-2 start-2 z-10">
          <span
            className={`px-2 py-0.5 rounded-md text-4xs font-black shadow-xs ${
              partner.active
                ? 'bg-emerald-600 text-white'
                : 'bg-rose-600 text-white'
            }`}
          >
            {partner.active ? 'نشط ✓' : 'مخفي ✕'}
          </span>
        </div>
      </div>

      {/* Partner Name & Tier */}
      <div className="pt-2 text-center" dir="rtl">
        <h4 className="text-xs font-bold text-[#231f20] truncate">
          {partner.nameAr}
        </h4>
        <span className="text-4xs text-[#5C5A55] font-medium block">
          {tierLabels[partner.tier]?.ar || partner.tier}
        </span>
      </div>

      {/* Card Action Buttons */}
      <div className="pt-2 border-t border-[#E5E0D6] flex items-center justify-between gap-1 text-2xs" dir="rtl">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            openEditPartnerModal(partner)
          }}
          className="px-2.5 py-1 rounded-lg font-bold bg-[#FAF8F5] hover:bg-[#F4EFE6] text-[#231f20] border border-[#e5e0d6] transition-colors cursor-pointer"
          tabIndex={isClone ? -1 : undefined}
        >
          ✏️ تعديل
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            handleTogglePartnerActive(partner.id)
          }}
          className={`px-2 py-1 rounded-lg font-bold border transition-colors cursor-pointer text-3xs ${
            partner.active
              ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'
              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
          }`}
          tabIndex={isClone ? -1 : undefined}
        >
          {partner.active ? 'إخفاء' : 'تفعيل'}
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            handleDeletePartner(partner.id, partner.nameAr)
          }}
          className="px-2 py-1 rounded-lg font-bold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer text-3xs"
          title={`حذف ${partner.nameAr}`}
          tabIndex={isClone ? -1 : undefined}
        >
          🗑️
        </button>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Top Header & Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#e5e0d6]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🤝</span>
            <h1 className="text-xl sm:text-2xl font-black text-[#231f20]">
              {tr.pageTitle}
            </h1>
          </div>
          <p className="text-xs text-[#5C5A55]">
            {tr.pageSubtitle}
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center p-1 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] shadow-2xs self-start sm:self-auto overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => setActiveTab('partners')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'partners'
                ? 'bg-[#231f20] text-white shadow-xs'
                : 'text-[#5C5A55] hover:bg-[#F4EFE6]'
            }`}
          >
            <span>🎬</span>
            <span>{tr.tabPartners}</span>
            <span className={`px-2 py-0.5 rounded-full text-3xs font-extrabold ${
              activeTab === 'partners' ? 'bg-white/20 text-white' : 'bg-[#e5e0d6] text-[#231f20]'
            }`}>
              {config.partners?.length || 0}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('inquiries')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'inquiries'
                ? 'bg-[#231f20] text-white shadow-xs'
                : 'text-[#5C5A55] hover:bg-[#F4EFE6]'
            }`}
          >
            <span>📥</span>
            <span>{tr.tabInquiries}</span>
            <span className={`px-2 py-0.5 rounded-full text-3xs font-extrabold ${
              activeTab === 'inquiries' ? 'bg-white/20 text-white' : 'bg-[#e5e0d6] text-[#231f20]'
            }`}>
              {inquiries.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('page-settings')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'page-settings'
                ? 'bg-[#231f20] text-white shadow-xs'
                : 'text-[#5C5A55] hover:bg-[#F4EFE6]'
            }`}
          >
            <span>⚙️</span>
            <span>{tr.tabCms}</span>
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
      {/* TAB 1: INCOMING PARTNERSHIP INQUIRIES                     */}
      {/* ========================================================= */}
      {activeTab === 'inquiries' && (
        <div className="space-y-6">
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#e5e0d6] shadow-2xs">
              <span className="text-3xs font-extrabold uppercase text-[#5C5A55] block mb-1">
                {tr.totalInquiries}
              </span>
              <span className="text-2xl font-black text-[#231f20]">{totalInquiries}</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#e5e0d6] shadow-2xs">
              <span className="text-3xs font-extrabold uppercase text-amber-700 block mb-1">
                {tr.pendingInquiries}
              </span>
              <span className="text-2xl font-black text-amber-800">{pendingCount}</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#e5e0d6] shadow-2xs">
              <span className="text-3xs font-extrabold uppercase text-emerald-700 block mb-1">
                {tr.approvedInquiries}
              </span>
              <span className="text-2xl font-black text-emerald-800">{approvedCount}</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#e5e0d6] shadow-2xs">
              <span className="text-3xs font-extrabold uppercase text-slate-500 block mb-1">
                {tr.declinedInquiries}
              </span>
              <span className="text-2xl font-black text-slate-700">{declinedCount}</span>
            </div>
          </div>

          {/* Action & Filter Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e5e0d6] shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Search Box */}
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  value={searchInquiry}
                  onChange={(e) => setSearchInquiry(e.target.value)}
                  placeholder={tr.searchInquiryPlaceholder}
                  className="w-full ps-9 pe-4 py-2 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5] focus:bg-white focus:border-[#231f20] outline-none transition-all"
                />
                <span className="absolute start-3 top-1/2 -translate-y-1/2 text-xs text-[#5C5A55]">
                  🔍
                </span>
                {searchInquiry && (
                  <button
                    type="button"
                    onClick={() => setSearchInquiry('')}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-xs text-[#5C5A55] hover:text-[#231f20]"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Status & Type Selectors + Export */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end flex-wrap">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs font-bold bg-[#FAF8F5] text-[#231f20] outline-none"
                >
                  <option value="all">{tr.filterAllStatus}</option>
                  <option value="pending">{tr.statusPending}</option>
                  <option value="under_review">{tr.statusUnderReview}</option>
                  <option value="approved">{tr.statusApproved}</option>
                  <option value="declined">{tr.statusDeclined}</option>
                </select>

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs font-bold bg-[#FAF8F5] text-[#231f20] outline-none"
                >
                  <option value="all">{tr.filterAllTypes}</option>
                  <option value="cultural_center">Cultural Center</option>
                  <option value="educational">Educational</option>
                  <option value="ngo">Civil Society / NGO</option>
                  <option value="corporate">Private Sponsor</option>
                  <option value="public_body">Public Institution</option>
                </select>

                <CsvExportButton data={exportData} filename="amycc-partnerships-inquiries" />
              </div>
            </div>
          </div>

          {/* Inquiries Mobile Cards & Desktop Table */}
          <div className="bg-white rounded-3xl border border-[#e5e0d6] overflow-hidden shadow-2xs">
            {/* Mobile Cards View (< md) */}
            <div className="block md:hidden divide-y divide-[#e5e0d6]">
              {filteredInquiries.length > 0 ? (
                filteredInquiries.map((inq) => {
                  const dateObj = new Date(inq.created_at)
                  return (
                    <div key={inq.id} className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="font-extrabold text-[#231f20] text-xs block">
                            {inq.organization_name}
                          </span>
                          <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-4xs font-bold bg-[#FAF8F5] border border-[#e5e0d6] text-[#bd3227]">
                            {inq.organization_type}
                          </span>
                        </div>
                        <span className="text-4xs text-[#5C5A55] font-mono shrink-0">
                          {dateObj.toLocaleDateString(locale === 'ar' ? 'ar-MA' : 'en-US')}
                        </span>
                      </div>

                      <div className="text-2xs text-[#5C5A55] space-y-1">
                        <div>👤 <span className="font-bold text-[#231f20]">{inq.contact_name}</span> ({inq.email})</div>
                        <div>📍 {inq.city}, {inq.country}</div>
                      </div>

                      <p className="text-2xs text-[#5C5A55] line-clamp-2 bg-[#FAF8F5] p-2.5 rounded-xl border border-[#e5e0d6]">
                        {inq.proposal}
                      </p>

                      <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#f0ece1]">
                        <select
                          value={inq.status}
                          disabled={processingInquiryId === inq.id}
                          onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-3xs font-extrabold cursor-pointer outline-none border transition-all ${
                            inq.status === 'approved'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : inq.status === 'under_review'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : inq.status === 'declined'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          <option value="pending">{tr.statusPending}</option>
                          <option value="under_review">{tr.statusUnderReview}</option>
                          <option value="approved">{tr.statusApproved}</option>
                          <option value="declined">{tr.statusDeclined}</option>
                        </select>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setViewingInquiry(inq)}
                            className="px-2.5 py-1 rounded-lg text-2xs font-bold bg-[#FAF8F5] border border-[#e5e0d6] text-[#231f20]"
                          >
                            {tr.viewDetails}
                          </button>
                          <button
                            type="button"
                            disabled={processingInquiryId === inq.id}
                            onClick={() => handleDeleteInquiry(inq.id, inq.organization_name)}
                            className="px-2.5 py-1 rounded-lg text-2xs font-bold text-rose-600 hover:bg-rose-50"
                          >
                            {tr.delete}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="p-8 text-center text-[#5C5A55] text-xs font-semibold">
                  {tr.noInquiriesFound}
                </div>
              )}
            </div>

            {/* Desktop Table View (>= md) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-start text-xs text-[#231f20]">
                <thead className="bg-[#FAF8F5] border-b border-[#e5e0d6] text-3xs uppercase tracking-wider text-[#5C5A55] font-extrabold">
                  <tr>
                    <th className="px-6 py-4 text-start">{tr.colOrg}</th>
                    <th className="px-6 py-4 text-start">{tr.colContact}</th>
                    <th className="px-6 py-4 text-start">{tr.colProposal}</th>
                    <th className="px-6 py-4 text-start">{tr.colStatus}</th>
                    <th className="px-6 py-4 text-start">{tr.colActions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0ece1]">
                  {filteredInquiries.length > 0 ? (
                    filteredInquiries.map((inq) => {
                      const dateObj = new Date(inq.created_at)
                      return (
                        <tr key={inq.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-extrabold text-[#231f20] text-xs">
                              {inq.organization_name}
                            </div>
                            <span className="inline-block mt-1 px-2 py-0.5 rounded text-4xs font-bold bg-[#FAF8F5] border border-[#e5e0d6] text-[#bd3227]">
                              {inq.organization_type}
                            </span>
                            <div className="text-3xs text-[#5C5A55] mt-0.5">
                              📍 {inq.city}, {inq.country}
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="font-bold text-[#231f20]">{inq.contact_name}</div>
                            <a
                              href={`mailto:${inq.email}`}
                              className="text-3xs text-[#231f20] hover:underline block font-mono"
                            >
                              {inq.email}
                            </a>
                            {inq.phone && (
                              <div className="text-3xs text-[#5C5A55] font-mono mt-0.5">
                                📞 {inq.phone}
                              </div>
                            )}
                          </td>

                          <td className="px-6 py-4 max-w-xs">
                            <p className="text-2xs text-[#5C5A55] line-clamp-2 leading-relaxed">
                              {inq.proposal}
                            </p>
                            <span className="text-4xs text-[#5C5A55] block mt-1">
                              📅 {dateObj.toLocaleDateString(locale === 'ar' ? 'ar-MA' : 'en-US')}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <select
                              value={inq.status}
                              disabled={processingInquiryId === inq.id}
                              onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                              className={`px-3 py-1 rounded-full text-3xs font-extrabold cursor-pointer outline-none border transition-all ${
                                inq.status === 'approved'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : inq.status === 'under_review'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : inq.status === 'declined'
                                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                                  : 'bg-slate-100 text-slate-700 border-slate-200'
                              }`}
                            >
                              <option value="pending">{tr.statusPending}</option>
                              <option value="under_review">{tr.statusUnderReview}</option>
                              <option value="approved">{tr.statusApproved}</option>
                              <option value="declined">{tr.statusDeclined}</option>
                            </select>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setViewingInquiry(inq)}
                                className="px-3 py-1.5 rounded-lg text-2xs font-bold bg-[#FAF8F5] border border-[#e5e0d6] text-[#231f20] hover:bg-[#F4EFE6] transition-colors cursor-pointer"
                                title={tr.viewDetails}
                              >
                                {tr.viewDetails}
                              </button>
                              <button
                                type="button"
                                disabled={processingInquiryId === inq.id}
                                onClick={() => handleDeleteInquiry(inq.id, inq.organization_name)}
                                className="px-2.5 py-1.5 rounded-lg text-2xs font-bold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors disabled:opacity-50 cursor-pointer"
                              >
                                {tr.delete}
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-[#5C5A55]">
                        {tr.noInquiriesFound}
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
      {/* TAB 2: OFFICIAL PARTNERS & LIVE MOVING IMAGES MARQUEE     */}
      {/* ========================================================= */}
      {activeTab === 'partners' && (
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#e5e0d6] shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🎬</span>
                  <h2 className="text-base sm:text-lg font-black text-[#231f20]">
                    {tr.marqueeTitle}
                  </h2>
                </div>
                <p className="text-xs text-[#5C5A55] mt-0.5">
                  {tr.marqueeSubtitle}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {config.partners && config.partners.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAllPartners}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl hover:bg-rose-100 transition-all cursor-pointer shadow-2xs"
                    title={tr.clearAllPartners}
                  >
                    <span>🗑️</span>
                    <span>{tr.clearAllPartners} ({config.partners.length})</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={openAddPartnerModal}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#231f20] text-white text-xs font-bold rounded-xl hover:bg-[#d2a82b] active:scale-98 transition-all shadow-xs cursor-pointer"
                >
                  <span>➕</span>
                  <span>{tr.addPartner}</span>
                </button>
              </div>
            </div>

            {/* Live Moving Images Marquee Preview */}
            <div className="pt-2">
              <div className="flex items-center justify-between pb-3 text-xs font-bold">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[#231f20]">
                    {tr.liveMarquee}
                  </span>
                  <span className="text-2xs font-bold bg-[#FAF8F5] px-2 py-0.5 rounded-md border border-[#e5e0d6] text-[#5C5A55]">
                    {activePartnersCount} {tr.activePartnersMoving}
                  </span>
                </div>
              </div>

              {/* The Live Moving Marquee Container - dir="ltr" ensures LTR coordinates and stops RTL track clipping */}
              <div
                dir="ltr"
                className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-b from-[#F5F3EE] via-[#F5F3EE] to-[#F5F3EE] border border-[#e5e0d6] py-6 shadow-inner select-none"
              >
                {/* Side Fade Gradient Masks */}
                <div
                  className="absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-[#F5F3EE] to-transparent z-10 pointer-events-none"
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-[#F5F3EE] to-transparent z-10 pointer-events-none"
                  aria-hidden="true"
                />

                {adminMarqueeBlock.length > 0 ? (
                  <div className="flex w-max animate-marquee-continuous hover:[animation-play-state:paused]">
                    {/* Block A */}
                    <div className="flex items-center gap-6 shrink-0 pr-6">
                      {adminMarqueeBlock.map((partner, idx) =>
                        renderAdminCard(partner, `a-${partner.id}-${idx}`)
                      )}
                    </div>

                    {/* Block B (Identical clone for seamless 50% infinite translation) */}
                    <div className="flex items-center gap-6 shrink-0 pr-6" aria-hidden="true">
                      {adminMarqueeBlock.map((partner, idx) =>
                        renderAdminCard(partner, `b-${partner.id}-${idx}`, true)
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-[#5C5A55] text-xs font-semibold">
                    {tr.noActivePartners}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Management Table for Full Control & Search */}
          <div className="bg-white rounded-2xl border border-[#e5e0d6] shadow-2xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-[#E5E0D6] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-base">📋</span>
                <h3 className="text-xs sm:text-sm font-black text-[#231f20]">
                  {tr.partnersListTitle} ({config.partners?.length || 0})
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    value={searchPartner}
                    onChange={(e) => setSearchPartner(e.target.value)}
                    placeholder={tr.searchPartnerPlaceholder}
                    className="w-full ps-8 pe-3 py-1.5 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5] outline-none"
                  />
                  <span className="absolute start-2.5 top-1/2 -translate-y-1/2 text-xs text-[#5C5A55]">
                    🔍
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Cards View (< md) */}
            <div className="block md:hidden divide-y divide-[#e5e0d6]">
              {filteredPartners.length > 0 ? (
                filteredPartners.map((partner) => (
                  <div key={partner.id} className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl border border-[#e5e0d6] overflow-hidden bg-[#FAF8F5] shrink-0">
                        <ImageWithFallback
                          src={partner.logoUrl}
                          fallbackSrc="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=300&q=80"
                          alt={partner.nameAr}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="font-extrabold text-[#231f20] block text-xs truncate">
                          {isAr ? partner.nameAr : isFr ? (partner.nameFr || partner.nameAr) : (partner.nameEn || partner.nameAr)}
                        </span>
                        <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-4xs font-bold bg-[#FAF8F5] border border-[#e5e0d6] text-[#bd3227]">
                          {tierLabels[partner.tier]?.[locale as 'ar' | 'fr' | 'en'] || partner.tier}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#f0ece1]">
                      <button
                        type="button"
                        onClick={() => handleTogglePartnerActive(partner.id)}
                        className={`px-3 py-1 rounded-full text-3xs font-extrabold border transition-all cursor-pointer ${
                          partner.active
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-rose-50 text-rose-800 border-rose-200'
                        }`}
                      >
                        {partner.active ? tr.activeInMarquee : tr.hiddenFromMarquee}
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditPartnerModal(partner)}
                          className="px-2.5 py-1 rounded-lg text-2xs font-bold bg-[#FAF8F5] border border-[#e5e0d6] hover:bg-[#F4EFE6] text-[#231f20]"
                        >
                          {tr.edit}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePartner(partner.id, partner.nameAr)}
                          className="px-2.5 py-1 rounded-lg text-2xs font-bold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200"
                        >
                          {tr.delete}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-[#5C5A55] text-xs font-semibold">
                  {tr.noPartnersFound}
                </div>
              )}
            </div>

            {/* Desktop Table View (>= md) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-start text-xs">
                <thead className="bg-[#FAF8F5] text-[#5C5A55] font-bold border-b border-[#e5e0d6]">
                  <tr>
                    <th className="px-5 py-3 text-start">{tr.colImage}</th>
                    <th className="px-5 py-3 text-start">{tr.colPartnerName}</th>
                    <th className="px-5 py-3 text-start">{tr.colTier}</th>
                    <th className="px-5 py-3 text-center">{tr.colMarqueeStatus}</th>
                    <th className="px-5 py-3 text-end">{tr.colActions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0ece1]">
                  {filteredPartners.length > 0 ? (
                    filteredPartners.map((partner) => (
                      <tr key={partner.id} className="hover:bg-stone-50/50 transition-colors">
                        <td className="px-5 py-3">
                          <div className="relative w-12 h-12 rounded-xl border border-[#e5e0d6] overflow-hidden bg-[#FAF8F5] shrink-0">
                            <ImageWithFallback
                              src={partner.logoUrl}
                              fallbackSrc="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=300&q=80"
                              alt={partner.nameAr}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <span className="font-extrabold text-[#231f20] block">
                            {isAr ? partner.nameAr : isFr ? (partner.nameFr || partner.nameAr) : (partner.nameEn || partner.nameAr)}
                          </span>
                          {partner.nameFr && !isFr && (
                            <span className="text-3xs text-[#5C5A55] block">{partner.nameFr}</span>
                          )}
                        </td>
                        <td className="px-5 py-3">
                          <span className="inline-block px-2 py-0.5 rounded text-4xs font-bold bg-[#FAF8F5] border border-[#e5e0d6] text-[#bd3227]">
                            {tierLabels[partner.tier]?.[locale as 'ar' | 'fr' | 'en'] || partner.tier}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleTogglePartnerActive(partner.id)}
                            className={`px-3 py-1 rounded-full text-3xs font-extrabold border transition-all cursor-pointer ${
                              partner.active
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-rose-50 text-rose-800 border-rose-200'
                            }`}
                          >
                            {partner.active ? tr.activeInMarquee : tr.hiddenFromMarquee}
                          </button>
                        </td>
                        <td className="px-5 py-3 text-end">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEditPartnerModal(partner)}
                              className="px-2.5 py-1 rounded-lg text-2xs font-bold bg-[#FAF8F5] border border-[#e5e0d6] hover:bg-[#F4EFE6] text-[#231f20] transition-colors cursor-pointer"
                            >
                              {tr.edit}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePartner(partner.id, partner.nameAr)}
                              className="px-2.5 py-1 rounded-lg text-2xs font-bold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                            >
                              {tr.delete}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-[#5C5A55] text-xs font-semibold">
                        <span className="text-xl block mb-1">🔍</span>
                        <span>{tr.noPartnersFound}</span>
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
      {/* TAB 3: PARTNERSHIPS PAGE CMS SETTINGS                     */}
      {/* ========================================================= */}
      {activeTab === 'page-settings' && (
        <div className="space-y-6">
          {/* Language Selector Bar */}
          <div className="bg-white p-4 rounded-2xl border border-[#e5e0d6] shadow-2xs flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#231f20]">
              لغة التحرير والمعاينة:
            </span>
            <div className="flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-xl border border-[#e5e0d6]">
              {(['ar', 'fr', 'en'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveLangTab(lang)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeLangTab === lang
                      ? 'bg-[#231f20] text-white shadow-2xs'
                      : 'text-[#5C5A55] hover:bg-[#F4EFE6]'
                  }`}
                >
                  {lang === 'ar' ? 'العربية (AR)' : lang === 'fr' ? 'Français (FR)' : 'English (EN)'}
                </button>
              ))}
            </div>
          </div>

          {/* Section 1: Hero Section */}
          <div className="bg-white p-6 rounded-2xl border border-[#e5e0d6] shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E0D6]">
              <div>
                <h3 className="font-extrabold text-sm text-[#231f20]">
                  واجهة الترويسة الرئيسية (Hero Section)
                </h3>
                <p className="text-3xs text-[#5C5A55]">
                  عنوان الصفحة، الشارة الترحيبية، أزرار التفاعل، وصورة الشراكات الرئيسية
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-md text-3xs font-extrabold bg-[#FAF8F5] text-[#231f20] border border-[#e5e0d6]">
                {activeLangTab.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-2xs font-extrabold text-[#231f20] mb-1.5">
                  الشارة العلوية (Badge)
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
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5] focus:bg-white focus:border-[#231f20] outline-none"
                />
              </div>

              <div>
                <label className="block text-2xs font-extrabold text-[#231f20] mb-1.5">
                  الوسم المؤسساتي (Tag)
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
                      activeLangTab === 'ar'
                        ? 'tagAr'
                        : activeLangTab === 'fr'
                        ? 'tagFr'
                        : 'tagEn',
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5] focus:bg-white focus:border-[#231f20] outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-2xs font-extrabold text-[#231f20] mb-1.5">
                  العنوان الرئيسي (Hero Title)
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
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5] focus:bg-white focus:border-[#231f20] outline-none font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-2xs font-extrabold text-[#231f20] mb-1.5">
                  العنوان الفرعي (Subtitle)
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
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5] focus:bg-white focus:border-[#231f20] outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-2xs font-extrabold text-[#231f20] mb-1.5">
                  الوصف التفصيلي للرؤية التشاركية
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
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5] focus:bg-white focus:border-[#231f20] outline-none leading-relaxed"
                />
              </div>

              {/* Action Buttons & Brochure */}
              <div>
                <label className="block text-2xs font-extrabold text-[#231f20] mb-1.5">
                  نص الزر الرئيسي (تقديم مقترح)
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
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5] focus:bg-white focus:border-[#231f20] outline-none"
                />
              </div>

              <div>
                <label className="block text-2xs font-extrabold text-[#231f20] mb-1.5">
                  نص زر تحميل الملف التعريفي (PDF)
                </label>
                <input
                  type="text"
                  value={
                    activeLangTab === 'ar'
                      ? config.hero.brochureBtnTextAr
                      : activeLangTab === 'fr'
                      ? config.hero.brochureBtnTextFr
                      : config.hero.brochureBtnTextEn
                  }
                  onChange={(e) =>
                    updateHero(
                      activeLangTab === 'ar'
                        ? 'brochureBtnTextAr'
                        : activeLangTab === 'fr'
                        ? 'brochureBtnTextFr'
                        : 'brochureBtnTextEn',
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5] focus:bg-white focus:border-[#231f20] outline-none"
                />
              </div>

              {/* Image Uploader */}
              <div className="sm:col-span-2 pt-2 border-t border-[#E5E0D6]">
                <label className="block text-2xs font-extrabold text-[#231f20] mb-1.5">
                  صورة الغلاف المؤسساتي (Hero Image)
                </label>
                <input
                  ref={heroFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleHeroImageUpload}
                  className="hidden"
                />
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={config.hero.imageUrl}
                    onChange={(e) => updateHero('imageUrl', e.target.value)}
                    placeholder="https://images.unsplash.com/... or /uploads/..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#e5e0d6] text-xs font-mono bg-[#FAF8F5] outline-none"
                  />
                  <button
                    type="button"
                    disabled={uploadingImage}
                    onClick={() => heroFileInputRef.current?.click()}
                    className="px-4 py-2.5 bg-[#231f20] text-white text-xs font-bold rounded-xl hover:bg-[#d2a82b] active:scale-98 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-2xs"
                  >
                    <span>{uploadingImage ? '⏳' : '📥'}</span>
                    <span>{uploadingImage ? 'جارٍ الاستيراد...' : 'Import / استيراد صورة'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Key Partnership KPIs */}
          <div className="bg-white p-6 rounded-2xl border border-[#e5e0d6] shadow-2xs space-y-4">
            <h3 className="font-extrabold text-sm text-[#231f20] pb-2 border-b border-[#E5E0D6]">
              إحصائيات وأرقام أثر الشراكات (Key Metrics)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {config.stats.map((stat, idx) => (
                <div
                  key={stat.id || idx}
                  className="p-4 rounded-xl border border-[#e5e0d6] bg-[#FAF8F5] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl">{stat.icon}</span>
                    <input
                      type="text"
                      value={stat.icon}
                      onChange={(e) => updateStat(idx, 'icon', e.target.value)}
                      className="w-12 text-center py-1 rounded border border-[#e5e0d6] text-xs bg-white"
                      title="الأيقونة"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-3xs font-bold text-[#5C5A55] mb-1">
                        الرقم أو النسبة ({activeLangTab.toUpperCase()})
                      </label>
                      <input
                        type="text"
                        value={
                          activeLangTab === 'ar'
                            ? stat.valueAr
                            : activeLangTab === 'fr'
                            ? stat.valueFr
                            : stat.valueEn
                        }
                        onChange={(e) =>
                          updateStat(
                            idx,
                            activeLangTab === 'ar'
                              ? 'valueAr'
                              : activeLangTab === 'fr'
                              ? 'valueFr'
                              : 'valueEn',
                            e.target.value
                          )
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#e5e0d6] text-xs font-bold bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-3xs font-bold text-[#5C5A55] mb-1">
                        الوصف / التسمية
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
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#e5e0d6] text-xs font-bold bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Partnership Pillars */}
          <div className="bg-white p-6 rounded-2xl border border-[#e5e0d6] shadow-2xs space-y-4">
            <h3 className="font-extrabold text-sm text-[#231f20] pb-2 border-b border-[#E5E0D6]">
              محاور ومجالات التعاون الاستراتيجي (Cooperation Pillars)
            </h3>
            <div className="space-y-4">
              {config.pillars.map((pillar, idx) => (
                <div
                  key={pillar.id || idx}
                  className="p-4 rounded-xl border border-[#e5e0d6] bg-[#FAF8F5] space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={pillar.icon}
                      onChange={(e) => updatePillar(idx, 'icon', e.target.value)}
                      className="w-12 text-center py-1.5 rounded-lg border border-[#e5e0d6] text-base bg-white"
                    />
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={
                          activeLangTab === 'ar'
                            ? pillar.titleAr
                            : activeLangTab === 'fr'
                            ? pillar.titleFr
                            : pillar.titleEn
                        }
                        onChange={(e) =>
                          updatePillar(
                            idx,
                            activeLangTab === 'ar'
                              ? 'titleAr'
                              : activeLangTab === 'fr'
                              ? 'titleFr'
                              : 'titleEn',
                            e.target.value
                          )
                        }
                        placeholder="عنوان المحور"
                        className="px-3 py-1.5 rounded-lg border border-[#e5e0d6] text-xs font-bold bg-white"
                      />
                      <input
                        type="text"
                        value={
                          activeLangTab === 'ar'
                            ? pillar.tagAr
                            : activeLangTab === 'fr'
                            ? pillar.tagFr
                            : pillar.tagEn
                        }
                        onChange={(e) =>
                          updatePillar(
                            idx,
                            activeLangTab === 'ar'
                              ? 'tagAr'
                              : activeLangTab === 'fr'
                              ? 'tagFr'
                              : 'tagEn',
                            e.target.value
                          )
                        }
                        placeholder="الوسم"
                        className="px-3 py-1.5 rounded-lg border border-[#e5e0d6] text-xs bg-white text-[#bd3227] font-semibold"
                      />
                    </div>
                  </div>
                  <textarea
                    rows={2}
                    value={
                      activeLangTab === 'ar'
                        ? pillar.descriptionAr
                        : activeLangTab === 'fr'
                        ? pillar.descriptionFr
                        : pillar.descriptionEn
                    }
                    onChange={(e) =>
                      updatePillar(
                        idx,
                        activeLangTab === 'ar'
                          ? 'descriptionAr'
                          : activeLangTab === 'fr'
                          ? 'descriptionFr'
                          : 'descriptionEn',
                        e.target.value
                      )
                    }
                    placeholder="شرح مجالات التعاون والتنسيق في هذا المحور..."
                    className="w-full px-3 py-2 rounded-lg border border-[#e5e0d6] text-xs bg-white outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Strategic Benefits */}
          <div className="bg-white p-6 rounded-2xl border border-[#e5e0d6] shadow-2xs space-y-4">
            <h3 className="font-extrabold text-sm text-[#231f20] pb-2 border-b border-[#E5E0D6]">
              القيمة المضافة والمكتسبات المشتركة (Strategic Benefits)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {config.benefits.map((benefit, idx) => (
                <div
                  key={benefit.id || idx}
                  className="p-4 rounded-xl border border-[#e5e0d6] bg-[#FAF8F5] space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={benefit.icon}
                      onChange={(e) => updateBenefit(idx, 'icon', e.target.value)}
                      className="w-10 text-center py-1 rounded-lg border border-[#e5e0d6] text-sm bg-white"
                    />
                    <input
                      type="text"
                      value={
                        activeLangTab === 'ar'
                          ? benefit.titleAr
                          : activeLangTab === 'fr'
                          ? benefit.titleFr
                          : benefit.titleEn
                      }
                      onChange={(e) =>
                        updateBenefit(
                          idx,
                          activeLangTab === 'ar'
                            ? 'titleAr'
                            : activeLangTab === 'fr'
                            ? 'titleFr'
                            : 'titleEn',
                          e.target.value
                        )
                      }
                      placeholder="عنوان المكتسب"
                      className="flex-1 px-3 py-1.5 rounded-lg border border-[#e5e0d6] text-xs font-bold bg-white"
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={
                      activeLangTab === 'ar'
                        ? benefit.descriptionAr
                        : activeLangTab === 'fr'
                        ? benefit.descriptionFr
                        : benefit.descriptionEn
                    }
                    onChange={(e) =>
                      updateBenefit(
                        idx,
                        activeLangTab === 'ar'
                          ? 'descriptionAr'
                          : activeLangTab === 'fr'
                          ? 'descriptionFr'
                          : 'descriptionEn',
                        e.target.value
                      )
                    }
                    placeholder="وصف القيمة المضافة للشراكة..."
                    className="w-full px-3 py-1.5 rounded-lg border border-[#e5e0d6] text-xs bg-white outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Bottom CTA */}
          <div className="bg-white p-6 rounded-2xl border border-[#e5e0d6] shadow-2xs space-y-4">
            <h3 className="font-extrabold text-sm text-[#231f20] pb-2 border-b border-[#E5E0D6]">
              صندوق الدعوة والتواصل المؤسساتي (Call-to-Action)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-2xs font-extrabold text-[#231f20] mb-1">
                  العنوان التحفيزي ({activeLangTab.toUpperCase()})
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
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5] font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-2xs font-extrabold text-[#231f20] mb-1">
                  الوصف
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
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5]"
                />
              </div>

              <div>
                <label className="block text-2xs font-extrabold text-[#231f20] mb-1">
                  البريد الإلكتروني المؤسساتي
                </label>
                <input
                  type="email"
                  value={config.cta.email}
                  onChange={(e) => updateCta('email', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs font-mono bg-[#FAF8F5]"
                />
              </div>

              <div>
                <label className="block text-2xs font-extrabold text-[#231f20] mb-1">
                  رقم الهاتف أو قسم التنسيق
                </label>
                <input
                  type="text"
                  value={config.cta.phone}
                  onChange={(e) => updateCta('phone', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs font-mono bg-[#FAF8F5]"
                />
              </div>
            </div>
          </div>

          {/* Sticky Save Bar */}
          <div className="p-4 rounded-2xl bg-[#231f20] text-white flex items-center justify-between shadow-md">
            <div>
              <span className="font-extrabold text-xs block">تثبيت كافة التعديلات والتخصيص</span>
              <span className="text-3xs text-white/70">
                يتم تحديث واجهة صفحة الشراكات على الموقع فورياً بمجرد الضغط على الحفظ
              </span>
            </div>
            <button
              type="button"
              disabled={savingConfig}
              onClick={() => persistConfig(config)}
              className="px-6 py-2.5 rounded-xl text-xs font-black bg-[#bd3227] hover:bg-[#a3261c] active:scale-98 transition-all disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {savingConfig ? 'جارٍ الحفظ...' : 'حفظ التغييرات الآن ✓'}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: PROPOSAL DETAILS MODAL                           */}
      {/* ========================================================= */}
      {viewingInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl border border-[#e5e0d6]">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E5E0D6]">
              <div>
                <span className="inline-block px-2.5 py-1 rounded text-3xs font-extrabold bg-[#FAF8F5] border border-[#e5e0d6] text-[#bd3227] mb-1.5">
                  {viewingInquiry.organization_type}
                </span>
                <h3 className="text-lg font-black text-[#231f20]">
                  {viewingInquiry.organization_name}
                </h3>
                <span className="text-3xs text-[#5C5A55]">
                  📍 {viewingInquiry.city}, {viewingInquiry.country} • تاريخ الاستلام:{' '}
                  {new Date(viewingInquiry.created_at).toLocaleString('ar-MA')}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setViewingInquiry(null)}
                className="w-8 h-8 rounded-full bg-[#FAF8F5] flex items-center justify-center text-xs font-bold text-[#5C5A55] hover:text-[#231f20]"
              >
                ✕
              </button>
            </div>

            {/* Contact details */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="block text-3xs font-bold text-[#5C5A55]">المسؤول عن التواصل:</span>
                <span className="font-extrabold text-[#231f20]">{viewingInquiry.contact_name}</span>
              </div>
              <div>
                <span className="block text-3xs font-bold text-[#5C5A55]">البريد الإلكتروني:</span>
                <a
                  href={`mailto:${viewingInquiry.email}`}
                  className="font-mono text-[#231f20] hover:underline"
                >
                  {viewingInquiry.email}
                </a>
              </div>
              {viewingInquiry.phone && (
                <div>
                  <span className="block text-3xs font-bold text-[#5C5A55]">الهاتف:</span>
                  <span className="font-mono text-[#231f20]">{viewingInquiry.phone}</span>
                </div>
              )}
              <div>
                <span className="block text-3xs font-bold text-[#5C5A55]">الحالة الحالية:</span>
                <span className="font-extrabold text-[#231f20]">{viewingInquiry.status}</span>
              </div>
            </div>

            {/* Proposal Content */}
            <div className="space-y-2">
              <h4 className="text-xs font-black text-[#231f20] uppercase tracking-wider">
                نص مقترح الشراكة ومجالات التعاون:
              </h4>
              <div className="p-4 rounded-2xl bg-white border border-[#e5e0d6] text-xs sm:text-sm text-[#231f20] leading-relaxed whitespace-pre-wrap">
                {viewingInquiry.proposal}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#E5E0D6]">
              <select
                value={viewingInquiry.status}
                onChange={(e) => {
                  handleStatusChange(viewingInquiry.id, e.target.value)
                  setViewingInquiry((prev) => (prev ? { ...prev, status: e.target.value } : null))
                }}
                className="px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs font-bold bg-[#FAF8F5] text-[#231f20]"
              >
                <option value="pending">جديد (Pending)</option>
                <option value="under_review">قيد الدراسة</option>
                <option value="approved">معتمد ✓</option>
                <option value="declined">مرفوض ✕</option>
                <option value="archived">مؤرشف</option>
              </select>

              <button
                type="button"
                onClick={() => setViewingInquiry(null)}
                className="px-5 py-2 bg-[#231f20] text-white text-xs font-bold rounded-xl hover:bg-[#d2a82b] transition-all"
              >
                إغلاق النافذة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: ADD / EDIT PARTNER MODAL                         */}
      {/* ========================================================= */}
      {(isAddingPartner || editingPartner) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <form
            onSubmit={handleSavePartnerSubmit}
            className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl border border-[#e5e0d6]"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E0D6]">
              <h3 className="text-base font-black text-[#231f20]">
                {editingPartner ? 'تعديل بيانات الشريك' : 'إضافة شريك رسمي جديد'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsAddingPartner(false)
                  setEditingPartner(null)
                }}
                className="w-8 h-8 rounded-full bg-[#FAF8F5] flex items-center justify-center text-xs font-bold text-[#5C5A55] hover:text-[#231f20]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-2xs font-extrabold text-[#231f20] mb-1">
                  اسم المؤسسة / الشريك (العربية) *
                </label>
                <input
                  type="text"
                  required
                  value={partnerForm.nameAr}
                  onChange={(e) => setPartnerForm((p) => ({ ...p, nameAr: e.target.value }))}
                  placeholder="مثال: شبكة المراكز الثقافية ودور الشباب"
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5] font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-extrabold text-[#231f20] mb-1">
                    الاسم بالفرنسية (Français)
                  </label>
                  <input
                    type="text"
                    value={partnerForm.nameFr || ''}
                    onChange={(e) => setPartnerForm((p) => ({ ...p, nameFr: e.target.value }))}
                    placeholder="Nom en français"
                    className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5]"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-extrabold text-[#231f20] mb-1">
                    الاسم بالإنجليزية (English)
                  </label>
                  <input
                    type="text"
                    value={partnerForm.nameEn || ''}
                    onChange={(e) => setPartnerForm((p) => ({ ...p, nameEn: e.target.value }))}
                    placeholder="Name in English"
                    className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs bg-[#FAF8F5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-2xs font-extrabold text-[#231f20] mb-1">
                  تصنيف الشراكة (Tier)
                </label>
                <select
                  value={partnerForm.tier}
                  onChange={(e) =>
                    setPartnerForm((p) => ({ ...p, tier: e.target.value as PartnerTier }))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs font-bold bg-[#FAF8F5] text-[#231f20]"
                >
                  <option value="cultural">مركز ثقافي وفني</option>
                  <option value="educational">مؤسسة تعليمية / جامعة</option>
                  <option value="civil_society">مجتمع مدني / جمعية</option>
                  <option value="institutional">هيئة عمومية ومؤسساتية</option>
                  <option value="sponsor">قطاع خاص / راعي</option>
                </select>
              </div>

              {/* Logo URL + Upload */}
              <div>
                <label className="block text-2xs font-extrabold text-[#231f20] mb-1">
                  شعار الشريك (Logo URL)
                </label>
                <input
                  ref={logoFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePartnerLogoUpload}
                  className="hidden"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={partnerForm.logoUrl}
                    onChange={(e) => setPartnerForm((p) => ({ ...p, logoUrl: e.target.value }))}
                    placeholder="https://... or /uploads/..."
                    className="flex-1 px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs font-mono bg-[#FAF8F5]"
                  />
                  <button
                    type="button"
                    disabled={uploadingLogo}
                    onClick={() => logoFileInputRef.current?.click()}
                    className="px-3 py-2 bg-[#231f20] text-white text-xs font-bold rounded-xl hover:bg-[#d2a82b] shrink-0 cursor-pointer"
                  >
                    {uploadingLogo ? 'جارٍ الرفع...' : 'استيراد الشعار'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-2xs font-extrabold text-[#231f20] mb-1">
                  رابط الموقع الإلكتروني (Website URL)
                </label>
                <input
                  type="url"
                  value={partnerForm.websiteUrl || ''}
                  onChange={(e) => setPartnerForm((p) => ({ ...p, websiteUrl: e.target.value }))}
                  placeholder="https://partner-website.com"
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs font-mono bg-[#FAF8F5]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="partner-active-checkbox"
                  checked={partnerForm.active}
                  onChange={(e) => setPartnerForm((p) => ({ ...p, active: e.target.checked }))}
                  className="w-4 h-4 rounded text-[#231f20]"
                />
                <label
                  htmlFor="partner-active-checkbox"
                  className="text-xs font-bold text-[#231f20] cursor-pointer"
                >
                  تفعيل ظهور الشريك في دليل الشركاء بالموقع
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E0D6]">
              <button
                type="button"
                onClick={() => {
                  setIsAddingPartner(false)
                  setEditingPartner(null)
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#5C5A55] hover:bg-[#FAF8F5]"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#231f20] text-white text-xs font-bold rounded-xl hover:bg-[#d2a82b] active:scale-98 transition-all shadow-xs cursor-pointer"
              >
                {editingPartner ? 'حفظ التعديلات' : 'إضافة الشريك الآن ✓'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { AreasConfig, AreaItemConfig } from '@/lib/settings'
import { saveAreasConfiguration } from '@/lib/actions/admin'
import { useAdminLocale } from './AdminLocaleContext'

const AREAS_STRINGS = {
  ar: {
    title: 'إدارة مجالات النشاط والتدخل الجمعوي (Areas CMS)',
    subtitle: 'تحكم كامل في نصوص البطاقات ومحتوى النوافذ المنبثقة التفاعلية في الواجهة الرئيسية.',
    previewFront: 'معاينة الواجهة',
    toggleHeader: 'نصوص القسم',
    hideHeader: 'إخفاء نصوص القسم',
    addNew: 'إضافة مجال جديد',
    saveAll: 'حفظ كافة التغييرات',
    saving: 'جاري الحفظ...',
    totalDisciplines: 'إجمالي المجالات',
    activeHomepage: 'مفعلة بالرئيسية',
    popupContent: 'محتوى النوافذ',
    popupActive: '✓ نوافذ تفاعلية منبثقة',
    changesState: 'حالة التعديلات',
    hasUnsaved: '⚠️ تعديلات غير محفوظة',
    allSaved: '✓ كافة التغييرات محفوظة',
    saveSuccess: 'تم حفظ مجالات النشاط ومحتوى النوافذ المنبثقة بنجاح على الصفحة الرئيسية!',
    saveError: 'فشل حفظ مجالات النشاط',
    sectionEyebrow: 'الشارة العلوية بالعربية (Eyebrow)',
    sectionTitle: 'العنوان الرئيسي بالعربية (Title)',
    sectionSubtitle: 'الوصف التوضيحي بالعربية (Subtitle)',
    globalWorkshops: 'إظهار قسم البرامج والورشات في كافة المجالات (تحكم عام)',
    globalWorkshopsDesc: 'تفعيل أو تعطيل ظهور قسم البرامج والورشات بالنوافذ لجميع المجالات دفعة واحدة',
    enabled: '✓ مفعّل ومعروض',
    disabled: '✕ معطّل ومخفي',
    workshopsShown: '✨ الورشات: معروضة بالنافذة',
    workshopsHidden: '✨ الورشات: مخفية من النافذة',
    stratObjectives: 'أهداف استراتيجية',
    workshopsAndProgs: 'ورشات وبرامج',
    hiddenLabel: '(مخفية)',
    btnLink: 'رابط الزر:',
    editDomain: 'تعديل المجال والنافذة',
    delete: 'حذف',
    deleteConfirm: 'هل أنت متأكد من رغبتك في حذف هذا المجال؟',
    modalEditTitle: 'تعديل مجال النشاط والنافذة المنبثقة',
    modalAddTitle: 'إضافة مجال نشاط جديد',
    tabCard: 'بطاقة الواجهة الرئيسية (Card)',
    tabModal: 'محتوى النافذة المنبثقة (Modal Dialog)',
    cancel: 'إلغاء',
    applyChanges: 'تطبيق التعديلات',
  },
  fr: {
    title: 'Domaines d\'Intervention & Disciplines (Areas CMS)',
    subtitle: 'Contrôle complet des cartes et fenêtres modales interactives sur la page d\'accueil.',
    previewFront: 'Aperçu du site',
    toggleHeader: 'Textes de section',
    hideHeader: 'Masquer textes',
    addNew: 'Ajouter un domaine',
    saveAll: 'Enregistrer tout',
    saving: 'Enregistrement...',
    totalDisciplines: 'Total Domaines',
    activeHomepage: 'Actifs en Accueil',
    popupContent: 'Contenu Modales',
    popupActive: '✓ Modales interactives',
    changesState: 'État des modifications',
    hasUnsaved: '⚠️ Modifications non enregistrées',
    allSaved: '✓ Tout est synchronisé',
    saveSuccess: 'Domaines d\'intervention et modales enregistrés avec succès !',
    saveError: 'Erreur lors de l\'enregistrement des domaines',
    sectionEyebrow: 'Surtitre de section (Eyebrow)',
    sectionTitle: 'Titre principal de section',
    sectionSubtitle: 'Description de la section',
    globalWorkshops: 'Afficher les ateliers dans tous les domaines (Global)',
    globalWorkshopsDesc: 'Activer ou masquer la liste des ateliers pour tous les domaines en un clic',
    enabled: '✓ Actif & Visible',
    disabled: '✕ Désactivé & Masqué',
    workshopsShown: '✨ Ateliers : visibles en modale',
    workshopsHidden: '✨ Ateliers : masqués en modale',
    stratObjectives: 'objectifs stratégiques',
    workshopsAndProgs: 'ateliers & programmes',
    hiddenLabel: '(masqué)',
    btnLink: 'Lien bouton :',
    editDomain: 'Modifier le domaine & modale',
    delete: 'Supprimer',
    deleteConfirm: 'Voulez-vous vraiment supprimer ce domaine ?',
    modalEditTitle: 'Modifier le domaine et la fenêtre modale',
    modalAddTitle: 'Ajouter un nouveau domaine d\'intervention',
    tabCard: 'Carte d\'accueil (Card)',
    tabModal: 'Contenu fenêtre modale (Modal Dialog)',
    cancel: 'Annuler',
    applyChanges: 'Appliquer les modifications',
  },
  en: {
    title: 'Core Focus Areas & Disciplines (Areas CMS)',
    subtitle: 'Manage the 6 strategic discipline cards, objectives, and interactive modal dialogs on homepage.',
    previewFront: 'Preview Homepage',
    toggleHeader: 'Section Texts',
    hideHeader: 'Hide Texts',
    addNew: 'Add New Domain',
    saveAll: 'Save All Changes',
    saving: 'Saving...',
    totalDisciplines: 'Total Disciplines',
    activeHomepage: 'Active on Homepage',
    popupContent: 'Modal Content',
    popupActive: '✓ Interactive Dialogs',
    changesState: 'Changes Status',
    hasUnsaved: '⚠️ Unsaved Changes',
    allSaved: '✓ Everything Synced',
    saveSuccess: 'Focus disciplines and interactive modals saved successfully!',
    saveError: 'Failed to save focus areas',
    sectionEyebrow: 'Section Eyebrow Badge',
    sectionTitle: 'Main Section Title',
    sectionSubtitle: 'Section Description',
    globalWorkshops: 'Show workshops across all disciplines (Global)',
    globalWorkshopsDesc: 'Toggle visibility of the workshops and initiatives list across all disciplines at once',
    enabled: '✓ Active & Visible',
    disabled: '✕ Disabled & Hidden',
    workshopsShown: '✨ Workshops: visible in modal',
    workshopsHidden: '✨ Workshops: hidden from modal',
    stratObjectives: 'strategic objectives',
    workshopsAndProgs: 'workshops & programs',
    hiddenLabel: '(hidden)',
    btnLink: 'Button link:',
    editDomain: 'Edit Domain & Modal',
    delete: 'Delete',
    deleteConfirm: 'Are you sure you want to delete this discipline?',
    modalEditTitle: 'Edit Focus Area & Modal Dialog',
    modalAddTitle: 'Add New Focus Discipline',
    tabCard: 'Homepage Card View',
    tabModal: 'Interactive Modal Dialog Content',
    cancel: 'Cancel',
    applyChanges: 'Apply Changes',
  },
}

interface AreasManagerProps {
  initialConfig: AreasConfig
  defaultItems?: AreaItemConfig[]
}

export function AreasManager({ initialConfig }: AreasManagerProps) {
  const { locale, dir } = useAdminLocale()
  const tr = AREAS_STRINGS[locale] || AREAS_STRINGS.ar
  const [config, setConfig] = useState<AreasConfig>(initialConfig)
  const [saving, setSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showSectionSettings, setShowSectionSettings] = useState(false)

  // Modal State for editing a single Area
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingArea, setEditingArea] = useState<AreaItemConfig | null>(null)
  const [modalTab, setModalTab] = useState<'card' | 'modal'>('card')

  // Modal Form State
  const [modalForm, setModalForm] = useState<Partial<AreaItemConfig>>({
    key: '',
    icon: '🎨',
    iconImg: '/icons/arts.png',
    titleAr: '',
    titleFr: '',
    titleEn: '',
    tagAr: '',
    tagFr: '',
    tagEn: '',
    descAr: '',
    descFr: '',
    descEn: '',
    headlineAr: '',
    headlineFr: '',
    headlineEn: '',
    objectivesAr: [],
    initiativesAr: [],
    actionLabelAr: 'اعرف أكثر',
    actionUrl: '/programs',
    enabled: true,
    showInitiatives: true,
  })

  // Inputs for adding new objective / initiative in modal
  const [newObjectiveInput, setNewObjectiveInput] = useState('')
  const [newInitiativeInput, setNewInitiativeInput] = useState('')

  // Open modal for editing
  function handleEdit(area: AreaItemConfig) {
    setEditingArea(area)
    setModalForm({
      ...area,
      showInitiatives: area.showInitiatives !== false,
      objectivesAr: [...(area.objectivesAr || [])],
      initiativesAr: [...(area.initiativesAr || [])],
    })
    setModalTab('card')
    setIsModalOpen(true)
  }

  // Open modal for adding new area
  function handleAddNew() {
    setEditingArea(null)
    const newKey = `area-${Date.now()}`
    setModalForm({
      key: newKey,
      icon: '🎨',
      iconImg: '/icons/arts.png',
      titleAr: '',
      titleFr: '',
      titleEn: '',
      tagAr: 'مجال ثقافي',
      tagFr: 'Domaine',
      tagEn: 'Domain',
      descAr: '',
      descFr: '',
      descEn: '',
      headlineAr: '',
      headlineFr: '',
      headlineEn: '',
      objectivesAr: [],
      initiativesAr: [],
      actionLabelAr: 'اعرف أكثر',
      actionUrl: '/programs',
      accent: 'border-[#231f20]/30 text-[#231f20]',
      bgGlow: 'from-[#FEF6CC]/40 to-transparent',
      order: config.items.length + 1,
      enabled: true,
      showInitiatives: true,
    })
    setModalTab('card')
    setIsModalOpen(true)
  }

  // Save Modal Form
  function handleModalSave(e: React.FormEvent) {
    e.preventDefault()
    if (!modalForm.titleAr?.trim() || !modalForm.descAr?.trim()) {
      alert('يرجى ملء عنوان المجال ووصفه بالعربية على الأقل.')
      return
    }

    const updatedArea: AreaItemConfig = {
      key: modalForm.key || `area-${Date.now()}`,
      icon: modalForm.icon || '🎨',
      iconImg: modalForm.iconImg || '/icons/arts.png',
      titleAr: modalForm.titleAr || '',
      titleFr: modalForm.titleFr || '',
      titleEn: modalForm.titleEn || '',
      tagAr: modalForm.tagAr || '',
      tagFr: modalForm.tagFr || '',
      tagEn: modalForm.tagEn || '',
      descAr: modalForm.descAr || '',
      descFr: modalForm.descFr || '',
      descEn: modalForm.descEn || '',
      headlineAr: modalForm.headlineAr || modalForm.titleAr || '',
      headlineFr: modalForm.headlineFr || '',
      headlineEn: modalForm.headlineEn || '',
      objectivesAr: modalForm.objectivesAr || [],
      objectivesFr: modalForm.objectivesFr || [],
      objectivesEn: modalForm.objectivesEn || [],
      initiativesAr: modalForm.initiativesAr || [],
      initiativesFr: modalForm.initiativesFr || [],
      initiativesEn: modalForm.initiativesEn || [],
      actionLabelAr: modalForm.actionLabelAr || 'اعرف أكثر',
      actionLabelFr: modalForm.actionLabelFr || 'En savoir plus',
      actionLabelEn: modalForm.actionLabelEn || 'Learn More',
      actionUrl: modalForm.actionUrl || '/programs',
      accent: modalForm.accent || 'border-[#231f20]/30 text-[#231f20]',
      bgGlow: modalForm.bgGlow || 'from-[#FEF6CC]/40 to-transparent',
      order: modalForm.order || config.items.length + 1,
      enabled: modalForm.enabled ?? true,
      showInitiatives: modalForm.showInitiatives !== false,
    }

    if (editingArea) {
      setConfig((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.key === editingArea.key ? updatedArea : item
        ),
      }))
    } else {
      setConfig((prev) => ({
        ...prev,
        items: [...prev.items, updatedArea],
      }))
    }

    setIsModalOpen(false)
    setHasUnsavedChanges(true)
  }

  // Delete Area
  function handleDelete(key: string) {
    if (!window.confirm(tr.deleteConfirm)) {
      return
    }
    setConfig((prev) => ({
      ...prev,
      items: prev.items
        .filter((item) => item.key !== key)
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

    setConfig((prev) => ({
      ...prev,
      items: newItems.map((item, idx) => ({ ...item, order: idx + 1 })),
    }))
    setHasUnsavedChanges(true)
  }

  // Toggle enabled
  function toggleEnabled(key: string) {
    setConfig((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.key === key ? { ...item, enabled: !item.enabled } : item
      ),
    }))
    setHasUnsavedChanges(true)
  }

  // Toggle show/hide initiatives (workshops) in modal for a specific area
  function toggleShowInitiatives(key: string) {
    setConfig((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.key === key ? { ...item, showInitiatives: item.showInitiatives === false ? true : false } : item
      ),
    }))
    setHasUnsavedChanges(true)
  }

  // Add objective to modal
  function handleAddObjective() {
    if (!newObjectiveInput.trim()) return
    setModalForm((prev) => ({
      ...prev,
      objectivesAr: [...(prev.objectivesAr || []), newObjectiveInput.trim()],
    }))
    setNewObjectiveInput('')
  }

  // Remove objective from modal
  function handleRemoveObjective(index: number) {
    setModalForm((prev) => ({
      ...prev,
      objectivesAr: (prev.objectivesAr || []).filter((_, i) => i !== index),
    }))
  }

  // Add initiative to modal
  function handleAddInitiative() {
    if (!newInitiativeInput.trim()) return
    setModalForm((prev) => ({
      ...prev,
      initiativesAr: [...(prev.initiativesAr || []), newInitiativeInput.trim()],
    }))
    setNewInitiativeInput('')
  }

  // Remove initiative from modal
  function handleRemoveInitiative(index: number) {
    setModalForm((prev) => ({
      ...prev,
      initiativesAr: (prev.initiativesAr || []).filter((_, i) => i !== index),
    }))
  }

  // Save All Changes to Supabase
  async function handleSaveAll() {
    setSaving(true)
    setSuccessMessage(null)
    setErrorMessage(null)

    try {
      const result = await saveAreasConfiguration(config)
      if (!result.success) {
        throw new Error(result.error || tr.saveError)
      }
      setSuccessMessage(tr.saveSuccess)
      setHasUnsavedChanges(false)
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : tr.saveError
      setErrorMessage(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6" dir={dir}>
      {/* Top Banner and Actions */}
      <div className="bg-white rounded-3xl border border-[#e5e0d6] p-6 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🎯</span>
              <h2 className="text-lg font-black text-[#231f20]">
                {tr.title}
              </h2>
            </div>
            <p className="text-xs text-[#5C5A55] mt-1">
              {tr.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href={`/${locale}#areas`}
              target="_blank"
              className="px-3.5 py-2.5 rounded-xl text-3xs font-bold text-[#231f20] bg-[#FAF8F5] border border-[#e5e0d6] hover:bg-[#F4EFE6] active:scale-98 transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <span>{tr.previewFront}</span>
              <span>↗</span>
            </Link>

            <button
              type="button"
              onClick={() => setShowSectionSettings(!showSectionSettings)}
              className="px-3.5 py-2.5 rounded-xl text-3xs font-bold text-[#231f20] bg-[#FAF8F5] border border-[#e5e0d6] hover:bg-[#F4EFE6] active:scale-98 transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <span>⚙️</span>
              <span>{showSectionSettings ? tr.hideHeader : tr.toggleHeader}</span>
            </button>

            <button
              type="button"
              onClick={handleAddNew}
              className="px-4 py-2.5 rounded-xl font-bold text-white bg-[#231f20] hover:bg-[#d2a82b] active:scale-98 transition-all text-xs inline-flex items-center gap-2 shadow-2xs cursor-pointer"
            >
              <svg className="w-4 h-4 text-[#ffd22f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span>{tr.addNew}</span>
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
                  <span>{tr.saving}</span>
                </>
              ) : (
                <>
                  <span>💾</span>
                  <span>{tr.saveAll} {hasUnsavedChanges ? '*' : ''}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#E5E0D6]">
          <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6]">
            <span className="text-3xs font-bold text-[#5C5A55] block">{tr.totalDisciplines}</span>
            <span className="text-xl font-black text-[#231f20]">{config.items.length}</span>
          </div>
          <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6]">
            <span className="text-3xs font-bold text-[#5C5A55] block">{tr.activeHomepage}</span>
            <span className="text-xl font-black text-emerald-700">
              {config.items.filter((i) => i.enabled).length}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6]">
            <span className="text-3xs font-bold text-[#5C5A55] block">{tr.popupContent}</span>
            <span className="text-xs font-bold text-[#231f20] block mt-1">{tr.popupActive}</span>
          </div>
          <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6]">
            <span className="text-3xs font-bold text-[#5C5A55] block">{tr.changesState}</span>
            <span className={`text-xs font-bold block mt-1 ${hasUnsavedChanges ? 'text-[#bd3227]' : 'text-emerald-700'}`}>
              {hasUnsavedChanges ? tr.hasUnsaved : tr.allSaved}
            </span>
          </div>
        </div>

        {/* Notifications */}
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

      {/* Section Header Settings Collapsible Box */}
      {showSectionSettings && (
        <div className="bg-white rounded-3xl border border-[#e5e0d6] p-6 shadow-xs space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-[#E5E0D6]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#231f20]">
              نصوص الترويسة لقسم مجالات النشاط بالصفحة الرئيسية
            </h3>
            <span className="text-3xs text-[#5C5A55]">تظهر في أعلى القسم لجميع الزوار</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-3xs font-bold text-[#5C5A55] mb-1">
                الشارة العلوية بالعربية (Eyebrow AR)
              </label>
              <input
                type="text"
                value={config.eyebrowAr || ''}
                onChange={(e) => {
                  setConfig({ ...config, eyebrowAr: e.target.value })
                  setHasUnsavedChanges(true)
                }}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#e5e0d6] focus:border-[#231f20] outline-none"
              />
            </div>
            <div>
              <label className="block text-3xs font-bold text-[#5C5A55] mb-1">
                العنوان الرئيسي بالعربية (Title AR)
              </label>
              <input
                type="text"
                value={config.sectionTitleAr || ''}
                onChange={(e) => {
                  setConfig({ ...config, sectionTitleAr: e.target.value })
                  setHasUnsavedChanges(true)
                }}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#e5e0d6] focus:border-[#231f20] outline-none"
              />
            </div>
            <div>
              <label className="block text-3xs font-bold text-[#5C5A55] mb-1">
                الوصف التوضيحي بالعربية (Subtitle AR)
              </label>
              <input
                type="text"
                value={config.sectionSubtitleAr || ''}
                onChange={(e) => {
                  setConfig({ ...config, sectionSubtitleAr: e.target.value })
                  setHasUnsavedChanges(true)
                }}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#e5e0d6] focus:border-[#231f20] outline-none"
              />
            </div>
          </div>

          {/* Global Workshops Visibility Switch */}
          <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-[#231f20] flex items-center gap-1.5">
                <span>✨</span>
                <span>إظهار قسم البرامج والورشات في كافة المجالات (تحكم عام)</span>
              </span>
              <span className="text-3xs text-[#5C5A55] block">
                تفعيل أو تعطيل ظهور قسم &quot;أبرز البرامج والورشات الميدانية&quot; بالنوافذ المنبثقة لجميع مجالات التدخل دفعة واحدة
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setConfig((prev) => ({
                  ...prev,
                  showInitiativesGlobally: prev.showInitiativesGlobally === false ? true : false,
                }))
                setHasUnsavedChanges(true)
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer shrink-0 ${
                config.showInitiativesGlobally !== false
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-red-50 text-red-700 border-red-300 hover:bg-red-100'
              }`}
            >
              {config.showInitiativesGlobally !== false ? '✓ معروض عاماً بكافة النوافذ' : '✕ مخفي عاماً من كافة النوافذ'}
            </button>
          </div>
        </div>
      )}

      {/* Cards List */}
      <div className="space-y-4">
        {config.items.map((area, index) => (
          <div
            key={area.key}
            className={`bg-white rounded-3xl border p-6 transition-all shadow-subtle ${
              area.enabled ? 'border-[#e5e0d6]' : 'border-gray-200 opacity-60 bg-gray-50/50'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
              {/* Order & Reordering */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex flex-col items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveItem(index, 'up')}
                    disabled={index === 0}
                    className="w-6 h-6 rounded-md bg-[#FAF8F5] hover:bg-[#e5e0d6] disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center text-3xs font-bold text-[#231f20] cursor-pointer"
                    title="تحريك لأعلى"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(index, 'down')}
                    disabled={index === config.items.length - 1}
                    className="w-6 h-6 rounded-md bg-[#FAF8F5] hover:bg-[#e5e0d6] disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center text-3xs font-bold text-[#231f20] cursor-pointer"
                    title="تحريك لأسفل"
                  >
                    ▼
                  </button>
                </div>

                <span className="w-9 h-9 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] flex items-center justify-center text-xs font-black text-[#231f20]">
                  #{area.order}
                </span>

                <div className="w-12 h-12 rounded-2xl bg-white border border-[#e5e0d6] flex items-center justify-center p-2 text-2xl shadow-2xs">
                  <span>{area.icon}</span>
                </div>
              </div>

              {/* Area Content Preview */}
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-4xs font-black border bg-white ${area.accent || 'text-[#231f20]'}`}>
                    {locale === 'fr' ? (area.tagFr || area.tagAr) : locale === 'en' ? (area.tagEn || area.tagAr) : area.tagAr}
                  </span>

                  <button
                    type="button"
                    onClick={() => toggleEnabled(area.key)}
                    className={`px-2.5 py-0.5 rounded-full text-4xs font-bold border transition-colors cursor-pointer ${
                      area.enabled
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                    }`}
                  >
                    {area.enabled ? tr.enabled : tr.disabled}
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleShowInitiatives(area.key)}
                    className={`px-2.5 py-0.5 rounded-full text-4xs font-bold border transition-colors cursor-pointer ${
                      area.showInitiatives !== false
                        ? 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                        : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
                    }`}
                    title="Toggle workshops visibility in modal"
                  >
                    {area.showInitiatives !== false ? tr.workshopsShown : tr.workshopsHidden}
                  </button>

                  <span className="text-4xs text-[#5C5A55] font-mono">
                    key: {area.key}
                  </span>
                </div>

                <h3 className="text-base font-black text-[#231f20]">
                  {locale === 'fr' ? (area.titleFr || area.titleAr) : locale === 'en' ? (area.titleEn || area.titleAr) : area.titleAr}
                </h3>

                <p className="text-xs text-[#5C5A55] leading-relaxed">
                  {locale === 'fr' ? (area.descFr || area.descAr) : locale === 'en' ? (area.descEn || area.descAr) : area.descAr}
                </p>

                {/* Modal details summary badges */}
                <div className="pt-2 flex flex-wrap items-center gap-3 text-3xs text-[#5C5A55]">
                  <span className="px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#e5e0d6] text-[#231f20] font-bold">
                    🎯 {area.objectivesAr?.length || 0} {tr.stratObjectives}
                  </span>
                  <span className={`px-2 py-0.5 rounded-md border font-bold ${
                    area.showInitiatives !== false
                      ? 'bg-amber-50/70 border-amber-200 text-[#bd3227]'
                      : 'bg-gray-100 border-gray-200 text-gray-400 line-through'
                  }`}>
                    ✨ {area.initiativesAr?.length || 0} {tr.workshopsAndProgs} {area.showInitiatives === false ? tr.hiddenLabel : ''}
                  </span>
                  <span>•</span>
                  <span>{tr.btnLink} <code className="font-mono text-[#231f20]">{area.actionUrl}</code></span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end lg:self-start shrink-0">
                <button
                  type="button"
                  onClick={() => handleEdit(area)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#FAF8F5] border border-[#e5e0d6] hover:bg-[#231f20] hover:text-white transition-all text-[#231f20] cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
                >
                  <span>✏️</span>
                  <span>{tr.editDomain}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(area.key)}
                  className="px-3 py-2 rounded-xl text-xs font-bold bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition-all cursor-pointer inline-flex items-center gap-1"
                >
                  <span>🗑️</span>
                  <span>{tr.delete}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ============================================================
          EDIT / ADD MODAL FOR AN AREA
          ============================================================ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#e5e0d6] w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E0D6]">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{modalForm.icon || '🎯'}</span>
                <div>
                  <h3 className="text-base font-black text-[#231f20]">
                    {editingArea ? `${tr.modalEditTitle}: ${modalForm.titleAr || editingArea.titleAr}` : tr.modalAddTitle}
                  </h3>
                  <span className="text-3xs text-[#5C5A55]">
                    {locale === 'ar' ? 'تخصيص بيانات البطاقة ومحتوى النافذة المنبثقة التفصيلية' : locale === 'fr' ? 'Configuration de la carte et du contenu de la fenêtre modale' : 'Configure card display and interactive modal dialog content'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#FAF8F5] text-[#5C5A55] hover:text-[#231f20] flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Navigation Tabs inside modal */}
            <div className="flex items-center gap-2 border-b border-[#E5E0D6] pb-2">
              <button
                type="button"
                onClick={() => setModalTab('card')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  modalTab === 'card'
                    ? 'bg-[#231f20] text-white shadow-2xs'
                    : 'bg-[#FAF8F5] text-[#5C5A55] hover:bg-[#F4EFE6]'
                }`}
              >
                {tr.tabCard}
              </button>
              <button
                type="button"
                onClick={() => setModalTab('modal')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  modalTab === 'modal'
                    ? 'bg-[#231f20] text-white shadow-2xs'
                    : 'bg-[#FAF8F5] text-[#5C5A55] hover:bg-[#F4EFE6]'
                }`}
              >
                {tr.tabModal}
              </button>
            </div>

            <form onSubmit={handleModalSave} className="space-y-5">
              {/* TAB 1: CARD BASICS */}
              {modalTab === 'card' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6]">
                    <div>
                      <label className="block text-3xs font-bold text-[#5C5A55] mb-1">
                        أيقونة Emoji
                      </label>
                      <input
                        type="text"
                        value={modalForm.icon || ''}
                        onChange={(e) => setModalForm({ ...modalForm, icon: e.target.value })}
                        placeholder="🎨"
                        className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#e5e0d6] bg-white text-center text-lg outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-3xs font-bold text-[#5C5A55] mb-1">
                        مسار أيقونة PNG
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        value={modalForm.iconImg || ''}
                        onChange={(e) => setModalForm({ ...modalForm, iconImg: e.target.value })}
                        placeholder="/icons/arts.png"
                        className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#e5e0d6] bg-white font-mono text-left outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-5">
                      <input
                        id="areaModalEnabled"
                        type="checkbox"
                        checked={modalForm.enabled ?? true}
                        onChange={(e) => setModalForm({ ...modalForm, enabled: e.target.checked })}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-600"
                      />
                      <label htmlFor="areaModalEnabled" className="text-3xs font-bold text-[#5C5A55] cursor-pointer">
                        تفعيل وعرض في الصفحة الرئيسية
                      </label>
                    </div>
                  </div>

                  {/* Arabic (Required) */}
                  <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/60 space-y-3">
                    <span className="text-xs font-bold text-amber-900 block">
                      🇲🇦 النصوص باللغة العربية (إلزامية)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-3xs font-bold text-[#5C5A55] mb-1">
                          عنوان المجال *
                        </label>
                        <input
                          type="text"
                          required
                          value={modalForm.titleAr || ''}
                          onChange={(e) => setModalForm({ ...modalForm, titleAr: e.target.value })}
                          placeholder="مثال: الفنون والإبداع"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-[#e5e0d6] bg-white outline-none focus:border-[#231f20]"
                        />
                      </div>
                      <div>
                        <label className="block text-3xs font-bold text-[#5C5A55] mb-1">
                          شارة التصنيف (Tag) *
                        </label>
                        <input
                          type="text"
                          required
                          value={modalForm.tagAr || ''}
                          onChange={(e) => setModalForm({ ...modalForm, tagAr: e.target.value })}
                          placeholder="مثال: محترفات تشكيلية ومعارض"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-[#e5e0d6] bg-white outline-none focus:border-[#231f20]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-3xs font-bold text-[#5C5A55] mb-1">
                        الوصف المختصر بالبطاقة *
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={modalForm.descAr || ''}
                        onChange={(e) => setModalForm({ ...modalForm, descAr: e.target.value })}
                        placeholder="اكتب نبذة موجزة تظهر في البطاقة الرئيسية..."
                        className="w-full px-3 py-2 text-xs rounded-xl border border-[#e5e0d6] bg-white outline-none focus:border-[#231f20] leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* French Translation */}
                  <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] space-y-3">
                    <span className="text-xs font-bold text-[#231f20] block">
                      🇫🇷 الترجمة بالفرنسية (Français)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-3xs font-bold text-[#5C5A55] mb-1">
                          Titre en Français
                        </label>
                        <input
                          type="text"
                          dir="ltr"
                          value={modalForm.titleFr || ''}
                          onChange={(e) => setModalForm({ ...modalForm, titleFr: e.target.value })}
                          placeholder="ex: Arts & Création"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-[#e5e0d6] bg-white outline-none text-left font-sans"
                        />
                      </div>
                      <div>
                        <label className="block text-3xs font-bold text-[#5C5A55] mb-1">
                          Tag / Catégorie
                        </label>
                        <input
                          type="text"
                          dir="ltr"
                          value={modalForm.tagFr || ''}
                          onChange={(e) => setModalForm({ ...modalForm, tagFr: e.target.value })}
                          placeholder="ex: Arts Plastiques"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-[#e5e0d6] bg-white outline-none text-left font-sans"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-3xs font-bold text-[#5C5A55] mb-1">
                        Description courte
                      </label>
                      <textarea
                        dir="ltr"
                        rows={2}
                        value={modalForm.descFr || ''}
                        onChange={(e) => setModalForm({ ...modalForm, descFr: e.target.value })}
                        placeholder="Description..."
                        className="w-full px-3 py-2 text-xs rounded-xl border border-[#e5e0d6] bg-white outline-none text-left font-sans leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* English Translation */}
                  <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] space-y-3">
                    <span className="text-xs font-bold text-[#231f20] block">
                      🇬🇧 الترجمة بالإنجليزية (English)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-3xs font-bold text-[#5C5A55] mb-1">
                          Title in English
                        </label>
                        <input
                          type="text"
                          dir="ltr"
                          value={modalForm.titleEn || ''}
                          onChange={(e) => setModalForm({ ...modalForm, titleEn: e.target.value })}
                          placeholder="e.g. Visual & Fine Arts"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-[#e5e0d6] bg-white outline-none text-left font-sans"
                        />
                      </div>
                      <div>
                        <label className="block text-3xs font-bold text-[#5C5A55] mb-1">
                          Tag / Category
                        </label>
                        <input
                          type="text"
                          dir="ltr"
                          value={modalForm.tagEn || ''}
                          onChange={(e) => setModalForm({ ...modalForm, tagEn: e.target.value })}
                          placeholder="e.g. Fine Arts"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-[#e5e0d6] bg-white outline-none text-left font-sans"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-3xs font-bold text-[#5C5A55] mb-1">
                        Short Description
                      </label>
                      <textarea
                        dir="ltr"
                        rows={2}
                        value={modalForm.descEn || ''}
                        onChange={(e) => setModalForm({ ...modalForm, descEn: e.target.value })}
                        placeholder="Short summary..."
                        className="w-full px-3 py-2 text-xs rounded-xl border border-[#e5e0d6] bg-white outline-none text-left font-sans leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Action Link */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6]">
                    <div>
                      <label className="block text-3xs font-bold text-[#5C5A55] mb-1">
                        نص الزر التوجيهي (Action Button Label)
                      </label>
                      <input
                        type="text"
                        value={modalForm.actionLabelAr || ''}
                        onChange={(e) => setModalForm({ ...modalForm, actionLabelAr: e.target.value })}
                        placeholder="اعرف أكثر"
                        className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#e5e0d6] bg-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-3xs font-bold text-[#5C5A55] mb-1">
                        رابط التوجيه (Action URL)
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        value={modalForm.actionUrl || ''}
                        onChange={(e) => setModalForm({ ...modalForm, actionUrl: e.target.value })}
                        placeholder="/programs"
                        className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#e5e0d6] bg-white font-mono text-left outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: MODAL POPUP CONTENT */}
              {modalTab === 'modal' && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  {/* Headline / Vision */}
                  <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] space-y-3">
                    <label className="block text-xs font-bold text-[#231f20]">
                      الرؤية والهدف العريض (Modal Headline)
                    </label>
                    <input
                      type="text"
                      value={modalForm.headlineAr || ''}
                      onChange={(e) => setModalForm({ ...modalForm, headlineAr: e.target.value })}
                      placeholder="مثال: رعاية المواهب التشكيلية والبصرية وصقل الحس الجمالي لدى الشباب"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e5e0d6] bg-white outline-none focus:border-[#231f20]"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <input
                        type="text"
                        dir="ltr"
                        value={modalForm.headlineFr || ''}
                        onChange={(e) => setModalForm({ ...modalForm, headlineFr: e.target.value })}
                        placeholder="Headline FR..."
                        className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#e5e0d6] bg-white outline-none text-left font-sans"
                      />
                      <input
                        type="text"
                        dir="ltr"
                        value={modalForm.headlineEn || ''}
                        onChange={(e) => setModalForm({ ...modalForm, headlineEn: e.target.value })}
                        placeholder="Headline EN..."
                        className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#e5e0d6] bg-white outline-none text-left font-sans"
                      />
                    </div>
                  </div>

                  {/* Strategic Objectives (List of Points) */}
                  <div className="p-4 rounded-2xl bg-white border border-[#e5e0d6] shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">🎯</span>
                        <h4 className="text-xs font-bold text-[#231f20]">
                          الأهداف والمحاور الاستراتيجية (Strategic Objectives)
                        </h4>
                      </div>
                      <span className="text-3xs text-[#5C5A55]">
                        ({modalForm.objectivesAr?.length || 0} أهداف محددة)
                      </span>
                    </div>

                    {/* List of current objectives */}
                    <div className="space-y-2">
                      {(modalForm.objectivesAr || []).map((obj, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6] text-xs text-[#5C5A55]"
                        >
                          <span className="flex-1 leading-relaxed">
                            <span className="text-[#231f20] font-bold me-1.5">✓</span>
                            {obj}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveObjective(i)}
                            className="text-red-500 hover:text-red-700 font-bold px-2 py-0.5 rounded-md hover:bg-red-50 text-xs shrink-0 cursor-pointer"
                            title="حذف هذا الهدف"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add Objective Input */}
                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        value={newObjectiveInput}
                        onChange={(e) => setNewObjectiveInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleAddObjective()
                          }
                        }}
                        placeholder="اكتب هدفاً استراتيجياً جديداً واضغط إضافة..."
                        className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20]"
                      />
                      <button
                        type="button"
                        onClick={handleAddObjective}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#231f20] hover:bg-[#d2a82b] shrink-0 cursor-pointer"
                      >
                        + إضافة هدف
                      </button>
                    </div>
                  </div>

                  {/* Featured Initiatives / Workshops */}
                  <div className="p-4 rounded-2xl bg-white border border-[#e5e0d6] shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">✨</span>
                        <h4 className="text-xs font-bold text-[#231f20]">
                          البرامج والورشات الميدانية (Initiatives & Workshops)
                        </h4>
                      </div>
                      <span className="text-3xs text-[#5C5A55]">
                        ({modalForm.initiativesAr?.length || 0} ورشات محددة)
                      </span>
                    </div>

                    {/* Toggle show/hide for this area */}
                    <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-[#231f20] block">
                          إظهار قسم &quot;أبرز البرامج والورشات الميدانية&quot; بالنافذة
                        </span>
                        <span className="text-3xs text-[#5C5A55] block">
                          يمكنك إخفاء هذا القسم بالكامل في حال لم تتوفر ورشات حالية لهذا المجال
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setModalForm((prev) => ({
                            ...prev,
                            showInitiatives: prev.showInitiatives === false ? true : false,
                          }))
                        }
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer shrink-0 ${
                          modalForm.showInitiatives !== false
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                            : 'bg-red-50 text-red-700 border-red-300 hover:bg-red-100'
                        }`}
                      >
                        {modalForm.showInitiatives !== false ? '✓ القسم معروض بالنافذة' : '✕ القسم مخفي من النافذة'}
                      </button>
                    </div>

                    {/* List of current initiatives */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(modalForm.initiativesAr || []).map((init, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6] text-xs text-[#231f20] font-bold"
                        >
                          <span className="truncate">
                            <span className="text-[#bd3227] me-1.5 font-mono">0{i + 1}.</span>
                            {init}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveInitiative(i)}
                            className="text-red-500 hover:text-red-700 font-bold px-2 py-0.5 rounded-md hover:bg-red-50 text-xs shrink-0 cursor-pointer"
                            title="حذف هذه الورشة"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add Initiative Input */}
                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        value={newInitiativeInput}
                        onChange={(e) => setNewInitiativeInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleAddInitiative()
                          }
                        }}
                        placeholder="اكتب اسم ورشة أو برنامج جديد واضغط إضافة..."
                        className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20]"
                      />
                      <button
                        type="button"
                        onClick={handleAddInitiative}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#bd3227] hover:bg-[#a3261c] shrink-0 cursor-pointer"
                      >
                        + إضافة ورشة
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Bottom Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#E5E0D6]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#5C5A55] bg-[#FAF8F5] hover:bg-[#F4EFE6] cursor-pointer"
                >
                  {tr.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#231f20] hover:bg-[#d2a82b] shadow-xs cursor-pointer"
                >
                  {tr.applyChanges}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

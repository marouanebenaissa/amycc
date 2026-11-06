'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { ProgramsPageConfig, ProgramStatItem } from '@/lib/settings'
import { saveProgramsPageConfiguration } from '@/lib/actions/admin'
import { useAdminLocale } from './AdminLocaleContext'

interface ProgramsPageManagerProps {
  initialConfig: ProgramsPageConfig
  defaultConfig?: ProgramsPageConfig
}

const PROGRAM_HERO_STRINGS = {
  ar: {
    tabHero: 'واجهة ورأس صفحة البرامج (Hero Banner)',
    tabStats: 'أرقام ومؤشرات الأثر (Impact Stats)',
    tabCta: 'قسم الدعوة للمبادرة (CTA Banner)',
    heroSectionTitle: 'رأس وواجهة صفحة البرامج (Hero Section)',
    heroSectionSub: 'تخصيص العناوين والوسوم التقديمية والصورة البارزة المعروضة في أعلى صفحة البرامج.',
    previewPublished: 'معاينة صفحة البرامج ↗',
    coverImageLabel: 'صورة خلفية أو بصرية لقسم رأس الصفحة (Hero Visual Image)',
    noImageHint: 'لا توجد صورة (نمط مغربي افتراضي)',
    uploadImageBtn: '📁 رفع صورة للواجهة',
    uploadingImageBtn: '⏳ جارٍ الرفع...',
    removeImageBtn: 'حذف الصورة',
    enableCoverImage: 'تفعيل صورة الغلاف على واجهة البرامج المنشورة',
    enableCoverImageHint: 'إذا تم التعطيل، ستظهر واجهة البرامج بنمط الزخرفة المغربية الأنيق.',
    livePreviewTitle: 'معاينة حية لشكل رأس الصفحة (Live Preview):',
    eyebrowTagLabel: 'الوسم العلوي (Eyebrow Tag)',
    badgeLabel: 'شارة الاعتماد (Statutory Badge)',
    headlineLabel: 'العنوان الرئيسي (Headline Title)',
    descLabel: 'الفقرة التقديمية (Description)',
    statsSectionTitle: 'أرقام ومؤشرات أثر البرامج (Impact Stats Ribbon)',
    statsSectionSub: 'تظهر هذه الأرقام في شريط بارز أسفل رأس الصفحة لإبراز حجم المشاركة والانتشار الوطني للبرامج.',
    statIndex: (i: number) => `مؤشر #${i}`,
    numericValueLabel: 'القيمة الرقمية (مثال: +1,500 أو 100%)',
    descInLang: (lang: string) => `الوصف بـ ${lang}`,
    ctaSectionTitle: 'شريط الدعوة لاقتراح المشاريع والانخراط (CTA Banner)',
    ctaSectionSub: 'يظهر في نهاية صفحة البرامج لدعوة الزوار، الفنانين، والشباب للتواصل أو تقديم مقترحات برامج جديدة.',
    ctaTitleLabel: 'عنوان النداء',
    ctaDescLabel: 'نص التوضيح',
    primaryCtaBlock: 'الزر الأساسي (Primary CTA)',
    secondaryCtaBlock: 'الزر الثانوي (Secondary CTA)',
    btnTextLabel: 'نص الزر',
    btnUrlLabel: 'رابط الوجهة (URL)',
    saveBtn: 'حفظ إعدادات صفحة البرامج',
    savingBtn: 'جارٍ الحفظ...',
    saveSuccess: 'تم حفظ كافة إعدادات صفحة البرامج بنجاح وتحديث الموقع مباشرة!',
    saveError: 'تعذر حفظ الإعدادات',
  },
  fr: {
    tabHero: 'Bannière d\'en-tête (Hero Banner)',
    tabStats: 'Indicateurs d\'Impact (Impact Stats)',
    tabCta: 'Appel à Projets & Action (CTA Banner)',
    heroSectionTitle: 'En-tête et Vitrine des Programmes (Hero Section)',
    heroSectionSub: 'Personnalisation des titres, badges d\'autorité et image principale de la page Programmes.',
    previewPublished: 'Voir la page Programmes ↗',
    coverImageLabel: 'Image de couverture de l\'en-tête (Hero Visual Image)',
    noImageHint: 'Aucune image (fond sobre marocain par défaut)',
    uploadImageBtn: '📁 Téléverser une image',
    uploadingImageBtn: '⏳ Téléversement...',
    removeImageBtn: 'Supprimer l\'image',
    enableCoverImage: 'Activer l\'image de couverture sur le site public',
    enableCoverImageHint: 'Si désactivée, un motif marocain élégant sera affiché en arrière-plan.',
    livePreviewTitle: 'Aperçu en direct de l\'en-tête (Live Preview) :',
    eyebrowTagLabel: 'Tag Supérieur (Eyebrow Tag)',
    badgeLabel: 'Badge Institutionnel (Statutory Badge)',
    headlineLabel: 'Grand Titre (Headline Title)',
    descLabel: 'Description Introductive (Description)',
    statsSectionTitle: 'Indicateurs d\'Impact des Programmes (Impact Stats Ribbon)',
    statsSectionSub: 'Ces chiffres clés apparaissent en ruban sous l\'en-tête pour illustrer l\'envergure nationale.',
    statIndex: (i: number) => `Indicateur #${i}`,
    numericValueLabel: 'Valeur Chiffrée (ex : +1,500 ou 100%)',
    descInLang: (lang: string) => `Description en ${lang}`,
    ctaSectionTitle: 'Bannière d\'Appel à l\'Initiative (CTA Banner)',
    ctaSectionSub: 'Affichée en bas de page pour inciter créateurs, artistes et jeunes à proposer des initiatives.',
    ctaTitleLabel: 'Titre de l\'Appel',
    ctaDescLabel: 'Texte Explicatif',
    primaryCtaBlock: 'Bouton d\'Action Principal (Primary CTA)',
    secondaryCtaBlock: 'Bouton d\'Action Secondaire (Secondary CTA)',
    btnTextLabel: 'Texte du Bouton',
    btnUrlLabel: 'Lien de Destination (URL)',
    saveBtn: 'Enregistrer les paramètres de la page',
    savingBtn: 'Enregistrement...',
    saveSuccess: 'Tous les paramètres de la page Programmes ont été enregistrés avec succès !',
    saveError: 'Impossible d\'enregistrer les paramètres',
  },
  en: {
    tabHero: 'Hero Header Banner (Hero Banner)',
    tabStats: 'Key Impact Metrics (Impact Stats)',
    tabCta: 'Call to Action Banner (CTA Banner)',
    heroSectionTitle: 'Programs Page Showcase & Hero (Hero Section)',
    heroSectionSub: 'Customize headline titles, statutory badges, and primary banner imagery on the Programs page.',
    previewPublished: 'View Live Programs Page ↗',
    coverImageLabel: 'Programs Page Hero Visual Image',
    noImageHint: 'No image (default Moroccan cultural texture)',
    uploadImageBtn: '📁 Upload Hero Image',
    uploadingImageBtn: '⏳ Uploading...',
    removeImageBtn: 'Remove Image',
    enableCoverImage: 'Enable cover image on public Programs showcase',
    enableCoverImageHint: 'When disabled, an elegant Moroccan cultural pattern will serve as background.',
    livePreviewTitle: 'Live Interactive Showcase Preview (Live Preview):',
    eyebrowTagLabel: 'Eyebrow Tag',
    badgeLabel: 'Statutory Authority Badge',
    headlineLabel: 'Main Headline Title',
    descLabel: 'Introductory Narrative (Description)',
    statsSectionTitle: 'Programs Impact Metrics Ribbon',
    statsSectionSub: 'Displayed in a prominent ribbon below the header to highlight national cultural footprint.',
    statIndex: (i: number) => `Metric #${i}`,
    numericValueLabel: 'Numeric Metric Value (e.g. +1,500 or 100%)',
    descInLang: (lang: string) => `Description in ${lang}`,
    ctaSectionTitle: 'Project Proposal & Call to Action (CTA Banner)',
    ctaSectionSub: 'Displayed at page bottom to invite artists, youth, and partners to submit initiatives.',
    ctaTitleLabel: 'Call to Action Headline',
    ctaDescLabel: 'Explanatory Narrative',
    primaryCtaBlock: 'Primary Action Button (Primary CTA)',
    secondaryCtaBlock: 'Secondary Action Button (Secondary CTA)',
    btnTextLabel: 'Button Label',
    btnUrlLabel: 'Target Destination URL',
    saveBtn: 'Save Programs Page Configuration',
    savingBtn: 'Saving...',
    saveSuccess: 'All Programs page settings saved successfully and live on public site!',
    saveError: 'Failed to save configuration',
  },
}

export function ProgramsPageManager({ initialConfig }: ProgramsPageManagerProps) {
  const { locale, dir } = useAdminLocale()
  const tr = PROGRAM_HERO_STRINGS[locale] || PROGRAM_HERO_STRINGS.ar
  const [config, setConfig] = useState<ProgramsPageConfig>(initialConfig)
  const [activeTab, setActiveTab] = useState<'hero' | 'stats' | 'cta'>('hero')
  const [activeLangTab, setActiveLangTab] = useState<'ar' | 'fr' | 'en'>(locale)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function updateHero<K extends keyof ProgramsPageConfig['hero']>(
    field: K,
    val: ProgramsPageConfig['hero'][K]
  ) {
    setConfig((prev) => ({
      ...prev,
      hero: { ...prev.hero, [field]: val },
    }))
  }

  function updateCta(field: keyof ProgramsPageConfig['cta'], val: string) {
    setConfig((prev) => ({
      ...prev,
      cta: { ...prev.cta, [field]: val },
    }))
  }

  function updateStat(id: string, updates: Partial<ProgramStatItem>) {
    setConfig((prev) => ({
      ...prev,
      stats: prev.stats.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }))
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
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
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'حدث خطأ أثناء رفع الصورة')
    } finally {
      setUploadingImage(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    setFeedback(null)

    try {
      const res = await saveProgramsPageConfiguration(config)
      if (!res.success) {
        throw new Error(res.error || 'فشل حفظ الإعدادات')
      }

      setFeedback({
        type: 'success',
        message: 'تم حفظ كافة إعدادات صفحة البرامج بنجاح وتحديث الموقع مباشرة!',
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'تعذر حفظ الإعدادات'
      setFeedback({ type: 'error', message: msg })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8" dir={dir}>
      {/* Alert Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-between gap-3 shadow-xs transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span>{feedback.type === 'success' ? '✓' : '⚠'}</span>
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs opacity-60 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      {/* Secondary Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white rounded-2xl border border-[#e5e0d6] shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveTab('hero')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'hero'
              ? 'bg-[#231f20] text-white shadow-xs'
              : 'text-[#5C5A55] hover:text-[#231f20] hover:bg-[#FAF8F5]'
          }`}
        >
          <span>🖼️</span>
          <span>{tr.tabHero}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('stats')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'stats'
              ? 'bg-[#bd3227] text-white shadow-xs'
              : 'text-[#5C5A55] hover:text-[#231f20] hover:bg-[#FAF8F5]'
          }`}
        >
          <span>📊</span>
          <span>{tr.tabStats}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('cta')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'cta'
              ? 'bg-[#d2a82b] text-white shadow-xs'
              : 'text-[#5C5A55] hover:text-[#231f20] hover:bg-[#FAF8F5]'
          }`}
        >
          <span>📢</span>
          <span>{tr.tabCta}</span>
        </button>
      </div>

      {/* ============================================================
          TAB 1: HERO BANNER SETTINGS
          ============================================================ */}
      {activeTab === 'hero' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e5e0d6] shadow-subtle space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E0D6] pb-4">
            <div>
              <h2 className="text-xl font-black text-[#231f20] tracking-tight flex items-center gap-2">
                <span>🖼️</span>
                <span>{tr.heroSectionTitle}</span>
              </h2>
              <p className="text-xs text-[#5C5A55] mt-1">
                {tr.heroSectionSub}
              </p>
            </div>

            <div className="flex gap-1.5 p-1 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] self-start sm:self-auto">
              {(['ar', 'fr', 'en'] as const).map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setActiveLangTab(loc)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeLangTab === loc
                      ? 'bg-[#231f20] text-white shadow-xs'
                      : 'text-[#5C5A55] hover:bg-[#F4EFE6]'
                  }`}
                >
                  {loc === 'ar' ? 'العربية' : loc === 'fr' ? 'Français' : 'English'}
                </button>
              ))}
            </div>
          </div>

          {/* Hero Visual Image */}
          <div className="space-y-4 p-5 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6]">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-[#231f20]">
                {tr.coverImageLabel}
              </label>
              <Link
                href={`/${locale}/programs`}
                target="_blank"
                className="text-xs font-bold text-[#231f20] hover:underline flex items-center gap-1"
              >
                <span>{tr.previewPublished}</span>
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {config.hero.imageUrl ? (
                <div className="relative w-48 h-28 rounded-xl overflow-hidden border border-[#e5e0d6] shrink-0 bg-white shadow-2xs">
                  <Image
                    src={config.hero.imageUrl}
                    alt="Hero Preview"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-48 h-28 rounded-xl border border-dashed border-[#cfc7b9] flex flex-col items-center justify-center text-[#5C5A55] shrink-0 bg-white">
                  <span className="text-2xl">🖼️</span>
                  <span className="text-3xs mt-1">{tr.noImageHint}</span>
                </div>
              )}

              <div className="flex-1 space-y-2.5 w-full">
                <div className="flex items-center gap-2 flex-wrap">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="px-4 py-2 rounded-xl bg-[#231f20] text-white text-xs font-bold hover:bg-[#d2a82b] transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                  >
                    {uploadingImage ? tr.uploadingImageBtn : tr.uploadImageBtn}
                  </button>

                  {config.hero.imageUrl && (
                    <button
                      type="button"
                      onClick={() => updateHero('imageUrl', '')}
                      className="px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      {tr.removeImageBtn}
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  dir="ltr"
                  value={config.hero.imageUrl ?? ''}
                  onChange={(e) => updateHero('imageUrl', e.target.value)}
                  placeholder="/uploads/... or https://..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#e5e0d6] text-xs font-mono text-[#231f20] focus:outline-none focus:border-[#231f20] text-left"
                />

                <label className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-[#e5e0d6] cursor-pointer hover:bg-[#F4EFE6] transition-colors">
                  <input
                    type="checkbox"
                    checked={config.hero.showImage !== false}
                    onChange={(e) => updateHero('showImage', e.target.checked)}
                    className="w-4 h-4 rounded text-[#231f20] focus:ring-[#231f20]"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-[#231f20] block">{tr.enableCoverImage}</span>
                    <span className="text-[#5C5A55] block">{tr.enableCoverImageHint}</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Live Interactive Simulation Preview */}
            <div className="pt-3 border-t border-[#e5e0d6] space-y-2">
              <span className="text-2xs font-bold text-[#5C5A55] block">{tr.livePreviewTitle}</span>
              <div
                className={`relative rounded-2xl overflow-hidden p-6 text-center border transition-all ${
                  config.hero.showImage !== false && config.hero.imageUrl
                    ? 'bg-[#231f20] text-white border-[#231f20] min-h-[190px] flex flex-col justify-center items-center'
                    : 'bg-gradient-to-b from-[#F5F3EE] via-[#F5F3EE] to-[#F5F3EE] text-[#231f20] border-[#e5e0d6] min-h-[160px] flex flex-col justify-center items-center'
                }`}
              >
                {config.hero.showImage !== false && config.hero.imageUrl && (
                  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <Image
                      src={config.hero.imageUrl}
                      alt="Hero Simulation"
                      fill
                      unoptimized
                      className="object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-black/45" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#231f20]/90 via-[#231f20]/65 to-[#231f20]/95" />
                  </div>
                )}
                <div className="relative z-10 space-y-2 max-w-xl mx-auto">
                  <div className="flex items-center justify-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-3xs font-bold ${
                        config.hero.showImage !== false && config.hero.imageUrl
                          ? 'bg-white/10 text-[#ffd22f] border border-white/20'
                          : 'bg-[#bd3227]/10 text-[#bd3227]'
                      }`}
                    >
                      {activeLangTab === 'ar'
                        ? config.hero.tagAr || 'بوابة البرامج والمشاريع الثقافية'
                        : activeLangTab === 'fr'
                        ? config.hero.tagFr || 'Programmes & Projets Culturels'
                        : config.hero.tagEn || 'Cultural Programs & Initiatives'}
                    </span>
                  </div>
                  <h3
                    className={`text-base sm:text-lg font-black leading-snug ${
                      config.hero.showImage !== false && config.hero.imageUrl ? 'text-white' : 'text-[#231f20]'
                    }`}
                  >
                    {activeLangTab === 'ar'
                      ? config.hero.titleAr || 'عنوان رأس صفحة البرامج'
                      : activeLangTab === 'fr'
                      ? config.hero.titleFr || 'Titre de la page des programmes'
                      : config.hero.titleEn || 'Programs Page Headline'}
                  </h3>
                  <p
                    className={`text-xs line-clamp-2 ${
                      config.hero.showImage !== false && config.hero.imageUrl ? 'text-[#E2DED6]/95' : 'text-[#5C5A55]'
                    }`}
                  >
                    {activeLangTab === 'ar'
                      ? config.hero.descriptionAr || 'وصف رأس صفحة البرامج...'
                      : activeLangTab === 'fr'
                      ? config.hero.descriptionFr || 'Description introductive...'
                      : config.hero.descriptionEn || 'Programs overview narrative...'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Trilingual Inputs */}
          <div className="space-y-4">
            {activeLangTab === 'ar' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-2xs font-bold text-[#5C5A55] uppercase tracking-wider mb-1">
                      {tr.eyebrowTagLabel} (AR)
                    </label>
                    <input
                      type="text"
                      value={config.hero.tagAr}
                      onChange={(e) => updateHero('tagAr', e.target.value)}
                      placeholder="بوابة البرامج والمشاريع الثقافية • AMYCC Programs"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6] text-xs text-[#231f20] focus:bg-white focus:outline-none focus:border-[#231f20]"
                    />
                  </div>
                  <div>
                    <label className="block text-2xs font-bold text-[#5C5A55] uppercase tracking-wider mb-1">
                      {tr.badgeLabel} (AR)
                    </label>
                    <input
                      type="text"
                      value={config.hero.badgeAr}
                      onChange={(e) => updateHero('badgeAr', e.target.value)}
                      placeholder="المملكة المغربية • تمكين الشباب وصون التراث"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6] text-xs text-[#231f20] focus:bg-white focus:outline-none focus:border-[#231f20]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-2xs font-bold text-[#5C5A55] uppercase tracking-wider mb-1">
                    {tr.headlineLabel} (AR)
                  </label>
                  <textarea
                    rows={2}
                    value={config.hero.titleAr}
                    onChange={(e) => updateHero('titleAr', e.target.value)}
                    placeholder="برامجنا ومبادراتنا: فضاءات حية لاكتشاف المواهب وبناء الأثر الثقافي"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6] text-xs text-[#231f20] focus:bg-white focus:outline-none focus:border-[#231f20]"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-[#5C5A55] uppercase tracking-wider mb-1">
                    {tr.descLabel} (AR)
                  </label>
                  <textarea
                    rows={3}
                    value={config.hero.descriptionAr}
                    onChange={(e) => updateHero('descriptionAr', e.target.value)}
                    placeholder="تضع جمعية روح الفنون والثقافة في صلب رسالتها..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6] text-xs text-[#231f20] focus:bg-white focus:outline-none focus:border-[#231f20]"
                  />
                </div>
              </>
            )}

            {activeLangTab === 'fr' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-2xs font-bold text-[#5C5A55] uppercase tracking-wider mb-1">
                      {tr.eyebrowTagLabel} (FR)
                    </label>
                    <input
                      type="text"
                      value={config.hero.tagFr ?? ''}
                      onChange={(e) => updateHero('tagFr', e.target.value)}
                      placeholder="PROGRAMMES & INITIATIVES CULTURELLES"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6] text-xs text-[#231f20] focus:bg-white focus:outline-none focus:border-[#231f20]"
                    />
                  </div>
                  <div>
                    <label className="block text-2xs font-bold text-[#5C5A55] uppercase tracking-wider mb-1">
                      {tr.badgeLabel} (FR)
                    </label>
                    <input
                      type="text"
                      value={config.hero.badgeFr ?? ''}
                      onChange={(e) => updateHero('badgeFr', e.target.value)}
                      placeholder="Royaume du Maroc • Jeunesse & Patrimoine"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6] text-xs text-[#231f20] focus:bg-white focus:outline-none focus:border-[#231f20]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-2xs font-bold text-[#5C5A55] uppercase tracking-wider mb-1">
                    {tr.headlineLabel} (FR)
                  </label>
                  <textarea
                    rows={2}
                    value={config.hero.titleFr ?? ''}
                    onChange={(e) => updateHero('titleFr', e.target.value)}
                    placeholder="Nos Programmes : Espaces Vivants..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6] text-xs text-[#231f20] focus:bg-white focus:outline-none focus:border-[#231f20]"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-[#5C5A55] uppercase tracking-wider mb-1">
                    {tr.descLabel} (FR)
                  </label>
                  <textarea
                    rows={3}
                    value={config.hero.descriptionFr ?? ''}
                    onChange={(e) => updateHero('descriptionFr', e.target.value)}
                    placeholder="L'AMYCC conçoit et déploie des programmes pérennes..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6] text-xs text-[#231f20] focus:bg-white focus:outline-none focus:border-[#231f20]"
                  />
                </div>
              </>
            )}

            {activeLangTab === 'en' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-2xs font-bold text-[#5C5A55] uppercase tracking-wider mb-1">
                      {tr.eyebrowTagLabel} (EN)
                    </label>
                    <input
                      type="text"
                      value={config.hero.tagEn ?? ''}
                      onChange={(e) => updateHero('tagEn', e.target.value)}
                      placeholder="CULTURAL PROGRAMS & INITIATIVES"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6] text-xs text-[#231f20] focus:bg-white focus:outline-none focus:border-[#231f20]"
                    />
                  </div>
                  <div>
                    <label className="block text-2xs font-bold text-[#5C5A55] uppercase tracking-wider mb-1">
                      {tr.badgeLabel} (EN)
                    </label>
                    <input
                      type="text"
                      value={config.hero.badgeEn ?? ''}
                      onChange={(e) => updateHero('badgeEn', e.target.value)}
                      placeholder="Kingdom of Morocco • Youth & Heritage"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6] text-xs text-[#231f20] focus:bg-white focus:outline-none focus:border-[#231f20]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-2xs font-bold text-[#5C5A55] uppercase tracking-wider mb-1">
                    {tr.headlineLabel} (EN)
                  </label>
                  <textarea
                    rows={2}
                    value={config.hero.titleEn ?? ''}
                    onChange={(e) => updateHero('titleEn', e.target.value)}
                    placeholder="Our Programs: Vibrant Spaces..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6] text-xs text-[#231f20] focus:bg-white focus:outline-none focus:border-[#231f20]"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-[#5C5A55] uppercase tracking-wider mb-1">
                    {tr.descLabel} (EN)
                  </label>
                  <textarea
                    rows={3}
                    value={config.hero.descriptionEn ?? ''}
                    onChange={(e) => updateHero('descriptionEn', e.target.value)}
                    placeholder="AMYCC designs and leads enduring cultural initiatives..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6] text-xs text-[#231f20] focus:bg-white focus:outline-none focus:border-[#231f20]"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ============================================================
          TAB 2: IMPACT STATS RIBBON
          ============================================================ */}
      {activeTab === 'stats' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e5e0d6] shadow-subtle space-y-6">
          <div className="border-b border-[#E5E0D6] pb-4">
            <h2 className="text-xl font-black text-[#231f20] tracking-tight flex items-center gap-2">
              <span>📊</span>
              <span>{tr.statsSectionTitle}</span>
            </h2>
            <p className="text-xs text-[#5C5A55] mt-1">
              {tr.statsSectionSub}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {config.stats.map((stat, idx) => (
              <div
                key={stat.id}
                className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#bd3227]">
                    {tr.statIndex(idx + 1)}
                  </span>
                  <input
                    type="text"
                    value={stat.icon}
                    onChange={(e) => updateStat(stat.id, { icon: e.target.value })}
                    className="w-10 h-10 text-center text-lg rounded-xl bg-white border border-[#e5e0d6]"
                    title="Icon"
                  />
                </div>

                <div>
                  <label className="block text-3xs font-bold text-[#5C5A55] uppercase mb-1">
                    {tr.numericValueLabel}
                  </label>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => updateStat(stat.id, { value: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#e5e0d6] text-xs font-bold text-[#231f20]"
                  />
                </div>

                <div>
                  <label className="block text-3xs font-bold text-[#5C5A55] uppercase mb-1">
                    {tr.descInLang('AR')} *
                  </label>
                  <input
                    type="text"
                    value={stat.labelAr}
                    onChange={(e) => updateStat(stat.id, { labelAr: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#e5e0d6] text-xs text-[#231f20]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-3xs font-bold text-[#5C5A55] uppercase mb-1">
                      {tr.descInLang('FR')}
                    </label>
                    <input
                      type="text"
                      value={stat.labelFr ?? ''}
                      onChange={(e) => updateStat(stat.id, { labelFr: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#e5e0d6] text-xs text-[#231f20]"
                    />
                  </div>
                  <div>
                    <label className="block text-3xs font-bold text-[#5C5A55] uppercase mb-1">
                      {tr.descInLang('EN')}
                    </label>
                    <input
                      type="text"
                      value={stat.labelEn ?? ''}
                      onChange={(e) => updateStat(stat.id, { labelEn: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#e5e0d6] text-xs text-[#231f20]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================
          TAB 3: CALL TO ACTION BANNER
          ============================================================ */}
      {activeTab === 'cta' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e5e0d6] shadow-subtle space-y-6">
          <div className="border-b border-[#E5E0D6] pb-4">
            <h2 className="text-xl font-black text-[#231f20] tracking-tight flex items-center gap-2">
              <span>📢</span>
              <span>{tr.ctaSectionTitle}</span>
            </h2>
            <p className="text-xs text-[#5C5A55] mt-1">
              {tr.ctaSectionSub}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-2xs font-bold text-[#5C5A55] uppercase tracking-wider mb-1">
                {tr.ctaTitleLabel} (AR) *
              </label>
              <input
                type="text"
                value={config.cta.titleAr}
                onChange={(e) => updateCta('titleAr', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6] text-xs text-[#231f20] font-bold focus:bg-white focus:outline-none focus:border-[#231f20]"
              />
            </div>

            <div>
              <label className="block text-2xs font-bold text-[#5C5A55] uppercase tracking-wider mb-1">
                {tr.ctaDescLabel} (AR) *
              </label>
              <textarea
                rows={3}
                value={config.cta.descAr}
                onChange={(e) => updateCta('descAr', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6] text-xs text-[#231f20] focus:bg-white focus:outline-none focus:border-[#231f20]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] space-y-3">
                <span className="text-xs font-bold text-[#231f20] block">{tr.primaryCtaBlock}</span>
                <div>
                  <label className="block text-3xs font-bold text-[#5C5A55] uppercase mb-1">{tr.btnTextLabel} (AR)</label>
                  <input
                    type="text"
                    value={config.cta.primaryBtnTextAr}
                    onChange={(e) => updateCta('primaryBtnTextAr', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#e5e0d6] text-xs text-[#231f20]"
                  />
                </div>
                <div>
                  <label className="block text-3xs font-bold text-[#5C5A55] uppercase mb-1">{tr.btnUrlLabel}</label>
                  <input
                    type="text"
                    value={config.cta.primaryBtnUrl}
                    onChange={(e) => updateCta('primaryBtnUrl', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#e5e0d6] text-xs font-mono text-[#231f20]"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] space-y-3">
                <span className="text-xs font-bold text-[#bd3227] block">{tr.secondaryCtaBlock}</span>
                <div>
                  <label className="block text-3xs font-bold text-[#5C5A55] uppercase mb-1">{tr.btnTextLabel} (AR)</label>
                  <input
                    type="text"
                    value={config.cta.secondaryBtnTextAr}
                    onChange={(e) => updateCta('secondaryBtnTextAr', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#e5e0d6] text-xs text-[#231f20]"
                  />
                </div>
                <div>
                  <label className="block text-3xs font-bold text-[#5C5A55] uppercase mb-1">{tr.btnUrlLabel}</label>
                  <input
                    type="text"
                    value={config.cta.secondaryBtnUrl}
                    onChange={(e) => updateCta('secondaryBtnUrl', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#e5e0d6] text-xs font-mono text-[#231f20]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Action Bar */}
      <div className="sticky bottom-4 z-20 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#e5e0d6] shadow-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/programs`}
            target="_blank"
            className="px-3.5 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F4EFE6] text-xs font-bold text-[#231f20] border border-[#e5e0d6] transition-colors"
          >
            {tr.previewPublished}
          </Link>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#231f20] hover:bg-[#231f20] text-white text-xs sm:text-sm font-black transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
        >
          <span>{saving ? '⏳' : '💾'}</span>
          <span>{saving ? tr.savingBtn : tr.saveBtn}</span>
        </button>
      </div>
    </div>
  )
}

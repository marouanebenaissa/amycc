'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import type { TeamConfig, TeamHeroConfig } from '@/lib/settings'
import { saveTeamConfiguration } from '@/lib/actions/admin'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'
import { useAdminLocale } from './AdminLocaleContext'

const HERO_STRINGS = {
  ar: {
    section1Title: 'صورة واجهة صفحة الفريق (Hero Banner)',
    section1Subtitle: 'تحكم بالصورة الرئيسية التي تظهر في رأس صفحة فريق العمل والهيكلة.',
    uploadImage: 'رفع صورة من الجهاز',
    uploading: 'جارٍ الرفع...',
    removeImage: 'إزالة الصورة',
    enableImage: 'تفعيل صورة الغلاف على الواجهة',
    enableImageHint: 'إذا تم التعطيل، ستظهر الواجهة بخلفية مغربية هادئة ونقية.',
    orDirectUrl: 'أو رابط الصورة المباشر (Image URL)',
    urlPlaceholder: '/images/youth-in-action.jpg أو رابط خارجي...',
    liveSimulation: 'معاينة حية لواجهة الصفحة (Live Simulation)',
    previewPublished: 'معاينة الصفحة المنشورة ↗',
    noCoverImage: '(لا توجد صورة غلاف — سيتم عرض الخلفية الهادئة)',
    section2Title: 'نصوص وعناوين الواجهة (Trilingual Content)',
    section2Subtitle: 'تخصيص الشارات، العنوان العريض، والفقرة التقديمية في اللغات الثلاث.',
    badge1Label: 'الشارة الأولى (Badge 1)',
    badge2Label: 'الشارة الثانية (Badge 2)',
    headlineLabel: 'العنوان الرئيسي الكبير (Headline)',
    descLabel: 'الفقرة التقديمية (Description)',
    liveNotice: 'تُطبَّق التغييرات فوراً على صفحة فريق العمل',
    saveBtn: 'حفظ إعدادات الواجهة',
    savingBtn: 'جارٍ الحفظ...',
  },
  fr: {
    section1Title: 'Image d\'en-tête de la page Équipe (Hero Banner)',
    section1Subtitle: 'Gérer l\'image principale affichée en tête de la page Équipe & Direction.',
    uploadImage: 'Téléverser une image',
    uploading: 'Téléversement...',
    removeImage: 'Supprimer l\'image',
    enableImage: 'Activer l\'image de couverture',
    enableImageHint: 'Si désactivé, le fond marocain texturé sobre sera affiché.',
    orDirectUrl: 'Ou URL directe de l\'image (Image URL)',
    urlPlaceholder: '/images/youth-in-action.jpg ou URL externe...',
    liveSimulation: 'Aperçu en direct (Simulation)',
    previewPublished: 'Voir la page publiée ↗',
    noCoverImage: '(Aucune image de couverture — fond sobre affiché)',
    section2Title: 'Textes & Titres Trilingues (Trilingual Content)',
    section2Subtitle: 'Personnaliser les badges, le grand titre et la description dans les 3 langues.',
    badge1Label: 'Premier Badge (Badge 1)',
    badge2Label: 'Deuxième Badge (Badge 2)',
    headlineLabel: 'Titre Principal (Headline)',
    descLabel: 'Description introductive (Description)',
    liveNotice: 'Les modifications s\'appliquent immédiatement au site public',
    saveBtn: 'Enregistrer la configuration',
    savingBtn: 'Enregistrement...',
  },
  en: {
    section1Title: 'Team Page Hero Banner Image',
    section1Subtitle: 'Manage the primary banner image displayed on the Team & Leadership page.',
    uploadImage: 'Upload Image',
    uploading: 'Uploading...',
    removeImage: 'Remove Image',
    enableImage: 'Enable Cover Image',
    enableImageHint: 'If disabled, an elegant Moroccan cultural background will display.',
    orDirectUrl: 'Or Direct Image URL (Image URL)',
    urlPlaceholder: '/images/youth-in-action.jpg or external URL...',
    liveSimulation: 'Live Page Simulation',
    previewPublished: 'View Published Page ↗',
    noCoverImage: '(No cover image — elegant Moroccan pattern displayed)',
    section2Title: 'Trilingual Titles & Content (Trilingual Content)',
    section2Subtitle: 'Customize badges, main headline, and intro narrative across 3 languages.',
    badge1Label: 'First Badge (Badge 1)',
    badge2Label: 'Second Badge (Badge 2)',
    headlineLabel: 'Main Headline',
    descLabel: 'Introductory Narrative (Description)',
    liveNotice: 'Changes take effect immediately on the live public site',
    saveBtn: 'Save Hero Configuration',
    savingBtn: 'Saving...',
  },
}

const FALLBACK_HERO: TeamHeroConfig = {
  imageUrl: '/images/youth-in-action.jpg',
  showImage: true,
  badge1Ar: 'الهيكل الإداري والتنظيمي المعتمد • جمعية AMYCC',
  badge1Fr: 'Structure Administrative & Organisationnelle • AMYCC',
  badge1En: 'Official Organizational Leadership • AMYCC',
  badge2Ar: 'تأطير وطني بروح شبابية مسؤولة 🇲🇦',
  badge2Fr: 'Engagement Civique & Jeunesse 🇲🇦',
  badge2En: 'Nationwide Civic Leadership 🇲🇦',
  titleAr: 'طاقات شبابية وكفاءات ثقافية\nتقود مسيرة الإبداع والتأهيل الميداني',
  titleFr: 'Énergies Jeunes & Compétences Culturelles\nau Service de l’Art et de l’Engagement',
  titleEn: 'Youth Energy & Cultural Leadership\nDriving Artistic Innovation in Morocco',
  descriptionAr: 'يتألف فريق عمل جمعية روح الفنون والثقافة (AMYCC) من مكتب تنفيذي منتخب ولجان فنية متخصصة تجمع بين الخبرة الميدانية، الشغف الفني، والالتزام الصارم بمبادئ الشفافية والمسؤولية لخدمة قضايا الشباب والتراث المغربي.',
  descriptionFr: "L'équipe de l'Association Marocaine des Jeunes, Culture & Créativité (AMYCC) réunit un bureau exécutif élu et des commissions spécialisées engagées pour l'animation culturelle, la valorisation du patrimoine et la formation des jeunes.",
  descriptionEn: 'The team of the Spirit of Arts & Culture Association (AMYCC) comprises an elected executive board and specialized committees dedicated to arts education, heritage celebration, and empowering young creatives across Morocco.',
}

interface TeamHeroManagerProps {
  initialConfig: TeamConfig
  defaultHero?: TeamHeroConfig
}

export function TeamHeroManager({
  initialConfig,
  defaultHero = FALLBACK_HERO,
}: TeamHeroManagerProps) {
  const { locale, dir } = useAdminLocale()
  const tr = HERO_STRINGS[locale] || HERO_STRINGS.ar

  const [hero, setHero] = useState<TeamHeroConfig>({
    ...defaultHero,
    ...(initialConfig.hero || {}),
  })
  const [activeLangTab, setActiveLangTab] = useState<'ar' | 'fr' | 'en'>(locale)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setFeedback(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || (locale === 'ar' ? 'تعذر رفع الصورة' : locale === 'fr' ? 'Échec du téléversement' : 'Failed to upload image'))
      }

      setHero((prev) => ({
        ...prev,
        imageUrl: data.url,
        showImage: true,
      }))
      setFeedback({
        type: 'success',
        message: locale === 'ar'
          ? 'تم رفع صورة الغلاف بنجاح! اضغط على "حفظ إعدادات الواجهة" لاعتمادها مباشرة.'
          : locale === 'fr'
          ? 'Image téléversée avec succès ! Cliquez sur "Enregistrer" pour appliquer.'
          : 'Image uploaded successfully! Click "Save Hero Configuration" to apply.',
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : (locale === 'ar' ? 'حدث خطأ أثناء رفع الصورة' : 'Error uploading image')
      setFeedback({ type: 'error', message: msg })
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  function handleRemoveImage() {
    setHero((prev) => ({ ...prev, imageUrl: '' }))
    setFeedback({
      type: 'success',
      message: locale === 'ar'
        ? 'تمت إزالة صورة الغلاف. اضغط على "حفظ إعدادات الواجهة" لتطبيق التغيير.'
        : locale === 'fr'
        ? 'Image supprimée. Cliquez sur "Enregistrer" pour appliquer.'
        : 'Image removed. Click "Save Hero Configuration" to apply.',
    })
  }

  async function handleSave() {
    setSaving(true)
    setFeedback(null)

    try {
      const updatedConfig: TeamConfig = {
        hero,
        members: initialConfig.members,
      }

      const res = await saveTeamConfiguration(updatedConfig)
      if (!res.success) {
        throw new Error(res.error || (locale === 'ar' ? 'فشل حفظ الإعدادات' : 'Failed to save settings'))
      }

      setFeedback({
        type: 'success',
        message: locale === 'ar'
          ? 'تم حفظ صورة ونصوص واجهة صفحة الفريق بنجاح! تم تحديث الموقع مباشرة.'
          : locale === 'fr'
          ? 'Configuration enregistrée avec succès et appliquée au site public !'
          : 'Team hero configuration saved and applied to live site!',
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : (locale === 'ar' ? 'تعذر حفظ الإعدادات' : 'Failed to save settings')
      setFeedback({ type: 'error', message: msg })
    } finally {
      setSaving(false)
    }
  }

  const previewBadge1 =
    activeLangTab === 'ar'
      ? hero.badge1Ar || defaultHero.badge1Ar
      : activeLangTab === 'fr'
      ? hero.badge1Fr || defaultHero.badge1Fr
      : hero.badge1En || defaultHero.badge1En

  const previewBadge2 =
    activeLangTab === 'ar'
      ? hero.badge2Ar || defaultHero.badge2Ar
      : activeLangTab === 'fr'
      ? hero.badge2Fr || defaultHero.badge2Fr
      : hero.badge2En || defaultHero.badge2En

  const previewTitle =
    activeLangTab === 'ar'
      ? hero.titleAr || defaultHero.titleAr
      : activeLangTab === 'fr'
      ? hero.titleFr || defaultHero.titleFr
      : hero.titleEn || defaultHero.titleEn

  const previewDescription =
    activeLangTab === 'ar'
      ? hero.descriptionAr || defaultHero.descriptionAr
      : activeLangTab === 'fr'
      ? hero.descriptionFr || defaultHero.descriptionFr
      : hero.descriptionEn || defaultHero.descriptionEn

  return (
    <div className="space-y-8" dir={dir}>
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Top Banner Alert */}
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

      {/* Section 1: Hero Image Upload & Live Preview */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e5e0d6] shadow-subtle space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E0D6]">
          <div>
            <h2 className="text-xl font-black text-[#231f20] tracking-tight flex items-center gap-2">
              <span>🖼️</span>
              <span>{tr.section1Title}</span>
            </h2>
            <p className="text-xs text-[#5C5A55] mt-1">
              {tr.section1Subtitle} (/{locale}/team).
            </p>
          </div>

          {/* Quick Action Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#231f20] hover:bg-[#231f20] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <span>{uploading ? '⏳' : '📷'}</span>
              <span>{uploading ? tr.uploading : tr.uploadImage}</span>
            </button>

            {hero.imageUrl && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-all cursor-pointer"
              >
                🗑️ {tr.removeImage}
              </button>
            )}
          </div>
        </div>

        {/* Visibility Toggle & Image URL Input */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] cursor-pointer hover:bg-[#F4EFE6] transition-colors">
            <input
              type="checkbox"
              checked={hero.showImage !== false}
              onChange={(e) => setHero((prev) => ({ ...prev, showImage: e.target.checked }))}
              className="w-4 h-4 rounded text-[#231f20] focus:ring-[#231f20]"
            />
            <div className="text-xs">
              <span className="font-bold text-[#231f20] block">{tr.enableImage}</span>
              <span className="text-[#5C5A55] block">{tr.enableImageHint}</span>
            </div>
          </label>

          <div>
            <label className="block text-2xs font-bold text-[#5C5A55] uppercase tracking-wider mb-1">
              {tr.orDirectUrl}
            </label>
            <input
              type="text"
              value={hero.imageUrl || ''}
              onChange={(e) => setHero((prev) => ({ ...prev, imageUrl: e.target.value }))}
              placeholder={tr.urlPlaceholder}
              className="w-full px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6] text-xs text-[#231f20] focus:bg-white focus:outline-none focus:border-[#231f20]"
            />
          </div>
        </div>

        {/* Live Interactive Preview Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-2xs font-bold text-[#5C5A55]">
            <span>{tr.liveSimulation}</span>
            <div className="flex items-center gap-2">
              <Link
                href={`/${locale}/team`}
                target="_blank"
                className="text-[#231f20] hover:underline"
              >
                {tr.previewPublished}
              </Link>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden min-h-[320px] sm:min-h-[380px] bg-[#231f20] text-white flex items-center justify-center border-2 border-[#cfc7b9] shadow-inner p-6 sm:p-10 text-center">
            {/* Background photo layer */}
            {hero.imageUrl && hero.showImage !== false ? (
              <>
                <div className="absolute inset-0 z-0">
                  <ImageWithFallback
                    src={hero.imageUrl}
                    fallbackSrc="/images/youth-in-action.jpg"
                    alt="Preview"
                    fill
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-black/45" />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#231f20]/95 via-[#231f20]/70 to-[#231f20]/95" />
                  <div className="absolute inset-0 moroccan-star-pattern opacity-15 pointer-events-none" />
                </div>
              </>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-b from-[#F5F3EE] via-[#FEF6CC] to-[#F5F3EE] flex items-center justify-center">
                <div className="absolute inset-0 moroccan-pattern-light opacity-60" />
                <span className="text-xs text-[#5C5A55] font-bold z-10">
                  {tr.noCoverImage}
                </span>
              </div>
            )}

            {/* Overlaid Live Typography */}
            <div className={`relative z-10 max-w-2xl mx-auto space-y-4 ${hero.imageUrl && hero.showImage !== false ? 'text-white' : 'text-[#231f20]'}`}>
              {/* Badges preview */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                {previewBadge1 && (
                  <span className={`px-3 py-1 rounded-full text-3xs font-bold backdrop-blur-md border ${
                    hero.imageUrl && hero.showImage !== false
                      ? 'bg-white/15 border-white/25 text-white'
                      : 'bg-[#231f20]/10 border-[#231f20]/20 text-[#231f20]'
                  }`}>
                    {previewBadge1}
                  </span>
                )}
                {previewBadge2 && (
                  <span className={`px-3 py-1 rounded-full text-3xs font-bold backdrop-blur-md border ${
                    hero.imageUrl && hero.showImage !== false
                      ? 'bg-white/15 border-white/25 text-[#ffd22f]'
                      : 'bg-[#d2a82b]/10 border-[#d2a82b]/20 text-[#d2a82b]'
                  }`}>
                    {previewBadge2}
                  </span>
                )}
              </div>

              {/* Title preview */}
              <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-snug whitespace-pre-line">
                {previewTitle}
              </h3>

              {/* Description preview */}
              <p className={`text-xs sm:text-sm line-clamp-3 leading-relaxed max-w-xl mx-auto ${
                hero.imageUrl && hero.showImage !== false ? 'text-[#E2DED6]/90' : 'text-[#5C5A55]'
              }`}>
                {previewDescription}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Trilingual Text Customization */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e5e0d6] shadow-subtle space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E0D6]">
          <div>
            <h2 className="text-xl font-black text-[#231f20] tracking-tight flex items-center gap-2">
              <span>✍️</span>
              <span>{tr.section2Title}</span>
            </h2>
            <p className="text-xs text-[#5C5A55] mt-1">
              {tr.section2Subtitle}
            </p>
          </div>

          {/* Language Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#FAF8F5] rounded-xl border border-[#e5e0d6]">
            <button
              type="button"
              onClick={() => setActiveLangTab('ar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                activeLangTab === 'ar'
                  ? 'bg-[#231f20] text-white shadow-xs'
                  : 'text-[#5C5A55] hover:text-[#231f20]'
              }`}
            >
              العربية (AR)
            </button>
            <button
              type="button"
              onClick={() => setActiveLangTab('fr')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                activeLangTab === 'fr'
                  ? 'bg-[#231f20] text-white shadow-xs'
                  : 'text-[#5C5A55] hover:text-[#231f20]'
              }`}
            >
              Français (FR)
            </button>
            <button
              type="button"
              onClick={() => setActiveLangTab('en')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                activeLangTab === 'en'
                  ? 'bg-[#231f20] text-white shadow-xs'
                  : 'text-[#5C5A55] hover:text-[#231f20]'
              }`}
            >
              English (EN)
            </button>
          </div>
        </div>

        {/* Form Fields per Selected Language */}
        <div className="space-y-5">
          {activeLangTab === 'ar' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-2xs font-bold text-[#5C5A55] uppercase tracking-wider mb-1">
                    {tr.badge1Label} (AR)
                  </label>
                  <input
                    type="text"
                    value={hero.badge1Ar ?? ''}
                    onChange={(e) => setHero((prev) => ({ ...prev, badge1Ar: e.target.value }))}
                    placeholder={defaultHero.badge1Ar}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6] text-xs text-[#231f20] focus:bg-white focus:outline-none focus:border-[#231f20]"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-bold text-[#5C5A55] uppercase tracking-wider mb-1">
                    {tr.badge2Label} (AR)
                  </label>
                  <input
                    type="text"
                    value={hero.badge2Ar ?? ''}
                    onChange={(e) => setHero((prev) => ({ ...prev, badge2Ar: e.target.value }))}
                    placeholder={defaultHero.badge2Ar}
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
                  value={hero.titleAr ?? ''}
                  onChange={(e) => setHero((prev) => ({ ...prev, titleAr: e.target.value }))}
                  placeholder={defaultHero.titleAr}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6] text-xs text-[#231f20] focus:bg-white focus:outline-none focus:border-[#231f20]"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-[#5C5A55] uppercase tracking-wider mb-1">
                  {tr.descLabel} (AR)
                </label>
                <textarea
                  rows={3}
                  value={hero.descriptionAr ?? ''}
                  onChange={(e) => setHero((prev) => ({ ...prev, descriptionAr: e.target.value }))}
                  placeholder={defaultHero.descriptionAr}
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
                    {tr.badge1Label} (FR)
                  </label>
                  <input
                    type="text"
                    value={hero.badge1Fr ?? ''}
                    onChange={(e) => setHero((prev) => ({ ...prev, badge1Fr: e.target.value }))}
                    placeholder={defaultHero.badge1Fr}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6] text-xs text-[#231f20] focus:bg-white focus:outline-none focus:border-[#231f20]"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-bold text-[#5C5A55] uppercase tracking-wider mb-1">
                    {tr.badge2Label} (FR)
                  </label>
                  <input
                    type="text"
                    value={hero.badge2Fr ?? ''}
                    onChange={(e) => setHero((prev) => ({ ...prev, badge2Fr: e.target.value }))}
                    placeholder={defaultHero.badge2Fr}
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
                  value={hero.titleFr ?? ''}
                  onChange={(e) => setHero((prev) => ({ ...prev, titleFr: e.target.value }))}
                  placeholder={defaultHero.titleFr}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6] text-xs text-[#231f20] focus:bg-white focus:outline-none focus:border-[#231f20]"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-[#5C5A55] uppercase tracking-wider mb-1">
                  {tr.descLabel} (FR)
                </label>
                <textarea
                  rows={3}
                  value={hero.descriptionFr ?? ''}
                  onChange={(e) => setHero((prev) => ({ ...prev, descriptionFr: e.target.value }))}
                  placeholder={defaultHero.descriptionFr}
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
                    {tr.badge1Label} (EN)
                  </label>
                  <input
                    type="text"
                    value={hero.badge1En ?? ''}
                    onChange={(e) => setHero((prev) => ({ ...prev, badge1En: e.target.value }))}
                    placeholder={defaultHero.badge1En}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6] text-xs text-[#231f20] focus:bg-white focus:outline-none focus:border-[#231f20]"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-bold text-[#5C5A55] uppercase tracking-wider mb-1">
                    {tr.badge2Label} (EN)
                  </label>
                  <input
                    type="text"
                    value={hero.badge2En ?? ''}
                    onChange={(e) => setHero((prev) => ({ ...prev, badge2En: e.target.value }))}
                    placeholder={defaultHero.badge2En}
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
                  value={hero.titleEn ?? ''}
                  onChange={(e) => setHero((prev) => ({ ...prev, titleEn: e.target.value }))}
                  placeholder={defaultHero.titleEn}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6] text-xs text-[#231f20] focus:bg-white focus:outline-none focus:border-[#231f20]"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-[#5C5A55] uppercase tracking-wider mb-1">
                  {tr.descLabel} (EN)
                </label>
                <textarea
                  rows={3}
                  value={hero.descriptionEn ?? ''}
                  onChange={(e) => setHero((prev) => ({ ...prev, descriptionEn: e.target.value }))}
                  placeholder={defaultHero.descriptionEn}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6] text-xs text-[#231f20] focus:bg-white focus:outline-none focus:border-[#231f20]"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bottom Sticky Action Strip */}
      <div className="sticky bottom-4 z-20 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#e5e0d6] shadow-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-[#5C5A55]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{tr.liveNotice}</span>
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

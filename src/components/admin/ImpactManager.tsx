'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type {
  ImpactConfig,
  ImpactMetricItem,
  ImpactPillarItem,
  ImpactStepItem,
  ImpactTransparencyItem,
} from '@/lib/settings'
import { saveImpactConfiguration } from '@/lib/actions/admin'

interface ImpactManagerProps {
  initialConfig: ImpactConfig
  defaultConfig?: ImpactConfig
}

export function ImpactManager({ initialConfig, defaultConfig }: ImpactManagerProps) {
  const router = useRouter()
  const [config, setConfig] = useState<ImpactConfig>(initialConfig)
  const [activeTab, setActiveTab] = useState<'hero' | 'metrics' | 'pillars' | 'spotlight' | 'transparency_cta'>('hero')
  const [activeLangTab, setActiveLangTab] = useState<'ar' | 'fr' | 'en'>('ar')
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingSpotlightImg, setUploadingSpotlightImg] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const spotlightFileInputRef = useRef<HTMLInputElement>(null)

  function updateHero<K extends keyof ImpactConfig['hero']>(
    field: K,
    val: ImpactConfig['hero'][K]
  ) {
    setConfig((prev) => ({
      ...prev,
      hero: { ...prev.hero, [field]: val },
    }))
  }

  function updateSpotlight<K extends keyof ImpactConfig['spotlight']>(
    field: K,
    val: ImpactConfig['spotlight'][K]
  ) {
    setConfig((prev) => ({
      ...prev,
      spotlight: { ...prev.spotlight, [field]: val },
    }))
  }

  function updateCta<K extends keyof ImpactConfig['cta']>(
    field: K,
    val: ImpactConfig['cta'][K]
  ) {
    setConfig((prev) => ({
      ...prev,
      cta: { ...prev.cta, [field]: val },
    }))
  }

  // Metrics handlers
  function updateMetric(index: number, field: keyof ImpactMetricItem, val: string) {
    setConfig((prev) => {
      const next = [...prev.metrics]
      if (next[index]) {
        next[index] = { ...next[index], [field]: val }
      }
      return { ...prev, metrics: next }
    })
  }

  function addMetric() {
    const newMetric: ImpactMetricItem = {
      id: `metric-${Date.now()}`,
      value: '+100',
      labelAr: 'مؤشر أثر جديد',
      labelFr: 'Nouvel indicateur',
      labelEn: 'New impact indicator',
      subtextAr: 'تفاصيل المؤشر المجتمعي',
      subtextFr: 'Détails de l’indicateur',
      subtextEn: 'Indicator details',
      icon: '📈',
    }
    setConfig((prev) => ({
      ...prev,
      metrics: [...prev.metrics, newMetric],
    }))
  }

  function removeMetric(index: number) {
    if (!confirm('هل ترغب في حذف هذا المؤشر الإحصائي؟')) return
    setConfig((prev) => ({
      ...prev,
      metrics: prev.metrics.filter((_, idx) => idx !== index),
    }))
  }

  // Pillars handlers
  function updatePillar(index: number, field: keyof ImpactPillarItem, val: string) {
    setConfig((prev) => {
      const next = [...prev.pillars]
      if (next[index]) {
        next[index] = { ...next[index], [field]: val }
      }
      return { ...prev, pillars: next }
    })
  }

  function addPillar() {
    const newPillar: ImpactPillarItem = {
      id: `pillar-${Date.now()}`,
      badgeAr: 'محور نوعي',
      badgeFr: 'Axe Stratégique',
      badgeEn: 'Strategic Axis',
      titleAr: 'محور استراتيجي جديد للأثر',
      titleFr: 'Nouvel axe d’impact',
      titleEn: 'New strategic impact pillar',
      descAr: 'وصف مفصل للأثر والنتائج المرجوة من هذا المحور الثقافي والمجتمعي.',
      descFr: 'Description détaillée de l’impact et des résultats ciblés.',
      descEn: 'Detailed description of the targeted impact and outcomes.',
      icon: '🌟',
    }
    setConfig((prev) => ({
      ...prev,
      pillars: [...prev.pillars, newPillar],
    }))
  }

  function removePillar(index: number) {
    if (!confirm('هل ترغب في حذف هذا المحور الاستراتيجي؟')) return
    setConfig((prev) => ({
      ...prev,
      pillars: prev.pillars.filter((_, idx) => idx !== index),
    }))
  }

  // Methodology steps handlers
  function updateStep(index: number, field: keyof ImpactStepItem, val: string) {
    setConfig((prev) => {
      const nextSteps = [...prev.methodology.steps]
      if (nextSteps[index]) {
        nextSteps[index] = { ...nextSteps[index], [field]: val }
      }
      return {
        ...prev,
        methodology: { ...prev.methodology, steps: nextSteps },
      }
    })
  }

  // Transparency items handlers
  function updateTransparencyItem(index: number, field: keyof ImpactTransparencyItem, val: string) {
    setConfig((prev) => {
      const nextItems = [...prev.transparency.items]
      if (nextItems[index]) {
        nextItems[index] = { ...nextItems[index], [field]: val }
      }
      return {
        ...prev,
        transparency: { ...prev.transparency, items: nextItems },
      }
    })
  }

  // Upload handler for Hero Image
  async function handleHeroImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
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

      updateHero('heroImageUrl', json.url)
      updateHero('hasHeroImage', true)
      setFeedback({ type: 'success', message: 'تم رفع صورة الهيدر بنجاح وتفعيلها!' })
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'حدث خطأ أثناء رفع الصورة',
      })
    } finally {
      setUploadingImage(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // Upload handler for Spotlight Image
  async function handleSpotlightImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('يرجى اختيار ملف صورة صالح (JPEG, PNG, WebP)')
      return
    }

    setUploadingSpotlightImg(true)
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

      updateSpotlight('imageUrl', json.url)
      setFeedback({ type: 'success', message: 'تم رفع صورة قصة الأثر الميداني بنجاح!' })
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'حدث خطأ أثناء رفع الصورة',
      })
    } finally {
      setUploadingSpotlightImg(false)
      if (spotlightFileInputRef.current) spotlightFileInputRef.current.value = ''
    }
  }

  async function handleSave() {
    setSaving(true)
    setFeedback(null)
    try {
      const res = await saveImpactConfiguration(config)
      if (res.success) {
        router.refresh()
        setFeedback({
          type: 'success',
          message: 'تم حفظ كافة بيانات وإعدادات صفحة الأثر المجتمعي بنجاح وتحديث الموقع العام فوراً!',
        })
      } else {
        setFeedback({
          type: 'error',
          message: res.error || 'حدث خطأ أثناء حفظ الإعدادات',
        })
      }
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'فشل حفظ الإعدادات',
      })
    } finally {
      setSaving(false)
    }
  }

  function handleReset() {
    if (defaultConfig && confirm('هل أنت متأكد من استعادة القيم الافتراضية الأولية للأثر المجتمعي؟')) {
      setConfig(defaultConfig)
      setFeedback({ type: 'success', message: 'تم استرجاع الإعدادات الافتراضية. اضغط حفظ لتطبيقها.' })
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-[#e5e0d6] shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0d3b43] text-white flex items-center justify-center text-xl shadow-xs">
            🌟
          </div>
          <div>
            <h2 className="text-base font-extrabold text-[#08242a]">
              إدارة محتوى صفحة الأثر المجتمعي (Community Impact CMS)
            </h2>
            <p className="text-3xs sm:text-2xs text-[#5f7174]">
              تخصيص الهيدر المغربي، مؤشرات الأثر، المحاور الاستراتيجية، قصة شباب في العمل، ومنهجية العمل والشفافية.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {defaultConfig && (
            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#5f7174] bg-[#faf7f2] border border-[#e5e0d6] hover:bg-[#ede5d8] transition-colors"
            >
              استعادة الافتراضي
            </button>
          )}

          <Link
            href="/ar/impact"
            target="_blank"
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#0d3b43] bg-[#d8f0f4] hover:bg-[#c2e8ef] transition-colors"
          >
            معاينة الصفحة ↗
          </Link>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#0d3b43] hover:bg-[#14505b] disabled:opacity-50 transition-all shadow-xs flex items-center gap-2"
          >
            {saving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs font-bold flex items-center justify-between border ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <span>{feedback.message}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-sm font-bold opacity-60 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#e5e0d6] pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('hero')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'hero'
              ? 'bg-[#0d3b43] text-white shadow-xs'
              : 'bg-white text-[#5f7174] border border-[#e5e0d6] hover:bg-[#faf7f2]'
          }`}
        >
          <span>🖼️</span>
          <span>الهيدر والتقرير (Hero & Report)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('metrics')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'metrics'
              ? 'bg-[#0d3b43] text-white shadow-xs'
              : 'bg-white text-[#5f7174] border border-[#e5e0d6] hover:bg-[#faf7f2]'
          }`}
        >
          <span>📊</span>
          <span>مؤشرات الأثر ({config.metrics.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pillars')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'pillars'
              ? 'bg-[#0d3b43] text-white shadow-xs'
              : 'bg-white text-[#5f7174] border border-[#e5e0d6] hover:bg-[#faf7f2]'
          }`}
        >
          <span>🏛️</span>
          <span>المحاور الاستراتيجية ({config.pillars.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('spotlight')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'spotlight'
              ? 'bg-[#0d3b43] text-white shadow-xs'
              : 'bg-white text-[#5f7174] border border-[#e5e0d6] hover:bg-[#faf7f2]'
          }`}
        >
          <span>🚀</span>
          <span>قصة الأثر والمنهجية</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('transparency_cta')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'transparency_cta'
              ? 'bg-[#0d3b43] text-white shadow-xs'
              : 'bg-white text-[#5f7174] border border-[#e5e0d6] hover:bg-[#faf7f2]'
          }`}
        >
          <span>⚖️</span>
          <span>النزاهة والشفافية والدعوة للشراكة</span>
        </button>
      </div>

      {/* Language Switcher Sub-Bar (For Multilingual Fields) */}
      <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-[#e5e0d6]">
        <div className="text-2xs font-bold text-[#5f7174] flex items-center gap-2">
          <span>🌐</span>
          <span>اختر لغة إدخال النصوص (Trilingual Input Selector):</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveLangTab('ar')}
            className={`px-3 py-1 rounded-lg text-2xs font-extrabold transition-colors ${
              activeLangTab === 'ar'
                ? 'bg-[#0d3b43] text-white'
                : 'bg-[#faf7f2] text-[#5f7174] hover:bg-[#ede5d8]'
            }`}
          >
            العربية (AR)
          </button>
          <button
            type="button"
            onClick={() => setActiveLangTab('fr')}
            className={`px-3 py-1 rounded-lg text-2xs font-extrabold transition-colors ${
              activeLangTab === 'fr'
                ? 'bg-[#0d3b43] text-white'
                : 'bg-[#faf7f2] text-[#5f7174] hover:bg-[#ede5d8]'
            }`}
          >
            Français (FR)
          </button>
          <button
            type="button"
            onClick={() => setActiveLangTab('en')}
            className={`px-3 py-1 rounded-lg text-2xs font-extrabold transition-colors ${
              activeLangTab === 'en'
                ? 'bg-[#0d3b43] text-white'
                : 'bg-[#faf7f2] text-[#5f7174] hover:bg-[#ede5d8]'
            }`}
          >
            English (EN)
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* TAB 1: HERO & REPORT                                                 */}
      {/* ==================================================================== */}
      {activeTab === 'hero' && (
        <div className="space-y-6">
          {/* Hero Visual Preview */}
          <div className="bg-white p-6 rounded-2xl border border-[#e5e0d6] shadow-2xs space-y-4">
            <h3 className="text-sm font-extrabold text-[#08242a] flex items-center gap-2">
              <span>👁️</span>
              <span>معاينة حية وتفاعلية لهيدر صفحة الأثر (Live Simulation Preview)</span>
            </h3>

            <div
              className={`relative rounded-2xl overflow-hidden p-8 sm:p-12 text-center min-h-[300px] flex flex-col justify-center items-center shadow-inner transition-colors ${
                config.hero.hasHeroImage && config.hero.heroImageUrl
                  ? 'bg-[#1c1917] text-white'
                  : 'bg-gradient-to-b from-[#faf7f2] via-[#f7f2e9] to-[#faf7f2] border border-[#e5e0d6] text-[#08242a]'
              }`}
            >
              {config.hero.hasHeroImage && config.hero.heroImageUrl ? (
                <>
                  <Image
                    src={config.hero.heroImageUrl}
                    alt="Hero Preview"
                    fill
                    className="object-cover object-center"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/45" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/55 to-black/90 pointer-events-none" />
                </>
              ) : (
                <>
                  <div className="absolute inset-0 moroccan-pattern-light opacity-60 pointer-events-none" />
                  <div className="absolute top-1/3 start-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#c85a32]/10 rounded-full blur-3xl pointer-events-none" />
                </>
              )}

              <div className="relative z-10 max-w-3xl space-y-3">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-2xs font-bold ${
                    config.hero.hasHeroImage && config.hero.heroImageUrl
                      ? 'bg-white/10 text-[#f4ce83] border border-white/20'
                      : 'bg-[#faece7] text-[#c85a32] border border-[#f0cbbd]'
                  }`}
                >
                  {activeLangTab === 'ar'
                    ? config.hero.badgeAr
                    : activeLangTab === 'fr'
                    ? config.hero.badgeFr
                    : config.hero.badgeEn}
                </span>

                <h1
                  className={`text-2xl sm:text-4xl font-black leading-tight ${
                    config.hero.hasHeroImage && config.hero.heroImageUrl ? 'text-white' : 'text-[#08242a]'
                  }`}
                >
                  {activeLangTab === 'ar'
                    ? config.hero.titleAr
                    : activeLangTab === 'fr'
                    ? config.hero.titleFr
                    : config.hero.titleEn}
                </h1>

                {(activeLangTab === 'ar'
                  ? config.hero.subtitleAr
                  : activeLangTab === 'fr'
                  ? config.hero.subtitleFr
                  : config.hero.subtitleEn) && (
                  <p
                    className={`text-xs sm:text-sm font-bold ${
                      config.hero.hasHeroImage && config.hero.heroImageUrl ? 'text-[#f4ce83]' : 'text-[#c85a32]'
                    }`}
                  >
                    {activeLangTab === 'ar'
                      ? config.hero.subtitleAr
                      : activeLangTab === 'fr'
                      ? config.hero.subtitleFr
                      : config.hero.subtitleEn}
                  </p>
                )}

                <p
                  className={`text-2xs sm:text-xs line-clamp-3 leading-relaxed ${
                    config.hero.hasHeroImage && config.hero.heroImageUrl ? 'text-white/80' : 'text-[#5f7174]'
                  }`}
                >
                  {activeLangTab === 'ar'
                    ? config.hero.descriptionAr
                    : activeLangTab === 'fr'
                    ? config.hero.descriptionFr
                    : config.hero.descriptionEn}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <span
                    className={`px-4 py-2 rounded-lg text-2xs font-bold shadow-xs ${
                      config.hero.hasHeroImage && config.hero.heroImageUrl
                        ? 'bg-[#f4ce83] text-[#08242a]'
                        : 'bg-[#c85a32] text-white'
                    }`}
                  >
                    {activeLangTab === 'ar'
                      ? config.hero.primaryBtnTextAr
                      : activeLangTab === 'fr'
                      ? config.hero.primaryBtnTextFr
                      : config.hero.primaryBtnTextEn}
                  </span>
                  <span
                    className={`px-4 py-2 rounded-lg text-2xs font-bold ${
                      config.hero.hasHeroImage && config.hero.heroImageUrl
                        ? 'bg-white/10 text-white border border-white/20'
                        : 'bg-white text-[#08242a] border border-[#cfc7b9]'
                    }`}
                  >
                    📄 {activeLangTab === 'ar'
                      ? config.hero.secondaryBtnTextAr
                      : activeLangTab === 'fr'
                      ? config.hero.secondaryBtnTextFr
                      : config.hero.secondaryBtnTextEn}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image Controls */}
          <div className="bg-white p-6 rounded-2xl border border-[#e5e0d6] shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#f4ede2]">
              <div>
                <h3 className="text-sm font-extrabold text-[#08242a]">
                  صورة خلفية الهيدر (Hero Background Image)
                </h3>
                <p className="text-3xs text-[#5f7174]">
                  ارفع صورة مخصصة عالية الدقة تمثل الأنشطة الميدانية بالمغرب، أو قم بالتبديل إلى الزخرفة التراثية.
                </p>
              </div>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={config.hero.hasHeroImage}
                  onChange={(e) => updateHero('hasHeroImage', e.target.checked)}
                  className="w-4 h-4 text-[#0d3b43] rounded focus:ring-[#0d3b43]"
                />
                <span className="text-xs font-bold text-[#08242a]">
                  تفعيل صورة الخلفية (Enable Image)
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-2xs font-bold text-[#08242a] mb-1">
                  رابط الصورة (Image URL):
                </label>
                <input
                  type="text"
                  value={config.hero.heroImageUrl}
                  onChange={(e) => updateHero('heroImageUrl', e.target.value)}
                  placeholder="/uploads/hero-impact.jpg أو رابط خارجي https://..."
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs focus:border-[#0d3b43] focus:ring-1 focus:ring-[#0d3b43] outline-none"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-[#08242a] mb-1">
                  أو رفع صورة من جهازك مباشرة:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleHeroImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="w-full px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0d3b43] hover:bg-[#14505b] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                  >
                    {uploadingImage ? 'جاري الرفع...' : '📁 اختيار ملف ورفعه تلقائياً'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Multilingual Text Fields */}
          <div className="bg-white p-6 rounded-2xl border border-[#e5e0d6] shadow-2xs space-y-4">
            <h3 className="text-sm font-extrabold text-[#08242a] pb-2 border-b border-[#f4ede2]">
              نصوص الهيدر باللغة المختارة ({activeLangTab.toUpperCase()})
            </h3>

            {activeLangTab === 'ar' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-2xs font-bold text-[#08242a] mb-1">
                    شارة الهيدر (Badge):
                  </label>
                  <input
                    type="text"
                    value={config.hero.badgeAr}
                    onChange={(e) => updateHero('badgeAr', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs font-semibold focus:border-[#0d3b43] outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-2xs font-bold text-[#08242a] mb-1">
                    العنوان الرئيسي (Title):
                  </label>
                  <input
                    type="text"
                    value={config.hero.titleAr}
                    onChange={(e) => updateHero('titleAr', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs font-bold focus:border-[#0d3b43] outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-2xs font-bold text-[#08242a] mb-1">
                    العنوان الفرعي (Subtitle):
                  </label>
                  <input
                    type="text"
                    value={config.hero.subtitleAr}
                    onChange={(e) => updateHero('subtitleAr', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs font-medium focus:border-[#0d3b43] outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-2xs font-bold text-[#08242a] mb-1">
                    الوصف الشامل (Description):
                  </label>
                  <textarea
                    rows={3}
                    value={config.hero.descriptionAr}
                    onChange={(e) => updateHero('descriptionAr', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs leading-relaxed focus:border-[#0d3b43] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-[#08242a] mb-1">
                    نص الزر الرئيسي:
                  </label>
                  <input
                    type="text"
                    value={config.hero.primaryBtnTextAr}
                    onChange={(e) => updateHero('primaryBtnTextAr', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-[#08242a] mb-1">
                    نص زر التقرير (PDF):
                  </label>
                  <input
                    type="text"
                    value={config.hero.secondaryBtnTextAr}
                    onChange={(e) => updateHero('secondaryBtnTextAr', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs outline-none"
                  />
                </div>
              </div>
            )}

            {activeLangTab === 'fr' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-2xs font-bold text-[#08242a] mb-1">
                    Badge (FR):
                  </label>
                  <input
                    type="text"
                    value={config.hero.badgeFr}
                    onChange={(e) => updateHero('badgeFr', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs font-semibold focus:border-[#0d3b43] outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-2xs font-bold text-[#08242a] mb-1">
                    Titre Principal (FR):
                  </label>
                  <input
                    type="text"
                    value={config.hero.titleFr}
                    onChange={(e) => updateHero('titleFr', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs font-bold focus:border-[#0d3b43] outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-2xs font-bold text-[#08242a] mb-1">
                    Sous-titre (FR):
                  </label>
                  <input
                    type="text"
                    value={config.hero.subtitleFr}
                    onChange={(e) => updateHero('subtitleFr', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs font-medium focus:border-[#0d3b43] outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-2xs font-bold text-[#08242a] mb-1">
                    Description Complète (FR):
                  </label>
                  <textarea
                    rows={3}
                    value={config.hero.descriptionFr}
                    onChange={(e) => updateHero('descriptionFr', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs leading-relaxed focus:border-[#0d3b43] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-[#08242a] mb-1">
                    Bouton Primaire (FR):
                  </label>
                  <input
                    type="text"
                    value={config.hero.primaryBtnTextFr}
                    onChange={(e) => updateHero('primaryBtnTextFr', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-[#08242a] mb-1">
                    Bouton Rapport PDF (FR):
                  </label>
                  <input
                    type="text"
                    value={config.hero.secondaryBtnTextFr}
                    onChange={(e) => updateHero('secondaryBtnTextFr', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs outline-none"
                  />
                </div>
              </div>
            )}

            {activeLangTab === 'en' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-2xs font-bold text-[#08242a] mb-1">
                    Badge (EN):
                  </label>
                  <input
                    type="text"
                    value={config.hero.badgeEn}
                    onChange={(e) => updateHero('badgeEn', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs font-semibold focus:border-[#0d3b43] outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-2xs font-bold text-[#08242a] mb-1">
                    Headline Title (EN):
                  </label>
                  <input
                    type="text"
                    value={config.hero.titleEn}
                    onChange={(e) => updateHero('titleEn', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs font-bold focus:border-[#0d3b43] outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-2xs font-bold text-[#08242a] mb-1">
                    Subtitle (EN):
                  </label>
                  <input
                    type="text"
                    value={config.hero.subtitleEn}
                    onChange={(e) => updateHero('subtitleEn', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs font-medium focus:border-[#0d3b43] outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-2xs font-bold text-[#08242a] mb-1">
                    Full Description (EN):
                  </label>
                  <textarea
                    rows={3}
                    value={config.hero.descriptionEn}
                    onChange={(e) => updateHero('descriptionEn', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs leading-relaxed focus:border-[#0d3b43] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-[#08242a] mb-1">
                    Primary Button Text (EN):
                  </label>
                  <input
                    type="text"
                    value={config.hero.primaryBtnTextEn}
                    onChange={(e) => updateHero('primaryBtnTextEn', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-[#08242a] mb-1">
                    Report Button Text (EN):
                  </label>
                  <input
                    type="text"
                    value={config.hero.secondaryBtnTextEn}
                    onChange={(e) => updateHero('secondaryBtnTextEn', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs outline-none"
                  />
                </div>
              </div>
            )}

            {/* Links and PDF */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-[#f4ede2]">
              <div>
                <label className="block text-2xs font-bold text-[#08242a] mb-1">
                  رابط الزر الرئيسي (Primary URL):
                </label>
                <input
                  type="text"
                  value={config.hero.primaryBtnUrl}
                  onChange={(e) => updateHero('primaryBtnUrl', e.target.value)}
                  placeholder="/programs"
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-[#08242a] mb-1">
                  رابط تقرير الأثر المجتمعي (PDF Report URL):
                </label>
                <input
                  type="text"
                  value={config.hero.reportPdfUrl}
                  onChange={(e) => updateHero('reportPdfUrl', e.target.value)}
                  placeholder="/documents/rapport-impact-amycc-2026.pdf"
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: METRICS (KPIS)                                                */}
      {/* ==================================================================== */}
      {activeTab === 'metrics' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-[#08242a]">
                مؤشرات الأثر والأرقام الرئيسية (Key Impact Indicators)
              </h3>
              <p className="text-xs text-[#5f7174]">
                البطاقات الإحصائية الأربعة العائمة في أعلى الصفحة لقياس المنجزات.
              </p>
            </div>
            <button
              type="button"
              onClick={addMetric}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0d3b43] hover:bg-[#14505b] transition-all flex items-center gap-1.5 shadow-xs"
            >
              <span>+</span>
              <span>إضافة مؤشر إحصائي جديد</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {config.metrics.map((metric, idx) => (
              <div
                key={metric.id}
                className="bg-white p-5 rounded-2xl border border-[#e5e0d6] shadow-2xs space-y-4 relative"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#f4ede2]">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#faf7f2] border border-[#e5e0d6] text-2xs font-bold flex items-center justify-center text-[#08242a]">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-black text-[#08242a]">
                      مؤشر: {metric.value || 'بدون رقم'}
                    </span>
                  </div>

                  {config.metrics.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMetric(idx)}
                      className="text-xs text-rose-500 hover:text-rose-700 font-bold"
                    >
                      حذف
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-3xs font-bold text-[#08242a] mb-1">
                      القيمة الرقمية (Value):
                    </label>
                    <input
                      type="text"
                      value={metric.value}
                      onChange={(e) => updateMetric(idx, 'value', e.target.value)}
                      placeholder="مثال: +1,500"
                      className="w-full px-3 py-1.5 rounded-lg border border-[#e5e0d6] text-xs font-bold outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-3xs font-bold text-[#08242a] mb-1">
                      الأيقونة (Emoji):
                    </label>
                    <input
                      type="text"
                      value={metric.icon}
                      onChange={(e) => updateMetric(idx, 'icon', e.target.value)}
                      placeholder="🏛️"
                      className="w-full px-3 py-1.5 rounded-lg border border-[#e5e0d6] text-xs text-center outline-none"
                    />
                  </div>
                </div>

                {/* Multilingual Labels */}
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-3xs font-bold text-[#08242a] mb-1">
                      العنوان ({activeLangTab.toUpperCase()}):
                    </label>
                    <input
                      type="text"
                      value={
                        activeLangTab === 'ar'
                          ? metric.labelAr
                          : activeLangTab === 'fr'
                          ? metric.labelFr
                          : metric.labelEn
                      }
                      onChange={(e) =>
                        updateMetric(
                          idx,
                          activeLangTab === 'ar'
                            ? 'labelAr'
                            : activeLangTab === 'fr'
                            ? 'labelFr'
                            : 'labelEn',
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-[#e5e0d6] text-xs font-semibold outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-3xs font-bold text-[#08242a] mb-1">
                      النص التوضيحي ({activeLangTab.toUpperCase()}):
                    </label>
                    <input
                      type="text"
                      value={
                        activeLangTab === 'ar'
                          ? metric.subtextAr
                          : activeLangTab === 'fr'
                          ? metric.subtextFr
                          : metric.subtextEn
                      }
                      onChange={(e) =>
                        updateMetric(
                          idx,
                          activeLangTab === 'ar'
                            ? 'subtextAr'
                            : activeLangTab === 'fr'
                            ? 'subtextFr'
                            : 'subtextEn',
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-[#e5e0d6] text-xs outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: STRATEGIC PILLARS                                             */}
      {/* ==================================================================== */}
      {activeTab === 'pillars' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-[#08242a]">
                المحاور الاستراتيجية الأربعة للأثر (Strategic Pillars)
              </h3>
              <p className="text-xs text-[#5f7174]">
                المجالات الأساسية التي ترتكز عليها الجمعية لصناعة التغيير الثقافي والمجتمعي.
              </p>
            </div>
            <button
              type="button"
              onClick={addPillar}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0d3b43] hover:bg-[#14505b] transition-all flex items-center gap-1.5 shadow-xs"
            >
              <span>+</span>
              <span>إضافة محور استراتيجي جديد</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {config.pillars.map((pillar, idx) => (
              <div
                key={pillar.id}
                className="bg-white p-6 rounded-2xl border border-[#e5e0d6] shadow-2xs space-y-4 relative"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#f4ede2]">
                  <div className="flex items-center gap-2">
                    <span className="text-xl p-1.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6]">
                      {pillar.icon}
                    </span>
                    <span className="text-xs font-black text-[#08242a]">
                      المحور {idx + 1}
                    </span>
                  </div>

                  {config.pillars.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePillar(idx)}
                      className="text-xs text-rose-500 hover:text-rose-700 font-bold"
                    >
                      حذف
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1">
                    <label className="block text-3xs font-bold text-[#08242a] mb-1">
                      الأيقونة:
                    </label>
                    <input
                      type="text"
                      value={pillar.icon}
                      onChange={(e) => updatePillar(idx, 'icon', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#e5e0d6] text-xs text-center outline-none"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-3xs font-bold text-[#08242a] mb-1">
                      الشارة ({activeLangTab.toUpperCase()}):
                    </label>
                    <input
                      type="text"
                      value={
                        activeLangTab === 'ar'
                          ? pillar.badgeAr || ''
                          : activeLangTab === 'fr'
                          ? pillar.badgeFr || ''
                          : pillar.badgeEn || ''
                      }
                      onChange={(e) =>
                        updatePillar(
                          idx,
                          activeLangTab === 'ar'
                            ? 'badgeAr'
                            : activeLangTab === 'fr'
                            ? 'badgeFr'
                            : 'badgeEn',
                          e.target.value
                        )
                      }
                      placeholder="مثال: الريادة الشبابية"
                      className="w-full px-3 py-1.5 rounded-lg border border-[#e5e0d6] text-xs outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-3xs font-bold text-[#08242a] mb-1">
                    عنوان المحور ({activeLangTab.toUpperCase()}):
                  </label>
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
                    className="w-full px-3 py-1.5 rounded-lg border border-[#e5e0d6] text-xs font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-3xs font-bold text-[#08242a] mb-1">
                    وصف المحور وأثره ({activeLangTab.toUpperCase()}):
                  </label>
                  <textarea
                    rows={3}
                    value={
                      activeLangTab === 'ar'
                        ? pillar.descAr
                        : activeLangTab === 'fr'
                        ? pillar.descFr
                        : pillar.descEn
                    }
                    onChange={(e) =>
                      updatePillar(
                        idx,
                        activeLangTab === 'ar'
                          ? 'descAr'
                          : activeLangTab === 'fr'
                          ? 'descFr'
                          : 'descEn',
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-[#e5e0d6] text-xs leading-relaxed outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 4: SPOTLIGHT & METHODOLOGY                                       */}
      {/* ==================================================================== */}
      {activeTab === 'spotlight' && (
        <div className="space-y-6">
          {/* Spotlight Section Form */}
          <div className="bg-white p-6 rounded-2xl border border-[#e5e0d6] shadow-2xs space-y-5">
            <h3 className="text-base font-extrabold text-[#08242a] pb-2 border-b border-[#f4ede2]">
              قصة الأثر الميداني — مبادرة شباب في العمل (Featured Spotlight Story)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-2xs font-bold text-[#08242a] mb-1">
                  الشارة ({activeLangTab.toUpperCase()}):
                </label>
                <input
                  type="text"
                  value={
                    activeLangTab === 'ar'
                      ? config.spotlight.badgeAr
                      : activeLangTab === 'fr'
                      ? config.spotlight.badgeFr
                      : config.spotlight.badgeEn
                  }
                  onChange={(e) =>
                    updateSpotlight(
                      activeLangTab === 'ar'
                        ? 'badgeAr'
                        : activeLangTab === 'fr'
                        ? 'badgeFr'
                        : 'badgeEn',
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-2xs font-bold text-[#08242a] mb-1">
                  العنوان الرئيسي ({activeLangTab.toUpperCase()}):
                </label>
                <input
                  type="text"
                  value={
                    activeLangTab === 'ar'
                      ? config.spotlight.titleAr
                      : activeLangTab === 'fr'
                      ? config.spotlight.titleFr
                      : config.spotlight.titleEn
                  }
                  onChange={(e) =>
                    updateSpotlight(
                      activeLangTab === 'ar'
                        ? 'titleAr'
                        : activeLangTab === 'fr'
                        ? 'titleFr'
                        : 'titleEn',
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs font-bold outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-2xs font-bold text-[#08242a] mb-1">
                  الوصف السردي ({activeLangTab.toUpperCase()}):
                </label>
                <textarea
                  rows={3}
                  value={
                    activeLangTab === 'ar'
                      ? config.spotlight.descAr
                      : activeLangTab === 'fr'
                      ? config.spotlight.descFr
                      : config.spotlight.descEn
                  }
                  onChange={(e) =>
                    updateSpotlight(
                      activeLangTab === 'ar'
                        ? 'descAr'
                        : activeLangTab === 'fr'
                        ? 'descFr'
                        : 'descEn',
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs leading-relaxed outline-none"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-[#08242a] mb-1">
                  شهادة/اقتباس المستفيد ({activeLangTab.toUpperCase()}):
                </label>
                <textarea
                  rows={3}
                  value={
                    activeLangTab === 'ar'
                      ? config.spotlight.quoteAr
                      : activeLangTab === 'fr'
                      ? config.spotlight.quoteFr
                      : config.spotlight.quoteEn
                  }
                  onChange={(e) =>
                    updateSpotlight(
                      activeLangTab === 'ar'
                        ? 'quoteAr'
                        : activeLangTab === 'fr'
                        ? 'quoteFr'
                        : 'quoteEn',
                      e.target.value
                    )
                  }
                  placeholder="أدخل نص الشهادة أو الاقتباس..."
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs leading-relaxed outline-none focus:border-[#0d3b43] focus:ring-1 focus:ring-[#0d3b43]"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-[#08242a] mb-1">
                  صاحب الشهادة ({activeLangTab.toUpperCase()}):
                </label>
                <input
                  type="text"
                  value={
                    activeLangTab === 'ar'
                      ? config.spotlight.quoteAuthorAr
                      : activeLangTab === 'fr'
                      ? config.spotlight.quoteAuthorFr
                      : config.spotlight.quoteAuthorEn
                  }
                  onChange={(e) =>
                    updateSpotlight(
                      activeLangTab === 'ar'
                        ? 'quoteAuthorAr'
                        : activeLangTab === 'fr'
                        ? 'quoteAuthorFr'
                        : 'quoteAuthorEn',
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs outline-none focus:border-[#0d3b43]"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-[#08242a] mb-1">
                  رابط صورة القصة (Image URL):
                </label>
                <input
                  type="text"
                  value={config.spotlight.imageUrl}
                  onChange={(e) => updateSpotlight('imageUrl', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-[#08242a] mb-1">
                  رفع صورة جديدة من الجهاز:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    ref={spotlightFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleSpotlightImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => spotlightFileInputRef.current?.click()}
                    disabled={uploadingSpotlightImg}
                    className="w-full px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0d3b43] hover:bg-[#14505b] disabled:opacity-50 transition-colors"
                  >
                    {uploadingSpotlightImg ? 'جاري الرفع...' : '📁 رفع صورة القصة'}
                  </button>
                </div>
              </div>
            </div>

            {/* Live Visual Preview of the Quote Box */}
            <div className="pt-4 border-t border-[#f4ede2] space-y-2">
              <span className="text-3xs font-extrabold text-[#c85a32] uppercase tracking-wider block">
                معاينة حية ومباشرة لشكل الاقتباس على الموقع (Live Quote Simulation):
              </span>
              <div className="p-4 rounded-xl bg-[#faf7f2] border-r-4 rtl:border-r-4 ltr:border-l-4 border-[#c85a32] shadow-2xs space-y-2">
                <p className="text-xs sm:text-sm font-semibold italic text-[#08242a] leading-relaxed">
                  &ldquo;
                  {activeLangTab === 'ar'
                    ? config.spotlight.quoteAr
                    : activeLangTab === 'fr'
                    ? config.spotlight.quoteFr
                    : config.spotlight.quoteEn}
                  &rdquo;
                </p>
                <div className="text-2xs font-bold text-[#c85a32]">
                  — {activeLangTab === 'ar'
                    ? config.spotlight.quoteAuthorAr
                    : activeLangTab === 'fr'
                    ? config.spotlight.quoteAuthorFr
                    : config.spotlight.quoteAuthorEn}
                </div>
              </div>
            </div>

            {/* In-tab Save Button */}
            <div className="flex items-center justify-between pt-3 border-t border-[#f4ede2]">
              <span className="text-3xs text-[#819598]">
                * اضغط حفظ ليتم نشر التعديلات فوراً على كافة صفحات الموقع.
              </span>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0d3b43] hover:bg-[#14505b] disabled:opacity-50 transition-all shadow-xs flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>جاري الحفظ...</span>
                  </>
                ) : (
                  <>
                    <span>💾</span>
                    <span>حفظ تعديلات قصة الأثر والاقتباس</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Methodology 4 Steps */}
          <div className="bg-white p-6 rounded-2xl border border-[#e5e0d6] shadow-2xs space-y-5">
            <h3 className="text-base font-extrabold text-[#08242a] pb-2 border-b border-[#f4ede2]">
              خطوات ومنهجية تحقيق الأثر الأربعة (4-Step Impact Methodology)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {config.methodology.steps.map((step, idx) => (
                <div
                  key={step.id}
                  className="p-4 rounded-xl border border-[#e5e0d6] bg-[#faf7f2] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#c85a32]">
                      المرحلة {step.stepNumber}
                    </span>
                    <input
                      type="text"
                      value={step.icon}
                      onChange={(e) => updateStep(idx, 'icon', e.target.value)}
                      className="w-10 px-2 py-1 rounded text-center border border-[#e5e0d6] text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-3xs font-bold text-[#08242a] mb-1">
                      عنوان المرحلة ({activeLangTab.toUpperCase()}):
                    </label>
                    <input
                      type="text"
                      value={
                        activeLangTab === 'ar'
                          ? step.titleAr
                          : activeLangTab === 'fr'
                          ? step.titleFr
                          : step.titleEn
                      }
                      onChange={(e) =>
                        updateStep(
                          idx,
                          activeLangTab === 'ar'
                            ? 'titleAr'
                            : activeLangTab === 'fr'
                            ? 'titleFr'
                            : 'titleEn',
                          e.target.value
                        )
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#e5e0d6] text-xs font-bold bg-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-3xs font-bold text-[#08242a] mb-1">
                      شرح المرحلة ({activeLangTab.toUpperCase()}):
                    </label>
                    <textarea
                      rows={2}
                      value={
                        activeLangTab === 'ar'
                          ? step.descAr
                          : activeLangTab === 'fr'
                          ? step.descFr
                          : step.descEn
                      }
                      onChange={(e) =>
                        updateStep(
                          idx,
                          activeLangTab === 'ar'
                            ? 'descAr'
                            : activeLangTab === 'fr'
                            ? 'descFr'
                            : 'descEn',
                          e.target.value
                        )
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#e5e0d6] text-xs bg-white outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 5: TRANSPARENCY & CTA                                            */}
      {/* ==================================================================== */}
      {activeTab === 'transparency_cta' && (
        <div className="space-y-6">
          {/* Transparency Items */}
          <div className="bg-white p-6 rounded-2xl border border-[#e5e0d6] shadow-2xs space-y-5">
            <div>
              <h3 className="text-base font-extrabold text-[#08242a]">
                ميثاق النزاهة والشفافية المدنية (Civil Integrity & Transparency)
              </h3>
              <p className="text-xs text-[#5f7174]">
                المعايير القانونية والأخلاقية التي تلتزم بها الجمعية بالمملكة المغربية.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {config.transparency.items.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-[#e5e0d6] bg-[#faf7f2] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#08242a]">
                      بند النزاهة {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={item.icon}
                      onChange={(e) => updateTransparencyItem(idx, 'icon', e.target.value)}
                      className="w-10 px-2 py-1 rounded text-center border border-[#e5e0d6] text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-3xs font-bold text-[#08242a] mb-1">
                      عنوان البند ({activeLangTab.toUpperCase()}):
                    </label>
                    <input
                      type="text"
                      value={
                        activeLangTab === 'ar'
                          ? item.titleAr
                          : activeLangTab === 'fr'
                          ? item.titleFr
                          : item.titleEn
                      }
                      onChange={(e) =>
                        updateTransparencyItem(
                          idx,
                          activeLangTab === 'ar'
                            ? 'titleAr'
                            : activeLangTab === 'fr'
                            ? 'titleFr'
                            : 'titleEn',
                          e.target.value
                        )
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#e5e0d6] text-xs font-bold bg-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-3xs font-bold text-[#08242a] mb-1">
                      تفاصيل البند ({activeLangTab.toUpperCase()}):
                    </label>
                    <textarea
                      rows={2}
                      value={
                        activeLangTab === 'ar'
                          ? item.descAr
                          : activeLangTab === 'fr'
                          ? item.descFr
                          : item.descEn
                      }
                      onChange={(e) =>
                        updateTransparencyItem(
                          idx,
                          activeLangTab === 'ar'
                            ? 'descAr'
                            : activeLangTab === 'fr'
                            ? 'descFr'
                            : 'descEn',
                          e.target.value
                        )
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#e5e0d6] text-xs bg-white outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Banner Section */}
          <div className="bg-white p-6 rounded-2xl border border-[#e5e0d6] shadow-2xs space-y-4">
            <h3 className="text-base font-extrabold text-[#08242a] pb-2 border-b border-[#f4ede2]">
              بانر الدعوة للشراكة وتوسيع الأثر (Partnership CTA Banner)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-2xs font-bold text-[#08242a] mb-1">
                  الشارة ({activeLangTab.toUpperCase()}):
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
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-2xs font-bold text-[#08242a] mb-1">
                  عنوان البانر ({activeLangTab.toUpperCase()}):
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
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs font-bold outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-2xs font-bold text-[#08242a] mb-1">
                  نص الدعوة ({activeLangTab.toUpperCase()}):
                </label>
                <textarea
                  rows={3}
                  value={
                    activeLangTab === 'ar'
                      ? config.cta.descAr
                      : activeLangTab === 'fr'
                      ? config.cta.descFr
                      : config.cta.descEn
                  }
                  onChange={(e) =>
                    updateCta(
                      activeLangTab === 'ar'
                        ? 'descAr'
                        : activeLangTab === 'fr'
                        ? 'descFr'
                        : 'descEn',
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-[#08242a] mb-1">
                  نص الزر الأول ({activeLangTab.toUpperCase()}):
                </label>
                <input
                  type="text"
                  value={
                    activeLangTab === 'ar'
                      ? config.cta.primaryBtnTextAr
                      : activeLangTab === 'fr'
                      ? config.cta.primaryBtnTextFr
                      : config.cta.primaryBtnTextEn
                  }
                  onChange={(e) =>
                    updateCta(
                      activeLangTab === 'ar'
                        ? 'primaryBtnTextAr'
                        : activeLangTab === 'fr'
                        ? 'primaryBtnTextFr'
                        : 'primaryBtnTextEn',
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-[#08242a] mb-1">
                  رابط الزر الأول:
                </label>
                <input
                  type="text"
                  value={config.cta.primaryBtnUrl}
                  onChange={(e) => updateCta('primaryBtnUrl', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-[#08242a] mb-1">
                  نص الزر الثاني ({activeLangTab.toUpperCase()}):
                </label>
                <input
                  type="text"
                  value={
                    activeLangTab === 'ar'
                      ? config.cta.secondaryBtnTextAr
                      : activeLangTab === 'fr'
                      ? config.cta.secondaryBtnTextFr
                      : config.cta.secondaryBtnTextEn
                  }
                  onChange={(e) =>
                    updateCta(
                      activeLangTab === 'ar'
                        ? 'secondaryBtnTextAr'
                        : activeLangTab === 'fr'
                        ? 'secondaryBtnTextFr'
                        : 'secondaryBtnTextEn',
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-[#08242a] mb-1">
                  رابط الزر الثاني:
                </label>
                <input
                  type="text"
                  value={config.cta.secondaryBtnUrl}
                  onChange={(e) => updateCta('secondaryBtnUrl', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Save Bar for Immediate Action */}
      <div className="sticky bottom-4 z-40 p-3 bg-white/95 backdrop-blur-md rounded-2xl border border-[#e5e0d6] shadow-card flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-2xs font-bold text-[#08242a]">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>لوحة التحكم نشطة — أي تعديل تجريه جاهز للحفظ والنشر فوراً</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/ar/impact"
            target="_blank"
            className="px-4 py-2 rounded-xl text-xs font-bold text-[#0d3b43] bg-[#d8f0f4] hover:bg-[#c2e8ef] transition-colors"
          >
            معاينة صفحة الأثر ↗
          </Link>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-[#0d3b43] hover:bg-[#14505b] disabled:opacity-50 transition-all shadow-xs flex items-center gap-2"
          >
            {saving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>جاري الحفظ...</span>
              </>
            ) : (
              <>
                <span>💾</span>
                <span>حفظ التعديلات ونشرها فوراً</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

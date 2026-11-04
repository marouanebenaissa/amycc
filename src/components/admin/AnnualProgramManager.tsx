'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type {
  AnnualProgramConfig,
  AnnualProgramQuarter,
  AnnualProgramEventItem,
} from '@/lib/settings'
import { saveAnnualProgramConfiguration } from '@/lib/actions/admin'

interface AnnualProgramManagerProps {
  initialConfig: AnnualProgramConfig
  defaultConfig?: AnnualProgramConfig
}

export function AnnualProgramManager({ initialConfig, defaultConfig }: AnnualProgramManagerProps) {
  const [config, setConfig] = useState<AnnualProgramConfig>(initialConfig)
  const [activeTab, setActiveTab] = useState<'hero' | 'stats_pillars' | 'quarters' | 'cta'>('hero')
  const [activeLangTab, setActiveLangTab] = useState<'ar' | 'fr' | 'en'>('ar')
  const [activeQuarterIdx, setActiveQuarterIdx] = useState<number>(0)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function updateHero<K extends keyof AnnualProgramConfig['hero']>(
    field: K,
    val: AnnualProgramConfig['hero'][K]
  ) {
    setConfig((prev) => ({
      ...prev,
      hero: { ...prev.hero, [field]: val },
    }))
  }

  function updateCta<K extends keyof AnnualProgramConfig['cta']>(
    field: K,
    val: AnnualProgramConfig['cta'][K]
  ) {
    setConfig((prev) => ({
      ...prev,
      cta: { ...prev.cta, [field]: val },
    }))
  }

  function updateStat(index: number, field: string, val: string) {
    setConfig((prev) => {
      const nextStats = [...prev.stats]
      if (nextStats[index]) {
        nextStats[index] = { ...nextStats[index], [field]: val }
      }
      return { ...prev, stats: nextStats }
    })
  }

  function updatePillar(index: number, field: string, val: string) {
    setConfig((prev) => {
      const nextPillars = [...prev.pillars]
      if (nextPillars[index]) {
        nextPillars[index] = { ...nextPillars[index], [field]: val }
      }
      return { ...prev, pillars: nextPillars }
    })
  }

  function updateQuarter(qIdx: number, field: keyof AnnualProgramQuarter, val: unknown) {
    setConfig((prev) => {
      const nextQuarters = [...prev.quarters]
      if (nextQuarters[qIdx]) {
        nextQuarters[qIdx] = { ...nextQuarters[qIdx], [field]: val }
      }
      return { ...prev, quarters: nextQuarters }
    })
  }

  function updateQuarterEvent(qIdx: number, eIdx: number, field: keyof AnnualProgramEventItem, val: unknown) {
    setConfig((prev) => {
      const nextQuarters = [...prev.quarters]
      const quarter = nextQuarters[qIdx]
      if (!quarter) return prev
      const nextEvents = [...quarter.events]
      if (nextEvents[eIdx]) {
        nextEvents[eIdx] = { ...nextEvents[eIdx], [field]: val }
        nextQuarters[qIdx] = { ...quarter, events: nextEvents }
      }
      return { ...prev, quarters: nextQuarters }
    })
  }

  function addQuarterEvent(qIdx: number) {
    setConfig((prev) => {
      const nextQuarters = [...prev.quarters]
      const quarter = nextQuarters[qIdx]
      if (!quarter) return prev
      const newEvent: AnnualProgramEventItem = {
        id: `q${quarter.quarterNumber}-e${quarter.events.length + 1}-${Date.now()}`,
        titleAr: 'نشاط جديد في هذا الفصل',
        titleFr: 'Nouvelle activité',
        titleEn: 'New Programmed Event',
        descAr: 'وصف موجز لأهداف ومخرجات النشاط المبرمج...',
        descFr: 'Description synthétique de l’activité...',
        descEn: 'Brief summary of the programmed activity...',
        categoryAr: 'ورشات وتكوين',
        categoryFr: 'Ateliers & Formation',
        categoryEn: 'Workshops & Training',
        venueAr: 'المراكز الثقافية ودور الشباب',
        venueFr: 'Centres culturels',
        venueEn: 'Cultural Centers',
        status: 'upcoming',
        highlight: false,
      }
      nextQuarters[qIdx] = {
        ...quarter,
        events: [...quarter.events, newEvent],
      }
      return { ...prev, quarters: nextQuarters }
    })
  }

  function removeQuarterEvent(qIdx: number, eIdx: number) {
    if (!confirm('هل ترغب حقاً في حذف هذا النشاط المبرمج؟')) return
    setConfig((prev) => {
      const nextQuarters = [...prev.quarters]
      const quarter = nextQuarters[qIdx]
      if (!quarter) return prev
      nextQuarters[qIdx] = {
        ...quarter,
        events: quarter.events.filter((_, idx) => idx !== eIdx),
      }
      return { ...prev, quarters: nextQuarters }
    })
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
      updateHero('showImage', true)
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'حدث خطأ أثناء رفع الصورة')
    } finally {
      setUploadingImage(false)
    }
  }

  function handleReset() {
    if (!defaultConfig) return
    if (confirm('هل ترغب حقاً في استعادة إعدادات البرنامج السنوي الافتراضية بالكامل؟')) {
      setConfig({ ...defaultConfig })
      setFeedback({
        type: 'success',
        message: 'تمت استعادة الإعدادات الافتراضية. اضغط على "حفظ إعدادات البرنامج السنوي" للتثبيت.',
      })
    }
  }

  async function handleSave() {
    setSaving(true)
    setFeedback(null)

    try {
      const res = await saveAnnualProgramConfiguration(config)
      if (!res.success) {
        throw new Error(res.error || 'فشل حفظ الإعدادات')
      }

      setFeedback({
        type: 'success',
        message: 'تم حفظ إعدادات وأجندة البرنامج السنوي 2026 بنجاح وتحديث الموقع مباشرة!',
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'تعذر حفظ الإعدادات'
      setFeedback({ type: 'error', message: msg })
    } finally {
      setSaving(false)
    }
  }

  const currentQuarter = config.quarters[activeQuarterIdx] || config.quarters[0]

  return (
    <div className="space-y-8">
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
            <span>{feedback.type === 'success' ? '✅' : '⚠️'}</span>
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      {/* Action Bar Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white border border-[#e5e0d6] shadow-subtle">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#231f20]/10 text-[#231f20] flex items-center justify-center text-2xl shrink-0">
            🗓️
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-[#231f20]">
              إدارة البرنامج والموسم الثقافي السنوي 2026
            </h2>
            <p className="text-3xs sm:text-xs text-[#5C5A55]">
              تخصيص الواجهة، المحاور الأربعة، الأجندة الفصلية (Q1-Q4)، ودليل البرنامج الرسمي.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            href="/ar/annual-program"
            target="_blank"
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#231f20] bg-[#FAF8F5] hover:bg-[#F4EFE6] border border-[#e5e0d6] transition-all flex items-center gap-1.5"
          >
            <span>معاينة المنشور</span>
            <span>↗</span>
          </Link>

          {defaultConfig && (
            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#5C5A55] hover:text-[#231f20] hover:bg-[#FAF8F5] border border-[#e5e0d6] transition-colors"
            >
              استعادة الافتراضي
            </button>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-[#231f20] text-white text-xs sm:text-sm font-bold hover:bg-[#d2a82b] active:scale-98 transition-all shadow-md disabled:opacity-50 cursor-pointer flex items-center gap-2"
          >
            {saving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>جارٍ الحفظ...</span>
              </>
            ) : (
              <>
                <span>💾</span>
                <span>حفظ إعدادات البرنامج السنوي</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#e5e0d6] pb-2 overflow-x-auto scrollbar-thin">
        <button
          type="button"
          onClick={() => setActiveTab('hero')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'hero'
              ? 'bg-[#231f20] text-white shadow-xs'
              : 'bg-white text-[#5C5A55] hover:bg-[#FAF8F5] border border-[#e5e0d6]'
          }`}
        >
          <span>🖼️</span>
          <span>واجهة ورأس البرنامج (Hero & Brochure)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('stats_pillars')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'stats_pillars'
              ? 'bg-[#231f20] text-white shadow-xs'
              : 'bg-white text-[#5C5A55] hover:bg-[#FAF8F5] border border-[#e5e0d6]'
          }`}
        >
          <span>📊</span>
          <span>مؤشرات الأثر والمحاور (Stats & Pillars)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('quarters')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'quarters'
              ? 'bg-[#231f20] text-white shadow-xs'
              : 'bg-white text-[#5C5A55] hover:bg-[#FAF8F5] border border-[#e5e0d6]'
          }`}
        >
          <span>🗓️</span>
          <span>الأجندة والمحطات الفصلية (Q1 — Q4)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('cta')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'cta'
              ? 'bg-[#231f20] text-white shadow-xs'
              : 'bg-white text-[#5C5A55] hover:bg-[#FAF8F5] border border-[#e5e0d6]'
          }`}
        >
          <span>📢</span>
          <span>قسم الدعوة واحتضان الفعاليات (CTA)</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: HERO BANNER & BROCHURE SETTINGS
          ========================================================================= */}
      {activeTab === 'hero' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e5e0d6] shadow-subtle space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#e5e0d6]">
            <div>
              <h3 className="text-sm font-black text-[#231f20] flex items-center gap-2">
                <span>رأس وواجهة البرنامج السنوي (Hero Section)</span>
              </h3>
              <p className="text-3xs sm:text-xs text-[#5C5A55]">
                تخصيص السنة، العناوين الثلاثية، الصورة البصرية، ورابط كتيب البرنامج (PDF).
              </p>
            </div>

            {/* Language Switcher */}
            <div className="flex gap-1.5 p-1 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6] self-start sm:self-auto">
              {(['ar', 'fr', 'en'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveLangTab(lang)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    activeLangTab === lang
                      ? 'bg-[#231f20] text-white shadow-xs'
                      : 'text-[#5C5A55] hover:bg-[#F4EFE6]'
                  }`}
                >
                  {lang === 'ar' ? 'العربية' : lang === 'fr' ? 'Français' : 'English'}
                </button>
              ))}
            </div>
          </div>

          {/* Year & Brochure Link Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6]">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#231f20]">
                السنة الثقافية المستهدفة (Season Year)
              </label>
              <input
                type="text"
                value={config.hero.year}
                onChange={(e) => updateHero('year', e.target.value)}
                placeholder="2026"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#e5e0d6] text-xs font-bold text-[#231f20] focus:outline-none focus:border-[#231f20]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#231f20]">
                رابط الدليل السنوي المطبوع أو الكتيب (PDF Brochure Link)
              </label>
              <input
                type="text"
                dir="ltr"
                value={config.hero.brochureUrl || ''}
                onChange={(e) => updateHero('brochureUrl', e.target.value)}
                placeholder="/uploads/amycc-annual-program-2026.pdf أو https://..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#e5e0d6] text-xs font-mono text-[#231f20] focus:outline-none focus:border-[#231f20] text-left"
              />
            </div>
          </div>

          {/* Hero Visual Image */}
          <div className="space-y-4 p-5 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6]">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-[#231f20]">
                صورة خلفية أو بصرية لقسم رأس البرنامج السنوي (Hero Visual Image)
              </label>
              <Link
                href="/ar/annual-program"
                target="_blank"
                className="text-xs font-bold text-[#231f20] hover:underline flex items-center gap-1"
              >
                <span>معاينة الصفحة المنشورة</span>
                <span>↗</span>
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
                  <span className="text-3xs mt-1">لا توجد صورة (نمط مغربي هادئ)</span>
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
                    {uploadingImage ? '⏳ جارٍ الرفع...' : '📁 رفع صورة للواجهة'}
                  </button>

                  {config.hero.imageUrl && (
                    <button
                      type="button"
                      onClick={() => updateHero('imageUrl', '')}
                      className="px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      حذف الصورة
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
                    <span className="font-bold text-[#231f20] block">تفعيل صورة الغلاف السينمائية للبرنامج السنوي</span>
                    <span className="text-[#5C5A55] block">إذا تم التعطيل، ستظهر واجهة البرنامج بنمط الزخرفة المغربية الأنيق.</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Live Interactive Simulation Preview */}
            <div className="pt-3 border-t border-[#e5e0d6] space-y-2">
              <span className="text-2xs font-bold text-[#5C5A55] block">معاينة حية لشكل رأس الصفحة (Live Preview):</span>
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
                    <span className="px-2.5 py-0.5 rounded-full text-3xs font-black bg-[#bd3227] text-white">
                      {config.hero.year}
                    </span>
                    <span
                      className={`px-3 py-0.5 rounded-full text-3xs font-bold ${
                        config.hero.showImage !== false && config.hero.imageUrl
                          ? 'bg-white/10 text-[#ffd22f] border border-white/20'
                          : 'bg-[#bd3227]/10 text-[#bd3227]'
                      }`}
                    >
                      {config.hero.tagAr}
                    </span>
                  </div>
                  <h3
                    className={`text-base sm:text-lg font-black leading-snug whitespace-pre-line ${
                      config.hero.showImage !== false && config.hero.imageUrl ? 'text-white' : 'text-[#231f20]'
                    }`}
                  >
                    {config.hero.titleAr}
                  </h3>
                  <p
                    className={`text-xs line-clamp-2 ${
                      config.hero.showImage !== false && config.hero.imageUrl ? 'text-[#E2DED6]/95' : 'text-[#5C5A55]'
                    }`}
                  >
                    {config.hero.descriptionAr}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Trilingual Inputs for Hero Texts */}
          <div className="space-y-4">
            {activeLangTab === 'ar' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#231f20]">
                      الوسم العلوي (EYEBROW TAG) — بالعربية
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={config.hero.tagAr}
                      onChange={(e) => updateHero('tagAr', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#e5e0d6] text-xs text-[#231f20] focus:outline-none focus:border-[#231f20]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#231f20]">
                      شارة الاعتماد (STATUTORY BADGE) — بالعربية
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={config.hero.badgeAr}
                      onChange={(e) => updateHero('badgeAr', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#e5e0d6] text-xs text-[#231f20] focus:outline-none focus:border-[#231f20]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#231f20]">
                    العنوان الرئيسي (HEADLINE TITLE) — بالعربية
                  </label>
                  <textarea
                    rows={2}
                    dir="rtl"
                    value={config.hero.titleAr}
                    onChange={(e) => updateHero('titleAr', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#e5e0d6] text-xs font-bold text-[#231f20] focus:outline-none focus:border-[#231f20]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#231f20]">
                    الوصف التقديمي (DESCRIPTION) — بالعربية
                  </label>
                  <textarea
                    rows={3}
                    dir="rtl"
                    value={config.hero.descriptionAr}
                    onChange={(e) => updateHero('descriptionAr', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#e5e0d6] text-xs text-[#231f20] focus:outline-none focus:border-[#231f20]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#231f20]">
                    نص زر تحميل الدليل (Brochure Button Text) — بالعربية
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={config.hero.brochureLabelAr || ''}
                    onChange={(e) => updateHero('brochureLabelAr', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#e5e0d6] text-xs text-[#231f20] focus:outline-none focus:border-[#231f20]"
                  />
                </div>
              </div>
            )}

            {activeLangTab === 'fr' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#231f20]">
                      Tag en Français
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={config.hero.tagFr ?? ''}
                      onChange={(e) => updateHero('tagFr', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#e5e0d6] text-xs text-[#231f20] focus:outline-none focus:border-[#231f20]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#231f20]">
                      Badge en Français
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={config.hero.badgeFr ?? ''}
                      onChange={(e) => updateHero('badgeFr', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#e5e0d6] text-xs text-[#231f20] focus:outline-none focus:border-[#231f20]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#231f20]">
                    Titre Principal en Français
                  </label>
                  <textarea
                    rows={2}
                    dir="ltr"
                    value={config.hero.titleFr ?? ''}
                    onChange={(e) => updateHero('titleFr', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#e5e0d6] text-xs font-bold text-[#231f20] focus:outline-none focus:border-[#231f20]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#231f20]">
                    Description en Français
                  </label>
                  <textarea
                    rows={3}
                    dir="ltr"
                    value={config.hero.descriptionFr ?? ''}
                    onChange={(e) => updateHero('descriptionFr', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#e5e0d6] text-xs text-[#231f20] focus:outline-none focus:border-[#231f20]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#231f20]">
                    Texte du bouton Brochure en Français
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={config.hero.brochureLabelFr || ''}
                    onChange={(e) => updateHero('brochureLabelFr', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#e5e0d6] text-xs text-[#231f20] focus:outline-none focus:border-[#231f20]"
                  />
                </div>
              </div>
            )}

            {activeLangTab === 'en' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#231f20]">
                      Tag in English
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={config.hero.tagEn ?? ''}
                      onChange={(e) => updateHero('tagEn', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#e5e0d6] text-xs text-[#231f20] focus:outline-none focus:border-[#231f20]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#231f20]">
                      Badge in English
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={config.hero.badgeEn ?? ''}
                      onChange={(e) => updateHero('badgeEn', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#e5e0d6] text-xs text-[#231f20] focus:outline-none focus:border-[#231f20]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#231f20]">
                    Headline Title in English
                  </label>
                  <textarea
                    rows={2}
                    dir="ltr"
                    value={config.hero.titleEn ?? ''}
                    onChange={(e) => updateHero('titleEn', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#e5e0d6] text-xs font-bold text-[#231f20] focus:outline-none focus:border-[#231f20]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#231f20]">
                    Description in English
                  </label>
                  <textarea
                    rows={3}
                    dir="ltr"
                    value={config.hero.descriptionEn ?? ''}
                    onChange={(e) => updateHero('descriptionEn', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#e5e0d6] text-xs text-[#231f20] focus:outline-none focus:border-[#231f20]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#231f20]">
                    Brochure Button Text in English
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={config.hero.brochureLabelEn || ''}
                    onChange={(e) => updateHero('brochureLabelEn', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#e5e0d6] text-xs text-[#231f20] focus:outline-none focus:border-[#231f20]"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: IMPACT STATS & STRATEGIC PILLARS
          ========================================================================= */}
      {activeTab === 'stats_pillars' && (
        <div className="space-y-8">
          {/* Stats Section */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e5e0d6] shadow-subtle space-y-6">
            <div>
              <h3 className="text-sm font-black text-[#231f20]">
                مؤشرات وأرقام الأثر السنوي (Annual Impact Figures)
              </h3>
              <p className="text-3xs sm:text-xs text-[#5C5A55]">
                البطاقات الأربعة العائمة في أعلى الصفحة مباشرة أسفل الواجهة.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {config.stats.map((st, idx) => (
                <div key={st.id} className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={st.icon}
                      onChange={(e) => updateStat(idx, 'icon', e.target.value)}
                      className="w-12 text-center py-1.5 rounded-lg bg-white border border-[#e5e0d6] text-lg"
                      title="الأيقونة أو الإيموجي"
                    />
                    <input
                      type="text"
                      value={st.value}
                      onChange={(e) => updateStat(idx, 'value', e.target.value)}
                      placeholder="4 أو +50"
                      className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-[#e5e0d6] text-sm font-black text-[#231f20]"
                    />
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <input
                      type="text"
                      dir="rtl"
                      value={st.labelAr}
                      onChange={(e) => updateStat(idx, 'labelAr', e.target.value)}
                      placeholder="التسمية بالعربية..."
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#e5e0d6] text-2xs"
                    />
                    <input
                      type="text"
                      dir="ltr"
                      value={st.labelFr ?? ''}
                      onChange={(e) => updateStat(idx, 'labelFr', e.target.value)}
                      placeholder="Label en Français..."
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#e5e0d6] text-2xs"
                    />
                    <input
                      type="text"
                      dir="ltr"
                      value={st.labelEn ?? ''}
                      onChange={(e) => updateStat(idx, 'labelEn', e.target.value)}
                      placeholder="Label in English..."
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#e5e0d6] text-2xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strategic Pillars Section */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e5e0d6] shadow-subtle space-y-6">
            <div>
              <h3 className="text-sm font-black text-[#231f20]">
                المحاور الاستراتيجية الأربعة للموسم (Strategic Thematic Pillars)
              </h3>
              <p className="text-3xs sm:text-xs text-[#5C5A55]">
                المحاور الفنية والتأطيرية الكبرى (فنون تشكيلية، مسرح، موسيقى تراثية، وتمكين الشباب).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {config.pillars.map((pillar, pIdx) => (
                <div key={pillar.id} className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={pillar.icon}
                      onChange={(e) => updatePillar(pIdx, 'icon', e.target.value)}
                      className="w-12 text-center py-2 rounded-xl bg-white border border-[#e5e0d6] text-xl"
                      title="الإيموجي"
                    />
                    <div className="flex-1">
                      <span className="text-3xs font-black uppercase tracking-wider text-[#bd3227] block">
                        المحور 0{pIdx + 1}
                      </span>
                      <input
                        type="text"
                        dir="rtl"
                        value={pillar.titleAr}
                        onChange={(e) => updatePillar(pIdx, 'titleAr', e.target.value)}
                        placeholder="عنوان المحور بالعربية"
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#e5e0d6] text-xs font-black text-[#231f20]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <textarea
                      rows={2}
                      dir="rtl"
                      value={pillar.descAr}
                      onChange={(e) => updatePillar(pIdx, 'descAr', e.target.value)}
                      placeholder="وصف المحور بالعربية..."
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#e5e0d6] text-xs"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        dir="ltr"
                        value={pillar.titleFr || ''}
                        onChange={(e) => updatePillar(pIdx, 'titleFr', e.target.value)}
                        placeholder="Titre en Français..."
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#e5e0d6] text-2xs"
                      />
                      <input
                        type="text"
                        dir="ltr"
                        value={pillar.titleEn || ''}
                        onChange={(e) => updatePillar(pIdx, 'titleEn', e.target.value)}
                        placeholder="Title in English..."
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#e5e0d6] text-2xs"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <textarea
                        rows={2}
                        dir="ltr"
                        value={pillar.descFr || ''}
                        onChange={(e) => updatePillar(pIdx, 'descFr', e.target.value)}
                        placeholder="Description en Français..."
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#e5e0d6] text-2xs"
                      />
                      <textarea
                        rows={2}
                        dir="ltr"
                        value={pillar.descEn || ''}
                        onChange={(e) => updatePillar(pIdx, 'descEn', e.target.value)}
                        placeholder="Description in English..."
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#e5e0d6] text-2xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: QUARTERLY ROADMAP (Q1 — Q4)
          ========================================================================= */}
      {activeTab === 'quarters' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e5e0d6] shadow-subtle space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#e5e0d6]">
            <div>
              <h3 className="text-sm font-black text-[#231f20]">
                الأجندة والبرمجة الفصلية (Quarterly Roadmap)
              </h3>
              <p className="text-3xs sm:text-xs text-[#5C5A55]">
                إدارة الأنشطة والفعاليات المبرمجة لكل ربع من أرباع السنة الأربعة.
              </p>
            </div>

            {/* Quarter Selector Tabs */}
            <div className="flex gap-1.5 p-1 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6] self-start sm:self-auto overflow-x-auto">
              {config.quarters.map((q, idx) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setActiveQuarterIdx(idx)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    activeQuarterIdx === idx
                      ? 'bg-[#231f20] text-white shadow-xs'
                      : 'text-[#5C5A55] hover:bg-[#F4EFE6]'
                  }`}
                >
                  <span>{q.icon || '📌'}</span>
                  <span>{q.quarterAr}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Current Quarter Details */}
          {currentQuarter && (
            <div className="space-y-6">
              {/* Quarter Info Box */}
              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="block text-2xs font-bold text-[#231f20]">
                      اسم الفصل بالعربية
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={currentQuarter.quarterAr}
                      onChange={(e) => updateQuarter(activeQuarterIdx, 'quarterAr', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#e5e0d6] text-xs font-bold text-[#231f20]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-2xs font-bold text-[#231f20]">
                      الفترة الزمنية بالعربية
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={currentQuarter.periodAr}
                      onChange={(e) => updateQuarter(activeQuarterIdx, 'periodAr', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#e5e0d6] text-xs text-[#231f20]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-2xs font-bold text-[#231f20]">
                      شارة الفصل بالعربية
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={currentQuarter.badgeAr}
                      onChange={(e) => updateQuarter(activeQuarterIdx, 'badgeAr', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#e5e0d6] text-xs text-[#231f20]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-2xs font-bold text-[#231f20]">
                      الإيموجي الممثل
                    </label>
                    <input
                      type="text"
                      value={currentQuarter.icon}
                      onChange={(e) => updateQuarter(activeQuarterIdx, 'icon', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#e5e0d6] text-center text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-2xs font-bold text-[#231f20]">
                    شعار وتوجه الفصل بالعربية (Theme Slogan)
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={currentQuarter.themeAr || ''}
                    onChange={(e) => updateQuarter(activeQuarterIdx, 'themeAr', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#e5e0d6] text-xs text-[#231f20]"
                  />
                </div>
              </div>

              {/* Events in Quarter */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-[#231f20] flex items-center gap-2">
                    <span>الأنشطة والفعاليات المبرمجة ({currentQuarter.events.length})</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => addQuarterEvent(activeQuarterIdx)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#231f20] text-white text-xs font-bold hover:bg-[#d2a82b] transition-all shadow-xs cursor-pointer"
                  >
                    <span>➕</span>
                    <span>إضافة نشاط لهذا الربع</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {currentQuarter.events.map((event, eIdx) => (
                    <div
                      key={event.id}
                      className="p-5 rounded-2xl bg-white border border-[#e5e0d6] shadow-2xs space-y-4 hover:border-[#231f20]/30 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E0D6]">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="w-6 h-6 rounded-full bg-[#231f20] text-white text-2xs font-black flex items-center justify-center">
                            {eIdx + 1}
                          </span>
                          <span className="text-xs font-bold text-[#231f20]">
                            {event.titleAr}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-1.5 text-2xs font-bold text-[#231f20] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={Boolean(event.highlight)}
                              onChange={(e) => updateQuarterEvent(activeQuarterIdx, eIdx, 'highlight', e.target.checked)}
                              className="w-3.5 h-3.5 rounded text-[#bd3227] focus:ring-[#bd3227]"
                            />
                            <span>★ محطة بارزة</span>
                          </label>

                          <select
                            value={event.status || 'upcoming'}
                            onChange={(e) => updateQuarterEvent(activeQuarterIdx, eIdx, 'status', e.target.value)}
                            className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#e5e0d6] text-2xs font-bold text-[#231f20]"
                          >
                            <option value="upcoming">مرتقبة (À venir)</option>
                            <option value="in_progress">جارية حالياً (En cours)</option>
                            <option value="completed">منجزة (Réalisée)</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => removeQuarterEvent(activeQuarterIdx, eIdx)}
                            className="text-xs text-rose-600 hover:text-rose-800 p-1"
                            title="حذف النشاط"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1">
                          <label className="block text-3xs font-bold text-[#5C5A55]">
                            عنوان الفعالية بالعربية
                          </label>
                          <input
                            type="text"
                            dir="rtl"
                            value={event.titleAr}
                            onChange={(e) => updateQuarterEvent(activeQuarterIdx, eIdx, 'titleAr', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#e5e0d6] text-xs font-bold text-[#231f20]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-3xs font-bold text-[#5C5A55]">
                            تصنيف الفعالية بالعربية
                          </label>
                          <input
                            type="text"
                            dir="rtl"
                            value={event.categoryAr}
                            onChange={(e) => updateQuarterEvent(activeQuarterIdx, eIdx, 'categoryAr', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#e5e0d6] text-xs text-[#231f20]"
                          />
                        </div>
                      </div>

                      <div className="space-y-1 text-xs">
                        <label className="block text-3xs font-bold text-[#5C5A55]">
                          وصف الفعالية بالعربية
                        </label>
                        <textarea
                          rows={2}
                          dir="rtl"
                          value={event.descAr}
                          onChange={(e) => updateQuarterEvent(activeQuarterIdx, eIdx, 'descAr', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#e5e0d6] text-xs text-[#231f20]"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1">
                          <label className="block text-3xs font-bold text-[#5C5A55]">
                            المكان أو الفضاء (Venue) بالعربية
                          </label>
                          <input
                            type="text"
                            dir="rtl"
                            value={event.venueAr || ''}
                            onChange={(e) => updateQuarterEvent(activeQuarterIdx, eIdx, 'venueAr', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#e5e0d6] text-xs text-[#231f20]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-3xs font-bold text-[#5C5A55]">
                            Titre en Français
                          </label>
                          <input
                            type="text"
                            dir="ltr"
                            value={event.titleFr || ''}
                            onChange={(e) => updateQuarterEvent(activeQuarterIdx, eIdx, 'titleFr', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#e5e0d6] text-xs text-[#231f20]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 4: CALL TO ACTION BANNER (CTA)
          ========================================================================= */}
      {activeTab === 'cta' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e5e0d6] shadow-subtle space-y-6">
          <div>
            <h3 className="text-sm font-black text-[#231f20]">
              قسم الدعوة واحتضان الفعاليات (Call To Action Banner)
            </h3>
            <p className="text-3xs sm:text-xs text-[#5C5A55]">
              البانر السفلي في نهاية الصفحة المخصص لدعوة المؤسسات والشباب لاحتضان والمشاركة في الفعاليات.
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#231f20]">
                  شارة البانر بالعربية (Badge)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={config.cta.badgeAr}
                  onChange={(e) => updateCta('badgeAr', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#e5e0d6] text-xs text-[#231f20]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#231f20]">
                  Badge en Français
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={config.cta.badgeFr || ''}
                  onChange={(e) => updateCta('badgeFr', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#e5e0d6] text-xs text-[#231f20]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#231f20]">
                العنوان الرئيسي للدعوة بالعربية
              </label>
              <input
                type="text"
                dir="rtl"
                value={config.cta.titleAr}
                onChange={(e) => updateCta('titleAr', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#e5e0d6] text-xs font-black text-[#231f20]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#231f20]">
                الوصف التوضيحي بالعربية
              </label>
              <textarea
                rows={2}
                dir="rtl"
                value={config.cta.descAr}
                onChange={(e) => updateCta('descAr', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#e5e0d6] text-xs text-[#231f20]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#e5e0d6]">
              {/* Primary Button */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] space-y-3">
                <span className="text-xs font-black text-[#231f20] block">الزر الأساسي (Primary Button)</span>
                <input
                  type="text"
                  dir="rtl"
                  value={config.cta.primaryBtnTextAr}
                  onChange={(e) => updateCta('primaryBtnTextAr', e.target.value)}
                  placeholder="النص بالعربية"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#e5e0d6] text-xs"
                />
                <input
                  type="text"
                  dir="ltr"
                  value={config.cta.primaryBtnUrl}
                  onChange={(e) => updateCta('primaryBtnUrl', e.target.value)}
                  placeholder="الرابط (/events)"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#e5e0d6] text-xs font-mono text-left"
                />
              </div>

              {/* Secondary Button */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] space-y-3">
                <span className="text-xs font-black text-[#231f20] block">الزر الثانوي (Secondary Button)</span>
                <input
                  type="text"
                  dir="rtl"
                  value={config.cta.secondaryBtnTextAr}
                  onChange={(e) => updateCta('secondaryBtnTextAr', e.target.value)}
                  placeholder="النص بالعربية"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#e5e0d6] text-xs"
                />
                <input
                  type="text"
                  dir="ltr"
                  value={config.cta.secondaryBtnUrl}
                  onChange={(e) => updateCta('secondaryBtnUrl', e.target.value)}
                  placeholder="الرابط (/membership)"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#e5e0d6] text-xs font-mono text-left"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

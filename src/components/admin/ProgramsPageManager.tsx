'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { ProgramsPageConfig, ProgramStatItem } from '@/lib/settings'
import { saveProgramsPageConfiguration } from '@/lib/actions/admin'

interface ProgramsPageManagerProps {
  initialConfig: ProgramsPageConfig
  defaultConfig?: ProgramsPageConfig
}

export function ProgramsPageManager({ initialConfig, defaultConfig }: ProgramsPageManagerProps) {
  const [config, setConfig] = useState<ProgramsPageConfig>(initialConfig)
  const [activeTab, setActiveTab] = useState<'hero' | 'stats' | 'cta'>('hero')
  const [activeLangTab, setActiveLangTab] = useState<'ar' | 'fr' | 'en'>('ar')
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

  function handleReset() {
    if (!defaultConfig) return
    if (confirm('هل ترغب حقاً في استعادة إعدادات صفحة البرامج الافتراضية؟')) {
      setConfig({ ...defaultConfig })
      setFeedback({
        type: 'success',
        message: 'تمت استعادة الإعدادات الافتراضية. اضغط على "حفظ إعدادات صفحة البرامج" للتثبيت.',
      })
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
              ? 'bg-[#0d3b43] text-white shadow-xs'
              : 'text-[#445457] hover:text-[#08242a] hover:bg-[#faf7f2]'
          }`}
        >
          <span>🖼️</span>
          <span>واجهة ورأس صفحة البرامج (Hero Banner)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('stats')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'stats'
              ? 'bg-[#c85a32] text-white shadow-xs'
              : 'text-[#445457] hover:text-[#08242a] hover:bg-[#faf7f2]'
          }`}
        >
          <span>📊</span>
          <span>أرقام ومؤشرات الأثر (Impact Stats)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('cta')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'cta'
              ? 'bg-[#99620b] text-white shadow-xs'
              : 'text-[#445457] hover:text-[#08242a] hover:bg-[#faf7f2]'
          }`}
        >
          <span>📢</span>
          <span>قسم الدعوة للمبادرة (CTA Banner)</span>
        </button>
      </div>

      {/* ============================================================
          TAB 1: HERO BANNER SETTINGS
          ============================================================ */}
      {activeTab === 'hero' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e5e0d6] shadow-subtle space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f0ebe1] pb-4">
            <div>
              <h2 className="text-xl font-black text-[#08242a] tracking-tight flex items-center gap-2">
                <span>🖼️</span>
                <span>رأس وواجهة صفحة البرامج (Hero Section)</span>
              </h2>
              <p className="text-xs text-[#5f7174] mt-1">
                تخصيص العناوين والوسوم التقديمية والصورة البارزة المعروضة في أعلى صفحة البرامج.
              </p>
            </div>

            <div className="flex gap-1.5 p-1 rounded-2xl bg-[#faf7f2] border border-[#e5e0d6] self-start sm:self-auto">
              {(['ar', 'fr', 'en'] as const).map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setActiveLangTab(loc)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeLangTab === loc
                      ? 'bg-[#0d3b43] text-white shadow-xs'
                      : 'text-[#445457] hover:bg-[#f4ede2]'
                  }`}
                >
                  {loc === 'ar' ? 'العربية' : loc === 'fr' ? 'Français' : 'English'}
                </button>
              ))}
            </div>
          </div>

          {/* Hero Visual Image */}
          <div className="space-y-4 p-5 rounded-2xl bg-[#faf7f2] border border-[#e5e0d6]">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-[#08242a]">
                صورة خلفية أو بصرية لقسم رأس الصفحة (Hero Visual Image)
              </label>
              <Link
                href="/ar/programs"
                target="_blank"
                className="text-xs font-bold text-[#0d3b43] hover:underline flex items-center gap-1"
              >
                <span>معاينة صفحة البرامج</span>
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
                <div className="w-48 h-28 rounded-xl border border-dashed border-[#cfc7b9] flex flex-col items-center justify-center text-[#819598] shrink-0 bg-white">
                  <span className="text-2xl">🖼️</span>
                  <span className="text-3xs mt-1">لا توجد صورة (نمط مغربي افتراضي)</span>
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
                    className="px-4 py-2 rounded-xl bg-[#0d3b43] text-white text-xs font-bold hover:bg-[#14505b] transition-all shadow-xs disabled:opacity-50 cursor-pointer"
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
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#e5e0d6] text-xs font-mono text-[#08242a] focus:outline-none focus:border-[#0d3b43] text-left"
                />

                <label className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-[#e5e0d6] cursor-pointer hover:bg-[#f5ede1] transition-colors">
                  <input
                    type="checkbox"
                    checked={config.hero.showImage !== false}
                    onChange={(e) => updateHero('showImage', e.target.checked)}
                    className="w-4 h-4 rounded text-[#0d3b43] focus:ring-[#0d3b43]"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-[#08242a] block">تفعيل صورة الغلاف على واجهة البرامج المنشورة</span>
                    <span className="text-[#819598] block">إذا تم التعطيل، ستظهر واجهة البرامج بنمط الزخرفة المغربية الأنيق.</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Live Interactive Simulation Preview */}
            <div className="pt-3 border-t border-[#e5e0d6] space-y-2">
              <span className="text-2xs font-bold text-[#819598] block">معاينة حية لشكل رأس الصفحة (Live Preview):</span>
              <div
                className={`relative rounded-2xl overflow-hidden p-6 text-center border transition-all ${
                  config.hero.showImage !== false && config.hero.imageUrl
                    ? 'bg-[#08242a] text-white border-[#0d3b43] min-h-[190px] flex flex-col justify-center items-center'
                    : 'bg-gradient-to-b from-[#faf7f2] via-[#f7f2e9] to-[#faf7f2] text-[#08242a] border-[#e5e0d6] min-h-[160px] flex flex-col justify-center items-center'
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
                    <div className="absolute inset-0 bg-gradient-to-b from-[#08242a]/90 via-[#08242a]/65 to-[#08242a]/95" />
                  </div>
                )}
                <div className="relative z-10 space-y-2 max-w-xl mx-auto">
                  <div className="flex items-center justify-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-3xs font-bold ${
                        config.hero.showImage !== false && config.hero.imageUrl
                          ? 'bg-white/10 text-[#f4ce83] border border-white/20'
                          : 'bg-[#c85a32]/10 text-[#c85a32]'
                      }`}
                    >
                      {config.hero.tagAr || 'بوابة البرامج والمشاريع الثقافية'}
                    </span>
                  </div>
                  <h3
                    className={`text-base sm:text-lg font-black leading-snug ${
                      config.hero.showImage !== false && config.hero.imageUrl ? 'text-white' : 'text-[#08242a]'
                    }`}
                  >
                    {config.hero.titleAr || 'عنوان رأس صفحة البرامج'}
                  </h3>
                  <p
                    className={`text-xs line-clamp-2 ${
                      config.hero.showImage !== false && config.hero.imageUrl ? 'text-[#d8f0f4]/95' : 'text-[#5f7174]'
                    }`}
                  >
                    {config.hero.descriptionAr || 'وصف رأس صفحة البرامج...'}
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
                    <label className="block text-2xs font-bold text-[#5f7174] uppercase tracking-wider mb-1">
                      الوسم العلوي (Eyebrow Tag)
                    </label>
                    <input
                      type="text"
                      value={config.hero.tagAr}
                      onChange={(e) => updateHero('tagAr', e.target.value)}
                      placeholder="بوابة البرامج والمشاريع الثقافية • AMYCC Programs"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-xs text-[#08242a] focus:bg-white focus:outline-none focus:border-[#0d3b43]"
                    />
                  </div>
                  <div>
                    <label className="block text-2xs font-bold text-[#5f7174] uppercase tracking-wider mb-1">
                      شارة الاعتماد (Statutory Badge)
                    </label>
                    <input
                      type="text"
                      value={config.hero.badgeAr}
                      onChange={(e) => updateHero('badgeAr', e.target.value)}
                      placeholder="المملكة المغربية • تمكين الشباب وصون التراث"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-xs text-[#08242a] focus:bg-white focus:outline-none focus:border-[#0d3b43]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-2xs font-bold text-[#5f7174] uppercase tracking-wider mb-1">
                    العنوان الرئيسي (Headline Title)
                  </label>
                  <textarea
                    rows={2}
                    value={config.hero.titleAr}
                    onChange={(e) => updateHero('titleAr', e.target.value)}
                    placeholder="برامجنا ومبادراتنا: فضاءات حية لاكتشاف المواهب وبناء الأثر الثقافي"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-xs text-[#08242a] focus:bg-white focus:outline-none focus:border-[#0d3b43]"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-[#5f7174] uppercase tracking-wider mb-1">
                    الفقرة التقديمية (Description)
                  </label>
                  <textarea
                    rows={3}
                    value={config.hero.descriptionAr}
                    onChange={(e) => updateHero('descriptionAr', e.target.value)}
                    placeholder="تضع جمعية روح الفنون والثقافة في صلب رسالتها..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-xs text-[#08242a] focus:bg-white focus:outline-none focus:border-[#0d3b43]"
                  />
                </div>
              </>
            )}

            {activeLangTab === 'fr' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-2xs font-bold text-[#5f7174] uppercase tracking-wider mb-1">
                      Tag Supérieur (Français)
                    </label>
                    <input
                      type="text"
                      value={config.hero.tagFr ?? ''}
                      onChange={(e) => updateHero('tagFr', e.target.value)}
                      placeholder="PROGRAMMES & INITIATIVES CULTURELLES"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-xs text-[#08242a] focus:bg-white focus:outline-none focus:border-[#0d3b43]"
                    />
                  </div>
                  <div>
                    <label className="block text-2xs font-bold text-[#5f7174] uppercase tracking-wider mb-1">
                      Badge (Français)
                    </label>
                    <input
                      type="text"
                      value={config.hero.badgeFr ?? ''}
                      onChange={(e) => updateHero('badgeFr', e.target.value)}
                      placeholder="Royaume du Maroc • Jeunesse & Patrimoine"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-xs text-[#08242a] focus:bg-white focus:outline-none focus:border-[#0d3b43]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-2xs font-bold text-[#5f7174] uppercase tracking-wider mb-1">
                    Titre Principal (Français)
                  </label>
                  <textarea
                    rows={2}
                    value={config.hero.titleFr ?? ''}
                    onChange={(e) => updateHero('titleFr', e.target.value)}
                    placeholder="Nos Programmes : Espaces Vivants..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-xs text-[#08242a] focus:bg-white focus:outline-none focus:border-[#0d3b43]"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-[#5f7174] uppercase tracking-wider mb-1">
                    Description (Français)
                  </label>
                  <textarea
                    rows={3}
                    value={config.hero.descriptionFr ?? ''}
                    onChange={(e) => updateHero('descriptionFr', e.target.value)}
                    placeholder="L'AMYCC conçoit et déploie des programmes pérennes..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-xs text-[#08242a] focus:bg-white focus:outline-none focus:border-[#0d3b43]"
                  />
                </div>
              </>
            )}

            {activeLangTab === 'en' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-2xs font-bold text-[#5f7174] uppercase tracking-wider mb-1">
                      Eyebrow Tag (English)
                    </label>
                    <input
                      type="text"
                      value={config.hero.tagEn ?? ''}
                      onChange={(e) => updateHero('tagEn', e.target.value)}
                      placeholder="CULTURAL PROGRAMS & INITIATIVES"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-xs text-[#08242a] focus:bg-white focus:outline-none focus:border-[#0d3b43]"
                    />
                  </div>
                  <div>
                    <label className="block text-2xs font-bold text-[#5f7174] uppercase tracking-wider mb-1">
                      Badge (English)
                    </label>
                    <input
                      type="text"
                      value={config.hero.badgeEn ?? ''}
                      onChange={(e) => updateHero('badgeEn', e.target.value)}
                      placeholder="Kingdom of Morocco • Youth & Heritage"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-xs text-[#08242a] focus:bg-white focus:outline-none focus:border-[#0d3b43]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-2xs font-bold text-[#5f7174] uppercase tracking-wider mb-1">
                    Headline Title (English)
                  </label>
                  <textarea
                    rows={2}
                    value={config.hero.titleEn ?? ''}
                    onChange={(e) => updateHero('titleEn', e.target.value)}
                    placeholder="Our Programs: Vibrant Spaces..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-xs text-[#08242a] focus:bg-white focus:outline-none focus:border-[#0d3b43]"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-[#5f7174] uppercase tracking-wider mb-1">
                    Description (English)
                  </label>
                  <textarea
                    rows={3}
                    value={config.hero.descriptionEn ?? ''}
                    onChange={(e) => updateHero('descriptionEn', e.target.value)}
                    placeholder="AMYCC designs and leads enduring cultural initiatives..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-xs text-[#08242a] focus:bg-white focus:outline-none focus:border-[#0d3b43]"
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
          <div className="border-b border-[#f0ebe1] pb-4">
            <h2 className="text-xl font-black text-[#08242a] tracking-tight flex items-center gap-2">
              <span>📊</span>
              <span>أرقام ومؤشرات أثر البرامج (Impact Stats Ribbon)</span>
            </h2>
            <p className="text-xs text-[#5f7174] mt-1">
              تظهر هذه الأرقام في شريط بارز أسفل رأس الصفحة لإبراز حجم المشاركة والانتشار الوطني للبرامج.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {config.stats.map((stat, idx) => (
              <div
                key={stat.id}
                className="p-5 rounded-2xl bg-[#faf7f2] border border-[#e5e0d6] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#c85a32]">
                    مؤشر #{idx + 1}
                  </span>
                  <input
                    type="text"
                    value={stat.icon}
                    onChange={(e) => updateStat(stat.id, { icon: e.target.value })}
                    className="w-10 h-10 text-center text-lg rounded-xl bg-white border border-[#e5e0d6]"
                    title="أيقونة أو إيموجي"
                  />
                </div>

                <div>
                  <label className="block text-3xs font-bold text-[#5f7174] uppercase mb-1">
                    القيمة الرقمية (الرقم أو النسبة، مثال: +1,500 أو 100%)
                  </label>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => updateStat(stat.id, { value: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#e5e0d6] text-xs font-bold text-[#08242a]"
                  />
                </div>

                <div>
                  <label className="block text-3xs font-bold text-[#5f7174] uppercase mb-1">
                    الوصف بالعربية *
                  </label>
                  <input
                    type="text"
                    value={stat.labelAr}
                    onChange={(e) => updateStat(stat.id, { labelAr: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#e5e0d6] text-xs text-[#08242a]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-3xs font-bold text-[#5f7174] uppercase mb-1">
                      الوصف بالفرنسية
                    </label>
                    <input
                      type="text"
                      value={stat.labelFr ?? ''}
                      onChange={(e) => updateStat(stat.id, { labelFr: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#e5e0d6] text-xs text-[#08242a]"
                    />
                  </div>
                  <div>
                    <label className="block text-3xs font-bold text-[#5f7174] uppercase mb-1">
                      الوصف بالإنجليزية
                    </label>
                    <input
                      type="text"
                      value={stat.labelEn ?? ''}
                      onChange={(e) => updateStat(stat.id, { labelEn: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#e5e0d6] text-xs text-[#08242a]"
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
          <div className="border-b border-[#f0ebe1] pb-4">
            <h2 className="text-xl font-black text-[#08242a] tracking-tight flex items-center gap-2">
              <span>📢</span>
              <span>شريط الدعوة لاقتراح المشاريع والانخراط (CTA Banner)</span>
            </h2>
            <p className="text-xs text-[#5f7174] mt-1">
              يظهر في نهاية صفحة البرامج لدعوة الزوار، الفنانين، والشباب للتواصل أو تقديم مقترحات برامج جديدة.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-2xs font-bold text-[#5f7174] uppercase tracking-wider mb-1">
                عنوان النداء بالعربية *
              </label>
              <input
                type="text"
                value={config.cta.titleAr}
                onChange={(e) => updateCta('titleAr', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-xs text-[#08242a] font-bold focus:bg-white focus:outline-none focus:border-[#0d3b43]"
              />
            </div>

            <div>
              <label className="block text-2xs font-bold text-[#5f7174] uppercase tracking-wider mb-1">
                نص التوضيح بالعربية *
              </label>
              <textarea
                rows={3}
                value={config.cta.descAr}
                onChange={(e) => updateCta('descAr', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-xs text-[#08242a] focus:bg-white focus:outline-none focus:border-[#0d3b43]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#faf7f2] border border-[#e5e0d6] space-y-3">
                <span className="text-xs font-bold text-[#0d3b43] block">الزر الأساسي (Primary CTA)</span>
                <div>
                  <label className="block text-3xs font-bold text-[#5f7174] uppercase mb-1">نص الزر بالعربية</label>
                  <input
                    type="text"
                    value={config.cta.primaryBtnTextAr}
                    onChange={(e) => updateCta('primaryBtnTextAr', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#e5e0d6] text-xs text-[#08242a]"
                  />
                </div>
                <div>
                  <label className="block text-3xs font-bold text-[#5f7174] uppercase mb-1">رابط الوجهة (URL)</label>
                  <input
                    type="text"
                    value={config.cta.primaryBtnUrl}
                    onChange={(e) => updateCta('primaryBtnUrl', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#e5e0d6] text-xs font-mono text-[#08242a]"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#faf7f2] border border-[#e5e0d6] space-y-3">
                <span className="text-xs font-bold text-[#c85a32] block">الزر الثانوي (Secondary CTA)</span>
                <div>
                  <label className="block text-3xs font-bold text-[#5f7174] uppercase mb-1">نص الزر بالعربية</label>
                  <input
                    type="text"
                    value={config.cta.secondaryBtnTextAr}
                    onChange={(e) => updateCta('secondaryBtnTextAr', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#e5e0d6] text-xs text-[#08242a]"
                  />
                </div>
                <div>
                  <label className="block text-3xs font-bold text-[#5f7174] uppercase mb-1">رابط الوجهة (URL)</label>
                  <input
                    type="text"
                    value={config.cta.secondaryBtnUrl}
                    onChange={(e) => updateCta('secondaryBtnUrl', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#e5e0d6] text-xs font-mono text-[#08242a]"
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
            href="/ar/programs"
            target="_blank"
            className="px-3.5 py-2 rounded-xl bg-[#faf7f2] hover:bg-[#f0ebe1] text-xs font-bold text-[#0d3b43] border border-[#e5e0d6] transition-colors"
          >
            معاينة صفحة البرامج ↗
          </Link>
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-[#819598] hover:text-[#c85a32] underline cursor-pointer"
          >
            استعادة الافتراضي
          </button>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0d3b43] hover:bg-[#08242a] text-white text-xs sm:text-sm font-black transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
        >
          <span>{saving ? '⏳' : '💾'}</span>
          <span>{saving ? 'جارٍ الحفظ...' : 'حفظ إعدادات صفحة البرامج'}</span>
        </button>
      </div>
    </div>
  )
}

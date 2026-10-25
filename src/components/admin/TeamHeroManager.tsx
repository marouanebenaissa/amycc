'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import type { TeamConfig, TeamHeroConfig } from '@/lib/settings'
import { saveTeamConfiguration } from '@/lib/actions/admin'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'

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
  const [hero, setHero] = useState<TeamHeroConfig>({
    ...defaultHero,
    ...(initialConfig.hero || {}),
  })
  const [activeLangTab, setActiveLangTab] = useState<'ar' | 'fr' | 'en'>('ar')
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
        throw new Error(data.error || 'تعذر رفع الصورة')
      }

      setHero((prev) => ({
        ...prev,
        imageUrl: data.url,
        showImage: true,
      }))
      setFeedback({
        type: 'success',
        message: 'تم رفع صورة الغلاف بنجاح! اضغط على "حفظ إعدادات الواجهة" لاعتمادها مباشرة.',
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'حدث خطأ أثناء رفع الصورة'
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
      message: 'تمت إزالة صورة الغلاف. اضغط على "حفظ إعدادات الواجهة" لتطبيق التغيير.',
    })
  }

  function handleResetToDefaults() {
    if (confirm('هل ترغب حقاً في استعادة النصوص وصورة الغلاف الافتراضية؟')) {
      setHero({ ...defaultHero })
      setFeedback({
        type: 'success',
        message: 'تمت استعادة الإعدادات الافتراضية. اضغط على "حفظ إعدادات الواجهة" لتثبيتها.',
      })
    }
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
        throw new Error(res.error || 'فشل حفظ الإعدادات')
      }

      setFeedback({
        type: 'success',
        message: 'تم حفظ صورة ونصوص واجهة صفحة الفريق بنجاح! تم تحديث الموقع مباشرة.',
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#f0ebe1]">
          <div>
            <h2 className="text-xl font-black text-[#08242a] tracking-tight flex items-center gap-2">
              <span>🖼️</span>
              <span>صورة واجهة صفحة الفريق (Hero Banner)</span>
            </h2>
            <p className="text-xs text-[#5f7174] mt-1">
              تحكم بالصورة الرئيسية التي تظهر في رأس صفحة فريق العمل والهيكلة (/[locale]/team).
            </p>
          </div>

          {/* Quick Action Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0d3b43] hover:bg-[#08242a] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <span>{uploading ? '⏳' : '📷'}</span>
              <span>{uploading ? 'جارٍ الرفع...' : 'رفع صورة من الجهاز'}</span>
            </button>

            {hero.imageUrl && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-all cursor-pointer"
              >
                🗑️ إزالة الصورة
              </button>
            )}

            <button
              type="button"
              onClick={handleResetToDefaults}
              className="px-3.5 py-2 rounded-xl bg-[#faf7f2] hover:bg-[#f0ebe1] text-[#445457] text-xs font-bold border border-[#e5e0d6] transition-all cursor-pointer"
            >
              ↺ استعادة الافتراضي
            </button>
          </div>
        </div>

        {/* Visibility Toggle & Image URL Input */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#faf7f2] border border-[#e5e0d6] cursor-pointer hover:bg-[#f5ede1] transition-colors">
            <input
              type="checkbox"
              checked={hero.showImage !== false}
              onChange={(e) => setHero((prev) => ({ ...prev, showImage: e.target.checked }))}
              className="w-4 h-4 rounded text-[#0d3b43] focus:ring-[#0d3b43]"
            />
            <div className="text-xs">
              <span className="font-bold text-[#08242a] block">تفعيل صورة الغلاف على الواجهة</span>
              <span className="text-[#819598] block">إذا تم التعطيل، ستظهر الواجهة بخلفية مغربية هادئة ونقية.</span>
            </div>
          </label>

          <div>
            <label className="block text-2xs font-bold text-[#5f7174] uppercase tracking-wider mb-1">
              أو رابط الصورة المباشر (Image URL)
            </label>
            <input
              type="text"
              value={hero.imageUrl || ''}
              onChange={(e) => setHero((prev) => ({ ...prev, imageUrl: e.target.value }))}
              placeholder="/images/youth-in-action.jpg أو رابط خارجي..."
              className="w-full px-3.5 py-2 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-xs text-[#08242a] focus:bg-white focus:outline-none focus:border-[#0d3b43]"
            />
          </div>
        </div>

        {/* Live Interactive Preview Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-2xs font-bold text-[#819598]">
            <span>معاينة حية لواجهة الصفحة (Live Simulation)</span>
            <div className="flex items-center gap-2">
              <Link
                href="/ar/team"
                target="_blank"
                className="text-[#0d3b43] hover:underline"
              >
                معاينة الصفحة المنشورة ↗
              </Link>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden min-h-[320px] sm:min-h-[380px] bg-[#08242a] text-white flex items-center justify-center border-2 border-[#cfc7b9] shadow-inner p-6 sm:p-10 text-center">
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
                  <div className="absolute inset-0 bg-gradient-to-b from-[#08242a]/95 via-[#08242a]/70 to-[#08242a]/95" />
                  <div className="absolute inset-0 moroccan-star-pattern opacity-15 pointer-events-none" />
                </div>
              </>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-b from-[#faf7f2] via-[#f5ede1] to-[#faf7f2] flex items-center justify-center">
                <div className="absolute inset-0 moroccan-pattern-light opacity-60" />
                <span className="text-xs text-[#819598] font-bold z-10">
                  (لا توجد صورة غلاف — سيتم عرض الخلفية الهادئة)
                </span>
              </div>
            )}

            {/* Overlaid Live Typography */}
            <div className={`relative z-10 max-w-2xl mx-auto space-y-4 ${hero.imageUrl && hero.showImage !== false ? 'text-white' : 'text-[#08242a]'}`}>
              {/* Badges preview */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className={`px-3 py-1 rounded-full text-3xs font-bold backdrop-blur-md border ${
                  hero.imageUrl && hero.showImage !== false
                    ? 'bg-white/15 border-white/25 text-white'
                    : 'bg-[#0d3b43]/10 border-[#0d3b43]/20 text-[#0d3b43]'
                }`}>
                  {hero.badge1Ar || defaultHero.badge1Ar}
                </span>
                <span className={`px-3 py-1 rounded-full text-3xs font-bold backdrop-blur-md border ${
                  hero.imageUrl && hero.showImage !== false
                    ? 'bg-white/15 border-white/25 text-[#f4ce83]'
                    : 'bg-[#d99b26]/10 border-[#d99b26]/20 text-[#99620b]'
                }`}>
                  {hero.badge2Ar || defaultHero.badge2Ar}
                </span>
              </div>

              {/* Title preview */}
              <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-snug whitespace-pre-line">
                {hero.titleAr || defaultHero.titleAr}
              </h3>

              {/* Description preview */}
              <p className={`text-xs sm:text-sm line-clamp-3 leading-relaxed max-w-xl mx-auto ${
                hero.imageUrl && hero.showImage !== false ? 'text-[#d8f0f4]/90' : 'text-[#445457]'
              }`}>
                {hero.descriptionAr || defaultHero.descriptionAr}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Trilingual Text Customization */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e5e0d6] shadow-subtle space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#f0ebe1]">
          <div>
            <h2 className="text-xl font-black text-[#08242a] tracking-tight flex items-center gap-2">
              <span>✍️</span>
              <span>نصوص وعناوين الواجهة (Trilingual Content)</span>
            </h2>
            <p className="text-xs text-[#5f7174] mt-1">
              تخصيص الشارات، العنوان العريض، والفقرة التقديمية في اللغات الثلاث.
            </p>
          </div>

          {/* Language Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#faf7f2] rounded-xl border border-[#e5e0d6]">
            <button
              type="button"
              onClick={() => setActiveLangTab('ar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                activeLangTab === 'ar'
                  ? 'bg-[#0d3b43] text-white shadow-xs'
                  : 'text-[#5f7174] hover:text-[#08242a]'
              }`}
            >
              العربية (AR)
            </button>
            <button
              type="button"
              onClick={() => setActiveLangTab('fr')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                activeLangTab === 'fr'
                  ? 'bg-[#0d3b43] text-white shadow-xs'
                  : 'text-[#5f7174] hover:text-[#08242a]'
              }`}
            >
              Français (FR)
            </button>
            <button
              type="button"
              onClick={() => setActiveLangTab('en')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                activeLangTab === 'en'
                  ? 'bg-[#0d3b43] text-white shadow-xs'
                  : 'text-[#5f7174] hover:text-[#08242a]'
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
                  <label className="block text-2xs font-bold text-[#5f7174] uppercase tracking-wider mb-1">
                    الشارة الأولى (Badge 1)
                  </label>
                  <input
                    type="text"
                    value={hero.badge1Ar ?? ''}
                    onChange={(e) => setHero((prev) => ({ ...prev, badge1Ar: e.target.value }))}
                    placeholder={defaultHero.badge1Ar}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-xs text-[#08242a] focus:bg-white focus:outline-none focus:border-[#0d3b43]"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-bold text-[#5f7174] uppercase tracking-wider mb-1">
                    الشارة الثانية (Badge 2)
                  </label>
                  <input
                    type="text"
                    value={hero.badge2Ar ?? ''}
                    onChange={(e) => setHero((prev) => ({ ...prev, badge2Ar: e.target.value }))}
                    placeholder={defaultHero.badge2Ar}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-xs text-[#08242a] focus:bg-white focus:outline-none focus:border-[#0d3b43]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-2xs font-bold text-[#5f7174] uppercase tracking-wider mb-1">
                  العنوان الرئيسي الكبير (Headline)
                </label>
                <textarea
                  rows={2}
                  value={hero.titleAr ?? ''}
                  onChange={(e) => setHero((prev) => ({ ...prev, titleAr: e.target.value }))}
                  placeholder={defaultHero.titleAr}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-xs text-[#08242a] focus:bg-white focus:outline-none focus:border-[#0d3b43]"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-[#5f7174] uppercase tracking-wider mb-1">
                  الفقرة التقديمية (Description)
                </label>
                <textarea
                  rows={3}
                  value={hero.descriptionAr ?? ''}
                  onChange={(e) => setHero((prev) => ({ ...prev, descriptionAr: e.target.value }))}
                  placeholder={defaultHero.descriptionAr}
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
                    Badge 1 (Français)
                  </label>
                  <input
                    type="text"
                    value={hero.badge1Fr ?? ''}
                    onChange={(e) => setHero((prev) => ({ ...prev, badge1Fr: e.target.value }))}
                    placeholder={defaultHero.badge1Fr}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-xs text-[#08242a] focus:bg-white focus:outline-none focus:border-[#0d3b43]"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-bold text-[#5f7174] uppercase tracking-wider mb-1">
                    Badge 2 (Français)
                  </label>
                  <input
                    type="text"
                    value={hero.badge2Fr ?? ''}
                    onChange={(e) => setHero((prev) => ({ ...prev, badge2Fr: e.target.value }))}
                    placeholder={defaultHero.badge2Fr}
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
                  value={hero.titleFr ?? ''}
                  onChange={(e) => setHero((prev) => ({ ...prev, titleFr: e.target.value }))}
                  placeholder={defaultHero.titleFr}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-xs text-[#08242a] focus:bg-white focus:outline-none focus:border-[#0d3b43]"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-[#5f7174] uppercase tracking-wider mb-1">
                  Description (Français)
                </label>
                <textarea
                  rows={3}
                  value={hero.descriptionFr ?? ''}
                  onChange={(e) => setHero((prev) => ({ ...prev, descriptionFr: e.target.value }))}
                  placeholder={defaultHero.descriptionFr}
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
                    Badge 1 (English)
                  </label>
                  <input
                    type="text"
                    value={hero.badge1En ?? ''}
                    onChange={(e) => setHero((prev) => ({ ...prev, badge1En: e.target.value }))}
                    placeholder={defaultHero.badge1En}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-xs text-[#08242a] focus:bg-white focus:outline-none focus:border-[#0d3b43]"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-bold text-[#5f7174] uppercase tracking-wider mb-1">
                    Badge 2 (English)
                  </label>
                  <input
                    type="text"
                    value={hero.badge2En ?? ''}
                    onChange={(e) => setHero((prev) => ({ ...prev, badge2En: e.target.value }))}
                    placeholder={defaultHero.badge2En}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-xs text-[#08242a] focus:bg-white focus:outline-none focus:border-[#0d3b43]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-2xs font-bold text-[#5f7174] uppercase tracking-wider mb-1">
                  Main Headline (English)
                </label>
                <textarea
                  rows={2}
                  value={hero.titleEn ?? ''}
                  onChange={(e) => setHero((prev) => ({ ...prev, titleEn: e.target.value }))}
                  placeholder={defaultHero.titleEn}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-xs text-[#08242a] focus:bg-white focus:outline-none focus:border-[#0d3b43]"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-[#5f7174] uppercase tracking-wider mb-1">
                  Narrative Description (English)
                </label>
                <textarea
                  rows={3}
                  value={hero.descriptionEn ?? ''}
                  onChange={(e) => setHero((prev) => ({ ...prev, descriptionEn: e.target.value }))}
                  placeholder={defaultHero.descriptionEn}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-xs text-[#08242a] focus:bg-white focus:outline-none focus:border-[#0d3b43]"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bottom Sticky Action Strip */}
      <div className="sticky bottom-4 z-20 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#e5e0d6] shadow-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-[#5f7174]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>تُطبَّق التغييرات فوراً على صفحة فريق العمل</span>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0d3b43] hover:bg-[#08242a] text-white text-xs sm:text-sm font-black transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
        >
          <span>{saving ? '⏳' : '💾'}</span>
          <span>{saving ? 'جارٍ الحفظ...' : 'حفظ إعدادات الواجهة'}</span>
        </button>
      </div>
    </div>
  )
}

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { defaultTopBarConfig, type TopBarConfig, defaultHeroConfig, type HeroConfig } from '@/lib/settings'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'

interface SiteSettingRow {
  key: string
  value: Record<string, unknown>
}

export default async function AdminSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const { data: settings } = await supabase.from('site_settings').select('*')
  const settingsMap: Record<string, unknown> = {}
  if (settings) {
    (settings as SiteSettingRow[]).forEach((s) => {
      settingsMap[s.key] = s.value
    })
  }

  async function handleSaveSettings(formData: FormData) {
    'use server'
    const sb = await createClient()
    const contactEmail = (formData.get('contactEmail') as string) || ''
    const contactPhone = (formData.get('contactPhone') as string) || ''
    const contactAddress = (formData.get('contactAddress') as string) || ''
    const facebookUrl = (formData.get('facebookUrl') as string) || ''
    const instagramUrl = (formData.get('instagramUrl') as string) || ''

    // Top Bar Settings
    const topBarEnabled = formData.get('topBarEnabled') === 'on'
    const topBarMessageAr = (formData.get('topBarMessageAr') as string) || ''
    const topBarMessageFr = (formData.get('topBarMessageFr') as string) || ''
    const topBarMessageEn = (formData.get('topBarMessageEn') as string) || ''
    const topBarLinkTextAr = (formData.get('topBarLinkTextAr') as string) || ''
    const topBarLinkTextFr = (formData.get('topBarLinkTextFr') as string) || ''
    const topBarLinkTextEn = (formData.get('topBarLinkTextEn') as string) || ''
    const topBarLinkUrl = (formData.get('topBarLinkUrl') as string) || ''
    const topBarContact = (formData.get('topBarContact') as string) || ''

    // Hero Section Settings (Morocco88 Full-Bleed Style)
    const heroImageUrl = (formData.get('heroImageUrl') as string) || ''
    const heroTagAr = (formData.get('heroTagAr') as string) || ''
    const heroTagFr = (formData.get('heroTagFr') as string) || ''
    const heroTagEn = (formData.get('heroTagEn') as string) || ''
    const heroTitleAr = (formData.get('heroTitleAr') as string) || ''
    const heroTitleFr = (formData.get('heroTitleFr') as string) || ''
    const heroTitleEn = (formData.get('heroTitleEn') as string) || ''
    const heroDescAr = (formData.get('heroDescAr') as string) || ''
    const heroDescFr = (formData.get('heroDescFr') as string) || ''
    const heroDescEn = (formData.get('heroDescEn') as string) || ''
    const heroCtaPrimaryTextAr = (formData.get('heroCtaPrimaryTextAr') as string) || ''
    const heroCtaPrimaryTextFr = (formData.get('heroCtaPrimaryTextFr') as string) || ''
    const heroCtaPrimaryTextEn = (formData.get('heroCtaPrimaryTextEn') as string) || ''
    const heroCtaPrimaryUrl = (formData.get('heroCtaPrimaryUrl') as string) || ''
    const heroCtaSecondaryTextAr = (formData.get('heroCtaSecondaryTextAr') as string) || ''
    const heroCtaSecondaryTextFr = (formData.get('heroCtaSecondaryTextFr') as string) || ''
    const heroCtaSecondaryTextEn = (formData.get('heroCtaSecondaryTextEn') as string) || ''
    const heroCtaSecondaryUrl = (formData.get('heroCtaSecondaryUrl') as string) || ''
    const heroBottomStripAr = (formData.get('heroBottomStripAr') as string) || ''
    const heroBottomStripFr = (formData.get('heroBottomStripFr') as string) || ''
    const heroBottomStripEn = (formData.get('heroBottomStripEn') as string) || ''

    await sb.from('site_settings').upsert([
      {
        key: 'contact_info',
        value: { email: contactEmail, phone: contactPhone, address: contactAddress },
      },
      {
        key: 'social_links',
        value: { facebook: facebookUrl, instagram: instagramUrl },
      },
      {
        key: 'top_bar',
        value: {
          enabled: topBarEnabled,
          messageAr: topBarMessageAr,
          messageFr: topBarMessageFr,
          messageEn: topBarMessageEn,
          linkTextAr: topBarLinkTextAr,
          linkTextFr: topBarLinkTextFr,
          linkTextEn: topBarLinkTextEn,
          linkUrl: topBarLinkUrl,
          contactEmail: topBarContact,
        },
      },
      {
        key: 'hero',
        value: {
          imageUrl: heroImageUrl,
          tagAr: heroTagAr,
          tagFr: heroTagFr,
          tagEn: heroTagEn,
          titleAr: heroTitleAr,
          titleFr: heroTitleFr,
          titleEn: heroTitleEn,
          descriptionAr: heroDescAr,
          descriptionFr: heroDescFr,
          descriptionEn: heroDescEn,
          ctaPrimaryTextAr: heroCtaPrimaryTextAr,
          ctaPrimaryTextFr: heroCtaPrimaryTextFr,
          ctaPrimaryTextEn: heroCtaPrimaryTextEn,
          ctaPrimaryUrl: heroCtaPrimaryUrl,
          ctaSecondaryTextAr: heroCtaSecondaryTextAr,
          ctaSecondaryTextFr: heroCtaSecondaryTextFr,
          ctaSecondaryTextEn: heroCtaSecondaryTextEn,
          ctaSecondaryUrl: heroCtaSecondaryUrl,
          bottomStripAr: heroBottomStripAr,
          bottomStripFr: heroBottomStripFr,
          bottomStripEn: heroBottomStripEn,
        },
      },
    ])

    revalidatePath('/admin/settings')
    revalidatePath('/', 'layout')
    revalidatePath('/[locale]', 'layout')
  }

  const contactVal = (settingsMap['contact_info'] as Record<string, string>) || {}
  const socialVal = (settingsMap['social_links'] as Record<string, string>) || {}
  const topBarVal = (settingsMap['top_bar'] as Partial<TopBarConfig>) || {}
  const isTopBarEnabled = typeof topBarVal.enabled === 'boolean' ? topBarVal.enabled : false
  const heroVal = (settingsMap['hero'] as Partial<HeroConfig>) || {}

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-[#08242a]">Platform & Site Settings</h1>
        <p className="text-xs text-[#5f7174] mt-1">
          إدارة إعدادات المنصة، الهوية المؤسسية، والتحكم الشامل في واجهة الاستقبال والشريط العلوي.
        </p>
      </div>

      {/* Organization Identity Overview */}
      <div className="bg-white p-8 rounded-2xl border border-[#e5e0d6] shadow-2xs space-y-6">
        <h2 className="text-sm font-bold text-[#08242a] uppercase tracking-wider">
          Official Identity & Charter Data
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-[#2d3b3e]">
          <div>
            <span className="block text-[#819598] font-bold text-3xs uppercase tracking-wider mb-1">Official Name (Arabic)</span>
            <span className="font-bold text-sm text-[#08242a]">جمعية روح الفنون والثقافة</span>
          </div>
          <div>
            <span className="block text-[#819598] font-bold text-3xs uppercase tracking-wider mb-1">Official Name (English)</span>
            <span className="font-bold text-sm text-[#08242a]">Spirit of Arts & Culture Association</span>
          </div>
          <div>
            <span className="block text-[#819598] font-bold text-3xs uppercase tracking-wider mb-1">Official Name (French)</span>
            <span className="font-bold text-sm text-[#08242a]">Association Esprit des Arts et de la Culture</span>
          </div>
          <div>
            <span className="block text-[#819598] font-bold text-3xs uppercase tracking-wider mb-1">Abbreviation & Scope</span>
            <span className="font-bold text-sm text-[#0d3b43]">AMYCC (Founded 2026, Morocco)</span>
          </div>
        </div>
      </div>

      <form action={handleSaveSettings} className="space-y-8">
        {/* ============================================================
            HERO SECTION CONTROL (Full-Bleed Morocco88 Style)
            ============================================================ */}
        <div className="bg-white p-8 rounded-2xl border border-[#e5e0d6] shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#f0ebe1]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🎬</span>
                <h2 className="text-sm font-bold text-[#08242a] uppercase tracking-wider">
                  واجهة الاستقبال الافتتاحية (Hero Section Showcase)
                </h2>
              </div>
              <p className="text-xs text-[#5f7174] mt-1">
                تخصيص صورة الخلفية السينمائية بكامل العرض، النصوص بثلاث لغات، وأزرار التوجيه (نمط Morocco88).
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-3xs font-black rounded-full bg-[#f4ce83]/20 text-[#855308] border border-[#f4ce83]/40">
              واجهة سينمائية تفاعلية
            </span>
          </div>

          {/* Background Image Input */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <label className="block text-2xs font-bold text-[#445457]">
                صورة الخلفية الرئيسية (Hero Background Image)
              </label>
              <span className="text-3xs text-[#819598]">
                يقبل روابط خارجية (HTTPS) أو مسارات محلية (/images/...)
              </span>
            </div>

            <div className="flex gap-2">
              <input
                name="heroImageUrl"
                id="heroImageUrlInput"
                type="text"
                defaultValue={heroVal.imageUrl || defaultHeroConfig.imageUrl}
                placeholder="/images/youth-in-action.jpg أو رابط صورة خارجي عالي الدقة"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#0d3b43] font-mono"
              />
            </div>

            {/* Current Image Visual Preview */}
            <div className="relative rounded-2xl overflow-hidden border border-[#e5e0d6] bg-[#08242a] aspect-[21/9] max-h-48 shadow-2xs">
              <ImageWithFallback
                src={heroVal.imageUrl || defaultHeroConfig.imageUrl}
                fallbackSrc="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80"
                alt="Current Hero Background Preview"
                fill
                className="object-cover object-center opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08242a]/95 via-[#08242a]/40 to-transparent flex items-end p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
                  <span className="text-3xs text-[#d8f0f4] font-medium bg-[#08242a]/80 px-2.5 py-1 rounded-md border border-white/10 w-fit">
                    معاينة الصورة المعتمدة حالياً
                  </span>
                  <span className="text-3xs font-mono text-[#f4ce83] truncate max-w-sm bg-black/40 px-2 py-0.5 rounded">
                    {heroVal.imageUrl || defaultHeroConfig.imageUrl}
                  </span>
                </div>
              </div>
            </div>

            {/* Practical Guide Tips */}
            <div className="p-3.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-3xs space-y-1.5 text-[#5f7174]">
              <div className="font-bold text-[#08242a] flex items-center gap-1.5">
                <span>💡 طرق استبدال الصورة:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 ps-1">
                <li>
                  <strong className="text-[#08242a]">رابط مباشر من الإنترنت (أسهل طريقة):</strong> انسخ رابط أي صورة عالية الدقة بصيغة JPG أو WebP (مثل صور Unsplash أو مواقع استضافة الصور) والصقه في الحقل أعلاه.
                </li>
                <li>
                  <strong className="text-[#08242a]">صورة داخل مجلد المشروع:</strong> ضع ملف صورتك في مجلد <code className="bg-white px-1 py-0.5 rounded border border-[#e5e0d6] text-[#0d3b43]">public/images/</code> واكتب مسارها هنا مثل: <code className="bg-white px-1 py-0.5 rounded border border-[#e5e0d6] text-[#0d3b43]">/images/my-photo.jpg</code>.
                </li>
                <li>
                  <strong className="text-[#08242a]">العودة للصورة الرسمية:</strong> اكتب <code className="bg-white px-1 py-0.5 rounded border border-[#e5e0d6] text-[#0d3b43]">/images/youth-in-action.jpg</code> لاستعادة صورة شباب في العمل الافتراضية.
                </li>
              </ul>
            </div>
          </div>

          {/* Eyebrow Tag (Golden Tag) */}
          <div className="space-y-4 pt-2 border-t border-[#f0ebe1]">
            <h3 className="text-2xs font-bold text-[#445457] uppercase tracking-wider">
              الشارة التمهيدية الذهبية (Eyebrow Tag — e.g. MUSIC FOR IMPACT)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-3xs font-bold text-[#5f7174] mb-1">بالعربية (AR)</label>
                <input
                  name="heroTagAr"
                  type="text"
                  defaultValue={heroVal.tagAr || defaultHeroConfig.tagAr}
                  placeholder="الفنون والثقافة للأثر والتمكين"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#0d3b43]"
                />
              </div>
              <div>
                <label className="block text-3xs font-bold text-[#5f7174] mb-1">بالفرنسية (FR)</label>
                <input
                  name="heroTagFr"
                  type="text"
                  defaultValue={heroVal.tagFr || defaultHeroConfig.tagFr}
                  placeholder="ARTS ET CULTURE POUR L'IMPACT"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#0d3b43]"
                />
              </div>
              <div>
                <label className="block text-3xs font-bold text-[#5f7174] mb-1">بالإنجليزية (EN)</label>
                <input
                  name="heroTagEn"
                  type="text"
                  defaultValue={heroVal.tagEn || defaultHeroConfig.tagEn}
                  placeholder="ARTS & CULTURE FOR IMPACT"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#0d3b43]"
                />
              </div>
            </div>
          </div>

          {/* Main Headline */}
          <div className="space-y-4 pt-2 border-t border-[#f0ebe1]">
            <h3 className="text-2xs font-bold text-[#445457] uppercase tracking-wider">
              العنوان الرئيسي الكبير (Grand Main Headline)
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-3xs font-bold text-[#5f7174] mb-1">العنوان بالعربية (يمكن استخدام سطر جديد)</label>
                <textarea
                  name="heroTitleAr"
                  rows={2}
                  defaultValue={heroVal.titleAr || defaultHeroConfig.titleAr}
                  placeholder="حيث يكتشف الشباب مواهبهم،&#10;ويقودون الإبداع الثقافي بالمغرب"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#0d3b43] font-arabic"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-3xs font-bold text-[#5f7174] mb-1">العنوان بالفرنسية (FR)</label>
                  <textarea
                    name="heroTitleFr"
                    rows={2}
                    defaultValue={heroVal.titleFr || defaultHeroConfig.titleFr}
                    placeholder="Où les jeunes découvrent leurs talents..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#0d3b43]"
                  />
                </div>
                <div>
                  <label className="block text-3xs font-bold text-[#5f7174] mb-1">العنوان بالإنجليزية (EN)</label>
                  <textarea
                    name="heroTitleEn"
                    rows={2}
                    defaultValue={heroVal.titleEn || defaultHeroConfig.titleEn}
                    placeholder="Where youth discover their talents..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#0d3b43]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Description Paragraph */}
          <div className="space-y-4 pt-2 border-t border-[#f0ebe1]">
            <h3 className="text-2xs font-bold text-[#445457] uppercase tracking-wider">
              النص التعريفي والمهمة (Mission & Story Description)
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-3xs font-bold text-[#5f7174] mb-1">النص بالعربية (AR)</label>
                <textarea
                  name="heroDescAr"
                  rows={3}
                  defaultValue={heroVal.descriptionAr || defaultHeroConfig.descriptionAr}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#0d3b43]"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-3xs font-bold text-[#5f7174] mb-1">النص بالفرنسية (FR)</label>
                  <textarea
                    name="heroDescFr"
                    rows={3}
                    defaultValue={heroVal.descriptionFr || defaultHeroConfig.descriptionFr}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#0d3b43]"
                  />
                </div>
                <div>
                  <label className="block text-3xs font-bold text-[#5f7174] mb-1">النص بالإنجليزية (EN)</label>
                  <textarea
                    name="heroDescEn"
                    rows={3}
                    defaultValue={heroVal.descriptionEn || defaultHeroConfig.descriptionEn}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#0d3b43]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-4 pt-2 border-t border-[#f0ebe1]">
            <h3 className="text-2xs font-bold text-[#445457] uppercase tracking-wider">
              أزرار الدعوة للعمل (CTA Buttons)
            </h3>
            {/* Primary Button */}
            <div className="bg-[#faf7f2] p-4 rounded-xl border border-[#ebe1d1] space-y-3">
              <span className="text-2xs font-black text-[#08242a] block">
                الزر الرئيسي (الزر الذهبي المدور — مثل See our impact)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-3xs font-bold text-[#5f7174] mb-1">نص الزر (عربي)</label>
                  <input
                    name="heroCtaPrimaryTextAr"
                    type="text"
                    defaultValue={heroVal.ctaPrimaryTextAr || defaultHeroConfig.ctaPrimaryTextAr}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#e5e0d6] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-3xs font-bold text-[#5f7174] mb-1">نص الزر (فرنسي)</label>
                  <input
                    name="heroCtaPrimaryTextFr"
                    type="text"
                    defaultValue={heroVal.ctaPrimaryTextFr || defaultHeroConfig.ctaPrimaryTextFr}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#e5e0d6] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-3xs font-bold text-[#5f7174] mb-1">نص الزر (إنجليزي)</label>
                  <input
                    name="heroCtaPrimaryTextEn"
                    type="text"
                    defaultValue={heroVal.ctaPrimaryTextEn || defaultHeroConfig.ctaPrimaryTextEn}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#e5e0d6] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-3xs font-bold text-[#5f7174] mb-1">الرابط الموجه</label>
                  <input
                    name="heroCtaPrimaryUrl"
                    type="text"
                    defaultValue={heroVal.ctaPrimaryUrl || defaultHeroConfig.ctaPrimaryUrl}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#e5e0d6] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Secondary Button */}
            <div className="bg-[#faf7f2] p-4 rounded-xl border border-[#ebe1d1] space-y-3">
              <span className="text-2xs font-black text-[#08242a] block">
                الزر الثانوي (الزر الشفاف بحدود بيضاء — مثل Partner with us)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-3xs font-bold text-[#5f7174] mb-1">نص الزر (عربي)</label>
                  <input
                    name="heroCtaSecondaryTextAr"
                    type="text"
                    defaultValue={heroVal.ctaSecondaryTextAr || defaultHeroConfig.ctaSecondaryTextAr}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#e5e0d6] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-3xs font-bold text-[#5f7174] mb-1">نص الزر (فرنسي)</label>
                  <input
                    name="heroCtaSecondaryTextFr"
                    type="text"
                    defaultValue={heroVal.ctaSecondaryTextFr || defaultHeroConfig.ctaSecondaryTextFr}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#e5e0d6] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-3xs font-bold text-[#5f7174] mb-1">نص الزر (إنجليزي)</label>
                  <input
                    name="heroCtaSecondaryTextEn"
                    type="text"
                    defaultValue={heroVal.ctaSecondaryTextEn || defaultHeroConfig.ctaSecondaryTextEn}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#e5e0d6] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-3xs font-bold text-[#5f7174] mb-1">الرابط الموجه</label>
                  <input
                    name="heroCtaSecondaryUrl"
                    type="text"
                    defaultValue={heroVal.ctaSecondaryUrl || defaultHeroConfig.ctaSecondaryUrl}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#e5e0d6] outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Sub-strip */}
          <div className="space-y-4 pt-2 border-t border-[#f0ebe1]">
            <h3 className="text-2xs font-bold text-[#445457] uppercase tracking-wider">
              الشريط السفلي للمصداقية (Bottom Institutional Sub-strip)
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-3xs font-bold text-[#5f7174] mb-1">النص بالعربية (AR)</label>
                <input
                  name="heroBottomStripAr"
                  type="text"
                  defaultValue={heroVal.bottomStripAr || defaultHeroConfig.bottomStripAr}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#0d3b43]"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-3xs font-bold text-[#5f7174] mb-1">النص بالفرنسية (FR)</label>
                  <input
                    name="heroBottomStripFr"
                    type="text"
                    defaultValue={heroVal.bottomStripFr || defaultHeroConfig.bottomStripFr}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#0d3b43]"
                  />
                </div>
                <div>
                  <label className="block text-3xs font-bold text-[#5f7174] mb-1">النص بالإنجليزية (EN)</label>
                  <input
                    name="heroBottomStripEn"
                    type="text"
                    defaultValue={heroVal.bottomStripEn || defaultHeroConfig.bottomStripEn}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#0d3b43]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Bar Notification & Institutional Banner Control */}
        <div className="bg-white p-8 rounded-2xl border border-[#e5e0d6] shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#f0ebe1]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base">📢</span>
                <h2 className="text-sm font-bold text-[#08242a] uppercase tracking-wider">
                  الشريط العلوي الترويجي للهيدر (Top Bar Control)
                </h2>
              </div>
              <p className="text-xs text-[#5f7174] mt-1">
                التحكم في إظهار أو إخفاء الشريط الترويجي المصغر الموجود أعلى الموقع مع تخصيص نصوصه وروابطه.
              </p>
            </div>

            <div>
              {isTopBarEnabled ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-3xs font-black rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  مفعل حالياً ويظهر في الموقع
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-3xs font-black rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200">
                  <span className="w-2 h-2 rounded-full bg-zinc-400" />
                  متوقف حالياً (مخفي من الموقع)
                </span>
              )}
            </div>
          </div>

          {/* Toggle Switch Card */}
          <div className="bg-[#faf7f2] p-5 rounded-xl border border-[#ebe1d1] flex items-center justify-between gap-4">
            <div className="space-y-1">
              <label htmlFor="topBarEnabled" className="text-xs font-bold text-[#08242a] cursor-pointer block">
                تفعيل وإظهار الشريط العلوي (Show Top Announcement Bar)
              </label>
              <p className="text-3xs text-[#5f7174]">
                إذا قمت بإلغاء التحديد، سيختفي الشريط فوراً من واجهة الموقع بالكامل لجميع الزوار.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                id="topBarEnabled"
                name="topBarEnabled"
                type="checkbox"
                defaultChecked={isTopBarEnabled}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#d1cdc7] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0d3b43]"></div>
            </label>
          </div>

          {/* Multilingual Announcement Messages */}
          <div className="space-y-4 pt-2">
            <h3 className="text-2xs font-bold text-[#445457] uppercase tracking-wider">
              نص الإعلان أو الرسالة المؤسسية (Announcement Text)
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-2xs font-bold text-[#445457] mb-1">
                  النص بالعربية (Arabic)
                </label>
                <input
                  name="topBarMessageAr"
                  type="text"
                  defaultValue={topBarVal.messageAr ?? defaultTopBarConfig.messageAr}
                  placeholder="المملكة المغربية • جمعية روح الفنون والثقافة (AMYCC)..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#0d3b43]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-2xs font-bold text-[#445457] mb-1">
                    النص بالفرنسية (French)
                  </label>
                  <input
                    name="topBarMessageFr"
                    type="text"
                    defaultValue={topBarVal.messageFr ?? defaultTopBarConfig.messageFr}
                    placeholder="Royaume du Maroc • Association Esprit des Arts..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#0d3b43]"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-bold text-[#445457] mb-1">
                    النص بالإنجليزية (English)
                  </label>
                  <input
                    name="topBarMessageEn"
                    type="text"
                    defaultValue={topBarVal.messageEn ?? defaultTopBarConfig.messageEn}
                    placeholder="Kingdom of Morocco • Spirit of Arts & Culture..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#0d3b43]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Link & Contact */}
          <div className="space-y-4 pt-2">
            <h3 className="text-2xs font-bold text-[#445457] uppercase tracking-wider">
              الرابط السريع وزر التوجيه (Action Link & Contact)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-2xs font-bold text-[#445457] mb-1">
                  نص الرابط (بالعربية)
                </label>
                <input
                  name="topBarLinkTextAr"
                  type="text"
                  defaultValue={topBarVal.linkTextAr ?? defaultTopBarConfig.linkTextAr}
                  placeholder="مبادرة شباب في العمل"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#0d3b43]"
                />
              </div>
              <div>
                <label className="block text-2xs font-bold text-[#445457] mb-1">
                  نص الرابط (بالفرنسية)
                </label>
                <input
                  name="topBarLinkTextFr"
                  type="text"
                  defaultValue={topBarVal.linkTextFr ?? defaultTopBarConfig.linkTextFr}
                  placeholder="Initiative Jeunesse en Action"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#0d3b43]"
                />
              </div>
              <div>
                <label className="block text-2xs font-bold text-[#445457] mb-1">
                  نص الرابط (بالإنجليزية)
                </label>
                <input
                  name="topBarLinkTextEn"
                  type="text"
                  defaultValue={topBarVal.linkTextEn ?? defaultTopBarConfig.linkTextEn}
                  placeholder="Youth in Action Initiative"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#0d3b43]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-2xs font-bold text-[#445457] mb-1">
                  وجهة الرابط (URL / Path)
                </label>
                <input
                  name="topBarLinkUrl"
                  type="text"
                  defaultValue={topBarVal.linkUrl ?? defaultTopBarConfig.linkUrl}
                  placeholder="/programs/youth-in-action"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#0d3b43]"
                />
              </div>
              <div>
                <label className="block text-2xs font-bold text-[#445457] mb-1">
                  بريد التواصل في الشريط (Contact Email)
                </label>
                <input
                  name="topBarContact"
                  type="email"
                  defaultValue={topBarVal.contactEmail ?? defaultTopBarConfig.contactEmail}
                  placeholder="contact@amycc.org"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#0d3b43]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Editable Contact & Social Information Form */}
        <div className="bg-white p-8 rounded-2xl border border-[#e5e0d6] shadow-2xs">
          <h2 className="text-sm font-bold text-[#08242a] mb-6 uppercase tracking-wider">
            Official Channels & Social Links
          </h2>

          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-2xs font-bold text-[#445457] mb-1">
                  Official Contact Email
                </label>
                <input
                  name="contactEmail"
                  type="email"
                  defaultValue={contactVal.email || 'contact@amycc.org'}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#0d3b43]"
                />
              </div>
              <div>
                <label className="block text-2xs font-bold text-[#445457] mb-1">
                  Official Telephone Number
                </label>
                <input
                  name="contactPhone"
                  type="tel"
                  defaultValue={contactVal.phone || '+212 500-000000'}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#0d3b43]"
                />
              </div>
            </div>

            <div>
              <label className="block text-2xs font-bold text-[#445457] mb-1">
                Registered Association Office / City
              </label>
              <input
                name="contactAddress"
                type="text"
                defaultValue={contactVal.address || 'Marrakech / مراكش، المملكة المغربية'}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#0d3b43]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-2xs font-bold text-[#445457] mb-1">
                  Facebook Page URL
                </label>
                <input
                  name="facebookUrl"
                  type="url"
                  defaultValue={socialVal.facebook || 'https://facebook.com/amycc'}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#0d3b43]"
                />
              </div>
              <div>
                <label className="block text-2xs font-bold text-[#445457] mb-1">
                  Instagram Profile URL
                </label>
                <input
                  name="instagramUrl"
                  type="url"
                  defaultValue={socialVal.instagram || 'https://instagram.com/amycc'}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#0d3b43]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Global Save Button */}
        <div className="sticky bottom-6 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-[#e5e0d6] shadow-card flex items-center justify-between gap-4">
          <p className="text-xs text-[#5f7174]">
            اضغط حفظ لتطبيق التغييرات على واجهة الاستقبال والشريط العلوي والإعدادات فوراً.
          </p>
          <button
            type="submit"
            className="px-6 py-2.5 text-xs font-bold text-white bg-[#0d3b43] hover:bg-[#14505b] active:scale-98 rounded-xl transition-all shadow-subtle hover:shadow-card cursor-pointer"
          >
            حفظ وتحديث الإعدادات (Save Platform Settings)
          </button>
        </div>
      </form>
    </div>
  )
}

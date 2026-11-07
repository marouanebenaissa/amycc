import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { getCurrentUserRole } from '@/lib/auth/server-rbac'
import {
  defaultTopBarConfig,
  type TopBarConfig,
  defaultHeroConfig,
  type HeroConfig,
  defaultFlagshipProgramConfig,
  type FlagshipProgramConfig,
  defaultContactConfig,
  type ContactConfig,
} from '@/lib/settings'
import { HeroImageUploader } from '@/components/admin/HeroImageUploader'
import { FlagshipImageUploader } from '@/components/admin/FlagshipImageUploader'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'

interface SiteSettingRow {
  key: string
  value: Record<string, unknown>
}

interface DbProgramRecord {
  id: string
  slug: string
  status: string
  program_translations?: {
    locale: string
    title: string
  }[]
}

export default async function AdminSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const userRole = await getCurrentUserRole(user.id)
  if (userRole.key !== 'super_admin') {
    redirect('/admin')
  }

  const [settingsRes, programsRes] = await Promise.all([
    supabase.from('site_settings').select('*'),
    supabase
      .from('programs')
      .select('id, slug, status, program_translations(locale, title)')
      .eq('status', 'published'),
  ])

  const settings = settingsRes.data
  const dbProgramsData = (programsRes.data || []) as unknown as DbProgramRecord[]

  const availablePrograms = dbProgramsData.map((p) => {
    const arTrans = p.program_translations?.find((t) => t.locale === 'ar')
    const fallbackTrans = p.program_translations?.[0]
    return {
      id: p.id,
      slug: p.slug,
      title: arTrans?.title || fallbackTrans?.title || p.slug,
    }
  })

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
    const linkedinUrl = (formData.get('linkedinUrl') as string) || ''
    const youtubeUrl = (formData.get('youtubeUrl') as string) || ''
    const twitterUrl = (formData.get('twitterUrl') as string) || ''
    const tiktokUrl = (formData.get('tiktokUrl') as string) || ''
    const whatsappUrl = (formData.get('whatsappUrl') as string) || ''

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

    // Flagship Program Settings (البرنامج الرائد ومبادرة الاستقطاب)
    const flagshipEnabled = formData.get('flagshipEnabled') === 'on'
    const flagshipProgramSlug = (formData.get('flagshipProgramSlug') as string) || defaultFlagshipProgramConfig.programSlug
    const flagshipBadgeAr = (formData.get('flagshipBadgeAr') as string) || ''
    const flagshipBadgeFr = (formData.get('flagshipBadgeFr') as string) || ''
    const flagshipBadgeEn = (formData.get('flagshipBadgeEn') as string) || ''
    const flagshipTitleAr = (formData.get('flagshipTitleAr') as string) || ''
    const flagshipTitleFr = (formData.get('flagshipTitleFr') as string) || ''
    const flagshipTitleEn = (formData.get('flagshipTitleEn') as string) || ''
    const flagshipDescAr = (formData.get('flagshipDescAr') as string) || ''
    const flagshipDescFr = (formData.get('flagshipDescFr') as string) || ''
    const flagshipDescEn = (formData.get('flagshipDescEn') as string) || ''
    const flagshipImageUrl = (formData.get('flagshipImageUrl') as string) || ''
    const flagshipImageCaptionAr = (formData.get('flagshipImageCaptionAr') as string) || ''
    const flagshipImageCaptionFr = (formData.get('flagshipImageCaptionFr') as string) || ''
    const flagshipImageCaptionEn = (formData.get('flagshipImageCaptionEn') as string) || ''
    const flagshipImageSubcaption = (formData.get('flagshipImageSubcaption') as string) || ''

    const step1TitleAr = (formData.get('step1TitleAr') as string) || ''
    const step1TitleFr = (formData.get('step1TitleFr') as string) || ''
    const step1TitleEn = (formData.get('step1TitleEn') as string) || ''
    const step1DescAr = (formData.get('step1DescAr') as string) || ''
    const step1DescFr = (formData.get('step1DescFr') as string) || ''
    const step1DescEn = (formData.get('step1DescEn') as string) || ''

    const step2TitleAr = (formData.get('step2TitleAr') as string) || ''
    const step2TitleFr = (formData.get('step2TitleFr') as string) || ''
    const step2TitleEn = (formData.get('step2TitleEn') as string) || ''
    const step2DescAr = (formData.get('step2DescAr') as string) || ''
    const step2DescFr = (formData.get('step2DescFr') as string) || ''
    const step2DescEn = (formData.get('step2DescEn') as string) || ''

    const step3TitleAr = (formData.get('step3TitleAr') as string) || ''
    const step3TitleFr = (formData.get('step3TitleFr') as string) || ''
    const step3TitleEn = (formData.get('step3TitleEn') as string) || ''
    const step3DescAr = (formData.get('step3DescAr') as string) || ''
    const step3DescFr = (formData.get('step3DescFr') as string) || ''
    const step3DescEn = (formData.get('step3DescEn') as string) || ''

    const step4TitleAr = (formData.get('step4TitleAr') as string) || ''
    const step4TitleFr = (formData.get('step4TitleFr') as string) || ''
    const step4TitleEn = (formData.get('step4TitleEn') as string) || ''
    const step4DescAr = (formData.get('step4DescAr') as string) || ''
    const step4DescFr = (formData.get('step4DescFr') as string) || ''
    const step4DescEn = (formData.get('step4DescEn') as string) || ''

    const flagshipCtaPrimaryTextAr = (formData.get('flagshipCtaPrimaryTextAr') as string) || ''
    const flagshipCtaPrimaryTextFr = (formData.get('flagshipCtaPrimaryTextFr') as string) || ''
    const flagshipCtaPrimaryTextEn = (formData.get('flagshipCtaPrimaryTextEn') as string) || ''
    const flagshipCtaPrimaryUrl = (formData.get('flagshipCtaPrimaryUrl') as string) || ''

    const flagshipCtaSecondaryTextAr = (formData.get('flagshipCtaSecondaryTextAr') as string) || ''
    const flagshipCtaSecondaryTextFr = (formData.get('flagshipCtaSecondaryTextFr') as string) || ''
    const flagshipCtaSecondaryTextEn = (formData.get('flagshipCtaSecondaryTextEn') as string) || ''
    const flagshipCtaSecondaryUrl = (formData.get('flagshipCtaSecondaryUrl') as string) || ''

    // Fetch existing contact config to keep contact and contact_info synchronized
    const { data: existingContactRes } = await sb
      .from('site_settings')
      .select('value')
      .eq('key', 'contact')
      .maybeSingle()

    const rawContact = (existingContactRes?.value as ContactConfig) || defaultContactConfig
    const updatedContactConfig: ContactConfig = {
      ...rawContact,
      channels: {
        ...(rawContact.channels || defaultContactConfig.channels),
        primaryEmail: contactEmail || rawContact.channels?.primaryEmail || 'contact@amycc.org',
        phone: contactPhone || rawContact.channels?.phone || '+212 5 24 00 00 00',
        addressAr: contactAddress || rawContact.channels?.addressAr || 'شارع محمد السادس، جليز، مراكش، المملكة المغربية',
      },
      social: {
        ...(rawContact.social || defaultContactConfig.social),
        facebook: facebookUrl || rawContact.social?.facebook,
        instagram: instagramUrl || rawContact.social?.instagram,
        linkedin: linkedinUrl || rawContact.social?.linkedin,
        youtube: youtubeUrl || rawContact.social?.youtube,
        twitter: twitterUrl || rawContact.social?.twitter,
        tiktok: tiktokUrl || rawContact.social?.tiktok,
        whatsapp: whatsappUrl || rawContact.social?.whatsapp,
      },
    }

    await sb.from('site_settings').upsert([
      {
        key: 'contact',
        value: updatedContactConfig,
      },
      {
        key: 'contact_info',
        value: { email: contactEmail, phone: contactPhone, address: contactAddress },
      },
      {
        key: 'social_links',
        value: {
          facebook: facebookUrl,
          instagram: instagramUrl,
          linkedin: linkedinUrl,
          youtube: youtubeUrl,
          twitter: twitterUrl,
          tiktok: tiktokUrl,
          whatsapp: whatsappUrl,
        },
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
      {
        key: 'flagship_program',
        value: {
          enabled: flagshipEnabled,
          programSlug: flagshipProgramSlug,
          badgeAr: flagshipBadgeAr,
          badgeFr: flagshipBadgeFr,
          badgeEn: flagshipBadgeEn,
          titleAr: flagshipTitleAr,
          titleFr: flagshipTitleFr,
          titleEn: flagshipTitleEn,
          descriptionAr: flagshipDescAr,
          descriptionFr: flagshipDescFr,
          descriptionEn: flagshipDescEn,
          imageUrl: flagshipImageUrl,
          imageCaptionAr: flagshipImageCaptionAr,
          imageCaptionFr: flagshipImageCaptionFr,
          imageCaptionEn: flagshipImageCaptionEn,
          imageSubcaption: flagshipImageSubcaption,

          step1TitleAr,
          step1TitleFr,
          step1TitleEn,
          step1DescAr,
          step1DescFr,
          step1DescEn,

          step2TitleAr,
          step2TitleFr,
          step2TitleEn,
          step2DescAr,
          step2DescFr,
          step2DescEn,

          step3TitleAr,
          step3TitleFr,
          step3TitleEn,
          step3DescAr,
          step3DescFr,
          step3DescEn,

          step4TitleAr,
          step4TitleFr,
          step4TitleEn,
          step4DescAr,
          step4DescFr,
          step4DescEn,

          ctaPrimaryTextAr: flagshipCtaPrimaryTextAr,
          ctaPrimaryTextFr: flagshipCtaPrimaryTextFr,
          ctaPrimaryTextEn: flagshipCtaPrimaryTextEn,
          ctaPrimaryUrl: flagshipCtaPrimaryUrl,

          ctaSecondaryTextAr: flagshipCtaSecondaryTextAr,
          ctaSecondaryTextFr: flagshipCtaSecondaryTextFr,
          ctaSecondaryTextEn: flagshipCtaSecondaryTextEn,
          ctaSecondaryUrl: flagshipCtaSecondaryUrl,
        },
      },
    ])

    revalidatePath('/admin/settings')
    revalidatePath('/admin/contacts')
    revalidatePath('/[locale]/contact')
    revalidatePath('/', 'layout')
    revalidatePath('/[locale]', 'layout')
  }

  const contactVal = (settingsMap['contact_info'] as Record<string, string>) || {}
  const rawContactSetting = (settingsMap['contact'] as ContactConfig) || defaultContactConfig
  const effectiveEmail = contactVal.email || rawContactSetting.channels?.primaryEmail || 'contact@amycc.org'
  const effectivePhone = contactVal.phone || rawContactSetting.channels?.phone || '+212 5 24 00 00 00'
  const effectiveAddress = contactVal.address || rawContactSetting.channels?.addressAr || 'Marrakech / مراكش، المملكة المغربية'
  const socialVal = (settingsMap['social_links'] as Record<string, string>) || {}
  const effectiveSocial = {
    ...defaultContactConfig.social,
    ...(rawContactSetting.social || {}),
    ...socialVal,
  }
  const topBarVal = (settingsMap['top_bar'] as Partial<TopBarConfig>) || {}
  const isTopBarEnabled = typeof topBarVal.enabled === 'boolean' ? topBarVal.enabled : false
  const heroVal = (settingsMap['hero'] as Partial<HeroConfig>) || {}
  const flagshipVal = (settingsMap['flagship_program'] as Partial<FlagshipProgramConfig>) || {}
  const isFlagshipEnabled = typeof flagshipVal.enabled === 'boolean' ? flagshipVal.enabled : defaultFlagshipProgramConfig.enabled

  return (
    <div className="space-y-8 max-w-4xl">
      <AdminPageHeader
        title={{
          ar: 'إعدادات المنصة والموقع العام',
          fr: 'Paramètres Généraux de la Plateforme',
          en: 'Platform & Site Settings',
        }}
        subtitle={{
          ar: 'إدارة إعدادات المنصة، الهوية المؤسسية، والتحكم الشامل في واجهة الاستقبال والشريط العلوي.',
          fr: 'Gestion de la plateforme, de l\'identité institutionnelle, du bandeau et de la section Hero.',
          en: 'Manage platform settings, institutional identity, top notification bar, and hero showcase.',
        }}
      />

      {/* Organization Identity Overview */}
      <div className="bg-white p-8 rounded-2xl border border-[#e5e0d6] shadow-2xs space-y-6">
        <h2 className="text-sm font-bold text-[#231f20] uppercase tracking-wider">
          Official Identity & Charter Data
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-[#231f20]">
          <div>
            <span className="block text-[#5C5A55] font-bold text-3xs uppercase tracking-wider mb-1">Official Name (Arabic)</span>
            <span className="font-bold text-sm text-[#231f20]">جمعية روح الفنون والثقافة</span>
          </div>
          <div>
            <span className="block text-[#5C5A55] font-bold text-3xs uppercase tracking-wider mb-1">Official Name (English)</span>
            <span className="font-bold text-sm text-[#231f20]">Spirit of Arts & Culture Association</span>
          </div>
          <div>
            <span className="block text-[#5C5A55] font-bold text-3xs uppercase tracking-wider mb-1">Official Name (French)</span>
            <span className="font-bold text-sm text-[#231f20]">Association Esprit des Arts et de la Culture</span>
          </div>
          <div>
            <span className="block text-[#5C5A55] font-bold text-3xs uppercase tracking-wider mb-1">Abbreviation & Scope</span>
            <span className="font-bold text-sm text-[#231f20]">AMYCC (Founded 2026, Morocco)</span>
          </div>
        </div>
      </div>

      <form action={handleSaveSettings} className="space-y-8">
        {/* ============================================================
            HERO SECTION CONTROL (Full-Bleed Morocco88 Style)
            ============================================================ */}
        <div className="bg-white p-8 rounded-2xl border border-[#e5e0d6] shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5E0D6]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🎬</span>
                <h2 className="text-sm font-bold text-[#231f20] uppercase tracking-wider">
                  واجهة الاستقبال الافتتاحية (Hero Section Showcase)
                </h2>
              </div>
              <p className="text-xs text-[#5C5A55] mt-1">
                تخصيص صورة الخلفية السينمائية بكامل العرض، النصوص بثلاث لغات، وأزرار التوجيه (نمط Morocco88).
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-3xs font-black rounded-full bg-[#ffd22f]/20 text-[#8c6c16] border border-[#ffd22f]/40">
              واجهة سينمائية تفاعلية
            </span>
          </div>

          {/* Background Image Uploader with Import Button & Live Preview */}
          <HeroImageUploader
            initialImageUrl={heroVal.imageUrl}
            defaultImageUrl={defaultHeroConfig.imageUrl || '/images/youth-in-action.jpg'}
          />

          {/* Eyebrow Tag (Golden Tag) */}
          <div className="space-y-4 pt-2 border-t border-[#E5E0D6]">
            <h3 className="text-2xs font-bold text-[#5C5A55] uppercase tracking-wider">
              الشارة التمهيدية الذهبية (Eyebrow Tag — e.g. MUSIC FOR IMPACT)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-3xs font-bold text-[#5C5A55] mb-1">بالعربية (AR)</label>
                <input
                  name="heroTagAr"
                  type="text"
                  defaultValue={heroVal.tagAr || defaultHeroConfig.tagAr}
                  placeholder="الفنون والثقافة للأثر والتمكين"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20]"
                />
              </div>
              <div>
                <label className="block text-3xs font-bold text-[#5C5A55] mb-1">بالفرنسية (FR)</label>
                <input
                  name="heroTagFr"
                  type="text"
                  defaultValue={heroVal.tagFr || defaultHeroConfig.tagFr}
                  placeholder="ARTS ET CULTURE POUR L'IMPACT"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20]"
                />
              </div>
              <div>
                <label className="block text-3xs font-bold text-[#5C5A55] mb-1">بالإنجليزية (EN)</label>
                <input
                  name="heroTagEn"
                  type="text"
                  defaultValue={heroVal.tagEn || defaultHeroConfig.tagEn}
                  placeholder="ARTS & CULTURE FOR IMPACT"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20]"
                />
              </div>
            </div>
          </div>

          {/* Main Headline */}
          <div className="space-y-4 pt-2 border-t border-[#E5E0D6]">
            <h3 className="text-2xs font-bold text-[#5C5A55] uppercase tracking-wider">
              العنوان الرئيسي الكبير (Grand Main Headline)
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-3xs font-bold text-[#5C5A55] mb-1">العنوان بالعربية (يمكن استخدام سطر جديد)</label>
                <textarea
                  name="heroTitleAr"
                  rows={2}
                  defaultValue={heroVal.titleAr || defaultHeroConfig.titleAr}
                  placeholder="حيث يكتشف الشباب مواهبهم،&#10;ويقودون الإبداع الثقافي بالمغرب"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20] font-arabic"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-3xs font-bold text-[#5C5A55] mb-1">العنوان بالفرنسية (FR)</label>
                  <textarea
                    name="heroTitleFr"
                    rows={2}
                    defaultValue={heroVal.titleFr || defaultHeroConfig.titleFr}
                    placeholder="Où les jeunes découvrent leurs talents..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20]"
                  />
                </div>
                <div>
                  <label className="block text-3xs font-bold text-[#5C5A55] mb-1">العنوان بالإنجليزية (EN)</label>
                  <textarea
                    name="heroTitleEn"
                    rows={2}
                    defaultValue={heroVal.titleEn || defaultHeroConfig.titleEn}
                    placeholder="Where youth discover their talents..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Description Paragraph */}
          <div className="space-y-4 pt-2 border-t border-[#E5E0D6]">
            <h3 className="text-2xs font-bold text-[#5C5A55] uppercase tracking-wider">
              النص التعريفي والمهمة (Mission & Story Description)
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-3xs font-bold text-[#5C5A55] mb-1">النص بالعربية (AR)</label>
                <textarea
                  name="heroDescAr"
                  rows={3}
                  defaultValue={heroVal.descriptionAr || defaultHeroConfig.descriptionAr}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20]"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-3xs font-bold text-[#5C5A55] mb-1">النص بالفرنسية (FR)</label>
                  <textarea
                    name="heroDescFr"
                    rows={3}
                    defaultValue={heroVal.descriptionFr || defaultHeroConfig.descriptionFr}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20]"
                  />
                </div>
                <div>
                  <label className="block text-3xs font-bold text-[#5C5A55] mb-1">النص بالإنجليزية (EN)</label>
                  <textarea
                    name="heroDescEn"
                    rows={3}
                    defaultValue={heroVal.descriptionEn || defaultHeroConfig.descriptionEn}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-4 pt-2 border-t border-[#E5E0D6]">
            <h3 className="text-2xs font-bold text-[#5C5A55] uppercase tracking-wider">
              أزرار الدعوة للعمل (CTA Buttons)
            </h3>
            {/* Primary Button */}
            <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E5E0D6] space-y-3">
              <span className="text-2xs font-black text-[#231f20] block">
                الزر الرئيسي (الزر الذهبي المدور — مثل See our impact)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-3xs font-bold text-[#5C5A55] mb-1">نص الزر (عربي)</label>
                  <input
                    name="heroCtaPrimaryTextAr"
                    type="text"
                    defaultValue={heroVal.ctaPrimaryTextAr || defaultHeroConfig.ctaPrimaryTextAr}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#e5e0d6] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-3xs font-bold text-[#5C5A55] mb-1">نص الزر (فرنسي)</label>
                  <input
                    name="heroCtaPrimaryTextFr"
                    type="text"
                    defaultValue={heroVal.ctaPrimaryTextFr || defaultHeroConfig.ctaPrimaryTextFr}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#e5e0d6] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-3xs font-bold text-[#5C5A55] mb-1">نص الزر (إنجليزي)</label>
                  <input
                    name="heroCtaPrimaryTextEn"
                    type="text"
                    defaultValue={heroVal.ctaPrimaryTextEn || defaultHeroConfig.ctaPrimaryTextEn}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#e5e0d6] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-3xs font-bold text-[#5C5A55] mb-1">الرابط الموجه</label>
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
            <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E5E0D6] space-y-3">
              <span className="text-2xs font-black text-[#231f20] block">
                الزر الثانوي (الزر الشفاف بحدود بيضاء — مثل Partner with us)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-3xs font-bold text-[#5C5A55] mb-1">نص الزر (عربي)</label>
                  <input
                    name="heroCtaSecondaryTextAr"
                    type="text"
                    defaultValue={heroVal.ctaSecondaryTextAr || defaultHeroConfig.ctaSecondaryTextAr}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#e5e0d6] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-3xs font-bold text-[#5C5A55] mb-1">نص الزر (فرنسي)</label>
                  <input
                    name="heroCtaSecondaryTextFr"
                    type="text"
                    defaultValue={heroVal.ctaSecondaryTextFr || defaultHeroConfig.ctaSecondaryTextFr}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#e5e0d6] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-3xs font-bold text-[#5C5A55] mb-1">نص الزر (إنجليزي)</label>
                  <input
                    name="heroCtaSecondaryTextEn"
                    type="text"
                    defaultValue={heroVal.ctaSecondaryTextEn || defaultHeroConfig.ctaSecondaryTextEn}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#e5e0d6] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-3xs font-bold text-[#5C5A55] mb-1">الرابط الموجه</label>
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
          <div className="space-y-4 pt-2 border-t border-[#E5E0D6]">
            <h3 className="text-2xs font-bold text-[#5C5A55] uppercase tracking-wider">
              الشريط السفلي للمصداقية (Bottom Institutional Sub-strip)
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-3xs font-bold text-[#5C5A55] mb-1">النص بالعربية (AR)</label>
                <input
                  name="heroBottomStripAr"
                  type="text"
                  defaultValue={heroVal.bottomStripAr || defaultHeroConfig.bottomStripAr}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20]"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-3xs font-bold text-[#5C5A55] mb-1">النص بالفرنسية (FR)</label>
                  <input
                    name="heroBottomStripFr"
                    type="text"
                    defaultValue={heroVal.bottomStripFr || defaultHeroConfig.bottomStripFr}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20]"
                  />
                </div>
                <div>
                  <label className="block text-3xs font-bold text-[#5C5A55] mb-1">النص بالإنجليزية (EN)</label>
                  <input
                    name="heroBottomStripEn"
                    type="text"
                    defaultValue={heroVal.bottomStripEn || defaultHeroConfig.bottomStripEn}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Flagship Program Spotlight Control (البرنامج الرائد ومبادرة الاستقطاب) */}
        <div className="bg-white p-8 rounded-2xl border border-[#e5e0d6] shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5E0D6]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base">⭐</span>
                <h2 className="text-sm font-bold text-[#231f20] uppercase tracking-wider">
                  البرنامج الرائد ومبادرة الاستقطاب (Flagship Program Spotlight)
                </h2>
              </div>
              <p className="text-xs text-[#5C5A55] mt-1">
                التحكم الكامل في قسم المبادرة الرئيسية (مبادرة شباب في العمل)، اختيار البرنامج من قاعدة البيانات، الصور، النصوص، ومراحل المشاركة.
              </p>
            </div>

            <div>
              {isFlagshipEnabled ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-3xs font-black rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  مفعل ويظهر في الموقع
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-3xs font-black rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  معطل ومخفي
                </span>
              )}
            </div>
          </div>

          {/* Toggle Enable / Disable */}
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6] flex items-center justify-between">
            <div>
              <label htmlFor="flagshipEnabled" className="text-xs font-bold text-[#231f20] block cursor-pointer">
                عرض قسم البرنامج الرائد في الصفحة الرئيسية
              </label>
              <p className="text-3xs text-[#5C5A55] mt-0.5">
                عند إلغاء التحديد، سيتم إخفاء هذا القسم بالكامل من الواجهة الرئيسية دون فقدان بياناته.
              </p>
            </div>
            <input
              id="flagshipEnabled"
              name="flagshipEnabled"
              type="checkbox"
              defaultChecked={isFlagshipEnabled}
              className="w-5 h-5 rounded text-[#231f20] focus:ring-[#231f20] cursor-pointer"
            />
          </div>

          {/* Select Database Program */}
          <div className="space-y-2">
            <label className="block text-2xs font-bold text-[#5C5A55]">
              اختيار البرنامج من قاعدة البيانات (Choose Program)
            </label>
            <select
              name="flagshipProgramSlug"
              defaultValue={flagshipVal.programSlug || defaultFlagshipProgramConfig.programSlug}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20] bg-white cursor-pointer"
            >
              <option value="youth-in-action">مبادرة شباب في العمل (Youth in Action) — الافتراضي</option>
              {availablePrograms
                .filter((p) => p.slug !== 'youth-in-action')
                .map((p) => (
                  <option key={p.id} value={p.slug}>
                    {p.title} ({p.slug})
                  </option>
                ))}
            </select>
            <p className="text-3xs text-[#5C5A55]">
              يمكنك ربط هذا القسم بأي برنامج مسجل في قاعدة البيانات، مع تخصيص نصوصه وصورته بالكامل في الحقول أدناه.
            </p>
          </div>

          {/* Image Uploader */}
          <div className="pt-2 border-t border-[#E5E0D6]">
            <FlagshipImageUploader
              initialImageUrl={flagshipVal.imageUrl}
              defaultImageUrl={defaultFlagshipProgramConfig.imageUrl}
              imageCaption={flagshipVal.imageCaptionAr || defaultFlagshipProgramConfig.imageCaptionAr}
            />
          </div>

          {/* Badge & Caption */}
          <div className="space-y-4 pt-2 border-t border-[#E5E0D6]">
            <h3 className="text-2xs font-bold text-[#5C5A55] uppercase tracking-wider">
              شارة وتسميات البرنامج الرائد (Badge & Card Labels)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-3xs font-bold text-[#5C5A55] mb-1">الشارة بالعربية (AR)</label>
                <input
                  name="flagshipBadgeAr"
                  type="text"
                  defaultValue={flagshipVal.badgeAr || defaultFlagshipProgramConfig.badgeAr}
                  placeholder="البرنامج الرائد"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20]"
                />
              </div>
              <div>
                <label className="block text-3xs font-bold text-[#5C5A55] mb-1">الشارة بالفرنسية (FR)</label>
                <input
                  name="flagshipBadgeFr"
                  type="text"
                  defaultValue={flagshipVal.badgeFr || defaultFlagshipProgramConfig.badgeFr}
                  placeholder="Programme Phare"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20]"
                />
              </div>
              <div>
                <label className="block text-3xs font-bold text-[#5C5A55] mb-1">الشارة بالإنجليزية (EN)</label>
                <input
                  name="flagshipBadgeEn"
                  type="text"
                  defaultValue={flagshipVal.badgeEn || defaultFlagshipProgramConfig.badgeEn}
                  placeholder="Flagship Program"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-3xs font-bold text-[#5C5A55] mb-1">التسمية فوق الصورة (AR)</label>
                <input
                  name="flagshipImageCaptionAr"
                  type="text"
                  defaultValue={flagshipVal.imageCaptionAr || defaultFlagshipProgramConfig.imageCaptionAr}
                  placeholder="طاقات شبابية تقود المشهد الثقافي"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20]"
                />
              </div>
              <div>
                <label className="block text-3xs font-bold text-[#5C5A55] mb-1">التسمية فوق الصورة (FR)</label>
                <input
                  name="flagshipImageCaptionFr"
                  type="text"
                  defaultValue={flagshipVal.imageCaptionFr || defaultFlagshipProgramConfig.imageCaptionFr}
                  placeholder="Jeunes leaders de la scène culturelle"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20]"
                />
              </div>
              <div>
                <label className="block text-3xs font-bold text-[#5C5A55] mb-1">التسمية فوق الصورة (EN)</label>
                <input
                  name="flagshipImageCaptionEn"
                  type="text"
                  defaultValue={flagshipVal.imageCaptionEn || defaultFlagshipProgramConfig.imageCaptionEn}
                  placeholder="Youth Leadership in Arts & Culture"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20]"
                />
              </div>
            </div>

            <div>
              <label className="block text-3xs font-bold text-[#5C5A55] mb-1">الشعار الفرعي للبطاقة (Subcaption e.g. AMYCC Morocco)</label>
              <input
                name="flagshipImageSubcaption"
                type="text"
                defaultValue={flagshipVal.imageSubcaption || defaultFlagshipProgramConfig.imageSubcaption}
                placeholder="AMYCC Morocco"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20]"
              />
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-4 pt-2 border-t border-[#E5E0D6]">
            <h3 className="text-2xs font-bold text-[#5C5A55] uppercase tracking-wider">
              العنوان والوصف التعريفي (Title & Description)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-3xs font-bold text-[#5C5A55] mb-1">العنوان بالعربية (AR)</label>
                <input
                  name="flagshipTitleAr"
                  type="text"
                  defaultValue={flagshipVal.titleAr || defaultFlagshipProgramConfig.titleAr}
                  placeholder="مبادرة شباب في العمل"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20]"
                />
              </div>
              <div>
                <label className="block text-3xs font-bold text-[#5C5A55] mb-1">العنوان بالفرنسية (FR)</label>
                <input
                  name="flagshipTitleFr"
                  type="text"
                  defaultValue={flagshipVal.titleFr || defaultFlagshipProgramConfig.titleFr}
                  placeholder="Initiative Jeunesse en Action"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20]"
                />
              </div>
              <div>
                <label className="block text-3xs font-bold text-[#5C5A55] mb-1">العنوان بالإنجليزية (EN)</label>
                <input
                  name="flagshipTitleEn"
                  type="text"
                  defaultValue={flagshipVal.titleEn || defaultFlagshipProgramConfig.titleEn}
                  placeholder="Youth in Action Initiative"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20]"
                />
              </div>
            </div>

            <div>
              <label className="block text-3xs font-bold text-[#5C5A55] mb-1">الوصف بالعربية (AR)</label>
              <textarea
                name="flagshipDescAr"
                rows={2}
                defaultValue={flagshipVal.descriptionAr || defaultFlagshipProgramConfig.descriptionAr}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20]"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-3xs font-bold text-[#5C5A55] mb-1">الوصف بالفرنسية (FR)</label>
                <textarea
                  name="flagshipDescFr"
                  rows={2}
                  defaultValue={flagshipVal.descriptionFr || defaultFlagshipProgramConfig.descriptionFr}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20]"
                />
              </div>
              <div>
                <label className="block text-3xs font-bold text-[#5C5A55] mb-1">الوصف بالإنجليزية (EN)</label>
                <textarea
                  name="flagshipDescEn"
                  rows={2}
                  defaultValue={flagshipVal.descriptionEn || defaultFlagshipProgramConfig.descriptionEn}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20]"
                />
              </div>
            </div>
          </div>

          {/* 4 Steps Journey */}
          <div className="space-y-4 pt-2 border-t border-[#E5E0D6]">
            <h3 className="text-2xs font-bold text-[#5C5A55] uppercase tracking-wider">
              المراحل والخطوات الأربع (The 4 Journey Steps)
            </h3>

            {/* Step 1 */}
            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6] space-y-3">
              <span className="text-2xs font-bold text-[#231f20] block">المرحلة 1:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input name="step1TitleAr" placeholder="العنوان (AR)" defaultValue={flagshipVal.step1TitleAr || defaultFlagshipProgramConfig.step1TitleAr} className="px-3 py-1.5 text-xs rounded-lg border border-[#e5e0d6] bg-white" />
                <input name="step1TitleFr" placeholder="Titre (FR)" defaultValue={flagshipVal.step1TitleFr || defaultFlagshipProgramConfig.step1TitleFr} className="px-3 py-1.5 text-xs rounded-lg border border-[#e5e0d6] bg-white" />
                <input name="step1TitleEn" placeholder="Title (EN)" defaultValue={flagshipVal.step1TitleEn || defaultFlagshipProgramConfig.step1TitleEn} className="px-3 py-1.5 text-xs rounded-lg border border-[#e5e0d6] bg-white" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input name="step1DescAr" placeholder="الوصف المصغر (AR)" defaultValue={flagshipVal.step1DescAr || defaultFlagshipProgramConfig.step1DescAr} className="px-3 py-1.5 text-xs rounded-lg border border-[#e5e0d6] bg-white" />
                <input name="step1DescFr" placeholder="Description courte (FR)" defaultValue={flagshipVal.step1DescFr || defaultFlagshipProgramConfig.step1DescFr} className="px-3 py-1.5 text-xs rounded-lg border border-[#e5e0d6] bg-white" />
                <input name="step1DescEn" placeholder="Short description (EN)" defaultValue={flagshipVal.step1DescEn || defaultFlagshipProgramConfig.step1DescEn} className="px-3 py-1.5 text-xs rounded-lg border border-[#e5e0d6] bg-white" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6] space-y-3">
              <span className="text-2xs font-bold text-[#231f20] block">المرحلة 2:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input name="step2TitleAr" placeholder="العنوان (AR)" defaultValue={flagshipVal.step2TitleAr || defaultFlagshipProgramConfig.step2TitleAr} className="px-3 py-1.5 text-xs rounded-lg border border-[#e5e0d6] bg-white" />
                <input name="step2TitleFr" placeholder="Titre (FR)" defaultValue={flagshipVal.step2TitleFr || defaultFlagshipProgramConfig.step2TitleFr} className="px-3 py-1.5 text-xs rounded-lg border border-[#e5e0d6] bg-white" />
                <input name="step2TitleEn" placeholder="Title (EN)" defaultValue={flagshipVal.step2TitleEn || defaultFlagshipProgramConfig.step2TitleEn} className="px-3 py-1.5 text-xs rounded-lg border border-[#e5e0d6] bg-white" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input name="step2DescAr" placeholder="الوصف المصغر (AR)" defaultValue={flagshipVal.step2DescAr || defaultFlagshipProgramConfig.step2DescAr} className="px-3 py-1.5 text-xs rounded-lg border border-[#e5e0d6] bg-white" />
                <input name="step2DescFr" placeholder="Description courte (FR)" defaultValue={flagshipVal.step2DescFr || defaultFlagshipProgramConfig.step2DescFr} className="px-3 py-1.5 text-xs rounded-lg border border-[#e5e0d6] bg-white" />
                <input name="step2DescEn" placeholder="Short description (EN)" defaultValue={flagshipVal.step2DescEn || defaultFlagshipProgramConfig.step2DescEn} className="px-3 py-1.5 text-xs rounded-lg border border-[#e5e0d6] bg-white" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6] space-y-3">
              <span className="text-2xs font-bold text-[#231f20] block">المرحلة 3:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input name="step3TitleAr" placeholder="العنوان (AR)" defaultValue={flagshipVal.step3TitleAr || defaultFlagshipProgramConfig.step3TitleAr} className="px-3 py-1.5 text-xs rounded-lg border border-[#e5e0d6] bg-white" />
                <input name="step3TitleFr" placeholder="Titre (FR)" defaultValue={flagshipVal.step3TitleFr || defaultFlagshipProgramConfig.step3TitleFr} className="px-3 py-1.5 text-xs rounded-lg border border-[#e5e0d6] bg-white" />
                <input name="step3TitleEn" placeholder="Title (EN)" defaultValue={flagshipVal.step3TitleEn || defaultFlagshipProgramConfig.step3TitleEn} className="px-3 py-1.5 text-xs rounded-lg border border-[#e5e0d6] bg-white" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input name="step3DescAr" placeholder="الوصف المصغر (AR)" defaultValue={flagshipVal.step3DescAr || defaultFlagshipProgramConfig.step3DescAr} className="px-3 py-1.5 text-xs rounded-lg border border-[#e5e0d6] bg-white" />
                <input name="step3DescFr" placeholder="Description courte (FR)" defaultValue={flagshipVal.step3DescFr || defaultFlagshipProgramConfig.step3DescFr} className="px-3 py-1.5 text-xs rounded-lg border border-[#e5e0d6] bg-white" />
                <input name="step3DescEn" placeholder="Short description (EN)" defaultValue={flagshipVal.step3DescEn || defaultFlagshipProgramConfig.step3DescEn} className="px-3 py-1.5 text-xs rounded-lg border border-[#e5e0d6] bg-white" />
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6] space-y-3">
              <span className="text-2xs font-bold text-[#231f20] block">المرحلة 4:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input name="step4TitleAr" placeholder="العنوان (AR)" defaultValue={flagshipVal.step4TitleAr || defaultFlagshipProgramConfig.step4TitleAr} className="px-3 py-1.5 text-xs rounded-lg border border-[#e5e0d6] bg-white" />
                <input name="step4TitleFr" placeholder="Titre (FR)" defaultValue={flagshipVal.step4TitleFr || defaultFlagshipProgramConfig.step4TitleFr} className="px-3 py-1.5 text-xs rounded-lg border border-[#e5e0d6] bg-white" />
                <input name="step4TitleEn" placeholder="Title (EN)" defaultValue={flagshipVal.step4TitleEn || defaultFlagshipProgramConfig.step4TitleEn} className="px-3 py-1.5 text-xs rounded-lg border border-[#e5e0d6] bg-white" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input name="step4DescAr" placeholder="الوصف المصغر (AR)" defaultValue={flagshipVal.step4DescAr || defaultFlagshipProgramConfig.step4DescAr} className="px-3 py-1.5 text-xs rounded-lg border border-[#e5e0d6] bg-white" />
                <input name="step4DescFr" placeholder="Description courte (FR)" defaultValue={flagshipVal.step4DescFr || defaultFlagshipProgramConfig.step4DescFr} className="px-3 py-1.5 text-xs rounded-lg border border-[#e5e0d6] bg-white" />
                <input name="step4DescEn" placeholder="Short description (EN)" defaultValue={flagshipVal.step4DescEn || defaultFlagshipProgramConfig.step4DescEn} className="px-3 py-1.5 text-xs rounded-lg border border-[#e5e0d6] bg-white" />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 pt-2 border-t border-[#E5E0D6]">
            <h3 className="text-2xs font-bold text-[#5C5A55] uppercase tracking-wider">
              أزرار التوجيه (Action Buttons)
            </h3>
            {/* Primary Button */}
            <div className="space-y-2">
              <span className="text-3xs font-bold text-[#231f20] block">الزر الرئيسي (Primary CTA):</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input name="flagshipCtaPrimaryTextAr" placeholder="نص الزر (AR)" defaultValue={flagshipVal.ctaPrimaryTextAr || defaultFlagshipProgramConfig.ctaPrimaryTextAr} className="px-3 py-1.5 text-xs rounded-lg border border-[#e5e0d6]" />
                <input name="flagshipCtaPrimaryTextFr" placeholder="Texte (FR)" defaultValue={flagshipVal.ctaPrimaryTextFr || defaultFlagshipProgramConfig.ctaPrimaryTextFr} className="px-3 py-1.5 text-xs rounded-lg border border-[#e5e0d6]" />
                <input name="flagshipCtaPrimaryTextEn" placeholder="Text (EN)" defaultValue={flagshipVal.ctaPrimaryTextEn || defaultFlagshipProgramConfig.ctaPrimaryTextEn} className="px-3 py-1.5 text-xs rounded-lg border border-[#e5e0d6]" />
              </div>
              <input name="flagshipCtaPrimaryUrl" placeholder="الرابط الموجه (مثال: /programs/youth-in-action)" defaultValue={flagshipVal.ctaPrimaryUrl || defaultFlagshipProgramConfig.ctaPrimaryUrl} className="w-full px-3.5 py-1.5 text-xs rounded-lg border border-[#e5e0d6] font-mono" />
            </div>

            {/* Secondary Button */}
            <div className="space-y-2 pt-2">
              <span className="text-3xs font-bold text-[#231f20] block">الزر الثانوي (Secondary CTA):</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input name="flagshipCtaSecondaryTextAr" placeholder="نص الزر (AR)" defaultValue={flagshipVal.ctaSecondaryTextAr || defaultFlagshipProgramConfig.ctaSecondaryTextAr} className="px-3 py-1.5 text-xs rounded-lg border border-[#e5e0d6]" />
                <input name="flagshipCtaSecondaryTextFr" placeholder="Texte (FR)" defaultValue={flagshipVal.ctaSecondaryTextFr || defaultFlagshipProgramConfig.ctaSecondaryTextFr} className="px-3 py-1.5 text-xs rounded-lg border border-[#e5e0d6]" />
                <input name="flagshipCtaSecondaryTextEn" placeholder="Text (EN)" defaultValue={flagshipVal.ctaSecondaryTextEn || defaultFlagshipProgramConfig.ctaSecondaryTextEn} className="px-3 py-1.5 text-xs rounded-lg border border-[#e5e0d6]" />
              </div>
              <input name="flagshipCtaSecondaryUrl" placeholder="الرابط الموجه (مثال: /about)" defaultValue={flagshipVal.ctaSecondaryUrl || defaultFlagshipProgramConfig.ctaSecondaryUrl} className="w-full px-3.5 py-1.5 text-xs rounded-lg border border-[#e5e0d6] font-mono" />
            </div>
          </div>
        </div>

        {/* Top Bar Notification & Institutional Banner Control */}
        <div className="bg-white p-8 rounded-2xl border border-[#e5e0d6] shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5E0D6]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base">📢</span>
                <h2 className="text-sm font-bold text-[#231f20] uppercase tracking-wider">
                  الشريط العلوي الترويجي للهيدر (Top Bar Control)
                </h2>
              </div>
              <p className="text-xs text-[#5C5A55] mt-1">
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
          <div className="bg-[#FAF8F5] p-5 rounded-xl border border-[#E5E0D6] flex items-center justify-between gap-4">
            <div className="space-y-1">
              <label htmlFor="topBarEnabled" className="text-xs font-bold text-[#231f20] cursor-pointer block">
                تفعيل وإظهار الشريط العلوي (Show Top Announcement Bar)
              </label>
              <p className="text-3xs text-[#5C5A55]">
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
              <div className="w-11 h-6 bg-[#e5e0d6] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#231f20]"></div>
            </label>
          </div>

          {/* Multilingual Announcement Messages */}
          <div className="space-y-4 pt-2">
            <h3 className="text-2xs font-bold text-[#5C5A55] uppercase tracking-wider">
              نص الإعلان أو الرسالة المؤسسية (Announcement Text)
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-2xs font-bold text-[#5C5A55] mb-1">
                  النص بالعربية (Arabic)
                </label>
                <input
                  name="topBarMessageAr"
                  type="text"
                  defaultValue={topBarVal.messageAr ?? defaultTopBarConfig.messageAr}
                  placeholder="المملكة المغربية • جمعية روح الفنون والثقافة (AMYCC)..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-2xs font-bold text-[#5C5A55] mb-1">
                    النص بالفرنسية (French)
                  </label>
                  <input
                    name="topBarMessageFr"
                    type="text"
                    defaultValue={topBarVal.messageFr ?? defaultTopBarConfig.messageFr}
                    placeholder="Royaume du Maroc • Association Esprit des Arts..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20]"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-bold text-[#5C5A55] mb-1">
                    النص بالإنجليزية (English)
                  </label>
                  <input
                    name="topBarMessageEn"
                    type="text"
                    defaultValue={topBarVal.messageEn ?? defaultTopBarConfig.messageEn}
                    placeholder="Kingdom of Morocco • Spirit of Arts & Culture..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Link & Contact */}
          <div className="space-y-4 pt-2">
            <h3 className="text-2xs font-bold text-[#5C5A55] uppercase tracking-wider">
              الرابط السريع وزر التوجيه (Action Link & Contact)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-2xs font-bold text-[#5C5A55] mb-1">
                  نص الرابط (بالعربية)
                </label>
                <input
                  name="topBarLinkTextAr"
                  type="text"
                  defaultValue={topBarVal.linkTextAr ?? defaultTopBarConfig.linkTextAr}
                  placeholder="مبادرة شباب في العمل"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20]"
                />
              </div>
              <div>
                <label className="block text-2xs font-bold text-[#5C5A55] mb-1">
                  نص الرابط (بالفرنسية)
                </label>
                <input
                  name="topBarLinkTextFr"
                  type="text"
                  defaultValue={topBarVal.linkTextFr ?? defaultTopBarConfig.linkTextFr}
                  placeholder="Initiative Jeunesse en Action"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20]"
                />
              </div>
              <div>
                <label className="block text-2xs font-bold text-[#5C5A55] mb-1">
                  نص الرابط (بالإنجليزية)
                </label>
                <input
                  name="topBarLinkTextEn"
                  type="text"
                  defaultValue={topBarVal.linkTextEn ?? defaultTopBarConfig.linkTextEn}
                  placeholder="Youth in Action Initiative"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-2xs font-bold text-[#5C5A55] mb-1">
                  وجهة الرابط (URL / Path)
                </label>
                <input
                  name="topBarLinkUrl"
                  type="text"
                  defaultValue={topBarVal.linkUrl ?? defaultTopBarConfig.linkUrl}
                  placeholder="/programs/youth-in-action"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20]"
                />
              </div>
              <div>
                <label className="block text-2xs font-bold text-[#5C5A55] mb-1">
                  بريد التواصل في الشريط (Contact Email)
                </label>
                <input
                  name="topBarContact"
                  type="email"
                  defaultValue={topBarVal.contactEmail ?? defaultTopBarConfig.contactEmail}
                  placeholder="contact@amycc.org"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Core Areas Management Card */}
        <div className="bg-gradient-to-r from-[#231f20] to-[#d2a82b] text-white p-6 sm:p-8 rounded-2xl border border-[#d2a82b]/40 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎯</span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                إدارة مجالات التدخل الستة والنوافذ المنبثقة (Areas CMS)
              </h3>
            </div>
            <p className="text-xs text-[#E2DED6]/85 max-w-xl leading-relaxed">
              تخصيص نصوص بطاقات الواجهة، الأيقونات، والرؤية التفصيلية والأهداف والورشات الميدانية المعروضة داخل النافذة المنبثقة لكل مجال.
            </p>
          </div>
          <Link
            href="/admin/areas"
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#231f20] bg-[#ffd22f] hover:bg-white active:scale-98 transition-all shrink-0 text-center shadow-xs"
          >
            إدارة مجالات التدخل →
          </Link>
        </div>

        {/* FAQ Management Section Card */}
        <div className="bg-gradient-to-r from-[#231f20] to-[#231f20] text-white p-6 sm:p-8 rounded-2xl border border-[#d2a82b] shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xl">❓</span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                إدارة بنك الأسئلة الشائعة (FAQ Management)
              </h3>
            </div>
            <p className="text-xs text-[#E2DED6]/85 max-w-xl leading-relaxed">
              تحكم كامل في نصوص الأسئلة والإجابات بثلاث لغات (العربية، الفرنسية، الإنجليزية)، ترتيبها، واختيار ما يعرض منها في الواجهة الرئيسية.
            </p>
          </div>
          <Link
            href="/admin/faqs"
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#231f20] bg-[#ffd22f] hover:bg-white active:scale-98 transition-all shrink-0 text-center shadow-xs"
          >
            الانتقال لإدارة الأسئلة الشائعة →
          </Link>
        </div>

        {/* Editable Contact & Social Information Form */}
        <div className="bg-white p-8 rounded-2xl border border-[#e5e0d6] shadow-2xs">
          <h2 className="text-sm font-bold text-[#231f20] mb-6 uppercase tracking-wider">
            Official Channels & Social Links
          </h2>

          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-2xs font-bold text-[#5C5A55] mb-1">
                  Official Contact Email / البريد الرسمي الأساسي
                </label>
                <input
                  name="contactEmail"
                  type="email"
                  defaultValue={effectiveEmail}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20]"
                />
              </div>
              <div>
                <label className="block text-2xs font-bold text-[#5C5A55] mb-1">
                  Official Telephone Number / الهاتف الرسمي
                </label>
                <input
                  name="contactPhone"
                  type="tel"
                  defaultValue={effectivePhone}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20]"
                />
              </div>
            </div>

            <div>
              <label className="block text-2xs font-bold text-[#5C5A55] mb-1">
                Registered Association Office / المقر الإداري الرسمي
              </label>
              <input
                name="contactAddress"
                type="text"
                defaultValue={effectiveAddress}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-2xs font-bold text-[#5C5A55] mb-1">
                  Facebook Page URL (فيسبوك)
                </label>
                <input
                  name="facebookUrl"
                  type="url"
                  defaultValue={effectiveSocial.facebook || 'https://facebook.com/amycc'}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20]"
                />
              </div>
              <div>
                <label className="block text-2xs font-bold text-[#5C5A55] mb-1">
                  Instagram Profile URL (إنستغرام)
                </label>
                <input
                  name="instagramUrl"
                  type="url"
                  defaultValue={effectiveSocial.instagram || 'https://instagram.com/amycc'}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20]"
                />
              </div>
              <div>
                <label className="block text-2xs font-bold text-[#5C5A55] mb-1">
                  LinkedIn Page URL (لينكد إن)
                </label>
                <input
                  name="linkedinUrl"
                  type="url"
                  defaultValue={effectiveSocial.linkedin || 'https://linkedin.com/company/amycc'}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20]"
                />
              </div>
              <div>
                <label className="block text-2xs font-bold text-[#5C5A55] mb-1">
                  YouTube Channel URL (يوتيوب)
                </label>
                <input
                  name="youtubeUrl"
                  type="url"
                  defaultValue={effectiveSocial.youtube || 'https://youtube.com/@amycc'}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20]"
                />
              </div>
              <div>
                <label className="block text-2xs font-bold text-[#5C5A55] mb-1">
                  X / Twitter Profile URL (منصة إكس)
                </label>
                <input
                  name="twitterUrl"
                  type="url"
                  defaultValue={effectiveSocial.twitter || ''}
                  placeholder="https://x.com/amycc_morocco"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20]"
                />
              </div>
              <div>
                <label className="block text-2xs font-bold text-[#5C5A55] mb-1">
                  TikTok Channel URL (تيك توك)
                </label>
                <input
                  name="tiktokUrl"
                  type="url"
                  defaultValue={effectiveSocial.tiktok || ''}
                  placeholder="https://tiktok.com/@amycc"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20]"
                />
              </div>
              <div>
                <label className="block text-2xs font-bold text-[#5C5A55] mb-1">
                  WhatsApp Direct URL (واتساب)
                </label>
                <input
                  name="whatsappUrl"
                  type="url"
                  defaultValue={effectiveSocial.whatsapp || ''}
                  placeholder="https://wa.me/212600000000"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Global Save Button */}
        <div className="sticky bottom-6 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-[#e5e0d6] shadow-card flex items-center justify-between gap-4">
          <p className="text-xs text-[#5C5A55]">
            اضغط حفظ لتطبيق التغييرات على واجهة الاستقبال والشريط العلوي والإعدادات فوراً.
          </p>
          <button
            type="submit"
            className="px-6 py-2.5 text-xs font-bold text-white bg-[#231f20] hover:bg-[#d2a82b] active:scale-98 rounded-xl transition-all shadow-subtle hover:shadow-card cursor-pointer"
          >
            حفظ وتحديث الإعدادات (Save Platform Settings)
          </button>
        </div>
      </form>
    </div>
  )
}

'use client'

import React, { useState, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { ContactConfig } from '@/lib/settings'
import { saveContactConfiguration } from '@/lib/actions/admin'
import { useAdminLocale } from './AdminLocaleContext'

interface SocialMediaManagerProps {
  initialConfig: ContactConfig
  onSaved?: () => void
}

type SocialFieldKey = 'facebook' | 'instagram' | 'youtube' | 'linkedin' | 'twitter' | 'tiktok' | 'whatsapp'

interface SocialPlatformMeta {
  key: SocialFieldKey
  nameAr: string
  nameFr: string
  nameEn: string
  color: string
  badgeColor: string
  placeholder: string
  hintAr: string
  hintFr: string
  hintEn: string
  svg: (className?: string) => React.ReactNode
}

const PLATFORMS: SocialPlatformMeta[] = [
  {
    key: 'facebook',
    nameAr: 'فيسبوك (Facebook)',
    nameFr: 'Page Facebook',
    nameEn: 'Facebook Page',
    color: '#1877F2',
    badgeColor: 'bg-[#1877F2]/10 text-[#1877F2] border-[#1877F2]/30',
    placeholder: 'https://facebook.com/amycc.morocco',
    hintAr: 'الصفحة الرسمية المعتمدة لجمعية روح الفنون والثقافة',
    hintFr: 'Page officielle de l\'AMYCC sur Facebook',
    hintEn: 'Official AMYCC Facebook organization page',
    svg: (cls = 'w-4 h-4 fill-current') => (
      <svg className={cls} viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    key: 'youtube',
    nameAr: 'يوتيوب (YouTube)',
    nameFr: 'Chaîne YouTube',
    nameEn: 'YouTube Channel',
    color: '#FF0000',
    badgeColor: 'bg-[#FF0000]/10 text-[#FF0000] border-[#FF0000]/30',
    placeholder: 'https://youtube.com/@amycc',
    hintAr: 'قناة التوثيق المرئي، العروض المسرحية والمحترفات الفنية',
    hintFr: 'Vidéos des ateliers, spectacles et résidences artistiques',
    hintEn: 'Video coverage of workshops, plays and cultural festivals',
    svg: (cls = 'w-4 h-4 fill-current') => (
      <svg className={cls} viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    key: 'linkedin',
    nameAr: 'لينكد إن (LinkedIn)',
    nameFr: 'Page LinkedIn',
    nameEn: 'LinkedIn Company',
    color: '#0A66C2',
    badgeColor: 'bg-[#0A66C2]/10 text-[#0A66C2] border-[#0A66C2]/30',
    placeholder: 'https://linkedin.com/company/amycc',
    hintAr: 'شبكة التواصل المهني والمؤسسي مع الشركاء والجهات المانحة',
    hintFr: 'Réseau professionnel pour les partenariats institutionnels',
    hintEn: 'Professional network for institutional partners and sponsors',
    svg: (cls = 'w-4 h-4 fill-current') => (
      <svg className={cls} viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
  },
  {
    key: 'instagram',
    nameAr: 'إنستغرام (Instagram)',
    nameFr: 'Compte Instagram',
    nameEn: 'Instagram Profile',
    color: '#E4405F',
    badgeColor: 'bg-[#E4405F]/10 text-[#E4405F] border-[#E4405F]/30',
    placeholder: 'https://instagram.com/amycc.morocco',
    hintAr: 'القصص واليوميات المصورة لورشات وإبداعات الشباب',
    hintFr: 'Galerie visuelle, stories et coulisses des projets jeunes',
    hintEn: 'Visual stories and backstage moments of youth workshops',
    svg: (cls = 'w-4 h-4 fill-current') => (
      <svg className={cls} viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    key: 'twitter',
    nameAr: 'منصة إكس / تويتر (X / Twitter)',
    nameFr: 'Plateforme X (Twitter)',
    nameEn: 'X (formerly Twitter)',
    color: '#000000',
    badgeColor: 'bg-black/10 text-black border-black/30 dark:bg-white/10 dark:text-white',
    placeholder: 'https://x.com/amycc_morocco',
    hintAr: 'التدوينات الإخبارية الموجزة والتحديثات السريعة',
    hintFr: 'Brèves, actualités en direct et déclarations officielles',
    hintEn: 'Short announcements, event updates and press releases',
    svg: (cls = 'w-4 h-4 fill-current') => (
      <svg className={cls} viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    key: 'tiktok',
    nameAr: 'تيك توك (TikTok)',
    nameFr: 'Compte TikTok',
    nameEn: 'TikTok Channel',
    color: '#000000',
    badgeColor: 'bg-black/10 text-black border-black/30 dark:bg-white/10 dark:text-white',
    placeholder: 'https://tiktok.com/@amycc',
    hintAr: 'مقاطع الفيديو القصيرة والمحتوى الإبداعي لجيل الشباب',
    hintFr: 'Vidéos courtes immersives et tendances créatives des jeunes',
    hintEn: 'Short-form creative video content and youth showcases',
    svg: (cls = 'w-4 h-4 fill-current') => (
      <svg className={cls} viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
  {
    key: 'whatsapp',
    nameAr: 'واتساب المباشر (WhatsApp)',
    nameFr: 'WhatsApp Direct',
    nameEn: 'Direct WhatsApp',
    color: '#25D366',
    badgeColor: 'bg-[#25D366]/10 text-[#25D366] border-[#25D366]/30',
    placeholder: 'https://wa.me/212600000000',
    hintAr: 'رابط المحادثة الفورية السريعة لخدمة واستقبال الزوار والشباب',
    hintFr: 'Lien direct pour messagerie instantanée d\'assistance',
    hintEn: 'Direct instant chat link for inquiries and community support',
    svg: (cls = 'w-4 h-4 fill-current') => (
      <svg className={cls} viewBox="0 0 24 24">
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.204 8.204 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.216 8.216 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.51 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.25-1.49-1.4-1.74-.14-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.54.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.16-.48-.29z" />
      </svg>
    ),
  },
]

export function SocialMediaManager({ initialConfig, onSaved }: SocialMediaManagerProps) {
  const { isAr, isFr, locale } = useAdminLocale()
  const [config, setConfig] = useState<ContactConfig>(initialConfig)
  const [isPending, startTransition] = useTransition()
  const [saveStatus, setSaveStatus] = useState<{ ok: boolean; msg: string } | null>(null)

  const social = config.social || {}

  function updateLink(key: SocialFieldKey, value: string) {
    setConfig((prev) => ({
      ...prev,
      social: {
        ...(prev.social || {}),
        [key]: value,
      },
    }))
    if (saveStatus) setSaveStatus(null)
  }

  function handleSave() {
    startTransition(async () => {
      try {
        const res = await saveContactConfiguration(config)
        if (res.success) {
          setSaveStatus({
            ok: true,
            msg: isAr
              ? '✅ تم حفظ وتحديث روابط مواقع التواصل الاجتماعي بنجاح! تم تحديث الفوتر وصفحة التواصل فوراً.'
              : isFr
              ? '✅ Réseaux sociaux enregistrés avec succès ! Le pied de page et la page contact sont mis à jour.'
              : '✅ Social media channels saved successfully! Updated immediately on Footer and Contact page.',
          })
          if (onSaved) onSaved()
        } else {
          setSaveStatus({
            ok: false,
            msg: res.error || (isAr ? 'حدث خطأ أثناء الحفظ' : 'Failed to save settings'),
          })
        }
      } catch (err: unknown) {
        setSaveStatus({
          ok: false,
          msg: err instanceof Error ? err.message : 'Error saving social settings',
        })
      }
    })
  }

  const activeCount = PLATFORMS.filter((p) => {
    const val = social[p.key]
    return typeof val === 'string' && val.trim().length > 0
  }).length

  return (
    <div className="space-y-8">
      {/* Save Status Notification */}
      {saveStatus && (
        <div
          className={`p-4 rounded-2xl border text-xs sm:text-sm font-bold flex items-center justify-between gap-3 animate-fadeIn ${
            saveStatus.ok
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span>{saveStatus.ok ? '✓' : '⚠️'}</span>
            <span>{saveStatus.msg}</span>
          </div>
          <button
            type="button"
            onClick={() => setSaveStatus(null)}
            className="text-xs px-2 py-1 rounded-lg hover:bg-black/5 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Intro & Stats */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e5e0d6] shadow-subtle flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#bd3227]" />
            <span className="text-2xs uppercase tracking-wider font-bold text-[#8a857b]">
              {isAr ? 'روابط المنصات الرقمية المعتمدة' : 'Official Digital Footprint'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#231f20] tracking-tight">
            {isAr
              ? 'التحكم في مواقع وقنوات التواصل الاجتماعي (Footer & Social)'
              : isFr
              ? 'Gestion des Réseaux Sociaux & Canaux Officiels'
              : 'Social Media & Digital Channels Management'}
          </h2>
          <p className="text-xs sm:text-sm text-[#5C5A55] leading-relaxed">
            {isAr
              ? 'تحكم كامل ومباشر في الروابط والأيقونات الظاهرة في الشريط السفلي للموقع (Footer)، صفحة اتصل بنا، وكافة نقاط الاتصال الرقمية التابعة لجمعية روح الفنون والثقافة.'
              : isFr
              ? 'Gérez directement les liens et icônes affichés dans le pied de page du site (Footer), la page de contact et tous les points de contact officiels.'
              : 'Easily manage official URLs and icons displayed in the website footer, contact page, and all public digital touchpoints.'}
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
          <div className="p-3 px-5 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] text-center">
            <span className="block text-xl font-black text-[#231f20]">{activeCount} / {PLATFORMS.length}</span>
            <span className="text-3xs text-[#8a857b] font-bold uppercase tracking-wider">
              {isAr ? 'قنوات نشطة' : 'Canaux Actifs'}
            </span>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="px-6 py-3 rounded-2xl bg-[#231f20] hover:bg-[#d2a82b] text-white text-xs sm:text-sm font-black transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer flex items-center gap-2"
          >
            <span>{isPending ? '⏳' : '💾'}</span>
            <span>{isPending ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? 'حفظ روابط التواصل' : 'Save Social Links')}</span>
          </button>
        </div>
      </div>

      {/* ============================================================
          LIVE PREVIEW: EXACT SITE FOOTER SIMULATION
          ============================================================ */}
      <div className="rounded-3xl bg-[#181516] border border-[#d2a82b]/30 p-6 sm:p-8 text-[#e2ded6] shadow-2xl relative overflow-hidden">
        {/* Decorative Badge */}
        <div className="flex items-center justify-between pb-6 border-b border-[#383334]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-2xs font-bold uppercase tracking-wider text-[#ffd22f]">
              {isAr ? 'معاينة حية لشريط الفوتر السفلي (Live Footer Simulation)' : 'Live Public Footer Simulation'}
            </span>
          </div>
          <Link
            href={`/${locale}`}
            target="_blank"
            className="text-3xs text-[#cfcac2] hover:text-[#ffd22f] underline flex items-center gap-1"
          >
            <span>{isAr ? 'معاينة الموقع العام' : 'Preview Front Site'}</span>
            <span>↗</span>
          </Link>
        </div>

        <div className="pt-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Logo & Description */}
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 shrink-0">
                <Image
                  src="/logo.png"
                  alt="AMYCC Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <span className="text-xs font-black tracking-tight text-white">
                {isAr ? 'جمعية روح الفنون والثقافة (AMYCC)' : 'Spirit of Arts & Culture Association'}
              </span>
            </div>
            <p className="text-xs text-[#cfcac2] leading-relaxed max-w-md">
              {isAr
                ? 'تجمع جمعية روح الفنون والثقافة (AMYCC) الشباب حول الإبداع الفني، الموسيقى، المسرح، وصون التراث المغربي والتمكين المجتمعي.'
                : 'AMYCC brings young people together through arts, music, theatre, Moroccan heritage preservation, and youth empowerment.'}
            </p>
            <div className="text-2xs text-[#8a857b] flex items-center gap-4">
              <span>✉️ {config.channels?.primaryEmail || 'info@amycc.org'}</span>
              <span>📍 {isAr ? 'مراكش • المملكة المغربية' : 'Marrakech • Morocco'}</span>
            </div>
          </div>

          {/* Social Icons Strip (Matching User Screenshot Exactly) */}
          <div className="md:col-span-6 flex flex-col md:items-end justify-center space-y-3">
            <span className="text-3xs uppercase tracking-wider text-[#8a857b] font-bold block">
              {isAr ? 'تابعنا على الشبكات' : isFr ? 'Suivez-nous' : 'Follow Us'}
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {PLATFORMS.map((platform) => {
                const url = social[platform.key]
                const isConfigured = typeof url === 'string' && url.trim().length > 0
                return (
                  <a
                    key={platform.key}
                    href={isConfigured ? url : '#'}
                    target={isConfigured ? '_blank' : undefined}
                    rel={isConfigured ? 'noopener noreferrer' : undefined}
                    onClick={(e) => {
                      if (!isConfigured) {
                        e.preventDefault()
                        alert(isAr ? `يرجى إدخال رابط ${platform.nameAr} أدناه أولاً.` : `Please configure the URL for ${platform.nameEn} below.`)
                      }
                    }}
                    className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all shadow-2xs group relative ${
                      isConfigured
                        ? 'bg-[#231f20] border-[#383334] text-[#cfcac2] hover:bg-[#bd3227] hover:border-[#bd3227] hover:text-white hover:scale-110 cursor-pointer'
                        : 'bg-[#1e1b1c] border-dashed border-[#443e40] text-[#6b6667] opacity-60 hover:opacity-100 cursor-not-allowed'
                    }`}
                    title={isConfigured ? `${platform.nameAr}: ${url}` : `${platform.nameAr} (${isAr ? 'غير محدد' : 'Not configured'})`}
                  >
                    {platform.svg('w-4 h-4 fill-current')}
                  </a>
                )
              })}
            </div>
            <p className="text-3xs text-[#8a857b] italic">
              {isAr
                ? '* الأيقونات المفعلة فقط ستظهر في فوتر الموقع العام مع تأثيرات التمرير الأنيقة.'
                : '* Only configured platforms are displayed in the live site footer.'}
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================
          PLATFORMS CONFIGURATION CARDS
          ============================================================ */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#e5e0d6]">
          <h3 className="text-sm font-black text-[#231f20] flex items-center gap-2">
            <span>🛠️</span>
            <span>{isAr ? 'تعديل روابط الحسابات الرسمية' : 'Configure Account URLs'}</span>
          </h3>
          <span className="text-2xs text-[#8a857b]">
            {isAr ? 'أدخل الروابط كاملة تبدأ بـ https://' : 'Full URLs starting with https://'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {PLATFORMS.map((platform) => {
            const currentVal = social[platform.key] || ''
            const isConfigured = currentVal.trim().length > 0

            return (
              <div
                key={platform.key}
                className="p-5 rounded-2xl bg-white border border-[#e5e0d6] hover:border-[#231f20]/40 transition-all shadow-2xs space-y-3"
              >
                {/* Card Header */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs"
                      style={{ backgroundColor: platform.color }}
                    >
                      {platform.svg('w-4 h-4 fill-current')}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-[#231f20]">
                        {isAr ? platform.nameAr : isFr ? platform.nameFr : platform.nameEn}
                      </h4>
                      <p className="text-3xs text-[#8a857b]">
                        {isAr ? platform.hintAr : isFr ? platform.hintFr : platform.hintEn}
                      </p>
                    </div>
                  </div>

                  {/* Status Pill */}
                  <span
                    className={`px-2.5 py-1 rounded-full text-3xs font-bold border shrink-0 ${
                      isConfigured
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-neutral-100 text-neutral-500 border-neutral-200'
                    }`}
                  >
                    {isConfigured ? (isAr ? '● نشط' : '● Active') : (isAr ? '○ غير محدد' : '○ Empty')}
                  </span>
                </div>

                {/* Input & Quick Actions */}
                <div className="space-y-1.5">
                  <div className="relative">
                    <input
                      type="url"
                      value={currentVal}
                      onChange={(e) => updateLink(platform.key, e.target.value)}
                      placeholder={platform.placeholder}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6] text-xs text-[#231f20] font-mono focus:bg-white focus:outline-none focus:border-[#231f20] transition-colors"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    {/* Test Link Button */}
                    {isConfigured ? (
                      <a
                        href={currentVal}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-2xs font-bold text-[#1877F2] hover:underline flex items-center gap-1"
                      >
                        <span>{isAr ? '↗ اختبار وفتح الرابط' : '↗ Test Link'}</span>
                      </a>
                    ) : (
                      <span className="text-3xs text-neutral-400">
                        {isAr ? 'لم يتم إدخال رابط بعد' : 'No link set yet'}
                      </span>
                    )}

                    {/* Clear Button */}
                    {isConfigured && (
                      <button
                        type="button"
                        onClick={() => updateLink(platform.key, '')}
                        className="text-3xs text-rose-600 hover:text-rose-800 font-bold hover:underline cursor-pointer"
                      >
                        {isAr ? '✕ مسح الرابط' : '✕ Clear'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Sticky Bottom Save Bar */}
      <div className="sticky bottom-4 z-20 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#e5e0d6] shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-[#5C5A55] text-center sm:text-start">
          {isAr
            ? '💾 بمجرد الضغط على حفظ، يتم تحديث روابط منصات التواصل في كامل صفحات الموقع وقاعدة البيانات فوراً.'
            : 'Changes apply immediately across all site pages and layouts upon saving.'}
        </p>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <Link
            href={`/${locale}/contact`}
            target="_blank"
            className="px-4 py-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F4EFE6] text-xs font-bold text-[#231f20] border border-[#e5e0d6] transition-colors"
          >
            {isAr ? 'معاينة صفحة التواصل ↗' : 'Preview Contact Page ↗'}
          </Link>

          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="px-6 py-2.5 rounded-xl bg-[#231f20] hover:bg-[#d2a82b] text-white text-xs sm:text-sm font-black transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer flex items-center gap-2"
          >
            <span>{isPending ? '⏳' : '💾'}</span>
            <span>{isPending ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? 'حفظ وتطبيق الروابط' : 'Save Social Channels')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

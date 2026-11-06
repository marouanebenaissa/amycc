'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { loginAdmin } from '@/lib/actions/admin'

type AdminLocale = 'ar' | 'fr' | 'en'

interface AdminLoginViewProps {
  initialError?: string
}

const TRANSLATIONS = {
  ar: {
    state_reference: 'المملكة المغربية • الظهير الشريف رقم 1.58.376',
    association_name: 'جمعية روح الفنون والثقافة',
    association_subtitle: 'AMYCC • Marrakech',
    showcase_badge: '✦ البوابة الإدارية المركزية',
    showcase_desc:
      'فضاء التدبير المؤسساتي المخصص للمكتب التنفيذي والمسؤولين المخولين، لإدارة البرامج، تنظيم الفعاليات، ومواكبة الأثر المجتمعي والثقافي للشباب.',
    pillar1_title: 'التدبير المؤسساتي المتكامل',
    pillar1_desc:
      'إدارة محترفات الفنون والتراث، الفعاليات الثقافية، واستمارات العضوية والتطوع.',
    pillar2_title: 'منظومة أمنية مشفرة ومطابقة',
    pillar2_desc:
      'سجل تدقيق كامل للجلسات (Audit Trail) مع حماية المعطيات وفق القانون 09-08.',
    pillar3_title: 'صون التراث والتمكين الشبابي',
    pillar3_desc:
      'إشعاع ثقافي متجدد ينطلق من مدينة مراكش ليمتد نحو كافة جهات المملكة.',
    showcase_footer: '© 2026 AMYCC • إدارة المنصة المركزية',
    engine_tag: 'AMYCC Institutional Portal',
    portal_badge: '✦ بوابة الإدارة المعتمدة • AMYCC Portal',
    card_title: 'تسجيل دخول الإدارة المركزية',
    card_subtitle: 'أدخل بيانات الاعتماد المخولة لولوج لوحة الإدارة',
    email_label: 'البريد الإلكتروني المؤسساتي',
    password_label: 'كلمة المرور المشفرة',
    email_placeholder: 'example@amycc.org',
    password_placeholder: '••••••••••••',
    btn_submit: 'تسجيل الدخول إلى لوحة التحكم',
    btn_submitting: 'جاري التحقق من الصلاحيات...',
    back_to_site: 'العودة إلى الموقع الرئيسي',
    legal_security: 'منظومة مؤمنة خاضعة للظهير الشريف رقم 1.58.376',
    legal_sub: 'Row Level Security (RLS) & Session Auditing Enforced',
    footer_text: 'جمعية روح الفنون والثقافة — مراكش • المملكة المغربية',
    show_password: 'إظهار كلمة المرور',
    hide_password: 'إخفاء كلمة المرور',
  },
  fr: {
    state_reference: 'Royaume du Maroc • Dahir n° 1.58.376',
    association_name: 'Association Esprit des Arts et de la Culture',
    association_subtitle: 'AMYCC • Marrakech',
    showcase_badge: "✦ Portail d'Administration Centrale",
    showcase_desc:
      "Espace de gestion institutionnelle dédié au bureau exécutif et aux responsables autorisés, pour piloter les programmes, coordonner les événements et mesurer l'impact culturel auprès des jeunes.",
    pillar1_title: 'Gestion Institutionnelle Intégrée',
    pillar1_desc:
      'Pilotage des ateliers artistiques et patrimoniaux, événements culturels et adhésions.',
    pillar2_title: 'Sécurité Chiffrée & Conformité',
    pillar2_desc:
      "Journal d'audit complet (Audit Trail) et protection des données selon la loi 09-08.",
    pillar3_title: 'Préservation du Patrimoine & Jeunesse',
    pillar3_desc:
      'Rayonnement culturel innovant émanant de Marrakech vers toutes les régions du Royaume.',
    showcase_footer: '© 2026 AMYCC • Administration Centrale',
    engine_tag: 'AMYCC Institutional Portal',
    portal_badge: '✦ Portail Administratif Officiel • AMYCC',
    card_title: "Connexion à l'Administration",
    card_subtitle: 'Entrez vos identifiants autorisés pour accéder au tableau de bord',
    email_label: 'Adresse e-mail institutionnelle',
    password_label: 'Mot de passe chiffré',
    email_placeholder: 'example@amycc.org',
    password_placeholder: '••••••••••••',
    btn_submit: 'Se connecter au tableau de bord',
    btn_submitting: 'Vérification des accès en cours...',
    back_to_site: 'Retour au site principal',
    legal_security: 'Système sécurisé régi par le Dahir n° 1.58.376',
    legal_sub: 'Chiffrement RLS et audit des sessions actif',
    footer_text: "Association Esprit des Arts et de la Culture — Marrakech • Royaume du Maroc",
    show_password: 'Afficher le mot de passe',
    hide_password: 'Masquer le mot de passe',
  },
  en: {
    state_reference: 'Kingdom of Morocco • Dahir No. 1.58.376',
    association_name: 'Spirit of Arts & Culture Association',
    association_subtitle: 'AMYCC • Marrakech',
    showcase_badge: '✦ Central Institutional Administration',
    showcase_desc:
      'Institutional management portal dedicated to the executive board and authorized leadership for overseeing programs, cultural events, and community youth impact across Morocco.',
    pillar1_title: 'Integrated Institutional Management',
    pillar1_desc:
      'Oversight of arts & heritage workshops, cultural festivals, membership, and volunteer programs.',
    pillar2_title: 'Encrypted Security & Compliance',
    pillar2_desc:
      'Full session audit logging and strict data protection compliant with Moroccan Law 09-08.',
    pillar3_title: 'Cultural Heritage & Youth Empowerment',
    pillar3_desc:
      'Dynamic cultural leadership based in Marrakech and expanding across all Moroccan regions.',
    showcase_footer: '© 2026 AMYCC • Central Administration',
    engine_tag: 'AMYCC Institutional Portal',
    portal_badge: '✦ Official Administrative Portal • AMYCC',
    card_title: 'Institutional Administration Sign In',
    card_subtitle: 'Enter your authorized credentials to access the admin portal',
    email_label: 'Institutional Email Address',
    password_label: 'Encrypted Password',
    email_placeholder: 'example@amycc.org',
    password_placeholder: '••••••••••••',
    btn_submit: 'Sign In to Dashboard',
    btn_submitting: 'Verifying credentials...',
    back_to_site: 'Back to Main Website',
    legal_security: 'Secure system governed by Dahir No. 1.58.376',
    legal_sub: 'Row Level Security (RLS) & Session Auditing Enforced',
    footer_text: 'Spirit of Arts & Culture Association — Marrakech • Kingdom of Morocco',
    show_password: 'Show password',
    hide_password: 'Hide password',
  },
}

export function AdminLoginView({ initialError }: AdminLoginViewProps) {
  const [locale, setLocale] = useState<AdminLocale>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('amycc_admin_locale') as AdminLocale | null
        if (saved && (saved === 'ar' || saved === 'fr' || saved === 'en')) {
          return saved
        }
      } catch {
        // Ignore
      }
    }
    return 'ar'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isPending, setIsPending] = useState(false)

  // Sync document direction, lang, localStorage and cookie with active locale
  useEffect(() => {
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = locale
    try {
      localStorage.setItem('amycc_admin_locale', locale)
      document.cookie = `admin_locale=${locale}; path=/; max-age=31536000`
    } catch {
      // Ignore
    }
  }, [locale])

  function handleLocaleChange(newLocale: AdminLocale) {
    setLocale(newLocale)
  }

  const t = TRANSLATIONS[locale]
  const isRtl = locale === 'ar'

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`min-h-screen w-full flex flex-col lg:flex-row bg-[#FAF8F5] text-[#231f20] selection:bg-[#ffd22f]/30 ${
        isRtl ? 'font-arabic' : 'font-sans'
      }`}
    >
      {/* ============================================================
          LEFT COLUMN: MOROCCAN INSTITUTIONAL SHOWCASE (DESKTOP)
          ============================================================ */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-5/12 bg-[#181516] text-white relative overflow-hidden flex-col justify-between p-10 xl:p-14 border-e border-[#d2a82b]/30 shrink-0">
        {/* Moroccan Geometric Star Background */}
        <div
          className="absolute inset-0 moroccan-pattern opacity-35 pointer-events-none"
          aria-hidden="true"
        />

        {/* Ambient Warm Architectural Lighting */}
        <div
          className="absolute -top-32 -start-32 w-96 h-96 bg-[#d2a82b]/20 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-32 -end-32 w-96 h-96 bg-[#bd3227]/20 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        {/* 1. Top Section: Legal Framework & Seal Header */}
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#231f20] border border-[#d2a82b]/40 text-2xs font-bold text-[#ffd22f] shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#18794E] animate-pulse" />
            <span>{t.state_reference}</span>
          </div>

          <div className="pt-2 flex items-center gap-3.5">
            <div className="relative shrink-0">
              <Image
                src="/logo.png"
                alt="AMYCC Logo"
                width={52}
                height={52}
                className="object-contain w-12 h-12"
                priority
              />
            </div>
            <div>
              <h2 className="text-xl xl:text-2xl font-black text-white tracking-tight leading-snug">
                {t.association_name}
              </h2>
              <p className="text-2xs font-bold text-[#d2a82b] font-mono tracking-wide">
                {t.association_subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* 2. Middle Section: Institutional Pillars & Purpose */}
        <div className="relative z-10 space-y-6 my-auto py-8">
          <div className="space-y-2">
            <span className="text-3xs uppercase tracking-widest text-[#d2a82b] font-bold">
              {t.showcase_badge}
            </span>
            <p className="text-xs xl:text-sm text-[#cfcac2] leading-relaxed font-medium">
              {t.showcase_desc}
            </p>
          </div>

          {/* Three Feature Highlight Cards */}
          <div className="space-y-3">
            {/* Pillar 1 */}
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#231f20]/80 border border-[#383334] backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-[#d2a82b]/15 text-[#ffd22f] flex items-center justify-center shrink-0 text-base">
                🏛️
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs font-bold text-white">{t.pillar1_title}</h3>
                <p className="text-3xs text-[#a8a39b] leading-normal">{t.pillar1_desc}</p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#231f20]/80 border border-[#383334] backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-[#bd3227]/20 text-[#fde8e7] flex items-center justify-center shrink-0 text-base">
                🛡️
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs font-bold text-white">{t.pillar2_title}</h3>
                <p className="text-3xs text-[#a8a39b] leading-normal">{t.pillar2_desc}</p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#231f20]/80 border border-[#383334] backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-[#ffd22f]/15 text-[#ffd22f] flex items-center justify-center shrink-0 text-base">
                🇲🇦
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs font-bold text-white">{t.pillar3_title}</h3>
                <p className="text-3xs text-[#a8a39b] leading-normal">{t.pillar3_desc}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Bottom Section: Compliance & Engine Tag */}
        <div className="relative z-10 pt-5 border-t border-[#383334] flex items-center justify-between text-3xs text-[#8a857b]">
          <span>{t.showcase_footer}</span>
          <span className="font-mono text-[#ffd22f]">{t.engine_tag}</span>
        </div>
      </div>

      {/* ============================================================
          RIGHT COLUMN: AUTHENTICATION FORM & DIRECT ENTRY
          ============================================================ */}
      <div className="w-full lg:w-1/2 xl:w-7/12 min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 relative overflow-y-auto">
        {/* Decorative Atmospheric Glows for Form Area */}
        <div
          className="absolute top-1/4 -end-20 w-80 h-80 bg-[#ffd22f]/15 rounded-full blur-3xl pointer-events-none -z-10"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-10 start-10 w-80 h-80 bg-[#bd3227]/10 rounded-full blur-3xl pointer-events-none -z-10"
          aria-hidden="true"
        />

        {/* Top Header Row with Language Switcher & Navigation */}
        <div className="flex flex-wrap items-center justify-between w-full gap-4 pb-4">
          {/* Mobile Association Brand */}
          <div className="lg:hidden flex items-center gap-2.5">
            <Image
              src="/logo.png"
              alt="AMYCC Logo"
              width={36}
              height={36}
              className="object-contain w-8 h-8"
              priority
            />
            <span className="text-xs font-black text-[#231f20]">
              {t.association_name}
            </span>
          </div>

          <div className="flex items-center gap-3 ms-auto">
            {/* Interactive Trilingual Switcher */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-white border border-[#e5e0d6] shadow-2xs">
              {(['ar', 'fr', 'en'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => handleLocaleChange(lang)}
                  className={`px-2.5 py-1 rounded-lg text-2xs font-bold transition-all cursor-pointer ${
                    locale === lang
                      ? 'bg-[#bd3227] text-white shadow-xs'
                      : 'text-[#5C5A55] hover:text-[#231f20] hover:bg-[#FAF8F5]'
                  }`}
                >
                  {lang === 'ar' ? 'العربية' : lang === 'fr' ? 'Français' : 'English'}
                </button>
              ))}
            </div>

            {/* Back to Public Portal Link */}
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#bd3227] hover:text-[#a3261c] px-3.5 py-2 rounded-xl hover:bg-white border border-transparent hover:border-[#e5e0d6] transition-all group"
            >
              <span className="rtl:rotate-180 transition-transform group-hover:-translate-x-1 rtl:group-hover:translate-x-1">
                ←
              </span>
              <span>{t.back_to_site}</span>
            </Link>
          </div>
        </div>

        {/* Central Authentication Card */}
        <div className="w-full max-w-md mx-auto my-auto py-6 sm:py-8">
          <div className="bg-white/95 backdrop-blur-xl rounded-[28px] sm:rounded-3xl border border-[#e5e0d6] shadow-[0_20px_50px_-15px_rgba(35,31,32,0.07)] overflow-hidden">
            {/* Moroccan Signature Tricolor Ribbon */}
            <div
              className="h-1.5 w-full bg-gradient-to-r from-[#bd3227] via-[#ffd22f] to-[#d2a82b]"
              aria-hidden="true"
            />

            <div className="p-6 sm:p-9">
              {/* Card Header & Standalone Logo */}
              <div className="text-center mb-7">
                {/* Standalone Logo — No Frame or Box */}
                <div className="relative inline-flex items-center justify-center mb-3">
                  <Image
                    src="/logo.png"
                    alt="AMYCC Logo"
                    width={64}
                    height={64}
                    className="object-contain w-14 h-14 sm:w-16 sm:h-16 transition-transform duration-300 hover:scale-105"
                    priority
                  />
                </div>

                {/* Institutional Pill Badge */}
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FEF6CC] text-[#8C6A14] border border-[#d2a82b]/35 text-2xs font-bold mb-2.5 shadow-2xs">
                    <span className="text-[#d2a82b]">✦</span>
                    <span>{t.portal_badge}</span>
                  </span>
                </div>

                {/* Primary Headings */}
                <h1 className="text-2xl sm:text-[25px] font-black text-[#231f20] tracking-tight">
                  {t.card_title}
                </h1>
                <p className="text-xs text-[#5C5A55] mt-1 font-medium">
                  {t.card_subtitle}
                </p>
              </div>

              {/* Error Alert */}
              {initialError && (
                <div
                  role="alert"
                  className="p-3.5 mb-5 rounded-2xl bg-[#fde8e7] text-[#bd3227] text-xs font-bold border border-[#bd3227]/25 flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1 duration-200"
                >
                  <svg
                    className="w-4 h-4 shrink-0 mt-0.5 text-[#bd3227]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span className="leading-relaxed">{initialError}</span>
                </div>
              )}

              {/* Form */}
              <form
                action={loginAdmin}
                onSubmit={() => setIsPending(true)}
                className="space-y-4"
              >
                {/* Email Address */}
                <div>
                  <label
                    htmlFor="admin-email"
                    className="block text-2xs font-bold uppercase tracking-wider text-[#5C5A55] mb-1.5"
                  >
                    {t.email_label}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-[#5C5A55]">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.75}
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                        />
                      </svg>
                    </div>
                    <input
                      id="admin-email"
                      type="email"
                      name="email"
                      autoComplete="email"
                      required
                      className="w-full ps-10 pe-4 py-3 rounded-xl border border-[#e5e0d6] bg-[#FAF8F5]/60 hover:bg-white focus:bg-white text-sm text-[#231f20] placeholder-[#5C5A55]/50 focus:border-[#d2a82b] focus:ring-2 focus:ring-[#ffd22f]/30 outline-none transition-all font-mono"
                      placeholder={t.email_placeholder}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="admin-password"
                    className="block text-2xs font-bold uppercase tracking-wider text-[#5C5A55] mb-1.5"
                  >
                    {t.password_label}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-[#5C5A55]">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.75}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <input
                      id="admin-password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      autoComplete="current-password"
                      required
                      className="w-full ps-10 pe-11 py-3 rounded-xl border border-[#e5e0d6] bg-[#FAF8F5]/60 hover:bg-white focus:bg-white text-sm text-[#231f20] placeholder-[#5C5A55]/50 focus:border-[#d2a82b] focus:ring-2 focus:ring-[#ffd22f]/30 outline-none transition-all"
                      placeholder={t.password_placeholder}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? t.hide_password : t.show_password}
                      className="absolute inset-y-0 end-0 pe-3.5 flex items-center text-[#5C5A55] hover:text-[#231f20] focus:outline-none transition-colors cursor-pointer"
                    >
                      {showPassword ? (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.75}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.75}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.75}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full mt-2 py-3.5 px-5 rounded-xl font-bold text-white bg-[#bd3227] hover:bg-[#a3261c] active:scale-[0.99] disabled:opacity-75 disabled:pointer-events-none transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 text-sm group cursor-pointer"
                >
                  {isPending ? (
                    <>
                      <svg
                        className="animate-spin -ms-1 me-2 h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>{t.btn_submitting}</span>
                    </>
                  ) : (
                    <>
                      <span>{t.btn_submit}</span>
                      <svg
                        className="w-4 h-4 rtl:rotate-180 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </form>

              {/* Hairline Divider */}
              <div className="gold-hairline my-6 opacity-75" aria-hidden="true" />

              {/* Statutory Credentials & Security Notice */}
              <div className="rounded-xl bg-[#FAF8F5] p-3 border border-[#e5e0d6]/80 text-center space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-3xs font-bold text-[#231f20]">
                  <svg
                    className="w-3.5 h-3.5 text-[#18794E] shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <span>{t.legal_security}</span>
                </div>
                <p className="text-4xs text-[#5C5A55] font-medium">
                  {t.legal_sub}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer Row */}
        <div className="text-center pt-4 text-3xs text-[#8a857b]">
          <span>{t.footer_text}</span>
        </div>
      </div>
    </div>
  )
}

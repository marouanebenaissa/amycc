'use client'

import React, { useMemo } from 'react'
import Link from 'next/link'
import { useAdminLocale } from './AdminLocaleContext'
import type { AdminRoleMeta } from '@/lib/auth/rbac'
import { PREDEFINED_ROLES, canUserAccessPath } from '@/lib/auth/rbac'

interface AdminDashboardOverviewProps {
  userName?: string | null
  userEmail: string
  userRole?: AdminRoleMeta
  counts: {
    membershipCount: number
    volunteerCount: number
    partnershipCount: number
    donationCount: number
    registrationCount: number
    contactCount: number
    programCount: number
    eventCount: number
    newsCount: number
    staffUsersCount?: number
  }
}

export function AdminDashboardOverview({
  userName,
  userEmail,
  userRole = PREDEFINED_ROLES[0],
  counts,
}: AdminDashboardOverviewProps) {
  const { locale, isAr, isFr, t } = useAdminLocale()

  const totalInquiries =
    counts.membershipCount +
    counts.volunteerCount +
    counts.registrationCount +
    counts.partnershipCount +
    counts.contactCount +
    counts.donationCount

  // Current formatted date per active locale
  const formattedDate = useMemo(() => {
    try {
      return new Date().toLocaleDateString(
        locale === 'ar' ? 'ar-MA' : locale === 'fr' ? 'fr-FR' : 'en-US',
        {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }
      )
    } catch {
      return ''
    }
  }, [locale])

  // 6 Incoming Inboxes
  const inboxes = [
    {
      id: 'memberships',
      labelAr: 'طلبات العضوية والانخراط السنوي',
      labelFr: 'Demandes d\'Adhésion Annuelle',
      labelEn: 'Annual Membership Applications',
      descAr: 'مراجعة طلبات الانخراط وتدقيق هوية الأعضاء وتصدير القوائم الرسمية.',
      descFr: 'Examen des adhésions annuelles, validation et export des registres.',
      descEn: 'Review annual membership inquiries, verify members, and export registries.',
      count: counts.membershipCount,
      href: '/admin/memberships',
      icon: '👥',
      colorBg: 'bg-[#FAF8F5]',
      iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      badgeColor: 'bg-emerald-600',
    },
    {
      id: 'volunteers',
      labelAr: 'متطوعو مبادرة شباب في العمل',
      labelFr: 'Bénévoles Jeunesse en Action',
      labelEn: 'Youth in Action Volunteer Applicants',
      descAr: 'استمارات التطوع الميداني للشباب وتوزيع المهام على الفعاليات والورش.',
      descFr: 'Candidatures de volontariat civique et affectations aux événements.',
      descEn: 'Youth volunteering inquiries, civic orientation, and event assignments.',
      count: counts.volunteerCount,
      href: '/admin/volunteers',
      icon: '🤝',
      colorBg: 'bg-[#FAF8F5]',
      iconBg: 'bg-amber-50 text-amber-700 border-amber-200',
      badgeColor: 'bg-amber-600',
    },
    {
      id: 'registrations',
      labelAr: 'تسجيلات حضور الفعاليات الثقافية',
      labelFr: 'Inscriptions aux Événements & Ateliers',
      labelEn: 'Event & Workshop Registrations',
      descAr: 'تأكيد المقاعد، ضبط الطاقة الاستيعابية، وتتبع قوائم الحضور الرسمية.',
      descFr: 'Gestion des jauges, validation des réservations et listes de présence.',
      descEn: 'Audience ticket bookings, capacity management, and attendance check-in.',
      count: counts.registrationCount,
      href: '/admin/registrations',
      icon: '🎟️',
      colorBg: 'bg-[#FAF8F5]',
      iconBg: 'bg-blue-50 text-blue-700 border-blue-200',
      badgeColor: 'bg-blue-600',
    },
    {
      id: 'partnerships',
      labelAr: 'مقترحات الشراكة المؤسسية',
      labelFr: 'Partenariats & Mécénat Institutionnels',
      labelEn: 'Institutional Partnership Proposals',
      descAr: 'عروض التعاون المقدمة من المؤسسات الثقافية، القطاع العام، والشركاء.',
      descFr: 'Propositions de coopération d\'organismes publics, culturels et mécènes.',
      descEn: 'Cooperation proposals from cultural organizations, public entities, and patrons.',
      count: counts.partnershipCount,
      href: '/admin/partnerships',
      icon: '🏛️',
      colorBg: 'bg-[#FAF8F5]',
      iconBg: 'bg-[#fde8e7] text-[#bd3227] border-[#f8b4af]',
      badgeColor: 'bg-[#bd3227]',
    },
    {
      id: 'contacts',
      labelAr: 'رسائل واستفسارات الزوار',
      labelFr: 'Messages de Contact & Courriers',
      labelEn: 'Visitor Inquiries & Contact Messages',
      descAr: 'استفسارات ومراسلات العموم عبر الموقع الرسمي وقنوات التواصل.',
      descFr: 'Questions et messages envoyés par le public via le portail officiel.',
      descEn: 'Public questions, communications, and official outreach correspondence.',
      count: counts.contactCount,
      href: '/admin/contacts',
      icon: '💬',
      colorBg: 'bg-[#FAF8F5]',
      iconBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      badgeColor: 'bg-cyan-600',
    },
    {
      id: 'donations',
      labelAr: 'الدعم والمساهمات وبوابة CMI',
      labelFr: 'Dons & Passerelle Bancaire CMI',
      labelEn: 'Donations & CMI Payment Gateway',
      descAr: 'سجلات التبرعات الإلكترونية عبر البطاقات البنكية، والتحويلات المصرفية.',
      descFr: 'Suivi des transactions de mécénat bancaire, virements et reçus fiscaux.',
      descEn: 'Online card contributions via CMI gateway, bank wire receipts, and records.',
      count: counts.donationCount,
      href: '/admin/donations',
      icon: '💝',
      colorBg: 'bg-[#FAF8F5]',
      iconBg: 'bg-purple-50 text-purple-700 border-purple-200',
      badgeColor: 'bg-purple-600',
    },
  ]

  // Quick Operational Actions
  const operationalActions = [
    {
      titleAr: 'إضافة برنامج ثقافي جديد (3 لغات)',
      titleFr: 'Ajouter un programme culturel (Trilingue)',
      titleEn: 'Add New Cultural Program (Trilingual)',
      descAr: 'صياغة المحتوى والمسار التدريبي وربطه بالمحترفات الفنية.',
      descFr: 'Publication trilingue, parcours et ateliers créatifs.',
      descEn: 'Author trilingual syllabus, methodology, and creative workshops.',
      href: '/admin/programs/new',
      icon: '🎨',
      badgeAr: 'جديد +',
      badgeFr: 'Nouveau +',
      badgeEn: 'New +',
    },
    {
      titleAr: 'تحرير مقال أو بيان صحفي بمحرر TipTap',
      titleFr: 'Rédiger un article ou communiqué de presse',
      titleEn: 'Compose Press Release or News Article',
      descAr: 'محرر غني متكامل مع تحميل الصور والوسائط وتنسيق الأخبار.',
      descFr: 'Éditeur de texte riche avec intégration multimédia.',
      descEn: 'Rich text TipTap editor with media uploads and typography.',
      href: '/admin/news/new',
      icon: '📰',
      badgeAr: 'جديد +',
      badgeFr: 'Nouveau +',
      badgeEn: 'New +',
    },
    {
      titleAr: 'جدولة فعالية ثقافية وتحديد المقاعد',
      titleFr: 'Programmer un événement & quota de places',
      titleEn: 'Schedule Public Event & Seat Quota',
      descAr: 'تحديد التاريخ، الموقع الجغرافي بمراكش، والطاقة الاستيعابية.',
      descFr: 'Date, lieu géographique à Marrakech et gestion de jauge.',
      descEn: 'Set performance date, Marrakech venue, and booking capacity.',
      href: '/admin/events/new',
      icon: '📅',
      badgeAr: 'جديد +',
      badgeFr: 'Nouveau +',
      badgeEn: 'New +',
    },
    {
      titleAr: 'المستخدمون المشرفون ومصفوفة الصلاحيات (RBAC)',
      titleFr: 'Comptes Administrateurs & Rôles (RBAC)',
      titleEn: 'Staff Users & Role-Based Permissions (RBAC)',
      descAr: 'إضافة مشرفين جدد وتوزيع الأدوار الـ 9 بدقة وفق مبدأ الحد الأدنى.',
      descFr: 'Gestion des accès collaborateurs selon le principe du moindre privilège.',
      descEn: 'Provision staff accounts and assign from 9 predefined security roles.',
      href: '/admin/users',
      icon: '🛡️',
      badgeAr: 'أمان 🔒',
      badgeFr: 'Sécurité 🔒',
      badgeEn: 'Security 🔒',
    },
    {
      titleAr: 'ضبط بوابة الأداء CMI والحساب البنكي',
      titleFr: 'Passerelle CMI, RIB Bancaire & Mécénat',
      titleEn: 'CMI Payment Switch, Bank Wire & Patronage',
      descAr: 'بيانات الحساب البنكي الرسمي، باقات الرعاية، وتأكيدات الدفع.',
      descFr: 'Configuration bancaire officielle, paliers de don et reçus.',
      descEn: 'Official association bank account, sponsorship tiers, and CMI.',
      href: '/admin/donations',
      icon: '💳',
      badgeAr: 'مالية 💰',
      badgeFr: 'Finance 💰',
      badgeEn: 'Finance 💰',
    },
    {
      titleAr: 'الملف الشخصي والأمان واستبدال كلمة المرور',
      titleFr: 'Profil Personnel & Sécurité du Compte',
      titleEn: 'Admin Profile & Security Center',
      descAr: 'تحديث بيانات المشرف، استبدال كلمة المرور، وإدارة الجلسات.',
      descFr: 'Mettre à jour vos informations et changer votre mot de passe.',
      descEn: 'Update profile details, change password, and manage session credentials.',
      href: '/admin/profile',
      icon: '🛡️',
      badgeAr: 'أمان 🔑',
      badgeFr: 'Sécurité 🔑',
      badgeEn: 'Security 🔑',
    },
  ]

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* 1. Executive Institutional Command Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1c191a] via-[#241f20] to-[#161314] text-white p-6 sm:p-8 lg:p-10 shadow-2xl border border-white/10">
        {/* Moroccan Atmospheric Lighting Orbs */}
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#bd3227]/25 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-[#d2a82b]/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Top Metadata Badges */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/15 text-3xs font-extrabold uppercase tracking-widest text-[#ffd22f] flex items-center gap-1.5">
                <span>🇲🇦</span>
                <span>{t('legal_framework')}</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-3xs font-bold text-emerald-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{t('system_healthy')}</span>
              </span>
            </div>

            {formattedDate && (
              <span className="text-3xs sm:text-2xs text-[#e5e0d6]/80 font-medium">
                🗓️ {formattedDate}
              </span>
            )}
          </div>

          {/* Main Title & Personalized Welcome */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-white mb-1 shadow-xs">
                <span>{userRole.icon}</span>
                <span>{isAr ? userRole.nameAr : isFr ? userRole.nameFr : userRole.nameEn}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                {t('welcome_banner_title')}
              </h1>
              <p className="text-xs sm:text-sm text-[#e5e0d6]/90 leading-relaxed">
                {isAr
                  ? `مرحباً بك ${userName ? `يا ${userName}` : ''} (${userEmail}). ${t('welcome_banner_subtitle')}`
                  : isFr
                  ? `Bienvenue ${userName || ''} (${userEmail}). ${t('welcome_banner_subtitle')}`
                  : `Welcome ${userName || ''} (${userEmail}). ${t('welcome_banner_subtitle')}`}
              </p>
            </div>

            {/* Quick CTAs inside Hero */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {canUserAccessPath(userRole.key, '/admin/programs/new') && (
                <Link
                  href="/admin/programs/new"
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#bd3227] to-[#d2a82b] hover:from-[#a0281f] hover:to-[#b89123] text-white font-bold text-xs shadow-lg shadow-[#bd3227]/25 hover:shadow-xl hover:scale-102 active:scale-98 transition-all flex items-center gap-2"
                >
                  <span>+</span>
                  <span>{t('new_program')}</span>
                </Link>
              )}
              {canUserAccessPath(userRole.key, '/admin/news/new') && (
                <Link
                  href="/admin/news/new"
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#bd3227] to-[#d2a82b] hover:from-[#a0281f] hover:to-[#b89123] text-white font-bold text-xs shadow-lg shadow-[#bd3227]/25 hover:shadow-xl hover:scale-102 active:scale-98 transition-all flex items-center gap-2"
                >
                  <span>+</span>
                  <span>{isAr ? 'مقال أو بيان صحفي' : isFr ? 'Nouvel Article' : 'New Article'}</span>
                </Link>
              )}
              <Link
                href="/admin/profile"
                className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/15 backdrop-blur-xs transition-all flex items-center gap-2"
              >
                <span>👤</span>
                <span>{t('my_profile_and_security')}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Executive KPI Metric Highlights (4 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* KPI 1: Total Inquiries */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#e5e0d6] shadow-2xs hover:shadow-card hover:border-[#231f20]/20 transition-all">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-3xs font-black uppercase tracking-wider text-[#bd3227]">
              {t('kpi_inquiries')}
            </span>
            <span className="w-9 h-9 rounded-2xl bg-[#fde8e7] flex items-center justify-center text-sm shadow-xs">
              📥
            </span>
          </div>
          <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#231f20]">
            {totalInquiries}
          </div>
          <div className="text-3xs text-[#5C5A55] mt-1.5 font-medium flex items-center gap-1">
            <span>✓</span>
            <span>
              {isAr
                ? 'عضوية، تطوع، شراكات، ورسائل'
                : isFr
                ? 'Adhésions, dons & messages'
                : 'Memberships, inquiries & donors'}
            </span>
          </div>
        </div>

        {/* KPI 2: Cultural Programs */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#e5e0d6] shadow-2xs hover:shadow-card hover:border-[#231f20]/20 transition-all">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-3xs font-black uppercase tracking-wider text-[#d2a82b]">
              {t('kpi_programs')}
            </span>
            <span className="w-9 h-9 rounded-2xl bg-[#FEF6CC] flex items-center justify-center text-sm shadow-xs">
              🎨
            </span>
          </div>
          <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#231f20]">
            {counts.programCount}
          </div>
          <div className="text-3xs text-[#5C5A55] mt-1.5 font-medium flex items-center gap-1">
            <Link href="/admin/programs" className="text-[#bd3227] hover:underline font-bold">
              {isAr ? 'عرض وتعديل البرامج ↗' : isFr ? 'Voir les programmes ↗' : 'View programs ↗'}
            </Link>
          </div>
        </div>

        {/* KPI 3: Scheduled Events */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#e5e0d6] shadow-2xs hover:shadow-card hover:border-[#231f20]/20 transition-all">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-3xs font-black uppercase tracking-wider text-blue-700">
              {t('kpi_events')}
            </span>
            <span className="w-9 h-9 rounded-2xl bg-blue-50 flex items-center justify-center text-sm shadow-xs">
              📅
            </span>
          </div>
          <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#231f20]">
            {counts.eventCount}
          </div>
          <div className="text-3xs text-[#5C5A55] mt-1.5 font-medium flex items-center gap-1">
            <Link href="/admin/events" className="text-blue-700 hover:underline font-bold">
              {isAr ? 'عرض جدول الفعاليات ↗' : isFr ? 'Gérer les événements ↗' : 'Manage events ↗'}
            </Link>
          </div>
        </div>

        {/* KPI 4: Published News */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#e5e0d6] shadow-2xs hover:shadow-card hover:border-[#231f20]/20 transition-all">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-3xs font-black uppercase tracking-wider text-purple-700">
              {t('kpi_news')}
            </span>
            <span className="w-9 h-9 rounded-2xl bg-purple-50 flex items-center justify-center text-sm shadow-xs">
              📰
            </span>
          </div>
          <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#231f20]">
            {counts.newsCount}
          </div>
          <div className="text-3xs text-[#5C5A55] mt-1.5 font-medium flex items-center gap-1">
            <Link href="/admin/news" className="text-purple-700 hover:underline font-bold">
              {isAr ? 'المركز الإعلامي والأخبار ↗' : isFr ? 'Centre des médias ↗' : 'Press & News ↗'}
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Inboxes Hub (صناديق الطلبات والمشاركات الواردة) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 text-2xs font-extrabold text-[#bd3227] uppercase tracking-wider mb-0.5">
              <span>📥</span>
              <span>AMYCC Inboxes Matrix</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-[#231f20]">
              {t('inboxes_title')}
            </h2>
            <p className="text-3xs sm:text-xs text-[#5C5A55] mt-0.5">
              {t('inboxes_subtitle')}
            </p>
          </div>

          <div className="text-3xs font-bold text-[#5C5A55] self-start sm:self-auto bg-white px-3 py-1.5 rounded-xl border border-[#e5e0d6] shadow-2xs">
            {isAr ? 'الإجمالي النشط:' : isFr ? 'Total en attente:' : 'Total Active:'}{' '}
            <strong className="text-[#bd3227] font-black">{totalInquiries}</strong>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {inboxes
            .filter((item) => canUserAccessPath(userRole.key, item.href))
            .map((item) => {
            const title = isAr
              ? item.labelAr
              : isFr
              ? item.labelFr
              : item.labelEn
            const desc = isAr
              ? item.descAr
              : isFr
              ? item.descFr
              : item.descEn

            return (
              <Link
                key={item.id}
                href={item.href}
                className="p-5 sm:p-6 rounded-3xl bg-white border border-[#e5e0d6] shadow-2xs hover:shadow-card hover:border-[#bd3227]/40 transition-all flex flex-col justify-between group block"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`w-12 h-12 rounded-2xl border flex items-center justify-center text-xl shadow-xs group-hover:scale-105 transition-transform ${item.iconBg}`}
                    >
                      {item.icon}
                    </span>

                    <span className="text-2xs font-extrabold text-[#5C5A55] group-hover:text-[#bd3227] transition-colors flex items-center gap-1 bg-[#FAF8F5] px-3 py-1 rounded-full border border-[#e5e0d6]">
                      <span>{t('manage')}</span>
                      <span aria-hidden="true" className="group-hover:translate-x-0.5 transition-transform">
                        {isAr ? '←' : '→'}
                      </span>
                    </span>
                  </div>

                  <div className="text-3xl sm:text-4xl font-black text-[#231f20] mb-1">
                    {item.count}
                  </div>
                  <h3 className="text-sm font-black text-[#231f20] leading-snug mb-1 group-hover:text-[#bd3227] transition-colors">
                    {title}
                  </h3>
                  <p className="text-3xs text-[#5C5A55] leading-relaxed">
                    {desc}
                  </p>
                </div>

                <div className="pt-3 mt-4 border-t border-[#e5e0d6]/70 flex items-center justify-between text-3xs font-bold text-[#8a6e14]">
                  <span>{isAr ? 'سجل قاعدة البيانات' : isFr ? 'Registre sécurisé' : 'Database table'}</span>
                  <span className="font-mono text-4xs text-[#5C5A55]">RLS Active ✓</span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* 4. Two Comprehensive Operations & Security Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module 1: Fast Operational Actions */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e5e0d6] shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#e5e0d6]">
            <div>
              <div className="inline-flex items-center gap-1.5 text-2xs font-bold text-[#bd3227] uppercase tracking-wider mb-0.5">
                <span>⚡</span>
                <span>Operations Center</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-[#231f20]">
                {t('quick_actions_title')}
              </h2>
            </div>
            <span className="text-3xs font-mono font-bold px-2 py-1 rounded-lg bg-[#FAF8F5] text-[#5C5A55] border border-[#e5e0d6]">
              {operationalActions.filter((a) => canUserAccessPath(userRole.key, a.href)).length} Tools
            </span>
          </div>

          <div className="space-y-2.5">
            {operationalActions
              .filter((action) => canUserAccessPath(userRole.key, action.href))
              .map((action, idx) => {
              const actTitle = isAr
                ? action.titleAr
                : isFr
                ? action.titleFr
                : action.titleEn
              const actDesc = isAr
                ? action.descAr
                : isFr
                ? action.descFr
                : action.descEn
              const actBadge = isAr
                ? action.badgeAr
                : isFr
                ? action.badgeFr
                : action.badgeEn

              return (
                <Link
                  key={idx}
                  href={action.href}
                  className="p-3.5 rounded-2xl bg-[#FAF8F5] hover:bg-[#FEF6CC]/30 border border-[#e5e0d6] hover:border-[#bd3227]/30 transition-all flex items-center justify-between gap-3 group block"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-10 h-10 rounded-xl bg-white border border-[#e5e0d6] flex items-center justify-center text-lg shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                      {action.icon}
                    </span>
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-[#231f20] group-hover:text-[#bd3227] transition-colors truncate">
                        {actTitle}
                      </div>
                      <div className="text-3xs text-[#5C5A55] truncate mt-0.5">
                        {actDesc}
                      </div>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-4xs font-black bg-white border border-[#e5e0d6] text-[#bd3227] shrink-0 shadow-2xs">
                    {actBadge}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Module 2: Institutional Architecture & Platform Security */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e5e0d6] shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#e5e0d6]">
            <div>
              <div className="inline-flex items-center gap-1.5 text-2xs font-bold text-emerald-700 uppercase tracking-wider mb-0.5">
                <span>🛡️</span>
                <span>Security & Statutory Matrix</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-[#231f20]">
                {t('security_title')}
              </h2>
            </div>
            <span className="text-3xs font-mono font-bold px-2 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
              100% Enforced
            </span>
          </div>

          <div className="space-y-4 text-xs text-[#5C5A55]">
            {/* Dahir 1.58.376 */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-black text-[#231f20] text-xs">
                  {isAr ? 'الإطار القانوني المؤسسي' : isFr ? 'Cadre Légal Institutionnel' : 'Statutory Legal Framework'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-3xs font-bold">
                  ✓ {t('status_verified')}
                </span>
              </div>
              <p className="text-3xs text-[#5C5A55] leading-relaxed">
                {isAr
                  ? 'جمعية روح الفنون والثقافة خاضعة لمقتضيات الظهير الشريف رقم 1.58.376 المنظم لحق تأسيس الجمعيات بالمملكة المغربية.'
                  : isFr
                  ? 'Régie par les dispositions du Dahir n° 1.58.376 réglementant le droit d\'association au Royaume du Maroc.'
                  : 'Governed by the provisions of Moroccan Dahir No. 1.58.376 regulating non-profit cultural associations.'}
              </p>
            </div>

            {/* PostgreSQL RLS */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-black text-[#231f20] text-xs">
                  {t('rls_status')}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-3xs font-bold">
                  {t('status_active')}
                </span>
              </div>
              <p className="text-3xs text-[#5C5A55] leading-relaxed">
                {isAr
                  ? 'عزل صارم للبيانات على مستوى جداول قاعدة البيانات الـ 16 لمنع أي وصول غير مصرح به.'
                  : isFr
                  ? 'Isolation stricte des données au niveau des 16 tables pour prévenir toute fuite.'
                  : 'Strict data isolation across all 16 database tables preventing unauthorized escalation.'}
              </p>
            </div>

            {/* 9 Predefined RBAC Roles */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-black text-[#231f20] text-xs">
                  {t('rbac_status')}
                </span>
                <Link href="/admin/roles" className="text-[#bd3227] font-bold text-3xs hover:underline">
                  {isAr ? 'استعراض المصفوفة ↗' : isFr ? 'Voir la matrice ↗' : 'View Matrix ↗'}
                </Link>
              </div>
              <p className="text-3xs text-[#5C5A55] leading-relaxed">
                {isAr
                  ? 'تطبيق مبدأ الحد الأدنى من الصلاحيات (Least Privilege) على كافة حسابات المشرفين.'
                  : isFr
                  ? 'Application stricte du principe du moindre privilège sur tous les profils staff.'
                  : 'Principle of least privilege enforced across all authenticated staff accounts.'}
              </p>
            </div>

            {/* Immutable Audit Trail */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-black text-[#231f20] text-xs">
                  {t('audit_status')}
                </span>
                <Link href="/admin/audit-logs" className="text-[#bd3227] font-bold text-3xs hover:underline">
                  {isAr ? 'سجل التدقيق ↗' : isFr ? 'Journal d\'audit ↗' : 'Audit Trail ↗'}
                </Link>
              </div>
              <p className="text-3xs text-[#5C5A55] leading-relaxed">
                {isAr
                  ? 'تسجيل كل عملية دخول، تعديل محتوى، تغيير صلاحيات، أو معالجة طلب مع التوقيت وعنوان الـ IP.'
                  : isFr
                  ? 'Enregistrement sécurisé de chaque action avec horodatage, utilisateur et IP.'
                  : 'Immutable recording of logins, CMS modifications, role changes, and IP addresses.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Institutional Footer Signature */}
      <div className="pt-6 border-t border-[#e5e0d6] flex flex-col sm:flex-row items-center justify-between gap-3 text-3xs text-[#5C5A55]">
        <div className="flex items-center gap-2">
          <span>🇲🇦</span>
          <span>{t('all_rights_reserved')}</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/${locale}`} target="_blank" className="hover:text-[#bd3227] transition-colors">
            {t('view_site')} ↗
          </Link>
          <span>•</span>
          <Link href="/admin/settings" className="hover:text-[#bd3227] transition-colors">
            {t('security_title')}
          </Link>
        </div>
      </div>
    </div>
  )
}

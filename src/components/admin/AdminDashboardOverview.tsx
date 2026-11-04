'use client'

import React from 'react'
import Link from 'next/link'
import { useAdminLocale } from './AdminLocaleContext'

interface AdminDashboardOverviewProps {
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
  }
}

export function AdminDashboardOverview({ counts }: AdminDashboardOverviewProps) {
  const { isAr, isFr, t } = useAdminLocale()

  const inboxes = [
    {
      labelAr: 'طلبات العضوية والانخراط',
      labelFr: 'Demandes d\'Adhésion',
      labelEn: 'Membership Applications',
      count: counts.membershipCount,
      href: '/admin/memberships',
      icon: '👥',
      color: 'bg-[#FEF6CC] text-[#231f20]',
      badgeColor: 'bg-[#231f20]',
    },
    {
      labelAr: 'متطوعو شباب في العمل',
      labelFr: 'Bénévoles Jeunesse en Action',
      labelEn: 'Volunteer Applicants',
      count: counts.volunteerCount,
      href: '/admin/volunteers',
      icon: '🤝',
      color: 'bg-emerald-50 text-emerald-700',
      badgeColor: 'bg-emerald-600',
    },
    {
      labelAr: 'تسجيلات حضور الفعاليات',
      labelFr: 'Inscriptions aux Événements',
      labelEn: 'Event Registrations',
      count: counts.registrationCount,
      href: '/admin/registrations',
      icon: '🎟️',
      color: 'bg-blue-50 text-blue-700',
      badgeColor: 'bg-blue-600',
    },
    {
      labelAr: 'مقترحات الشراكة المؤسسية',
      labelFr: 'Partenariats Institutionnels',
      labelEn: 'Partnership Inquiries',
      count: counts.partnershipCount,
      href: '/admin/partnerships',
      icon: '🏛️',
      color: 'bg-[#fde8e7] text-[#bd3227]',
      badgeColor: 'bg-[#bd3227]',
    },
    {
      labelAr: 'رسائل التواصل والاستفسارات',
      labelFr: 'Messages de Contact',
      labelEn: 'Contact Messages',
      count: counts.contactCount,
      href: '/admin/contacts',
      icon: '💬',
      color: 'bg-amber-50 text-amber-700',
      badgeColor: 'bg-amber-600',
    },
    {
      labelAr: 'الدعم والمساهمات وبوابة CMI',
      labelFr: 'Dons & Passerelle CMI',
      labelEn: 'Donations & CMI Gateway',
      count: counts.donationCount,
      href: '/admin/donations',
      icon: '💝',
      color: 'bg-purple-50 text-purple-700',
      badgeColor: 'bg-purple-600',
    },
  ]

  const totalInquiries =
    counts.membershipCount +
    counts.volunteerCount +
    counts.registrationCount +
    counts.partnershipCount +
    counts.contactCount +
    counts.donationCount

  return (
    <div className="space-y-8">
      {/* Title & Quick Status Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#e5e0d6]">
        <div>
          <div className="flex items-center gap-2 text-3xs font-extrabold text-[#bd3227] uppercase tracking-wider mb-1">
            <span>{isAr ? 'لوحة التحكم المؤسسية' : isFr ? 'Administration Centrale' : 'Institutional Admin'}</span>
            <span>•</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {t('system_healthy')}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#231f20]">
            {isAr
              ? 'نظرة عامة وإحصائيات المنصة'
              : isFr
              ? 'Vue d\'Ensemble & Indicateurs Clés'
              : 'Platform Overview & Core Metrics'}
          </h1>
          <p className="text-xs sm:text-sm text-[#5C5A55] mt-1 font-medium">
            {isAr
              ? 'جمعية روح الفنون والثقافة (المملكة المغربية) — مركز القيادة وإدارة المحتوى والطلبات الواردة.'
              : isFr
              ? 'Association Marocaine Youth Culture & Creativity — Centre de gestion du contenu et des requêtes.'
              : 'Moroccan Youth Culture & Creativity Association — Central command for content & submissions.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/translations"
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#F5F3EE] border border-[#e5e0d6] text-xs font-bold text-[#231f20] shadow-2xs transition-colors flex items-center gap-2"
          >
            <span>🌐</span>
            <span>
              {isAr
                ? 'تتبع اكتمال الترجمة ↗'
                : isFr
                ? 'Suivi des Traductions ↗'
                : 'Translation Status ↗'}
            </span>
          </Link>
        </div>
      </div>

      {/* Primary Inboxes Metric Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-xs font-extrabold text-[#231f20] uppercase tracking-wider flex items-center gap-2">
            <span>📥</span>
            <span>
              {isAr
                ? 'الطلبات والمشاركات الواردة حديثاً'
                : isFr
                ? 'Demandes et Candidatures Entrantes'
                : 'Incoming Inquiries & Applications'}
            </span>
          </h2>
          <span className="text-3xs font-bold text-[#5C5A55]">
            {isAr ? 'الإجمالي:' : isFr ? 'Total:' : 'Total:'}{' '}
            <strong className="text-[#231f20]">{totalInquiries}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {inboxes.map((item) => {
            const label = isAr ? item.labelAr : isFr ? item.labelFr : item.labelEn

            return (
              <Link
                key={item.href}
                href={item.href}
                className="p-5 rounded-2xl bg-white border border-[#e5e0d6] shadow-2xs hover:shadow-card hover:border-[#231f20]/30 transition-all block group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${item.color} shadow-xs`}
                  >
                    {item.icon}
                  </span>
                  <span className="text-2xs font-bold text-[#5C5A55] group-hover:text-[#bd3227] transition-colors flex items-center gap-1">
                    <span>{t('manage')}</span>
                    <span aria-hidden="true">←</span>
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#231f20]">
                  {item.count}
                </div>
                <div className="text-xs font-bold text-[#231f20] mt-1 truncate">
                  {label}
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Content Counts Strip */}
      <div className="bg-white p-5 rounded-2xl border border-[#e5e0d6] shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="p-3.5 rounded-xl bg-[#F5F3EE] border border-[#e5e0d6] transition-all hover:border-[#231f20]/30">
          <span className="text-3xs text-[#5C5A55] font-bold block">
            {isAr
              ? 'البرامج الثقافية المعتمدة'
              : isFr
              ? 'Programmes Culturels Actifs'
              : 'Active Cultural Programs'}
          </span>
          <span className="text-2xl font-black text-[#231f20] mt-0.5 block">
            {counts.programCount}
          </span>
          <Link
            href="/admin/programs"
            className="text-3xs text-[#bd3227] font-bold inline-block mt-1 hover:underline"
          >
            {isAr ? 'عرض البرامج ↗' : isFr ? 'Voir les programmes ↗' : 'View Programs ↗'}
          </Link>
        </div>

        <div className="p-3.5 rounded-xl bg-[#F5F3EE] border border-[#e5e0d6] transition-all hover:border-[#231f20]/30">
          <span className="text-3xs text-[#5C5A55] font-bold block">
            {isAr
              ? 'الفعاليات والورش المجدولة'
              : isFr
              ? 'Événements & Ateliers Programmés'
              : 'Scheduled Events & Workshops'}
          </span>
          <span className="text-2xl font-black text-[#231f20] mt-0.5 block">
            {counts.eventCount}
          </span>
          <Link
            href="/admin/events"
            className="text-3xs text-[#bd3227] font-bold inline-block mt-1 hover:underline"
          >
            {isAr ? 'عرض الفعاليات ↗' : isFr ? 'Voir les événements ↗' : 'View Events ↗'}
          </Link>
        </div>

        <div className="p-3.5 rounded-xl bg-[#F5F3EE] border border-[#e5e0d6] transition-all hover:border-[#231f20]/30">
          <span className="text-3xs text-[#5C5A55] font-bold block">
            {isAr
              ? 'الأخبار والبيانات الصحفية'
              : isFr
              ? 'Articles & Communiqués Publiés'
              : 'Published News & Press'}
          </span>
          <span className="text-2xl font-black text-[#231f20] mt-0.5 block">
            {counts.newsCount}
          </span>
          <Link
            href="/admin/news"
            className="text-3xs text-[#bd3227] font-bold inline-block mt-1 hover:underline"
          >
            {isAr ? 'عرض الأخبار ↗' : isFr ? 'Voir les articles ↗' : 'View News ↗'}
          </Link>
        </div>
      </div>

      {/* Two Column Section: Quick Actions & Organized Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fast Action Shortcuts */}
        <div className="p-6 rounded-2xl bg-white border border-[#e5e0d6] shadow-2xs space-y-4">
          <h2 className="text-xs font-bold text-[#231f20] uppercase tracking-wider flex items-center gap-2">
            <span>⚡</span>
            <span>
              {isAr
                ? 'إجراءات سريعة لإدارة المحتوى'
                : isFr
                ? 'Actions Rapides d\'Administration'
                : 'Fast Administrative Actions'}
            </span>
          </h2>

          <div className="space-y-2.5">
            <Link
              href="/admin/programs/new"
              className="flex items-center justify-between p-3 rounded-xl bg-[#F5F3EE] hover:bg-[#FEF6CC] transition-colors text-xs font-bold text-[#231f20] group"
            >
              <div className="flex items-center gap-2">
                <span>🎨</span>
                <span>
                  {isAr
                    ? 'إضافة برنامج ثقافي أو فني جديد (بـ 3 لغات)'
                    : isFr
                    ? 'Ajouter un nouveau programme culturel (Trilingue)'
                    : 'Add a new Cultural Program (Trilingual)'}
                </span>
              </div>
              <span className="text-[#bd3227] text-2xs group-hover:underline">
                {isAr ? 'جديد +' : isFr ? 'Nouveau +' : 'New +'}
              </span>
            </Link>

            <Link
              href="/admin/news/new"
              className="flex items-center justify-between p-3 rounded-xl bg-[#F5F3EE] hover:bg-[#FEF6CC] transition-colors text-xs font-bold text-[#231f20] group"
            >
              <div className="flex items-center gap-2">
                <span>📰</span>
                <span>
                  {isAr
                    ? 'تحرير مقال أو بيان صحفي بمحرر TipTap الغني'
                    : isFr
                    ? 'Rédiger un article ou communiqué de presse'
                    : 'Compose News Article or Press Release'}
                </span>
              </div>
              <span className="text-[#bd3227] text-2xs group-hover:underline">
                {isAr ? 'جديد +' : isFr ? 'Nouveau +' : 'New +'}
              </span>
            </Link>

            <Link
              href="/admin/events/new"
              className="flex items-center justify-between p-3 rounded-xl bg-[#F5F3EE] hover:bg-[#FEF6CC] transition-colors text-xs font-bold text-[#231f20] group"
            >
              <div className="flex items-center gap-2">
                <span>📅</span>
                <span>
                  {isAr
                    ? 'جدولة فعالية ثقافية وتحديد الطاقة الاستيعابية'
                    : isFr
                    ? 'Planifier un événement culturel & places'
                    : 'Schedule Event & Set Capacity'}
                </span>
              </div>
              <span className="text-[#bd3227] text-2xs group-hover:underline">
                {isAr ? 'جديد +' : isFr ? 'Nouveau +' : 'New +'}
              </span>
            </Link>

            <Link
              href="/admin/donations"
              className="flex items-center justify-between p-3 rounded-xl bg-[#F5F3EE] hover:bg-[#FEF6CC] transition-colors text-xs font-bold text-[#231f20] group"
            >
              <div className="flex items-center gap-2">
                <span>💝</span>
                <span>
                  {isAr
                    ? 'ضبط بوابة الأداء CMI والحساب البنكي وباقات الرعاية'
                    : isFr
                    ? 'Configurer la passerelle CMI, RIB et mécénat'
                    : 'Manage CMI Payment Switch, Bank Wire & Patronage'}
                </span>
              </div>
              <span className="text-[#bd3227] text-2xs group-hover:underline">
                {isAr ? 'إدارة ⚙️' : isFr ? 'Gérer ⚙️' : 'Manage ⚙️'}
              </span>
            </Link>
          </div>
        </div>

        {/* System & Institutional Organization */}
        <div className="p-6 rounded-2xl bg-white border border-[#e5e0d6] shadow-2xs space-y-4">
          <h2 className="text-xs font-bold text-[#231f20] uppercase tracking-wider flex items-center gap-2">
            <span>🛡️</span>
            <span>
              {isAr
                ? 'الهيكلة والتنظيم المؤسسي'
                : isFr
                ? 'Organisation & Cadre Institutionnel'
                : 'Structure & Platform Operations'}
            </span>
          </h2>

          <div className="space-y-3 text-xs text-[#5C5A55]">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#FEF6CC]">
              <span className="font-medium">
                {isAr ? 'قاعدة البيانات المؤسسية' : isFr ? 'Base de Données PostgreSQL' : 'PostgreSQL Database'}
              </span>
              <span className="font-bold text-emerald-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />{' '}
                {isAr ? 'متصل ومؤمن' : isFr ? 'Opérationnelle' : 'Connected & Stable'}
              </span>
            </div>

            <div className="flex items-center justify-between pb-2.5 border-b border-[#FEF6CC]">
              <span className="font-medium">
                {isAr ? 'سياسات أمان البيانات (RLS)' : isFr ? 'Sécurité des Données (RLS)' : 'Row Level Security (RLS)'}
              </span>
              <span className="font-bold text-emerald-700">
                {isAr ? 'مفعلة بالكامل (16 جدولاً)' : isFr ? 'Activée (16 tables)' : 'Active (16 tables)'}
              </span>
            </div>

            <div className="flex items-center justify-between pb-2.5 border-b border-[#FEF6CC]">
              <span className="font-medium">
                {isAr ? 'الصلاحيات الإدارية المعتمدة' : isFr ? 'Matrice des Rôles (RBAC)' : 'Roles & RBAC Matrix'}
              </span>
              <Link href="/admin/roles" className="font-bold text-[#bd3227] hover:underline">
                {isAr ? 'مصفوفة الأدوار ↗' : isFr ? 'Voir les rôles ↗' : 'View Roles ↗'}
              </Link>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium">
                {isAr ? 'سجل العمليات الإدارية' : isFr ? 'Journal d\'Audit' : 'Audit Logs'}
              </span>
              <Link href="/admin/audit-logs" className="font-bold text-[#bd3227] hover:underline">
                {isAr ? 'سجل التدقيق ↗' : isFr ? 'Consulter le journal ↗' : 'Audit Trail ↗'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { TeamConfig, CommissionsConfig } from '@/lib/settings'
import { TeamManager } from '@/components/admin/TeamManager'
import { CommissionsManager } from '@/components/admin/CommissionsManager'
import { TeamHeroManager } from '@/components/admin/TeamHeroManager'
import { useAdminLocale } from './AdminLocaleContext'

export const TEAM_STRINGS = {
  ar: {
    badge: 'الهيكلة المؤسسية وفريق العمل',
    title: 'فريق العمل واللجان الوظيفية (Team & Structure)',
    subtitle: 'إدارة أعضاء المكتب التنفيذي، اللجان الوظيفية الست، وواجهة صفحة فريق العمل.',
    tabHero: 'واجهة وغلاف الصفحة (Hero)',
    tabMembers: 'أعضاء المكتب التنفيذي',
    tabCommissions: 'اللجان الوظيفية وفرق التأطير',
    previewSite: 'معاينة صفحة الفريق',
  },
  fr: {
    badge: 'Structure Institutionnelle & Équipe',
    title: 'Équipe & Commissions Fonctionnelles (Team & Structure)',
    subtitle: 'Gestion des membres du bureau exécutif, des commissions thématiques et de la page vitrine.',
    tabHero: 'En-tête & Vitrine (Hero)',
    tabMembers: 'Bureau Exécutif',
    tabCommissions: 'Commissions Thématiques',
    previewSite: 'Aperçu de la page',
  },
  en: {
    badge: 'Institutional Structure & Team',
    title: 'Team & Functional Commissions (Team & Structure)',
    subtitle: 'Manage executive board members, 6 functional commissions, and team showcase page.',
    tabHero: 'Page Showcase & Hero',
    tabMembers: 'Executive Board Members',
    tabCommissions: 'Functional Commissions',
    previewSite: 'Preview Team Page',
  },
}

interface TeamAdminTabsProps {
  teamConfig: TeamConfig
  commissionsConfig: CommissionsConfig
  defaultTeamMembers: TeamConfig['members']
  defaultCommissions: CommissionsConfig['items']
}

export function TeamAdminTabs({
  teamConfig,
  commissionsConfig,
  defaultTeamMembers,
  defaultCommissions,
}: TeamAdminTabsProps) {
  const { locale, dir } = useAdminLocale()
  const tr = TEAM_STRINGS[locale] || TEAM_STRINGS.ar
  const [activeTab, setActiveTab] = useState<'hero' | 'members' | 'commissions'>('hero')

  return (
    <div className="space-y-6" dir={dir}>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#e5e0d6]">
        <div>
          <span className="text-3xs font-extrabold uppercase text-[#bd3227] tracking-wider block mb-1">
            {tr.badge}
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-[#231f20] tracking-tight">
            {tr.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#5C5A55] mt-1">
            {tr.subtitle}
          </p>
        </div>

        <Link
          href={`/${locale}/team`}
          target="_blank"
          className="px-4 py-2 rounded-xl text-xs font-bold text-[#bd3227] bg-[#FAF8F5] hover:bg-[#F4EFE6] border border-[#e5e0d6] transition-colors flex items-center gap-1.5 self-start sm:self-auto shrink-0"
        >
          <span>{tr.previewSite}</span>
          <span>↗</span>
        </Link>
      </div>

      {/* Primary Section Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#FAF8F5] rounded-2xl border border-[#e5e0d6] w-full sm:w-fit shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveTab('hero')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeTab === 'hero'
              ? 'bg-[#231f20] text-white shadow-sm'
              : 'text-[#5C5A55] hover:text-[#231f20] hover:bg-[#F4EFE6]'
          }`}
        >
          <span>🖼️</span>
          <span>{tr.tabHero}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('members')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeTab === 'members'
              ? 'bg-[#231f20] text-white shadow-sm'
              : 'text-[#5C5A55] hover:text-[#231f20] hover:bg-[#F4EFE6]'
          }`}
        >
          <span>👥</span>
          <span>{tr.tabMembers} ({teamConfig.members.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('commissions')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeTab === 'commissions'
              ? 'bg-[#bd3227] text-white shadow-sm'
              : 'text-[#5C5A55] hover:text-[#231f20] hover:bg-[#F4EFE6]'
          }`}
        >
          <span>🎨</span>
          <span>{tr.tabCommissions} ({commissionsConfig.items.length})</span>
        </button>
      </div>

      {/* Render Active Manager */}
      {activeTab === 'hero' ? (
        <TeamHeroManager
          initialConfig={teamConfig}
        />
      ) : activeTab === 'members' ? (
        <TeamManager
          initialConfig={teamConfig}
          defaultMembers={defaultTeamMembers}
        />
      ) : (
        <CommissionsManager
          initialConfig={commissionsConfig}
          defaultItems={defaultCommissions}
        />
      )}
    </div>
  )
}

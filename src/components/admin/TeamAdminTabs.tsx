'use client'

import { useState } from 'react'
import type { TeamConfig, CommissionsConfig } from '@/lib/settings'
import { TeamManager } from '@/components/admin/TeamManager'
import { CommissionsManager } from '@/components/admin/CommissionsManager'
import { TeamHeroManager } from '@/components/admin/TeamHeroManager'

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
  const [activeTab, setActiveTab] = useState<'hero' | 'members' | 'commissions'>('hero')

  return (
    <div className="space-y-6">
      {/* Primary Section Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#F5F3EE] rounded-2xl border border-[#e5e0d6] w-full sm:w-fit shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveTab('hero')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeTab === 'hero'
              ? 'bg-[#231f20] text-white shadow-sm'
              : 'text-[#5C5A55] hover:text-[#231f20] hover:bg-[#FEF6CC]'
          }`}
        >
          <span>🖼️</span>
          <span>واجهة وغلاف صفحة الفريق (Hero)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('members')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeTab === 'members'
              ? 'bg-[#231f20] text-white shadow-sm'
              : 'text-[#5C5A55] hover:text-[#231f20] hover:bg-[#FEF6CC]'
          }`}
        >
          <span>👥</span>
          <span>أعضاء المكتب التنفيذي ({teamConfig.members.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('commissions')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeTab === 'commissions'
              ? 'bg-[#bd3227] text-white shadow-sm'
              : 'text-[#5C5A55] hover:text-[#231f20] hover:bg-[#FEF6CC]'
          }`}
        >
          <span>🎨</span>
          <span>اللجان الوظيفية وفرق التأطير ({commissionsConfig.items.length})</span>
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

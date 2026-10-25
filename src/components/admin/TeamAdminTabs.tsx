'use client'

import { useState } from 'react'
import type { TeamConfig, CommissionsConfig } from '@/lib/settings'
import { TeamManager } from '@/components/admin/TeamManager'
import { CommissionsManager } from '@/components/admin/CommissionsManager'

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
  const [activeTab, setActiveTab] = useState<'members' | 'commissions'>('members')

  return (
    <div className="space-y-6">
      {/* Primary Section Switcher Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-[#faf7f2] rounded-2xl border border-[#e5e0d6] w-full sm:w-fit shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveTab('members')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeTab === 'members'
              ? 'bg-[#0d3b43] text-white shadow-sm'
              : 'text-[#445457] hover:text-[#08242a] hover:bg-[#eae4d9]'
          }`}
        >
          <span>👥</span>
          <span>فريق العمل والمكتب التنفيذي ({teamConfig.members.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('commissions')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeTab === 'commissions'
              ? 'bg-[#c85a32] text-white shadow-sm'
              : 'text-[#445457] hover:text-[#08242a] hover:bg-[#eae4d9]'
          }`}
        >
          <span>🎨</span>
          <span>اللجان الوظيفية وفرق التأطير ({commissionsConfig.items.length})</span>
        </button>
      </div>

      {/* Render Active Manager */}
      {activeTab === 'members' ? (
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

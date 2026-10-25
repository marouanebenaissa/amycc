'use client'

import { useState } from 'react'
import type { ProgramsPageConfig } from '@/lib/settings'
import { ProgramsListManager, type AdminProgramRow } from '@/components/admin/ProgramsListManager'
import { ProgramsPageManager } from '@/components/admin/ProgramsPageManager'

interface ProgramsAdminTabsProps {
  programs: AdminProgramRow[]
  initialPageConfig: ProgramsPageConfig
  defaultPageConfig?: ProgramsPageConfig
  onUpdateStatus: (id: string, newStatus: string) => Promise<void>
  onDeleteProgram: (id: string) => Promise<void>
}

export function ProgramsAdminTabs({
  programs,
  initialPageConfig,
  defaultPageConfig,
  onUpdateStatus,
  onDeleteProgram,
}: ProgramsAdminTabsProps) {
  const [activeTab, setActiveTab] = useState<'catalog' | 'cms'>('catalog')

  return (
    <div className="space-y-6">
      {/* Primary Section Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#faf7f2] rounded-2xl border border-[#e5e0d6] w-full sm:w-fit shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveTab('catalog')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeTab === 'catalog'
              ? 'bg-[#0d3b43] text-white shadow-sm'
              : 'text-[#445457] hover:text-[#08242a] hover:bg-[#eae4d9]'
          }`}
        >
          <span>🎨</span>
          <span>كتالوج البرامج والمشاريع ({programs.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('cms')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeTab === 'cms'
              ? 'bg-[#c85a32] text-white shadow-sm'
              : 'text-[#445457] hover:text-[#08242a] hover:bg-[#eae4d9]'
          }`}
        >
          <span>⚙️</span>
          <span>إعدادات وواجهة صفحة البرامج (Page Hero & CMS)</span>
        </button>
      </div>

      {/* Render Active View */}
      {activeTab === 'catalog' ? (
        <ProgramsListManager
          initialPrograms={programs}
          onUpdateStatus={onUpdateStatus}
          onDeleteProgram={onDeleteProgram}
        />
      ) : (
        <ProgramsPageManager
          initialConfig={initialPageConfig}
          defaultConfig={defaultPageConfig}
        />
      )}
    </div>
  )
}

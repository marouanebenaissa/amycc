'use client'

import { useState } from 'react'
import type { ProgramsPageConfig } from '@/lib/settings'
import { ProgramsListManager, type AdminProgramRow } from '@/components/admin/ProgramsListManager'
import { ProgramsPageManager } from '@/components/admin/ProgramsPageManager'
import { useAdminLocale } from './AdminLocaleContext'

interface ProgramsAdminTabsProps {
  programs: AdminProgramRow[]
  initialPageConfig: ProgramsPageConfig
  defaultPageConfig?: ProgramsPageConfig
  onUpdateStatus: (id: string, newStatus: string) => Promise<void>
  onDeleteProgram: (id: string) => Promise<void>
}

export const PROGRAM_STRINGS = {
  ar: {
    badge: 'منظومة إدارة المحتوى والبرامج',
    title: 'إدارة البرامج والمشاريع الثقافية (Programs CMS)',
    subtitle: 'إدارة كتالوج المبادرات، وتخصيص واجهة ورأس صفحة البرامج، ومؤشرات الأثر بالمملكة.',
    tabCatalog: 'كتالوج البرامج والمشاريع',
    tabCms: 'إعدادات وواجهة صفحة البرامج (Page Hero & CMS)',
    searchPlaceholder: 'البحث في البرامج بالاسم، الرابط، أو المدينة...',
    filterAllCategories: 'كل المجالات',
    filterAllStatuses: 'كل الحالات',
    statusPublished: 'المنشورة فقط',
    statusDraft: 'المسودات',
    addNewProgram: 'برنامج جديد +',
    colProgram: 'البرنامج (العنوان والرابط)',
    colCategoryCity: 'المجال / المدينة',
    colStatus: 'الحالة',
    colActions: 'الإجراءات',
    publishedPublic: 'منشور ومتاح للعموم',
    draftInternal: 'مسودة داخلية',
    actionEdit: 'تعديل',
    actionPreview: 'معاينة ↗',
    actionDisable: 'تعطيل',
    actionPublish: 'نشر',
    actionDelete: 'حذف',
    nationalScope: 'نطاق وطني',
    noProgramsFound: 'لا توجد برامج مطابقة لمعايير البحث.',
    deleteConfirm: (title: string) => `هل أنت متأكد من حذف البرنامج: "${title}"؟ لا يمكن التراجع عن هذا الإجراء.`,
    categories: {
      arts: 'الفنون التشكيلية',
      music: 'التراث الموسيقي',
      theatre: 'المسرح وفنون الأداء',
      culture: 'الثقافة والتراث',
      youth: 'تمكين الشباب',
      volunteer: 'العمل التطوعي',
      education: 'التكوين الفني',
      other: 'أخرى',
    } as Record<string, string>,
  },
  fr: {
    badge: 'Gestion du Contenu & Programmes Culturels',
    title: 'Gestion des Programmes Culturels (Programs CMS)',
    subtitle: 'Pilotage du catalogue des initiatives, configuration de la page vitrine et indicateurs d\'impact.',
    tabCatalog: 'Catalogue des Programmes',
    tabCms: 'Configuration de la Page (Hero & CMS)',
    searchPlaceholder: 'Rechercher par titre, slug ou ville...',
    filterAllCategories: 'Tous les domaines',
    filterAllStatuses: 'Tous les statuts',
    statusPublished: 'Publiés uniquement',
    statusDraft: 'Brouillons',
    addNewProgram: 'Nouveau Programme +',
    colProgram: 'Programme (Titre & Lien)',
    colCategoryCity: 'Discipline / Ville',
    colStatus: 'Statut',
    colActions: 'Actions',
    publishedPublic: 'Publié et accessible',
    draftInternal: 'Brouillon interne',
    actionEdit: 'Modifier',
    actionPreview: 'Aperçu ↗',
    actionDisable: 'Désactiver',
    actionPublish: 'Publier',
    actionDelete: 'Supprimer',
    nationalScope: 'Envergure nationale',
    noProgramsFound: 'Aucun programme ne correspond à votre recherche.',
    deleteConfirm: (title: string) => `Êtes-vous certain de vouloir supprimer le programme "${title}" ? Cette action est irréversible.`,
    categories: {
      arts: 'Arts Plastiques & Visuels',
      music: 'Patrimoine Musical',
      theatre: 'Théâtre & Arts Scéniques',
      culture: 'Culture & Patrimoine',
      youth: 'Émancipation des Jeunes',
      volunteer: 'Bénévolat & Engagement',
      education: 'Formation Artistique',
      other: 'Autre',
    } as Record<string, string>,
  },
  en: {
    badge: 'Content & Cultural Programs CMS',
    title: 'Cultural Programs & Initiatives (Programs CMS)',
    subtitle: 'Manage initiative catalog, customize page hero & showcase, and monitor impact metrics.',
    tabCatalog: 'Programs Catalog',
    tabCms: 'Page Hero & CMS Settings',
    searchPlaceholder: 'Search programs by title, slug, or city...',
    filterAllCategories: 'All Categories',
    filterAllStatuses: 'All Statuses',
    statusPublished: 'Published Only',
    statusDraft: 'Drafts',
    addNewProgram: 'New Program +',
    colProgram: 'Program (Title & Slug)',
    colCategoryCity: 'Category / City',
    colStatus: 'Status',
    colActions: 'Actions',
    publishedPublic: 'Published & Live',
    draftInternal: 'Internal Draft',
    actionEdit: 'Edit',
    actionPreview: 'Preview ↗',
    actionDisable: 'Disable',
    actionPublish: 'Publish',
    actionDelete: 'Delete',
    nationalScope: 'Nationwide Scope',
    noProgramsFound: 'No programs match your search criteria.',
    deleteConfirm: (title: string) => `Are you sure you want to delete program "${title}"? This action cannot be undone.`,
    categories: {
      arts: 'Visual Arts',
      music: 'Musical Heritage',
      theatre: 'Theatre & Performing Arts',
      culture: 'Culture & Heritage',
      youth: 'Youth Empowerment',
      volunteer: 'Volunteering & Civic Action',
      education: 'Artistic Education',
      other: 'Other',
    } as Record<string, string>,
  },
}

export function ProgramsAdminTabs({
  programs,
  initialPageConfig,
  defaultPageConfig,
  onUpdateStatus,
  onDeleteProgram,
}: ProgramsAdminTabsProps) {
  const { locale, dir } = useAdminLocale()
  const tr = PROGRAM_STRINGS[locale] || PROGRAM_STRINGS.ar
  const [activeTab, setActiveTab] = useState<'catalog' | 'cms'>('catalog')

  return (
    <div className="space-y-6" dir={dir}>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e5e0d6] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#bd3227] animate-pulse" />
            <span className="text-2xs font-extrabold tracking-widest uppercase text-[#bd3227]">
              {tr.badge}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#231f20] tracking-tight">
            {tr.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#5C5A55] mt-1 max-w-2xl font-medium">
            {tr.subtitle}
          </p>
        </div>
      </div>

      {/* Primary Section Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#FAF8F5] rounded-2xl border border-[#e5e0d6] w-full sm:w-fit shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveTab('catalog')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeTab === 'catalog'
              ? 'bg-[#231f20] text-white shadow-sm'
              : 'text-[#5C5A55] hover:text-[#231f20] hover:bg-[#F4EFE6]'
          }`}
        >
          <span>🎨</span>
          <span>{tr.tabCatalog} ({programs.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('cms')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeTab === 'cms'
              ? 'bg-[#bd3227] text-white shadow-sm'
              : 'text-[#5C5A55] hover:text-[#231f20] hover:bg-[#F4EFE6]'
          }`}
        >
          <span>⚙️</span>
          <span>{tr.tabCms}</span>
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

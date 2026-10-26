'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type AdminLocale = 'ar' | 'fr' | 'en'

export interface AdminNavSubItem {
  href: string
  labelAr: string
  labelFr: string
  labelEn: string
  descAr?: string
  descFr?: string
  descEn?: string
  icon: string
  badge?: string
}

export interface AdminNavCategory {
  id: string
  titleAr: string
  titleFr: string
  titleEn: string
  icon: string
  items: AdminNavSubItem[]
}

export const ADMIN_NAV_CATEGORIES: AdminNavCategory[] = [
  {
    id: 'dashboard',
    titleAr: 'الرئيسية والمتابعة',
    titleFr: 'Tableau de Bord & Suivi',
    titleEn: 'Dashboard & Overview',
    icon: '📊',
    items: [
      {
        href: '/admin',
        labelAr: 'نظرة عامة وإحصائيات',
        labelFr: 'Vue d\'ensemble & Métriques',
        labelEn: 'Overview & Statistics',
        descAr: 'مؤشرات الأداء السريعة والطلبات الواردة',
        descFr: 'Indicateurs clés et demandes entrantes',
        descEn: 'Key metrics and incoming submissions',
        icon: '📊',
      },
      {
        href: '/admin/translations',
        labelAr: 'تتبع اكتمال الترجمات',
        labelFr: 'Suivi des Traductions',
        labelEn: 'Translations Tracker',
        descAr: 'حالة اللغات الثلاث لكافة المحتويات',
        descFr: 'État des trois langues pour les contenus',
        descEn: 'Trilingual status for all site contents',
        icon: '🌐',
      },
    ],
  },
  {
    id: 'content',
    titleAr: 'إدارة المحتوى والبرامج',
    titleFr: 'Gestion Contenu & Programmes',
    titleEn: 'Content & Programs CMS',
    icon: '🎨',
    items: [
      {
        href: '/admin/pages',
        labelAr: 'الصفحات والأقسام',
        labelFr: 'Pages & Sections',
        labelEn: 'Pages & Layout CMS',
        descAr: 'الواجهة الرئيسية، عن الجمعية، والتذييل',
        descFr: 'Accueil, à propos et pied de page',
        descEn: 'Hero, About, Mission & Footer',
        icon: '📄',
      },
      {
        href: '/admin/programs',
        labelAr: 'البرامج الثقافية',
        labelFr: 'Programmes Culturels',
        labelEn: 'Cultural Programs',
        descAr: 'المحترفات، الإنتاج المسرحي والسينمائي',
        descFr: 'Ateliers, théâtre et cinéma citoyen',
        descEn: 'Workshops, theatre & creative labs',
        icon: '🎨',
      },
      {
        href: '/admin/annual-program',
        labelAr: 'البرنامج السنوي',
        labelFr: 'Programme Annuel',
        labelEn: 'Annual Program',
        descAr: 'فصول السنة الأربعة والمواعيد الكبرى',
        descFr: 'Les 4 saisons et grands rendez-vous',
        descEn: 'Four seasons & annual milestones',
        icon: '🗓️',
      },
      {
        href: '/admin/events',
        labelAr: 'الفعاليات والورش',
        labelFr: 'Événements & Ateliers',
        labelEn: 'Events & Workshops',
        descAr: 'العروض المباشرة، التواريخ والطاقة الاستيعابية',
        descFr: 'Spectacles, dates et jauges de places',
        descEn: 'Live events, dates and attendance capacity',
        icon: '📅',
      },
      {
        href: '/admin/news',
        labelAr: 'الأخبار والبيانات الصحفية',
        labelFr: 'Actualités & Communiqués',
        labelEn: 'News & Press Releases',
        descAr: 'البلاغات الرسمية والتغطيات الإعلامية',
        descFr: 'Communiqués et couvertures de presse',
        descEn: 'Official statements & media coverage',
        icon: '📰',
      },
      {
        href: '/admin/areas',
        labelAr: 'مجالات التدخل الفني',
        labelFr: 'Disciplines d\'Intervention',
        labelEn: 'Core Disciplines',
        descAr: 'المحاور الإبداعية الأربعة المعتمدة',
        descFr: 'Quatre disciplines artistiques phares',
        descEn: 'Four statutory cultural disciplines',
        icon: '🎯',
      },
      {
        href: '/admin/impact',
        labelAr: 'الأثر المجتمعي',
        labelFr: 'Impact Communautaire',
        labelEn: 'Community Impact',
        descAr: 'أرقام المستفيدين وقصص النجاح بالمغرب',
        descFr: 'Bénéficiaires et récits d\'impact',
        descEn: 'Civic metrics and youth success stories',
        icon: '🌟',
      },
      {
        href: '/admin/team',
        labelAr: 'فريق العمل والهيكلة',
        labelFr: 'Équipe & Structure',
        labelEn: 'Team & Structure',
        descAr: 'المكتب التنفيذي واللجان الوظيفية',
        descFr: 'Bureau exécutif et commissions',
        descEn: 'Executive board & commissions',
        icon: '👥',
      },
      {
        href: '/admin/faqs',
        labelAr: 'الأسئلة الشائعة',
        labelFr: 'Foire Aux Questions',
        labelEn: 'FAQ Management',
        descAr: 'إجابات واضحة للجمهور والمهتمين',
        descFr: 'Réponses claires pour le public',
        descEn: 'Official trilingual FAQ answers',
        icon: '❓',
      },
    ],
  },
  {
    id: 'inboxes',
    titleAr: 'صندوق الطلبات والمشاركات',
    titleFr: 'Boîte de Réception & Demandes',
    titleEn: 'Inboxes & Applications',
    icon: '📥',
    items: [
      {
        href: '/admin/memberships',
        labelAr: 'طلبات العضوية والانخراط',
        labelFr: 'Demandes d\'Adhésion',
        labelEn: 'Membership Applications',
        descAr: 'مراجعة المترشحين للانخراط السنوي',
        descFr: 'Traitement des adhésions annuelles',
        descEn: 'Annual membership applicants inbox',
        icon: '👥',
      },
      {
        href: '/admin/volunteers',
        labelAr: 'متطوعو شباب في العمل',
        labelFr: 'Bénévoles Jeunesse en Action',
        labelEn: 'Youth in Action Volunteers',
        descAr: 'استمارات التطوع والمبادرات الميدانية',
        descFr: 'Candidatures de bénévolat civique',
        descEn: 'Youth volunteering inquiries',
        icon: '🤝',
      },
      {
        href: '/admin/registrations',
        labelAr: 'تسجيلات الفعاليات',
        labelFr: 'Inscriptions aux Événements',
        labelEn: 'Event Registrations',
        descAr: 'قوائم الحضور وتأكيد المقاعد',
        descFr: 'Listes des participants inscrits',
        descEn: 'Attendee lists and seat bookings',
        icon: '🎟️',
      },
      {
        href: '/admin/partnerships',
        labelAr: 'الشراكات المؤسسية',
        labelFr: 'Partenariats Institutionnels',
        labelEn: 'Institutional Partnerships',
        descAr: 'عروض التعاون ورعاية المشاريع',
        descFr: 'Propositions de coopération et mécénat',
        descEn: 'Institutional partnership proposals',
        icon: '🏛️',
      },
      {
        href: '/admin/contacts',
        labelAr: 'رسائل التواصل',
        labelFr: 'Messages de Contact',
        labelEn: 'Contact Messages',
        descAr: 'استفسارات ومراسلات الزوار',
        descFr: 'Courriers et questions des visiteurs',
        descEn: 'Visitor inquiries and general messages',
        icon: '💬',
      },
      {
        href: '/admin/donations',
        labelAr: 'الدعم وبوابة الأداء CMI',
        labelFr: 'Dons & Passerelle CMI',
        labelEn: 'Donations & CMI Gateway',
        descAr: 'إدارة التبرعات، الحساب البنكي، وباقات الرعاية',
        descFr: 'Passerelle bancaire, RIB et mécénat',
        descEn: 'Online card gateway, bank wire & patronage',
        icon: '💝',
      },
    ],
  },
  {
    id: 'system',
    titleAr: 'النظام والأمان',
    titleFr: 'Système & Sécurité',
    titleEn: 'System & Security',
    icon: '⚙️',
    items: [
      {
        href: '/admin/settings',
        labelAr: 'إعدادات المنصة والهوية',
        labelFr: 'Paramètres Généraux',
        labelEn: 'Platform Settings',
        descAr: 'بيانات الجمعية الرسمية وقنوات التواصل',
        descFr: 'Identité officielle et réseaux sociaux',
        descEn: 'Official association info & socials',
        icon: '⚙️',
      },
      {
        href: '/admin/users',
        labelAr: 'المستخدمون المشرفون',
        labelFr: 'Comptes Administrateurs',
        labelEn: 'Staff Users',
        descAr: 'إدارة حسابات الفريق الإداري',
        descFr: 'Gestion des comptes administratifs',
        descEn: 'Manage admin and staff accounts',
        icon: '👤',
      },
      {
        href: '/admin/roles',
        labelAr: 'الصلاحيات والأدوار (RBAC)',
        labelFr: 'Rôles & Permissions',
        labelEn: 'Roles & RBAC',
        descAr: 'توزيع الصلاحيات حسب المهام الإدارية',
        descFr: 'Attribution des prérogatives d\'accès',
        descEn: 'Role-based access matrix',
        icon: '🛡️',
      },
      {
        href: '/admin/audit-logs',
        labelAr: 'سجل التدقيق المؤسسي',
        labelFr: 'Journal d\'Audit',
        labelEn: 'Audit Logs',
        descAr: 'توثيق وتتبع كل العمليات الإدارية',
        descFr: 'Historique sécurisé de chaque action',
        descEn: 'Immutable log of administrative operations',
        icon: '📜',
      },
    ],
  },
]

interface AdminLocaleContextType {
  locale: AdminLocale
  setLocale: (loc: AdminLocale) => void
  dir: 'rtl' | 'ltr'
  isAr: boolean
  isFr: boolean
  isEn: boolean
  t: (key: string) => string
}

const UI_STRINGS: Record<AdminLocale, Record<string, string>> = {
  ar: {
    admin_title: 'لوحة التحكم المؤسسية',
    association_name: 'جمعية روح الفنون والثقافة',
    search_placeholder: 'بحث سريع في أقسام لوحة التحكم...',
    no_results: 'لا توجد نتائج مطابقة لبحثك',
    view_site: 'عرض الموقع العام',
    sign_out: 'تسجيل الخروج',
    authenticated_admin: 'الحساب الإداري الموثّق',
    collapse_menu: 'تصغير القائمة',
    expand_menu: 'توسيع القائمة',
    language: 'لغة لوحة التحكم',
    quick_stats: 'إحصائيات سريعة',
    system_healthy: 'النظام متصل ومستقر',
    manage: 'إدارة',
    total_sections: 'قسم إداري منظم',
  },
  fr: {
    admin_title: 'Administration Institutionnelle',
    association_name: 'Association Marocaine Youth Culture & Creativity',
    search_placeholder: 'Recherche rapide dans l\'administration...',
    no_results: 'Aucune section correspondante',
    view_site: 'Voir le Site Public',
    sign_out: 'Déconnexion',
    authenticated_admin: 'Compte Administrateur Authentifié',
    collapse_menu: 'Réduire le menu',
    expand_menu: 'Agrandir le menu',
    language: 'Langue de l\'Admin',
    quick_stats: 'Statistiques rapides',
    system_healthy: 'Système connecté et sécurisé',
    manage: 'Gérer',
    total_sections: 'sections administratives',
  },
  en: {
    admin_title: 'AMYCC Institutional Admin',
    association_name: 'Moroccan Youth Culture & Creativity Association',
    search_placeholder: 'Quick search admin sections...',
    no_results: 'No matching sections found',
    view_site: 'Visit Public Site',
    sign_out: 'Sign Out',
    authenticated_admin: 'Verified Staff Administrator',
    collapse_menu: 'Collapse sidebar',
    expand_menu: 'Expand sidebar',
    language: 'Admin Language',
    quick_stats: 'Quick Overview',
    system_healthy: 'Database connected & secure',
    manage: 'Manage',
    total_sections: 'organized modules',
  },
}

const AdminLocaleContext = createContext<AdminLocaleContextType | null>(null)

export function AdminLocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<AdminLocale>(() => {
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

  useEffect(() => {
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = locale
  }, [locale])

  function setLocale(newLocale: AdminLocale) {
    setLocaleState(newLocale)
    try {
      localStorage.setItem('amycc_admin_locale', newLocale)
      document.cookie = `admin_locale=${newLocale}; path=/; max-age=31536000`
    } catch {
      // Ignore
    }
  }

  const dir = locale === 'ar' ? 'rtl' : 'ltr'
  const isAr = locale === 'ar'
  const isFr = locale === 'fr'
  const isEn = locale === 'en'

  function t(key: string): string {
    return UI_STRINGS[locale]?.[key] || UI_STRINGS.ar[key] || key
  }

  return (
    <AdminLocaleContext.Provider
      value={{
        locale,
        setLocale,
        dir,
        isAr,
        isFr,
        isEn,
        t,
      }}
    >
      <div dir={dir} className={dir === 'rtl' ? 'font-arabic' : 'font-sans'}>
        {children}
      </div>
    </AdminLocaleContext.Provider>
  )
}

export function useAdminLocale() {
  const ctx = useContext(AdminLocaleContext)
  if (!ctx) {
    throw new Error('useAdminLocale must be used within an AdminLocaleProvider')
  }
  return ctx
}

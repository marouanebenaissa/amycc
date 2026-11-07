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
        href: '/admin/pages',
        labelAr: 'إدارة الصفحات والأقسام',
        labelFr: 'Pages & Sections CMS',
        labelEn: 'Pages & Sections CMS',
        descAr: 'دليل كافة صفحات المنصة والتحرير المباشر',
        descFr: 'Répertoire complet des 14 pages publiques',
        descEn: 'Complete directory of all 14 site pages',
        icon: '📄',
      },
      {
        href: '/admin/team',
        labelAr: 'فريق العمل والهيكلة',
        labelFr: 'Équipe & Direction',
        labelEn: 'Team & Structure',
        descAr: 'المكتب التنفيذي واللجان الوظيفية',
        descFr: 'Bureau exécutif et commissions',
        descEn: 'Executive board & commissions',
        icon: '👥',
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
        labelAr: 'رسائل وقنوات التواصل (الشبكات)',
        labelFr: 'Contact & Réseaux Sociaux',
        labelEn: 'Contact & Social Channels',
        descAr: 'مواقع التواصل الاجتماعي (Footer) والرسائل',
        descFr: 'Réseaux sociaux (Footer) et messagerie',
        descEn: 'Social media channels (Footer) & inbox',
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
        labelAr: 'المستخدمون والصلاحيات (RBAC)',
        labelFr: 'Utilisateurs & Permissions RBAC',
        labelEn: 'Staff Users & RBAC Matrix',
        descAr: 'إدارة حسابات الفريق والمصفوفة الأمنية للأدوار',
        descFr: 'Gestion des comptes et matrice des 9 rôles',
        descEn: 'Staff accounts and 9 predefined security roles',
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
    search_placeholder: 'بحث سريع في أقسام لوحة التحكم (اضغط / للبحث)...',
    no_results: 'لا توجد نتائج مطابقة لبحثك',
    view_site: 'عرض الموقع العام',
    sign_out: 'تسجيل الخروج',
    authenticated_admin: 'الحساب الإداري الموثّق',
    collapse_menu: 'تصغير القائمة',
    expand_menu: 'توسيع القائمة',
    language: 'لغة لوحة التحكم',
    quick_stats: 'إحصائيات سريعة',
    system_healthy: 'النظام متصل ومستقر',
    manage: 'إدارة وتفاصيل',
    total_sections: 'أقسام إدارية منظمة',
    quick_create: 'إضافة سريعة +',
    new_program: 'برنامج ثقافي جديد',
    new_event: 'فعالية أو ورشة جديدة',
    new_news: 'بيان صحفي أو مقال',
    new_user: 'مشرف إداري جديد',
    legal_framework: 'المملكة المغربية • الظهير الشريف رقم 1.58.376',
    online_status: 'متصل ومؤمن',
    welcome_banner_title: 'مركز القيادة والتدبير المؤسساتي',
    welcome_banner_subtitle: 'فضاء الإشراف المركزي للمكتب التنفيذي والمسؤولين المخولين لإدارة البرامج، تنظيم الفعاليات، ومتابعة صناديق الطلبات.',
    kpi_inquiries: 'إجمالي الطلبات والمشاركات',
    kpi_programs: 'البرامج الثقافية المعتمدة',
    kpi_events: 'الفعاليات المبرمجة',
    kpi_news: 'المقالات والأخبار المنشورة',
    inboxes_title: 'صناديق الطلبات والمشاركات الواردة',
    inboxes_subtitle: 'معالجة فورية لكافة طلبات الانخراط، التطوع، الشراكات، والرسائل الواردة من الجمهور.',
    quick_actions_title: 'إجراءات تشغيلية سريعة',
    security_title: 'الأمان والتنظيم المؤسسي',
    database_status: 'قاعدة بيانات PostgreSQL',
    rls_status: 'سياسات حماية البيانات (RLS)',
    rbac_status: 'مصفوفة الأدوار والصلاحيات (9 أدوار)',
    audit_status: 'سجل العمليات والتدقيق المؤسسي',
    status_active: 'مفعل ومؤمن 100%',
    status_verified: 'مطابق وموثق',
    view_details: 'عرض التفاصيل',
    my_profile_and_security: 'الملف الشخصي والأمان',
    profile_settings: 'إعدادات الحساب والملف الشخصي',
    change_password: 'استبدال كلمة المرور',
    all_rights_reserved: 'كافة الحقوق محفوظة لجمعية روح الفنون والثقافة — AMYCC',
  },
  fr: {
    admin_title: 'Administration Institutionnelle',
    association_name: 'Association Marocaine Youth Culture & Creativity',
    search_placeholder: 'Recherche rapide (appuyez sur / pour chercher)...',
    no_results: 'Aucune section correspondante',
    view_site: 'Voir le Site Public',
    sign_out: 'Déconnexion',
    authenticated_admin: 'Compte Administrateur Authentifié',
    collapse_menu: 'Réduire le menu',
    expand_menu: 'Agrandir le menu',
    language: 'Langue de l\'Administration',
    quick_stats: 'Statistiques rapides',
    system_healthy: 'Système connecté et sécurisé',
    manage: 'Gérer & Détails',
    total_sections: 'sections administratives',
    quick_create: 'Création Rapide +',
    new_program: 'Nouveau programme culturel',
    new_event: 'Nouvel événement ou atelier',
    new_news: 'Nouvel article ou communiqué',
    new_user: 'Nouveau collaborateur',
    legal_framework: 'Royaume du Maroc • Dahir n° 1.58.376',
    online_status: 'En ligne & Sécurisé',
    welcome_banner_title: 'Centre de Commandement & Pilotage Institutionnel',
    welcome_banner_subtitle: 'Espace de supervision dédié au bureau exécutif et aux responsables pour piloter les programmes et candidatures.',
    kpi_inquiries: 'Total des Requêtes Entrantes',
    kpi_programs: 'Programmes Culturels Actifs',
    kpi_events: 'Événements Programmés',
    kpi_news: 'Articles & Communiqués Publiés',
    inboxes_title: 'Boîtes de Réception & Demandes Entrantes',
    inboxes_subtitle: 'Traitement en temps réel des adhésions, candidatures de bénévolat, partenariats et messages.',
    quick_actions_title: 'Actions Opérationnelles Rapides',
    security_title: 'Sécurité & Organisation Institutionnelle',
    database_status: 'Base de données PostgreSQL',
    rls_status: 'Sécurité au niveau des lignes (RLS)',
    rbac_status: 'Matrice des rôles & permissions (9 rôles)',
    audit_status: 'Journal d\'audit immuable',
    status_active: '100% Actif & Sécurisé',
    status_verified: 'Conforme & Enregistré',
    view_details: 'Voir les détails',
    my_profile_and_security: 'Profil & Sécurité',
    profile_settings: 'Paramètres du Profil',
    change_password: 'Changer le Mot de Passe',
    all_rights_reserved: 'Tous droits réservés à l\'Association AMYCC',
  },
  en: {
    admin_title: 'AMYCC Institutional Admin',
    association_name: 'Spirit of Arts & Culture Association',
    search_placeholder: 'Quick search admin modules (press / to focus)...',
    no_results: 'No matching sections found',
    view_site: 'Visit Public Site',
    sign_out: 'Sign Out',
    authenticated_admin: 'Verified Staff Administrator',
    collapse_menu: 'Collapse sidebar',
    expand_menu: 'Expand sidebar',
    language: 'Admin Language',
    quick_stats: 'Executive Overview',
    system_healthy: 'Database connected & secure',
    manage: 'Manage & Details',
    total_sections: 'organized modules',
    quick_create: 'Quick Create +',
    new_program: 'New Cultural Program',
    new_event: 'New Event or Workshop',
    new_news: 'New Press Article',
    new_user: 'New Staff User',
    legal_framework: 'Kingdom of Morocco • Dahir No. 1.58.376',
    online_status: 'Online & Protected',
    welcome_banner_title: 'Institutional Command & Overview',
    welcome_banner_subtitle: 'Executive operations center for overseeing programs, scheduling cultural events, and processing submissions.',
    kpi_inquiries: 'Incoming Submissions & Inboxes',
    kpi_programs: 'Active Cultural Programs',
    kpi_events: 'Scheduled Public Events',
    kpi_news: 'Published Press Articles',
    inboxes_title: 'Inboxes & Incoming Applications',
    inboxes_subtitle: 'Real-time workflow for annual memberships, volunteer applications, partnerships, and visitor inquiries.',
    quick_actions_title: 'Fast Operational Actions',
    security_title: 'Security & Institutional Architecture',
    database_status: 'PostgreSQL Database Engine',
    rls_status: 'Row Level Security Policies (RLS)',
    rbac_status: 'Role-Based Access Control Matrix (9 Roles)',
    audit_status: 'Immutable Audit Trail',
    status_active: '100% Enforced & Active',
    status_verified: 'Compliant & Verified',
    view_details: 'View Details',
    my_profile_and_security: 'Profile & Security',
    profile_settings: 'Profile Settings',
    change_password: 'Change Password',
    all_rights_reserved: 'All rights reserved — AMYCC Association',
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

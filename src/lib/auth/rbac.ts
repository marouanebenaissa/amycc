export type AdminRoleKey =
  | 'super_admin'
  | 'content_manager'
  | 'communications_manager'
  | 'membership_manager'
  | 'volunteer_coordinator'
  | 'programs_events_manager'
  | 'partnership_manager'
  | 'finance_manager'
  | 'reviewer'

export interface AdminRoleMeta {
  id: number
  key: AdminRoleKey
  name: string
  nameAr: string
  nameFr: string
  nameEn: string
  descriptionAr: string
  descriptionFr: string
  descriptionEn: string
  icon: string
  badgeColor: string
  scopeAr: string[]
  scopeFr: string[]
  scopeEn: string[]
  allowedPaths: string[]
}

export const PREDEFINED_ROLES: AdminRoleMeta[] = [
  {
    id: 1,
    key: 'super_admin',
    name: 'super_admin',
    nameAr: 'مدير عام النظام',
    nameFr: 'Super Administrateur',
    nameEn: 'Super Administrator',
    icon: '🛡️',
    badgeColor: 'bg-[#fde8e7] text-[#bd3227] border-[#f8b4af]',
    descriptionAr: 'صلاحيات كاملة وغير مقيدة لإدارة كافة إعدادات النظام، المستخدمين، الصلاحيات، سجلات التدقيق، والمحتوى.',
    descriptionFr: 'Accès complet et sans restriction à la gestion du système, des utilisateurs, des permissions et des audits.',
    descriptionEn: 'Full, unrestricted access to all system settings, user roles, security audits, and institutional records.',
    scopeAr: ['النظام والأمان', 'المستخدمون والأدوار', 'المحتوى والبرامج', 'العضوية والتطوع', 'سجل التدقيق'],
    scopeFr: ['Système & Sécurité', 'Utilisateurs & Rôles', 'CMS & Programmes', 'Adhésions & Bénévolat', 'Audits'],
    scopeEn: ['System & Security', 'Users & Roles', 'CMS & Programs', 'Memberships & Volunteers', 'Audit Logs'],
    allowedPaths: ['*'],
  },
  {
    id: 2,
    key: 'content_manager',
    name: 'content_manager',
    nameAr: 'مدير المحتوى والبرامج',
    nameFr: 'Responsable Contenu & Programmes',
    nameEn: 'Content & Programs Manager',
    icon: '🎨',
    badgeColor: 'bg-[#FEF6CC] text-[#8a6e14] border-[#d2a82b]',
    descriptionAr: 'إنشاء وتحرير ونشر صفحات الموقع، البرامج الثقافية، المحترفات الإبداعية، والبرنامج السنوي.',
    descriptionFr: 'Création, édition et publication des pages, des programmes culturels et de la feuille de route annuelle.',
    descriptionEn: 'Create, edit, and publish website pages, cultural programs, creative workshops, and annual roadmap.',
    scopeAr: ['الصفحات والأقسام', 'البرامج الثقافية', 'البرنامج السنوي', 'المحترفات'],
    scopeFr: ['Pages & Sections', 'Programmes Culturels', 'Programme Annuel', 'Ateliers'],
    scopeEn: ['Pages & CMS', 'Cultural Programs', 'Annual Roadmap', 'Creative Labs'],
    allowedPaths: [
      '/admin',
      '/admin/programs',
      '/admin/annual-program',
      '/admin/events',
      '/admin/pages',
      '/admin/team',
      '/admin/areas',
      '/admin/faqs',
      '/admin/impact',
      '/admin/profile',
    ],
  },
  {
    id: 3,
    key: 'communications_manager',
    name: 'communications_manager',
    nameAr: 'مسؤول التواصل والإعلام',
    nameFr: 'Responsable Communication & Médias',
    nameEn: 'Communications & Media Manager',
    icon: '📢',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    descriptionAr: 'تحرير ونشر المقالات والأخبار الصحفية، إدارة الوسائط، واستقبال والرد على رسائل واستفسارات الزوار.',
    descriptionFr: 'Publication des communiqués et articles, médiathèque, et traitement des messages entrants.',
    descriptionEn: 'Publish press releases, news articles, multimedia assets, and respond to public contact messages.',
    scopeAr: ['الأخبار والمقالات', 'مكتبة الوسائط', 'رسائل التواصل'],
    scopeFr: ['Actualités & Médias', 'Médiathèque', 'Messages de Contact'],
    scopeEn: ['News & Articles', 'Media Library', 'Contact Messages'],
    allowedPaths: [
      '/admin',
      '/admin/news',
      '/admin/contacts',
      '/admin/profile',
    ],
  },
  {
    id: 4,
    key: 'membership_manager',
    name: 'membership_manager',
    nameAr: 'مسؤول شؤون الأعضاء',
    nameFr: 'Responsable Adhésions & Membres',
    nameEn: 'Membership & Members Manager',
    icon: '👥',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    descriptionAr: 'فحص ومراجعة استمارات الانخراط السنوي، الموافقة والرفض، وتصدير قواعد بيانات الأعضاء الرسمية.',
    descriptionFr: 'Traitement et validation des candidatures d\'adhésion, gestion du fichier des membres.',
    descriptionEn: 'Review and approve annual membership applications, manage member records, and export lists.',
    scopeAr: ['طلبات العضوية', 'تصدير المنخرطين', 'إحصائيات الأعضاء'],
    scopeFr: ['Demandes d\'Adhésion', 'Export Membres', 'Statistiques'],
    scopeEn: ['Membership Applications', 'Member Exports', 'Member Analytics'],
    allowedPaths: [
      '/admin',
      '/admin/memberships',
      '/admin/profile',
    ],
  },
  {
    id: 5,
    key: 'volunteer_coordinator',
    name: 'volunteer_coordinator',
    nameAr: 'منسق متطوعي شباب في العمل',
    nameFr: 'Coordinateur des Bénévoles',
    nameEn: 'Volunteer Coordinator',
    icon: '🤝',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    descriptionAr: 'إدارة استمارات برنامج شباب في العمل، التنسيق الميداني للشباب، وتوزيع المهام على الفعاليات.',
    descriptionFr: 'Coordination du programme Jeunesse en Action, recrutement civique et encadrement terrain.',
    descriptionEn: 'Coordinate Youth in Action volunteer applications, field orientation, and civic missions.',
    scopeAr: ['استمارات التطوع', 'توزيع المهام الميدانية'],
    scopeFr: ['Candidatures Bénévolat', 'Affectations Terrain'],
    scopeEn: ['Volunteer Applications', 'Field Missions'],
    allowedPaths: [
      '/admin',
      '/admin/volunteers',
      '/admin/profile',
    ],
  },
  {
    id: 6,
    key: 'programs_events_manager',
    name: 'programs_events_manager',
    nameAr: 'مدير الفعاليات والورش',
    nameFr: 'Responsable Événements & Ateliers',
    nameEn: 'Programs & Events Manager',
    icon: '🎟️',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    descriptionAr: 'جدولة العروض والفعاليات الثقافية، ضبط الطاقة الاستيعابية، وتتبع قوائم الحضور والتأكيد.',
    descriptionFr: 'Programmation des spectacles, gestion des jauges et suivi des réservations et présences.',
    descriptionEn: 'Schedule events and performances, manage booking quotas, and monitor registered attendees.',
    scopeAr: ['الفعاليات المباشرة', 'تسجيلات الحضور', 'الطاقة الاستيعابية'],
    scopeFr: ['Événements Publics', 'Inscriptions', 'Capacités'],
    scopeEn: ['Public Events', 'Registrations', 'Capacities'],
    allowedPaths: [
      '/admin',
      '/admin/events',
      '/admin/registrations',
      '/admin/profile',
    ],
  },
  {
    id: 7,
    key: 'partnership_manager',
    name: 'partnership_manager',
    nameAr: 'مسؤول الشراكات المؤسسية',
    nameFr: 'Responsable Partenariats',
    nameEn: 'Partnership Manager',
    icon: '🏛️',
    badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    descriptionAr: 'دراسة وتدقيق عروض التعاون الواردة من القطاع العام والمؤسسات الثقافية الشريكة والجهات المانحة.',
    descriptionFr: 'Examen des propositions de mécénat et de partenariat public ou privé.',
    descriptionEn: 'Evaluate and process partnership proposals, sponsors, and cultural institution cooperations.',
    scopeAr: ['الشراكات المؤسسية', 'اتفاقيات التعاون'],
    scopeFr: ['Partenariats Institutionnels', 'Accords & Mécénat'],
    scopeEn: ['Institutional Partnerships', 'Agreements & Sponsors'],
    allowedPaths: [
      '/admin',
      '/admin/partnerships',
      '/admin/profile',
    ],
  },
  {
    id: 8,
    key: 'finance_manager',
    name: 'finance_manager',
    nameAr: 'المسؤول المالي وبوابة الدعم',
    nameFr: 'Responsable Financier & Dons',
    nameEn: 'Finance & Donation Manager',
    icon: '💝',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    descriptionAr: 'متابعة سجلات التبرعات والمساهمات، بوابات الدفع البنكية CMI، وإعداد التقارير المالية.',
    descriptionFr: 'Gestion des dons, suivi des transactions CMI et virements bancaires, rapports comptables.',
    descriptionEn: 'Track donations, online CMI card contributions, bank transfers, and financial reports.',
    scopeAr: ['سجلات التبرعات', 'بوابة الأداء CMI', 'التقارير المالية'],
    scopeFr: ['Registres des Dons', 'Passerelle CMI', 'Rapports Financiers'],
    scopeEn: ['Donation Records', 'CMI Payment Gateway', 'Financial Reports'],
    allowedPaths: [
      '/admin',
      '/admin/donations',
      '/admin/profile',
    ],
  },
  {
    id: 9,
    key: 'reviewer',
    name: 'reviewer',
    nameAr: 'مدقق ومراجع (للقراءة فقط)',
    nameFr: 'Auditeur & Réviseur (Lecture seule)',
    nameEn: 'Read-only Reviewer',
    icon: '👁️',
    badgeColor: 'bg-gray-100 text-gray-700 border-gray-300',
    descriptionAr: 'صلاحيات مراجعة وتدقيق واطلاع شاملة لكافة الأقسام والسجلات دون إمكانية التعديل أو الحذف.',
    descriptionFr: 'Droits de consultation et d\'audit sur l\'ensemble de la plateforme sans modification.',
    descriptionEn: 'Read-only access to inspect and audit platform data without modification permissions.',
    scopeAr: ['استعراض وقراءة كافة السجلات'],
    scopeFr: ['Consultation intégrale en lecture seule'],
    scopeEn: ['Read-only access across all records'],
    allowedPaths: [
      '/admin',
      '/admin/programs',
      '/admin/events',
      '/admin/news',
      '/admin/pages',
      '/admin/team',
      '/admin/memberships',
      '/admin/volunteers',
      '/admin/registrations',
      '/admin/partnerships',
      '/admin/contacts',
      '/admin/donations',
      '/admin/profile',
    ],
  },
]

export const DEFAULT_ROLE_META: AdminRoleMeta = PREDEFINED_ROLES[0] // super_admin fallback

export function getRoleMetaByKey(key?: string | null): AdminRoleMeta {
  if (!key) return PREDEFINED_ROLES[8] // default fallback to reviewer
  const matched = PREDEFINED_ROLES.find(
    (r) => r.key === key || r.name === key || r.id.toString() === key
  )
  return matched || PREDEFINED_ROLES[8]
}

export function getRoleMetaById(id?: number | null): AdminRoleMeta {
  if (!id) return PREDEFINED_ROLES[8]
  const matched = PREDEFINED_ROLES.find((r) => r.id === id)
  return matched || PREDEFINED_ROLES[8]
}

/**
 * Checks whether a given role key is authorized to access a given admin route.
 */
export function canUserAccessPath(roleKey: string | undefined | null, pathname: string): boolean {
  if (!roleKey) return false

  // Profile and login are accessible to any authenticated staff
  if (pathname === '/admin/profile' || pathname.startsWith('/admin/profile') || pathname === '/admin/login') {
    return true
  }

  // Super admin has full unrestricted access to everything
  if (roleKey === 'super_admin') {
    return true
  }

  // Strictly protected routes for super_admin ONLY:
  if (
    pathname === '/admin/users' ||
    pathname.startsWith('/admin/users') ||
    pathname === '/admin/roles' ||
    pathname.startsWith('/admin/roles') ||
    pathname === '/admin/settings' ||
    pathname.startsWith('/admin/settings') ||
    pathname === '/admin/audit-logs' ||
    pathname.startsWith('/admin/audit-logs')
  ) {
    return false
  }

  const roleMeta = getRoleMetaByKey(roleKey)
  if (roleMeta.allowedPaths.includes('*')) {
    return true
  }

  return roleMeta.allowedPaths.some((allowed) => {
    if (allowed === '/admin') {
      return pathname === '/admin'
    }
    return pathname === allowed || pathname.startsWith(`${allowed}/`)
  })
}

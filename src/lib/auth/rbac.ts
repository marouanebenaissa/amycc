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

export interface PermissionModule {
  id: string
  nameAr: string
  nameFr: string
  nameEn: string
  descriptionAr: string
  descriptionFr: string
  descriptionEn: string
  icon: string
  category: 'overview' | 'content' | 'inbox' | 'system'
  categoryNameAr: string
  categoryNameFr: string
  categoryNameEn: string
  paths: string[]
}

export const PERMISSION_MODULES: PermissionModule[] = [
  // 1. Overview
  {
    id: 'overview',
    nameAr: 'نظرة عامة وإحصائيات',
    nameFr: 'Tableau de bord & Métriques',
    nameEn: 'Overview & Statistics',
    descriptionAr: 'الوصول إلى المؤشرات العامة، عدد الاستمارات، والنشاط الميداني العام.',
    descriptionFr: 'Accès aux indicateurs clés, métriques des formulaires et activité globale.',
    descriptionEn: 'Access to high-level platform metrics, submissions tally, and activity summary.',
    icon: '📊',
    category: 'overview',
    categoryNameAr: 'الرئيسية والمتابعة',
    categoryNameFr: 'Tableau de Bord & Suivi',
    categoryNameEn: 'Dashboard & Overview',
    paths: ['/admin'],
  },
  // 2. Content & Programs
  {
    id: 'programs',
    nameAr: 'البرامج والمشاريع الثقافية',
    nameFr: 'Programmes & Projets Culturels',
    nameEn: 'Cultural Programs & Projects',
    descriptionAr: 'إدارة كتالوج البرامج الثقافية، المحترفات، وتعديل بطاقات المبادرات.',
    descriptionFr: 'Gestion du catalogue des programmes culturels et ateliers artistiques.',
    descriptionEn: 'Manage cultural programs catalog, creative labs, and initiatives.',
    icon: '🧠',
    category: 'content',
    categoryNameAr: 'إدارة المحتوى والبرامج',
    categoryNameFr: 'Gestion Contenu & Programmes',
    categoryNameEn: 'Content & Programs CMS',
    paths: ['/admin/programs'],
  },
  {
    id: 'annual_program',
    nameAr: 'البرنامج السنوي والجدولة',
    nameFr: 'Programme Annuel & Calendrier',
    nameEn: 'Annual Roadmap & Calendar',
    descriptionAr: 'تعديل محاور البرنامج السنوي، الفصول الأربعة، والجدولة التقديرية.',
    descriptionFr: 'Édition de la feuille de route annuelle, des trimestres et jalons.',
    descriptionEn: 'Edit annual strategic roadmap, quarterly milestones, and schedule.',
    icon: '📅',
    category: 'content',
    categoryNameAr: 'إدارة المحتوى والبرامج',
    categoryNameFr: 'Gestion Contenu & Programmes',
    categoryNameEn: 'Content & Programs CMS',
    paths: ['/admin/annual-program'],
  },
  {
    id: 'events',
    nameAr: 'الفعاليات والعروض والورش',
    nameFr: 'Événements & Ateliers',
    nameEn: 'Events & Workshops',
    descriptionAr: 'برمجة التظاهرات الحية، العروض المسرحية والموسيقية، وضبط الطاقة الاستيعابية.',
    descriptionFr: 'Programmation des spectacles vivants, ateliers et gestion des jauges.',
    descriptionEn: 'Schedule cultural events, theater, workshops, and manage capacities.',
    icon: '🎟️',
    category: 'content',
    categoryNameAr: 'إدارة المحتوى والبرامج',
    categoryNameFr: 'Gestion Contenu & Programmes',
    categoryNameEn: 'Content & Programs CMS',
    paths: ['/admin/events'],
  },
  {
    id: 'registrations',
    nameAr: 'تسجيلات وتأكيدات الحضور',
    nameFr: 'Inscriptions & Billetterie',
    nameEn: 'Event Registrations',
    descriptionAr: 'متابعة قوائم المسجلين في الفعاليات والورش وتأكيد المقاعد.',
    descriptionFr: 'Suivi des inscrits aux événements et confirmation des places.',
    descriptionEn: 'Track registered attendees for events and validate check-ins.',
    icon: '📝',
    category: 'content',
    categoryNameAr: 'إدارة المحتوى والبرامج',
    categoryNameFr: 'Gestion Contenu & Programmes',
    categoryNameEn: 'Content & Programs CMS',
    paths: ['/admin/registrations'],
  },
  {
    id: 'news',
    nameAr: 'الأخبار والبلاغات الصحفية',
    nameFr: 'Actualités & Communiqués',
    nameEn: 'News & Press Releases',
    descriptionAr: 'نشر المقالات، التغطيات الإعلامية، والبلاغات الرسمية للجمعية.',
    descriptionFr: 'Publication des communiqués officiels et couverture presse.',
    descriptionEn: 'Publish news articles, official announcements, and press releases.',
    icon: '📰',
    category: 'content',
    categoryNameAr: 'إدارة المحتوى والبرامج',
    categoryNameFr: 'Gestion Contenu & Programmes',
    categoryNameEn: 'Content & Programs CMS',
    paths: ['/admin/news'],
  },
  {
    id: 'pages',
    nameAr: 'إدارة الصفحات والأقسام CMS',
    nameFr: 'Pages & Sections CMS',
    nameEn: 'Pages & Sections CMS',
    descriptionAr: 'تخصيص الواجهات والترويسات ونصوص الصفحات الـ14 للموقع.',
    descriptionFr: 'Personnalisation des 14 pages publiques et de leurs bannières.',
    descriptionEn: 'Configure hero banners, typography, and content for all 14 site pages.',
    icon: '📄',
    category: 'content',
    categoryNameAr: 'إدارة المحتوى والبرامج',
    categoryNameFr: 'Gestion Contenu & Programmes',
    categoryNameEn: 'Content & Programs CMS',
    paths: ['/admin/pages'],
  },
  {
    id: 'team',
    nameAr: 'فريق العمل واللجان الوظيفية',
    nameFr: 'Équipe & Commissions',
    nameEn: 'Team & Working Commissions',
    descriptionAr: 'تحديث أعضاء المكتب التنفيذي واللجان الميدانية المتخصصة.',
    descriptionFr: 'Gestion des membres du bureau exécutif et commissions de terrain.',
    descriptionEn: 'Manage executive board directory and specialized field commissions.',
    icon: '👥',
    category: 'content',
    categoryNameAr: 'إدارة المحتوى والبرامج',
    categoryNameFr: 'Gestion Contenu & Programmes',
    categoryNameEn: 'Content & Programs CMS',
    paths: ['/admin/team'],
  },
  {
    id: 'areas',
    nameAr: 'المجالات الفنية والمحاور',
    nameFr: 'Domaines Artistiques',
    nameEn: 'Artistic Fields & Areas',
    descriptionAr: 'إدارة المحاور الثقافية: المسرح، الفنون، الموسيقى، التطوع والتكوين.',
    descriptionFr: 'Gestion des axes culturels : théâtre, arts visuels, musique, bénévolat.',
    descriptionEn: 'Configure cultural disciplines: theater, visual arts, music, volunteering.',
    icon: '🎭',
    category: 'content',
    categoryNameAr: 'إدارة المحتوى والبرامج',
    categoryNameFr: 'Gestion Contenu & Programmes',
    categoryNameEn: 'Content & Programs CMS',
    paths: ['/admin/areas'],
  },
  {
    id: 'faqs',
    nameAr: 'الأسئلة الشائعة والأجوبة',
    nameFr: 'Questions Fréquentes (FAQ)',
    nameEn: 'Frequently Asked Questions',
    descriptionAr: 'تحرير بنك الأسئلة الشائعة وإجاباتها بثلاث لغات.',
    descriptionFr: 'Édition de la foire aux questions trilingue.',
    descriptionEn: 'Manage multilingual frequently asked questions repository.',
    icon: '❓',
    category: 'content',
    categoryNameAr: 'إدارة المحتوى والبرامج',
    categoryNameFr: 'Gestion Contenu & Programmes',
    categoryNameEn: 'Content & Programs CMS',
    paths: ['/admin/faqs'],
  },
  {
    id: 'impact',
    nameAr: 'مؤشرات الأثر المجتمعي',
    nameFr: 'Indicateurs d\'Impact',
    nameEn: 'Community Impact Metrics',
    descriptionAr: 'تحديث أرقام الأثر، ساعات التكوين، المستفيدين، وشهادات الميدان.',
    descriptionFr: 'Mise à jour des chiffres clés, heures de formation et bénéficiaires.',
    descriptionEn: 'Update key youth impact metrics, training hours, and testimonials.',
    icon: '📈',
    category: 'content',
    categoryNameAr: 'إدارة المحتوى والبرامج',
    categoryNameFr: 'Gestion Contenu & Programmes',
    categoryNameEn: 'Content & Programs CMS',
    paths: ['/admin/impact'],
  },
  // 3. Inboxes & Submissions
  {
    id: 'memberships',
    nameAr: 'طلبات الانخراط والعضوية',
    nameFr: 'Demandes d\'Adhésion',
    nameEn: 'Membership Applications',
    descriptionAr: 'معالجة ومراجعة طلبات الانخراط وتصدير قاعدة بيانات المنخرطين.',
    descriptionFr: 'Traitement des adhésions annuelles et export des registres.',
    descriptionEn: 'Process annual membership applications and export member data.',
    icon: '📋',
    category: 'inbox',
    categoryNameAr: 'صندوق الطلبات والمشاركات',
    categoryNameFr: 'Boîte de Réception & Demandes',
    categoryNameEn: 'Inboxes & Applications',
    paths: ['/admin/memberships'],
  },
  {
    id: 'volunteers',
    nameAr: 'متطوعو شباب في العمل',
    nameFr: 'Bénévoles Jeunesse en Action',
    nameEn: 'Youth in Action Volunteers',
    descriptionAr: 'فرز استمارات التطوع الميداني وتنسيق الفرق في الفعاليات.',
    descriptionFr: 'Gestion des candidatures de bénévolat et coordination terrain.',
    descriptionEn: 'Review volunteer applications and field missions coordination.',
    icon: '🤝',
    category: 'inbox',
    categoryNameAr: 'صندوق الطلبات والمشاركات',
    categoryNameFr: 'Boîte de Réception & Demandes',
    categoryNameEn: 'Inboxes & Applications',
    paths: ['/admin/volunteers'],
  },
  {
    id: 'partnerships',
    nameAr: 'طلبات الشراكة المؤسسية',
    nameFr: 'Demandes de Partenariat',
    nameEn: 'Partnership Proposals',
    descriptionAr: 'دراسة ملفات التعاون وعروض الشراكة من المؤسسات والجهات المانحة.',
    descriptionFr: 'Examen des propositions institutionnelles et partenariats.',
    descriptionEn: 'Evaluate partnership proposals from sponsors and public entities.',
    icon: '🏛️',
    category: 'inbox',
    categoryNameAr: 'صندوق الطلبات والمشاركات',
    categoryNameFr: 'Boîte de Réception & Demandes',
    categoryNameEn: 'Inboxes & Applications',
    paths: ['/admin/partnerships'],
  },
  {
    id: 'contacts',
    nameAr: 'صندوق المراسلات المباشرة',
    nameFr: 'Boîte de Contact & Messages',
    nameEn: 'Direct Contact Inquiries',
    descriptionAr: 'قراءة ومعالجة استفسارات ورسائل الزوار الواردة عبر الموقع.',
    descriptionFr: 'Lecture et traitement des messages entrants du public.',
    descriptionEn: 'Read and reply to direct visitor inquiries and contact messages.',
    icon: '✉️',
    category: 'inbox',
    categoryNameAr: 'صندوق الطلبات والمشاركات',
    categoryNameFr: 'Boîte de Réception & Demandes',
    categoryNameEn: 'Inboxes & Applications',
    paths: ['/admin/contacts'],
  },
  {
    id: 'donations',
    nameAr: 'بوابة الدعم المالي والتبرعات',
    nameFr: 'Dons & Financement CMI',
    nameEn: 'Donations & Financial Support',
    descriptionAr: 'متابعة سجلات التبرعات والمساهمات البنكية وبوابة CMI.',
    descriptionFr: 'Suivi des dons en ligne CMI et virements de soutien.',
    descriptionEn: 'Monitor CMI card donations, bank transfers, and financial receipts.',
    icon: '💝',
    category: 'inbox',
    categoryNameAr: 'صندوق الطلبات والمشاركات',
    categoryNameFr: 'Boîte de Réception & Demandes',
    categoryNameEn: 'Inboxes & Applications',
    paths: ['/admin/donations'],
  },
  // 4. System & Security
  {
    id: 'users',
    nameAr: 'المستخدمون والأدوار والتحكم الأمني',
    nameFr: 'Utilisateurs & Gestion RBAC',
    nameEn: 'Staff Users & Access Control',
    descriptionAr: 'إنشاء حسابات المشرفين، إدارة كلمات المرور، وتخصيص الصلاحيات الدقيقة.',
    descriptionFr: 'Création des comptes, gestion des accès et permissions granulaires.',
    descriptionEn: 'Manage staff accounts, password resets, and granular permissions.',
    icon: '🛡️',
    category: 'system',
    categoryNameAr: 'النظام والأمان',
    categoryNameFr: 'Système & Sécurité',
    categoryNameEn: 'System & Security',
    paths: ['/admin/users', '/admin/roles'],
  },
  {
    id: 'settings',
    nameAr: 'إعدادات المنصة وقنوات التواصل',
    nameFr: 'Paramètres Généraux & Réseaux',
    nameEn: 'Platform Settings & Social Channels',
    descriptionAr: 'ضبط بيانات التواصل الرسمية، روابط الشبكات الاجتماعية، والهوية المؤسساتية.',
    descriptionFr: 'Configuration des coordonnées, réseaux sociaux et métadonnées.',
    descriptionEn: 'Manage official contact info, verified social links, and identity.',
    icon: '⚙️',
    category: 'system',
    categoryNameAr: 'النظام والأمان',
    categoryNameFr: 'Système & Sécurité',
    categoryNameEn: 'System & Security',
    paths: ['/admin/settings'],
  },
  {
    id: 'audit_logs',
    nameAr: 'سجل التدقيق المؤسسي والعمليات',
    nameFr: 'Journal d\'Audit & Traçabilité',
    nameEn: 'Institutional Audit Trail',
    descriptionAr: 'مراقبة سجل العمليات الإدارية، تواريخ الدخول، وتعديلات البيانات.',
    descriptionFr: 'Surveillance des opérations administratives et journal des accès.',
    descriptionEn: 'Monitor staff administrative operations and security event trail.',
    icon: '📜',
    category: 'system',
    categoryNameAr: 'النظام والأمان',
    categoryNameFr: 'Système & Sécurité',
    categoryNameEn: 'System & Security',
    paths: ['/admin/audit-logs'],
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
 * Checks whether a given role or customized permission set is authorized to access a given admin route.
 * Supports granular custom permissions per account if configured.
 */
export function canUserAccessPath(
  roleKey: string | undefined | null,
  pathname: string,
  customPermissions?: string[] | null
): boolean {
  if (!roleKey && !customPermissions) return false

  // Profile, password change, and login are accessible to any authenticated staff
  if (
    pathname === '/admin/profile' ||
    pathname.startsWith('/admin/profile') ||
    pathname === '/admin/change-password' ||
    pathname.startsWith('/admin/change-password') ||
    pathname === '/admin/login'
  ) {
    return true
  }

  // 1. If explicit granular permissions are configured for this specific account:
  if (Array.isArray(customPermissions)) {
    if (customPermissions.includes('*')) {
      return true
    }

    // Resolve all paths granted by the customized modules
    const grantedPaths = customPermissions.flatMap((modId) => {
      const foundMod = PERMISSION_MODULES.find((m) => m.id === modId)
      return foundMod ? foundMod.paths : []
    })

    return grantedPaths.some((allowed) => {
      if (allowed === '/admin') {
        return pathname === '/admin'
      }
      return pathname === allowed || pathname.startsWith(`${allowed}/`)
    })
  }

  // 2. Super admin has full unrestricted access to everything
  if (roleKey === 'super_admin') {
    return true
  }

  // Strictly protected routes for super_admin ONLY (unless explicitly granted in customPermissions):
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

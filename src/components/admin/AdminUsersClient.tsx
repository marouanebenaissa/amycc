'use client'

import React, { useState, useTransition } from 'react'
import Link from 'next/link'
import { useAdminLocale } from './AdminLocaleContext'
import {
  createUserWithRoleAction,
  updateUserRoleAction,
  deleteStaffUserAction,
  unlockStaffUserAction,
  forcePasswordChangeAction,
} from '@/lib/actions/admin'

export interface AdminUserItem {
  id: string
  email: string
  full_name: string
  created_at: string
  roleId: number
  roleName: string
  isCurrentUser: boolean
  isLocked?: boolean
  lockedAt?: string | null
  failedAttempts?: number
  mustChangePassword?: boolean
}

export interface AdminRoleItem {
  id: number
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
}

export const PREDEFINED_ROLES: AdminRoleItem[] = [
  {
    id: 1,
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
  },
  {
    id: 2,
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
  },
  {
    id: 3,
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
  },
  {
    id: 4,
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
  },
  {
    id: 5,
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
  },
  {
    id: 6,
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
  },
  {
    id: 7,
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
  },
  {
    id: 8,
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
  },
  {
    id: 9,
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
  },
]

interface AdminUsersClientProps {
  initialUsers: AdminUserItem[]
  currentUserId: string
  currentUserEmail: string
}

export function AdminUsersClient({
  initialUsers,
  currentUserId,
  currentUserEmail,
}: AdminUsersClientProps) {
  const { locale, isAr, isFr } = useAdminLocale()
  const [users, setUsers] = useState<AdminUserItem[]>(initialUsers)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<AdminUserItem | null>(null)
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()
  const [showPassword, setShowPassword] = useState(false)

  // Add user form state
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [roleId, setRoleId] = useState<number>(1)

  // Labels dictionary
  const t = {
    title: isAr
      ? 'المستخدمون المشرفون والصلاحيات'
      : isFr
      ? 'Comptes Administrateurs & Rôles (RBAC)'
      : 'Staff Users & Role-Based Permissions (RBAC)',
    subtitle: isAr
      ? 'تطبيق مبدأ الحد الأدنى من الصلاحيات (Least Privilege) وإدارة الحسابات الإدارية المعتمدة وفق الظهير الشريف رقم 1.58.376.'
      : isFr
      ? 'Application stricte du principe de moindre privilège et gestion des comptes autorisés selon le Dahir n° 1.58.376.'
      : 'Enforce the principle of least privilege. Manage authorized staff roles and access levels under Moroccan Dahir No. 1.58.376.',
    badge: isAr ? 'إدارة الهوية والأمان' : isFr ? 'Sécurité & Contrôle d\'Accès' : 'Identity & Access Management',
    addUserBtn: isAr ? '+ إضافة مستخدم جديد' : isFr ? '+ Ajouter un utilisateur' : '+ Add Staff User',
    kpiTotal: isAr ? 'إجمالي المشرفين' : isFr ? 'Total Collaborateurs' : 'Total Staff Accounts',
    kpiSuperAdmins: isAr ? 'مسؤولو النظام الكبار' : isFr ? 'Super Administrateurs' : 'Super Administrators',
    kpiRolesCount: isAr ? 'الأدوار القياسية المعتمدة' : isFr ? 'Rôles Définis' : 'Predefined Roles',
    kpiSecurity: isAr ? 'حماية PostgreSQL RLS' : isFr ? 'Sécurité RLS Active' : 'RLS Matrix Security',
    kpiSecurityDesc: isAr ? 'مفعلة بنسبة 100%' : isFr ? '100% Sécurisé' : '100% Enforced',
    searchPlaceholder: isAr
      ? 'بحث بالاسم الكامل أو البريد الإلكتروني...'
      : isFr
      ? 'Rechercher par nom ou email...'
      : 'Search by full name or email...',
    filterAllRoles: isAr ? 'كافة الأدوار والصلاحيات' : isFr ? 'Tous les rôles' : 'All Roles',
    resultsCount: (count: number) =>
      isAr ? `${count} مستخدم(ين) مطابق` : isFr ? `${count} utilisateur(s) trouvé(s)` : `${count} user(s) matched`,
    thUser: isAr ? 'المستخدم المشرف' : isFr ? 'Collaborateur / Email' : 'Staff User',
    thRole: isAr ? 'الدور والصلاحيات الممنوحة' : isFr ? 'Rôle & Permissions' : 'Assigned Role & Level',
    thDate: isAr ? 'تاريخ التعيين' : isFr ? 'Date de Création' : 'Member Since',
    thActions: isAr ? 'الإجراءات' : isFr ? 'Actions' : 'Actions',
    currentAdminTag: isAr ? 'حسابك النشط حالياً' : isFr ? 'Votre session active' : 'Your Active Account',
    noUsersFound: isAr
      ? 'لا يوجد مستخدمون يطابقون معايير البحث الحالية.'
      : isFr
      ? 'Aucun utilisateur ne correspond à votre recherche.'
      : 'No staff users match your search criteria.',
    changeRolePrompt: isAr ? 'تغيير الدور' : isFr ? 'Modifier le rôle' : 'Change Role',
    deleteUserBtn: isAr ? 'حذف الحساب' : isFr ? 'Supprimer' : 'Revoke Account',
    modalTitle: isAr ? 'إضافة مستخدم إداري جديد' : isFr ? 'Ajouter un nouveau collaborateur' : 'Add New Staff User',
    modalSubtitle: isAr
      ? 'سيتم إنشاء الحساب في نظام التوثيق Supabase Auth ومنحه الصلاحية المحددة تلقائياً.'
      : isFr
      ? 'Le compte sera provisionné dans Supabase Auth et associé aux permissions sélectionnées.'
      : 'The account will be provisioned in Supabase Auth and assigned the chosen security role.',
    fullNameLabel: isAr ? 'الاسم الكامل للزميل' : isFr ? 'Nom complet' : 'Full Name',
    fullNamePlaceholder: isAr ? 'مثال: محمد بليل' : isFr ? 'Ex: Mohamed Balil' : 'e.g. Mohamed Balil',
    emailLabel: isAr ? 'البريد الإلكتروني المؤسسي' : isFr ? 'Adresse email' : 'Staff Email Address',
    emailPlaceholder: isAr ? 'name@amycc.org' : isFr ? 'nom@amycc.org' : 'name@amycc.org',
    passwordLabel: isAr ? 'كلمة المرور المؤقتة' : isFr ? 'Mot de passe temporaire' : 'Temporary Password',
    passwordHint: isAr ? '6 أحرف على الأقل' : isFr ? 'Au moins 6 caractères' : 'At least 6 characters',
    roleLabel: isAr ? 'الدور الإداري المخصص' : isFr ? 'Rôle attribué' : 'Assigned Administrative Role',
    cancel: isAr ? 'إلغاء' : isFr ? 'Annuler' : 'Cancel',
    createSubmit: isAr ? 'إنشاء وتفعيل الحساب ✓' : isFr ? 'Créer le compte ✓' : 'Create & Activate User ✓',
    creating: isAr ? 'جاري الإنشاء والربط...' : isFr ? 'Création en cours...' : 'Provisioning...',
    deleteConfirmTitle: isAr ? 'تأكيد حذف الحساب المشرف' : isFr ? 'Confirmation de suppression' : 'Confirm Account Revocation',
    deleteConfirmDesc: (userEmail: string) =>
      isAr
        ? `هل أنت متأكد من رغبتك في حذف وإلغاء حساب المشرف (${userEmail}) نهائياً من النظام؟`
        : isFr
        ? `Êtes-vous certain de vouloir révoquer et supprimer définitivement le compte (${userEmail}) ?`
        : `Are you sure you want to permanently delete and revoke staff account (${userEmail})?`,
    confirmDeleteBtn: isAr ? 'نعم، احذف الحساب نهائياً' : isFr ? 'Oui, supprimer définitivement' : 'Yes, Revoke User',
    deleting: isAr ? 'جاري الحذف...' : isFr ? 'Suppression...' : 'Revoking...',
    rolesMatrixTitle: isAr
      ? 'مصفوفة الأدوار القياسية المعتمدة في نظام AMYCC'
      : isFr
      ? 'Matrice des Rôles Standard dans le Système AMYCC'
      : 'Predefined Role Definitions in AMYCC Security Matrix',
    rolesMatrixSubtitle: isAr
      ? 'تحدد هذه المصفوفة حدود الوصول والصلاحيات بدقة لمنع تصعيد الامتيازات وضمان سلامة البيانات.'
      : isFr
      ? 'Cette matrice garantit le respect strict des périmètres d\'action pour chaque profil.'
      : 'Strictly compartmentalized roles to prevent privilege escalation and ensure institutional data integrity.',
    rolesLink: isAr ? 'فتح مصفوفة الصلاحيات المفصلة ←' : isFr ? 'Ouvrir la matrice RBAC détaillée ←' : 'Open Detailed RBAC Matrix →',
    scopeLabel: isAr ? 'نطاق الوصول:' : isFr ? 'Périmètre:' : 'Access Scope:',
  }

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      !searchQuery.trim() ||
      u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole =
      selectedRoleFilter === 'all' ||
      u.roleName === selectedRoleFilter ||
      String(u.roleId) === selectedRoleFilter

    return matchesSearch && matchesRole
  })

  // KPI calculations
  const totalUsersCount = users.length
  const superAdminsCount = users.filter((u) => u.roleName === 'super_admin' || u.roleId === 1).length
  const lockedUsersCount = users.filter((u) => u.isLocked).length

  function getRoleInfo(roleId: number, roleName: string): AdminRoleItem {
    return (
      PREDEFINED_ROLES.find((r) => r.id === roleId || r.name === roleName) ||
      PREDEFINED_ROLES[0]
    )
  }

  function getLocalizedRoleName(role: AdminRoleItem): string {
    if (isAr) return role.nameAr
    if (isFr) return role.nameFr
    return role.nameEn
  }

  function getLocalizedRoleDesc(role: AdminRoleItem): string {
    if (isAr) return role.descriptionAr
    if (isFr) return role.descriptionFr
    return role.descriptionEn
  }

  function getLocalizedScope(role: AdminRoleItem): string[] {
    if (isAr) return role.scopeAr
    if (isFr) return role.scopeFr
    return role.scopeEn
  }

  function handleCreateUser(e: React.FormEvent) {
    e.preventDefault()
    setStatusMessage(null)

    startTransition(async () => {
      const formData = new FormData()
      formData.set('fullName', fullName)
      formData.set('email', email)
      formData.set('password', password)
      formData.set('roleId', String(roleId))

      const res = await createUserWithRoleAction(formData)

      if (res.success) {
        setStatusMessage({
          type: 'success',
          text: isAr
            ? `تم إنشاء حساب المشرف (${email}) وتعيين دوره بنجاح!`
            : isFr
            ? `Le compte (${email}) a été créé et activé avec succès !`
            : `Staff account (${email}) created and role assigned successfully!`,
        })

        // Optimistically add user to local state
        const targetRole = getRoleInfo(roleId, '')
        const newUser: AdminUserItem = {
          id: `temp-${Date.now()}`,
          email,
          full_name: fullName,
          created_at: new Date().toISOString(),
          roleId,
          roleName: targetRole.name,
          isCurrentUser: false,
        }
        setUsers((prev) => [newUser, ...prev])

        // Reset form and close modal
        setFullName('')
        setEmail('')
        setPassword('')
        setRoleId(1)
        setIsAddModalOpen(false)
      } else {
        setStatusMessage({
          type: 'error',
          text: res.error || (isAr ? 'حدث خطأ أثناء إنشاء المستخدم.' : 'Failed to create user.'),
        })
      }
    })
  }

  function handleRoleChange(userId: string, newRoleId: number) {
    setStatusMessage(null)
    startTransition(async () => {
      const res = await updateUserRoleAction(userId, newRoleId)
      if (res.success) {
        const targetRole = getRoleInfo(newRoleId, '')
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId
              ? { ...u, roleId: newRoleId, roleName: targetRole.name }
              : u
          )
        )
        setStatusMessage({
          type: 'success',
          text: isAr
            ? 'تم تحديث دور وصلاحيات المشرف بنجاح.'
            : isFr
            ? 'Rôle du collaborateur mis à jour avec succès.'
            : 'Staff user role updated successfully.',
        })
      } else {
        setStatusMessage({
          type: 'error',
          text: res.error || (isAr ? 'فشل تحديث الدور.' : 'Failed to update role.'),
        })
      }
    })
  }

  function handleDeleteUser() {
    if (!userToDelete) return
    setStatusMessage(null)

    startTransition(async () => {
      const res = await deleteStaffUserAction(userToDelete.id)
      if (res.success) {
        setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id))
        setStatusMessage({
          type: 'success',
          text: isAr
            ? `تم حذف حساب المشرف (${userToDelete.email}) بنجاح.`
            : isFr
            ? `Compte (${userToDelete.email}) supprimé avec succès.`
            : `Staff account (${userToDelete.email}) deleted successfully.`,
        })
        setUserToDelete(null)
      } else {
        setStatusMessage({
          type: 'error',
          text: res.error || (isAr ? 'فشل حذف الحساب.' : 'Failed to delete user.'),
        })
      }
    })
  }

  function handleUnlockUser(user: AdminUserItem) {
    setStatusMessage(null)
    startTransition(async () => {
      const res = await unlockStaffUserAction(user.id)
      if (res.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === user.id
              ? { ...u, isLocked: false, failedAttempts: 0 }
              : u
          )
        )
        setStatusMessage({
          type: 'success',
          text: isAr
            ? `تم إلغاء قفل حساب (${user.email}) وإعادة تفعيل صلاحية الدخول بنجاح!`
            : isFr
            ? `Le compte (${user.email}) a été déverrouillé avec succès !`
            : `Staff account (${user.email}) has been unlocked successfully!`,
        })
      } else {
        setStatusMessage({
          type: 'error',
          text: res.error || (isAr ? 'فشل إلغاء قفل الحساب.' : 'Failed to unlock account.'),
        })
      }
    })
  }

  function handleForcePasswordChange(user: AdminUserItem) {
    setStatusMessage(null)
    startTransition(async () => {
      const res = await forcePasswordChangeAction(user.id)
      if (res.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === user.id
              ? { ...u, mustChangePassword: true }
              : u
          )
        )
        setStatusMessage({
          type: 'success',
          text: isAr
            ? `تم إلزام المستخدم (${user.email}) بتغيير كلمة المرور في أول تسجيل دخول قادم.`
            : isFr
            ? `Changement de mot de passe rendu obligatoire pour (${user.email}).`
            : `Mandatory password change enforced for (${user.email}).`,
        })
      } else {
        setStatusMessage({
          type: 'error',
          text: res.error || 'Failed to enforce password change.',
        })
      }
    })
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Banner / Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#231f20] via-[#2d292a] to-[#1a1718] text-white p-6 sm:p-8 shadow-xl border border-white/10">
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#bd3227]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-[#d2a82b]/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/15 text-3xs font-black tracking-widest uppercase text-[#ffd22f]">
              <span>🛡️</span>
              <span>{t.badge}</span>
              <span>•</span>
              <span className="text-white/80 font-mono">RBAC v2.4</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              {t.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#e5e0d6]/90 leading-relaxed max-w-2xl">
              {t.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setStatusMessage(null)
                setIsAddModalOpen(true)
              }}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#bd3227] to-[#d2a82b] hover:from-[#a0281f] hover:to-[#b89123] text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#bd3227]/25 hover:shadow-xl hover:scale-102 active:scale-98 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="text-base font-black">+</span>
              <span>{t.addUserBtn}</span>
            </button>

            <Link
              href="/admin/roles"
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/15 backdrop-blur-xs transition-all flex items-center gap-2"
            >
              <span>⚙️</span>
              <span className="hidden sm:inline">{t.rolesLink}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Status Notification Toast */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 shadow-md transition-all ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : 'bg-red-50 text-red-900 border border-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span>{statusMessage.type === 'success' ? '✅' : '⚠️'}</span>
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-xs opacity-60 hover:opacity-100 px-2 py-1 rounded-lg"
          >
            ✕
          </button>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-white p-5 rounded-2xl border border-[#e5e0d6] shadow-2xs hover:shadow-card transition-all">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-3xs font-black uppercase tracking-wider text-[#5C5A55]">
              {t.kpiTotal}
            </span>
            <span className="w-8 h-8 rounded-xl bg-[#FAF8F5] flex items-center justify-center text-sm">
              👥
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#231f20]">
            {totalUsersCount}
          </div>
          <div className="text-3xs text-[#8a6e14] mt-1 font-semibold flex items-center gap-1">
            <span>✓</span>
            <span>
              {isAr
                ? 'حسابات نشطة ومحمية بـ Supabase Auth'
                : isFr
                ? 'Comptes authentifiés Supabase'
                : 'Authenticated Supabase accounts'}
            </span>
          </div>
        </div>

        {/* Super Admins */}
        <div className="bg-white p-5 rounded-2xl border border-[#e5e0d6] shadow-2xs hover:shadow-card transition-all">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-3xs font-black uppercase tracking-wider text-[#bd3227]">
              {t.kpiSuperAdmins}
            </span>
            <span className="w-8 h-8 rounded-xl bg-[#fde8e7] flex items-center justify-center text-sm">
              🛡️
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#bd3227]">
            {superAdminsCount}
          </div>
          <div className="text-3xs text-[#5C5A55] mt-1 font-medium">
            {isAr ? 'صلاحيات عليا كاملة' : isFr ? 'Privilèges administrateur' : 'Highest privileged staff'}
          </div>
        </div>

        {/* Security & Account Lockouts */}
        <div
          className={`p-5 rounded-2xl border shadow-2xs hover:shadow-card transition-all ${
            lockedUsersCount > 0 ? 'bg-rose-50/70 border-rose-300' : 'bg-white border-[#e5e0d6]'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <span
              className={`text-3xs font-black uppercase tracking-wider ${
                lockedUsersCount > 0 ? 'text-rose-700' : 'text-[#8a6e14]'
              }`}
            >
              {isAr ? 'الحسابات المقفلة أمنياً' : isFr ? 'Comptes Verrouillés' : 'Security Locked Accounts'}
            </span>
            <span
              className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm ${
                lockedUsersCount > 0 ? 'bg-rose-200 text-rose-800' : 'bg-[#FEF6CC] text-[#8a6e14]'
              }`}
            >
              {lockedUsersCount > 0 ? '🚨' : '🔒'}
            </span>
          </div>
          <div
            className={`text-2xl sm:text-3xl font-black ${
              lockedUsersCount > 0 ? 'text-rose-700' : 'text-[#231f20]'
            }`}
          >
            {lockedUsersCount}
          </div>
          <div
            className={`text-3xs mt-1 font-semibold ${
              lockedUsersCount > 0 ? 'text-rose-600' : 'text-[#5C5A55]'
            }`}
          >
            {lockedUsersCount > 0
              ? isAr
                ? '⚠️ تجاوز 5 محاولات (يتطلب إلغاء القفل)'
                : isFr
                ? '5 échecs consécutifs (action requise)'
                : 'Exceeded 5 tries (unlock required)'
              : isAr
              ? '✓ لا توجد حسابات محظورة حالياً'
              : isFr
              ? 'Aucun compte verrouillé'
              : 'Zero locked accounts'}
          </div>
        </div>

        {/* Security Policy */}
        <div className="bg-white p-5 rounded-2xl border border-[#e5e0d6] shadow-2xs hover:shadow-card transition-all">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-3xs font-black uppercase tracking-wider text-emerald-700">
              {t.kpiSecurity}
            </span>
            <span className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-sm">
              🛡️
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700">
            {t.kpiSecurityDesc}
          </div>
          <div className="text-3xs text-[#5C5A55] mt-1 font-medium">
            {isAr ? 'حماية مشددة + تغيير كلمة المرور عند أول دخول' : isFr ? 'Sécurité renforcée + premier login forcé' : 'Hardened security & first-login reset'}
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e5e0d6] shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 start-3 flex items-center pointer-events-none text-sm text-[#5C5A55]">
            🔍
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-[#e5e0d6] bg-[#FAF8F5] text-xs sm:text-sm font-medium text-[#231f20] placeholder-[#5C5A55]/60 focus:outline-hidden focus:border-[#bd3227] focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 end-3 flex items-center text-xs text-[#5C5A55] hover:text-[#231f20]"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="w-full sm:w-64">
            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#e5e0d6] bg-[#FAF8F5] text-xs font-semibold text-[#231f20] focus:outline-hidden focus:border-[#bd3227] cursor-pointer"
            >
              <option value="all">{t.filterAllRoles}</option>
              {PREDEFINED_ROLES.map((role) => (
                <option key={role.id} value={role.name}>
                  {role.icon} {getLocalizedRoleName(role)}
                </option>
              ))}
            </select>
          </div>

          <div className="text-3xs font-bold text-[#5C5A55] whitespace-nowrap bg-[#FAF8F5] px-3 py-2.5 rounded-xl border border-[#e5e0d6]">
            {t.resultsCount(filteredUsers.length)}
          </div>
        </div>
      </div>

      {/* Users Table / Responsive Cards */}
      <div className="bg-white rounded-2xl border border-[#e5e0d6] overflow-hidden shadow-2xs">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-start text-xs text-[#231f20]">
            <thead className="bg-[#FAF8F5] border-b border-[#e5e0d6] text-2xs uppercase tracking-wider text-[#5C5A55] font-bold">
              <tr>
                <th className="px-6 py-4 text-start">{t.thUser}</th>
                <th className="px-6 py-4 text-start">{t.thRole}</th>
                <th className="px-6 py-4 text-start">
                  {isAr ? 'الحالة والأمان' : isFr ? 'Sécurité' : 'Security'}
                </th>
                <th className="px-6 py-4 text-start">{t.thDate}</th>
                <th className="px-6 py-4 text-end">{t.thActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FEF6CC]">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => {
                  const roleObj = getRoleInfo(u.roleId, u.roleName)
                  const isCurrent =
                    u.isCurrentUser ||
                    u.id === currentUserId ||
                    u.email.toLowerCase() === currentUserEmail.toLowerCase()

                  return (
                    <tr
                      key={u.id}
                      className={`hover:bg-[#FAF8F5]/80 transition-colors ${
                        isCurrent ? 'bg-[#FEF6CC]/25' : u.isLocked ? 'bg-rose-50/40' : ''
                      }`}
                    >
                      {/* Staff Member Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shadow-2xs shrink-0 ${
                            u.isLocked
                              ? 'bg-rose-600 text-white'
                              : 'bg-gradient-to-br from-[#bd3227] to-[#d2a82b] text-white'
                          }`}>
                            {u.isLocked ? '🔒' : u.full_name ? u.full_name.charAt(0).toUpperCase() : u.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#231f20] text-sm">
                                {u.full_name || 'Staff Member'}
                              </span>
                              {isCurrent && (
                                <span className="px-2 py-0.5 rounded-full text-3xs font-black bg-[#bd3227] text-white">
                                  {t.currentAdminTag}
                                </span>
                              )}
                            </div>
                            <div className="text-[#5C5A55] text-3xs font-mono mt-0.5">
                              {u.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Assigned Role */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-3xs font-bold border ${roleObj.badgeColor}`}
                          >
                            <span>{roleObj.icon}</span>
                            <span>{getLocalizedRoleName(roleObj)}</span>
                          </span>

                          {/* Quick Role Switcher */}
                          <select
                            disabled={isPending}
                            value={roleObj.id}
                            onChange={(e) => handleRoleChange(u.id, Number(e.target.value))}
                            className="text-3xs font-semibold px-2 py-1 rounded-lg border border-[#e5e0d6] bg-[#FAF8F5] text-[#231f20] hover:border-[#bd3227] cursor-pointer focus:outline-hidden disabled:opacity-50"
                            title={t.changeRolePrompt}
                          >
                            {PREDEFINED_ROLES.map((r) => (
                              <option key={r.id} value={r.id}>
                                {r.icon} {getLocalizedRoleName(r)}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>

                      {/* Security Status */}
                      <td className="px-6 py-4">
                        {u.isLocked ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-3xs font-black bg-rose-100 text-rose-800 border border-rose-300">
                              <span>🔒</span>
                              <span>{isAr ? 'مقفل (5 محاولات)' : isFr ? 'Verrouillé (5 échecs)' : 'Locked (5 fails)'}</span>
                            </span>
                            <div className="text-3xs text-rose-600 font-bold">
                              {isAr ? 'يتطلب فك القفل' : 'Action required'}
                            </div>
                          </div>
                        ) : u.mustChangePassword ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-3xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            <span>🔑</span>
                            <span>{isAr ? 'يلزم كلمة جديدة' : isFr ? 'Mdp obligatoire' : 'Password change pending'}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-3xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <span>🛡️</span>
                            <span>{isAr ? 'نشط وآمن' : isFr ? 'Actif & Sécurisé' : 'Active & Secure'}</span>
                          </span>
                        )}
                      </td>

                      {/* Join Date */}
                      <td className="px-6 py-4 text-[#5C5A55] text-3xs whitespace-nowrap">
                        {u.created_at
                          ? new Date(u.created_at).toLocaleDateString(
                              locale === 'ar' ? 'ar-MA' : locale === 'fr' ? 'fr-FR' : 'en-US',
                              { year: 'numeric', month: 'short', day: 'numeric' }
                            )
                          : '—'}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-end">
                        <div className="flex items-center justify-end gap-1.5">
                          {u.isLocked && (
                            <button
                              disabled={isPending}
                              onClick={() => handleUnlockUser(u)}
                              className="px-3 py-1.5 rounded-xl text-3xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50 flex items-center gap-1"
                              title={isAr ? 'إلغاء قفل الحساب واستعادة صلاحية الدخول' : 'Unlock Account'}
                            >
                              <span>🔓</span>
                              <span>{isAr ? 'إلغاء القفل' : isFr ? 'Débloquer' : 'Unlock'}</span>
                            </button>
                          )}

                          {!isCurrent && !u.isLocked && (
                            <button
                              disabled={isPending || u.mustChangePassword}
                              onClick={() => handleForcePasswordChange(u)}
                              className={`px-2.5 py-1.5 rounded-xl text-3xs font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                                u.mustChangePassword
                                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                  : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100 active:scale-95'
                              }`}
                              title={isAr ? 'إلزام هذا الحساب بتغيير كلمة المرور' : 'Force password change'}
                            >
                              <span>🔄</span>
                              <span className="hidden xl:inline">{isAr ? 'إلزام كلمة جديدة' : 'Force change'}</span>
                            </button>
                          )}

                          {!isCurrent && u.roleName !== 'super_admin' && u.roleId !== 1 ? (
                            <button
                              disabled={isPending}
                              onClick={() => setUserToDelete(u)}
                              className="px-3 py-1.5 rounded-xl text-3xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                            >
                              🗑️ {t.deleteUserBtn}
                            </button>
                          ) : !u.isLocked ? (
                            <span className="text-3xs text-[#5C5A55] italic">
                              {isAr ? 'حساب محمي' : isFr ? 'Protégé' : 'Protected'}
                            </span>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#5C5A55]">
                    <div className="text-3xl mb-2">🔍</div>
                    <div className="font-semibold">{t.noUsersFound}</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile & Tablet Card Layout */}
        <div className="md:hidden divide-y divide-[#FEF6CC]">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((u) => {
              const roleObj = getRoleInfo(u.roleId, u.roleName)
              const isCurrent =
                u.isCurrentUser ||
                u.id === currentUserId ||
                u.email.toLowerCase() === currentUserEmail.toLowerCase()

              return (
                <div
                  key={u.id}
                  className={`p-4 space-y-3 ${isCurrent ? 'bg-[#FEF6CC]/25' : ''}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#bd3227] to-[#d2a82b] text-white flex items-center justify-center font-black text-sm shadow-2xs shrink-0">
                        {u.full_name ? u.full_name.charAt(0).toUpperCase() : u.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-[#231f20] text-sm">
                          {u.full_name || 'Staff Member'}
                        </div>
                        <div className="text-[#5C5A55] text-3xs font-mono">
                          {u.email}
                        </div>
                      </div>
                    </div>

                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded-full text-3xs font-black bg-[#bd3227] text-white shrink-0">
                        {t.currentAdminTag}
                      </span>
                    )}
                  </div>

                  {/* Role Selector Card Control */}
                  <div className="pt-2 border-t border-[#FEF6CC] flex flex-col gap-2">
                    <label className="text-3xs font-bold text-[#5C5A55]">
                      {t.thRole}:
                    </label>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-3xs font-bold border shrink-0 ${roleObj.badgeColor}`}
                      >
                        <span>{roleObj.icon}</span>
                        <span>{getLocalizedRoleName(roleObj)}</span>
                      </span>

                      <select
                        disabled={isPending}
                        value={roleObj.id}
                        onChange={(e) => handleRoleChange(u.id, Number(e.target.value))}
                        className="flex-1 text-3xs font-semibold px-2 py-1.5 rounded-lg border border-[#e5e0d6] bg-[#FAF8F5] text-[#231f20] cursor-pointer"
                      >
                        {PREDEFINED_ROLES.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.icon} {getLocalizedRoleName(r)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Security Status Badge on Mobile */}
                  <div className="pt-2 border-t border-[#FEF6CC] flex items-center justify-between text-3xs">
                    <span className="font-bold text-[#5C5A55]">
                      {isAr ? 'الحالة الأمنية:' : 'Sécurité:'}
                    </span>
                    {u.isLocked ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-3xs font-black bg-rose-100 text-rose-800 border border-rose-300">
                        <span>🔒</span>
                        <span>{isAr ? 'مقفل (5 محاولات خاطئة)' : 'Verrouillé'}</span>
                      </span>
                    ) : u.mustChangePassword ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-3xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                        <span>🔑</span>
                        <span>{isAr ? 'يلزم كلمة جديدة' : 'Mdp requis'}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-3xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <span>🛡️</span>
                        <span>{isAr ? 'نشط وآمن' : 'Actif & Sécurisé'}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#FEF6CC] text-3xs text-[#5C5A55]">
                    <span>
                      {u.created_at
                        ? new Date(u.created_at).toLocaleDateString(
                            locale === 'ar' ? 'ar-MA' : 'fr-FR',
                            { year: 'numeric', month: 'short', day: 'numeric' }
                          )
                        : '—'}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {u.isLocked && (
                        <button
                          disabled={isPending}
                          onClick={() => handleUnlockUser(u)}
                          className="px-2.5 py-1 rounded-lg text-3xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all cursor-pointer"
                        >
                          🔓 {isAr ? 'إلغاء القفل' : 'Débloquer'}
                        </button>
                      )}

                      {!isCurrent && !u.isLocked && (
                        <button
                          disabled={isPending || u.mustChangePassword}
                          onClick={() => handleForcePasswordChange(u)}
                          className={`px-2 py-1 rounded-lg text-3xs font-bold border transition-all ${
                            u.mustChangePassword
                              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                              : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                          }`}
                        >
                          🔄 {isAr ? 'كلمة جديدة' : 'Reset'}
                        </button>
                      )}

                      {!isCurrent && u.roleName !== 'super_admin' && u.roleId !== 1 ? (
                        <button
                          disabled={isPending}
                          onClick={() => setUserToDelete(u)}
                          className="px-2.5 py-1 rounded-lg text-3xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-all cursor-pointer"
                        >
                          🗑️ {t.deleteUserBtn}
                        </button>
                      ) : !u.isLocked ? (
                        <span className="text-3xs text-[#5C5A55] italic">
                          {isAr ? 'محمي' : 'Protégé'}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="p-8 text-center text-[#5C5A55]">
              <div className="text-3xl mb-2">🔍</div>
              <div className="font-semibold text-xs">{t.noUsersFound}</div>
            </div>
          )}
        </div>
      </div>

      {/* Predefined Roles Matrix Reference Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e5e0d6] shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e5e0d6]">
          <div>
            <div className="inline-flex items-center gap-1.5 text-2xs font-bold text-[#bd3227] uppercase tracking-wider mb-1">
              <span>📜</span>
              <span>AMYCC Security Matrix</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-[#231f20]">
              {t.rolesMatrixTitle}
            </h2>
            <p className="text-xs text-[#5C5A55] mt-1 max-w-2xl">
              {t.rolesMatrixSubtitle}
            </p>
          </div>

          <Link
            href="/admin/roles"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#FAF8F5] hover:bg-[#FEF6CC] text-[#231f20] border border-[#e5e0d6] transition-all self-start sm:self-auto"
          >
            {t.rolesLink}
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PREDEFINED_ROLES.map((role) => {
            const isSelected = selectedRoleFilter === role.name
            const assignedCount = users.filter(
              (u) => u.roleName === role.name || u.roleId === role.id
            ).length

            return (
              <div
                key={role.id}
                onClick={() =>
                  setSelectedRoleFilter(isSelected ? 'all' : role.name)
                }
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#bd3227] bg-[#fde8e7]/20 shadow-md ring-2 ring-[#bd3227]/20'
                    : 'border-[#e5e0d6] bg-[#FAF8F5] hover:bg-white hover:shadow-card'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-white border border-[#e5e0d6] flex items-center justify-center text-sm shadow-2xs">
                        {role.icon}
                      </span>
                      <span className="text-3xs font-mono font-bold px-2 py-0.5 rounded-md bg-[#231f20]/5 text-[#231f20]">
                        #{role.id}
                      </span>
                    </div>

                    <span className="text-3xs font-bold px-2 py-0.5 rounded-full bg-white border border-[#e5e0d6] text-[#5C5A55]">
                      {assignedCount} {isAr ? 'عضو' : isFr ? 'membres' : 'staff'}
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-[#231f20] mb-1">
                    {getLocalizedRoleName(role)}
                  </h3>
                  <p className="text-3xs text-[#5C5A55] leading-relaxed mb-3">
                    {getLocalizedRoleDesc(role)}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#e5e0d6]/70">
                  <div className="text-3xs font-bold text-[#231f20] mb-1.5">
                    {t.scopeLabel}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {getLocalizedScope(role).map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-white border border-[#e5e0d6] text-3xs font-medium text-[#5C5A55]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Add New User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#e5e0d6] overflow-hidden p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#e5e0d6]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#bd3227] to-[#d2a82b] text-white flex items-center justify-center text-xl shadow-md">
                  👤
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#231f20]">
                    {t.modalTitle}
                  </h3>
                  <p className="text-3xs text-[#5C5A55] mt-0.5">
                    {t.modalSubtitle}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-[#FAF8F5] hover:bg-[#FEF6CC] flex items-center justify-center text-[#5C5A55] text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-[#231f20] mb-1">
                  {t.fullNameLabel} <span className="text-[#bd3227]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={t.fullNamePlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e0d6] bg-[#FAF8F5] text-xs sm:text-sm font-semibold text-[#231f20] focus:bg-white focus:border-[#bd3227] focus:outline-hidden transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-[#231f20] mb-1">
                  {t.emailLabel} <span className="text-[#bd3227]">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.emailPlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e0d6] bg-[#FAF8F5] text-xs sm:text-sm font-semibold text-[#231f20] focus:bg-white focus:border-[#bd3227] focus:outline-hidden transition-all"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-[#231f20]">
                    {t.passwordLabel} <span className="text-[#bd3227]">*</span>
                  </label>
                  <span className="text-3xs text-[#5C5A55]">{t.passwordHint}</span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e0d6] bg-[#FAF8F5] text-xs sm:text-sm font-semibold text-[#231f20] focus:bg-white focus:border-[#bd3227] focus:outline-hidden transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 end-3 flex items-center text-xs text-[#5C5A55] hover:text-[#231f20]"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold text-[#231f20] mb-1">
                  {t.roleLabel} <span className="text-[#bd3227]">*</span>
                </label>
                <select
                  value={roleId}
                  onChange={(e) => setRoleId(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e0d6] bg-[#FAF8F5] text-xs font-semibold text-[#231f20] focus:bg-white focus:border-[#bd3227] focus:outline-hidden cursor-pointer"
                >
                  {PREDEFINED_ROLES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.icon} {getLocalizedRoleName(r)} (ID: #{r.id})
                    </option>
                  ))}
                </select>
                <p className="text-3xs text-[#5C5A55] mt-1.5 leading-relaxed">
                  {getLocalizedRoleDesc(getRoleInfo(roleId, ''))}
                </p>
              </div>

              {/* Form Buttons */}
              <div className="pt-4 border-t border-[#e5e0d6] flex items-center justify-end gap-3">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#5C5A55] hover:bg-[#FAF8F5] transition-all cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#bd3227] hover:bg-[#a0281f] text-white shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <span className="animate-spin text-sm">⏳</span>
                      <span>{t.creating}</span>
                    </>
                  ) : (
                    <span>{t.createSubmit}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-red-200 overflow-hidden p-6 space-y-5">
            <div className="flex items-center gap-3 text-red-600">
              <span className="text-2xl">⚠️</span>
              <h3 className="text-base font-black text-[#231f20]">
                {t.deleteConfirmTitle}
              </h3>
            </div>

            <p className="text-xs text-[#5C5A55] leading-relaxed">
              {t.deleteConfirmDesc(userToDelete.email)}
            </p>

            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-3xs text-red-800">
              {isAr
                ? 'سيتم إلغاء صلاحيات الوصول وسجل الدور المرتبط بهذا المستخدم فوراً.'
                : isFr
                ? 'Les droits d\'accès et associations de rôles seront révoqués immédiatement.'
                : 'All access privileges and role bindings will be immediately revoked.'}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#e5e0d6]">
              <button
                disabled={isPending}
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#5C5A55] hover:bg-[#FAF8F5] cursor-pointer"
              >
                {t.cancel}
              </button>
              <button
                disabled={isPending}
                onClick={handleDeleteUser}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isPending ? t.deleting : t.confirmDeleteBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

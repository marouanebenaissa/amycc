'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AdminLocaleProvider, useAdminLocale } from './AdminLocaleContext'
import { AdminSidebar } from './AdminSidebar'
import { AdminTopHeader } from './AdminTopHeader'
import type { AdminRoleMeta } from '@/lib/auth/rbac'
import { PREDEFINED_ROLES, canUserAccessPath } from '@/lib/auth/rbac'

interface AdminLayoutClientProps {
  userEmail: string
  userName?: string | null
  userAvatar?: string | null
  userRole?: AdminRoleMeta
  mustChangePassword?: boolean
  children: React.ReactNode
}

function AdminLayoutInner({
  userEmail,
  userName,
  userAvatar,
  userRole,
  mustChangePassword = false,
  children,
}: AdminLayoutClientProps & { userRole: AdminRoleMeta }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const { isAr, isFr } = useAdminLocale()

  // If user is on the change-password page, render cleanly without the main dashboard navigation
  if (pathname === '/admin/change-password') {
    return (
      <main className="min-h-screen w-full bg-[#FAF8F5]">
        {children}
      </main>
    )
  }

  // If password change is mandatory for this new user, force them to change it
  if (mustChangePassword) {
    return (
      <main className="min-h-screen w-full flex items-center justify-center p-6 bg-[#FAF8F5]">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-[#e5e0d6] shadow-xl text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#fde8e7] text-[#bd3227] text-3xl flex items-center justify-center mx-auto shadow-xs border border-[#bd3227]/30">
            🔐
          </div>
          <h2 className="text-xl font-black text-[#231f20]">
            {isAr
              ? 'تغيير كلمة المرور إلزامي'
              : isFr
              ? 'Changement de Mot de Passe Obligatoire'
              : 'Password Change Required'}
          </h2>
          <p className="text-xs text-[#5C5A55] leading-relaxed">
            {isAr
              ? 'بصفتك مستخدماً جديداً، يجب تعيين كلمة مرور شخصية قوية قبل التمكن من تصفح أو استخدام أقسام لوحة التحكم.'
              : isFr
              ? 'En tant que nouvel utilisateur, vous devez définir un mot de passe sécurisé avant de pouvoir accéder au tableau de bord.'
              : 'As a newly provisioned user, you must set a secure personal password before accessing dashboard modules.'}
          </p>
          <div className="pt-2">
            <Link
              href="/admin/change-password"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#bd3227] text-white text-xs font-bold hover:bg-[#a3261c] transition-all shadow-md cursor-pointer"
            >
              <span>🔑</span>
              <span>
                {isAr
                  ? 'الانتقال لتعيين كلمة المرور الآن'
                  : isFr
                  ? 'Définir mon mot de passe'
                  : 'Set Password Now'}
              </span>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const isAllowed = canUserAccessPath(userRole.key, pathname)

  return (
    <div className="min-h-screen flex text-[#231f20] bg-[#FAF8F5] transition-colors">
      <AdminSidebar
        userEmail={userEmail}
        userName={userName}
        userAvatar={userAvatar}
        userRole={userRole}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <AdminTopHeader
          userEmail={userEmail}
          userName={userName}
          userAvatar={userAvatar}
          userRole={userRole}
          onToggleMobileMenu={() => setMobileOpen((prev) => !prev)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          {isAllowed ? (
            children
          ) : (
            <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#e5e0d6] shadow-sm text-center max-w-2xl mx-auto my-12 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 text-3xl flex items-center justify-center mx-auto shadow-xs border border-rose-200">
                🔒
              </div>
              <h2 className="text-xl font-black text-[#231f20]">
                {isAr
                  ? 'منطقة وصول مقيدة بالصلاحيات'
                  : isFr
                  ? 'Accès Restreint par les Permissions'
                  : 'Role-Restricted Access Area'}
              </h2>
              <p className="text-xs sm:text-sm text-[#5C5A55] leading-relaxed">
                {isAr
                  ? `عذراً، هذا القسم غير متاح لحسابك. دورك الحالي في المنصة هو "${userRole.nameAr}"، والصلاحيات الممنوحة لك تغطي فقط المهام المحددة لمسؤوليتك.`
                  : isFr
                  ? `Désolé, cette section n'est pas accessible avec votre rôle actuel "${userRole.nameFr}". Vos permissions couvrent uniquement votre domaine d'intervention.`
                  : `Sorry, this section is not accessible with your current role "${userRole.nameEn}". Your permissions only cover your assigned institutional scope.`}
              </p>
              <div className="pt-2">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#231f20] text-white text-xs font-bold hover:bg-[#bd3227] transition-all shadow-sm"
                >
                  <span>📊</span>
                  <span>{isAr ? 'العودة إلى لوحة المتابعة الرئيسية' : isFr ? 'Retour au tableau de bord' : 'Back to Dashboard'}</span>
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export function AdminLayoutClient(props: AdminLayoutClientProps) {
  const userRole = props.userRole || PREDEFINED_ROLES[0]
  return (
    <AdminLocaleProvider>
      <AdminLayoutInner {...props} userRole={userRole} />
    </AdminLocaleProvider>
  )
}

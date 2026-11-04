import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { assignUserRole, removeUserRole } from '@/lib/actions/admin'

interface RoleDefinition {
  id: number
  name: string
  nameAr: string
  descriptionAr: string
  scope: string[]
}

const rbacMatrix: RoleDefinition[] = [
  {
    id: 1,
    name: 'super_admin',
    nameAr: 'مدير عام النظام (Super Administrator)',
    descriptionAr: 'صلاحيات مطلقة لإدارة المنصة، إعدادات الأمان، تعيين الأدوار، التحكم بالمستخدمين، وسجلات التدقيق.',
    scope: ['نظرة عامة', 'البرامج والفعاليات', 'الأخبار والوسائط', 'العضوية والتطوع', 'الشراكات', 'التبرعات', 'المستخدمون والأدوار', 'سجل التدقيق'],
  },
  {
    id: 2,
    name: 'content_manager',
    nameAr: 'مدير المحتوى (Content Manager)',
    descriptionAr: 'إدارة صفحات الموقع، البرامج، الفعاليات، الأخبار، تتبع الترجمات، ونشر وحجب المحتوى.',
    scope: ['نظرة عامة', 'البرامج والفعاليات', 'الأخبار والوسائط', 'الصفحات والترجمات'],
  },
  {
    id: 3,
    name: 'communications_manager',
    nameAr: 'مسؤول التواصل والإعلام (Communications Manager)',
    descriptionAr: 'تحرير ونشر البيانات الصحفية، التغطيات الإعلامية، مكتبة الوسائط، وإدارة رسائل التواصل الواردة.',
    scope: ['نظرة عامة', 'الأخبار والوسائط', 'رسائل التواصل'],
  },
  {
    id: 4,
    name: 'membership_manager',
    nameAr: 'مسؤول شؤون الأعضاء (Membership Manager)',
    descriptionAr: 'مراجعة طلبات الانخراط والعضوية، التحديث (موافقة/رفض)، وتصدير بيانات المنخرطين.',
    scope: ['نظرة عامة', 'طلبات العضوية'],
  },
  {
    id: 5,
    name: 'volunteer_coordinator',
    nameAr: 'منسق متطوعي شباب في العمل (Volunteer Coordinator)',
    descriptionAr: 'متابعة استمارات التطوع، التواصل مع المتقدمين، وتوزيع المهام على الفعاليات الميدانية.',
    scope: ['نظرة عامة', 'طلبات التطوع (شباب في العمل)'],
  },
  {
    id: 6,
    name: 'programs_events_manager',
    nameAr: 'مدير البرامج والفعاليات (Programs & Events Manager)',
    descriptionAr: 'إنشاء الفعاليات، تحديد الطاقة الاستيعابية وتواريخ التسجيل، وتتبع قائمة الحضور والتسجيلات.',
    scope: ['نظرة عامة', 'البرامج والفعاليات', 'تسجيلات الفعاليات'],
  },
  {
    id: 7,
    name: 'partnership_manager',
    nameAr: 'مسؤول الشراكات المؤسسية (Partnership Manager)',
    descriptionAr: 'معالجة مقترحات الشراكة من المؤسسات الثقافية، الشركات، والمنظمات غير الحكومية.',
    scope: ['نظرة عامة', 'الشراكات المؤسسية'],
  },
  {
    id: 8,
    name: 'finance_manager',
    nameAr: 'المسؤول المالي (Finance / Donation Manager)',
    descriptionAr: 'الاطلاع على إشعارات الدعم المالي، سجلات التبرعات والمساهمات، وإعداد التقارير المالية.',
    scope: ['نظرة عامة', 'الدعم والتبرعات'],
  },
  {
    id: 9,
    name: 'reviewer',
    nameAr: 'مدقق ومراجع للقراءة فقط (Read-only Reviewer)',
    descriptionAr: 'صلاحيات قراءة واطلاع وتدقيق فقط لجميع السجلات والطلبات دون إمكانية التعديل أو الحذف.',
    scope: ['استعراض كافة السجلات دون تعديل'],
  },
]

interface UserRoleRow {
  user_id: string
  role_id: number
  profiles: {
    id: string
    email: string
    full_name: string | null
  } | null
}

export default async function AdminRolesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  // Fetch current user roles and all profiles
  const [
    { data: rawUserRoles },
    { data: rawProfiles },
  ] = await Promise.all([
    supabase.from('user_roles').select('user_id, role_id, profiles(id, email, full_name)'),
    supabase.from('profiles').select('id, email, full_name').order('email', { ascending: true }),
  ])

  const userRoles = (rawUserRoles || []) as unknown as UserRoleRow[]
  const profiles = rawProfiles || []

  async function handleAssignRole(formData: FormData) {
    'use server'
    const targetUserId = formData.get('userId') as string
    const roleId = Number(formData.get('roleId'))
    if (!targetUserId || !roleId) return
    await assignUserRole(targetUserId, roleId)
  }

  async function handleRevokeRole(formData: FormData) {
    'use server'
    const targetUserId = formData.get('userId') as string
    const roleId = Number(formData.get('roleId'))
    if (!targetUserId || !roleId) return
    await removeUserRole(targetUserId, roleId)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e5e0d6]">
        <div>
          <div className="flex items-center gap-2 text-2xs font-bold text-[#bd3227] uppercase tracking-wider mb-1">
            <span>الحماية والأمان المؤسسي</span>
            <span>•</span>
            <span>Role-Based Access Control (RBAC)</span>
          </div>
          <h1 className="text-2xl font-black text-[#231f20]">
            مصفوفة الأدوار والصلاحيات (9 أدوار معتمدة)
          </h1>
          <p className="text-xs text-[#5C5A55] mt-1 max-w-2xl">
            تطبيق مبدأ الحد الأدنى من الصلاحيات (Least Privilege) وسياسات أمان PostgreSQL RLS على مستوى قاعدة البيانات لمنع تصعيد الامتيازات غير المصرح به.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-white border border-[#e5e0d6] text-xs font-bold text-[#231f20] shadow-2xs">
            إجمالي الأدوار: 9
          </span>
        </div>
      </div>

      {/* Assign Role Action Card */}
      <div className="bg-white p-6 rounded-2xl border border-[#e5e0d6] shadow-2xs">
        <h2 className="text-xs font-bold text-[#231f20] mb-4 uppercase tracking-wider flex items-center gap-2">
          <span>🛡️</span>
          <span>تعيين دور إداري لمستخدم معتمد / Assign Role to Staff User</span>
        </h2>

        <form action={handleAssignRole} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-3xs font-bold text-[#231f20] mb-1">
              اختر المستخدم / Staff Member:
            </label>
            <select
              name="userId"
              required
              className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs bg-[#F5F3EE] font-semibold text-[#231f20]"
            >
              <option value="">— اختر مستخدماً —</option>
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.full_name ? `${p.full_name} (${p.email})` : p.email}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-3xs font-bold text-[#231f20] mb-1">
              الدور المراد منحه / Role to Grant:
            </label>
            <select
              name="roleId"
              required
              className="w-full px-3 py-2 rounded-xl border border-[#e5e0d6] text-xs bg-[#F5F3EE] font-semibold text-[#231f20]"
            >
              <option value="">— اختر دوراً —</option>
              {rbacMatrix.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.id}. {r.nameAr}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#231f20] hover:bg-[#d2a82b] text-white transition-all shadow-subtle active:scale-98"
            >
              تأكيد منح الدور الإداري ✓
            </button>
          </div>
        </form>
      </div>

      {/* Roles Cards Grid */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-[#231f20] uppercase tracking-wider">
          تفاصيل الأدوار وحدود الوصول (Roles Access Boundaries)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {rbacMatrix.map((role) => {
            const assignedUsers = userRoles.filter((ur) => ur.role_id === role.id)

            return (
              <div
                key={role.id}
                className="bg-white p-5 rounded-2xl border border-[#e5e0d6] shadow-2xs hover:shadow-card transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="w-7 h-7 rounded-lg bg-[#F5F3EE] border border-[#e5e0d6] flex items-center justify-center text-xs font-black text-[#bd3227]">
                      {role.id}
                    </span>
                    <span className="font-mono text-3xs px-2 py-0.5 rounded-full bg-[#231f20]/5 text-[#231f20] font-bold">
                      {role.name}
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-[#231f20] leading-tight mb-2">
                    {role.nameAr}
                  </h3>

                  <p className="text-3xs text-[#5C5A55] leading-relaxed mb-4">
                    {role.descriptionAr}
                  </p>

                  <div className="pt-3 border-t border-[#FEF6CC] mb-3">
                    <span className="text-4xs uppercase tracking-wider font-extrabold text-[#ffd22f] block mb-1.5">
                      نطاق الصلاحيات الممنوحة:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {role.scope.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded-md text-4xs font-bold bg-[#F5F3EE] text-[#231f20] border border-[#e5e0d6]"
                        >
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Assigned Users in this role */}
                <div className="pt-3 border-t border-[#FEF6CC]">
                  <span className="text-4xs uppercase tracking-wider font-extrabold text-[#5C5A55] block mb-1">
                    المستخدمون الحاملون لهذا الدور ({assignedUsers.length}):
                  </span>
                  {assignedUsers.length > 0 ? (
                    <div className="space-y-1 mt-1">
                      {assignedUsers.map((au) => (
                        <div
                          key={`${au.user_id}-${role.id}`}
                          className="flex items-center justify-between text-3xs p-1.5 rounded-lg bg-[#F5F3EE] border border-[#e5e0d6]"
                        >
                          <span className="truncate font-semibold text-[#231f20]">
                            {au.profiles?.full_name || au.profiles?.email}
                          </span>
                          {/* Revoke button */}
                          <form action={handleRevokeRole}>
                            <input type="hidden" name="userId" value={au.user_id} />
                            <input type="hidden" name="roleId" value={role.id} />
                            <button
                              type="submit"
                              title="سحب هذا الدور من المستخدم"
                              className="text-4xs font-bold text-red-600 hover:text-red-800 px-1 py-0.5 rounded transition-colors"
                            >
                              إلغاء ✕
                            </button>
                          </form>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-3xs text-[#5C5A55] italic">
                      لا يوجد مستخدمون مسندون حالياً.
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

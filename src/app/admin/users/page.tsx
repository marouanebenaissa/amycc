import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

interface RoleInfo {
  name: string
  description: string
}

interface UserRoleRelation {
  role_id: number
  roles: RoleInfo | null
}

interface ProfileRow {
  id: string
  email: string
  full_name?: string
  created_at: string
  user_roles?: UserRoleRelation[]
}

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const [{ data: rawProfiles }, { data: roles }] = await Promise.all([
    supabase.from('profiles').select('*, user_roles(role_id, roles(name, description))').order('created_at', { ascending: false }),
    supabase.from('roles').select('*').order('id', { ascending: true }),
  ])

  const profiles = (rawProfiles || []) as ProfileRow[]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#231f20]">Users & Role-Based Permissions (RBAC)</h1>
        <p className="text-xs text-[#5C5A55] mt-1">
          Enforce the principle of least privilege. Manage authorized staff roles and access levels.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#e5e0d6] overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs text-[#231f20]">
            <thead className="bg-[#FAF8F5] border-b border-[#e5e0d6] text-2xs uppercase tracking-wider text-[#5C5A55] font-bold">
              <tr>
                <th className="px-6 py-4 text-start">Staff User</th>
                <th className="px-6 py-4 text-start">Assigned Roles</th>
                <th className="px-6 py-4 text-start">Member Since</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FEF6CC]">
              {profiles.length > 0 ? (
                profiles.map((p) => {
                  const userRoles = p.user_roles?.map((ur) => ur.roles?.name).filter((name): name is string => Boolean(name)) || []
                  return (
                    <tr key={p.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#231f20]">{p.full_name || 'Staff Member'}</div>
                        <div className="text-[#5C5A55] text-3xs font-mono">{p.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        {userRoles.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {userRoles.map((r: string) => (
                              <span
                                key={r}
                                className={`px-2.5 py-0.5 rounded-full text-3xs font-bold uppercase tracking-wider ${
                                  r === 'super_admin'
                                    ? 'bg-[#fde8e7] text-[#bd3227] border border-[#fde8e7]'
                                    : 'bg-[#F4EFE6] text-[#231f20] border border-[#d2a82b]'
                                }`}
                              >
                                {r.replace('_', ' ')}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[#5C5A55] text-2xs">No active role assigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-[#5C5A55] text-3xs">
                        {new Date(p.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-[#5C5A55]">
                    No users loaded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Predefined Roles Reference Card */}
      <div className="bg-white p-6 rounded-2xl border border-[#e5e0d6] shadow-2xs">
        <h2 className="text-xs font-bold text-[#231f20] mb-3 uppercase tracking-wider">
          Predefined Role Definitions in AMYCC Security Matrix
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {roles && roles.length > 0 ? (
            roles.map((role) => (
              <div key={role.id} className="p-3 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6] text-xs">
                <span className="font-bold text-[#231f20] capitalize block">
                  {role.name.replace(/_/g, ' ')}
                </span>
                <span className="text-3xs text-[#5C5A55] leading-relaxed mt-0.5 block">
                  {role.description}
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs text-[#5C5A55]">9 standard roles initialized.</p>
          )}
        </div>
      </div>
    </div>
  )
}

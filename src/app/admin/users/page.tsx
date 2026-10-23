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
        <h1 className="text-2xl font-extrabold text-[#0a0f1d]">Users & Role-Based Permissions</h1>
        <p className="text-xs text-slate-500 mt-1">
          Enforce the principle of least privilege. Manage authorized staff roles and access levels.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-2xs uppercase tracking-wider text-slate-500 font-bold">
              <tr>
                <th className="px-6 py-4 text-start">User</th>
                <th className="px-6 py-4 text-start">Assigned Roles</th>
                <th className="px-6 py-4 text-start">Member Since</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {profiles.length > 0 ? (
                profiles.map((p) => {
                  const userRoles = p.user_roles?.map((ur) => ur.roles?.name).filter((name): name is string => Boolean(name)) || []
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#0a0f1d]">{p.full_name || 'Staff Member'}</div>
                        <div className="text-slate-500 text-2xs font-mono">{p.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        {userRoles.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {userRoles.map((r: string) => (
                              <span
                                key={r}
                                className={`px-2 py-0.5 rounded-full text-3xs font-bold uppercase tracking-wider ${
                                  r === 'super_admin'
                                    ? 'bg-purple-100 text-purple-700'
                                    : 'bg-blue-50 text-[#0068ff]'
                                }`}
                              >
                                {r.replace('_', ' ')}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-2xs">No active role assigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-2xs">
                        {new Date(p.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-slate-400">
                    No users loaded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Directory Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <h2 className="text-sm font-bold text-[#0a0f1d] mb-4">Configured System Roles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {roles?.map((r) => (
            <div key={r.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-bold text-xs text-[#0a0f1d] block capitalize">
                {r.name.replace(/_/g, ' ')}
              </span>
              <p className="text-2xs text-slate-500 mt-1">{r.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

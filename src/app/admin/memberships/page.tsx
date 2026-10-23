import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { updateApplicationStatus, deleteApplicationRecord } from '@/lib/actions/admin'
import { CsvExportButton } from '@/components/admin/CsvExportButton'

interface MembershipRow {
  id: string
  full_name: string
  email: string
  phone: string
  city: string
  profession?: string | null
  interests?: string[] | null
  motivation: string
  status: string
  created_at: string
}

export default async function AdminMembershipsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const { data: applications } = await supabase
    .from('membership_applications')
    .select('*')
    .order('created_at', { ascending: false })

  const rows = (applications || []) as MembershipRow[]

  async function handleStatus(id: string, newStatus: string) {
    'use server'
    await updateApplicationStatus('membership_applications', id, newStatus)
  }

  async function handleDelete(id: string) {
    'use server'
    await deleteApplicationRecord('membership_applications', id)
  }

  const exportData = rows.map((app) => ({
    ID: app.id,
    FullName: app.full_name,
    Email: app.email,
    Phone: app.phone,
    City: app.city,
    Profession: app.profession || '',
    Interests: (app.interests || []).join('; '),
    Motivation: app.motivation,
    Status: app.status,
    AppliedAt: app.created_at,
  }))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#08242a]">Membership Applications</h1>
          <p className="text-xs text-[#5f7174] mt-1">
            Review, approve, or reject incoming association membership applications.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <CsvExportButton data={exportData} filename="amycc-membership-applications" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#e5e0d6] overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs text-[#2d3b3e]">
            <thead className="bg-[#faf7f2] border-b border-[#e5e0d6] text-2xs uppercase tracking-wider text-[#5f7174] font-bold">
              <tr>
                <th className="px-6 py-4 text-start">Applicant</th>
                <th className="px-6 py-4 text-start">City / Profession</th>
                <th className="px-6 py-4 text-start">Motivation</th>
                <th className="px-6 py-4 text-start">Status</th>
                <th className="px-6 py-4 text-start">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4ede2]">
              {rows.length > 0 ? (
                rows.map((app) => (
                  <tr key={app.id} className="hover:bg-[#faf7f2]/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#08242a]">{app.full_name}</div>
                      <div className="text-3xs text-[#5f7174]">{app.email}</div>
                      <div className="text-3xs text-[#819598] font-mono">{app.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold block text-[#08242a]">{app.city}</span>
                      <span className="text-[#819598] text-3xs">{app.profession || '—'}</span>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="truncate text-[#445457] text-xs" title={app.motivation}>
                        {app.motivation}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-2xs font-bold ${
                          app.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : app.status === 'rejected'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-x-2 whitespace-nowrap">
                      {app.status !== 'approved' && (
                        <form action={handleStatus.bind(null, app.id, 'approved')} className="inline">
                          <button
                            type="submit"
                            className="px-2.5 py-1 rounded-lg text-2xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                          >
                            Approve
                          </button>
                        </form>
                      )}
                      {app.status !== 'rejected' && (
                        <form action={handleStatus.bind(null, app.id, 'rejected')} className="inline">
                          <button
                            type="submit"
                            className="px-2.5 py-1 rounded-lg text-2xs font-bold bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                          >
                            Reject
                          </button>
                        </form>
                      )}
                      <form action={handleDelete.bind(null, app.id)} className="inline">
                        <button
                          type="submit"
                          className="px-2.5 py-1 rounded-lg text-2xs font-bold text-slate-400 hover:text-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      </form>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#819598]">
                    No membership applications received yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

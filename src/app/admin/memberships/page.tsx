import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { updateApplicationStatus } from '@/lib/actions/admin'

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0a0f1d]">Membership Applications</h1>
        <p className="text-xs text-slate-500 mt-1">
          Review, approve, or reject incoming membership applications.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-2xs uppercase tracking-wider text-slate-500 font-bold">
              <tr>
                <th className="px-6 py-4 text-start">Applicant</th>
                <th className="px-6 py-4 text-start">City / Profession</th>
                <th className="px-6 py-4 text-start">Motivation</th>
                <th className="px-6 py-4 text-start">Status</th>
                <th className="px-6 py-4 text-start">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications && applications.length > 0 ? (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#0a0f1d]">{app.full_name}</div>
                      <div className="text-slate-500 text-2xs">{app.email}</div>
                      <div className="text-slate-400 text-2xs">{app.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold block">{app.city}</span>
                      <span className="text-slate-400 text-2xs">{app.profession || '—'}</span>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="truncate text-slate-600" title={app.motivation}>
                        {app.motivation}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-2xs font-bold ${
                          app.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700'
                            : app.status === 'rejected'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      <form
                        action={async () => {
                          'use server'
                          await updateApplicationStatus('membership_applications', app.id, 'approved')
                        }}
                        className="inline"
                      >
                        <button
                          type="submit"
                          className="px-2.5 py-1 rounded-lg text-2xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                        >
                          Approve
                        </button>
                      </form>
                      <form
                        action={async () => {
                          'use server'
                          await updateApplicationStatus('membership_applications', app.id, 'rejected')
                        }}
                        className="inline"
                      >
                        <button
                          type="submit"
                          className="px-2.5 py-1 rounded-lg text-2xs font-bold bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                        >
                          Reject
                        </button>
                      </form>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
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

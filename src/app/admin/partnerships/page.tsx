import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { updateApplicationStatus } from '@/lib/actions/admin'

export default async function AdminPartnershipsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const { data: inquiries } = await supabase
    .from('partnership_inquiries')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0a0f1d]">Partnership Inquiries</h1>
        <p className="text-xs text-slate-500 mt-1">
          Review institutional, cultural, and corporate partnership proposals.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-2xs uppercase tracking-wider text-slate-500 font-bold">
              <tr>
                <th className="px-6 py-4 text-start">Organization</th>
                <th className="px-6 py-4 text-start">Contact</th>
                <th className="px-6 py-4 text-start">Proposal</th>
                <th className="px-6 py-4 text-start">Status</th>
                <th className="px-6 py-4 text-start">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inquiries && inquiries.length > 0 ? (
                inquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#0a0f1d]">{inq.organization_name}</div>
                      <div className="text-slate-500 text-2xs">{inq.organization_type}</div>
                      <div className="text-slate-400 text-2xs">{inq.city}, {inq.country}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold block">{inq.contact_name}</span>
                      <span className="text-slate-500 text-2xs">{inq.email}</span>
                      <span className="text-slate-400 text-2xs">{inq.phone || '—'}</span>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="truncate text-slate-600" title={inq.proposal}>
                        {inq.proposal}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-2xs font-bold ${
                          inq.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700'
                            : inq.status === 'rejected'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {inq.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      <form
                        action={async () => {
                          'use server'
                          await updateApplicationStatus('partnership_inquiries', inq.id, 'approved')
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
                          await updateApplicationStatus('partnership_inquiries', inq.id, 'rejected')
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
                    No partnership inquiries received yet.
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

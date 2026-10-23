import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminDonationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const { data: records } = await supabase
    .from('donation_records')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0a0f1d]">Donation & Support Records</h1>
        <p className="text-xs text-slate-500 mt-1">
          Review legitimate support notices, in-kind contributions, and financial sponsorship pledges.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-2xs uppercase tracking-wider text-slate-500 font-bold">
              <tr>
                <th className="px-6 py-4 text-start">Donor / Supporter</th>
                <th className="px-6 py-4 text-start">Support Type</th>
                <th className="px-6 py-4 text-start">Amount</th>
                <th className="px-6 py-4 text-start">Notes</th>
                <th className="px-6 py-4 text-start">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records && records.length > 0 ? (
                records.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#0a0f1d]">{rec.donor_name}</div>
                      <div className="text-slate-500 text-2xs">{rec.donor_email}</div>
                      <div className="text-slate-400 text-2xs">{rec.donor_phone || '—'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold block capitalize">{rec.support_type.replace('_', ' ')}</span>
                    </td>
                    <td className="px-6 py-4">
                      {rec.amount ? (
                        <span className="font-bold text-[#0068ff]">
                          {rec.amount} {rec.currency}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="truncate text-slate-600" title={rec.notes}>
                        {rec.notes || '—'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2.5 py-1 rounded-full text-2xs font-bold bg-amber-50 text-amber-700">
                        {rec.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No donation or support notices recorded yet.
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

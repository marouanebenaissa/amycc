import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { updateApplicationStatus, deleteApplicationRecord } from '@/lib/actions/admin'
import { CsvExportButton } from '@/components/admin/CsvExportButton'

interface DonationRow {
  id: string
  donor_name: string
  donor_email: string
  donor_phone?: string | null
  support_type: string
  amount?: number | null
  currency: string
  notes?: string | null
  status: string
  created_at: string
}

export default async function AdminDonationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const { data: donations } = await supabase
    .from('donation_records')
    .select('*')
    .order('created_at', { ascending: false })

  const rows = (donations || []) as DonationRow[]

  async function handleStatus(id: string, newStatus: string) {
    'use server'
    await updateApplicationStatus('donation_records', id, newStatus)
  }

  async function handleDelete(id: string) {
    'use server'
    await deleteApplicationRecord('donation_records', id)
  }

  const exportData = rows.map((d) => ({
    ID: d.id,
    DonorName: d.donor_name,
    Email: d.donor_email,
    Phone: d.donor_phone || '',
    SupportType: d.support_type,
    Amount: d.amount ?? 0,
    Currency: d.currency,
    Notes: d.notes || '',
    Status: d.status,
    ReceivedAt: d.created_at,
  }))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#08242a]">Support & Donation Notices</h1>
          <p className="text-xs text-[#5f7174] mt-1">
            Financial and in-kind support notifications submitted for association cultural initiatives.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <CsvExportButton data={exportData} filename="amycc-donation-records" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#e5e0d6] overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs text-[#2d3b3e]">
            <thead className="bg-[#faf7f2] border-b border-[#e5e0d6] text-2xs uppercase tracking-wider text-[#5f7174] font-bold">
              <tr>
                <th className="px-6 py-4 text-start">Benefactor</th>
                <th className="px-6 py-4 text-start">Support Type & Scope</th>
                <th className="px-6 py-4 text-start">Notes</th>
                <th className="px-6 py-4 text-start">Status</th>
                <th className="px-6 py-4 text-start">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4ede2]">
              {rows.length > 0 ? (
                rows.map((d) => (
                  <tr key={d.id} className="hover:bg-[#faf7f2]/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#08242a]">{d.donor_name}</div>
                      <a href={`mailto:${d.donor_email}`} className="text-3xs text-[#0d3b43] hover:underline block">
                        {d.donor_email}
                      </a>
                      {d.donor_phone && <div className="text-3xs text-[#819598] font-mono">{d.donor_phone}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold block text-[#08242a] capitalize">
                        {d.support_type.replace('_', ' ')}
                      </span>
                      {d.amount ? (
                        <span className="text-xs font-black text-[#c85a32]">
                          {d.amount.toLocaleString()} {d.currency}
                        </span>
                      ) : (
                        <span className="text-3xs text-[#819598]">In-Kind / Material</span>
                      )}
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="truncate text-[#445457] text-xs" title={d.notes || '—'}>
                        {d.notes || '—'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-2xs font-bold ${
                          d.status === 'confirmed' || d.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-x-2 whitespace-nowrap">
                      {d.status !== 'confirmed' && (
                        <form action={handleStatus.bind(null, d.id, 'confirmed')} className="inline">
                          <button
                            type="submit"
                            className="px-2.5 py-1 rounded-lg text-2xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                          >
                            Confirm
                          </button>
                        </form>
                      )}
                      <form action={handleDelete.bind(null, d.id)} className="inline">
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
                    No donation or support records submitted yet.
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

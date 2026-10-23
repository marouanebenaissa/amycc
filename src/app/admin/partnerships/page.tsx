import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { updateApplicationStatus, deleteApplicationRecord } from '@/lib/actions/admin'
import { CsvExportButton } from '@/components/admin/CsvExportButton'

interface PartnershipRow {
  id: string
  organization_name: string
  organization_type: string
  contact_name: string
  email: string
  phone?: string | null
  city: string
  country: string
  proposal: string
  status: string
  created_at: string
}

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

  const rows = (inquiries || []) as PartnershipRow[]

  async function handleStatus(id: string, newStatus: string) {
    'use server'
    await updateApplicationStatus('partnership_inquiries', id, newStatus)
  }

  async function handleDelete(id: string) {
    'use server'
    await deleteApplicationRecord('partnership_inquiries', id)
  }

  const exportData = rows.map((inq) => ({
    ID: inq.id,
    Organization: inq.organization_name,
    Type: inq.organization_type,
    ContactPerson: inq.contact_name,
    Email: inq.email,
    Phone: inq.phone || '',
    City: inq.city,
    Country: inq.country,
    Proposal: inq.proposal,
    Status: inq.status,
    ReceivedAt: inq.created_at,
  }))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#08242a]">Institutional Partnership Inquiries</h1>
          <p className="text-xs text-[#5f7174] mt-1">
            Review collaboration proposals from cultural centers, schools, universities, and civil society.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <CsvExportButton data={exportData} filename="amycc-partnerships" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#e5e0d6] overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs text-[#2d3b3e]">
            <thead className="bg-[#faf7f2] border-b border-[#e5e0d6] text-2xs uppercase tracking-wider text-[#5f7174] font-bold">
              <tr>
                <th className="px-6 py-4 text-start">Organization</th>
                <th className="px-6 py-4 text-start">Contact Person</th>
                <th className="px-6 py-4 text-start">Proposal Summary</th>
                <th className="px-6 py-4 text-start">Status</th>
                <th className="px-6 py-4 text-start">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4ede2]">
              {rows.length > 0 ? (
                rows.map((inq) => (
                  <tr key={inq.id} className="hover:bg-[#faf7f2]/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#08242a]">{inq.organization_name}</div>
                      <div className="text-3xs text-[#c85a32] font-semibold">{inq.organization_type}</div>
                      <div className="text-3xs text-[#819598]">{inq.city}, {inq.country}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold block text-[#08242a]">{inq.contact_name}</span>
                      <a href={`mailto:${inq.email}`} className="text-3xs text-[#0d3b43] hover:underline block">
                        {inq.email}
                      </a>
                      {inq.phone && <div className="text-3xs text-[#819598] font-mono">{inq.phone}</div>}
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="truncate text-[#445457] text-xs" title={inq.proposal}>
                        {inq.proposal}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-2xs font-bold ${
                          inq.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : inq.status === 'rejected'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : inq.status === 'under_review'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {inq.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-x-2 whitespace-nowrap">
                      {inq.status !== 'approved' && (
                        <form action={handleStatus.bind(null, inq.id, 'approved')} className="inline">
                          <button
                            type="submit"
                            className="px-2.5 py-1 rounded-lg text-2xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                          >
                            Approve
                          </button>
                        </form>
                      )}
                      {inq.status !== 'under_review' && (
                        <form action={handleStatus.bind(null, inq.id, 'under_review')} className="inline">
                          <button
                            type="submit"
                            className="px-2.5 py-1 rounded-lg text-2xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                          >
                            Review
                          </button>
                        </form>
                      )}
                      <form action={handleDelete.bind(null, inq.id)} className="inline">
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

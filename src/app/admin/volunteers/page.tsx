import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { updateApplicationStatus, deleteApplicationRecord } from '@/lib/actions/admin'
import { CsvExportButton } from '@/components/admin/CsvExportButton'

interface VolunteerRow {
  id: string
  full_name: string
  email: string
  phone?: string | null
  city: string
  skills: string
  availability: string
  initiative: string
  status: string
  created_at: string
}

export default async function AdminVolunteersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const { data: volunteers } = await supabase
    .from('volunteer_applications')
    .select('*')
    .order('created_at', { ascending: false })

  const rows = (volunteers || []) as VolunteerRow[]

  async function handleStatus(id: string, newStatus: string) {
    'use server'
    await updateApplicationStatus('volunteer_applications', id, newStatus)
  }

  async function handleDelete(id: string) {
    'use server'
    await deleteApplicationRecord('volunteer_applications', id)
  }

  const exportData = rows.map((v) => ({
    ID: v.id,
    FullName: v.full_name,
    Email: v.email,
    Phone: v.phone || '',
    City: v.city,
    Skills: v.skills,
    Availability: v.availability,
    Initiative: v.initiative,
    Status: v.status,
    AppliedAt: v.created_at,
  }))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#231f20]">Youth in Action Volunteer Roster</h1>
          <p className="text-xs text-[#5C5A55] mt-1">
            Review and coordinate volunteers for cultural workshops, events, and community initiatives.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <CsvExportButton data={exportData} filename="amycc-volunteers-roster" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#e5e0d6] overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs text-[#231f20]">
            <thead className="bg-[#F5F3EE] border-b border-[#e5e0d6] text-2xs uppercase tracking-wider text-[#5C5A55] font-bold">
              <tr>
                <th className="px-6 py-4 text-start">Volunteer</th>
                <th className="px-6 py-4 text-start">City / Availability</th>
                <th className="px-6 py-4 text-start">Skills & Initiative</th>
                <th className="px-6 py-4 text-start">Status</th>
                <th className="px-6 py-4 text-start">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FEF6CC]">
              {rows.length > 0 ? (
                rows.map((vol) => (
                  <tr key={vol.id} className="hover:bg-[#F5F3EE]/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#231f20]">{vol.full_name}</div>
                      <div className="text-3xs text-[#5C5A55]">{vol.email}</div>
                      {vol.phone && <div className="text-3xs text-[#5C5A55] font-mono">{vol.phone}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold block text-[#231f20]">{vol.city}</span>
                      <span className="text-[#5C5A55] text-3xs">{vol.availability}</span>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <span className="inline-block px-2 py-0.5 rounded text-3xs font-bold bg-[#FEF6CC] text-[#231f20] mb-1">
                        {vol.initiative}
                      </span>
                      <p className="truncate text-[#5C5A55] text-xs" title={vol.skills}>
                        {vol.skills}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-2xs font-bold ${
                          vol.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : vol.status === 'rejected'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {vol.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-x-2 whitespace-nowrap">
                      {vol.status !== 'approved' && (
                        <form action={handleStatus.bind(null, vol.id, 'approved')} className="inline">
                          <button
                            type="submit"
                            className="px-2.5 py-1 rounded-lg text-2xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                          >
                            Approve
                          </button>
                        </form>
                      )}
                      {vol.status !== 'rejected' && (
                        <form action={handleStatus.bind(null, vol.id, 'rejected')} className="inline">
                          <button
                            type="submit"
                            className="px-2.5 py-1 rounded-lg text-2xs font-bold bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                          >
                            Reject
                          </button>
                        </form>
                      )}
                      <form action={handleDelete.bind(null, vol.id)} className="inline">
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
                  <td colSpan={5} className="px-6 py-12 text-center text-[#5C5A55]">
                    No volunteer applications received yet.
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

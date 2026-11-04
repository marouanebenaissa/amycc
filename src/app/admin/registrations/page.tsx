import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { updateApplicationStatus, deleteApplicationRecord } from '@/lib/actions/admin'
import { CsvExportButton } from '@/components/admin/CsvExportButton'

interface RegistrationRow {
  id: string
  full_name: string
  email: string
  phone?: string | null
  status: string
  created_at: string
  event_id: string
  events?: {
    slug: string
    event_translations?: { title: string }[]
  } | null
}

export default async function AdminRegistrationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const { data: rawRegistrations } = await supabase
    .from('event_registrations')
    .select('*, events(slug, event_translations(title))')
    .order('created_at', { ascending: false })

  const registrations = (rawRegistrations || []) as RegistrationRow[]

  async function handleStatusUpdate(id: string, newStatus: string) {
    'use server'
    await updateApplicationStatus('event_registrations', id, newStatus)
  }

  async function handleDelete(id: string) {
    'use server'
    await deleteApplicationRecord('event_registrations', id)
  }

  const exportData = registrations.map((r) => ({
    ID: r.id,
    FullName: r.full_name,
    Email: r.email,
    Phone: r.phone || '',
    Event: r.events?.event_translations?.[0]?.title || r.events?.slug || r.event_id,
    Status: r.status,
    RegisteredAt: r.created_at,
  }))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#231f20]">Event Registrations</h1>
          <p className="text-xs text-[#5C5A55] mt-1">
            Track attendee registrations, capacities, confirmations, and attendance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <CsvExportButton data={exportData} filename="amycc-event-registrations" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#e5e0d6] overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs text-[#231f20]">
            <thead className="bg-[#F5F3EE] border-b border-[#e5e0d6] text-2xs uppercase tracking-wider text-[#5C5A55] font-bold">
              <tr>
                <th className="px-6 py-4 text-start">Attendee</th>
                <th className="px-6 py-4 text-start">Event</th>
                <th className="px-6 py-4 text-start">Status</th>
                <th className="px-6 py-4 text-start">Registered Date</th>
                <th className="px-6 py-4 text-start">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FEF6CC]">
              {registrations.length > 0 ? (
                registrations.map((reg) => {
                  const eventTitle =
                    reg.events?.event_translations?.[0]?.title || reg.events?.slug || 'Cultural Event'
                  return (
                    <tr key={reg.id} className="hover:bg-[#F5F3EE]/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#231f20]">{reg.full_name}</div>
                        <div className="text-3xs text-[#5C5A55]">{reg.email}</div>
                        {reg.phone && <div className="text-3xs text-[#5C5A55] font-mono">{reg.phone}</div>}
                      </td>
                      <td className="px-6 py-4 font-semibold text-[#231f20]">
                        {eventTitle}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-2xs font-bold ${
                            reg.status === 'confirmed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : reg.status === 'attended'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : reg.status === 'waitlist'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {reg.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#5C5A55] text-3xs">
                        {new Date(reg.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 space-x-2">
                        {reg.status !== 'attended' && (
                          <form action={handleStatusUpdate.bind(null, reg.id, 'attended')} className="inline">
                            <button
                              type="submit"
                              className="px-2.5 py-1 rounded-lg text-2xs font-bold bg-[#FEF6CC] text-[#231f20] hover:bg-[#d2a82b] transition-colors"
                            >
                              Mark Attended
                            </button>
                          </form>
                        )}
                        {reg.status !== 'cancelled' && (
                          <form action={handleStatusUpdate.bind(null, reg.id, 'cancelled')} className="inline">
                            <button
                              type="submit"
                              className="px-2.5 py-1 rounded-lg text-2xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                            >
                              Cancel
                            </button>
                          </form>
                        )}
                        <form action={handleDelete.bind(null, reg.id)} className="inline">
                          <button
                            type="submit"
                            className="px-2.5 py-1 rounded-lg text-2xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                          >
                            Delete
                          </button>
                        </form>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#5C5A55]">
                    No event registrations recorded yet.
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

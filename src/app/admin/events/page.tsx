import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { deleteEvent } from '@/lib/actions/content'

export default async function AdminEventsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const { data: events } = await supabase
    .from('events')
    .select('*, event_translations(*), event_registrations(count)')
    .order('start_date', { ascending: false })

  async function toggleRegistration(id: string, currentOpen: boolean) {
    'use server'
    const sb = await createClient()
    await sb.from('events').update({ registration_open: !currentOpen }).eq('id', id)
    revalidatePath('/admin/events')
  }

  async function handleDelete(id: string) {
    'use server'
    await deleteEvent(id)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#08242a]">Events & Cultural Programming</h1>
          <p className="text-xs text-[#5f7174] mt-1">
            Monitor upcoming workshops, cultural nights, venue capacities, and registration gates.
          </p>
        </div>
        <Link
          href="/admin/events/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0d3b43] text-white text-xs font-bold rounded-xl hover:bg-[#14505b] active:scale-98 transition-all shadow-subtle hover:shadow-card"
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Event
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-[#e5e0d6] overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs text-[#2d3b3e]">
            <thead className="bg-[#faf7f2] border-b border-[#e5e0d6] text-2xs uppercase tracking-wider text-[#5f7174] font-bold">
              <tr>
                <th className="px-6 py-4 text-start">Event Title</th>
                <th className="px-6 py-4 text-start">Date & Venue</th>
                <th className="px-6 py-4 text-start">Capacity & Regs</th>
                <th className="px-6 py-4 text-start">Registration</th>
                <th className="px-6 py-4 text-start">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4ede2]">
              {events && events.length > 0 ? (
                events.map((ev) => {
                  const title = ev.event_translations?.[0]?.title || ev.slug
                  const regCount = ev.event_registrations?.[0]?.count ?? 0
                  return (
                    <tr key={ev.id} className="hover:bg-[#faf7f2]/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#08242a]">{title}</div>
                        <div className="text-[#819598] text-3xs font-mono">/{ev.slug}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold block text-[#08242a]">
                          {new Date(ev.start_date).toLocaleDateString()}
                        </span>
                        <span className="text-[#819598] text-3xs">
                          {ev.venue || ev.city || 'TBD'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-[#0d3b43]">{regCount}</span>
                        <span className="text-[#819598] text-3xs"> / {ev.capacity || 'Unlimited'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-2xs font-bold ${
                            ev.registration_open
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {ev.registration_open ? 'Open' : 'Closed'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link
                            href={`/admin/events/${ev.id}/edit`}
                            className="px-2.5 py-1 rounded-lg text-2xs font-bold bg-[#faf7f2] text-[#08242a] hover:bg-[#f4ede2] border border-[#e5e0d6] transition-colors"
                          >
                            Edit
                          </Link>
                          <form action={toggleRegistration.bind(null, ev.id, ev.registration_open)}>
                            <button
                              type="submit"
                              className="px-2.5 py-1 rounded-lg text-2xs font-bold border border-[#cfc7b9] hover:bg-[#faf7f2] transition-colors"
                            >
                              {ev.registration_open ? 'Close Reg.' : 'Open Reg.'}
                            </button>
                          </form>
                          <form action={handleDelete.bind(null, ev.id)} className="inline">
                            <button
                              type="submit"
                              className="px-2.5 py-1 rounded-lg text-2xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                            >
                              Delete
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#819598]">
                    No events scheduled yet.{' '}
                    <Link href="/admin/events/new" className="text-[#c85a32] font-bold hover:underline">
                      Schedule the first one →
                    </Link>
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

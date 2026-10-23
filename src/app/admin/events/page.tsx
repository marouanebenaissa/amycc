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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0a0f1d]">Events & Registrations</h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitor upcoming workshops, cultural nights, venue capacities, and registrations.
          </p>
        </div>
        <Link
          href="/admin/events/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0068ff] text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors"
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Event
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-2xs uppercase tracking-wider text-slate-500 font-bold">
              <tr>
                <th className="px-6 py-4 text-start">Event Title</th>
                <th className="px-6 py-4 text-start">Date & Venue</th>
                <th className="px-6 py-4 text-start">Capacity & Regs</th>
                <th className="px-6 py-4 text-start">Registration</th>
                <th className="px-6 py-4 text-start">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {events && events.length > 0 ? (
                events.map((ev) => {
                  const title = ev.event_translations?.[0]?.title || ev.slug
                  const regCount = ev.event_registrations?.[0]?.count ?? 0
                  return (
                    <tr key={ev.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#0a0f1d]">{title}</div>
                        <div className="text-slate-400 text-3xs font-mono">/{ev.slug}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold block">
                          {new Date(ev.start_date).toLocaleDateString()}
                        </span>
                        <span className="text-slate-400 text-2xs">
                          {ev.venue || ev.city || 'TBD'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-[#0068ff]">{regCount}</span>
                        <span className="text-slate-400 text-2xs"> / {ev.capacity || 'Unlimited'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-2xs font-bold ${
                            ev.registration_open
                              ? 'bg-emerald-50 text-emerald-700'
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
                            className="px-2.5 py-1 rounded-lg text-2xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                          >
                            Edit
                          </Link>
                          <form action={toggleRegistration.bind(null, ev.id, ev.registration_open)}>
                            <button
                              type="submit"
                              className="px-2.5 py-1 rounded-lg text-2xs font-bold border border-slate-200 hover:bg-slate-50 transition-colors"
                            >
                              {ev.registration_open ? 'Close Reg.' : 'Open Reg.'}
                            </button>
                          </form>
                          <form action={handleDelete.bind(null, ev.id)} className="inline">
                            <button
                              type="submit"
                              className="px-2.5 py-1 rounded-lg text-2xs font-bold bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
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
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No events yet.{' '}
                    <Link href="/admin/events/new" className="text-[#0068ff] hover:underline">
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

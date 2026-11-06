import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { deleteEvent } from '@/lib/actions/content'
import { getEventsPageSettings, defaultEventsPageConfig } from '@/lib/settings'
import { EventsAdminTabs, type AdminEventRow } from '@/components/admin/EventsAdminTabs'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export default async function AdminEventsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const [{ data: initialEvents }, pageSettings] = await Promise.all([
    supabase
      .from('events')
      .select('*, event_translations(*), event_registrations(id, full_name, email, phone, status, created_at)')
      .order('start_date', { ascending: false }),
    getEventsPageSettings(),
  ])

  const events = (initialEvents || []) as AdminEventRow[]

  async function toggleRegistration(id: string, currentOpen: boolean) {
    'use server'
    const sb = await createClient()
    await sb.from('events').update({ registration_open: !currentOpen }).eq('id', id)
    revalidatePath('/admin/events')
    revalidatePath('/ar/events')
    revalidatePath('/fr/events')
    revalidatePath('/en/events')
    revalidatePath('/events')
    revalidatePath('/[locale]/events', 'page')
  }

  async function handleDelete(id: string) {
    'use server'
    const res = await deleteEvent(id)
    revalidatePath('/admin/events')
    revalidatePath('/ar/events')
    revalidatePath('/fr/events')
    revalidatePath('/en/events')
    revalidatePath('/events')
    revalidatePath('/[locale]/events', 'page')
    return res
  }

  return (
    <EventsAdminTabs
      events={events}
      initialPageConfig={pageSettings}
      defaultPageConfig={defaultEventsPageConfig}
      onToggleRegistration={toggleRegistration}
      onDeleteEvent={handleDelete}
    />
  )
}

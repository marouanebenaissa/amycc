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

  const [{ data: rawEvents }, pageSettings] = await Promise.all([
    supabase
      .from('events')
      .select('*, event_translations(*), event_registrations(count)')
      .order('start_date', { ascending: false }),
    getEventsPageSettings(),
  ])

  const events = (rawEvents || []) as AdminEventRow[]

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
    await deleteEvent(id)
    revalidatePath('/admin/events')
    revalidatePath('/ar/events')
    revalidatePath('/fr/events')
    revalidatePath('/en/events')
    revalidatePath('/events')
    revalidatePath('/[locale]/events', 'page')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#08242a] tracking-tight">
            إدارة الفعاليات والورشات الثقافية (Events CMS)
          </h1>
          <p className="text-xs sm:text-sm text-[#5f7174] mt-1">
            إدارة أجندة الورشات والعروض الفنية، بوابات التسجيل وتتبع المقاعد، وتخصيص واجهة ورأس صفحة الفعاليات.
          </p>
        </div>
      </div>

      <EventsAdminTabs
        events={events}
        initialPageConfig={pageSettings}
        defaultPageConfig={defaultEventsPageConfig}
        onToggleRegistration={toggleRegistration}
        onDeleteEvent={handleDelete}
      />
    </div>
  )
}

import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { EventForm } from '@/components/admin/EventForm'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'

export default async function EditEventPage(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const { data: event } = await supabase
    .from('events')
    .select('*, event_translations(*)')
    .eq('id', id)
    .single()

  if (!event) {
    notFound()
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <AdminPageHeader
        backHref="/admin/events"
        backTitle={{ ar: 'العودة للفعاليات', fr: 'Retour aux événements', en: 'Back to Events' }}
        title={{ ar: 'تعديل الفعالية أو الورشة', fr: 'Modifier l\'événement', en: 'Edit Event' }}
        subtitle={{
          ar: 'تعديل مواعيد الفعالية، السعة، حالة التذاكر، والنصوص بثلاث لغات.',
          fr: 'Modifier les dates, la capacité, la billetterie et les textes trilingues.',
          en: 'Modify event schedule, capacity, registration availability, and multilingual texts.',
        }}
      />

      <EventForm event={event} />
    </div>
  )
}

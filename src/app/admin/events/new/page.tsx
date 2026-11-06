import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { EventForm } from '@/components/admin/EventForm'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'

export default async function NewEventPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <AdminPageHeader
        backHref="/admin/events"
        backTitle={{ ar: 'العودة للفعاليات', fr: 'Retour aux événements', en: 'Back to Events' }}
        title={{ ar: 'جدولة فعالية أو ورشة جديدة', fr: 'Planifier un nouvel événement', en: 'Schedule New Event' }}
        subtitle={{
          ar: 'تحديد المواعيد، مكان الانعقاد، السعة الاستيعابية، والتفاصيل بثلاث لغات.',
          fr: 'Configurer dates, lieu, jauge d\'accueil, inscriptions et descriptions.',
          en: 'Configure dates, venue, capacity, registration parameters, and descriptions.',
        }}
      />

      <EventForm />
    </div>
  )
}

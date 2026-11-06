import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProgramForm } from '@/components/admin/ProgramForm'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'

export default async function NewProgramPage() {
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
        backHref="/admin/programs"
        backTitle={{ ar: 'العودة للبرامج', fr: 'Retour aux programmes', en: 'Back to Programs' }}
        title={{ ar: 'إضافة برنامج ثقافي جديد', fr: 'Créer un nouveau programme', en: 'Create New Program' }}
        subtitle={{
          ar: 'تحديد تفاصيل المبادرة وإدخال الترجمات الثلاث (العربية، الفرنسية، الإنجليزية).',
          fr: 'Définir les détails du programme et les contenus trilingues (Arabe, Français, Anglais).',
          en: 'Define program details and trilingual translations (Arabic, French, English).',
        }}
      />

      <ProgramForm />
    </div>
  )
}

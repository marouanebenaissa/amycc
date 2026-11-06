import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { ProgramForm } from '@/components/admin/ProgramForm'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'

export default async function EditProgramPage(props: {
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

  const { data: program } = await supabase
    .from('programs')
    .select('*, program_translations(*)')
    .eq('id', id)
    .single()

  if (!program) {
    notFound()
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <AdminPageHeader
        backHref="/admin/programs"
        backTitle={{ ar: 'العودة للبرامج', fr: 'Retour aux programmes', en: 'Back to Programs' }}
        title={{ ar: 'تعديل البرنامج الثقافي', fr: 'Modifier le programme', en: 'Edit Program' }}
        subtitle={{
          ar: 'تحديث تفاصيل البرنامج والمحتوى التحريري باللغات الثلاث.',
          fr: 'Mettre à jour les informations et le contenu trilingue du programme.',
          en: 'Update program information and trilingual content.',
        }}
      />

      <ProgramForm program={program} />
    </div>
  )
}

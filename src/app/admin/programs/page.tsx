import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { deleteProgram } from '@/lib/actions/content'
import { getProgramsPageSettings, defaultProgramsPageConfig } from '@/lib/settings'
import { ProgramsAdminTabs } from '@/components/admin/ProgramsAdminTabs'
import type { AdminProgramRow } from '@/components/admin/ProgramsListManager'

export const dynamic = 'force-dynamic'

export default async function AdminProgramsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const [{ data: rawPrograms }, pageSettings] = await Promise.all([
    supabase
      .from('programs')
      .select('id, slug, category, city, cover_image, status, created_at, program_translations(locale, title, description)')
      .order('created_at', { ascending: false }),
    getProgramsPageSettings(),
  ])

  const programs = (rawPrograms || []) as AdminProgramRow[]

  async function updateProgramStatus(id: string, newStatus: string) {
    'use server'
    const sb = await createClient()
    await sb.from('programs').update({ status: newStatus }).eq('id', id)
    revalidatePath('/admin/programs')
    revalidatePath('/[locale]/programs')
  }

  async function handleDelete(id: string) {
    'use server'
    await deleteProgram(id)
  }

  return (
    <ProgramsAdminTabs
      programs={programs}
      initialPageConfig={pageSettings}
      defaultPageConfig={defaultProgramsPageConfig}
      onUpdateStatus={updateProgramStatus}
      onDeleteProgram={handleDelete}
    />
  )
}

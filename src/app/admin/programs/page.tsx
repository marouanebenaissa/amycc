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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#231f20] tracking-tight">
            إدارة البرامج والمشاريع الثقافية (Programs CMS)
          </h1>
          <p className="text-xs sm:text-sm text-[#5C5A55] mt-1">
            إدارة كتالوج المبادرات، وتخصيص واجهة ورأس صفحة البرامج، ومؤشرات الأثر بالمملكة.
          </p>
        </div>
      </div>

      <ProgramsAdminTabs
        programs={programs}
        initialPageConfig={pageSettings}
        defaultPageConfig={defaultProgramsPageConfig}
        onUpdateStatus={updateProgramStatus}
        onDeleteProgram={handleDelete}
      />
    </div>
  )
}

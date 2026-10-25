import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getAnnualProgramSettings, defaultAnnualProgramConfig } from '@/lib/settings'
import { AnnualProgramManager } from '@/components/admin/AnnualProgramManager'

export const dynamic = 'force-dynamic'

export default async function AdminAnnualProgramPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const initialConfig = await getAnnualProgramSettings()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#08242a] tracking-tight">
            إدارة البرنامج السنوي (Annual Program CMS)
          </h1>
          <p className="text-xs sm:text-sm text-[#5f7174] mt-1">
            تخصيص واجهة البرنامج الثقافي السنوي، الفصول الأربعة، المبادرات والأحداث، ومؤشرات الأثر بالمملكة المغربية.
          </p>
        </div>
      </div>

      <AnnualProgramManager
        initialConfig={initialConfig}
        defaultConfig={defaultAnnualProgramConfig}
      />
    </div>
  )
}

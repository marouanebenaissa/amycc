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
    <AnnualProgramManager
      initialConfig={initialConfig}
      defaultConfig={defaultAnnualProgramConfig}
    />
  )
}

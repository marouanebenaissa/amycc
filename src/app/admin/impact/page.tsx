import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getImpactSettings, defaultImpactConfig } from '@/lib/settings'
import { ImpactManager } from '@/components/admin/ImpactManager'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export default async function AdminImpactPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const initialConfig = await getImpactSettings()

  return (
    <ImpactManager
      initialConfig={initialConfig}
      defaultConfig={defaultImpactConfig}
    />
  )
}

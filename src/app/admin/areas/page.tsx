import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getAreasSettings, defaultAreasConfig } from '@/lib/settings'
import { AreasManager } from '@/components/admin/AreasManager'

export const dynamic = 'force-dynamic'

export default async function AdminAreasPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const areasConfig = await getAreasSettings()

  return (
    <AreasManager
      initialConfig={areasConfig}
      defaultItems={defaultAreasConfig.items}
    />
  )
}

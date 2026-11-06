import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import {
  getTeamSettings,
  defaultTeamConfig,
  getCommissionsSettings,
  defaultCommissionsConfig,
} from '@/lib/settings'
import { TeamAdminTabs } from '@/components/admin/TeamAdminTabs'

export const dynamic = 'force-dynamic'

export default async function AdminTeamPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const teamConfig = await getTeamSettings()
  const commissionsConfig = await getCommissionsSettings()

  return (
    <TeamAdminTabs
      teamConfig={teamConfig}
      commissionsConfig={commissionsConfig}
      defaultTeamMembers={defaultTeamConfig.members}
      defaultCommissions={defaultCommissionsConfig.items}
    />
  )
}


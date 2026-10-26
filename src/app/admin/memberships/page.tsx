import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { updateApplicationStatus, deleteApplicationRecord } from '@/lib/actions/admin'
import { getMembershipPageSettings } from '@/lib/settings'
import {
  MembershipsAdminTabs,
  type MembershipApplicationRow,
} from '@/components/admin/MembershipsAdminTabs'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export default async function AdminMembershipsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const [{ data: applications }, config] = await Promise.all([
    supabase
      .from('membership_applications')
      .select('*')
      .order('created_at', { ascending: false }),
    getMembershipPageSettings(),
  ])

  const rows = (applications || []) as MembershipApplicationRow[]

  async function handleStatus(id: string, newStatus: string) {
    'use server'
    await updateApplicationStatus('membership_applications', id, newStatus)
  }

  async function handleDelete(id: string) {
    'use server'
    await deleteApplicationRecord('membership_applications', id)
  }

  return (
    <MembershipsAdminTabs
      initialApplications={rows}
      initialConfig={config}
      onUpdateStatus={handleStatus}
      onDeleteApplication={handleDelete}
    />
  )
}

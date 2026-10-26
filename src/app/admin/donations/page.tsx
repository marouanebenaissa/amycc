import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { updateApplicationStatus, deleteApplicationRecord } from '@/lib/actions/admin'
import { getSupportPageSettings } from '@/lib/settings'
import {
  DonationsAdminTabs,
  type DonationRecordRow,
} from '@/components/admin/DonationsAdminTabs'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export default async function AdminDonationsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const [{ data: donations }, config] = await Promise.all([
    supabase
      .from('donation_records')
      .select('*')
      .order('created_at', { ascending: false }),
    getSupportPageSettings(),
  ])

  const rows = (donations || []) as DonationRecordRow[]

  async function handleStatus(id: string, newStatus: string) {
    'use server'
    await updateApplicationStatus('donation_records', id, newStatus)
  }

  async function handleDelete(id: string) {
    'use server'
    await deleteApplicationRecord('donation_records', id)
  }

  return (
    <DonationsAdminTabs
      initialDonations={rows}
      initialConfig={config}
      onUpdateStatus={handleStatus}
      onDeleteRecord={handleDelete}
    />
  )
}

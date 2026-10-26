import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { updateApplicationStatus, deleteApplicationRecord } from '@/lib/actions/admin'
import { getPartnershipsPageSettings } from '@/lib/settings'
import { PartnershipsAdminTabs, type PartnershipInquiryRow } from '@/components/admin/PartnershipsAdminTabs'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export default async function AdminPartnershipsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const [{ data: inquiries }, config] = await Promise.all([
    supabase
      .from('partnership_inquiries')
      .select('*')
      .order('created_at', { ascending: false }),
    getPartnershipsPageSettings(),
  ])

  const rows = (inquiries || []) as PartnershipInquiryRow[]

  async function handleStatus(id: string, newStatus: string) {
    'use server'
    await updateApplicationStatus('partnership_inquiries', id, newStatus)
  }

  async function handleDelete(id: string) {
    'use server'
    await deleteApplicationRecord('partnership_inquiries', id)
  }

  return (
    <PartnershipsAdminTabs
      initialInquiries={rows}
      initialConfig={config}
      onUpdateStatus={handleStatus}
      onDeleteInquiry={handleDelete}
    />
  )
}

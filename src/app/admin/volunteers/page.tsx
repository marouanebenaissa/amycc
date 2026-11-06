import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { updateApplicationStatus, deleteApplicationRecord } from '@/lib/actions/admin'
import {
  AdminVolunteersClient,
  type VolunteerRow,
} from '@/components/admin/AdminVolunteersClient'

export const dynamic = 'force-dynamic'

export default async function AdminVolunteersPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const { data: volunteers } = await supabase
    .from('volunteer_applications')
    .select('*')
    .order('created_at', { ascending: false })

  const rows = (volunteers || []) as VolunteerRow[]

  async function handleStatus(id: string, newStatus: string) {
    'use server'
    await updateApplicationStatus('volunteer_applications', id, newStatus)
  }

  async function handleDelete(id: string) {
    'use server'
    await deleteApplicationRecord('volunteer_applications', id)
  }

  return (
    <AdminVolunteersClient
      initialVolunteers={rows}
      onUpdateStatus={handleStatus}
      onDelete={handleDelete}
    />
  )
}

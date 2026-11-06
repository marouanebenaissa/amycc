import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { updateApplicationStatus, deleteApplicationRecord } from '@/lib/actions/admin'
import {
  AdminRegistrationsClient,
  type RegistrationRow,
} from '@/components/admin/AdminRegistrationsClient'

export const dynamic = 'force-dynamic'

export default async function AdminRegistrationsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const { data: rawRegistrations } = await supabase
    .from('event_registrations')
    .select('*, events(slug, event_translations(title))')
    .order('created_at', { ascending: false })

  const registrations = (rawRegistrations || []) as RegistrationRow[]

  async function handleStatusUpdate(id: string, newStatus: string) {
    'use server'
    await updateApplicationStatus('event_registrations', id, newStatus)
  }

  async function handleDelete(id: string) {
    'use server'
    await deleteApplicationRecord('event_registrations', id)
  }

  return (
    <AdminRegistrationsClient
      initialRegistrations={registrations}
      onUpdateStatus={handleStatusUpdate}
      onDelete={handleDelete}
    />
  )
}

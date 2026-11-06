import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { updateApplicationStatus, deleteApplicationRecord } from '@/lib/actions/admin'
import { getContactSettings, defaultContactConfig } from '@/lib/settings'
import { ContactAdminTabs } from '@/components/admin/ContactAdminTabs'

export const dynamic = 'force-dynamic'

interface ContactMessageRow {
  id: string
  full_name: string
  email: string
  phone?: string | null
  subject?: string | null
  message: string
  status: string
  created_at: string
}

export default async function AdminContactsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const [contactSettings, messagesRes] = await Promise.all([
    getContactSettings(),
    supabase.from('contact_messages').select('*').order('created_at', { ascending: false }),
  ])

  const messages = (messagesRes.data || []) as ContactMessageRow[]

  async function handleStatus(id: string, newStatus: string) {
    'use server'
    await updateApplicationStatus('contact_messages', id, newStatus)
  }

  async function handleDelete(id: string) {
    'use server'
    await deleteApplicationRecord('contact_messages', id)
  }

  return (
    <ContactAdminTabs
      initialConfig={contactSettings}
      defaultConfig={defaultContactConfig}
      messages={messages}
      onUpdateStatus={handleStatus}
      onDeleteMessage={handleDelete}
    />
  )
}

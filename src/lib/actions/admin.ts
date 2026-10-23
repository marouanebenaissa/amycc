'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function loginAdmin(formData: FormData): Promise<void> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    redirect('/admin/login?error=Email%20and%20password%20are%20required')
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    redirect(`/admin/login?error=${encodeURIComponent(error.message)}`)
  }

  redirect('/admin')
}

export async function logoutAdmin(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}

export type ManageableTable =
  | 'membership_applications'
  | 'volunteer_applications'
  | 'partnership_inquiries'
  | 'contact_messages'
  | 'event_registrations'
  | 'donation_records'

export async function updateApplicationStatus(
  table: ManageableTable,
  id: string,
  newStatus: string
): Promise<void> {
  const supabase = await createClient()
  await supabase
    .from(table)
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', id)

  revalidatePath('/admin')
  revalidatePath(`/admin/${table.replace('_applications', 's').replace('_inquiries', 's').replace('contact_messages', 'contacts').replace('event_registrations', 'registrations').replace('donation_records', 'donations')}`)
}

export async function deleteApplicationRecord(
  table: ManageableTable,
  id: string
): Promise<void> {
  const supabase = await createClient()
  await supabase.from(table).delete().eq('id', id)

  revalidatePath('/admin')
}

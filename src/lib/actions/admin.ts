'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import type { FaqItemConfig, AreasConfig, TeamConfig } from '@/lib/settings'

export async function recordAuditLog(
  action: string,
  entityType: string,
  entityId?: string,
  details?: Record<string, unknown>
): Promise<void> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('audit_logs').insert([
      {
        user_id: user?.id ?? null,
        action,
        entity_type: entityType,
        entity_id: entityId ?? null,
        details: details ?? {},
      },
    ])
  } catch {
    // Graceful fallback if audit_logs table is unavailable
  }
}

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

  await recordAuditLog('user_login', 'auth', email, { timestamp: new Date().toISOString() })
  redirect('/admin')
}

export async function logoutAdmin(): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    await recordAuditLog('user_logout', 'auth', user.id, { email: user.email })
  }
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

  await recordAuditLog('status_update', table, id, { newStatus })

  revalidatePath('/admin')
  revalidatePath(`/admin/${table.replace('_applications', 's').replace('_inquiries', 's').replace('contact_messages', 'contacts').replace('event_registrations', 'registrations').replace('donation_records', 'donations')}`)
}

export async function deleteApplicationRecord(
  table: ManageableTable,
  id: string
): Promise<void> {
  const supabase = await createClient()
  await supabase.from(table).delete().eq('id', id)

  await recordAuditLog('record_deleted', table, id, { deleted_at: new Date().toISOString() })

  revalidatePath('/admin')
}

export async function assignUserRole(userId: string, roleId: number): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('user_roles')
      .upsert([{ user_id: userId, role_id: roleId }], { onConflict: 'user_id,role_id' })

    if (error) return { success: false, error: error.message }

    await recordAuditLog('assign_role', 'user_roles', userId, { role_id: roleId })
    revalidatePath('/admin/users')
    revalidatePath('/admin/roles')
    return { success: true }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

export async function removeUserRole(userId: string, roleId: number): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .match({ user_id: userId, role_id: roleId })

    if (error) return { success: false, error: error.message }

    await recordAuditLog('revoke_role', 'user_roles', userId, { role_id: roleId })
    revalidatePath('/admin/users')
    revalidatePath('/admin/roles')
    return { success: true }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

export async function savePageConfiguration(
  pageKey: string,
  configData: Record<string, unknown>
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('site_settings')
      .upsert([
        {
          key: `page_${pageKey}`,
          value: configData,
          updated_at: new Date().toISOString(),
        },
      ])

    if (error) return { success: false, error: error.message }

    await recordAuditLog('page_config_updated', 'site_settings', `page_${pageKey}`, { pageKey })
    revalidatePath('/admin/pages')
    revalidatePath('/[locale]', 'layout')
    return { success: true }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

export async function saveFaqConfiguration(
  items: FaqItemConfig[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'غير مصرح لك بتعديل الأسئلة الشائعة (Unauthorized)' }
    }

    const { error } = await supabase
      .from('site_settings')
      .upsert([
        {
          key: 'faqs',
          value: { items },
          updated_at: new Date().toISOString(),
        },
      ])

    if (error) return { success: false, error: error.message }

    await recordAuditLog('faqs_updated', 'site_settings', 'faqs', { count: items.length })
    revalidatePath('/admin/faqs')
    revalidatePath('/admin/settings')
    revalidatePath('/[locale]', 'layout')
    return { success: true }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

export async function saveAreasConfiguration(
  config: AreasConfig
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'غير مصرح لك بتعديل مجالات التدخل (Unauthorized)' }
    }

    const { error } = await supabase
      .from('site_settings')
      .upsert([
        {
          key: 'areas',
          value: config,
          updated_at: new Date().toISOString(),
        },
      ])

    if (error) return { success: false, error: error.message }

    await recordAuditLog('areas_updated', 'site_settings', 'areas', { count: config.items.length })
    revalidatePath('/admin/areas')
    revalidatePath('/admin/settings')
    revalidatePath('/[locale]', 'layout')
    return { success: true }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

export async function saveTeamConfiguration(
  config: TeamConfig
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'غير مصرح لك بتعديل بيانات الفريق (Unauthorized)' }
    }

    const { error } = await supabase
      .from('site_settings')
      .upsert([
        {
          key: 'team',
          value: config,
          updated_at: new Date().toISOString(),
        },
      ])

    if (error) return { success: false, error: error.message }

    await recordAuditLog('team_updated', 'site_settings', 'team', { count: config.members.length })
    revalidatePath('/admin/team')
    revalidatePath('/admin/settings')
    revalidatePath('/[locale]/team')
    revalidatePath('/[locale]', 'layout')
    return { success: true }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

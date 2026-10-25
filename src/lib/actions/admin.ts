'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import type { FaqItemConfig, AreasConfig, TeamConfig, CommissionsConfig, ContactConfig, ProgramsPageConfig } from '@/lib/settings'

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

export async function saveCommissionsConfiguration(
  config: CommissionsConfig
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'غير مصرح لك بتعديل بيانات اللجان الوظيفية (Unauthorized)' }
    }

    const { error } = await supabase
      .from('site_settings')
      .upsert([
        {
          key: 'commissions',
          value: config,
          updated_at: new Date().toISOString(),
        },
      ])

    if (error) return { success: false, error: error.message }

    await recordAuditLog('commissions_updated', 'site_settings', 'commissions', { count: config.items.length })
    revalidatePath('/admin/team')
    revalidatePath('/admin/settings')
    revalidatePath('/[locale]/team')
    revalidatePath('/[locale]', 'layout')
    return { success: true }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}


export async function saveContactConfiguration(
  config: ContactConfig
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'غير مصرح لك بتعديل بيانات التواصل (Unauthorized)' }
    }

    const now = new Date().toISOString()

    // 1. Save rich contact config
    const { error: mainErr } = await supabase
      .from('site_settings')
      .upsert([
        {
          key: 'contact',
          value: config,
          updated_at: now,
        },
      ])

    if (mainErr) return { success: false, error: mainErr.message }

    // 2. Synchronize legacy contact_info and social_links for layout & footer
    await supabase.from('site_settings').upsert([
      {
        key: 'contact_info',
        value: {
          email: config.channels.primaryEmail,
          phone: config.channels.phone,
          address: config.channels.addressAr,
        },
        updated_at: now,
      },
      {
        key: 'social_links',
        value: {
          facebook: config.social.facebook || '',
          instagram: config.social.instagram || '',
          linkedin: config.social.linkedin || '',
          youtube: config.social.youtube || '',
        },
        updated_at: now,
      },
    ])

    await recordAuditLog('contact_settings_updated', 'site_settings', 'contact', {
      email: config.channels.primaryEmail,
      phone: config.channels.phone,
    })

    revalidatePath('/admin/contacts')
    revalidatePath('/admin/settings')
    revalidatePath('/[locale]/contact')
    revalidatePath('/[locale]', 'layout')
    return { success: true }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

export async function saveProgramsPageConfiguration(
  config: ProgramsPageConfig
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'غير مصرح لك بتعديل إعدادات صفحة البرامج (Unauthorized)' }
    }

    const { error } = await supabase
      .from('site_settings')
      .upsert([
        {
          key: 'programs_page',
          value: config,
          updated_at: new Date().toISOString(),
        },
      ])

    if (error) return { success: false, error: error.message }

    await recordAuditLog('programs_page_updated', 'site_settings', 'programs_page', {
      titleAr: config.hero.titleAr,
    })

    revalidatePath('/admin/programs')
    revalidatePath('/[locale]/programs')
    revalidatePath('/[locale]', 'layout')
    return { success: true }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

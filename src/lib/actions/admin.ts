'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient, createAdminClientSafe } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { getCurrentUserRole } from '@/lib/auth/server-rbac'
import type { FaqItemConfig, AreasConfig, TeamConfig, CommissionsConfig, ContactConfig, ProgramsPageConfig, AnnualProgramConfig, ImpactConfig, EventsPageConfig, NewsPageConfig, PartnershipsPageConfig, MembershipPageConfig, SupportPageConfig } from '@/lib/settings'

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
    const adminClient = createAdminClientSafe()
    const client = adminClient || supabase

    const { error } = await client
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
    const adminClient = createAdminClientSafe()
    const client = adminClient || supabase

    const { error } = await client
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

export async function updateUserRoleAction(userId: string, newRoleId: number): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (!currentUser) {
      return { success: false, error: 'Unauthorized: Admin session required' }
    }

    const currentUserRole = await getCurrentUserRole(currentUser.id)
    if (currentUserRole.key !== 'super_admin') {
      return { success: false, error: 'غير مصرح: تعديل الأدوار والصلاحيات متاح فقط لمدير عام النظام' }
    }

    const adminClient = createAdminClientSafe()
    const client = adminClient || supabase

    // Remove existing roles for this user and set the newly selected role
    await client.from('user_roles').delete().eq('user_id', userId)

    const { error: insertError } = await client.from('user_roles').insert([
      {
        user_id: userId,
        role_id: newRoleId,
        granted_by: currentUser.id,
        granted_at: new Date().toISOString(),
      },
    ])

    if (insertError) {
      return { success: false, error: insertError.message }
    }

    await recordAuditLog('update_user_role', 'user_roles', userId, {
      newRoleId,
      updatedBy: currentUser.email,
    })

    revalidatePath('/admin/users')
    revalidatePath('/admin/roles')
    return { success: true }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

export async function createUserWithRoleAction(formData: FormData): Promise<{ success: boolean; error?: string }> {
  try {
    const email = (formData.get('email') as string)?.trim()?.toLowerCase()
    const password = (formData.get('password') as string)?.trim()
    const fullName = (formData.get('fullName') as string)?.trim() || 'Staff Administrator'
    const roleId = Number(formData.get('roleId')) || 1

    if (!email || !password) {
      return { success: false, error: 'Email and password are required' }
    }
    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' }
    }

    const supabase = await createClient()
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (!currentUser) {
      return { success: false, error: 'Unauthorized: Admin session required' }
    }

    const currentUserRole = await getCurrentUserRole(currentUser.id)
    if (currentUserRole.key !== 'super_admin') {
      return { success: false, error: 'غير مصرح: تعديل الأدوار والصلاحيات متاح فقط لمدير عام النظام' }
    }

    const adminClient = createAdminClientSafe()
    if (!adminClient) {
      return {
        success: false,
        error: 'SUPABASE_SERVICE_ROLE_KEY is required to provision staff users. Please set this variable in Vercel.',
      }
    }

    // 1. Create auth user with service role client
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    })

    if (authError || !authData?.user) {
      return { success: false, error: authError?.message || 'Failed to create user in authentication system' }
    }

    const newUserId = authData.user.id

    // 2. Upsert profile
    await adminClient.from('profiles').upsert([
      {
        id: newUserId,
        email,
        full_name: fullName,
        created_at: new Date().toISOString(),
      },
    ], { onConflict: 'id' })

    // 3. Assign role
    await adminClient.from('user_roles').upsert([
      {
        user_id: newUserId,
        role_id: roleId,
        granted_by: currentUser.id,
        granted_at: new Date().toISOString(),
      },
    ], { onConflict: 'user_id,role_id' })

    await recordAuditLog('create_staff_user', 'profiles', newUserId, {
      email,
      fullName,
      roleId,
      createdBy: currentUser.email,
    })

    revalidatePath('/admin/users')
    revalidatePath('/admin/roles')
    return { success: true }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

export async function deleteStaffUserAction(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (!currentUser) {
      return { success: false, error: 'Unauthorized: Admin session required' }
    }

    const currentUserRole = await getCurrentUserRole(currentUser.id)
    if (currentUserRole.key !== 'super_admin') {
      return { success: false, error: 'غير مصرح: حذف الحسابات متاح فقط لمدير عام النظام' }
    }
    if (currentUser.id === userId) {
      return { success: false, error: 'You cannot delete your own active administrator account' }
    }

    const targetUserRole = await getCurrentUserRole(userId)
    if (targetUserRole.key === 'super_admin') {
      return { success: false, error: 'غير مسموح: لا يمكن حذف حساب مدير عام النظام' }
    }

    const adminClient = createAdminClientSafe()
    if (!adminClient) {
      return { success: false, error: 'SUPABASE_SERVICE_ROLE_KEY required to delete staff accounts' }
    }

    // 1. Delete user_roles
    await adminClient.from('user_roles').delete().eq('user_id', userId)
    // 2. Delete profile
    await adminClient.from('profiles').delete().eq('id', userId)
    // 3. Delete from auth.users
    const { error: authDeleteError } = await adminClient.auth.admin.deleteUser(userId)
    if (authDeleteError) {
      return { success: false, error: authDeleteError.message }
    }

    await recordAuditLog('delete_staff_user', 'profiles', userId, {
      deletedBy: currentUser.email,
    })

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
    const adminClient = createAdminClientSafe()
    const db = adminClient || supabase

    const { error } = await db
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

    const adminClient = createAdminClientSafe()
    const db = adminClient || supabase

    const { error } = await db
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

    const adminClient = createAdminClientSafe()
    const db = adminClient || supabase

    const { error } = await db
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

    const adminClient = createAdminClientSafe()
    const db = adminClient || supabase

    const { error } = await db
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

    const adminClient = createAdminClientSafe()
    const db = adminClient || supabase

    const { error } = await db
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

    const adminClient = createAdminClientSafe()
    const db = adminClient || supabase
    const now = new Date().toISOString()

    // 1. Save rich contact config
    const { error: mainErr } = await db
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
    await db.from('site_settings').upsert([
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
          twitter: config.social.twitter || '',
          tiktok: config.social.tiktok || '',
          whatsapp: config.social.whatsapp || '',
        },
        updated_at: now,
      },
    ])

    // 3. Synchronize top_bar contact email if present
    const { data: topBarRow } = await db
      .from('site_settings')
      .select('value')
      .eq('key', 'top_bar')
      .maybeSingle()

    if (topBarRow?.value) {
      const topBarVal = topBarRow.value as Record<string, unknown>
      await db.from('site_settings').upsert([
        {
          key: 'top_bar',
          value: {
            ...topBarVal,
            contactEmail: config.channels.primaryEmail,
          },
          updated_at: now,
        },
      ])
    }

    await recordAuditLog('contact_settings_updated', 'site_settings', 'contact', {
      email: config.channels.primaryEmail,
      phone: config.channels.phone,
    })

    revalidatePath('/admin/contacts')
    revalidatePath('/admin/settings')
    revalidatePath('/[locale]/contact')
    revalidatePath('/', 'layout')
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

    const adminClient = createAdminClientSafe()
    const db = adminClient || supabase

    const { error } = await db
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

export async function saveAnnualProgramConfiguration(
  config: AnnualProgramConfig
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'غير مصرح لك بتعديل البرنامج السنوي (Unauthorized)' }
    }

    const adminClient = createAdminClientSafe()
    const db = adminClient || supabase

    const { error } = await db
      .from('site_settings')
      .upsert([
        {
          key: 'annual_program',
          value: config,
          updated_at: new Date().toISOString(),
        },
      ])

    if (error) return { success: false, error: error.message }

    await recordAuditLog('annual_program_updated', 'site_settings', 'annual_program', {
      year: config.hero.year,
      titleAr: config.hero.titleAr,
    })

    revalidatePath('/ar/annual-program')
    revalidatePath('/fr/annual-program')
    revalidatePath('/en/annual-program')
    revalidatePath('/annual-program')
    revalidatePath('/[locale]/annual-program', 'page')
    revalidatePath('/admin/annual-program')
    revalidatePath('/admin/pages')
    revalidatePath('/[locale]', 'layout')
    revalidatePath('/', 'layout')
    return { success: true }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

export async function saveImpactConfiguration(
  config: ImpactConfig
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'غير مصرح لك بتعديل بيانات الأثر المجتمعي (Unauthorized)' }
    }

    const adminClient = createAdminClientSafe()
    const db = adminClient || supabase

    const { error } = await db
      .from('site_settings')
      .upsert([
        {
          key: 'impact',
          value: config,
          updated_at: new Date().toISOString(),
        },
      ])

    if (error) return { success: false, error: error.message }

    await recordAuditLog('impact_updated', 'site_settings', 'impact', {
      titleAr: config.hero.titleAr,
    })

    // Revalidate all localized paths and layouts so edits appear instantly on the live site
    revalidatePath('/ar/impact')
    revalidatePath('/fr/impact')
    revalidatePath('/en/impact')
    revalidatePath('/impact')
    revalidatePath('/[locale]/impact', 'page')
    revalidatePath('/[locale]/impact', 'layout')
    revalidatePath('/admin/impact')
    revalidatePath('/admin/pages')
    revalidatePath('/[locale]', 'layout')
    revalidatePath('/', 'layout')
    return { success: true }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

export async function saveEventsPageConfiguration(
  config: EventsPageConfig
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'غير مصرح لك بتعديل واجهة الفعاليات (Unauthorized)' }
    }

    const adminClient = createAdminClientSafe()
    const db = adminClient || supabase

    const { error } = await db
      .from('site_settings')
      .upsert([
        {
          key: 'events_page',
          value: config,
          updated_at: new Date().toISOString(),
        },
      ])

    if (error) return { success: false, error: error.message }

    await recordAuditLog('events_page_updated', 'site_settings', 'events_page', {
      titleAr: config.hero.titleAr,
    })

    // Revalidate all localized paths and layouts so edits appear instantly on the live site
    revalidatePath('/ar/events')
    revalidatePath('/fr/events')
    revalidatePath('/en/events')
    revalidatePath('/events')
    revalidatePath('/[locale]/events', 'page')
    revalidatePath('/[locale]/events', 'layout')
    revalidatePath('/admin/events')
    revalidatePath('/admin/pages')
    revalidatePath('/[locale]', 'layout')
    revalidatePath('/', 'layout')
    return { success: true }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

export async function saveNewsPageConfiguration(
  config: NewsPageConfig
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'غير مصرح لك بتعديل واجهة الأخبار (Unauthorized)' }
    }

    const adminClient = createAdminClientSafe()
    const db = adminClient || supabase

    const { error } = await db
      .from('site_settings')
      .upsert([
        {
          key: 'news_page',
          value: config,
          updated_at: new Date().toISOString(),
        },
      ])

    if (error) return { success: false, error: error.message }

    await recordAuditLog('news_page_updated', 'site_settings', 'news_page', {
      titleAr: config.hero.titleAr,
    })

    // Revalidate all localized paths and layouts so edits appear instantly on the live site
    revalidatePath('/ar/news')
    revalidatePath('/fr/news')
    revalidatePath('/en/news')
    revalidatePath('/news')
    revalidatePath('/[locale]/news', 'page')
    revalidatePath('/[locale]/news', 'layout')
    revalidatePath('/admin/news')
    revalidatePath('/admin/pages')
    revalidatePath('/[locale]', 'layout')
    revalidatePath('/', 'layout')
    return { success: true }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}


export async function savePartnershipsPageConfiguration(
  config: PartnershipsPageConfig
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'غير مصرح لك بتعديل واجهة الشراكات (Unauthorized)' }
    }

    const adminClient = createAdminClient()
    const { error } = await adminClient
      .from('site_settings')
      .upsert([
        {
          key: 'partnerships_page',
          value: config,
          updated_at: new Date().toISOString(),
        },
      ])

    if (error) return { success: false, error: error.message }

    await recordAuditLog('partnerships_page_updated', 'site_settings', 'partnerships_page', {
      titleAr: config.hero.titleAr,
    })

    // Revalidate localized paths and layouts so edits appear immediately
    revalidatePath('/ar/partnerships')
    revalidatePath('/fr/partnerships')
    revalidatePath('/en/partnerships')
    revalidatePath('/partnerships')
    revalidatePath('/[locale]/partnerships', 'page')
    revalidatePath('/[locale]/partnerships', 'layout')
    revalidatePath('/admin/partnerships')
    revalidatePath('/admin/pages')
    revalidatePath('/[locale]', 'layout')
    revalidatePath('/', 'layout')
    return { success: true }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

export async function saveMembershipPageConfiguration(
  config: MembershipPageConfig
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'غير مصرح لك بتعديل واجهة العضوية (Unauthorized)' }
    }

    const adminClient = createAdminClient()
    const { error } = await adminClient
      .from('site_settings')
      .upsert([
        {
          key: 'membership_page',
          value: config,
          updated_at: new Date().toISOString(),
        },
      ])

    if (error) return { success: false, error: error.message }

    await recordAuditLog('membership_page_updated', 'site_settings', 'membership_page', {
      titleAr: config.hero.titleAr,
    })

    // Revalidate localized paths and layouts so edits appear immediately
    revalidatePath('/ar/membership')
    revalidatePath('/fr/membership')
    revalidatePath('/en/membership')
    revalidatePath('/membership')
    revalidatePath('/[locale]/membership', 'page')
    revalidatePath('/[locale]/membership', 'layout')
    revalidatePath('/admin/memberships')
    revalidatePath('/admin/pages')
    revalidatePath('/[locale]', 'layout')
    revalidatePath('/', 'layout')
    return { success: true }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

export async function saveSupportPageConfiguration(
  config: SupportPageConfig
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'غير مصرح لك بتعديل واجهة الدعم والرعاية (Unauthorized)' }
    }

    const adminClient = createAdminClient()
    const { error } = await adminClient
      .from('site_settings')
      .upsert([
        {
          key: 'support_page',
          value: config,
          updated_at: new Date().toISOString(),
        },
      ])

    if (error) return { success: false, error: error.message }

    await recordAuditLog('support_page_updated', 'site_settings', 'support_page', {
      titleAr: config.hero.titleAr,
    })

    // Revalidate localized paths and layouts so edits appear immediately
    revalidatePath('/ar/support')
    revalidatePath('/fr/support')
    revalidatePath('/en/support')
    revalidatePath('/support')
    revalidatePath('/[locale]/support', 'page')
    revalidatePath('/[locale]/support', 'layout')
    revalidatePath('/admin/donations')
    revalidatePath('/admin/pages')
    revalidatePath('/[locale]', 'layout')
    revalidatePath('/', 'layout')
    return { success: true }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}


export async function updateAdminPasswordAction(newPassword: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'كلمة المرور يجب أن تتكون من 6 أحرف على الأقل.' }
    }

    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: 'انتهت الجلسة. يرجى تسجيل الدخول مجدداً.' }
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    await recordAuditLog('password_updated', 'auth_users', user.id, {
      email: user.email,
      updated_at: new Date().toISOString(),
    })

    return { success: true }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

export async function updateAdminProfileAction(
  displayName: string,
  avatarUrl?: string | null
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: 'انتهت الجلسة. يرجى تسجيل الدخول مجدداً.' }
    }

    const newMetadata: Record<string, unknown> = {
      ...(user.user_metadata || {}),
      full_name: displayName,
      name: displayName,
    }

    if (avatarUrl !== undefined) {
      newMetadata.avatar_url = avatarUrl || ''
      newMetadata.picture = avatarUrl || ''
    }

    const { error: updateError } = await supabase.auth.updateUser({
      data: newMetadata,
    })

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    // Gracefully update profiles table if available
    try {
      const adminClient = createAdminClientSafe()
      const client = adminClient || supabase
      await client
        .from('profiles')
        .update({
          full_name: displayName,
        })
        .eq('id', user.id)
    } catch {
      // Ignore background sync errors
    }

    await recordAuditLog('profile_updated', 'auth_users', user.id, {
      display_name: displayName,
      has_avatar: Boolean(avatarUrl),
      updated_at: new Date().toISOString(),
    })

    revalidatePath('/admin', 'layout')
    revalidatePath('/admin/profile')
    return { success: true }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

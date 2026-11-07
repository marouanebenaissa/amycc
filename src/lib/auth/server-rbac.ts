import { createClient } from '@/lib/supabase/server'
import { createAdminClientSafe } from '@/lib/supabase/admin'
import {
  AdminRoleMeta,
  getRoleMetaByKey,
  getRoleMetaById,
  PREDEFINED_ROLES,
} from './rbac'

/**
 * Resolves the authenticated user's assigned role from Supabase DB.
 * Uses service role client when available to ensure RLS doesn't block role resolution.
 */
export async function getCurrentUserRole(userId: string): Promise<AdminRoleMeta> {
  const adminClient = createAdminClientSafe()
  const supabase = await createClient()
  const client = adminClient || supabase

  try {
    const { data: userRole, error } = await client
      .from('user_roles')
      .select('role_id, roles(id, name)')
      .eq('user_id', userId)
      .maybeSingle()

    if (!error && userRole) {
      const roleRelation = userRole.roles as unknown as { id?: number; name?: string } | null
      if (roleRelation?.name) {
        return getRoleMetaByKey(roleRelation.name)
      }
      if (userRole.role_id) {
        return getRoleMetaById(userRole.role_id)
      }
    }
  } catch {
    // Fall through to fallback
  }

  // If no role record exists in DB, check if user is the first/primary super admin:
  try {
    const { data: allUserRoles } = await client
      .from('user_roles')
      .select('user_id, role_id')

    // If database has no user roles at all, default the first admin to super_admin:
    if (!allUserRoles || allUserRoles.length === 0) {
      return PREDEFINED_ROLES[0] // super_admin
    }
  } catch {
    // Ignore
  }

  // Default fallback for authenticated staff without explicit assigned role:
  // We default to 'reviewer' (least privilege, read-only) to protect security.
  return PREDEFINED_ROLES[8] // reviewer
}

/**
 * Validates if the current session belongs to a Super Administrator.
 */
export async function verifySuperAdmin(): Promise<{ isSuperAdmin: boolean; userId: string | null; email: string | null }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { isSuperAdmin: false, userId: null, email: null }
  }

  const role = await getCurrentUserRole(user.id)
  return {
    isSuperAdmin: role.key === 'super_admin',
    userId: user.id,
    email: user.email ?? null,
  }
}

const CUSTOM_PERMISSIONS_KEY = 'user_custom_permissions'

/**
 * Retrieves all user customized granular permission overrides from site_settings.
 */
export async function getAllUsersCustomPermissions(): Promise<Record<string, string[]>> {
  const adminClient = createAdminClientSafe()
  const supabase = await createClient()
  const client = adminClient || supabase

  try {
    const { data } = await client
      .from('site_settings')
      .select('value')
      .eq('key', CUSTOM_PERMISSIONS_KEY)
      .maybeSingle()

    if (data && typeof data.value === 'object' && data.value !== null) {
      return data.value as Record<string, string[]>
    }
  } catch {
    // Return empty on error
  }
  return {}
}

/**
 * Retrieves granular permission modules assigned to a specific user.
 * Returns null if the user relies on their standard assigned role.
 */
export async function getCurrentUserCustomPermissions(userId: string): Promise<string[] | null> {
  const allPerms = await getAllUsersCustomPermissions()
  const perms = allPerms[userId]
  return Array.isArray(perms) ? perms : null
}


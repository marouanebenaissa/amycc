import { createClient } from '@/lib/supabase/server'
import { createAdminClientSafe } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { getCurrentUserRole } from '@/lib/auth/server-rbac'
import { PREDEFINED_ROLES } from '@/lib/auth/rbac'
import {
  AdminUsersClient,
  AdminUserItem,
} from '@/components/admin/AdminUsersClient'

interface ProfileRow {
  id: string
  email: string
  full_name: string | null
  created_at: string
}

interface UserRoleRelationRow {
  user_id: string
  role_id: number
  roles: {
    id?: number
    name?: string
    description?: string
  } | null
}

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const currentUserRole = await getCurrentUserRole(user.id)
  if (currentUserRole.key !== 'super_admin') {
    redirect('/admin')
  }

  const adminClient = createAdminClientSafe()
  let profiles: ProfileRow[] = []
  let userRoles: UserRoleRelationRow[] = []

  if (adminClient) {
    try {
      const [{ data: pData }, { data: urData }, { data: authData }] =
        await Promise.all([
          adminClient.from('profiles').select('id, email, full_name, created_at'),
          adminClient
            .from('user_roles')
            .select('user_id, role_id, roles(id, name, description)'),
          adminClient.auth.admin.listUsers(),
        ])

      profiles = (pData || []) as ProfileRow[]
      userRoles = (urData || []) as unknown as UserRoleRelationRow[]

      // If auth users exist that are not yet in profiles, sync them
      const authUsers = authData?.users || []
      const existingProfileIds = new Set(profiles.map((p) => p.id))

      for (const authU of authUsers) {
        if (!existingProfileIds.has(authU.id)) {
          const newProfile: ProfileRow = {
            id: authU.id,
            email: authU.email || '',
            full_name:
              (authU.user_metadata?.full_name as string) ||
              (authU.email?.split('@')[0] ?? 'Staff Administrator'),
            created_at: authU.created_at || new Date().toISOString(),
          }
          profiles.push(newProfile)

          // Auto-upsert into DB for future persistence
          try {
            await adminClient.from('profiles').upsert([newProfile], { onConflict: 'id' })
          } catch {
            // Ignore background sync errors
          }
        }
      }
    } catch {
      // Fallback if admin query fails
    }
  }

  // Fallback to standard client if profiles are still empty
  if (profiles.length === 0) {
    try {
      const [{ data: pData }, { data: urData }] = await Promise.all([
        supabase.from('profiles').select('id, email, full_name, created_at'),
        supabase
          .from('user_roles')
          .select('user_id, role_id, roles(id, name, description)'),
      ])
      profiles = (pData || []) as ProfileRow[]
      userRoles = (urData || []) as unknown as UserRoleRelationRow[]
    } catch {
      // Ignore
    }
  }

  // Ensure current user is ALWAYS included so the table is never empty for logged-in admin
  const currentUserId = user.id
  const currentUserEmail = user.email || 'admin@amycc.org'
  const currentUserFullName =
    (user.user_metadata?.full_name as string) ||
    currentUserEmail.split('@')[0] ||
    'Staff Administrator'

  const userFoundInProfiles = profiles.some(
    (p) => p.id === currentUserId || p.email.toLowerCase() === currentUserEmail.toLowerCase()
  )

  if (!userFoundInProfiles) {
    profiles.unshift({
      id: currentUserId,
      email: currentUserEmail,
      full_name: currentUserFullName,
      created_at: user.created_at || new Date().toISOString(),
    })
  }

  // Map into AdminUserItem[]
  const users: AdminUserItem[] = profiles.map((p) => {
    const isCurrent =
      p.id === currentUserId ||
      p.email.toLowerCase() === currentUserEmail.toLowerCase()

    // Find role for this user
    const matchedRoleRelation = userRoles.find((ur) => ur.user_id === p.id)
    let roleId = matchedRoleRelation?.role_id
    let roleName = matchedRoleRelation?.roles?.name

    if (!roleId || !roleName) {
      if (isCurrent && currentUserRole.key === 'super_admin') {
        roleId = 1
        roleName = 'super_admin'
      } else {
        const fallbackRole = PREDEFINED_ROLES.find((r) => r.key === 'reviewer') || PREDEFINED_ROLES[PREDEFINED_ROLES.length - 1]
        roleId = fallbackRole.id
        roleName = fallbackRole.name
      }
    }

    return {
      id: p.id,
      email: p.email,
      full_name: p.full_name || 'Staff Member',
      created_at: p.created_at,
      roleId,
      roleName,
      isCurrentUser: isCurrent,
    }
  })

  // Sort so current logged in admin is at the top, then alphabetically by email
  users.sort((a, b) => {
    if (a.isCurrentUser) return -1
    if (b.isCurrentUser) return 1
    return a.email.localeCompare(b.email)
  })

  return (
    <AdminUsersClient
      initialUsers={users}
      currentUserId={currentUserId}
      currentUserEmail={currentUserEmail}
    />
  )
}

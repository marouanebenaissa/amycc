import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminProfileClient } from '@/components/admin/AdminProfileClient'
import { getCurrentUserRole } from '@/lib/auth/server-rbac'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  // Fetch assigned role name reliably using RBAC server helper
  const roleMeta = await getCurrentUserRole(user.id)
  const roleTitle = roleMeta.nameAr || roleMeta.name

  const initialName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split('@')[0] ||
    'Staff Admin'

  const initialAvatar =
    (user.user_metadata?.avatar_url as string) ||
    (user.user_metadata?.picture as string) ||
    ''

  return (
    <AdminProfileClient
      userId={user.id}
      userEmail={user.email || ''}
      initialName={initialName}
      initialAvatar={initialAvatar}
      roleTitle={roleTitle}
      createdAt={user.created_at}
    />
  )
}

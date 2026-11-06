import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminProfileClient } from '@/components/admin/AdminProfileClient'

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

  // Fetch assigned role name if exists
  let roleTitle = 'Staff Administrator'
  try {
    const { data: userRole } = await supabase
      .from('user_roles')
      .select('roles(name)')
      .eq('user_id', user.id)
      .single()

    if (userRole?.roles) {
      const r = userRole.roles as unknown as { name?: string }
      if (r?.name) roleTitle = r.name
    }
  } catch {
    // Default fallback
  }

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

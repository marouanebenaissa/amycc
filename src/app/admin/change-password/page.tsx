import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminForcePasswordChangeClient } from '@/components/admin/AdminForcePasswordChangeClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminChangePasswordPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const userEmail = user.email || 'staff@amycc.org'
  const userName =
    (user.user_metadata?.full_name as string) ||
    (user.user_metadata?.name as string) ||
    userEmail.split('@')[0] ||
    'المشرف'

  return (
    <AdminForcePasswordChangeClient
      userEmail={userEmail}
      userName={userName}
    />
  )
}

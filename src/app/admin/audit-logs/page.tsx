import { createClient } from '@/lib/supabase/server'
import { createAdminClientSafe } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { getCurrentUserRole } from '@/lib/auth/server-rbac'
import { AdminAuditLogsClient, AuditLogRow } from '@/components/admin/AdminAuditLogsClient'

export const dynamic = 'force-dynamic'

export default async function AdminAuditLogsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const userRole = await getCurrentUserRole(user.id)
  if (userRole.key !== 'super_admin') {
    redirect('/admin')
  }

  const adminClient = createAdminClientSafe()
  const dbClient = adminClient || supabase

  let logs: AuditLogRow[] = []
  try {
    const { data } = await dbClient
      .from('audit_logs')
      .select('*, profiles(email, full_name)')
      .order('created_at', { ascending: false })
      .limit(100)

    logs = (data || []) as unknown as AuditLogRow[]
  } catch {
    // Graceful fallback
  }

  return <AdminAuditLogsClient logs={logs} />
}

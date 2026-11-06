import { createClient } from '@/lib/supabase/server'
import { createAdminClientSafe } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
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

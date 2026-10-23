import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminAuditLogsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const { data: logs } = await supabase
    .from('audit_logs')
    .select('*, profiles(email, full_name)')
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0a0f1d]">System Audit Logs</h1>
        <p className="text-xs text-slate-500 mt-1">
          Immutable audit trail recording administrative operations and system modifications.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-2xs uppercase tracking-wider text-slate-500 font-bold">
              <tr>
                <th className="px-6 py-4 text-start">Timestamp</th>
                <th className="px-6 py-4 text-start">User</th>
                <th className="px-6 py-4 text-start">Action</th>
                <th className="px-6 py-4 text-start">Entity</th>
                <th className="px-6 py-4 text-start">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs && logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-slate-400 font-mono text-2xs">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold block">{log.profiles?.full_name || 'System / Admin'}</span>
                      <span className="text-slate-400 text-2xs font-mono">{log.profiles?.email || 'internal'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded-full text-3xs font-bold uppercase tracking-wider bg-slate-100 text-slate-800">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-mono text-2xs">
                      {log.entity_type} {log.entity_id ? `(#${log.entity_id.slice(0, 8)})` : ''}
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate text-slate-400 text-2xs font-mono">
                      {log.details ? JSON.stringify(log.details) : '—'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No critical operations logged yet. System operating normally.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

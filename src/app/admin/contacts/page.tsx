import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { updateApplicationStatus, deleteApplicationRecord } from '@/lib/actions/admin'
import { CsvExportButton } from '@/components/admin/CsvExportButton'

interface ContactMessageRow {
  id: string
  full_name: string
  email: string
  phone?: string | null
  subject?: string | null
  message: string
  status: string
  created_at: string
}

export default async function AdminContactsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  let messages: ContactMessageRow[] = []

  try {
    const { data } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) messages = data as ContactMessageRow[]
  } catch {
    // Migration fallback
  }

  async function handleStatus(id: string, newStatus: string) {
    'use server'
    await updateApplicationStatus('contact_messages', id, newStatus)
  }

  async function handleDelete(id: string) {
    'use server'
    await deleteApplicationRecord('contact_messages', id)
  }

  const exportData = messages.map((m) => ({
    ID: m.id,
    FullName: m.full_name,
    Email: m.email,
    Phone: m.phone || '',
    Subject: m.subject || '',
    Message: m.message,
    Status: m.status,
    ReceivedAt: m.created_at,
  }))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#08242a]">Contact Messages Inbox</h1>
          <p className="text-xs text-[#5f7174] mt-1">
            Review incoming public questions, institutional inquiries, and communications.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <CsvExportButton data={exportData} filename="amycc-contact-messages" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#e5e0d6] overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs text-[#2d3b3e]">
            <thead className="bg-[#faf7f2] border-b border-[#e5e0d6] text-2xs uppercase tracking-wider text-[#5f7174] font-bold">
              <tr>
                <th className="px-6 py-4 text-start">Sender</th>
                <th className="px-6 py-4 text-start">Subject & Message</th>
                <th className="px-6 py-4 text-start">Status</th>
                <th className="px-6 py-4 text-start">Date</th>
                <th className="px-6 py-4 text-start">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4ede2]">
              {messages.length > 0 ? (
                messages.map((msg) => (
                  <tr key={msg.id} className="hover:bg-[#faf7f2]/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#08242a]">{msg.full_name}</div>
                      <a href={`mailto:${msg.email}`} className="text-3xs text-[#0d3b43] hover:underline block">
                        {msg.email}
                      </a>
                      {msg.phone && <div className="text-3xs text-[#819598] font-mono">{msg.phone}</div>}
                    </td>
                    <td className="px-6 py-4 max-w-md">
                      {msg.subject && <div className="font-bold text-[#08242a] mb-0.5">{msg.subject}</div>}
                      <p className="text-xs text-[#445457] leading-relaxed line-clamp-3">
                        {msg.message}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-2xs font-bold ${
                          msg.status === 'unread'
                            ? 'bg-[#fae4dc] text-[#c85a32] border border-[#f2c2b0]'
                            : msg.status === 'replied'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {msg.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#819598] text-3xs whitespace-nowrap">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 space-x-2 whitespace-nowrap">
                      {msg.status === 'unread' && (
                        <form action={handleStatus.bind(null, msg.id, 'read')} className="inline">
                          <button
                            type="submit"
                            className="px-2.5 py-1 rounded-lg text-2xs font-bold bg-[#d8f0f4] text-[#0d3b43] hover:bg-[#aedfe7] transition-colors"
                          >
                            Mark Read
                          </button>
                        </form>
                      )}
                      {msg.status !== 'replied' && (
                        <form action={handleStatus.bind(null, msg.id, 'replied')} className="inline">
                          <button
                            type="submit"
                            className="px-2.5 py-1 rounded-lg text-2xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                          >
                            Mark Replied
                          </button>
                        </form>
                      )}
                      <form action={handleDelete.bind(null, msg.id)} className="inline">
                        <button
                          type="submit"
                          className="px-2.5 py-1 rounded-lg text-2xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Delete
                        </button>
                      </form>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#819598]">
                    No contact messages received yet.
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

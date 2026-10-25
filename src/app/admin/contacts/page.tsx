import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { updateApplicationStatus, deleteApplicationRecord } from '@/lib/actions/admin'
import { getContactSettings, defaultContactConfig } from '@/lib/settings'
import { ContactAdminTabs } from '@/components/admin/ContactAdminTabs'

export const dynamic = 'force-dynamic'

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

  const [contactSettings, messagesRes] = await Promise.all([
    getContactSettings(),
    supabase.from('contact_messages').select('*').order('created_at', { ascending: false }),
  ])

  const messages = (messagesRes.data || []) as ContactMessageRow[]

  async function handleStatus(id: string, newStatus: string) {
    'use server'
    await updateApplicationStatus('contact_messages', id, newStatus)
  }

  async function handleDelete(id: string) {
    'use server'
    await deleteApplicationRecord('contact_messages', id)
  }

  return (
    <div className="space-y-6">
      {/* Page Header and Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#e5e0d6]">
        <div>
          <div className="flex items-center gap-2 text-3xs font-bold text-[#819598] mb-1">
            <Link href="/admin" className="hover:text-[#0d3b43] transition-colors">لوحة التحكم</Link>
            <span>/</span>
            <span className="text-[#08242a]">بوابة التواصل وصفحة اتصل بنا (Contact CMS & Inbox)</span>
          </div>
          <h1 className="text-2xl font-black text-[#08242a] tracking-tight">
            إدارة بيانات التواصل والرسائل الواردة — Contact Center
          </h1>
          <p className="text-xs text-[#5f7174] mt-1">
            تحكم كامل في أرقام الهاتف، العناوين، قنوات الاتصال، واستقبال رسائل واستفسارات المواطنين والشركاء.
          </p>
        </div>

        {/* Public Preview Links */}
        <div className="flex items-center gap-2">
          <span className="text-3xs text-[#819598] font-bold">معاينة صفحة اتصل بنا:</span>
          <Link
            href="/ar/contact"
            target="_blank"
            className="px-2.5 py-1 rounded-lg bg-white border border-[#e5e0d6] hover:bg-[#0d3b43] hover:text-white text-3xs font-bold text-[#08242a] transition-all shadow-2xs"
          >
            عربي ↗
          </Link>
          <Link
            href="/fr/contact"
            target="_blank"
            className="px-2.5 py-1 rounded-lg bg-white border border-[#e5e0d6] hover:bg-[#0d3b43] hover:text-white text-3xs font-bold text-[#08242a] transition-all shadow-2xs"
          >
            FR ↗
          </Link>
          <Link
            href="/en/contact"
            target="_blank"
            className="px-2.5 py-1 rounded-lg bg-white border border-[#e5e0d6] hover:bg-[#0d3b43] hover:text-white text-3xs font-bold text-[#08242a] transition-all shadow-2xs"
          >
            EN ↗
          </Link>
        </div>
      </div>

      {/* Main Interactive Tabs */}
      <ContactAdminTabs
        initialConfig={contactSettings}
        defaultConfig={defaultContactConfig}
        messages={messages}
        onUpdateStatus={handleStatus}
        onDeleteMessage={handleDelete}
      />
    </div>
  )
}

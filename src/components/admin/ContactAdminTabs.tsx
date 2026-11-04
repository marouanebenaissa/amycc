'use client'

import { useState } from 'react'
import type { ContactConfig } from '@/lib/settings'
import { ContactManager } from '@/components/admin/ContactManager'
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

interface ContactAdminTabsProps {
  initialConfig: ContactConfig
  defaultConfig?: ContactConfig
  messages: ContactMessageRow[]
  onUpdateStatus: (id: string, newStatus: string) => Promise<void>
  onDeleteMessage: (id: string) => Promise<void>
}

export function ContactAdminTabs({
  initialConfig,
  defaultConfig,
  messages,
  onUpdateStatus,
  onDeleteMessage,
}: ContactAdminTabsProps) {
  const [activeTab, setActiveTab] = useState<'cms' | 'inbox'>('cms')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const unreadCount = messages.filter((m) => m.status === 'unread').length

  const filteredMessages = messages.filter((m) => {
    const matchesSearch =
      m.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.subject && m.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
      m.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || m.status === filterStatus
    return matchesSearch && matchesStatus
  })

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
      {/* Primary Section Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#FAF8F5] rounded-2xl border border-[#e5e0d6] w-full sm:w-fit shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveTab('cms')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeTab === 'cms'
              ? 'bg-[#231f20] text-white shadow-sm'
              : 'text-[#5C5A55] hover:text-[#231f20] hover:bg-[#F4EFE6]'
          }`}
        >
          <span>⚙️</span>
          <span>إدارة صفحة ومعلومات اتصل بنا (Contact CMS)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('inbox')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeTab === 'inbox'
              ? 'bg-[#bd3227] text-white shadow-sm'
              : 'text-[#5C5A55] hover:text-[#231f20] hover:bg-[#F4EFE6]'
          }`}
        >
          <span>📨</span>
          <span>صندوق الرسائل الواردة ({messages.length})</span>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-3xs font-black">
              {unreadCount} جديد
            </span>
          )}
        </button>
      </div>

      {/* Render Active View */}
      {activeTab === 'cms' ? (
        <ContactManager initialConfig={initialConfig} defaultConfig={defaultConfig} />
      ) : (
        <div className="space-y-4">
          {/* Inbox Filter & Search Toolbar */}
          <div className="p-4 rounded-2xl bg-white border border-[#e5e0d6] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex flex-1 items-center gap-3">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="البحث بالاسم، البريد، أو الموضوع..."
                className="w-full sm:w-72 px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6] text-xs text-[#231f20] focus:bg-white focus:outline-none focus:border-[#231f20]"
              />

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6] text-xs text-[#231f20] focus:outline-none"
              >
                <option value="all">كافة الحالات</option>
                <option value="unread">غير مقروء (Unread)</option>
                <option value="read">تمت قراءته (Read)</option>
                <option value="replied">تم الرد (Replied)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <CsvExportButton data={exportData} filename="amycc-contact-messages" />
            </div>
          </div>

          {/* Messages Table */}
          <div className="bg-white rounded-2xl border border-[#e5e0d6] overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs text-[#231f20]">
                <thead className="bg-[#FAF8F5] border-b border-[#e5e0d6] text-2xs uppercase tracking-wider text-[#5C5A55] font-bold">
                  <tr>
                    <th className="px-6 py-4 text-start">المرسل (Sender)</th>
                    <th className="px-6 py-4 text-start">الموضوع والرسالة</th>
                    <th className="px-6 py-4 text-start">الحالة</th>
                    <th className="px-6 py-4 text-start">التاريخ</th>
                    <th className="px-6 py-4 text-start">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#FEF6CC]">
                  {filteredMessages.length > 0 ? (
                    filteredMessages.map((msg) => (
                      <tr key={msg.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-[#231f20]">{msg.full_name}</div>
                          <a href={`mailto:${msg.email}`} className="text-3xs text-[#231f20] hover:underline block">
                            {msg.email}
                          </a>
                          {msg.phone && <div className="text-3xs text-[#5C5A55] font-mono">{msg.phone}</div>}
                        </td>
                        <td className="px-6 py-4 max-w-md">
                          {msg.subject && (
                            <span className="inline-block px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#e5e0d6] font-bold text-[#231f20] text-3xs mb-1">
                              {msg.subject}
                            </span>
                          )}
                          <p className="text-xs text-[#5C5A55] leading-relaxed line-clamp-3">
                            {msg.message}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-2xs font-bold ${
                              msg.status === 'unread'
                                ? 'bg-[#fde8e7] text-[#bd3227] border border-[#fde8e7]'
                                : msg.status === 'replied'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {msg.status === 'unread' ? 'جديد' : msg.status === 'replied' ? 'تم الرد' : 'مقروء'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[#5C5A55] text-3xs whitespace-nowrap">
                          {new Date(msg.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 space-x-2 whitespace-nowrap">
                          {msg.status === 'unread' && (
                            <button
                              type="button"
                              onClick={() => onUpdateStatus(msg.id, 'read')}
                              className="px-2.5 py-1 rounded-lg text-2xs font-bold bg-[#F4EFE6] text-[#231f20] hover:bg-[#d2a82b] transition-colors cursor-pointer"
                            >
                              تعليم كمقروء
                            </button>
                          )}
                          {msg.status !== 'replied' && (
                            <button
                              type="button"
                              onClick={() => onUpdateStatus(msg.id, 'replied')}
                              className="px-2.5 py-1 rounded-lg text-2xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
                            >
                              تعليم كتم الرد
                            </button>
                          )}
                          <a
                            href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || 'AMYCC Contact')}`}
                            className="px-2.5 py-1 rounded-lg text-2xs font-bold bg-[#FAF8F5] border border-[#e5e0d6] text-[#231f20] hover:bg-[#F4EFE6] transition-colors inline-block"
                          >
                            رد عبر البريد ↗
                          </a>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm('هل ترغب في حذف هذه الرسالة؟')) {
                                onDeleteMessage(msg.id)
                              }
                            }}
                            className="px-2.5 py-1 rounded-lg text-2xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            حذف
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-[#5C5A55]">
                        لا توجد رسائل مطابقة لخيارات البحث المحددة.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

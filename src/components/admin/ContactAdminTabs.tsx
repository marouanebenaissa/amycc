'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { ContactConfig } from '@/lib/settings'
import { ContactManager } from '@/components/admin/ContactManager'
import { SocialMediaManager } from '@/components/admin/SocialMediaManager'
import { CsvExportButton } from '@/components/admin/CsvExportButton'
import { useAdminLocale } from './AdminLocaleContext'

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

const STRINGS = {
  ar: {
    pageTitle: 'إدارة قنوات التواصل والشبكات الاجتماعية والرسائل',
    pageSubtitle: 'تحكم كامل في روابط مواقع التواصل الاجتماعي (Footer)، وأرقام الهاتف، وقنوات الاتصال، وصندوق الرسائل الواردة.',
    previewFront: 'معاينة صفحة اتصل بنا',
    tabSocial: 'مواقع التواصل الاجتماعي (Footer & Social)',
    tabCms: 'إدارة صفحة ومعلومات اتصل بنا (Contact CMS)',
    tabInbox: 'صندوق الرسائل الواردة',
    newBadge: 'جديد',
    searchPlaceholder: 'البحث بالاسم، البريد، أو الموضوع...',
    filterAll: 'كافة الحالات',
    statusUnread: 'غير مقروء',
    statusRead: 'تمت قراءته',
    statusReplied: 'تم الرد',
    colSender: 'المرسل',
    colSubjectMessage: 'الموضوع والرسالة',
    colStatus: 'الحالة',
    colDate: 'التاريخ',
    colActions: 'الإجراءات',
    markRead: 'تعليم كمقروء',
    markReplied: 'تعليم كتم الرد',
    replyEmail: 'رد عبر البريد ↗',
    delete: 'حذف',
    noMessages: 'لا توجد رسائل مطابقة لخيارات البحث المحددة.',
    confirmDelete: 'هل ترغب في حذف هذه الرسالة نهائياً؟',
  },
  fr: {
    pageTitle: 'Centre de Contact & Réseaux Sociaux',
    pageSubtitle: 'Gestion des réseaux sociaux (Pied de page / Footer), coordonnées officielles et messagerie entrante.',
    previewFront: 'Voir la page contact',
    tabSocial: 'Réseaux Sociaux (Footer & Social)',
    tabCms: 'Configuration CMS Contact',
    tabInbox: 'Messages Reçus',
    newBadge: 'Nouveau',
    searchPlaceholder: 'Rechercher par nom, email, sujet...',
    filterAll: 'Tous les statuts',
    statusUnread: 'Non lu',
    statusRead: 'Lu',
    statusReplied: 'Répondu',
    colSender: 'Expéditeur',
    colSubjectMessage: 'Sujet & Message',
    colStatus: 'Statut',
    colDate: 'Date',
    colActions: 'Actions',
    markRead: 'Marquer comme lu',
    markReplied: 'Marquer comme répondu',
    replyEmail: 'Répondre par email ↗',
    delete: 'Supprimer',
    noMessages: 'Aucun message ne correspond à votre recherche.',
    confirmDelete: 'Êtes-vous sûr de vouloir supprimer ce message ?',
  },
  en: {
    pageTitle: 'Contact Center & Social Media Management',
    pageSubtitle: 'Full control over social media channels (Footer & Contact page), association coordinates, and visitor messages.',
    previewFront: 'Preview Contact Page',
    tabSocial: 'Social Media Channels (Footer & Social)',
    tabCms: 'Contact Page CMS',
    tabInbox: 'Incoming Messages',
    newBadge: 'New',
    searchPlaceholder: 'Search by name, email, or subject...',
    filterAll: 'All Statuses',
    statusUnread: 'Unread',
    statusRead: 'Read',
    statusReplied: 'Replied',
    colSender: 'Sender',
    colSubjectMessage: 'Subject & Message',
    colStatus: 'Status',
    colDate: 'Date',
    colActions: 'Actions',
    markRead: 'Mark as Read',
    markReplied: 'Mark as Replied',
    replyEmail: 'Reply by Email ↗',
    delete: 'Delete',
    noMessages: 'No messages matched your search criteria.',
    confirmDelete: 'Are you sure you want to permanently delete this message?',
  },
}

export function ContactAdminTabs({
  initialConfig,
  defaultConfig,
  messages,
  onUpdateStatus,
  onDeleteMessage,
}: ContactAdminTabsProps) {
  const { locale, dir } = useAdminLocale()
  const tr = STRINGS[locale] || STRINGS.ar

  const [activeTab, setActiveTab] = useState<'social' | 'cms' | 'inbox'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const tab = params.get('tab')
      if (tab === 'social' || tab === 'cms' || tab === 'inbox') {
        return tab as 'social' | 'cms' | 'inbox'
      }
    }
    return 'social'
  })
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
    <div className="space-y-6" dir={dir}>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#e5e0d6]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#231f20] tracking-tight">
            {tr.pageTitle}
          </h1>
          <p className="text-xs sm:text-sm text-[#5C5A55] mt-1">
            {tr.pageSubtitle}
          </p>
        </div>

        <Link
          href={`/${locale}/contact`}
          target="_blank"
          className="px-4 py-2 rounded-xl text-xs font-bold text-[#bd3227] bg-[#FAF8F5] hover:bg-[#F4EFE6] border border-[#e5e0d6] transition-colors flex items-center gap-1.5 self-start sm:self-auto shrink-0"
        >
          <span>{tr.previewFront}</span>
          <span>↗</span>
        </Link>
      </div>

      {/* Primary Section Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#FAF8F5] rounded-2xl border border-[#e5e0d6] w-full sm:w-fit shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveTab('social')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeTab === 'social'
              ? 'bg-[#231f20] text-white shadow-sm'
              : 'text-[#5C5A55] hover:text-[#231f20] hover:bg-[#F4EFE6]'
          }`}
        >
          <span>🌐</span>
          <span>{tr.tabSocial}</span>
        </button>

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
          <span>{tr.tabCms}</span>
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
          <span>{tr.tabInbox} ({messages.length})</span>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-3xs font-black">
              {unreadCount} {tr.newBadge}
            </span>
          )}
        </button>
      </div>

      {/* Render Active View */}
      {activeTab === 'social' && (
        <SocialMediaManager initialConfig={initialConfig} />
      )}

      {activeTab === 'cms' && (
        <ContactManager initialConfig={initialConfig} defaultConfig={defaultConfig} />
      )}

      {activeTab === 'inbox' && (
        <div className="space-y-4">
          {/* Inbox Filter & Search Toolbar */}
          <div className="p-4 rounded-3xl bg-white border border-[#e5e0d6] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex flex-1 items-center gap-3">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={tr.searchPlaceholder}
                className="w-full sm:w-72 px-4 py-2 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6] text-xs text-[#231f20] focus:bg-white focus:outline-none focus:border-[#231f20]"
              />

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6] text-xs font-bold text-[#231f20] focus:outline-none"
              >
                <option value="all">{tr.filterAll}</option>
                <option value="unread">{tr.statusUnread}</option>
                <option value="read">{tr.statusRead}</option>
                <option value="replied">{tr.statusReplied}</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <CsvExportButton data={exportData} filename="amycc-contact-messages" />
            </div>
          </div>

          {/* Messages Mobile Cards & Desktop Table */}
          <div className="bg-white rounded-3xl border border-[#e5e0d6] overflow-hidden shadow-2xs">
            {/* Mobile Cards View (< md) */}
            <div className="block md:hidden divide-y divide-[#e5e0d6]">
              {filteredMessages.length > 0 ? (
                filteredMessages.map((msg) => (
                  <div key={msg.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-extrabold text-[#231f20] text-xs block">{msg.full_name}</span>
                        <a href={`mailto:${msg.email}`} className="text-3xs text-[#5C5A55] font-mono block">
                          {msg.email}
                        </a>
                      </div>
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-3xs font-bold ${
                          msg.status === 'unread'
                            ? 'bg-[#fde8e7] text-[#bd3227] border border-[#fde8e7]'
                            : msg.status === 'replied'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {msg.status === 'unread' ? tr.statusUnread : msg.status === 'replied' ? tr.statusReplied : tr.statusRead}
                      </span>
                    </div>

                    {msg.subject && (
                      <div className="text-3xs font-bold text-[#231f20] bg-[#FAF8F5] px-2.5 py-1 rounded-lg border border-[#e5e0d6] inline-block">
                        {msg.subject}
                      </div>
                    )}

                    <p className="text-2xs text-[#5C5A55] leading-relaxed bg-[#FAF8F5] p-3 rounded-xl border border-[#e5e0d6]">
                      {msg.message}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#f0ece1]">
                      <span className="text-4xs text-[#5C5A55] font-mono">
                        {new Date(msg.created_at).toLocaleDateString(locale === 'ar' ? 'ar-MA' : 'en-US')}
                      </span>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        {msg.status === 'unread' && (
                          <button
                            type="button"
                            onClick={() => onUpdateStatus(msg.id, 'read')}
                            className="px-2.5 py-1 rounded-lg text-3xs font-bold bg-[#F4EFE6] text-[#231f20] hover:bg-[#d2a82b]"
                          >
                            {tr.markRead}
                          </button>
                        )}
                        <a
                          href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || 'AMYCC')}`}
                          className="px-2.5 py-1 rounded-lg text-3xs font-bold bg-[#FAF8F5] border border-[#e5e0d6] text-[#231f20]"
                        >
                          {tr.replyEmail}
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(tr.confirmDelete)) {
                              onDeleteMessage(msg.id)
                            }
                          }}
                          className="p-1 rounded-lg text-rose-600 hover:bg-rose-50 text-3xs font-bold"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-[#5C5A55] text-xs font-semibold">
                  {tr.noMessages}
                </div>
              )}
            </div>

            {/* Desktop Table View (>= md) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-start text-xs text-[#231f20]">
                <thead className="bg-[#FAF8F5] border-b border-[#e5e0d6] text-2xs uppercase tracking-wider text-[#5C5A55] font-bold">
                  <tr>
                    <th className="px-6 py-4 text-start">{tr.colSender}</th>
                    <th className="px-6 py-4 text-start">{tr.colSubjectMessage}</th>
                    <th className="px-6 py-4 text-start">{tr.colStatus}</th>
                    <th className="px-6 py-4 text-start">{tr.colDate}</th>
                    <th className="px-6 py-4 text-start">{tr.colActions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0ece1]">
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
                            {msg.status === 'unread' ? tr.statusUnread : msg.status === 'replied' ? tr.statusReplied : tr.statusRead}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[#5C5A55] text-3xs whitespace-nowrap">
                          {new Date(msg.created_at).toLocaleDateString(locale === 'ar' ? 'ar-MA' : 'en-US')}
                        </td>
                        <td className="px-6 py-4 space-x-2 whitespace-nowrap">
                          {msg.status === 'unread' && (
                            <button
                              type="button"
                              onClick={() => onUpdateStatus(msg.id, 'read')}
                              className="px-2.5 py-1 rounded-lg text-2xs font-bold bg-[#F4EFE6] text-[#231f20] hover:bg-[#d2a82b] transition-colors cursor-pointer"
                            >
                              {tr.markRead}
                            </button>
                          )}
                          {msg.status !== 'replied' && (
                            <button
                              type="button"
                              onClick={() => onUpdateStatus(msg.id, 'replied')}
                              className="px-2.5 py-1 rounded-lg text-2xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
                            >
                              {tr.markReplied}
                            </button>
                          )}
                          <a
                            href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || 'AMYCC Contact')}`}
                            className="px-2.5 py-1 rounded-lg text-2xs font-bold bg-[#FAF8F5] border border-[#e5e0d6] text-[#231f20] hover:bg-[#F4EFE6] transition-colors inline-block"
                          >
                            {tr.replyEmail}
                          </a>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(tr.confirmDelete)) {
                                onDeleteMessage(msg.id)
                              }
                            }}
                            className="px-2.5 py-1 rounded-lg text-2xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            {tr.delete}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-[#5C5A55]">
                        {tr.noMessages}
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

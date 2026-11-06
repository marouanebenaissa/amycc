'use client'

import React, { useState } from 'react'
import { useAdminLocale } from './AdminLocaleContext'

export interface AuditLogRow {
  id: string
  created_at: string
  action: string
  entity_type: string
  entity_id: string | null
  details: Record<string, unknown> | null
  profiles?: {
    email: string
    full_name: string | null
  } | null
}

interface AdminAuditLogsClientProps {
  logs: AuditLogRow[]
}

export function AdminAuditLogsClient({ logs }: AdminAuditLogsClientProps) {
  const { isAr, isFr, locale } = useAdminLocale()
  const [filterQuery, setFilterQuery] = useState('')

  const t = {
    title: isAr
      ? 'سجل العمليات والتدقيق المؤسسي'
      : isFr
      ? 'Journal d\'Audit & Traçabilité'
      : 'System Audit Logs & Security Trail',
    subtitle: isAr
      ? 'توثيق مؤسسي غير قابل للتعديل لكافة العمليات الإدارية، تسجيلات الدخول، وتعديلات المحتوى.'
      : isFr
      ? 'Historique immuable de toutes les opérations administratives, connexions et modifications.'
      : 'Immutable audit trail recording administrative operations, staff logins, and content changes.',
    badge: isAr ? 'الأمان المؤسسي' : isFr ? 'Sécurité Système' : 'System Security',
    searchPlaceholder: isAr
      ? 'تصفية حسب نوع الإجراء أو المستخدم أو الكيان...'
      : isFr
      ? 'Filtrer par action, utilisateur ou entité...'
      : 'Filter by action, user, or entity...',
    thTime: isAr ? 'التوقيت' : isFr ? 'Date & Heure' : 'Timestamp',
    thUser: isAr ? 'المشرف المسؤول' : isFr ? 'Utilisateur' : 'Staff User',
    thAction: isAr ? 'نوع الإجراء' : isFr ? 'Action' : 'Action Type',
    thEntity: isAr ? 'الكيان المتأثر' : isFr ? 'Entité' : 'Affected Entity',
    thDetails: isAr ? 'تفاصيل العملية' : isFr ? 'Détails' : 'Payload Details',
    noLogs: isAr
      ? 'لم يتم تسجيل عمليات تدقيق تطابق معايير البحث.'
      : isFr
      ? 'Aucune opération trouvée dans le journal d\'audit.'
      : 'No audit records match your search criteria.',
    totalLogs: (count: number) =>
      isAr ? `${count} عملية موثقة` : isFr ? `${count} opérations enregistrées` : `${count} recorded operations`,
  }

  const filteredLogs = logs.filter((log) => {
    if (!filterQuery.trim()) return true
    const q = filterQuery.toLowerCase()
    const actionMatch = log.action?.toLowerCase().includes(q)
    const entityMatch = log.entity_type?.toLowerCase().includes(q)
    const userMatch =
      log.profiles?.email?.toLowerCase().includes(q) ||
      log.profiles?.full_name?.toLowerCase().includes(q)
    const detailsMatch = log.details
      ? JSON.stringify(log.details).toLowerCase().includes(q)
      : false
    return actionMatch || entityMatch || userMatch || detailsMatch
  })

  function getActionBadgeColor(action: string) {
    if (action.includes('delete') || action.includes('revoke')) {
      return 'bg-red-50 text-red-700 border-red-200'
    }
    if (action.includes('create') || action.includes('add') || action.includes('assign')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    }
    if (action.includes('login') || action.includes('auth')) {
      return 'bg-blue-50 text-blue-700 border-blue-200'
    }
    return 'bg-[#FEF6CC] text-[#8a6e14] border-[#d2a82b]'
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1c191a] via-[#241f20] to-[#161314] text-white p-6 sm:p-8 shadow-xl border border-white/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/15 text-3xs font-extrabold uppercase tracking-widest text-[#ffd22f]">
              <span>📜</span>
              <span>{t.badge}</span>
              <span>•</span>
              <span className="font-mono text-white/70">Immutable Ledger</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {t.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#e5e0d6]/90 max-w-2xl leading-relaxed">
              {t.subtitle}
            </p>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-white/10 border border-white/15 text-xs font-bold text-white backdrop-blur-xs self-start md:self-auto">
            {t.totalLogs(filteredLogs.length)}
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-[#e5e0d6] shadow-2xs flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 start-3 flex items-center text-xs text-[#5C5A55] pointer-events-none">
            🔍
          </span>
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full ps-9 pe-4 py-2 rounded-xl border border-[#e5e0d6] bg-[#FAF8F5] text-xs font-medium text-[#231f20] placeholder-[#5C5A55]/60 focus:bg-white focus:border-[#bd3227] focus:outline-hidden transition-all"
          />
        </div>

        {filterQuery && (
          <button
            onClick={() => setFilterQuery('')}
            className="px-3 py-2 rounded-xl text-3xs font-bold text-[#5C5A55] hover:text-[#231f20] hover:bg-[#FAF8F5] cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      {/* Logs Table / Cards */}
      <div className="bg-white rounded-2xl border border-[#e5e0d6] overflow-hidden shadow-2xs">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-start text-xs text-[#231f20]">
            <thead className="bg-[#FAF8F5] border-b border-[#e5e0d6] text-2xs uppercase tracking-wider text-[#5C5A55] font-bold">
              <tr>
                <th className="px-6 py-4 text-start">{t.thTime}</th>
                <th className="px-6 py-4 text-start">{t.thUser}</th>
                <th className="px-6 py-4 text-start">{t.thAction}</th>
                <th className="px-6 py-4 text-start">{t.thEntity}</th>
                <th className="px-6 py-4 text-start">{t.thDetails}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FEF6CC]">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    <td className="px-6 py-4 text-[#5C5A55] font-mono text-3xs whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString(
                        locale === 'ar' ? 'ar-MA' : 'fr-FR',
                        {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        }
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#231f20]">
                        {log.profiles?.full_name || 'System / Staff'}
                      </div>
                      <div className="text-[#5C5A55] text-3xs font-mono">
                        {log.profiles?.email || 'internal-system'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-3xs font-bold uppercase tracking-wider border ${getActionBadgeColor(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-3xs text-[#5C5A55]">
                      <span className="font-bold text-[#231f20]">{log.entity_type}</span>
                      {log.entity_id && (
                        <span className="text-4xs block text-[#8a6e14]">
                          #{log.entity_id.slice(0, 8)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate text-[#5C5A55] text-3xs font-mono">
                      {log.details ? JSON.stringify(log.details) : '—'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#5C5A55]">
                    <div className="text-3xl mb-2">📜</div>
                    <div className="font-semibold">{t.noLogs}</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-[#FEF6CC]">
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => (
              <div key={log.id} className="p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-3xs font-bold uppercase border ${getActionBadgeColor(
                      log.action
                    )}`}
                  >
                    {log.action}
                  </span>
                  <span className="text-[#5C5A55] font-mono text-3xs">
                    {new Date(log.created_at).toLocaleTimeString(
                      locale === 'ar' ? 'ar-MA' : 'fr-FR',
                      { hour: '2-digit', minute: '2-digit' }
                    )}
                  </span>
                </div>

                <div className="font-bold text-[#231f20]">
                  {log.profiles?.full_name || 'System / Staff'}
                  <span className="block text-3xs font-mono font-normal text-[#5C5A55]">
                    {log.profiles?.email || 'internal'}
                  </span>
                </div>

                <div className="text-3xs text-[#5C5A55] font-mono">
                  {t.thEntity}: <strong className="text-[#231f20]">{log.entity_type}</strong>
                </div>

                {log.details && (
                  <div className="p-2 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6] text-4xs font-mono text-[#5C5A55] truncate">
                    {JSON.stringify(log.details)}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-[#5C5A55]">
              <div className="text-3xl mb-2">📜</div>
              <div className="font-semibold text-xs">{t.noLogs}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

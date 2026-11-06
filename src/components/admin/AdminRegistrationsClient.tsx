'use client'

import React, { useState, useTransition } from 'react'
import { useAdminLocale } from './AdminLocaleContext'
import { CsvExportButton } from '@/components/admin/CsvExportButton'

export interface RegistrationRow {
  id: string
  full_name: string
  email: string
  phone?: string | null
  status: string
  created_at: string
  event_id: string
  events?: {
    slug: string
    event_translations?: { title: string }[]
  } | null
}

interface AdminRegistrationsClientProps {
  initialRegistrations: RegistrationRow[]
  onUpdateStatus: (id: string, newStatus: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function AdminRegistrationsClient({
  initialRegistrations,
  onUpdateStatus,
  onDelete,
}: AdminRegistrationsClientProps) {
  const { isAr, isFr, locale } = useAdminLocale()
  const [registrations, setRegistrations] = useState<RegistrationRow[]>(initialRegistrations)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isPending, startTransition] = useTransition()
  const [regToDelete, setRegToDelete] = useState<RegistrationRow | null>(null)

  const t = {
    title: isAr
      ? 'تسجيلات وحجوزات الفعاليات الثقافية'
      : isFr
      ? 'Inscriptions aux Événements'
      : 'Event Attendees & Registrations',
    subtitle: isAr
      ? 'إدارة حجوزات المقاعد وتأكيد الحضور ومتابعة قوائم الانتظار لكافة العروض والورشات.'
      : isFr
      ? 'Gestion des réservations de places, listes de présence et jauges pour chaque spectacle.'
      : 'Monitor audience ticket reservations, attendance check-in, and venue capacities.',
    badge: isAr ? 'إدارة التذاكر والحضور' : isFr ? 'Billetterie & Présences' : 'Ticketing & Attendance',
    searchPlaceholder: isAr
      ? 'بحث بالاسم، البريد، أو الفعالية...'
      : isFr
      ? 'Rechercher par nom, email ou événement...'
      : 'Search attendee name, email, or event...',
    filterAll: isAr ? 'كافة الحالات' : isFr ? 'Tous les statuts' : 'All Statuses',
    statusConfirmed: isAr ? 'مؤكد الحجز' : isFr ? 'Confirmé' : 'Confirmed',
    statusWaitlist: isAr ? 'قائمة الانتظار' : isFr ? 'Liste d\'attente' : 'Waitlist',
    statusAttended: isAr ? 'حضر الفعالية' : isFr ? 'Présent' : 'Attended',
    statusCancelled: isAr ? 'ملغي' : isFr ? 'Annulé' : 'Cancelled',
    thAttendee: isAr ? 'المشارك والحضور' : isFr ? 'Participant & Contact' : 'Attendee & Contact',
    thEvent: isAr ? 'الفعالية المسجل بها' : isFr ? 'Événement Associé' : 'Registered Event',
    thDate: isAr ? 'تاريخ التسجيل' : isFr ? 'Date d\'Inscription' : 'Registration Date',
    thStatus: isAr ? 'الحالة' : isFr ? 'Statut' : 'Status',
    thActions: isAr ? 'الإجراءات' : isFr ? 'Actions' : 'Actions',
    btnConfirm: isAr ? 'تأكيد ✓' : isFr ? 'Confirmer ✓' : 'Confirm ✓',
    btnAttended: isAr ? 'تسجيل الحضور 🎟️' : isFr ? 'Émarger 🎟️' : 'Attended 🎟️',
    btnCancel: isAr ? 'إلغاء' : isFr ? 'Annuler' : 'Cancel',
    btnDelete: isAr ? 'حذف' : isFr ? 'Supprimer' : 'Delete',
    noRegistrations: isAr
      ? 'لا توجد تسجيلات تطابق معايير البحث الحالية.'
      : isFr
      ? 'Aucune inscription ne correspond à votre recherche.'
      : 'No event registrations match your search criteria.',
    deleteConfirmTitle: isAr ? 'تأكيد حذف تسجيل الحضور' : isFr ? 'Confirmer la suppression' : 'Confirm Registration Deletion',
    deleteConfirmDesc: (name: string) =>
      isAr
        ? `هل أنت متأكد من رغبتك في حذف تسجيل المشارك (${name})؟`
        : isFr
        ? `Êtes-vous certain de vouloir supprimer l'inscription de (${name}) ?`
        : `Are you sure you want to delete the registration for (${name})?`,
    cancelModal: isAr ? 'تراجع' : isFr ? 'Annuler' : 'Cancel',
    confirmDelete: isAr ? 'نعم، احذف التسجيل' : isFr ? 'Oui, supprimer' : 'Yes, Delete',
    totalCount: (c: number) =>
      isAr ? `${c} مشارك(ين)` : isFr ? `${c} inscrit(s)` : `${c} attendee(s)`,
  }

  const filteredRegistrations = registrations.filter((reg) => {
    const eventTitle =
      reg.events?.event_translations?.[0]?.title || reg.events?.slug || ''
    const matchesSearch =
      !searchQuery.trim() ||
      reg.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eventTitle.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      statusFilter === 'all' || reg.status === statusFilter

    return matchesSearch && matchesStatus
  })

  function handleStatusChange(id: string, newStatus: string) {
    setRegistrations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    )
    startTransition(async () => {
      await onUpdateStatus(id, newStatus)
    })
  }

  function handleDeleteConfirmed() {
    if (!regToDelete) return
    const id = regToDelete.id
    setRegistrations((prev) => prev.filter((r) => r.id !== id))
    setRegToDelete(null)
    startTransition(async () => {
      await onDelete(id)
    })
  }

  const exportData = filteredRegistrations.map((r) => ({
    ID: r.id,
    FullName: r.full_name,
    Email: r.email,
    Phone: r.phone || '',
    Event: r.events?.event_translations?.[0]?.title || r.events?.slug || r.event_id,
    Status: r.status,
    RegisteredAt: r.created_at,
  }))

  function getStatusLabel(s: string) {
    if (s === 'confirmed') return t.statusConfirmed
    if (s === 'attended') return t.statusAttended
    if (s === 'waitlist') return t.statusWaitlist
    if (s === 'cancelled') return t.statusCancelled
    return s
  }

  function getStatusBadge(s: string) {
    if (s === 'confirmed') return 'bg-blue-50 text-blue-700 border-blue-200'
    if (s === 'attended') return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    if (s === 'waitlist') return 'bg-amber-50 text-amber-700 border-amber-200'
    return 'bg-red-50 text-red-700 border-red-200'
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1c191a] via-[#241f20] to-[#161314] text-white p-6 sm:p-8 shadow-xl border border-white/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/15 text-3xs font-extrabold uppercase tracking-widest text-[#ffd22f]">
              <span>🎟️</span>
              <span>{t.badge}</span>
              <span>•</span>
              <span className="font-mono text-white/70">Live Ticketing</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {t.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#e5e0d6]/90 max-w-2xl leading-relaxed">
              {t.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <CsvExportButton data={exportData} filename="amycc-event-registrations" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e5e0d6] shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 start-3 flex items-center text-xs text-[#5C5A55] pointer-events-none">
            🔍
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full ps-9 pe-4 py-2.5 rounded-xl border border-[#e5e0d6] bg-[#FAF8F5] text-xs sm:text-sm font-medium text-[#231f20] placeholder-[#5C5A55]/60 focus:bg-white focus:border-[#bd3227] focus:outline-hidden transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-[#e5e0d6] bg-[#FAF8F5] text-xs font-semibold text-[#231f20] focus:bg-white focus:border-[#bd3227] cursor-pointer"
          >
            <option value="all">{t.filterAll}</option>
            <option value="confirmed">{t.statusConfirmed}</option>
            <option value="attended">{t.statusAttended}</option>
            <option value="waitlist">{t.statusWaitlist}</option>
            <option value="cancelled">{t.statusCancelled}</option>
          </select>

          <span className="text-3xs font-bold text-[#5C5A55] bg-[#FAF8F5] px-3 py-2.5 rounded-xl border border-[#e5e0d6] whitespace-nowrap">
            {t.totalCount(filteredRegistrations.length)}
          </span>
        </div>
      </div>

      {/* Table & Responsive Cards */}
      <div className="bg-white rounded-2xl border border-[#e5e0d6] overflow-hidden shadow-2xs">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-start text-xs text-[#231f20]">
            <thead className="bg-[#FAF8F5] border-b border-[#e5e0d6] text-2xs uppercase tracking-wider text-[#5C5A55] font-bold">
              <tr>
                <th className="px-6 py-4 text-start">{t.thAttendee}</th>
                <th className="px-6 py-4 text-start">{t.thEvent}</th>
                <th className="px-6 py-4 text-start">{t.thDate}</th>
                <th className="px-6 py-4 text-start">{t.thStatus}</th>
                <th className="px-6 py-4 text-end">{t.thActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FEF6CC]">
              {filteredRegistrations.length > 0 ? (
                filteredRegistrations.map((reg) => {
                  const eventTitle =
                    reg.events?.event_translations?.[0]?.title || reg.events?.slug || 'Cultural Event'

                  return (
                    <tr key={reg.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                      {/* Attendee */}
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#231f20] text-sm">{reg.full_name}</div>
                        <div className="text-3xs text-[#5C5A55]">{reg.email}</div>
                        {reg.phone && (
                          <div className="text-3xs text-[#8a6e14] font-mono mt-0.5">{reg.phone}</div>
                        )}
                      </td>

                      {/* Event */}
                      <td className="px-6 py-4">
                        <span className="font-bold text-[#231f20] block">{eventTitle}</span>
                        <span className="text-4xs text-[#5C5A55] font-mono">ID: #{reg.event_id.slice(0, 8)}</span>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-[#5C5A55] text-3xs whitespace-nowrap">
                        {reg.created_at
                          ? new Date(reg.created_at).toLocaleDateString(
                              locale === 'ar' ? 'ar-MA' : 'fr-FR',
                              { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
                            )
                          : '—'}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-3xs font-bold uppercase tracking-wider border ${getStatusBadge(
                            reg.status
                          )}`}
                        >
                          {getStatusLabel(reg.status)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-end space-x-1.5 whitespace-nowrap">
                        {reg.status !== 'confirmed' && (
                          <button
                            disabled={isPending}
                            onClick={() => handleStatusChange(reg.id, 'confirmed')}
                            className="px-2.5 py-1 rounded-lg text-3xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
                          >
                            {t.btnConfirm}
                          </button>
                        )}
                        {reg.status !== 'attended' && (
                          <button
                            disabled={isPending}
                            onClick={() => handleStatusChange(reg.id, 'attended')}
                            className="px-2.5 py-1 rounded-lg text-3xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
                          >
                            {t.btnAttended}
                          </button>
                        )}
                        {reg.status !== 'cancelled' && (
                          <button
                            disabled={isPending}
                            onClick={() => handleStatusChange(reg.id, 'cancelled')}
                            className="px-2.5 py-1 rounded-lg text-3xs font-bold bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer"
                          >
                            {t.btnCancel}
                          </button>
                        )}
                        <button
                          disabled={isPending}
                          onClick={() => setRegToDelete(reg)}
                          className="px-2.5 py-1 rounded-lg text-3xs font-bold text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          🗑️ {t.btnDelete}
                        </button>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#5C5A55]">
                    <div className="text-3xl mb-2">🎟️</div>
                    <div className="font-semibold">{t.noRegistrations}</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="md:hidden divide-y divide-[#FEF6CC]">
          {filteredRegistrations.length > 0 ? (
            filteredRegistrations.map((reg) => {
              const eventTitle =
                reg.events?.event_translations?.[0]?.title || reg.events?.slug || 'Cultural Event'

              return (
                <div key={reg.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-[#231f20] text-sm">{reg.full_name}</div>
                      <div className="text-3xs text-[#5C5A55]">{reg.email}</div>
                      {reg.phone && <div className="text-3xs text-[#8a6e14] font-mono">{reg.phone}</div>}
                    </div>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-3xs font-bold border ${getStatusBadge(
                        reg.status
                      )}`}
                    >
                      {getStatusLabel(reg.status)}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6] text-3xs">
                    <span className="text-[#5C5A55] block">{t.thEvent}:</span>
                    <span className="font-bold text-[#231f20] block">{eventTitle}</span>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    {reg.status !== 'confirmed' && (
                      <button
                        disabled={isPending}
                        onClick={() => handleStatusChange(reg.id, 'confirmed')}
                        className="px-3 py-1 rounded-lg text-3xs font-bold bg-blue-50 text-blue-700 border border-blue-200 cursor-pointer"
                      >
                        {t.btnConfirm}
                      </button>
                    )}
                    {reg.status !== 'attended' && (
                      <button
                        disabled={isPending}
                        onClick={() => handleStatusChange(reg.id, 'attended')}
                        className="px-3 py-1 rounded-lg text-3xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-pointer"
                      >
                        {t.btnAttended}
                      </button>
                    )}
                    <button
                      disabled={isPending}
                      onClick={() => setRegToDelete(reg)}
                      className="px-3 py-1 rounded-lg text-3xs font-bold text-slate-400 hover:text-red-600 cursor-pointer"
                    >
                      🗑️ {t.btnDelete}
                    </button>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="p-8 text-center text-[#5C5A55]">
              <div className="text-3xl mb-2">🎟️</div>
              <div className="font-semibold text-xs">{t.noRegistrations}</div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {regToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-red-200 p-6 space-y-4">
            <h3 className="text-base font-black text-[#231f20]">
              {t.deleteConfirmTitle}
            </h3>
            <p className="text-xs text-[#5C5A55] leading-relaxed">
              {t.deleteConfirmDesc(regToDelete.full_name)}
            </p>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#e5e0d6]">
              <button
                disabled={isPending}
                onClick={() => setRegToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#5C5A55] hover:bg-[#FAF8F5] cursor-pointer"
              >
                {t.cancelModal}
              </button>
              <button
                disabled={isPending}
                onClick={handleDeleteConfirmed}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-md cursor-pointer disabled:opacity-50"
              >
                {t.confirmDelete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

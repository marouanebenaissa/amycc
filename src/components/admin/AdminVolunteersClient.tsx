'use client'

import React, { useState, useTransition } from 'react'
import { useAdminLocale } from './AdminLocaleContext'
import { CsvExportButton } from '@/components/admin/CsvExportButton'

export interface VolunteerRow {
  id: string
  full_name: string
  email: string
  phone?: string | null
  city: string
  skills: string
  availability: string
  initiative: string
  status: string
  created_at: string
}

interface AdminVolunteersClientProps {
  initialVolunteers: VolunteerRow[]
  onUpdateStatus: (id: string, newStatus: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function AdminVolunteersClient({
  initialVolunteers,
  onUpdateStatus,
  onDelete,
}: AdminVolunteersClientProps) {
  const { isAr, isFr } = useAdminLocale()
  const [volunteers, setVolunteers] = useState<VolunteerRow[]>(initialVolunteers)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isPending, startTransition] = useTransition()
  const [volunteerToDelete, setVolunteerToDelete] = useState<VolunteerRow | null>(null)

  const t = {
    title: isAr
      ? 'متطوعو مبادرة شباب في العمل'
      : isFr
      ? 'Bénévoles Jeunesse en Action'
      : 'Youth in Action Volunteers Roster',
    subtitle: isAr
      ? 'متابعة استمارات التطوع الميداني، توزيع المهام على الفعاليات والورش، وتأكيد مشاركة الشباب.'
      : isFr
      ? 'Gestion des candidatures de volontariat civique et encadrement des missions de terrain.'
      : 'Review, verify, and coordinate volunteer applications for cultural workshops and community events.',
    badge: isAr ? 'المبادرات الميدانية' : isFr ? 'Engagement Civique' : 'Civic Engagement',
    searchPlaceholder: isAr
      ? 'بحث بالاسم، البريد، أو المدينة...'
      : isFr
      ? 'Rechercher par nom, email ou ville...'
      : 'Search by volunteer name, email, or city...',
    filterAll: isAr ? 'كافة الحالات' : isFr ? 'Tous les statuts' : 'All Statuses',
    statusPending: isAr ? 'قيد المراجعة' : isFr ? 'En attente' : 'Pending',
    statusApproved: isAr ? 'تمت الموافقة' : isFr ? 'Validé' : 'Approved',
    statusRejected: isAr ? 'مرفوض' : isFr ? 'Refusé' : 'Rejected',
    thVolunteer: isAr ? 'المتطوع والاتصال' : isFr ? 'Bénévole & Contact' : 'Volunteer & Contact',
    thCity: isAr ? 'المدينة والتفرغ' : isFr ? 'Ville & Disponibilité' : 'City & Availability',
    thSkills: isAr ? 'المهارات والمبادرة' : isFr ? 'Compétences & Initiative' : 'Skills & Initiative',
    thStatus: isAr ? 'حالة الطلب' : isFr ? 'Statut' : 'Status',
    thActions: isAr ? 'الإجراءات' : isFr ? 'Actions' : 'Actions',
    btnApprove: isAr ? 'موافقة ✓' : isFr ? 'Valider ✓' : 'Approve ✓',
    btnReject: isAr ? 'رفض' : isFr ? 'Refuser' : 'Reject',
    btnDelete: isAr ? 'حذف' : isFr ? 'Supprimer' : 'Delete',
    noVolunteers: isAr
      ? 'لا توجد طلبات تطوع تطابق معايير البحث الحالية.'
      : isFr
      ? 'Aucune candidature ne correspond à votre recherche.'
      : 'No volunteer applications match your search criteria.',
    deleteConfirmTitle: isAr ? 'تأكيد حذف طلب التطوع' : isFr ? 'Confirmer la suppression' : 'Confirm Application Deletion',
    deleteConfirmDesc: (name: string) =>
      isAr
        ? `هل أنت متأكد من رغبتك في حذف طلب التطوع الخاص بـ (${name})؟`
        : isFr
        ? `Êtes-vous certain de vouloir supprimer la candidature de (${name}) ?`
        : `Are you sure you want to delete the volunteer application for (${name})?`,
    cancel: isAr ? 'إلغاء' : isFr ? 'Annuler' : 'Cancel',
    confirmDelete: isAr ? 'نعم، احذف الطلب' : isFr ? 'Oui, supprimer' : 'Yes, Delete',
    totalCount: (c: number) =>
      isAr ? `${c} متطوع(ين)` : isFr ? `${c} bénévole(s)` : `${c} volunteer(s)`,
  }

  const filteredVolunteers = volunteers.filter((vol) => {
    const matchesSearch =
      !searchQuery.trim() ||
      vol.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vol.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vol.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vol.skills.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      statusFilter === 'all' || vol.status === statusFilter

    return matchesSearch && matchesStatus
  })

  function handleStatusChange(id: string, newStatus: string) {
    setVolunteers((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: newStatus } : v))
    )
    startTransition(async () => {
      await onUpdateStatus(id, newStatus)
    })
  }

  function handleDeleteConfirmed() {
    if (!volunteerToDelete) return
    const id = volunteerToDelete.id
    setVolunteers((prev) => prev.filter((v) => v.id !== id))
    setVolunteerToDelete(null)
    startTransition(async () => {
      await onDelete(id)
    })
  }

  const exportData = filteredVolunteers.map((v) => ({
    ID: v.id,
    FullName: v.full_name,
    Email: v.email,
    Phone: v.phone || '',
    City: v.city,
    Skills: v.skills,
    Availability: v.availability,
    Initiative: v.initiative,
    Status: v.status,
    AppliedAt: v.created_at,
  }))

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1c191a] via-[#241f20] to-[#161314] text-white p-6 sm:p-8 shadow-xl border border-white/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/15 text-3xs font-extrabold uppercase tracking-widest text-[#ffd22f]">
              <span>🤝</span>
              <span>{t.badge}</span>
              <span>•</span>
              <span className="font-mono text-white/70">Youth in Action</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {t.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#e5e0d6]/90 max-w-2xl leading-relaxed">
              {t.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <CsvExportButton data={exportData} filename="amycc-volunteers-roster" />
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
            <option value="pending">{t.statusPending}</option>
            <option value="approved">{t.statusApproved}</option>
            <option value="rejected">{t.statusRejected}</option>
          </select>

          <span className="text-3xs font-bold text-[#5C5A55] bg-[#FAF8F5] px-3 py-2.5 rounded-xl border border-[#e5e0d6] whitespace-nowrap">
            {t.totalCount(filteredVolunteers.length)}
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
                <th className="px-6 py-4 text-start">{t.thVolunteer}</th>
                <th className="px-6 py-4 text-start">{t.thCity}</th>
                <th className="px-6 py-4 text-start">{t.thSkills}</th>
                <th className="px-6 py-4 text-start">{t.thStatus}</th>
                <th className="px-6 py-4 text-end">{t.thActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FEF6CC]">
              {filteredVolunteers.length > 0 ? (
                filteredVolunteers.map((vol) => (
                  <tr key={vol.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    {/* Volunteer */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#231f20] text-sm">{vol.full_name}</div>
                      <div className="text-3xs text-[#5C5A55]">{vol.email}</div>
                      {vol.phone && (
                        <div className="text-3xs text-[#8a6e14] font-mono mt-0.5">{vol.phone}</div>
                      )}
                    </td>

                    {/* City & Availability */}
                    <td className="px-6 py-4">
                      <span className="font-semibold block text-[#231f20]">{vol.city}</span>
                      <span className="text-[#5C5A55] text-3xs font-medium">{vol.availability}</span>
                    </td>

                    {/* Skills & Initiative */}
                    <td className="px-6 py-4 max-w-xs">
                      <span className="inline-block px-2.5 py-0.5 rounded-md text-3xs font-bold bg-[#FAF8F5] border border-[#e5e0d6] text-[#231f20] mb-1">
                        {vol.initiative}
                      </span>
                      <p className="truncate text-[#5C5A55] text-xs" title={vol.skills}>
                        {vol.skills}
                      </p>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-3xs font-bold uppercase tracking-wider border ${
                          vol.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : vol.status === 'rejected'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {vol.status === 'approved'
                          ? t.statusApproved
                          : vol.status === 'rejected'
                          ? t.statusRejected
                          : t.statusPending}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-end space-x-1.5 whitespace-nowrap">
                      {vol.status !== 'approved' && (
                        <button
                          disabled={isPending}
                          onClick={() => handleStatusChange(vol.id, 'approved')}
                          className="px-2.5 py-1 rounded-lg text-3xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
                        >
                          {t.btnApprove}
                        </button>
                      )}
                      {vol.status !== 'rejected' && (
                        <button
                          disabled={isPending}
                          onClick={() => handleStatusChange(vol.id, 'rejected')}
                          className="px-2.5 py-1 rounded-lg text-3xs font-bold bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer"
                        >
                          {t.btnReject}
                        </button>
                      )}
                      <button
                        disabled={isPending}
                        onClick={() => setVolunteerToDelete(vol)}
                        className="px-2.5 py-1 rounded-lg text-3xs font-bold text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        🗑️ {t.btnDelete}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#5C5A55]">
                    <div className="text-3xl mb-2">🤝</div>
                    <div className="font-semibold">{t.noVolunteers}</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="md:hidden divide-y divide-[#FEF6CC]">
          {filteredVolunteers.length > 0 ? (
            filteredVolunteers.map((vol) => (
              <div key={vol.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-bold text-[#231f20] text-sm">{vol.full_name}</div>
                    <div className="text-3xs text-[#5C5A55]">{vol.email}</div>
                    {vol.phone && <div className="text-3xs text-[#8a6e14] font-mono">{vol.phone}</div>}
                  </div>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-3xs font-bold border ${
                      vol.status === 'approved'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : vol.status === 'rejected'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {vol.status === 'approved'
                      ? t.statusApproved
                      : vol.status === 'rejected'
                      ? t.statusRejected
                      : t.statusPending}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6] text-3xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[#5C5A55]">{t.thCity}:</span>
                    <span className="font-bold text-[#231f20]">{vol.city} ({vol.availability})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5C5A55]">{t.thSkills}:</span>
                    <span className="font-bold text-[#231f20]">{vol.initiative}</span>
                  </div>
                  <p className="text-[#5C5A55] pt-1 border-t border-[#e5e0d6]/60">
                    {vol.skills}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  {vol.status !== 'approved' && (
                    <button
                      disabled={isPending}
                      onClick={() => handleStatusChange(vol.id, 'approved')}
                      className="px-3 py-1 rounded-lg text-3xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-pointer"
                    >
                      {t.btnApprove}
                    </button>
                  )}
                  {vol.status !== 'rejected' && (
                    <button
                      disabled={isPending}
                      onClick={() => handleStatusChange(vol.id, 'rejected')}
                      className="px-3 py-1 rounded-lg text-3xs font-bold bg-red-50 text-red-700 border border-red-200 cursor-pointer"
                    >
                      {t.btnReject}
                    </button>
                  )}
                  <button
                    disabled={isPending}
                    onClick={() => setVolunteerToDelete(vol)}
                    className="px-3 py-1 rounded-lg text-3xs font-bold text-slate-400 hover:text-red-600 cursor-pointer"
                  >
                    🗑️ {t.btnDelete}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-[#5C5A55]">
              <div className="text-3xl mb-2">🤝</div>
              <div className="font-semibold text-xs">{t.noVolunteers}</div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {volunteerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-red-200 p-6 space-y-4">
            <h3 className="text-base font-black text-[#231f20]">
              {t.deleteConfirmTitle}
            </h3>
            <p className="text-xs text-[#5C5A55] leading-relaxed">
              {t.deleteConfirmDesc(volunteerToDelete.full_name)}
            </p>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#e5e0d6]">
              <button
                disabled={isPending}
                onClick={() => setVolunteerToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#5C5A55] hover:bg-[#FAF8F5] cursor-pointer"
              >
                {t.cancel}
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

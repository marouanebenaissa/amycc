'use client'

import { useState } from 'react'
import { submitPartnership, type ActionResponse } from '@/lib/actions/submissions'

export function PartnershipForm({ locale }: { locale: string }) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ActionResponse | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    const formData = new FormData(e.currentTarget)
    const response = await submitPartnership(formData)

    setLoading(false)
    setResult(response)
    if (response.success) {
      ;(e.target as HTMLFormElement).reset()
    }
  }

  const isAr = locale === 'ar'

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs">
      {result && (
        <div
          className={`p-4 rounded-xl text-sm font-medium ${
            result.success
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {result.message}
        </div>
      )}

      {/* Organization Name & Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            {isAr ? 'اسم المؤسسة أو الجمعية *' : 'Organization Name *'}
          </label>
          <input
            type="text"
            name="organizationName"
            required
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0068ff] focus:ring-1 focus:ring-[#0068ff] outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            {isAr ? 'نوع المؤسسة *' : 'Organization Type *'}
          </label>
          <select
            name="organizationType"
            required
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0068ff] focus:ring-1 focus:ring-[#0068ff] outline-none bg-white"
          >
            <option value="nonprofit">{isAr ? 'جمعية أو منظمة غير ربحية' : 'Nonprofit / NGO'}</option>
            <option value="institution">{isAr ? 'مؤسسة عمومية أو تعليمية' : 'Public / Educational Institution'}</option>
            <option value="cultural_center">{isAr ? 'مركز ثقافي أو فني' : 'Cultural / Arts Center'}</option>
            <option value="corporate">{isAr ? 'شركة أو قطاع خاص' : 'Corporate / Private Sector'}</option>
            <option value="other">{isAr ? 'أخرى' : 'Other'}</option>
          </select>
        </div>
      </div>

      {/* Contact Name & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            {isAr ? 'اسم جهة الاتصال *' : 'Contact Person *'}
          </label>
          <input
            type="text"
            name="contactName"
            required
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0068ff] focus:ring-1 focus:ring-[#0068ff] outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            {isAr ? 'البريد الإلكتروني المهني *' : 'Professional Email *'}
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0068ff] focus:ring-1 focus:ring-[#0068ff] outline-none"
          />
        </div>
      </div>

      {/* City & Country */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            {isAr ? 'المدينة *' : 'City *'}
          </label>
          <input
            type="text"
            name="city"
            required
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0068ff] focus:ring-1 focus:ring-[#0068ff] outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            {isAr ? 'الدولة *' : 'Country *'}
          </label>
          <input
            type="text"
            name="country"
            defaultValue="Morocco"
            required
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0068ff] focus:ring-1 focus:ring-[#0068ff] outline-none"
          />
        </div>
      </div>

      {/* Proposal */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          {isAr ? 'مقترح الشراكة أو رسالتكم *' : 'Partnership Proposal / Message *'}
        </label>
        <textarea
          name="proposal"
          required
          rows={4}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0068ff] focus:ring-1 focus:ring-[#0068ff] outline-none"
          placeholder={isAr ? 'صف أهداف ومجالات التعاون المشترك...' : 'Describe proposed collaboration areas...'}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-[#0068ff] hover:bg-[#0054d1] disabled:opacity-60 transition-all shadow-sm"
      >
        {loading ? (isAr ? 'جارٍ الإرسال...' : 'Submitting...') : (isAr ? 'إرسال طلب الشراكة' : 'Submit Partnership Proposal')}
      </button>
    </form>
  )
}

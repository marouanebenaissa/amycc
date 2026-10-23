'use client'

import { useState } from 'react'
import { submitSupportInquiry, type ActionResponse } from '@/lib/actions/submissions'

export function SupportForm({ locale }: { locale: string }) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ActionResponse | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    const formData = new FormData(e.currentTarget)
    const response = await submitSupportInquiry(formData)

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

      {/* Support Type */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          {isAr ? 'نوع الدعم المقترح *' : 'Type of Support *'}
        </label>
        <select
          name="supportType"
          required
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0068ff] focus:ring-1 focus:ring-[#0068ff] outline-none bg-white"
        >
          <option value="financial">{isAr ? 'دعم مالي أو مساهمة' : 'Financial Support / Contribution'}</option>
          <option value="in_kind">{isAr ? 'مساهمة عينية' : 'In-Kind Contribution'}</option>
          <option value="sponsorship">{isAr ? 'رعاية فعالية أو برنامج' : 'Event / Program Sponsorship'}</option>
          <option value="equipment">{isAr ? 'معدات وأدوات فنية وثقافية' : 'Equipment & Artistic Materials'}</option>
          <option value="venue">{isAr ? 'توفير فضاء أو قاعة عرض' : 'Venue / Exhibition Space Support'}</option>
        </select>
      </div>

      {/* Donor / Organization Name & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            {isAr ? 'الاسم الكامل أو اسم الهيئة *' : 'Name / Entity *'}
          </label>
          <input
            type="text"
            name="donorName"
            required
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0068ff] focus:ring-1 focus:ring-[#0068ff] outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            {isAr ? 'البريد الإلكتروني *' : 'Email Address *'}
          </label>
          <input
            type="email"
            name="donorEmail"
            required
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0068ff] focus:ring-1 focus:ring-[#0068ff] outline-none"
          />
        </div>
      </div>

      {/* Phone & Amount (optional) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            {isAr ? 'رقم الهاتف' : 'Phone Number'}
          </label>
          <input
            type="tel"
            name="donorPhone"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0068ff] focus:ring-1 focus:ring-[#0068ff] outline-none"
            placeholder="+212 ..."
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            {isAr ? 'المبلغ التقديري (بالدرهم المغربي)' : 'Estimated Amount (MAD)'}
          </label>
          <input
            type="number"
            name="amount"
            min="10"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0068ff] focus:ring-1 focus:ring-[#0068ff] outline-none"
            placeholder="0.00"
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          {isAr ? 'تفاصيل إضافية حول الدعم المقترح' : 'Additional details regarding your support'}
        </label>
        <textarea
          name="notes"
          rows={3}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0068ff] focus:ring-1 focus:ring-[#0068ff] outline-none"
        />
      </div>

      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-xs text-amber-800 leading-relaxed">
        {isAr
          ? 'تنبيه: لا يتم تحصيل المدفوعات عبر البطاقات البنكية أونلاين على الموقع حالياً. سيقوم الفريق المالي بالتواصل معكم لتنسيق الترتيبات الرسمية وتسليم وصل التبرع القانوني.'
          : 'Notice: Online credit card payments are not processed directly on the website at this stage. Our team will contact you to coordinate official arrangements and issue legal receipts.'}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-[#0068ff] hover:bg-[#0054d1] disabled:opacity-60 transition-all shadow-sm"
      >
        {loading ? (isAr ? 'جارٍ الإرسال...' : 'Recording...') : (isAr ? 'تسجيل إشعار الدعم' : 'Record Support Inquiry')}
      </button>
    </form>
  )
}

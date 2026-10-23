'use client'

import { useState } from 'react'
import { submitVolunteer, type ActionResponse } from '@/lib/actions/submissions'

export function VolunteerForm({ locale }: { locale: string }) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ActionResponse | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    const formData = new FormData(e.currentTarget)
    const response = await submitVolunteer(formData)

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

      {/* Hidden initiative field */}
      <input type="hidden" name="initiative" value="Youth in Action" />

      {/* Full Name */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          {isAr ? 'الاسم الكامل *' : 'Full Name *'}
        </label>
        <input
          type="text"
          name="fullName"
          required
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0068ff] focus:ring-1 focus:ring-[#0068ff] outline-none"
          placeholder={isAr ? 'أدخل اسمك الكامل' : 'Enter your full name'}
        />
        {result?.errors?.fullName && (
          <p className="text-xs text-red-600 mt-1">{result.errors.fullName[0]}</p>
        )}
      </div>

      {/* Email & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            {isAr ? 'البريد الإلكتروني *' : 'Email Address *'}
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0068ff] focus:ring-1 focus:ring-[#0068ff] outline-none"
            placeholder="name@example.com"
          />
          {result?.errors?.email && (
            <p className="text-xs text-red-600 mt-1">{result.errors.email[0]}</p>
          )}
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            {isAr ? 'رقم الهاتف' : 'Phone Number'}
          </label>
          <input
            type="tel"
            name="phone"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0068ff] focus:ring-1 focus:ring-[#0068ff] outline-none"
            placeholder="+212 ..."
          />
        </div>
      </div>

      {/* City & Availability */}
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
            placeholder={isAr ? 'المدينة' : 'City'}
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            {isAr ? 'الأوقات المتاحة *' : 'Availability *'}
          </label>
          <input
            type="text"
            name="availability"
            required
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0068ff] focus:ring-1 focus:ring-[#0068ff] outline-none"
            placeholder={isAr ? 'عطلة نهاية الأسبوع، مساء...' : 'Weekends, evenings...'}
          />
        </div>
      </div>

      {/* Skills */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          {isAr ? 'المهارات والاهتمامات *' : 'Skills & Areas of Interest *'}
        </label>
        <textarea
          name="skills"
          required
          rows={3}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0068ff] focus:ring-1 focus:ring-[#0068ff] outline-none"
          placeholder={isAr ? 'المسرح، الموسيقى، التنظيم، التصوير، إدارة الفعاليات...' : 'Arts, media, event management, theatre...'}
        />
        {result?.errors?.skills && (
          <p className="text-xs text-red-600 mt-1">{result.errors.skills[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-[#0068ff] hover:bg-[#0054d1] disabled:opacity-60 transition-all shadow-sm"
      >
        {loading ? (isAr ? 'جارٍ الإرسال...' : 'Submitting...') : (isAr ? 'تقديم طلب التطوع' : 'Submit Volunteer Application')}
      </button>
    </form>
  )
}

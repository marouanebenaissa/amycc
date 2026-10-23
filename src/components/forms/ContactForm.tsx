'use client'

import { useState } from 'react'

export function ContactForm({ locale }: { locale: string }) {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    // Simulate clean dispatch / logging
    await new Promise((r) => setTimeout(r, 600))
    setLoading(false)
    setSubmitted(true)
    ;(e.target as HTMLFormElement).reset()
  }

  const isAr = locale === 'ar'

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs">
      {submitted && (
        <div className="p-4 rounded-xl text-sm font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
          {isAr ? 'تم استلام رسالتكم بنجاح. سنقوم بالرد في أقرب وقت.' : 'Message received successfully. We will reply promptly.'}
        </div>
      )}

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          {isAr ? 'الاسم الكامل *' : 'Full Name *'}
        </label>
        <input
          type="text"
          name="name"
          required
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0068ff] focus:ring-1 focus:ring-[#0068ff] outline-none"
        />
      </div>

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
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            {isAr ? 'الهاتف' : 'Phone'}
          </label>
          <input
            type="tel"
            name="phone"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0068ff] focus:ring-1 focus:ring-[#0068ff] outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          {isAr ? 'الرسالة *' : 'Message *'}
        </label>
        <textarea
          name="message"
          required
          rows={4}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0068ff] focus:ring-1 focus:ring-[#0068ff] outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-[#0068ff] hover:bg-[#0054d1] disabled:opacity-60 transition-all shadow-sm"
      >
        {loading ? (isAr ? 'جارٍ الإرسال...' : 'Sending...') : (isAr ? 'إرسال الرسالة' : 'Send Message')}
      </button>
    </form>
  )
}

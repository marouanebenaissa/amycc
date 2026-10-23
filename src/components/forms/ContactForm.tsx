'use client'

import { useState } from 'react'
import { submitContact, type ActionResponse } from '@/lib/actions/submissions'

export function ContactForm({ locale }: { locale: string }) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ActionResponse | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      const response = await submitContact(formData)
      setResult(response)
      if (response.success) {
        form.reset()
      }
    } catch {
      setResult({
        success: false,
        message: locale === 'ar' ? 'حدث خطأ في الإرسال. يرجى المحاولة لاحقاً.' : 'An error occurred. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  const isAr = locale === 'ar'
  const isFr = locale === 'fr'

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-2xl mx-auto bg-white p-8 sm:p-10 rounded-3xl border border-[#e5e0d6] shadow-subtle"
    >
      {result && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold border ${
            result.success
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {result.message}
        </div>
      )}

      {/* Full Name */}
      <div>
        <label className="block text-2xs font-bold uppercase tracking-wider text-[#08242a] mb-2">
          {isAr ? 'الاسم الكامل *' : isFr ? 'Nom complet *' : 'Full Name *'}
        </label>
        <input
          type="text"
          name="name"
          required
          placeholder={isAr ? 'الاسم والنسب' : 'Your full name'}
          className="w-full px-4 py-3 rounded-xl border border-[#e5e0d6] text-xs text-[#08242a] focus:border-[#0d3b43] focus:ring-1 focus:ring-[#0d3b43] outline-none"
        />
        {result?.errors?.name && (
          <p className="text-3xs text-red-600 mt-1">{result.errors.name[0]}</p>
        )}
      </div>

      {/* Email & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-2xs font-bold uppercase tracking-wider text-[#08242a] mb-2">
            {isAr ? 'البريد الإلكتروني *' : isFr ? 'Adresse e-mail *' : 'Email Address *'}
          </label>
          <input
            type="email"
            name="email"
            required
            placeholder="name@example.com"
            className="w-full px-4 py-3 rounded-xl border border-[#e5e0d6] text-xs text-[#08242a] focus:border-[#0d3b43] focus:ring-1 focus:ring-[#0d3b43] outline-none"
          />
          {result?.errors?.email && (
            <p className="text-3xs text-red-600 mt-1">{result.errors.email[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-2xs font-bold uppercase tracking-wider text-[#08242a] mb-2">
            {isAr ? 'رقم الهاتف' : isFr ? 'Téléphone' : 'Phone'}
          </label>
          <input
            type="tel"
            name="phone"
            placeholder="+212 6..."
            className="w-full px-4 py-3 rounded-xl border border-[#e5e0d6] text-xs text-[#08242a] focus:border-[#0d3b43] focus:ring-1 focus:ring-[#0d3b43] outline-none"
          />
        </div>
      </div>

      {/* Subject */}
      <div>
        <label className="block text-2xs font-bold uppercase tracking-wider text-[#08242a] mb-2">
          {isAr ? 'موضوع الرسالة' : isFr ? 'Sujet' : 'Subject'}
        </label>
        <input
          type="text"
          name="subject"
          placeholder={isAr ? 'مثال: استفسار حول ورشات الموسيقى' : 'e.g. Inquiry regarding music workshops'}
          className="w-full px-4 py-3 rounded-xl border border-[#e5e0d6] text-xs text-[#08242a] focus:border-[#0d3b43] focus:ring-1 focus:ring-[#0d3b43] outline-none"
        />
      </div>

      {/* Message */}
      <div>
        <label className="block text-2xs font-bold uppercase tracking-wider text-[#08242a] mb-2">
          {isAr ? 'نص الرسالة *' : isFr ? 'Votre message *' : 'Message *'}
        </label>
        <textarea
          name="message"
          required
          rows={5}
          placeholder={isAr ? 'اكتب رسالتك أو استفسارك هنا...' : 'Write your message or inquiry here...'}
          className="w-full px-4 py-3 rounded-xl border border-[#e5e0d6] text-xs text-[#08242a] focus:border-[#0d3b43] focus:ring-1 focus:ring-[#0d3b43] outline-none resize-y"
        />
        {result?.errors?.message && (
          <p className="text-3xs text-red-600 mt-1">{result.errors.message[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-[#0d3b43] hover:bg-[#14505b] disabled:opacity-60 transition-all text-xs shadow-md active:scale-98"
      >
        {loading
          ? (isAr ? 'جارٍ الإرسال...' : isFr ? 'Envoi en cours...' : 'Sending...')
          : (isAr ? 'إرسال الرسالة إلى إدارة الجمعية ✓' : isFr ? 'Envoyer le message ✓' : 'Send Message to AMYCC ✓')}
      </button>
    </form>
  )
}

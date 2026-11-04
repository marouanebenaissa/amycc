'use client'

import { useState } from 'react'
import { submitContact, type ActionResponse } from '@/lib/actions/submissions'

interface ContactFormProps {
  locale: string
  topics?: {
    id: string
    labelAr: string
    labelFr?: string
    labelEn?: string
  }[]
  responseTime?: string
}

export function ContactForm({ locale, topics = [], responseTime }: ContactFormProps) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ActionResponse | null>(null)
  const [selectedTopic, setSelectedTopic] = useState<string>('')
  const [customSubject, setCustomSubject] = useState<string>('')

  const isAr = locale === 'ar'
  const isFr = locale === 'fr'

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    const form = e.currentTarget
    const formData = new FormData(form)

    // Compute subject from dropdown or custom input
    const finalSubject = selectedTopic === 'other' || !selectedTopic
      ? customSubject
      : selectedTopic

    formData.set('subject', finalSubject)

    try {
      const response = await submitContact(formData)
      setResult(response)
      if (response.success) {
        form.reset()
        setSelectedTopic('')
        setCustomSubject('')
      }
    } catch {
      setResult({
        success: false,
        message: isAr
          ? 'حدث خطأ غير متوقع أثناء إرسال الرسالة. يرجى المحاولة لاحقاً أو الاتصال بنا مباشرة.'
          : 'An unexpected error occurred. Please try again or reach out directly.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-7 sm:p-10 rounded-3xl border border-[#e5e0d6] shadow-subtle relative overflow-hidden"
    >
      {/* Decorative Moroccan subtle top border */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#231f20] via-[#bd3227] to-[#d2a82b]" />

      <div className="space-y-1.5 pb-3 border-b border-[#FEF6CC]">
        <h3 className="text-xl sm:text-2xl font-black text-[#231f20] tracking-tight">
          {isAr ? 'استمارة المراسلة والاستفسار المباشر' : isFr ? 'Formulaire de Contact Direct' : 'Direct Inquiry Form'}
        </h3>
        <p className="text-xs sm:text-sm text-[#5C5A55] leading-relaxed">
          {isAr
            ? 'املأ الاستمارة وسيتولى الفريق الإداري المختص الرد عليك في أقرب الآجال.'
            : isFr
            ? 'Remplissez le formulaire et notre équipe administrative vous répondra dans les meilleurs délais.'
            : 'Fill in the form and our team will get back to you promptly.'}
        </p>
      </div>

      {result && (
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm font-bold border transition-all ${
            result.success
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span>{result.success ? '✓' : '⚠'}</span>
            <span>{result.message}</span>
          </div>
          {result.success && responseTime && (
            <p className="text-xs text-emerald-700 font-bold mt-1.5">
              {isAr ? `متوسط وقت الرد: ${responseTime}` : `Response time: ${responseTime}`}
            </p>
          )}
        </div>
      )}

      {/* Full Name */}
      <div>
        <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-[#231f20] mb-2">
          {isAr ? 'الاسم الكامل *' : isFr ? 'Nom complet *' : 'Full Name *'}
        </label>
        <input
          type="text"
          name="name"
          required
          placeholder={isAr ? 'الاسم العائلي والشخصي' : 'e.g. Sara Mansouri'}
          className="w-full px-4 py-3 rounded-xl border border-[#e5e0d6] bg-[#F5F3EE]/50 text-sm text-[#231f20] focus:bg-white focus:border-[#231f20] focus:ring-2 focus:ring-[#231f20]/15 outline-none transition-all"
        />
        {result?.errors?.name && (
          <p className="text-xs text-rose-600 font-bold mt-1">{result.errors.name[0]}</p>
        )}
      </div>

      {/* Email & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-[#231f20] mb-2">
            {isAr ? 'البريد الإلكتروني *' : isFr ? 'Adresse e-mail *' : 'Email Address *'}
          </label>
          <input
            type="email"
            name="email"
            required
            placeholder="name@example.com"
            className="w-full px-4 py-3 rounded-xl border border-[#e5e0d6] bg-[#F5F3EE]/50 text-sm text-[#231f20] font-mono focus:bg-white focus:border-[#231f20] focus:ring-2 focus:ring-[#231f20]/15 outline-none transition-all"
          />
          {result?.errors?.email && (
            <p className="text-xs text-rose-600 font-bold mt-1">{result.errors.email[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-[#231f20] mb-2">
            {isAr ? 'رقم الهاتف / الواتساب' : isFr ? 'Téléphone / WhatsApp' : 'Phone / WhatsApp'}
          </label>
          <input
            type="tel"
            name="phone"
            placeholder="+212 6..."
            className="w-full px-4 py-3 rounded-xl border border-[#e5e0d6] bg-[#F5F3EE]/50 text-sm text-[#231f20] font-mono focus:bg-white focus:border-[#231f20] focus:ring-2 focus:ring-[#231f20]/15 outline-none transition-all"
          />
        </div>
      </div>

      {/* Inquiry Topic Dropdown */}
      {topics.length > 0 && (
        <div>
          <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-[#231f20] mb-2">
            {isAr ? 'موضوع / طبيعة الاستفسار *' : isFr ? 'Objet de la demande *' : 'Inquiry Category *'}
          </label>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[#e5e0d6] bg-[#F5F3EE]/50 text-sm text-[#231f20] focus:bg-white focus:border-[#231f20] focus:ring-2 focus:ring-[#231f20]/15 outline-none transition-all"
          >
            <option value="">{isAr ? '-- اختر موضوع الرسالة --' : '-- Select inquiry topic --'}</option>
            {topics.map((t) => {
              const label = isAr ? t.labelAr : isFr ? (t.labelFr || t.labelAr) : (t.labelEn || t.labelAr)
              return (
                <option key={t.id} value={label}>
                  {label}
                </option>
              )
            })}
            <option value="other">{isAr ? 'موضوع آخر (حدد بنفسك)' : 'Other subject'}</option>
          </select>
        </div>
      )}

      {/* Custom Subject (if 'other' selected or no topics defined) */}
      {(selectedTopic === 'other' || topics.length === 0) && (
        <div>
          <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-[#231f20] mb-2">
            {isAr ? 'موضوع الرسالة بالتحديد' : isFr ? 'Précision du sujet' : 'Specific Subject'}
          </label>
          <input
            type="text"
            value={customSubject}
            onChange={(e) => setCustomSubject(e.target.value)}
            placeholder={isAr ? 'مثال: استفسار حول ورشات الموسيقى والتراث' : 'e.g. Partnership inquiry'}
            className="w-full px-4 py-3 rounded-xl border border-[#e5e0d6] bg-[#F5F3EE]/50 text-sm text-[#231f20] focus:bg-white focus:border-[#231f20] focus:ring-2 focus:ring-[#231f20]/15 outline-none transition-all"
          />
        </div>
      )}

      {/* Message Textarea */}
      <div>
        <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-[#231f20] mb-2">
          {isAr ? 'نص الرسالة أو الاستفسار *' : isFr ? 'Votre message *' : 'Your Message *'}
        </label>
        <textarea
          name="message"
          required
          rows={5}
          placeholder={isAr ? 'اكتب رسالتك، ملاحظتك، أو مقترحك بالتفصيل هنا...' : 'Write your inquiry or proposal in detail here...'}
          className="w-full px-4 py-3 rounded-xl border border-[#e5e0d6] bg-[#F5F3EE]/50 text-sm text-[#231f20] focus:bg-white focus:border-[#231f20] focus:ring-2 focus:ring-[#231f20]/15 outline-none resize-y transition-all leading-relaxed"
        />
        {result?.errors?.message && (
          <p className="text-xs text-rose-600 font-bold mt-1">{result.errors.message[0]}</p>
        )}
      </div>

      {/* Privacy & Trust Assurance */}
      <div className="p-3.5 rounded-xl bg-[#F5F3EE] border border-[#FEF6CC] flex items-center gap-2.5 text-xs text-[#5C5A55]">
        <span className="text-sm">🔒</span>
        <span>
          {isAr
            ? 'تلتزم الجمعية بالسرية التامة لبياناتك الشخصية ولن يتم استخدامها إلا للتواصل معك بخصوص هذا الطلب.'
            : isFr
            ? 'Vos données personnelles sont protégées et ne seront utilisées que pour répondre à votre demande.'
            : 'Your personal information is handled with full confidentiality under applicable data privacy guidelines.'}
        </span>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 px-6 rounded-xl font-black text-white bg-[#231f20] hover:bg-[#231f20] disabled:opacity-60 transition-all text-sm sm:text-base shadow-md hover:shadow-lg active:scale-98 cursor-pointer"
      >
        {loading
          ? (isAr ? '⏳ جارٍ إرسال الرسالة...' : isFr ? '⏳ Envoi en cours...' : '⏳ Sending...')
          : (isAr ? 'إرسال الرسالة إلى إدارة الجمعية ✓' : isFr ? 'Envoyer le message ✓' : 'Send Message to AMYCC ✓')}
      </button>
    </form>
  )
}

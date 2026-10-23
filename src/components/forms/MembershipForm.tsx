'use client'

import { useState } from 'react'
import { submitMembership, type ActionResponse } from '@/lib/actions/submissions'

export function MembershipForm({ locale }: { locale: string }) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ActionResponse | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    const form = e.currentTarget
    const formData = new FormData(form)
    try {
      const response = await submitMembership(formData)
      setResult(response)
      if (response.success) {
        form.reset()
      }
    } catch {
      setResult({
        success: false,
        message: locale === 'ar' ? 'حدث خطأ أثناء معالجة الطلب. يرجى المحاولة لاحقاً.' : 'An error occurred. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  const isAr = locale === 'ar'
  const isFr = locale === 'fr'

  const interestOptions = [
    { value: 'arts', label: isAr ? 'الفنون التشكيلية والرسم' : isFr ? 'Arts plastiques' : 'Visual Arts' },
    { value: 'music', label: isAr ? 'الموسيقى والتراث الصوتي' : isFr ? 'Musique et patrimoine' : 'Music & Heritage' },
    { value: 'theatre', label: isAr ? 'المسرح وفنون العرض' : isFr ? 'Théâtre et scène' : 'Theatre & Performing Arts' },
    { value: 'culture', label: isAr ? 'الثقافة والتراث المغربي' : isFr ? 'Culture et patrimoine' : 'Culture & Heritage' },
    { value: 'youth', label: isAr ? 'تمكين الشباب وصقل المهارات' : isFr ? 'Autonomisation des jeunes' : 'Youth Empowerment' },
    { value: 'volunteering', label: isAr ? 'التطوع والعمل المجتمعي' : isFr ? 'Bénévolat communautaire' : 'Community Volunteering' },
  ]

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
          {result.success && (
            <p className="text-3xs font-medium text-emerald-700 mt-1">
              {isAr
                ? 'تم تسجيل طلب انخراطكم بنجاح. سيقوم مكتب الجمعية بمراجعة الطلب وموافاتكم بالقرار.'
                : 'Your application has been received. Our board will review it according to association bylaws.'}
            </p>
          )}
        </div>
      )}

      {/* Full Name */}
      <div>
        <label className="block text-2xs font-bold uppercase tracking-wider text-[#08242a] mb-2">
          {isAr ? 'الاسم الكامل *' : isFr ? 'Nom complet *' : 'Full Name *'}
        </label>
        <input
          type="text"
          name="fullName"
          required
          className="w-full px-4 py-3 rounded-xl border border-[#e5e0d6] text-xs text-[#08242a] focus:border-[#0d3b43] focus:ring-1 focus:ring-[#0d3b43] outline-none"
          placeholder={isAr ? 'أدخل اسمك الكامل' : 'Enter your full name'}
        />
        {result?.errors?.fullName && (
          <p className="text-3xs text-red-600 mt-1">{result.errors.fullName[0]}</p>
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
            className="w-full px-4 py-3 rounded-xl border border-[#e5e0d6] text-xs text-[#08242a] focus:border-[#0d3b43] focus:ring-1 focus:ring-[#0d3b43] outline-none"
            placeholder="name@example.com"
          />
          {result?.errors?.email && (
            <p className="text-3xs text-red-600 mt-1">{result.errors.email[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-2xs font-bold uppercase tracking-wider text-[#08242a] mb-2">
            {isAr ? 'رقم الهاتف *' : isFr ? 'Téléphone *' : 'Phone *'}
          </label>
          <input
            type="tel"
            name="phone"
            required
            className="w-full px-4 py-3 rounded-xl border border-[#e5e0d6] text-xs text-[#08242a] focus:border-[#0d3b43] focus:ring-1 focus:ring-[#0d3b43] outline-none"
            placeholder="+212 6..."
          />
          {result?.errors?.phone && (
            <p className="text-3xs text-red-600 mt-1">{result.errors.phone[0]}</p>
          )}
        </div>
      </div>

      {/* City & Profession */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-2xs font-bold uppercase tracking-wider text-[#08242a] mb-2">
            {isAr ? 'المدينة / الإقامة *' : isFr ? 'Ville *' : 'City *'}
          </label>
          <input
            type="text"
            name="city"
            required
            className="w-full px-4 py-3 rounded-xl border border-[#e5e0d6] text-xs text-[#08242a] focus:border-[#0d3b43] focus:ring-1 focus:ring-[#0d3b43] outline-none"
            placeholder={isAr ? 'مثال: الرباط، الدار البيضاء...' : 'City in Morocco'}
          />
          {result?.errors?.city && (
            <p className="text-3xs text-red-600 mt-1">{result.errors.city[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-2xs font-bold uppercase tracking-wider text-[#08242a] mb-2">
            {isAr ? 'المهنة أو الصفة' : isFr ? 'Profession / Statut' : 'Profession / Status'}
          </label>
          <input
            type="text"
            name="profession"
            className="w-full px-4 py-3 rounded-xl border border-[#e5e0d6] text-xs text-[#08242a] focus:border-[#0d3b43] focus:ring-1 focus:ring-[#0d3b43] outline-none"
            placeholder={isAr ? 'طالب، فنان، أستاذ...' : 'Student, Artist, Professional...'}
          />
        </div>
      </div>

      {/* Interests Checkboxes */}
      <div>
        <label className="block text-2xs font-bold uppercase tracking-wider text-[#08242a] mb-2">
          {isAr ? 'مجالات الاهتمام الثقافي والفني:' : 'Areas of Cultural Interest:'}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {interestOptions.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2.5 p-3 rounded-xl border border-[#e5e0d6] bg-[#faf7f2] hover:bg-white cursor-pointer text-xs transition-colors"
            >
              <input
                type="checkbox"
                name="interests"
                value={opt.value}
                className="w-4 h-4 text-[#0d3b43] rounded border-[#cfc7b9] focus:ring-[#0d3b43]"
              />
              <span className="font-semibold text-[#08242a]">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Motivation */}
      <div>
        <label className="block text-2xs font-bold uppercase tracking-wider text-[#08242a] mb-2">
          {isAr ? 'دوافع الانخراط ورسالتك إلى الجمعية *' : 'Motivation to Join AMYCC *'}
        </label>
        <textarea
          name="motivation"
          required
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-[#e5e0d6] text-xs text-[#08242a] focus:border-[#0d3b43] focus:ring-1 focus:ring-[#0d3b43] outline-none"
          placeholder={isAr ? 'اذكر بإيجاز دوافعك للانخراط وما تأمل في تحقيقه أو المساهمة به...' : 'Describe your motivation and what you hope to contribute...'}
        />
        {result?.errors?.motivation && (
          <p className="text-3xs text-red-600 mt-1">{result.errors.motivation[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-[#0d3b43] hover:bg-[#14505b] disabled:opacity-60 transition-all text-xs shadow-md active:scale-98"
      >
        {loading
          ? (isAr ? 'جارٍ إرسال الطلب...' : isFr ? 'Envoi en cours...' : 'Submitting application...')
          : (isAr ? 'إرسال طلب الانخراط الرسمي ✓' : isFr ? 'Soumettre ma demande d\'adhésion ✓' : 'Submit Membership Application ✓')}
      </button>
    </form>
  )
}

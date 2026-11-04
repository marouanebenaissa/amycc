'use client'

import { useState } from 'react'
import { submitSupportInquiry, type ActionResponse } from '@/lib/actions/submissions'

export function SupportForm({ locale }: { locale: string }) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ActionResponse | null>(null)

  const isAr = locale === 'ar'
  const isFr = locale === 'fr'

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    const form = e.currentTarget
    const formData = new FormData(form)
    try {
      const response = await submitSupportInquiry(formData)
      setResult(response)
      if (response.success) {
        form.reset()
      }
    } catch {
      setResult({
        success: false,
        message: isAr
          ? 'حدث خطأ في الإرسال. يرجى المحاولة لاحقاً.'
          : isFr
          ? 'Une erreur est survenue lors de l’envoi. Veuillez réessayer plus tard.'
          : 'An error occurred. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

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
                ? 'شكراً لدعمكم مسيرتنا الثقافية. سيتواصل معكم أمين مال الجمعية لتنسيق إجراءات المساهمة رسمياً.'
                : isFr
                ? 'Merci pour votre engagement à nos côtés. Le trésorier de l’association prendra contact avec vous pour formaliser ce soutien.'
                : 'Thank you for supporting our cultural journey. Our finance officer will contact you shortly.'}
            </p>
          )}
        </div>
      )}

      {/* Support Type */}
      <div>
        <label className="block text-2xs font-bold uppercase tracking-wider text-[#231f20] mb-2">
          {isAr ? 'نوع الدعم أو المساهمة المقترحة *' : isFr ? 'Type de soutien ou contribution *' : 'Type of Support *'}
        </label>
        <select
          name="supportType"
          required
          className="w-full px-4 py-3 rounded-xl border border-[#e5e0d6] text-xs text-[#231f20] bg-[#FAF8F5] font-semibold focus:border-[#231f20] outline-none"
        >
          <option value="financial">
            {isAr
              ? 'دعم مالي أو مساهمة في التسيير'
              : isFr
              ? 'Soutien financier / Contribution aux activités'
              : 'Financial Support / Contribution'}
          </option>
          <option value="in_kind">
            {isAr
              ? 'مساهمة عينية أو لوجستية'
              : isFr
              ? 'Contribution en nature ou logistique'
              : 'In-Kind Contribution'}
          </option>
          <option value="sponsorship">
            {isAr
              ? 'رعاية فعالية أو برنامج ثقافي محدد'
              : isFr
              ? 'Mécénat / Parrainage d’un programme culturel'
              : 'Event / Program Sponsorship'}
          </option>
          <option value="equipment">
            {isAr
              ? 'تجهيزات ومعدات فنية أو موسيقية'
              : isFr
              ? 'Équipements scéniques, artistiques ou sonores'
              : 'Artistic & Sound Equipment'}
          </option>
          <option value="venue">
            {isAr
              ? 'توفير فضاء أو قاعة للعروض والورش'
              : isFr
              ? 'Mise à disposition d’une salle ou d’un espace'
              : 'Venue / Exhibition Space Hosting'}
          </option>
        </select>
      </div>

      {/* Donor / Organization Name & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-2xs font-bold uppercase tracking-wider text-[#231f20] mb-2">
            {isAr ? 'اسم الداعم أو المؤسسة *' : isFr ? 'Nom du donateur / Organisme *' : 'Name of Supporter / Org *'}
          </label>
          <input
            type="text"
            name="donorName"
            required
            className="w-full px-4 py-3 rounded-xl border border-[#e5e0d6] text-xs text-[#231f20] focus:border-[#231f20] focus:ring-1 focus:ring-[#231f20] outline-none"
            placeholder={
              isAr
                ? 'الاسم الشخصي أو اسم المؤسسة'
                : isFr
                ? 'Nom complet ou raison sociale'
                : 'Individual or Organization'
            }
          />
          {result?.errors?.donorName && (
            <p className="text-3xs text-red-600 mt-1">{result.errors.donorName[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-2xs font-bold uppercase tracking-wider text-[#231f20] mb-2">
            {isAr ? 'البريد الإلكتروني *' : isFr ? 'Adresse e-mail *' : 'Email Address *'}
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full px-4 py-3 rounded-xl border border-[#e5e0d6] text-xs text-[#231f20] focus:border-[#231f20] focus:ring-1 focus:ring-[#231f20] outline-none"
            placeholder="name@example.com"
          />
          {result?.errors?.email && (
            <p className="text-3xs text-red-600 mt-1">{result.errors.email[0]}</p>
          )}
        </div>
      </div>

      {/* Phone & City */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-2xs font-bold uppercase tracking-wider text-[#231f20] mb-2">
            {isAr ? 'رقم الهاتف' : isFr ? 'Téléphone' : 'Phone'}
          </label>
          <input
            type="tel"
            name="phone"
            className="w-full px-4 py-3 rounded-xl border border-[#e5e0d6] text-xs text-[#231f20] focus:border-[#231f20] focus:ring-1 focus:ring-[#231f20] outline-none"
            placeholder="+212 6..."
          />
        </div>

        <div>
          <label className="block text-2xs font-bold uppercase tracking-wider text-[#231f20] mb-2">
            {isAr ? 'المدينة / الدولة' : isFr ? 'Ville / Pays' : 'City / Country'}
          </label>
          <input
            type="text"
            name="city"
            className="w-full px-4 py-3 rounded-xl border border-[#e5e0d6] text-xs text-[#231f20] focus:border-[#231f20] focus:ring-1 focus:ring-[#231f20] outline-none"
            placeholder={isAr ? 'مثال: الرباط، المغرب' : isFr ? 'Ex : Rabat, Maroc' : 'e.g. Rabat, Morocco'}
          />
        </div>
      </div>

      {/* Message & Scope of Support */}
      <div>
        <label className="block text-2xs font-bold uppercase tracking-wider text-[#231f20] mb-2">
          {isAr
            ? 'تفاصيل المبادرة أو المساهمة المقترحة *'
            : isFr
            ? 'Détails de l’initiative ou du soutien proposé *'
            : 'Details of Support or Contribution *'}
        </label>
        <textarea
          name="message"
          required
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-[#e5e0d6] text-xs text-[#231f20] focus:border-[#231f20] focus:ring-1 focus:ring-[#231f20] outline-none"
          placeholder={
            isAr
              ? 'وضح طبيعة الدعم، القيمة التقديرية، أو الكيفية التي ترغب بالمساهمة بها...'
              : isFr
              ? 'Précisez la nature du soutien, sa valeur estimative et les modalités envisagées...'
              : 'Describe the proposed support or contribution...'
          }
        />
        {result?.errors?.message && (
          <p className="text-3xs text-red-600 mt-1">{result.errors.message[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-[#231f20] hover:bg-[#d2a82b] disabled:opacity-60 transition-all text-xs shadow-md active:scale-98"
      >
        {loading
          ? isAr
            ? 'جارٍ تسجيل الإشعار...'
            : isFr
            ? 'Envoi en cours...'
            : 'Submitting inquiry...'
          : isAr
          ? 'إرسال إشعار الدعم والمساهمة ✓'
          : isFr
          ? 'Envoyer la proposition de soutien ✓'
          : 'Submit Support Notification ✓'}
      </button>
    </form>
  )
}

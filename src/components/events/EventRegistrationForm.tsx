'use client'

import { useState } from 'react'
import { submitEventRegistration } from '@/lib/actions/submissions'

interface EventRegistrationFormProps {
  eventId: string
  eventTitle: string
  registrationOpen: boolean
  locale: string
}

export function EventRegistrationForm({
  eventId,
  eventTitle,
  registrationOpen,
  locale,
}: EventRegistrationFormProps) {
  const [isPending, setIsPending] = useState(false)
  const [response, setResponse] = useState<{
    success: boolean
    message: string
  } | null>(null)
  const [ticketRef, setTicketRef] = useState<string>('')

  const isAr = locale === 'ar'
  const isFr = locale === 'fr'

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    setResponse(null)

    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      const res = await submitEventRegistration(formData)
      setResponse(res)
      if (res.success) {
        const randomRef = Math.random().toString(36).substring(2, 8).toUpperCase()
        setTicketRef(`#AMYCC-EVT-${randomRef}`)
        form.reset()
      }
    } catch {
      setResponse({
        success: false,
        message: isAr
          ? 'حدث خطأ غير متوقع أثناء إرسال طلب التسجيل. يرجى إعادة المحاولة.'
          : isFr
          ? 'Une erreur inattendue est survenue. Veuillez réessayer.'
          : 'An unexpected error occurred. Please try again.',
      })
    } finally {
      setIsPending(false)
    }
  }

  if (!registrationOpen) {
    return (
      <div className="bg-[#FAF8F5] rounded-3xl border border-[#e5e0d6] p-6 sm:p-8 text-center space-y-3 shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-slate-200 text-slate-600 flex items-center justify-center mx-auto text-xl">
          🔒
        </div>
        <h3 className="text-sm sm:text-base font-extrabold text-[#231f20]">
          {isAr
            ? 'باب التسجيل مغلق حالياً'
            : isFr
            ? 'Inscriptions actuellement closes'
            : 'Registration is Currently Closed'}
        </h3>
        <p className="text-2xs sm:text-xs text-[#5C5A55] leading-relaxed">
          {isAr
            ? 'تم إغلاق حجز المقاعد لهذه الفعالية لاكتمال الطاقة الاستيعابية أو انتهاء المهلة المحددة. للاستفسار يرجى التواصل مع إدارة الجمعية.'
            : isFr
            ? 'Les réservations pour cet événement sont closes. Pour toute question, veuillez contacter l’association.'
            : 'Seat reservations for this event are currently closed. For inquiries, please contact the association.'}
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl border border-[#e5e0d6] p-6 sm:p-8 shadow-card relative overflow-hidden">
      {/* Decorative accent top strip */}
      <div className="absolute top-0 start-0 end-0 h-1.5 bg-gradient-to-r from-[#231f20] via-[#bd3227] to-[#231f20]" />

      <div className="mb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-3xs font-extrabold bg-[#F4EFE6] text-[#bd3227] mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#bd3227] animate-pulse" />
          <span>{isAr ? 'تأكيد الحجز والتسجيل' : isFr ? 'Réservation & Enregistrement' : 'Direct Registration'}</span>
        </span>
        <h3 className="text-base sm:text-lg font-black text-[#231f20] leading-snug">
          {isAr
            ? `حجز مقعد لحضور: ${eventTitle}`
            : isFr
            ? `Réservation pour : ${eventTitle}`
            : `Seat reservation for: ${eventTitle}`}
        </h3>
        <p className="text-3xs sm:text-2xs text-[#5C5A55] mt-1">
          {isAr
            ? 'املأ البيانات التالية لتأكيد حجز مقعدك واستلام دعوتك الرسمية فوراً عبر البريد الإلكتروني.'
            : isFr
            ? 'Remplissez vos informations pour confirmer votre place et recevoir votre invitation officielle par e-mail.'
            : 'Fill in your details to confirm your seat and receive your official invitation ticket by email.'}
        </p>
      </div>

      {response && (
        <div
          className={`p-4 rounded-2xl mb-6 text-xs font-bold border transition-all ${
            response.success
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-base">{response.success ? '✅' : '⚠️'}</span>
            <span>{response.message}</span>
          </div>

          {response.success && ticketRef && (
            <div className="mt-3 pt-3 border-t border-emerald-200/60 flex items-center justify-between text-2xs">
              <span className="font-semibold text-emerald-700">
                {isAr ? 'رقم التذكرة المرجعي:' : 'Ticket Reference:'}
              </span>
              <span className="font-mono font-black bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-md">
                {ticketRef}
              </span>
            </div>
          )}

          {response.success && (
            <div className="mt-2 text-3xs text-emerald-700 font-medium">
              ✉️ {isAr
                ? 'تم إرسال تذكرة وتأكيد الحجز إلى بريدك الإلكتروني بنجاح.'
                : isFr
                ? 'Votre invitation et billet de confirmation ont été envoyés à votre adresse e-mail.'
                : 'Your confirmation ticket has been dispatched to your email address.'}
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="hidden" name="eventId" value={eventId} />

        <div>
          <label className="block text-2xs font-extrabold text-[#231f20] mb-1.5">
            {isAr ? 'الاسم الكامل *' : isFr ? 'Nom complet *' : 'Full Name *'}
          </label>
          <input
            type="text"
            name="fullName"
            required
            placeholder={isAr ? 'مثال: محمد الإدريسي' : isFr ? 'Ex: Mohamed El Idrissi' : 'e.g. John Doe'}
            className="w-full px-4 py-3 rounded-xl border border-[#e5e0d6] text-xs focus:border-[#231f20] focus:ring-2 focus:ring-[#231f20]/20 outline-none transition-all placeholder:text-[#5C5A55]"
          />
        </div>

        <div>
          <label className="block text-2xs font-extrabold text-[#231f20] mb-1.5">
            {isAr ? 'البريد الإلكتروني *' : isFr ? 'Adresse e-mail *' : 'Email Address *'}
          </label>
          <input
            type="email"
            name="email"
            required
            placeholder="example@domain.com"
            className="w-full px-4 py-3 rounded-xl border border-[#e5e0d6] text-xs focus:border-[#231f20] focus:ring-2 focus:ring-[#231f20]/20 outline-none transition-all placeholder:text-[#5C5A55]"
          />
          <p className="text-3xs text-[#5C5A55] mt-1">
            {isAr
              ? 'سنرسل تذكرة الدخول والدعوة إلى هذا البريد'
              : 'Your invitation ticket will be delivered to this email'}
          </p>
        </div>

        <div>
          <label className="block text-2xs font-extrabold text-[#231f20] mb-1.5">
            {isAr ? 'رقم الهاتف (اختياري للتذكير)' : isFr ? 'Téléphone (optionnel)' : 'Phone (optional)'}
          </label>
          <input
            type="tel"
            name="phone"
            placeholder="+212 6..."
            className="w-full px-4 py-3 rounded-xl border border-[#e5e0d6] text-xs focus:border-[#231f20] focus:ring-2 focus:ring-[#231f20]/20 outline-none transition-all placeholder:text-[#5C5A55]"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3.5 px-6 rounded-xl font-black text-white bg-[#231f20] hover:bg-[#231f20] active:scale-98 disabled:opacity-50 transition-all text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{isPending ? '⏳' : '🎟️'}</span>
            <span>
              {isPending
                ? isAr
                  ? 'جارٍ تأكيد التسجيل...'
                  : 'Processing registration...'
                : isAr
                ? 'تأكيد حجز مقعدك الآن ✓'
                : 'Confirm Reservation ✓'}
            </span>
          </button>
        </div>
      </form>

      {/* Confirmation & ticket note */}
      <div className="mt-5 pt-5 border-t border-[#E5E0D6] flex items-center justify-between text-3xs text-[#5C5A55]">
        <span className="flex items-center gap-1 font-bold text-[#231f20]">
          <span>🎟️</span>
          <span>{isAr ? 'تأكيد فوري لحجز المقعد' : isFr ? 'Confirmation immédiate' : 'Instant Confirmation'}</span>
        </span>
        <span className="text-[#5C5A55] font-medium">
          {isAr ? 'تذكرة رقمية رسمية' : isFr ? 'Billet numérique' : 'Official Digital Pass'}
        </span>
      </div>
    </div>
  )
}

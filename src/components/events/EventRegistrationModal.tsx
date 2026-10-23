'use client'

import { useState } from 'react'
import { submitEventRegistration } from '@/lib/actions/submissions'

interface EventRegistrationModalProps {
  eventId: string
  eventTitle: string
  eventDate?: string
  eventVenue?: string
  locale: string
  buttonLabel?: string
  className?: string
}

export function EventRegistrationModal({
  eventId,
  eventTitle,
  eventDate,
  eventVenue,
  locale,
  buttonLabel,
  className = '',
}: EventRegistrationModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [response, setResponse] = useState<{ success: boolean; message: string } | null>(null)

  const isAr = locale === 'ar'
  const isFr = locale === 'fr'

  const defaultBtnLabel = buttonLabel || (isAr ? 'حجز مقعد / تسجيل الحضور' : isFr ? 'S\'inscrire à l\'événement' : 'Register for Event')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    setResponse(null)

    const formData = new FormData(e.currentTarget)
    try {
      const res = await submitEventRegistration(formData)
      setResponse(res)
    } catch {
      setResponse({
        success: false,
        message: isAr
          ? 'حدث خطأ أثناء إرسال التسجيل. يرجى المحاولة مرة أخرى.'
          : 'An error occurred during registration. Please try again.',
      })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={className || "px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0d3b43] hover:bg-[#14505b] active:scale-95 transition-all shadow-subtle inline-flex items-center gap-1.5"}
      >
        <span>🎟️</span>
        <span>{defaultBtnLabel}</span>
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#e5e0d6] shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => {
                setIsOpen(false)
                setResponse(null)
              }}
              className="absolute top-5 end-5 w-8 h-8 rounded-full bg-[#faf7f2] hover:bg-[#f4ede2] text-[#08242a] flex items-center justify-center font-bold text-sm transition-colors"
              aria-label="Close"
            >
              ✕
            </button>

            {/* Header */}
            <div className="mb-6">
              <span className="text-3xs font-extrabold uppercase tracking-wider text-[#c85a32] block mb-1">
                {isAr ? 'تسجيل مباشر للفعالية' : isFr ? 'Inscription à l\'événement' : 'Event Registration'}
              </span>
              <h3 className="text-xl font-black text-[#08242a] leading-tight">
                {eventTitle}
              </h3>
              {(eventDate || eventVenue) && (
                <div className="flex flex-wrap gap-2 text-2xs text-[#5f7174] mt-2">
                  {eventDate && <span>📅 {eventDate}</span>}
                  {eventVenue && <span>📍 {eventVenue}</span>}
                </div>
              )}
            </div>

            {/* Feedback Message */}
            {response && (
              <div
                className={`p-4 rounded-2xl mb-6 text-xs font-bold border ${
                  response.success
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-red-50 text-red-800 border-red-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{response.success ? '✅' : '⚠️'}</span>
                  <span>{response.message}</span>
                </div>
                {response.success && (
                  <p className="text-3xs font-medium text-emerald-700 mt-1">
                    {isAr
                      ? 'تم تسجيل مقعدك بنجاح في سجلات الجمعية. سنوافيك بالتفاصيل عبر بريدك الإلكتروني.'
                      : 'Your registration has been confirmed. Details will be delivered to your email.'}
                  </p>
                )}
              </div>
            )}

            {/* Form */}
            {!response?.success ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="hidden" name="eventId" value={eventId} />

                <div>
                  <label className="block text-2xs font-bold text-[#08242a] mb-1">
                    {isAr ? 'الاسم الكامل *' : isFr ? 'Nom complet *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder={isAr ? 'مثال: محمد العلوي' : 'e.g. John Doe'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e0d6] text-xs focus:border-[#0d3b43] focus:ring-1 focus:ring-[#0d3b43] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-[#08242a] mb-1">
                    {isAr ? 'البريد الإلكتروني *' : isFr ? 'Adresse e-mail *' : 'Email Address *'}
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e0d6] text-xs focus:border-[#0d3b43] focus:ring-1 focus:ring-[#0d3b43] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-[#08242a] mb-1">
                    {isAr ? 'رقم الهاتف (اختياري للتذكير عبر الرسائل)' : isFr ? 'Téléphone (optionnel)' : 'Phone Number (optional)'}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+212 6..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e0d6] text-xs focus:border-[#0d3b43] focus:ring-1 focus:ring-[#0d3b43] outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full py-3 px-4 rounded-xl font-bold text-white bg-[#0d3b43] hover:bg-[#14505b] disabled:opacity-50 transition-all text-xs shadow-md"
                  >
                    {isPending
                      ? (isAr ? 'جارٍ تأكيد الحجز...' : 'Processing registration...')
                      : (isAr ? 'تأكيد التسجيل الآن ✓' : 'Confirm Registration ✓')}
                  </button>
                </div>
              </form>
            ) : (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-[#08242a] bg-[#faf7f2] hover:bg-[#f4ede2] border border-[#e5e0d6] text-xs"
                >
                  {isAr ? 'إغلاق النافذة' : 'Close'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

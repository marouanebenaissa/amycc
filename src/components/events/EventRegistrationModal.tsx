'use client'

import { useState } from 'react'
import { submitEventRegistration } from '@/lib/actions/submissions'
import { Flaticon } from '@/components/ui/Flaticon'

interface EventRegistrationModalProps {
  eventId: string
  eventTitle: string
  eventDescription?: string
  eventDate?: string
  eventVenue?: string
  locale: string
  buttonLabel?: string
  className?: string
}

export function EventRegistrationModal({
  eventId,
  eventTitle,
  eventDescription,
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
        className={className || "px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#231f20] hover:bg-[#d2a82b] active:scale-95 transition-all shadow-subtle inline-flex items-center gap-2"}
      >
        <Flaticon name="ticket" size={14} className="shrink-0" />
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
              className="absolute top-5 end-5 w-8 h-8 rounded-full bg-[#FAF8F5] hover:bg-[#F4EFE6] text-[#231f20] flex items-center justify-center font-bold text-sm transition-colors"
              aria-label="Close"
            >
              ✕
            </button>

            {/* Header */}
            <div className="mb-6">
              <span className="text-3xs font-extrabold uppercase tracking-wider text-[#bd3227] block mb-1">
                {isAr ? 'تسجيل مباشر للفعالية' : isFr ? 'Inscription à l\'événement' : 'Event Registration'}
              </span>
              <h3 className="text-xl font-black text-[#231f20] leading-tight">
                {eventTitle}
              </h3>
              {(eventDate || eventVenue) && (
                <div className="flex flex-wrap gap-2 text-2xs text-[#5C5A55] mt-2">
                  {eventDate && (
                    <span className="flex items-center gap-1 bg-[#FAF8F5] px-2.5 py-1 rounded-lg border border-[#e5e0d6]">
                      <Flaticon name="calendar" size={12} className="text-[#bd3227] shrink-0" />
                      <span>{eventDate}</span>
                    </span>
                  )}
                  {eventVenue && (
                    <span className="flex items-center gap-1 bg-[#FAF8F5] px-2.5 py-1 rounded-lg border border-[#e5e0d6]">
                      <Flaticon name="pin" size={12} className="text-[#bd3227] shrink-0" />
                      <span>{eventVenue}</span>
                    </span>
                  )}
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
                  <Flaticon
                    name={response.success ? 'check' : 'alert-circle'}
                    size={16}
                    className={response.success ? 'text-emerald-600' : 'text-red-600'}
                  />
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
                  <label className="block text-2xs font-bold text-[#231f20] mb-1">
                    {isAr ? 'الاسم الكامل *' : isFr ? 'Nom complet *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder={isAr ? 'مثال: محمد العلوي' : 'e.g. John Doe'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e0d6] text-xs focus:border-[#231f20] focus:ring-1 focus:ring-[#231f20] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-[#231f20] mb-1">
                    {isAr ? 'البريد الإلكتروني *' : isFr ? 'Adresse e-mail *' : 'Email Address *'}
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e0d6] text-xs focus:border-[#231f20] focus:ring-1 focus:ring-[#231f20] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-[#231f20] mb-1">
                    {isAr ? 'رقم الهاتف (اختياري للتذكير عبر الرسائل)' : isFr ? 'Téléphone (optionnel)' : 'Phone Number (optional)'}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+212 6..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e0d6] text-xs focus:border-[#231f20] focus:ring-1 focus:ring-[#231f20] outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full py-3 px-4 rounded-xl font-bold text-white bg-[#231f20] hover:bg-[#d2a82b] disabled:opacity-50 transition-all text-xs shadow-md flex items-center justify-center gap-2"
                  >
                    {isPending ? (
                      <span>{isAr ? 'جارٍ تأكيد الحجز...' : 'Processing registration...'}</span>
                    ) : (
                      <>
                        <Flaticon name="check" size={14} className="shrink-0" />
                        <span>{isAr ? 'تأكيد التسجيل الآن' : 'Confirm Registration'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : null}

            {/* Close Button / Bottom Confirmation */}
            {response?.success && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-[#231f20] bg-[#FAF8F5] hover:bg-[#F4EFE6] border border-[#e5e0d6] text-xs transition-colors"
                >
                  {isAr ? 'إغلاق النافذة' : 'Close'}
                </button>
              </div>
            )}

            {/* Event Article & Details Overview below registration area */}
            <div className="mt-8 pt-6 border-t border-[#E5E0D6] space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-[#bd3227] rounded-full" />
                <h4 className="text-xs sm:text-sm font-black text-[#231f20]">
                  {isAr ? 'تفاصيل ومقال الفعالية' : isFr ? 'À propos de l\'événement' : 'About the Event'}
                </h4>
              </div>

              {eventDescription ? (
                <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#e5e0d6] text-xs leading-relaxed text-[#5C5A55] whitespace-pre-line font-medium">
                  {eventDescription}
                </div>
              ) : (
                <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#e5e0d6] text-xs leading-relaxed text-[#5C5A55]">
                  {isAr
                    ? 'فعالية ثقافية وفنية مميزة تنظمها جمعية روح الفنون والثقافة لتشجيع المواهب الصاعدة وتعزيز الحراك الثقافي المجتمعي.'
                    : 'A cultural and artistic event organized by AMYCC to foster emerging talents and cultural engagement.'}
                </div>
              )}

              {/* Key Highlights Card */}
              <div className="grid grid-cols-2 gap-3 text-3xs sm:text-2xs">
                <div className="p-3 rounded-xl bg-white border border-[#e5e0d6] flex items-center gap-2.5">
                  <Flaticon name="ticket" size={20} className="text-[#bd3227] shrink-0" />
                  <div>
                    <span className="font-black text-[#231f20] block">
                      {isAr ? 'تأكيد الحجز المباشر' : isFr ? 'Réservation confirmée' : 'Direct Booking'}
                    </span>
                    <span className="text-[#5C5A55]">
                      {isAr ? 'حسب الفعالية' : isFr ? 'Selon l\'événement' : 'Per event terms'}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-[#e5e0d6] flex items-center gap-2.5">
                  <Flaticon name="mail" size={20} className="text-[#d2a82b] shrink-0" />
                  <div>
                    <span className="font-black text-[#231f20] block">
                      {isAr ? 'تأكيد ودعوة رسمية' : isFr ? 'Invitation par e-mail' : 'Email Invitation'}
                    </span>
                    <span className="text-[#5C5A55] font-medium text-3xs">
                      {isAr ? 'تذكرة إلكترونية رسمية' : isFr ? 'Billet électronique' : 'Official E-Ticket'}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-3xs text-[#5C5A55] text-center pt-1 font-medium flex items-center justify-center gap-1.5">
                <Flaticon name="pin" size={12} className="text-[#bd3227] shrink-0" />
                <span>
                  {isAr
                    ? 'يرجى الحضور قبل الموعد بـ 15 دقيقة وإبراز رمز التأكيد لدى مكتب الاستقبال.'
                    : 'Please arrive 15 minutes before the start time and present your ticket reference at check-in.'}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

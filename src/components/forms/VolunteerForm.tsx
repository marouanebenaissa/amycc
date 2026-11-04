'use client'

import { useState } from 'react'
import { submitVolunteer, type ActionResponse } from '@/lib/actions/submissions'

export function VolunteerForm({ locale }: { locale: string }) {
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
      const response = await submitVolunteer(formData)
      setResult(response)
      if (response.success) {
        form.reset()
      }
    } catch {
      setResult({
        success: false,
        message: isAr
          ? 'حدث خطأ أثناء معالجة الطلب. يرجى المحاولة لاحقاً.'
          : isFr
          ? 'Une erreur est survenue lors de l’envoi. Veuillez réessayer plus tard.'
          : 'An error occurred. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  const interestOptions = [
    {
      value: 'cultural_events',
      label: isAr
        ? 'تنظيم وتنسيق التظاهرات الفنية'
        : isFr
        ? 'Organisation d’événements'
        : 'Event Coordination',
    },
    {
      value: 'workshop_assistant',
      label: isAr
        ? 'المساعدة في تأطير الورش التدريبية'
        : isFr
        ? 'Assistance aux ateliers'
        : 'Workshop Facilitation',
    },
    {
      value: 'media_photography',
      label: isAr
        ? 'التصوير الفوتوغرافي وصناعة المحتوى'
        : isFr
        ? 'Photographie & Médias'
        : 'Media & Photography',
    },
    {
      value: 'reception_logistics',
      label: isAr
        ? 'الاستقبال واللوجستيك الميداني'
        : isFr
        ? 'Accueil & Logistique'
        : 'Reception & Logistics',
    },
    {
      value: 'translation_comms',
      label: isAr
        ? 'الترجمة والتواصل اللغوي'
        : isFr
        ? 'Traduction & Communication'
        : 'Translation & Communications',
    },
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
                ? 'مرحباً بك في مبادرة شباب في العمل! سيتواصل معك منسق المبادرة لتحديد موعد اللقاء التوجيهي.'
                : isFr
                ? 'Bienvenue dans l’initiative Jeunesse en Action ! Notre coordinateur vous contactera pour convenir d’une séance d’orientation.'
                : 'Welcome to Youth in Action! Our coordinator will contact you for orientation.'}
            </p>
          )}
        </div>
      )}

      {/* Hidden initiative field */}
      <input type="hidden" name="initiative" value="Youth in Action" />

      {/* Full Name */}
      <div>
        <label className="block text-2xs font-bold uppercase tracking-wider text-[#231f20] mb-2">
          {isAr ? 'الاسم الكامل *' : isFr ? 'Nom complet *' : 'Full Name *'}
        </label>
        <input
          type="text"
          name="fullName"
          required
          className="w-full px-4 py-3 rounded-xl border border-[#e5e0d6] text-xs text-[#231f20] focus:border-[#231f20] focus:ring-1 focus:ring-[#231f20] outline-none"
          placeholder={isAr ? 'الاسم والنسب' : isFr ? 'Votre nom et prénom' : 'Your full name'}
        />
        {result?.errors?.fullName && (
          <p className="text-3xs text-red-600 mt-1">{result.errors.fullName[0]}</p>
        )}
      </div>

      {/* Email & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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

        <div>
          <label className="block text-2xs font-bold uppercase tracking-wider text-[#231f20] mb-2">
            {isAr ? 'رقم الهاتف (للتواصل السريع) *' : isFr ? 'Téléphone *' : 'Phone Number *'}
          </label>
          <input
            type="tel"
            name="phone"
            required
            className="w-full px-4 py-3 rounded-xl border border-[#e5e0d6] text-xs text-[#231f20] focus:border-[#231f20] focus:ring-1 focus:ring-[#231f20] outline-none"
            placeholder="+212 6..."
          />
          {result?.errors?.phone && (
            <p className="text-3xs text-red-600 mt-1">{result.errors.phone[0]}</p>
          )}
        </div>
      </div>

      {/* City & Availability */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-2xs font-bold uppercase tracking-wider text-[#231f20] mb-2">
            {isAr ? 'المدينة / الإقامة *' : isFr ? 'Ville de résidence *' : 'City *'}
          </label>
          <input
            type="text"
            name="city"
            required
            className="w-full px-4 py-3 rounded-xl border border-[#e5e0d6] text-xs text-[#231f20] focus:border-[#231f20] focus:ring-1 focus:ring-[#231f20] outline-none"
            placeholder={
              isAr
                ? 'مدينتك بالمغرب'
                : isFr
                ? 'Ex : Rabat, Casablanca, Fès...'
                : 'City in Morocco'
            }
          />
          {result?.errors?.city && (
            <p className="text-3xs text-red-600 mt-1">{result.errors.city[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-2xs font-bold uppercase tracking-wider text-[#231f20] mb-2">
            {isAr ? 'أوقات التفرغ للتطوع' : isFr ? 'Disponibilité' : 'Availability'}
          </label>
          <select
            name="availability"
            className="w-full px-4 py-3 rounded-xl border border-[#e5e0d6] text-xs text-[#231f20] bg-[#FAF8F5] font-semibold focus:border-[#231f20] outline-none"
          >
            <option value="weekends">
              {isAr
                ? 'عطلة نهاية الأسبوع (السبت والأحد)'
                : isFr
                ? 'Week-ends uniquement (samedi & dimanche)'
                : 'Weekends only'}
            </option>
            <option value="evenings">
              {isAr
                ? 'الفترة المسائية خلال الأسبوع'
                : isFr
                ? 'Soirées en semaine'
                : 'Weekday evenings'}
            </option>
            <option value="flexible">
              {isAr
                ? 'مرن حسب مواعيد الفعاليات'
                : isFr
                ? 'Horaires flexibles selon les événements'
                : 'Flexible based on events'}
            </option>
            <option value="full_time">
              {isAr
                ? 'تفرغ كامل للمشاريع الكبرى'
                : isFr
                ? 'Temps plein pour les grands projets'
                : 'Full-time for major projects'}
            </option>
          </select>
        </div>
      </div>

      {/* Areas of Interest in Volunteering */}
      <div>
        <label className="block text-2xs font-bold uppercase tracking-wider text-[#231f20] mb-2">
          {isAr
            ? 'المهام التطوعية المفضلة لديك:'
            : isFr
            ? 'Missions bénévoles souhaitées :'
            : 'Preferred Volunteer Roles:'}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {interestOptions.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2.5 p-3 rounded-xl border border-[#e5e0d6] bg-[#FAF8F5] hover:bg-white cursor-pointer text-xs transition-colors"
            >
              <input
                type="checkbox"
                name="interests"
                value={opt.value}
                className="w-4 h-4 text-[#231f20] rounded border-[#cfc7b9] focus:ring-[#231f20]"
              />
              <span className="font-semibold text-[#231f20]">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Skills & Experience */}
      <div>
        <label className="block text-2xs font-bold uppercase tracking-wider text-[#231f20] mb-2">
          {isAr
            ? 'المهارات والخبرات السابقة (إن وُجدت) *'
            : isFr
            ? 'Compétences et expériences préalables *'
            : 'Skills & Background *'}
        </label>
        <textarea
          name="skills"
          required
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-[#e5e0d6] text-xs text-[#231f20] focus:border-[#231f20] focus:ring-1 focus:ring-[#231f20] outline-none"
          placeholder={
            isAr
              ? 'اذكر مهاراتك (تصميم، تنظيم، تصوير، عزف، تواصل...) وتجاربك الجمعوية السابقة...'
              : isFr
              ? 'Décrivez vos compétences (gestion, photo, design, scène, logistique...) et expériences associatives...'
              : 'Mention your skills and relevant experiences...'
          }
        />
        {result?.errors?.skills && (
          <p className="text-3xs text-red-600 mt-1">{result.errors.skills[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 px-6 rounded-xl font-bold text-[#231f20] bg-[#ffd22f] hover:bg-[#ffd22f] disabled:opacity-60 transition-all text-xs shadow-md active:scale-98"
      >
        {loading
          ? isAr
            ? 'جارٍ تسجيل الطلب...'
            : isFr
            ? 'Envoi en cours...'
            : 'Submitting application...'
          : isAr
          ? 'الانضمام لمبادرة شباب في العمل كمتطوع ✓'
          : isFr
          ? 'Rejoindre Jeunesse en Action ✓'
          : 'Join Youth in Action as Volunteer ✓'}
      </button>
    </form>
  )
}

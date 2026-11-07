'use client'

import { useState } from 'react'
import { submitPartnership, type ActionResponse } from '@/lib/actions/submissions'
import { TurnstileCaptcha } from '@/components/ui/TurnstileCaptcha'

export function PartnershipForm({ locale }: { locale: string }) {
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
      const response = await submitPartnership(formData)
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
                ? 'تم استلام مقترح الشراكة بنجاح. سيتواصل معكم مسؤول العلاقات المؤسساتية بالجمعية لدراسة آفاق التعاون.'
                : isFr
                ? 'Votre proposition de partenariat a été transmise avec succès. Notre responsable des relations institutionnelles prendra contact avec vous.'
                : 'Your proposal has been received. Our partnership officer will contact you shortly.'}
            </p>
          )}
        </div>
      )}

      {/* Organization Name & Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-2xs font-bold uppercase tracking-wider text-[#231f20] mb-2">
            {isAr ? 'اسم المؤسسة أو الهيئة *' : isFr ? 'Nom de l’organisme *' : 'Organization Name *'}
          </label>
          <input
            type="text"
            name="organizationName"
            required
            className="w-full px-4 py-3 rounded-xl border border-[#e5e0d6] text-xs text-[#231f20] focus:border-[#231f20] focus:ring-1 focus:ring-[#231f20] outline-none"
            placeholder={
              isAr
                ? 'اسم المركز أو الشركة أو الجمعية'
                : isFr
                ? 'Nom de votre organisme ou structure'
                : 'Organization, Company or NGO Name'
            }
          />
          {result?.errors?.organizationName && (
            <p className="text-3xs text-red-600 mt-1">{result.errors.organizationName[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-2xs font-bold uppercase tracking-wider text-[#231f20] mb-2">
            {isAr ? 'نوع الهيئة *' : isFr ? 'Type de structure *' : 'Organization Type *'}
          </label>
          <select
            name="organizationType"
            required
            className="w-full px-4 py-3 rounded-xl border border-[#e5e0d6] text-xs text-[#231f20] bg-[#FAF8F5] font-semibold focus:border-[#231f20] outline-none"
          >
            <option value="cultural_center">
              {isAr
                ? 'مركز ثقافي / فضاء فني'
                : isFr
                ? 'Centre culturel / Espace artistique'
                : 'Cultural Center / Artistic Space'}
            </option>
            <option value="educational">
              {isAr
                ? 'مؤسسة تعليمية / مدرسة / جامعة'
                : isFr
                ? 'Établissement éducatif / Université'
                : 'Educational Institute / University'}
            </option>
            <option value="ngo">
              {isAr
                ? 'منظمة غير حكومية / جمعية'
                : isFr
                ? 'Organisation non gouvernementale / Association'
                : 'NGO / Civil Society Association'}
            </option>
            <option value="public_body">
              {isAr
                ? 'هيئة أو مؤسسة عمومية'
                : isFr
                ? 'Institution publique / Collectivité'
                : 'Public Entity / Government Agency'}
            </option>
            <option value="corporate">
              {isAr
                ? 'قطاع خاص / شركة راعية'
                : isFr
                ? 'Secteur privé / Entreprise mécène'
                : 'Private Sector / Sponsor'}
            </option>
          </select>
        </div>
      </div>

      {/* Contact Person & Position */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-2xs font-bold uppercase tracking-wider text-[#231f20] mb-2">
            {isAr ? 'اسم الشخص المسؤول *' : isFr ? 'Personne de contact *' : 'Contact Person *'}
          </label>
          <input
            type="text"
            name="contactPerson"
            required
            className="w-full px-4 py-3 rounded-xl border border-[#e5e0d6] text-xs text-[#231f20] focus:border-[#231f20] focus:ring-1 focus:ring-[#231f20] outline-none"
            placeholder={
              isAr
                ? 'الاسم الكامل والصفة أو المنصب'
                : isFr
                ? 'Nom complet et fonction'
                : 'Full Name and Position'
            }
          />
          {result?.errors?.contactPerson && (
            <p className="text-3xs text-red-600 mt-1">{result.errors.contactPerson[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-2xs font-bold uppercase tracking-wider text-[#231f20] mb-2">
            {isAr ? 'البريد المهني *' : isFr ? 'Email professionnel *' : 'Professional Email *'}
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full px-4 py-3 rounded-xl border border-[#e5e0d6] text-xs text-[#231f20] focus:border-[#231f20] focus:ring-1 focus:ring-[#231f20] outline-none"
            placeholder="contact@org.ma"
          />
          {result?.errors?.email && (
            <p className="text-3xs text-red-600 mt-1">{result.errors.email[0]}</p>
          )}
        </div>
      </div>

      {/* City & Country */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-2xs font-bold uppercase tracking-wider text-[#231f20] mb-2">
            {isAr ? 'المدينة *' : isFr ? 'Ville *' : 'City *'}
          </label>
          <input
            type="text"
            name="city"
            required
            className="w-full px-4 py-3 rounded-xl border border-[#e5e0d6] text-xs text-[#231f20] focus:border-[#231f20] focus:ring-1 focus:ring-[#231f20] outline-none"
            placeholder={
              isAr
                ? 'المدينة (مثال: الرباط، الدار البيضاء...)'
                : isFr
                ? 'Ex : Rabat, Casablanca, Marrakech...'
                : 'e.g. Rabat, Casablanca, Marrakech...'
            }
          />
          {result?.errors?.city && (
            <p className="text-3xs text-red-600 mt-1">{result.errors.city[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-2xs font-bold uppercase tracking-wider text-[#231f20] mb-2">
            {isAr ? 'الدولة *' : isFr ? 'Pays *' : 'Country *'}
          </label>
          <input
            type="text"
            name="country"
            required
            defaultValue={isAr ? 'المملكة المغربية' : isFr ? 'Maroc' : 'Morocco'}
            className="w-full px-4 py-3 rounded-xl border border-[#e5e0d6] text-xs text-[#231f20] focus:border-[#231f20] focus:ring-1 focus:ring-[#231f20] outline-none"
          />
        </div>
      </div>

      {/* Proposal Message */}
      <div>
        <label className="block text-2xs font-bold uppercase tracking-wider text-[#231f20] mb-2">
          {isAr
            ? 'تفاصيل مقترح الشراكة أو المبادرة المشتركة *'
            : isFr
            ? 'Détails de la proposition de partenariat *'
            : 'Partnership Proposal Details *'}
        </label>
        <textarea
          name="proposal"
          required
          rows={5}
          className="w-full px-4 py-3 rounded-xl border border-[#e5e0d6] text-xs text-[#231f20] focus:border-[#231f20] focus:ring-1 focus:ring-[#231f20] outline-none"
          placeholder={
            isAr
              ? 'وضح مجالات التعاون المقترحة، الفئات المستهدفة، والإطار الزمني المتوقع...'
              : isFr
              ? 'Précisez les axes de collaboration envisagés, les publics cibles et le calendrier prévisionnel...'
              : 'Describe the collaboration scope, objectives, target audiences, and anticipated timeline...'
          }
        />
        {result?.errors?.proposal && (
          <p className="text-3xs text-red-600 mt-1">{result.errors.proposal[0]}</p>
        )}
      </div>

      {/* Bot Verification / CAPTCHA */}
      <div className="pt-1">
        <TurnstileCaptcha locale={locale} />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-[#231f20] hover:bg-[#d2a82b] disabled:opacity-60 transition-all text-xs shadow-md active:scale-98"
      >
        {loading
          ? isAr
            ? 'جارٍ إرسال المقترح...'
            : isFr
            ? 'Envoi en cours...'
            : 'Submitting proposal...'
          : isAr
          ? 'إرسال مقترح الشراكة المؤسساتية ✓'
          : isFr
          ? 'Soumettre la proposition de partenariat ✓'
          : 'Submit Partnership Proposal ✓'}
      </button>
    </form>
  )
}

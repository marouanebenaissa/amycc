'use client'

import { useState } from 'react'
import { submitPartnership, type ActionResponse } from '@/lib/actions/submissions'

export function PartnershipForm({ locale }: { locale: string }) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ActionResponse | null>(null)

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
          {result.success && (
            <p className="text-3xs font-medium text-emerald-700 mt-1">
              {isAr
                ? 'تم استلام مقترح الشراكة بنجاح. سيتواصل معكم مسؤول العلاقات المؤسساتية بالجمعية لدراسة آفاق التعاون.'
                : 'Your proposal has been received. Our partnership officer will contact you shortly.'}
            </p>
          )}
        </div>
      )}

      {/* Organization Name & Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-2xs font-bold uppercase tracking-wider text-[#08242a] mb-2">
            {isAr ? 'اسم المؤسسة أو الهيئة *' : isFr ? 'Nom de l\'organisme *' : 'Organization Name *'}
          </label>
          <input
            type="text"
            name="organizationName"
            required
            className="w-full px-4 py-3 rounded-xl border border-[#e5e0d6] text-xs text-[#08242a] focus:border-[#0d3b43] focus:ring-1 focus:ring-[#0d3b43] outline-none"
            placeholder={isAr ? 'اسم المركز أو الشركة أو الجمعية' : 'Organization Name'}
          />
          {result?.errors?.organizationName && (
            <p className="text-3xs text-red-600 mt-1">{result.errors.organizationName[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-2xs font-bold uppercase tracking-wider text-[#08242a] mb-2">
            {isAr ? 'نوع الهيئة *' : isFr ? 'Type de structure *' : 'Organization Type *'}
          </label>
          <select
            name="organizationType"
            required
            className="w-full px-4 py-3 rounded-xl border border-[#e5e0d6] text-xs text-[#08242a] bg-[#faf7f2] font-semibold focus:border-[#0d3b43] outline-none"
          >
            <option value="cultural_center">{isAr ? 'مركز ثقافي / فضاء فني' : 'Cultural Center'}</option>
            <option value="educational">{isAr ? 'مؤسسة تعليمية / مدرسة / جامعة' : 'Educational Institute'}</option>
            <option value="ngo">{isAr ? 'منظمة غير حكومية / جمعية' : 'NGO / Association'}</option>
            <option value="public_body">{isAr ? 'هيئة أو مؤسسة عمومية' : 'Public Entity'}</option>
            <option value="corporate">{isAr ? 'قطاع خاص / شركة راعية' : 'Private Sector / Sponsor'}</option>
          </select>
        </div>
      </div>

      {/* Contact Person & Position */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-2xs font-bold uppercase tracking-wider text-[#08242a] mb-2">
            {isAr ? 'اسم الشخص المسؤول *' : isFr ? 'Personne de contact *' : 'Contact Person *'}
          </label>
          <input
            type="text"
            name="contactPerson"
            required
            className="w-full px-4 py-3 rounded-xl border border-[#e5e0d6] text-xs text-[#08242a] focus:border-[#0d3b43] focus:ring-1 focus:ring-[#0d3b43] outline-none"
            placeholder={isAr ? 'الاسم والصفة' : 'Full Name'}
          />
          {result?.errors?.contactPerson && (
            <p className="text-3xs text-red-600 mt-1">{result.errors.contactPerson[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-2xs font-bold uppercase tracking-wider text-[#08242a] mb-2">
            {isAr ? 'البريد المهني *' : isFr ? 'Email professionnel *' : 'Professional Email *'}
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full px-4 py-3 rounded-xl border border-[#e5e0d6] text-xs text-[#08242a] focus:border-[#0d3b43] focus:ring-1 focus:ring-[#0d3b43] outline-none"
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
          <label className="block text-2xs font-bold uppercase tracking-wider text-[#08242a] mb-2">
            {isAr ? 'المدينة *' : isFr ? 'Ville *' : 'City *'}
          </label>
          <input
            type="text"
            name="city"
            required
            className="w-full px-4 py-3 rounded-xl border border-[#e5e0d6] text-xs text-[#08242a] focus:border-[#0d3b43] focus:ring-1 focus:ring-[#0d3b43] outline-none"
            placeholder={isAr ? 'المدينة' : 'City'}
          />
          {result?.errors?.city && (
            <p className="text-3xs text-red-600 mt-1">{result.errors.city[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-2xs font-bold uppercase tracking-wider text-[#08242a] mb-2">
            {isAr ? 'الدولة *' : isFr ? 'Pays *' : 'Country *'}
          </label>
          <input
            type="text"
            name="country"
            required
            defaultValue={isAr ? 'المملكة المغربية' : 'Morocco'}
            className="w-full px-4 py-3 rounded-xl border border-[#e5e0d6] text-xs text-[#08242a] focus:border-[#0d3b43] focus:ring-1 focus:ring-[#0d3b43] outline-none"
          />
        </div>
      </div>

      {/* Proposal Message */}
      <div>
        <label className="block text-2xs font-bold uppercase tracking-wider text-[#08242a] mb-2">
          {isAr ? 'تفاصيل مقترح الشراكة أو المبادرة المشتركة *' : 'Partnership Proposal Details *'}
        </label>
        <textarea
          name="proposal"
          required
          rows={5}
          className="w-full px-4 py-3 rounded-xl border border-[#e5e0d6] text-xs text-[#08242a] focus:border-[#0d3b43] focus:ring-1 focus:ring-[#0d3b43] outline-none"
          placeholder={isAr ? 'وضح مجالات التعاون المقترحة، الفئات المستهدفة، والإطار الزمني المتوقع...' : 'Describe the collaboration scope, objectives, and timeline...'}
        />
        {result?.errors?.proposal && (
          <p className="text-3xs text-red-600 mt-1">{result.errors.proposal[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-[#0d3b43] hover:bg-[#14505b] disabled:opacity-60 transition-all text-xs shadow-md active:scale-98"
      >
        {loading
          ? (isAr ? 'جارٍ إرسال المقترح...' : isFr ? 'Envoi en cours...' : 'Submitting proposal...')
          : (isAr ? 'إرسال مقترح الشراكة المؤسساتية ✓' : isFr ? 'Soumettre la proposition de partenariat ✓' : 'Submit Partnership Proposal ✓')}
      </button>
    </form>
  )
}

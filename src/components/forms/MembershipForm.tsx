'use client'

import { useState } from 'react'
import { submitMembership, type ActionResponse } from '@/lib/actions/submissions'
import type { MembershipTierConfig } from '@/lib/settings'

interface MembershipFormProps {
  locale: string
  tiers?: MembershipTierConfig[]
}

export function MembershipForm({ locale, tiers = [] }: MembershipFormProps) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ActionResponse | null>(null)
  const activeTiers = tiers.filter((t) => t.active !== false)
  const [selectedTierId, setSelectedTierId] = useState<string>(
    activeTiers.find((t) => t.recommended)?.id || activeTiers[0]?.id || ''
  )

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    const form = e.currentTarget
    const formData = new FormData(form)

    // Prepend chosen tier if selected
    const chosenTier = activeTiers.find((t) => t.id === selectedTierId)
    if (chosenTier) {
      const tierLabel = isAr ? chosenTier.nameAr : isFr ? chosenTier.nameFr : chosenTier.nameEn
      const originalMotivation = (formData.get('motivation') as string) || ''
      const tierPrefix = isAr
        ? `[الفئة المرغوبة: ${tierLabel}]`
        : isFr
        ? `[Catégorie souhaitée: ${tierLabel}]`
        : `[Intended Membership Tier: ${tierLabel}]`
      formData.set('motivation', `${tierPrefix}\n\n${originalMotivation}`)
    }

    try {
      const response = await submitMembership(formData)
      setResult(response)
      if (response.success) {
        form.reset()
      }
    } catch {
      setResult({
        success: false,
        message:
          isAr
            ? 'حدث خطأ أثناء معالجة الطلب. يرجى المحاولة لاحقاً.'
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
      id="membership-form"
      onSubmit={handleSubmit}
      className="space-y-6 max-w-2xl mx-auto bg-white p-7 sm:p-10 rounded-3xl border border-[#e5e0d6] shadow-sm"
    >
      <div className="border-b border-[#FEF6CC] pb-4">
        <span className="text-2xs font-extrabold uppercase tracking-widest text-[#bd3227]">
          {isAr ? 'استمارة الترشح الرسمية' : isFr ? 'Candidature Officielle' : 'Official Application'}
        </span>
        <h3 className="text-xl sm:text-2xl font-black text-[#231f20] mt-1">
          {isAr
            ? 'طلب الانخراط في جمعية روح الفنون والثقافة'
            : isFr
            ? 'Demande d’Adhésion à l’AMYCC'
            : 'AMYCC Membership Application'}
        </h3>
        <p className="text-xs text-[#5C5A55] mt-1">
          {isAr
            ? 'يرجى ملء البيانات بدقة لتيسير دراسة الملف من لدن المكتب التنفيذي للجمعية.'
            : isFr
            ? 'Veuillez renseigner vos informations pour examen par le Bureau de l’association.'
            : 'Please complete your details for evaluation by the executive bureau.'}
        </p>
      </div>

      {result && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold border transition-all ${
            result.success
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-red-50 text-red-900 border-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span>{result.success ? '✓' : '⚠️'}</span>
            <span>{result.message}</span>
          </div>
          {result.success && (
            <p className="text-3xs font-medium text-emerald-700 mt-1">
              {isAr
                ? 'تم تسجيل طلب انخراطكم بنجاح. سيتواصل معكم مكتب الجمعية عبر البريد الإلكتروني أو الهاتف لاستكمال مسطرة الانخراط.'
                : isFr
                ? 'Votre candidature a été reçue avec succès. Le bureau vous contactera sous peu pour finaliser la procédure.'
                : 'Your application has been received successfully. Our board will reach out shortly.'}
            </p>
          )}
        </div>
      )}

      {/* Tier Selector if available */}
      {activeTiers.length > 0 && (
        <div>
          <label className="block text-2xs font-extrabold uppercase tracking-wider text-[#231f20] mb-2">
            {isAr
              ? 'فئة الانخراط المرغوبة *'
              : isFr
              ? 'Catégorie d’adhésion souhaitée *'
              : 'Target Membership Tier *'}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {activeTiers.map((tier) => {
              const isSelected = selectedTierId === tier.id
              const name = isAr ? tier.nameAr : isFr ? tier.nameFr : tier.nameEn
              const fee = isAr ? tier.feeAr : isFr ? tier.feeFr : tier.feeEn
              const period = isAr ? tier.periodAr : isFr ? tier.periodFr : tier.periodEn

              return (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setSelectedTierId(tier.id)}
                  className={`text-start p-3 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#231f20]/5 border-[#231f20] shadow-2xs ring-1 ring-[#231f20]'
                      : 'bg-[#F5F3EE] border-[#e5e0d6] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-bold text-xs text-[#231f20]">{name}</span>
                    {tier.recommended && (
                      <span className="text-3xs font-black px-1.5 py-0.5 rounded-full bg-[#bd3227] text-white">
                        ⭐
                      </span>
                    )}
                  </div>
                  <div className="text-3xs font-black text-[#231f20]">
                    {fee} <span className="text-[#5C5A55] font-normal">/ {period}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Full Name */}
      <div>
        <label className="block text-2xs font-extrabold uppercase tracking-wider text-[#231f20] mb-1.5">
          {isAr ? 'الاسم الكامل *' : isFr ? 'Nom complet *' : 'Full Name *'}
        </label>
        <input
          type="text"
          name="fullName"
          required
          className="w-full px-4 py-3 rounded-xl border border-[#e5e0d6] text-xs text-[#231f20] focus:border-[#231f20] focus:ring-1 focus:ring-[#231f20] outline-none bg-[#F5F3EE]"
          placeholder={isAr ? 'أدخل اسمك الكامل' : isFr ? 'Votre nom et prénom' : 'Enter your full name'}
        />
        {result?.errors?.fullName && (
          <p className="text-3xs text-red-600 mt-1">{result.errors.fullName[0]}</p>
        )}
      </div>

      {/* Email & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-2xs font-extrabold uppercase tracking-wider text-[#231f20] mb-1.5">
            {isAr ? 'البريد الإلكتروني *' : isFr ? 'Adresse e-mail *' : 'Email Address *'}
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full px-4 py-3 rounded-xl border border-[#e5e0d6] text-xs text-[#231f20] focus:border-[#231f20] focus:ring-1 focus:ring-[#231f20] outline-none bg-[#F5F3EE]"
            placeholder="name@example.com"
          />
          {result?.errors?.email && (
            <p className="text-3xs text-red-600 mt-1">{result.errors.email[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-2xs font-extrabold uppercase tracking-wider text-[#231f20] mb-1.5">
            {isAr ? 'رقم الهاتف *' : isFr ? 'Numéro de téléphone *' : 'Phone Number *'}
          </label>
          <input
            type="tel"
            name="phone"
            required
            className="w-full px-4 py-3 rounded-xl border border-[#e5e0d6] text-xs text-[#231f20] focus:border-[#231f20] focus:ring-1 focus:ring-[#231f20] outline-none bg-[#F5F3EE]"
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
          <label className="block text-2xs font-extrabold uppercase tracking-wider text-[#231f20] mb-1.5">
            {isAr ? 'المدينة / الإقامة *' : isFr ? 'Ville de résidence *' : 'City / Residence *'}
          </label>
          <input
            type="text"
            name="city"
            required
            className="w-full px-4 py-3 rounded-xl border border-[#e5e0d6] text-xs text-[#231f20] focus:border-[#231f20] focus:ring-1 focus:ring-[#231f20] outline-none bg-[#F5F3EE]"
            placeholder={isAr ? 'مثال: الرباط، الدار البيضاء...' : 'Ex: Rabat, Casablanca...'}
          />
          {result?.errors?.city && (
            <p className="text-3xs text-red-600 mt-1">{result.errors.city[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-2xs font-extrabold uppercase tracking-wider text-[#231f20] mb-1.5">
            {isAr ? 'المهنة أو الصفة' : isFr ? 'Profession / Activité' : 'Profession / Status'}
          </label>
          <input
            type="text"
            name="profession"
            className="w-full px-4 py-3 rounded-xl border border-[#e5e0d6] text-xs text-[#231f20] focus:border-[#231f20] focus:ring-1 focus:ring-[#231f20] outline-none bg-[#F5F3EE]"
            placeholder={
              isAr
                ? 'فنان، طالب، أستاذ، فاعل جمعوي...'
                : isFr
                ? 'Artiste, étudiant, enseignant...'
                : 'Artist, Student, Teacher...'
            }
          />
        </div>
      </div>

      {/* Interests Checkboxes */}
      <div>
        <label className="block text-2xs font-extrabold uppercase tracking-wider text-[#231f20] mb-2">
          {isAr
            ? 'المجالات الفنية والثقافية محل الاهتمام:'
            : isFr
            ? 'Centres d’intérêt artistiques :'
            : 'Areas of Cultural Interest:'}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {interestOptions.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2.5 p-3 rounded-xl border border-[#e5e0d6] bg-[#F5F3EE] hover:bg-white cursor-pointer text-xs transition-colors"
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

      {/* Motivation */}
      <div>
        <label className="block text-2xs font-extrabold uppercase tracking-wider text-[#231f20] mb-1.5">
          {isAr
            ? 'دوافع الانخراط ورسالتك إلى الجمعية *'
            : isFr
            ? 'Motivations et projet d’engagement *'
            : 'Motivation to Join AMYCC *'}
        </label>
        <textarea
          name="motivation"
          required
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-[#e5e0d6] text-xs text-[#231f20] focus:border-[#231f20] focus:ring-1 focus:ring-[#231f20] outline-none bg-[#F5F3EE]"
          placeholder={
            isAr
              ? 'اذكر بإيجاز دوافعك للانخراط وما تأمل في تحقيقه أو المساهمة به ضمن برامج الجمعية...'
              : isFr
              ? 'Expliquez brièvement vos motivations et votre apport potentiel aux activités de l’association...'
              : 'Briefly explain your motivations and how you wish to contribute...'
          }
        />
        {result?.errors?.motivation && (
          <p className="text-3xs text-red-600 mt-1">{result.errors.motivation[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 px-6 rounded-2xl font-black text-white bg-[#231f20] hover:bg-[#d2a82b] disabled:opacity-60 transition-all text-xs shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            <span>
              {isAr
                ? 'جارٍ تسجيل الطلب...'
                : isFr
                ? 'Traitement de la candidature...'
                : 'Submitting application...'}
            </span>
          </>
        ) : (
          <>
            <span>
              {isAr
                ? 'إرسال طلب الانخراط الرسمي ✓'
                : isFr
                ? 'Soumettre ma demande d’adhésion ✓'
                : 'Submit Official Application ✓'}
            </span>
          </>
        )}
      </button>
    </form>
  )
}

'use client'

import { useState } from 'react'
import type { SupportPageConfig } from '@/lib/settings'

interface OnlineDonationHubProps {
  config: SupportPageConfig
  locale: string
}

export function OnlineDonationHub({ config, locale }: OnlineDonationHubProps) {
  const isAr = locale === 'ar'
  const isFr = locale === 'fr'

  const gateway = config.paymentGateway
  const bank = config.bankTransfer
  const presetAmounts = gateway.presetAmounts || [100, 250, 500, 1000, 2500]

  // State
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'bank'>(
    gateway.enabled ? 'card' : 'bank'
  )
  const [selectedAmount, setSelectedAmount] = useState<number>(presetAmounts[1] || 250)
  const [isCustomAmount, setIsCustomAmount] = useState(false)
  const [customAmountVal, setCustomAmountVal] = useState<string>('')

  const [selectedCause, setSelectedCause] = useState<string>('general_support')
  const [donorName, setDonorName] = useState('')
  const [donorEmail, setDonorEmail] = useState('')
  const [donorPhone, setDonorPhone] = useState('')
  const [donorNotes, setDonorNotes] = useState('')

  const [loading, setLoading] = useState(false)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [successResult, setSuccessResult] = useState<{
    orderId: string
    amount: number
    currency: string
    message: string
  } | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const activeAmount = isCustomAmount ? Number(customAmountVal) || 0 : selectedAmount

  function handleSelectPreset(amount: number) {
    setIsCustomAmount(false)
    setSelectedAmount(amount)
    setCustomAmountVal('')
  }

  function handleCustomAmountChange(val: string) {
    setIsCustomAmount(true)
    setCustomAmountVal(val)
  }

  async function handleCopy(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text.replace(/\s+/g, ''))
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 2500)
    } catch {
      // Fallback
    }
  }

  async function handleCardSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (activeAmount <= 0) {
      alert(
        isAr
          ? 'يرجى تحديد مبلغ صالح للمساهمة.'
          : isFr
          ? 'Veuillez saisir un montant valide.'
          : 'Please specify a valid contribution amount.'
      )
      return
    }

    setLoading(true)
    setErrorMessage(null)

    try {
      const res = await fetch('/api/donations/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: activeAmount,
          donorName,
          donorEmail,
          donorPhone,
          cause: selectedCause,
          notes: donorNotes,
          locale,
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to initialize checkout')
      }

      // If CMI Gateway payload returned: Submit form to CMI
      if (data.mode === 'cmi' && data.gatewayUrl && data.fields) {
        const form = document.createElement('form')
        form.method = 'POST'
        form.action = data.gatewayUrl

        Object.entries(data.fields).forEach(([key, val]) => {
          const input = document.createElement('input')
          input.type = 'hidden'
          input.name = key
          input.value = String(val)
          form.appendChild(input)
        })

        document.body.appendChild(form)
        form.submit()
        return
      }

      // If sandbox simulation mode or confirmation
      setSuccessResult({
        orderId: data.orderId || 'AMYCC-' + Date.now(),
        amount: activeAmount,
        currency: gateway.currency || 'MAD',
        message:
          data.message ||
          (isAr
            ? 'تم تسجيل نية التبرع والمساهمة بنجاح.'
            : isFr
            ? 'Don enregistré avec succès.'
            : 'Donation successfully registered.'),
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'حدث خطأ أثناء معالجة الطلب'
      setErrorMessage(msg)
    } finally {
      setLoading(false)
    }
  }

  const causes = [
    {
      id: 'general_support',
      labelAr: 'الدعم العام لأنشطة وبرامج الجمعية',
      labelFr: 'Mission culturelle générale',
      labelEn: 'General Cultural Mission',
    },
    {
      id: 'youth_theatre',
      labelAr: 'محترفات مسرح الشباب والناشئة',
      labelFr: 'Ateliers de théâtre pour la jeunesse',
      labelEn: 'Youth Theatre Masterclasses',
    },
    {
      id: 'musical_heritage',
      labelAr: 'صون وتوثيق التراث الموسيقي المغربي',
      labelFr: 'Sauvegarde du patrimoine musical marocain',
      labelEn: 'Moroccan Musical Heritage Preservation',
    },
    {
      id: 'rural_caravans',
      labelAr: 'القوافل الفنية المتنقلة للمناطق القروية',
      labelFr: 'Caravanes artistiques en milieu rural',
      labelEn: 'Rural Creative Caravans',
    },
    {
      id: 'creative_residencies',
      labelAr: 'الإقامات الفنية ورعاية المبدعين',
      labelFr: 'Résidences de création artistique',
      labelEn: 'Artist Residencies & Production',
    },
  ]

  return (
    <div id="online-donation" className="max-w-4xl mx-auto bg-white rounded-3xl border border-[#e5e0d6] shadow-xl overflow-hidden">
      {/* Header Tabs */}
      <div className="bg-[#faf7f2] border-b border-[#e5e0d6] p-2 flex gap-2">
        {gateway.enabled && (
          <button
            type="button"
            onClick={() => setSelectedMethod('card')}
            className={`flex-1 py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              selectedMethod === 'card'
                ? 'bg-white text-[#0d3b43] shadow-sm border border-[#e5e0d6]'
                : 'text-[#5f7174] hover:text-[#08242a]'
            }`}
          >
            <span>💳</span>
            <span>
              {isAr
                ? 'الأداء الإلكتروني بالبطاقة البنكية'
                : isFr
                ? 'Paiement Sécurisé par Carte'
                : 'Online Card Payment'}
            </span>
            <span className="text-3xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
              {gateway.mode === 'live' ? '3D-Secure' : 'Sandbox Test'}
            </span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setSelectedMethod('bank')}
          className={`flex-1 py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            selectedMethod === 'bank'
              ? 'bg-white text-[#0d3b43] shadow-sm border border-[#e5e0d6]'
              : 'text-[#5f7174] hover:text-[#08242a]'
          }`}
        >
          <span>🏦</span>
          <span>
            {isAr
              ? 'التحويل البنكي المباشر (RIB)'
              : isFr
              ? 'Virement Bancaire Officiel (RIB)'
              : 'Direct Bank Wire (RIB)'}
          </span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* METHOD 1: ONLINE CARD / CMI CHECKOUT                      */}
      {/* ========================================================= */}
      {selectedMethod === 'card' && (
        <div className="p-6 sm:p-10 space-y-8">
          {successResult ? (
            <div className="p-6 sm:p-8 rounded-3xl bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-fade-in">
              <span className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center text-3xl font-black mx-auto shadow-md">
                ✓
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-emerald-950">
                {isAr
                  ? 'شكراً جزيلاً لدعمكم النبيل لروح الفنون والثقافة!'
                  : isFr
                  ? 'Merci chaleureusement pour votre soutien culturel !'
                  : 'Thank You for Empowering Moroccan Arts & Culture!'}
              </h3>
              <p className="text-xs sm:text-sm text-emerald-800 max-w-lg mx-auto leading-relaxed">
                {successResult.message}
              </p>
              <div className="p-4 rounded-2xl bg-white border border-emerald-200 max-w-md mx-auto text-xs font-mono text-emerald-900 space-y-1">
                <div>
                  <span className="text-slate-400 font-sans">
                    {isAr ? 'المرجع: ' : 'Ref: '}
                  </span>
                  <span className="font-bold">{successResult.orderId}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-sans">
                    {isAr ? 'المبلغ: ' : 'Amount: '}
                  </span>
                  <span className="font-bold text-[#c85a32]">
                    {successResult.amount.toLocaleString()} {successResult.currency}
                  </span>
                </div>
              </div>
              <p className="text-3xs text-emerald-700">
                {isAr
                  ? 'سيتم إرسال وصل الإبراء القانوني الرسمي إلى بريدك الإلكتروني.'
                  : isFr
                  ? 'Un reçu officiel vous sera adressé par courriel.'
                  : 'An official donation receipt will be emailed to you.'}
              </p>
              <button
                type="button"
                onClick={() => setSuccessResult(null)}
                className="px-6 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition-colors cursor-pointer"
              >
                {isAr ? 'تقديم مساهمة أخرى' : isFr ? 'Faire un autre don' : 'Make Another Contribution'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleCardSubmit} className="space-y-6">
              {errorMessage && (
                <div className="p-4 rounded-2xl text-xs font-bold bg-red-50 text-red-800 border border-red-200">
                  {errorMessage}
                </div>
              )}

              {/* Step 1: Amount Selection */}
              <div>
                <label className="block text-2xs font-extrabold uppercase tracking-wider text-[#08242a] mb-2.5">
                  {isAr
                    ? '1. حدد مبلغ المساهمة (بالدرهم المغربي) *'
                    : isFr
                    ? '1. Choisissez le montant du don (en MAD) *'
                    : '1. Select Contribution Amount (in MAD) *'}
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 mb-3">
                  {presetAmounts.map((amt) => {
                    const isSelected = !isCustomAmount && selectedAmount === amt
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => handleSelectPreset(amt)}
                        className={`py-3 px-2 rounded-2xl text-xs sm:text-sm font-black border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#0d3b43] text-white border-[#0d3b43] shadow-md scale-102 ring-2 ring-[#0d3b43]/30'
                            : 'bg-[#faf7f2] text-[#08242a] border-[#e5e0d6] hover:bg-white'
                        }`}
                      >
                        {amt.toLocaleString()} {gateway.currency || 'MAD'}
                      </button>
                    )
                  })}
                </div>

                {gateway.allowCustomAmount && (
                  <div className="relative">
                    <input
                      type="number"
                      min="10"
                      value={customAmountVal}
                      onChange={(e) => handleCustomAmountChange(e.target.value)}
                      placeholder={
                        isAr
                          ? 'أو أدخل مبلغاً مخصصاً آخر...'
                          : isFr
                          ? 'Ou saisissez un autre montant...'
                          : 'Or enter a custom amount...'
                      }
                      className={`w-full px-4 py-3 rounded-2xl border text-xs sm:text-sm outline-none font-bold transition-all ${
                        isCustomAmount
                          ? 'border-[#0d3b43] ring-1 ring-[#0d3b43] bg-white'
                          : 'border-[#e5e0d6] bg-[#faf7f2]'
                      }`}
                    />
                    <span className="absolute left-4 top-3 text-xs font-bold text-[#819598]">
                      {gateway.currency || 'MAD'}
                    </span>
                  </div>
                )}
              </div>

              {/* Step 2: Target Cause */}
              <div>
                <label className="block text-2xs font-extrabold uppercase tracking-wider text-[#08242a] mb-2">
                  {isAr
                    ? '2. توجيه المساهمة (المجال أو المبادرة) *'
                    : isFr
                    ? '2. Affectation de votre soutien *'
                    : '2. Dedicated Cultural Cause *'}
                </label>
                <select
                  value={selectedCause}
                  onChange={(e) => setSelectedCause(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-[#e5e0d6] text-xs font-bold text-[#08242a] bg-[#faf7f2] outline-none"
                >
                  {causes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {isAr ? c.labelAr : isFr ? c.labelFr : c.labelEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 3: Donor Details */}
              <div className="space-y-4 pt-2 border-t border-[#f4ede2]">
                <span className="text-2xs font-extrabold uppercase tracking-wider text-[#08242a] block">
                  {isAr
                    ? '3. بيانات المتبرع (لتحرير وصل الإبراء القانوني) *'
                    : isFr
                    ? '3. Coordonnées pour l’émission du reçu fiscal *'
                    : '3. Donor Details (for formal receipt) *'}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-3xs font-extrabold text-[#08242a] mb-1">
                      {isAr ? 'الاسم الكامل أو اسم المؤسسة *' : isFr ? 'Nom complet ou raison sociale *' : 'Full Name or Entity *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder={isAr ? 'الاسم الكامل' : 'Full Name'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e0d6] text-xs bg-[#faf7f2]"
                    />
                  </div>

                  <div>
                    <label className="block text-3xs font-extrabold text-[#08242a] mb-1">
                      {isAr ? 'البريد الإلكتروني للتوصل بالوصل *' : isFr ? 'Adresse courriel *' : 'Email Address *'}
                    </label>
                    <input
                      type="email"
                      required
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e0d6] text-xs bg-[#faf7f2]"
                    />
                  </div>

                  <div>
                    <label className="block text-3xs font-extrabold text-[#08242a] mb-1">
                      {isAr ? 'الهاتف للتواصل' : isFr ? 'Téléphone' : 'Phone'}
                    </label>
                    <input
                      type="tel"
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      placeholder="+212 6..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e0d6] text-xs bg-[#faf7f2]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-3xs font-extrabold text-[#08242a] mb-1">
                    {isAr ? 'رسالة أو إهداء خاص (اختياري)' : isFr ? 'Message ou dédicace (optionnel)' : 'Dedication Note (optional)'}
                  </label>
                  <input
                    type="text"
                    value={donorNotes}
                    onChange={(e) => setDonorNotes(e.target.value)}
                    placeholder={
                      isAr
                        ? 'مثال: دعماً لمواهب مسرح الشباب في إقليم...'
                        : 'e.g. In support of youth theatre...'
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e0d6] text-xs bg-[#faf7f2]"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || activeAmount <= 0}
                  className="w-full py-4 px-6 rounded-2xl font-black text-white bg-[#0d3b43] hover:bg-[#14505b] disabled:opacity-50 transition-all text-xs sm:text-sm shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      <span>{isAr ? 'جاري التحويل الآمن للبوابة...' : 'Securing payment session...'}</span>
                    </>
                  ) : (
                    <>
                      <span>🔒</span>
                      <span>
                        {isAr
                          ? `تأكيد المساهمة بمبلغ ${activeAmount.toLocaleString()} ${gateway.currency || 'MAD'} ✓`
                          : isFr
                          ? `Confirmer le don de ${activeAmount.toLocaleString()} ${gateway.currency || 'MAD'} ✓`
                          : `Confirm Donation of ${activeAmount.toLocaleString()} ${gateway.currency || 'MAD'} ✓`}
                      </span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-4 text-3xs text-[#819598] font-bold mt-3 text-center">
                  <span>🔒 معالجة مشفرة SSL 256-bit</span>
                  <span>🇲🇦 مركز النقديات CMI / 3D-Secure</span>
                  <span>📜 وصل إبراء رسمي معتمد</span>
                </div>
              </div>
            </form>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* METHOD 2: DIRECT BANK TRANSFER (RIB / IBAN / SWIFT)       */}
      {/* ========================================================= */}
      {selectedMethod === 'bank' && (
        <div className="p-6 sm:p-10 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0d3b43] via-[#08242a] to-[#0d3b43] text-white shadow-xl relative overflow-hidden space-y-6">
            <div className="absolute inset-0 moroccan-pattern opacity-10 mix-blend-overlay pointer-events-none" />

            <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
              <div>
                <span className="text-3xs uppercase tracking-widest text-amber-300 font-extrabold block">
                  {isAr ? 'الحساب البنكي الرسمي' : 'Official Association Bank Account'}
                </span>
                <h3 className="text-lg sm:text-xl font-black">{bank.bankName}</h3>
              </div>
              <span className="text-2xl">🇲🇦</span>
            </div>

            {/* Account Holder */}
            <div className="relative z-10">
              <span className="text-3xs text-slate-300 block mb-0.5">
                {isAr ? 'اسم صاحب الحساب والمستفيد:' : 'Beneficiary / Account Holder:'}
              </span>
              <span className="text-base sm:text-lg font-black text-white">
                {bank.accountHolder}
              </span>
            </div>

            {/* 24-digit RIB with Copy Button */}
            <div className="p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md space-y-2 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-3xs uppercase tracking-widest text-amber-300 font-black">
                  {isAr ? 'رقم الحساب البنكي الوطني (RIB - 24 رقماً):' : 'Moroccan RIB (24 digits):'}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(bank.rib, 'rib')}
                  className="px-3 py-1 rounded-lg text-3xs font-black bg-amber-400 text-[#08242a] hover:bg-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>{copiedKey === 'rib' ? '✓ تم النسخ' : 'نسخ الـ RIB'}</span>
                </button>
              </div>
              <div className="text-sm sm:text-xl font-mono font-black text-white tracking-wider" dir="ltr">
                {bank.rib}
              </div>
            </div>

            {/* IBAN & SWIFT */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono relative z-10">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-3xs text-slate-400 font-sans block">IBAN:</span>
                  <span className="font-bold text-white text-3xs sm:text-2xs" dir="ltr">{bank.iban}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(bank.iban, 'iban')}
                  className="text-3xs text-amber-300 hover:text-white underline cursor-pointer"
                >
                  {copiedKey === 'iban' ? '✓' : 'نسخ'}
                </button>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-3xs text-slate-400 font-sans block">SWIFT / BIC:</span>
                  <span className="font-bold text-white" dir="ltr">{bank.swift}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(bank.swift, 'swift')}
                  className="text-3xs text-amber-300 hover:text-white underline cursor-pointer"
                >
                  {copiedKey === 'swift' ? '✓' : 'نسخ'}
                </button>
              </div>
            </div>

            {/* Agency */}
            <div className="text-3xs text-slate-300 relative z-10">
              <span>{isAr ? 'الوكالة البنكية: ' : 'Agency: '}</span>
              <span className="font-bold text-white">{bank.agency}</span>
            </div>
          </div>

          {/* Instructions Box */}
          <div className="p-5 rounded-2xl bg-[#faf7f2] border border-[#e5e0d6] space-y-2">
            <span className="text-2xs font-extrabold uppercase text-[#08242a] block">
              {isAr ? 'إرشادات إتمام التحويل البنكي والتسليم:' : 'Bank Transfer Guidelines:'}
            </span>
            <p className="text-xs text-[#5f7174] leading-relaxed">
              {isAr
                ? bank.instructionsAr
                : isFr
                ? bank.instructionsFr
                : bank.instructionsEn}
            </p>
            <div className="pt-2">
              <a
                href="#support-form"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#c85a32] text-white text-xs font-bold hover:bg-[#a94824] transition-colors shadow-2xs"
              >
                <span>{isAr ? 'تأكيد وإشعار التحويل البنكي أسفله ↓' : 'Notify us of your transfer ↓'}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

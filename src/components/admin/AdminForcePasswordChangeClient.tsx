'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAdminLocale } from './AdminLocaleContext'
import { completeFirstLoginPasswordChangeAction, logoutAdmin } from '@/lib/actions/admin'

interface AdminForcePasswordChangeClientProps {
  userEmail: string
  userName: string
}

export function AdminForcePasswordChangeClient({
  userEmail,
  userName,
}: AdminForcePasswordChangeClientProps) {
  const router = useRouter()
  const { isAr, isFr } = useAdminLocale()

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Password rules validation
  const hasMinLength = newPassword.length >= 8
  const hasLower = /[a-z]/.test(newPassword)
  const hasUpper = /[A-Z]/.test(newPassword)
  const hasNumber = /[0-9]/.test(newPassword)
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>_\-=+~]/.test(newPassword)
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword

  const rulesPassedCount = [hasMinLength, hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length
  const isFormValid = rulesPassedCount === 5 && passwordsMatch

  const t = {
    badge: isAr
      ? '✦ الأمان الإداري المشدد • أول تسجيل دخول'
      : isFr
      ? '✦ Sécurité Renforcée • Première Connexion'
      : '✦ Strict Administrative Security • First Login',
    title: isAr
      ? 'تعيين كلمة المرور الشخصية للحساب'
      : isFr
      ? 'Définition du Mot de Passe Personnel'
      : 'Set Your Personal Administrator Password',
    desc: isAr
      ? `مرحباً بك ${userName}. نظراً لإنشاء حسابك حديثاً في منظومة AMYCC، يفرض بروتوكول الأمان استبدال كلمة المرور المؤقتة بكلمة مرور شخصية وقوية قبل تمكين صلاحيات لوحة التحكم.`
      : isFr
      ? `Bienvenue ${userName}. Votre compte ayant été récemment créé, notre politique de sécurité impose la création d'un mot de passe robuste avant d'accéder au tableau de bord.`
      : `Welcome ${userName}. Since this account was recently provisioned, security policy strictly requires setting a personal strong password before accessing dashboard privileges.`,
    emailBadge: isAr ? 'الحساب المستهدف' : isFr ? 'Compte cible' : 'Target Account',
    newPasswordLabel: isAr ? 'كلمة المرور الجديدة' : isFr ? 'Nouveau mot de passe' : 'New Password',
    confirmPasswordLabel: isAr
      ? 'تأكيد كلمة المرور الجديدة'
      : isFr
      ? 'Confirmer le mot de passe'
      : 'Confirm New Password',
    placeholder: '••••••••••••',
    meterTitle: isAr ? 'معايير قوة كلمة المرور:' : isFr ? 'Critères de sécurité :' : 'Password Security Rules:',
    ruleMinLength: isAr ? '8 أحرف على الأقل' : isFr ? 'Au moins 8 caractères' : 'At least 8 characters',
    ruleUpper: isAr ? 'حرف كبير واحد على الأقل (A-Z)' : isFr ? 'Une majuscule (A-Z)' : 'At least one uppercase (A-Z)',
    ruleLower: isAr ? 'حرف صغير واحد على الأقل (a-z)' : isFr ? 'Une minuscule (a-z)' : 'At least one lowercase (a-z)',
    ruleNumber: isAr ? 'رقم واحد على الأقل (0-9)' : isFr ? 'Un chiffre (0-9)' : 'At least one digit (0-9)',
    ruleSymbol: isAr ? 'رمز خاص واحد (!@#$%...)' : isFr ? 'Un symbole spécial (!@#...)' : 'One special character (!@#...)',
    ruleMatch: isAr ? 'تطابق كلمتي المرور' : isFr ? 'Les mots de passe correspondent' : 'Passwords match',
    submitBtn: isAr ? 'تأكيد وتفعيل الحساب' : isFr ? 'Valider et Activer le Compte' : 'Confirm & Activate Account',
    submittingBtn: isAr ? 'جاري تشفير وتحديث الحساب...' : isFr ? 'Mise à jour en cours...' : 'Encrypting & Updating...',
    signOutBtn: isAr ? 'تسجيل الخروج والعودة لاحقاً' : isFr ? 'Se déconnecter' : 'Sign Out & Return Later',
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isFormValid || isSubmitting) return

    setErrorMessage(null)
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.set('newPassword', newPassword)
      formData.set('confirmPassword', confirmPassword)

      const result = await completeFirstLoginPasswordChangeAction(formData)

      if (result.success) {
        // Successful password change! Redirect into admin
        router.push('/admin')
        router.refresh()
      } else {
        setErrorMessage(result.error || (isAr ? 'فشل تحديث كلمة المرور.' : 'Failed to update password.'))
        setIsSubmitting(false)
      }
    } catch (err) {
      setErrorMessage((err as Error).message)
      setIsSubmitting(false)
    }
  }

  // Calculate meter bar color
  const meterColors = [
    'bg-gray-200',
    'bg-rose-500',
    'bg-amber-500',
    'bg-amber-400',
    'bg-emerald-500',
    'bg-[#18794E]',
  ]

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-10 bg-[#FAF8F5] relative overflow-hidden">
      {/* Ambient background decoration */}
      <div className="absolute inset-0 moroccan-pattern opacity-10 pointer-events-none" />
      <div className="absolute top-1/4 start-1/4 w-96 h-96 bg-[#bd3227]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 end-1/4 w-96 h-96 bg-[#d2a82b]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-xl bg-white rounded-3xl border border-[#e5e0d6] shadow-xl overflow-hidden p-6 sm:p-10 space-y-6">
        {/* Header with AMYCC Logo */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#181516] border border-[#d2a82b]/30 shadow-md mx-auto">
            <Image
              src="/logo.png"
              alt="AMYCC Logo"
              width={44}
              height={44}
              className="object-contain"
              priority
            />
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fde8e7] text-[#bd3227] border border-[#bd3227]/30 text-2xs font-bold tracking-wide">
              <span>🔒</span>
              <span>{t.badge}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-[#231f20] tracking-tight">
            {t.title}
          </h1>

          <p className="text-xs sm:text-sm text-[#5C5A55] leading-relaxed max-w-lg mx-auto">
            {t.desc}
          </p>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-[#F5F3EE] border border-[#e5e0d6] text-xs font-mono text-[#231f20]">
            <span className="text-[#8a6e14] font-bold">{t.emailBadge}:</span>
            <span className="font-bold">{userEmail}</span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div
            role="alert"
            className="p-4 rounded-2xl bg-[#fde8e7] text-[#bd3227] text-xs font-bold border border-[#bd3227]/30 flex items-start gap-2.5 animate-in fade-in"
          >
            <span className="text-base shrink-0">⚠️</span>
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* New Password */}
          <div>
            <label className="block text-2xs font-bold uppercase tracking-wider text-[#5C5A55] mb-1.5">
              {t.newPasswordLabel}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                autoFocus
                placeholder={t.placeholder}
                className="w-full px-4 py-3 pe-12 rounded-xl border border-[#e5e0d6] bg-[#FAF8F5]/50 focus:bg-white text-sm text-[#231f20] focus:border-[#d2a82b] focus:ring-2 focus:ring-[#ffd22f]/30 outline-none transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 end-0 pe-3.5 flex items-center text-[#5C5A55] hover:text-[#231f20] cursor-pointer"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-2xs font-bold uppercase tracking-wider text-[#5C5A55] mb-1.5">
              {t.confirmPasswordLabel}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder={t.placeholder}
                className="w-full px-4 py-3 rounded-xl border border-[#e5e0d6] bg-[#FAF8F5]/50 focus:bg-white text-sm text-[#231f20] focus:border-[#d2a82b] focus:ring-2 focus:ring-[#ffd22f]/30 outline-none transition-all font-mono"
              />
            </div>
          </div>

          {/* Strength meter bar */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-3xs font-bold text-[#5C5A55]">
              <span>مستوى القوة والتشفير:</span>
              <span className="font-mono">
                {rulesPassedCount === 5 ? 'ممتازة (مؤهل للقبول)' : `${rulesPassedCount} من 5 معايير`}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden flex gap-1">
              {[1, 2, 3, 4, 5].map((idx) => (
                <div
                  key={idx}
                  className={`flex-1 h-full transition-all duration-300 ${
                    rulesPassedCount >= idx ? meterColors[rulesPassedCount] : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Rules Checklist */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] space-y-2 text-2xs">
            <p className="font-bold text-[#231f20] mb-2">{t.meterTitle}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className={`flex items-center gap-1.5 font-medium ${hasMinLength ? 'text-emerald-700 font-bold' : 'text-[#5C5A55]'}`}>
                <span>{hasMinLength ? '✓' : '○'}</span>
                <span>{t.ruleMinLength}</span>
              </div>
              <div className={`flex items-center gap-1.5 font-medium ${hasUpper ? 'text-emerald-700 font-bold' : 'text-[#5C5A55]'}`}>
                <span>{hasUpper ? '✓' : '○'}</span>
                <span>{t.ruleUpper}</span>
              </div>
              <div className={`flex items-center gap-1.5 font-medium ${hasLower ? 'text-emerald-700 font-bold' : 'text-[#5C5A55]'}`}>
                <span>{hasLower ? '✓' : '○'}</span>
                <span>{t.ruleLower}</span>
              </div>
              <div className={`flex items-center gap-1.5 font-medium ${hasNumber ? 'text-emerald-700 font-bold' : 'text-[#5C5A55]'}`}>
                <span>{hasNumber ? '✓' : '○'}</span>
                <span>{t.ruleNumber}</span>
              </div>
              <div className={`flex items-center gap-1.5 font-medium ${hasSymbol ? 'text-emerald-700 font-bold' : 'text-[#5C5A55]'}`}>
                <span>{hasSymbol ? '✓' : '○'}</span>
                <span>{t.ruleSymbol}</span>
              </div>
              <div className={`flex items-center gap-1.5 font-medium ${passwordsMatch ? 'text-emerald-700 font-bold' : 'text-[#5C5A55]'}`}>
                <span>{passwordsMatch ? '✓' : '○'}</span>
                <span>{t.ruleMatch}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                isFormValid && !isSubmitting
                  ? 'bg-[#bd3227] hover:bg-[#a3261c] text-white active:scale-[0.99]'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{t.submittingBtn}</span>
                </>
              ) : (
                <>
                  <span>🔐</span>
                  <span>{t.submitBtn}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => logoutAdmin()}
              className="w-full py-2.5 px-4 rounded-xl text-xs text-[#5C5A55] hover:text-[#bd3227] hover:bg-[#fde8e7]/50 font-bold transition-all text-center cursor-pointer"
            >
              {t.signOutBtn}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

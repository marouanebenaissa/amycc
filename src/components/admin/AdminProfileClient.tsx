'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAdminLocale } from './AdminLocaleContext'
import {
  updateAdminPasswordAction,
  updateAdminProfileAction,
} from '@/lib/actions/admin'

interface AdminProfileClientProps {
  userId: string
  userEmail: string
  initialName: string
  roleTitle: string
  createdAt?: string
}

export function AdminProfileClient({
  userId,
  userEmail,
  initialName,
  roleTitle,
  createdAt,
}: AdminProfileClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialTab = searchParams.get('tab') === 'password' ? 'password' : 'info'

  const { isAr, isFr } = useAdminLocale()
  const [activeTab, setActiveTab] = useState<'info' | 'password'>(initialTab)

  // Profile Info Form State
  const [displayName, setDisplayName] = useState(initialName)
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileFeedback, setProfileFeedback] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  // Password Form State
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [passwordFeedback, setPasswordFeedback] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  // Translations
  const t = {
    title: isAr
      ? 'الملف الشخصي والأمان'
      : isFr
      ? 'Profil Personnel & Sécurité'
      : 'Personal Profile & Security',
    subtitle: isAr
      ? 'إدارة معلومات الحساب الإداري، مراجعة الصلاحيات، واستبدال كلمة المرور'
      : isFr
      ? 'Gérer vos informations administratives et modifier votre mot de passe'
      : 'Manage institutional administrator details, permissions, and update your password',
    tabInfo: isAr
      ? '👤 بيانات الحساب'
      : isFr
      ? '👤 Informations'
      : '👤 Profile Details',
    tabPassword: isAr
      ? '🔑 استبدال كلمة المرور'
      : isFr
      ? '🔑 Changer le Mot de Passe'
      : '🔑 Change Password',
    fullNameLabel: isAr
      ? 'الاسم الكامل / اسم العرض'
      : isFr
      ? 'Nom complet affiché'
      : 'Display Full Name',
    emailLabel: isAr
      ? 'البريد الإلكتروني المؤسساتي'
      : isFr
      ? 'Adresse e-mail institutionnelle'
      : 'Institutional Email Address',
    roleLabel: isAr
      ? 'الرتبة والصلاحية الأمنية'
      : isFr
      ? 'Rôle de sécurité'
      : 'Security Role',
    accountCreated: isAr
      ? 'تاريخ إنشاء الحساب'
      : isFr
      ? 'Compte créé le'
      : 'Account Created',
    saveProfileBtn: isAr
      ? 'حفظ بيانات الملف الشخصي'
      : isFr
      ? 'Enregistrer le Profil'
      : 'Save Profile Information',
    savingBtn: isAr
      ? 'جارٍ الحفظ...'
      : isFr
      ? 'Enregistrement...'
      : 'Saving Changes...',
    profileUpdatedSuccess: isAr
      ? 'تم تحديث بيانات الملف الشخصي بنجاح!'
      : isFr
      ? 'Profil mis à jour avec succès !'
      : 'Profile information updated successfully!',
    newPasswordLabel: isAr
      ? 'كلمة المرور الجديدة'
      : isFr
      ? 'Nouveau mot de passe'
      : 'New Password',
    confirmPasswordLabel: isAr
      ? 'تأكيد كلمة المرور الجديدة'
      : isFr
      ? 'Confirmer le mot de passe'
      : 'Confirm New Password',
    showPassword: isAr
      ? 'إظهار كلمة المرور'
      : isFr
      ? 'Afficher'
      : 'Show Password',
    hidePassword: isAr
      ? 'إخفاء كلمة المرور'
      : isFr
      ? 'Masquer'
      : 'Hide Password',
    passwordRequirements: isAr
      ? 'متطلبات الأمان لكلمة المرور:'
      : isFr
      ? 'Exigences de sécurité :'
      : 'Security Requirements:',
    reqLength: isAr
      ? '6 أحرف على الأقل'
      : isFr
      ? 'Au moins 6 caractères'
      : 'At least 6 characters',
    reqMatch: isAr
      ? 'تطابق كلمتي المرور'
      : isFr
      ? 'Les mots de passe correspondent'
      : 'Passwords match',
    updatePasswordBtn: isAr
      ? 'تثبيت واستبدال كلمة المرور'
      : isFr
      ? 'Mettre à jour le mot de passe'
      : 'Update & Apply Password',
    passwordUpdatedSuccess: isAr
      ? 'تم استبدال كلمة المرور بنجاح! كلمة المرور الجديدة سارية المفعول الآن.'
      : isFr
      ? 'Mot de passe modifié avec succès ! Il est immédiatement actif.'
      : 'Password replaced successfully! Your new password is now active.',
    passwordsDoNotMatch: isAr
      ? 'كلمتا المرور غير متطابقتين، يرجى التأكد وإعادة المحاولة.'
      : isFr
      ? 'Les mots de passe ne correspondent pas.'
      : 'Passwords do not match. Please verify.',
    passwordTooShort: isAr
      ? 'كلمة المرور يجب أن تتكون من 6 أحرف على الأقل.'
      : isFr
      ? 'Le mot de passe doit comporter au moins 6 caractères.'
      : 'Password must be at least 6 characters long.',
    systemProtectionNotice: isAr
      ? 'جلسة إدارية مشفرة خاضعة لسجل التدقيق المؤسسي وسياسات RLS.'
      : isFr
      ? 'Session chiffrée soumise au journal d\'audit et aux politiques RLS.'
      : 'Protected administrative session enforced by Audit Logs and RLS.',
  }

  const staffInitial = displayName
    ? displayName.charAt(0).toUpperCase()
    : userEmail.charAt(0).toUpperCase()

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString(
        isAr ? 'ar-MA' : isFr ? 'fr-FR' : 'en-US',
        {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }
      )
    : ''

  const isPasswordLengthValid = newPassword.length >= 6
  const isPasswordMatch =
    newPassword.length > 0 && newPassword === confirmPassword

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSavingProfile(true)
    setProfileFeedback(null)

    try {
      const res = await updateAdminProfileAction(displayName.trim())
      if (!res.success) {
        throw new Error(res.error || 'Failed to update profile')
      }
      setProfileFeedback({
        type: 'success',
        message: t.profileUpdatedSuccess,
      })
      router.refresh()
    } catch (err: unknown) {
      setProfileFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Error updating profile',
      })
    } finally {
      setSavingProfile(false)
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPasswordFeedback(null)

    if (!isPasswordLengthValid) {
      setPasswordFeedback({
        type: 'error',
        message: t.passwordTooShort,
      })
      return
    }

    if (!isPasswordMatch) {
      setPasswordFeedback({
        type: 'error',
        message: t.passwordsDoNotMatch,
      })
      return
    }

    setSavingPassword(true)

    try {
      const res = await updateAdminPasswordAction(newPassword)
      if (!res.success) {
        throw new Error(res.error || 'Failed to update password')
      }
      setPasswordFeedback({
        type: 'success',
        message: t.passwordUpdatedSuccess,
      })
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: unknown) {
      setPasswordFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Error updating password',
      })
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-gradient-to-br from-[#1c191a] via-[#241f20] to-[#161314] text-white rounded-3xl border border-white/10 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#bd3227] to-[#d2a82b] text-white flex items-center justify-center font-black text-2xl shadow-lg shrink-0">
            {staffInitial}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                {t.title}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-3xs font-bold text-emerald-300">
                ● {roleTitle}
              </span>
            </div>
            <p className="text-xs text-[#e5e0d6]/80 mt-1">{t.subtitle}</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'info'
                ? 'bg-[#bd3227] text-white shadow-md'
                : 'text-white/70 hover:text-white'
            }`}
          >
            {t.tabInfo}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('password')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'password'
                ? 'bg-[#bd3227] text-white shadow-md'
                : 'text-white/70 hover:text-white'
            }`}
          >
            {t.tabPassword}
          </button>
        </div>
      </div>

      {/* Tab 1: Profile Details */}
      {activeTab === 'info' && (
        <div className="bg-white rounded-3xl border border-[#e5e0d6] p-6 sm:p-8 shadow-xs space-y-6">
          {profileFeedback && (
            <div
              className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                profileFeedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              <span>{profileFeedback.type === 'success' ? '✅' : '⚠️'}</span>
              <span>{profileFeedback.message}</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Display Name */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#231f20]">
                  {t.fullNameLabel}
                </label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] text-xs font-semibold text-[#231f20] focus:ring-2 focus:ring-[#bd3227] focus:outline-none transition-all"
                  placeholder="Marouane Benaissa"
                />
              </div>

              {/* Email (Readonly) */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#231f20]">
                  {t.emailLabel}
                </label>
                <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-zinc-100 border border-[#e5e0d6] text-xs font-mono text-[#5C5A55]">
                  <span>🔒</span>
                  <span className="truncate">{userEmail}</span>
                </div>
              </div>

              {/* Role */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#231f20]">
                  {t.roleLabel}
                </label>
                <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-zinc-100 border border-[#e5e0d6] text-xs font-bold text-[#231f20]">
                  <span>🛡️</span>
                  <span>{roleTitle}</span>
                </div>
              </div>

              {/* Created At */}
              {formattedDate && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#231f20]">
                    {t.accountCreated}
                  </label>
                  <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-zinc-100 border border-[#e5e0d6] text-xs font-semibold text-[#5C5A55]">
                    <span>🗓️</span>
                    <span>{formattedDate}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#e5e0d6] flex items-center justify-between gap-4">
              <span className="text-3xs text-[#5C5A55]">
                User ID: <span className="font-mono">{userId}</span>
              </span>

              <button
                type="submit"
                disabled={savingProfile}
                className="px-6 py-2.5 rounded-xl bg-[#231f20] hover:bg-[#d2a82b] text-white text-xs font-black shadow-md transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
              >
                {savingProfile ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{t.savingBtn}</span>
                  </>
                ) : (
                  <>
                    <span>💾</span>
                    <span>{t.saveProfileBtn}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Change Password */}
      {activeTab === 'password' && (
        <div className="bg-white rounded-3xl border border-[#e5e0d6] p-6 sm:p-8 shadow-xs space-y-6">
          {passwordFeedback && (
            <div
              className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                passwordFeedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              <span>{passwordFeedback.type === 'success' ? '✅' : '⚠️'}</span>
              <span>{passwordFeedback.message}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* New Password */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#231f20]">
                  {t.newPasswordLabel}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] text-xs font-mono text-[#231f20] focus:ring-2 focus:ring-[#bd3227] focus:outline-none transition-all pe-10"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-sm text-[#5C5A55] hover:text-[#231f20] cursor-pointer"
                    title={showPassword ? t.hidePassword : t.showPassword}
                  >
                    {showPassword ? '👁️' : '🔒'}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#231f20]">
                  {t.confirmPasswordLabel}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] text-xs font-mono text-[#231f20] focus:ring-2 focus:ring-[#bd3227] focus:outline-none transition-all pe-10"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-sm text-[#5C5A55] hover:text-[#231f20] cursor-pointer"
                    title={showPassword ? t.hidePassword : t.showPassword}
                  >
                    {showPassword ? '👁️' : '🔒'}
                  </button>
                </div>
              </div>
            </div>

            {/* Password Validation Checklist */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] space-y-2">
              <span className="text-3xs font-extrabold text-[#231f20] block">
                {t.passwordRequirements}
              </span>
              <div className="flex flex-wrap items-center gap-4 text-3xs font-bold">
                <span
                  className={`flex items-center gap-1.5 transition-colors ${
                    isPasswordLengthValid ? 'text-emerald-700' : 'text-[#5C5A55]'
                  }`}
                >
                  <span>{isPasswordLengthValid ? '✓' : '○'}</span>
                  <span>{t.reqLength}</span>
                </span>
                <span
                  className={`flex items-center gap-1.5 transition-colors ${
                    isPasswordMatch ? 'text-emerald-700' : 'text-[#5C5A55]'
                  }`}
                >
                  <span>{isPasswordMatch ? '✓' : '○'}</span>
                  <span>{t.reqMatch}</span>
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#e5e0d6] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-3xs text-[#5C5A55]">
                🔒 {t.systemProtectionNotice}
              </span>

              <button
                type="submit"
                disabled={
                  savingPassword || !isPasswordLengthValid || !isPasswordMatch
                }
                className="px-6 py-2.5 rounded-xl bg-[#bd3227] hover:bg-[#a3261c] disabled:bg-zinc-300 text-white text-xs font-black shadow-md transition-all cursor-pointer disabled:cursor-not-allowed flex items-center gap-2 self-end sm:self-auto"
              >
                {savingPassword ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{t.savingBtn}</span>
                  </>
                ) : (
                  <>
                    <span>🔑</span>
                    <span>{t.updatePasswordBtn}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

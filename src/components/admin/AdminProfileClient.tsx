'use client'

import React, { useState, useRef } from 'react'
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
  initialAvatar?: string
  roleTitle: string
  createdAt?: string
}

export function AdminProfileClient({
  userId,
  userEmail,
  initialName,
  initialAvatar = '',
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
  const [avatarUrl, setAvatarUrl] = useState(initialAvatar)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const avatarFileInputRef = useRef<HTMLInputElement>(null)
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
    avatarSectionTitle: isAr
      ? 'الصورة الشخصية للمشرف'
      : isFr
      ? 'Photo de Profil'
      : 'Profile Picture',
    avatarHint: isAr
      ? 'الصيغ الموصى بها: JPG أو PNG أو WebP مربعة ونقية (الحد الأقصى 5 ميغابايت).'
      : isFr
      ? 'Formats recommandés : JPG, PNG ou WebP carrée (max 5 Mo).'
      : 'Recommended: Square JPG, PNG, or WebP photo (max 5MB).',
    uploadAvatarBtn: isAr
      ? 'تحميل صورة جديدة'
      : isFr
      ? 'Changer la photo'
      : 'Upload Photo',
    uploadingAvatar: isAr
      ? 'جارٍ الرفع...'
      : isFr
      ? 'Téléversement...'
      : 'Uploading...',
    removeAvatarBtn: isAr
      ? 'إزالة الصورة'
      : isFr
      ? 'Supprimer'
      : 'Remove Photo',
    avatarUploaded: isAr
      ? 'تم رفع الصورة بنجاح! اضغط على "حفظ بيانات الملف الشخصي" لتثبيتها.'
      : isFr
      ? 'Image téléversée ! Cliquez sur "Enregistrer" pour confirmer.'
      : 'Photo uploaded! Click "Save Profile Information" to apply.',
    avatarRemoved: isAr
      ? 'تمت إزالة الصورة. اضغط "حفظ بيانات الملف الشخصي" لتأكيد التغيير.'
      : isFr
      ? 'Photo supprimée. Cliquez sur "Enregistrer" pour confirmer.'
      : 'Photo removed. Click "Save Profile Information" to apply.',
    fileTooLarge: isAr
      ? 'حجم الصورة كبير جداً (الحد الأقصى 5 ميغابايت).'
      : isFr
      ? 'Fichier trop volumineux (max 5 Mo).'
      : 'File too large (max 5MB).',
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

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setProfileFeedback({
        type: 'error',
        message: t.fileTooLarge,
      })
      return
    }

    setUploadingAvatar(true)
    setProfileFeedback(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload image')
      }

      setAvatarUrl(data.url)
      setProfileFeedback({
        type: 'success',
        message: t.avatarUploaded,
      })
    } catch (err: unknown) {
      setProfileFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Error uploading photo',
      })
    } finally {
      setUploadingAvatar(false)
      if (avatarFileInputRef.current) {
        avatarFileInputRef.current.value = ''
      }
    }
  }

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSavingProfile(true)
    setProfileFeedback(null)

    try {
      const res = await updateAdminProfileAction(displayName.trim(), avatarUrl)
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
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-[#bd3227] to-[#d2a82b] text-white flex items-center justify-center font-black text-2xl shadow-lg shrink-0 border-2 border-white/20">
            {avatarUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              staffInitial
            )}
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

          {/* Dedicated Avatar Upload Box */}
          <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] flex flex-col sm:flex-row items-center gap-5">
            <div className="relative group shrink-0">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-[#bd3227] to-[#d2a82b] text-white flex items-center justify-center font-black text-3xl shadow-md border-2 border-white">
                {avatarUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  staffInitial
                )}
              </div>
              {uploadingAvatar && (
                <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center">
                  <span className="w-6 h-6 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                </div>
              )}
            </div>

            <div className="flex-1 text-center sm:text-start space-y-2">
              <div>
                <h3 className="text-xs font-black text-[#231f20]">
                  {t.avatarSectionTitle}
                </h3>
                <p className="text-3xs text-[#5C5A55] mt-0.5">
                  {t.avatarHint}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <input
                  ref={avatarFileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  id="avatar-upload-file"
                />

                <label
                  htmlFor="avatar-upload-file"
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-2xs ${
                    uploadingAvatar
                      ? 'bg-zinc-300 text-zinc-600 pointer-events-none'
                      : 'bg-[#231f20] hover:bg-[#d2a82b] text-white'
                  }`}
                >
                  <span>📷</span>
                  <span>{uploadingAvatar ? t.uploadingAvatar : t.uploadAvatarBtn}</span>
                </label>

                {avatarUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarUrl('')
                      setProfileFeedback({
                        type: 'success',
                        message: t.avatarRemoved,
                      })
                    }}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-all cursor-pointer"
                  >
                    <span>🗑️</span>
                    <span>{t.removeAvatarBtn}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

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
                disabled={savingProfile || uploadingAvatar}
                className="px-6 py-3 rounded-2xl bg-[#231f20] hover:bg-[#d2a82b] text-white text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm cursor-pointer"
              >
                {savingProfile ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
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
                    className="w-full px-4 py-3 pe-12 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] text-xs font-semibold text-[#231f20] focus:ring-2 focus:ring-[#bd3227] focus:outline-none transition-all"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute end-3.5 top-1/2 -translate-y-1/2 text-sm text-[#5C5A55] hover:text-[#231f20]"
                    title={showPassword ? t.hidePassword : t.showPassword}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#231f20]">
                  {t.confirmPasswordLabel}
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] text-xs font-semibold text-[#231f20] focus:ring-2 focus:ring-[#bd3227] focus:outline-none transition-all"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            {/* Validation Checklist */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6] space-y-2">
              <span className="text-3xs font-extrabold uppercase text-[#5C5A55] tracking-wider block">
                {t.passwordRequirements}
              </span>
              <div className="flex flex-col sm:flex-row gap-3">
                <div
                  className={`flex items-center gap-1.5 text-xs font-bold ${
                    isPasswordLengthValid ? 'text-emerald-700' : 'text-[#5C5A55]'
                  }`}
                >
                  <span>{isPasswordLengthValid ? '✓' : '○'}</span>
                  <span>{t.reqLength}</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 text-xs font-bold ${
                    isPasswordMatch ? 'text-emerald-700' : 'text-[#5C5A55]'
                  }`}
                >
                  <span>{isPasswordMatch ? '✓' : '○'}</span>
                  <span>{t.reqMatch}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#e5e0d6] flex items-center justify-between gap-4">
              <span className="text-3xs text-[#5C5A55] flex items-center gap-1">
                <span>🛡️</span>
                <span>{t.systemProtectionNotice}</span>
              </span>

              <button
                type="submit"
                disabled={savingPassword || !isPasswordLengthValid || !isPasswordMatch}
                className="px-6 py-3 rounded-2xl bg-[#bd3227] hover:bg-[#a0281f] text-white text-xs font-bold transition-all disabled:opacity-40 flex items-center gap-2 shadow-sm cursor-pointer"
              >
                {savingPassword ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
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

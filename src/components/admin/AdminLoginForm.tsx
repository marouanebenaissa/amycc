'use client'

import React, { useState } from 'react'
import { loginAdmin } from '@/lib/actions/admin'

interface AdminLoginFormProps {
  initialError?: string
}

export function AdminLoginForm({ initialError }: AdminLoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isPending, setIsPending] = useState(false)

  return (
    <div>
      {initialError && (
        <div
          role="alert"
          className="p-3.5 mb-5 rounded-2xl bg-[#fde8e7] text-[#bd3227] text-xs font-bold border border-[#bd3227]/25 flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1 duration-200"
        >
          <svg
            className="w-4 h-4 shrink-0 mt-0.5 text-[#bd3227]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span className="leading-relaxed">{initialError}</span>
        </div>
      )}

      <form
        action={loginAdmin}
        onSubmit={() => setIsPending(true)}
        className="space-y-4"
      >
        {/* Email Address */}
        <div>
          <label
            htmlFor="admin-email"
            className="block text-2xs font-bold uppercase tracking-wider text-[#5C5A55] mb-1.5"
          >
            <span className="text-[#231f20]">البريد الإلكتروني المؤسساتي</span>
            <span className="text-[#5C5A55] font-normal mx-1.5">/</span>
            <span>Institutional Email</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-[#5C5A55]">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.75}
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg>
            </div>
            <input
              id="admin-email"
              type="email"
              name="email"
              autoComplete="email"
              required
              className="w-full ps-10 pe-4 py-3 rounded-xl border border-[#e5e0d6] bg-[#FAF8F5]/60 hover:bg-white focus:bg-white text-sm text-[#231f20] placeholder-[#5C5A55]/50 focus:border-[#d2a82b] focus:ring-2 focus:ring-[#ffd22f]/30 outline-none transition-all"
              placeholder="admin@amycc.org"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="admin-password"
            className="block text-2xs font-bold uppercase tracking-wider text-[#5C5A55] mb-1.5"
          >
            <span className="text-[#231f20]">كلمة المرور المشفرة</span>
            <span className="text-[#5C5A55] font-normal mx-1.5">/</span>
            <span>Encrypted Password</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-[#5C5A55]">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.75}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <input
              id="admin-password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              autoComplete="current-password"
              required
              className="w-full ps-10 pe-11 py-3 rounded-xl border border-[#e5e0d6] bg-[#FAF8F5]/60 hover:bg-white focus:bg-white text-sm text-[#231f20] placeholder-[#5C5A55]/50 focus:border-[#d2a82b] focus:ring-2 focus:ring-[#ffd22f]/30 outline-none transition-all"
              placeholder="••••••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
              className="absolute inset-y-0 end-0 pe-3.5 flex items-center text-[#5C5A55] hover:text-[#231f20] focus:outline-none transition-colors"
            >
              {showPassword ? (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.75}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.75}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.75}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Submit CTA */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full mt-2 py-3.5 px-5 rounded-xl font-bold text-white bg-[#bd3227] hover:bg-[#a3261c] active:scale-[0.99] disabled:opacity-75 disabled:pointer-events-none transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 text-sm group cursor-pointer"
        >
          {isPending ? (
            <>
              <svg
                className="animate-spin -ms-1 me-2 h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>جاري التحقق من الصلاحيات...</span>
            </>
          ) : (
            <>
              <span>تسجيل الدخول إلى لوحة التحكم</span>
              <span className="opacity-80 font-normal text-xs">/ Sign In</span>
              <svg
                className="w-4 h-4 rtl:rotate-180 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </>
          )}
        </button>
      </form>
    </div>
  )
}

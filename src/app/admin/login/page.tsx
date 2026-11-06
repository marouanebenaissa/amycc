import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { AdminLoginForm } from '@/components/admin/AdminLoginForm'

export default async function AdminLoginPage(props: {
  searchParams: Promise<{ error?: string }>
}) {
  const searchParams = await props.searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/admin')
  }

  return (
    <div className="relative w-full max-w-lg mx-auto my-8 sm:my-12 px-4 z-10">
      {/* Decorative Moroccan Atmospheric Lighting */}
      <div
        className="absolute -top-24 -end-24 w-80 h-80 bg-[#ffd22f]/20 rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 -start-24 w-80 h-80 bg-[#bd3227]/12 rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Main Luxury Institutional Card */}
      <div className="bg-white/95 backdrop-blur-xl rounded-[28px] sm:rounded-3xl border border-[#e5e0d6] shadow-[0_20px_60px_-15px_rgba(35,31,32,0.08)] overflow-hidden">
        {/* Moroccan Signature Tricolor Trim */}
        <div
          className="h-1.5 w-full bg-gradient-to-r from-[#bd3227] via-[#ffd22f] to-[#d2a82b]"
          aria-hidden="true"
        />

        <div className="p-6 sm:p-10">
          {/* Official Emblem & Institutional Typography */}
          <div className="text-center mb-7">
            {/* Seal Emblem */}
            <div className="relative inline-block mb-3.5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-b from-white via-[#FAF8F5] to-[#FEF6CC]/60 border-2 border-[#d2a82b]/40 flex items-center justify-center p-3 shadow-md mx-auto">
                <Image
                  src="/logo.png"
                  alt="AMYCC Emblem"
                  width={56}
                  height={56}
                  className="object-contain w-auto h-auto"
                  priority
                />
              </div>
              {/* Active Encryption Indicator */}
              <span
                className="absolute -bottom-1 -end-1 w-4 h-4 rounded-full bg-[#18794E] border-2 border-white shadow-xs"
                title="بوابة مؤمنة / Secure Gateway"
                aria-label="Secure Gateway"
              />
            </div>

            {/* Institutional Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FEF6CC] text-[#8C6A14] border border-[#d2a82b]/35 text-2xs font-bold mb-3 shadow-2xs">
              <span className="text-[#d2a82b]">✦</span>
              <span>بوابة الإدارة المعتمدة • AMYCC Portal</span>
            </div>

            {/* Primary Headings */}
            <h1 className="text-2xl sm:text-[26px] font-black text-[#231f20] tracking-tight">
              تسجيل دخول الإدارة المركزية
            </h1>
            <p className="text-xs font-extrabold text-[#bd3227] mt-1.5">
              جمعية روح الفنون والثقافة — المملكة المغربية
            </p>
            <p className="text-3xs text-[#5C5A55] mt-1 font-medium">
              Spirit of Arts & Culture Association • AMYCC Administration
            </p>
          </div>

          {/* Interactive Login Form (Client Component with password toggle & pending state) */}
          <AdminLoginForm initialError={searchParams.error} />

          {/* Subtle Moroccan Hairline */}
          <div className="gold-hairline my-6 opacity-75" aria-hidden="true" />

          {/* Security & Statutory Credentials */}
          <div className="space-y-3">
            <div className="rounded-xl bg-[#FAF8F5] p-3 border border-[#e5e0d6]/80 text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-3xs font-bold text-[#231f20]">
                <svg
                  className="w-3.5 h-3.5 text-[#18794E] shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span>خاضعة لمقتضيات الظهير الشريف رقم 1.58.376</span>
              </div>
              <p className="text-4xs text-[#5C5A55] font-medium">
                Protected Area • Row Level Security & Session Auditing Enforced
              </p>
            </div>

            {/* Back to Website Navigation */}
            <Link
              href="/ar"
              className="inline-flex items-center justify-center gap-2 text-xs font-bold text-[#bd3227] hover:text-[#a3261c] hover:bg-[#FAF8F5] py-2.5 px-4 rounded-xl transition-all w-full border border-transparent hover:border-[#e5e0d6] group"
            >
              <svg
                className="w-4 h-4 rtl:rotate-180 transition-transform group-hover:-translate-x-1 rtl:group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span>العودة إلى البوابة العامة (الموقع الرئيسي)</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

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
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#FAF8F5] text-[#231f20] selection:bg-[#ffd22f]/30">
      {/* ============================================================
          LEFT COLUMN: MOROCCAN INSTITUTIONAL SHOWCASE (DESKTOP)
          Fills screen width, elevates brand prestige, eliminates void
          ============================================================ */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-5/12 bg-[#181516] text-white relative overflow-hidden flex-col justify-between p-10 xl:p-14 border-e border-[#d2a82b]/30 shrink-0">
        {/* Moroccan Geometric Star Background */}
        <div
          className="absolute inset-0 moroccan-pattern opacity-35 pointer-events-none"
          aria-hidden="true"
        />

        {/* Ambient Warm Architectural Lighting */}
        <div
          className="absolute -top-32 -start-32 w-96 h-96 bg-[#d2a82b]/20 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-32 -end-32 w-96 h-96 bg-[#bd3227]/20 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        {/* 1. Top Section: Legal Framework & Seal Header */}
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#231f20] border border-[#d2a82b]/40 text-2xs font-bold text-[#ffd22f] shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#18794E] animate-pulse" />
            <span>المملكة المغربية • الظهير الشريف رقم 1.58.376</span>
          </div>

          <div className="pt-2 flex items-center gap-3.5">
            <div className="relative shrink-0">
              <Image
                src="/logo.png"
                alt="AMYCC Logo"
                width={52}
                height={52}
                className="object-contain w-12 h-12"
                priority
              />
            </div>
            <div>
              <h2 className="text-xl xl:text-2xl font-black text-white tracking-tight leading-snug">
                جمعية روح الفنون والثقافة
              </h2>
              <p className="text-2xs font-bold text-[#d2a82b] font-mono tracking-wide">
                Spirit of Arts & Culture Association • Marrakech
              </p>
            </div>
          </div>
        </div>

        {/* 2. Middle Section: Institutional Pillars & Purpose */}
        <div className="relative z-10 space-y-6 my-auto py-8">
          <div className="space-y-2">
            <span className="text-3xs uppercase tracking-widest text-[#d2a82b] font-bold">
              ✦ البوابة الإدارية المركزية
            </span>
            <p className="text-xs xl:text-sm text-[#cfcac2] leading-relaxed font-medium">
              فضاء التدبير المؤسساتي المخصص للمكتب التنفيذي والمسؤولين المخولين، لإدارة البرامج، تنظيم الفعاليات، ومواكبة الأثر المجتمعي والثقافي للشباب.
            </p>
          </div>

          {/* Three Feature Highlight Cards */}
          <div className="space-y-3">
            {/* Pillar 1 */}
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#231f20]/80 border border-[#383334] backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-[#d2a82b]/15 text-[#ffd22f] flex items-center justify-center shrink-0 text-base">
                🏛️
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs font-bold text-white">
                  التدبير المؤسساتي المتكامل
                </h3>
                <p className="text-3xs text-[#a8a39b] leading-normal">
                  إدارة محترفات الفنون والتراث، الفعاليات الثقافية، واستمارات العضوية والتطوع.
                </p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#231f20]/80 border border-[#383334] backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-[#bd3227]/20 text-[#fde8e7] flex items-center justify-center shrink-0 text-base">
                🛡️
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs font-bold text-white">
                  منظومة أمنية مشفرة ومطابقة
                </h3>
                <p className="text-3xs text-[#a8a39b] leading-normal">
                  سجل تدقيق كامل للجلسات (Audit Trail) مع حماية المعطيات وفق القانون 09-08.
                </p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#231f20]/80 border border-[#383334] backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-[#ffd22f]/15 text-[#ffd22f] flex items-center justify-center shrink-0 text-base">
                🇲🇦
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs font-bold text-white">
                  صون التراث والتمكين الشبابي
                </h3>
                <p className="text-3xs text-[#a8a39b] leading-normal">
                  إشعاع ثقافي متجدد ينطلق من مدينة مراكش ليمتد نحو كافة جهات المملكة.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Bottom Section: Compliance & Engine Tag */}
        <div className="relative z-10 pt-5 border-t border-[#383334] flex items-center justify-between text-3xs text-[#8a857b]">
          <span>© 2026 AMYCC • إدارة المنصة المركزية</span>
          <span className="font-mono text-[#ffd22f]">AMYCC Institutional Portal</span>
        </div>
      </div>

      {/* ============================================================
          RIGHT COLUMN: AUTHENTICATION FORM & DIRECT ENTRY
          Responsive, elegant, fills viewport height and width
          ============================================================ */}
      <div className="w-full lg:w-1/2 xl:w-7/12 min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 relative overflow-y-auto">
        {/* Decorative Atmospheric Glows for Form Area */}
        <div
          className="absolute top-1/4 -end-20 w-80 h-80 bg-[#ffd22f]/15 rounded-full blur-3xl pointer-events-none -z-10"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-10 start-10 w-80 h-80 bg-[#bd3227]/10 rounded-full blur-3xl pointer-events-none -z-10"
          aria-hidden="true"
        />

        {/* Top Header Row with Return to Site Navigation */}
        <div className="flex items-center justify-between w-full pb-4">
          {/* Mobile Association Brand (visible on mobile/tablet) */}
          <div className="lg:hidden flex items-center gap-2.5">
            <Image
              src="/logo.png"
              alt="AMYCC Logo"
              width={36}
              height={36}
              className="object-contain w-8 h-8"
              priority
            />
            <span className="text-xs font-black text-[#231f20]">
              جمعية روح الفنون والثقافة
            </span>
          </div>

          {/* Back to Public Portal Link */}
          <Link
            href="/ar"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#bd3227] hover:text-[#a3261c] px-3.5 py-2 rounded-xl hover:bg-white border border-transparent hover:border-[#e5e0d6] transition-all ms-auto group"
          >
            <span className="rtl:rotate-180 transition-transform group-hover:-translate-x-1 rtl:group-hover:translate-x-1">
              ←
            </span>
            <span>العودة إلى الموقع الرئيسي</span>
          </Link>
        </div>

        {/* Central Authentication Card */}
        <div className="w-full max-w-md mx-auto my-auto py-6 sm:py-8">
          <div className="bg-white/95 backdrop-blur-xl rounded-[28px] sm:rounded-3xl border border-[#e5e0d6] shadow-[0_20px_50px_-15px_rgba(35,31,32,0.07)] overflow-hidden">
            {/* Moroccan Signature Tricolor Ribbon */}
            <div
              className="h-1.5 w-full bg-gradient-to-r from-[#bd3227] via-[#ffd22f] to-[#d2a82b]"
              aria-hidden="true"
            />

            <div className="p-6 sm:p-9">
              {/* Card Header & Standalone Logo */}
              <div className="text-center mb-7">
                {/* Standalone Logo — No Frame or Box */}
                <div className="relative inline-flex items-center justify-center mb-3">
                  <Image
                    src="/logo.png"
                    alt="AMYCC Logo"
                    width={64}
                    height={64}
                    className="object-contain w-14 h-14 sm:w-16 sm:h-16 transition-transform duration-300 hover:scale-105"
                    priority
                  />
                </div>

                {/* Institutional Pill Badge */}
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FEF6CC] text-[#8C6A14] border border-[#d2a82b]/35 text-2xs font-bold mb-2.5 shadow-2xs">
                    <span className="text-[#d2a82b]">✦</span>
                    <span>بوابة الإدارة المعتمدة • AMYCC Portal</span>
                  </span>
                </div>

                {/* Primary Headings */}
                <h1 className="text-2xl sm:text-[25px] font-black text-[#231f20] tracking-tight">
                  تسجيل دخول الإدارة المركزية
                </h1>
                <p className="text-xs text-[#5C5A55] mt-1 font-medium">
                  أدخل بيانات الاعتماد المخولة لولوج لوحة الإدارة
                </p>
              </div>

              {/* Interactive Form Component */}
              <AdminLoginForm initialError={searchParams.error} />

              {/* Hairline Divider */}
              <div className="gold-hairline my-6 opacity-75" aria-hidden="true" />

              {/* Statutory Credentials & Security Notice */}
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
                  <span>منظومة مؤمنة خاضعة للظهير الشريف رقم 1.58.376</span>
                </div>
                <p className="text-4xs text-[#5C5A55] font-medium">
                  Row Level Security (RLS) & Session Auditing Enforced
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer Row */}
        <div className="text-center pt-4 text-3xs text-[#8a857b]">
          <span>جمعية روح الفنون والثقافة — مراكش • المملكة المغربية</span>
        </div>
      </div>
    </div>
  )
}

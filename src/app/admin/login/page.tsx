import { loginAdmin } from '@/lib/actions/admin'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default async function AdminLoginPage(props: {
  searchParams: Promise<{ error?: string }>
}) {
  const searchParams = await props.searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/admin')
  }

  return (
    <div className="w-full max-w-md mx-auto my-12 px-4">
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#e5e0d6] shadow-card">
        {/* Seal & Heading */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#0d3b43] border border-[#14505b] flex items-center justify-center mx-auto mb-4 p-2 shadow-subtle">
            <Image
              src="/logo.png"
              alt="AMYCC Logo"
              width={40}
              height={40}
              className="object-contain w-auto h-auto"
              priority
            />
          </div>
          <h1 className="text-2xl font-black text-[#08242a] tracking-tight">
            AMYCC Administration
          </h1>
          <p className="text-xs font-semibold text-[#0d3b43] mt-1">
            جمعية روح الفنون والثقافة
          </p>
          <p className="text-3xs text-[#5f7174] mt-1">
            Sign in with authorized association credentials
          </p>
        </div>

        {searchParams.error && (
          <div className="p-3.5 mb-6 rounded-xl bg-[#fae4dc] text-[#c85a32] text-xs font-bold border border-[#f2c2b0]">
            {searchParams.error}
          </div>
        )}

        <form action={loginAdmin} className="space-y-4">
          <div>
            <label className="block text-2xs font-bold uppercase tracking-wider text-[#445457] mb-1.5">
              Email Address / البريد الإلكتروني
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-[#e5e0d6] text-sm text-[#08242a] focus:border-[#0d3b43] focus:ring-1 focus:ring-[#0d3b43] outline-none transition-all"
              placeholder="admin@amycc.org"
            />
          </div>

          <div>
            <label className="block text-2xs font-bold uppercase tracking-wider text-[#445457] mb-1.5">
              Password / كلمة المرور
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-[#e5e0d6] text-sm text-[#08242a] focus:border-[#0d3b43] focus:ring-1 focus:ring-[#0d3b43] outline-none transition-all"
              placeholder="••••••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-[#0d3b43] hover:bg-[#14505b] active:scale-98 transition-all shadow-subtle hover:shadow-card text-sm mt-3"
          >
            Sign In to Dashboard / تسجيل الدخول
          </button>
        </form>

        <div className="pt-6 mt-6 border-t border-[#f4ede2] text-center space-y-2">
          <p className="text-3xs text-[#819598]">
            Protected institutional area. Row Level Security & Session Auditing Enforced.
          </p>
          <Link
            href="/ar"
            className="inline-block text-2xs font-bold text-[#c85a32] hover:underline"
          >
            ← العودة إلى الموقع الرئيسي / Back to Website
          </Link>
        </div>
      </div>
    </div>
  )
}

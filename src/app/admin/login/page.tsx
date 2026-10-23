import { loginAdmin } from '@/lib/actions/admin'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

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
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#0068ff] flex items-center justify-center font-extrabold text-white text-lg mx-auto mb-4 shadow-sm">
            AM
          </div>
          <h1 className="text-2xl font-extrabold text-[#0a0f1d]">AMYCC Admin Login</h1>
          <p className="text-xs text-slate-500 mt-1">
            Sign in with authorized association credentials
          </p>
        </div>

        {searchParams.error && (
          <div className="p-3 mb-4 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
            {searchParams.error}
          </div>
        )}

        <form action={loginAdmin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0068ff] focus:ring-1 focus:ring-[#0068ff] outline-none"
              placeholder="admin@amycc.org"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0068ff] focus:ring-1 focus:ring-[#0068ff] outline-none"
              placeholder="••••••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl font-bold text-white bg-[#0068ff] hover:bg-[#0054d1] transition-all shadow-sm text-sm mt-2"
          >
            Sign In to Dashboard
          </button>
        </form>

        <p className="text-2xs text-slate-400 text-center mt-6">
          Protected area. Unauthorized access is strictly logged and restricted.
        </p>
      </div>
    </div>
  )
}

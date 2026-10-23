import type { Metadata } from 'next'
import '../globals.css'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { logoutAdmin } from '@/lib/actions/admin'

export const metadata: Metadata = {
  title: 'AMYCC Admin Dashboard',
  robots: { index: false, follow: false },
}

const navItems = [
  { href: '/admin', label: 'Overview', icon: '📊' },
  { href: '/admin/programs', label: 'Programs', icon: '🎨' },
  { href: '/admin/events', label: 'Events', icon: '📅' },
  { href: '/admin/news', label: 'News', icon: '📰' },
  { href: '/admin/memberships', label: 'Memberships', icon: '👥' },
  { href: '/admin/volunteers', label: 'Volunteers', icon: '🤝' },
  { href: '/admin/partnerships', label: 'Partnerships', icon: '🏛️' },
  { href: '/admin/donations', label: 'Donations', icon: '💝' },
  { href: '/admin/users', label: 'Users & Roles', icon: '🛡️' },
  { href: '/admin/audit-logs', label: 'Audit Logs', icon: '📜' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="en" className="h-full bg-slate-50">
      <body className="min-h-full flex flex-col md:flex-row text-slate-800 font-sans antialiased">
        {user ? (
          <>
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-[#0a0f1d] text-white flex flex-col justify-between p-6 shrink-0 border-r border-slate-800">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-[#0068ff] flex items-center justify-center font-bold text-white text-sm">
                    AM
                  </div>
                  <div>
                    <span className="font-extrabold text-sm block leading-tight">AMYCC</span>
                    <span className="text-2xs text-slate-400">Admin Control</span>
                  </div>
                </div>

                <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-220px)] pr-1" aria-label="Admin Navigation">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all"
                    >
                      <span className="text-sm">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </nav>
              </div>

              {/* User profile & Logout */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="text-2xs text-slate-400 truncate">
                  Signed in as: <br />
                  <strong className="text-white text-xs">{user.email}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <Link
                    href="/ar"
                    className="text-2xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    View Website ↗
                  </Link>
                  <form action={logoutAdmin}>
                    <button
                      type="submit"
                      className="text-2xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-red-950 hover:text-red-300 text-slate-300 transition-colors"
                    >
                      Sign Out
                    </button>
                  </form>
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-6 md:p-10">
              {children}
            </main>
          </>
        ) : (
          <main className="flex-1 flex items-center justify-center p-6">
            {children}
          </main>
        )}
      </body>
    </html>
  )
}

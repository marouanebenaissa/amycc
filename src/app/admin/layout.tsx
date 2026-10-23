import type { Metadata } from 'next'
import '../globals.css'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { logoutAdmin } from '@/lib/actions/admin'

export const metadata: Metadata = {
  title: 'AMYCC Admin Dashboard — جمعية روح الفنون والثقافة',
  robots: { index: false, follow: false },
}

const navItems = [
  { href: '/admin', label: 'Overview', icon: '📊' },
  { href: '/admin/programs', label: 'Programs CMS', icon: '🎨' },
  { href: '/admin/events', label: 'Events CMS', icon: '📅' },
  { href: '/admin/registrations', label: 'Registrations', icon: '🎟️' },
  { href: '/admin/news', label: 'News & Press', icon: '📰' },
  { href: '/admin/memberships', label: 'Memberships', icon: '👥' },
  { href: '/admin/volunteers', label: 'Volunteers (Youth in Action)', icon: '🤝' },
  { href: '/admin/partnerships', label: 'Partnerships', icon: '🏛️' },
  { href: '/admin/contacts', label: 'Contact Messages', icon: '💬' },
  { href: '/admin/donations', label: 'Support & Donations', icon: '💝' },
  { href: '/admin/gallery', label: 'Gallery & Media', icon: '🖼️' },
  { href: '/admin/users', label: 'Users & Roles (RBAC)', icon: '🛡️' },
  { href: '/admin/audit-logs', label: 'Audit Logs', icon: '📜' },
  { href: '/admin/settings', label: 'Site Settings', icon: '⚙️' },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="en" className="h-full bg-[#faf7f2]">
      <body className="min-h-full flex flex-col md:flex-row text-[#111a1c] font-sans antialiased">
        {user ? (
          <>
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 bg-[#08242a] text-white flex flex-col justify-between p-6 shrink-0 border-r border-[#14505b]/40">
              <div>
                {/* Brand Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#c85a32] flex items-center justify-center font-black text-white text-base shadow-sm">
                    AM
                  </div>
                  <div>
                    <span className="font-black text-sm block leading-tight tracking-tight text-white">
                      AMYCC Control
                    </span>
                    <span className="text-3xs text-[#74bfcd] font-semibold">
                      روح الفنون والثقافة
                    </span>
                  </div>
                </div>

                {/* Nav Items */}
                <nav
                  className="space-y-1 overflow-y-auto max-h-[calc(100vh-230px)] pr-1"
                  aria-label="Admin Navigation"
                >
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-[#d8f0f4] hover:text-white hover:bg-[#14505b] active:scale-98 transition-all"
                    >
                      <span className="text-sm shrink-0" aria-hidden="true">{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                    </Link>
                  ))}
                </nav>
              </div>

              {/* User Session & Logout */}
              <div className="pt-4 border-t border-[#14505b]/60 space-y-3">
                <div className="text-3xs text-[#74bfcd] truncate">
                  Authenticated as: <br />
                  <strong className="text-white text-xs">{user.email}</strong>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <Link
                    href="/ar"
                    className="text-2xs font-bold text-[#f4ce83] hover:text-white transition-colors"
                  >
                    View Site ↗
                  </Link>
                  <form action={logoutAdmin}>
                    <button
                      type="submit"
                      className="text-2xs font-bold px-3 py-1.5 rounded-lg bg-[#0d3b43] hover:bg-[#c85a32] text-white transition-colors shadow-xs"
                    >
                      Sign Out
                    </button>
                  </form>
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#faf7f2]">
              {children}
            </main>
          </>
        ) : (
          <main className="flex-1 flex items-center justify-center p-6 bg-[#faf7f2]">
            {children}
          </main>
        )}
      </body>
    </html>
  )
}

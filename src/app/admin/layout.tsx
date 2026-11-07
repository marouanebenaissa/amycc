import type { Metadata } from 'next'
import '../globals.css'
import { Sora, Cairo } from 'next/font/google'
import { createClient } from '@/lib/supabase/server'
import { AdminLayoutClient } from '@/components/admin/AdminLayoutClient'
import { getCurrentUserRole, getCurrentUserCustomPermissions } from '@/lib/auth/server-rbac'
import { PREDEFINED_ROLES } from '@/lib/auth/rbac'

const sora = Sora({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
})

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-arabic',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'لوحة التحكم — AMYCC Institutional Admin',
  robots: { index: false, follow: false },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let userFullName: string | null = null
  let userAvatarUrl: string | null = null
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .maybeSingle()
    userFullName =
      profile?.full_name ??
      (user.user_metadata?.full_name as string) ??
      (user.user_metadata?.name as string) ??
      null
    userAvatarUrl =
      (user.user_metadata?.avatar_url as string) ??
      (user.user_metadata?.picture as string) ??
      null
  }

  const userRole = user ? await getCurrentUserRole(user.id) : PREDEFINED_ROLES[0]
  const customPermissions = user ? await getCurrentUserCustomPermissions(user.id) : null

  return (
    <html
      lang="ar"
      dir="rtl"
      className={`h-full ${sora.variable} ${cairo.variable}`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full text-[#231f20] bg-[#FAF8F5] antialiased"
        suppressHydrationWarning
      >
        {user ? (
          <AdminLayoutClient
            userEmail={user.email || 'admin@amycc.org'}
            userName={userFullName}
            userAvatar={userAvatarUrl}
            userRole={userRole}
            customPermissions={customPermissions}
            mustChangePassword={Boolean(user.user_metadata?.must_change_password)}
          >
            {children}
          </AdminLayoutClient>
        ) : (
          <main className="min-h-screen w-full bg-[#FAF8F5]">
            {children}
          </main>
        )}
      </body>
    </html>
  )
}

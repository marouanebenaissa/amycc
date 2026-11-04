import type { Metadata } from 'next'
import '../globals.css'
import { Cairo, Sora } from 'next/font/google'
import { createClient } from '@/lib/supabase/server'
import { AdminLayoutClient } from '@/components/admin/AdminLayoutClient'

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-cairo',
  display: 'swap',
})

const sora = Sora({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-sora',
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
  const { data: { user } } = await supabase.auth.getUser()

  let userFullName: string | null = null
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .maybeSingle()
    userFullName = profile?.full_name ?? null
  }

  return (
    <html lang="ar" dir="rtl" className={`h-full ${cairo.variable} ${sora.variable}`} suppressHydrationWarning>
      <body className="min-h-full text-[#231f20] bg-[#F5F3EE] font-arabic antialiased" suppressHydrationWarning>
        {user ? (
          <AdminLayoutClient
            userEmail={user.email || 'admin@amycc.org'}
            userName={userFullName}
          >
            {children}
          </AdminLayoutClient>
        ) : (
          <main className="min-h-screen flex items-center justify-center p-6 bg-[#F5F3EE]">
            {children}
          </main>
        )}
      </body>
    </html>
  )
}

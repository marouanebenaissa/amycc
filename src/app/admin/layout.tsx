import type { Metadata } from 'next'
import '../globals.css'
import { Sora, Cairo } from 'next/font/google'
import { createClient } from '@/lib/supabase/server'
import { AdminLayoutClient } from '@/components/admin/AdminLayoutClient'

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
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .maybeSingle()
    userFullName = profile?.full_name ?? null
  }

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

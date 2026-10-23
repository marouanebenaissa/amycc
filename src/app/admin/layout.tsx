import type { Metadata } from 'next'
import '../globals.css'
import { Cairo, Sora } from 'next/font/google'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

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
    <html lang="ar" dir="rtl" className={`h-full ${cairo.variable} ${sora.variable}`}>
      <body className="min-h-full flex flex-col md:flex-row text-[#08242a] bg-[#faf7f2] font-arabic antialiased">
        {user ? (
          <>
            <AdminSidebar
              userEmail={user.email || 'admin@amycc.org'}
              userName={userFullName}
            />

            <main className="flex-1 overflow-y-auto p-5 sm:p-8 md:p-10 max-w-7xl">
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

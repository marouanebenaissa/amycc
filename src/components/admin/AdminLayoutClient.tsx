'use client'

import React, { useState } from 'react'
import { AdminLocaleProvider } from './AdminLocaleContext'
import { AdminSidebar } from './AdminSidebar'
import { AdminTopHeader } from './AdminTopHeader'

interface AdminLayoutClientProps {
  userEmail: string
  userName?: string | null
  userAvatar?: string | null
  children: React.ReactNode
}

export function AdminLayoutClient({
  userEmail,
  userName,
  userAvatar,
  children,
}: AdminLayoutClientProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <AdminLocaleProvider>
      <div className="min-h-screen flex text-[#231f20] bg-[#FAF8F5] transition-colors">
        <AdminSidebar
          userEmail={userEmail}
          userName={userName}
          userAvatar={userAvatar}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />

        <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
          <AdminTopHeader
            userEmail={userEmail}
            userName={userName}
            userAvatar={userAvatar}
            onToggleMobileMenu={() => setMobileOpen((prev) => !prev)}
          />

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </AdminLocaleProvider>
  )
}

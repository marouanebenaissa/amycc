'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAdminLocale, ADMIN_NAV_CATEGORIES } from './AdminLocaleContext'
import { logoutAdmin } from '@/lib/actions/admin'

interface AdminTopHeaderProps {
  userEmail: string
  userName?: string | null
  onToggleMobileMenu?: () => void
}

export function AdminTopHeader({
  userEmail,
  userName,
  onToggleMobileMenu,
}: AdminTopHeaderProps) {
  const pathname = usePathname()
  const { locale, setLocale, isAr, isFr, t } = useAdminLocale()

  // Find active item info for breadcrumb
  let activeCategoryTitle = ''
  let activeItemTitle = ''

  for (const cat of ADMIN_NAV_CATEGORIES) {
    for (const item of cat.items) {
      if (item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)) {
        activeCategoryTitle = isAr ? cat.titleAr : isFr ? cat.titleFr : cat.titleEn
        activeItemTitle = isAr ? item.labelAr : isFr ? item.labelFr : item.labelEn
        break
      }
    }
    if (activeItemTitle) break
  }

  const publicSiteLocale = locale === 'fr' ? 'fr' : locale === 'en' ? 'en' : 'ar'

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#e5e0d6] px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4 transition-all shadow-2xs">
      {/* Left / Start: Mobile Menu Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-xl bg-[#F5F3EE] hover:bg-[#FEF6CC] border border-[#e5e0d6] text-[#231f20] focus:outline-none transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        <div className="min-w-0">
          <nav aria-label="Breadcrumbs" className="flex items-center gap-1.5 text-3xs font-semibold text-[#5C5A55]">
            <Link href="/admin" className="hover:text-[#231f20] transition-colors">
              {t('admin_title')}
            </Link>
            {activeCategoryTitle && (
              <>
                <span className="text-slate-300">/</span>
                <span className="truncate">{activeCategoryTitle}</span>
              </>
            )}
          </nav>
          <h1 className="text-sm sm:text-base font-black text-[#231f20] truncate leading-tight">
            {activeItemTitle || t('admin_title')}
          </h1>
        </div>
      </div>

      {/* Right / End: Language Switcher, Public Site Link & User Chip */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Language Switcher Pills */}
        <div className="flex items-center p-1 rounded-xl bg-[#F5F3EE] border border-[#e5e0d6] shadow-2xs">
          <button
            type="button"
            onClick={() => setLocale('ar')}
            className={`px-2.5 py-1 rounded-lg text-2xs font-extrabold transition-all ${
              locale === 'ar'
                ? 'bg-[#231f20] text-white shadow-xs'
                : 'text-[#5C5A55] hover:text-[#231f20]'
            }`}
            title="اللغة العربية"
          >
            عربي
          </button>
          <button
            type="button"
            onClick={() => setLocale('fr')}
            className={`px-2.5 py-1 rounded-lg text-2xs font-extrabold transition-all ${
              locale === 'fr'
                ? 'bg-[#231f20] text-white shadow-xs'
                : 'text-[#5C5A55] hover:text-[#231f20]'
            }`}
            title="Français"
          >
            FR
          </button>
          <button
            type="button"
            onClick={() => setLocale('en')}
            className={`px-2.5 py-1 rounded-lg text-2xs font-extrabold transition-all ${
              locale === 'en'
                ? 'bg-[#231f20] text-white shadow-xs'
                : 'text-[#5C5A55] hover:text-[#231f20]'
            }`}
            title="English"
          >
            EN
          </button>
        </div>

        {/* View Public Site */}
        <Link
          href={`/${publicSiteLocale}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#F5F3EE] border border-[#e5e0d6] text-2xs font-bold text-[#231f20] transition-all hover:border-[#231f20]/30 shadow-2xs group"
        >
          <span>🌐</span>
          <span>{t('view_site')}</span>
          <span className="text-3xs text-[#5C5A55] group-hover:text-[#bd3227] transition-colors">↗</span>
        </Link>

        {/* User Identity Chip */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F5F3EE] border border-[#e5e0d6]">
          <div className="w-6 h-6 rounded-lg bg-[#bd3227] text-white font-bold text-3xs flex items-center justify-center">
            AM
          </div>
          <div className="text-start leading-none max-w-[120px]">
            <span className="text-3xs font-bold text-[#231f20] block truncate">
              {userName || 'Admin'}
            </span>
            <span className="text-4xs text-[#5C5A55] font-mono block truncate">
              {userEmail.split('@')[0]}
            </span>
          </div>
        </div>

        {/* Sign Out Action */}
        <form action={logoutAdmin} className="inline">
          <button
            type="submit"
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[#fde8e7] hover:bg-[#bd3227] text-[#bd3227] hover:text-white border border-[#bd3227]/20 text-2xs font-bold transition-all shadow-2xs active:scale-98 flex items-center gap-1.5"
            title={t('sign_out')}
          >
            <span className="text-xs">🚪</span>
            <span className="hidden md:inline">{t('sign_out')}</span>
          </button>
        </form>
      </div>
    </header>
  )
}

'use client'

import React, { useState, useRef, useEffect } from 'react'
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
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const quickMenuRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        quickMenuRef.current &&
        !quickMenuRef.current.contains(event.target as Node)
      ) {
        setIsQuickMenuOpen(false)
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Find active item info for breadcrumb
  let activeCategoryTitle = ''
  let activeItemTitle = ''
  let activeItemIcon = '📊'

  for (const cat of ADMIN_NAV_CATEGORIES) {
    for (const item of cat.items) {
      if (
        item.href === '/admin'
          ? pathname === '/admin'
          : pathname.startsWith(item.href)
      ) {
        activeCategoryTitle = isAr
          ? cat.titleAr
          : isFr
          ? cat.titleFr
          : cat.titleEn
        activeItemTitle = isAr
          ? item.labelAr
          : isFr
          ? item.labelFr
          : item.labelEn
        activeItemIcon = item.icon
        break
      }
    }
    if (activeItemTitle) break
  }

  const publicSiteLocale = locale === 'fr' ? 'fr' : locale === 'en' ? 'en' : 'ar'
  const staffInitial = userName
    ? userName.charAt(0).toUpperCase()
    : userEmail.charAt(0).toUpperCase()

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#e5e0d6] px-4 sm:px-6 py-3 flex items-center justify-between gap-4 transition-all shadow-2xs">
      {/* Left / Start: Mobile Menu Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F4EFE6] border border-[#e5e0d6] text-[#231f20] transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        )}

        <div className="min-w-0">
          <nav
            aria-label="Breadcrumbs"
            className="flex items-center gap-1.5 text-3xs font-semibold text-[#5C5A55]"
          >
            <Link
              href="/admin"
              className="hover:text-[#bd3227] transition-colors flex items-center gap-1"
            >
              <span>🏠</span>
              <span>{t('admin_title')}</span>
            </Link>
            {activeCategoryTitle && (
              <>
                <span className="text-[#e5e0d6]">/</span>
                <span className="truncate">{activeCategoryTitle}</span>
              </>
            )}
          </nav>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-sm shrink-0">{activeItemIcon}</span>
            <h1 className="text-sm sm:text-base font-black text-[#231f20] truncate leading-tight">
              {activeItemTitle || t('admin_title')}
            </h1>
          </div>
        </div>
      </div>

      {/* Right / End: Quick Actions, Language Switcher, Public Portal & User Chip */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Quick Create Dropdown Menu */}
        <div className="relative" ref={quickMenuRef}>
          <button
            onClick={() => setIsQuickMenuOpen(!isQuickMenuOpen)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#bd3227] to-[#a3261c] hover:from-[#a0281f] hover:to-[#8c2017] text-white text-xs font-bold shadow-md shadow-[#bd3227]/20 transition-all cursor-pointer active:scale-98"
          >
            <span>⚡</span>
            <span>{t('quick_create')}</span>
            <span className="text-3xs">▼</span>
          </button>

          {isQuickMenuOpen && (
            <div className="absolute end-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#e5e0d6] p-2 z-50 space-y-1 animate-fadeIn">
              <Link
                href="/admin/programs/new"
                onClick={() => setIsQuickMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#231f20] hover:bg-[#FAF8F5] hover:text-[#bd3227] transition-colors"
              >
                <span>🎨</span>
                <span>{t('new_program')}</span>
              </Link>
              <Link
                href="/admin/news/new"
                onClick={() => setIsQuickMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#231f20] hover:bg-[#FAF8F5] hover:text-[#bd3227] transition-colors"
              >
                <span>📰</span>
                <span>{t('new_news')}</span>
              </Link>
              <Link
                href="/admin/events/new"
                onClick={() => setIsQuickMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#231f20] hover:bg-[#FAF8F5] hover:text-[#bd3227] transition-colors"
              >
                <span>📅</span>
                <span>{t('new_event')}</span>
              </Link>
              <div className="border-t border-[#e5e0d6] my-1" />
              <Link
                href="/admin/users"
                onClick={() => setIsQuickMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#231f20] hover:bg-[#FAF8F5] hover:text-[#bd3227] transition-colors"
              >
                <span>👤</span>
                <span>{t('new_user')}</span>
              </Link>
            </div>
          )}
        </div>

        {/* View Public Site */}
        <Link
          href={`/${publicSiteLocale}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#e5e0d6] text-xs font-bold text-[#231f20] transition-all hover:border-[#231f20]/30 shadow-2xs group"
        >
          <span>🌐</span>
          <span>{t('view_site')}</span>
          <span className="text-3xs text-[#5C5A55] group-hover:text-[#bd3227] transition-colors">
            ↗
          </span>
        </Link>

        {/* Language Switcher Segmented Pills */}
        <div className="flex items-center p-1 rounded-xl bg-[#FAF8F5] border border-[#e5e0d6] shadow-2xs">
          <button
            type="button"
            onClick={() => setLocale('ar')}
            className={`px-2.5 py-1 rounded-lg text-2xs font-black transition-all cursor-pointer ${
              locale === 'ar'
                ? 'bg-[#231f20] text-white shadow-xs'
                : 'text-[#5C5A55] hover:text-[#231f20]'
            }`}
            title="العربية"
          >
            عربي
          </button>
          <button
            type="button"
            onClick={() => setLocale('fr')}
            className={`px-2.5 py-1 rounded-lg text-2xs font-black transition-all cursor-pointer ${
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
            className={`px-2.5 py-1 rounded-lg text-2xs font-black transition-all cursor-pointer ${
              locale === 'en'
                ? 'bg-[#231f20] text-white shadow-xs'
                : 'text-[#5C5A55] hover:text-[#231f20]'
            }`}
            title="English"
          >
            EN
          </button>
        </div>

        {/* User Identity Chip & Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F4EFE6] border border-[#e5e0d6] transition-all cursor-pointer group active:scale-98"
            title={t('profile_settings')}
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#bd3227] to-[#d2a82b] text-white font-black text-xs flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              {staffInitial}
            </div>
            <div className="hidden sm:block text-start leading-none max-w-[130px]">
              <span className="text-xs font-bold text-[#231f20] block truncate">
                {userName || 'Staff Admin'}
              </span>
              <span className="text-3xs text-[#5C5A55] font-mono block truncate mt-0.5">
                {userEmail.split('@')[0]}
              </span>
            </div>
            <span className="text-3xs text-[#5C5A55] group-hover:text-[#231f20] transition-colors">
              ▼
            </span>
          </button>

          {isUserMenuOpen && (
            <div className="absolute end-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#e5e0d6] p-2 z-50 space-y-1 animate-fadeIn">
              <div className="px-3 py-2 border-b border-[#e5e0d6] mb-1">
                <span className="text-2xs font-extrabold text-[#231f20] block truncate">
                  {userName || 'Staff Administrator'}
                </span>
                <span className="text-3xs text-[#5C5A55] font-mono block truncate">
                  {userEmail}
                </span>
              </div>
              <Link
                href="/admin/profile"
                onClick={() => setIsUserMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#231f20] hover:bg-[#FAF8F5] hover:text-[#bd3227] transition-colors"
              >
                <span>👤</span>
                <span>{t('profile_settings')}</span>
              </Link>
              <Link
                href="/admin/profile?tab=password"
                onClick={() => setIsUserMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#231f20] hover:bg-[#FAF8F5] hover:text-[#bd3227] transition-colors"
              >
                <span>🔑</span>
                <span>{t('change_password')}</span>
              </Link>
              <div className="border-t border-[#e5e0d6] my-1" />
              <form action={logoutAdmin} className="w-full">
                <button
                  type="submit"
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-start cursor-pointer"
                >
                  <span>🚪</span>
                  <span>{t('sign_out')}</span>
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Direct Sign Out Action (hidden on small screens since it's in the menu) */}
        <form action={logoutAdmin} className="hidden sm:inline">
          <button
            type="submit"
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#fde8e7] hover:bg-[#bd3227] text-[#bd3227] hover:text-white border border-[#bd3227]/20 text-xs font-bold transition-all shadow-2xs active:scale-98 flex items-center gap-1.5 cursor-pointer"
            title={t('sign_out')}
          >
            <span className="text-xs">🚪</span>
            <span className="hidden xl:inline">{t('sign_out')}</span>
          </button>
        </form>
      </div>
    </header>
  )
}

'use client'

import React, { useState, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { logoutAdmin } from '@/lib/actions/admin'
import { useAdminLocale, ADMIN_NAV_CATEGORIES } from './AdminLocaleContext'
import type { AdminRoleMeta } from '@/lib/auth/rbac'
import { canUserAccessPath, PREDEFINED_ROLES } from '@/lib/auth/rbac'

interface AdminSidebarProps {
  userEmail: string
  userName?: string | null
  userAvatar?: string | null
  userRole?: AdminRoleMeta
  customPermissions?: string[] | null
  mobileOpen?: boolean
  onCloseMobile?: () => void
}

export function AdminSidebar({
  userEmail,
  userName,
  userAvatar,
  userRole = PREDEFINED_ROLES[0],
  customPermissions,
  mobileOpen = false,
  onCloseMobile,
}: AdminSidebarProps) {
  const pathname = usePathname()
  const { locale, setLocale, isAr, isFr, t } = useAdminLocale()
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)

  function isActive(href: string) {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  // Keyboard shortcut listener to focus search when pressing '/'
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Filter navigation categories & items based on assigned user role and search query
  const filteredCategories = useMemo(() => {
    // 1. Role-based and granular custom RBAC filtering
    const roleAllowedCategories = ADMIN_NAV_CATEGORIES.map((cat) => {
      const allowedItems = cat.items.filter((item) =>
        canUserAccessPath(userRole.key, item.href, customPermissions)
      )
      return {
        ...cat,
        items: allowedItems,
      }
    }).filter((cat) => cat.items.length > 0)

    if (!searchQuery.trim()) {
      return roleAllowedCategories
    }
    const q = searchQuery.toLowerCase().trim()

    return roleAllowedCategories.map((cat) => {
      const matchingItems = cat.items.filter((item) => {
        return (
          item.labelAr.toLowerCase().includes(q) ||
          item.labelFr.toLowerCase().includes(q) ||
          item.labelEn.toLowerCase().includes(q) ||
          item.href.toLowerCase().includes(q) ||
          (item.descAr && item.descAr.toLowerCase().includes(q)) ||
          (item.descFr && item.descFr.toLowerCase().includes(q)) ||
          (item.descEn && item.descEn.toLowerCase().includes(q))
        )
      })
      return {
        ...cat,
        items: matchingItems,
      }
    }).filter((cat) => cat.items.length > 0)
  }, [searchQuery, userRole, customPermissions])

  const totalMatchingItems = useMemo(() => {
    return filteredCategories.reduce((acc, cat) => acc + cat.items.length, 0)
  }, [filteredCategories])

  const staffInitial = userName
    ? userName.charAt(0).toUpperCase()
    : userEmail.charAt(0).toUpperCase()

  const offscreenClass = isAr ? 'translate-x-full' : '-translate-x-full'

  return (
    <>
      {/* Backdrop for Mobile Drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 start-0 z-50 h-screen w-72 sm:w-80 bg-gradient-to-b from-[#1b1819] via-[#211d1e] to-[#181516] text-white flex flex-col justify-between p-4 sm:p-5 border-e border-[#d2a82b]/30 shadow-2xl transition-transform duration-300 ease-in-out shrink-0 overflow-y-auto ${
          mobileOpen ? 'translate-x-0' : `${offscreenClass} md:translate-x-0`
        }`}
      >
        <div className="space-y-4">
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <Link
              href="/admin"
              className="flex items-center gap-3 group"
              onClick={onCloseMobile}
            >
              {/* Standalone Logo Without Box Container */}
              <div className="relative w-10 h-10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
                <Image
                  src="/logo.png"
                  alt="AMYCC Logo"
                  width={40}
                  height={40}
                  className="object-contain w-auto h-auto max-w-full max-h-full drop-shadow-md"
                  priority
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-sm text-white tracking-tight block truncate">
                    {t('admin_title')}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" title="Online" />
                </div>
                <span className="text-3xs text-[#ffd22f] font-semibold block truncate">
                  {t('association_name')}
                </span>
                <span className="text-4xs text-white/50 block font-mono truncate">
                  {t('legal_framework')}
                </span>
              </div>
            </Link>

            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="md:hidden text-white/60 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors"
                aria-label="Close menu"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Search / Filter Input */}
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search_placeholder')}
              className="w-full ps-9 pe-8 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 focus:bg-white/10 border border-white/10 focus:border-[#d2a82b] text-white placeholder-white/40 text-xs transition-all outline-hidden font-medium"
            />
            <span className="absolute start-3 top-1/2 -translate-y-1/2 text-xs text-white/40 pointer-events-none">
              🔍
            </span>
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute end-2.5 top-1/2 -translate-y-1/2 text-3xs text-white/40 hover:text-white p-1 rounded-md"
                title="Clear"
              >
                ✕
              </button>
            ) : (
              <span className="absolute end-2.5 top-1/2 -translate-y-1/2 text-4xs font-mono font-bold px-1.5 py-0.5 rounded-md bg-white/10 text-white/40 pointer-events-none hidden sm:inline-block">
                /
              </span>
            )}
          </div>

          {/* Search feedback if query active */}
          {searchQuery && (
            <div className="px-1 text-4xs font-bold text-[#ffd22f] flex items-center justify-between">
              <span>{isAr ? 'أقسام مطابقة للبحث:' : isFr ? 'Sections trouvées:' : 'Matched sections:'}</span>
              <span className="font-mono">
                {totalMatchingItems} {t('total_sections')}
              </span>
            </div>
          )}

          {/* Empty search state */}
          {filteredCategories.length === 0 && (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center text-xs text-white/60 space-y-1">
              <span className="text-xl block">🔍</span>
              <p className="font-semibold">{t('no_results')}</p>
            </div>
          )}

          {/* Navigation Categories */}
          <nav className="space-y-4" aria-label="Admin Navigation">
            {filteredCategories.map((category) => {
              const catTitle = isAr
                ? category.titleAr
                : isFr
                ? category.titleFr
                : category.titleEn

              return (
                <div key={category.id} className="space-y-1">
                  {/* Category Header */}
                  <div className="px-2 py-1 text-3xs font-extrabold uppercase tracking-wider text-[#ffd22f]/90 flex items-center gap-1.5 border-b border-white/5">
                    <span aria-hidden="true" className="text-xs">{category.icon}</span>
                    <span className="truncate">{catTitle}</span>
                  </div>

                  {/* Category Items */}
                  <div className="space-y-1 pt-1">
                    {category.items.map((item) => {
                      const active = isActive(item.href)
                      const itemLabel = isAr
                        ? item.labelAr
                        : isFr
                        ? item.labelFr
                        : item.labelEn
                      const itemDesc = isAr
                        ? item.descAr
                        : isFr
                        ? item.descFr
                        : item.descEn

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={onCloseMobile}
                          className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                            active
                              ? 'bg-gradient-to-r from-[#bd3227] to-[#8f231b] text-white shadow-md shadow-[#bd3227]/30 border-s-4 border-[#ffd22f]'
                              : 'text-white/80 hover:text-white hover:bg-white/10 active:scale-98'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-sm shrink-0" aria-hidden="true">
                              {item.icon}
                            </span>
                            <div className="flex flex-col min-w-0">
                              <span className="truncate leading-tight font-bold">
                                {itemLabel}
                              </span>
                              {itemDesc && (
                                <span
                                  className={`text-4xs truncate leading-none mt-1 ${
                                    active
                                      ? 'text-[#ffd22f]'
                                      : 'text-white/40 group-hover:text-white/70'
                                  }`}
                                >
                                  {itemDesc}
                                </span>
                              )}
                            </div>
                          </div>

                          {item.badge && (
                            <span className="px-1.5 py-0.5 rounded-full text-4xs font-bold bg-[#bd3227] text-white shrink-0 shadow-xs">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </nav>
        </div>

        {/* Footer: Language Switcher, User Session & Logout */}
        <div className="pt-4 mt-4 border-t border-white/10 space-y-3">
          {/* Language Switcher in Sidebar */}
          <div className="flex items-center justify-between p-1.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-3xs text-[#ffd22f] px-1 font-bold">
              {t('language')}:
            </span>
            <div className="flex items-center gap-1 text-3xs font-black">
              <button
                type="button"
                onClick={() => setLocale('ar')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  locale === 'ar'
                    ? 'bg-[#bd3227] text-white shadow-xs'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                عربي
              </button>
              <button
                type="button"
                onClick={() => setLocale('fr')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  locale === 'fr'
                    ? 'bg-[#bd3227] text-white shadow-xs'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                FR
              </button>
              <button
                type="button"
                onClick={() => setLocale('en')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  locale === 'en'
                    ? 'bg-[#bd3227] text-white shadow-xs'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                EN
              </button>
            </div>
          </div>

          {/* Staff User Session Card */}
          <div className="bg-white/5 p-3 rounded-2xl border border-white/10 flex items-center justify-between gap-2.5">
            <Link
              href="/admin/profile"
              className="flex items-center gap-2.5 min-w-0 group hover:opacity-90 transition-opacity"
              title={t('profile_settings')}
            >
              <div className="w-9 h-9 rounded-xl overflow-hidden bg-gradient-to-br from-[#bd3227] to-[#d2a82b] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md group-hover:scale-105 transition-transform">
                {userAvatar ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={userAvatar}
                    alt={userName || 'Avatar'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  staffInitial
                )}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-white block truncate leading-tight group-hover:text-[#ffd22f] transition-colors">
                  {userName || 'Staff Administrator'}
                </span>
                <span className="text-4xs text-white/50 block truncate font-mono mt-0.5">
                  {userEmail}
                </span>
                <div className="mt-1 flex items-center">
                  <span className={`inline-flex items-center gap-1 text-4xs font-bold px-2 py-0.5 rounded-md border truncate shadow-2xs ${userRole.badgeColor}`}>
                    <span>{userRole.icon}</span>
                    <span className="truncate">{isAr ? userRole.nameAr : isFr ? userRole.nameFr : userRole.nameEn}</span>
                  </span>
                </div>
              </div>
            </Link>

            <div className="shrink-0 flex items-center gap-1">
              <Link
                href="/admin/profile"
                className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                title={t('profile_settings')}
              >
                <span className="text-sm">⚙️</span>
              </Link>
              <form action={logoutAdmin}>
                <button
                  type="submit"
                  className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-red-600/30 transition-all cursor-pointer"
                  title={t('sign_out')}
                >
                  <span className="text-sm">🚪</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

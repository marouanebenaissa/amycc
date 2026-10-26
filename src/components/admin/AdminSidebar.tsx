'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logoutAdmin } from '@/lib/actions/admin'
import { useAdminLocale, ADMIN_NAV_CATEGORIES } from './AdminLocaleContext'

interface AdminSidebarProps {
  userEmail: string
  userName?: string | null
  mobileOpen?: boolean
  onCloseMobile?: () => void
}

export function AdminSidebar({
  userEmail,
  userName,
  mobileOpen = false,
  onCloseMobile,
}: AdminSidebarProps) {
  const pathname = usePathname()
  const { locale, setLocale, isAr, isFr, t } = useAdminLocale()
  const [searchQuery, setSearchQuery] = useState('')

  function isActive(href: string) {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  // Filter navigation categories & items based on search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) {
      return ADMIN_NAV_CATEGORIES
    }
    const q = searchQuery.toLowerCase().trim()

    return ADMIN_NAV_CATEGORIES.map((cat) => {
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
  }, [searchQuery])

  const totalMatchingItems = useMemo(() => {
    return filteredCategories.reduce((acc, cat) => acc + cat.items.length, 0)
  }, [filteredCategories])

  return (
    <>
      {/* Backdrop for Mobile Drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 start-0 z-50 h-screen w-72 bg-[#08242a] text-white flex flex-col justify-between p-4 border-e border-[#14505b]/40 transition-transform duration-300 ease-in-out shrink-0 overflow-y-auto ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-4">
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-[#14505b]/60">
            <Link
              href="/admin"
              className="flex items-center gap-2.5 group"
              onClick={onCloseMobile}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#c85a32] to-[#a94824] group-hover:scale-105 flex items-center justify-center font-black text-white text-sm shadow-md transition-all">
                AM
              </div>
              <div>
                <span className="font-black text-xs sm:text-sm block leading-tight text-white tracking-tight">
                  {t('admin_title')}
                </span>
                <span className="text-4xs text-[#74bfcd] font-semibold block truncate max-w-[170px]">
                  {t('association_name')}
                </span>
              </div>
            </Link>

            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg"
                aria-label="Close menu"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Search / Filter Input */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search_placeholder')}
              className="w-full ps-8 pe-7 py-2 rounded-xl bg-[#0d3b43]/70 hover:bg-[#0d3b43] focus:bg-[#0d3b43] border border-[#14505b] focus:border-[#74bfcd] text-white placeholder-slate-400 text-2xs transition-all outline-none"
            />
            <span className="absolute start-2.5 top-1/2 -translate-y-1/2 text-3xs text-slate-400 pointer-events-none">
              🔍
            </span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute end-2 top-1/2 -translate-y-1/2 text-3xs text-slate-400 hover:text-white p-0.5"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Live search feedback if filtering */}
          {searchQuery && (
            <div className="px-1 text-4xs font-bold text-[#74bfcd] flex items-center justify-between">
              <span>نتائج البحث / Results:</span>
              <span>
                {totalMatchingItems} {t('total_sections')}
              </span>
            </div>
          )}

          {/* Empty search state */}
          {filteredCategories.length === 0 && (
            <div className="p-4 rounded-xl bg-[#0d3b43]/40 border border-[#14505b] text-center text-3xs text-slate-400 space-y-1">
              <span>⚠️</span>
              <p>{t('no_results')}</p>
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
                  <div className="px-2.5 py-1 text-4xs font-extrabold uppercase tracking-wider text-[#74bfcd] flex items-center gap-1.5 border-b border-[#14505b]/30">
                    <span aria-hidden="true">{category.icon}</span>
                    <span className="truncate">{catTitle}</span>
                  </div>

                  {/* Category Items */}
                  <div className="space-y-0.5 pt-0.5">
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
                          className={`group flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                            active
                              ? 'bg-[#14505b] text-white shadow-xs border-s-4 border-[#c85a32]'
                              : 'text-[#d8f0f4] hover:text-white hover:bg-[#0d3b43] active:scale-98'
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
                                  className={`text-4xs truncate leading-none mt-0.5 ${
                                    active
                                      ? 'text-[#74bfcd]'
                                      : 'text-slate-400 group-hover:text-slate-300'
                                  }`}
                                >
                                  {itemDesc}
                                </span>
                              )}
                            </div>
                          </div>

                          {item.badge && (
                            <span className="px-1.5 py-0.5 rounded-full text-4xs font-bold bg-[#c85a32] text-white shrink-0">
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
        <div className="pt-3 mt-4 border-t border-[#14505b]/60 space-y-2.5">
          {/* Quick Language Switcher in Sidebar */}
          <div className="flex items-center justify-between p-1 rounded-xl bg-[#0d3b43]/60 border border-[#14505b]">
            <span className="text-4xs text-[#74bfcd] px-1 font-bold">
              {t('language')}:
            </span>
            <div className="flex items-center gap-1 text-4xs font-black">
              <button
                type="button"
                onClick={() => setLocale('ar')}
                className={`px-2 py-0.5 rounded-lg transition-colors ${
                  locale === 'ar'
                    ? 'bg-[#c85a32] text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                عربي
              </button>
              <button
                type="button"
                onClick={() => setLocale('fr')}
                className={`px-2 py-0.5 rounded-lg transition-colors ${
                  locale === 'fr'
                    ? 'bg-[#c85a32] text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                FR
              </button>
              <button
                type="button"
                onClick={() => setLocale('en')}
                className={`px-2 py-0.5 rounded-lg transition-colors ${
                  locale === 'en'
                    ? 'bg-[#c85a32] text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>
          </div>

          {/* User Session */}
          <div className="bg-[#0d3b43]/40 p-2 rounded-xl border border-[#14505b]/40">
            <span className="text-4xs text-[#74bfcd] uppercase font-bold tracking-wider block">
              {t('authenticated_admin')}
            </span>
            <span className="font-bold text-white text-xs block truncate mt-0.5">
              {userName || 'مدير النظام (Admin)'}
            </span>
            <span className="text-4xs text-slate-400 block truncate font-mono">
              {userEmail}
            </span>
          </div>

          {/* Sign Out */}
          <form action={logoutAdmin}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 text-2xs font-bold py-1.5 px-3 rounded-xl bg-[#0d3b43] hover:bg-[#c85a32] text-white transition-all shadow-xs active:scale-98"
            >
              <span>{t('sign_out')}</span>
              <span aria-hidden="true">→</span>
            </button>
          </form>
        </div>
      </aside>
    </>
  )
}

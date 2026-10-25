'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logoutAdmin } from '@/lib/actions/admin'

interface NavItem {
  href: string
  labelAr: string
  labelEn: string
  icon: string
  badge?: string
}

interface NavSection {
  titleAr: string
  titleEn: string
  items: NavItem[]
}

const navSections: NavSection[] = [
  {
    titleAr: 'إدارة المحتوى والموقع',
    titleEn: 'Content & Website CMS',
    items: [
      { href: '/admin', labelAr: 'نظرة عامة', labelEn: 'Overview', icon: '📊' },
      { href: '/admin/pages', labelAr: 'الصفحات والأقسام', labelEn: 'Pages & Sections', icon: '📄' },
      { href: '/admin/areas', labelAr: 'مجالات التدخل', labelEn: 'Core Disciplines', icon: '🎯' },
      { href: '/admin/team', labelAr: 'فريق العمل والهيكلة', labelEn: 'Team & Structure', icon: '👥' },
      { href: '/admin/programs', labelAr: 'البرامج الثقافية', labelEn: 'Programs CMS', icon: '🎨' },
      { href: '/admin/events', labelAr: 'الفعاليات والورش', labelEn: 'Events CMS', icon: '📅' },
      { href: '/admin/news', labelAr: 'الأخبار والبيانات', labelEn: 'News & Press', icon: '📰' },
      { href: '/admin/gallery', labelAr: 'معرض الصور', labelEn: 'Gallery CMS', icon: '🖼️' },
      { href: '/admin/faqs', labelAr: 'الأسئلة الشائعة', labelEn: 'FAQ CMS', icon: '❓' },
      { href: '/admin/media', labelAr: 'مكتبة الوسائط', labelEn: 'Media Library', icon: '📁' },
      { href: '/admin/translations', labelAr: 'تتبع الترجمات', labelEn: 'Translations Tracker', icon: '🌐' },
    ],
  },
  {
    titleAr: 'الطلبات والمشاركات',
    titleEn: 'Inboxes & Applications',
    items: [
      { href: '/admin/registrations', labelAr: 'تسجيلات الفعاليات', labelEn: 'Event Registrations', icon: '🎟️' },
      { href: '/admin/memberships', labelAr: 'طلبات العضوية', labelEn: 'Memberships', icon: '👥' },
      { href: '/admin/volunteers', labelAr: 'متطوعو شباب في العمل', labelEn: 'Youth in Action', icon: '🤝' },
      { href: '/admin/partnerships', labelAr: 'الشراكات المؤسسية', labelEn: 'Partnerships', icon: '🏛️' },
      { href: '/admin/contacts', labelAr: 'رسائل التواصل', labelEn: 'Contact Messages', icon: '💬' },
      { href: '/admin/donations', labelAr: 'الدعم والتبرعات', labelEn: 'Support & Donations', icon: '💝' },
    ],
  },
  {
    titleAr: 'الإدارة والأمان',
    titleEn: 'System & Security',
    items: [
      { href: '/admin/users', labelAr: 'المستخدمون', labelEn: 'Staff Users', icon: '👥' },
      { href: '/admin/roles', labelAr: 'الصلاحيات والأدوار', labelEn: 'Roles (RBAC)', icon: '🛡️' },
      { href: '/admin/audit-logs', labelAr: 'سجل التدقيق', labelEn: 'Audit Logs', icon: '📜' },
      { href: '/admin/settings', labelAr: 'إعدادات المنصة', labelEn: 'Site Settings', icon: '⚙️' },
    ],
  },
]

interface AdminSidebarProps {
  userEmail: string
  userName?: string | null
}

export function AdminSidebar({ userEmail, userName }: AdminSidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  function isActive(href: string) {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#08242a] text-white border-b border-[#14505b]/40 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#c85a32] flex items-center justify-center font-black text-white text-sm shadow-xs">
            AM
          </div>
          <div>
            <span className="font-bold text-xs block text-white">AMYCC Admin</span>
            <span className="text-3xs text-[#74bfcd]">لوحة التحكم المؤسسية</span>
          </div>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-[#14505b] text-white focus:outline-none"
          aria-label="Toggle Menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Backdrop for Mobile Drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 start-0 z-50 h-screen w-72 bg-[#08242a] text-white flex flex-col justify-between p-5 border-e border-[#14505b]/40 transition-transform duration-300 ease-in-out shrink-0 overflow-y-auto ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-5 mb-5 border-b border-[#14505b]/60">
            <Link href="/admin" className="flex items-center gap-3 group" onClick={() => setMobileOpen(false)}>
              <div className="w-10 h-10 rounded-xl bg-[#c85a32] group-hover:bg-[#d96c44] flex items-center justify-center font-black text-white text-base shadow-sm transition-colors">
                AM
              </div>
              <div>
                <span className="font-black text-sm block leading-tight text-white tracking-tight">
                  AMYCC Admin
                </span>
                <span className="text-3xs text-[#74bfcd] font-semibold block">
                  جمعية روح الفنون والثقافة
                </span>
              </div>
            </Link>

            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden text-slate-400 hover:text-white p-1"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          {/* Quick Website Switcher */}
          <div className="mb-5 p-2 rounded-xl bg-[#0d3b43]/80 border border-[#14505b] flex items-center justify-between text-2xs">
            <span className="text-[#a4d4dc] font-medium">عرض الموقع العام:</span>
            <div className="flex items-center gap-1.5 font-bold">
              <Link href="/ar" target="_blank" className="px-1.5 py-0.5 rounded bg-[#14505b] hover:bg-[#c85a32] text-white transition-colors">عربي</Link>
              <Link href="/fr" target="_blank" className="px-1.5 py-0.5 rounded bg-[#14505b] hover:bg-[#c85a32] text-white transition-colors">FR</Link>
              <Link href="/en" target="_blank" className="px-1.5 py-0.5 rounded bg-[#14505b] hover:bg-[#c85a32] text-white transition-colors">EN</Link>
            </div>
          </div>

          {/* Nav Sections */}
          <nav className="space-y-6" aria-label="Admin Navigation">
            {navSections.map((section) => (
              <div key={section.titleEn} className="space-y-1">
                <div className="px-3 pb-1 text-3xs font-extrabold uppercase tracking-wider text-[#74bfcd]/80 flex items-center justify-between">
                  <span>{section.titleAr}</span>
                  <span className="text-4xs text-slate-400 font-mono font-normal">{section.titleEn}</span>
                </div>

                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const active = isActive(item.href)
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          active
                            ? 'bg-[#14505b] text-white shadow-xs border-s-4 border-[#c85a32]'
                            : 'text-[#d8f0f4] hover:text-white hover:bg-[#0d3b43] active:scale-98'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-sm shrink-0" aria-hidden="true">{item.icon}</span>
                          <div className="flex flex-col min-w-0">
                            <span className="truncate leading-tight">{item.labelAr}</span>
                            <span className={`text-4xs truncate leading-none ${active ? 'text-[#74bfcd]' : 'text-slate-400 group-hover:text-slate-300'}`}>
                              {item.labelEn}
                            </span>
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
            ))}
          </nav>
        </div>

        {/* User Session & Logout */}
        <div className="pt-4 mt-6 border-t border-[#14505b]/60 space-y-3">
          <div className="bg-[#0d3b43]/50 p-2.5 rounded-xl border border-[#14505b]/40">
            <span className="text-4xs text-[#74bfcd] uppercase font-bold tracking-wider block">
              الحساب الإداري الموثّق
            </span>
            <span className="font-bold text-white text-xs block truncate mt-0.5">
              {userName || 'مدير النظام (Admin)'}
            </span>
            <span className="text-3xs text-slate-400 block truncate font-mono">
              {userEmail}
            </span>
          </div>

          <form action={logoutAdmin}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 text-2xs font-bold py-2 px-3 rounded-xl bg-[#0d3b43] hover:bg-[#c85a32] text-white transition-all shadow-xs active:scale-98"
            >
              <span>تسجيل الخروج / Sign Out</span>
              <span aria-hidden="true">→</span>
            </button>
          </form>
        </div>
      </aside>
    </>
  )
}

'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from '@/components/ui/Logo'
import { LanguageSwitcher } from '@/components/navigation/LanguageSwitcher'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import type { TopBarConfig } from '@/lib/settings'

function renderNavIcon(key: string, className = 'w-4 h-4') {
  switch (key) {
    case 'home':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    case 'about':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8m-7 8v-5a2 2 0 012-2h10a2 2 0 012 2v5M3 10l9-7 9 7" />
        </svg>
      )
    case 'team':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    case 'contact':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    case 'programs':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4 4 4 0 014-4c.48 0 .936.084 1.358.24A8.003 8.003 0 0119.76 9.642 4 4 0 1121 17a4 4 0 01-4 4H7z" />
        </svg>
      )
    case 'annual_program':
    case 'annual-program':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    case 'impact':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    case 'explore':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
      )
    case 'events':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
      )
    case 'news':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      )
    case 'partnerships':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    case 'support':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    default:
      return null
  }
}

interface HeaderProps {
  locale: string
  dict: Dictionary
  topBar?: TopBarConfig
}

export function Header({ locale, dict, topBar }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false)
  const [programsDropdownOpen, setProgramsDropdownOpen] = useState(false)
  const [exploreDropdownOpen, setExploreDropdownOpen] = useState(false)
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false)
  const [mobileProgramsOpen, setMobileProgramsOpen] = useState(false)
  const [mobileExploreOpen, setMobileExploreOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [clientTopBar, setClientTopBar] = useState<TopBarConfig | null>(null)
  const [dynamicContactEmail, setDynamicContactEmail] = useState<string>('')
  const [dismissed, setDismissed] = useState(false)
  const pathname = usePathname()
  const [prevPathname, setPrevPathname] = useState(pathname)

  const aboutDropdownRef = useRef<HTMLDivElement>(null)
  const programsDropdownRef = useRef<HTMLDivElement>(null)
  const exploreDropdownRef = useRef<HTMLDivElement>(null)
  const aboutTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const programsTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const exploreTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const isAr = locale === 'ar'
  const isFr = locale === 'fr'

  // Close menus on route change during render (React 19 pattern)
  if (prevPathname !== pathname) {
    setPrevPathname(pathname)
    setMobileMenuOpen(false)
    setAboutDropdownOpen(false)
    setProgramsDropdownOpen(false)
    setExploreDropdownOpen(false)
    setMobileAboutOpen(false)
    setMobileProgramsOpen(false)
    setMobileExploreOpen(false)
  }

  // Track scroll position for subtle elevation
  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Dynamic top bar configuration — fetches from API if not passed via props
  useEffect(() => {
    let isMounted = true

    if (topBar === undefined) {
      fetch('/api/settings/top-bar')
        .then((res) => (res.ok ? res.json() : null))
        .then((data: TopBarConfig | null) => {
          if (isMounted && data) {
            setClientTopBar(data)
          }
        })
        .catch(() => {})
    }

    fetch('/api/settings/contact')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.channels?.primaryEmail) {
          setDynamicContactEmail(data.channels.primaryEmail)
        }
      })
      .catch(() => {})

    return () => {
      isMounted = false
    }
  }, [topBar])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  // Close desktop dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node
      if (aboutDropdownRef.current && !aboutDropdownRef.current.contains(target)) {
        setAboutDropdownOpen(false)
      }
      if (programsDropdownRef.current && !programsDropdownRef.current.contains(target)) {
        setProgramsDropdownOpen(false)
      }
      if (exploreDropdownRef.current && !exploreDropdownRef.current.contains(target)) {
        setExploreDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // About dropdown hover handlers
  const handleAboutMouseEnter = () => {
    if (aboutTimeoutRef.current) clearTimeout(aboutTimeoutRef.current)
    setProgramsDropdownOpen(false)
    setExploreDropdownOpen(false)
    setAboutDropdownOpen(true)
  }

  const handleAboutMouseLeave = () => {
    aboutTimeoutRef.current = setTimeout(() => {
      setAboutDropdownOpen(false)
    }, 180)
  }

  // Programs dropdown hover handlers
  const handleProgramsMouseEnter = () => {
    if (programsTimeoutRef.current) clearTimeout(programsTimeoutRef.current)
    setAboutDropdownOpen(false)
    setExploreDropdownOpen(false)
    setProgramsDropdownOpen(true)
  }

  const handleProgramsMouseLeave = () => {
    programsTimeoutRef.current = setTimeout(() => {
      setProgramsDropdownOpen(false)
    }, 180)
  }

  // Explore dropdown hover handlers
  const handleExploreMouseEnter = () => {
    if (exploreTimeoutRef.current) clearTimeout(exploreTimeoutRef.current)
    setAboutDropdownOpen(false)
    setProgramsDropdownOpen(false)
    setExploreDropdownOpen(true)
  }

  const handleExploreMouseLeave = () => {
    exploreTimeoutRef.current = setTimeout(() => {
      setExploreDropdownOpen(false)
    }, 180)
  }

  // Sub-items grouped under "عن الجمعية" (About + Team + Contact)
  const aboutSubItems = [
    {
      key: 'about',
      title: dict.nav.about,
      desc: isAr
        ? 'الرؤية والرسالة والأهداف التأسيسية للجمعية'
        : isFr
        ? 'Vision, mission et objectifs fondateurs'
        : 'Vision, mission, and core values',
      path: 'about',
      icon: '✦',
      iconSrc: '/icons/nav/about.png',
    },
    {
      key: 'team',
      title: isAr ? 'فريقنا' : isFr ? 'Notre Équipe' : 'Our Team',
      desc: isAr
        ? 'المكتب التنفيذي واللجان الفنية والوظيفية'
        : isFr
        ? 'Bureau exécutif et commissions artistiques'
        : 'Executive board & functional committees',
      path: 'team',
      icon: '👥',
      iconSrc: '/icons/nav/team.png',
    },
    {
      key: 'contact',
      title: isAr ? 'تواصل معنا' : isFr ? 'Contactez-nous' : 'Contact Us',
      desc: isAr
        ? 'المقر، البريد الإلكتروني، وقنوات التواصل الرسمي'
        : isFr
        ? 'Siège, e-mail officiel et coordonnées'
        : 'Headquarters, email, and social channels',
      path: 'contact',
      icon: '✉️',
      iconSrc: '/icons/nav/contact.png',
    },
  ]

  // Sub-items grouped under "البرامج والمبادرات" (Programs + Annual Program + Impact)
  const programSubItems = [
    {
      key: 'programs',
      title: dict.nav.programs,
      desc: isAr
        ? 'محترفات الفنون، المسرح، والموسيقى والتراث'
        : isFr
        ? 'Arts visuels, théâtre, musique et patrimoine'
        : 'Workshops in fine arts, theatre, and music',
      path: 'programs',
      icon: '🎨',
      iconSrc: '/icons/nav/programs.png',
    },
    {
      key: 'annual_program',
      title: dict.nav.annual_program,
      desc: isAr
        ? 'الأجندة الثقافية الشاملة لموسم 2026'
        : isFr
        ? 'Agenda culturel complet de la saison 2026'
        : 'Comprehensive cultural season 2026 agenda',
      path: 'annual-program',
      icon: '📅',
      iconSrc: '/icons/nav/annual-program.png',
    },
    {
      key: 'impact',
      title: dict.nav.impact,
      desc: isAr
        ? 'مؤشرات الأثر وتمكين الشباب وصون التراث'
        : isFr
        ? "Indicateurs d'impact et autonomisation des jeunes"
        : 'Youth empowerment metrics & community impact',
      path: 'impact',
      icon: '📊',
      iconSrc: '/icons/nav/impact.png',
    },
  ]

  // Sub-items grouped under "استكشف" (Explore: Events + News)
  const exploreSubItems = [
    {
      key: 'events',
      title: dict.nav.events,
      desc: isAr
        ? 'المهرجانات، الأمسيات الثقافية والورشات الحية'
        : isFr
        ? 'Festivals, soirées culturelles et ateliers en direct'
        : 'Festivals, cultural nights, and live workshops',
      path: 'events',
      icon: '📅',
      iconSrc: '/icons/nav/events.png',
    },
    {
      key: 'news',
      title: dict.nav.news,
      desc: isAr
        ? 'مستجدات الجمعية، التغطيات الإعلامية والبيانات'
        : isFr
        ? "Actualités de l'association et communiqués officiels"
        : 'Association news, media coverage, and official press',
      path: 'news',
      icon: '📰',
      iconSrc: '/icons/nav/news.png',
    },
  ]

  // Individual direct nav links (Partnerships & Support)
  const directNavLinks = [
    {
      key: 'partnerships' as const,
      title: dict.nav.partnerships,
      path: 'partnerships',
      icon: '🏛️',
      iconSrc: '/icons/nav/partnerships.png',
    },
    {
      key: 'support' as const,
      title: dict.nav.support || (isAr ? 'الدعم والرعاية' : isFr ? 'Soutien' : 'Support'),
      path: 'support',
      icon: '🤝',
      iconSrc: '/icons/nav/support.png',
    },
  ]

  // Check active states
  const isHomeActive = pathname === `/${locale}` || pathname === `/${locale}/`
  const isAboutActive =
    pathname.startsWith(`/${locale}/about`) ||
    pathname.startsWith(`/${locale}/team`) ||
    pathname.startsWith(`/${locale}/contact`)
  const isProgramsActive =
    pathname.startsWith(`/${locale}/programs`) ||
    pathname.startsWith(`/${locale}/annual-program`) ||
    pathname.startsWith(`/${locale}/impact`)
  const isExploreActive =
    pathname.startsWith(`/${locale}/events`) ||
    pathname.startsWith(`/${locale}/news`)

  function isPathActive(path: string) {
    return pathname.startsWith(`/${locale}/${path}`)
  }

  const effectiveTopBar = topBar ?? clientTopBar
  const topBarVisible = !dismissed && (effectiveTopBar ? Boolean(effectiveTopBar.enabled) : false)

  const topBarMessage =
    isAr
      ? (effectiveTopBar?.messageAr || 'المملكة المغربية • جمعية روح الفنون والثقافة (AMYCC) — تأسست سنة 2026')
      : isFr
      ? (effectiveTopBar?.messageFr || 'Royaume du Maroc • Association Esprit des Arts et de la Culture (AMYCC)')
      : (effectiveTopBar?.messageEn || 'Kingdom of Morocco • Spirit of Arts & Culture Association (AMYCC)')

  const topBarLinkText =
    isAr
      ? (effectiveTopBar?.linkTextAr || 'مبادرة شباب في العمل')
      : isFr
      ? (effectiveTopBar?.linkTextFr || 'Initiative Jeunesse en Action')
      : (effectiveTopBar?.linkTextEn || 'Youth in Action Initiative')

  const topBarLinkUrl = effectiveTopBar?.linkUrl || '/programs/youth-in-action'
  const topBarContact = effectiveTopBar?.contactEmail || dynamicContactEmail || 'contact@amycc.org'

  function resolveTopBarUrl(url: string) {
    if (!url) return `/${locale}`
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:')) {
      return url
    }
    const clean = url.startsWith('/') ? url : `/${url}`
    if (clean.startsWith(`/${locale}`)) return clean
    return `/${locale}${clean}`
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#e5e0d6] shadow-sm'
          : 'bg-[#FAF8F5] border-b border-[#E5E0D6]'
      }`}
    >
      {/* Skip to main content — accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:start-3 px-4 py-2 rounded-xl text-xs font-bold bg-[#bd3227] text-white z-50 shadow-md"
      >
        {dict.common.skip_to_content}
      </a>

      {/* Top Institutional Micro-Bar — Dynamically controlled via Admin Dashboard */}
      {topBarVisible && (
        <aside
          aria-label={isAr ? 'شريط الإعلانات المؤسسي' : 'Announcement Bar'}
          className="bg-[#231f20] text-[#E2DED6] py-1.5 px-4 text-3xs border-b border-[#d2a82b]/40 animate-fade-in"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffd22f] shrink-0" aria-hidden="true" />
              <p className="truncate font-medium text-xs sm:text-3xs">
                {topBarMessage}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 text-3xs">
              {topBarLinkText && topBarLinkUrl && (
                <Link
                  href={resolveTopBarUrl(topBarLinkUrl)}
                  className="text-[#ffd22f] hover:underline font-bold transition-colors truncate max-w-[180px] sm:max-w-none"
                >
                  {topBarLinkText}
                </Link>
              )}
              {topBarContact && (
                <>
                  <span className="text-[#d2a82b] hidden sm:inline" aria-hidden="true">•</span>
                  <a
                    href={`mailto:${topBarContact}`}
                    className="hover:text-white transition-colors hidden sm:inline"
                  >
                    {topBarContact}
                  </a>
                </>
              )}
              <button
                type="button"
                onClick={() => setDismissed(true)}
                className="text-[#5C5A55] hover:text-white p-0.5 rounded transition-colors ms-1 cursor-pointer"
                aria-label={isAr ? 'إخفاء الشريط' : 'Dismiss'}
                title={isAr ? 'إخفاء الشريط' : 'Dismiss'}
              >
                ✕
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo with Brand Seal */}
          <Logo locale={locale} />

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Main navigation">
            {/* 1. الرئيسية (Home) */}
            <Link
              href={`/${locale}`}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                isHomeActive
                  ? 'bg-[#231f20]/8 text-[#231f20] font-black'
                  : 'text-[#231f20] hover:text-[#231f20] hover:bg-[#231F20]/5'
              }`}
            >
              {dict.nav.home}
            </Link>

            {/* 2. عن الجمعية (GROUPED DROPDOWN: من نحن + فريق العمل + تواصل معنا) */}
            <div
              ref={aboutDropdownRef}
              className="relative"
              onMouseEnter={handleAboutMouseEnter}
              onMouseLeave={handleAboutMouseLeave}
            >
              <button
                type="button"
                onClick={() => {
                  setAboutDropdownOpen(!aboutDropdownOpen)
                  setProgramsDropdownOpen(false)
                  setExploreDropdownOpen(false)
                }}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1.5 ${
                  isAboutActive || aboutDropdownOpen
                    ? 'bg-[#231f20]/8 text-[#231f20] font-black'
                    : 'text-[#231f20] hover:text-[#231f20] hover:bg-[#231F20]/5'
                }`}
                aria-expanded={aboutDropdownOpen}
                aria-haspopup="true"
              >
                <span>{dict.nav.about_group || (isAr ? 'عن الجمعية' : isFr ? "L'Association" : 'About Us')}</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    aboutDropdownOpen ? 'rotate-180 text-[#bd3227]' : 'text-[#5C5A55]'
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Floating Luxury Dropdown for About */}
              {aboutDropdownOpen && (
                <div className="absolute top-full start-0 mt-1.5 w-72 rounded-2xl bg-white border border-[#e5e0d6] shadow-xl p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 text-4xs font-bold uppercase tracking-wider text-[#5C5A55] border-b border-[#E5E0D6] mb-1">
                    {isAr ? 'الهوية والتنظيم والتواصل' : 'Organization & Team'}
                  </div>

                  <div className="space-y-1">
                    {aboutSubItems.map((sub) => {
                      const fullPath = `/${locale}/${sub.path}`
                      const isActive = pathname.startsWith(fullPath)

                      return (
                        <Link
                          key={sub.key}
                          href={fullPath}
                          onClick={() => setAboutDropdownOpen(false)}
                          className={`group/item flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                            isActive
                              ? 'bg-[#F4EFE6] text-[#231f20]'
                              : 'hover:bg-[#FAF8F5] text-[#231f20]'
                          }`}
                        >
                          <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#e5e0d6] flex items-center justify-center shrink-0 p-1.5 shadow-2xs group-hover/item:scale-105 transition-transform text-[#231f20] group-hover/item:text-[#bd3227]">
                            {renderNavIcon(sub.key, 'w-4 h-4')}
                          </div>

                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-bold block leading-tight text-[#231f20] group-hover/item:text-[#bd3227] transition-colors">
                              {sub.title}
                            </span>
                            <span className="text-3xs text-[#5C5A55] block mt-0.5 line-clamp-1">
                              {sub.desc}
                            </span>
                          </div>

                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#bd3227] self-center shrink-0" />
                          )}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 3. البرامج والمبادرات (GROUPED DROPDOWN: البرامج + البرنامج السنوي + الأثر) */}
            <div
              ref={programsDropdownRef}
              className="relative"
              onMouseEnter={handleProgramsMouseEnter}
              onMouseLeave={handleProgramsMouseLeave}
            >
              <button
                type="button"
                onClick={() => {
                  setProgramsDropdownOpen(!programsDropdownOpen)
                  setAboutDropdownOpen(false)
                  setExploreDropdownOpen(false)
                }}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1.5 ${
                  isProgramsActive || programsDropdownOpen
                    ? 'bg-[#231f20]/8 text-[#231f20] font-black'
                    : 'text-[#231f20] hover:text-[#231f20] hover:bg-[#231F20]/5'
                }`}
                aria-expanded={programsDropdownOpen}
                aria-haspopup="true"
              >
                <span>{dict.nav.programs_group || dict.nav.programs}</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    programsDropdownOpen ? 'rotate-180 text-[#bd3227]' : 'text-[#5C5A55]'
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Floating Luxury Dropdown for Programs */}
              {programsDropdownOpen && (
                <div className="absolute top-full start-0 mt-1.5 w-72 rounded-2xl bg-white border border-[#e5e0d6] shadow-xl p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 text-4xs font-bold uppercase tracking-wider text-[#5C5A55] border-b border-[#E5E0D6] mb-1">
                    {dict.nav.programs_group || dict.nav.programs}
                  </div>

                  <div className="space-y-1">
                    {programSubItems.map((sub) => {
                      const fullPath = `/${locale}/${sub.path}`
                      const isActive = pathname.startsWith(fullPath)

                      return (
                        <Link
                          key={sub.key}
                          href={fullPath}
                          onClick={() => setProgramsDropdownOpen(false)}
                          className={`group/item flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                            isActive
                              ? 'bg-[#F4EFE6] text-[#231f20]'
                              : 'hover:bg-[#FAF8F5] text-[#231f20]'
                          }`}
                        >
                          <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#e5e0d6] flex items-center justify-center shrink-0 p-1.5 shadow-2xs group-hover/item:scale-105 transition-transform text-[#231f20] group-hover/item:text-[#bd3227]">
                            {renderNavIcon(sub.key, 'w-4 h-4')}
                          </div>

                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-bold block leading-tight text-[#231f20] group-hover/item:text-[#bd3227] transition-colors">
                              {sub.title}
                            </span>
                            <span className="text-3xs text-[#5C5A55] block mt-0.5 line-clamp-1">
                              {sub.desc}
                            </span>
                          </div>

                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#bd3227] self-center shrink-0" />
                          )}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 4. استكشف (GROUPED DROPDOWN: الفعاليات + الأخبار) */}
            <div
              ref={exploreDropdownRef}
              className="relative"
              onMouseEnter={handleExploreMouseEnter}
              onMouseLeave={handleExploreMouseLeave}
            >
              <button
                type="button"
                onClick={() => {
                  setExploreDropdownOpen(!exploreDropdownOpen)
                  setAboutDropdownOpen(false)
                  setProgramsDropdownOpen(false)
                }}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1.5 ${
                  isExploreActive || exploreDropdownOpen
                    ? 'bg-[#231f20]/8 text-[#231f20] font-black'
                    : 'text-[#231f20] hover:text-[#231f20] hover:bg-[#231F20]/5'
                }`}
                aria-expanded={exploreDropdownOpen}
                aria-haspopup="true"
              >
                <span>{dict.nav.explore || (isAr ? 'استكشف' : isFr ? 'Explorer' : 'Explore')}</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    exploreDropdownOpen ? 'rotate-180 text-[#bd3227]' : 'text-[#5C5A55]'
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Floating Luxury Dropdown for Explore */}
              {exploreDropdownOpen && (
                <div className="absolute top-full start-0 mt-1.5 w-72 rounded-2xl bg-white border border-[#e5e0d6] shadow-xl p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 text-4xs font-bold uppercase tracking-wider text-[#5C5A55] border-b border-[#E5E0D6] mb-1">
                    {dict.nav.explore || (isAr ? 'استكشف أنشطتنا' : 'Explore Activities')}
                  </div>

                  <div className="space-y-1">
                    {exploreSubItems.map((sub) => {
                      const fullPath = `/${locale}/${sub.path}`
                      const isActive = pathname.startsWith(fullPath)

                      return (
                        <Link
                          key={sub.key}
                          href={fullPath}
                          onClick={() => setExploreDropdownOpen(false)}
                          className={`group/item flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                            isActive
                              ? 'bg-[#F4EFE6] text-[#231f20]'
                              : 'hover:bg-[#FAF8F5] text-[#231f20]'
                          }`}
                        >
                          <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#e5e0d6] flex items-center justify-center shrink-0 p-1.5 shadow-2xs group-hover/item:scale-105 transition-transform text-[#231f20] group-hover/item:text-[#bd3227]">
                            {renderNavIcon(sub.key, 'w-4 h-4')}
                          </div>

                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-bold block leading-tight text-[#231f20] group-hover/item:text-[#bd3227] transition-colors">
                              {sub.title}
                            </span>
                            <span className="text-3xs text-[#5C5A55] block mt-0.5 line-clamp-1">
                              {sub.desc}
                            </span>
                          </div>

                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#bd3227] self-center shrink-0" />
                          )}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 5. الشراكات (Partnerships) */}
            {directNavLinks.map(({ key, title, path }) => {
              const fullPath = `/${locale}/${path}`
              const isActive = isPathActive(path)

              return (
                <Link
                  key={key}
                  href={fullPath}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#231f20]/8 text-[#231f20] font-black'
                      : 'text-[#231f20] hover:text-[#231f20] hover:bg-[#231F20]/5'
                  }`}
                >
                  {title}
                </Link>
              )
            })}
          </nav>

          {/* Right side: Language switcher + Primary CTA */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher currentLocale={locale} />

            <Link
              href={`/${locale}/membership`}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#bd3227] hover:bg-[#a3261c] active:scale-95 transition-all shadow-sm hover:shadow-md gap-1.5 group"
            >
              <span>{dict.membership.apply}</span>
              <span className="group-hover:translate-x-0.5 transition-transform" aria-hidden="true">
                ↗
              </span>
            </Link>

            {/* Mobile menu toggle button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl text-[#231f20] hover:bg-[#F4EFE6] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bd3227]"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {mobileMenuOpen ? (
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation (Refined & Elevated) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[calc(5rem+1px)] z-40 bg-[#231f20]/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#FAF8F5] border-b border-[#e5e0d6] shadow-2xl p-6 max-h-[calc(100vh-5rem)] overflow-y-auto">
            <nav className="flex flex-col space-y-2" aria-label="Mobile Navigation">
              {/* Home */}
              <Link
                href={`/${locale}`}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between ${
                  isHomeActive
                    ? 'bg-[#F4EFE6] text-[#231f20] font-black shadow-2xs'
                    : 'text-[#231f20] hover:bg-[#F4EFE6]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 flex items-center justify-center text-[#231f20]">
                    {renderNavIcon('home', 'w-5 h-5')}
                  </span>
                  <span>{dict.nav.home}</span>
                </div>
                {isHomeActive && (
                  <span className="text-3xs font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#231f20] text-white">
                    {isAr ? 'النشط' : 'Active'}
                  </span>
                )}
              </Link>

              {/* Accordion 1: عن الجمعية (About + Team + Contact) */}
              <div className="rounded-xl border border-[#e5e0d6] overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                  className={`w-full px-4 py-3 text-sm font-bold flex items-center justify-between transition-colors ${
                    isAboutActive ? 'bg-[#231f20]/5 text-[#bd3227]' : 'text-[#231f20]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 flex items-center justify-center text-[#231f20]">
                      {renderNavIcon('about', 'w-5 h-5')}
                    </span>
                    <span>{dict.nav.about_group || (isAr ? 'عن الجمعية' : isFr ? "L'Association" : 'About Us')}</span>
                  </div>

                  <svg
                    className={`w-4 h-4 transition-transform ${mobileAboutOpen ? 'rotate-180 text-[#bd3227]' : 'text-[#5C5A55]'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {mobileAboutOpen && (
                  <div className="bg-[#FAF8F5] p-2 space-y-1 border-t border-[#e5e0d6]">
                    {aboutSubItems.map((sub) => {
                      const fullPath = `/${locale}/${sub.path}`
                      const isActive = pathname.startsWith(fullPath)
                      return (
                        <Link
                          key={sub.key}
                          href={fullPath}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
                            isActive
                              ? 'bg-[#F4EFE6] text-[#231f20] font-black'
                              : 'text-[#5C5A55] hover:bg-white'
                          }`}
                        >
                          <span className="w-4 h-4 flex items-center justify-center text-[#231f20]">
                            {renderNavIcon(sub.key, 'w-4 h-4')}
                          </span>
                          <span>{sub.title}</span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Accordion 2: البرامج والمبادرات (Programs + Annual Program + Impact) */}
              <div className="rounded-xl border border-[#e5e0d6] overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => setMobileProgramsOpen(!mobileProgramsOpen)}
                  className={`w-full px-4 py-3 text-sm font-bold flex items-center justify-between transition-colors ${
                    isProgramsActive ? 'bg-[#231f20]/5 text-[#bd3227]' : 'text-[#231f20]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 flex items-center justify-center text-[#231f20]">
                      {renderNavIcon('programs', 'w-5 h-5')}
                    </span>
                    <span>{dict.nav.programs_group || dict.nav.programs}</span>
                  </div>

                  <svg
                    className={`w-4 h-4 transition-transform ${mobileProgramsOpen ? 'rotate-180 text-[#bd3227]' : 'text-[#5C5A55]'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {mobileProgramsOpen && (
                  <div className="bg-[#FAF8F5] p-2 space-y-1 border-t border-[#e5e0d6]">
                    {programSubItems.map((sub) => {
                      const fullPath = `/${locale}/${sub.path}`
                      const isActive = pathname.startsWith(fullPath)
                      return (
                        <Link
                          key={sub.key}
                          href={fullPath}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
                            isActive
                              ? 'bg-[#F4EFE6] text-[#231f20] font-black'
                              : 'text-[#5C5A55] hover:bg-white'
                          }`}
                        >
                          <span className="w-4 h-4 flex items-center justify-center text-[#231f20]">
                            {renderNavIcon(sub.key, 'w-4 h-4')}
                          </span>
                          <span>{sub.title}</span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Accordion 3: استكشف (Explore: Events + News) */}
              <div className="rounded-xl border border-[#e5e0d6] overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => setMobileExploreOpen(!mobileExploreOpen)}
                  className={`w-full px-4 py-3 text-sm font-bold flex items-center justify-between transition-colors ${
                    isExploreActive ? 'bg-[#231f20]/5 text-[#bd3227]' : 'text-[#231f20]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 flex items-center justify-center text-[#231f20]">
                      {renderNavIcon('explore', 'w-5 h-5')}
                    </span>
                    <span>{dict.nav.explore || (isAr ? 'استكشف' : isFr ? 'Explorer' : 'Explore')}</span>
                  </div>

                  <svg
                    className={`w-4 h-4 transition-transform ${mobileExploreOpen ? 'rotate-180 text-[#bd3227]' : 'text-[#5C5A55]'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {mobileExploreOpen && (
                  <div className="bg-[#FAF8F5] p-2 space-y-1 border-t border-[#e5e0d6]">
                    {exploreSubItems.map((sub) => {
                      const fullPath = `/${locale}/${sub.path}`
                      const isActive = pathname.startsWith(fullPath)
                      return (
                        <Link
                          key={sub.key}
                          href={fullPath}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
                            isActive
                              ? 'bg-[#F4EFE6] text-[#231f20] font-black'
                              : 'text-[#5C5A55] hover:bg-white'
                          }`}
                        >
                          <span className="w-4 h-4 flex items-center justify-center text-[#231f20]">
                            {renderNavIcon(sub.key, 'w-4 h-4')}
                          </span>
                          <span>{sub.title}</span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Direct Links (Partnerships & Support) */}
              {directNavLinks.map(({ key, title, path }) => (
                <Link
                  key={key}
                  href={`/${locale}/${path}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between ${
                    isPathActive(path)
                      ? 'bg-[#F4EFE6] text-[#231f20] font-black shadow-2xs'
                      : 'text-[#231f20] hover:bg-[#F4EFE6]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 flex items-center justify-center text-[#231f20]">
                      {renderNavIcon(key, 'w-5 h-5')}
                    </span>
                    <span>{title}</span>
                  </div>
                  {isPathActive(path) && (
                    <span className="text-3xs font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#231f20] text-white">
                      {isAr ? 'النشط' : 'Active'}
                    </span>
                  )}
                </Link>
              ))}

              {/* Action Buttons */}
              <div className="pt-4 mt-2 border-t border-[#e5e0d6] space-y-3">
                <Link
                  href={`/${locale}/membership`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-[#bd3227] hover:bg-[#a3261c] transition-all shadow-card"
                >
                  {dict.membership.apply}
                </Link>
                <Link
                  href={`/${locale}/contact`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl text-sm font-bold text-[#231f20] bg-white border border-[#cfc7b9] hover:bg-[#F4EFE6] transition-all shadow-2xs"
                >
                  {dict.nav.contact}
                </Link>
              </div>

              {/* Direct Association Contact Micro-Card */}
              <div className="mt-4 p-4 rounded-2xl bg-white border border-[#e5e0d6] text-center text-3xs text-[#5C5A55]">
                <span className="font-bold text-[#231f20] block mb-1">
                  {isAr ? 'جمعية روح الفنون والثقافة — AMYCC' : 'Spirit of Arts & Culture Association'}
                </span>
                <span>{topBarContact} • {isAr ? 'المملكة المغربية' : 'Morocco'}</span>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

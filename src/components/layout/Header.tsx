'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from '@/components/ui/Logo'
import { LanguageSwitcher } from '@/components/navigation/LanguageSwitcher'
import { IconWithFallback } from '@/components/ui/IconWithFallback'
import type { Dictionary } from '@/lib/i18n/dictionaries'

interface HeaderProps {
  locale: string
  dict: Dictionary
}

export function Header({ locale, dict }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false)
  const [programsDropdownOpen, setProgramsDropdownOpen] = useState(false)
  const [exploreDropdownOpen, setExploreDropdownOpen] = useState(false)
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false)
  const [mobileProgramsOpen, setMobileProgramsOpen] = useState(false)
  const [mobileExploreOpen, setMobileExploreOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
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

  // Individual direct nav links (Partnerships)
  const directNavLinks = [
    {
      key: 'partnerships' as const,
      title: dict.nav.partnerships,
      path: 'partnerships',
      icon: '🏛️',
      iconSrc: '/icons/nav/partnerships.png',
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

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#faf7f2]/95 backdrop-blur-md border-b border-[#e5e0d6] shadow-sm'
          : 'bg-[#faf7f2] border-b border-[#ebe1d1]'
      }`}
    >
      {/* Skip to main content — accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:start-3 px-4 py-2 rounded-xl text-xs font-bold bg-[#c85a32] text-white z-50 shadow-md"
      >
        {dict.common.skip_to_content}
      </a>

      {/* Top Institutional Micro-Bar */}
      <div className="bg-[#08242a] text-[#d8f0f4] py-1.5 px-4 text-3xs border-b border-[#14505b]/40 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f4ce83]" />
              <span>
                {isAr
                  ? 'المملكة المغربية • جمعية روح الفنون والثقافة (AMYCC) — تأسست سنة 2026'
                  : isFr
                  ? 'Royaume du Maroc • Association Esprit des Arts et de la Culture (AMYCC)'
                  : 'Kingdom of Morocco • Spirit of Arts & Culture Association (AMYCC)'}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-3xs">
            <Link
              href={`/${locale}/programs/youth-in-action`}
              className="text-[#f4ce83] hover:underline font-bold transition-colors"
            >
              {isAr ? 'مبادرة شباب في العمل' : 'Youth in Action Initiative'}
            </Link>
            <span className="text-[#1c6875]">•</span>
            <a
              href="mailto:contact@amycc.org"
              className="hover:text-white transition-colors"
            >
              contact@amycc.org
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo with Brand Seal */}
          <Logo locale={locale} />

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5" aria-label="Main navigation">
            {/* 1. الرئيسية (Home) */}
            <Link
              href={`/${locale}`}
              className={`group px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isHomeActive
                  ? 'bg-[#0d3b43]/8 text-[#c85a32] border border-[#c85a32]/25 shadow-2xs font-black'
                  : 'text-[#1b2628] hover:text-[#0d3b43] hover:bg-[#ebe1d1]/50'
              }`}
            >
              <span className="w-4 h-4 shrink-0 flex items-center justify-center opacity-85 group-hover:scale-110 transition-transform">
                <IconWithFallback
                  src="/icons/nav/home.png"
                  fallbackEmoji="🏠"
                  alt={dict.nav.home}
                  size={16}
                  className="w-full h-full object-contain"
                />
              </span>
              <span>{dict.nav.home}</span>
              {isHomeActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#c85a32] shrink-0" aria-hidden="true" />
              )}
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
                className={`group px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isAboutActive || aboutDropdownOpen
                    ? 'bg-[#0d3b43]/8 text-[#c85a32] border border-[#c85a32]/25 shadow-2xs font-black'
                    : 'text-[#1b2628] hover:text-[#0d3b43] hover:bg-[#ebe1d1]/50'
                }`}
                aria-expanded={aboutDropdownOpen}
                aria-haspopup="true"
              >
                <span className="w-4 h-4 shrink-0 flex items-center justify-center opacity-85 group-hover:scale-110 transition-transform">
                  <IconWithFallback
                    src="/icons/nav/about.png"
                    fallbackEmoji="✦"
                    alt={isAr ? 'عن الجمعية' : 'About Us'}
                    size={16}
                    className="w-full h-full object-contain"
                  />
                </span>
                <span>{dict.nav.about_group || (isAr ? 'عن الجمعية' : isFr ? "L'Association" : 'About Us')}</span>

                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    aboutDropdownOpen ? 'rotate-180 text-[#c85a32]' : 'text-[#819598]'
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>

                {isAboutActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c85a32] shrink-0" aria-hidden="true" />
                )}
              </button>

              {/* Floating Luxury Dropdown for About */}
              {aboutDropdownOpen && (
                <div className="absolute top-full start-0 mt-1.5 w-72 rounded-2xl bg-white border border-[#e5e0d6] shadow-xl p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 text-4xs font-bold uppercase tracking-wider text-[#819598] border-b border-[#f4ede2] mb-1">
                    {isAr ? 'الهوية والحكامة والتواصل' : 'Organization & Governance'}
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
                              ? 'bg-[#d8f0f4]/80 text-[#0d3b43]'
                              : 'hover:bg-[#faf7f2] text-[#1b2628]'
                          }`}
                        >
                          <div className="w-8 h-8 rounded-lg bg-[#faf7f2] border border-[#e5e0d6] flex items-center justify-center shrink-0 p-1.5 shadow-2xs group-hover/item:scale-105 transition-transform">
                            <IconWithFallback
                              src={sub.iconSrc}
                              fallbackEmoji={sub.icon}
                              alt={sub.title}
                              size={18}
                              className="w-full h-full object-contain"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-bold block leading-tight text-[#08242a] group-hover/item:text-[#c85a32] transition-colors">
                              {sub.title}
                            </span>
                            <span className="text-3xs text-[#5f7174] block mt-0.5 line-clamp-1">
                              {sub.desc}
                            </span>
                          </div>

                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#c85a32] self-center shrink-0" />
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
                className={`group px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isProgramsActive || programsDropdownOpen
                    ? 'bg-[#0d3b43]/8 text-[#c85a32] border border-[#c85a32]/25 shadow-2xs font-black'
                    : 'text-[#1b2628] hover:text-[#0d3b43] hover:bg-[#ebe1d1]/50'
                }`}
                aria-expanded={programsDropdownOpen}
                aria-haspopup="true"
              >
                <span className="w-4 h-4 shrink-0 flex items-center justify-center opacity-85 group-hover:scale-110 transition-transform">
                  <IconWithFallback
                    src="/icons/nav/programs.png"
                    fallbackEmoji="🎨"
                    alt={dict.nav.programs_group || dict.nav.programs}
                    size={16}
                    className="w-full h-full object-contain"
                  />
                </span>
                <span>{dict.nav.programs_group || dict.nav.programs}</span>

                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    programsDropdownOpen ? 'rotate-180 text-[#c85a32]' : 'text-[#819598]'
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>

                {isProgramsActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c85a32] shrink-0" aria-hidden="true" />
                )}
              </button>

              {/* Floating Luxury Dropdown for Programs */}
              {programsDropdownOpen && (
                <div className="absolute top-full start-0 mt-1.5 w-72 rounded-2xl bg-white border border-[#e5e0d6] shadow-xl p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 text-4xs font-bold uppercase tracking-wider text-[#819598] border-b border-[#f4ede2] mb-1">
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
                              ? 'bg-[#d8f0f4]/80 text-[#0d3b43]'
                              : 'hover:bg-[#faf7f2] text-[#1b2628]'
                          }`}
                        >
                          <div className="w-8 h-8 rounded-lg bg-[#faf7f2] border border-[#e5e0d6] flex items-center justify-center shrink-0 p-1.5 shadow-2xs group-hover/item:scale-105 transition-transform">
                            <IconWithFallback
                              src={sub.iconSrc}
                              fallbackEmoji={sub.icon}
                              alt={sub.title}
                              size={18}
                              className="w-full h-full object-contain"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-bold block leading-tight text-[#08242a] group-hover/item:text-[#c85a32] transition-colors">
                              {sub.title}
                            </span>
                            <span className="text-3xs text-[#5f7174] block mt-0.5 line-clamp-1">
                              {sub.desc}
                            </span>
                          </div>

                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#c85a32] self-center shrink-0" />
                          )}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 4. استكشف (GROUPED DROPDOWN: الفعاليات + الأخبار + المعرض) */}
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
                className={`group px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isExploreActive || exploreDropdownOpen
                    ? 'bg-[#0d3b43]/8 text-[#c85a32] border border-[#c85a32]/25 shadow-2xs font-black'
                    : 'text-[#1b2628] hover:text-[#0d3b43] hover:bg-[#ebe1d1]/50'
                }`}
                aria-expanded={exploreDropdownOpen}
                aria-haspopup="true"
              >
                <span className="w-4 h-4 shrink-0 flex items-center justify-center opacity-85 group-hover:scale-110 transition-transform">
                  <IconWithFallback
                    src="/icons/nav/explore.png"
                    fallbackEmoji="🧭"
                    alt={dict.nav.explore || (isAr ? 'استكشف' : isFr ? 'Explorer' : 'Explore')}
                    size={16}
                    className="w-full h-full object-contain"
                  />
                </span>
                <span>{dict.nav.explore || (isAr ? 'استكشف' : isFr ? 'Explorer' : 'Explore')}</span>

                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    exploreDropdownOpen ? 'rotate-180 text-[#c85a32]' : 'text-[#819598]'
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>

                {isExploreActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c85a32] shrink-0" aria-hidden="true" />
                )}
              </button>

              {/* Floating Luxury Dropdown for Explore */}
              {exploreDropdownOpen && (
                <div className="absolute top-full start-0 mt-1.5 w-72 rounded-2xl bg-white border border-[#e5e0d6] shadow-xl p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 text-4xs font-bold uppercase tracking-wider text-[#819598] border-b border-[#f4ede2] mb-1">
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
                              ? 'bg-[#d8f0f4]/80 text-[#0d3b43]'
                              : 'hover:bg-[#faf7f2] text-[#1b2628]'
                          }`}
                        >
                          <div className="w-8 h-8 rounded-lg bg-[#faf7f2] border border-[#e5e0d6] flex items-center justify-center shrink-0 p-1.5 shadow-2xs group-hover/item:scale-105 transition-transform">
                            <IconWithFallback
                              src={sub.iconSrc}
                              fallbackEmoji={sub.icon}
                              alt={sub.title}
                              size={18}
                              className="w-full h-full object-contain"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-bold block leading-tight text-[#08242a] group-hover/item:text-[#c85a32] transition-colors">
                              {sub.title}
                            </span>
                            <span className="text-3xs text-[#5f7174] block mt-0.5 line-clamp-1">
                              {sub.desc}
                            </span>
                          </div>

                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#c85a32] self-center shrink-0" />
                          )}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Direct Navigation Links (Volunteer + Partnerships) */}
            {directNavLinks.map(({ key, title, path, icon, iconSrc }) => {
              const fullPath = `/${locale}/${path}`
              const isActive = isPathActive(path)

              return (
                <Link
                  key={key}
                  href={fullPath}
                  className={`group px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#0d3b43]/8 text-[#c85a32] border border-[#c85a32]/25 shadow-2xs font-black'
                      : 'text-[#1b2628] hover:text-[#0d3b43] hover:bg-[#ebe1d1]/50'
                  }`}
                >
                  <span className="w-4 h-4 shrink-0 flex items-center justify-center opacity-85 group-hover:scale-110 transition-transform">
                    <IconWithFallback
                      src={iconSrc}
                      fallbackEmoji={icon}
                      alt={title}
                      size={16}
                      className="w-full h-full object-contain"
                    />
                  </span>
                  <span>{title}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c85a32] shrink-0" aria-hidden="true" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Right side: Language switcher + Primary CTA */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher currentLocale={locale} />

            <Link
              href={`/${locale}/membership`}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0d3b43] hover:bg-[#14505b] active:scale-95 transition-all shadow-subtle hover:shadow-card gap-1.5 group"
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
              className="lg:hidden p-2.5 rounded-xl text-[#0d3b43] hover:bg-[#ebe1d1] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c85a32]"
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
        <div className="lg:hidden fixed inset-0 top-[calc(5rem+1px)] z-40 bg-[#08242a]/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#faf7f2] border-b border-[#e5e0d6] shadow-2xl p-6 max-h-[calc(100vh-5rem)] overflow-y-auto">
            <nav className="flex flex-col space-y-2" aria-label="Mobile Navigation">
              {/* Home */}
              <Link
                href={`/${locale}`}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between ${
                  isHomeActive
                    ? 'bg-[#d8f0f4] text-[#0d3b43] font-black shadow-2xs'
                    : 'text-[#1b2628] hover:bg-[#f4ede2]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 flex items-center justify-center">
                    <IconWithFallback
                      src="/icons/nav/home.png"
                      fallbackEmoji="🏠"
                      alt={dict.nav.home}
                      size={18}
                      className="w-full h-full object-contain"
                    />
                  </span>
                  <span>{dict.nav.home}</span>
                </div>
                {isHomeActive && (
                  <span className="text-3xs font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#0d3b43] text-white">
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
                    isAboutActive ? 'bg-[#0d3b43]/5 text-[#c85a32]' : 'text-[#08242a]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 flex items-center justify-center">
                      <IconWithFallback
                        src="/icons/nav/about.png"
                        fallbackEmoji="✦"
                        alt={isAr ? 'عن الجمعية' : 'About'}
                        size={18}
                        className="w-full h-full object-contain"
                      />
                    </span>
                    <span>{dict.nav.about_group || (isAr ? 'عن الجمعية' : isFr ? "L'Association" : 'About Us')}</span>
                  </div>

                  <svg
                    className={`w-4 h-4 transition-transform ${mobileAboutOpen ? 'rotate-180 text-[#c85a32]' : 'text-[#819598]'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {mobileAboutOpen && (
                  <div className="bg-[#faf7f2] p-2 space-y-1 border-t border-[#e5e0d6]">
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
                              ? 'bg-[#d8f0f4] text-[#0d3b43] font-black'
                              : 'text-[#445457] hover:bg-white'
                          }`}
                        >
                          <span className="w-4 h-4 flex items-center justify-center">
                            <IconWithFallback
                              src={sub.iconSrc}
                              fallbackEmoji={sub.icon}
                              alt={sub.title}
                              size={16}
                              className="w-full h-full object-contain"
                            />
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
                    isProgramsActive ? 'bg-[#0d3b43]/5 text-[#c85a32]' : 'text-[#08242a]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 flex items-center justify-center">
                      <IconWithFallback
                        src="/icons/nav/programs.png"
                        fallbackEmoji="🎨"
                        alt={dict.nav.programs_group || dict.nav.programs}
                        size={18}
                        className="w-full h-full object-contain"
                      />
                    </span>
                    <span>{dict.nav.programs_group || dict.nav.programs}</span>
                  </div>

                  <svg
                    className={`w-4 h-4 transition-transform ${mobileProgramsOpen ? 'rotate-180 text-[#c85a32]' : 'text-[#819598]'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {mobileProgramsOpen && (
                  <div className="bg-[#faf7f2] p-2 space-y-1 border-t border-[#e5e0d6]">
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
                              ? 'bg-[#d8f0f4] text-[#0d3b43] font-black'
                              : 'text-[#445457] hover:bg-white'
                          }`}
                        >
                          <span className="w-4 h-4 flex items-center justify-center">
                            <IconWithFallback
                              src={sub.iconSrc}
                              fallbackEmoji={sub.icon}
                              alt={sub.title}
                              size={16}
                              className="w-full h-full object-contain"
                            />
                          </span>
                          <span>{sub.title}</span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Accordion 3: استكشف (Explore: Events + News + Gallery) */}
              <div className="rounded-xl border border-[#e5e0d6] overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => setMobileExploreOpen(!mobileExploreOpen)}
                  className={`w-full px-4 py-3 text-sm font-bold flex items-center justify-between transition-colors ${
                    isExploreActive ? 'bg-[#0d3b43]/5 text-[#c85a32]' : 'text-[#08242a]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 flex items-center justify-center">
                      <IconWithFallback
                        src="/icons/nav/explore.png"
                        fallbackEmoji="🧭"
                        alt={dict.nav.explore || (isAr ? 'استكشف' : 'Explore')}
                        size={18}
                        className="w-full h-full object-contain"
                      />
                    </span>
                    <span>{dict.nav.explore || (isAr ? 'استكشف' : isFr ? 'Explorer' : 'Explore')}</span>
                  </div>

                  <svg
                    className={`w-4 h-4 transition-transform ${mobileExploreOpen ? 'rotate-180 text-[#c85a32]' : 'text-[#819598]'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {mobileExploreOpen && (
                  <div className="bg-[#faf7f2] p-2 space-y-1 border-t border-[#e5e0d6]">
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
                              ? 'bg-[#d8f0f4] text-[#0d3b43] font-black'
                              : 'text-[#445457] hover:bg-white'
                          }`}
                        >
                          <span className="w-4 h-4 flex items-center justify-center">
                            <IconWithFallback
                              src={sub.iconSrc}
                              fallbackEmoji={sub.icon}
                              alt={sub.title}
                              size={16}
                              className="w-full h-full object-contain"
                            />
                          </span>
                          <span>{sub.title}</span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Partnerships */}
              <Link
                href={`/${locale}/partnerships`}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between ${
                  isPathActive('partnerships')
                    ? 'bg-[#d8f0f4] text-[#0d3b43] font-black shadow-2xs'
                    : 'text-[#1b2628] hover:bg-[#f4ede2]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 flex items-center justify-center">
                    <IconWithFallback
                      src="/icons/nav/partnerships.png"
                      fallbackEmoji="🏛️"
                      alt={dict.nav.partnerships}
                      size={18}
                      className="w-full h-full object-contain"
                    />
                  </span>
                  <span>{dict.nav.partnerships}</span>
                </div>
                {isPathActive('partnerships') && (
                  <span className="text-3xs font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#0d3b43] text-white">
                    {isAr ? 'النشط' : 'Active'}
                  </span>
                )}
              </Link>

              {/* Action Buttons */}
              <div className="pt-4 mt-2 border-t border-[#e5e0d6] space-y-3">
                <Link
                  href={`/${locale}/membership`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-[#c85a32] hover:bg-[#b84e27] transition-all shadow-card"
                >
                  {dict.membership.apply}
                </Link>
                <Link
                  href={`/${locale}/contact`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl text-sm font-bold text-[#0d3b43] bg-white border border-[#cfc7b9] hover:bg-[#f4ede2] transition-all shadow-2xs"
                >
                  {dict.nav.contact}
                </Link>
              </div>

              {/* Direct Association Contact Micro-Card */}
              <div className="mt-4 p-4 rounded-2xl bg-white border border-[#e5e0d6] text-center text-3xs text-[#5f7174]">
                <span className="font-bold text-[#08242a] block mb-1">
                  {isAr ? 'جمعية روح الفنون والثقافة — AMYCC' : 'Spirit of Arts & Culture Association'}
                </span>
                <span>contact@amycc.org • {isAr ? 'المملكة المغربية' : 'Morocco'}</span>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

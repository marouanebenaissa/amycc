import React from 'react'

export type FlaticonName =
  | 'palette'
  | 'theater'
  | 'museum'
  | 'home'
  | 'handshake'
  | 'users'
  | 'calendar'
  | 'ticket'
  | 'newspaper'
  | 'mail'
  | 'chat'
  | 'scroll'
  | 'chart'
  | 'chart-bars'
  | 'clipboard'
  | 'gear'
  | 'shield'
  | 'morocco-star'
  | 'heart-donation'
  | 'brain'
  | 'file'
  | 'faq'
  | 'eye'
  | 'megaphone'
  | 'sparkles'
  | 'star'
  | 'music'
  | 'rocket'
  | 'lightning'
  | 'book'
  | 'lock'
  | 'unlock'
  | 'key'
  | 'search'
  | 'sliders'
  | 'trash'
  | 'refresh'
  | 'pin'
  | 'phone'
  | 'external'
  | 'check'
  | 'cross'

const EMOJI_TO_NAME: Record<string, FlaticonName> = {
  // Creative & Cultural
  '🎨': 'palette',
  '🎭': 'theater',
  '🎪': 'theater',
  '🎬': 'theater',
  '🏛️': 'museum',
  '🏛': 'museum',
  '🏢': 'museum',
  '🌍': 'museum',
  '🌐': 'museum',
  '🎵': 'music',
  '🎶': 'music',
  '🎼': 'music',
  '✨': 'sparkles',
  '🔥': 'sparkles',
  '⭐': 'star',
  '🌟': 'star',
  '🏆': 'star',
  '🎯': 'morocco-star',
  '👑': 'morocco-star',
  '🇲🇦': 'morocco-star',
  '💪': 'morocco-star',
  '🌱': 'morocco-star',

  // Community & Engagement
  '🤝': 'handshake',
  '👥': 'users',
  '👤': 'users',
  '💝': 'heart-donation',
  '💖': 'heart-donation',
  '❤️': 'heart-donation',
  '🧠': 'brain',
  '💡': 'brain',

  // Events, News & Calendar
  '📅': 'calendar',
  '🎟️': 'ticket',
  '🎟': 'ticket',
  '🎫': 'ticket',
  '📰': 'newspaper',
  '🚀': 'rocket',
  '⚡': 'lightning',

  // Communications & Messages
  '✉️': 'mail',
  '✉': 'mail',
  '📧': 'mail',
  '📥': 'mail',
  '💬': 'chat',
  '📢': 'megaphone',
  '📍': 'pin',
  '📌': 'pin',
  '📞': 'phone',
  '📱': 'phone',
  '🏠': 'home',
  '↗': 'external',
  '🔗': 'external',

  // Documents & System
  '📜': 'scroll',
  '📄': 'file',
  '📑': 'file',
  '💻': 'file',
  '📋': 'clipboard',
  '📝': 'clipboard',
  '📚': 'book',
  '📖': 'book',
  '🎓': 'book',
  '📈': 'chart',
  '📉': 'chart',
  '📊': 'chart-bars',
  '⚙️': 'gear',
  '⚙': 'gear',
  '🔧': 'gear',
  '🛡️': 'shield',
  '🛡': 'shield',
  '🔒': 'lock',
  '🔐': 'lock',
  '🔓': 'unlock',
  '🚪': 'unlock',
  '🔑': 'key',
  '🔍': 'search',
  '🔎': 'search',
  '🎛️': 'sliders',
  '🎛': 'sliders',
  '🔄': 'refresh',
  '🗑️': 'trash',
  '🗑': 'trash',
  '❓': 'faq',
  'ℹ️': 'faq',
  'ℹ': 'faq',
  '👁️': 'eye',
  '👁': 'eye',
  '✓': 'check',
  '✔': 'check',
  '✕': 'cross',
  '✖': 'cross',
}

interface FlaticonProps extends React.SVGProps<SVGSVGElement> {
  name?: FlaticonName
  icon?: string
  size?: number
  className?: string
}

export function Flaticon({
  name,
  icon,
  size = 20,
  className = '',
  ...props
}: FlaticonProps) {
  // Resolve icon name from either the name prop or the emoji/icon string
  let resolvedName: FlaticonName = 'sparkles'

  if (name) {
    resolvedName = name
  } else if (icon) {
    const trimmed = icon.trim()
    if (EMOJI_TO_NAME[trimmed]) {
      resolvedName = EMOJI_TO_NAME[trimmed]
    } else if (trimmed in ICON_PATHS) {
      resolvedName = trimmed as FlaticonName
    }
  }

  const renderContent = ICON_PATHS[resolvedName] || ICON_PATHS.sparkles

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      className={`inline-block shrink-0 align-middle ${className}`}
      {...props}
    >
      {renderContent}
    </svg>
  )
}

/**
 * High-definition Flaticon-style SVG Vector Paths
 */
const ICON_PATHS: Record<FlaticonName, React.ReactNode> = {
  // Palette / Creative Arts
  palette: (
    <>
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c3.31 0 6-2.69 6-6 0-4.96-4.49-9-10-9z"
        opacity="0.18"
      />
      <circle cx="6.5" cy="11.5" r="1.5" />
      <circle cx="9.5" cy="7.5" r="1.5" />
      <circle cx="14.5" cy="7.5" r="1.5" />
      <circle cx="17.5" cy="11.5" r="1.5" />
      <path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10 .83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c3.31 0 6-2.69 6-6 0-4.96-4.49-9-10-9zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8c0 2.21-1.79 4-4 4h-1.77c-1.93 0-3.5 1.57-3.5 3.5 0 .58.15 1.12.41 1.6-.37-.06-.75-.1-1.14-.1z" />
    </>
  ),

  // Theater / Scenic Arts
  theater: (
    <>
      <path
        d="M9 3C5.13 3 2 6.13 2 10c0 3.31 2.3 6.09 5.37 6.81l.46 2.19c.1.48.52.82 1.01.82.35 0 .68-.17.88-.47L11.5 17h.5c.34 0 .68-.03 1.01-.08C11.75 15.35 11 13.27 11 11c0-2.82 1.25-5.36 3.24-7.07C12.75 3.35 10.94 3 9 3z"
        opacity="0.2"
      />
      <circle cx="6.5" cy="9" r="1.2" />
      <circle cx="10" cy="9" r="1.2" />
      <path d="M6 13c.6 1 1.6 1.5 2.5 1.5s1.9-.5 2.5-1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path
        d="M16 7c-3.31 0-6 2.69-6 6 0 2.97 2.16 5.43 5 5.91V21c0 .55.45 1 1 1s1-.45 1-1v-2.09c2.84-.48 5-2.94 5-5.91 0-3.31-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"
      />
      <circle cx="14.5" cy="12" r="1" />
      <circle cx="17.5" cy="12" r="1" />
      <path d="M14.5 15c.5.5 1 .8 1.5.8s1-.3 1.5-.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </>
  ),

  // Museum / Heritage / Institution
  museum: (
    <>
      <path d="M12 2L2 7v2h20V7L12 2z" opacity="0.25" />
      <path d="M12 2L2 7v2h20V7L12 2zm8 5H4l8-4 8 4zM4 11h2v7H4zm5 0h2v7H9zm5 0h2v7h-2zm5 0h2v7h-2zM2 20h20v2H2z" />
    </>
  ),

  // Home / Dashboard
  home: (
    <>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" opacity="0.2" />
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z" />
    </>
  ),

  // Handshake / Volunteering / Partnership
  handshake: (
    <>
      <path
        d="M21.71 8.71l-3.42-3.42a2.008 2.008 0 0 0-2.83 0L13.5 7.25 11.54 5.3a1.996 1.996 0 0 0-2.83 0L2.29 11.71a1.003 1.003 0 0 0 0 1.42l3.42 3.42c.78.78 2.05.78 2.83 0l2.46-2.46 2.46 2.46c.78.78 2.05.78 2.83 0l5.42-5.42c.39-.39.39-1.03 0-1.42z"
        opacity="0.18"
      />
      <path d="M21.71 8.71l-3.42-3.42a2.008 2.008 0 0 0-2.83 0L13.5 7.25 11.54 5.3a1.996 1.996 0 0 0-2.83 0L2.29 11.71a1.003 1.003 0 0 0 0 1.42l3.42 3.42c.78.78 2.05.78 2.83 0l2.46-2.46 2.46 2.46c.78.78 2.05.78 2.83 0l5.42-5.42c.39-.39.39-1.03 0-1.42zm-8.21 6.88l-2.46-2.46a1.003 1.003 0 0 0-1.42 0l-2.46 2.46-2.71-2.71 5.71-5.71 2.46 2.46a1.003 1.003 0 0 0 1.42 0l2.46-2.46 2.71 2.71-5.71 5.71z" />
    </>
  ),

  // Users / Team / Community
  users: (
    <>
      <path d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3z" opacity="0.25" />
      <path d="M16 13c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm-8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19H1v-2.5C1 14.17 5.67 13 8 13zM8 11c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm8 0c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3z" />
    </>
  ),

  // Calendar / Dates
  calendar: (
    <>
      <rect x="3" y="6" width="18" height="15" rx="3" opacity="0.2" />
      <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM7 11h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2zm-8 4h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z" />
    </>
  ),

  // Ticket / Admission / Passes
  ticket: (
    <>
      <path d="M20 12c0-1.1.9-2 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-1.99.9-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2z" opacity="0.2" />
      <path d="M20 4H4c-1.1 0-2 .9-2 2v4c1.1 0 2 .9 2 2s-.9 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2s.9-2 2-2V6c0-1.1-.9-2-2-2zm0 14H4v-1.54c1.45-.66 2.45-2.11 2.45-3.81 0-1.7-.99-3.15-2.45-3.81V6h16v2.84c-1.45.66-2.45 2.11-2.45 3.81 0 1.7.99 3.15 2.45 3.81V18zm-9-9h2v2h-2zm0 4h2v2h-2z" />
    </>
  ),

  // Newspaper / Press Articles
  newspaper: (
    <>
      <path d="M4 6h16v12H4z" opacity="0.2" />
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-1 14H5c-.55 0-1-.45-1-1V7h16v10c0 .55-.45 1-1 1zm-1-9H6v4h12V9zm-5 5H6v2h7v-2zm5 0h-3v2h3v-2z" />
    </>
  ),

  // Mail / Inquiries / Envelope
  mail: (
    <>
      <path d="M20 6H4l8 5 8-5z" opacity="0.3" />
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z" />
    </>
  ),

  // Chat / Messages
  chat: (
    <>
      <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" opacity="0.2" />
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12zM7 9h10v2H7zm0-3h10v2H7zm0 6h7v2H7z" />
    </>
  ),

  // Scroll / Legal Dahir / Certificate
  scroll: (
    <>
      <path d="M19 4H8C6.34 4 5 5.34 5 7v10c0 1.66 1.34 3 3 3h11c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" opacity="0.2" />
      <path d="M19 2H8C5.24 2 3 4.24 3 7v10c0 2.76 2.24 5 5 5h11c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3zm1 17c0 .55-.45 1-1 1H8c-1.66 0-3-1.34-3-3V7c0-1.66 1.34-3 3-3h11c.55 0 1 .45 1 1v14zM8 7h8v2H8zm0 4h8v2H8zm0 4h5v2H8z" />
    </>
  ),

  // Chart / Impact Growth
  chart: (
    <>
      <path d="M4 19h16v2H2V3h2v16z" />
      <path d="M7 14l4-4 3 3 6-7 1.41 1.41-7.41 8.59-3-3-4 4z" />
    </>
  ),

  // Chart Bars / Overview
  'chart-bars': (
    <>
      <path d="M4 19h16v2H2V3h2v16z" />
      <rect x="6" y="10" width="3" height="7" rx="1" opacity="0.5" />
      <rect x="11" y="6" width="3" height="11" rx="1" />
      <rect x="16" y="13" width="3" height="4" rx="1" opacity="0.3" />
    </>
  ),

  // Clipboard / Applications
  clipboard: (
    <>
      <path d="M19 5h-4.18C14.4 3.84 13.3 3 12 3c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-7-1c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm7 15H5V7h2v2h10V7h2v12zm-8-8l-2 2-1-1-1.41 1.41 2.41 2.41 3.41-3.41L11 11zm3 4H9v-2h5v2z" />
    </>
  ),

  // Gear / Settings
  gear: (
    <>
      <circle cx="12" cy="12" r="3" opacity="0.3" />
      <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zm-7.43 2.52c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
    </>
  ),

  // Shield / Security
  shield: (
    <>
      <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" opacity="0.2" />
      <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm6 9.09c0 4-2.55 7.7-6 8.83-3.45-1.13-6-4.82-6-8.83V6.31l6-2.25 6 2.25v4.78zM10.9 14.5l-2.4-2.4 1.4-1.4 1 1 3.6-3.6 1.4 1.4-5 5z" />
    </>
  ),

  // Morocco Star / Heritage Emblem
  'morocco-star': (
    <>
      <circle cx="12" cy="12" r="10" opacity="0.15" />
      <path
        d="M12 3.5l2.6 6.1 6.6.6-4.9 4.3 1.4 6.5L12 17.5l-5.7 3.5 1.4-6.5-4.9-4.3 6.6-.6L12 3.5z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="12" cy="12" r="2.2" />
    </>
  ),

  // Heart / Donations
  'heart-donation': (
    <>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" opacity="0.25" />
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35zm0-16.15c-1.3 0-2.5.6-3.2 1.6L7.5 8.3 6.2 6.8C5.5 5.8 4.3 5.2 3 5.2c-1.8 0-3.2 1.4-3.2 3.3 0 2.8 2.6 5.2 6.8 9l5.4 4.9 5.4-4.9c4.2-3.8 6.8-6.2 6.8-9 0-1.9-1.4-3.3-3.2-3.3-1.3 0-2.5.6-3.2 1.6l-1.3 1.5-1.3-1.5c-.7-1-1.9-1.6-3.2-1.6z" />
    </>
  ),

  // Brain / Innovation / Lab
  brain: (
    <>
      <path d="M12 3a5 5 0 0 0-4.9 4 4.5 4.5 0 0 0-2.1 4 4.5 4.5 0 0 0 1 2.9A4.5 4.5 0 0 0 8 21h8a4.5 4.5 0 0 0 2-7.1 4.5 4.5 0 0 0 1-2.9 4.5 4.5 0 0 0-2.1-4A5 5 0 0 0 12 3z" opacity="0.2" />
      <path d="M12 2a6 6 0 0 0-5.9 5A5.5 5.5 0 0 0 3.5 12a5.5 5.5 0 0 0 1.3 3.6A5.5 5.5 0 0 0 8 22h8a5.5 5.5 0 0 0 3.2-6.4A5.5 5.5 0 0 0 20.5 12a5.5 5.5 0 0 0-2.6-5A6 6 0 0 0 12 2zm-1 4v5H7V9a4 4 0 0 1 4-3zm2 0a4 4 0 0 1 4 3v2h-4V6zm-2 7v7H8a3.5 3.5 0 0 1-2.5-5.9L6.6 13H11zm2 0h4.4l1.1 1.1A3.5 3.5 0 0 1 16 20h-3v-7z" />
    </>
  ),

  // File / CMS Page
  file: (
    <>
      <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6z" opacity="0.2" />
      <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 12h8v2H8zm0 4h8v2H8z" />
    </>
  ),

  // FAQ / Question
  faq: (
    <>
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" opacity="0.2" />
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12zm-9-4h2v2h-2zm1-8c-1.66 0-3 1.34-3 3h2c0-.55.45-1 1-1s1 .45 1 1c0 1-1.5 1-1.5 2.5h2c0-.85 1.5-.95 1.5-2.5 0-1.66-1.34-3-3-3z" />
    </>
  ),

  // Eye / Inspection / Reviewer
  eye: (
    <>
      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5z" opacity="0.2" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 13c-3.04 0-5.5-2.46-5.5-5.5s2.46-5.5 5.5-5.5 5.5 2.46 5.5 5.5-2.46 5.5-5.5 5.5z" />
    </>
  ),

  // Megaphone / Communications
  megaphone: (
    <>
      <path d="M4 8v8h4l6 5V3L8 8H4z" opacity="0.25" />
      <path d="M4 8v8h4l6 5V3L8 8H4zm8 8.16l-3.2-2.67H6v-3h2.8L12 7.84v8.32zM16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    </>
  ),

  // Sparkles / Highlights
  sparkles: (
    <>
      <path d="M12 2L9.5 8.5 3 11l6.5 2.5L12 20l2.5-6.5L21 11l-6.5-2.5L12 2zm7 13l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15zm0-12l-1.25 2.75L15 7l2.75 1.25L19 11l1.25-2.75L23 7l-2.75-1.25L19 3z" />
    </>
  ),

  // Star / Rating
  star: (
    <>
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </>
  ),

  // Music / Notes
  music: (
    <>
      <circle cx="9" cy="18" r="3" opacity="0.3" />
      <circle cx="17" cy="16" r="3" opacity="0.3" />
      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h6V3h-8zm-2 16c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm8-2c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
    </>
  ),

  // Rocket / Launch
  rocket: (
    <>
      <path d="M12 2.5s-4 4.5-4 10.5h8c0-6-4-10.5-4-10.5z" opacity="0.25" />
      <path d="M12 2.5s-4 4.5-4 10.5h8c0-6-4-10.5-4-10.5zm0 8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm-4 4.5l-2.5 3.5h13l-2.5-3.5H8zm-3 5.5v1.5h14V20.5H5z" />
    </>
  ),

  // Lightning / Quick Action
  lightning: (
    <>
      <path d="M7 2v11h3v9l7-12h-4l4-8z" opacity="0.2" />
      <path d="M7 2v11h3v9l7-12h-4l4-8z" />
    </>
  ),

  // Book / Academy
  book: (
    <>
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 16H6c-.55 0-1-.45-1-1V5h13v14z" opacity="0.2" />
      <path d="M18 2H6c-1.2 0-2 .8-2 2v16c0 1.2.8 2 2 2h12c1.2 0 2-.8 2-2V4c0-1.2-.8-2-2-2zm0 18H6V4h12v16zM8 7h8v2H8zm0 4h8v2H8zm0 4h5v2H8z" />
    </>
  ),

  // Lock
  lock: (
    <>
      <rect x="4" y="10" width="16" height="11" rx="2" opacity="0.2" />
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
    </>
  ),

  // Unlock
  unlock: (
    <>
      <rect x="4" y="10" width="16" height="11" rx="2" opacity="0.2" />
      <path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5-2.28 0-4.22 1.54-4.8 3.63l1.93.52C10.5 3.96 11.21 3 12 3c1.66 0 3 1.34 3 3v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10z" />
    </>
  ),

  // Key
  key: (
    <>
      <path d="M12.65 10A5.99 5.99 0 0 0 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6a5.99 5.99 0 0 0 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
    </>
  ),

  // Search
  search: (
    <>
      <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
    </>
  ),

  // Sliders / Granular Controls
  sliders: (
    <>
      <path d="M4 6h10v2H4zm0 6h4v2H4zm0 6h8v2H4zm14-14h2v6h-2zm-6 6h2v6h-2zm4 6h2v6h-2z" />
    </>
  ),

  // Trash / Delete
  trash: (
    <>
      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
    </>
  ),

  // Refresh
  refresh: (
    <>
      <path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
    </>
  ),

  // Location Pin
  pin: (
    <>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </>
  ),

  // Phone
  phone: (
    <>
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
    </>
  ),

  // External Link / Arrow
  external: (
    <>
      <path d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
    </>
  ),

  // Checkmark
  check: (
    <>
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </>
  ),

  // Cross / Close
  cross: (
    <>
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </>
  ),
}

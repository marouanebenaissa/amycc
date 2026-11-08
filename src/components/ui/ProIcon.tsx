'use client'

import React from 'react'

export type ProIconName =
  | 'palette'
  | 'theatre'
  | 'theater'
  | 'music'
  | 'culture'
  | 'museum'
  | 'youth'
  | 'rocket'
  | 'community'
  | 'handshake'
  | 'morocco-star'
  | 'users'
  | 'team'
  | 'calendar'
  | 'newspaper'
  | 'news'
  | 'ticket'
  | 'mail'
  | 'envelope'
  | 'phone'
  | 'pin'
  | 'location'
  | 'home'
  | 'external'
  | 'sparkles'
  | 'star'
  | 'heart'
  | 'heart-donation'
  | 'brain'
  | 'book'
  | 'education'
  | 'scroll'
  | 'certificate'
  | 'shield'
  | 'chart'
  | 'impact'
  | 'target'
  | 'mission'
  | 'diamond'
  | 'values'
  | 'telescope'
  | 'vision'
  | 'tag'
  | 'identity'
  | 'map'
  | 'roadmap'
  | 'scale'
  | 'justice'
  | 'dove'
  | 'peace'
  | 'centers'
  | 'ngo'
  | 'sponsors'
  | 'check'
  | 'cross'
  | 'clock'
  | 'credit-card'
  | 'bank'
  | 'edit'
  | 'lock'
  | 'unlock'
  | 'search'
  | 'globe'
  | 'award'
  | 'mic'
  | 'camera'
  | 'quote'
  | 'sprout'
  | 'lightning'
  | 'faq'
  | 'chat'
  | 'megaphone'
  | 'bullhorn'
  | 'eye'
  | 'file'
  | 'document'
  | 'clipboard'
  | 'sliders'
  | 'gear'
  | 'refresh'
  | 'trash'
  | 'key'
  | 'facebook'
  | 'instagram'
  | 'youtube'
  | 'linkedin'
  | 'whatsapp'
  | 'twitter'

const EMOJI_MAP: Record<string, ProIconName> = {
  // Creative & Cultural Arts
  '🎨': 'palette',
  '🎭': 'theatre',
  '🎪': 'theatre',
  '🎬': 'theatre',
  '🎵': 'music',
  '🎶': 'music',
  '🎼': 'music',
  '🏛️': 'culture',
  '🏛': 'culture',
  '🏢': 'centers',
  '🌍': 'globe',
  '🌐': 'globe',
  '✨': 'sparkles',
  '🔥': 'sparkles',
  '⭐': 'star',
  '🌟': 'star',
  '★': 'star',
  '✦': 'sparkles',
  '🏆': 'award',
  '🥇': 'award',
  '👑': 'morocco-star',
  '🇲🇦': 'morocco-star',
  '🌱': 'sprout',
  '🌿': 'sprout',

  // Community & Philanthropy
  '🤝': 'community',
  '👥': 'users',
  '👤': 'users',
  '💝': 'heart',
  '💖': 'heart',
  '❤️': 'heart',
  '♥': 'heart',
  '🧠': 'brain',
  '💡': 'brain',

  // Youth & Innovation
  '🚀': 'youth',
  '⚡': 'lightning',
  '💪': 'youth',

  // Governance, Values & Structure
  '🏷️': 'tag',
  '🏷': 'tag',
  '💎': 'diamond',
  '🎯': 'target',
  '🔭': 'telescope',
  '🗺️': 'map',
  '🗺': 'map',
  '⚖️': 'scale',
  '⚖': 'scale',
  '🕊️': 'dove',
  '🕊': 'dove',

  // Events, News & Publishing
  '📅': 'calendar',
  '🗓️': 'calendar',
  '🗓': 'calendar',
  '🎟️': 'ticket',
  '🎟': 'ticket',
  '🎫': 'ticket',
  '📰': 'newspaper',
  '📜': 'scroll',
  '📄': 'file',
  '📑': 'document',
  '📥': 'mail',
  '📩': 'mail',
  '✉️': 'mail',
  '✉': 'mail',
  '📧': 'mail',
  '💬': 'chat',
  '📢': 'megaphone',
  '📍': 'pin',
  '📌': 'pin',
  '📞': 'phone',
  '📱': 'phone',
  '🏠': 'home',
  '📘': 'book',
  '📚': 'education',
  '📖': 'book',
  '🎓': 'education',
  '📸': 'camera',
  '🎙️': 'mic',
  '🎙': 'mic',
  '❝': 'quote',
  '✓': 'check',
  '✔': 'check',
  '✕': 'cross',
  '✖': 'cross',
}

export interface ProIconProps extends React.SVGProps<SVGSVGElement> {
  name?: ProIconName | string
  icon?: string
  size?: number
  className?: string
  strokeWidth?: number
}

/**
 * World-Class Flaticon Pro SVG Vector Icon Component
 * Tailored for AMYCC cultural identity and public institutional excellence.
 */
export function ProIcon({
  name,
  icon,
  size = 20,
  className = '',
  strokeWidth = 1.8,
  ...props
}: ProIconProps) {
  let resolved: ProIconName = 'sparkles'
  const rawCandidate = (name || icon || '').trim()

  if (rawCandidate) {
    if (rawCandidate in ICONS) {
      resolved = rawCandidate as ProIconName
    } else if (EMOJI_MAP[rawCandidate]) {
      resolved = EMOJI_MAP[rawCandidate]
    } else {
      const lower = rawCandidate.toLowerCase()
      if (lower in ICONS) {
        resolved = lower as ProIconName
      } else if (EMOJI_MAP[lower]) {
        resolved = EMOJI_MAP[lower]
      }
    }
  }

  const iconRenderer = ICONS[resolved] || ICONS.sparkles

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`inline-block shrink-0 align-middle ${className}`}
      {...props}
    >
      {iconRenderer}
    </svg>
  )
}

/**
 * 24x24 Clean Professional SVG Paths (Flaticon Pro Vector Standards)
 */
const ICONS: Record<ProIconName, React.ReactNode> = {
  // Fine Arts & Creative Painting
  palette: (
    <>
      <path
        d="M12 3c-4.97 0-9 4.03-9 9 0 4.12 2.77 7.59 6.56 8.65.35.1.56.44.56.8 0 1.07.87 1.93 1.94 1.93.9 0 1.7-.63 1.89-1.51.13-.62.64-1.07 1.28-1.07h1.07c2.98 0 5.4-2.42 5.4-5.4V14.5c0-6.35-4.35-11.5-9.7-11.5z"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <circle cx="7.5" cy="10" r="1.3" fill="currentColor" />
      <circle cx="11.5" cy="7.5" r="1.3" fill="currentColor" />
      <circle cx="16" cy="9.5" r="1.3" fill="currentColor" />
      <circle cx="17" cy="14" r="1.3" fill="currentColor" />
      <ellipse cx="8.5" cy="15.5" rx="1.5" ry="1.8" fill="none" strokeWidth="1.5" />
      <path d="M10 21l7-9.5 2 2-7.5 9.5-2 .5.5-2.5z" strokeWidth="1.4" />
    </>
  ),

  // Theatre & Scenic Expression (Classic Dual Drama Masks: Comedy & Tragedy)
  theatre: (
    <>
      {/* Front Comedy Mask */}
      <path
        d="M9 4.5c-3.3 0-6 2.5-6 5.7 0 2.6 1.8 4.8 4.4 5.5l.2 1.6 1.9-1.1c.6.1 1.1.1 1.7.1s1.2 0 1.7-.1l1.9 1.1.2-1.6C16.8 15 18.6 12.8 18.6 10.2c0-3.2-2.7-5.7-6-5.7H9z"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <path d="M6 9c.8-.8 2-.8 2.8 0" strokeWidth="1.6" />
      <path d="M12 9c.8-.8 2-.8 2.8 0" strokeWidth="1.6" />
      <path d="M7.5 12.2c.8 1.5 3.8 1.5 4.6 0" strokeWidth="1.6" />
      {/* Back Tragedy Mask Outline */}
      <path
        d="M16 8c2.5.5 4.5 2.5 4.5 5 0 2.2-1.6 4.1-3.8 4.7l-.2 1.4-1.6-.9c-.5.1-1 .1-1.5.1"
        strokeWidth="1.5"
      />
      <path d="M17.5 11c-.6.6-1.4.4-1.8 0" strokeWidth="1.4" />
      <path d="M16 15c-.7-1-2.3-1-3 0" strokeWidth="1.4" />
    </>
  ),
  theater: (
    <>
      <path
        d="M9 4.5c-3.3 0-6 2.5-6 5.7 0 2.6 1.8 4.8 4.4 5.5l.2 1.6 1.9-1.1c.6.1 1.1.1 1.7.1s1.2 0 1.7-.1l1.9 1.1.2-1.6C16.8 15 18.6 12.8 18.6 10.2c0-3.2-2.7-5.7-6-5.7H9z"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <path d="M6 9c.8-.8 2-.8 2.8 0" strokeWidth="1.6" />
      <path d="M12 9c.8-.8 2-.8 2.8 0" strokeWidth="1.6" />
      <path d="M7.5 12.2c.8 1.5 3.8 1.5 4.6 0" strokeWidth="1.6" />
      <path
        d="M16 8c2.5.5 4.5 2.5 4.5 5 0 2.2-1.6 4.1-3.8 4.7l-.2 1.4-1.6-.9c-.5.1-1 .1-1.5.1"
        strokeWidth="1.5"
      />
      <path d="M17.5 11c-.6.6-1.4.4-1.8 0" strokeWidth="1.4" />
      <path d="M16 15c-.7-1-2.3-1-3 0" strokeWidth="1.4" />
    </>
  ),

  // Music & Heritage Sounds (Double Beamed Sixteenth Notes)
  music: (
    <>
      <ellipse cx="6.5" cy="17" rx="2.8" ry="2" transform="rotate(-20 6.5 17)" fill="currentColor" />
      <ellipse cx="15.5" cy="14" rx="2.8" ry="2" transform="rotate(-20 15.5 14)" fill="currentColor" />
      <path d="M9 16.5V5.5" strokeWidth="1.8" />
      <path d="M18 13.5V3.5" strokeWidth="1.8" />
      <path d="M9 5.5l9-2" strokeWidth="2.5" />
      <path d="M9 8.5l9-2" strokeWidth="1.8" />
      <path d="M19.5 8.5c1 .8 1.6 2 1.6 3.2" strokeWidth="1.4" />
    </>
  ),

  // Moroccan Cultural Heritage (Moorish Horseshoe Archway)
  culture: (
    <>
      <rect x="3" y="19.5" width="18" height="2" rx="0.5" fill="currentColor" />
      <path d="M5 19.5V11c0-3.86 3.14-7 7-7s7 3.14 7 7v8.5" strokeWidth="1.8" />
      <path
        d="M8.5 19.5V13c0-1.2.8-2.4 2-3 .4-1 .8-1.8 1.5-1.8s1.1.8 1.5 1.8c1.2.6 2 1.8 2 3v6.5"
        fill="currentColor"
        fillOpacity="0.14"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="3.5" r="1" fill="currentColor" />
    </>
  ),
  museum: (
    <>
      <rect x="3" y="19.5" width="18" height="2" rx="0.5" fill="currentColor" />
      <path d="M5 19.5V11c0-3.86 3.14-7 7-7s7 3.14 7 7v8.5" strokeWidth="1.8" />
      <path
        d="M8.5 19.5V13c0-1.2.8-2.4 2-3 .4-1 .8-1.8 1.5-1.8s1.1.8 1.5 1.8c1.2.6 2 1.8 2 3v6.5"
        fill="currentColor"
        fillOpacity="0.14"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="3.5" r="1" fill="currentColor" />
    </>
  ),

  // Youth Empowerment & Ascending Ambition (Sleek 45° Launch Rocket)
  youth: (
    <>
      <path
        d="M18.5 3.5c-2.3.8-7.3 2.3-10.4 7.3-1.2 1.7-1.3 3.8-.9 5.4l6.1 6.1c1.6.4 3.7.3 5.4-.9 5-3.1 6.5-8.1 7.3-10.4l-7.5-7.5z"
        fill="currentColor"
        fillOpacity="0.14"
        strokeWidth="1.8"
      />
      <circle cx="15" cy="10" r="1.6" strokeWidth="1.4" />
      <path d="M8.5 11l-4 1.6.8 3.6 3.2-.4" strokeWidth="1.5" />
      <path d="M14 16.5l1.6 4 3.6-.8-.4-3.2" strokeWidth="1.5" />
      <path d="M7.5 18l-3 3 1.5.5-2 2 3.5-.5.5 1.5 2.5-2.5" fill="currentColor" strokeWidth="0.8" />
    </>
  ),
  rocket: (
    <>
      <path
        d="M18.5 3.5c-2.3.8-7.3 2.3-10.4 7.3-1.2 1.7-1.3 3.8-.9 5.4l6.1 6.1c1.6.4 3.7.3 5.4-.9 5-3.1 6.5-8.1 7.3-10.4l-7.5-7.5z"
        fill="currentColor"
        fillOpacity="0.14"
        strokeWidth="1.8"
      />
      <circle cx="15" cy="10" r="1.6" strokeWidth="1.4" />
      <path d="M8.5 11l-4 1.6.8 3.6 3.2-.4" strokeWidth="1.5" />
      <path d="M14 16.5l1.6 4 3.6-.8-.4-3.2" strokeWidth="1.5" />
      <path d="M7.5 18l-3 3 1.5.5-2 2 3.5-.5.5 1.5 2.5-2.5" fill="currentColor" strokeWidth="0.8" />
    </>
  ),

  // Community Volunteering & Caring Handshake
  community: (
    <>
      <path
        d="M12 5.5c-1.1-1.5-3.1-1.7-4.3-.6-1.4 1.4-1.2 3.3.8 5.3l3.5 3.5 3.5-3.5c2-2 2.2-3.9.8-5.3-1.2-1.1-3.2-.9-4.3.6z"
        fill="currentColor"
        strokeWidth="1.2"
      />
      <path d="M2.5 17.5l3.5-3.5c.7-.7 1.6-.9 2.5-.5l1.8 1c.8.4 1.2 1.1 1.2 2v1.5l-4 4-5-4.5z" fill="currentColor" fillOpacity="0.12" />
      <path d="M2.5 17.5l3.5-3.5c.7-.7 1.6-.9 2.5-.5l1.8 1c.8.4 1.2 1.1 1.2 2v1.5l-4 4" strokeWidth="1.6" />
      <path d="M21.5 17.5l-3.5-3.5c-.7-.7-1.6-.9-2.5-.5l-1.8 1c-.8.4-1.2 1.1-1.2 2v1.5l4 4 5-4.5z" fill="currentColor" fillOpacity="0.12" />
      <path d="M21.5 17.5l-3.5-3.5c-.7-.7-1.6-.9-2.5-.5l-1.8 1c-.8.4-1.2 1.1-1.2 2v1.5l4 4" strokeWidth="1.6" />
      <path d="M10 16.5c.8.8 2 .8 2.8 0" strokeWidth="1.5" />
    </>
  ),
  handshake: (
    <>
      <path
        d="M12 5.5c-1.1-1.5-3.1-1.7-4.3-.6-1.4 1.4-1.2 3.3.8 5.3l3.5 3.5 3.5-3.5c2-2 2.2-3.9.8-5.3-1.2-1.1-3.2-.9-4.3.6z"
        fill="currentColor"
        strokeWidth="1.2"
      />
      <path d="M2.5 17.5l3.5-3.5c.7-.7 1.6-.9 2.5-.5l1.8 1c.8.4 1.2 1.1 1.2 2v1.5l-4 4-5-4.5z" fill="currentColor" fillOpacity="0.12" />
      <path d="M2.5 17.5l3.5-3.5c.7-.7 1.6-.9 2.5-.5l1.8 1c.8.4 1.2 1.1 1.2 2v1.5l-4 4" strokeWidth="1.6" />
      <path d="M21.5 17.5l-3.5-3.5c-.7-.7-1.6-.9-2.5-.5l-1.8 1c-.8.4-1.2 1.1-1.2 2v1.5l4 4 5-4.5z" fill="currentColor" fillOpacity="0.12" />
      <path d="M21.5 17.5l-3.5-3.5c-.7-.7-1.6-.9-2.5-.5l-1.8 1c-.8.4-1.2 1.1-1.2 2v1.5l4 4" strokeWidth="1.6" />
      <path d="M10 16.5c.8.8 2 .8 2.8 0" strokeWidth="1.5" />
    </>
  ),

  // Moroccan 8-Pointed Star Rosette (Khatam Sulaymani)
  'morocco-star': (
    <>
      <polygon points="12,2 15,6.5 20,6.5 18,11.5 21,15.5 16,17.5 14,22 10,20 6,22 7.5,17 3,14.5 6,10.5 4,6.5 9,6.5" fill="currentColor" fillOpacity="0.1" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
    </>
  ),

  // Users & Team Collective
  users: (
    <>
      <circle cx="12" cy="7" r="3" fill="currentColor" fillOpacity="0.14" strokeWidth="1.8" />
      <path d="M6 19v-2c0-2.2 2.7-4 6-4s6 1.8 6 4v2" strokeWidth="1.8" />
      <circle cx="18.5" cy="8.5" r="2" strokeWidth="1.5" />
      <path d="M18.5 13.5c1.8.3 3 1.5 3 3v1.5" strokeWidth="1.5" />
    </>
  ),
  team: (
    <>
      <circle cx="12" cy="7" r="3" fill="currentColor" fillOpacity="0.14" strokeWidth="1.8" />
      <path d="M6 19v-2c0-2.2 2.7-4 6-4s6 1.8 6 4v2" strokeWidth="1.8" />
      <circle cx="18.5" cy="8.5" r="2" strokeWidth="1.5" />
      <path d="M18.5 13.5c1.8.3 3 1.5 3 3v1.5" strokeWidth="1.5" />
    </>
  ),

  // Calendar & Scheduled Dates
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="17" rx="3" fill="currentColor" fillOpacity="0.1" strokeWidth="1.8" />
      <line x1="3" y1="9" x2="21" y2="9" strokeWidth="1.8" />
      <line x1="8" y1="2" x2="8" y2="5" strokeWidth="1.8" />
      <line x1="16" y1="2" x2="16" y2="5" strokeWidth="1.8" />
      <circle cx="8" cy="13" r="1" fill="currentColor" />
      <circle cx="12" cy="13" r="1" fill="currentColor" />
      <circle cx="16" cy="13" r="1" fill="currentColor" />
      <circle cx="8" cy="17" r="1" fill="currentColor" />
      <circle cx="12" cy="17" r="1" fill="currentColor" />
    </>
  ),

  // Newspaper & Editorial News
  newspaper: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" fill="currentColor" fillOpacity="0.08" strokeWidth="1.8" />
      <path d="M6 8h12M6 12h6M6 15h6M15 12h3M15 15h3" strokeWidth="1.6" />
    </>
  ),
  news: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" fill="currentColor" fillOpacity="0.08" strokeWidth="1.8" />
      <path d="M6 8h12M6 12h6M6 15h6M15 12h3M15 15h3" strokeWidth="1.6" />
    </>
  ),

  // Ticket & Cultural Access
  ticket: (
    <>
      <path
        d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8z"
        fill="currentColor"
        fillOpacity="0.1"
        strokeWidth="1.8"
      />
      <line x1="12" y1="6" x2="12" y2="18" strokeDasharray="2 2" strokeWidth="1.5" />
    </>
  ),

  // Mail & Envelope
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" fill="currentColor" fillOpacity="0.1" strokeWidth="1.8" />
      <polyline points="3 7 12 13 21 7" strokeWidth="1.8" />
    </>
  ),
  envelope: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" fill="currentColor" fillOpacity="0.1" strokeWidth="1.8" />
      <polyline points="3 7 12 13 21 7" strokeWidth="1.8" />
    </>
  ),

  // Phone Contact
  phone: (
    <>
      <path
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
        fill="currentColor"
        fillOpacity="0.12"
        strokeWidth="1.8"
      />
    </>
  ),

  // Geographic Location Pin
  pin: (
    <>
      <path
        d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z"
        fill="currentColor"
        fillOpacity="0.14"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="9" r="2.5" fill="currentColor" />
    </>
  ),
  location: (
    <>
      <path
        d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z"
        fill="currentColor"
        fillOpacity="0.14"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="9" r="2.5" fill="currentColor" />
    </>
  ),

  // Home
  home: (
    <>
      <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9.5z" fill="currentColor" fillOpacity="0.12" strokeWidth="1.8" />
    </>
  ),

  // External Arrow
  external: (
    <>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" strokeWidth="1.8" />
      <polyline points="15 3 21 3 21 9" strokeWidth="1.8" />
      <line x1="10" y1="14" x2="21" y2="3" strokeWidth="1.8" />
    </>
  ),

  // Sparkles & Brilliance
  sparkles: (
    <>
      <path d="M12 2l2.2 5.8L20 10l-5.8 2.2L12 18l-2.2-5.8L4 10l5.8-2.2L12 2z" fill="currentColor" fillOpacity="0.2" strokeWidth="1.6" />
      <path d="M19 16l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" fill="currentColor" strokeWidth="0.8" />
    </>
  ),

  // Star
  star: (
    <>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor" fillOpacity="0.2" strokeWidth="1.8" />
    </>
  ),

  // Philanthropic Heart
  heart: (
    <>
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        fill="currentColor"
        fillOpacity="0.2"
        strokeWidth="1.8"
      />
    </>
  ),
  'heart-donation': (
    <>
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        fill="currentColor"
        fillOpacity="0.2"
        strokeWidth="1.8"
      />
    </>
  ),

  // Brain & Intellectual Innovation
  brain: (
    <>
      <path
        d="M9.5 4a3.5 3.5 0 0 0-3.5 3.5c0 .4.07.8.2 1.15A3.5 3.5 0 0 0 4 12a3.5 3.5 0 0 0 2.2 3.23 3.5 3.5 0 0 0 3.8 4.77H12v-16H9.5z"
        fill="currentColor"
        fillOpacity="0.1"
        strokeWidth="1.6"
      />
      <path
        d="M14.5 4a3.5 3.5 0 0 1 3.5 3.5c0 .4-.07.8-.2 1.15A3.5 3.5 0 0 1 20 12a3.5 3.5 0 0 1-2.2 3.23 3.5 3.5 0 0 1-3.8 4.77H12v-16h2.5z"
        fill="currentColor"
        fillOpacity="0.1"
        strokeWidth="1.6"
      />
    </>
  ),

  // Book & Academy
  book: (
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" strokeWidth="1.8" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" fill="currentColor" fillOpacity="0.1" strokeWidth="1.8" />
      <line x1="8" y1="6" x2="16" y2="6" strokeWidth="1.5" />
      <line x1="8" y1="10" x2="14" y2="10" strokeWidth="1.5" />
    </>
  ),
  education: (
    <>
      <polygon points="12 3 2 8 12 13 22 8 12 3" fill="currentColor" fillOpacity="0.14" strokeWidth="1.8" />
      <path d="M6 10.5v5.5c0 2 2.7 3.5 6 3.5s6-1.5 6-3.5v-5.5" strokeWidth="1.8" />
      <path d="M22 8v8" strokeWidth="1.8" />
    </>
  ),

  // Scroll & Official Dahir
  scroll: (
    <>
      <path d="M19 4H8a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h11a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" fill="currentColor" fillOpacity="0.1" strokeWidth="1.8" />
      <path d="M5 8h11M5 12h11M5 16h6" strokeWidth="1.5" />
      <circle cx="17.5" cy="15.5" r="1.5" fill="currentColor" />
    </>
  ),
  certificate: (
    <>
      <circle cx="12" cy="9" r="6" fill="currentColor" fillOpacity="0.12" strokeWidth="1.8" />
      <path d="M8.21 13.89L7 22l5-3 5 3-1.21-8.11" strokeWidth="1.8" />
    </>
  ),

  // Shield of Trust & Integrity
  shield: (
    <>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="currentColor" fillOpacity="0.12" strokeWidth="1.8" />
      <polyline points="9 12 11 14 15 10" strokeWidth="1.8" />
    </>
  ),

  // Chart of Growth & Impact
  chart: (
    <>
      <line x1="18" y1="20" x2="18" y2="10" strokeWidth="2.2" />
      <line x1="12" y1="20" x2="12" y2="4" strokeWidth="2.2" />
      <line x1="6" y1="20" x2="6" y2="14" strokeWidth="2.2" />
      <line x1="2" y1="20" x2="22" y2="20" strokeWidth="1.8" />
    </>
  ),
  impact: (
    <>
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" strokeWidth="2" />
      <polyline points="16 7 22 7 22 13" strokeWidth="2" />
      <line x1="2" y1="21" x2="22" y2="21" strokeWidth="1.8" />
    </>
  ),

  // Target / Precision Mission
  target: (
    <>
      <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.08" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="5" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </>
  ),
  mission: (
    <>
      <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.08" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="5" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </>
  ),

  // Diamond / Core Values
  diamond: (
    <>
      <polygon points="6 3 18 3 22 9 12 21 2 9 6 3" fill="currentColor" fillOpacity="0.14" strokeWidth="1.8" />
      <line x1="2" y1="9" x2="22" y2="9" strokeWidth="1.5" />
      <polyline points="7 3 12 9 17 3" strokeWidth="1.5" />
      <line x1="12" y1="9" x2="12" y2="21" strokeWidth="1.5" />
    </>
  ),
  values: (
    <>
      <polygon points="6 3 18 3 22 9 12 21 2 9 6 3" fill="currentColor" fillOpacity="0.14" strokeWidth="1.8" />
      <line x1="2" y1="9" x2="22" y2="9" strokeWidth="1.5" />
      <polyline points="7 3 12 9 17 3" strokeWidth="1.5" />
      <line x1="12" y1="9" x2="12" y2="21" strokeWidth="1.5" />
    </>
  ),

  // Telescope / Future Vision
  telescope: (
    <>
      <path d="M4 17l4.5-4.5 12-7.5-3-3-7.5 12L5.5 18.5" fill="currentColor" fillOpacity="0.1" strokeWidth="1.8" />
      <line x1="10" y1="13" x2="8" y2="22" strokeWidth="1.8" />
      <line x1="10" y1="13" x2="14" y2="22" strokeWidth="1.8" />
      <circle cx="19" cy="5" r="1.5" fill="currentColor" />
    </>
  ),
  vision: (
    <>
      <path d="M4 17l4.5-4.5 12-7.5-3-3-7.5 12L5.5 18.5" fill="currentColor" fillOpacity="0.1" strokeWidth="1.8" />
      <line x1="10" y1="13" x2="8" y2="22" strokeWidth="1.8" />
      <line x1="10" y1="13" x2="14" y2="22" strokeWidth="1.8" />
      <circle cx="19" cy="5" r="1.5" fill="currentColor" />
    </>
  ),

  // Tag / Identity Badge
  tag: (
    <>
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" fill="currentColor" fillOpacity="0.12" strokeWidth="1.8" />
      <line x1="7" y1="7" x2="7.01" y2="7" strokeWidth="2.5" />
    </>
  ),
  identity: (
    <>
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" fill="currentColor" fillOpacity="0.12" strokeWidth="1.8" />
      <line x1="7" y1="7" x2="7.01" y2="7" strokeWidth="2.5" />
    </>
  ),

  // Map / Roadmap
  map: (
    <>
      <polygon points="1 6 8 2 15 6 22 2 22 18 15 22 8 18 1 22 1 6" fill="currentColor" fillOpacity="0.1" strokeWidth="1.8" />
      <line x1="8" y1="2" x2="8" y2="18" strokeWidth="1.8" />
      <line x1="15" y1="6" x2="15" y2="22" strokeWidth="1.8" />
    </>
  ),
  roadmap: (
    <>
      <polygon points="1 6 8 2 15 6 22 2 22 18 15 22 8 18 1 22 1 6" fill="currentColor" fillOpacity="0.1" strokeWidth="1.8" />
      <line x1="8" y1="2" x2="8" y2="18" strokeWidth="1.8" />
      <line x1="15" y1="6" x2="15" y2="22" strokeWidth="1.8" />
    </>
  ),

  // Scales of Justice / Legal Framework
  scale: (
    <>
      <line x1="12" y1="3" x2="12" y2="21" strokeWidth="1.8" />
      <line x1="4" y1="7" x2="20" y2="7" strokeWidth="2" />
      <polygon points="1 13 4 7 7 13" fill="currentColor" fillOpacity="0.12" strokeWidth="1.5" />
      <polygon points="17 13 20 7 23 13" fill="currentColor" fillOpacity="0.12" strokeWidth="1.5" />
      <path d="M1 13c0 1.5 1.5 2.5 3 2.5s3-1 3-2.5" strokeWidth="1.5" />
      <path d="M17 13c0 1.5 1.5 2.5 3 2.5s3-1 3-2.5" strokeWidth="1.5" />
      <line x1="9" y1="21" x2="15" y2="21" strokeWidth="2" />
    </>
  ),
  justice: (
    <>
      <line x1="12" y1="3" x2="12" y2="21" strokeWidth="1.8" />
      <line x1="4" y1="7" x2="20" y2="7" strokeWidth="2" />
      <polygon points="1 13 4 7 7 13" fill="currentColor" fillOpacity="0.12" strokeWidth="1.5" />
      <polygon points="17 13 20 7 23 13" fill="currentColor" fillOpacity="0.12" strokeWidth="1.5" />
      <path d="M1 13c0 1.5 1.5 2.5 3 2.5s3-1 3-2.5" strokeWidth="1.5" />
      <path d="M17 13c0 1.5 1.5 2.5 3 2.5s3-1 3-2.5" strokeWidth="1.5" />
      <line x1="9" y1="21" x2="15" y2="21" strokeWidth="2" />
    </>
  ),

  // Soaring Peace Dove
  dove: (
    <>
      <path
        d="M21 4c-3 1-6 3-8 6l-2-1c-2-1-4 0-5 2l5 5-4 4c1 1 3 1 4 0l4-4 2 1c3 1.5 6 1 8-1 1-1 2-3 2-5v-6l-4-2z"
        fill="currentColor"
        fillOpacity="0.15"
        strokeWidth="1.8"
      />
      <circle cx="18" cy="7" r="1" fill="currentColor" />
    </>
  ),
  peace: (
    <>
      <path
        d="M21 4c-3 1-6 3-8 6l-2-1c-2-1-4 0-5 2l5 5-4 4c1 1 3 1 4 0l4-4 2 1c3 1.5 6 1 8-1 1-1 2-3 2-5v-6l-4-2z"
        fill="currentColor"
        fillOpacity="0.15"
        strokeWidth="1.8"
      />
      <circle cx="18" cy="7" r="1" fill="currentColor" />
    </>
  ),

  // Cultural & Youth Centers
  centers: (
    <>
      <rect x="3" y="19" width="18" height="2" rx="0.5" fill="currentColor" />
      <path d="M5 19V10l7-5 7 5v9" fill="currentColor" fillOpacity="0.1" strokeWidth="1.8" />
      <path d="M9.5 19v-5c0-1.4 1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5v5" strokeWidth="1.6" />
      <circle cx="12" cy="4" r="1" fill="currentColor" />
    </>
  ),

  // Civil Society Organizations / NGOs
  ngo: (
    <>
      <circle cx="12" cy="7" r="2.5" fill="currentColor" />
      <path d="M7 16c0-2.8 2.2-5 5-5s5 2.2 5 5v1H7v-1z" strokeWidth="1.6" />
      <circle cx="5" cy="11" r="1.8" strokeWidth="1.4" />
      <path d="M2 18c0-1.7 1.3-3 3-3" strokeWidth="1.4" />
      <circle cx="19" cy="11" r="1.8" strokeWidth="1.4" />
      <path d="M22 18c0-1.7-1.3-3-3-3" strokeWidth="1.4" />
    </>
  ),

  // Corporate Sponsors & Partnerships
  sponsors: (
    <>
      <path d="M12 3l7 3v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-3z" fill="currentColor" fillOpacity="0.1" strokeWidth="1.8" />
      <path d="M9 12l2 2 4-4" strokeWidth="1.8" />
    </>
  ),

  // Checkmark
  check: (
    <>
      <polyline points="20 6 9 17 4 12" strokeWidth="2.2" />
    </>
  ),

  // Cross Cancel
  cross: (
    <>
      <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" />
      <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" />
    </>
  ),

  // Clock
  clock: (
    <>
      <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.08" strokeWidth="1.8" />
      <polyline points="12 6 12 12 16 14" strokeWidth="1.8" />
    </>
  ),

  // Credit Card / CMI
  'credit-card': (
    <>
      <rect x="2" y="5" width="20" height="14" rx="2" fill="currentColor" fillOpacity="0.1" strokeWidth="1.8" />
      <line x1="2" y1="10" x2="22" y2="10" strokeWidth="1.8" />
      <line x1="6" y1="15" x2="10" y2="15" strokeWidth="1.8" />
    </>
  ),

  // Bank Building
  bank: (
    <>
      <line x1="2" y1="21" x2="22" y2="21" strokeWidth="1.8" />
      <polygon points="12 3 2 8 22 8 12 3" fill="currentColor" fillOpacity="0.15" strokeWidth="1.8" />
      <line x1="5" y1="11" x2="5" y2="18" strokeWidth="2" />
      <line x1="10" y1="11" x2="10" y2="18" strokeWidth="2" />
      <line x1="14" y1="11" x2="14" y2="18" strokeWidth="2" />
      <line x1="19" y1="11" x2="19" y2="18" strokeWidth="2" />
    </>
  ),

  // Edit / Form
  edit: (
    <>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeWidth="1.8" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeWidth="1.8" />
    </>
  ),

  // Security Lock
  lock: (
    <>
      <rect x="3" y="11" width="18" height="11" rx="2" fill="currentColor" fillOpacity="0.12" strokeWidth="1.8" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeWidth="1.8" />
      <circle cx="12" cy="16" r="1.5" fill="currentColor" />
    </>
  ),
  unlock: (
    <>
      <rect x="3" y="11" width="18" height="11" rx="2" fill="currentColor" fillOpacity="0.12" strokeWidth="1.8" />
      <path d="M7 11V7a5 5 0 0 1 9.9-1" strokeWidth="1.8" />
      <circle cx="12" cy="16" r="1.5" fill="currentColor" />
    </>
  ),

  // Search
  search: (
    <>
      <circle cx="11" cy="11" r="7" strokeWidth="1.8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" />
    </>
  ),

  // Globe
  globe: (
    <>
      <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
      <line x1="3" y1="12" x2="21" y2="12" strokeWidth="1.5" />
      <path d="M12 3a13 13 0 0 1 4 9 13 13 0 0 1-4 9 13 13 0 0 1-4-9 13 13 0 0 1 4-9z" strokeWidth="1.5" />
    </>
  ),

  // Award
  award: (
    <>
      <circle cx="12" cy="8" r="6" fill="currentColor" fillOpacity="0.14" strokeWidth="1.8" />
      <polyline points="8.21 13.89 7 22 12 19 17 22 15.79 13.88" strokeWidth="1.8" />
    </>
  ),

  // Microphone
  mic: (
    <>
      <rect x="9" y="2" width="6" height="11" rx="3" fill="currentColor" fillOpacity="0.12" strokeWidth="1.8" />
      <path d="M19 10v1a7 7 0 0 1-14 0v-1" strokeWidth="1.8" />
      <line x1="12" y1="18" x2="12" y2="22" strokeWidth="1.8" />
      <line x1="8" y1="22" x2="16" y2="22" strokeWidth="1.8" />
    </>
  ),

  // Camera
  camera: (
    <>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" fill="currentColor" fillOpacity="0.1" strokeWidth="1.8" />
      <circle cx="12" cy="13" r="4" strokeWidth="1.8" />
    </>
  ),

  // Quote
  quote: (
    <>
      <path d="M3 13h5v5H3zM13 13h5v5h-5z" fill="currentColor" strokeWidth="1" />
      <path d="M8 13c0-3-1.5-5-5-5V6c4 0 7 2.5 7 7M18 13c0-3-1.5-5-5-5V6c4 0 7 2.5 7 7" strokeWidth="1.8" />
    </>
  ),

  // Sprout
  sprout: (
    <>
      <path d="M7 20h10" strokeWidth="1.8" />
      <path d="M12 20v-8" strokeWidth="1.8" />
      <path d="M12 12c0-4 3-7 7-7 0 4-3 7-7 7z" fill="currentColor" fillOpacity="0.15" strokeWidth="1.6" />
      <path d="M12 15c0-3-2-5-5-5 0 3 2 5 5 5z" fill="currentColor" fillOpacity="0.15" strokeWidth="1.6" />
    </>
  ),

  // Lightning
  lightning: (
    <>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" fillOpacity="0.2" strokeWidth="1.6" />
    </>
  ),

  // FAQ
  faq: (
    <>
      <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.08" strokeWidth="1.8" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" strokeWidth="1.8" />
      <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2.5" />
    </>
  ),

  // Chat
  chat: (
    <>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="currentColor" fillOpacity="0.1" strokeWidth="1.8" />
    </>
  ),

  // Megaphone / Bullhorn
  megaphone: (
    <>
      <polygon points="3 11 3 13 6 13 11 17 11 7 6 11 3 11" fill="currentColor" fillOpacity="0.15" strokeWidth="1.8" />
      <path d="M14 9a5 5 0 0 1 0 6" strokeWidth="1.8" />
      <path d="M17 6a9 9 0 0 1 0 12" strokeWidth="1.8" />
    </>
  ),
  bullhorn: (
    <>
      <polygon points="3 11 3 13 6 13 11 17 11 7 6 11 3 11" fill="currentColor" fillOpacity="0.15" strokeWidth="1.8" />
      <path d="M14 9a5 5 0 0 1 0 6" strokeWidth="1.8" />
      <path d="M17 6a9 9 0 0 1 0 12" strokeWidth="1.8" />
    </>
  ),

  // Eye
  eye: (
    <>
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" fill="currentColor" fillOpacity="0.1" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3" strokeWidth="1.8" />
    </>
  ),

  // Document File
  file: (
    <>
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" fill="currentColor" fillOpacity="0.1" strokeWidth="1.8" />
      <polyline points="13 2 13 9 20 9" strokeWidth="1.8" />
    </>
  ),
  document: (
    <>
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" fill="currentColor" fillOpacity="0.1" strokeWidth="1.8" />
      <polyline points="13 2 13 9 20 9" strokeWidth="1.8" />
      <line x1="9" y1="13" x2="15" y2="13" strokeWidth="1.5" />
      <line x1="9" y1="17" x2="13" y2="17" strokeWidth="1.5" />
    </>
  ),

  // Clipboard
  clipboard: (
    <>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" strokeWidth="1.8" />
      <rect x="8" y="2" width="8" height="4" rx="1" fill="currentColor" strokeWidth="1.8" />
    </>
  ),

  // Sliders
  sliders: (
    <>
      <line x1="4" y1="21" x2="4" y2="14" strokeWidth="1.8" />
      <line x1="4" y1="10" x2="4" y2="3" strokeWidth="1.8" />
      <line x1="12" y1="21" x2="12" y2="12" strokeWidth="1.8" />
      <line x1="12" y1="8" x2="12" y2="3" strokeWidth="1.8" />
      <line x1="20" y1="21" x2="20" y2="16" strokeWidth="1.8" />
      <line x1="20" y1="12" x2="20" y2="3" strokeWidth="1.8" />
      <circle cx="4" cy="12" r="2" fill="currentColor" />
      <circle cx="12" cy="10" r="2" fill="currentColor" />
      <circle cx="20" cy="14" r="2" fill="currentColor" />
    </>
  ),

  // Gear
  gear: (
    <>
      <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.2" strokeWidth="1.8" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" strokeWidth="1.8" />
    </>
  ),

  // Refresh
  refresh: (
    <>
      <polyline points="23 4 23 10 17 10" strokeWidth="1.8" />
      <polyline points="1 20 1 14 7 14" strokeWidth="1.8" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" strokeWidth="1.8" />
    </>
  ),

  // Trash
  trash: (
    <>
      <polyline points="3 6 5 6 21 6" strokeWidth="1.8" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeWidth="1.8" />
      <line x1="10" y1="11" x2="10" y2="17" strokeWidth="1.8" />
      <line x1="14" y1="11" x2="14" y2="17" strokeWidth="1.8" />
    </>
  ),

  // Key
  key: (
    <>
      <path d="M21 2l-2 2m-1.5 1.5L14 9l-3 3-4-4 3-3 3.5-3.5M21 2v4h-4" strokeWidth="1.8" />
      <circle cx="7.5" cy="16.5" r="4.5" fill="currentColor" fillOpacity="0.12" strokeWidth="1.8" />
    </>
  ),

  // Socials
  facebook: (
    <>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" fill="currentColor" stroke="none" />
    </>
  ),
  instagram: (
    <>
      <rect x="2" y="2" width="20" height="20" rx="5" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" strokeWidth="1.8" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </>
  ),
  youtube: (
    <>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" fill="currentColor" fillOpacity="0.15" strokeWidth="1.8" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
    </>
  ),
  linkedin: (
    <>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" strokeWidth="1.8" />
      <rect x="2" y="9" width="4" height="12" strokeWidth="1.8" />
      <circle cx="4" cy="4" r="2" fill="currentColor" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" strokeWidth="1.8" />
    </>
  ),
  twitter: (
    <>
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" strokeWidth="1.8" />
    </>
  ),
}

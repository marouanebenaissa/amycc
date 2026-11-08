import type { Metadata } from 'next'

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
}

// This root layout is intentionally minimal.
// The real html/body/lang/dir setup is in src/app/[locale]/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}

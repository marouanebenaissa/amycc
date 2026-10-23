# System & Application Architecture

## 1. Architectural Overview
The AMYCC platform is built on Next.js 16 with the App Router, leveraging Server Components for fast initial page loads, SEO optimization, and partial pre-rendering.

```
                              [ Browser Client ]
                                      │
                   ┌──────────────────┴──────────────────┐
                   ▼                                     ▼
        [ Public Website (/[locale]) ]           [ Admin Area (/admin) ]
                   │                                     │
         (SSR / Static Pages)                   (Server Components + Actions)
                   │                                     │
                   └──────────────────┬──────────────────┘
                                      │
                         [ Next.js 16 Server Proxy ]
                               (src/proxy.ts)
                                      │
                   ┌──────────────────┴──────────────────┐
                   ▼                                     ▼
     [ Supabase Public Anon Client ]           [ Supabase SSR Server Client ]
       (Public read-only queries)              (Auth session & RLS writes)
                   │                                     │
                   └──────────────────┬──────────────────┘
                                      │
                         [ PostgreSQL Database ]
                         (With Row Level Security)
```

---

## 2. Internationalization (i18n)
- **Locales**: `ar` (Arabic, default, `dir="rtl"`), `fr` (French, `dir="ltr"`), `en` (English, `dir="ltr"`).
- **Request Interception**: `src/proxy.ts` detects `Accept-Language` headers and routes root visitors to `/${locale}` while leaving `/admin` and `/api` untouched.
- **Server Dictionaries**: `src/lib/i18n/dictionaries.ts` loads translated strings per locale asynchronously.

---

## 3. Security Boundary & Least Privilege (RBAC)
- Client-side navigation is not the security boundary; permissions are enforced by **PostgreSQL Row Level Security (RLS)** and server-side checks.
- 9 Role tiers defined:
  1. `super_admin`
  2. `content_manager`
  3. `communications_manager`
  4. `membership_manager`
  5. `volunteer_coordinator`
  6. `programs_events_manager`
  7. `partnership_manager`
  8. `finance_manager`
  9. `reviewer`
- Public visitors can only query records where `status = 'published'`.
- All form submissions (Memberships, Volunteering, Inquiries, Donations) are write-only to anonymous users.

---

## 4. Design System
- Built with Tailwind CSS v4 using CSS tokens in `@theme inline`.
- Primary Brand: White (`#FFFFFF`).
- Accent / Surfaces / Interactive: Navy Blue (`#0068FF`).
- Text / Accents: Slate Grays & Dark Black (`#0A0F1D`).
- Typography: Inter (Latin) & Noto Sans Arabic (Arabic).

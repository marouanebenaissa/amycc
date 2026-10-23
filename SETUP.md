# AMYCC Development & Local Setup Guide

This guide walks you through setting up and running the AMYCC platform on Windows or macOS/Linux.

---

## 1. Prerequisites
- **Node.js**: v18.18+ (Node 20+ LTS recommended, tested up to Node 24)
- **npm**: v9+ (tested on npm 11)
- **Git**: v2.30+
- **Supabase Account**: Free project created on [supabase.com](https://supabase.com)

---

## 2. Clone the Repository
```powershell
git clone https://github.com/marouanebenaissa/amycc.git
cd amycc
```

---

## 3. Install Dependencies
```powershell
npm install
```

---

## 4. Environment Variables Setup
Copy `.env.example` to `.env.local`:
```powershell
Copy-Item .env.example .env.local
```

Fill in your actual Supabase credentials in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_DEFAULT_LOCALE=ar
```

---

## 5. Database Schema Initialization
1. In your Supabase Dashboard, open **SQL Editor**.
2. Run `supabase/migrations/001_initial_schema.sql` to create all tables and RLS policies.
3. (Optional) Run `supabase/seed.sql` to load initial development seed data.

---

## 6. Run the Local Development Server
```powershell
npm run dev
```

Visit:
- **Public Multilingual Website**: `http://localhost:3000` (auto-redirects to `/ar`)
- **Admin Dashboard**: `http://localhost:3000/admin/login`

---

## 7. Production Build Verification
To verify TypeScript and production assets:
```powershell
npm run build
npm run start
```

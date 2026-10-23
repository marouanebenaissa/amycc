# AMYCC — Spirit of Arts & Culture Association Platform
**جمعية روح الفنون والثقافة (AMYCC)**  
Official Multilingual Website and Administration Dashboard

---

## 🏛️ Organization Identity
- **Arabic Name**: جمعية روح الفنون والثقافة
- **English Name**: Spirit of Arts & Culture Association
- **French Name**: Association Esprit des Arts et de la Culture
- **Abbreviation**: AMYCC
- **Type**: Nonprofit Cultural & Youth Association based in Morocco
- **Foundation Year**: 2026
- **Initiative**: Youth in Action (الشباب في العمل)

---

## 🚀 Technology Stack
- **Framework**: Next.js 16 (App Router)
- **Runtime & Library**: React 19, TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4 (Custom White & Vibrant Navy `#0068ff` Design System)
- **Database & Auth**: PostgreSQL via Supabase (Row Level Security & RBAC)
- **Validation**: Zod
- **Internationalization**: Full RTL/LTR routing for Arabic (`/ar`), French (`/fr`), and English (`/en`)

---

## 🌐 Public Routes
| Section | Arabic (RTL) | French (LTR) | English (LTR) |
|---|---|---|---|
| Home | `/ar` | `/fr` | `/en` |
| About | `/ar/about` | `/fr/about` | `/en/about` |
| Programs | `/ar/programs` | `/fr/programs` | `/en/programs` |
| Events | `/ar/events` | `/fr/events` | `/en/events` |
| News | `/ar/news` | `/fr/news` | `/en/news` |
| Membership | `/ar/membership` | `/fr/membership` | `/en/membership` |
| Volunteering | `/ar/volunteer` | `/fr/volunteer` | `/en/volunteer` |
| Partnerships | `/ar/partnerships` | `/fr/partnerships` | `/en/partnerships` |
| Support & Donations | `/ar/support` | `/fr/support` | `/en/support` |
| Gallery | `/ar/gallery` | `/fr/gallery` | `/en/gallery` |
| Contact | `/ar/contact` | `/fr/contact` | `/en/contact` |
| Privacy Policy | `/ar/privacy` | `/fr/privacy` | `/en/privacy` |

---

## 🛡️ Admin Dashboard Routes
- `/admin/login` — Secure administrator authentication
- `/admin` — Real-time overview of applications and system status
- `/admin/memberships` — Manage membership application pipeline
- `/admin/volunteers` — Manage Youth in Action volunteer roster
- `/admin/partnerships` — Review institutional and corporate proposals
- `/admin/settings` — Identity, branding, and system configuration

---

## 📖 Documentation
- [SETUP.md](SETUP.md) — Local development and installation guide
- [ARCHITECTURE.md](ARCHITECTURE.md) — System and routing architecture
- [DATABASE.md](DATABASE.md) — Schema, ER diagram, and RLS policies
- [SECURITY.md](SECURITY.md) — Security rules, CNDP Law 09-08 compliance, and secrets management
- [DEPLOYMENT.md](DEPLOYMENT.md) — Production deployment and domain configuration
- [BACKUP_AND_RECOVERY.md](BACKUP_AND_RECOVERY.md) — Backup procedures and disaster recovery

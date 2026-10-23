# Security Policy & Moroccan Data Protection Notice

## 1. Moroccan Law 09-08 Compliance (CNDP)
The AMYCC platform is structured to align with Moroccan Law No. 09-08 on the Protection of Personal Data:
- **Principle of Proportionality**: We only collect the minimal personal information required for membership, volunteering, and event registration.
- **Data Minimization**: No sensitive personal data (e.g. banking records, ID numbers) is stored unless officially authorized and declared to CNDP.
- **User Rights**: Users can exercise their rights to access, rectify, and oppose the processing of their data by contacting the association.

## 2. Row Level Security (RLS) Policy
- Every database table in Supabase has RLS explicitly enabled.
- Anonymous and public visitors can only read content marked with `status = 'published'`.
- All form submissions (`membership_applications`, `volunteer_applications`, `partnership_inquiries`, `donation_records`) are write-only for the public. Only authenticated staff with assigned administrative roles can query or update them.
- No client-side code bypasses RLS policies.

## 3. Secret Management
- `SUPABASE_SERVICE_ROLE_KEY` is restricted exclusively to server-side code (`src/lib/supabase/admin.ts`).
- Public browser code only has access to `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- `.env.local` is ignored in `.gitignore`. Real credentials are never committed.

## 4. Input Validation & Spam Prevention
- Every server-side form action enforces strict schema validation via **Zod** (`src/lib/validation/schemas.ts`).
- Invalid payloads are rejected before reaching database queries.

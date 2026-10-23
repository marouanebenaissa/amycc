# Deployment & Domain Guide

## 1. Cost Estimate (Lowest Reasonable Cost)
| Service | Provider | Tier / Cost | Estimated Cost (MAD/year) |
|---|---|---|---|
| Domain Name (`amycc.org`) | Namecheap / Porkbun / Cloudflare | Registrar renewal | ~120 - 150 MAD/year |
| Application Hosting | Vercel | Free Hobby Tier | 0 MAD |
| PostgreSQL Database | Supabase | Free Tier (500MB DB, 1GB Storage) | 0 MAD |
| Authentication | Supabase Auth | Free Tier (50,000 MAU) | 0 MAD |
| SSL / TLS Certificate | Automated (Vercel / Let's Encrypt) | Included | 0 MAD |
| **Total Annual Cost** | | | **~150 MAD / year** |

---

## 2. Deploying to Vercel
1. Push all code to your GitHub repository (`github.com/marouanebenaissa/amycc`).
2. Log into [vercel.com](https://vercel.com) using your GitHub account.
3. Click **Add New** → **Project**.
4. Select the `amycc` repository.
5. In **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` (e.g. `https://amycc.org`)
   - `NEXT_PUBLIC_DEFAULT_LOCALE` (`ar`)
6. Click **Deploy**.

---

## 3. Connecting the Custom Domain (`amycc.org`)
Once domain ownership and DNS access are verified:
1. In the Vercel Dashboard, go to **Settings** → **Domains**.
2. Add `amycc.org` and `www.amycc.org`.
3. In your DNS registrar:
   - For `amycc.org`: Add an **A Record** pointing to `76.76.21.21`
   - For `www.amycc.org`: Add a **CNAME Record** pointing to `cname.vercel-dns.com`
4. Wait for DNS propagation and SSL certificate generation (usually 5 to 30 minutes).

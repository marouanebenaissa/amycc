import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClientSafe } from '@/lib/supabase/admin'
import { getSecurityState, recordSecurityAudit } from '@/lib/auth/security'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/admin'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error || !data.user) {
      return NextResponse.redirect(`${requestUrl.origin}/admin/login?error=OAuth_Exchange_Failed`)
    }

    const email = (data.user.email || '').toLowerCase().trim()
    const provider = data.user.app_metadata?.provider

    // Strict Domain Restriction for Google OAuth: ONLY official @amycc.org accounts are authorized
    if (provider === 'google' && !email.endsWith('@amycc.org')) {
      await supabase.auth.signOut()
      try {
        await recordSecurityAudit(
          'UNAUTHORIZED_GOOGLE_DOMAIN_ATTEMPT',
          {
            attemptedEmail: email,
            provider: 'google',
            requiredDomain: '@amycc.org',
            severity: 'HIGH',
          },
          data.user.id
        )
      } catch {
        // Non-fatal audit log
      }

      return NextResponse.redirect(
        `${requestUrl.origin}/admin/login?error=Google_Domain_Restricted_Amycc`
      )
    }

    // Check if account has been locked due to security policy
    try {
      const secState = await getSecurityState()
      if (secState.accounts[email]?.isLocked) {
        await supabase.auth.signOut()
        return NextResponse.redirect(
          `${requestUrl.origin}/admin/login?error=Account_Locked_5_Attempts`
        )
      }
    } catch {
      // Non-fatal
    }

    // Ensure staff profile exists in database
    try {
      const adminClient = createAdminClientSafe()
      const client = adminClient || supabase
      const fullName =
        (data.user.user_metadata?.full_name as string) ||
        (data.user.user_metadata?.name as string) ||
        email.split('@')[0]

      await client.from('profiles').upsert(
        [
          {
            id: data.user.id,
            email,
            full_name: fullName,
            created_at: data.user.created_at || new Date().toISOString(),
          },
        ],
        { onConflict: 'id' }
      )
    } catch {
      // Non-fatal
    }

    try {
      await recordSecurityAudit(
        'AUTH_SESSION_ESTABLISHED',
        {
          email,
          provider: provider || 'email',
        },
        data.user.id
      )
    } catch {
      // Non-fatal
    }

    return NextResponse.redirect(`${requestUrl.origin}${next}`)
  }

  // Handle client-side hash fragment (Implicit / Recovery flow: #access_token=...&type=recovery)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  const safeNext = next.startsWith('/') ? next : '/admin'

  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>AMYCC Authentication</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #FAF8F5; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; color: #231f20; }
    .card { background: white; border: 1px solid #e5e0d6; border-radius: 20px; padding: 32px; text-align: center; max-width: 420px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
    .spinner { font-size: 32px; margin-bottom: 12px; }
  </style>
  <script type="module">
    import { createBrowserClient } from 'https://cdn.jsdelivr.net/npm/@supabase/ssr@0.5.2/+esm';

    (async function() {
      try {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');

        if (accessToken && refreshToken) {
          const supabase = createBrowserClient('${supabaseUrl}', '${supabaseAnonKey}');
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          if (!error) {
            window.location.replace('${safeNext}');
            return;
          }
        }
      } catch (e) {
        console.error('Session establishment error:', e);
      }
      window.location.replace('/admin/login');
    })();
  </script>
</head>
<body>
  <div class="card">
    <div class="spinner">⏳</div>
    <h3 style="margin: 0 0 8px; font-size: 16px;">جاري إتمام التحقق من الرابط...</h3>
    <p style="margin: 0; font-size: 12px; color: #5C5A55;">يرجى الانتظار، سيتم توجيهك مباشرة لتعيين كلمة المرور الجديدة.</p>
  </div>
</body>
</html>`

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}

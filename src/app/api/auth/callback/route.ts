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
        'GOOGLE_WORKSPACE_LOGIN_SUCCESS',
        {
          email,
          provider: 'google',
          domain: '@amycc.org',
        },
        data.user.id
      )
    } catch {
      // Non-fatal
    }

    return NextResponse.redirect(`${requestUrl.origin}${next}`)
  }

  return NextResponse.redirect(`${requestUrl.origin}/admin/login`)
}

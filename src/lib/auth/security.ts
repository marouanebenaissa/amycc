import { createAdminClientSafe } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export const MAX_FAILED_LOGIN_ATTEMPTS = 5
export const IP_BURST_BLOCK_THRESHOLD = 15
export const IP_BLOCK_DURATION_MINUTES = 30

export interface AccountSecurityRecord {
  email: string
  userId?: string
  failedAttempts: number
  isLocked: boolean
  lockedAt?: string | null
  lockedReason?: string | null
  lastFailedAt?: string | null
  unlockedAt?: string | null
  unlockedBy?: string | null
  mustChangePassword?: boolean
}

export interface IpSecurityRecord {
  ip: string
  failedAttempts: number
  blockedUntil?: string | null
  lastAttemptAt: string
}

export interface PasswordResetCodeRecord {
  code: string
  expiresAt: number
  attempts: number
  createdAt: string
}

export interface AdminSecurityState {
  accounts: Record<string, AccountSecurityRecord>
  ipThreats: Record<string, IpSecurityRecord>
  resetCodes?: Record<string, PasswordResetCodeRecord>
}

// In-memory hot cache for instant mitigation
let memorySecurityState: AdminSecurityState = {
  accounts: {},
  ipThreats: {},
  resetCodes: {},
}

const SETTINGS_KEY = 'admin_security_state'

/**
 * Extracts normalized client IP address from server headers.
 */
export async function getClientIp(): Promise<string> {
  try {
    const h = await headers()
    const forwarded = h.get('x-forwarded-for')
    if (forwarded) {
      const parts = forwarded.split(',')
      return parts[0].trim()
    }
    const realIp = h.get('x-real-ip') || h.get('cf-connecting-ip')
    if (realIp) return realIp.trim()
  } catch {
    // Ignore in non-request contexts
  }
  return '127.0.0.1'
}

/**
 * Extracts User-Agent string from headers for threat logging.
 */
export async function getClientUserAgent(): Promise<string> {
  try {
    const h = await headers()
    return h.get('user-agent') || 'Unknown'
  } catch {
    return 'Unknown'
  }
}

/**
 * Loads the security state from database with hot-cache fallback.
 */
export async function getSecurityState(): Promise<AdminSecurityState> {
  try {
    const adminClient = createAdminClientSafe()
    const supabase = await createClient()
    const client = adminClient || supabase

    const { data } = await client
      .from('site_settings')
      .select('value')
      .eq('key', SETTINGS_KEY)
      .maybeSingle()

    if (data?.value && typeof data.value === 'object') {
      const remoteState = data.value as AdminSecurityState
      memorySecurityState = {
        accounts: { ...memorySecurityState.accounts, ...(remoteState.accounts || {}) },
        ipThreats: { ...memorySecurityState.ipThreats, ...(remoteState.ipThreats || {}) },
      }
    }
  } catch {
    // Graceful fallback to memory state
  }

  return memorySecurityState
}

/**
 * Persists security state updates to database and local cache.
 */
export async function saveSecurityState(state: AdminSecurityState): Promise<void> {
  memorySecurityState = state
  try {
    const adminClient = createAdminClientSafe()
    const supabase = await createClient()
    const client = adminClient || supabase

    await client
      .from('site_settings')
      .upsert([
        {
          key: SETTINGS_KEY,
          value: state,
          updated_at: new Date().toISOString(),
        },
      ], { onConflict: 'key' })
  } catch {
    // Memory state holds in worst case
  }
}

/**
 * Records an entry into the audit_logs table for security events.
 */
export async function recordSecurityAudit(
  action: string,
  details: Record<string, unknown>,
  targetUserId?: string | null
): Promise<void> {
  try {
    const adminClient = createAdminClientSafe()
    const supabase = await createClient()
    const client = adminClient || supabase

    await client.from('audit_logs').insert([
      {
        user_id: targetUserId ?? null,
        action,
        entity_type: 'security_firewall',
        entity_id: (details.email as string) || (details.ip as string) || null,
        details,
        ip_address: (details.ip as string) || null,
        created_at: new Date().toISOString(),
      },
    ])
  } catch {
    // Fallback if audit log insert fails
  }
}

/**
 * Checks if an account or IP address is currently locked out or blocked.
 */
export async function checkAccountLockout(
  email: string,
  clientIp?: string
): Promise<{
  isLocked: boolean
  isIpBlocked: boolean
  remainingAttempts: number
  failedAttempts: number
  messageAr?: string
  messageFr?: string
  messageEn?: string
}> {
  const normEmail = email.trim().toLowerCase()
  const state = await getSecurityState()
  const now = new Date()

  // 1. Check IP block
  if (clientIp && state.ipThreats[clientIp]) {
    const ipRecord = state.ipThreats[clientIp]
    if (ipRecord.blockedUntil) {
      const blockedDate = new Date(ipRecord.blockedUntil)
      if (blockedDate > now) {
        return {
          isLocked: true,
          isIpBlocked: true,
          remainingAttempts: 0,
          failedAttempts: ipRecord.failedAttempts,
          messageAr: 'تم حظر عنوان الشبكة الخاص بك مؤقتاً بسبب تكرار المحاولات المشبوهة. يرجى الانتظار 30 دقيقة.',
          messageFr: 'Votre adresse IP a été temporairement bloquée en raison de tentatives suspectes répétées.',
          messageEn: 'Your IP address has been temporarily blocked due to repeated suspicious attempts.',
        }
      }
    }
  }

  // 2. Check Account Lockout
  const account = state.accounts[normEmail]
  if (account && account.isLocked) {
    return {
      isLocked: true,
      isIpBlocked: false,
      remainingAttempts: 0,
      failedAttempts: account.failedAttempts,
      messageAr:
        'تم إقفال حسابك لتجاوز 5 محاولات خاطئة لكلمة المرور لحماية لوحة التحكم. يجب عليك التحدث مع مدير عام النظام (السوبر أدمن) لإلغاء القفل.',
      messageFr:
        'Votre compte a été verrouillé après 5 tentatives incorrectes. Veuillez contacter le Super Administrateur pour le débloquer.',
      messageEn:
        'Your account has been locked after 5 consecutive failed attempts. You must contact the Super Administrator to unlock it.',
    }
  }

  const failedCount = account ? account.failedAttempts : 0
  const remaining = Math.max(0, MAX_FAILED_LOGIN_ATTEMPTS - failedCount)

  return {
    isLocked: false,
    isIpBlocked: false,
    remainingAttempts: remaining,
    failedAttempts: failedCount,
  }
}

/**
 * Handles a failed login attempt:
 * - Increments account failed attempts
 * - Increments IP attempt counts
 * - If attempts reach 5, locks account and fires high-severity audit alarm
 */
export async function recordFailedLoginAttempt(
  email: string,
  clientIp?: string,
  userAgent?: string
): Promise<{
  lockedNow: boolean
  failedAttempts: number
  remainingAttempts: number
}> {
  const normEmail = email.trim().toLowerCase()
  const state = await getSecurityState()
  const now = new Date().toISOString()
  const ip = clientIp || '127.0.0.1'

  // Update account record
  const currentAccount = state.accounts[normEmail] || {
    email: normEmail,
    failedAttempts: 0,
    isLocked: false,
  }

  const updatedAttempts = currentAccount.failedAttempts + 1
  const lockedNow = updatedAttempts >= MAX_FAILED_LOGIN_ATTEMPTS

  state.accounts[normEmail] = {
    ...currentAccount,
    failedAttempts: updatedAttempts,
    isLocked: lockedNow ? true : currentAccount.isLocked,
    lockedAt: lockedNow ? now : currentAccount.lockedAt,
    lockedReason: lockedNow ? 'EXCEEDED_5_FAILED_ATTEMPTS' : currentAccount.lockedReason,
    lastFailedAt: now,
  }

  // Update IP record
  const currentIpRecord = state.ipThreats[ip] || {
    ip,
    failedAttempts: 0,
    lastAttemptAt: now,
  }
  const ipAttempts = currentIpRecord.failedAttempts + 1
  let ipBlockedUntil: string | null = null

  if (ipAttempts >= IP_BURST_BLOCK_THRESHOLD) {
    const unblockTime = new Date(Date.now() + IP_BLOCK_DURATION_MINUTES * 60 * 1000)
    ipBlockedUntil = unblockTime.toISOString()
  }

  state.ipThreats[ip] = {
    ...currentIpRecord,
    failedAttempts: ipAttempts,
    blockedUntil: ipBlockedUntil || currentIpRecord.blockedUntil,
    lastAttemptAt: now,
  }

  await saveSecurityState(state)

  // Try updating Supabase Auth metadata if user exists
  if (lockedNow) {
    try {
      const adminClient = createAdminClientSafe()
      if (adminClient) {
        const { data: listData } = await adminClient.auth.admin.listUsers()
        const matched = listData?.users.find((u) => u.email?.toLowerCase() === normEmail)
        if (matched) {
          await adminClient.auth.admin.updateUserById(matched.id, {
            user_metadata: {
              ...(matched.user_metadata || {}),
              is_locked: true,
              locked_at: now,
              locked_reason: 'EXCEEDED_5_FAILED_ATTEMPTS',
            },
          })
        }
      }
    } catch {
      // Non-fatal
    }

    await recordSecurityAudit('ACCOUNT_LOCKED_BRUTE_FORCE', {
      email: normEmail,
      attempts: updatedAttempts,
      ip,
      userAgent: userAgent || 'Unknown',
      status: 'LOCKED',
      severity: 'CRITICAL',
      timestamp: now,
    })
  } else {
    await recordSecurityAudit('FAILED_LOGIN_ATTEMPT', {
      email: normEmail,
      attempts: updatedAttempts,
      remaining: MAX_FAILED_LOGIN_ATTEMPTS - updatedAttempts,
      ip,
      userAgent: userAgent || 'Unknown',
      timestamp: now,
    })
  }

  return {
    lockedNow,
    failedAttempts: updatedAttempts,
    remainingAttempts: Math.max(0, MAX_FAILED_LOGIN_ATTEMPTS - updatedAttempts),
  }
}

/**
 * Resets failed attempts after a valid credentials login.
 */
export async function recordSuccessfulLogin(
  email: string,
  clientIp?: string
): Promise<void> {
  const normEmail = email.trim().toLowerCase()
  const state = await getSecurityState()

  if (state.accounts[normEmail]) {
    state.accounts[normEmail].failedAttempts = 0
    state.accounts[normEmail].lastFailedAt = null
  }

  if (clientIp && state.ipThreats[clientIp]) {
    state.ipThreats[clientIp].failedAttempts = 0
  }

  await saveSecurityState(state)
}

/**
 * Unlocks an account (Restricted to Super Admin).
 */
export async function unlockAccountBySuperAdmin(
  targetEmailOrUserId: string,
  adminUserEmail: string
): Promise<{ success: boolean; error?: string }> {
  const state = await getSecurityState()
  const now = new Date().toISOString()
  const adminClient = createAdminClientSafe()

  let targetEmail = targetEmailOrUserId.toLowerCase().trim()
  let targetUserId = targetEmailOrUserId

  // If passed a UUID, resolve email
  if (targetEmailOrUserId.includes('-') && !targetEmailOrUserId.includes('@')) {
    if (adminClient) {
      try {
        const { data: userData } = await adminClient.auth.admin.getUserById(targetEmailOrUserId)
        if (userData?.user?.email) {
          targetEmail = userData.user.email.toLowerCase().trim()
          targetUserId = userData.user.id
        }
      } catch {
        // Fallback
      }
    }
  }

  // Update in security state
  if (state.accounts[targetEmail]) {
    state.accounts[targetEmail].isLocked = false
    state.accounts[targetEmail].failedAttempts = 0
    state.accounts[targetEmail].unlockedAt = now
    state.accounts[targetEmail].unlockedBy = adminUserEmail
    state.accounts[targetEmail].lockedReason = null
  } else {
    state.accounts[targetEmail] = {
      email: targetEmail,
      userId: targetUserId,
      failedAttempts: 0,
      isLocked: false,
      unlockedAt: now,
      unlockedBy: adminUserEmail,
    }
  }

  await saveSecurityState(state)

  // Update in Supabase Auth user metadata
  if (adminClient) {
    try {
      const { data: listData } = await adminClient.auth.admin.listUsers()
      const matched = listData?.users.find((u) => u.email?.toLowerCase() === targetEmail)
      if (matched) {
        await adminClient.auth.admin.updateUserById(matched.id, {
          user_metadata: {
            ...(matched.user_metadata || {}),
            is_locked: false,
            locked_at: null,
            locked_reason: null,
            unlocked_at: now,
            unlocked_by: adminUserEmail,
          },
        })
      }
    } catch {
      // Non-fatal
    }
  }

  await recordSecurityAudit('ACCOUNT_UNLOCKED_BY_SUPERADMIN', {
    targetEmail,
    unlockedBy: adminUserEmail,
    timestamp: now,
  })

  return { success: true }
}

/**
 * Validates strict password complexity rules:
 * - At least 8 characters
 * - Uppercase letter
 * - Lowercase letter
 * - Number
 * - Special character
 */
export function validateStrictPassword(password: string): {
  isValid: boolean
  score: number // 0 to 4
  errorsAr: string[]
  errorsFr: string[]
  errorsEn: string[]
} {
  const errorsAr: string[] = []
  const errorsFr: string[] = []
  const errorsEn: string[] = []

  let score = 0

  if (!password || password.length < 8) {
    errorsAr.push('يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.')
    errorsFr.push('Le mot de passe doit comporter au moins 8 caractères.')
    errorsEn.push('Password must be at least 8 characters long.')
  } else {
    score++
  }

  if (!/[a-z]/.test(password)) {
    errorsAr.push('يجب تضمين حرف صغير واحد على الأقل (a-z).')
    errorsFr.push('Au moins une lettre minuscule requise (a-z).')
    errorsEn.push('At least one lowercase letter required (a-z).')
  } else {
    score++
  }

  if (!/[A-Z]/.test(password)) {
    errorsAr.push('يجب تضمين حرف كبير واحد على الأقل (A-Z).')
    errorsFr.push('Au moins une lettre majuscule requise (A-Z).')
    errorsEn.push('At least one uppercase letter required (A-Z).')
  } else {
    score++
  }

  if (!/[0-9]/.test(password)) {
    errorsAr.push('يجب تضمين رقم واحد على الأقل (0-9).')
    errorsFr.push('Au moins un chiffre requis (0-9).')
    errorsEn.push('At least one numeric digit required (0-9).')
  } else {
    score++
  }

  if (!/[!@#$%^&*(),.?":{}|<>_\-=+~]/.test(password)) {
    errorsAr.push('يجب تضمين رمز خاص واحد على الأقل (!@#$%^&*...).')
    errorsFr.push('Au moins un caractère spécial requis (!@#$%^&*...).')
    errorsEn.push('At least one special symbol required (!@#$%^&*...).')
  }

  const isValid = errorsAr.length === 0
  return { isValid, score, errorsAr, errorsFr, errorsEn }
}

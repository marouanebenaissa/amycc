/**
 * AMYCC Email Dispatcher Service
 * Powered by Nodemailer with Gmail SMTP & Resend fallbacks
 * Configured for amycccontact@gmail.com and notification@amycc.org
 */

import nodemailer from 'nodemailer'

export interface PasswordResetEmailOptions {
  toEmail: string
  code: string
  resetUrl: string
  locale?: string
}

/**
 * Create Nodemailer transporter
 * Supports Gmail SMTP (amycccontact@gmail.com) via Google App Password
 */
function createTransporter() {
  const gmailUser = process.env.GMAIL_USER || 'amycccontact@gmail.com'
  const gmailPass = (process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS || '').replace(/\s+/g, '')

  if (!gmailPass) {
    return null
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true, // true for 465, false for 587
    auth: {
      user: gmailUser,
      pass: gmailPass,
    },
  })
}

/**
 * Generate official high-end Moroccan styled HTML email for Password Reset OTP
 */
export function generatePasswordResetEmailHtml(options: PasswordResetEmailOptions): string {
  const { code, resetUrl, locale = 'ar' } = options
  const isAr = locale === 'ar'
  const isFr = locale === 'fr'

  const formattedCode = code.split('').join(' ')

  return `<!DOCTYPE html>
<html lang="${locale}" dir="${isAr ? 'rtl' : 'ltr'}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isAr ? 'رمز استعادة كلمة المرور' : isFr ? 'Code de Récupération' : 'Password Reset Code'}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF8F5; margin: 0; padding: 24px; color: #231f20; }
    .container { max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; border: 1px solid #e5e0d6; box-shadow: 0 10px 30px rgba(35, 31, 32, 0.06); }
    .header { background: linear-gradient(135deg, #231f20 0%, #231f20 50%, #181516 100%); color: #ffffff; padding: 36px 32px; text-align: center; border-bottom: 4px solid #bd3227; }
    .badge { display: inline-block; padding: 6px 16px; border-radius: 9999px; background: rgba(255,255,255,0.12); color: #ffd22f; font-size: 11px; font-weight: 800; margin-bottom: 12px; letter-spacing: 0.5px; }
    .org-title { font-size: 13px; color: rgba(255,255,255,0.8); font-weight: 600; margin: 0 0 6px 0; }
    .main-title { font-size: 22px; font-weight: 900; color: #ffffff; margin: 0; line-height: 1.3; }
    .body-content { padding: 36px 32px; }
    .intro { font-size: 14px; color: #5C5A55; line-height: 1.7; margin-bottom: 24px; }
    .code-box { background: #FAF8F5; border: 2px dashed #bd3227; border-radius: 20px; padding: 24px; text-align: center; margin: 24px 0; }
    .code-label { font-size: 12px; font-weight: 800; color: #5C5A55; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 1px; }
    .code-digits { font-family: 'Courier New', Courier, monospace; font-size: 38px; font-weight: 900; color: #bd3227; letter-spacing: 10px; margin: 8px 0; }
    .code-validity { font-size: 12px; color: #8a6e14; font-weight: 700; margin-top: 6px; }
    .btn-container { text-align: center; margin: 30px 0; }
    .action-btn { display: inline-block; background-color: #231f20; color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 14px; font-weight: 800; font-size: 13px; box-shadow: 0 4px 14px rgba(35, 31, 32, 0.2); }
    .action-btn:hover { background-color: #bd3227; }
    .notice { background: #FAF8F5; border: 1px solid #e5e0d6; border-radius: 14px; padding: 16px 20px; font-size: 12px; color: #5C5A55; line-height: 1.6; margin-top: 24px; }
    .footer { background: #FAF8F5; padding: 24px 32px; text-align: center; font-size: 11px; color: #8a857b; border-top: 1px solid #e5e0d6; }
    .footer a { color: #231f20; text-decoration: none; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge">🔒 ${isAr ? 'أمان المنصة الإدارية' : isFr ? 'Sécurité de la Plateforme' : 'Admin Platform Security'}</div>
      <div class="org-title">جمعية روح الفنون والثقافة (AMYCC)</div>
      <h1 class="main-title">${isAr ? 'استعادة وتعيين كلمة المرور' : isFr ? 'Réinitialisation du mot de passe' : 'Admin Password Reset'}</h1>
    </div>

    <div class="body-content">
      <p class="intro">
        ${isAr
          ? 'تلقينا طلباً لاستعادة صلاحية الدخول وإعادة تعيين كلمة المرور لحسابكم في لوحة التحكم الإدارية لجمعية روح الفنون والثقافة. يرجى استخدام رمز التحقق أدناه:'
          : isFr
          ? 'Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte d\'administration AMYCC. Veuillez utiliser le code de vérification ci-dessous :'
          : 'We received a request to reset your administrator password on the AMYCC platform. Please use the verification code below:'}
      </p>

      <div class="code-box">
        <div class="code-label">${isAr ? 'رمز التحقق السري' : isFr ? 'Code de vérification' : 'Verification Code'}</div>
        <div class="code-digits">${formattedCode}</div>
        <div class="code-validity">⏱️ ${isAr ? 'صالح لمدة 15 دقيقة فقط • استخدام لمرة واحدة' : isFr ? 'Valide pendant 15 minutes • Usage unique' : 'Valid for 15 minutes • One-time use'}</div>
      </div>

      <div class="btn-container">
        <a href="${resetUrl}" class="action-btn">
          ${isAr ? 'استعادة كلمة المرور مباشرة ←' : isFr ? 'Réinitialiser directement →' : 'Reset Password Directly →'}
        </a>
      </div>

      <div class="notice">
        <strong>⚠️ ${isAr ? 'تنبيه أمني هام:' : isFr ? 'Avis de sécurité :' : 'Important Security Notice:'}</strong>
        <p style="margin: 4px 0 0 0;">
          ${isAr
            ? 'لا تشارك هذا الرمز مع أي شخص. موظفو وإدارة جمعية AMYCC لن يطلبوا منك هذا الرمز أبداً. إذا لم تكن أنت من طلب هذا الإجراء، فيرجى تجاهل هذه الرسالة.'
            : isFr
            ? 'Ne partagez ce code avec personne. L\'équipe AMYCC ne vous demandera jamais ce code. Si vous n\'êtes pas à l\'origine de cette demande, vous pouvez ignorer cet e-mail.'
            : 'Never share this code with anyone. AMYCC administrators will never ask for this code. If you did not make this request, you can safely ignore this email.'}
        </p>
      </div>
    </div>

    <div class="footer">
      <div><strong>جمعية روح الفنون والثقافة (AMYCC)</strong></div>
      <div style="margin-top: 4px;">مراكش • المملكة المغربية</div>
      <div style="margin-top: 4px;">البريد الرسمي: <a href="mailto:amycccontact@gmail.com">amycccontact@gmail.com</a></div>
    </div>
  </div>
</body>
</html>`
}

/**
 * Dispatch password reset email via Gmail SMTP or fallback
 */
export async function sendPasswordResetEmail(
  options: PasswordResetEmailOptions
): Promise<{ success: boolean; error?: string; via?: string }> {
  const { toEmail, code, resetUrl, locale = 'ar' } = options
  const isAr = locale === 'ar'

  const subject = isAr
    ? `[AMYCC] رمز استعادة حساب المشرف: ${code}`
    : `[AMYCC] Code de récupération administrateur: ${code}`

  const html = generatePasswordResetEmailHtml(options)
  const text = isAr
    ? `جمعية روح الفنون والثقافة (AMYCC)\nرمز استعادة كلمة المرور الخاص بك هو: ${code}\nصالح لمدة 15 دقيقة.\nأو استخدم الرابط المباشر:\n${resetUrl}`
    : `AMYCC\nYour password reset code is: ${code}\nValid for 15 minutes.\nOr use direct link:\n${resetUrl}`

  // 1. Try Gmail SMTP with Nodemailer
  const transporter = createTransporter()
  if (transporter) {
    try {
      const gmailUser = process.env.GMAIL_USER || 'amycccontact@gmail.com'
      const info = await transporter.sendMail({
        from: `"جمعية روح الفنون والثقافة (AMYCC)" <${gmailUser}>`,
        to: toEmail,
        subject,
        text,
        html,
      })
      console.log(`[Email Dispatcher] Sent OTP email via Gmail SMTP to ${toEmail}, messageId: ${info.messageId}`)
      return { success: true, via: 'gmail_smtp' }
    } catch (err) {
      console.error('[Email Dispatcher] Gmail SMTP failed:', (err as Error).message)
      // Fall through to other dispatchers
    }
  }

  // 2. Try Resend if RESEND_API_KEY is available
  const resendApiKey = process.env.RESEND_API_KEY
  if (resendApiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: 'AMYCC Security <onboarding@resend.dev>',
          to: [toEmail],
          subject,
          html,
          text,
        }),
      })

      if (res.ok) {
        console.log(`[Email Dispatcher] Sent OTP email via Resend to ${toEmail}`)
        return { success: true, via: 'resend' }
      }
    } catch (err) {
      console.error('[Email Dispatcher] Resend API failed:', (err as Error).message)
    }
  }

  return {
    success: false,
    error: 'GMAIL_APP_PASSWORD_NOT_CONFIGURED',
  }
}

import { NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { createAdminClient } from '@/lib/supabase/admin'
import { getSupportPageSettings } from '@/lib/settings'

export const dynamic = 'force-dynamic'

/**
 * Computes the official CMI (Centre Monétique Interbancaire) SHA-512 signature hash.
 * Following CMI V3 specs: Sort keys alphabetically (case-insensitive), join values with '|',
 * append '|' + storeKey, and compute SHA-512 base64.
 */
function computeCmiHash(params: Record<string, string>, storeKey: string): string {
  const sortedKeys = Object.keys(params)
    .filter((k) => k.toLowerCase() !== 'hash' && k.toLowerCase() !== 'encoding')
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))

  const dataToHash = sortedKeys.map((k) => params[k].trim()).join('|') + '|' + storeKey.trim()
  return crypto.createHash('sha512').update(dataToHash, 'utf8').digest('base64')
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      amount,
      donorName,
      donorEmail,
      donorPhone,
      supportType = 'financial',
      cause = 'general_support',
      notes = '',
      locale = 'ar',
    } = body

    const numericAmount = Number(amount)
    if (!numericAmount || numericAmount <= 0) {
      return NextResponse.json(
        { success: false, error: 'المبلغ غير صالح (Invalid amount)' },
        { status: 400 }
      )
    }

    if (!donorName || !donorEmail) {
      return NextResponse.json(
        { success: false, error: 'الاسم والبريد الإلكتروني مطلوبان (Name and email are required)' },
        { status: 400 }
      )
    }

    const settings = await getSupportPageSettings()
    const gateway = settings.paymentGateway

    const adminClient = createAdminClient()
    const orderId = `AMYCC-${Date.now()}-${Math.floor(Math.random() * 1000)}`

    // Record initial pending donation in database
    const { data: record, error: dbError } = await adminClient
      .from('donation_records')
      .insert({
        donor_name: donorName,
        donor_email: donorEmail,
        donor_phone: donorPhone || null,
        support_type: supportType,
        amount: numericAmount,
        currency: gateway.currency || 'MAD',
        notes: `[Cause: ${cause}] ${notes}`.trim(),
        status: 'pending',
      })
      .select('id')
      .single()

    if (dbError) {
      console.error('Failed to create donation record:', dbError)
    }

    const donationId = record?.id || orderId

    // If Payment Gateway is disabled or in simulation/test mode without live keys:
    if (!gateway.enabled || gateway.mode === 'test' && gateway.cmiConfig.merchantId === '600000000') {
      // Return sandbox test simulation
      return NextResponse.json({
        success: true,
        mode: 'sandbox_simulation',
        orderId,
        donationId,
        amount: numericAmount,
        currency: gateway.currency || 'MAD',
        message:
          locale === 'ar'
            ? 'تم تسجيل نية التبرع بنجاح في بيئة التجربة والمحاكاة.'
            : locale === 'fr'
            ? 'Don enregistré avec succès en mode démonstration et simulation.'
            : 'Donation successfully registered in demonstration sandbox mode.',
      })
    }

    // CMI Gateway Form Payload Generation (Official Moroccan CMI V3 3D-Secure)
    if (gateway.provider === 'cmi' || gateway.provider === 'both') {
      const formattedAmount = numericAmount.toFixed(2)
      const rnd = Date.now().toString()
      const origin = req.headers.get('origin') || 'https://amycc.org'

      const cmiParams: Record<string, string> = {
        clientid: gateway.cmiConfig.merchantId,
        amount: formattedAmount,
        currency: '504', // ISO 4217 for Moroccan Dirham (MAD)
        oid: orderId,
        okUrl: `${origin}/${locale}/support?status=success&oid=${orderId}`,
        failUrl: `${origin}/${locale}/support?status=failed&oid=${orderId}`,
        callbackUrl: `${origin}${gateway.cmiConfig.callbackUrl}`,
        shopurl: `${origin}/${locale}/support`,
        rnd,
        storetype: '3d_pay_hosting',
        hashAlgorithm: 'ver3',
        tranType: 'PreAuth',
        encoding: 'UTF-8',
        BillToName: donorName,
        email: donorEmail,
        tel: donorPhone || '',
      }

      const hash = computeCmiHash(cmiParams, gateway.cmiConfig.storeKey)
      cmiParams.HASH = hash

      return NextResponse.json({
        success: true,
        mode: 'cmi',
        gatewayUrl: gateway.cmiConfig.gatewayUrl || 'https://payment.cmi.co.ma/fim/est3Dgate',
        fields: cmiParams,
      })
    }

    return NextResponse.json({
      success: true,
      mode: 'manual_confirmation',
      orderId,
      donationId,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Checkout initialization failed'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

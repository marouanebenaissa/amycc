import { NextResponse } from 'next/server'
import { getFaqSettings } from '@/lib/settings'
import { saveFaqConfiguration } from '@/lib/actions/admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  const settings = await getFaqSettings()
  return NextResponse.json(settings)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    if (!body || !Array.isArray(body.items)) {
      return NextResponse.json({ success: false, error: 'Invalid items array' }, { status: 400 })
    }

    const result = await saveFaqConfiguration(body.items)
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 403 })
    }

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update FAQs'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

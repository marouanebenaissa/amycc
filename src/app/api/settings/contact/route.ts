import { NextResponse } from 'next/server'
import { getContactSettings } from '@/lib/settings'
import { saveContactConfiguration } from '@/lib/actions/admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  const settings = await getContactSettings()
  return NextResponse.json(settings)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    if (!body || typeof body !== 'object' || !body.channels) {
      return NextResponse.json({ success: false, error: 'Invalid contact configuration' }, { status: 400 })
    }

    const result = await saveContactConfiguration(body)
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 403 })
    }

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update contact settings'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

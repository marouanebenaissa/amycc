import { NextResponse } from 'next/server'
import { getSupportPageSettings } from '@/lib/settings'
import { saveSupportPageConfiguration } from '@/lib/actions/admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  const settings = await getSupportPageSettings()
  return NextResponse.json(settings)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    if (!body || typeof body !== 'object' || !body.hero) {
      return NextResponse.json(
        { success: false, error: 'Invalid support page configuration' },
        { status: 400 }
      )
    }

    const result = await saveSupportPageConfiguration(body)
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 403 })
    }

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update support page settings'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

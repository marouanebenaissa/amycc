import { NextResponse } from 'next/server'
import { getAreasSettings } from '@/lib/settings'
import { saveAreasConfiguration } from '@/lib/actions/admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  const settings = await getAreasSettings()
  return NextResponse.json(settings)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    if (!body || !Array.isArray(body.items)) {
      return NextResponse.json({ success: false, error: 'Invalid areas config' }, { status: 400 })
    }

    const result = await saveAreasConfiguration(body)
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 403 })
    }

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update areas'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

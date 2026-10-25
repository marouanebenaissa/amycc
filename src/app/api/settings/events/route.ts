import { NextResponse } from 'next/server'
import { getEventsPageSettings } from '@/lib/settings'
import { saveEventsPageConfiguration } from '@/lib/actions/admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  const settings = await getEventsPageSettings()
  return NextResponse.json(settings)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    if (!body || typeof body !== 'object' || !body.hero) {
      return NextResponse.json({ success: false, error: 'Invalid events page configuration' }, { status: 400 })
    }

    const result = await saveEventsPageConfiguration(body)
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 403 })
    }

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update events page settings'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

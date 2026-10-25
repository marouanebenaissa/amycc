import { NextResponse } from 'next/server'
import { getTeamSettings } from '@/lib/settings'
import { saveTeamConfiguration } from '@/lib/actions/admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  const settings = await getTeamSettings()
  return NextResponse.json(settings)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    if (!body || !Array.isArray(body.members)) {
      return NextResponse.json({ success: false, error: 'Invalid team config' }, { status: 400 })
    }

    const result = await saveTeamConfiguration(body)
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 403 })
    }

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update team'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

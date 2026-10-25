import { NextResponse } from 'next/server'
import { getFlagshipProgramSettings } from '@/lib/settings'

export const dynamic = 'force-dynamic'

export async function GET() {
  const settings = await getFlagshipProgramSettings()
  return NextResponse.json(settings)
}

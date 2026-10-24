import { NextResponse } from 'next/server'
import { getTopBarSettings } from '@/lib/settings'

export async function GET() {
  const config = await getTopBarSettings()
  return NextResponse.json(config, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  })
}

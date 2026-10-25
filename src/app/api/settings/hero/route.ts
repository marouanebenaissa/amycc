import { NextResponse } from 'next/server'
import { getHeroSettings } from '@/lib/settings'

export async function GET() {
  const config = await getHeroSettings()
  return NextResponse.json(config, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  })
}

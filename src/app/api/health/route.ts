import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('site_settings').select('*').limit(1)

    if (error) {
      return NextResponse.json({ status: 'error', database: 'failed', error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
    })
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ status: 'error', message: errorMsg }, { status: 500 })
  }
}

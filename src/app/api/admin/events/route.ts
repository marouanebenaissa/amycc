import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح لك بتنفيذ هذا الإجراء (Unauthorized)' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    let eventId = searchParams.get('id')

    if (!eventId) {
      try {
        const body = await request.json()
        eventId = body?.id
      } catch {
        // Ignored
      }
    }

    if (!eventId) {
      return NextResponse.json(
        { success: false, error: 'معرف الفعالية مطلوب (Event ID is required)' },
        { status: 400 }
      )
    }

    const admin = createAdminClient()

    // 1. Delete dependent registrations and translations first
    await admin.from('event_registrations').delete().eq('event_id', eventId)
    await admin.from('event_translations').delete().eq('event_id', eventId)

    // 2. Delete the event record
    const { error } = await admin.from('events').delete().eq('id', eventId)

    if (error) {
      console.error('Failed to delete event via API:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    // 3. Revalidate paths
    revalidatePath('/admin/events')
    revalidatePath('/ar/events')
    revalidatePath('/fr/events')
    revalidatePath('/en/events')
    revalidatePath('/events')
    revalidatePath('/[locale]/events', 'page')

    return NextResponse.json({
      success: true,
      message: 'تم حذف الفعالية وكافة بياناتها بنجاح',
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal Server Error'
    console.error('API event delete error:', msg)
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}

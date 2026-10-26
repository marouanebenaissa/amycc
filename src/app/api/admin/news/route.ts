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
    let articleId = searchParams.get('id')

    if (!articleId) {
      try {
        const body = await request.json()
        articleId = body?.id
      } catch {
        // Ignored
      }
    }

    if (!articleId) {
      return NextResponse.json(
        { success: false, error: 'معرف المقال مطلوب (Article ID is required)' },
        { status: 400 }
      )
    }

    const admin = createAdminClient()

    // 1. Delete translations first
    await admin.from('news_translations').delete().eq('article_id', articleId)

    // 2. Delete article
    const { error } = await admin.from('news_articles').delete().eq('id', articleId)

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    // 3. Revalidate paths
    revalidatePath('/admin/news')
    revalidatePath('/ar/news')
    revalidatePath('/fr/news')
    revalidatePath('/en/news')
    revalidatePath('/news')
    revalidatePath('/[locale]/news', 'page')

    return NextResponse.json({
      success: true,
      message: 'تم حذف المقال بنجاح',
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}

export async function POST(request: Request) {
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

    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'معرف المقال والحالة مطلوبان' },
        { status: 400 }
      )
    }

    const admin = createAdminClient()
    const { error } = await admin
      .from('news_articles')
      .update({
        status,
        published_at: status === 'published' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    revalidatePath('/admin/news')
    revalidatePath('/ar/news')
    revalidatePath('/fr/news')
    revalidatePath('/en/news')
    revalidatePath('/news')
    revalidatePath('/[locale]/news', 'page')

    return NextResponse.json({
      success: true,
      message: 'تم تحديث حالة المقال بنجاح',
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}

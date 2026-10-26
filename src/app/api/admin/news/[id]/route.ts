import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function DELETE(
  request: Request,
  context?: { params?: Promise<{ id: string }> | { id: string } }
) {
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

    let articleId = ''

    if (context?.params) {
      const p = await Promise.resolve(context.params)
      articleId = p?.id || ''
    }

    if (!articleId) {
      const match = request.url.match(/\/api\/admin\/news\/([^/?#]+)/)
      if (match?.[1]) {
        articleId = decodeURIComponent(match[1])
      }
    }

    if (!articleId) {
      const { searchParams } = new URL(request.url)
      articleId = searchParams.get('id') || ''
    }

    if (!articleId) {
      try {
        const body = await request.json()
        articleId = body?.id || ''
      } catch {
        // Ignored
      }
    }

    if (!articleId) {
      return NextResponse.json(
        { success: false, error: 'معرف المقال مطلوب' },
        { status: 400 }
      )
    }

    const admin = createAdminClient()

    // 1. Delete translations first
    await admin.from('news_translations').delete().eq('article_id', articleId)

    // 2. Delete the article
    const { error } = await admin.from('news_articles').delete().eq('id', articleId)

    if (error) {
      console.error('Failed to delete news article:', error)
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
      message: 'تم حذف المقال بنجاح',
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}

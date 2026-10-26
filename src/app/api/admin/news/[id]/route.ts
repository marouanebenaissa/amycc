import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function DELETE(
  _request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params
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

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'معرف المقال مطلوب' },
        { status: 400 }
      )
    }

    const admin = createAdminClient()

    // Delete translations first
    await admin.from('news_translations').delete().eq('article_id', id)

    // Delete the article
    const { error } = await admin.from('news_articles').delete().eq('id', id)

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
      message: 'تم حذف المقال بنجاح',
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}

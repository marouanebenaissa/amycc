import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { seedDefaultNewsIfEmpty } from '@/lib/supabase/seed-news'

export const dynamic = 'force-dynamic'

export async function POST() {
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

    // Force seed the default 3 articles
    await seedDefaultNewsIfEmpty(true)

    // Fetch the updated articles
    const admin = createAdminClient()
    const { data: articles, error } = await admin
      .from('news_articles')
      .select('id, slug, category, status, cover_image, published_at, created_at, news_translations(locale, title, excerpt)')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    // Revalidate paths
    revalidatePath('/admin/news')
    revalidatePath('/ar/news')
    revalidatePath('/fr/news')
    revalidatePath('/en/news')
    revalidatePath('/news')
    revalidatePath('/[locale]/news', 'page')

    return NextResponse.json({
      success: true,
      message: 'تم استيراد وتحديث المقالات النموذجية بنجاح',
      articles: articles || [],
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}

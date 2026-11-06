import { createClient } from '@/lib/supabase/server'
import { createAdminClientSafe } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { getNewsPageSettings } from '@/lib/settings'
import { deleteNewsArticle } from '@/lib/actions/content'
import { NewsAdminTabs, type AdminNewsArticleItem } from '@/components/admin/NewsAdminTabs'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export default async function AdminNewsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  // Fetch articles via admin client (or fallback) to ensure all records (published, drafts) load reliably
  const admin = createAdminClientSafe() || supabase
  const [{ data: articles }, config] = await Promise.all([
    admin
      .from('news_articles')
      .select('id, slug, category, status, cover_image, published_at, created_at, news_translations(locale, title, excerpt)')
      .order('created_at', { ascending: false }),
    getNewsPageSettings(),
  ])

  async function handleDelete(id: string) {
    'use server'
    const res = await deleteNewsArticle(id)
    revalidatePath('/admin/news')
    revalidatePath('/ar/news')
    revalidatePath('/fr/news')
    revalidatePath('/en/news')
    revalidatePath('/news')
    revalidatePath('/[locale]/news', 'page')
    return res
  }

  return (
    <NewsAdminTabs
      initialArticles={(articles as AdminNewsArticleItem[]) || []}
      initialConfig={config}
      onDeleteArticle={handleDelete}
    />
  )
}

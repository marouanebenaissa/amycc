import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getNewsPageSettings } from '@/lib/settings'
import { NewsAdminTabs, type AdminNewsArticleItem } from '@/components/admin/NewsAdminTabs'

export const dynamic = 'force-dynamic'

export default async function AdminNewsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const { data: articles } = await supabase
    .from('news_articles')
    .select('id, slug, category, status, cover_image, published_at, created_at, news_translations(locale, title, excerpt)')
    .order('created_at', { ascending: false })

  const config = await getNewsPageSettings()

  return (
    <NewsAdminTabs
      initialArticles={(articles as AdminNewsArticleItem[]) || []}
      initialConfig={config}
    />
  )
}

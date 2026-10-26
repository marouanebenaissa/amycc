import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { getNewsPageSettings } from '@/lib/settings'
import { NewsAdminTabs, type AdminNewsArticleItem } from '@/components/admin/NewsAdminTabs'
import { seedDefaultNewsIfEmpty } from '@/lib/supabase/seed-news'

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

  // Auto-seed default articles if table is empty so admin always has initial data
  await seedDefaultNewsIfEmpty()

  // Fetch articles via admin client to ensure all records (published, drafts) load reliably
  const admin = createAdminClient()
  const { data: articles } = await admin
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

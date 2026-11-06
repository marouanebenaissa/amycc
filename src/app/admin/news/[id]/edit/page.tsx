import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect, notFound } from 'next/navigation'
import { NewsForm } from '@/components/admin/NewsForm'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'

export const dynamic = 'force-dynamic'

export default async function EditNewsArticlePage(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const admin = createAdminClient()
  const { data: article } = await admin
    .from('news_articles')
    .select('*, news_translations(*)')
    .eq('id', id)
    .single()

  if (!article) {
    notFound()
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <AdminPageHeader
        backHref="/admin/news"
        backTitle={{ ar: 'العودة للأخبار', fr: 'Retour aux actualités', en: 'Back to News' }}
        title={{ ar: 'تعديل المقال الإخباري', fr: 'Modifier l\'article', en: 'Edit News Article' }}
        subtitle={{
          ar: 'تحديث تفاصيل المقال، الصورة البارزة، والمحتوى التحريري باللغات الثلاث (العربية، الفرنسية، الإنجليزية).',
          fr: 'Mettre à jour l\'article, l\'image à la une et les textes trilingues (Arabe, Français, Anglais).',
          en: 'Update article details, cover image, and multilingual content (Arabic, French, English).',
        }}
      />

      <NewsForm article={article} />
    </div>
  )
}

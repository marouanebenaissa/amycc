import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { NewsForm } from '@/components/admin/NewsForm'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'

export default async function NewNewsArticlePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <AdminPageHeader
        backHref="/admin/news"
        backTitle={{ ar: 'العودة للأخبار', fr: 'Retour aux actualités', en: 'Back to News' }}
        title={{ ar: 'تحرير مقال إخباري أو بيان صحفي', fr: 'Rédiger un nouvel article', en: 'Write New Article' }}
        subtitle={{
          ar: 'صياغة ونشر الأخبار والبيانات الرسمية بالعربية والفرنسية والإنجليزية.',
          fr: 'Rédiger et publier des communiqués officiels en arabe, français et anglais.',
          en: 'Compose announcements and news articles in Arabic, French, and English.',
        }}
      />

      <NewsForm />
    </div>
  )
}

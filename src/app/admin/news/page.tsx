import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export default async function AdminNewsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const { data: articles } = await supabase
    .from('news_articles')
    .select('*, news_translations(*)')
    .order('created_at', { ascending: false })

  async function updateArticleStatus(id: string, newStatus: string) {
    'use server'
    const sb = await createClient()
    await sb.from('news_articles').update({
      status: newStatus,
      published_at: newStatus === 'published' ? new Date().toISOString() : null
    }).eq('id', id)
    revalidatePath('/admin/news')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0a0f1d]">News & Communications</h1>
        <p className="text-xs text-slate-500 mt-1">
          Publish announcements, press releases, and cultural updates.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-2xs uppercase tracking-wider text-slate-500 font-bold">
              <tr>
                <th className="px-6 py-4 text-start">Article Title</th>
                <th className="px-6 py-4 text-start">Category</th>
                <th className="px-6 py-4 text-start">Status</th>
                <th className="px-6 py-4 text-start">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {articles && articles.length > 0 ? (
                articles.map((art) => {
                  const title = art.news_translations?.[0]?.title || art.slug
                  return (
                    <tr key={art.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#0a0f1d]">{title}</div>
                        <div className="text-slate-400 text-3xs font-mono">/{art.slug}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold block capitalize">{art.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-2xs font-bold ${
                            art.status === 'published'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {art.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {art.status !== 'published' ? (
                          <form action={updateArticleStatus.bind(null, art.id, 'published')}>
                            <button
                              type="submit"
                              className="px-2.5 py-1 rounded-lg text-2xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                            >
                              Publish
                            </button>
                          </form>
                        ) : (
                          <form action={updateArticleStatus.bind(null, art.id, 'draft')}>
                            <button
                              type="submit"
                              className="px-2.5 py-1 rounded-lg text-2xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                            >
                              Draft
                            </button>
                          </form>
                        )}
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    No articles drafted yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

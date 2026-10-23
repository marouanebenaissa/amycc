import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { deleteNewsArticle } from '@/lib/actions/content'

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
    .select('*, news_translations(*)')
    .order('created_at', { ascending: false })

  async function updateArticleStatus(id: string, newStatus: string) {
    'use server'
    const sb = await createClient()
    await sb
      .from('news_articles')
      .update({
        status: newStatus,
        published_at: newStatus === 'published' ? new Date().toISOString() : null,
      })
      .eq('id', id)
    revalidatePath('/admin/news')
  }

  async function handleDelete(id: string) {
    'use server'
    await deleteNewsArticle(id)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0a0f1d]">News & Communications</h1>
          <p className="text-xs text-slate-500 mt-1">
            Publish announcements, press releases, and cultural updates.
          </p>
        </div>
        <Link
          href="/admin/news/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0068ff] text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors"
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Article
        </Link>
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
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link
                            href={`/admin/news/${art.id}/edit`}
                            className="px-2.5 py-1 rounded-lg text-2xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                          >
                            Edit
                          </Link>

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

                          <form action={handleDelete.bind(null, art.id)} className="inline">
                            <button
                              type="submit"
                              className="px-2.5 py-1 rounded-lg text-2xs font-bold bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                            >
                              Delete
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    No articles yet.{' '}
                    <Link href="/admin/news/new" className="text-[#0068ff] hover:underline">
                      Write the first one →
                    </Link>
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

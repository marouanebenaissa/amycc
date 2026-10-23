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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#08242a]">News & Communications</h1>
          <p className="text-xs text-[#5f7174] mt-1">
            Publish association announcements, cultural press releases, and editorial articles.
          </p>
        </div>
        <Link
          href="/admin/news/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0d3b43] text-white text-xs font-bold rounded-xl hover:bg-[#14505b] active:scale-98 transition-all shadow-subtle hover:shadow-card"
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Article
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-[#e5e0d6] overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs text-[#2d3b3e]">
            <thead className="bg-[#faf7f2] border-b border-[#e5e0d6] text-2xs uppercase tracking-wider text-[#5f7174] font-bold">
              <tr>
                <th className="px-6 py-4 text-start">Article Title</th>
                <th className="px-6 py-4 text-start">Category</th>
                <th className="px-6 py-4 text-start">Status</th>
                <th className="px-6 py-4 text-start">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4ede2]">
              {articles && articles.length > 0 ? (
                articles.map((art) => {
                  const title = art.news_translations?.[0]?.title || art.slug
                  return (
                    <tr key={art.id} className="hover:bg-[#faf7f2]/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#08242a]">{title}</div>
                        <div className="text-[#819598] text-3xs font-mono">/{art.slug}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold block capitalize text-[#0d3b43]">{art.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-2xs font-bold ${
                            art.status === 'published'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
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
                            className="px-2.5 py-1 rounded-lg text-2xs font-bold bg-[#faf7f2] text-[#08242a] hover:bg-[#f4ede2] border border-[#e5e0d6] transition-colors"
                          >
                            Edit
                          </Link>

                          {art.status !== 'published' ? (
                            <form action={updateArticleStatus.bind(null, art.id, 'published')} className="inline">
                              <button
                                type="submit"
                                className="px-2.5 py-1 rounded-lg text-2xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                              >
                                Publish
                              </button>
                            </form>
                          ) : (
                            <form action={updateArticleStatus.bind(null, art.id, 'draft')} className="inline">
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
                              className="px-2.5 py-1 rounded-lg text-2xs font-bold text-red-600 hover:bg-red-50 transition-colors"
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
                  <td colSpan={4} className="px-6 py-12 text-center text-[#819598]">
                    No articles drafted yet.{' '}
                    <Link href="/admin/news/new" className="text-[#c85a32] font-bold hover:underline">
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

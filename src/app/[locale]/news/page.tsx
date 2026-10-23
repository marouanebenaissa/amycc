import { getDictionary } from '@/lib/i18n/dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { createPublicClient } from '@/lib/supabase/public'
import Link from 'next/link'

interface NewsListItem {
  id: string
  slug: string
  category: string
  published_at?: string | null
  news_translations?: {
    title: string
    excerpt?: string | null
  }[]
}

export default async function NewsPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const dict = await getDictionary(locale)

  let articles: NewsListItem[] = []

  try {
    const supabase = createPublicClient()
    const { data } = await supabase
      .from('news_articles')
      .select('id, slug, category, published_at, news_translations!inner(title, excerpt)')
      .eq('status', 'published')
      .eq('news_translations.locale', locale)
      .order('published_at', { ascending: false })

    if (data && data.length > 0) {
      articles = data as unknown as NewsListItem[]
    }
  } catch {
    // Fallback
  }

  // Default initial article fallback
  const defaultArticles: NewsListItem[] = [
    {
      id: 'default-1',
      slug: 'official-launch',
      category: 'association',
      published_at: '2026-01-15T00:00:00Z',
      news_translations: [
        {
          title:
            locale === 'ar'
              ? 'انطلاق أنشطة جمعية روح الفنون والثقافة'
              : locale === 'fr'
              ? "Lancement des activités de l'Association Esprit des Arts et de la Culture"
              : 'Official Launch of Spirit of Arts & Culture Association',
          excerpt: dict.about.description,
        },
      ],
    },
  ]

  const displayArticles = articles.length > 0 ? articles : defaultArticles

  return (
    <>
      <Header locale={locale} dict={dict} />
      <main id="main-content" className="flex-1 bg-white">
        <div className="bg-slate-50 border-b border-slate-100 py-16 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0068ff]">AMYCC</span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0a0f1d] mt-2 mb-4">
              {dict.news.title}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
              {dict.news.view_all}
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displayArticles.map((art) => {
              const trans = art.news_translations?.[0] || { title: art.slug, excerpt: '' }
              return (
                <article
                  key={art.id}
                  className="p-8 rounded-2xl border border-slate-200/80 bg-white shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-semibold text-[#0068ff] bg-blue-50 px-3 py-1 rounded-full capitalize">
                        {art.category}
                      </span>
                      {art.published_at && (
                        <span className="text-xs text-slate-400">
                          {new Date(art.published_at).toLocaleDateString(locale)}
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold text-[#0a0f1d] mb-3">
                      <Link
                        href={`/${locale}/news/${art.slug}`}
                        className="hover:text-[#0068ff] transition-colors"
                      >
                        {trans.title}
                      </Link>
                    </h2>
                    {trans.excerpt && (
                      <p className="text-sm text-slate-600 leading-relaxed mb-6">
                        {trans.excerpt}
                      </p>
                    )}
                  </div>
                  <div>
                    <Link
                      href={`/${locale}/news/${art.slug}`}
                      className="inline-flex items-center text-sm font-bold text-[#0068ff] hover:text-[#0054d1]"
                    >
                      {dict.news.read_more} →
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  )
}

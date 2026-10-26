import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { createPublicClient } from '@/lib/supabase/public'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'
import { defaultNewsArticlesData } from '@/lib/supabase/seed-news'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export async function generateStaticParams() {
  const slugs = ['official-launch', 'youth-in-action-call', 'theatre-workshops-launch']
  const locales = ['ar', 'fr', 'en']
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })))
}

interface ArticleDetail {
  id: string
  slug: string
  category: string
  cover_image?: string | null
  published_at?: string | null
  news_translations?: {
    locale?: string
    title: string
    excerpt?: string | null
    content: string
  }[]
}

interface RecentArticleItem {
  id: string
  slug: string
  category: string
  cover_image?: string | null
  published_at?: string | null
  news_translations?: {
    title: string
    excerpt?: string | null
  }[]
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await props.params

  try {
    const supabase = createPublicClient()
    const { data } = await supabase
      .from('news_articles')
      .select('slug, cover_image, news_translations(locale, title, excerpt)')
      .eq('slug', slug)
      .single()

    if (data) {
      const trans =
        data.news_translations?.find((t) => t.locale === locale) ||
        data.news_translations?.find((t) => t.locale === 'ar') ||
        data.news_translations?.[0]

      const title = `${trans?.title || data.slug} | جمعية روح الفنون والثقافة`
      const description =
        trans?.excerpt || 'مقال ومستجدات إعلامية من جمعية روح الفنون والثقافة (AMYCC)'

      return {
        title,
        description,
        openGraph: {
          title,
          description,
          type: 'article',
          images: data.cover_image ? [{ url: data.cover_image }] : undefined,
        },
      }
    }
  } catch {
    // Fallback
  }

  return {
    title: 'المستجدات والأخبار | جمعية روح الفنون والثقافة',
  }
}

export default async function NewsDetailPage(props: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await props.params
  const dict = await getDictionary(locale)
  const isAr = locale === 'ar'
  const isFr = locale === 'fr'

  let article: ArticleDetail | null = null
  let recentArticles: RecentArticleItem[] = []

  try {
    const supabase = createPublicClient()

    // 1. Fetch current article
    const { data } = await supabase
      .from('news_articles')
      .select(
        'id, slug, category, cover_image, published_at, news_translations(locale, title, excerpt, content)'
      )
      .eq('slug', slug)
      .single()

    if (data) {
      article = data as unknown as ArticleDetail
    }

    // 2. Fetch other recent articles for bottom recommendation
    const { data: recentData } = await supabase
      .from('news_articles')
      .select('id, slug, category, cover_image, published_at, news_translations(locale, title, excerpt)')
      .neq('slug', slug)
      .or('status.eq.published,status.is.null')
      .order('published_at', { ascending: false })
      .limit(3)

    if (recentData && recentData.length > 0) {
      recentArticles = recentData as unknown as RecentArticleItem[]
    }
  } catch {
    // Supabase query error fallback
  }

  // Fallback for default initial articles if database was unreachable
  if (!article) {
    const fallbackItem = defaultNewsArticlesData.find((d) => d.slug === slug)
    if (fallbackItem) {
      article = {
        id: `default-${fallbackItem.slug}`,
        slug: fallbackItem.slug,
        category: fallbackItem.category,
        cover_image: fallbackItem.cover_image,
        published_at: fallbackItem.published_at,
        news_translations: fallbackItem.translations,
      }
    }
  }

  if (!article) {
    notFound()
  }

  const trans =
    article.news_translations?.find((t) => t.locale === locale) ||
    article.news_translations?.find((t) => t.locale === 'ar') ||
    article.news_translations?.[0] || {
      title: article.slug,
      excerpt: '',
      content: '',
    }

  // Reading time
  const words = (trans.content || trans.excerpt || '').replace(/<[^>]+>/g, '').split(/\s+/).length
  const readingTime = Math.max(1, Math.ceil(words / 180))

  const dateFormatted = article.published_at
    ? new Date(article.published_at).toLocaleDateString(locale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <>
      <Header locale={locale} dict={dict} />

      <main id="main-content" className="flex-1 bg-[#faf7f2] py-12 lg:py-16">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Breadcrumb & Navigation */}
          <div className="flex items-center justify-between text-xs font-bold text-[#819598]">
            <Link
              href={`/${locale}/news`}
              className="inline-flex items-center gap-1.5 text-[#0d3b43] hover:text-[#c85a32] transition-colors"
            >
              <span>{isAr ? '←' : '→'}</span>
              <span>{dict.news.view_all}</span>
            </Link>

            <span className="text-3xs uppercase tracking-wider font-mono">
              AMYCC Media Dossier
            </span>
          </div>

          {/* Article Header Card */}
          <header className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#fae4dc] text-[#c85a32] border border-[#f2c2b0]">
                {article.category}
              </span>

              {dateFormatted && (
                <time className="text-xs text-[#5f7174] font-medium flex items-center gap-1">
                  <span>📅</span>
                  <span>{dateFormatted}</span>
                </time>
              )}

              <span className="text-xs text-[#819598] font-bold">
                ⏱️ {isAr ? `${readingTime} دقائق قراءة` : `${readingTime} min de lecture`}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#08242a] leading-tight tracking-tight">
              {trans.title}
            </h1>

            {trans.excerpt && (
              <p className="text-base sm:text-xl text-[#445457] leading-relaxed font-medium pt-2 pb-6 border-b border-[#e5e0d6]">
                {trans.excerpt}
              </p>
            )}
          </header>

          {/* Visual Cover Photo (Poster / Article Header) */}
          {article.cover_image && (
            <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden border border-[#e5e0d6] shadow-card bg-[#08242a]">
              <ImageWithFallback
                src={article.cover_image}
                fallbackSrc="https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80"
                alt={trans.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 start-4 end-4 text-white text-3xs font-mono font-bold flex items-center justify-between">
                <span>جمعية روح الفنون والثقافة • AMYCC Morocco</span>
                <span>Press & Media Desk</span>
              </div>
            </div>
          )}

          {/* Main Article Content */}
          <div className="bg-white p-6 sm:p-10 lg:p-12 rounded-3xl border border-[#e5e0d6] shadow-card">
            <div
              className="prose prose-slate max-w-none text-[#2d3a3d] leading-relaxed text-sm sm:text-base space-y-4"
              dangerouslySetInnerHTML={{ __html: trans.content }}
            />
          </div>

          {/* Editorial Attribution & Share Footer */}
          <div className="p-6 sm:p-8 rounded-3xl border border-[#e5e0d6] bg-white shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#0d3b43] text-white flex items-center justify-center font-black text-lg shadow-sm">
                A
              </div>
              <div>
                <span className="text-xs font-extrabold text-[#08242a] block">
                  جمعية روح الفنون والثقافة (AMYCC)
                </span>
                <span className="text-3xs text-[#819598] block">
                  {isAr
                    ? 'خلية الإعلام، النشر والتواصل المؤسساتي'
                    : isFr
                    ? 'Pôle Médias, Édition & Communication'
                    : 'Media, Publishing & Institutional Communications'}
                </span>
              </div>
            </div>

            <Link
              href={`/${locale}/news`}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#0d3b43] bg-[#faf7f2] hover:bg-[#eae4d9] border border-[#e5e0d6] transition-all"
            >
              {isAr ? '← تصفح بقية الأخبار والمقالات' : '← All News & Articles'}
            </Link>
          </div>

          {/* Other Recent Articles Recommendation */}
          {recentArticles.length > 0 && (
            <div className="pt-8 space-y-6">
              <h3 className="text-lg font-black text-[#08242a] flex items-center gap-2">
                <span>📰</span>
                <span>{isAr ? 'مستجدات أخرى قد تهمك' : isFr ? 'Autres actualités' : 'More Stories'}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {recentArticles.map((rec) => {
                  const recTrans =
                    rec.news_translations?.find((t) => t.title) ||
                    rec.news_translations?.[0] || { title: rec.slug, excerpt: '' }

                  return (
                    <Link
                      key={rec.id}
                      href={`/${locale}/news/${rec.slug}`}
                      className="group p-4 rounded-2xl bg-white border border-[#e5e0d6] hover:border-[#c85a32] shadow-2xs hover:shadow-card transition-all flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-4xs font-bold uppercase tracking-wider text-[#c85a32] block mb-1">
                          {rec.category}
                        </span>
                        <h4 className="text-xs font-black text-[#08242a] group-hover:text-[#c85a32] transition-colors line-clamp-2 leading-snug">
                          {recTrans.title}
                        </h4>
                      </div>
                      <span className="text-3xs font-bold text-[#0d3b43] mt-3 block">
                        {isAr ? 'قراءة ←' : 'Read →'}
                      </span>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </article>
      </main>

      <Footer locale={locale} dict={dict} />
    </>
  )
}

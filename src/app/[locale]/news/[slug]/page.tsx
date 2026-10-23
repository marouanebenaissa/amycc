import { getDictionary } from '@/lib/i18n/dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { createPublicClient } from '@/lib/supabase/public'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export async function generateStaticParams() {
  // Prerender sample slugs for SSG
  return [
    { locale: 'ar', slug: 'official-launch' },
    { locale: 'fr', slug: 'official-launch' },
    { locale: 'en', slug: 'official-launch' },
  ]
}

interface ArticleDetail {
  id: string
  slug: string
  category: string
  cover_image?: string | null
  published_at?: string | null
  news_translations?: {
    title: string
    excerpt?: string | null
    content: string
  }[]
}

export default async function NewsDetailPage(props: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await props.params
  const dict = await getDictionary(locale)

  let article: ArticleDetail | null = null

  try {
    const supabase = createPublicClient()
    const { data } = await supabase
      .from('news_articles')
      .select('id, slug, category, cover_image, published_at, news_translations!inner(title, excerpt, content)')
      .eq('slug', slug)
      .eq('status', 'published')
      .eq('news_translations.locale', locale)
      .single()

    if (data) {
      article = data as unknown as ArticleDetail
    }
  } catch {
    // Supabase query error fallback
  }

  // Fallback for default initial article
  if (!article && slug === 'official-launch') {
    article = {
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
              ? "Lancement officiel de l'Association Esprit des Arts et de la Culture"
              : 'Official Launch of the Spirit of Arts & Culture Association',
          excerpt:
            locale === 'ar'
              ? 'تأسيس جمعية روح الفنون والثقافة رسمياً للنهوض بالمجال الإبداعي والشبابي في المغرب.'
              : 'Création officielle de l’AMYCC pour promouvoir la créativité et la jeunesse au Maroc.',
          content: `<p>${dict.about.description}</p><p>${dict.hero.subtitle}</p>`,
        },
      ],
    }
  }

  if (!article) {
    notFound()
  }

  const trans = article.news_translations?.[0] || {
    title: article.slug,
    content: '',
  }

  return (
    <>
      <Header locale={locale} dict={dict} />
      <main id="main-content" className="flex-1 bg-white">
        {/* Article Header */}
        <div className="bg-slate-50 border-b border-slate-100 py-12">
          <div className="max-w-4xl mx-auto px-4">
            <Link
              href={`/${locale}/news`}
              className="inline-flex items-center text-xs font-bold text-[#0068ff] hover:underline mb-6"
            >
              ← {dict.news.view_all}
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#0068ff] capitalize">
                {article.category}
              </span>
              {article.published_at && (
                <time className="text-xs text-slate-400">
                  {new Date(article.published_at).toLocaleDateString(locale)}
                </time>
              )}
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0a0f1d] leading-tight">
              {trans.title}
            </h1>
            {trans.excerpt && (
              <p className="text-base sm:text-lg text-slate-600 mt-4 leading-relaxed font-medium">
                {trans.excerpt}
              </p>
            )}
          </div>
        </div>

        {/* Article Body */}
        <article className="max-w-4xl mx-auto px-4 py-12">
          {article.cover_image && (
            <div className="mb-10 rounded-2xl overflow-hidden border border-slate-200">
              <Image
                src={article.cover_image}
                alt={trans.title}
                width={1200}
                height={600}
                className="w-full h-auto max-h-[460px] object-cover"
                unoptimized
              />
            </div>
          )}

          <div
            className="tiptap prose prose-slate max-w-none text-slate-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: trans.content }}
          />
        </article>
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  )
}

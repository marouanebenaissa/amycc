import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { createPublicClient } from '@/lib/supabase/public'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'
import { ProIcon } from '@/components/ui/ProIcon'
import { defaultNewsArticlesData } from '@/lib/supabase/seed-news'
import { constructMetadata, getSiteUrl } from '@/lib/seo/config'
import { getArticleJsonLd, getBreadcrumbJsonLd, JsonLd } from '@/lib/seo/schema'
import { locales, type Locale, defaultLocale } from '@/lib/i18n/config'

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
    locale?: string
    title: string
    excerpt?: string | null
  }[]
}

function getCategoryLabel(cat: string, loc: string) {
  const c = (cat || '').toLowerCase()
  if (c.includes('press') || c.includes('صحف') || c.includes('communiqu')) {
    return loc === 'ar' ? 'بيان صحفي' : loc === 'fr' ? 'Communiqué de presse' : 'Press Release'
  }
  if (c.includes('assoc') || c.includes('جمعو') || c.includes('جمعية') || c.includes('vie')) {
    return loc === 'ar' ? 'أخبار الجمعية' : loc === 'fr' ? 'Vie associative' : 'Association Life'
  }
  if (c.includes('cultur') || c.includes('ثقاف') || c.includes('art') || c.includes('تراث')) {
    return loc === 'ar' ? 'ثقافة وتراث' : loc === 'fr' ? 'Arts & Patrimoine' : 'Culture & Arts'
  }
  if (c.includes('youth') || c.includes('شباب') || c.includes('jeun')) {
    return loc === 'ar' ? 'مبادرات الشباب' : loc === 'fr' ? 'Jeunesse en action' : 'Youth Initiatives'
  }
  if (c.includes('partner') || c.includes('شراك')) {
    return loc === 'ar' ? 'شراكات وتنسيق' : loc === 'fr' ? 'Partenariats' : 'Partnerships'
  }
  return cat
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await props.params
  const validLocale = (locales.includes(locale as Locale) ? locale : defaultLocale) as Locale

  let title = slug
  let description = ''
  let coverImage: string | undefined

  try {
    const supabase = createPublicClient()
    const { data } = await supabase
      .from('news_articles')
      .select('slug, cover_image, news_translations(locale, title, excerpt)')
      .eq('slug', slug)
      .single()

    if (data) {
      const trans =
        data.news_translations?.find((t) => t.locale === validLocale) ||
        data.news_translations?.find((t) => t.locale === 'ar') ||
        data.news_translations?.[0]

      if (trans?.title) title = trans.title
      if (trans?.excerpt) description = trans.excerpt
      if (data.cover_image) coverImage = data.cover_image
    }
  } catch {
    // Fallback
  }

  if (title === slug) {
    const fallbackItem = defaultNewsArticlesData.find((d) => d.slug === slug)
    if (fallbackItem) {
      const trans =
        fallbackItem.translations.find((t) => t.locale === validLocale) ||
        fallbackItem.translations.find((t) => t.locale === 'ar') ||
        fallbackItem.translations[0]
      if (trans?.title) title = trans.title
      if (trans?.excerpt) description = trans.excerpt
      if (fallbackItem.cover_image) coverImage = fallbackItem.cover_image
    }
  }

  const orgSuffix = validLocale === 'ar' ? 'جمعية روح الفنون والثقافة بمراكش' : 'AMYCC Marrakech'

  return constructMetadata({
    title: `${title} | ${orgSuffix}`,
    description: description || `مقال وبلاغ صحفي من جمعية روح الفنون والثقافة بمراكش (${slug})`,
    path: `/news/${slug}`,
    locale: validLocale,
    image: coverImage,
    type: 'article',
  })
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

  const orgNameShort =
    isAr
      ? 'جمعية روح الفنون والثقافة (AMYCC)'
      : isFr
      ? 'Association Esprit des Arts et de la Culture (AMYCC)'
      : 'Spirit of Arts and Culture Association (AMYCC)'

  const mediaDeskLabel =
    isAr
      ? 'خلية الإعلام، النشر والتواصل المؤسساتي'
      : isFr
      ? 'Pôle Médias, Édition & Communication'
      : 'Media, Publishing & Communications Desk'

  const pressBadgeLabel =
    isAr
      ? 'خلية الصحافة والإعلام'
      : isFr
      ? 'Pôle Presse & Médias'
      : 'Press & Media Desk'

  const heroCreditLabel =
    isAr
      ? 'جمعية روح الفنون والثقافة • AMYCC المغرب'
      : isFr
      ? 'AMYCC Maroc • Association Esprit des Arts et de la Culture'
      : 'AMYCC Morocco • Spirit of Arts and Culture Association'

  const backToNewsLabel =
    isAr
      ? 'تصفح بقية الأخبار والمقالات'
      : isFr
      ? 'Toutes les actualités & articles'
      : 'All News & Articles'

  const breadcrumbBackLabel =
    isAr
      ? 'الرجوع إلى كافة الأخبار'
      : isFr
      ? 'Toutes les actualités'
      : 'All News & Articles'

  const dossierLabel =
    isAr
      ? 'الملف الإعلامي • AMYCC'
      : isFr
      ? 'Dossier de Presse • AMYCC'
      : 'AMYCC Media Dossier'

  const siteUrl = getSiteUrl()
  const articleUrl = `${siteUrl}/${locale}/news/${slug}`

  const articleJsonLd = getArticleJsonLd({
    headline: trans.title,
    description: trans.excerpt || trans.title,
    publishedAt: article.published_at,
    imageUrl: article.cover_image,
    url: articleUrl,
    locale,
  })

  const breadcrumbSchema = getBreadcrumbJsonLd([
    { name: isAr ? 'الرئيسية' : isFr ? 'Accueil' : 'Home', url: `${siteUrl}/${locale}` },
    { name: isAr ? 'الأخبار والمستجدات' : isFr ? 'Actualités' : 'News & Press', url: `${siteUrl}/${locale}/news` },
    { name: trans.title, url: articleUrl },
  ])

  return (
    <>
      <JsonLd data={[articleJsonLd, breadcrumbSchema]} />
      <Header locale={locale} dict={dict} />

      <main id="main-content" className="flex-1 bg-[#FAF8F5] py-12 lg:py-16">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Breadcrumb & Navigation */}
          <div className="flex items-center justify-between text-xs font-bold text-[#5C5A55]">
            <Link
              href={`/${locale}/news`}
              className="inline-flex items-center gap-1.5 text-[#231f20] hover:text-[#bd3227] transition-colors"
            >
              <span className="rtl:rotate-180">←</span>
              <span>{breadcrumbBackLabel}</span>
            </Link>

            <span className="text-3xs uppercase tracking-wider font-mono">
              {dossierLabel}
            </span>
          </div>

          {/* Article Header Card */}
          <header className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#fde8e7] text-[#bd3227] border border-[#fde8e7]">
                {getCategoryLabel(article.category, locale)}
              </span>

              {dateFormatted && (
                <time className="text-xs text-[#5C5A55] font-medium flex items-center gap-1.5">
                  <ProIcon name="calendar" size={13} className="text-[#bd3227] shrink-0" />
                  <span>{dateFormatted}</span>
                </time>
              )}

              <span className="text-xs text-[#5C5A55] font-bold flex items-center gap-1.5">
                <ProIcon name="clock" size={13} className="text-[#5C5A55] shrink-0" />
                <span>{isAr ? `${readingTime} دقائق قراءة` : isFr ? `${readingTime} min de lecture` : `${readingTime} min read`}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#231f20] leading-tight tracking-tight">
              {trans.title}
            </h1>

            {trans.excerpt && (
              <p className="text-base sm:text-xl text-[#5C5A55] leading-relaxed font-medium pt-2 pb-6 border-b border-[#e5e0d6]">
                {trans.excerpt}
              </p>
            )}
          </header>

          {/* Visual Cover Photo (Poster / Article Header) */}
          {article.cover_image && (
            <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden border border-[#e5e0d6] shadow-card bg-[#231f20]">
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
                <span>{heroCreditLabel}</span>
                <span>{pressBadgeLabel}</span>
              </div>
            </div>
          )}

          {/* Main Article Content */}
          <div className="bg-white p-6 sm:p-10 lg:p-12 rounded-3xl border border-[#e5e0d6] shadow-card">
            <div
              className="prose prose-slate max-w-none text-[#231f20] leading-relaxed text-sm sm:text-base space-y-4"
              dangerouslySetInnerHTML={{ __html: trans.content }}
            />
          </div>

          {/* Editorial Attribution & Share Footer */}
          <div className="p-6 sm:p-8 rounded-3xl border border-[#e5e0d6] bg-white shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#231f20] text-white flex items-center justify-center font-black text-lg shadow-sm">
                A
              </div>
              <div>
                <span className="text-xs font-extrabold text-[#231f20] block">
                  {orgNameShort}
                </span>
                <span className="text-3xs text-[#5C5A55] block">
                  {mediaDeskLabel}
                </span>
              </div>
            </div>

            <Link
              href={`/${locale}/news`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-[#231f20] bg-[#FAF8F5] hover:bg-[#F4EFE6] border border-[#e5e0d6] transition-all"
            >
              <span className="rtl:rotate-180">←</span>
              <span>{backToNewsLabel}</span>
            </Link>
          </div>

          {/* Other Recent Articles Recommendation */}
          {recentArticles.length > 0 && (
            <div className="pt-8 space-y-6">
              <h3 className="text-lg font-black text-[#231f20] flex items-center gap-2">
                <ProIcon name="news" size={16} className="text-[#bd3227] shrink-0" />
                <span>{isAr ? 'مستجدات أخرى قد تهمك' : isFr ? 'Autres actualités' : 'More Stories'}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {recentArticles.map((rec) => {
                  const recTrans =
                    rec.news_translations?.find((t) => t.locale === locale) ||
                    rec.news_translations?.find((t) => t.title) ||
                    rec.news_translations?.[0] || { title: rec.slug, excerpt: '' }

                  return (
                    <Link
                      key={rec.id}
                      href={`/${locale}/news/${rec.slug}`}
                      className="group p-4 rounded-2xl bg-white border border-[#e5e0d6] hover:border-[#bd3227] shadow-2xs hover:shadow-card transition-all flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-4xs font-bold uppercase tracking-wider text-[#bd3227] block mb-1">
                          {getCategoryLabel(rec.category, locale)}
                        </span>
                        <h4 className="text-xs font-black text-[#231f20] group-hover:text-[#bd3227] transition-colors line-clamp-2 leading-snug">
                          {recTrans.title}
                        </h4>
                      </div>
                      <span className="text-3xs font-bold text-[#231f20] mt-3 inline-flex items-center gap-1">
                        <span>{isAr ? 'قراءة المقال' : isFr ? 'Lire l’article' : 'Read Article'}</span>
                        <span className="rtl:rotate-180">→</span>
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

import type { Metadata } from 'next'
import Link from 'next/link'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { createPublicClient } from '@/lib/supabase/public'
import { getNewsPageSettings } from '@/lib/settings'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'
import { NewsCatalog, type NewsItemData } from '@/components/news/NewsCatalog'
import { defaultNewsArticlesData } from '@/lib/supabase/seed-news'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await props.params
  const config = await getNewsPageSettings()
  const isAr = locale === 'ar'
  const isFr = locale === 'fr'

  const title = isAr
    ? `${config.hero.titleAr} | جمعية روح الفنون والثقافة`
    : isFr
    ? `${config.hero.titleFr} | Association Esprit des Arts et de la Culture`
    : `${config.hero.titleEn} | Spirit of Arts and Culture Association`

  const description = isAr
    ? config.hero.descriptionAr
    : isFr
    ? config.hero.descriptionFr
    : config.hero.descriptionEn

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
  }
}

export default async function NewsPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const dict = await getDictionary(locale)
  const isAr = locale === 'ar'
  const isFr = locale === 'fr'

  const [pageSettings, dbArticles] = await Promise.all([
    getNewsPageSettings(),
    (async (): Promise<NewsItemData[]> => {
      try {
        const supabase = createPublicClient()
        const { data } = await supabase
          .from('news_articles')
          .select(
            'id, slug, category, cover_image, status, published_at, created_at, news_translations(locale, title, excerpt)'
          )
          .or('status.eq.published,status.is.null')
          .order('published_at', { ascending: false })

        if (data && data.length > 0) {
          return data.map((art) => {
            const translations = Array.isArray(art.news_translations) ? art.news_translations : []
            const currentTrans =
              translations.find((t) => t.locale === locale) ||
              translations.find((t) => t.locale === 'ar') ||
              translations[0] || {
                locale,
                title: art.slug,
                excerpt: '',
              }

            return {
              id: art.id,
              slug: art.slug,
              category: art.category,
              cover_image: art.cover_image,
              published_at: art.published_at || art.created_at,
              status: art.status,
              news_translations: [
                {
                  locale: currentTrans.locale || locale,
                  title: currentTrans.title || art.slug,
                  excerpt: currentTrans.excerpt || '',
                },
              ],
            }
          })
        }
      } catch {
        // Fallback
      }
      return []
    })(),
  ])

  // Fallback initial high-quality articles if database is empty
  const defaultArticles: NewsItemData[] = defaultNewsArticlesData.map((art) => {
    const currentTrans =
      art.translations.find((t) => t.locale === locale) ||
      art.translations.find((t) => t.locale === 'ar') ||
      art.translations[0]

    return {
      id: `default-${art.slug}`,
      slug: art.slug,
      category: art.category,
      cover_image: art.cover_image,
      published_at: art.published_at,
      status: art.status,
      news_translations: [
        {
          locale: currentTrans.locale,
          title: currentTrans.title,
          excerpt: currentTrans.excerpt,
        },
      ],
    }
  })

  const displayArticles = dbArticles.length > 0 ? dbArticles : defaultArticles

  return (
    <>
      <Header locale={locale} dict={dict} />

      <main id="main-content" className="flex-1 bg-[#faf7f2]">
        {/* ========================================================= */}
        {/* News Hero Banner (Configurable via CMS)                   */}
        {/* ========================================================= */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#faf7f2] via-[#f7f2e9] to-[#faf7f2] border-b border-[#e5e0d6] pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="absolute inset-0 moroccan-pattern-light opacity-60 pointer-events-none" aria-hidden="true" />
          
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            {/* Tag / Category Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fae4dc] border border-[#f2c2b0] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#c85a32] animate-pulse" />
              <span className="text-3xs sm:text-2xs font-extrabold uppercase tracking-widest text-[#c85a32]">
                {isAr
                  ? pageSettings.hero.tagAr
                  : isFr
                  ? pageSettings.hero.tagFr
                  : pageSettings.hero.tagEn}
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#08242a] tracking-tight leading-tight">
              {isAr
                ? pageSettings.hero.titleAr
                : isFr
                ? pageSettings.hero.titleFr
                : pageSettings.hero.titleEn}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl font-bold text-[#0d3b43] max-w-3xl mx-auto leading-relaxed">
              {isAr
                ? pageSettings.hero.subtitleAr
                : isFr
                ? pageSettings.hero.subtitleFr
                : pageSettings.hero.subtitleEn}
            </p>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#445457] max-w-2xl mx-auto leading-relaxed font-normal">
              {isAr
                ? pageSettings.hero.descriptionAr
                : isFr
                ? pageSettings.hero.descriptionFr
                : pageSettings.hero.descriptionEn}
            </p>

            {/* Primary Action Button */}
            <div className="pt-2">
              <Link
                href={pageSettings.hero.primaryBtnUrl || '#news-catalog'}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs sm:text-sm text-white bg-[#0d3b43] hover:bg-[#14505b] active:scale-98 transition-all shadow-md hover:shadow-lg"
              >
                <span>📰</span>
                <span>
                  {isAr
                    ? pageSettings.hero.primaryBtnTextAr
                    : isFr
                    ? pageSettings.hero.primaryBtnTextFr
                    : pageSettings.hero.primaryBtnTextEn}
                </span>
                <span>{isAr ? '←' : '→'}</span>
              </Link>
            </div>

            {/* Hero Image Preview (if enabled) */}
            {pageSettings.hero.hasHeroImage && pageSettings.hero.imageUrl && (
              <div className="pt-6 max-w-4xl mx-auto">
                <div className="relative aspect-[21/9] rounded-3xl overflow-hidden border border-[#e5e0d6] shadow-xl group">
                  <ImageWithFallback
                    src={pageSettings.hero.imageUrl}
                    fallbackSrc="https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80"
                    alt={isAr ? pageSettings.hero.titleAr : pageSettings.hero.titleEn}
                    fill
                    className="object-cover group-hover:scale-102 transition-transform duration-700"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ========================================================= */}
        {/* 4 Overlapping Key Media Indicators (KPIs)                 */}
        {/* ========================================================= */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 lg:-mt-12 relative z-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {pageSettings.stats.map((stat) => (
              <div
                key={stat.id}
                className="luxury-card p-5 sm:p-6 text-center flex flex-col justify-between items-center group bg-white shadow-card border border-[#e5e0d6] hover:border-[#c85a32]/40 transition-all rounded-2xl"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#faf7f2] border border-[#e5e0d6] flex items-center justify-center p-2 mb-3 shadow-2xs group-hover:scale-110 transition-transform overflow-hidden text-2xl">
                  {stat.icon}
                </div>
                <div className="text-3xl sm:text-4xl font-black text-[#08242a] mb-1 tracking-tight">
                  {isAr
                    ? (stat.valueAr || stat.value)
                    : isFr
                    ? (stat.valueFr || stat.value)
                    : (stat.valueEn || stat.value)}
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#5f7174] leading-snug">
                  {isAr ? stat.labelAr : isFr ? stat.labelFr : stat.labelEn}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* Interactive News Catalog with Search & Category Filtering */}
        {/* ========================================================= */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <NewsCatalog
            articles={displayArticles}
            locale={locale}
            readMoreLabel={dict.news.read_more}
          />
        </section>

        {/* ========================================================= */}
        {/* Press & Media Relations CTA Banner                        */}
        {/* ========================================================= */}
        <section className="py-20 bg-white border-t border-[#e5e0d6] relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0d3b43] via-[#0f4650] to-[#08242a] text-white p-8 sm:p-12 lg:p-14 shadow-card text-center space-y-6">
              <div className="absolute inset-0 moroccan-pattern-dark opacity-20 pointer-events-none" aria-hidden="true" />
              
              <div className="relative z-10 space-y-4 max-w-3xl mx-auto">
                <span className="inline-block text-3xs sm:text-2xs font-extrabold uppercase tracking-widest text-[#e5a085] px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
                  {isAr ? pageSettings.cta.badgeAr : isFr ? pageSettings.cta.badgeFr : pageSettings.cta.badgeEn}
                </span>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
                  {isAr ? pageSettings.cta.titleAr : isFr ? pageSettings.cta.titleFr : pageSettings.cta.titleEn}
                </h2>

                <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-normal">
                  {isAr ? pageSettings.cta.descAr : isFr ? pageSettings.cta.descFr : pageSettings.cta.descEn}
                </p>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href={pageSettings.cta.primaryBtnUrl || '/contact'}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl font-black text-xs text-[#08242a] bg-white hover:bg-[#faf7f2] active:scale-98 transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <span>🎙️</span>
                    <span>
                      {isAr
                        ? pageSettings.cta.primaryBtnTextAr
                        : isFr
                        ? pageSettings.cta.primaryBtnTextFr
                        : pageSettings.cta.primaryBtnTextEn}
                    </span>
                  </Link>

                  <Link
                    href={pageSettings.cta.secondaryBtnUrl || '/partnerships'}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl font-black text-xs text-white bg-white/15 hover:bg-white/25 border border-white/25 active:scale-98 transition-all flex items-center justify-center gap-2"
                  >
                    <span>🤝</span>
                    <span>
                      {isAr
                        ? pageSettings.cta.secondaryBtnTextAr
                        : isFr
                        ? pageSettings.cta.secondaryBtnTextFr
                        : pageSettings.cta.secondaryBtnTextEn}
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} dict={dict} />
    </>
  )
}

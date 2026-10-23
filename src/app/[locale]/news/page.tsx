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
  const isAr = locale === 'ar'
  const isFr = locale === 'fr'

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
      category: 'announcement',
      published_at: '2026-10-15T10:00:00Z',
      news_translations: [
        {
          title: isAr
            ? 'الإطلاق الرسمي للمنصة الرقمية لجمعية روح الفنون والثقافة (AMYCC)'
            : isFr
            ? "Lancement officiel de la plateforme numérique de l'Association AMYCC"
            : 'Official Launch of the AMYCC Digital Platform',
          excerpt: isAr
            ? 'تعلن الجمعية عن تدشين موقعها الإلكتروني التفاعلي بـ 3 لغات رسمية لتعزيز التواصل المجتمعي، وتيسير طلبات الانخراط والتطوع، ومتابعة أجندة الفعاليات الثقافية.'
            : isFr
            ? 'L\'association inaugure sa plateforme web trilingue facilitant les démarches d\'adhésion, l\'engagement bénévole et le suivi des manifestations culturelles.'
            : 'AMYCC officially launches its trilingual digital portal to foster community participation, streamline membership applications, and publish its cultural agenda.',
        },
      ],
    },
    {
      id: 'default-2',
      slug: 'youth-in-action-call',
      category: 'youth',
      published_at: '2026-10-20T14:30:00Z',
      news_translations: [
        {
          title: isAr
            ? 'فتح باب الترشيح للتطوع ضمن مبادرة "شباب في العمل" لموسم 2026'
            : isFr
            ? 'Appel à candidatures pour l\'initiative "Jeunesse en Action" 2026'
            : 'Call for Applications: Youth in Action Volunteering Program 2026',
          excerpt: isAr
            ? 'تدعو جمعية روح الفنون والثقافة كافة الطاقات الشابة والطلبة الراغبين في خوض تجربة جمعوية مميزة للتسجيل في الفوج الأول من متطوعي التنشيط الثقافي.'
            : isFr
            ? 'L\'AMYCC invite les jeunes et étudiants souhaitant s\'engager dans une aventure associative enrichissante à rejoindre la première promotion de bénévoles.'
            : 'AMYCC invites passionate young people and students to apply for the inaugural cohort of cultural event volunteers and leaders.',
        },
      ],
    },
  ]

  const displayArticles = articles.length > 0 ? articles : defaultArticles

  return (
    <>
      <Header locale={locale} dict={dict} />

      <main id="main-content" className="flex-1 bg-[#faf7f2]">
        {/* Header Banner */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#faf7f2] via-[#f7f2e9] to-[#faf7f2] border-b border-[#e5e0d6] py-16 lg:py-24 text-center">
          <div className="absolute inset-0 moroccan-pattern-light opacity-50 pointer-events-none" aria-hidden="true" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#c85a32]">
              AMYCC Press & News
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#08242a] tracking-tight">
              {dict.news.title}
            </h1>
            <p className="text-base sm:text-lg text-[#445457] max-w-2xl mx-auto font-medium">
              {isAr
                ? 'مستجدات الجمعية، البيانات الصحفية، وتغطية التظاهرات والمبادرات الثقافية.'
                : 'Official announcements, press releases, and cultural event coverage.'}
            </p>
          </div>
        </section>

        {/* News Grid */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="flex items-center justify-between mb-10 pb-4 border-b border-[#e5e0d6]">
            <div>
              <h2 className="text-xl font-black text-[#08242a]">
                {dict.news.view_all}
              </h2>
              <span className="text-3xs text-[#5f7174]">
                {isAr ? 'بيانات رسمية وتغطيات إعلامية' : 'Official releases & media coverage'}
              </span>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white border border-[#e5e0d6] text-[#08242a] shadow-2xs">
              {displayArticles.length} {isAr ? 'مقالات منشورة' : 'Articles'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displayArticles.map((art) => {
              const trans = art.news_translations?.[0] || { title: art.slug, excerpt: '' }
              const dateFormatted = art.published_at
                ? new Date(art.published_at).toLocaleDateString(locale, {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : null

              return (
                <article
                  key={art.id}
                  className="rounded-3xl border border-[#e5e0d6] bg-white p-8 shadow-subtle hover:shadow-card hover:border-[#cfc7b9] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#fae4dc] text-[#c85a32]">
                        {art.category}
                      </span>
                      {dateFormatted && (
                        <span className="text-3xs text-[#819598] font-mono">
                          📅 {dateFormatted}
                        </span>
                      )}
                    </div>

                    <h2 className="text-2xl font-black text-[#08242a] mb-3 leading-snug">
                      <Link
                        href={`/${locale}/news/${art.slug}`}
                        className="hover:text-[#c85a32] transition-colors"
                      >
                        {trans.title}
                      </Link>
                    </h2>

                    {trans.excerpt && (
                      <p className="text-xs sm:text-sm text-[#445457] leading-relaxed mb-6">
                        {trans.excerpt}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-[#f4ede2] flex items-center justify-between">
                    <Link
                      href={`/${locale}/news/${art.slug}`}
                      className="inline-flex items-center text-xs font-bold text-[#0d3b43] hover:text-[#c85a32] transition-colors"
                    >
                      <span>{dict.news.read_more}</span>
                      <span aria-hidden="true" className="ms-1">→</span>
                    </Link>

                    <span className="text-4xs text-[#819598] font-bold uppercase tracking-wider">
                      AMYCC Morocco
                    </span>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      </main>

      <Footer locale={locale} dict={dict} />
    </>
  )
}

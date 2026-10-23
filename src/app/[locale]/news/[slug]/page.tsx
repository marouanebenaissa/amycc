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
      category: 'announcement',
      published_at: '2026-10-15T10:00:00Z',
      news_translations: [
        {
          title:
            locale === 'ar'
              ? 'الإطلاق الرسمي للمنصة الرقمية لجمعية روح الفنون والثقافة (AMYCC)'
              : locale === 'fr'
              ? "Lancement officiel de la plateforme numérique de l'Association AMYCC"
              : 'Official Launch of the AMYCC Digital Platform',
          excerpt:
            locale === 'ar'
              ? 'تعلن الجمعية عن تدشين موقعها الإلكتروني التفاعلي بـ 3 لغات رسمية لتعزيز التواصل المجتمعي، وتيسير طلبات الانخراط والتطوع، ومتابعة أجندة الفعاليات الثقافية.'
              : locale === 'fr'
              ? 'L\'association inaugure sa plateforme web trilingue facilitant les démarches d\'adhésion, l\'engagement bénévole et le suivi des manifestations culturelles.'
              : 'AMYCC officially launches its trilingual digital portal to foster community participation, streamline membership applications, and publish its cultural agenda.',
          content: `<p class="mb-4">${dict.about.description}</p><p class="mb-4">${dict.hero.subtitle}</p><p>تلتزم جمعية روح الفنون والثقافة بفتح المجال أمام كافة الطاقات الشابة للمساهمة في بناء المشهد الثقافي الوطني والمشاركة في مبادرة "شباب في العمل".</p>`,
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
      <main id="main-content" className="flex-1 bg-[#faf7f2] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link
            href={`/${locale}/news`}
            className="inline-flex items-center text-xs font-bold text-[#c85a32] hover:underline mb-8"
          >
            ← {dict.news.view_all}
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#d8f0f4] text-[#0d3b43]">
              {article.category}
            </span>
            {article.published_at && (
              <time className="text-xs text-[#5f7174]">
                {new Date(article.published_at).toLocaleDateString(locale, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#08242a] leading-tight mb-6">
            {trans.title}
          </h1>

          {trans.excerpt && (
            <p className="text-base sm:text-xl text-[#445457] mb-10 leading-relaxed font-medium pb-8 border-b border-[#e5e0d6]">
              {trans.excerpt}
            </p>
          )}

          {article.cover_image && (
            <div className="mb-10 rounded-3xl overflow-hidden border border-[#e5e0d6] shadow-subtle">
              <Image
                src={article.cover_image}
                alt={trans.title}
                width={1200}
                height={600}
                className="w-full h-auto max-h-[500px] object-cover"
                unoptimized
              />
            </div>
          )}

          {/* Article Body */}
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#e5e0d6] shadow-subtle">
            <div
              className="tiptap prose prose-slate max-w-none text-[#2d3a3d] leading-relaxed text-base sm:text-lg"
              dangerouslySetInnerHTML={{ __html: trans.content }}
            />
          </div>
        </div>
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  )
}

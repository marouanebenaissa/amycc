import { getDictionary } from '@/lib/i18n/dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default async function NewsPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const dict = await getDictionary(locale)

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
          {/* Sample Initial Announcement */}
          <article className="p-8 rounded-2xl border border-slate-200/80 bg-white shadow-2xs hover:shadow-md transition-shadow">
            <span className="text-xs font-semibold text-[#0068ff] bg-blue-50 px-3 py-1 rounded-full">
              2026
            </span>
            <h2 className="text-2xl font-bold text-[#0a0f1d] mt-4 mb-2">
              {locale === 'ar'
                ? 'انطلاق أنشطة جمعية روح الفنون والثقافة'
                : locale === 'fr'
                ? 'Lancement des activités de l\'Association Esprit des Arts et de la Culture'
                : 'Official Launch of Spirit of Arts & Culture Association'}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed max-w-3xl mb-4">
              {dict.about.description}
            </p>
          </article>
        </div>
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  )
}

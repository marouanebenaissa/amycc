import { getDictionary } from '@/lib/i18n/dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'

export default async function EventsPage(props: { params: Promise<{ locale: string }> }) {
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
              {dict.events.title}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
              {dict.events.upcoming}
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="p-12 rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-[#0068ff] flex items-center justify-center text-2xl mx-auto mb-4">
              📅
            </div>
            <h2 className="text-xl font-bold text-[#0a0f1d] mb-2">{dict.events.no_events}</h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
              {dict.footer.description}
            </p>
            <Link
              href={`/${locale}/membership`}
              className="inline-flex items-center px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#0068ff] hover:bg-[#0054d1] transition-all"
            >
              {dict.membership.apply}
            </Link>
          </div>
        </div>
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  )
}

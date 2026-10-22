import { getDictionary } from '@/lib/i18n/dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'

export default async function HomePage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const dict = await getDictionary(locale)

  return (
    <>
      <Header locale={locale} dict={dict} />
      <main id="main-content" className="flex flex-col flex-1 bg-white">
        {/* Hero Section — White background, bold typography, #0068ff accents */}
        <section className="relative overflow-hidden bg-white border-b border-slate-100 py-20 lg:py-32">
          {/* Subtle background glow */}
          <div
            className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-100/60 to-slate-50/20 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#0068ff] text-xs font-semibold mb-8">
              <span className="w-2 h-2 rounded-full bg-[#0068ff] animate-pulse" />
              <span>{dict.meta.site_name}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0a0f1d] tracking-tight leading-tight mb-6">
              {dict.hero.title}
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10">
              {dict.hero.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={`/${locale}/programs`}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white bg-[#0068ff] hover:bg-[#0054d1] transition-all shadow-md hover:shadow-lg shadow-blue-500/20"
              >
                {dict.hero.cta_primary}
              </Link>
              <Link
                href={`/${locale}/membership`}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all"
              >
                {dict.hero.cta_secondary}
              </Link>
            </div>
          </div>
        </section>

        {/* About Section — Modern White & Blue accented cards */}
        <section id="about" className="py-20 lg:py-28 bg-slate-50/60 border-b border-slate-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0068ff]">
                AMYCC
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a0f1d] mt-2 mb-4">
                {dict.about.title}
              </h2>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                {dict.about.description}
              </p>
            </div>

            {/* Mission, Vision, Values 3-Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Mission */}
              <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0068ff] flex items-center justify-center font-bold text-xl mb-5">
                  ✦
                </div>
                <h3 className="text-xl font-bold text-[#0a0f1d] mb-3">
                  {dict.about.mission_title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {dict.about.description}
                </p>
              </div>

              {/* Vision */}
              <div className="bg-white p-8 rounded-2xl border border-blue-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="absolute top-0 end-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-0" />
                <div className="w-12 h-12 rounded-xl bg-[#0068ff] text-white flex items-center justify-center font-bold text-xl mb-5 relative z-10">
                  ★
                </div>
                <h3 className="text-xl font-bold text-[#0a0f1d] mb-3 relative z-10">
                  {dict.about.vision_title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed relative z-10">
                  {dict.hero.subtitle}
                </p>
              </div>

              {/* Values */}
              <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0068ff] flex items-center justify-center font-bold text-xl mb-5">
                  ♥
                </div>
                <h3 className="text-xl font-bold text-[#0a0f1d] mb-3">
                  {dict.about.values_title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {dict.footer.description}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Bar */}
        <section className="py-16 bg-[#0068ff] text-white text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">
              {dict.volunteer.initiative}
            </h2>
            <p className="text-blue-100 max-w-xl mx-auto mb-8 text-sm sm:text-base">
              {dict.volunteer.subtitle}
            </p>
            <Link
              href={`/${locale}/volunteer`}
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-bold bg-white text-[#0068ff] hover:bg-blue-50 transition-all shadow-md"
            >
              {dict.volunteer.apply}
            </Link>
          </div>
        </section>
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  )
}

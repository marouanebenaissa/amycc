import { getDictionary } from '@/lib/i18n/dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default async function AboutPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const dict = await getDictionary(locale)

  return (
    <>
      <Header locale={locale} dict={dict} />
      <main id="main-content" className="flex-1 bg-white">
        {/* Page Header */}
        <div className="bg-slate-50 border-b border-slate-100 py-16 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0068ff]">AMYCC</span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0a0f1d] mt-2 mb-4">
              {dict.about.title}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
              {dict.about.description}
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-5xl mx-auto px-4 py-16 space-y-16">
          {/* Organization Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-xs font-semibold text-slate-400">Foundation Year</span>
              <p className="text-2xl font-bold text-[#0068ff] mt-1">2026</p>
              <p className="text-sm text-slate-600 mt-2">
                Nonprofit cultural association established in Morocco.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-xs font-semibold text-slate-400">Location</span>
              <p className="text-2xl font-bold text-[#0a0f1d] mt-1">Morocco</p>
              <p className="text-sm text-slate-600 mt-2">
                Developing activities across Moroccan cities and partnering internationally.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-xs font-semibold text-slate-400">Key Focus</span>
              <p className="text-2xl font-bold text-[#0068ff] mt-1">Arts & Youth</p>
              <p className="text-sm text-slate-600 mt-2">
                Culture, performing arts, theatre, music, and community volunteering.
              </p>
            </div>
          </div>

          {/* Mission, Vision, Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-slate-100 p-8 rounded-2xl bg-slate-50/50">
              <h2 className="text-xl font-bold text-[#0a0f1d] mb-3">{dict.about.mission_title}</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {dict.about.description}
              </p>
            </div>
            <div className="border border-blue-100 p-8 rounded-2xl bg-blue-50/30">
              <h2 className="text-xl font-bold text-[#0a0f1d] mb-3">{dict.about.vision_title}</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {dict.hero.subtitle}
              </p>
            </div>
            <div className="border border-slate-100 p-8 rounded-2xl bg-slate-50/50">
              <h2 className="text-xl font-bold text-[#0a0f1d] mb-3">{dict.about.values_title}</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {dict.footer.description}
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  )
}

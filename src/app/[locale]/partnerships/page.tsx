import { getDictionary } from '@/lib/i18n/dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PartnershipForm } from '@/components/forms/PartnershipForm'

export default async function PartnershipsPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const dict = await getDictionary(locale)
  const isAr = locale === 'ar'

  return (
    <>
      <Header locale={locale} dict={dict} />

      <main id="main-content" className="flex-1 bg-[#faf7f2]">
        {/* Header Banner */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#faf7f2] via-[#f7f2e9] to-[#faf7f2] border-b border-[#e5e0d6] py-16 lg:py-24 text-center">
          <div className="absolute inset-0 moroccan-pattern-light opacity-50 pointer-events-none" aria-hidden="true" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#c85a32]">
              AMYCC Partnerships
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#08242a] tracking-tight">
              {dict.partnerships.title}
            </h1>
            <p className="text-base sm:text-lg text-[#445457] max-w-2xl mx-auto font-medium">
              {dict.partnerships.subtitle} — {dict.home.partners_desc}
            </p>
          </div>
        </section>

        {/* Partnership Tiers */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-5 rounded-2xl bg-white border border-[#e5e0d6] shadow-2xs">
              <span className="text-2xl mb-1 block">🏛️</span>
              <span className="text-xs font-bold text-[#08242a] block">
                {isAr ? 'المراكز الثقافية' : 'Cultural Centers'}
              </span>
              <span className="text-4xs text-[#819598] font-medium">
                {isAr ? 'برمجة مشتركة' : 'Joint curation'}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#e5e0d6] shadow-2xs">
              <span className="text-2xl mb-1 block">🎓</span>
              <span className="text-xs font-bold text-[#08242a] block">
                {isAr ? 'المؤسسات التعليمية' : 'Educational Institutes'}
              </span>
              <span className="text-4xs text-[#819598] font-medium">
                {isAr ? 'مدارس وجامعات' : 'Schools & Unis'}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#e5e0d6] shadow-2xs">
              <span className="text-2xl mb-1 block">🤝</span>
              <span className="text-xs font-bold text-[#08242a] block">
                {isAr ? 'المجتمع المدني' : 'Civil Society'}
              </span>
              <span className="text-4xs text-[#819598] font-medium">
                {isAr ? 'جمعيات صديقة' : 'NGOs & Alliances'}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#e5e0d6] shadow-2xs">
              <span className="text-2xl mb-1 block">🏢</span>
              <span className="text-xs font-bold text-[#08242a] block">
                {isAr ? 'القطاع الخاص' : 'Private Sector'}
              </span>
              <span className="text-4xs text-[#819598] font-medium">
                {isAr ? 'رعاية ثقافية' : 'Sponsorship'}
              </span>
            </div>
          </div>
        </section>

        {/* Partnership Proposal Form */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          <PartnershipForm locale={locale} />
        </section>
      </main>

      <Footer locale={locale} dict={dict} />
    </>
  )
}

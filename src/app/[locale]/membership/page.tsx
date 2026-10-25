import { getDictionary } from '@/lib/i18n/dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MembershipForm } from '@/components/forms/MembershipForm'

export default async function MembershipPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const dict = await getDictionary(locale)
  const isAr = locale === 'ar'
  const isFr = locale === 'fr'

  return (
    <>
      <Header locale={locale} dict={dict} />

      <main id="main-content" className="flex-1 bg-[#faf7f2]">
        {/* Header Banner */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#faf7f2] via-[#f7f2e9] to-[#faf7f2] border-b border-[#e5e0d6] py-16 lg:py-24 text-center">
          <div className="absolute inset-0 moroccan-pattern-light opacity-50 pointer-events-none" aria-hidden="true" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#c85a32]">
              AMYCC Membership
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#08242a] tracking-tight">
              {dict.membership.title}
            </h1>
            <p className="text-base sm:text-lg text-[#445457] max-w-2xl mx-auto font-medium">
              {dict.membership.subtitle}
            </p>
          </div>
        </section>

        {/* Membership Application Process (3 Steps) */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-5 rounded-2xl bg-white border border-[#e5e0d6] shadow-2xs">
              <span className="w-8 h-8 rounded-full bg-[#0d3b43] text-white flex items-center justify-center font-bold text-xs mx-auto mb-2">1</span>
              <span className="text-xs font-bold text-[#08242a] block">
                {isAr ? 'تعبئة الاستمارة' : isFr ? 'Remplir le Formulaire' : 'Fill Form'}
              </span>
              <span className="text-3xs text-[#5f7174]">
                {isAr ? 'إدخال البيانات والمجالات' : isFr ? 'Saisie des coordonnées & centres d’intérêt' : 'Provide your details & interests'}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#e5e0d6] shadow-2xs">
              <span className="w-8 h-8 rounded-full bg-[#c85a32] text-white flex items-center justify-center font-bold text-xs mx-auto mb-2">2</span>
              <span className="text-xs font-bold text-[#08242a] block">
                {isAr ? 'مراجعة مكتب الجمعية' : isFr ? 'Examen par le Bureau' : 'Board Review'}
              </span>
              <span className="text-3xs text-[#5f7174]">
                {isAr ? 'المطابقة مع النظام الأساسي' : isFr ? 'Conformité avec les statuts' : 'Review as per association bylaws'}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#e5e0d6] shadow-2xs">
              <span className="w-8 h-8 rounded-full bg-[#d99b26] text-white flex items-center justify-center font-bold text-xs mx-auto mb-2">3</span>
              <span className="text-xs font-bold text-[#08242a] block">
                {isAr ? 'تأكيد العضوية' : isFr ? 'Validation de l’Adhésion' : 'Confirmation'}
              </span>
              <span className="text-3xs text-[#5f7174]">
                {isAr ? 'تسليم بطاقة الانخراط السنوي' : isFr ? 'Délivrance de la carte d’adhérent' : 'Issuance of membership confirmation'}
              </span>
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          <MembershipForm locale={locale} />
        </section>
      </main>

      <Footer locale={locale} dict={dict} />
    </>
  )
}

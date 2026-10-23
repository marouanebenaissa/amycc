import { getDictionary } from '@/lib/i18n/dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { VolunteerForm } from '@/components/forms/VolunteerForm'

export default async function VolunteerPage(props: { params: Promise<{ locale: string }> }) {
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
            <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-[#14505b] text-[#f4ce83] border border-[#268292]/40">
              {dict.volunteer.initiative}
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#08242a] tracking-tight">
              {dict.volunteer.title}
            </h1>
            <p className="text-base sm:text-lg text-[#445457] max-w-2xl mx-auto font-medium">
              {dict.home.youth_desc}
            </p>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-5 rounded-2xl bg-white border border-[#e5e0d6] shadow-2xs">
              <span className="text-2xl mb-1 block">🎓</span>
              <span className="text-xs font-bold text-[#08242a] block">
                {isAr ? 'تأطير وتكوين مستمر' : 'Mentorship & Training'}
              </span>
              <span className="text-3xs text-[#5f7174]">
                {isAr ? 'صقل المهارات القيادية والفنية' : 'Leadership & artistic skills'}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#e5e0d6] shadow-2xs">
              <span className="text-2xl mb-1 block">🎭</span>
              <span className="text-xs font-bold text-[#08242a] block">
                {isAr ? 'مشاركة ميدانية فاعلة' : 'Field Experience'}
              </span>
              <span className="text-3xs text-[#5f7174]">
                {isAr ? 'تنظيم المعارض والعروض والورش' : 'Organizing events & festivals'}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#e5e0d6] shadow-2xs">
              <span className="text-2xl mb-1 block">📜</span>
              <span className="text-xs font-bold text-[#08242a] block">
                {isAr ? 'شهادة تطوع معتمدة' : 'Official Certificate'}
              </span>
              <span className="text-3xs text-[#5f7174]">
                {isAr ? 'توثيق الساعات والتجربة الجمعوية' : 'Documenting civic volunteer hours'}
              </span>
            </div>
          </div>
        </section>

        {/* Volunteer Application Form */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          <VolunteerForm locale={locale} />
        </section>
      </main>

      <Footer locale={locale} dict={dict} />
    </>
  )
}

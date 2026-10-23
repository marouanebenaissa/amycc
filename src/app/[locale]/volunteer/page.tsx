import { getDictionary } from '@/lib/i18n/dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { VolunteerForm } from '@/components/forms/VolunteerForm'

export default async function VolunteerPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const dict = await getDictionary(locale)

  return (
    <>
      <Header locale={locale} dict={dict} />
      <main id="main-content" className="flex-1 bg-slate-50/60 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center mb-10">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100/70 text-[#0068ff] mb-3">
            {dict.volunteer.initiative}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0a0f1d] mb-4">
            {dict.volunteer.title}
          </h1>
          <p className="text-base text-slate-600 max-w-xl mx-auto">
            {dict.volunteer.subtitle}
          </p>
        </div>

        <div className="max-w-4xl mx-auto px-4">
          <VolunteerForm locale={locale} />
        </div>
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  )
}

import { getDictionary } from '@/lib/i18n/dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MembershipForm } from '@/components/forms/MembershipForm'

export default async function MembershipPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const dict = await getDictionary(locale)

  return (
    <>
      <Header locale={locale} dict={dict} />
      <main id="main-content" className="flex-1 bg-slate-50/60 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0068ff]">AMYCC</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0a0f1d] mt-2 mb-4">
            {dict.membership.title}
          </h1>
          <p className="text-base text-slate-600">
            {dict.membership.subtitle}
          </p>
        </div>

        <div className="max-w-4xl mx-auto px-4">
          <MembershipForm locale={locale} />
        </div>
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  )
}

import { getDictionary } from '@/lib/i18n/dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ContactForm } from '@/components/forms/ContactForm'

export default async function ContactPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const dict = await getDictionary(locale)

  return (
    <>
      <Header locale={locale} dict={dict} />
      <main id="main-content" className="flex-1 bg-slate-50/60 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0068ff]">AMYCC</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0a0f1d] mt-2 mb-4">
            {dict.contact.title}
          </h1>
          <p className="text-base text-slate-600">
            {dict.about.description}
          </p>
        </div>

        <div className="max-w-3xl mx-auto px-4">
          <ContactForm locale={locale} />
        </div>
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  )
}

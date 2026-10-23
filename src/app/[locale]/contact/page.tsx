import { getDictionary } from '@/lib/i18n/dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ContactForm } from '@/components/forms/ContactForm'

export default async function ContactPage(props: { params: Promise<{ locale: string }> }) {
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
              AMYCC Contact
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#08242a] tracking-tight">
              {dict.contact.title}
            </h1>
            <p className="text-base sm:text-lg text-[#445457] max-w-2xl mx-auto font-medium">
              {isAr
                ? 'يسعدنا التواصل معكم للإجابة عن استفساراتكم ومناقشة مقترحاتكم الثقافية والفنية.'
                : 'We are delighted to connect with you regarding our cultural activities and inquiries.'}
            </p>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="p-6 rounded-3xl bg-white border border-[#e5e0d6] shadow-subtle">
              <span className="text-2xl mb-2 block">✉️</span>
              <span className="text-xs font-bold text-[#08242a] block">
                {isAr ? 'البريد الإلكتروني الرسمي' : 'Official Email'}
              </span>
              <a
                href="mailto:contact@amycc.org"
                className="text-xs font-mono font-bold text-[#c85a32] hover:underline mt-1 block"
              >
                contact@amycc.org
              </a>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#e5e0d6] shadow-subtle">
              <span className="text-2xl mb-2 block">📍</span>
              <span className="text-xs font-bold text-[#08242a] block">
                {isAr ? 'المقر والنطاق' : 'Headquarters & Scope'}
              </span>
              <span className="text-xs text-[#5f7174] font-medium mt-1 block">
                {isAr ? 'المملكة المغربية • مختلف الجهات' : 'Kingdom of Morocco • Nationwide'}
              </span>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#e5e0d6] shadow-subtle">
              <span className="text-2xl mb-2 block">🌐</span>
              <span className="text-xs font-bold text-[#08242a] block">
                {isAr ? 'التواصل الاجتماعي' : 'Social Channels'}
              </span>
              <span className="text-xs font-bold text-[#0d3b43] mt-1 block">
                @amycc.morocco
              </span>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          <ContactForm locale={locale} />
        </section>
      </main>

      <Footer locale={locale} dict={dict} />
    </>
  )
}

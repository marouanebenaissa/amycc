import { getDictionary } from '@/lib/i18n/dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default async function PrivacyPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const dict = await getDictionary(locale)

  const isAr = locale === 'ar'

  return (
    <>
      <Header locale={locale} dict={dict} />
      <main id="main-content" className="flex-1 bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 prose prose-slate">
          <div className="mb-10 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0068ff]">AMYCC</span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0a0f1d] mt-2 mb-4">
              {dict.footer.privacy}
            </h1>
            <p className="text-sm text-slate-500">
              {isAr ? 'آخر تحديث: 2026' : 'Last updated: 2026'}
            </p>
          </div>

          <div className="space-y-8 text-sm leading-relaxed text-slate-700">
            <section className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
              <h2 className="text-lg font-bold text-[#0a0f1d] mb-2">
                {isAr ? '1. الإطار العام وحماية المعطيات' : '1. General Framework & Data Protection'}
              </h2>
              <p>
                {isAr
                  ? 'تلتزم جمعية روح الفنون والثقافة (AMYCC) بحماية المعطيات ذات الطابع الشخصي لمستخدمي منصتها ومنخرطيها والمتطوعين، وفقاً لمقتضيات القانون المغربي رقم 09-08 المتعلق بحماية الأشخاص الذاتيين تجاه معالجة المعطيات ذات الطابع الشخصي، ومساطر اللجنة الوطنية لمراقبة حماية المعطيات ذات الطابع الشخصي (CNDP).'
                  : 'The Spirit of Arts & Culture Association (AMYCC) is committed to protecting the personal data of its platform users, members, and volunteers in accordance with Moroccan Law No. 09-08 relating to the protection of individuals with regard to the processing of personal data.'}
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#0a0f1d]">
                {isAr ? '2. المعطيات التي يتم جمعها' : '2. Data Collected'}
              </h2>
              <p>
                {isAr
                  ? 'يقتصر جمع المعطيات على المعلومات الضرورية لمعالجة طلبات الانخراط، والتطوع في مبادرة "شباب في العمل"، والاستفسارات حول الشراكات والدعم، وتأكيد التسجيل في الفعاليات الثقافية.'
                  : 'Data collection is limited to information necessary to process membership applications, volunteering in the Youth in Action initiative, partnership inquiries, and cultural event registrations.'}
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#0a0f1d]">
                {isAr ? '3. حقوق المعنيين بالأمر' : '3. Your Rights'}
              </h2>
              <p>
                {isAr
                  ? 'يحق لكل شخص معني ممارسة حقوقه في الولوج، والتصحيح، والتعرض وفقاً لمقتضيات القانون 09-08 عبر التواصل مع الجمعية من خلال البريد الرسمي المعتمد.'
                  : 'Any concerned individual may exercise their rights of access, rectification, and opposition in accordance with Law 09-08 by contacting the association.'}
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  )
}

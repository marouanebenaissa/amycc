import { getDictionary } from '@/lib/i18n/dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SupportForm } from '@/components/forms/SupportForm'

export default async function SupportPage(props: { params: Promise<{ locale: string }> }) {
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
              AMYCC Support & Patronage
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#08242a] tracking-tight">
              {dict.support.title}
            </h1>
            <p className="text-base sm:text-lg text-[#445457] max-w-2xl mx-auto font-medium">
              {dict.support.subtitle}
            </p>
          </div>
        </section>

        {/* Support Opportunities Information */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-[#e5e0d6] shadow-subtle text-center">
              <span className="text-3xl mb-3 block">💝</span>
              <h3 className="text-base font-bold text-[#08242a] mb-1">
                {isAr ? 'الدعم المالي والمساهمات' : 'Financial Contributions'}
              </h3>
              <p className="text-xs text-[#5f7174] leading-relaxed">
                {isAr
                  ? 'تمويل الأنشطة والورش المجانية لفائدة الشباب والناشئة بالمناطق المستهدفة.'
                  : 'Funding free artistic workshops and educational initiatives for youth.'}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#e5e0d6] shadow-subtle text-center">
              <span className="text-3xl mb-3 block">🎨</span>
              <h3 className="text-base font-bold text-[#08242a] mb-1">
                {isAr ? 'المساهمات العينية والمعدات' : 'Equipment & In-Kind'}
              </h3>
              <p className="text-xs text-[#5f7174] leading-relaxed">
                {isAr
                  ? 'توفير التجهيزات الصوتية، المواد التشكيلية، الأدوات المسرحية، والمكتبات الفنية.'
                  : 'Donating sound gear, visual art materials, costumes, or cultural books.'}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#e5e0d6] shadow-subtle text-center">
              <span className="text-3xl mb-3 block">🏛️</span>
              <h3 className="text-base font-bold text-[#08242a] mb-1">
                {isAr ? 'استضافة الفعاليات والفضاءات' : 'Venues & Hosting'}
              </h3>
              <p className="text-xs text-[#5f7174] leading-relaxed">
                {isAr
                  ? 'احتضان الورشات والمعارض والعروض المسرحية في قاعات المراكز والمؤسسات الشريكة.'
                  : 'Hosting theatrical plays and exhibitions in partner cultural spaces.'}
              </p>
            </div>
          </div>

          {/* Legal Transparency Note regarding Payment Gateways */}
          <div className="mt-8 p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 leading-relaxed">
            <div className="flex items-start gap-2.5">
              <span className="text-lg">ℹ️</span>
              <div>
                <strong className="block font-bold">
                  {isAr ? 'إشعار الشفافية المالية وفقاً للقانون المغربي:' : 'Financial Transparency Note:'}
                </strong>
                <span>
                  {isAr
                    ? 'جمعية روح الفنون والثقافة هي جمعية مدنية غير ربحية. المنصة لا تقوم بخصم مدفوعات إلكترونية مباشرة عبر البطاقات البنكية دون توثيق مسبق. جميع المساهمات تتم عبر التحويل البنكي المعتمد لحساب الجمعية الرسمي مع تسليم وصولات إبراء قانونية.'
                    : 'AMYCC is a registered non-profit. We do not store card details online. All institutional and individual contributions are processed via official bank transfer with formal receipts.'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Support Form */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          <SupportForm locale={locale} />
        </section>
      </main>

      <Footer locale={locale} dict={dict} />
    </>
  )
}

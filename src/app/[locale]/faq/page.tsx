import { getDictionary } from '@/lib/i18n/dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getTopBarSettings, getFaqSettings } from '@/lib/settings'

const CATEGORY_NAMES: Record<string, { ar: string; fr: string; en: string }> = {
  general: { ar: 'معلومات عامة', fr: 'Général', en: 'General' },
  membership: { ar: 'العضوية والانخراط', fr: 'Adhésion', en: 'Membership' },
  volunteering: { ar: 'التطوع — شباب في العمل', fr: 'Bénévolat', en: 'Volunteering' },
  partnerships: { ar: 'الشراكات المؤسسية', fr: 'Partenariats', en: 'Partnerships' },
  events: { ar: 'الفعاليات والأنشطة', fr: 'Événements', en: 'Events' },
}

export default async function FAQPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const dict = await getDictionary(locale)
  const topBar = await getTopBarSettings()
  const faqSettings = await getFaqSettings()

  const isAr = locale === 'ar'
  const isFr = locale === 'fr'

  const activeFaqs = faqSettings.items.filter((item) => item.published !== false)

  const faqs = activeFaqs.map((item) => ({
    id: item.id,
    q: isAr
      ? item.questionAr
      : isFr
      ? (item.questionFr || item.questionAr)
      : (item.questionEn || item.questionAr),
    a: isAr
      ? item.answerAr
      : isFr
      ? (item.answerFr || item.answerAr)
      : (item.answerEn || item.answerAr),
    category: item.category,
    categoryLabel:
      CATEGORY_NAMES[item.category]?.[isAr ? 'ar' : isFr ? 'fr' : 'en'] ||
      (isAr ? 'عامة' : isFr ? 'Général' : 'General'),
  }))

  return (
    <>
      <Header locale={locale} dict={dict} topBar={topBar} />
      <main id="main-content" className="flex-1 bg-[#FAF8F5] py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#bd3227]">AMYCC Morocco</span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#231f20] mt-2 mb-4">
              {isAr ? 'الأسئلة الشائعة' : isFr ? 'Foire Aux Questions' : 'Frequently Asked Questions'}
            </h1>
            <p className="text-base text-slate-600 max-w-2xl mx-auto">
              {isAr
                ? 'إجابات شاملة ومحدثة على أبرز الاستفسارات حول الجمعية، كيفية الانخراط، التطوع، وشراكات العمل الثقافي.'
                : isFr
                ? 'Réponses complètes à vos questions sur l\'adhésion, le bénévolat et nos projets culturels.'
                : 'Clear, up-to-date answers on membership, volunteering, and cultural partnerships.'}
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <details
                key={faq.id || idx}
                className="group p-6 rounded-2xl bg-white border border-[#e5e0d6] open:border-[#231f20]/30 open:shadow-subtle transition-all"
              >
                <summary className="font-bold text-base text-[#231f20] cursor-pointer flex items-center justify-between list-none">
                  <span className="flex items-center gap-3">
                    <span className="px-2.5 py-0.5 rounded-full text-4xs font-bold bg-[#FAF8F5] border border-[#e5e0d6] text-[#231f20]">
                      {faq.categoryLabel}
                    </span>
                    <span>{faq.q}</span>
                  </span>
                  <span className="text-[#231f20] transition-transform group-open:rotate-180 shrink-0 ms-3">▼</span>
                </summary>
                <p className="mt-4 text-sm text-[#5C5A55] leading-relaxed border-t border-[#E5E0D6] pt-4 whitespace-pre-line">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  )
}

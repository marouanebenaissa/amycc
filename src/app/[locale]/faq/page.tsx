import { getDictionary } from '@/lib/i18n/dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default async function FAQPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const dict = await getDictionary(locale)

  const isAr = locale === 'ar'

  const faqs = isAr
    ? [
        {
          q: 'ما هي جمعية روح الفنون والثقافة (AMYCC)؟',
          a: 'جمعية غير ربحية مغربية تأسست عام 2026، تعمل في مجالات الفنون، الموسيقى، المسرح، التراث الثقافي، وتمكين الشباب من خلال المبادرات المجتمعية.'
        },
        {
          q: 'كيف يمكنني الانضمام كعضو في الجمعية؟',
          a: 'يمكنك ملء استمارة العضوية عبر الموقع الرسمي، وسيتم مراجعة طلبك من قبل لجنة العضوية وفقاً للنظام الأساسي للجمعية.'
        },
        {
          q: 'ما هي مبادرة "شباب في العمل"؟',
          a: 'هي برنامج تطوعي ومجتمعي أطلقته الجمعية لتمكين الشباب من المساهمة الفعالة في تنظيم التظاهرات الثقافية وصقل مهاراتهم القيادية.'
        },
        {
          q: 'هل تقدم الجمعية شراكات مع المؤسسات والمدارس؟',
          a: 'نعم، ترحب الجمعية بالشراكات مع المؤسسات التعليمية، والمراكز الثقافية، والجمعيات الصديقة، والفاعلين الاقتصاديين عبر استمارة الشراكات المتاحة بالموقع.'
        }
      ]
    : [
        {
          q: 'What is the Spirit of Arts & Culture Association (AMYCC)?',
          a: 'A Moroccan nonprofit founded in 2026 dedicated to promoting arts, music, performing arts, cultural heritage, and youth empowerment.'
        },
        {
          q: 'How can I become an active member?',
          a: 'You can submit your application via our online membership form. All applications are reviewed by the membership committee in accordance with association bylaws.'
        },
        {
          q: 'What is the "Youth in Action" initiative?',
          a: 'It is a flagship community and volunteering initiative empowering youth to actively participate in and lead cultural projects.'
        },
        {
          q: 'How can institutions partner with AMYCC?',
          a: 'Institutions, cultural centers, and schools can submit a collaboration proposal directly through our dedicated partnerships portal.'
        }
      ]

  return (
    <>
      <Header locale={locale} dict={dict} />
      <main id="main-content" className="flex-1 bg-[#faf7f2] py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#c85a32]">AMYCC Morocco</span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#08242a] mt-2 mb-4">
              {isAr ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
            </h1>
            <p className="text-base text-slate-600">
              {isAr ? 'إجابات على أبرز الاستفسارات حول أنشطة الجمعية ومبادراتها' : 'Answers to common questions regarding our association and initiatives.'}
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group p-6 rounded-2xl bg-white border border-[#e5e0d6] open:border-[#0d3b43]/30 open:shadow-subtle transition-all"
              >
                <summary className="font-bold text-base text-[#08242a] cursor-pointer flex items-center justify-between list-none">
                  <span>{faq.q}</span>
                  <span className="text-[#0d3b43] transition-transform group-open:rotate-180">▼</span>
                </summary>
                <p className="mt-4 text-sm text-[#445457] leading-relaxed border-t border-[#f4ede2] pt-3">
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

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

      <main id="main-content" className="flex-1 bg-[#faf7f2]">
        {/* Header Banner */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#faf7f2] via-[#f7f2e9] to-[#faf7f2] border-b border-[#e5e0d6] py-16 lg:py-24 text-center">
          <div className="absolute inset-0 moroccan-pattern-light opacity-50 pointer-events-none" aria-hidden="true" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#c85a32]">
              AMYCC Legal & Privacy
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#08242a] tracking-tight">
              {dict.footer.privacy}
            </h1>
            <p className="text-xs sm:text-sm text-[#5f7174]">
              {isAr ? 'حماية المعطيات ذات الطابع الشخصي — القانون المغربي رقم 09-08' : 'Personal Data Protection — Moroccan Law No. 09-08'}
            </p>
          </div>
        </section>

        {/* Content Body */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#e5e0d6] shadow-subtle space-y-8 text-xs sm:text-sm leading-relaxed text-[#445457]">
            <section className="p-6 rounded-2xl bg-[#faf7f2] border border-[#e5e0d6]">
              <h2 className="text-base font-bold text-[#08242a] mb-2">
                {isAr ? '1. الإطار القانوني وحماية المعطيات بالمغرب' : '1. Legal Framework & CNDP Compliance'}
              </h2>
              <p>
                {isAr
                  ? 'تلتزم جمعية روح الفنون والثقافة (AMYCC)، وهي جمعية غير ربحية تأسست سنة 2026 بالمغرب، بحماية المعطيات ذات الطابع الشخصي لكافة المنخرطين والمتطوعين وزوار المنصة الرقمية، وذلك تماشياً مع مقتضيات القانون رقم 09-08 الصادر بالظهير الشريف رقم 1.09.15 المتعلق بحماية الأشخاص الذاتيين تجاه معالجة المعطيات ذات الطابع الشخصي ومساطر اللجنة الوطنية لمراقبة حماية المعطيات ذات الطابع الشخصي (CNDP).'
                  : 'The Spirit of Arts & Culture Association (AMYCC), a non-profit association founded in 2026 in Morocco, is committed to safeguarding personal data in compliance with Moroccan Law No. 09-08 on the protection of individuals with regard to the processing of personal data.'}
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-[#08242a]">
                {isAr ? '2. طبيعة المعطيات التي يتم جمعها' : '2. Purpose and Categories of Collected Data'}
              </h2>
              <p>
                {isAr
                  ? 'يقتصر جمع المعطيات حصراً على المعلومات الضرورية لإتمام العمليات التي يطلبها المستخدم بمحض إرادته، وتشمل: طلبات الانخراط والعضوية السنوية، استمارات التطوع ضمن مبادرة "شباب في العمل"، تسجيلات حضور الفعاليات الثقافية لضبط الطاقة الاستيعابية، ورسائل التواصل والاستفسارات المؤسساتية.'
                  : 'Data collection is strictly limited to information necessary to fulfill user requests, including: annual membership applications, Youth in Action volunteer registrations, event seat bookings, and institutional partnership inquiries.'}
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-[#08242a]">
                {isAr ? '3. سياسة عدم البيع والسرية' : '3. Confidentiality & Non-Disclosure'}
              </h2>
              <p>
                {isAr
                  ? 'لا تقوم الجمعية إطلاقاً ببيع أو تأجير أو مشاركة المعطيات الشخصية للمستخدمين مع أي أطراف تجارية ثالثة. يتم استخدام المعطيات حصرياً لأغراض التسيير الجمعوي الداخلي، وتوجيه الإشعارات بالفعاليات والأنشطة الثقافية.'
                  : 'AMYCC does not sell, rent, or commercialize personal data to third parties. Data is used exclusively for internal association management and official cultural communications.'}
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-[#08242a]">
                {isAr ? '4. حقوق المستخدم (الولوج، التصحيح، والحذف)' : '4. User Rights: Access, Rectification & Erasure'}
              </h2>
              <p>
                {isAr
                  ? 'تطبيقاً لأحكام القانون 09-08، يحق لكل مستخدم ممارسة حقه في الاطلاع على معطياته، أو طلب تصحيحها، أو تحيينها، أو حذفها نهائياً من سجلات الجمعية عبر توجيه رسالة رسمية إلى البريد الإلكتروني: contact@amycc.org.'
                  : 'Pursuant to Law 09-08, users may exercise their rights of access, correction, and deletion at any time by contacting our data protection officer at: info@amycc.org.'}
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-[#08242a]">
                {isAr ? '5. تدابير الحماية التقنية' : '5. Technical Security Measures'}
              </h2>
              <p>
                {isAr
                  ? 'تطبق المنصة أعلى معايير الحماية التقنية، بما يشمل التشفير الآمن لنقل البيانات عبر بروتوكول HTTPS/TLS، وعزل قواعد البيانات بسياسات الأمان على مستوى الصفوف (Row Level Security)، وتوثيق الجلسات الإدارية، وسجل تدقيق العمليات (Audit Trail) لمنع أي وصول غير مصرح به.'
                  : 'We enforce stringent technical protections including full HTTPS/TLS transit encryption, PostgreSQL Row Level Security (RLS) isolation, authenticated admin sessions, and immutable audit trails.'}
              </p>
            </section>
          </div>
        </section>
      </main>

      <Footer locale={locale} dict={dict} />
    </>
  )
}

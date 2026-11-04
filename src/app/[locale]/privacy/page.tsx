import { getDictionary } from '@/lib/i18n/dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default async function PrivacyPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const dict = await getDictionary(locale)
  const isAr = locale === 'ar'
  const isFr = locale === 'fr'

  return (
    <>
      <Header locale={locale} dict={dict} />

      <main id="main-content" className="flex-1 bg-[#FAF8F5]">
        {/* Header Banner */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#F5F3EE] via-[#F5F3EE] to-[#F5F3EE] border-b border-[#e5e0d6] py-16 lg:py-24 text-center">
          <div className="absolute inset-0 moroccan-pattern-light opacity-50 pointer-events-none" aria-hidden="true" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#bd3227]">
              AMYCC Legal & Privacy
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#231f20] tracking-tight">
              {dict.footer.privacy}
            </h1>
            <p className="text-xs sm:text-sm text-[#5C5A55]">
              {isAr
                ? 'حماية المعطيات ذات الطابع الشخصي — القانون المغربي رقم 09-08'
                : isFr
                ? 'Protection des Données à Caractère Personnel — Loi marocaine n° 09-08'
                : 'Personal Data Protection — Moroccan Law No. 09-08'}
            </p>
          </div>
        </section>

        {/* Content Body */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#e5e0d6] shadow-subtle space-y-8 text-xs sm:text-sm leading-relaxed text-[#5C5A55]">
            <section className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#e5e0d6]">
              <h2 className="text-base font-bold text-[#231f20] mb-2">
                {isAr ? '1. الإطار القانوني وحماية المعطيات بالمغرب' : isFr ? '1. Cadre Légal & Conformité CNDP' : '1. Legal Framework & CNDP Compliance'}
              </h2>
              <p>
                {isAr
                  ? 'تلتزم جمعية روح الفنون والثقافة (AMYCC)، وهي جمعية غير ربحية تأسست سنة 2026 بالمغرب، بحماية المعطيات ذات الطابع الشخصي لكافة المنخرطين والمتطوعين وزوار المنصة الرقمية، وذلك تماشياً مع مقتضيات القانون رقم 09-08 الصادر بالظهير الشريف رقم 1.09.15 المتعلق بحماية الأشخاص الذاتيين تجاه معالجة المعطيات ذات الطابع الشخصي ومساطر اللجنة الوطنية لمراقبة حماية المعطيات ذات الطابع الشخصي (CNDP).'
                  : isFr
                  ? 'L’Association Marocaine des Jeunes, Culture & Créativité (AMYCC), association à but non lucratif fondée en 2026 au Maroc, s’engage à protéger les données à caractère personnel conformément aux dispositions de la loi n° 09-08 promulguée par le Dahir n° 1-09-15 relative à la protection des personnes physiques à l’égard du traitement des données à caractère personnel et aux délibérations de la CNDP.'
                  : 'The Spirit of Arts & Culture Association (AMYCC), a non-profit association founded in 2026 in Morocco, is committed to safeguarding personal data in compliance with Moroccan Law No. 09-08 on the protection of individuals with regard to the processing of personal data.'}
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-[#231f20]">
                {isAr ? '2. طبيعة المعطيات التي يتم جمعها' : isFr ? '2. Nature des Données Collectées & Finalités' : '2. Purpose and Categories of Collected Data'}
              </h2>
              <p>
                {isAr
                  ? 'يقتصر جمع المعطيات حصراً على المعلومات الضرورية لإتمام العمليات التي يطلبها المستخدم بمحض إرادته، وتشمل: طلبات الانخراط والعضوية السنوية، استمارات التطوع ضمن مبادرة "شباب في العمل"، تسجيلات حضور الفعاليات الثقافية لضبط الطاقة الاستيعابية، ورسائل التواصل والاستفسارات المؤسساتية.'
                  : isFr
                  ? 'La collecte des données est strictement limitée aux informations nécessaires aux services sollicités par l’utilisateur : adhésion annuelle, bénévolat Jeunesse en Action, inscription aux événements et demandes de partenariat.'
                  : 'Data collection is strictly limited to information necessary to fulfill user requests, including: annual membership applications, Youth in Action volunteer registrations, event seat bookings, and institutional partnership inquiries.'}
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-[#231f20]">
                {isAr ? '3. سياسة عدم البيع والسرية' : isFr ? '3. Confidentialité & Non-Cession des Données' : '3. Confidentiality & Non-Disclosure'}
              </h2>
              <p>
                {isAr
                  ? 'لا تقوم الجمعية إطلاقاً ببيع أو تأجير أو مشاركة المعطيات الشخصية للمستخدمين مع أي أطراف تجارية ثالثة. يتم استخدام المعطيات حصرياً لأغراض التسيير الجمعوي الداخلي، وتوجيه الإشعارات بالفعاليات والأنشطة الثقافية.'
                  : isFr
                  ? 'L’association ne vend, ne loue, ni ne partage aucune donnée personnelle avec des tiers à des fins commerciales. Les données sont exclusivement réservées à la gestion interne de l’association et aux communications officielles relatives à nos activités.'
                  : 'AMYCC does not sell, rent, or commercialize personal data to third parties. Data is used exclusively for internal association management and official cultural communications.'}
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-[#231f20]">
                {isAr ? '4. حقوق المستخدم (الولوج، التصحيح، والحذف)' : isFr ? '4. Droits d’Accès, de Rectification & de Suppression' : '4. User Rights: Access, Rectification & Erasure'}
              </h2>
              <p>
                {isAr
                  ? 'تطبيقاً لأحكام القانون 09-08، يحق لكل مستخدم ممارسة حقه في الاطلاع على معطياته، أو طلب تصحيحها، أو تحيينها، أو حذفها نهائياً من سجلات الجمعية عبر توجيه رسالة رسمية إلى البريد الإلكتروني: contact@amycc.org.'
                  : isFr
                  ? 'Conformément à la loi n° 09-08, vous disposez d’un droit d’accès, de rectification et d’opposition sur vos données personnelles en adressant une demande officielle par courriel à : contact@amycc.org.'
                  : 'Pursuant to Law 09-08, users may exercise their rights of access, correction, and deletion at any time by contacting our data protection officer at: info@amycc.org.'}
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-[#231f20]">
                {isAr ? '5. تدابير الحماية التقنية' : isFr ? '5. Mesures de Sécurité Technique' : '5. Technical Security Measures'}
              </h2>
              <p>
                {isAr
                  ? 'تطبق المنصة أعلى معايير الحماية التقنية، بما يشمل التشفير الآمن لنقل البيانات عبر بروتوكول HTTPS/TLS، وعزل قواعد البيانات بسياسات الأمان على مستوى الصفوف (Row Level Security)، وتوثيق الجلسات الإدارية، وسجل تدقيق العمليات (Audit Trail) لمنع أي وصول غير مصرح به.'
                  : isFr
                  ? 'La plateforme met en œuvre les standards de sécurité les plus élevés : chiffrement HTTPS/TLS, politiques Row Level Security (RLS), contrôle d’accès rigoureux et journalisation d’audit pour prévenir tout accès non autorisé.'
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

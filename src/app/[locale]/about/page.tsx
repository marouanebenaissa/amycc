import { getDictionary } from '@/lib/i18n/dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'

export default async function AboutPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const dict = await getDictionary(locale)
  const isAr = locale === 'ar'
  const isFr = locale === 'fr'

  const objectives = isAr
    ? [
        { title: 'رعاية الفنون والإبداع', desc: 'توفير فضاءات للتعبير الفني وصقل مهارات المواهب الصاعدة في الفنون التشكيلية والموسيقى والمسرح.' },
        { title: 'تمكين الشباب والمواطنة', desc: 'إشراك الشباب في الشأن الثقافي وتطوير قدراتهم القيادية من خلال مبادرة شباب في العمل.' },
        { title: 'تثمين التراث الثقافي المغربي', desc: 'صون الذاكرة الجماعية والموروث الفني والموسيقي الأصيل والتعريف به وطنياً ودولياً.' },
        { title: 'العدالة المجالية في الولوج للثقافة', desc: 'توسيع دائرة الأنشطة والورشات لتشمل مختلف المدن والجهات والمناطق الحضرية والقروية.' },
        { title: 'بناء الشراكات المؤسساتية', desc: 'التعاون المستدام مع المؤسسات التعليمية، المراكز الثقافية، والمنظمات غير الحكومية.' },
        { title: 'التطوع والعمل التضامني', desc: 'ترسيخ ثقافة التطوع المدني واستثمار طاقات الشباب لخدمة المجتمع وبناء التماسك الاجتماعي.' },
      ]
    : isFr
    ? [
        { title: 'Promotion des arts et de la créativité', desc: 'Création d\'espaces d\'expression artistique et formation des jeunes talents en arts visuels, musique et théâtre.' },
        { title: 'Autonomisation des jeunes', desc: 'Engagement civique et développement du leadership des jeunes à travers l\'initiative Jeunesse en Action.' },
        { title: 'Valorisation du patrimoine marocain', desc: 'Préservation et diffusion de la richesse culturelle et musicale marocaine à l\'échelle nationale et internationale.' },
        { title: 'Démocratisation de l\'accès culturel', desc: 'Déploiement d\'activités artistiques dans différentes villes et régions du Royaume.' },
        { title: 'Partenariats institutionnels', desc: 'Collaboration durable avec les centres culturels, universités, écoles et acteurs de la société civile.' },
        { title: 'Bénévolat et solidarité', desc: 'Ancrage de la culture du volontariat comme levier de cohésion sociale et de développement humain.' },
      ]
    : [
        { title: 'Fostering Arts & Creativity', desc: 'Providing supportive creative spaces and masterclasses in visual arts, theatre, and musical expression.' },
        { title: 'Youth Empowerment & Civic Action', desc: 'Engaging youth in cultural leadership through our flagship Youth in Action volunteering initiative.' },
        { title: 'Celebrating Moroccan Heritage', desc: 'Safeguarding and promoting Moroccan tangible and intangible cultural traditions nationally and globally.' },
        { title: 'Inclusive Cultural Access', desc: 'Expanding workshops and events across multiple Moroccan cities and diverse communities.' },
        { title: 'Institutional Partnerships', desc: 'Building sustainable bridges with cultural centers, educational institutions, and civic organizations.' },
        { title: 'Community Volunteering', desc: 'Instilling a spirit of civic solidarity and empowering young people to serve their communities through arts.' },
      ]

  return (
    <>
      <Header locale={locale} dict={dict} />

      <main id="main-content" className="flex-1 bg-[#faf7f2]">
        {/* ============================================================
            1. PAGE HERO HEADER
            ============================================================ */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#faf7f2] via-[#f7f2e9] to-[#faf7f2] border-b border-[#e5e0d6] py-16 lg:py-24">
          <div className="absolute inset-0 moroccan-pattern-light opacity-50 pointer-events-none" aria-hidden="true" />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d3b43]/10 border border-[#0d3b43]/20 text-[#0d3b43] text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-[#c85a32] animate-pulse" />
              <span>{isAr ? 'عن جمعية روح الفنون والثقافة (AMYCC)' : 'About Spirit of Arts & Culture Association'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#08242a] tracking-tight leading-tight">
              {dict.about.title}
            </h1>

            <p className="text-base sm:text-lg text-[#445457] max-w-3xl mx-auto leading-relaxed font-medium">
              {dict.about.description}
            </p>
          </div>
        </section>

        {/* ============================================================
            2. ORGANIZATION KEY FACTS (4 Pillars)
            ============================================================ */}
        <section className="py-12 bg-white border-b border-[#e5e0d6]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-3xl bg-[#faf7f2] border border-[#e5e0d6] text-center">
                <span className="text-3xs font-extrabold uppercase tracking-wider text-[#5f7174] block mb-1">
                  {isAr ? 'سنة التأسيس' : 'Foundation Year'}
                </span>
                <span className="text-3xl font-black text-[#0d3b43] block">2026</span>
                <p className="text-xs text-[#5f7174] mt-2 leading-relaxed">
                  {isAr ? 'جمعية غير ربحية تأسست رسمياً بالمغرب' : 'Nonprofit cultural association founded in Morocco.'}
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#faf7f2] border border-[#e5e0d6] text-center">
                <span className="text-3xs font-extrabold uppercase tracking-wider text-[#5f7174] block mb-1">
                  {isAr ? 'المقر والنطاق' : 'Location & Scope'}
                </span>
                <span className="text-3xl font-black text-[#c85a32] block">
                  {isAr ? 'المغرب' : 'Morocco'}
                </span>
                <p className="text-xs text-[#5f7174] mt-2 leading-relaxed">
                  {isAr ? 'أنشطة بمختلف المدن المغربية وشراكات دولية' : 'Operating across Moroccan cities with global partnerships.'}
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#faf7f2] border border-[#e5e0d6] text-center">
                <span className="text-3xs font-extrabold uppercase tracking-wider text-[#5f7174] block mb-1">
                  {isAr ? 'مجالات العمل' : 'Core Disciplines'}
                </span>
                <span className="text-3xl font-black text-[#d99b26] block">6 مجالات</span>
                <p className="text-xs text-[#5f7174] mt-2 leading-relaxed">
                  {isAr ? 'فنون، موسيقى، مسرح، تراث، شباب، وتطوع' : 'Arts, Music, Theatre, Heritage, Youth & Civic.'}
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#faf7f2] border border-[#e5e0d6] text-center">
                <span className="text-3xs font-extrabold uppercase tracking-wider text-[#5f7174] block mb-1">
                  {isAr ? 'البرنامج الرائد' : 'Flagship Initiative'}
                </span>
                <span className="text-xl font-black text-[#0d3b43] block mt-1">شباب في العمل</span>
                <p className="text-xs text-[#5f7174] mt-2 leading-relaxed">
                  {isAr ? 'برنامج التطوع والتمكين الثقافي والمجتمعي' : 'Youth in Action volunteering & leadership.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            3. MISSION, VISION & VALUES IN DETAIL
            ============================================================ */}
        <section className="py-20 bg-[#faf7f2] border-b border-[#e5e0d6]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-widest text-[#c85a32]">
                {isAr ? 'المنطلقات التأسيسية' : 'Foundational Principles'}
              </span>
              <h2 className="text-3xl font-black text-[#08242a] mt-2">
                {isAr ? 'الرسالة، الرؤية، والقيم الحاكمة' : 'Mission, Vision & Core Values'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Mission */}
              <div className="bg-white p-8 rounded-3xl border border-[#e5e0d6] shadow-subtle flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#0d3b43] text-white flex items-center justify-center font-bold text-xl mb-6">
                    ✦
                  </div>
                  <h3 className="text-xl font-black text-[#08242a] mb-3">
                    {dict.about.mission_title}
                  </h3>
                  <p className="text-sm text-[#445457] leading-relaxed">
                    {isAr
                      ? 'رعاية الفنون التشكيلية والموسيقى والمسرح والتراث المغربي، ودعم الطاقات الشابة وصقل مهاراتهم الإبداعية، وتيسير الولوج الثقافي الحر لجميع فئات المجتمع.'
                      : dict.about.description}
                  </p>
                </div>
              </div>

              {/* Vision */}
              <div className="bg-white p-8 rounded-3xl border-2 border-[#c85a32]/30 shadow-subtle flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 end-0 w-24 h-24 bg-[#fae4dc] rounded-bl-full pointer-events-none" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-[#c85a32] text-white flex items-center justify-center font-bold text-xl mb-6">
                    ★
                  </div>
                  <h3 className="text-xl font-black text-[#08242a] mb-3">
                    {dict.about.vision_title}
                  </h3>
                  <p className="text-sm text-[#445457] leading-relaxed">
                    {isAr
                      ? 'بناء مجتمع مغربي متفاعل ومبدع يحتفي بالتنوع الثقافي، وتكون فيه الفنون رافعة حقيقية للتنمية البشرية، والتماسك المجتمعي، والانفتاح الإيجابي على العالم.'
                      : dict.hero.subtitle}
                  </p>
                </div>
              </div>

              {/* Values */}
              <div className="bg-white p-8 rounded-3xl border border-[#e5e0d6] shadow-subtle flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#d99b26] text-white flex items-center justify-center font-bold text-xl mb-6">
                    ♥
                  </div>
                  <h3 className="text-xl font-black text-[#08242a] mb-3">
                    {dict.about.values_title}
                  </h3>
                  <p className="text-sm text-[#445457] leading-relaxed">
                    {isAr
                      ? 'الإبداع، التطوع المسؤول، المواطنة الفاعلة، الشفافية المؤسساتية، احترام التنوع الثقافي، والشراكة البناءة مع كل الفاعلين الثقافيين والتربويين.'
                      : dict.footer.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            4. STRATEGIC OBJECTIVES (الأهداف الاستراتيجية)
            ============================================================ */}
        <section className="py-20 bg-white border-b border-[#e5e0d6]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-[#0d3b43]">
                {isAr ? 'الأهداف المؤسسية' : 'Strategic Objectives'}
              </span>
              <h2 className="text-3xl font-black text-[#08242a] mt-2">
                {isAr ? 'أهداف جمعية روح الفنون والثقافة' : 'AMYCC Strategic Goals'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {objectives.map((obj, idx) => (
                <div
                  key={idx}
                  className="p-7 rounded-3xl bg-[#faf7f2] border border-[#e5e0d6] shadow-subtle hover:shadow-card transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#e5e0d6] flex items-center justify-center text-sm font-black text-[#c85a32] mb-4">
                    0{idx + 1}
                  </div>
                  <h3 className="text-lg font-bold text-[#08242a] mb-2 leading-snug">
                    {obj.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#445457] leading-relaxed">
                    {obj.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            5. ORGANIZATIONAL STRUCTURE & GOVERNANCE
            ============================================================ */}
        <section className="py-20 bg-[#faf7f2] border-b border-[#e5e0d6]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-widest text-[#c85a32]">
                {isAr ? 'الحكامة والهيكل التنظيمي' : 'Governance & Structure'}
              </span>
              <h2 className="text-3xl font-black text-[#08242a] mt-2">
                {isAr ? 'الهيكلة الإدارية للجمعية' : 'Organizational Architecture'}
              </h2>
              <p className="text-xs sm:text-sm text-[#5f7174] mt-2">
                {isAr
                  ? 'هيكلة ديمقراطية وشفافة تسهر على تسيير البرامج وتطبيق النظام الأساسي للجمعية.'
                  : 'Democratic and transparent governance structure managing programs in accordance with association bylaws.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-7 rounded-3xl bg-white border border-[#e5e0d6] shadow-subtle text-center">
                <div className="w-12 h-12 rounded-2xl bg-[#0d3b43]/10 text-[#0d3b43] text-2xl flex items-center justify-center mx-auto mb-4">
                  🏛️
                </div>
                <h3 className="text-lg font-bold text-[#08242a] mb-2">
                  {isAr ? 'الجمع العام' : 'General Assembly'}
                </h3>
                <p className="text-xs text-[#445457] leading-relaxed">
                  {isAr
                    ? 'أعلى هيئة تقريرية في الجمعية، تضم كافة الأعضاء المنخرطين، وتصادق على التقارير الأدبية والمالية.'
                    : 'Supreme decision-making body comprising all active members, approving annual narrative and financial reports.'}
                </p>
              </div>

              <div className="p-7 rounded-3xl bg-white border border-[#e5e0d6] shadow-subtle text-center">
                <div className="w-12 h-12 rounded-2xl bg-[#c85a32]/10 text-[#c85a32] text-2xl flex items-center justify-center mx-auto mb-4">
                  👥
                </div>
                <h3 className="text-lg font-bold text-[#08242a] mb-2">
                  {isAr ? 'المكتب التنفيذي' : 'Executive Board'}
                </h3>
                <p className="text-xs text-[#445457] leading-relaxed">
                  {isAr
                    ? 'الهيئة المسؤولة عن التدبير اليومي، تنفيذ القرارات، تمثيل الجمعية قانونياً، والإشراف على المبادرات.'
                    : 'Elected executive board responsible for day-to-day management, legal representation, and strategic implementation.'}
                </p>
              </div>

              <div className="p-7 rounded-3xl bg-white border border-[#e5e0d6] shadow-subtle text-center">
                <div className="w-12 h-12 rounded-2xl bg-[#d99b26]/10 text-[#d99b26] text-2xl flex items-center justify-center mx-auto mb-4">
                  🎨
                </div>
                <h3 className="text-lg font-bold text-[#08242a] mb-2">
                  {isAr ? 'اللجان الوظيفية والميدانية' : 'Specialized Committees'}
                </h3>
                <p className="text-xs text-[#445457] leading-relaxed">
                  {isAr
                    ? 'لجان متخصصة في الفنون، الموسيقى، المسرح، الإعلام والتواصل، ولجنة تنسيق مبادرة شباب في العمل.'
                    : 'Working committees dedicated to performing arts, music, media, and Youth in Action coordination.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            6. CTA SECTION
            ============================================================ */}
        <section className="py-16 bg-[#08242a] text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {isAr ? 'انضم إلينا وكن شريكاً في مسيرة الإبداع الثقافي' : 'Join Our Cultural Movement in Morocco'}
            </h2>
            <p className="text-xs sm:text-sm text-[#d8f0f4] max-w-xl mx-auto leading-relaxed">
              {isAr
                ? 'سواء كنت مبدعاً، فناناً، شاباً متحمساً للتطوع، أو مؤسسة تبحث عن شراكة ثقافية واعدة، نرحب بك معنا.'
                : 'Whether you are an artist, a passionate young volunteer, or an institution seeking collaboration, join us.'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href={`/${locale}/membership`}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-white bg-[#c85a32] hover:bg-[#b84e27] active:scale-95 transition-all text-xs sm:text-sm"
              >
                {dict.membership.apply}
              </Link>
              <Link
                href={`/${locale}/volunteer`}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-[#08242a] bg-[#f4ce83] hover:bg-white active:scale-95 transition-all text-xs sm:text-sm"
              >
                {dict.volunteer.apply}
              </Link>
              <Link
                href={`/${locale}/partnerships`}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-white border border-[#268292] hover:bg-[#14505b] transition-all text-xs sm:text-sm"
              >
                {dict.nav.partnerships}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} dict={dict} />
    </>
  )
}

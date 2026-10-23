import { getDictionary } from '@/lib/i18n/dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { IconWithFallback } from '@/components/ui/IconWithFallback'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'
import Link from 'next/link'

export default async function TeamPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const dict = await getDictionary(locale)
  const isAr = locale === 'ar'
  const isFr = locale === 'fr'

  // Executive Board Roles (compliant with Moroccan Dahir on Non-Profit Associations)
  // Transparent placeholders until verified by the user
  const executiveBoard = [
    {
      role: isAr ? 'رئيس(ة) الجمعية' : isFr ? 'Président(e)' : 'President',
      name: isAr ? '[اسم الرئيس(ة) — قيد التعيين]' : isFr ? '[Nom du Président(e)]' : '[President Name]',
      desc: isAr
        ? 'التمثيل القانوني للجمعية، الإشراف العام على التوجهات الاستراتيجية، وتنسيق أعمال المكتب التنفيذي.'
        : isFr
        ? 'Représentation légale de l\'association, orientation stratégique et coordination générale.'
        : 'Legal representative of the association, overseeing strategic vision and board coordination.',
      image: '/images/team/president.png',
      icon: '🏛️',
    },
    {
      role: isAr ? 'الكاتب(ة) العام' : isFr ? 'Secrétaire Général(e)' : 'Secretary General',
      name: isAr ? '[اسم الكاتب(ة) العام — قيد التعيين]' : isFr ? '[Nom du Secrétaire Général]' : '[Secretary General Name]',
      desc: isAr
        ? 'تدبير المراسلات الإدارية، توثيق محاضر الجموع العامة واجتماعات المكتب، وصون سجلات الجمعية.'
        : isFr
        ? 'Gestion administrative, rédaction des procès-verbaux et tenue des registres officiels.'
        : 'Administrative management, recording board minutes, and official record keeping.',
      image: '/images/team/secretary.png',
      icon: '📜',
    },
    {
      role: isAr ? 'أمين(ة) المال' : isFr ? 'Trésorier(ère)' : 'Treasurer',
      name: isAr ? '[اسم أمين(ة) المال — قيد التعيين]' : isFr ? '[Nom du Trésorier(ère)]' : '[Treasurer Name]',
      desc: isAr
        ? 'التدبير المالي الشفاف، إعداد التقارير المالية الدورية، ومتابعة الحساب البنكي الرسمي للجمعية.'
        : isFr
        ? 'Gestion financière transparente, bilans comptables et suivi du compte bancaire associatif.'
        : 'Financial management, compiling annual fiscal reports, and official account compliance.',
      image: '/images/team/treasurer.png',
      icon: '💼',
    },
    {
      role: isAr ? 'نائب(ة) الرئيس' : isFr ? 'Vice-Président(e)' : 'Vice President',
      name: isAr ? '[اسم نائب(ة) الرئيس — قيد التعيين]' : isFr ? '[Nom du Vice-Président]' : '[Vice President Name]',
      desc: isAr
        ? 'مؤازرة الرئاسة في المهام التمثيلية والإشراف على لجان التنسيق والشراكات المؤسساتية.'
        : isFr
        ? 'Appui à la présidence et suivi des partenariats institutionnels et comités de coordination.'
        : 'Assisting executive leadership and coordinating institutional partnerships.',
      image: '/images/team/vice-president.png',
      icon: '🤝',
    },
  ]

  // Functional Specialized Committees
  const committees = [
    {
      title: isAr ? 'لجنة المسرح وفنون العرض' : isFr ? 'Commission Théâtre & Scène' : 'Theatre & Performing Arts Committee',
      desc: isAr
        ? 'الإشراف على محترفات الارتجال المسرحي، الإلقاء، السينوغرافيا، وإعداد العروض التعبيرية للشباب.'
        : isFr
        ? 'Conception et encadrement des ateliers de théâtre, d\'expression scénique et de dramaturgie.'
        : 'Designing and mentoring theatre masterclasses, dramatic staging, and youth performances.',
      icon: '🎭',
      iconSrc: '/icons/theatre.png',
    },
    {
      title: isAr ? 'لجنة التراث والموسيقى' : isFr ? 'Commission Musique & Patrimoine' : 'Heritage & Music Committee',
      desc: isAr
        ? 'صون الذاكرة الفنية والموسيقية المغربية، تنظيم الأمسيات التراثية، وتدريب المواهب الصاعدة.'
        : isFr
        ? 'Préservation des répertoires musicaux traditionnels marocains et accompagnement des jeunes musiciens.'
        : 'Safeguarding Moroccan musical heritage and curating acoustic educational sessions.',
      icon: '🎵',
      iconSrc: '/icons/music.png',
    },
    {
      title: isAr ? 'لجنة الفنون التشكيلية والمعارض' : isFr ? 'Commission Arts Plastiques & Expositions' : 'Visual Arts Committee',
      desc: isAr
        ? 'تنظيم ورشات الرسم والنحت والخط المغربي، وإقامة معارض حية تبرز إبداعات الشباب.'
        : isFr
        ? 'Organisation d\'expositions, d\'ateliers de peinture, sculpture et calligraphie marocaine.'
        : 'Organizing art exhibitions, live painting masterclasses, and Moroccan calligraphy workshops.',
      icon: '🎨',
      iconSrc: '/icons/arts.png',
    },
    {
      title: isAr ? 'منسقية مبادرة "شباب في العمل"' : isFr ? 'Coordination Jeunesse en Action' : 'Youth in Action Coordination',
      desc: isAr
        ? 'تأطير المتطوعين، تنسيق الأنشطة الميدانية، وتوثيق ساعات وتجارب العمل الجمعوي بالمملكة.'
        : isFr
        ? 'Encadrement des bénévoles, coordination de terrain et suivi des attestations d\'engagement.'
        : 'Mobilizing youth volunteers, field outreach coordination, and certified volunteering records.',
      icon: '🚀',
      iconSrc: '/icons/youth.png',
    },
  ]

  return (
    <>
      <Header locale={locale} dict={dict} />

      <main id="main-content" className="flex-1 bg-[#faf7f2]">
        {/* Header Banner */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#faf7f2] via-[#f7f2e9] to-[#faf7f2] border-b border-[#e5e0d6] py-16 lg:py-24 text-center">
          <div className="absolute inset-0 moroccan-pattern-light opacity-50 pointer-events-none" aria-hidden="true" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#c85a32]">
              AMYCC Leadership & Governance
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#08242a] tracking-tight">
              {isAr ? 'فريق العمل والحكامة الجمعوية' : isFr ? 'Équipe & Gouvernance' : 'Our Team & Governance'}
            </h1>
            <p className="text-base sm:text-lg text-[#445457] max-w-2xl mx-auto font-medium leading-relaxed">
              {isAr
                ? 'الهيكل التنفيذي واللجان الفنية المسؤولة عن قيادة وتطوير مبادرات جمعية روح الفنون والثقافة بالمملكة المغربية.'
                : isFr
                ? 'Structure organisationnelle, bureau exécutif et commissions artistiques de l\'AMYCC.'
                : 'The executive board and functional artistic committees steering the vision of AMYCC across Morocco.'}
            </p>
          </div>
        </section>

        {/* Executive Board Section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0d3b43]">
              {isAr ? 'المكتب التنفيذي للجمعية' : 'Executive Board'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#08242a] mt-2 mb-4">
              {isAr ? 'حكامة مدنية مسؤولة وشفافة' : 'Committed Non-Profit Leadership'}
            </h2>
            <p className="text-sm sm:text-base text-[#445457] leading-relaxed">
              {isAr
                ? 'يتم انتخاب أعضاء المكتب التنفيذي وفق مقتضيات القانون الأساسي للجمعية وظهير الحريات العامة المنظم للعمل الجمعوي بالمغرب.'
                : 'Elected board members oversee legal representation, civic accountability, and mission stewardship.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {executiveBoard.map((member, idx) => (
              <div
                key={idx}
                className="luxury-card p-6 bg-white flex flex-col justify-between text-center group hover:border-[#0d3b43]/30 transition-all"
              >
                <div>
                  {/* Photo Container with Fallback */}
                  <div className="w-24 h-24 mx-auto rounded-3xl bg-[#faf7f2] border-2 border-[#e5e0d6] mb-5 overflow-hidden flex items-center justify-center relative shadow-2xs group-hover:scale-105 transition-transform">
                    <ImageWithFallback
                      src={member.image}
                      fallbackSrc="/logo.png"
                      alt={member.role}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover p-2"
                    />
                  </div>

                  <span className="inline-block px-2.5 py-0.5 rounded-full text-3xs font-black uppercase tracking-wider bg-[#d8f0f4] text-[#0d3b43] mb-2">
                    {member.role}
                  </span>

                  <h3 className="text-sm font-bold text-[#08242a] mb-2">
                    {member.name}
                  </h3>

                  <p className="text-xs text-[#5f7174] leading-relaxed">
                    {member.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#f4ede2] text-3xs text-[#819598] font-medium">
                  {isAr ? 'المملكة المغربية • 2026' : 'Morocco • 2026'}
                </div>
              </div>
            ))}
          </div>

          {/* Transparency Disclaimer Note */}
          <div className="mt-8 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-3xs sm:text-xs text-amber-900 leading-relaxed text-center max-w-3xl mx-auto">
            <span>ℹ️ </span>
            <span>
              {isAr
                ? 'تنبيه الشفافية: أسماء أعضاء المكتب التنفيذي المعروضة أعلاه هي حقول تنظيمية قانونية. يتم تحيين ونشر الأسماء الرسمية المصادق عليها في محاضر الجمع العام لدى السلطات المختصة وفق القوانين المغربية.'
                : 'Transparency note: Executive role placeholders follow standard statutory requirements and are updated as ratified during general assembly proceedings.'}
            </span>
          </div>
        </section>

        {/* Functional Committees Section */}
        <section className="bg-white border-y border-[#e5e0d6] py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-[#c85a32]">
                {isAr ? 'اللجان الفنية والوظيفية' : 'Functional Committees'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#08242a] mt-2 mb-4">
                {isAr ? 'طاقات متخصصة تشرف على تنزيل الأنشطة' : 'Specialized Committees Leading Field Activities'}
              </h2>
              <p className="text-sm sm:text-base text-[#445457] leading-relaxed">
                {isAr
                  ? 'تسهر هذه اللجان على التأطير المباشر للورشات، وتطوير المضامين الفنية، ومواكبة الشباب المشارك.'
                  : 'Artistic and organizational committees direct practical workshops, curriculum development, and volunteer support.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {committees.map((comm, idx) => (
                <div
                  key={idx}
                  className="p-8 rounded-3xl bg-[#faf7f2] border border-[#e5e0d6] hover:border-[#cfc7b9] shadow-subtle hover:shadow-card transition-all flex items-start gap-5 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white border border-[#e5e0d6] flex items-center justify-center p-3 shrink-0 shadow-2xs group-hover:scale-105 transition-transform overflow-hidden">
                    <IconWithFallback
                      src={comm.iconSrc}
                      fallbackEmoji={comm.icon}
                      alt={comm.title}
                      size={32}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-[#08242a]">
                      {comm.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#445457] leading-relaxed">
                      {comm.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Join the Team / Volunteer CTA */}
        <section className="py-20 bg-[#faf7f2]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
            <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold bg-[#0d3b43] text-[#f4ce83]">
              {isAr ? 'انضم إلى فريق العمل والتطوع' : 'Join Our Team & Movement'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#08242a]">
              {isAr ? 'هل تملك شغفاً بالفنون والثقافة وترغب في المساهمة؟' : 'Passionate About Arts & Culture? Join Our Movement'}
            </h2>
            <p className="text-sm sm:text-base text-[#445457] max-w-2xl mx-auto leading-relaxed">
              {isAr
                ? 'نرحب بالمبدعين، المؤطرين الفنيين، والشباب الراغبين في الانضمام للجان الجمعية والمشاركة في مبادرة "شباب في العمل".'
                : 'We welcome artists, cultural educators, and youth organizers eager to shape Morocco\'s cultural landscape.'}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href={`/${locale}/volunteer`}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-[#08242a] bg-[#f4ce83] hover:bg-[#fae0a5] transition-all text-xs shadow-subtle"
              >
                {dict.volunteer.apply}
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white bg-[#0d3b43] hover:bg-[#14505b] transition-all text-xs shadow-xs"
              >
                {dict.nav.contact}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} dict={dict} />
    </>
  )
}

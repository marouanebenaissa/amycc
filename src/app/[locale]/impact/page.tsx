import { getDictionary } from '@/lib/i18n/dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { IconWithFallback } from '@/components/ui/IconWithFallback'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'
import Link from 'next/link'

export default async function ImpactPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const dict = await getDictionary(locale)
  const isAr = locale === 'ar'
  const isFr = locale === 'fr'

  const impactMetrics = [
    {
      value: '2026',
      label: isAr ? 'سنة التأسيس والانطلاق الرسمي' : isFr ? 'Année de fondation officielle' : 'Official Foundation Year',
      subtext: isAr ? 'إطار جمعوي مدني معتمد بالمغرب' : isFr ? 'Cadre associatif reconnu au Maroc' : 'Recognized Moroccan non-profit',
      icon: '🏛️',
      iconSrc: '/icons/impact-founding.png',
    },
    {
      value: '6',
      label: isAr ? 'مجالات عمل فني وثقافي' : isFr ? 'Domaines artistiques et culturels' : 'Core Cultural Disciplines',
      subtext: isAr ? 'مسرح، موسيقى، تشكيل، تراث، شباب، تطوع' : isFr ? 'Théâtre, musique, arts visuels, patrimoine' : 'Theatre, music, fine arts, heritage',
      icon: '🎨',
      iconSrc: '/icons/impact-disciplines.png',
    },
    {
      value: '+500',
      label: isAr ? 'ساعات تطوع وتأطير ميداني مستهدفة' : isFr ? 'Heures de bénévolat ciblées' : 'Targeted Volunteer Hours',
      subtext: isAr ? 'ضمن مبادرة "شباب في العمل"' : isFr ? 'Via l\'initiative Jeunesse en Action' : 'Through Youth in Action initiative',
      icon: '🤝',
      iconSrc: '/icons/impact-hours.png',
    },
    {
      value: '100%',
      label: isAr ? 'عمل مدني غير ربحي وتطوعي' : isFr ? 'Engagement civique et non-lucratif' : 'Nonprofit Civic Commitment',
      subtext: isAr ? 'شفافية الحكامة وفق القانون المغربي' : isFr ? 'Transparence et gouvernance citoyenne' : 'Transparent Moroccan governance',
      icon: '⚖️',
      iconSrc: '/icons/impact-governance.png',
    },
  ]

  const pillarsOfImpact = [
    {
      title: isAr ? '1. التمكين الشبابي والقيادة الثقافية' : isFr ? '1. Autonomisation et leadership des jeunes' : '1. Youth Empowerment & Leadership',
      desc: isAr
        ? 'فتح المجال أمام الطاقات الشابة للتعبير الحر وصقل مهاراتهم في التواصل، إدارة التظاهرات الفنية، والعمل الجماعي من خلال مبادرة "شباب في العمل"، مع منح شواهد تطوع وتجربة جمعوية موثقة.'
        : isFr
        ? 'Permettre aux jeunes d\'acquérir des compétences concrètes en gestion culturelle et en leadership participatif avec attestations d\'engagement certifiées.'
        : 'Empowering Moroccan youth through hands-on cultural project management, teamwork, and artistic leadership, with official volunteering certificates.',
      icon: '🚀',
      iconSrc: '/icons/youth.png',
    },
    {
      title: isAr ? '2. صون الذاكرة والتراث المغربي الأصيل' : isFr ? '2. Préservation du patrimoine marocain' : '2. Preserving Moroccan Cultural Heritage',
      desc: isAr
        ? 'الاحتفاء بالروافد المتنوعة للهوية الثقافية المغربية عبر ورشات الموسيقى التراثية، الفنون التشكيلية المستوحاة من المعمار والزخرفة المغربية، ونقل هذا الغنى الحضاري بين الأجيال.'
        : isFr
        ? 'Célébrer la diversité du patrimoine culturel marocain à travers des ateliers musicaux, des arts visuels et la transmission intergénérationnelle.'
        : 'Celebrating the richness of Moroccan cultural diversity through heritage music, architecture-inspired visual arts, and intergenerational knowledge transmission.',
      icon: '🏛️',
      iconSrc: '/icons/culture.png',
    },
    {
      title: isAr ? '3. العدالة المجالية والولوج الثقافي الشامل' : isFr ? '3. Démocratisation de l\'accès culturel' : '3. Territorial Equity & Cultural Access',
      desc: isAr
        ? 'السعي إلى توسيع دائرة المستفيدين من الورشات والعروض الفنية لتشمل فضاءات القرب، دور الشباب، والمراكز الثقافية بمختلف المدن والجهات المغربية دون تمييز.'
        : isFr
        ? 'Déployer des activités artistiques gratuites dans les maisons de jeunes et centres de proximité à travers différentes régions du Royaume.'
        : 'Expanding free workshops and performances to local youth centers and cultural venues across multiple Moroccan cities and regions.',
      icon: '📍',
      iconSrc: '/icons/impact-access.png',
    },
    {
      title: isAr ? '4. التضامن المجتمعي وترسيخ المواطنة الفاعلة' : isFr ? '4. Solidarité citoyenne et cohésion sociale' : '4. Civic Solidarity & Social Cohesion',
      desc: isAr
        ? 'استثمار الفنون والمسرح والموسيقى كأدوات لبناء التماسك الاجتماعي، ونشر قيم التسامح والتعايش، وترسيخ روح المبادرة الإيجابية في خدمة الصالح العام.'
        : isFr
        ? 'Utiliser l\'art et le théâtre comme leviers de cohésion sociale, de citoyenneté positive et de dialogue intergénérationnel.'
        : 'Harnessing the power of arts and theatre as vehicles for social cohesion, civic pride, and positive community engagement.',
      icon: '♥',
      iconSrc: '/icons/values.png',
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
              AMYCC Impact & Community
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#08242a] tracking-tight">
              {isAr ? 'الأثر المجتمعي والثقافي' : isFr ? 'Notre Impact Communautaire' : 'Our Community Impact'}
            </h1>
            <p className="text-base sm:text-lg text-[#445457] max-w-2xl mx-auto font-medium leading-relaxed">
              {isAr
                ? 'كيف تسهم جمعية روح الفنون والثقافة في إحداث تغيير إيجابي ومستدام في المشهد الثقافي وتمكين الشباب بالمملكة المغربية.'
                : isFr
                ? 'Mesurer et valoriser la contribution de l\'AMYCC au rayonnement culturel et à l\'autonomisation de la jeunesse marocaine.'
                : 'Measuring how AMYCC fosters lasting cultural vitality, youth leadership, and civic solidarity across Morocco.'}
            </p>
          </div>
        </section>

        {/* 4 Impact Key Indicators */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {impactMetrics.map((metric, idx) => (
              <div
                key={idx}
                className="luxury-card p-6 text-center flex flex-col justify-between items-center group bg-white shadow-card"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#faf7f2] border border-[#e5e0d6] flex items-center justify-center p-2 mb-3 shadow-2xs group-hover:scale-105 transition-transform overflow-hidden">
                  <IconWithFallback
                    src={metric.iconSrc}
                    fallbackEmoji={metric.icon}
                    alt={metric.label}
                    size={28}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-[#0d3b43] mb-1">
                  {metric.value}
                </div>
                <div className="text-xs font-bold text-[#08242a] leading-snug mb-1">
                  {metric.label}
                </div>
                <div className="text-3xs text-[#819598] font-medium">
                  {metric.subtext}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Four Strategic Pillars of Impact */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0d3b43]">
              {isAr ? 'محاور صناعة الأثر' : 'Pillars of Impact'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#08242a] mt-2 mb-4">
              {isAr ? 'رؤية متكاملة للنهوض بالثقافة والشباب' : 'A Holistic Vision for Cultural Development'}
            </h2>
            <p className="text-sm sm:text-base text-[#445457] leading-relaxed">
              {isAr
                ? 'تستند كل ورشة وكل فعالية تنظمها الجمعية إلى معايير واضحة لتحقيق الفائدة الملموسة للمشاركين والمجتمع.'
                : 'Every workshop, performance, and festival is designed to generate measurable civic and artistic benefits.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pillarsOfImpact.map((pillar, idx) => (
              <div
                key={idx}
                className="luxury-card p-8 bg-white flex flex-col justify-between group hover:border-[#c85a32]/30 transition-all"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#faf7f2] border border-[#e5e0d6] flex items-center justify-center p-3 mb-6 shadow-2xs group-hover:scale-105 transition-transform overflow-hidden">
                    <IconWithFallback
                      src={pillar.iconSrc}
                      fallbackEmoji={pillar.icon}
                      alt={pillar.title}
                      size={32}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-[#08242a] mb-3 leading-snug">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#445457] leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Impact Story / Youth in Action Spotlight */}
        <section className="bg-white border-y border-[#e5e0d6] py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-[#d8f0f4] text-[#0d3b43]">
                  {isAr ? 'أثر ميداني ملموس' : 'Field Impact Story'}
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-[#08242a] leading-tight">
                  {isAr
                    ? 'مبادرة "شباب في العمل": من المشاركة الفردية إلى القيادة المجتمعية'
                    : 'Youth in Action: From Individual Participation to Cultural Leadership'}
                </h2>
                <p className="text-sm sm:text-base text-[#445457] leading-relaxed">
                  {isAr
                    ? 'لا يقتصر دور الشباب في أنشطة الجمعية على الحضور السلبي، بل يتعداه إلى المشاركة الحية في بلورة الأفكار، تأطير الورشات، والتنظيم الميداني، مما يزرع الثقة بالنفس، ويطور مهارات القيادة، ويوثق ساعات التطوع بشواهد رسمية معتمدة تدعم مسارهم الدراسي والمهني.'
                    : 'Young participants evolve from passive spectators to active cultural organizers, developing public speaking, artistic curating, and leadership skills while earning verified civic credentials.'}
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <Link
                    href={`/${locale}/volunteer`}
                    className="px-6 py-3 rounded-xl font-bold text-white bg-[#0d3b43] hover:bg-[#14505b] transition-all text-xs shadow-xs"
                  >
                    {dict.volunteer.apply}
                  </Link>
                  <Link
                    href={`/${locale}/annual-program`}
                    className="px-6 py-3 rounded-xl font-bold text-[#08242a] bg-[#faf7f2] border border-[#cfc7b9] hover:bg-[#f4ede2] transition-all text-xs"
                  >
                    {isAr ? 'استكشف البرنامج السنوي' : 'View Annual Program'}
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-[#e5e0d6] shadow-card bg-[#08242a]">
                  <ImageWithFallback
                    src="/images/youth-in-action.png"
                    fallbackSrc="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80"
                    alt="Youth in Action Impact"
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08242a]/80 to-transparent" />
                  <div className="absolute bottom-4 start-4 end-4 text-white p-2">
                    <span className="text-3xs text-[#f4ce83] font-bold uppercase tracking-wider block">
                      AMYCC Impact 2026
                    </span>
                    <span className="text-sm font-bold block mt-1">
                      {isAr ? 'طاقات شبابية تصنع التغيير الثقافي' : 'Youth Creating Cultural Change'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Commitment to Non-Profit Transparency Banner */}
        <section className="py-16 bg-[#faf7f2]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#c85a32]">
              {isAr ? 'الشفافية والحكامة الجمعوية' : 'Governance & Transparency'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#08242a]">
              {isAr ? 'التزام تام بأعلى معايير الحكامة والشفافية المدنية' : 'Committed to Highest Standards of Civil Governance'}
            </h2>
            <p className="text-xs sm:text-sm text-[#5f7174] leading-relaxed max-w-2xl mx-auto">
              {isAr
                ? 'تعمل جمعية روح الفنون والثقافة وفق القوانين والأنظمة الجاري بها العمل بالمملكة المغربية المنظمة للعمل الجمعوي. تلتزم الجمعية بتوثيق كافة مخرجات الأنشطة، وتقديم التقارير الأدبية والمالية في الجمع العام السنوي، وصون ثقة المنخرطين والشركاء.'
                : 'AMYCC operates strictly under Moroccan civil society legislation. All activities and financial records are reviewed during annual general assemblies, ensuring integrity, trust, and community stewardship.'}
            </p>
            <div className="pt-4">
              <Link
                href={`/${locale}/partnerships`}
                className="inline-flex items-center gap-2 text-xs font-bold text-[#c85a32] hover:underline"
              >
                <span>{isAr ? 'شاركنا في بناء الأثر — مقترحات الشراكة' : 'Partner with us to amplify impact'}</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} dict={dict} />
    </>
  )
}

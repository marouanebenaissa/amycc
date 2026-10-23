import { getDictionary } from '@/lib/i18n/dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'

export default async function AboutPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const dict = await getDictionary(locale)
  const isAr = locale === 'ar'
  const isFr = locale === 'fr'

  // The 7 Official Core Values (أولاً: قيمنا)
  const values = [
    {
      key: 'creativity',
      title: isAr ? 'الإبداع' : isFr ? 'Créativité' : 'Creativity',
      desc: isAr
        ? 'تشجيع التعبير الفني والابتكار وتنمية الخيال لدى الشباب، وإتاحة الفرص لهم لاكتشاف مواهبهم وتطوير قدراتهم الإبداعية.'
        : isFr
        ? "Encourager l'expression artistique, l'innovation et l'imagination des jeunes, en leur offrant des opportunités pour révéler leurs talents et développer leur potentiel créatif."
        : 'Fostering artistic expression, innovation, and imagination among youth, providing opportunities to discover talents and develop creative abilities.',
      icon: '🎨',
      accent: 'border-[#c85a32]/30 bg-[#c85a32]/5 text-[#c85a32]',
    },
    {
      key: 'inclusivity',
      title: isAr ? 'الشمولية' : isFr ? 'Inclusivité' : 'Inclusivity',
      desc: isAr
        ? 'توفير بيئة مفتوحة ومرحبة تتيح للجميع المشاركة والاستفادة من أنشطة الجمعية دون تمييز.'
        : isFr
        ? 'Offrir un environnement ouvert et accueillant permettant à tous de participer et de bénéficier des activités sans discrimination.'
        : 'Providing an open, welcoming environment that enables everyone to participate and benefit from activities without discrimination.',
      icon: '🌐',
      accent: 'border-[#0d3b43]/30 bg-[#0d3b43]/5 text-[#0d3b43]',
    },
    {
      key: 'solidarity',
      title: isAr ? 'التضامن' : isFr ? 'Solidarité' : 'Solidarity',
      desc: isAr
        ? 'تعزيز التعاون والتكافل والعمل التطوعي، وتشجيع المبادرات الهادفة إلى خدمة المجتمع ومساندة الفئات المحتاجة.'
        : isFr
        ? "Renforcer l'entraide, le bénévolat et encourager les initiatives visant à servir la société et soutenir les populations vulnérables."
        : 'Promoting cooperation, mutual support, and civic volunteering, encouraging initiatives that serve the community and support those in need.',
      icon: '🤝',
      accent: 'border-[#d99b26]/30 bg-[#d99b26]/5 text-[#d99b26]',
    },
    {
      key: 'education',
      title: isAr ? 'التعليم والتطوير' : isFr ? 'Éducation & Développement' : 'Education & Growth',
      desc: isAr
        ? 'دعم التعلم المستمر واكتساب المهارات وتنمية القدرات الشخصية والفنية والثقافية للشباب.'
        : isFr
        ? "Soutenir l'apprentissage continu, l'acquisition de compétences et le développement personnel, artistique et culturel des jeunes."
        : 'Supporting continuous learning, skill acquisition, and personal, artistic, and cultural development for young people.',
      icon: '📚',
      accent: 'border-[#1c6875]/30 bg-[#1c6875]/5 text-[#1c6875]',
    },
    {
      key: 'respect_diversity',
      title: isAr ? 'الاحترام والتنوع' : isFr ? 'Respect & Diversité' : 'Respect & Diversity',
      desc: isAr
        ? 'تقدير الاختلافات الثقافية والفكرية، واحترام الهوية والتراث المغربي، وتشجيع الحوار والتبادل الثقافي والانفتاح على الثقافات الأخرى.'
        : isFr
        ? "Valoriser les diversités culturelles et intellectuelles, respecter l'identité et le patrimoine marocains, et encourager le dialogue interculturel."
        : 'Appreciating cultural and intellectual differences, honoring Moroccan identity and heritage, and encouraging intercultural dialogue.',
      icon: '🕊️',
      accent: 'border-[#c85a32]/30 bg-[#c85a32]/5 text-[#c85a32]',
    },
    {
      key: 'partnership',
      title: isAr ? 'التعاون والشراكة' : isFr ? 'Coopération & Partenariat' : 'Collaboration & Partnerships',
      desc: isAr
        ? 'بناء علاقات تعاون فعالة مع المؤسسات والجمعيات والفاعلين المحليين والوطنيين والدوليين، من أجل تطوير المبادرات الفنية والثقافية وتعزيز أثرها المجتمعي.'
        : isFr
        ? "Bâtir des partenariats constructifs avec les institutions, associations et acteurs locaux, nationaux et internationaux pour démultiplier l'impact culturel."
        : 'Building effective partnerships with civic institutions, associations, and local, national, and international stakeholders.',
      icon: '🏛️',
      accent: 'border-[#0d3b43]/30 bg-[#0d3b43]/5 text-[#0d3b43]',
    },
    {
      key: 'transparency',
      title: isAr ? 'الشفافية والمسؤولية' : isFr ? 'Transparence & Responsabilité' : 'Transparency & Accountability',
      desc: isAr
        ? 'الالتزام بالنزاهة والوضوح في تدبير موارد الجمعية وتنفيذ أنشطتها، وتحمل المسؤولية تجاه المستفيدين والشركاء والمجتمع.'
        : isFr
        ? "Respecter l'intégrité et la rigueur dans la gestion des ressources et la mise en œuvre des actions, avec une responsabilité totale envers les bénéficiaires."
        : 'Committing to integrity and openness in managing resources and executing programs, upholding accountability to beneficiaries, partners, and society.',
      icon: '⚖️',
      accent: 'border-[#d99b26]/30 bg-[#d99b26]/5 text-[#d99b26]',
    },
  ]

  // Strategic Objectives
  const objectives = isAr
    ? [
        {
          title: 'رعاية الفنون والإبداع',
          desc: 'توفير فضاءات للتعبير الفني وصقل مهارات المواهب الصاعدة في الفنون التشكيلية والموسيقى والمسرح.',
        },
        {
          title: 'تمكين الشباب والمواطنة',
          desc: 'إشراك الشباب في الشأن الثقافي وتطوير قدراتهم القيادية من خلال مبادرة شباب في العمل.',
        },
        {
          title: 'تثمين التراث الثقافي المغربي',
          desc: 'صون الذاكرة الجماعية والموروث الفني والموسيقي الأصيل والتعريف به وطنياً ودولياً.',
        },
        {
          title: 'العدالة المجالية في الولوج للثقافة',
          desc: 'توسيع دائرة الأنشطة والورشات لتشمل مختلف المدن والجهات والمناطق الحضرية والقروية.',
        },
        {
          title: 'بناء الشراكات المؤسساتية',
          desc: 'التعاون المستدام مع المؤسسات التعليمية، المراكز الثقافية، والمنظمات غير الحكومية.',
        },
        {
          title: 'العمل التطوعي والتكافل',
          desc: 'ترسيخ ثقافة العمل التضامني واستثمار طاقات الشباب لخدمة المجتمع وبناء التماسك الاجتماعي.',
        },
      ]
    : isFr
    ? [
        {
          title: 'Promotion des arts et de la créativité',
          desc: "Création d'espaces d'expression artistique et formation des jeunes talents en arts visuels, musique et théâtre.",
        },
        {
          title: 'Autonomisation des jeunes',
          desc: "Engagement civique et développement du leadership des jeunes à travers l'initiative Jeunesse en Action.",
        },
        {
          title: 'Valorisation du patrimoine marocain',
          desc: "Préservation et diffusion de la richesse culturelle et musicale marocaine à l'échelle nationale et internationale.",
        },
        {
          title: "Démocratisation de l'accès culturel",
          desc: "Déploiement d'activités artistiques dans différentes villes et régions du Royaume.",
        },
        {
          title: 'Partenariats institutionnels',
          desc: 'Collaboration durable avec les centres culturels, universités, écoles et acteurs de la société civile.',
        },
        {
          title: 'Solidarité et cohésion sociale',
          desc: 'Ancrage de la culture du volontariat comme levier de cohésion sociale et de développement humain.',
        },
      ]
    : [
        {
          title: 'Fostering Arts & Creativity',
          desc: 'Providing supportive creative spaces and masterclasses in visual arts, theatre, and musical expression.',
        },
        {
          title: 'Youth Empowerment & Civic Action',
          desc: 'Engaging youth in cultural leadership through our flagship Youth in Action initiative.',
        },
        {
          title: 'Celebrating Moroccan Heritage',
          desc: 'Safeguarding and promoting Moroccan tangible and intangible cultural traditions nationally and globally.',
        },
        {
          title: 'Inclusive Cultural Access',
          desc: 'Expanding workshops and events across multiple Moroccan cities and diverse communities.',
        },
        {
          title: 'Institutional Partnerships',
          desc: 'Building sustainable bridges with cultural centers, educational institutions, and civic organizations.',
        },
        {
          title: 'Community Solidarity',
          desc: 'Instilling a spirit of civic solidarity and empowering young people to serve their communities through arts.',
        },
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
              <span>{isAr ? 'الهوية والرسالة والرؤية المؤسساتية' : 'Identity, Mission & Vision'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#08242a] tracking-tight leading-tight">
              {dict.about.title}
            </h1>

            <p className="text-base sm:text-lg text-[#445457] max-w-3xl mx-auto leading-relaxed font-medium">
              {dict.about.description}
            </p>

            {/* In-page Navigation Tabs */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#values"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white border border-[#cfc7b9] text-[#0d3b43] hover:border-[#c85a32] hover:text-[#c85a32] transition-colors shadow-2xs"
              >
                {isAr ? 'أولاً: قيمنا الحاكمة' : '1. Core Values'}
              </a>
              <a
                href="#mission"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white border border-[#cfc7b9] text-[#0d3b43] hover:border-[#c85a32] hover:text-[#c85a32] transition-colors shadow-2xs"
              >
                {isAr ? 'ثانياً: رسالتنا' : '2. Our Mission'}
              </a>
              <a
                href="#vision"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white border border-[#cfc7b9] text-[#0d3b43] hover:border-[#c85a32] hover:text-[#c85a32] transition-colors shadow-2xs"
              >
                {isAr ? 'ثالثاً: رؤيتنا' : '3. Our Vision'}
              </a>
            </div>
          </div>
        </section>

        {/* ============================================================
            2. KEY FACTS PILLARS (INCLUDING MARRAKECH LAUNCHPAD)
            ============================================================ */}
        <section className="py-12 bg-white border-b border-[#e5e0d6]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-3xl bg-[#faf7f2] border border-[#e5e0d6] text-center">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5f7174] block mb-1">
                  {isAr ? 'سنة التأسيس' : 'Foundation Year'}
                </span>
                <span className="text-3xl font-black text-[#0d3b43] block">2026</span>
                <p className="text-xs text-[#5f7174] mt-2 leading-relaxed">
                  {isAr ? 'جمعية غير ربحية تأسست رسمياً بالمغرب' : 'Nonprofit cultural association founded in Morocco.'}
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#faf7f2] border border-[#e5e0d6] text-center">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5f7174] block mb-1">
                  {isAr ? 'نقطة الانطلاق والنطاق' : 'Origin & Reach'}
                </span>
                <span className="text-2xl font-black text-[#c85a32] block">
                  {isAr ? 'مراكش • المغرب' : 'Marrakech • Morocco'}
                </span>
                <p className="text-xs text-[#5f7174] mt-2 leading-relaxed">
                  {isAr
                    ? 'انطلاقاً من مراكش نحو مختلف جهات المملكة وشراكات دولية'
                    : 'From Marrakech across Morocco with global partnerships.'}
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#faf7f2] border border-[#e5e0d6] text-center">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5f7174] block mb-1">
                  {isAr ? 'القيم الموجهة' : 'Core Values'}
                </span>
                <span className="text-3xl font-black text-[#d99b26] block">7 {isAr ? 'قيم' : 'Values'}</span>
                <p className="text-xs text-[#5f7174] mt-2 leading-relaxed">
                  {isAr ? 'الإبداع، الشمولية، التضامن، والشفافية' : 'Creativity, Inclusivity, Solidarity & Transparency.'}
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#faf7f2] border border-[#e5e0d6] text-center">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5f7174] block mb-1">
                  {isAr ? 'البرنامج الرائد' : 'Flagship Initiative'}
                </span>
                <span className="text-xl font-black text-[#0d3b43] block mt-1">شباب في العمل</span>
                <p className="text-xs text-[#5f7174] mt-2 leading-relaxed">
                  {isAr ? 'تمكين الشباب والمواطنة الفاعلة والريادة' : 'Youth in Action cultural civic leadership.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            3. أولاً: قيمنا الحاكمة (OUR 7 CORE VALUES)
            ============================================================ */}
        <section id="values" className="py-20 bg-[#faf7f2] border-b border-[#e5e0d6] scroll-mt-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#c85a32] px-3 py-1 rounded-full bg-[#c85a32]/10 border border-[#c85a32]/20">
                {isAr ? 'أولاً: قيمنا' : 'I. Our Core Values'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#08242a]">
                {isAr ? 'القيم الأساسية الحاكمة لأنشطتنا' : 'Core Values Guiding Our Work'}
              </h2>
              <p className="text-sm sm:text-base text-[#445457] leading-relaxed">
                {isAr
                  ? 'تستند جمعية روح الفنون والثقافة (AMYCC) في عملها إلى مجموعة من القيم الأساسية التي توجه أنشطتها ومبادراتها، وتتمثل في:'
                  : 'The Spirit of Arts & Culture Association (AMYCC) is guided by fundamental values shaping all its programs:'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((v, idx) => (
                <div
                  key={v.key}
                  className={`p-7 rounded-3xl bg-white border border-[#e5e0d6] shadow-subtle hover:shadow-card hover:-translate-y-1 transition-all flex flex-col justify-between ${
                    idx === 6 ? 'md:col-span-2 lg:col-span-3' : ''
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="w-12 h-12 rounded-2xl bg-[#faf7f2] border border-[#e5e0d6] flex items-center justify-center text-2xl shadow-2xs">
                        {v.icon}
                      </span>
                      <span className="text-3xs font-extrabold uppercase tracking-widest text-[#819598] font-mono">
                        0{idx + 1}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-[#08242a] mb-2.5">
                      {v.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#445457] leading-relaxed">
                      {v.desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#f4ede2] flex items-center justify-between">
                    <span className="text-3xs font-bold text-[#819598] uppercase">AMYCC Value</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c85a32]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            4. ثانياً: رسالتنا (OUR MISSION)
            ============================================================ */}
        <section id="mission" className="py-20 bg-white border-b border-[#e5e0d6] scroll-mt-20 relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#0d3b43] px-3 py-1 rounded-full bg-[#0d3b43]/10 border border-[#0d3b43]/20">
                {isAr ? 'ثانياً: رسالتنا' : 'II. Our Mission'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#08242a]">
                {isAr ? 'رسالة جمعية روح الفنون والثقافة' : 'AMYCC Institutional Mission'}
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Pillar Quote Container */}
              <div className="lg:col-span-5 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#0d3b43] to-[#08242a] text-white flex flex-col justify-between shadow-card relative overflow-hidden">
                <div className="absolute top-0 end-0 w-48 h-48 bg-[#c85a32]/10 rounded-full blur-2xl pointer-events-none" />
                <div className="space-y-4 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-[#c85a32] text-white flex items-center justify-center font-bold text-2xl shadow-xs">
                    ✦
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black leading-snug text-white">
                    {isAr
                      ? 'لكل شاب موهبة وقدرات إبداعية تستحق الاكتشاف والرعاية والتطوير'
                      : 'Every young person has talent deserving discovery, care, and development'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#d8f0f4] leading-relaxed">
                    {isAr
                      ? 'يشكل الفن والثقافة وسيلة أساسية للتعبير عن الذات وتنمية المهارات وتعزيز التواصل الإيجابي بين أفراد المجتمع.'
                      : 'Art and culture are vital vehicles for self-expression, skill acquisition, and community cohesion.'}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#14505b] text-3xs text-[#f4ce83] flex items-center gap-2">
                  <span>📍</span>
                  <span>{isAr ? 'انطلاقاً من مدينة مراكش نحو مختلف ربوع الوطن' : 'Originating from Marrakech to all of Morocco'}</span>
                </div>
              </div>

              {/* Narrative Content */}
              <div className="lg:col-span-7 space-y-6 flex flex-col justify-center">
                <div className="p-7 rounded-3xl bg-[#faf7f2] border border-[#e5e0d6] shadow-subtle space-y-3">
                  <span className="text-3xs font-extrabold uppercase tracking-widest text-[#c85a32] font-mono">
                    {isAr ? 'المبدأ الأساسي' : 'Core Foundation'}
                  </span>
                  <p className="text-sm text-[#445457] leading-relaxed font-medium">
                    {isAr
                      ? 'تؤمن جمعية روح الفنون والثقافة (AMYCC) بأن لكل شاب موهبة وقدرات إبداعية تستحق الاكتشاف والرعاية والتطوير، وأن الفن والثقافة يشكلان وسيلة أساسية للتعبير عن الذات وتنمية المهارات وتعزيز التواصل بين أفراد المجتمع.'
                      : 'The Spirit of Arts & Culture Association (AMYCC) believes that every young person possesses unique artistic talents and creative capacities deserving discovery, nurturing, and growth, and that arts and culture represent essential vehicles for self-expression, skill-building, and social connection.'}
                  </p>
                </div>

                <div className="p-7 rounded-3xl bg-[#faf7f2] border border-[#e5e0d6] shadow-subtle space-y-3">
                  <span className="text-3xs font-extrabold uppercase tracking-widest text-[#0d3b43] font-mono">
                    {isAr ? 'مسارات العمل الميداني' : 'Operational Focus'}
                  </span>
                  <p className="text-sm text-[#445457] leading-relaxed">
                    {isAr
                      ? 'ومن هذا المنطلق، تعمل الجمعية على توفير فرص للشباب لاكتشاف مواهبهم وصقل قدراتهم في مختلف المجالات الفنية والثقافية، من خلال التكوين والورشات الإبداعية والأنشطة التربوية والمبادرات التطوعية والاجتماعية، بما يعزز ثقتهم بأنفسهم ويشجعهم على المشاركة الفعالة في خدمة المجتمع.'
                      : 'To this end, the association provides youth with transformative opportunities to discover and refine their artistic capabilities through specialized training, creative workshops, educational programs, and civic initiatives, empowering their self-confidence and active community engagement.'}
                  </p>
                </div>

                <div className="p-7 rounded-3xl bg-[#faf7f2] border border-[#e5e0d6] shadow-subtle space-y-3">
                  <span className="text-3xs font-extrabold uppercase tracking-widest text-[#d99b26] font-mono">
                    {isAr ? 'الانطلاق والشراكات' : 'Strategic Reach'}
                  </span>
                  <p className="text-sm text-[#445457] leading-relaxed">
                    {isAr
                      ? 'وانطلاقًا من مدينة مراكش، تسعى الجمعية إلى تطوير مبادرات مستدامة تستجيب لاحتياجات الشباب، وصون التراث الثقافي المغربي والتعريف به، وتشجيع التبادل الثقافي والانفتاح على التجارب المختلفة، إلى جانب بناء شراكات فعالة على المستويين الوطني والدولي، إيمانًا منها بأن الاستثمار في قدرات الشباب يساهم في بناء مجتمع أكثر إبداعًا وتنوعًا وتضامنًا.'
                      : 'Starting from the vibrant city of Marrakech, AMYCC develops sustainable initiatives responding to youth aspirations, safeguarding and celebrating Moroccan cultural heritage, fostering intercultural exchange, and building strategic partnerships nationally and globally.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            5. ثالثاً: رؤيتنا (OUR VISION & EXPANSION ROADMAP)
            ============================================================ */}
        <section id="vision" className="py-20 bg-[#faf7f2] border-b border-[#e5e0d6] scroll-mt-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#d99b26] px-3 py-1 rounded-full bg-[#d99b26]/10 border border-[#d99b26]/20">
                {isAr ? 'ثالثاً: رؤيتنا' : 'III. Our Vision'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#08242a]">
                {isAr ? 'الرؤية المستقبلية لجمعية روح الفنون والثقافة' : 'Long-Term Strategic Vision'}
              </h2>
            </div>

            {/* 3 Full Vision Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-white border-2 border-[#0d3b43]/20 shadow-subtle flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <span className="w-12 h-12 rounded-2xl bg-[#0d3b43] text-white flex items-center justify-center font-black text-xl shadow-xs">
                    01
                  </span>
                  <h3 className="text-lg font-black text-[#08242a]">
                    {isAr ? 'الريادة والشبكة المتكاملة' : 'Leadership & Integrated Network'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#445457] leading-relaxed">
                    {isAr
                      ? 'تطمح جمعية روح الفنون والثقافة (AMYCC) إلى أن تصبح جمعية رائدة في مجال الفنون والثقافة وتمكين الشباب، من خلال بناء شبكة متكاملة من الفروع والمبادرات تنطلق من المستوى الإقليمي، وتمتد إلى مختلف جهات المملكة المغربية، وصولًا إلى المستوى الوطني، ثم التوسع نحو بلدان أخرى عبر إحداث فروع وشراكات دولية.'
                      : 'AMYCC envisions becoming a leading organization in arts and youth empowerment by building an integrated network of chapters starting provincially, expanding across all Moroccan regions to the national level, and ultimately scaling internationally through global branches.'}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#f4ede2] text-3xs font-extrabold uppercase text-[#0d3b43]">
                  {isAr ? 'تدرج جغرافي مدروس' : 'Geographic Staging'}
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-white border-2 border-[#c85a32]/30 shadow-subtle flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <span className="w-12 h-12 rounded-2xl bg-[#c85a32] text-white flex items-center justify-center font-black text-xl shadow-xs">
                    02
                  </span>
                  <h3 className="text-lg font-black text-[#08242a]">
                    {isAr ? 'ترسيخ الحضور وتكافؤ الفرص' : 'Equal Opportunities & Territorial Reach'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#445457] leading-relaxed">
                    {isAr
                      ? 'ونسعى إلى ترسيخ حضور الجمعية في مختلف المناطق، وتوفير فرص متكافئة للشباب لاكتشاف مواهبهم وتطوير قدراتهم والمشاركة في الحياة الثقافية والاجتماعية، مع تعزيز التعاون وتبادل الخبرات بين الفروع داخل المغرب وخارجه.'
                      : 'We strive to establish a lasting presence across diverse territories, ensuring equitable opportunities for youth to discover their talents, develop skills, and participate in cultural life, while enriching collaboration between chapters.'}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#f4ede2] text-3xs font-extrabold uppercase text-[#c85a32]">
                  {isAr ? 'العدالة المجالية الثقافية' : 'Territorial Equity'}
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-white border-2 border-[#d99b26]/30 shadow-subtle flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <span className="w-12 h-12 rounded-2xl bg-[#d99b26] text-white flex items-center justify-center font-black text-xl shadow-xs">
                    03
                  </span>
                  <h3 className="text-lg font-black text-[#08242a]">
                    {isAr ? 'الاستدامة والامتداد الدولي' : 'Global Reach & Human Development'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#445457] leading-relaxed">
                    {isAr
                      ? 'ونطمح إلى بناء منظمة مستدامة ذات امتداد دولي، تجمع الشباب حول قيم الإبداع والتنوع والتضامن، وتجعل من الفن والثقافة وسيلتين للتنمية الإنسانية والتقارب بين الشعوب، مع الحفاظ على الهوية والتراث المغربي والانفتاح على الثقافات العالمية.'
                      : 'We aspire to cultivate a sustainable, internationally reaching organization uniting youth around creativity, diversity, and solidarity, leveraging arts as catalysts for human development and cross-cultural friendship while cherishing Moroccan heritage.'}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#f4ede2] text-3xs font-extrabold uppercase text-[#d99b26]">
                  {isAr ? 'أفق عالمي بهوية أصيلة' : 'Global Outlook, Authentic Roots'}
                </div>
              </div>
            </div>

            {/* Strategic Staging Roadmap Bar */}
            <div className="p-8 rounded-3xl bg-[#08242a] text-white space-y-6">
              <div className="text-center max-w-xl mx-auto space-y-1">
                <span className="text-3xs font-bold uppercase tracking-widest text-[#f4ce83]">
                  {isAr ? 'مسار التوسع والامتداد' : 'Expansion Roadmap'}
                </span>
                <h3 className="text-xl font-bold text-white">
                  {isAr ? 'خارطة التوسع المتكامل لجمعية AMYCC' : 'Strategic Network Phasing'}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#0d3b43] border border-[#14505b] space-y-1 text-center">
                  <span className="text-3xs font-extrabold text-[#f4ce83] block">المرحلة 01</span>
                  <span className="font-bold text-sm block text-white">{isAr ? 'المستوى الإقليمي' : 'Provincial Phase'}</span>
                  <span className="text-3xs text-[#74bfcd] block">{isAr ? 'الانطلاق من مدينة مراكش' : 'Marrakech Foundation'}</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#0d3b43] border border-[#14505b] space-y-1 text-center">
                  <span className="text-3xs font-extrabold text-[#f4ce83] block">المرحلة 02</span>
                  <span className="font-bold text-sm block text-white">{isAr ? 'جهات المملكة' : 'Regional Expansion'}</span>
                  <span className="text-3xs text-[#74bfcd] block">{isAr ? 'امتداد لمختلف جهات المغرب' : 'Across Moroccan Regions'}</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#0d3b43] border border-[#14505b] space-y-1 text-center">
                  <span className="text-3xs font-extrabold text-[#f4ce83] block">المرحلة 03</span>
                  <span className="font-bold text-sm block text-white">{isAr ? 'المستوى الوطني' : 'National Scale'}</span>
                  <span className="text-3xs text-[#74bfcd] block">{isAr ? 'شبكة متكاملة وحضور وطني' : 'Integrated National Network'}</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#0d3b43] border border-[#14505b] space-y-1 text-center">
                  <span className="text-3xs font-extrabold text-[#f4ce83] block">المرحلة 04</span>
                  <span className="font-bold text-sm block text-white">{isAr ? 'الامتداد الدولي' : 'Global Reach'}</span>
                  <span className="text-3xs text-[#74bfcd] block">{isAr ? 'فروع وشراكات دولية' : 'International Chapters'}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            6. STRATEGIC OBJECTIVES (الأهداف الاستراتيجية)
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
            7. ORGANIZATIONAL STRUCTURE & GOVERNANCE
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
            8. CTA SECTION
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

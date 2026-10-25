'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { IconWithFallback } from '@/components/ui/IconWithFallback'

interface AreaItem {
  key: string
  title: string
  desc: string
  icon: string
  iconImg: string
  tag: string
  accent: string
  bgGlow: string
  headline: string
  objectives: string[]
  initiatives: string[]
  primaryActionLabel: string
  primaryActionUrl: string
}

interface AreasSectionProps {
  locale: string
  sectionTitle: string
  sectionSubtitle: string
  eyebrowText: string
  learnMoreText: string
}

export function AreasSection({
  locale,
  sectionTitle,
  sectionSubtitle,
  eyebrowText,
  learnMoreText,
}: AreasSectionProps) {
  const [selectedArea, setSelectedArea] = useState<AreaItem | null>(null)

  const isAr = locale === 'ar'
  const isFr = locale === 'fr'

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedArea) {
      document.body.style.overflow = 'hidden'
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setSelectedArea(null)
      }
      window.addEventListener('keydown', handleKeyDown)
      return () => {
        document.body.style.overflow = ''
        window.removeEventListener('keydown', handleKeyDown)
      }
    } else {
      document.body.style.overflow = ''
    }
  }, [selectedArea])

  const areasList: AreaItem[] = [
    {
      key: 'arts',
      title: isAr ? 'الفنون والإبداع' : isFr ? 'Arts & Création' : 'Visual & Fine Arts',
      desc: isAr
        ? 'الفنون التشكيلية، الرسم، التصوير الفوتوغرافي، والورشات الإبداعية المحفزة على الابتكار.'
        : isFr
        ? 'Arts plastiques, peinture, photographie et ateliers de créativité stimulant l\'innovation.'
        : 'Visual arts, painting, photography, and creative masterclasses sparking youth innovation.',
      icon: '🎨',
      iconImg: '/icons/arts.png',
      tag: isAr ? 'محترفات تشكيلية ومعارض' : isFr ? 'Arts Plastiques' : 'Visual & Fine Arts',
      accent: 'border-[#c85a32]/30 text-[#c85a32]',
      bgGlow: 'from-[#fae4dc]/40 to-transparent',
      headline: isAr
        ? 'رعاية المواهب التشكيلية والبصرية وصقل الحس الجمالي لدى الشباب'
        : isFr
        ? 'Accompagnement des talents émergents et valorisation des arts visuels au Maroc'
        : 'Nurturing emerging visual arts talent and fostering creative expression across Morocco',
      objectives: isAr
        ? [
            'تنظيم محترفات تدريبية متخصصة في الرسم المعاصر، النحت، والخط العربي الأصيل.',
            'إقامة معارض فردية وجماعية لإبراز إبداعات الفنانين الشباب وربطهم بسوق الفن.',
            'توظيف الفنون البصرية في تجميل الفضاءات العمومية وجداريات الأحياء برؤية حضرية متجددة.',
          ]
        : isFr
        ? [
            'Organisation d\'ateliers spécialisés en peinture contemporaine, sculpture et calligraphie.',
            'Expositions collectives et individuelles pour propulser les jeunes artistes marocains.',
            'Réalisation de fresques murales valorisant l\'espace public et le vivre-ensemble.',
          ]
        : [
            'Specialized masterclasses in contemporary painting, sculpture, and classical Arabic calligraphy.',
            'Curated solo and collective exhibitions connecting emerging artists with art platforms.',
            'Community mural initiatives transforming urban spaces through inspiring visual arts.',
          ],
      initiatives: isAr
        ? [
            'محترف الرسم التشكيلي للناشئة والشباب',
            'المعرض السنوي "إشراقات بصرية"',
            'ملتقى التصوير الفوتوغرافي لتوثيق التراث المغربي',
          ]
        : isFr
        ? [
            'Atelier d\'arts plastiques pour les jeunes créateurs',
            'Exposition annuelle "Reflets Visuels"',
            'Rencontre photographique de sauvegarde du patrimoine',
          ]
        : [
            'Youth Fine Arts & Illustration Studio',
            'Annual "Visual Reflections" Art Showcase',
            'Heritage Documentary Photography Forum',
          ],
      primaryActionLabel: isAr ? 'استكشف برامج الفنون' : isFr ? 'Découvrir les programmes' : 'Explore Art Programs',
      primaryActionUrl: `/${locale}/programs`,
    },
    {
      key: 'music',
      title: isAr ? 'الموسيقى والصوتيات' : isFr ? 'Musique & Acoustique' : 'Heritage & Musical Arts',
      desc: isAr
        ? 'إحياء التراث الموسيقي المغربي الأصيل، والتأليف الموسيقي، والتدريب على الآلات.'
        : isFr
        ? 'Renaissance du patrimoine musical marocain, composition et formation instrumentale.'
        : 'Reviving authentic Moroccan musical heritage, composition, and instrument training.',
      icon: '🎵',
      iconImg: '/icons/music.png',
      tag: isAr ? 'تراث وأداء موسيقي' : isFr ? 'Patrimoine Musical' : 'Heritage & Musical Arts',
      accent: 'border-[#0d3b43]/30 text-[#0d3b43]',
      bgGlow: 'from-[#d8f0f4]/40 to-transparent',
      headline: isAr
        ? 'إحياء المقامات والطبوع المغربية الأصيلة وتطوير مهارات العزف والتأليف'
        : isFr
        ? 'Sauvegarde des répertoires traditionnels marocains et transmission instrumentale'
        : 'Preserving authentic Moroccan music genres and training the next generation of performers',
      objectives: isAr
        ? [
            'صون وتوثيق الأنغام والطبوع التراثية كالأندلسي، الملحون، كناوة، والأنماط الأمازيغية.',
            'توفير دورات تدريبية وتطبيقية على الآلات الكلاسيكية (العود، الكمان، القانون، والإيقاعات).',
            'تأطير الشباب في كتابة وتأليف الألحان الموسيقية الحديثة بروح مغربية متجذرة.',
          ]
        : isFr
        ? [
            'Préservation des patrimoines musicaux andalou, malhoun, gnawa et amazigh.',
            'Formations instrumentales pratiques (luth, violon, qanun et percussions marocaines).',
            'Accompagnement à la composition contemporaine inspirée de nos racines séculaires.',
          ]
        : [
            'Preserving and documenting Andalusian, Malhoun, Gnawa, and Amazigh musical traditions.',
            'Hands-on instrument masterclasses in Oud, classical strings, and traditional percussion.',
            'Supporting youth in contemporary music composition infused with Moroccan identity.',
          ],
      initiatives: isAr
        ? [
            'أمسيات "ليالي الروح والمقام"',
            'أكاديمية تدريب العزف على العود والوتريات',
            'استوديو التسجيل الصوتي لدعم المواهب الشابة',
          ]
        : isFr
        ? [
            'Soirées musicales "Nuits Spirituelles"',
            'Académie du luth et des instruments à cordes',
            'Studio d\'enregistrement pour les talents émergents',
          ]
        : [
            '"Spiritual Melodies" Concert Series',
            'Oud & Traditional Strings Youth Academy',
            'Acoustic Sound Lab for Emerging Talent',
          ],
      primaryActionLabel: isAr ? 'استكشف فعاليات الموسيقى' : isFr ? 'Voir les événements musicaux' : 'Explore Music Events',
      primaryActionUrl: `/${locale}/events`,
    },
    {
      key: 'theatre',
      title: isAr ? 'المسرح وفنون العرض' : isFr ? 'Théâtre & Arts Scéniques' : 'Theatre & Scenic Expression',
      desc: isAr
        ? 'التعبير المسرحي، فن الحكاية، الأداء الركحي، والورشات الدرامية للناشئة والشباب.'
        : isFr
        ? 'Expression théâtrale, art du conte, jeu scénique et ateliers dramatiques.'
        : 'Theatrical expression, traditional storytelling, stage performance, and drama workshops.',
      icon: '🎭',
      iconImg: '/icons/theatre.png',
      tag: isAr ? 'تعبير مسرحي وارتجال' : isFr ? 'Jeu Scénique' : 'Theatre & Scenic Expression',
      accent: 'border-[#d99b26]/40 text-[#d99b26]',
      bgGlow: 'from-[#fdf2db]/40 to-transparent',
      headline: isAr
        ? 'المسرح كمرآة للمجتمع، وسيلة للتعبير الحر، ومدرسة لتنمية الثقة والخطابة'
        : isFr
        ? 'Le théâtre comme vecteur d\'émancipation citoyenne, d\'éloquence et de cohésion'
        : 'Theatre as a mirror of society, a catalyst for critical thinking and public eloquence',
      objectives: isAr
        ? [
            'تنمية مهارات التعبير الجسدي والصوتي، وفن الارتجال المسرحي لدى الشباب.',
            'إحياء فن الحكاية الشعبية التراثية (الحلقة) بأساليب سينوغرافية معاصرة ومبتكرة.',
            'إنتاج عروض مسرحية هادفة تعالج القضايا الإنسانية والمجتمعية الراهنة بروح نقدية.',
          ]
        : isFr
        ? [
            'Développement de l\'expression corporelle, de la maîtrise vocale et de l\'improvisation.',
            'Réinvention scénographique contemporaine du conte traditionnel marocain (Halqa).',
            'Production de spectacles engagés abordant avec sensibilité les enjeux de jeunesse.',
          ]
        : [
            'Cultivating stage presence, vocal projection, and theatrical improvisation skills.',
            'Reimagining classical Moroccan storytelling (Halqa) through contemporary staging.',
            'Producing socially engaged stage productions that spark dialogue and empathy.',
          ],
      initiatives: isAr
        ? [
            'محترف إعداد الممثل والسينوغرافيا',
            'ملتقى الحكواتي وفنون الركح',
            'جولة المسرح التفاعلي بدور الشباب والمراكز الثقافية',
          ]
        : isFr
        ? [
            'Atelier du comédien et scénographie',
            'Festival du conteur et des arts de la scène',
            'Tournée de théâtre interactif dans les maisons de jeunes',
          ]
        : [
            'Actor Training & Scenography Studio',
            'Storytellers & Stage Arts Showcase',
            'Interactive Youth Theatre Community Tour',
          ],
      primaryActionLabel: isAr ? 'شاهد مسرحيات الجمعية' : isFr ? 'Voir nos pièces de théâtre' : 'View Theatre Plays',
      primaryActionUrl: `/${locale}/events`,
    },
    {
      key: 'culture',
      title: isAr ? 'الثقافة والتراث' : isFr ? 'Culture & Patrimoine' : 'Moroccan Cultural Heritage',
      desc: isAr
        ? 'حماية وتثمين التنوع الثقافي المغربي، والموروث الشفهي، والتقاليد الوطنية الأصيلة.'
        : isFr
        ? 'Sauvegarde et valorisation de la diversité culturelle marocaine et du patrimoine oral.'
        : 'Safeguarding and celebrating authentic Moroccan heritage, oral history, and traditions.',
      icon: '🏛️',
      iconImg: '/icons/culture.png',
      tag: isAr ? 'صون الذاكرة والتراث' : isFr ? 'Patrimoine & Mémoire' : 'Moroccan Cultural Heritage',
      accent: 'border-[#0d3b43]/30 text-[#0d3b43]',
      bgGlow: 'from-[#d8f0f4]/40 to-transparent',
      headline: isAr
        ? 'حماية الذاكرة الوطنية، وتثمين التنوع الثقافي المغربي الزاخر عبر الأجيال'
        : isFr
        ? 'Préservation de la mémoire nationale et valorisation de la riche diversité marocaine'
        : 'Preserving national cultural memory and celebrating Morocco\'s diverse heritage',
      objectives: isAr
        ? [
            'توثيق الحرف والصناعات التقليدية وفنون العمارة التاريخية من خلال الأرشفة الرقمية.',
            'ترسيخ الاعتزاز بالهوية المغربية المتعددة الروافد (العربية، الأمازيغية، الحسانية، والأندلسية).',
            'تنظيم زيارات ميدانية استكشافية للمآثر والمدن العتيقة لربط الجيل الصاعد بجذوره.',
          ]
        : isFr
        ? [
            'Documentation et archivage numérique des savoir-faire artisanaux et de l\'architecture.',
            'Célébration des confluents pluriels de l\'identité marocaine (arabe, amazigh, hassani).',
            'Visites pédagogiques immersives dans les médinas historiques et monuments majeurs.',
          ]
        : [
            'Digital documentation and archiving of traditional crafts, architecture, and folklore.',
            'Celebrating the pluralistic foundations of Moroccan identity (Arab, Amazigh, Hassani).',
            'Organizing educational immersive journeys to historic medinas and cultural landmarks.',
          ],
      initiatives: isAr
        ? [
            'منصة الأرشيف الرقمي للتراث الشفهي',
            'سلسلة ندوات "ذاكرة المكان والمبدع"',
            'دليل المسارات الثقافية بالمدن المغربية',
          ]
        : isFr
        ? [
            'Plateforme numérique des archives orales',
            'Conférences "Mémoire des Lieux et Créateurs"',
            'Guide des circuits culturels du Maroc',
          ]
        : [
            'Oral History & Folklore Digital Archive',
            '"Memory of Places & Makers" Symposia Series',
            'Moroccan Cultural Heritage Trail Guide',
          ],
      primaryActionLabel: isAr ? 'رؤية الجمعية للتراث' : isFr ? 'Notre vision du patrimoine' : 'Our Heritage Vision',
      primaryActionUrl: `/${locale}/about#vision`,
    },
    {
      key: 'youth',
      title: isAr ? 'تمكين الشباب' : isFr ? 'Autonomisation des Jeunes' : 'Youth Leadership & Skills',
      desc: isAr
        ? 'بناء القدرات القيادية، ورشات التكوين، والتوجيه المهني في المهن الفنية والثقافية.'
        : isFr
        ? 'Renforcement du leadership, ateliers de formation et orientation dans les métiers créatifs.'
        : 'Building leadership capacity, professional mentorship, and creative career guidance.',
      icon: '🚀',
      iconImg: '/icons/youth.png',
      tag: isAr ? 'تكوين وقيادة شبابية' : isFr ? 'Leadership Jeunesse' : 'Youth Leadership & Skills',
      accent: 'border-[#c85a32]/30 text-[#c85a32]',
      bgGlow: 'from-[#fae4dc]/40 to-transparent',
      headline: isAr
        ? 'بناء القيادات الإبداعية وتأهيل الشباب لولوج المهن الثقافية والفنية باحترافية'
        : isFr
        ? 'Formation des leaders culturels et accompagnement à l\'insertion professionnelle créative'
        : 'Fostering creative leaders and preparing youth for cultural career opportunities',
      objectives: isAr
        ? [
            'تأطير الشباب في إدارة المشاريع الثقافية، التدبير اللوجستي، والتسويق الرقمي للفعاليات.',
            'توفير الإرشاد والمرافقة المهنية للمشاريع الإبداعية والشركات الناشئة في مجال الفنون.',
            'صقل المهارات الحياتية كالتفاوض، القيادة التشاركية، والعمل الميداني المنظم.',
          ]
        : isFr
        ? [
            'Gestion de projets culturels, ingénierie événementielle et marketing digital.',
            'Incubation et mentorat personnalisé pour les initiatives et startups créatives.',
            'Développement des compétences de vie (leadership collaboratif, prise de parole, négociation).',
          ]
        : [
            'Comprehensive training in cultural project management, logistics, and digital event marketing.',
            'Professional mentorship and incubation for youth-led artistic ventures and cultural initiatives.',
            'Strengthening soft skills: collaborative leadership, public speaking, and team problem-solving.',
          ],
      initiatives: isAr
        ? [
            'أكاديمية التدبير الثقافي للشباب',
            'مختبر الابتكار الاجتماعي الإبداعي',
            'برنامج التوجيه والمرافقة للمبدعين الصاعدين',
          ]
        : isFr
        ? [
            'Académie du management culturel pour jeunes',
            'Laboratoire d\'innovation sociale et artistique',
            'Programme de mentorat pour artistes émergents',
          ]
        : [
            'Youth Cultural Management Academy',
            'Creative Social Innovation Incubator',
            'Emerging Creatives Mentorship Cohort',
          ],
      primaryActionLabel: isAr ? 'انضم إلى برامج التمكين' : isFr ? 'Rejoindre l\'académie' : 'Join Leadership Programs',
      primaryActionUrl: `/${locale}/membership`,
    },
    {
      key: 'community',
      title: isAr ? 'العمل المجتمعي والتطوع' : isFr ? 'Action Communautaire' : 'Civic Volunteering Program',
      desc: isAr
        ? 'التطوع المدني، تنشيط الأحياء، والأنشطة الثقافية التضامنية ذات الأثر الإيجابي.'
        : isFr
        ? 'Bénévolat civique, animation des quartiers et actions culturelles solidaires.'
        : 'Civic volunteering, neighborhood cultural outreach, and impactful community actions.',
      icon: '🤝',
      iconImg: '/icons/community.png',
      tag: isAr ? 'مبادرة شباب في العمل' : isFr ? 'Jeunesse en Action' : 'Civic Volunteering Program',
      accent: 'border-[#d99b26]/40 text-[#d99b26]',
      bgGlow: 'from-[#fdf2db]/40 to-transparent',
      headline: isAr
        ? 'إشاعة الفن في كل حي وترسيخ ثقافة التطوع الإيجابي لخدمة الصالح العام'
        : isFr
        ? 'Démocratisation de l\'accès à la culture et engagement civique solidaire'
        : 'Democratizing cultural access and empowering youth through civic volunteering',
      objectives: isAr
        ? [
            'قيادة مبادرة "شباب في العمل" التطوعية لتنظيم وتأطير التظاهرات والمهرجانات الثقافية.',
            'إطلاق قوافل ثقافية متنقلة تستهدف المراكز القروية والأحياء الأقل تجهيزاً.',
            'منح المتطوعين شواهد خبرة وتجربة موثقة تفتح لهم آفاق الاندماج الاجتماعي والمهني.',
          ]
        : isFr
        ? [
            'Pilotage de l\'initiative citoyenne "Jeunesse en Action" pour animer les festivals.',
            'Caravanes culturelles solidaires dans les zones rurales et quartiers prioritaires.',
            'Délivrance d\'attestations certifiées valorisant l\'engagement civique et les compétences.',
          ]
        : [
            'Leading the "Youth in Action" volunteering framework for cultural event production.',
            'Mobile solidarity caravans delivering workshops to rural and underserved communities.',
            'Providing verified volunteering certifications that enhance professional career prospects.',
          ],
      initiatives: isAr
        ? [
            'مبادرة "شباب في العمل" — AMYCC',
            'قافلة الفنون المتنقلة للمدارس ودور الشباب',
            'الملتقى السنوي للاحتفاء بالمتطوعين والشركاء',
          ]
        : isFr
        ? [
            'Initiative citoyenne "Jeunesse en Action"',
            'Caravane artistique mobile pour les écoles',
            'Célébration annuelle des bénévoles et partenaires',
          ]
        : [
            '"Youth in Action" Civic Volunteering Hub',
            'Mobile Arts Caravan for Schools & Community Centers',
            'Annual Volunteer Appreciation & Community Awards',
          ],
      primaryActionLabel: isAr ? 'تطوع في شباب في العمل' : isFr ? 'Postuler au bénévolat' : 'Apply for Volunteering',
      primaryActionUrl: `/${locale}/programs/youth-in-action`,
    },
  ]

  return (
    <>
      <section className="py-20 lg:py-28 bg-white border-b border-[#e5e0d6]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0d3b43]">
              {eyebrowText}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#08242a] mt-2 mb-4">
              {sectionTitle}
            </h2>
            <p className="text-base text-[#445457] leading-relaxed">
              {sectionSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {areasList.map((area) => (
              <div
                key={area.key}
                className="bg-[#faf7f2] p-7 rounded-3xl border border-[#e5e0d6] shadow-subtle hover:shadow-card hover:border-[#cfc7b9] transition-all flex flex-col justify-between group relative overflow-hidden text-start"
              >
                <div
                  className={`absolute top-0 end-0 w-32 h-32 bg-gradient-to-bl ${area.bgGlow} rounded-bl-full pointer-events-none`}
                />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-white border border-[#e5e0d6] flex items-center justify-center p-2.5 text-3xl shadow-2xs group-hover:scale-105 transition-transform overflow-hidden">
                      <IconWithFallback
                        src={area.iconImg}
                        fallbackEmoji={area.icon}
                        alt={area.title}
                        size={36}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span
                      className={`text-4xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full border bg-white ${area.accent}`}
                    >
                      {area.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-[#08242a] mb-2.5">
                    {area.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#445457] leading-relaxed mb-6">
                    {area.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#e5e0d6] relative z-10">
                  <button
                    type="button"
                    onClick={() => setSelectedArea(area)}
                    className="inline-flex items-center text-xs font-bold text-[#0d3b43] hover:text-[#c85a32] transition-colors cursor-pointer group/btn"
                  >
                    <span>{learnMoreText}</span>
                    <span
                      aria-hidden="true"
                      className="ms-1 transform transition-transform group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1"
                    >
                      ←
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          INTERACTIVE MODAL WINDOW (نافذة منبثقة تفاعلية لكل مجال)
          ============================================================ */}
      {selectedArea && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="area-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedArea(null)
          }}
        >
          <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-[#e5e0d6] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col my-8 animate-in zoom-in-95 duration-200 text-start">
            {/* Top Colored Accent Stripe */}
            <div className="h-2.5 w-full bg-gradient-to-r from-[#c85a32] via-[#f4ce83] to-[#0d3b43]" />

            {/* Modal Header */}
            <div className="p-6 sm:p-7 border-b border-[#f0ebe1] flex items-start justify-between gap-4 relative bg-[#faf7f2]/50">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white border border-[#e5e0d6] flex items-center justify-center p-2.5 text-3xl shadow-sm shrink-0">
                  <IconWithFallback
                    src={selectedArea.iconImg}
                    fallbackEmoji={selectedArea.icon}
                    alt={selectedArea.title}
                    size={38}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="space-y-1">
                  <span
                    className={`inline-block text-4xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border bg-white ${selectedArea.accent}`}
                  >
                    {selectedArea.tag}
                  </span>
                  <h3
                    id="area-modal-title"
                    className="text-xl sm:text-2xl font-black text-[#08242a] tracking-tight"
                  >
                    {selectedArea.title}
                  </h3>
                  <p className="text-xs text-[#5f7174] font-medium leading-relaxed max-w-lg">
                    {selectedArea.headline}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedArea(null)}
                className="w-9 h-9 rounded-full bg-white hover:bg-[#faf7f2] border border-[#e5e0d6] text-[#08242a] flex items-center justify-center font-bold text-sm transition-all shadow-2xs shrink-0 cursor-pointer hover:rotate-90"
                aria-label={isAr ? 'إغلاق النافذة' : 'Close window'}
              >
                ✕
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 sm:p-7 overflow-y-auto space-y-6 flex-1">
              {/* Comprehensive Description Box */}
              <div className="p-4 rounded-2xl bg-[#faf7f2] border border-[#e5e0d6] text-xs sm:text-sm text-[#445457] leading-relaxed">
                {selectedArea.desc}
              </div>

              {/* Strategic Objectives */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#0d3b43] text-white flex items-center justify-center text-xs font-bold shrink-0">
                    🎯
                  </span>
                  <h4 className="text-xs sm:text-sm font-black text-[#08242a] uppercase tracking-wide">
                    {isAr
                      ? 'الأهداف والمحاور الاستراتيجية'
                      : isFr
                      ? 'Objectifs Stratégiques & Axes'
                      : 'Strategic Objectives & Priorities'}
                  </h4>
                </div>

                <ul className="space-y-2.5 ps-1">
                  {selectedArea.objectives.map((obj, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-xs text-[#445457] leading-relaxed"
                    >
                      <span className="text-[#0d3b43] font-bold text-sm shrink-0 mt-0.5">
                        ✓
                      </span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Key Initiatives & Workshops */}
              <div className="space-y-3 pt-4 border-t border-[#f0ebe1]">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#c85a32] text-white flex items-center justify-center text-xs font-bold shrink-0">
                    ✨
                  </span>
                  <h4 className="text-xs sm:text-sm font-black text-[#08242a] uppercase tracking-wide">
                    {isAr
                      ? 'أبرز البرامج والورشات الميدانية'
                      : isFr
                      ? 'Initiatives Phares & Ateliers'
                      : 'Featured Initiatives & Workshops'}
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {selectedArea.initiatives.map((init, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-white border border-[#e5e0d6] shadow-2xs hover:border-[#0d3b43]/40 transition-colors"
                    >
                      <span className="text-3xs font-extrabold text-[#c85a32] block mb-1">
                        0{i + 1}
                      </span>
                      <span className="text-2xs font-bold text-[#08242a] block leading-snug">
                        {init}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Note / Civic Framework */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-3xs text-amber-900 leading-relaxed flex items-center gap-2.5">
                <span className="text-base shrink-0">🏛️</span>
                <span>
                  {isAr
                    ? 'تعمل الجمعية على تفعيل هذا المجال بالشراكة مع المراكز الثقافية، دور الشباب، والمؤسسات التعليمية لضمان إتاحة الفنون للجميع.'
                    : isFr
                    ? 'L\'AMYCC déploie cet axe en partenariat avec les centres culturels et les maisons de jeunes pour démocratiser l\'art.'
                    : 'AMYCC implements this domain in partnership with cultural centers and schools to ensure open access to the arts.'}
                </span>
              </div>
            </div>

            {/* Modal Footer Bar */}
            <div className="p-4 sm:p-5 border-t border-[#f0ebe1] bg-[#faf7f2] flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedArea(null)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-[#5f7174] bg-white border border-[#e5e0d6] hover:bg-[#f0ebe1] transition-all cursor-pointer text-center"
              >
                {isAr ? 'إغلاق النافذة' : isFr ? 'Fermer' : 'Close'}
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Link
                  href={selectedArea.primaryActionUrl}
                  onClick={() => setSelectedArea(null)}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-black text-white bg-[#0d3b43] hover:bg-[#14505b] active:scale-98 transition-all text-center shadow-xs"
                >
                  {selectedArea.primaryActionLabel} →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

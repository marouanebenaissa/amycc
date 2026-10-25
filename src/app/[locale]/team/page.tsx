import { getDictionary } from '@/lib/i18n/dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'

export default async function TeamPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const dict = await getDictionary(locale)
  const isAr = locale === 'ar'
  const isFr = locale === 'fr'

  // Executive Board Roles (compliant with Moroccan Dahir No. 1.58.376 on Non-Profit Associations)
  const executiveBoard = [
    {
      id: 'president',
      role: isAr ? 'رئيس(ة) الجمعية' : isFr ? 'Président(e) de l’Association' : 'President of the Association',
      titleStatus: isAr ? 'التمثيل القانوني والتوجيه الاستراتيجي' : isFr ? 'Représentation Légale & Stratégie' : 'Legal Representation & Strategic Direction',
      badgeStatus: isAr ? 'عضوية معتمدة بالنظام الأساسي' : isFr ? 'Mandat Statutaire' : 'Statutory Mandate',
      desc: isAr
        ? 'التمثيل القانوني للجمعية أمام السلطات العمومية والشركاء، الإشراف العام على التوجهات الاستراتيجية، والدعوة لاجتماعات المكتب التنفيذي والجموع العامة.'
        : isFr
        ? 'Représentation légale de l’association auprès des autorités et partenaires, coordination stratégique et convocation des assemblées générales et réunions du bureau.'
        : 'Official legal representative of the association before authorities and partners, overseeing strategic orientation and executive board coordination.',
      icon: '🏛️',
      colorClass: 'border-[#0d3b43]/30 hover:border-[#0d3b43]',
      accentBg: 'bg-[#0d3b43]/10 text-[#0d3b43]',
      duties: isAr
        ? ['إبرام الشراكات والاتفاقيات الرسمية', 'السهر على احترام القانون الأساسي والداخلي', 'الناطق الرسمي باسم الجمعية']
        : isFr
        ? ['Signature des accords officiels', 'Garant du respect des statuts associatifs', 'Porte-parole institutionnel']
        : ['Executing official agreements & partnerships', 'Safeguarding statutory bylaws compliance', 'Official association spokesperson'],
    },
    {
      id: 'secretary_general',
      role: isAr ? 'الكاتب(ة) العام' : isFr ? 'Secrétaire Général(e)' : 'Secretary General',
      titleStatus: isAr ? 'التدبير الإداري والتوثيق' : isFr ? 'Administration & Documentation' : 'Administration & Documentation',
      badgeStatus: isAr ? 'عضوية معتمدة بالنظام الأساسي' : isFr ? 'Mandat Statutaire' : 'Statutory Mandate',
      desc: isAr
        ? 'تسيير الشؤون الإدارية للجمعية، تحرير وتوثيق محاضر الاجتماعات والجموع العامة، وحفظ السجلات الرسمية وملفات المنخرطين والأرشيف المؤسساتي.'
        : isFr
        ? 'Gestion administrative, rédaction et conservation des procès-verbaux, tenue du registre des adhérents et correspondances institutionnelles officielles.'
        : 'Managing administrative operations, drafting official minutes, archiving records, and maintaining the verified membership registry.',
      icon: '📜',
      colorClass: 'border-[#c85a32]/30 hover:border-[#c85a32]',
      accentBg: 'bg-[#c85a32]/10 text-[#c85a32]',
      duties: isAr
        ? ['تحرير وتوثيق المحاضر والتقارير الأدبية', 'ضبط سجلات الانخراط وملفات العضوية', 'التنسيق الإداري والمراسلات الرسمية']
        : isFr
        ? ['Rédaction des procès-verbaux et rapports moraux', 'Tenue rigoureuse du registre des adhérents', 'Liaison administrative et correspondances officielles']
        : ['Drafting minutes and annual moral reports', 'Maintaining membership and volunteer registries', 'Managing administrative and official communications'],
    },
    {
      id: 'treasurer',
      role: isAr ? 'أمين(ة) المال' : isFr ? 'Trésorier(ère) Général(e)' : 'General Treasurer',
      titleStatus: isAr ? 'التدبير المالي والرقابة المحاسبية' : isFr ? 'Gestion Financière & Comptabilité' : 'Financial Management & Accounting',
      badgeStatus: isAr ? 'عضوية معتمدة بالنظام الأساسي' : isFr ? 'Mandat Statutaire' : 'Statutory Mandate',
      desc: isAr
        ? 'التدبير المالي والمحاسباتي المدقق، إعداد الميزانيات التقديرية والتقارير المالية السنوية، والإشراف المباشر على الحساب البنكي الرسمي وسندات الصرف.'
        : isFr
        ? 'Gestion financière et comptable rigoureuse, élaboration des bilans annuels certifiés et suivi transparent du compte bancaire officiel de l’association.'
        : 'Overseeing financial stewardship, maintaining verified bookkeeping, managing official bank operations, and presenting annual financial statements.',
      icon: '💼',
      colorClass: 'border-[#d99b26]/30 hover:border-[#d99b26]',
      accentBg: 'bg-[#d99b26]/10 text-[#99620b]',
      duties: isAr
        ? ['المسك المحاسباتي والتدبير البنكي الرسمي', 'إعداد التقرير المالي السنوي للافتحاص', 'توثيق وصولات التبرعات وسندات النفقات']
        : isFr
        ? ['Tenue de la comptabilité et gestion bancaire', 'Élaboration du rapport financier annuel pour audit', 'Émission des reçus officiels et suivi des dépenses']
        : ['Verified accounting & official bank administration', 'Compiling annual financial report for audit', 'Issuing receipts & tracking program budgets'],
    },
    {
      id: 'vice_president',
      role: isAr ? 'نائب(ة) الرئيس' : isFr ? 'Vice-Président(e)' : 'Vice President',
      titleStatus: isAr ? 'التنسيق المؤسساتي والميداني' : isFr ? 'Coordination Institutionnelle' : 'Institutional Coordination',
      badgeStatus: isAr ? 'عضوية معتمدة بالنظام الأساسي' : isFr ? 'Mandat Statutaire' : 'Statutory Mandate',
      desc: isAr
        ? 'مؤازرة الرئاسة في المهام التمثيلية والنيابة عنها عند الاقتضاء، وتنسيق العلاقات مع شبكة الفروع والمراكز الثقافية ودور الشباب الشريكة بالمملكة.'
        : isFr
        ? 'Appui direct à la présidence, intérim statutaire et coordination des partenariats avec les centres culturels, maisons de jeunes et partenaires associatifs.'
        : 'Assisting executive leadership, serving as deputy, and steering collaborative alliances with youth centers and cultural venues.',
      icon: '🤝',
      colorClass: 'border-[#1c6875]/30 hover:border-[#1c6875]',
      accentBg: 'bg-[#1c6875]/10 text-[#1c6875]',
      duties: isAr
        ? ['التنسيق الميداني للشراكات المؤسساتية', 'تتبع المبادرات في دور الشباب والمراكز', 'النيابة التمثيلية بتفويض من الرئاسة']
        : isFr
        ? ['Coordination des partenariats institutionnels', 'Suivi des programmes dans les maisons de jeunes', 'Délégation légale de représentation']
        : ['Field coordination of institutional partnerships', 'Program monitoring across cultural centers', 'Delegated legal executive representation'],
    },
    {
      id: 'deputy_secretary',
      role: isAr ? 'نائب(ة) الكاتب العام' : isFr ? 'Secrétaire Général(e) Adjoint(e)' : 'Deputy Secretary General',
      titleStatus: isAr ? 'التنظيم الداخلي والتنسيق' : isFr ? 'Coordination Interne' : 'Internal Coordination',
      badgeStatus: isAr ? 'عضوية معتمدة بالنظام الأساسي' : isFr ? 'Mandat Statutaire' : 'Statutory Mandate',
      desc: isAr
        ? 'مساندة الكتابة العامة في التواصل الإداري الداخلي، تدبير منصات التسجيل الرقمي، وإعداد الدعوات والمطبوعات الخاصة بالفعاليات والجموع العامة.'
        : isFr
        ? 'Soutien aux fonctions du secrétariat général, gestion des plateformes d’inscription numérique et préparation des convocations aux assemblées.'
        : 'Supporting the secretary general, managing registration platforms, preparing official notices, and handling internal logistics.',
      icon: '📋',
      colorClass: 'border-[#08242a]/30 hover:border-[#08242a]',
      accentBg: 'bg-[#08242a]/10 text-[#08242a]',
      duties: isAr
        ? ['تدبير طلبات العضوية والمنخرطين رقمياً', 'تنظيم الأرشيف والمستندات الورقية والإلكترونية', 'الإشراف على إشعارات ودعوات الأنشطة']
        : isFr
        ? ['Traitement numérique des demandes d’adhésion', 'Archivage des documents physiques et digitaux', 'Diffusion des convocations et annonces officielles']
        : ['Digital intake of membership applications', 'Archiving physical and electronic documents', 'Circulating notices and formal callouts'],
    },
    {
      id: 'deputy_treasurer',
      role: isAr ? 'نائب(ة) أمين المال' : isFr ? 'Trésorier(ère) Adjoint(e)' : 'Deputy Treasurer',
      titleStatus: isAr ? 'التدبير اللوجستي والمالي للميدان' : isFr ? 'Logistique Financière de Terrain' : 'Field Logistics & Budget Tracking',
      badgeStatus: isAr ? 'عضوية معتمدة بالنظام الأساسي' : isFr ? 'Mandat Statutaire' : 'Statutory Mandate',
      desc: isAr
        ? 'مساندة أمانة المال في تدبير لوجستيك المشتريات الميدانية، جرد ممتلكات وتجهيزات الجمعية، وضبط فواتير ومصروفات الورشات الفنية.'
        : isFr
        ? 'Appui au trésorier général dans la gestion des achats de terrain, inventaire des équipements artistiques et suivi des justificatifs de dépenses.'
        : 'Assisting the treasurer in purchasing logistics, maintaining cultural assets inventory, and tracking receipts for field workshops.',
      icon: '⚖️',
      colorClass: 'border-[#99620b]/30 hover:border-[#99620b]',
      accentBg: 'bg-[#99620b]/10 text-[#99620b]',
      duties: isAr
        ? ['جرد وصيانة التجهيزات والمواد الفنية', 'ضبط وصولات المصاريف الميدانية الصغرى', 'المطابقة الدورية لسجلات المقتنيات']
        : isFr
        ? ['Inventaire et entretien du matériel artistique', 'Contrôle des pièces justificatives de terrain', 'Rapprochement des dépenses opérationnelles']
        : ['Inventory and upkeep of artistic equipment', 'Verification of field operational receipts', 'Periodic audit of program procurement'],
    },
  ]

  // The 6 Functional & Field Commissions
  const committees = [
    {
      id: 'visual-arts',
      title: isAr ? 'لجنة الفنون البصرية والتشكيلية' : isFr ? 'Commission Arts Visuels & Calligraphie' : 'Visual Arts & Calligraphy Committee',
      tag: isAr ? 'محترفات إبداعية' : isFr ? 'Ateliers Créatifs' : 'Creative Labs',
      desc: isAr
        ? 'تأطير ورشات الرسم التشكيلي، الصباغة المائية والزيتية، النحت، وفنون الخط المغربي الأصيل، وتنظيم المعارض الدورية للمواهب الصاعدة.'
        : isFr
        ? 'Conception et animation des ateliers de peinture, sculpture, dessin et calligraphie marocaine, accompagnés d’expositions collectives régulières.'
        : 'Curating masterclasses in fine arts, watercolor, sculpture, and Moroccan calligraphy, organizing seasonal exhibitions for emerging talents.',
      icon: '🎨',
      borderClass: 'border-[#c85a32]/30 hover:border-[#c85a32]',
      accentColor: 'text-[#c85a32]',
      accentBg: 'bg-[#c85a32]/10',
      points: isAr
        ? ['ورشات تطبيقية دورية في دور الشباب والمراكز الثقافية', 'تنظيم معارض جماعية ومسابقات تشكيلية سنوية', 'صون وتثمين أساليب الخط والزخرفة المغربية']
        : isFr
        ? ['Ateliers pratiques réguliers dans les structures partenaires', 'Organisation d’expositions collectives et concours d’art', 'Mise en valeur de la calligraphie et du patrimoine visuel']
        : ['Regular practical workshops across community cultural centers', 'Annual group exhibitions and youth art showcases', 'Preserving Moroccan calligraphy and decorative traditions'],
    },
    {
      id: 'theatre',
      title: isAr ? 'لجنة المسرح وفنون الأداء التعبيري' : isFr ? 'Commission Théâtre & Arts Scéniques' : 'Theatre & Performing Arts Committee',
      tag: isAr ? 'أداء تعبيري وخشبة' : isFr ? 'Scène & Dramaturgie' : 'Stage & Drama',
      desc: isAr
        ? 'إعداد محترفات التشخيص المسرحي، الإلقاء، السينوغرافيا، والارتجال، وإنتاج عروض مسرحية هادفة تعالج قضايا الشباب وتنمي حس التواصل.'
        : isFr
        ? 'Encadrement des ateliers de dramaturgie, scénographie, diction et improvisation, avec création de spectacles citoyens portés par les jeunes.'
        : 'Leading masterclasses in stage acting, dramatic improvisation, voice projection, and producing thought-provoking civic youth plays.',
      icon: '🎭',
      borderClass: 'border-[#0d3b43]/30 hover:border-[#0d3b43]',
      accentColor: 'text-[#0d3b43]',
      accentBg: 'bg-[#0d3b43]/10',
      points: isAr
        ? ['محترفات الارتجال المسرحي والتعبير الجسدي', 'كتابة وإنتاج مسرحيات شبابية ذات طابع توعوي', 'المشاركة في المهرجانات والملتقيات الثقافية الوطنية']
        : isFr
        ? ['Ateliers d’improvisation et d’expression corporelle', 'Écriture et production de pièces théâtrales engagées', 'Participation aux festivals et rencontres artistiques nationales']
        : ['Stage improvisation and body expression clinics', 'Scripting and producing awareness-raising youth plays', 'Participating in national and regional theatre festivals'],
    },
    {
      id: 'music-heritage',
      title: isAr ? 'لجنة التراث الموسيقي والغناء الأصيل' : isFr ? 'Commission Patrimoine Musical & Rythmes' : 'Musical Heritage & Rhythms Committee',
      tag: isAr ? 'هوية وأصالة مغربية' : isFr ? 'Patrimoine Vivant' : 'Living Heritage',
      desc: isAr
        ? 'صون الموروث النغمي والموسيقي المغربي بروافده المتنوعة (الأندلسي، الملحون، كناوة، الأمازيغي، والحساني)، وتدريب الناشئة على الآلات الأصيلة.'
        : isFr
        ? 'Préservation des répertoires musicaux marocains pluriels (andalou, malhoun, gnawa, amazigh et hassani) et initiation aux instruments traditionnels.'
        : 'Safeguarding Moroccan musical traditions (Andalusian, Malhoun, Gnawa, Amazigh, Hassani) and training youth on acoustic instruments.',
      icon: '🎵',
      borderClass: 'border-[#d99b26]/30 hover:border-[#d99b26]',
      accentColor: 'text-[#99620b]',
      accentBg: 'bg-[#d99b26]/10',
      points: isAr
        ? ['تكوين عملي في العزف على العود والوتريات والإيقاعات', 'توثيق القصائد والأهازيج التراثية الأصيلة', 'تنظيم أمسيات موسيقية وسماع فني راقٍ']
        : isFr
        ? ['Apprentissage du oud et des percussions traditionnelles', 'Collecte et documentation des chants ancestraux', 'Organisation de soirées de musique acoustique et patrimoniale']
        : ['Hands-on training in Oud, strings, and heritage percussions', 'Documenting oral musical traditions and classical poetry', 'Curating refined acoustic musical showcases and recitals'],
    },
    {
      id: 'media-communication',
      title: isAr ? 'لجنة الإعلام والتواصل الرقمي والتوثيق' : isFr ? 'Commission Médias & Communication Numérique' : 'Media, Digital Communication & Documentation',
      tag: isAr ? 'صناعة المحتوى والتوثيق' : isFr ? 'Création Digitale' : 'Digital Content & Storytelling',
      desc: isAr
        ? 'التغطية الإعلامية الاحترافية لكافة التظاهرات، صناعة المحتوى المرئي، إدارة المنصات الرقمية للجمعية، وأرشفة الأثر الميداني للبرامج.'
        : isFr
        ? 'Couverture audiovisuelle des initiatives, production de contenus digitaux valorisants, gestion des plateformes en ligne et archivage de l’impact.'
        : 'Professional audiovisual coverage, digital storytelling, managing institutional web channels, and archiving associative field impact.',
      icon: '📸',
      borderClass: 'border-[#1c6875]/30 hover:border-[#1c6875]',
      accentColor: 'text-[#1c6875]',
      accentBg: 'bg-[#1c6875]/10',
      points: isAr
        ? ['تصوير وتوثيق كافة الورشات والفعاليات بجودة عالية', 'تدبير المنصة الرقمية الرسمية وشبكات التواصل الاجتماعي', 'إعداد النشرات الدورية والبيانات الصحفية']
        : isFr
        ? ['Photographie et vidéo haute définition des activités', 'Gestion éditoriale du portail web et des réseaux sociaux', 'Publication des communiqués et synthèses d’impact']
        : ['High-definition photography and videography across all workshops', 'Content curation for the trilingual portal and social channels', 'Publishing regular newsletters, press releases, and media dossiers'],
    },
    {
      id: 'youth-in-action',
      title: isAr ? 'منسقية مبادرة "شباب في العمل" والتطوع' : isFr ? 'Coordination Jeunesse en Action & Volontariat' : 'Youth in Action & Civic Volunteering Coordination',
      tag: isAr ? 'البرنامج الرائد والميدان' : isFr ? 'Volontariat Actif' : 'Civic Action Hub',
      desc: isAr
        ? 'الإشراف على شبكة المتطوعين، تأهيل قادة الفرق الميدانية، وتدبير العمليات اللوجستية للمبادرات الثقافية والاجتماعية في الميدان.'
        : isFr
        ? 'Encadrement du réseau des bénévoles, formation des jeunes chefs d’équipe et déploiement logistique sur le terrain des actions culturelles.'
        : 'Mobilizing our volunteer network, training youth leaders, and coordinating on-site logistics for cultural and community outreach.',
      icon: '🚀',
      borderClass: 'border-[#c85a32]/30 hover:border-[#c85a32]',
      accentColor: 'text-[#c85a32]',
      accentBg: 'bg-[#c85a32]/10',
      points: isAr
        ? ['استقبال وتأطير المتطوعين الجدد وتوزيع الأدوار', 'تنسيق الفرق اللوجستية أثناء التظاهرات الكبرى', 'إصدار شواهد المشاركة والتطوع الميداني المعتمدة']
        : isFr
        ? ['Accueil et mentorat des nouveaux bénévoles', 'Coordination opérationnelle lors des grands événements', 'Délivrance des attestations officielles d’engagement civique']
        : ['Intake, onboarding, and role placement for new volunteers', 'Operational deployment during major cultural initiatives', 'Awarding certified certificates of civic volunteering hours'],
    },
    {
      id: 'capacity-building',
      title: isAr ? 'لجنة التكوين وتأهيل الكفاءات الحياتية' : isFr ? 'Commission Formation & Compétences Clés' : 'Capacity Building & Youth Skills Commission',
      tag: isAr ? 'ريادة وتمكين شبابي' : isFr ? 'Développement Personnel' : 'Youth Empowerment & Leadership',
      desc: isAr
        ? 'تنظيم دورات تدريبية متقدمة في المهارات الحياتية، القيادة التشاركية، إدارة المشاريع الثقافية، وتأهيل الشباب لولوج مهن الصناعات الإبداعية.'
        : isFr
        ? 'Organisation de formations en soft skills, gestion de projets culturels, prise de parole et accompagnement vers les métiers créatifs.'
        : 'Organizing masterclasses in life skills, participatory leadership, cultural project management, and creative industries career readiness.',
      icon: '📚',
      borderClass: 'border-[#08242a]/30 hover:border-[#08242a]',
      accentColor: 'text-[#08242a]',
      accentBg: 'bg-[#08242a]/10',
      points: isAr
        ? ['ورشات في المهارات الشخصية (Soft Skills) والتواصل الفعال', 'تدريب على إعداد وإدارة المشاريع الثقافية المصغرة', 'استضافة مؤطرين وخبراء لمواكبة طموحات الشباب']
        : isFr
        ? ['Formations en communication interpersonnelle et leadership', 'Méthodologie de montage de projets artistiques', 'Rencontres professionnelles avec des experts et créateurs']
        : ['Masterclasses in soft skills, negotiation, and teamwork', 'Cultural project incubation and management clinics', 'Hosting master workshops with established professionals'],
    },
  ]

  // The 4 Collective Leadership Principles
  const principles = [
    {
      num: '01',
      title: isAr ? 'الديمقراطية التشاركية' : isFr ? 'Démocratie Participative' : 'Participatory Democracy',
      desc: isAr
        ? 'اتخاذ القرارات بروح التوافق والتشاور المستمر بين المكتب التنفيذي واللجان الفنية، وإشراك كافة الأعضاء في بلورة المشاريع.'
        : isFr
        ? 'Prise de décision collective, consultation continue et implication des membres dans l’élaboration et l’évaluation des projets.'
        : 'Consensus-driven decision making, regular consultations across committees, and inclusive engagement in program design.',
      icon: '🗳️',
    },
    {
      num: '02',
      title: isAr ? 'ربط المسؤولية بالمحاسبة' : isFr ? 'Responsabilité & Rigueur' : 'Accountability & Integrity',
      desc: isAr
        ? 'كل مهمة إدارية أو فنية تخضع للتقييم الموضوعي الدوري، مع تقديم تقارير مفصلة تعكس حجم الأثر المحقق في الميدان بكل نزاهة.'
        : isFr
        ? 'Chaque responsabilité fait l’objet d’un bilan périodique rigoureux, garantissant la conformité morale et opérationnelle.'
        : 'Every mandate is subject to transparent milestone reviews, upholding institutional integrity and verified field impact.',
      icon: '⚖️',
    },
    {
      num: '03',
      title: isAr ? 'التداول وصناعة القادة' : isFr ? 'Alternance & Relève' : 'Rotation & Youth Leadership',
      desc: isAr
        ? 'إفساح المجال أمام الطاقات الشابة لتحمل أدوار قيادية داخل اللجان، وتشجيع المبادرات الفردية والجماعية لضمان استدامة العمل.'
        : isFr
        ? 'Promotion active des jeunes vers des responsabilités dirigeantes pour assurer le renouvellement continu et l’innovation.'
        : 'Empowering young leaders to take ownership of committee responsibilities, fostering continuous renewal and civic succession.',
      icon: '🌱',
    },
    {
      num: '04',
      title: isAr ? 'الشفافية والوضوح المؤسساتي' : isFr ? 'Transparence Absolue' : 'Institutional Transparency',
      desc: isAr
        ? 'التزام مطلق بإتاحة السجلات الإدارية والتقارير المالية للجمع العام والشركاء، ونشر حصيلة البرامج السنوية للرأي العام.'
        : isFr
        ? 'Accès ouvert aux bilans administratifs et financiers lors de chaque assemblée générale et communication publique des résultats.'
        : 'Complete openness of narrative and financial reports before the general assembly, partners, and public stakeholders.',
      icon: '💎',
    },
  ]

  return (
    <>
      <Header locale={locale} dict={dict} />

      <main id="main-content" className="flex-1 bg-[#faf7f2]">
        {/* ============================================================
            1. HERO BANNER WITH MOROCCAN PATTERN & AMBIENT GLOW
            ============================================================ */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#faf7f2] via-[#f5ede1] to-[#faf7f2] border-b border-[#e5e0d6] pt-14 pb-16 lg:pt-20 lg:pb-24">
          <div className="absolute inset-0 moroccan-pattern-light opacity-60 pointer-events-none" aria-hidden="true" />
          
          <div className="absolute top-1/3 start-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#c85a32]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 end-12 w-72 h-72 bg-[#0d3b43]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-[#5f7174]">
              <Link href={`/${locale}`} className="hover:text-[#0d3b43] transition-colors">
                {isAr ? 'الرئيسية' : isFr ? 'Accueil' : 'Home'}
              </Link>
              <span>/</span>
              <Link href={`/${locale}/about`} className="hover:text-[#0d3b43] transition-colors">
                {isAr ? 'عن الجمعية' : isFr ? 'Association' : 'About'}
              </Link>
              <span>/</span>
              <span className="text-[#c85a32]">
                {isAr ? 'فريق العمل والهيكلة' : isFr ? 'Équipe & Direction' : 'Our Team & Structure'}
              </span>
            </nav>

            {/* Badges Bar */}
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d3b43]/10 border border-[#0d3b43]/20 text-[#0d3b43] text-xs font-bold shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#c85a32] animate-pulse" />
                <span>
                  {isAr
                    ? 'الهيكل الإداري والتنظيمي المعتمد • جمعية AMYCC'
                    : isFr
                    ? 'Structure Administrative & Organisationnelle • AMYCC'
                    : 'Official Organizational Leadership • AMYCC'}
                </span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#d99b26]/10 border border-[#d99b26]/20 text-[#99620b] text-xs font-bold shadow-2xs">
                <span>📍</span>
                <span>
                  {isAr
                    ? 'تأطير وطني بروح شبابية مسؤولة 🇲🇦'
                    : isFr
                    ? 'Engagement Civique & Jeunesse 🇲🇦'
                    : 'Nationwide Civic Leadership 🇲🇦'}
                </span>
              </span>
            </div>

            {/* Main Headline */}
            <div className="text-center max-w-4xl mx-auto space-y-4">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#08242a] tracking-tight leading-tight">
                {isAr ? (
                  <>
                    طاقات شبابية وكفاءات ثقافية <br />
                    <span className="text-[#c85a32]">تقود مسيرة الإبداع والتأهيل الميداني</span>
                  </>
                ) : isFr ? (
                  <>
                    Énergies Jeunes & Compétences Culturelles <br />
                    <span className="text-[#c85a32]">au Service de l’Art et de l’Engagement</span>
                  </>
                ) : (
                  <>
                    Youth Energy & Cultural Leadership <br />
                    <span className="text-[#c85a32]">Driving Artistic Innovation in Morocco</span>
                  </>
                )}
              </h1>

              <p className="text-sm sm:text-base text-[#445457] max-w-3xl mx-auto leading-relaxed font-medium text-balance">
                {isAr
                  ? 'يتألف فريق عمل جمعية روح الفنون والثقافة (AMYCC) من مكتب تنفيذي منتخب ولجان فنية متخصصة تجمع بين الخبرة الميدانية، الشغف الفني، والالتزام الصارم بمبادئ الشفافية والمسؤولية لخدمة قضايا الشباب والتراث المغربي.'
                  : isFr
                  ? "L'équipe de l'Association Marocaine des Jeunes, Culture & Créativité (AMYCC) réunit un bureau exécutif élu et des commissions spécialisées engagées pour l'animation culturelle, la valorisation du patrimoine et la formation des jeunes."
                  : 'The team of the Spirit of Arts & Culture Association (AMYCC) comprises an elected executive board and specialized committees dedicated to arts education, heritage celebration, and empowering young creatives across Morocco.'}
              </p>
            </div>

            {/* In-Page Quick Navigation */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <a
                href="#executive-board"
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white border border-[#cfc7b9] text-[#0d3b43] hover:border-[#c85a32] hover:text-[#c85a32] transition-colors shadow-2xs"
              >
                {isAr ? '🏛️ المكتب التنفيذي (6)' : isFr ? '🏛️ Bureau Exécutif (6)' : '🏛️ Executive Board (6)'}
              </a>
              <a
                href="#commissions"
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white border border-[#cfc7b9] text-[#0d3b43] hover:border-[#c85a32] hover:text-[#c85a32] transition-colors shadow-2xs"
              >
                {isAr ? '🎨 اللجان الوظيفية (6)' : isFr ? '🎨 Commissions Thématiques (6)' : '🎨 Specialized Commissions (6)'}
              </a>
              <a
                href="#architecture"
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white border border-[#cfc7b9] text-[#0d3b43] hover:border-[#c85a32] hover:text-[#c85a32] transition-colors shadow-2xs"
              >
                {isAr ? '⚖️ الهيكلة التشاركية' : isFr ? '⚖️ Modèle Démocratique' : '⚖️ Democratic Model'}
              </a>
              <a
                href="#principles"
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white border border-[#cfc7b9] text-[#0d3b43] hover:border-[#c85a32] hover:text-[#c85a32] transition-colors shadow-2xs"
              >
                {isAr ? '💎 مبادئ التسيير (4)' : isFr ? '💎 Piliers de Leadership (4)' : '💎 Leadership Pillars (4)'}
              </a>
              <a
                href="#join"
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white border border-[#cfc7b9] text-[#0d3b43] hover:border-[#c85a32] hover:text-[#c85a32] transition-colors shadow-2xs"
              >
                {isAr ? '🚀 انضم لفريقنا' : isFr ? '🚀 Nous Rejoindre' : '🚀 Join Our Team'}
              </a>
            </div>
          </div>
        </section>

        {/* ============================================================
            2. INSTITUTIONAL METRICS & CAPACITY STRIP (4 CARDS)
            ============================================================ */}
        <section className="py-12 bg-white border-b border-[#e5e0d6]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {/* Card 1: 6 Statutory Roles */}
              <div className="p-5 sm:p-6 rounded-3xl bg-[#faf7f2] border border-[#e5e0d6] hover:border-[#0d3b43]/30 transition-all text-center flex flex-col justify-between group shadow-2xs">
                <span className="text-xs font-bold text-[#5f7174] block mb-1">
                  {isAr ? 'المكتب التنفيذي المنتخب' : isFr ? 'Bureau Exécutif Élu' : 'Elected Executive Board'}
                </span>
                <div className="min-h-[3rem] flex items-center justify-center">
                  <span className="text-xl sm:text-2xl font-black text-[#0d3b43] group-hover:scale-105 transition-transform block whitespace-nowrap">
                    {isAr ? '6 مناصب قانونية' : isFr ? '6 Postes Statutaires' : '6 Statutory Roles'}
                  </span>
                </div>
                <p className="text-xs text-[#5f7174] leading-relaxed mt-2 text-balance">
                  {isAr
                    ? 'تسيير إداري ومالي مطابق لظهير تأسيس الجمعيات بالمغرب'
                    : isFr
                    ? 'Direction administrative conforme au Dahir associatif marocain'
                    : 'Administrative management governed by Moroccan non-profit law.'}
                </p>
              </div>

              {/* Card 2: 6 Specialized Hubs */}
              <div className="p-5 sm:p-6 rounded-3xl bg-[#faf7f2] border border-[#e5e0d6] hover:border-[#c85a32]/30 transition-all text-center flex flex-col justify-between group shadow-2xs">
                <span className="text-xs font-bold text-[#5f7174] block mb-1">
                  {isAr ? 'اللجان الميدانية المتخصصة' : isFr ? 'Commissions Thématiques' : 'Specialized Commissions'}
                </span>
                <div className="min-h-[3rem] flex items-center justify-center">
                  <span className="text-xl sm:text-2xl font-black text-[#c85a32] group-hover:scale-105 transition-transform block whitespace-nowrap">
                    {isAr ? '6 محاور وظيفية' : isFr ? '6 Pôles d’Action' : '6 Functional Hubs'}
                  </span>
                </div>
                <p className="text-xs text-[#5f7174] leading-relaxed mt-2 text-balance">
                  {isAr
                    ? 'الفنون التشكيلية، المسرح، الموسيقى، الإعلام، والتطوع والتكوين'
                    : isFr
                    ? 'Arts visuels, théâtre, musique, médias, volontariat et formation'
                    : 'Visual arts, theatre, music, media, volunteering, and training.'}
                </p>
              </div>

              {/* Card 3: 100% Civic Volunteering */}
              <div className="p-5 sm:p-6 rounded-3xl bg-[#faf7f2] border border-[#e5e0d6] hover:border-[#d99b26]/30 transition-all text-center flex flex-col justify-between group shadow-2xs">
                <span className="text-xs font-bold text-[#5f7174] block mb-1">
                  {isAr ? 'روح العمل الجمعوي' : isFr ? 'Engagement Associatif' : 'Civic Dedication'}
                </span>
                <div className="min-h-[3rem] flex items-center justify-center">
                  <span className="text-xl sm:text-2xl font-black text-[#d99b26] group-hover:scale-105 transition-transform block whitespace-nowrap">
                    {isAr ? '100% تطوع مدني' : isFr ? '100% Volontariat' : '100% Civic Service'}
                  </span>
                </div>
                <p className="text-xs text-[#5f7174] leading-relaxed mt-2 text-balance">
                  {isAr
                    ? 'عطاء غير ربحي تحركه المسؤولية الأخلاقية والوطنية تجاه الشباب'
                    : isFr
                    ? 'Engagement désintéressé guidé par la passion culturelle'
                    : 'Non-profit dedication driven by cultural passion and civic mission.'}
                </p>
              </div>

              {/* Card 4: Geographic Scope */}
              <div className="p-5 sm:p-6 rounded-3xl bg-[#faf7f2] border border-[#e5e0d6] hover:border-[#0d3b43]/30 transition-all text-center flex flex-col justify-between group shadow-2xs">
                <span className="text-xs font-bold text-[#5f7174] block mb-1">
                  {isAr ? 'النطاق والمقر' : isFr ? 'Siège & Rayonnement' : 'Headquarters & Scope'}
                </span>
                <div className="min-h-[3rem] flex items-center justify-center">
                  <span className="text-xl sm:text-2xl font-black text-[#0d3b43] group-hover:scale-105 transition-transform block whitespace-nowrap">
                    {isAr ? 'مراكش • جهات المغرب' : isFr ? 'Marrakech • Maroc' : 'Marrakech • Morocco'}
                  </span>
                </div>
                <p className="text-xs text-[#5f7174] leading-relaxed mt-2 text-balance">
                  {isAr
                    ? 'انطلاق من مراكش الحمراء مع الانفتاح على كافة جهات المملكة'
                    : isFr
                    ? 'Ancrage à Marrakech avec extension vers toutes les régions'
                    : 'Grounded in Marrakech with phased expansion across all regions.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            3. EXECUTIVE BOARD SECTION (المكتب التنفيذي للجمعية)
            ============================================================ */}
        <section id="executive-board" className="py-20 bg-[#faf7f2] border-b border-[#e5e0d6] scroll-mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#0d3b43] px-3.5 py-1.5 rounded-full bg-[#0d3b43]/10 border border-[#0d3b43]/20">
                {isAr ? 'الجهاز التنفيذي والإداري' : isFr ? 'Instance Exécutive & Légale' : 'Executive & Statutory Body'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#08242a]">
                {isAr ? 'المكتب التنفيذي لجمعية روح الفنون والثقافة' : isFr ? 'Bureau Exécutif de l’AMYCC' : 'Executive Board of AMYCC'}
              </h2>
              <p className="text-sm sm:text-base text-[#445457] leading-relaxed text-balance">
                {isAr
                  ? 'يتولى المكتب التنفيذي، المنتخب وفق مقتضيات الظهير الشريف رقم 1.58.376 المنظم للحق في تأسيس الجمعيات بالمملكة المغربية والنظام الأساسي للجمعية، التدبير اليومي، تمثيل الجمعية رسمياً، ومتابعة تنفيذ القرارات التشاركية الصادرة عن الجمع العام.'
                  : isFr
                  ? 'Élu conformément au Dahir n° 1-58-376 et aux statuts officiels, le bureau exécutif assure la gestion quotidienne, la représentation légale et la mise en œuvre rigoureuse des orientations adoptées.'
                  : 'Governed by Moroccan Dahir No. 1.58.376 and statutory bylaws, the elected executive board manages day-to-day operations, legal representation, and the faithful implementation of General Assembly resolutions.'}
              </p>
            </div>

            {/* 6 Executive Board Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {executiveBoard.map((member) => (
                <div
                  key={member.id}
                  className={`p-7 rounded-3xl bg-white border ${member.colorClass} shadow-subtle hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden`}
                >
                  <div className="space-y-5">
                    {/* Role Header & Icon */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="w-14 h-14 rounded-2xl bg-[#faf7f2] border border-[#e5e0d6] flex items-center justify-center text-2xl shadow-2xs group-hover:scale-110 transition-transform">
                          {member.icon}
                        </span>
                        <div>
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${member.accentBg}`}>
                            {member.badgeStatus}
                          </span>
                          <h3 className="text-lg font-black text-[#08242a] mt-1 leading-snug">
                            {member.role}
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* Mandate & Scope */}
                    <div>
                      <span className="text-xs font-bold text-[#819598] uppercase tracking-wider block mb-2">
                        {member.titleStatus}
                      </span>
                      <p className="text-xs sm:text-sm text-[#445457] leading-relaxed">
                        {member.desc}
                      </p>
                    </div>

                    {/* 3 Core Responsibilities Checklist */}
                    <div className="space-y-2 pt-2 border-t border-[#f0ebe1]">
                      <span className="text-xs font-bold text-[#08242a] block">
                        {isAr ? 'المهام والمسؤوليات النظامية:' : isFr ? 'Missions & Responsabilités :' : 'Statutory Responsibilities:'}
                      </span>
                      <ul className="space-y-1.5 text-xs text-[#5f7174]">
                        {member.duties.map((duty, dIdx) => (
                          <li key={dIdx} className="flex items-start gap-2">
                            <span className="text-emerald-600 font-bold">✓</span>
                            <span className="leading-relaxed">{duty}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Card Footer with Moroccan Legal Stamp */}
                  <div className="pt-4 mt-6 border-t border-[#f0ebe1] flex items-center justify-between text-xs font-bold text-[#819598]">
                    <span>{isAr ? 'المملكة المغربية • الظهير 1.58.376' : isFr ? 'Dahir n° 1-58-376 • Maroc' : 'Dahir 1.58.376 • Morocco'}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                </div>
              ))}
            </div>

            {/* Statutory Transparency Box */}
            <div className="p-5 sm:p-6 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs leading-relaxed shadow-2xs">
              <span className="text-2xl shrink-0">📜</span>
              <div className="space-y-1">
                <strong className="block font-bold">
                  {isAr
                    ? 'إشعار الشفافية والمسطرة القانونية لانتخاب المكتب:'
                    : isFr
                    ? 'Notice de Transparence & Procédure Statutaire :'
                    : 'Statutory Transparency & Election Procedure:'}
                </strong>
                <p className="text-amber-800">
                  {isAr
                    ? 'تخضع عضوية المكتب التنفيذي لمقتضيات القانون الأساسي والنظام الداخلي لجمعية روح الفنون والثقافة (AMYCC). يتم تجديد وانتخاب المناصب عبر الجمع العام العادي بالاقتراع المباشر والعلني، وتودع المحاضر القانونية ولائحة الأسماء المصادق عليها لدى السلطات الإدارية المحلية المختصة بمراكش والمملكة المغربية.'
                    : isFr
                    ? 'L’élection des membres du bureau exécutif s’effectue en assemblée générale ordinaire selon les statuts officiels de l’AMYCC. Les procès-verbaux et listes nominatives certifiées sont déposés auprès des autorités locales compétentes de Marrakech conformément à la loi marocaine.'
                    : 'The election of executive officers is conducted during ordinary General Assembly sessions pursuant to AMYCC bylaws. Certified minutes and rosters are officially lodged with the relevant administrative authorities in Marrakech in accordance with Moroccan legislation.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            4. THE 6 SPECIALIZED COMMISSIONS (اللجان الوظيفية والميدانية)
            ============================================================ */}
        <section id="commissions" className="py-20 bg-white border-b border-[#e5e0d6] scroll-mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#c85a32] px-3.5 py-1.5 rounded-full bg-[#c85a32]/10 border border-[#c85a32]/20">
                {isAr ? 'الأذرع الميدانية والفنية' : isFr ? 'Pôles Opérationnels & Artistiques' : 'Artistic & Operational Hubs'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#08242a]">
                {isAr ? 'اللجان الوظيفية وفرق التأطير المتخصصة' : isFr ? 'Commissions Thématiques de Terrain' : 'Specialized Working Commissions'}
              </h2>
              <p className="text-sm sm:text-base text-[#445457] leading-relaxed text-balance">
                {isAr
                  ? 'تشكل هذه اللجان الست المحرك الميداني الحقيقي لأنشطة الجمعية؛ حيث تسهر على التصميم الفني للورشات، مواكبة المواهب الصاعدة، وتنسيق الفعاليات المباشرة بشراكة مع دور الشباب، المراكز الثقافية، والجامعات.'
                  : isFr
                  ? 'Ces six commissions spécialisées constituent le cœur battant de l’AMYCC : conception pédagogique des ateliers, tutorat des talents émergents et déploiement d’événements en partenariat avec les maisons de jeunes et les universités.'
                  : 'These six dedicated commissions represent the active engine of AMYCC: designing practical syllabi, mentoring young creators, and coordinating live events across cultural centers and universities.'}
              </p>
            </div>

            {/* 6 Commissions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {committees.map((comm) => (
                <div
                  key={comm.id}
                  className={`p-7 rounded-3xl bg-[#faf7f2] border ${comm.borderClass} shadow-subtle hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden`}
                >
                  <div className="space-y-4">
                    {/* Header: Icon & Category Tag */}
                    <div className="flex items-center justify-between">
                      <span className="w-12 h-12 rounded-2xl bg-white border border-[#e5e0d6] flex items-center justify-center text-2xl shadow-2xs group-hover:scale-110 transition-transform">
                        {comm.icon}
                      </span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${comm.accentBg} ${comm.accentColor}`}>
                        {comm.tag}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-[#08242a] mb-2 leading-snug">
                        {comm.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#445457] leading-relaxed">
                        {comm.desc}
                      </p>
                    </div>

                    {/* Operational Pillars Checklist */}
                    <div className="space-y-2 pt-3 border-t border-[#e5e0d6]">
                      <span className="text-xs font-bold text-[#08242a] block">
                        {isAr ? 'أبرز التدخلات والأنشطة الميدانية:' : isFr ? 'Interventions Clés sur le Terrain :' : 'Key Field Interventions:'}
                      </span>
                      <ul className="space-y-1.5 text-xs text-[#5f7174]">
                        {comm.points.map((pt, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-2">
                            <span className={`${comm.accentColor} font-bold`}>✦</span>
                            <span className="leading-relaxed">{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Commission Target Locales Footer */}
                  <div className="pt-4 mt-6 border-t border-[#e5e0d6] flex items-center justify-between text-xs font-bold text-[#819598]">
                    <span>{isAr ? 'فضاءات الثقافة ودور الشباب' : isFr ? 'Centres Culturels & Jeunesse' : 'Community & Cultural Hubs'}</span>
                    <span className="text-emerald-600">● {isAr ? 'تأطير نشط' : isFr ? 'Actif' : 'Active'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            5. DEMOCRATIC ARCHITECTURE & PARTICIPATORY MODEL
            ============================================================ */}
        <section id="architecture" className="py-20 bg-[#faf7f2] border-b border-[#e5e0d6] scroll-mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#0d3b43] px-3.5 py-1.5 rounded-full bg-[#0d3b43]/10 border border-[#0d3b43]/20">
                {isAr ? 'هندسة التسيير الديمقراطي' : isFr ? 'Architecture Démocratique' : 'Democratic Architecture'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#08242a]">
                {isAr ? 'كيف يتم تدبير وتسيير جمعية AMYCC؟' : isFr ? 'Comment Fonctionne l’Organisation de l’AMYCC ?' : 'How AMYCC Governance Operates'}
              </h2>
              <p className="text-sm sm:text-base text-[#445457] leading-relaxed text-balance">
                {isAr
                  ? 'ترتكز جمعية روح الفنون والثقافة على نموذج تسيير تشاركي شفاف ثلاثي المستويات، يضمن سيادة الجمع العام، كفاءة المكتب التنفيذي، ودينامية اللجان الميدانية.'
                  : isFr
                  ? 'L’AMYCC repose sur un modèle à trois niveaux garantissant la souveraineté de l’assemblée générale, la rigueur du bureau exécutif et le dynamisme des commissions de terrain.'
                  : 'AMYCC operates on a three-tier participatory framework ensuring the sovereignty of the General Assembly, the executive rigor of the board, and the creative autonomy of field commissions.'}
              </p>
            </div>

            {/* 3-Tier Hierarchy Flow */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative">
              {/* Level 1: General Assembly */}
              <div className="p-8 rounded-3xl bg-white border-2 border-[#0d3b43]/30 shadow-subtle flex flex-col justify-between space-y-5 relative">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="w-12 h-12 rounded-2xl bg-[#0d3b43] text-white flex items-center justify-center font-black text-xl shadow-xs">
                      1
                    </span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#0d3b43]/10 text-[#0d3b43]">
                      {isAr ? 'الهيئة التقريرية العليا' : isFr ? 'Instance Suprême' : 'Supreme Governing Body'}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-[#08242a]">
                    {isAr ? 'الجمع العام السنوي' : isFr ? 'Assemblée Générale Ordinaire' : 'Annual General Assembly'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#445457] leading-relaxed">
                    {isAr
                      ? 'يضم كافة الأعضاء المنخرطين بالجمعية. يعتبر أعلى سلطة تقريرية؛ يصادق على التقريرين الأدبي والمالي بعد المناقشة، ينتخب أعضاء المكتب التنفيذي، ويحدد التوجهات والبرامج السنوية العامة.'
                      : isFr
                      ? 'Réunit l’ensemble des adhérents. Instance souveraine qui délibère et vote les bilans moraux et financiers, élit les dirigeants du bureau et oriente la feuille de route annuelle.'
                      : 'Comprises all active registered members. The sovereign decision-maker: debates and approves moral and financial reports, elects executive officers, and sets strategic priorities.'}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#e5e0d6] text-xs font-bold text-[#0d3b43]">
                  {isAr ? '✓ سيادة القانون والديمقراطية المباشرة' : isFr ? '✓ Démocratie directe et souveraineté' : '✓ Direct participatory sovereignty'}
                </div>
              </div>

              {/* Level 2: Executive Board */}
              <div className="p-8 rounded-3xl bg-white border-2 border-[#c85a32]/30 shadow-subtle flex flex-col justify-between space-y-5 relative">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="w-12 h-12 rounded-2xl bg-[#c85a32] text-white flex items-center justify-center font-black text-xl shadow-xs">
                      2
                    </span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#c85a32]/10 text-[#c85a32]">
                      {isAr ? 'التدبير والتسيير اليومي' : isFr ? 'Direction & Gestion' : 'Executive Management'}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-[#08242a]">
                    {isAr ? 'المكتب التنفيذي المنتخب' : isFr ? 'Bureau Exécutif Élu' : 'Elected Executive Board'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#445457] leading-relaxed">
                    {isAr
                      ? 'الهيئة التنفيذية المسؤولة عن التدبير الإداري، المالي، والقانوني للجمعية. تسهر على تنزيل قرارات الجمع العام، إبرام اتفاقيات الشراكة، وتنسيق ودعم أعمال اللجان الوظيفية المتخصصة.'
                      : isFr
                      ? 'Organe exécutif en charge de l’administration légale, financière et matérielle. Il met en œuvre les résolutions votées, signe les accords de partenariat et coordonne les commissions.'
                      : 'Executive body responsible for legal, financial, and administrative operations. Executes General Assembly resolutions, secures partnerships, and coordinates commissions.'}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#e5e0d6] text-xs font-bold text-[#c85a32]">
                  {isAr ? '✓ تنفيذ القرارات والتمثيل القانوني' : isFr ? '✓ Représentation et exécution rigoureuse' : '✓ Faithful execution and representation'}
                </div>
              </div>

              {/* Level 3: Commissions & Working Groups */}
              <div className="p-8 rounded-3xl bg-white border-2 border-[#d99b26]/30 shadow-subtle flex flex-col justify-between space-y-5 relative">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="w-12 h-12 rounded-2xl bg-[#d99b26] text-white flex items-center justify-center font-black text-xl shadow-xs">
                      3
                    </span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#d99b26]/10 text-[#99620b]">
                      {isAr ? 'التنفيذ الميداني والإبداعي' : isFr ? 'Action & Terrain' : 'Field Operations & Creativity'}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-[#08242a]">
                    {isAr ? 'اللجان الوظيفية ومجموعات العمل' : isFr ? 'Commissions Thématiques & Volontariat' : 'Functional Commissions & Action Groups'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#445457] leading-relaxed">
                    {isAr
                      ? 'أطر فنية ومتطوعون مؤهلون يقودون الورشات المباشرة في الفنون والمسرح والموسيقى والإعلام، وينسقون مبادرة "شباب في العمل" لخدمة الناشئة والمجتمع في مختلف مدن وقرى المغرب.'
                      : isFr
                      ? 'Artistes, éducateurs et volontaires encadrant directement les ateliers artistiques et pilotant l’initiative Jeunesse en Action auprès des jeunes dans les quartiers et villes.'
                      : 'Artists, cultural educators, and dedicated volunteers leading workshops on the ground, mobilizing Youth in Action to empower communities across Morocco.'}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#e5e0d6] text-xs font-bold text-[#d99b26]">
                  {isAr ? '✓ إتاحة الفنون والتمكين المباشر' : isFr ? '✓ Démocratisation culturelle concrète' : '✓ Community cultural access & outreach'}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            6. COLLECTIVE LEADERSHIP PRINCIPLES (4 PILLARS)
            ============================================================ */}
        <section id="principles" className="py-20 bg-white border-b border-[#e5e0d6] scroll-mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#c85a32] px-3.5 py-1.5 rounded-full bg-[#c85a32]/10 border border-[#c85a32]/20">
                {isAr ? 'الركائز التسييرية' : isFr ? 'Valeurs de Leadership' : 'Leadership Framework'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#08242a]">
                {isAr ? 'مبادئ القيادة والعمل الجماعي بالجمعية' : isFr ? 'Principes de Direction & de Travail Collectif' : 'Principles of Collective Leadership'}
              </h2>
              <p className="text-sm sm:text-base text-[#445457] leading-relaxed text-balance">
                {isAr
                  ? 'ترتكز كل خطوة تنظيمية داخل الجمعية على أربعة مبادئ مؤسساتية راسخة تضمن استقلالية العمل المدني، نقاء التدبير، وتكافؤ الفرص لجميع الشباب.'
                  : isFr
                  ? 'Toute action organisationnelle au sein de l’AMYCC s’appuie sur quatre piliers garantissant l’indépendance, la rigueur et l’égalité des chances pour tous.'
                  : 'Every organisational step within AMYCC is anchored on four institutional pillars guaranteeing civic independence, integrity, and fair opportunity.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {principles.map((p) => (
                <div
                  key={p.num}
                  className="p-6 rounded-3xl bg-[#faf7f2] border border-[#e5e0d6] hover:border-[#0d3b43]/30 shadow-subtle hover:shadow-card hover:-translate-y-1 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="w-12 h-12 rounded-2xl bg-white border border-[#e5e0d6] flex items-center justify-center text-2xl shadow-2xs group-hover:scale-110 transition-transform">
                        {p.icon}
                      </span>
                      <span className="text-xs font-black text-[#819598] font-mono">
                        #{p.num}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-black text-[#08242a] mb-2 leading-snug">
                        {p.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#445457] leading-relaxed">
                        {p.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#e5e0d6] text-xs font-bold text-[#0d3b43]">
                    {isAr ? '● ركيزة عمل ملزمة' : isFr ? '● Principe Inviolable' : '● Core Standard'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            7. JOIN THE TEAM & VOLUNTEER CTA (انضم إلينا)
            ============================================================ */}
        <section id="join" className="py-16 lg:py-20 bg-gradient-to-br from-[#08242a] via-[#0d3b43] to-[#04161a] text-white relative overflow-hidden scroll-mt-16">
          <div className="absolute top-0 end-0 w-96 h-96 bg-[#c85a32]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 start-0 w-80 h-80 bg-[#d99b26]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 moroccan-star-pattern opacity-10 pointer-events-none" />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c85a32]/20 border border-[#c85a32]/40 text-[#fae4dc] text-xs font-bold">
              <span>✦</span>
              <span>
                {isAr
                  ? 'أبواب الجمعية ولجانها مفتوحة للطاقات المغربية'
                  : isFr
                  ? 'Rejoignez l’Aventure Humaine & Culturelle de l’AMYCC'
                  : 'Join the Cultural and Volunteer Movement of AMYCC'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              {isAr ? (
                <>
                  هل تملك موهبة فنية، شغفاً بالتأطير، <br />
                  <span className="text-[#f4ce83]">أو رغبة في المساهمة في تنمية مجتمعك؟</span>
                </>
              ) : isFr ? (
                <>
                  Vous êtes artiste, animateur culturel ou jeune engagé ? <br />
                  <span className="text-[#f4ce83]">Contribuez au renouveau culturel du Maroc avec nous</span>
                </>
              ) : (
                <>
                  Passionate About Cultural Mentorship & Civic Impact? <br />
                  <span className="text-[#f4ce83]">Shape Morocco’s Cultural Landscape with AMYCC</span>
                </>
              )}
            </h2>

            <p className="text-xs sm:text-base text-[#d8f0f4] max-w-2xl mx-auto leading-relaxed text-balance">
              {isAr
                ? 'سواء كنت ترغب في الانخراط كعضو نشيط بالجمعية، الانضمام لإحدى اللجان الفنية الست، أو قيادة المبادرات التطوعية ضمن برنامج "شباب في العمل"، نرحب بطاقتك وأفكارك لصناعة أثر ثقافي مستدام.'
                : isFr
                ? 'Que vous souhaitiez adhérer en tant que membre actif, vous investir dans l’une de nos six commissions ou encadrer des bénévoles de Jeunesse en Action, nous vous accueillons avec enthousiasme.'
                : 'Whether you wish to apply for formal membership, join one of our six specialized artistic commissions, or guide field volunteers in Youth in Action, AMYCC warmly welcomes your passion.'}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href={`/${locale}/membership`}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-black text-white bg-[#c85a32] hover:bg-[#b84e27] active:scale-95 transition-all text-xs sm:text-sm shadow-card cursor-pointer"
              >
                {isAr ? 'تقديم طلب الانخراط والعضوية' : isFr ? 'Adhérer à l’Association' : 'Apply for Membership'}
              </Link>

              <Link
                href={`/${locale}/programs/youth-in-action`}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-white bg-[#0d3b43] hover:bg-[#14505b] border border-[#268292]/50 transition-all text-xs sm:text-sm cursor-pointer"
              >
                {isAr ? 'مبادرة شباب في العمل (التطوع)' : isFr ? 'Jeunesse en Action (Bénévolat)' : 'Youth in Action (Volunteering)'}
              </Link>

              <Link
                href={`/${locale}/contact`}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-[#f4ce83] border border-[#f4ce83]/40 hover:bg-[#f4ce83]/10 transition-all text-xs sm:text-sm cursor-pointer"
              >
                {isAr ? 'تواصل مع مكتب الجمعية' : isFr ? 'Contacter le Bureau' : 'Contact the Board'}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} dict={dict} />
    </>
  )
}

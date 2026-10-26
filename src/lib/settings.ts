import { createClient } from '@/lib/supabase/server'

export interface TopBarConfig {
  enabled: boolean
  messageAr?: string
  messageFr?: string
  messageEn?: string
  linkTextAr?: string
  linkTextFr?: string
  linkTextEn?: string
  linkUrl?: string
  contactEmail?: string
}

export const defaultTopBarConfig: TopBarConfig = {
  enabled: false, // Default is disabled (hidden)
  messageAr: 'المملكة المغربية • جمعية روح الفنون والثقافة (AMYCC) — تأسست سنة 2026',
  messageFr: 'Royaume du Maroc • Association Esprit des Arts et de la Culture (AMYCC)',
  messageEn: 'Kingdom of Morocco • Spirit of Arts & Culture Association (AMYCC)',
  linkTextAr: 'مبادرة شباب في العمل',
  linkTextFr: 'Initiative Jeunesse en Action',
  linkTextEn: 'Youth in Action Initiative',
  linkUrl: '/programs/youth-in-action',
  contactEmail: 'contact@amycc.org',
}

export async function getTopBarSettings(): Promise<TopBarConfig> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'top_bar')
      .maybeSingle()

    if (error || !data || !data.value) {
      return defaultTopBarConfig
    }

    const val = data.value as Partial<TopBarConfig>
    return {
      enabled: typeof val.enabled === 'boolean' ? val.enabled : false,
      messageAr: val.messageAr || defaultTopBarConfig.messageAr,
      messageFr: val.messageFr || defaultTopBarConfig.messageFr,
      messageEn: val.messageEn || defaultTopBarConfig.messageEn,
      linkTextAr: val.linkTextAr || defaultTopBarConfig.linkTextAr,
      linkTextFr: val.linkTextFr || defaultTopBarConfig.linkTextFr,
      linkTextEn: val.linkTextEn || defaultTopBarConfig.linkTextEn,
      linkUrl: val.linkUrl || defaultTopBarConfig.linkUrl,
      contactEmail: val.contactEmail || defaultTopBarConfig.contactEmail,
    }
  } catch {
    return defaultTopBarConfig
  }
}

export interface HeroConfig {
  imageUrl?: string
  tagAr?: string
  tagFr?: string
  tagEn?: string
  titleAr?: string
  titleFr?: string
  titleEn?: string
  descriptionAr?: string
  descriptionFr?: string
  descriptionEn?: string
  ctaPrimaryTextAr?: string
  ctaPrimaryTextFr?: string
  ctaPrimaryTextEn?: string
  ctaPrimaryUrl?: string
  ctaSecondaryTextAr?: string
  ctaSecondaryTextFr?: string
  ctaSecondaryTextEn?: string
  ctaSecondaryUrl?: string
  bottomStripAr?: string
  bottomStripFr?: string
  bottomStripEn?: string
}

export const defaultHeroConfig: HeroConfig = {
  imageUrl: '/images/youth-in-action.jpg',
  tagAr: 'الفنون والثقافة للأثر والتمكين',
  tagFr: 'ARTS ET CULTURE POUR L\'IMPACT',
  tagEn: 'ARTS & CULTURE FOR IMPACT',
  titleAr: 'حيث يكتشف الشباب مواهبهم،\nويقودون الإبداع الثقافي بالمغرب',
  titleFr: 'Où les jeunes découvrent leurs talents et mènent la création culturelle',
  titleEn: 'Where youth discover their talents and lead cultural creation',
  descriptionAr: 'جمعية روح الفنون والثقافة (AMYCC) — جمعية مدنية مغربية غير ربحية انطلقت من مراكش، تكرس جهودها لتمكين الشباب وصون التراث المغربي الأصيل، وإطلاق المبادرات الفنية والإبداعية والتطوعية في مختلف جهات المملكة.',
  descriptionFr: 'L\'Association Esprit des Arts et de la Culture (AMYCC) est une organisation marocaine à but non lucratif née à Marrakech, dédiée à l\'autonomisation des jeunes et à la préservation du patrimoine.',
  descriptionEn: 'Spirit of Arts & Culture Association (AMYCC) is a Moroccan non-profit born in Marrakech, dedicated to youth empowerment, cultural heritage, and community arts initiatives across Morocco.',
  ctaPrimaryTextAr: 'اكتشف برامجنا',
  ctaPrimaryTextFr: 'Nos Programmes',
  ctaPrimaryTextEn: 'Explore Programs',
  ctaPrimaryUrl: '/programs',
  ctaSecondaryTextAr: 'عن الجمعية ورؤيتنا',
  ctaSecondaryTextFr: 'Notre Vision',
  ctaSecondaryTextEn: 'Our Vision',
  ctaSecondaryUrl: '/about',
  bottomStripAr: 'تأسست في إطار الظهير الشريف رقم 1.58.376 المنظم للجمعيات بالمملكة المغربية — شراكات وطنية ودولية لتمكين الشباب وصون التراث.',
  bottomStripFr: 'Fondée sous le Dahir Chérif n° 1.58.376 au Royaume du Maroc — Partenariats nationaux et internationaux pour la jeunesse et la culture.',
  bottomStripEn: 'Founded under Dahir Sharif No. 1.58.376 in the Kingdom of Morocco — National and international partnerships for youth and cultural heritage.',
}

export async function getHeroSettings(): Promise<HeroConfig> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'hero')
      .maybeSingle()

    if (error || !data || !data.value) {
      return defaultHeroConfig
    }

    const val = data.value as Partial<HeroConfig>
    return {
      imageUrl: typeof val.imageUrl === 'string' ? val.imageUrl : defaultHeroConfig.imageUrl,
      tagAr: val.tagAr || defaultHeroConfig.tagAr,
      tagFr: val.tagFr || defaultHeroConfig.tagFr,
      tagEn: val.tagEn || defaultHeroConfig.tagEn,
      titleAr: val.titleAr || defaultHeroConfig.titleAr,
      titleFr: val.titleFr || defaultHeroConfig.titleFr,
      titleEn: val.titleEn || defaultHeroConfig.titleEn,
      descriptionAr: val.descriptionAr || defaultHeroConfig.descriptionAr,
      descriptionFr: val.descriptionFr || defaultHeroConfig.descriptionFr,
      descriptionEn: val.descriptionEn || defaultHeroConfig.descriptionEn,
      ctaPrimaryTextAr: val.ctaPrimaryTextAr || defaultHeroConfig.ctaPrimaryTextAr,
      ctaPrimaryTextFr: val.ctaPrimaryTextFr || defaultHeroConfig.ctaPrimaryTextFr,
      ctaPrimaryTextEn: val.ctaPrimaryTextEn || defaultHeroConfig.ctaPrimaryTextEn,
      ctaPrimaryUrl: val.ctaPrimaryUrl || defaultHeroConfig.ctaPrimaryUrl,
      ctaSecondaryTextAr: val.ctaSecondaryTextAr || defaultHeroConfig.ctaSecondaryTextAr,
      ctaSecondaryTextFr: val.ctaSecondaryTextFr || defaultHeroConfig.ctaSecondaryTextFr,
      ctaSecondaryTextEn: val.ctaSecondaryTextEn || defaultHeroConfig.ctaSecondaryTextEn,
      ctaSecondaryUrl: val.ctaSecondaryUrl || defaultHeroConfig.ctaSecondaryUrl,
      bottomStripAr: val.bottomStripAr || defaultHeroConfig.bottomStripAr,
      bottomStripFr: val.bottomStripFr || defaultHeroConfig.bottomStripFr,
      bottomStripEn: val.bottomStripEn || defaultHeroConfig.bottomStripEn,
    }
  } catch {
    return defaultHeroConfig
  }
}

export interface FlagshipProgramConfig {
  enabled: boolean
  programSlug: string
  badgeAr: string
  badgeFr: string
  badgeEn: string
  titleAr: string
  titleFr: string
  titleEn: string
  descriptionAr: string
  descriptionFr: string
  descriptionEn: string
  imageUrl: string
  imageCaptionAr: string
  imageCaptionFr: string
  imageCaptionEn: string
  imageSubcaption: string

  // Step 1
  step1TitleAr: string
  step1TitleFr: string
  step1TitleEn: string
  step1DescAr: string
  step1DescFr: string
  step1DescEn: string

  // Step 2
  step2TitleAr: string
  step2TitleFr: string
  step2TitleEn: string
  step2DescAr: string
  step2DescFr: string
  step2DescEn: string

  // Step 3
  step3TitleAr: string
  step3TitleFr: string
  step3TitleEn: string
  step3DescAr: string
  step3DescFr: string
  step3DescEn: string

  // Step 4
  step4TitleAr: string
  step4TitleFr: string
  step4TitleEn: string
  step4DescAr: string
  step4DescFr: string
  step4DescEn: string

  // CTAs
  ctaPrimaryTextAr: string
  ctaPrimaryTextFr: string
  ctaPrimaryTextEn: string
  ctaPrimaryUrl: string

  ctaSecondaryTextAr: string
  ctaSecondaryTextFr: string
  ctaSecondaryTextEn: string
  ctaSecondaryUrl: string
}

export const defaultFlagshipProgramConfig: FlagshipProgramConfig = {
  enabled: true,
  programSlug: 'youth-in-action',
  badgeAr: 'البرنامج الرائد',
  badgeFr: 'Programme Phare',
  badgeEn: 'Flagship Program',
  titleAr: 'مبادرة شباب في العمل',
  titleFr: 'Initiative Jeunesse en Action',
  titleEn: 'Youth in Action Initiative',
  descriptionAr: 'برنامج تطوعي ومجتمعي أطلقته الجمعية لتمكين الشباب من القيادة الثقافية وتنظيم الأنشطة الميدانية وصقل المهارات الحياتية.',
  descriptionFr: 'Programme de bénévolat communautaire lancé par l\'association pour autonomiser les jeunes dans le leadership culturel.',
  descriptionEn: 'A civic volunteering initiative launched to empower Moroccan youth in cultural leadership, field management, and artistic production.',
  imageUrl: '/images/youth-in-action.jpg',
  imageCaptionAr: 'طاقات شبابية تقود المشهد الثقافي',
  imageCaptionFr: 'Jeunes leaders de la scène culturelle',
  imageCaptionEn: 'Youth Leadership in Arts & Culture',
  imageSubcaption: 'AMYCC Morocco',

  step1TitleAr: 'التقديم السهل عبر المنصة',
  step1TitleFr: 'Inscription en ligne',
  step1TitleEn: 'Online Registration',
  step1DescAr: 'تعبئة استمارة التطوع الإلكترونية',
  step1DescFr: 'Candidature simple et trilingue',
  step1DescEn: 'Simple trilingual application',

  step2TitleAr: 'المواكبة والتأطير الميداني',
  step2TitleFr: 'Formation et mentorat',
  step2TitleEn: 'Field Training & Mentorship',
  step2DescAr: 'جلسات توجيه وصقل المهارات القيادية',
  step2DescFr: 'Développement artistique et leadership',
  step2DescEn: 'Artistic & leadership development',

  step3TitleAr: 'تنظيم التظاهرات الفنية',
  step3TitleFr: 'Production d\'événements',
  step3TitleEn: 'Event Production',
  step3DescAr: 'المشاركة الفاعلة في الورش والمهرجانات',
  step3DescFr: 'Coordination culturelle active',
  step3DescEn: 'Hands-on cultural coordination',

  step4TitleAr: 'شهادة تطوع وتجربة موثقة',
  step4TitleFr: 'Expérience certifiée',
  step4TitleEn: 'Certified Experience',
  step4DescAr: 'إثراء المسار الأكاديمي والمهني',
  step4DescFr: 'Attestation officielle de bénévolat',
  step4DescEn: 'Formal volunteering certificate',

  ctaPrimaryTextAr: 'اكتشف تفاصيل المبادرة',
  ctaPrimaryTextFr: 'Découvrir l\'initiative',
  ctaPrimaryTextEn: 'Discover Initiative Details',
  ctaPrimaryUrl: '/programs/youth-in-action',

  ctaSecondaryTextAr: 'من نحن',
  ctaSecondaryTextFr: 'À propos de nous',
  ctaSecondaryTextEn: 'About Us',
  ctaSecondaryUrl: '/about',
}

export async function getFlagshipProgramSettings(): Promise<FlagshipProgramConfig> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'flagship_program')
      .maybeSingle()

    if (error || !data || !data.value) {
      return defaultFlagshipProgramConfig
    }

    const val = data.value as Partial<FlagshipProgramConfig>
    return {
      enabled: typeof val.enabled === 'boolean' ? val.enabled : defaultFlagshipProgramConfig.enabled,
      programSlug: val.programSlug || defaultFlagshipProgramConfig.programSlug,
      badgeAr: val.badgeAr || defaultFlagshipProgramConfig.badgeAr,
      badgeFr: val.badgeFr || defaultFlagshipProgramConfig.badgeFr,
      badgeEn: val.badgeEn || defaultFlagshipProgramConfig.badgeEn,
      titleAr: val.titleAr || defaultFlagshipProgramConfig.titleAr,
      titleFr: val.titleFr || defaultFlagshipProgramConfig.titleFr,
      titleEn: val.titleEn || defaultFlagshipProgramConfig.titleEn,
      descriptionAr: val.descriptionAr || defaultFlagshipProgramConfig.descriptionAr,
      descriptionFr: val.descriptionFr || defaultFlagshipProgramConfig.descriptionFr,
      descriptionEn: val.descriptionEn || defaultFlagshipProgramConfig.descriptionEn,
      imageUrl: typeof val.imageUrl === 'string'
        ? (val.imageUrl === '/images/youth-in-action.png' ? '/images/youth-in-action.jpg' : val.imageUrl)
        : defaultFlagshipProgramConfig.imageUrl,
      imageCaptionAr: val.imageCaptionAr || defaultFlagshipProgramConfig.imageCaptionAr,
      imageCaptionFr: val.imageCaptionFr || defaultFlagshipProgramConfig.imageCaptionFr,
      imageCaptionEn: val.imageCaptionEn || defaultFlagshipProgramConfig.imageCaptionEn,
      imageSubcaption: val.imageSubcaption || defaultFlagshipProgramConfig.imageSubcaption,

      step1TitleAr: val.step1TitleAr || defaultFlagshipProgramConfig.step1TitleAr,
      step1TitleFr: val.step1TitleFr || defaultFlagshipProgramConfig.step1TitleFr,
      step1TitleEn: val.step1TitleEn || defaultFlagshipProgramConfig.step1TitleEn,
      step1DescAr: val.step1DescAr || defaultFlagshipProgramConfig.step1DescAr,
      step1DescFr: val.step1DescFr || defaultFlagshipProgramConfig.step1DescFr,
      step1DescEn: val.step1DescEn || defaultFlagshipProgramConfig.step1DescEn,

      step2TitleAr: val.step2TitleAr || defaultFlagshipProgramConfig.step2TitleAr,
      step2TitleFr: val.step2TitleFr || defaultFlagshipProgramConfig.step2TitleFr,
      step2TitleEn: val.step2TitleEn || defaultFlagshipProgramConfig.step2TitleEn,
      step2DescAr: val.step2DescAr || defaultFlagshipProgramConfig.step2DescAr,
      step2DescFr: val.step2DescFr || defaultFlagshipProgramConfig.step2DescFr,
      step2DescEn: val.step2DescEn || defaultFlagshipProgramConfig.step2DescEn,

      step3TitleAr: val.step3TitleAr || defaultFlagshipProgramConfig.step3TitleAr,
      step3TitleFr: val.step3TitleFr || defaultFlagshipProgramConfig.step3TitleFr,
      step3TitleEn: val.step3TitleEn || defaultFlagshipProgramConfig.step3TitleEn,
      step3DescAr: val.step3DescAr || defaultFlagshipProgramConfig.step3DescAr,
      step3DescFr: val.step3DescFr || defaultFlagshipProgramConfig.step3DescFr,
      step3DescEn: val.step3DescEn || defaultFlagshipProgramConfig.step3DescEn,

      step4TitleAr: val.step4TitleAr || defaultFlagshipProgramConfig.step4TitleAr,
      step4TitleFr: val.step4TitleFr || defaultFlagshipProgramConfig.step4TitleFr,
      step4TitleEn: val.step4TitleEn || defaultFlagshipProgramConfig.step4TitleEn,
      step4DescAr: val.step4DescAr || defaultFlagshipProgramConfig.step4DescAr,
      step4DescFr: val.step4DescFr || defaultFlagshipProgramConfig.step4DescFr,
      step4DescEn: val.step4DescEn || defaultFlagshipProgramConfig.step4DescEn,

      ctaPrimaryTextAr: val.ctaPrimaryTextAr || defaultFlagshipProgramConfig.ctaPrimaryTextAr,
      ctaPrimaryTextFr: val.ctaPrimaryTextFr || defaultFlagshipProgramConfig.ctaPrimaryTextFr,
      ctaPrimaryTextEn: val.ctaPrimaryTextEn || defaultFlagshipProgramConfig.ctaPrimaryTextEn,
      ctaPrimaryUrl: val.ctaPrimaryUrl || defaultFlagshipProgramConfig.ctaPrimaryUrl,

      ctaSecondaryTextAr: val.ctaSecondaryTextAr || defaultFlagshipProgramConfig.ctaSecondaryTextAr,
      ctaSecondaryTextFr: val.ctaSecondaryTextFr || defaultFlagshipProgramConfig.ctaSecondaryTextFr,
      ctaSecondaryTextEn: val.ctaSecondaryTextEn || defaultFlagshipProgramConfig.ctaSecondaryTextEn,
      ctaSecondaryUrl: val.ctaSecondaryUrl || defaultFlagshipProgramConfig.ctaSecondaryUrl,
    }
  } catch {
    return defaultFlagshipProgramConfig
  }
}

export interface FaqItemConfig {
  id: string
  questionAr: string
  questionFr?: string
  questionEn?: string
  answerAr: string
  answerFr?: string
  answerEn?: string
  category: 'general' | 'membership' | 'volunteering' | 'partnerships' | 'events'
  showOnHome: boolean
  published: boolean
  order: number
}

export interface FaqConfig {
  items: FaqItemConfig[]
}

export const defaultFaqConfig: FaqConfig = {
  items: [
    {
      id: 'faq-amycc-about',
      questionAr: 'ما هي جمعية روح الفنون والثقافة (AMYCC) وما هو إطارها القانوني؟',
      questionFr: "Qu'est-ce que l'Association AMYCC et quel est son statut légal ?",
      questionEn: 'What is the Spirit of Arts & Culture Association (AMYCC)?',
      answerAr: 'جمعية روح الفنون والثقافة (AMYCC) هي منظمة مغربية مدنية غير ربحية تأسست سنة 2026 في إطار الظهير الشريف رقم 1.58.376 المنظم لحق تأسيس الجمعيات. تكرس جهودها لتمكين الشباب وصون التراث الثقافي المغربي، وإطلاق المبادرات الفنية والإبداعية والتطوعية في مختلف جهات المملكة.',
      answerFr: "L'Association Esprit des Arts et de la Culture (AMYCC) est une organisation marocaine à but non lucratif fondée en 2026 en vertu du Dahir n° 1.58.376. Elle œuvre pour la promotion des arts, la sauvegarde du patrimoine culturel et l'autonomisation des jeunes à travers le Royaume.",
      answerEn: 'Spirit of Arts & Culture Association (AMYCC) is a Moroccan nonprofit founded in 2026 under Dahir No. 1.58.376. It is dedicated to promoting visual arts, music, performing arts, cultural heritage preservation, and youth empowerment across Morocco.',
      category: 'general',
      showOnHome: true,
      published: true,
      order: 1,
    },
    {
      id: 'faq-youth-in-action',
      questionAr: 'ما هي مبادرة "شباب في العمل" وكيف يمكنني التطوع فيها؟',
      questionFr: 'Comment participer à l\'initiative "Jeunesse en Action" ?',
      questionEn: 'What is the "Youth in Action" volunteering initiative?',
      answerAr: 'هي المبادرة التطوعية والمجتمعية الرائدة للجمعية، تهدف إلى إشراك الشباب في تخطيط وتنظيم الفعاليات الثقافية والورشات الفنية الميدانية. يمكنك التقديم مجاناً عبر ملء استمارة التطوع المتاحة على المنصة، وتمنح الجمعية شواهد تطوع وتجربة جمعوية معتمدة لكافة المشاركين.',
      answerFr: "Il s'agit de notre initiative citoyenne phare. Vous pouvez postuler en ligne via notre formulaire de bénévolat pour participer activement à l'organisation d'événements et recevoir une attestation certifiée d'engagement civique.",
      answerEn: 'It is our flagship civic initiative empowering young Moroccans to co-create and lead cultural events, workshops, and community outreach projects with official volunteering certificates.',
      category: 'volunteering',
      showOnHome: true,
      published: true,
      order: 2,
    },
    {
      id: 'faq-membership',
      questionAr: 'كيف يمكن الانخراط والحصول على بطاقة العضوية في الجمعية؟',
      questionFr: 'Comment devenir membre adhérent de l\'AMYCC ?',
      questionEn: 'How can I become an active member of AMYCC?',
      answerAr: 'يمكن للراغبين في الانخراط تعبئة استمارة العضوية الإلكترونية في قسم "الانخراط". تتم دراسة الطلبات من طرف مكتب الجمعية وفقاً لمقتضيات النظام الأساسي والداخلي، ويتم التواصل مع مقدم الطلب لتأكيد انخراطه السنوي وتسليمه بطاقة العضوية.',
      answerFr: "Remplissez le formulaire d'adhésion en ligne. Votre candidature sera examinée par le bureau exécutif conformément aux statuts de l'association, puis nous prendrons contact avec vous.",
      answerEn: 'Submit an online membership application through our portal. Applications are promptly reviewed by the association\'s executive board in accordance with our bylaws.',
      category: 'membership',
      showOnHome: true,
      published: true,
      order: 3,
    },
    {
      id: 'faq-partnerships',
      questionAr: 'كيف يمكن للمؤسسات والمراكز الثقافية والتعليمية عقد شراكة مع AMYCC؟',
      questionFr: 'Comment proposer un partenariat institutionnel avec l\'association ?',
      questionEn: 'How can organizations establish a partnership with AMYCC?',
      answerAr: 'نرحب بجميع الشراكات الهادفة مع المراكز الثقافية، دور الشباب، المدارس، الجامعات، والجهات الراعية من القطاعين العام والخاص. يمكن تقديم مقترح شراكة مؤسساتية عبر صفحة الشراكات على المنصة أو التواصل المباشر عبر البريد الرسمي contact@amycc.org.',
      answerFr: 'Nous collaborons étroitement avec les centres culturels, universités, écoles et mécènes. Déposez votre projet via notre page dédiée aux partenariats ou écrivez-nous à contact@amycc.org.',
      answerEn: 'Cultural centers, educational institutes, and private sponsors can submit formal collaboration proposals via our dedicated partnerships page or email us directly at contact@amycc.org.',
      category: 'partnerships',
      showOnHome: true,
      published: true,
      order: 4,
    },
    {
      id: 'faq-events-tickets',
      questionAr: 'هل حضور وتذاكر فعاليات وورشات الجمعية مجانية أم تتطلب رسوماً؟',
      questionFr: 'L\'accès aux événements et ateliers est-il gratuit ?',
      questionEn: 'Are AMYCC events and workshops free to attend?',
      answerAr: 'معظم ورشات العمل والأنشطة الشبابية مجانية ومفتوحة للعموم عبر التسجيل المسبق على الموقع لضمان المقعد، في حين قد تتطلب بعض العروض الفنية الكبرى رسوم اشتراك رمزية لدعم صندوق الجمعية وتغطية التكاليف الإنتاجية واللوجستية.',
      answerFr: 'La majorité des ateliers et événements sont gratuits sur inscription préalable sur notre site. Certaines représentations spéciales peuvent requérir une contribution symbolique pour soutenir la production.',
      answerEn: 'Most cultural workshops and community events are free with advance online registration. Select major performances may require a symbolic contribution to support production costs.',
      category: 'events',
      showOnHome: false,
      published: true,
      order: 5,
    },
  ],
}

export async function getFaqSettings(): Promise<FaqConfig> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'faqs')
      .maybeSingle()

    if (error || !data || !data.value) {
      return defaultFaqConfig
    }

    const val = data.value as Partial<FaqConfig>
    if (!Array.isArray(val.items) || val.items.length === 0) {
      return defaultFaqConfig
    }

    return {
      items: val.items
        .map((item, index) => ({
          id: item.id || `faq-${index + 1}`,
          questionAr: item.questionAr || '',
          questionFr: item.questionFr || '',
          questionEn: item.questionEn || '',
          answerAr: item.answerAr || '',
          answerFr: item.answerFr || '',
          answerEn: item.answerEn || '',
          category: (['general', 'membership', 'volunteering', 'partnerships', 'events'].includes(item.category)
            ? item.category
            : 'general') as FaqItemConfig['category'],
          showOnHome: typeof item.showOnHome === 'boolean' ? item.showOnHome : true,
          published: typeof item.published === 'boolean' ? item.published : true,
          order: typeof item.order === 'number' ? item.order : index + 1,
        }))
        .sort((a, b) => a.order - b.order),
    }
  } catch {
    return defaultFaqConfig
  }
}

export interface AreaItemConfig {
  key: string
  icon: string
  iconImg: string
  titleAr: string
  titleFr?: string
  titleEn?: string
  tagAr: string
  tagFr?: string
  tagEn?: string
  descAr: string
  descFr?: string
  descEn?: string
  headlineAr: string
  headlineFr?: string
  headlineEn?: string
  objectivesAr: string[]
  objectivesFr?: string[]
  objectivesEn?: string[]
  initiativesAr: string[]
  initiativesFr?: string[]
  initiativesEn?: string[]
  actionLabelAr?: string
  actionLabelFr?: string
  actionLabelEn?: string
  actionUrl: string
  accent?: string
  bgGlow?: string
  order: number
  enabled: boolean
  showInitiatives?: boolean
}

export interface AreasConfig {
  sectionTitleAr?: string
  sectionTitleFr?: string
  sectionTitleEn?: string
  sectionSubtitleAr?: string
  sectionSubtitleFr?: string
  sectionSubtitleEn?: string
  eyebrowAr?: string
  eyebrowFr?: string
  eyebrowEn?: string
  showInitiativesGlobally?: boolean
  items: AreaItemConfig[]
}

export const defaultAreasConfig: AreasConfig = {
  sectionTitleAr: 'مجالات التدخل الستة للجمعية',
  sectionTitleFr: "Nos six domaines d'intervention",
  sectionTitleEn: 'Six Core Areas of Intervention',
  sectionSubtitleAr: 'رؤية ثقافية متكاملة تهدف إلى إطلاق الطاقات الإبداعية وبناء جسور التواصل المجتمعي.',
  sectionSubtitleFr: 'Une approche culturelle intégrée conçue pour libérer le potentiel créatif et renforcer les liens communautaires.',
  sectionSubtitleEn: 'A multifaceted cultural approach designed to unlock creative potential and build inclusive communities.',
  eyebrowAr: 'مجالات النشاط الجمعوي',
  eyebrowFr: "Domaines d'Activité",
  eyebrowEn: 'Core Disciplines',
  showInitiativesGlobally: true,
  items: [
    {
      key: 'arts',
      icon: '🎨',
      iconImg: '/icons/arts.png',
      titleAr: 'الفنون والإبداع',
      titleFr: 'Arts & Création',
      titleEn: 'Visual & Fine Arts',
      tagAr: 'محترفات تشكيلية ومعارض',
      tagFr: 'Arts Plastiques',
      tagEn: 'Visual & Fine Arts',
      descAr: 'الفنون التشكيلية، الرسم، التصوير الفوتوغرافي، والورشات الإبداعية المحفزة على الابتكار.',
      descFr: "Arts plastiques, peinture, photographie et ateliers de créativité stimulant l'innovation.",
      descEn: 'Visual arts, painting, photography, and creative masterclasses sparking youth innovation.',
      headlineAr: 'رعاية المواهب التشكيلية والبصرية وصقل الحس الجمالي لدى الشباب',
      headlineFr: 'Accompagnement des talents émergents et valorisation des arts visuels au Maroc',
      headlineEn: 'Nurturing emerging visual arts talent and fostering creative expression across Morocco',
      objectivesAr: [
        'تنظيم محترفات تدريبية متخصصة في الرسم المعاصر، النحت، والخط العربي الأصيل.',
        'إقامة معارض فردية وجماعية لإبراز إبداعات الفنانين الشباب وربطهم بسوق الفن.',
        'توظيف الفنون البصرية في تجميل الفضاءات العمومية وجداريات الأحياء برؤية حضرية متجددة.',
      ],
      objectivesFr: [
        "Organisation d'ateliers spécialisés en peinture contemporaine, sculpture et calligraphie.",
        'Expositions collectives et individuelles pour propulser les jeunes artistes marocains.',
        "Réalisation de fresques murales valorisant l'espace public et le vivre-ensemble.",
      ],
      objectivesEn: [
        'Specialized masterclasses in contemporary painting, sculpture, and classical Arabic calligraphy.',
        'Curated solo and collective exhibitions connecting emerging artists with art platforms.',
        'Community mural initiatives transforming urban spaces through inspiring visual arts.',
      ],
      initiativesAr: [
        'محترف الرسم التشكيلي للناشئة والشباب',
        'المعرض السنوي "إشراقات بصرية"',
        'ملتقى التصوير الفوتوغرافي لتوثيق التراث المغربي',
      ],
      initiativesFr: [
        "Atelier d'arts plastiques pour les jeunes créateurs",
        'Exposition annuelle "Reflets Visuels"',
        'Rencontre photographique de sauvegarde du patrimoine',
      ],
      initiativesEn: [
        'Youth Fine Arts & Illustration Studio',
        'Annual "Visual Reflections" Art Showcase',
        'Heritage Documentary Photography Forum',
      ],
      actionLabelAr: 'استكشف برامج الفنون',
      actionLabelFr: 'Découvrir les programmes',
      actionLabelEn: 'Explore Art Programs',
      actionUrl: '/programs',
      accent: 'border-[#c85a32]/30 text-[#c85a32]',
      bgGlow: 'from-[#fae4dc]/40 to-transparent',
      order: 1,
      enabled: true,
      showInitiatives: true,
    },
    {
      key: 'music',
      icon: '🎵',
      iconImg: '/icons/music.png',
      titleAr: 'الموسيقى والصوتيات',
      titleFr: 'Musique & Acoustique',
      titleEn: 'Heritage & Musical Arts',
      tagAr: 'تراث وأداء موسيقي',
      tagFr: 'Patrimoine Musical',
      tagEn: 'Heritage & Musical Arts',
      descAr: 'إحياء التراث الموسيقي المغربي الأصيل، والتأليف الموسيقي، والتدريب على الآلات.',
      descFr: 'Renaissance du patrimoine musical marocain, composition et formation instrumentale.',
      descEn: 'Reviving authentic Moroccan musical heritage, composition, and instrument training.',
      headlineAr: 'إحياء المقامات والطبوع المغربية الأصيلة وتطوير مهارات العزف والتأليف',
      headlineFr: 'Sauvegarde des répertoires traditionnels marocains et transmission instrumentale',
      headlineEn: 'Preserving authentic Moroccan music genres and training the next generation of performers',
      objectivesAr: [
        'صون وتوثيق الأنغام والطبوع التراثية كالأندلسي، الملحون، كناوة، والأنماط الأمازيغية.',
        'توفير دورات تدريبية وتطبيقية على الآلات الكلاسيكية (العود، الكمان، القانون، والإيقاعات).',
        'تأطير الشباب في كتابة وتأليف الألحان الموسيقية الحديثة بروح مغربية متجذرة.',
      ],
      objectivesFr: [
        'Préservation des patrimoines musicaux andalou, malhoun, gnawa et amazigh.',
        'Formations instrumentales pratiques (luth, violon, qanun et percussions marocaines).',
        'Accompagnement à la composition contemporaine inspirée de nos racines séculaires.',
      ],
      objectivesEn: [
        'Preserving and documenting Andalusian, Malhoun, Gnawa, and Amazigh musical traditions.',
        'Hands-on instrument masterclasses in Oud, classical strings, and traditional percussion.',
        'Supporting youth in contemporary music composition infused with Moroccan identity.',
      ],
      initiativesAr: [
        'أمسيات "ليالي الروح والمقام"',
        'أكاديمية تدريب العزف على العود والوتريات',
        'استوديو التسجيل الصوتي لدعم المواهب الشابة',
      ],
      initiativesFr: [
        'Soirées musicales "Nuits Spirituelles"',
        'Académie du luth et des instruments à cordes',
        "Studio d'enregistrement pour les talents émergents",
      ],
      initiativesEn: [
        '"Spiritual Melodies" Concert Series',
        'Oud & Traditional Strings Youth Academy',
        'Acoustic Sound Lab for Emerging Talent',
      ],
      actionLabelAr: 'استكشف فعاليات الموسيقى',
      actionLabelFr: 'Voir les événements musicaux',
      actionLabelEn: 'Explore Music Events',
      actionUrl: '/events',
      accent: 'border-[#0d3b43]/30 text-[#0d3b43]',
      bgGlow: 'from-[#d8f0f4]/40 to-transparent',
      order: 2,
      enabled: true,
      showInitiatives: true,
    },
    {
      key: 'theatre',
      icon: '🎭',
      iconImg: '/icons/theatre.png',
      titleAr: 'المسرح وفنون العرض',
      titleFr: 'Théâtre & Arts Scéniques',
      titleEn: 'Theatre & Scenic Expression',
      tagAr: 'تعبير مسرحي وارتجال',
      tagFr: 'Jeu Scénique',
      tagEn: 'Theatre & Scenic Expression',
      descAr: 'التعبير المسرحي، فن الحكاية، الأداء الركحي، والورشات الدرامية للناشئة والشباب.',
      descFr: 'Expression théâtrale, art du conte, jeu scénique et ateliers dramatiques.',
      descEn: 'Theatrical expression, traditional storytelling, stage performance, and drama workshops.',
      headlineAr: 'المسرح كمرآة للمجتمع، وسيلة للتعبير الحر، ومدرسة لتنمية الثقة والخطابة',
      headlineFr: "Le théâtre comme vecteur d'émancipation citoyenne, d'éloquence et de cohésion",
      headlineEn: 'Theatre as a mirror of society, a catalyst for critical thinking and public eloquence',
      objectivesAr: [
        'تنمية مهارات التعبير الجسدي والصوتي، وفن الارتجال المسرحي لدى الشباب.',
        'إحياء فن الحكاية الشعبية التراثية (الحلقة) بأساليب سينوغرافية معاصرة ومبتكرة.',
        'إنتاج عروض مسرحية هادفة تعالج القضايا الإنسانية والمجتمعية الراهنة بروح نقدية.',
      ],
      objectivesFr: [
        "Développement de l'expression corporelle, de la maîtrise vocale et de l'improvisation.",
        'Réinvention scénographique contemporaine du conte traditionnel marocain (Halqa).',
        'Production de spectacles engagés abordant avec sensibilité les enjeux de jeunesse.',
      ],
      objectivesEn: [
        'Cultivating stage presence, vocal projection, and theatrical improvisation skills.',
        'Reimagining classical Moroccan storytelling (Halqa) through contemporary staging.',
        'Producing socially engaged stage productions that spark dialogue and empathy.',
      ],
      initiativesAr: [
        'محترف إعداد الممثل والسينوغرافيا',
        'ملتقى الحكواتي وفنون الركح',
        'جولة المسرح التفاعلي بدور الشباب والمراكز الثقافية',
      ],
      initiativesFr: [
        'Atelier du comédien et scénographie',
        'Festival du conteur et des arts de la scène',
        'Tournée de théâtre interactif dans les maisons de jeunes',
      ],
      initiativesEn: [
        'Actor Training & Scenography Studio',
        'Storytellers & Stage Arts Showcase',
        'Interactive Youth Theatre Community Tour',
      ],
      actionLabelAr: 'شاهد مسرحيات الجمعية',
      actionLabelFr: 'Voir nos pièces de théâtre',
      actionLabelEn: 'View Theatre Plays',
      actionUrl: '/events',
      accent: 'border-[#d99b26]/40 text-[#d99b26]',
      bgGlow: 'from-[#fdf2db]/40 to-transparent',
      order: 3,
      enabled: true,
      showInitiatives: true,
    },
    {
      key: 'culture',
      icon: '🏛️',
      iconImg: '/icons/culture.png',
      titleAr: 'الثقافة والتراث',
      titleFr: 'Culture & Patrimoine',
      titleEn: 'Moroccan Cultural Heritage',
      tagAr: 'صون الذاكرة والتراث',
      tagFr: 'Patrimoine & Mémoire',
      tagEn: 'Moroccan Cultural Heritage',
      descAr: 'حماية وتثمين التنوع الثقافي المغربي، والموروث الشفهي، والتقاليد الوطنية الأصيلة.',
      descFr: 'Sauvegarde et valorisation de la diversité culturelle marocaine et du patrimoine oral.',
      descEn: 'Safeguarding and celebrating authentic Moroccan heritage, oral history, and traditions.',
      headlineAr: 'حماية الذاكرة الوطنية، وتثمين التنوع الثقافي المغربي الزاخر عبر الأجيال',
      headlineFr: 'Préservation de la mémoire nationale et valorisation de la riche diversité marocaine',
      headlineEn: "Preserving national cultural memory and celebrating Morocco's diverse heritage",
      objectivesAr: [
        'توثيق الحرف والصناعات التقليدية وفنون العمارة التاريخية من خلال الأرشفة الرقمية.',
        'ترسيخ الاعتزاز بالهوية المغربية المتعددة الروافد (العربية، الأمازيغية، الحسانية، والأندلسية).',
        'تنظيم زيارات ميدانية استكشافية للمآثر والمدن العتيقة لربط الجيل الصاعد بجذوره.',
      ],
      objectivesFr: [
        "Documentation et archivage numérique des savoir-faire artisanaux et de l'architecture.",
        "Célébration des confluents pluriels de l'identité marocaine (arabe, amazigh, hassani).",
        'Visites pédagogiques immersives dans les médinas historiques et monuments majeurs.',
      ],
      objectivesEn: [
        'Digital documentation and archiving of traditional crafts, architecture, and folklore.',
        'Celebrating the pluralistic foundations of Moroccan identity (Arab, Amazigh, Hassani).',
        'Organizing educational immersive journeys to historic medinas and cultural landmarks.',
      ],
      initiativesAr: [
        'منصة الأرشيف الرقمي للتراث الشفهي',
        'سلسلة ندوات "ذاكرة المكان والمبدع"',
        'دليل المسارات الثقافية بالمدن المغربية',
      ],
      initiativesFr: [
        'Plateforme numérique des archives orales',
        'Conférences "Mémoire des Lieux et Créateurs"',
        'Guide des circuits culturels du Maroc',
      ],
      initiativesEn: [
        'Oral History & Folklore Digital Archive',
        '"Memory of Places & Makers" Symposia Series',
        'Moroccan Cultural Heritage Trail Guide',
      ],
      actionLabelAr: 'رؤية الجمعية للتراث',
      actionLabelFr: 'Notre vision du patrimoine',
      actionLabelEn: 'Our Heritage Vision',
      actionUrl: '/about#vision',
      accent: 'border-[#0d3b43]/30 text-[#0d3b43]',
      bgGlow: 'from-[#d8f0f4]/40 to-transparent',
      order: 4,
      enabled: true,
      showInitiatives: true,
    },
    {
      key: 'youth',
      icon: '🚀',
      iconImg: '/icons/youth.png',
      titleAr: 'تمكين الشباب',
      titleFr: 'Autonomisation des Jeunes',
      titleEn: 'Youth Leadership & Skills',
      tagAr: 'تكوين وقيادة شبابية',
      tagFr: 'Leadership Jeunesse',
      tagEn: 'Youth Leadership & Skills',
      descAr: 'بناء القدرات القيادية، ورشات التكوين، والتوجيه المهني في المهن الفنية والثقافية.',
      descFr: 'Renforcement du leadership, ateliers de formation et orientation dans les métiers créatifs.',
      descEn: 'Building leadership capacity, professional mentorship, and creative career guidance.',
      headlineAr: 'بناء القيادات الإبداعية وتأهيل الشباب لولوج المهن الثقافية والفنية باحترافية',
      headlineFr: "Formation des leaders culturels et accompagnement à l'insertion professionnelle créative",
      headlineEn: 'Fostering creative leaders and preparing youth for cultural career opportunities',
      objectivesAr: [
        'تأطير الشباب في إدارة المشاريع الثقافية، التدبير اللوجستي، والتسويق الرقمي للفعاليات.',
        'توفير الإرشاد والمرافقة المهنية للمشاريع الإبداعية والشركات الناشئة في مجال الفنون.',
        'صقل المهارات الحياتية كالتفاوض، القيادة التشاركية، والعمل الميداني المنظم.',
      ],
      objectivesFr: [
        'Gestion de projets culturels, ingénierie événementielle et marketing digital.',
        'Incubation et mentorat personnalisé pour les initiatives et startups créatives.',
        "Développement des compétences de vie (leadership collaboratif, prise de parole, négociation).",
      ],
      objectivesEn: [
        'Comprehensive training in cultural project management, logistics, and digital event marketing.',
        'Professional mentorship and incubation for youth-led artistic ventures and cultural initiatives.',
        'Strengthening soft skills: collaborative leadership, public speaking, and team problem-solving.',
      ],
      initiativesAr: [
        'أكاديمية التدبير الثقافي للشباب',
        'مختبر الابتكار الاجتماعي الإبداعي',
        'برنامج التوجيه والمرافقة للمبدعين الصاعدين',
      ],
      initiativesFr: [
        'Académie du management culturel pour jeunes',
        "Laboratoire d'innovation sociale et artistique",
        'Programme de mentorat pour artistes émergents',
      ],
      initiativesEn: [
        'Youth Cultural Management Academy',
        'Creative Social Innovation Incubator',
        'Emerging Creatives Mentorship Cohort',
      ],
      actionLabelAr: 'انضم إلى برامج التمكين',
      actionLabelFr: "Rejoindre l'académie",
      actionLabelEn: 'Join Leadership Programs',
      actionUrl: '/membership',
      accent: 'border-[#c85a32]/30 text-[#c85a32]',
      bgGlow: 'from-[#fae4dc]/40 to-transparent',
      order: 5,
      enabled: true,
      showInitiatives: true,
    },
    {
      key: 'community',
      icon: '🤝',
      iconImg: '/icons/community.png',
      titleAr: 'العمل المجتمعي والتطوع',
      titleFr: 'Action Communautaire',
      titleEn: 'Civic Volunteering Program',
      tagAr: 'مبادرة شباب في العمل',
      tagFr: 'Jeunesse en Action',
      tagEn: 'Civic Volunteering Program',
      descAr: 'التطوع المدني، تنشيط الأحياء، والأنشطة الثقافية التضامنية ذات الأثر الإيجابي.',
      descFr: 'Bénévolat civique, animation des quartiers et actions culturelles solidaires.',
      descEn: 'Civic volunteering, neighborhood cultural outreach, and impactful community actions.',
      headlineAr: 'إشاعة الفن في كل حي وترسيخ ثقافة التطوع الإيجابي لخدمة الصالح العام',
      headlineFr: "Démocratisation de l'accès à la culture et engagement civique solidaire",
      headlineEn: 'Democratizing cultural access and empowering youth through civic volunteering',
      objectivesAr: [
        'قيادة مبادرة "شباب في العمل" التطوعية لتنظيم وتأطير التظاهرات والمهرجانات الثقافية.',
        'إطلاق قوافل ثقافية متنقلة تستهدف المراكز القروية والأحياء الأقل تجهيزاً.',
        'منح المتطوعين شواهد خبرة وتجربة موثقة تفتح لهم آفاق الاندماج الاجتماعي والمهني.',
      ],
      objectivesFr: [
        'Pilotage de l\'initiative citoyenne "Jeunesse en Action" pour animer les festivals.',
        'Caravanes culturelles solidaires dans les zones rurales et quartiers prioritaires.',
        "Délivrance d'attestations certifiées valorisant l'engagement civique et les compétences.",
      ],
      objectivesEn: [
        'Leading the "Youth in Action" volunteering framework for cultural event production.',
        'Mobile solidarity caravans delivering workshops to rural and underserved communities.',
        'Providing verified volunteering certifications that enhance professional career prospects.',
      ],
      initiativesAr: [
        'مبادرة "شباب في العمل" — AMYCC',
        'قافلة الفنون المتنقلة للمدارس ودور الشباب',
        'الملتقى السنوي للاحتفاء بالمتطوعين والشركاء',
      ],
      initiativesFr: [
        'Initiative citoyenne "Jeunesse en Action"',
        'Caravane artistique mobile pour les écoles',
        'Célébration annuelle des bénévoles et partenaires',
      ],
      initiativesEn: [
        '"Youth in Action" Civic Volunteering Hub',
        'Mobile Arts Caravan for Schools & Community Centers',
        'Annual Volunteer Appreciation & Community Awards',
      ],
      actionLabelAr: 'تطوع في شباب في العمل',
      actionLabelFr: 'Postuler au bénévolat',
      actionLabelEn: 'Apply for Volunteering',
      actionUrl: '/programs/youth-in-action',
      accent: 'border-[#d99b26]/40 text-[#d99b26]',
      bgGlow: 'from-[#fdf2db]/40 to-transparent',
      order: 6,
      enabled: true,
      showInitiatives: true,
    },
  ],
}

export async function getAreasSettings(): Promise<AreasConfig> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'areas')
      .maybeSingle()

    if (error || !data || !data.value) {
      return defaultAreasConfig
    }

    const val = data.value as Partial<AreasConfig>
    if (!Array.isArray(val.items) || val.items.length === 0) {
      return defaultAreasConfig
    }

    return {
      sectionTitleAr: val.sectionTitleAr || defaultAreasConfig.sectionTitleAr,
      sectionTitleFr: val.sectionTitleFr || defaultAreasConfig.sectionTitleFr,
      sectionTitleEn: val.sectionTitleEn || defaultAreasConfig.sectionTitleEn,
      sectionSubtitleAr: val.sectionSubtitleAr || defaultAreasConfig.sectionSubtitleAr,
      sectionSubtitleFr: val.sectionSubtitleFr || defaultAreasConfig.sectionSubtitleFr,
      sectionSubtitleEn: val.sectionSubtitleEn || defaultAreasConfig.sectionSubtitleEn,
      eyebrowAr: val.eyebrowAr || defaultAreasConfig.eyebrowAr,
      eyebrowFr: val.eyebrowFr || defaultAreasConfig.eyebrowFr,
      eyebrowEn: val.eyebrowEn || defaultAreasConfig.eyebrowEn,
      showInitiativesGlobally: val.showInitiativesGlobally !== false,
      items: val.items
        .map((item, index) => ({
          key: item.key || `area-${index + 1}`,
          icon: item.icon || '🎨',
          iconImg: item.iconImg || '/icons/arts.png',
          titleAr: item.titleAr || '',
          titleFr: item.titleFr || '',
          titleEn: item.titleEn || '',
          tagAr: item.tagAr || '',
          tagFr: item.tagFr || '',
          tagEn: item.tagEn || '',
          descAr: item.descAr || '',
          descFr: item.descFr || '',
          descEn: item.descEn || '',
          headlineAr: item.headlineAr || '',
          headlineFr: item.headlineFr || '',
          headlineEn: item.headlineEn || '',
          objectivesAr: Array.isArray(item.objectivesAr) ? item.objectivesAr : [],
          objectivesFr: Array.isArray(item.objectivesFr) ? item.objectivesFr : [],
          objectivesEn: Array.isArray(item.objectivesEn) ? item.objectivesEn : [],
          initiativesAr: Array.isArray(item.initiativesAr) ? item.initiativesAr : [],
          initiativesFr: Array.isArray(item.initiativesFr) ? item.initiativesFr : [],
          initiativesEn: Array.isArray(item.initiativesEn) ? item.initiativesEn : [],
          actionLabelAr: item.actionLabelAr || 'اعرف أكثر',
          actionLabelFr: item.actionLabelFr || 'En savoir plus',
          actionLabelEn: item.actionLabelEn || 'Learn More',
          actionUrl: item.actionUrl || '/programs',
          accent: item.accent || 'border-[#c85a32]/30 text-[#c85a32]',
          bgGlow: item.bgGlow || 'from-[#fae4dc]/40 to-transparent',
          order: typeof item.order === 'number' ? item.order : index + 1,
          enabled: typeof item.enabled === 'boolean' ? item.enabled : true,
          showInitiatives: typeof item.showInitiatives === 'boolean' ? item.showInitiatives : true,
        }))
        .sort((a, b) => a.order - b.order),
    }
  } catch {
    return defaultAreasConfig
  }
}

// ============================================================
// TEAM MEMBERS & LEADERSHIP SETTINGS (فريق العمل والهيكلة)
// ============================================================

export interface TeamMemberConfig {
  id: string
  nameAr: string
  nameFr: string
  nameEn: string
  roleAr: string
  roleFr: string
  roleEn: string
  category: 'executive' | 'committee' | 'advisor'
  titleStatusAr?: string
  titleStatusFr?: string
  titleStatusEn?: string
  badgeStatusAr?: string
  badgeStatusFr?: string
  badgeStatusEn?: string
  descAr: string
  descFr: string
  descEn: string
  dutiesAr?: string[]
  dutiesFr?: string[]
  dutiesEn?: string[]
  photoUrl?: string
  icon?: string
  colorClass?: string
  accentBg?: string
  order: number
  enabled: boolean
}

export interface TeamHeroConfig {
  imageUrl?: string
  showImage?: boolean
  badge1Ar?: string
  badge1Fr?: string
  badge1En?: string
  badge2Ar?: string
  badge2Fr?: string
  badge2En?: string
  titleAr?: string
  titleFr?: string
  titleEn?: string
  descriptionAr?: string
  descriptionFr?: string
  descriptionEn?: string
}

export const defaultTeamHeroConfig: TeamHeroConfig = {
  imageUrl: '/images/youth-in-action.jpg',
  showImage: true,
  badge1Ar: 'الهيكل الإداري والتنظيمي المعتمد • جمعية AMYCC',
  badge1Fr: 'Structure Administrative & Organisationnelle • AMYCC',
  badge1En: 'Official Organizational Leadership • AMYCC',
  badge2Ar: 'تأطير وطني بروح شبابية مسؤولة 🇲🇦',
  badge2Fr: 'Engagement Civique & Jeunesse 🇲🇦',
  badge2En: 'Nationwide Civic Leadership 🇲🇦',
  titleAr: 'طاقات شبابية وكفاءات ثقافية\nتقود مسيرة الإبداع والتأهيل الميداني',
  titleFr: 'Énergies Jeunes & Compétences Culturelles\nau Service de l’Art et de l’Engagement',
  titleEn: 'Youth Energy & Cultural Leadership\nDriving Artistic Innovation in Morocco',
  descriptionAr: 'يتألف فريق عمل جمعية روح الفنون والثقافة (AMYCC) من مكتب تنفيذي منتخب ولجان فنية متخصصة تجمع بين الخبرة الميدانية، الشغف الفني، والالتزام الصارم بمبادئ الشفافية والمسؤولية لخدمة قضايا الشباب والتراث المغربي.',
  descriptionFr: "L'équipe de l'Association Marocaine des Jeunes, Culture & Créativité (AMYCC) réunit un bureau exécutif élu et des commissions spécialisées engagées pour l'animation culturelle, la valorisation du patrimoine et la formation des jeunes.",
  descriptionEn: 'The team of the Spirit of Arts & Culture Association (AMYCC) comprises an elected executive board and specialized committees dedicated to arts education, heritage celebration, and empowering young creatives across Morocco.',
}

export interface TeamConfig {
  hero?: TeamHeroConfig
  members: TeamMemberConfig[]
}

export const defaultTeamConfig: TeamConfig = {
  hero: defaultTeamHeroConfig,
  members: [
    {
      id: 'president',
      nameAr: 'عضوية الرئاسة والتوجيه العام',
      nameFr: 'Président(e) Fondateur(rice)',
      nameEn: 'President & Founder',
      roleAr: 'رئيس(ة) الجمعية',
      roleFr: 'Président(e) de l’Association',
      roleEn: 'President of the Association',
      category: 'executive',
      titleStatusAr: 'التمثيل القانوني والتوجيه الاستراتيجي',
      titleStatusFr: 'Représentation Légale & Stratégie',
      titleStatusEn: 'Legal Representation & Strategic Direction',
      badgeStatusAr: 'عضوية معتمدة بالنظام الأساسي',
      badgeStatusFr: 'Mandat Statutaire',
      badgeStatusEn: 'Statutory Mandate',
      descAr: 'التمثيل القانوني للجمعية أمام السلطات العمومية والشركاء، الإشراف العام على التوجهات الاستراتيجية، والدعوة لاجتماعات المكتب التنفيذي والجموع العامة.',
      descFr: 'Représentation légale de l’association auprès des autorités et partenaires, coordination stratégique et convocation des assemblées générales et réunions du bureau.',
      descEn: 'Official legal representative of the association before authorities and partners, overseeing strategic orientation and executive board coordination.',
      icon: '🏛️',
      colorClass: 'border-[#0d3b43]/30 hover:border-[#0d3b43]',
      accentBg: 'bg-[#0d3b43]/10 text-[#0d3b43]',
      dutiesAr: ['إبرام الشراكات والاتفاقيات الرسمية', 'السهر على احترام القانون الأساسي والداخلي', 'الناطق الرسمي باسم الجمعية'],
      dutiesFr: ['Signature des accords officiels', 'Garant du respect des statuts associatifs', 'Porte-parole institutionnel'],
      dutiesEn: ['Executing official agreements & partnerships', 'Safeguarding statutory bylaws compliance', 'Official association spokesperson'],
      photoUrl: '',
      order: 1,
      enabled: true,
    },
    {
      id: 'secretary_general',
      nameAr: 'عضوية الكتابة العامة والتوثيق',
      nameFr: 'Secrétaire Général(e)',
      nameEn: 'Secretary General',
      roleAr: 'الكاتب(ة) العام',
      roleFr: 'Secrétaire Général(e)',
      roleEn: 'Secretary General',
      category: 'executive',
      titleStatusAr: 'التدبير الإداري والتوثيق',
      titleStatusFr: 'Administration & Documentation',
      titleStatusEn: 'Administration & Documentation',
      badgeStatusAr: 'عضوية معتمدة بالنظام الأساسي',
      badgeStatusFr: 'Mandat Statutaire',
      badgeStatusEn: 'Statutory Mandate',
      descAr: 'تسيير الشؤون الإدارية للجمعية، تحرير وتوثيق محاضر الاجتماعات والجموع العامة، وحفظ السجلات الرسمية وملفات المنخرطين والأرشيف المؤسساتي.',
      descFr: 'Gestion administrative, rédaction et conservation des procès-verbaux, tenue du registre des adhérents et correspondances institutionnelles officielles.',
      descEn: 'Managing administrative operations, drafting official minutes, archiving records, and maintaining the verified membership registry.',
      icon: '📜',
      colorClass: 'border-[#c85a32]/30 hover:border-[#c85a32]',
      accentBg: 'bg-[#c85a32]/10 text-[#c85a32]',
      dutiesAr: ['تحرير وتوثيق المحاضر والتقارير الأدبية', 'ضبط سجلات الانخراط وملفات العضوية', 'التنسيق الإداري والمراسلات الرسمية'],
      dutiesFr: ['Rédaction des procès-verbaux et rapports moraux', 'Tenue rigoureuse du registre des adhérents', 'Liaison administrative et correspondances officielles'],
      dutiesEn: ['Drafting minutes and annual moral reports', 'Maintaining membership and volunteer registries', 'Managing administrative and official communications'],
      photoUrl: '',
      order: 2,
      enabled: true,
    },
    {
      id: 'treasurer',
      nameAr: 'عضوية أمانة المال والتدبير المالي',
      nameFr: 'Trésorier(ère) Général(e)',
      nameEn: 'General Treasurer',
      roleAr: 'أمين(ة) المال',
      roleFr: 'Trésorier(ère) Général(e)',
      roleEn: 'General Treasurer',
      category: 'executive',
      titleStatusAr: 'التدبير المالي والرقابة المحاسبية',
      titleStatusFr: 'Gestion Financière & Comptabilité',
      titleStatusEn: 'Financial Management & Accounting',
      badgeStatusAr: 'عضوية معتمدة بالنظام الأساسي',
      badgeStatusFr: 'Mandat Statutaire',
      badgeStatusEn: 'Statutory Mandate',
      descAr: 'التدبير المالي والمحاسباتي المدقق، إعداد الميزانيات التقديرية والتقارير المالية السنوية، والإشراف المباشر على الحساب البنكي الرسمي وسندات الصرف.',
      descFr: 'Gestion financière et comptable rigoureuse, élaboration des bilans annuels certifiés et suivi transparent du compte bancaire officiel de l’association.',
      descEn: 'Overseeing financial stewardship, maintaining verified bookkeeping, managing official bank operations, and presenting annual financial statements.',
      icon: '💼',
      colorClass: 'border-[#d99b26]/30 hover:border-[#d99b26]',
      accentBg: 'bg-[#d99b26]/10 text-[#99620b]',
      dutiesAr: ['المسك المحاسباتي والتدبير البنكي الرسمي', 'إعداد التقرير المالي السنوي للافتحاص', 'توثيق وصولات التبرعات وسندات النفقات'],
      dutiesFr: ['Tenue de la comptabilité et gestion bancaire', 'Élaboration du rapport financier annuel pour audit', 'Émission des reçus officiels et suivi des dépenses'],
      dutiesEn: ['Verified accounting & official bank administration', 'Compiling annual financial report for audit', 'Issuing receipts & tracking program budgets'],
      photoUrl: '',
      order: 3,
      enabled: true,
    },
    {
      id: 'vice_president',
      nameAr: 'عضوية نيابة الرئاسة والتنسيق',
      nameFr: 'Vice-Président(e)',
      nameEn: 'Vice President',
      roleAr: 'نائب(ة) الرئيس',
      roleFr: 'Vice-Président(e)',
      roleEn: 'Vice President',
      category: 'executive',
      titleStatusAr: 'التنسيق المؤسساتي والميداني',
      titleStatusFr: 'Coordination Institutionnelle',
      titleStatusEn: 'Institutional Coordination',
      badgeStatusAr: 'عضوية معتمدة بالنظام الأساسي',
      badgeStatusFr: 'Mandat Statutaire',
      badgeStatusEn: 'Statutory Mandate',
      descAr: 'مؤازرة الرئاسة في المهام التمثيلية والنيابة عنها عند الاقتضاء، وتنسيق العلاقات مع شبكة الفروع والمراكز الثقافية ودور الشباب الشريكة بالمملكة.',
      descFr: 'Appui direct à la présidence, intérim statutaire et coordination des partenariats avec les centres culturels, maisons de jeunes et partenaires associatifs.',
      descEn: 'Assisting executive leadership, serving as deputy, and steering collaborative alliances with youth centers and cultural venues.',
      icon: '🤝',
      colorClass: 'border-[#1c6875]/30 hover:border-[#1c6875]',
      accentBg: 'bg-[#1c6875]/10 text-[#1c6875]',
      dutiesAr: ['التنسيق الميداني للشراكات المؤسساتية', 'تتبع المبادرات في دور الشباب والمراكز', 'النيابة التمثيلية بتفويض من الرئاسة'],
      dutiesFr: ['Coordination des partenariats institutionnels', 'Suivi des programmes dans les maisons de jeunes', 'Délégation légale de représentation'],
      dutiesEn: ['Field coordination of institutional partnerships', 'Program monitoring across cultural centers', 'Delegated legal executive representation'],
      photoUrl: '',
      order: 4,
      enabled: true,
    },
    {
      id: 'deputy_secretary',
      nameAr: 'عضوية نيابة الكتابة العامة',
      nameFr: 'Secrétaire Général(e) Adjoint(e)',
      nameEn: 'Deputy Secretary General',
      roleAr: 'نائب(ة) الكاتب العام',
      roleFr: 'Secrétaire Général(e) Adjoint(e)',
      roleEn: 'Deputy Secretary General',
      category: 'executive',
      titleStatusAr: 'التنظيم الداخلي والتنسيق',
      titleStatusFr: 'Coordination Interne',
      titleStatusEn: 'Internal Coordination',
      badgeStatusAr: 'عضوية معتمدة بالنظام الأساسي',
      badgeStatusFr: 'Mandat Statutaire',
      badgeStatusEn: 'Statutory Mandate',
      descAr: 'مساندة الكتابة العامة في التواصل الإداري الداخلي، تدبير منصات التسجيل الرقمي، وإعداد الدعوات والمطبوعات الخاصة بالفعاليات والجموع العامة.',
      descFr: 'Soutien aux fonctions du secrétariat général, gestion des plateformes d’inscription numérique et préparation des convocations aux assemblées.',
      descEn: 'Supporting the secretary general, managing registration platforms, preparing official notices, and handling internal logistics.',
      icon: '📋',
      colorClass: 'border-[#08242a]/30 hover:border-[#08242a]',
      accentBg: 'bg-[#08242a]/10 text-[#08242a]',
      dutiesAr: ['تدبير طلبات العضوية والمنخرطين رقمياً', 'تنظيم الأرشيف والمستندات الورقية والإلكترونية', 'الإشراف على إشعارات ودعوات الأنشطة'],
      dutiesFr: ['Traitement numérique des demandes d’adhésion', 'Archivage des documents physiques et digitaux', 'Diffusion des convocations et annonces officielles'],
      dutiesEn: ['Digital intake of membership applications', 'Archiving physical and electronic documents', 'Circulating notices and formal callouts'],
      photoUrl: '',
      order: 5,
      enabled: true,
    },
    {
      id: 'deputy_treasurer',
      nameAr: 'عضوية نيابة أمانة المال',
      nameFr: 'Trésorier(ère) Adjoint(e)',
      nameEn: 'Deputy Treasurer',
      roleAr: 'نائب(ة) أمين المال',
      roleFr: 'Trésorier(ère) Adjoint(e)',
      roleEn: 'Deputy Treasurer',
      category: 'executive',
      titleStatusAr: 'التدبير اللوجستي والمالي للميدان',
      titleStatusFr: 'Logistique Financière de Terrain',
      titleStatusEn: 'Field Logistics & Budget Tracking',
      badgeStatusAr: 'عضوية معتمدة بالنظام الأساسي',
      badgeStatusFr: 'Mandat Statutaire',
      badgeStatusEn: 'Statutory Mandate',
      descAr: 'مساندة أمانة المال في تدبير لوجستيك المشتريات الميدانية، جرد ممتلكات وتجهيزات الجمعية، وضبط فواتير ومصروفات الورشات الفنية.',
      descFr: 'Appui au trésorier général dans la gestion des achats de terrain, inventaire des équipements artistiques et suivi des justificatifs de dépenses.',
      descEn: 'Assisting the treasurer in purchasing logistics, maintaining cultural assets inventory, and tracking receipts for field workshops.',
      icon: '⚖️',
      colorClass: 'border-[#99620b]/30 hover:border-[#99620b]',
      accentBg: 'bg-[#99620b]/10 text-[#99620b]',
      dutiesAr: ['جرد وصيانة التجهيزات والمواد الفنية', 'ضبط وصولات المصاريف الميدانية الصغرى', 'المطابقة الدورية لسجلات المقتنيات'],
      dutiesFr: ['Inventaire et entretien du matériel artistique', 'Contrôle des pièces justificatives de terrain', 'Rapprochement des dépenses opérationnelles'],
      dutiesEn: ['Inventory and upkeep of artistic equipment', 'Verification of field operational receipts', 'Periodic audit of program procurement'],
      photoUrl: '',
      order: 6,
      enabled: true,
    },
  ],
}

export async function getTeamSettings(): Promise<TeamConfig> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'team')
      .maybeSingle()

    if (error || !data || !data.value) {
      return defaultTeamConfig
    }

    const val = data.value as Partial<TeamConfig>
    if (!val || !Array.isArray(val.members)) {
      return defaultTeamConfig
    }

    const heroVal = (val.hero || {}) as Partial<TeamHeroConfig>
    const hero: TeamHeroConfig = {
      imageUrl: typeof heroVal.imageUrl === 'string' ? heroVal.imageUrl : defaultTeamHeroConfig.imageUrl,
      showImage: typeof heroVal.showImage === 'boolean' ? heroVal.showImage : true,
      badge1Ar: heroVal.badge1Ar || defaultTeamHeroConfig.badge1Ar,
      badge1Fr: heroVal.badge1Fr || defaultTeamHeroConfig.badge1Fr,
      badge1En: heroVal.badge1En || defaultTeamHeroConfig.badge1En,
      badge2Ar: heroVal.badge2Ar || defaultTeamHeroConfig.badge2Ar,
      badge2Fr: heroVal.badge2Fr || defaultTeamHeroConfig.badge2Fr,
      badge2En: heroVal.badge2En || defaultTeamHeroConfig.badge2En,
      titleAr: heroVal.titleAr || defaultTeamHeroConfig.titleAr,
      titleFr: heroVal.titleFr || defaultTeamHeroConfig.titleFr,
      titleEn: heroVal.titleEn || defaultTeamHeroConfig.titleEn,
      descriptionAr: heroVal.descriptionAr || defaultTeamHeroConfig.descriptionAr,
      descriptionFr: heroVal.descriptionFr || defaultTeamHeroConfig.descriptionFr,
      descriptionEn: heroVal.descriptionEn || defaultTeamHeroConfig.descriptionEn,
    }

    return {
      hero,
      members: val.members
        .filter((item): item is TeamMemberConfig => typeof item === 'object' && item !== null && typeof item.id === 'string')
        .map((item, index) => ({
          id: item.id || `member-${index + 1}`,
          nameAr: item.nameAr || '',
          nameFr: item.nameFr || '',
          nameEn: item.nameEn || '',
          roleAr: item.roleAr || '',
          roleFr: item.roleFr || '',
          roleEn: item.roleEn || '',
          category: (['executive', 'committee', 'advisor'].includes(item.category) ? item.category : 'executive') as 'executive' | 'committee' | 'advisor',
          titleStatusAr: item.titleStatusAr || '',
          titleStatusFr: item.titleStatusFr || '',
          titleStatusEn: item.titleStatusEn || '',
          badgeStatusAr: item.badgeStatusAr || '',
          badgeStatusFr: item.badgeStatusFr || '',
          badgeStatusEn: item.badgeStatusEn || '',
          descAr: item.descAr || '',
          descFr: item.descFr || '',
          descEn: item.descEn || '',
          dutiesAr: Array.isArray(item.dutiesAr) ? item.dutiesAr : [],
          dutiesFr: Array.isArray(item.dutiesFr) ? item.dutiesFr : [],
          dutiesEn: Array.isArray(item.dutiesEn) ? item.dutiesEn : [],
          photoUrl: typeof item.photoUrl === 'string' ? item.photoUrl : '',
          icon: item.icon || '👤',
          colorClass: item.colorClass || 'border-[#0d3b43]/30 hover:border-[#0d3b43]',
          accentBg: item.accentBg || 'bg-[#0d3b43]/10 text-[#0d3b43]',
          order: typeof item.order === 'number' ? item.order : index + 1,
          enabled: typeof item.enabled === 'boolean' ? item.enabled : true,
        }))
        .sort((a, b) => a.order - b.order),
    }
  } catch {
    return defaultTeamConfig
  }
}

export interface CommissionItemConfig {
  id: string
  titleAr: string
  titleFr?: string
  titleEn?: string
  tagAr: string
  tagFr?: string
  tagEn?: string
  descAr: string
  descFr?: string
  descEn?: string
  icon: string
  borderClass?: string
  accentColor?: string
  accentBg?: string
  pointsAr: string[]
  pointsFr?: string[]
  pointsEn?: string[]
  targetLocalesAr?: string
  targetLocalesFr?: string
  targetLocalesEn?: string
  statusBadgeAr?: string
  statusBadgeFr?: string
  statusBadgeEn?: string
  order: number
  enabled: boolean
}

export interface CommissionsConfig {
  sectionTitleAr?: string
  sectionTitleFr?: string
  sectionTitleEn?: string
  sectionTagAr?: string
  sectionTagFr?: string
  sectionTagEn?: string
  sectionDescAr?: string
  sectionDescFr?: string
  sectionDescEn?: string
  items: CommissionItemConfig[]
}

export const defaultCommissionsConfig: CommissionsConfig = {
  sectionTagAr: 'الأذرع الميدانية والفنية',
  sectionTagFr: 'Pôles Opérationnels & Artistiques',
  sectionTagEn: 'Artistic & Operational Hubs',
  sectionTitleAr: 'اللجان الوظيفية وفرق التأطير المتخصصة',
  sectionTitleFr: 'Commissions Thématiques de Terrain',
  sectionTitleEn: 'Specialized Working Commissions',
  sectionDescAr: 'تشكل هذه اللجان الست المحرك الميداني الحقيقي لأنشطة الجمعية؛ حيث تسهر على التصميم الفني للورشات، مواكبة المواهب الصاعدة، وتنسيق الفعاليات المباشرة بشراكة مع دور الشباب، المراكز الثقافية، والجامعات.',
  sectionDescFr: 'Ces six commissions spécialisées constituent le cœur battant de l’AMYCC : conception pédagogique des ateliers, tutorat des talents émergents et déploiement d’événements en partenariat avec les maisons de jeunes et les universités.',
  sectionDescEn: 'These six dedicated commissions represent the active engine of AMYCC: designing practical syllabi, mentoring young creators, and coordinating live events across cultural centers and universities.',
  items: [
    {
      id: 'visual-arts',
      titleAr: 'لجنة الفنون البصرية والتشكيلية',
      titleFr: 'Commission Arts Visuels & Calligraphie',
      titleEn: 'Visual Arts & Calligraphy Committee',
      tagAr: 'محترفات إبداعية',
      tagFr: 'Ateliers Créatifs',
      tagEn: 'Creative Labs',
      descAr: 'تأطير ورشات الرسم التشكيلي، الصباغة المائية والزيتية، النحت، وفنون الخط المغربي الأصيل، وتنظيم المعارض الدورية للمواهب الصاعدة.',
      descFr: 'Conception et animation des ateliers de peinture, sculpture, dessin et calligraphie marocaine, accompagnés d’expositions collectives régulières.',
      descEn: 'Curating masterclasses in fine arts, watercolor, sculpture, and Moroccan calligraphy, organizing seasonal exhibitions for emerging talents.',
      icon: '🎨',
      borderClass: 'border-[#c85a32]/30 hover:border-[#c85a32]',
      accentColor: 'text-[#c85a32]',
      accentBg: 'bg-[#c85a32]/10',
      pointsAr: ['ورشات تطبيقية دورية في دور الشباب والمراكز الثقافية', 'تنظيم معارض جماعية ومسابقات تشكيلية سنوية', 'صون وتثمين أساليب الخط والزخرفة المغربية'],
      pointsFr: ['Ateliers pratiques réguliers dans les structures partenaires', 'Organisation d’expositions collectives et concours d’art', 'Mise en valeur de la calligraphie et du patrimoine visuel'],
      pointsEn: ['Regular practical workshops across community cultural centers', 'Annual group exhibitions and youth art showcases', 'Preserving Moroccan calligraphy and decorative traditions'],
      targetLocalesAr: 'فضاءات الثقافة ودور الشباب',
      targetLocalesFr: 'Centres Culturels & Jeunesse',
      targetLocalesEn: 'Community & Cultural Hubs',
      statusBadgeAr: 'تأطير نشط',
      statusBadgeFr: 'Actif',
      statusBadgeEn: 'Active',
      order: 1,
      enabled: true,
    },
    {
      id: 'theatre',
      titleAr: 'لجنة المسرح وفنون الأداء التعبيري',
      titleFr: 'Commission Théâtre & Arts Scéniques',
      titleEn: 'Theatre & Performing Arts Committee',
      tagAr: 'أداء تعبيري وخشبة',
      tagFr: 'Scène & Dramaturgie',
      tagEn: 'Stage & Drama',
      descAr: 'إعداد محترفات التشخيص المسرحي، الإلقاء، السينوغرافيا، والارتجال، وإنتاج عروض مسرحية هادفة تعالج قضايا الشباب وتنمي حس التواصل.',
      descFr: 'Encadrement des ateliers de dramaturgie, scénographie, diction et improvisation, avec création de spectacles citoyens portés par les jeunes.',
      descEn: 'Leading masterclasses in stage acting, dramatic improvisation, voice projection, and producing thought-provoking civic youth plays.',
      icon: '🎭',
      borderClass: 'border-[#0d3b43]/30 hover:border-[#0d3b43]',
      accentColor: 'text-[#0d3b43]',
      accentBg: 'bg-[#0d3b43]/10',
      pointsAr: ['محترفات الارتجال المسرحي والتعبير الجسدي', 'كتابة وإنتاج مسرحيات شبابية ذات طابع توعوي', 'المشاركة في المهرجانات والملتقيات الثقافية الوطنية'],
      pointsFr: ['Ateliers d’improvisation et d’expression corporelle', 'Écriture et production de pièces théâtrales engagées', 'Participation aux festivals et rencontres artistiques nationales'],
      pointsEn: ['Stage improvisation and body expression clinics', 'Scripting and producing awareness-raising youth plays', 'Participating in national and regional theatre festivals'],
      targetLocalesAr: 'فضاءات الثقافة ودور الشباب',
      targetLocalesFr: 'Centres Culturels & Jeunesse',
      targetLocalesEn: 'Community & Cultural Hubs',
      statusBadgeAr: 'تأطير نشط',
      statusBadgeFr: 'Actif',
      statusBadgeEn: 'Active',
      order: 2,
      enabled: true,
    },
    {
      id: 'music-heritage',
      titleAr: 'لجنة التراث الموسيقي والغناء الأصيل',
      titleFr: 'Commission Patrimoine Musical & Rythmes',
      titleEn: 'Musical Heritage & Rhythms Committee',
      tagAr: 'هوية وأصالة مغربية',
      tagFr: 'Patrimoine Vivant',
      tagEn: 'Living Heritage',
      descAr: 'صون الموروث النغمي والموسيقي المغربي بروافده المتنوعة (الأندلسي، الملحون، كناوة، الأمازيغي، والحساني)، وتدريب الناشئة على الآلات الأصيلة.',
      descFr: 'Préservation des répertoires musicaux marocains pluriels (andalou, malhoun, gnawa, amazigh et hassani) et initiation aux instruments traditionnels.',
      descEn: 'Safeguarding Moroccan musical traditions (Andalusian, Malhoun, Gnawa, Amazigh, Hassani) and training youth on acoustic instruments.',
      icon: '🎵',
      borderClass: 'border-[#d99b26]/30 hover:border-[#d99b26]',
      accentColor: 'text-[#99620b]',
      accentBg: 'bg-[#d99b26]/10',
      pointsAr: ['تكوين عملي في العزف على العود والوتريات والإيقاعات', 'توثيق القصائد والأهازيج التراثية الأصيلة', 'تنظيم أمسيات موسيقية وسماع فني راقٍ'],
      pointsFr: ['Apprentissage du oud et des percussions traditionnelles', 'Collecte et documentation des chants ancestraux', 'Organisation de soirées de musique acoustique et patrimoniale'],
      pointsEn: ['Hands-on training in Oud, strings, and heritage percussions', 'Documenting oral musical traditions and classical poetry', 'Curating refined acoustic musical showcases and recitals'],
      targetLocalesAr: 'فضاءات الثقافة ودور الشباب',
      targetLocalesFr: 'Centres Culturels & Jeunesse',
      targetLocalesEn: 'Community & Cultural Hubs',
      statusBadgeAr: 'تأطير نشط',
      statusBadgeFr: 'Actif',
      statusBadgeEn: 'Active',
      order: 3,
      enabled: true,
    },
    {
      id: 'media-communication',
      titleAr: 'لجنة الإعلام والتواصل الرقمي والتوثيق',
      titleFr: 'Commission Médias & Communication Numérique',
      titleEn: 'Media, Digital Communication & Documentation',
      tagAr: 'صناعة المحتوى والتوثيق',
      tagFr: 'Création Digitale',
      tagEn: 'Digital Content & Storytelling',
      descAr: 'التغطية الإعلامية الاحترافية لكافة التظاهرات، صناعة المحتوى المرئي، إدارة المنصات الرقمية للجمعية، وأرشفة الأثر الميداني للبرامج.',
      descFr: 'Couverture audiovisuelle des initiatives, production de contenus digitaux valorisants, gestion des plateformes en ligne et archivage de l’impact.',
      descEn: 'Professional audiovisual coverage, digital storytelling, managing institutional web channels, and archiving associative field impact.',
      icon: '📸',
      borderClass: 'border-[#1c6875]/30 hover:border-[#1c6875]',
      accentColor: 'text-[#1c6875]',
      accentBg: 'bg-[#1c6875]/10',
      pointsAr: ['تصوير وتوثيق كافة الورشات والفعاليات بجودة عالية', 'تدبير المنصة الرقمية الرسمية وشبكات التواصل الاجتماعي', 'إعداد النشرات الدورية والبيانات الصحفية'],
      pointsFr: ['Photographie et vidéo haute définition des activités', 'Gestion éditoriale du portail web et des réseaux sociaux', 'Publication des communiqués et synthèses d’impact'],
      pointsEn: ['High-definition photography and videography across all workshops', 'Content curation for the trilingual portal and social channels', 'Publishing regular newsletters, press releases, and media dossiers'],
      targetLocalesAr: 'فضاءات الثقافة ودور الشباب',
      targetLocalesFr: 'Centres Culturels & Jeunesse',
      targetLocalesEn: 'Community & Cultural Hubs',
      statusBadgeAr: 'تأطير نشط',
      statusBadgeFr: 'Actif',
      statusBadgeEn: 'Active',
      order: 4,
      enabled: true,
    },
    {
      id: 'youth-in-action',
      titleAr: 'منسقية مبادرة "شباب في العمل" والتطوع',
      titleFr: 'Coordination Jeunesse en Action & Volontariat',
      titleEn: 'Youth in Action & Civic Volunteering Coordination',
      tagAr: 'البرنامج الرائد والميدان',
      tagFr: 'Volontariat Actif',
      tagEn: 'Civic Action Hub',
      descAr: 'الإشراف على شبكة المتطوعين، تأهيل قادة الفرق الميدانية، وتدبير العمليات اللوجستية للمبادرات الثقافية والاجتماعية في الميدان.',
      descFr: 'Encadrement du réseau des bénévoles, formation des jeunes chefs d’équipe et déploiement logistique sur le terrain des actions culturelles.',
      descEn: 'Mobilizing our volunteer network, training youth leaders, and coordinating on-site logistics for cultural and community outreach.',
      icon: '🚀',
      borderClass: 'border-[#c85a32]/30 hover:border-[#c85a32]',
      accentColor: 'text-[#c85a32]',
      accentBg: 'bg-[#c85a32]/10',
      pointsAr: ['استقبال وتأطير المتطوعين الجدد وتوزيع الأدوار', 'تنسيق الفرق اللوجستية أثناء التظاهرات الكبرى', 'إصدار شواهد المشاركة والتطوع الميداني المعتمدة'],
      pointsFr: ['Accueil et mentorat des nouveaux bénévoles', 'Coordination opérationnelle lors des grands événements', 'Délivrance des attestations officielles d’engagement civique'],
      pointsEn: ['Intake, onboarding, and role placement for new volunteers', 'Operational deployment during major cultural initiatives', 'Awarding certified certificates of civic volunteering hours'],
      targetLocalesAr: 'فضاءات الثقافة ودور الشباب',
      targetLocalesFr: 'Centres Culturels & Jeunesse',
      targetLocalesEn: 'Community & Cultural Hubs',
      statusBadgeAr: 'تأطير نشط',
      statusBadgeFr: 'Actif',
      statusBadgeEn: 'Active',
      order: 5,
      enabled: true,
    },
    {
      id: 'capacity-building',
      titleAr: 'لجنة التكوين وتأهيل الكفاءات الحياتية',
      titleFr: 'Commission Formation & Compétences Clés',
      titleEn: 'Capacity Building & Youth Skills Commission',
      tagAr: 'ريادة وتمكين شبابي',
      tagFr: 'Développement Personnel',
      tagEn: 'Youth Empowerment & Leadership',
      descAr: 'تنظيم دورات تدريبية متقدمة في المهارات الحياتية، القيادة التشاركية، إدارة المشاريع الثقافية، وتأهيل الشباب لولوج مهن الصناعات الإبداعية.',
      descFr: 'Organisation de formations en soft skills, gestion de projets culturels, prise de parole et accompagnement vers les métiers créatifs.',
      descEn: 'Organizing masterclasses in life skills, participatory leadership, cultural project management, and creative industries career readiness.',
      icon: '📚',
      borderClass: 'border-[#08242a]/30 hover:border-[#08242a]',
      accentColor: 'text-[#08242a]',
      accentBg: 'bg-[#08242a]/10',
      pointsAr: ['ورشات في المهارات الشخصية (Soft Skills) والتواصل الفعال', 'تدريب على إعداد وإدارة المشاريع الثقافية المصغرة', 'استضافة مؤطرين وخبراء لمواكبة طموحات الشباب'],
      pointsFr: ['Formations en communication interpersonnelle et leadership', 'Méthodologie de montage de projets artistiques', 'Rencontres professionnelles avec des experts et créateurs'],
      pointsEn: ['Masterclasses in soft skills, negotiation, and teamwork', 'Cultural project incubation and management clinics', 'Hosting master workshops with established professionals'],
      targetLocalesAr: 'فضاءات الثقافة ودور الشباب',
      targetLocalesFr: 'Centres Culturels & Jeunesse',
      targetLocalesEn: 'Community & Cultural Hubs',
      statusBadgeAr: 'تأطير نشط',
      statusBadgeFr: 'Actif',
      statusBadgeEn: 'Active',
      order: 6,
      enabled: true,
    },
  ],
}

export async function getCommissionsSettings(): Promise<CommissionsConfig> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'commissions')
      .maybeSingle()

    if (error || !data || !data.value) {
      return defaultCommissionsConfig
    }

    const val = data.value as Partial<CommissionsConfig>
    if (!val || !Array.isArray(val.items)) {
      return defaultCommissionsConfig
    }

    return {
      sectionTagAr: val.sectionTagAr || defaultCommissionsConfig.sectionTagAr,
      sectionTagFr: val.sectionTagFr || defaultCommissionsConfig.sectionTagFr,
      sectionTagEn: val.sectionTagEn || defaultCommissionsConfig.sectionTagEn,
      sectionTitleAr: val.sectionTitleAr || defaultCommissionsConfig.sectionTitleAr,
      sectionTitleFr: val.sectionTitleFr || defaultCommissionsConfig.sectionTitleFr,
      sectionTitleEn: val.sectionTitleEn || defaultCommissionsConfig.sectionTitleEn,
      sectionDescAr: val.sectionDescAr || defaultCommissionsConfig.sectionDescAr,
      sectionDescFr: val.sectionDescFr || defaultCommissionsConfig.sectionDescFr,
      sectionDescEn: val.sectionDescEn || defaultCommissionsConfig.sectionDescEn,
      items: val.items
        .filter((item): item is CommissionItemConfig => typeof item === 'object' && item !== null && typeof item.id === 'string')
        .map((item, index) => ({
          id: item.id || `commission-${index + 1}`,
          titleAr: item.titleAr || '',
          titleFr: item.titleFr || '',
          titleEn: item.titleEn || '',
          tagAr: item.tagAr || '',
          tagFr: item.tagFr || '',
          tagEn: item.tagEn || '',
          descAr: item.descAr || '',
          descFr: item.descFr || '',
          descEn: item.descEn || '',
          icon: item.icon || '🎨',
          borderClass: item.borderClass || 'border-[#c85a32]/30 hover:border-[#c85a32]',
          accentColor: item.accentColor || 'text-[#c85a32]',
          accentBg: item.accentBg || 'bg-[#c85a32]/10',
          pointsAr: Array.isArray(item.pointsAr) ? item.pointsAr : [],
          pointsFr: Array.isArray(item.pointsFr) ? item.pointsFr : [],
          pointsEn: Array.isArray(item.pointsEn) ? item.pointsEn : [],
          targetLocalesAr: item.targetLocalesAr || 'فضاءات الثقافة ودور الشباب',
          targetLocalesFr: item.targetLocalesFr || 'Centres Culturels & Jeunesse',
          targetLocalesEn: item.targetLocalesEn || 'Community & Cultural Hubs',
          statusBadgeAr: item.statusBadgeAr || 'تأطير نشط',
          statusBadgeFr: item.statusBadgeFr || 'Actif',
          statusBadgeEn: item.statusBadgeEn || 'Active',
          order: typeof item.order === 'number' ? item.order : index + 1,
          enabled: typeof item.enabled === 'boolean' ? item.enabled : true,
        }))
        .sort((a, b) => a.order - b.order),
    }
  } catch {
    return defaultCommissionsConfig
  }
}

// ============================================================
// CONTACT PAGE CONFIGURATION & CMS SETTINGS
// ============================================================

export interface ContactDepartmentConfig {
  id: string
  titleAr: string
  titleFr?: string
  titleEn?: string
  descAr?: string
  descFr?: string
  descEn?: string
  email: string
  icon: string
  badgeAr?: string
  badgeFr?: string
  badgeEn?: string
  order: number
  enabled: boolean
}

export interface ContactFormTopicConfig {
  id: string
  labelAr: string
  labelFr?: string
  labelEn?: string
}

export interface ContactConfig {
  hero: {
    tagAr?: string
    tagFr?: string
    tagEn?: string
    badgeAr?: string
    badgeFr?: string
    badgeEn?: string
    titleAr?: string
    titleFr?: string
    titleEn?: string
    descriptionAr?: string
    descriptionFr?: string
    descriptionEn?: string
    imageUrl?: string
    showImage?: boolean
  }
  channels: {
    primaryEmail: string
    secondaryEmail?: string
    phone: string
    phoneSecondary?: string
    whatsapp?: string
    addressAr: string
    addressFr?: string
    addressEn?: string
    cityAr?: string
    cityFr?: string
    cityEn?: string
    workingHoursAr: string
    workingHoursFr?: string
    workingHoursEn?: string
    responseTimeAr: string
    responseTimeFr?: string
    responseTimeEn?: string
    mapLinkUrl?: string
    mapEmbedUrl?: string
  }
  social: {
    facebook?: string
    instagram?: string
    linkedin?: string
    youtube?: string
  }
  departments: ContactDepartmentConfig[]
  formTopics: ContactFormTopicConfig[]
}

export const defaultContactConfig: ContactConfig = {
  hero: {
    tagAr: 'بوابة التواصل والإنصات المؤسسي',
    tagFr: 'CANAL DE COMMUNICATION OFFICIEL',
    tagEn: 'OFFICIAL CONTACT GATEWAY',
    badgeAr: 'المملكة المغربية • جمعية روح الفنون والثقافة',
    badgeFr: 'Royaume du Maroc • AMYCC',
    badgeEn: 'Kingdom of Morocco • AMYCC',
    titleAr: 'يسعدنا التواصل معكم وبناء جسور التعاون الثقافي والفني',
    titleFr: 'Contactez-nous & Développons la Création Culturelle',
    titleEn: 'Connect with Us & Co-Create Cultural Impact in Morocco',
    descriptionAr: 'فريق إدارة الجمعية ومكاتب التنسيق في خدمتكم للإجابة عن الاستفسارات، مناقشة الشراكات، مواكبة طلبات الانخراط، والتفاعل الإيجابي مع مقترحاتكم الإبداعية.',
    descriptionFr: "L'équipe de direction de l'AMYCC est à votre disposition pour répondre à vos questions, explorer des partenariats et soutenir vos initiatives artistiques.",
    descriptionEn: 'The AMYCC leadership team is at your disposal for general inquiries, institutional partnerships, membership coordination, and supporting creative ideas.',
    imageUrl: '',
    showImage: true,
  },
  channels: {
    primaryEmail: 'contact@amycc.org',
    secondaryEmail: 'direction@amycc.org',
    phone: '+212 5 24 00 00 00',
    phoneSecondary: '+212 6 00 00 00 00',
    whatsapp: '+212 6 00 00 00 00',
    addressAr: 'شارع محمد السادس، جليز، مراكش، المملكة المغربية',
    addressFr: 'Avenue Mohammed VI, Guéliz, Marrakech, Maroc',
    addressEn: 'Mohammed VI Avenue, Gueliz, Marrakech, Morocco',
    cityAr: 'مراكش • جهات المملكة',
    cityFr: 'Marrakech • Maroc',
    cityEn: 'Marrakech • Morocco',
    workingHoursAr: 'من الاثنين إلى الجمعة: 09:00 - 18:00 (السبت مخصص للورشات الميدانية)',
    workingHoursFr: 'Du Lundi au Vendredi : 09h00 - 18h00 (Samedi ateliers terrain)',
    workingHoursEn: 'Monday to Friday: 09:00 - 18:00 (Saturdays for field workshops)',
    responseTimeAr: 'خلال 24 إلى 48 ساعة كحد أقصى (أيام العمل الرسمية)',
    responseTimeFr: 'Sous 24h à 48h ouvrées',
    responseTimeEn: 'Within 24 to 48 business hours',
    mapLinkUrl: 'https://maps.google.com/?q=Marrakech,Morocco',
    mapEmbedUrl: '',
  },
  social: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com',
    youtube: 'https://youtube.com',
  },
  departments: [
    {
      id: 'general',
      titleAr: 'الكتابة العامة والاستفسارات',
      titleFr: 'Secrétariat Général & Accueil',
      titleEn: 'General Secretariat & Inquiries',
      descAr: 'الاستفسارات العامة، مواعيد الجمع العام، وتتبع المراسلات الرسمية.',
      descFr: 'Renseignements généraux, calendrier et courriers officiels.',
      descEn: 'General inquiries, statutory updates, and administrative coordination.',
      email: 'contact@amycc.org',
      icon: '✉️',
      badgeAr: 'استفسارات عامة',
      badgeFr: 'Général',
      badgeEn: 'General',
      order: 1,
      enabled: true,
    },
    {
      id: 'partnerships',
      titleAr: 'العلاقات المؤسسية والشراكات',
      titleFr: 'Partenariats & Coopération',
      titleEn: 'Institutional Partnerships',
      descAr: 'تنسيق اتفاقيات التعاون مع المراكز الثقافية، المؤسسات، والهيئات الدولية.',
      descFr: 'Conventions de partenariat, mécénat et coopérations culturelles.',
      descEn: 'Strategic alliances, cultural sponsorships, and institutional agreements.',
      email: 'direction@amycc.org',
      icon: '🏛️',
      badgeAr: 'اتفاقيات وتعاون',
      badgeFr: 'Partenariats',
      badgeEn: 'Partnerships',
      order: 2,
      enabled: true,
    },
    {
      id: 'programs',
      titleAr: 'مبادرة شباب في العمل والتطوع',
      titleFr: 'Jeunesse en Action & Volontariat',
      titleEn: 'Youth in Action & Volunteers',
      descAr: 'تأطير المتطوعين، التسجيل في الورشات الفنية، والمشاريع الميدانية.',
      descFr: 'Mobilisation des bénévoles et inscription aux ateliers culturels.',
      descEn: 'Volunteer engagement, workshop participation, and grassroots projects.',
      email: 'programs@amycc.org',
      icon: '🎨',
      badgeAr: 'تطوع وورشات',
      badgeFr: 'Bénévolat',
      badgeEn: 'Volunteering',
      order: 3,
      enabled: true,
    },
    {
      id: 'press',
      titleAr: 'التواصل الإعلامي والصحافة',
      titleFr: 'Relations Presse & Médias',
      titleEn: 'Press & Media Relations',
      descAr: 'البيانات الصحفية، التغطيات الإعلامية، والملفات الصحفية لتظاهرات الجمعية.',
      descFr: 'Communiqués, accréditations et dossiers de presse des événements.',
      descEn: 'Press releases, media kits, event accreditations, and interviews.',
      email: 'press@amycc.org',
      icon: '📰',
      badgeAr: 'صحافة وإعلام',
      badgeFr: 'Presse',
      badgeEn: 'Press',
      order: 4,
      enabled: true,
    },
  ],
  formTopics: [
    { id: 'general', labelAr: 'استفسار عام حول أنشطة وبرامج الجمعية', labelFr: 'Renseignement général sur les activités', labelEn: 'General inquiry on AMYCC activities' },
    { id: 'youth_in_action', labelAr: 'المشاركة والتطوع في مبادرة "شباب في العمل"', labelFr: 'Participer au programme Jeunesse en Action', labelEn: 'Join the Youth in Action initiative' },
    { id: 'membership', labelAr: 'طلب الانخراط والعضوية في الجمعية', labelFr: 'Demande d’adhésion à l’association', labelEn: 'Membership and association enrollment' },
    { id: 'partnership', labelAr: 'مقترح شراكة مؤسسية أو رعاية ثقافية', labelFr: 'Proposition de partenariat ou mécénat', labelEn: 'Partnership or cultural sponsorship proposal' },
    { id: 'workshop', labelAr: 'اقتراح ورشة فنية أو مبادرة إبداعية', labelFr: 'Proposition d’atelier ou projet artistique', labelEn: 'Suggest an art workshop or creative initiative' },
    { id: 'press', labelAr: 'تغطية إعلامية أو تصريح صحفي', labelFr: 'Demande média ou presse', labelEn: 'Press coverage or media inquiry' },
  ],
}

export async function getContactSettings(): Promise<ContactConfig> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'contact')
      .maybeSingle()

    if (error || !data || !data.value) {
      // Fallback: check legacy contact_info and social_links
      const [infoRes, socialRes] = await Promise.all([
        supabase.from('site_settings').select('value').eq('key', 'contact_info').maybeSingle(),
        supabase.from('site_settings').select('value').eq('key', 'social_links').maybeSingle(),
      ])

      const infoVal = (infoRes.data?.value || {}) as Record<string, string>
      const socialVal = (socialRes.data?.value || {}) as Record<string, string>

      return {
        ...defaultContactConfig,
        channels: {
          ...defaultContactConfig.channels,
          primaryEmail: infoVal.email || defaultContactConfig.channels.primaryEmail,
          phone: infoVal.phone || defaultContactConfig.channels.phone,
          addressAr: infoVal.address || defaultContactConfig.channels.addressAr,
        },
        social: {
          ...defaultContactConfig.social,
          facebook: socialVal.facebook || defaultContactConfig.social.facebook,
          instagram: socialVal.instagram || defaultContactConfig.social.instagram,
          linkedin: socialVal.linkedin || defaultContactConfig.social.linkedin,
          youtube: socialVal.youtube || defaultContactConfig.social.youtube,
        },
      }
    }

    const val = data.value as Partial<ContactConfig>
    const heroVal = (val.hero || {}) as Partial<ContactConfig['hero']>
    const channelsVal = (val.channels || {}) as Partial<ContactConfig['channels']>
    const socialVal = (val.social || {}) as Partial<ContactConfig['social']>

    return {
      hero: {
        tagAr: heroVal.tagAr || defaultContactConfig.hero.tagAr,
        tagFr: heroVal.tagFr || defaultContactConfig.hero.tagFr,
        tagEn: heroVal.tagEn || defaultContactConfig.hero.tagEn,
        badgeAr: heroVal.badgeAr || defaultContactConfig.hero.badgeAr,
        badgeFr: heroVal.badgeFr || defaultContactConfig.hero.badgeFr,
        badgeEn: heroVal.badgeEn || defaultContactConfig.hero.badgeEn,
        titleAr: heroVal.titleAr || defaultContactConfig.hero.titleAr,
        titleFr: heroVal.titleFr || defaultContactConfig.hero.titleFr,
        titleEn: heroVal.titleEn || defaultContactConfig.hero.titleEn,
        descriptionAr: heroVal.descriptionAr || defaultContactConfig.hero.descriptionAr,
        descriptionFr: heroVal.descriptionFr || defaultContactConfig.hero.descriptionFr,
        descriptionEn: heroVal.descriptionEn || defaultContactConfig.hero.descriptionEn,
        imageUrl: typeof heroVal.imageUrl === 'string' ? heroVal.imageUrl : '',
      },
      channels: {
        primaryEmail: channelsVal.primaryEmail || defaultContactConfig.channels.primaryEmail,
        secondaryEmail: channelsVal.secondaryEmail || defaultContactConfig.channels.secondaryEmail,
        phone: channelsVal.phone || defaultContactConfig.channels.phone,
        phoneSecondary: channelsVal.phoneSecondary || defaultContactConfig.channels.phoneSecondary,
        whatsapp: channelsVal.whatsapp || defaultContactConfig.channels.whatsapp,
        addressAr: channelsVal.addressAr || defaultContactConfig.channels.addressAr,
        addressFr: channelsVal.addressFr || defaultContactConfig.channels.addressFr,
        addressEn: channelsVal.addressEn || defaultContactConfig.channels.addressEn,
        cityAr: channelsVal.cityAr || defaultContactConfig.channels.cityAr,
        cityFr: channelsVal.cityFr || defaultContactConfig.channels.cityFr,
        cityEn: channelsVal.cityEn || defaultContactConfig.channels.cityEn,
        workingHoursAr: channelsVal.workingHoursAr || defaultContactConfig.channels.workingHoursAr,
        workingHoursFr: channelsVal.workingHoursFr || defaultContactConfig.channels.workingHoursFr,
        workingHoursEn: channelsVal.workingHoursEn || defaultContactConfig.channels.workingHoursEn,
        responseTimeAr: channelsVal.responseTimeAr || defaultContactConfig.channels.responseTimeAr,
        responseTimeFr: channelsVal.responseTimeFr || defaultContactConfig.channels.responseTimeFr,
        responseTimeEn: channelsVal.responseTimeEn || defaultContactConfig.channels.responseTimeEn,
        mapLinkUrl: channelsVal.mapLinkUrl || defaultContactConfig.channels.mapLinkUrl,
        mapEmbedUrl: typeof channelsVal.mapEmbedUrl === 'string' ? channelsVal.mapEmbedUrl : defaultContactConfig.channels.mapEmbedUrl,
      },
      social: {
        facebook: typeof socialVal.facebook === 'string' ? socialVal.facebook : defaultContactConfig.social.facebook,
        instagram: typeof socialVal.instagram === 'string' ? socialVal.instagram : defaultContactConfig.social.instagram,
        linkedin: typeof socialVal.linkedin === 'string' ? socialVal.linkedin : defaultContactConfig.social.linkedin,
        youtube: typeof socialVal.youtube === 'string' ? socialVal.youtube : defaultContactConfig.social.youtube,
      },
      departments: Array.isArray(val.departments) && val.departments.length > 0
        ? val.departments
            .filter((d): d is ContactDepartmentConfig => typeof d === 'object' && d !== null && typeof d.id === 'string')
            .map((d, idx) => ({
              id: d.id,
              titleAr: d.titleAr || '',
              titleFr: d.titleFr || '',
              titleEn: d.titleEn || '',
              descAr: d.descAr || '',
              descFr: d.descFr || '',
              descEn: d.descEn || '',
              email: d.email || '',
              icon: d.icon || '✉️',
              badgeAr: d.badgeAr || '',
              badgeFr: d.badgeFr || '',
              badgeEn: d.badgeEn || '',
              order: typeof d.order === 'number' ? d.order : idx + 1,
              enabled: typeof d.enabled === 'boolean' ? d.enabled : true,
            }))
            .sort((a, b) => a.order - b.order)
        : defaultContactConfig.departments,
      formTopics: Array.isArray(val.formTopics) && val.formTopics.length > 0
        ? val.formTopics
            .filter((t): t is ContactFormTopicConfig => typeof t === 'object' && t !== null && typeof t.id === 'string')
            .map((t) => ({
              id: t.id,
              labelAr: t.labelAr || '',
              labelFr: t.labelFr || '',
              labelEn: t.labelEn || '',
            }))
        : defaultContactConfig.formTopics,
    }
  } catch {
    return defaultContactConfig
  }
}

// ============================================================
// 10. PROGRAMS PAGE & INSTITUTIONAL CMS SETTINGS
// ============================================================

export interface ProgramStatItem {
  id: string
  value: string
  labelAr: string
  labelFr?: string
  labelEn?: string
  icon: string
}

export interface ProgramsPageConfig {
  hero: {
    tagAr: string
    tagFr?: string
    tagEn?: string
    badgeAr: string
    badgeFr?: string
    badgeEn?: string
    titleAr: string
    titleFr?: string
    titleEn?: string
    descriptionAr: string
    descriptionFr?: string
    descriptionEn?: string
    imageUrl?: string
    showImage?: boolean
  }
  stats: ProgramStatItem[]
  cta: {
    titleAr: string
    titleFr?: string
    titleEn?: string
    descAr: string
    descFr?: string
    descEn?: string
    primaryBtnTextAr: string
    primaryBtnTextFr?: string
    primaryBtnTextEn?: string
    primaryBtnUrl: string
    secondaryBtnTextAr: string
    secondaryBtnTextFr?: string
    secondaryBtnTextEn?: string
    secondaryBtnUrl: string
  }
}

export const defaultProgramsPageConfig: ProgramsPageConfig = {
  hero: {
    tagAr: 'بوابة البرامج والمشاريع الثقافية • AMYCC Programs',
    tagFr: 'PROGRAMMES & INITIATIVES CULTURELLES',
    tagEn: 'CULTURAL PROGRAMS & INITIATIVES',
    badgeAr: 'المملكة المغربية • تمكين الشباب وصون التراث',
    badgeFr: 'Royaume du Maroc • Jeunesse & Patrimoine',
    badgeEn: 'Kingdom of Morocco • Youth & Heritage',
    titleAr: 'برامجنا ومبادراتنا: فضاءات حية\nلاكتشاف المواهب وبناء الأثر الثقافي',
    titleFr: 'Nos Programmes : Espaces Vivants pour la Création et l\'Épanouissement',
    titleEn: 'Our Programs: Vibrant Spaces for Talent Discovery & Cultural Impact',
    descriptionAr: 'تضع جمعية روح الفنون والثقافة في صلب رسالتها إطلاق برامج ومبادرات مستمرة تجمع بين التكوين الفني، التأطير الميداني، والعمل التطوعي الهادف، لتمكين شباب مختلف جهات المملكة وتثمين الموروث المغربي الأصيل.',
    descriptionFr: 'L\'AMYCC conçoit et déploie des programmes pérennes mêlant formation artistique, encadrement citoyen et valorisation du patrimoine marocain pour la jeunesse.',
    descriptionEn: 'AMYCC designs and leads enduring cultural initiatives that merge artistic training, youth mentorship, and Moroccan heritage preservation across the Kingdom.',
    imageUrl: '',
    showImage: true,
  },
  stats: [
    {
      id: 'stat-1',
      value: '+1,500',
      labelAr: 'مستفيد ومستفيدة من الورشات',
      labelFr: 'Bénéficiaires formés',
      labelEn: 'Trained beneficiaries',
      icon: '👥',
    },
    {
      id: 'stat-2',
      value: '12',
      labelAr: 'جهة مستهدفة بالمملكة',
      labelFr: 'Régions ciblées au Maroc',
      labelEn: 'Targeted regions',
      icon: '🇲🇦',
    },
    {
      id: 'stat-3',
      value: '+35',
      labelAr: 'ورشة تكوينية سنوياً',
      labelFr: 'Ateliers et résidences par an',
      labelEn: 'Annual workshops & labs',
      icon: '🎨',
    },
    {
      id: 'stat-4',
      value: '100%',
      labelAr: 'تأطير مجاني وتطوعي',
      labelFr: 'Encadrement associatif solidaire',
      labelEn: 'Community-driven mentorship',
      icon: '✨',
    },
  ],
  cta: {
    titleAr: 'هل لديك فكرة مشروع ثقافي أو مبادرة تود إطلاقها وتأطيرها معنا؟',
    titleFr: 'Vous avez une idée de projet ou d\'initiative culturelle à lancer avec nous ?',
    titleEn: 'Have a creative project or cultural initiative you want to launch with us?',
    descAr: 'تفتح جمعية روح الفنون والثقافة أبوابها لتبني ومواكبة الأفكار الإبداعية وتوفير التأطير الفني والإداري والشراكات اللازمة لتحويلها إلى مبادرات مجتمعية مؤثرة.',
    descFr: 'L\'AMYCC accueille et accompagne les porteurs de projets en leur apportant encadrement artistique, logistique et réseau de partenaires.',
    descEn: 'AMYCC welcomes and mentors youth initiatives, providing artistic, organizational, and institutional backing to turn ideas into community impact.',
    primaryBtnTextAr: 'اقترح مبادرتك وتواصل معنا',
    primaryBtnTextFr: 'Proposez votre projet',
    primaryBtnTextEn: 'Propose Your Initiative',
    primaryBtnUrl: '/contact',
    secondaryBtnTextAr: 'انخرط في الجمعية',
    secondaryBtnTextFr: 'Devenir Membre',
    secondaryBtnTextEn: 'Join as Member',
    secondaryBtnUrl: '/membership',
  },
}

export async function getProgramsPageSettings(): Promise<ProgramsPageConfig> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'programs_page')
      .maybeSingle()

    if (error || !data || !data.value) {
      return defaultProgramsPageConfig
    }

    const val = data.value as Partial<ProgramsPageConfig>
    const heroVal = (val.hero || {}) as Partial<ProgramsPageConfig['hero']>
    const ctaVal = (val.cta || {}) as Partial<ProgramsPageConfig['cta']>

    return {
      hero: {
        tagAr: heroVal.tagAr || defaultProgramsPageConfig.hero.tagAr,
        tagFr: heroVal.tagFr || defaultProgramsPageConfig.hero.tagFr,
        tagEn: heroVal.tagEn || defaultProgramsPageConfig.hero.tagEn,
        badgeAr: heroVal.badgeAr || defaultProgramsPageConfig.hero.badgeAr,
        badgeFr: heroVal.badgeFr || defaultProgramsPageConfig.hero.badgeFr,
        badgeEn: heroVal.badgeEn || defaultProgramsPageConfig.hero.badgeEn,
        titleAr: heroVal.titleAr || defaultProgramsPageConfig.hero.titleAr,
        titleFr: heroVal.titleFr || defaultProgramsPageConfig.hero.titleFr,
        titleEn: heroVal.titleEn || defaultProgramsPageConfig.hero.titleEn,
        descriptionAr: heroVal.descriptionAr || defaultProgramsPageConfig.hero.descriptionAr,
        descriptionFr: heroVal.descriptionFr || defaultProgramsPageConfig.hero.descriptionFr,
        descriptionEn: heroVal.descriptionEn || defaultProgramsPageConfig.hero.descriptionEn,
        imageUrl: typeof heroVal.imageUrl === 'string' ? heroVal.imageUrl : defaultProgramsPageConfig.hero.imageUrl,
        showImage: heroVal.showImage !== false,
      },
      stats: Array.isArray(val.stats) && val.stats.length > 0
        ? val.stats
            .filter((s): s is ProgramStatItem => typeof s === 'object' && s !== null && typeof s.id === 'string')
            .map((s) => ({
              id: s.id,
              value: s.value || '',
              labelAr: s.labelAr || '',
              labelFr: s.labelFr || '',
              labelEn: s.labelEn || '',
              icon: s.icon || '📌',
            }))
        : defaultProgramsPageConfig.stats,
      cta: {
        titleAr: ctaVal.titleAr || defaultProgramsPageConfig.cta.titleAr,
        titleFr: ctaVal.titleFr || defaultProgramsPageConfig.cta.titleFr,
        titleEn: ctaVal.titleEn || defaultProgramsPageConfig.cta.titleEn,
        descAr: ctaVal.descAr || defaultProgramsPageConfig.cta.descAr,
        descFr: ctaVal.descFr || defaultProgramsPageConfig.cta.descFr,
        descEn: ctaVal.descEn || defaultProgramsPageConfig.cta.descEn,
        primaryBtnTextAr: ctaVal.primaryBtnTextAr || defaultProgramsPageConfig.cta.primaryBtnTextAr,
        primaryBtnTextFr: ctaVal.primaryBtnTextFr || defaultProgramsPageConfig.cta.primaryBtnTextFr,
        primaryBtnTextEn: ctaVal.primaryBtnTextEn || defaultProgramsPageConfig.cta.primaryBtnTextEn,
        primaryBtnUrl: ctaVal.primaryBtnUrl || defaultProgramsPageConfig.cta.primaryBtnUrl,
        secondaryBtnTextAr: ctaVal.secondaryBtnTextAr || defaultProgramsPageConfig.cta.secondaryBtnTextAr,
        secondaryBtnTextFr: ctaVal.secondaryBtnTextFr || defaultProgramsPageConfig.cta.secondaryBtnTextFr,
        secondaryBtnTextEn: ctaVal.secondaryBtnTextEn || defaultProgramsPageConfig.cta.secondaryBtnTextEn,
        secondaryBtnUrl: ctaVal.secondaryBtnUrl || defaultProgramsPageConfig.cta.secondaryBtnUrl,
      },
    }
  } catch {
    return defaultProgramsPageConfig
  }
}

// ============================================================
// 10. ANNUAL PROGRAM CONFIGURATION (البرنامج السنوي)
// ============================================================

export interface AnnualProgramEventItem {
  id: string
  titleAr: string
  titleFr?: string
  titleEn?: string
  descAr: string
  descFr?: string
  descEn?: string
  categoryAr: string
  categoryFr?: string
  categoryEn?: string
  venueAr?: string
  venueFr?: string
  venueEn?: string
  status?: 'upcoming' | 'in_progress' | 'completed'
  highlight?: boolean
}

export interface AnnualProgramQuarter {
  id: string
  quarterNumber: number
  quarterAr: string
  quarterFr?: string
  quarterEn?: string
  periodAr: string
  periodFr?: string
  periodEn?: string
  badgeAr: string
  badgeFr?: string
  badgeEn?: string
  themeAr?: string
  themeFr?: string
  themeEn?: string
  icon: string
  iconSrc?: string
  color: string
  accentBg: string
  events: AnnualProgramEventItem[]
}

export interface AnnualProgramStatItem {
  id: string
  value: string
  labelAr: string
  labelFr?: string
  labelEn?: string
  icon: string
}

export interface AnnualProgramPillarItem {
  id: string
  icon: string
  titleAr: string
  titleFr?: string
  titleEn?: string
  descAr: string
  descFr?: string
  descEn?: string
}

export interface AnnualProgramConfig {
  hero: {
    year: string
    tagAr: string
    tagFr?: string
    tagEn?: string
    badgeAr: string
    badgeFr?: string
    badgeEn?: string
    titleAr: string
    titleFr?: string
    titleEn?: string
    descriptionAr: string
    descriptionFr?: string
    descriptionEn?: string
    imageUrl?: string
    showImage?: boolean
    brochureUrl?: string
    brochureLabelAr?: string
    brochureLabelFr?: string
    brochureLabelEn?: string
  }
  stats: AnnualProgramStatItem[]
  pillars: AnnualProgramPillarItem[]
  quarters: AnnualProgramQuarter[]
  cta: {
    badgeAr: string
    badgeFr?: string
    badgeEn?: string
    titleAr: string
    titleFr?: string
    titleEn?: string
    descAr: string
    descFr?: string
    descEn?: string
    primaryBtnTextAr: string
    primaryBtnTextFr?: string
    primaryBtnTextEn?: string
    primaryBtnUrl: string
    secondaryBtnTextAr: string
    secondaryBtnTextFr?: string
    secondaryBtnTextEn?: string
    secondaryBtnUrl: string
  }
}

export const defaultAnnualProgramConfig: AnnualProgramConfig = {
  hero: {
    year: '2026',
    tagAr: 'الأجندة السنوية الرسمية • AMYCC 2026',
    tagFr: 'AGENDA ANNUEL OFFICIEL • AMYCC 2026',
    tagEn: 'OFFICIAL ANNUAL ROADMAP • AMYCC 2026',
    badgeAr: 'المملكة المغربية • موسم ثقافي وفني شامل',
    badgeFr: 'Royaume du Maroc • Saison Culturelle & Artistique',
    badgeEn: 'Kingdom of Morocco • Full Cultural & Artistic Season',
    titleAr: 'البرنامج السنوي للموسم الثقافي 2026:\nإشعاع فني وتأطير شبابي متواصل',
    titleFr: 'Programme Annuel 2026 : Rayonnement Artistique et Engagement Citoyen',
    titleEn: '2026 Annual Cultural Program: Artistic Innovation & Civic Youth Mentorship',
    descriptionAr: 'تسطر جمعية روح الفنون والثقافة (AMYCC) برنامجها السنوي لسنة 2026 وفق برمجة فصلية محكمة تمتد على أربعة مواسم إبداعية متكاملة، تجمع بين التكوين الميداني في المسرح والموسيقى والفنون التشكيلية، وإشراك الشباب في الحياة المدنية والتطوع التضامني بمختلف جهات المملكة المغربية.',
    descriptionFr: "L'AMYCC déploie son programme annuel 2026 articulé autour de 4 trimestres créatifs majeurs, alliant formations pratiques en théâtre, musique et arts plastiques, au renforcement de l'engagement citoyen et du bénévolat solidaire à travers le Maroc.",
    descriptionEn: 'AMYCC unfolds its 2026 annual roadmap structured across four cohesive quarterly seasons, blending hands-on masterclasses in theatre, musical arts, and painting with youth civic empowerment across Morocco.',
    imageUrl: '/images/youth-in-action.jpg',
    showImage: true,
    brochureUrl: '',
    brochureLabelAr: 'تحميل دليل البرنامج السنوي (PDF)',
    brochureLabelFr: 'Télécharger la brochure annuelle (PDF)',
    brochureLabelEn: 'Download Annual Program Brochure (PDF)',
  },
  stats: [
    {
      id: 'stat-seasons',
      value: '4',
      labelAr: 'فصول ومواسم ثقافية كبرى',
      labelFr: 'Trimestres artistiques majeurs',
      labelEn: 'Major artistic quarters',
      icon: '🗓️',
    },
    {
      id: 'stat-workshops',
      value: '+50',
      labelAr: 'فعالية وورشة عمل مبرمجة',
      labelFr: 'Événements & ateliers au programme',
      labelEn: 'Programmed events & labs',
      icon: '🎨',
    },
    {
      id: 'stat-regions',
      value: '12',
      labelAr: 'جهة مستهدفة بالمملكة',
      labelFr: 'Régions ciblées au Maroc',
      labelEn: 'Targeted Moroccan regions',
      icon: '🇲🇦',
    },
    {
      id: 'stat-volunteers',
      value: '100%',
      labelAr: 'مبادرات تطوعية وتكوينية مجانية',
      labelFr: 'Initiatives bénévoles ouvertes et gratuites',
      labelEn: 'Open & free civic youth drives',
      icon: '✨',
    },
  ],
  pillars: [
    {
      id: 'pillar-arts',
      icon: '🎨',
      titleAr: 'الفنون التشكيلية والتراث الإبداعي',
      titleFr: 'Arts Plastiques & Créativité',
      titleEn: 'Visual Arts & Creative Heritage',
      descAr: 'محترفات الرسم، المعارض التشكيلية السنوية، واستكشاف التقنيات الجمالية للموروث المغربي الأصيل.',
      descFr: 'Ateliers de peinture contemporaine, expositions collectives annuelles et valorisation du patrimoine visuel.',
      descEn: 'Painting workshops, annual art showcases, and creative preservation of Moroccan visual identity.',
    },
    {
      id: 'pillar-theatre',
      icon: '🎭',
      titleAr: 'المسرح وفنون الأداء التعبيري',
      titleFr: 'Théâtre & Arts de la Scène',
      titleEn: 'Theatre & Performing Arts',
      descAr: 'تدريبات الإلقاء الصوتي، فن الحلقة والحكاية الشعبية، مسرح الشارع، وبناء الثقة لدى المواهب الصاعدة.',
      descFr: 'Diction, conte traditionnel (Halqa), théâtre de rue engagé et incubation de jeunes comédiens.',
      descEn: 'Voice training, storytelling, street performances, and talent incubation for emerging performers.',
    },
    {
      id: 'pillar-music',
      icon: '🎵',
      titleAr: 'التراث الموسيقي المغربي الأصيل',
      titleFr: 'Patrimoine Musical Marocain',
      titleEn: 'Moroccan Musical Heritage',
      descAr: 'حلقات العزف على الآلات الوترية، توثيق المقامات والأهازيج الجهوية، والأمسيات السماع التراثية.',
      descFr: 'Pratique instrumentale traditionnelle (luth), documentation des rythmes du terroir et soirées musicales.',
      descEn: 'Traditional string instrument mastery, melodic archiving, and authentic musical evenings.',
    },
    {
      id: 'pillar-youth',
      icon: '🤝',
      titleAr: 'تمكين الشباب والتطوع الميداني',
      titleFr: 'Autonomisation & Bénévolat',
      titleEn: 'Youth Leadership & Volunteering',
      descAr: 'مبادرة "شباب في العمل"، تنظيم الجامعة الصيفية، وصقل كفاءات التأطير والتنظيم الميداني للشباب.',
      descFr: "Initiative 'Jeunesse en Action', université d'été culturelle et formation de jeunes coordinateurs civiques.",
      descEn: "'Youth in Action' framework, summer academy, and field event management leadership training.",
    },
  ],
  quarters: [
    {
      id: 'q1',
      quarterNumber: 1,
      quarterAr: 'الربع الأول',
      quarterFr: '1er Trimestre',
      quarterEn: 'Quarter 1',
      periodAr: 'يناير — مارس 2026',
      periodFr: 'Janvier — Mars 2026',
      periodEn: 'January — March 2026',
      badgeAr: 'المرحلة التأسيسية والانطلاق',
      badgeFr: 'Phase de Lancement',
      badgeEn: 'Foundation & Kickoff',
      themeAr: 'بناء المنصة الرقمية، هيكلة اللجان، وإطلاق محترفات التكوين الأولى',
      themeFr: 'Déploiement de la plateforme, structuration des commissions et premiers ateliers',
      themeEn: 'Platform launch, committee structuring, and inaugural workshop cycles',
      icon: '🌱',
      iconSrc: '/icons/season-q1.png',
      color: 'border-[#0d3b43]',
      accentBg: 'bg-[#d8f0f4] text-[#0d3b43]',
      events: [
        {
          id: 'q1-e1',
          titleAr: 'الإطلاق الرسمي للمنصة والبرامج الثقافية 2026',
          titleFr: 'Lancement officiel de la plateforme et des programmes',
          titleEn: 'Official Launch of Platform & Cultural Programs',
          descAr: 'تدشين المنصة الرقمية التفاعلية وبدء استقبال طلبات الانخراط والتطوع بمختلف جهات المملكة المغربية.',
          descFr: 'Inauguration de la plateforme numérique trilingue et ouverture des adhésions à travers le Maroc.',
          descEn: 'Inauguration of the interactive trilingual platform and national membership campaign.',
          categoryAr: 'تأسيس وتسيير',
          categoryFr: 'Organisation & Lancement',
          categoryEn: 'Organization & Launch',
          venueAr: 'المقر المركزي والمنصة الرقمية',
          venueFr: 'Siège central & En ligne',
          venueEn: 'Headquarters & Digital Platform',
          status: 'completed',
          highlight: true,
        },
        {
          id: 'q1-e2',
          titleAr: 'انطلاق مبادرة "شباب في العمل" (Youth in Action)',
          titleFr: 'Coup d\'envoi de l\'initiative Jeunesse en Action',
          titleEn: 'Youth in Action Volunteering Kickoff',
          descAr: 'دورات تدريبية للشباب المتطوع حول تقنيات تدبير الفعاليات والأنشطة الثقافية والمجتمعية.',
          descFr: 'Masterclasses pour les jeunes bénévoles sur l\'animation et la coordination culturelle de terrain.',
          descEn: 'Orientation masterclasses for youth volunteers in cultural event management and civic engagement.',
          categoryAr: 'تطوع وتمكين',
          categoryFr: 'Bénévolat & Leadership',
          categoryEn: 'Youth Leadership',
          venueAr: 'دور الشباب والمراكز الثقافية الشريكة',
          venueFr: 'Maisons de jeunes partenaires',
          venueEn: 'Partner Community Centers',
          status: 'in_progress',
          highlight: true,
        },
        {
          id: 'q1-e3',
          titleAr: 'محترفات المسرح والأداء التعبيري (الدورة التأسيسية)',
          titleFr: 'Ateliers de théâtre et d\'art dramatique (Session 1)',
          titleEn: 'Theatre & Stage Expression Lab (Session 1)',
          descAr: 'تدريب عملي على تقنيات الإلقاء والتعبير الجسدي والارتجال المسرحي الملتزم بالقضايا المجتمعية.',
          descFr: 'Formation pratique sur la diction, le mouvement corporel et l\'improvisation théâtrale citoyenne.',
          descEn: 'Practical workshops on dramatic improvisation, voice projection, and expressive stage movement.',
          categoryAr: 'مسرح وفنون العرض',
          categoryFr: 'Arts Scéniques',
          categoryEn: 'Theatre Arts',
          venueAr: 'محترف الإبداع المسرحي',
          venueFr: 'Studio d\'art dramatique',
          venueEn: 'Drama Studio',
          status: 'in_progress',
          highlight: false,
        },
      ],
    },
    {
      id: 'q2',
      quarterNumber: 2,
      quarterAr: 'الربع الثاني',
      quarterFr: '2ème Trimestre',
      quarterEn: 'Quarter 2',
      periodAr: 'أبريل — يونيو 2026',
      periodFr: 'Avril — Juin 2026',
      periodEn: 'April — June 2026',
      badgeAr: 'ربيع الإبداع والتراث المغربي',
      badgeFr: 'Printemps Créatif & Patrimoine',
      badgeEn: 'Spring Creativity & Heritage',
      themeAr: 'معارض تشكيلية، أمسيات التراث الموسيقي، والملتقيات التشاركية',
      themeFr: 'Expositions d\'art, soirées musicales patrimoniales et rencontres participatives',
      themeEn: 'Fine art showcases, acoustic music evenings, and community networking',
      icon: '🎨',
      iconSrc: '/icons/season-q2.png',
      color: 'border-[#c85a32]',
      accentBg: 'bg-[#fae4dc] text-[#c85a32]',
      events: [
        {
          id: 'q2-e1',
          titleAr: 'أمسيات التراث الموسيقي المغربي الأصيل',
          titleFr: 'Soirées du Patrimoine Musical Marocain',
          titleEn: 'Moroccan Musical Heritage Evenings',
          descAr: 'حلقات عزف واستماع مخصصة للروافد الموسيقية المغربية بمشاركة مواهب وعازفين صاعدين.',
          descFr: 'Rencontres acoustiques et écoutes commentées dédiées à la richesse du patrimoine musical marocain.',
          descEn: 'Acoustic sessions and masterclasses celebrating traditional Moroccan musical diversity.',
          categoryAr: 'موسيقى وتراث',
          categoryFr: 'Musique & Terroir',
          categoryEn: 'Music & Heritage',
          venueAr: 'الفضاءات التراثية والرياضات الثقافية',
          venueFr: 'Espaces patrimoniaux',
          venueEn: 'Historic Heritage Venues',
          status: 'upcoming',
          highlight: true,
        },
        {
          id: 'q2-e2',
          titleAr: 'معرض الفنون التشكيلية والخط العربي "إشراقات"',
          titleFr: 'Exposition des Arts Plastiques et Calligraphie',
          titleEn: 'Youth Fine Arts & Calligraphy Exhibition',
          descAr: 'معرض تفاعلي وورشات حية تبرز الموتيفات الهندسية والجمالية المغربية برؤية معاصرة.',
          descFr: 'Exposition interactive et démonstrations en direct valorisant les motifs traditionnels marocains.',
          descEn: 'Showcase of emerging painters exploring Moroccan visual motifs and contemporary aesthetics.',
          categoryAr: 'فنون بصرية',
          categoryFr: 'Arts Visuels',
          categoryEn: 'Visual Arts',
          venueAr: 'أروقة المعارض الشريكة',
          venueFr: 'Galeries d\'art partenaires',
          venueEn: 'Partner Art Galleries',
          status: 'upcoming',
          highlight: true,
        },
        {
          id: 'q2-e3',
          titleAr: 'الملتقى التشاركي للمجتمع المدني الثقافي',
          titleFr: 'Forum participatif des acteurs culturels',
          titleEn: 'Civic Cultural Actors Forum',
          descAr: 'جلسات تشاورية مع المراكز الثقافية والمؤسسات الشريكة لتعزيز التعاون والعمل المشترك.',
          descFr: 'Tables rondes collaboratives avec les centres culturels et partenaires institutionnels.',
          descEn: 'Collaborative roundtables with partner cultural centers and youth institutes.',
          categoryAr: 'شراكات وتنسيق',
          categoryFr: 'Partenariats & Réseau',
          categoryEn: 'Partnerships & Networking',
          venueAr: 'مقر الشركاء المؤسساتيين',
          venueFr: 'Centres institutionnels',
          venueEn: 'Partner Institutions',
          status: 'upcoming',
          highlight: false,
        },
      ],
    },
    {
      id: 'q3',
      quarterNumber: 3,
      quarterAr: 'الربع الثالث',
      quarterFr: '3ème Trimestre',
      quarterEn: 'Quarter 3',
      periodAr: 'يوليو — سبتمبر 2026',
      periodFr: 'Juillet — Septembre 2026',
      periodEn: 'July — September 2026',
      badgeAr: 'الجامعة الصيفية والتنشيط المفتوح',
      badgeFr: 'Saison Estivale & Université d\'Été',
      badgeEn: 'Summer Academy & Public Arts',
      themeAr: 'تكوينات صيفية مكثفة، مسرح الشارع، وحملات التطوع الثقافي التضامني',
      themeFr: 'Formations intensives d\'été, théâtre de rue et bénévolat culturel solidaire',
      themeEn: 'Intensive summer bootcamps, street theatre, and cultural volunteering drives',
      icon: '☀️',
      iconSrc: '/icons/season-q3.png',
      color: 'border-[#d99b26]',
      accentBg: 'bg-[#fdf2db] text-[#bd7d12]',
      events: [
        {
          id: 'q3-e1',
          titleAr: 'الجامعة الصيفية للإبداع والتمكين الشبابي',
          titleFr: 'Université d\'Été de la Jeunesse Créative',
          titleEn: 'Summer Academy of Youth Creativity',
          descAr: 'محترفات مكثفة وإقامات تدريبية في الفنون المسرحية، التصوير الفوتوغرافي، والصوتيات.',
          descFr: 'Résidences et stages immersifs en arts dramatiques, photographie et métiers du spectacle.',
          descEn: 'Immersive summer bootcamps in performing arts, sound design, and documentary photography.',
          categoryAr: 'تكوين مكثف',
          categoryFr: 'Formation Intensive',
          categoryEn: 'Summer Academy',
          venueAr: 'مخيمات التكوين والشباب',
          venueFr: 'Centres de villégiature et jeunesse',
          venueEn: 'Summer Youth Campuses',
          status: 'upcoming',
          highlight: true,
        },
        {
          id: 'q3-e2',
          titleAr: 'عروض مسرح الشارع والتنشيط الثقافي المفتوح',
          titleFr: 'Spectacles de théâtre de rue et animation en plein air',
          titleEn: 'Open Air & Street Theatre Performances',
          descAr: 'عروض فنية حية في الفضاءات العامة ودور الشباب لتيسير الولوج الثقافي الحر لعموم المواطنين.',
          descFr: 'Représentations artistiques dans l\'espace public pour démocratiser l\'accès à l\'art.',
          descEn: 'Free community performances in public squares and youth centers for broad cultural access.',
          categoryAr: 'ديمقراطية الثقافة',
          categoryFr: 'Culture pour Tous',
          categoryEn: 'Community Arts',
          venueAr: 'الساحات العمومية والحدائق الثقافية',
          venueFr: 'Places publiques et jardins culturels',
          venueEn: 'Public Squares & Cultural Parks',
          status: 'upcoming',
          highlight: false,
        },
        {
          id: 'q3-e3',
          titleAr: 'قافلة التطوع الثقافي والتضامن الميداني',
          titleFr: 'Caravane du bénévolat culturel solidaire',
          titleEn: 'Civic Solidarity Cultural Caravan',
          descAr: 'أنشطة فنية تطوعية متنقلة لإشاعة البهجة وصقل مهارات الأطفال والشباب بالمناطق القروية والشبه حضرية.',
          descFr: 'Actions itinérantes au bénéfice des jeunes et enfants des zones périurbaines et rurales.',
          descEn: 'Mobile artistic outreach sessions designed to inspire children and youth across regions.',
          categoryAr: 'شباب في العمل',
          categoryFr: 'Jeunesse en Action',
          categoryEn: 'Youth Outreach',
          venueAr: 'المراكز الجمعوية والقرى المستهدفة',
          venueFr: 'Villages et centres associatifs',
          venueEn: 'Community Centers & Rural Hubs',
          status: 'upcoming',
          highlight: true,
        },
      ],
    },
    {
      id: 'q4',
      quarterNumber: 4,
      quarterAr: 'الربع الرابع',
      quarterFr: '4ème Trimestre',
      quarterEn: 'Quarter 4',
      periodAr: 'أكتوبر — ديسمبر 2026',
      periodFr: 'Octobre — Décembre 2026',
      periodEn: 'October — December 2026',
      badgeAr: 'المهرجان السنوي وحصيلة الأثر',
      badgeFr: 'Festival Annuel & Bilan d\'Impact',
      badgeEn: 'Annual Festival & Impact Review',
      themeAr: 'تتويج المخرجات، تكريم المتطوعين، وعرض التقريرين الأدبي والمالي',
      themeFr: 'Consécration des créations, hommage aux bénévoles et bilans moraux et financiers',
      themeEn: 'Grand festival showcase, volunteer honors, and moral & financial stewardship reports',
      icon: '🏆',
      iconSrc: '/icons/season-q4.png',
      color: 'border-[#0d3b43]',
      accentBg: 'bg-[#d8f0f4] text-[#0d3b43]',
      events: [
        {
          id: 'q4-e1',
          titleAr: 'المهرجان الثقافي السنوي لجمعية روح الفنون والثقافة',
          titleFr: 'Festival Annuel de l\'AMYCC',
          titleEn: 'AMYCC Annual Cultural Festival',
          descAr: 'احتفالية فنية شاملة تتوج مخرجات ورشات المسرح والموسيقى والفنون التشكيلية طيلة الموسم.',
          descFr: 'Grand gala artistique mettant en valeur les créations théâtrales, musicales et plastiques de l\'année.',
          descEn: 'Major artistic festival showcasing the annual fruits of theatre, music, and painting labs.',
          categoryAr: 'مهرجان سنوي',
          categoryFr: 'Festival Majeur',
          categoryEn: 'Annual Festival',
          venueAr: 'المسرح البلدي والقاعات الكبرى',
          venueFr: 'Théâtre municipal & grandes salles',
          venueEn: 'Municipal Theatres & Grand Halls',
          status: 'upcoming',
          highlight: true,
        },
        {
          id: 'q4-e2',
          titleAr: 'الملتقى الوطني للمتطوعين وتوزيع شواهد التميز',
          titleFr: 'Cérémonie de remise des attestations de bénévolat',
          titleEn: 'National Volunteer Awards Ceremony',
          descAr: 'الاحتفاء بالشباب المتطوعين وتكريم المساهمات الميدانية المتميزة في مبادرة شباب في العمل.',
          descFr: 'Hommage solennel aux bénévoles et remise des certificats officiels d\'engagement civique.',
          descEn: 'Honoring youth volunteers and awarding official certificates of civic engagement.',
          categoryAr: 'تقدير وشواهد',
          categoryFr: 'Reconnaissance & Prix',
          categoryEn: 'Recognition & Awards',
          venueAr: 'قاعة المؤتمرات الرسمية',
          venueFr: 'Salle des conférences',
          venueEn: 'Conference Center',
          status: 'upcoming',
          highlight: false,
        },
        {
          id: 'q4-e3',
          titleAr: 'الجمع العام السنوي وعرض التقريرين الأدبي والمالي',
          titleFr: 'Assemblée Générale Ordinaire & Bilans',
          titleEn: 'Annual General Assembly & Reports',
          descAr: 'عرض حصيلة الأنشطة والتدبير المالي بكل وضوح وشفافية، والمصادقة التشاركية على مخطط موسم 2027.',
          descFr: 'Présentation transparente du bilan moral et financier et approbation concertée du plan 2027.',
          descEn: 'Transparent reporting of moral and financial stewardship before the general assembly.',
          categoryAr: 'تسيير وشفافية',
          categoryFr: 'Transparence & Gestion',
          categoryEn: 'Transparency & Review',
          venueAr: 'المقر المركزي للجمعية',
          venueFr: 'Siège social de l\'AMYCC',
          venueEn: 'AMYCC Headquarters',
          status: 'upcoming',
          highlight: false,
        },
      ],
    },
  ],
  cta: {
    badgeAr: 'المشاركة واحتضان الفعاليات',
    badgeFr: 'Participer & Accueillir nos Événements',
    badgeEn: 'Host or Join our Activities',
    titleAr: 'هل ترغب في احتضان أو المشاركة في فعاليات هذا البرنامج السنوي؟',
    titleFr: 'Vous souhaitez accueillir ou participer aux activités de notre saison 2026 ?',
    titleEn: 'Interested in Hosting or Participating in our 2026 Season?',
    descAr: 'نرحب بمقترحات المراكز الثقافية ودور الشباب والجمعيات الشريكة لاحتضان الورشات الفنية والعروض، كما نفتح باب التطوع والانخراط للجميع بدون شروط مسبقة.',
    descFr: "Les centres culturels, maisons de jeunes et bénévoles sont chaleureusement invités à collaborer avec l'AMYCC pour donner vie à ces initiatives artistiques.",
    descEn: 'Cultural institutions, community venues, and volunteers are warmly welcomed to collaborate and bring these cultural initiatives to life.',
    primaryBtnTextAr: 'استكشف أجندة الفعاليات القادمة',
    primaryBtnTextFr: "Consulter l'agenda des événements",
    primaryBtnTextEn: 'Explore Upcoming Events',
    primaryBtnUrl: '/events',
    secondaryBtnTextAr: 'قدّم طلب الانخراط في الجمعية',
    secondaryBtnTextFr: "Devenir membre de l'AMYCC",
    secondaryBtnTextEn: 'Apply for Membership',
    secondaryBtnUrl: '/membership',
  },
}

export async function getAnnualProgramSettings(): Promise<AnnualProgramConfig> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'annual_program')
      .maybeSingle()

    if (error || !data || !data.value) {
      return defaultAnnualProgramConfig
    }

    const val = data.value as Partial<AnnualProgramConfig>
    const heroVal = (val.hero || {}) as Partial<AnnualProgramConfig['hero']>
    const ctaVal = (val.cta || {}) as Partial<AnnualProgramConfig['cta']>

    return {
      hero: {
        year: heroVal.year || defaultAnnualProgramConfig.hero.year,
        tagAr: heroVal.tagAr || defaultAnnualProgramConfig.hero.tagAr,
        tagFr: heroVal.tagFr || defaultAnnualProgramConfig.hero.tagFr,
        tagEn: heroVal.tagEn || defaultAnnualProgramConfig.hero.tagEn,
        badgeAr: heroVal.badgeAr || defaultAnnualProgramConfig.hero.badgeAr,
        badgeFr: heroVal.badgeFr || defaultAnnualProgramConfig.hero.badgeFr,
        badgeEn: heroVal.badgeEn || defaultAnnualProgramConfig.hero.badgeEn,
        titleAr: heroVal.titleAr || defaultAnnualProgramConfig.hero.titleAr,
        titleFr: heroVal.titleFr || defaultAnnualProgramConfig.hero.titleFr,
        titleEn: heroVal.titleEn || defaultAnnualProgramConfig.hero.titleEn,
        descriptionAr: heroVal.descriptionAr || defaultAnnualProgramConfig.hero.descriptionAr,
        descriptionFr: heroVal.descriptionFr || defaultAnnualProgramConfig.hero.descriptionFr,
        descriptionEn: heroVal.descriptionEn || defaultAnnualProgramConfig.hero.descriptionEn,
        imageUrl: typeof heroVal.imageUrl === 'string' ? heroVal.imageUrl : defaultAnnualProgramConfig.hero.imageUrl,
        showImage: heroVal.showImage !== false,
        brochureUrl: typeof heroVal.brochureUrl === 'string' ? heroVal.brochureUrl : defaultAnnualProgramConfig.hero.brochureUrl,
        brochureLabelAr: heroVal.brochureLabelAr || defaultAnnualProgramConfig.hero.brochureLabelAr,
        brochureLabelFr: heroVal.brochureLabelFr || defaultAnnualProgramConfig.hero.brochureLabelFr,
        brochureLabelEn: heroVal.brochureLabelEn || defaultAnnualProgramConfig.hero.brochureLabelEn,
      },
      stats: Array.isArray(val.stats) && val.stats.length > 0
        ? val.stats
            .filter((s): s is AnnualProgramStatItem => typeof s === 'object' && s !== null && typeof s.id === 'string')
            .map((s) => ({
              id: s.id,
              value: s.value || '',
              labelAr: s.labelAr || '',
              labelFr: s.labelFr || '',
              labelEn: s.labelEn || '',
              icon: s.icon || '📌',
            }))
        : defaultAnnualProgramConfig.stats,
      pillars: Array.isArray(val.pillars) && val.pillars.length > 0
        ? val.pillars
            .filter((p): p is AnnualProgramPillarItem => typeof p === 'object' && p !== null && typeof p.id === 'string')
            .map((p) => ({
              id: p.id,
              icon: p.icon || '🎨',
              titleAr: p.titleAr || '',
              titleFr: p.titleFr || '',
              titleEn: p.titleEn || '',
              descAr: p.descAr || '',
              descFr: p.descFr || '',
              descEn: p.descEn || '',
            }))
        : defaultAnnualProgramConfig.pillars,
      quarters: Array.isArray(val.quarters) && val.quarters.length > 0
        ? val.quarters
            .filter((q): q is AnnualProgramQuarter => typeof q === 'object' && q !== null && typeof q.id === 'string')
            .map((q) => ({
              id: q.id,
              quarterNumber: q.quarterNumber || 1,
              quarterAr: q.quarterAr || '',
              quarterFr: q.quarterFr || '',
              quarterEn: q.quarterEn || '',
              periodAr: q.periodAr || '',
              periodFr: q.periodFr || '',
              periodEn: q.periodEn || '',
              badgeAr: q.badgeAr || '',
              badgeFr: q.badgeFr || '',
              badgeEn: q.badgeEn || '',
              themeAr: q.themeAr || '',
              themeFr: q.themeFr || '',
              themeEn: q.themeEn || '',
              icon: q.icon || '🗓️',
              iconSrc: q.iconSrc || '',
              color: q.color || 'border-[#0d3b43]',
              accentBg: q.accentBg || 'bg-[#d8f0f4] text-[#0d3b43]',
              events: Array.isArray(q.events)
                ? q.events
                    .filter((e): e is AnnualProgramEventItem => typeof e === 'object' && e !== null && typeof e.id === 'string')
                    .map((e) => ({
                      id: e.id,
                      titleAr: e.titleAr || '',
                      titleFr: e.titleFr || '',
                      titleEn: e.titleEn || '',
                      descAr: e.descAr || '',
                      descFr: e.descFr || '',
                      descEn: e.descEn || '',
                      categoryAr: e.categoryAr || '',
                      categoryFr: e.categoryFr || '',
                      categoryEn: e.categoryEn || '',
                      venueAr: e.venueAr || '',
                      venueFr: e.venueFr || '',
                      venueEn: e.venueEn || '',
                      status: e.status || 'upcoming',
                      highlight: Boolean(e.highlight),
                    }))
                : [],
            }))
        : defaultAnnualProgramConfig.quarters,
      cta: {
        badgeAr: ctaVal.badgeAr || defaultAnnualProgramConfig.cta.badgeAr,
        badgeFr: ctaVal.badgeFr || defaultAnnualProgramConfig.cta.badgeFr,
        badgeEn: ctaVal.badgeEn || defaultAnnualProgramConfig.cta.badgeEn,
        titleAr: ctaVal.titleAr || defaultAnnualProgramConfig.cta.titleAr,
        titleFr: ctaVal.titleFr || defaultAnnualProgramConfig.cta.titleFr,
        titleEn: ctaVal.titleEn || defaultAnnualProgramConfig.cta.titleEn,
        descAr: ctaVal.descAr || defaultAnnualProgramConfig.cta.descAr,
        descFr: ctaVal.descFr || defaultAnnualProgramConfig.cta.descFr,
        descEn: ctaVal.descEn || defaultAnnualProgramConfig.cta.descEn,
        primaryBtnTextAr: ctaVal.primaryBtnTextAr || defaultAnnualProgramConfig.cta.primaryBtnTextAr,
        primaryBtnTextFr: ctaVal.primaryBtnTextFr || defaultAnnualProgramConfig.cta.primaryBtnTextFr,
        primaryBtnTextEn: ctaVal.primaryBtnTextEn || defaultAnnualProgramConfig.cta.primaryBtnTextEn,
        primaryBtnUrl: ctaVal.primaryBtnUrl || defaultAnnualProgramConfig.cta.primaryBtnUrl,
        secondaryBtnTextAr: ctaVal.secondaryBtnTextAr || defaultAnnualProgramConfig.cta.secondaryBtnTextAr,
        secondaryBtnTextFr: ctaVal.secondaryBtnTextFr || defaultAnnualProgramConfig.cta.secondaryBtnTextFr,
        secondaryBtnTextEn: ctaVal.secondaryBtnTextEn || defaultAnnualProgramConfig.cta.secondaryBtnTextEn,
        secondaryBtnUrl: ctaVal.secondaryBtnUrl || defaultAnnualProgramConfig.cta.secondaryBtnUrl,
      },
    }
  } catch {
    return defaultAnnualProgramConfig
  }
}

// ==========================================
// Community Impact Page CMS Config
// ==========================================

export interface ImpactMetricItem {
  id: string
  value: string
  labelAr: string
  labelFr: string
  labelEn: string
  subtextAr: string
  subtextFr: string
  subtextEn: string
  icon: string
  iconSrc?: string
}

export interface ImpactPillarItem {
  id: string
  badgeAr?: string
  badgeFr?: string
  badgeEn?: string
  titleAr: string
  titleFr: string
  titleEn: string
  descAr: string
  descFr: string
  descEn: string
  icon: string
  iconSrc?: string
}

export interface ImpactStepItem {
  id: string
  stepNumber: string
  titleAr: string
  titleFr: string
  titleEn: string
  descAr: string
  descFr: string
  descEn: string
  icon: string
}

export interface ImpactTransparencyItem {
  id: string
  titleAr: string
  titleFr: string
  titleEn: string
  descAr: string
  descFr: string
  descEn: string
  icon: string
}

export interface ImpactConfig {
  hero: {
    badgeAr: string
    badgeFr: string
    badgeEn: string
    titleAr: string
    titleFr: string
    titleEn: string
    subtitleAr: string
    subtitleFr: string
    subtitleEn: string
    descriptionAr: string
    descriptionFr: string
    descriptionEn: string
    heroImageUrl: string
    hasHeroImage: boolean
    reportPdfUrl: string
    primaryBtnTextAr: string
    primaryBtnTextFr: string
    primaryBtnTextEn: string
    primaryBtnUrl: string
    secondaryBtnTextAr: string
    secondaryBtnTextFr: string
    secondaryBtnTextEn: string
    secondaryBtnUrl: string
  }
  metrics: ImpactMetricItem[]
  pillars: ImpactPillarItem[]
  spotlight: {
    badgeAr: string
    badgeFr: string
    badgeEn: string
    titleAr: string
    titleFr: string
    titleEn: string
    descAr: string
    descFr: string
    descEn: string
    quoteAr: string
    quoteFr: string
    quoteEn: string
    quoteAuthorAr: string
    quoteAuthorFr: string
    quoteAuthorEn: string
    imageUrl: string
    imageCaptionAr: string
    imageCaptionFr: string
    imageCaptionEn: string
    primaryBtnTextAr: string
    primaryBtnTextFr: string
    primaryBtnTextEn: string
    primaryBtnUrl: string
    secondaryBtnTextAr: string
    secondaryBtnTextFr: string
    secondaryBtnTextEn: string
    secondaryBtnUrl: string
  }
  methodology: {
    badgeAr: string
    badgeFr: string
    badgeEn: string
    titleAr: string
    titleFr: string
    titleEn: string
    descAr: string
    descFr: string
    descEn: string
    steps: ImpactStepItem[]
  }
  transparency: {
    badgeAr: string
    badgeFr: string
    badgeEn: string
    titleAr: string
    titleFr: string
    titleEn: string
    descAr: string
    descFr: string
    descEn: string
    items: ImpactTransparencyItem[]
  }
  cta: {
    badgeAr: string
    badgeFr: string
    badgeEn: string
    titleAr: string
    titleFr: string
    titleEn: string
    descAr: string
    descFr: string
    descEn: string
    primaryBtnTextAr: string
    primaryBtnTextFr: string
    primaryBtnTextEn: string
    primaryBtnUrl: string
    secondaryBtnTextAr: string
    secondaryBtnTextFr: string
    secondaryBtnTextEn: string
    secondaryBtnUrl: string
  }
}

export const defaultImpactConfig: ImpactConfig = {
  hero: {
    badgeAr: 'الأثر والالتزام المجتمعي • AMYCC Impact',
    badgeFr: 'Impact et Engagement Communautaire',
    badgeEn: 'Impact & Community Engagement',
    titleAr: 'الأثر المجتمعي والثقافي بالمملكة المغربية',
    titleFr: 'Notre Impact Culturel et Communautaire',
    titleEn: 'Our Cultural & Community Impact',
    subtitleAr: 'بناء الوعي الفني، تمكين الشباب، وترسيخ قيم المواطنة الإيجابية والتضامن',
    subtitleFr: 'Éveil artistique, autonomisation des jeunes et citoyenneté active',
    subtitleEn: 'Artistic awakening, youth empowerment, and active citizenship',
    descriptionAr:
      'تسعى جمعية روح الفنون والثقافة (AMYCC) منذ تأسيسها سنة 2026 إلى جعل الفنون والإبداع رافعة حقيقية للتنمية البشرية، وتحقيق العدالة المجالية في الولوج للثقافة، وتثمين التراث اللامادي الوطني عبر كافة جهات المملكة.',
    descriptionFr:
      "Depuis sa création en 2026, l'AMYCC fait des arts et de la créativité un véritable levier de développement humain, d'équité territoriale et de rayonnement culturel à travers tout le Royaume du Maroc.",
    descriptionEn:
      'Since its foundation in 2026, AMYCC has leveraged arts and creativity as catalysts for human development, territorial cultural access, and the promotion of Moroccan intangible heritage across the Kingdom.',
    heroImageUrl: '',
    hasHeroImage: false,
    reportPdfUrl: '/documents/rapport-impact-amycc-2026.pdf',
    primaryBtnTextAr: 'استكشف مبادراتنا الميدانية',
    primaryBtnTextFr: 'Découvrir nos initiatives',
    primaryBtnTextEn: 'Explore Field Initiatives',
    primaryBtnUrl: '/programs',
    secondaryBtnTextAr: 'تحميل تقرير الأثر المجتمعي (PDF)',
    secondaryBtnTextFr: "Télécharger le Rapport d'Impact (PDF)",
    secondaryBtnTextEn: 'Download Impact Report (PDF)',
    secondaryBtnUrl: '/documents/rapport-impact-amycc-2026.pdf',
  },
  metrics: [
    {
      id: 'metric-foundation',
      value: '2026',
      labelAr: 'سنة التأسيس والانطلاق الرسمي',
      labelFr: 'Année de fondation officielle',
      labelEn: 'Official Foundation Year',
      subtextAr: 'إطار جمعوي مدني معتمد بالمغرب',
      subtextFr: 'Cadre associatif reconnu au Maroc',
      subtextEn: 'Recognized Moroccan civil non-profit',
      icon: '🏛️',
      iconSrc: '/icons/impact-founding.png',
    },
    {
      id: 'metric-disciplines',
      value: '6',
      labelAr: 'مجالات عمل فني وثقافي رئيسية',
      labelFr: "Domaines d'intervention culturelle",
      labelEn: 'Core Cultural Disciplines',
      subtextAr: 'مسرح، موسيقى، تشكيل، تراث، شباب، وتطوع',
      subtextFr: 'Théâtre, musique, arts visuels, patrimoine, jeunesse',
      subtextEn: 'Theatre, music, fine arts, heritage, youth, volunteering',
      icon: '🎨',
      iconSrc: '/icons/impact-disciplines.png',
    },
    {
      id: 'metric-beneficiaries',
      value: '+1,500',
      labelAr: 'مستفيد ومستفيدة من الورشات',
      labelFr: 'Bénéficiaires directs des ateliers',
      labelEn: 'Direct Workshop Beneficiaries',
      subtextAr: 'طاقات شبابية وأطفال في مختلف الجهات',
      subtextFr: 'Jeunes et enfants dans les régions du Royaume',
      subtextEn: 'Youth and children across Moroccan regions',
      icon: '👥',
      iconSrc: '/icons/impact-hours.png',
    },
    {
      id: 'metric-nonprofit',
      value: '100%',
      labelAr: 'عمل مدني غير ربحي وتطوعي',
      labelFr: 'Engagement civique et non-lucratif',
      labelEn: 'Non-profit Civic Commitment',
      subtextAr: 'التزام تام بالنزاهة والشفافية وتكافؤ الفرص',
      subtextFr: 'Transparence totale et égalité des chances',
      subtextEn: 'Full transparency, equity, and civic commitment',
      icon: '⚖️',
      iconSrc: '/icons/impact-governance.png',
    },
  ],
  pillars: [
    {
      id: 'pillar-youth',
      badgeAr: 'الريادة الشبابية',
      badgeFr: 'Leadership Jeunesse',
      badgeEn: 'Youth Leadership',
      titleAr: 'التمكين الشبابي والقيادة الثقافية',
      titleFr: 'Autonomisation et leadership des jeunes',
      titleEn: 'Youth Empowerment & Leadership',
      descAr:
        'فتح المجال أمام الطاقات الشابة للتعبير الحر وصقل مهاراتهم في التواصل، إدارة التظاهرات الفنية، والعمل الجماعي من خلال مبادرة "شباب في العمل"، مع منح شواهد تطوع وتجربة جمعوية موثقة تدعم مسارهم المهني.',
      descFr:
        "Permettre aux jeunes d'acquérir des compétences concrètes en gestion culturelle et en leadership participatif avec attestations d'engagement certifiées.",
      descEn:
        'Empowering Moroccan youth through hands-on cultural project management, teamwork, and artistic leadership, with official volunteering certificates.',
      icon: '🚀',
      iconSrc: '/icons/youth.png',
    },
    {
      id: 'pillar-heritage',
      badgeAr: 'الهوية الوطنية',
      badgeFr: 'Patrimoine National',
      badgeEn: 'National Heritage',
      titleAr: 'صون الذاكرة والتراث المغربي الأصيل',
      titleFr: 'Préservation du patrimoine marocain',
      titleEn: 'Preserving Moroccan Cultural Heritage',
      descAr:
        'الاحتفاء بالروافد المتنوعة للهوية الثقافية المغربية عبر ورشات الموسيقى التراثية، الفنون التشكيلية المستوحاة من المعمار والزخرفة المغربية، ونقل هذا الغنى الحضاري بين الأجيال.',
      descFr:
        'Célébrer la diversité du patrimoine culturel marocain à travers des ateliers musicaux, des arts visuels et la transmission intergénérationnelle.',
      descEn:
        'Celebrating the richness of Moroccan cultural diversity through heritage music, architecture-inspired visual arts, and intergenerational knowledge transmission.',
      icon: '🏛️',
      iconSrc: '/icons/culture.png',
    },
    {
      id: 'pillar-access',
      badgeAr: 'العدالة المجالية',
      badgeFr: 'Équité Territoriale',
      badgeEn: 'Territorial Equity',
      titleAr: 'العدالة المجالية والولوج الثقافي الشامل',
      titleFr: "Démocratisation de l'accès culturel",
      titleEn: 'Territorial Equity & Cultural Access',
      descAr:
        'توسيع دائرة المستفيدين من الورشات والعروض الفنية لتشمل فضاءات القرب، دور الشباب، والمراكز الثقافية بمختلف المدن والمناطق الهشة بالمملكة دون تمييز، لضمان ديمقراطية الثقافة للجميع.',
      descFr:
        'Déployer des activités artistiques gratuites dans les maisons de jeunes et centres de proximité à travers différentes régions du Royaume.',
      descEn:
        'Expanding free workshops and performances to local youth centers and cultural venues across multiple Moroccan cities and regions.',
      icon: '📍',
      iconSrc: '/icons/impact-access.png',
    },
    {
      id: 'pillar-solidarity',
      badgeAr: 'المواطنة الفاعلة',
      badgeFr: 'Citoyenneté Active',
      badgeEn: 'Active Citizenship',
      titleAr: 'التضامن المجتمعي وترسيخ المواطنة الفاعلة',
      titleFr: 'Solidarité citoyenne et cohésion sociale',
      titleEn: 'Civic Solidarity & Social Cohesion',
      descAr:
        'استثمار الفنون والمسرح والموسيقى كأدوات لبناء التماسك الاجتماعي، ونشر قيم التسامح والتعايش، وترسيخ روح المبادرة الإيجابية في خدمة الصالح العام والمجتمع المغربي.',
      descFr:
        "Utiliser l'art et le théâtre comme leviers de cohésion sociale, de citoyenneté positive et de dialogue intergénérationnel.",
      descEn:
        'Harnessing the power of arts and theatre as vehicles for social cohesion, civic pride, and positive community engagement.',
      icon: '♥',
      iconSrc: '/icons/values.png',
    },
  ],
  spotlight: {
    badgeAr: 'أثر ميداني ملموس',
    badgeFr: 'Impact Terrain Mesurable',
    badgeEn: 'Tangible Field Impact',
    titleAr: 'مبادرة "شباب في العمل": من المشاركة الفردية إلى القيادة المجتمعية',
    titleFr: 'Initiative Jeunesse en Action : de la participation individuelle au leadership collectif',
    titleEn: 'Youth in Action Initiative: From Individual Participation to Civic Leadership',
    descAr:
      'لا يقتصر دور الشباب في أنشطة جمعية روح الفنون والثقافة على الحضور السلبي، بل يتعداه إلى المشاركة الحية في بلورة الأفكار، تأطير الورشات، والتنظيم الميداني للتظاهرات، مما يزرع الثقة بالنفس، ويطور مهارات القيادة، ويوثق ساعات التطوع بشواهد رسمية معتمدة تدعم مسارهم الدراسي والمهني.',
    descFr:
      "Les jeunes participants évoluent de spectateurs passifs à coordinateurs et facilitateurs d'événements culturels, développant des compétences concrètes en gestion de projet et en prise de parole en public.",
    descEn:
      'Young participants evolve from passive spectators to active cultural organizers, developing public speaking, artistic curating, and leadership skills while earning verified civic credentials.',
    quoteAr: 'منحني التطوع في أنشطة الجمعية فضاءً حقيقياً للتعبير واكتساب مهارات القيادة وتدبير الفعاليات الثقافية بكل احترافية وثقة.',
    quoteFr: "L'engagement bénévole au sein de l'AMYCC m'a offert un cadre stimulant pour exprimer ma créativité et coordonner des projets à fort impact.",
    quoteEn: 'Volunteering with AMYCC gave me a genuine platform for artistic self-expression and professional project leadership.',
    quoteAuthorAr: 'أحد الشباب المتطوعين في مبادرة شباب في العمل (موسم 2026)',
    quoteAuthorFr: 'Bénévole engagé au sein de l’initiative Jeunesse en Action (2026)',
    quoteAuthorEn: 'Active Youth Volunteer, Youth in Action Initiative (2026)',
    imageUrl: '/images/youth-in-action.jpg',
    imageCaptionAr: 'طاقات شبابية تصنع التغيير الثقافي الميداني بالمغرب',
    imageCaptionFr: 'Jeunesse marocaine actrice du dynamisme culturel',
    imageCaptionEn: 'Moroccan youth driving grassroots cultural momentum',
    primaryBtnTextAr: 'اكتشف المبادرة بالكامل',
    primaryBtnTextFr: "Découvrir l'initiative",
    primaryBtnTextEn: 'Discover Initiative',
    primaryBtnUrl: '/programs/youth-in-action',
    secondaryBtnTextAr: 'انضم كمتطوع ميداني',
    secondaryBtnTextFr: 'Rejoindre comme bénévole',
    secondaryBtnTextEn: 'Join as a Volunteer',
    secondaryBtnUrl: '/volunteer',
  },
  methodology: {
    badgeAr: 'منهجية العمل الميداني',
    badgeFr: 'Méthodologie d’Impact',
    badgeEn: 'Impact Methodology',
    titleAr: 'دورة صناعة الأثر الثقافي والمجتمعي المستدام',
    titleFr: 'Cycle de Création d’Impact Culturel Durable',
    titleEn: 'Sustainable Cultural & Civic Impact Cycle',
    descAr:
      'نعتمد في جمعية روح الفنون والثقافة نموذج عمل متكامل يقوم على التدرج من رصد الاحتياج المحلي إلى تحقيق الأثر المستدام.',
    descFr:
      'Notre méthodologie repose sur une démarche structurée en quatre étapes, garantissant des retombées mesurables et pérennes.',
    descEn:
      'A structured four-phase methodology ensuring tangible, measurable, and enduring civic and artistic impact.',
    steps: [
      {
        id: 'step-1',
        stepNumber: '01',
        titleAr: 'التشخيص ورصد المواهب',
        titleFr: 'Diagnostic et Repérage',
        titleEn: 'Needs Assessment & Talent Discovery',
        descAr: 'رصد الطاقات والمواهب الصاعدة والاحتياجات الثقافية الملحة بمختلف الأحياء وفضاءات القرب ودور الشباب.',
        descFr: 'Cartographie des besoins locaux et repérage des jeunes talents dans les maisons de jeunes et centres de quartier.',
        descEn: 'Mapping community cultural needs and discovering emerging artistic talent in local neighborhoods.',
        icon: '🔍',
      },
      {
        id: 'step-2',
        stepNumber: '02',
        titleAr: 'التأطير والتكوين التفاعلي',
        titleFr: 'Encadrement et Ateliers',
        titleEn: 'Mentorship & Creative Workshops',
        descAr: 'تنظيم ورش عمل تدريبية وتطبيقية مكثفة يؤطرها فنانون وخبراء معتمدون في المسرح والموسيقى والفنون التشكيلية.',
        descFr: 'Organisation d’ateliers pratiques dirigés par des artistes professionnels et experts confirmés.',
        descEn: 'Hands-on training and artistic masterclasses mentored by established cultural practitioners.',
        icon: '🎓',
      },
      {
        id: 'step-3',
        stepNumber: '03',
        titleAr: 'الإنتاج والإبداع التشاركي',
        titleFr: 'Production et Création Partagée',
        titleEn: 'Collaborative Production & Creation',
        descAr: 'تمكين الشباب من بلورة وإنتاج عروض مسرحية وأعمال تشكيلية وأمسيات فنية تعبر عن قضاياهم وتطلعاتهم.',
        descFr: 'Production conjointe d’œuvres, spectacles vivants et performances reflétant les aspirations citoyennes.',
        descEn: 'Co-creating original theatrical plays, visual art exhibitions, and cultural showcases.',
        icon: '🎭',
      },
      {
        id: 'step-4',
        stepNumber: '04',
        titleAr: 'الأثر والاستدامة والتوثيق',
        titleFr: 'Pérennité et Reconnaissance',
        titleEn: 'Sustainability & Civic Recognition',
        descAr: 'تتويج المسار بمعارض وعروض عامة مفتوحة للجمهور، ومنح شواهد تجربة جمعوية وتطوعية رسمية معتمدة.',
        descFr: 'Restitutions publiques ouvertes, valorisation des acquis et remise d’attestations d’engagement certifiées.',
        descEn: 'Public showcases, festival exhibitions, and certified civic recognition supporting career pathways.',
        icon: '🌟',
      },
    ],
  },
  transparency: {
    badgeAr: 'النزاهة والمسؤولية الجمعوية',
    badgeFr: 'Intégrité et Responsabilité Civique',
    badgeEn: 'Civil Integrity & Stewardship',
    titleAr: 'التزام تام بأعلى معايير النزاهة والشفافية المدنية',
    titleFr: 'Engagement Rigoureux envers l’Intégrité et la Transparence',
    titleEn: 'Strict Commitment to Civil Integrity & Transparency',
    descAr:
      'تعمل جمعية روح الفنون والثقافة وفق القوانين والأنظمة الجاري بها العمل بالمملكة المغربية المنظمة للعمل الجمعوي، وتلتزم بأقصى درجات الشفافية والانضباط الأخلاقي والإداري وصون ثقة المنخرطين والشركاء.',
    descFr:
      'L’AMYCC opère dans le strict respect de la législation marocaine régissant le tissu associatif, appliquant des règles rigoureuses de gestion transparente et responsable.',
    descEn:
      'AMYCC operates strictly under Moroccan civil society legislation, committed to full operational integrity, transparent financial reporting, and ethical community stewardship.',
    items: [
      {
        id: 'transparency-legal',
        titleAr: 'الشرعية المؤسسية والإيداع القانوني',
        titleFr: 'Légalité Institutionnelle et Dépôt Légal',
        titleEn: 'Institutional Legality & Regulatory Compliance',
        descAr: 'تأسيس رسمي وفق ظهير الحريات العامة لسنة 1958 وتعديلاته بالمملكة المغربية مع وصل الإيداع القانوني المعتمد.',
        descFr: 'Conformité totale avec le dahir régissant le droit d’association au Maroc avec récépissé légal.',
        descEn: 'Official compliance with Moroccan non-profit association laws and validated statutory records.',
        icon: '⚖️',
      },
      {
        id: 'transparency-reports',
        titleAr: 'التقارير الأدبية والمالية السنوية',
        titleFr: 'Rapports Moraux et Financiers Annuels',
        titleEn: 'Annual Narrative & Financial Reports',
        descAr: 'عرض دوري ومفصل لكافة المداخيل والمصارف ومخرجات الأنشطة خلال الجمع العام السنوي بحضور المنخرطين.',
        descFr: 'Présentation rigoureuse et validée de l’ensemble des bilans d’activité et états financiers en assemblée générale.',
        descEn: 'Transparent reporting of all revenues, expenditures, and project metrics during annual general assemblies.',
        icon: '📋',
      },
      {
        id: 'transparency-privacy',
        titleAr: 'حماية المعطيات الشخصية (قانون 09-08)',
        titleFr: 'Protection des Données Personnelles (Loi 09-08)',
        titleEn: 'Personal Data Protection (Law 09-08)',
        descAr: 'احترام تام لمعايير حماية المعطيات ذات الطابع الشخصي لكافة المشاركين والمنخرطين والمتطوعين بالموقع.',
        descFr: 'Respect strict de la législation marocaine sur la protection des données personnelles de nos membres et usagers.',
        descEn: 'Full compliance with Moroccan Law 09-08 regarding data privacy and security for all platform participants.',
        icon: '🔒',
      },
      {
        id: 'transparency-audit',
        titleAr: 'توثيق ساعات التطوع والأنشطة الميدانية',
        titleFr: 'Traçabilité et Certification du Bénévolat',
        titleEn: 'Civic Traceability & Verified Volunteering',
        descAr: 'سجل تدقيق رقمي موثق لكل الفعاليات وورش العمل وساعات المشاركة التطوعية بمبادرة شباب في العمل.',
        descFr: 'Registre numérique rigoureux certifiant les heures d’engagement citoyen de chaque jeune bénévole.',
        descEn: 'Audited digital tracking of volunteer project hours and field contributions with formal certifications.',
        icon: '📜',
      },
    ],
  },
  cta: {
    badgeAr: 'شراكة الأثر المجتمعي',
    badgeFr: 'Partenariat d’Impact',
    badgeEn: 'Impact Partnership',
    titleAr: 'شاركنا في توسيع دائرة الأثر الثقافي والمجتمعي بالمغرب',
    titleFr: 'Participez à l’Élargissement de notre Impact Culturel',
    titleEn: 'Join Us in Amplifying Grassroots Cultural Impact',
    descAr:
      'تفتح جمعية روح الفنون والثقافة أبوابها أمام المؤسسات العمومية، الجماعات الترابية، والفاعلين الخواص لبناء شراكات استراتيجية تثمر مشاريع نوعية تعود بالنفع على الشباب والناشئة.',
    descFr:
      'L’AMYCC s’associe aux collectivités territoriales, institutions culturelles et mécènes pour coconstruire des programmes à fort impact social et artistique.',
    descEn:
      'AMYCC collaborates with municipalities, cultural institutions, and private partners to co-create transformative programs for youth and emerging artists.',
    primaryBtnTextAr: 'طلب شراكة مؤسسية',
    primaryBtnTextFr: 'Proposer un partenariat',
    primaryBtnTextEn: 'Request Institutional Partnership',
    primaryBtnUrl: '/partnerships',
    secondaryBtnTextAr: 'تواصل مع فريق الجمعية',
    secondaryBtnTextFr: 'Contacter l’équipe',
    secondaryBtnTextEn: 'Contact AMYCC Team',
    secondaryBtnUrl: '/contact',
  },
}

export async function getImpactSettings(): Promise<ImpactConfig> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'impact')
      .maybeSingle()

    if (error || !data || !data.value) {
      return defaultImpactConfig
    }

    const val = data.value as Partial<ImpactConfig>
    const heroVal = (val.hero || {}) as Partial<ImpactConfig['hero']>
    const spotlightVal = (val.spotlight || {}) as Partial<ImpactConfig['spotlight']>
    const methodologyVal = (val.methodology || {}) as Partial<ImpactConfig['methodology']>
    const transparencyVal = (val.transparency || {}) as Partial<ImpactConfig['transparency']>
    const ctaVal = (val.cta || {}) as Partial<ImpactConfig['cta']>

    return {
      hero: {
        badgeAr: heroVal.badgeAr || defaultImpactConfig.hero.badgeAr,
        badgeFr: heroVal.badgeFr || defaultImpactConfig.hero.badgeFr,
        badgeEn: heroVal.badgeEn || defaultImpactConfig.hero.badgeEn,
        titleAr: heroVal.titleAr || defaultImpactConfig.hero.titleAr,
        titleFr: heroVal.titleFr || defaultImpactConfig.hero.titleFr,
        titleEn: heroVal.titleEn || defaultImpactConfig.hero.titleEn,
        subtitleAr: heroVal.subtitleAr || defaultImpactConfig.hero.subtitleAr,
        subtitleFr: heroVal.subtitleFr || defaultImpactConfig.hero.subtitleFr,
        subtitleEn: heroVal.subtitleEn || defaultImpactConfig.hero.subtitleEn,
        descriptionAr: heroVal.descriptionAr || defaultImpactConfig.hero.descriptionAr,
        descriptionFr: heroVal.descriptionFr || defaultImpactConfig.hero.descriptionFr,
        descriptionEn: heroVal.descriptionEn || defaultImpactConfig.hero.descriptionEn,
        heroImageUrl: typeof heroVal.heroImageUrl === 'string' ? heroVal.heroImageUrl : defaultImpactConfig.hero.heroImageUrl,
        hasHeroImage: typeof heroVal.hasHeroImage === 'boolean' ? heroVal.hasHeroImage : defaultImpactConfig.hero.hasHeroImage,
        reportPdfUrl: heroVal.reportPdfUrl || defaultImpactConfig.hero.reportPdfUrl,
        primaryBtnTextAr: heroVal.primaryBtnTextAr || defaultImpactConfig.hero.primaryBtnTextAr,
        primaryBtnTextFr: heroVal.primaryBtnTextFr || defaultImpactConfig.hero.primaryBtnTextFr,
        primaryBtnTextEn: heroVal.primaryBtnTextEn || defaultImpactConfig.hero.primaryBtnTextEn,
        primaryBtnUrl: heroVal.primaryBtnUrl || defaultImpactConfig.hero.primaryBtnUrl,
        secondaryBtnTextAr: heroVal.secondaryBtnTextAr || defaultImpactConfig.hero.secondaryBtnTextAr,
        secondaryBtnTextFr: heroVal.secondaryBtnTextFr || defaultImpactConfig.hero.secondaryBtnTextFr,
        secondaryBtnTextEn: heroVal.secondaryBtnTextEn || defaultImpactConfig.hero.secondaryBtnTextEn,
        secondaryBtnUrl: heroVal.secondaryBtnUrl || defaultImpactConfig.hero.secondaryBtnUrl,
      },
      metrics: Array.isArray(val.metrics) && val.metrics.length > 0
        ? val.metrics
            .filter((m): m is ImpactMetricItem => typeof m === 'object' && m !== null && typeof m.id === 'string')
            .map((m) => ({
              id: m.id,
              value: m.value || '',
              labelAr: m.labelAr || '',
              labelFr: m.labelFr || '',
              labelEn: m.labelEn || '',
              subtextAr: m.subtextAr || '',
              subtextFr: m.subtextFr || '',
              subtextEn: m.subtextEn || '',
              icon: m.icon || '📊',
              iconSrc: m.iconSrc || '',
            }))
        : defaultImpactConfig.metrics,
      pillars: Array.isArray(val.pillars) && val.pillars.length > 0
        ? val.pillars
            .filter((p): p is ImpactPillarItem => typeof p === 'object' && p !== null && typeof p.id === 'string')
            .map((p) => ({
              id: p.id,
              badgeAr: p.badgeAr || '',
              badgeFr: p.badgeFr || '',
              badgeEn: p.badgeEn || '',
              titleAr: p.titleAr || '',
              titleFr: p.titleFr || '',
              titleEn: p.titleEn || '',
              descAr: p.descAr || '',
              descFr: p.descFr || '',
              descEn: p.descEn || '',
              icon: p.icon || '🌟',
              iconSrc: p.iconSrc || '',
            }))
        : defaultImpactConfig.pillars,
      spotlight: {
        badgeAr: typeof spotlightVal.badgeAr === 'string' ? spotlightVal.badgeAr : defaultImpactConfig.spotlight.badgeAr,
        badgeFr: typeof spotlightVal.badgeFr === 'string' ? spotlightVal.badgeFr : defaultImpactConfig.spotlight.badgeFr,
        badgeEn: typeof spotlightVal.badgeEn === 'string' ? spotlightVal.badgeEn : defaultImpactConfig.spotlight.badgeEn,
        titleAr: typeof spotlightVal.titleAr === 'string' ? spotlightVal.titleAr : defaultImpactConfig.spotlight.titleAr,
        titleFr: typeof spotlightVal.titleFr === 'string' ? spotlightVal.titleFr : defaultImpactConfig.spotlight.titleFr,
        titleEn: typeof spotlightVal.titleEn === 'string' ? spotlightVal.titleEn : defaultImpactConfig.spotlight.titleEn,
        descAr: typeof spotlightVal.descAr === 'string' ? spotlightVal.descAr : defaultImpactConfig.spotlight.descAr,
        descFr: typeof spotlightVal.descFr === 'string' ? spotlightVal.descFr : defaultImpactConfig.spotlight.descFr,
        descEn: typeof spotlightVal.descEn === 'string' ? spotlightVal.descEn : defaultImpactConfig.spotlight.descEn,
        quoteAr: typeof spotlightVal.quoteAr === 'string' ? spotlightVal.quoteAr : defaultImpactConfig.spotlight.quoteAr,
        quoteFr: typeof spotlightVal.quoteFr === 'string' ? spotlightVal.quoteFr : defaultImpactConfig.spotlight.quoteFr,
        quoteEn: typeof spotlightVal.quoteEn === 'string' ? spotlightVal.quoteEn : defaultImpactConfig.spotlight.quoteEn,
        quoteAuthorAr: typeof spotlightVal.quoteAuthorAr === 'string' ? spotlightVal.quoteAuthorAr : defaultImpactConfig.spotlight.quoteAuthorAr,
        quoteAuthorFr: typeof spotlightVal.quoteAuthorFr === 'string' ? spotlightVal.quoteAuthorFr : defaultImpactConfig.spotlight.quoteAuthorFr,
        quoteAuthorEn: typeof spotlightVal.quoteAuthorEn === 'string' ? spotlightVal.quoteAuthorEn : defaultImpactConfig.spotlight.quoteAuthorEn,
        imageUrl: typeof spotlightVal.imageUrl === 'string' ? spotlightVal.imageUrl : defaultImpactConfig.spotlight.imageUrl,
        imageCaptionAr: typeof spotlightVal.imageCaptionAr === 'string' ? spotlightVal.imageCaptionAr : defaultImpactConfig.spotlight.imageCaptionAr,
        imageCaptionFr: typeof spotlightVal.imageCaptionFr === 'string' ? spotlightVal.imageCaptionFr : defaultImpactConfig.spotlight.imageCaptionFr,
        imageCaptionEn: typeof spotlightVal.imageCaptionEn === 'string' ? spotlightVal.imageCaptionEn : defaultImpactConfig.spotlight.imageCaptionEn,
        primaryBtnTextAr: typeof spotlightVal.primaryBtnTextAr === 'string' ? spotlightVal.primaryBtnTextAr : defaultImpactConfig.spotlight.primaryBtnTextAr,
        primaryBtnTextFr: typeof spotlightVal.primaryBtnTextFr === 'string' ? spotlightVal.primaryBtnTextFr : defaultImpactConfig.spotlight.primaryBtnTextFr,
        primaryBtnTextEn: typeof spotlightVal.primaryBtnTextEn === 'string' ? spotlightVal.primaryBtnTextEn : defaultImpactConfig.spotlight.primaryBtnTextEn,
        primaryBtnUrl: typeof spotlightVal.primaryBtnUrl === 'string' ? spotlightVal.primaryBtnUrl : defaultImpactConfig.spotlight.primaryBtnUrl,
        secondaryBtnTextAr: typeof spotlightVal.secondaryBtnTextAr === 'string' ? spotlightVal.secondaryBtnTextAr : defaultImpactConfig.spotlight.secondaryBtnTextAr,
        secondaryBtnTextFr: typeof spotlightVal.secondaryBtnTextFr === 'string' ? spotlightVal.secondaryBtnTextFr : defaultImpactConfig.spotlight.secondaryBtnTextFr,
        secondaryBtnTextEn: typeof spotlightVal.secondaryBtnTextEn === 'string' ? spotlightVal.secondaryBtnTextEn : defaultImpactConfig.spotlight.secondaryBtnTextEn,
        secondaryBtnUrl: typeof spotlightVal.secondaryBtnUrl === 'string' ? spotlightVal.secondaryBtnUrl : defaultImpactConfig.spotlight.secondaryBtnUrl,
      },
      methodology: {
        badgeAr: methodologyVal.badgeAr || defaultImpactConfig.methodology.badgeAr,
        badgeFr: methodologyVal.badgeFr || defaultImpactConfig.methodology.badgeFr,
        badgeEn: methodologyVal.badgeEn || defaultImpactConfig.methodology.badgeEn,
        titleAr: methodologyVal.titleAr || defaultImpactConfig.methodology.titleAr,
        titleFr: methodologyVal.titleFr || defaultImpactConfig.methodology.titleFr,
        titleEn: methodologyVal.titleEn || defaultImpactConfig.methodology.titleEn,
        descAr: methodologyVal.descAr || defaultImpactConfig.methodology.descAr,
        descFr: methodologyVal.descFr || defaultImpactConfig.methodology.descFr,
        descEn: methodologyVal.descEn || defaultImpactConfig.methodology.descEn,
        steps: Array.isArray(methodologyVal.steps) && methodologyVal.steps.length > 0
          ? (methodologyVal.steps as ImpactStepItem[])
              .filter((s): s is ImpactStepItem => typeof s === 'object' && s !== null && typeof s.id === 'string')
              .map((s) => ({
                id: s.id,
                stepNumber: s.stepNumber || '',
                titleAr: s.titleAr || '',
                titleFr: s.titleFr || '',
                titleEn: s.titleEn || '',
                descAr: s.descAr || '',
                descFr: s.descFr || '',
                descEn: s.descEn || '',
                icon: s.icon || '📌',
              }))
          : defaultImpactConfig.methodology.steps,
      },
      transparency: {
        badgeAr: transparencyVal.badgeAr || defaultImpactConfig.transparency.badgeAr,
        badgeFr: transparencyVal.badgeFr || defaultImpactConfig.transparency.badgeFr,
        badgeEn: transparencyVal.badgeEn || defaultImpactConfig.transparency.badgeEn,
        titleAr: transparencyVal.titleAr || defaultImpactConfig.transparency.titleAr,
        titleFr: transparencyVal.titleFr || defaultImpactConfig.transparency.titleFr,
        titleEn: transparencyVal.titleEn || defaultImpactConfig.transparency.titleEn,
        descAr: transparencyVal.descAr || defaultImpactConfig.transparency.descAr,
        descFr: transparencyVal.descFr || defaultImpactConfig.transparency.descFr,
        descEn: transparencyVal.descEn || defaultImpactConfig.transparency.descEn,
        items: Array.isArray(transparencyVal.items) && transparencyVal.items.length > 0
          ? (transparencyVal.items as ImpactTransparencyItem[])
              .filter((item): item is ImpactTransparencyItem => typeof item === 'object' && item !== null && typeof item.id === 'string')
              .map((item) => ({
                id: item.id,
                titleAr: item.titleAr || '',
                titleFr: item.titleFr || '',
                titleEn: item.titleEn || '',
                descAr: item.descAr || '',
                descFr: item.descFr || '',
                descEn: item.descEn || '',
                icon: item.icon || '⚖️',
              }))
          : defaultImpactConfig.transparency.items,
      },
      cta: {
        badgeAr: ctaVal.badgeAr || defaultImpactConfig.cta.badgeAr,
        badgeFr: ctaVal.badgeFr || defaultImpactConfig.cta.badgeFr,
        badgeEn: ctaVal.badgeEn || defaultImpactConfig.cta.badgeEn,
        titleAr: ctaVal.titleAr || defaultImpactConfig.cta.titleAr,
        titleFr: ctaVal.titleFr || defaultImpactConfig.cta.titleFr,
        titleEn: ctaVal.titleEn || defaultImpactConfig.cta.titleEn,
        descAr: ctaVal.descAr || defaultImpactConfig.cta.descAr,
        descFr: ctaVal.descFr || defaultImpactConfig.cta.descFr,
        descEn: ctaVal.descEn || defaultImpactConfig.cta.descEn,
        primaryBtnTextAr: ctaVal.primaryBtnTextAr || defaultImpactConfig.cta.primaryBtnTextAr,
        primaryBtnTextFr: ctaVal.primaryBtnTextFr || defaultImpactConfig.cta.primaryBtnTextFr,
        primaryBtnTextEn: ctaVal.primaryBtnTextEn || defaultImpactConfig.cta.primaryBtnTextEn,
        primaryBtnUrl: ctaVal.primaryBtnUrl || defaultImpactConfig.cta.primaryBtnUrl,
        secondaryBtnTextAr: ctaVal.secondaryBtnTextAr || defaultImpactConfig.cta.secondaryBtnTextAr,
        secondaryBtnTextFr: ctaVal.secondaryBtnTextFr || defaultImpactConfig.cta.secondaryBtnTextFr,
        secondaryBtnTextEn: ctaVal.secondaryBtnTextEn || defaultImpactConfig.cta.secondaryBtnTextEn,
        secondaryBtnUrl: ctaVal.secondaryBtnUrl || defaultImpactConfig.cta.secondaryBtnUrl,
      },
    }
  } catch {
    return defaultImpactConfig
  }
}

// ==========================================
// Events Page CMS Config
// ==========================================

export interface EventsPageStatItem {
  id: string
  value: string
  valueAr?: string
  valueFr?: string
  valueEn?: string
  labelAr: string
  labelFr: string
  labelEn: string
  icon: string
}

export interface EventsPageConfig {
  hero: {
    tagAr: string
    tagFr: string
    tagEn: string
    badgeAr: string
    badgeFr: string
    badgeEn: string
    titleAr: string
    titleFr: string
    titleEn: string
    subtitleAr: string
    subtitleFr: string
    subtitleEn: string
    descriptionAr: string
    descriptionFr: string
    descriptionEn: string
    imageUrl: string
    hasHeroImage: boolean
    primaryBtnTextAr: string
    primaryBtnTextFr: string
    primaryBtnTextEn: string
    primaryBtnUrl: string
  }
  stats: EventsPageStatItem[]
  cta: {
    badgeAr: string
    badgeFr: string
    badgeEn: string
    titleAr: string
    titleFr: string
    titleEn: string
    descAr: string
    descFr: string
    descEn: string
    primaryBtnTextAr: string
    primaryBtnTextFr: string
    primaryBtnTextEn: string
    primaryBtnUrl: string
    secondaryBtnTextAr: string
    secondaryBtnTextFr: string
    secondaryBtnTextEn: string
    secondaryBtnUrl: string
  }
}

export const defaultEventsPageConfig: EventsPageConfig = {
  hero: {
    tagAr: 'أجندة الفعاليات والمواعيد الثقافية',
    tagFr: 'Agenda Culturel & Masterclasses',
    tagEn: 'Cultural Events & Workshops Agenda',
    badgeAr: 'الموسم الثقافي 2026 • AMYCC Events',
    badgeFr: 'Saison Culturelle 2026',
    badgeEn: 'Cultural Season 2026',
    titleAr: 'الفعاليات والورشات الثقافية والفنية',
    titleFr: 'Événements & Ateliers Culturels',
    titleEn: 'Cultural Events & Artistic Masterclasses',
    subtitleAr: 'فضاءات حية للإبداع، التعبير المسرحي، الموسيقى التراثية، والتكوين الفني بالمغرب',
    subtitleFr: 'Espaces vivants de création, théâtre, musique patrimoniale et formation artistique',
    subtitleEn: 'Vibrant spaces for creative expression, theatre, heritage music, and youth mentorship',
    descriptionAr:
      'استكشف المواعيد والورشات التكوينية القادمة التي تنظمها جمعية روح الفنون والثقافة، واحجز مقعدك مجاناً وبشكل فوري مع تأكيد الحضور المباشر.',
    descriptionFr:
      'Découvrez les prochains ateliers, représentations et festivals organisés par l’AMYCC et réservez votre place gratuitement en ligne.',
    descriptionEn:
      'Discover upcoming workshops, live performances, and forums hosted by AMYCC, and secure your free registration with instant confirmation.',
    imageUrl: '',
    hasHeroImage: false,
    primaryBtnTextAr: 'استكشف الفعاليات المجدولة',
    primaryBtnTextFr: 'Explorer les événements',
    primaryBtnTextEn: 'Explore Scheduled Events',
    primaryBtnUrl: '#events-catalog',
  },
  stats: [
    {
      id: 'stat-free',
      value: 'متاح',
      valueAr: 'متاح',
      valueFr: 'Disponible',
      valueEn: 'Available',
      labelAr: 'حجز المقاعد ومتابعة الفعاليات',
      labelFr: 'Réservation de places & billetterie',
      labelEn: 'Seat Booking & Event Access',
      icon: '🎟️',
    },
    {
      id: 'stat-workshops',
      value: '+50',
      valueAr: '+50',
      valueFr: '+50',
      valueEn: '+50',
      labelAr: 'ورشة وعرض مسرحي وموسيقي',
      labelFr: 'Ateliers et spectacles programmés',
      labelEn: 'Workshops & Performances',
      icon: '🎭',
    },
    {
      id: 'stat-regions',
      value: '12',
      valueAr: '12',
      valueFr: '12',
      valueEn: '12',
      labelAr: 'جهة مستهدفة بأنشطة القرب',
      labelFr: 'Régions ciblées au Maroc',
      labelEn: 'Targeted Moroccan Regions',
      icon: '🇲🇦',
    },
    {
      id: 'stat-instant',
      value: 'فوري',
      valueAr: 'فوري',
      valueFr: 'Immédiat',
      valueEn: 'Instant',
      labelAr: 'تأكيد التسجيل وتتبع المقاعد',
      labelFr: 'Confirmation d’inscription immédiate',
      labelEn: 'Instant Digital Confirmation',
      icon: '⚡',
    },
  ],
  cta: {
    badgeAr: 'اقتراح فعالية أو شراكة فنية',
    badgeFr: 'Proposer une Collaboration',
    badgeEn: 'Propose a Collaboration',
    titleAr: 'هل ترغب في تنظيم ورشة عمل أو استضافة فعالية بمدينتك؟',
    titleFr: 'Vous souhaitez accueillir un atelier ou organiser un événement ?',
    titleEn: 'Interested in Hosting an Event or Artistic Masterclass?',
    descAr:
      'تفتح جمعية روح الفنون والثقافة باب التعاون والشراكة مع المراكز الثقافية، دور الشباب، والفنانين والمدربين لتوسيع رقعة الأنشطة الفنية عبر ربوع المملكة.',
    descFr:
      'L’AMYCC accueille avec enthousiasme les propositions des artistes, formateurs et centres culturels pour coconstruire des projets enrichissants.',
    descEn:
      'AMYCC invites artists, trainers, and regional cultural centers to partner with us in expanding creative opportunities for youth across Morocco.',
    primaryBtnTextAr: 'طلب شراكة أو استضافة فعالية',
    primaryBtnTextFr: 'Proposer un partenariat',
    primaryBtnTextEn: 'Propose a Partnership',
    primaryBtnUrl: '/partnerships',
    secondaryBtnTextAr: 'تواصل مع إدارة الفعاليات',
    secondaryBtnTextFr: 'Contacter l’équipe',
    secondaryBtnTextEn: 'Contact Events Team',
    secondaryBtnUrl: '/contact',
  },
}

export async function getEventsPageSettings(): Promise<EventsPageConfig> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'events_page')
      .maybeSingle()

    if (error || !data || !data.value) {
      return defaultEventsPageConfig
    }

    const val = data.value as Partial<EventsPageConfig>
    const heroVal = (val.hero || {}) as Partial<EventsPageConfig['hero']>
    const ctaVal = (val.cta || {}) as Partial<EventsPageConfig['cta']>

    return {
      hero: {
        tagAr: typeof heroVal.tagAr === 'string' ? heroVal.tagAr : defaultEventsPageConfig.hero.tagAr,
        tagFr: typeof heroVal.tagFr === 'string' ? heroVal.tagFr : defaultEventsPageConfig.hero.tagFr,
        tagEn: typeof heroVal.tagEn === 'string' ? heroVal.tagEn : defaultEventsPageConfig.hero.tagEn,
        badgeAr: typeof heroVal.badgeAr === 'string' ? heroVal.badgeAr : defaultEventsPageConfig.hero.badgeAr,
        badgeFr: typeof heroVal.badgeFr === 'string' ? heroVal.badgeFr : defaultEventsPageConfig.hero.badgeFr,
        badgeEn: typeof heroVal.badgeEn === 'string' ? heroVal.badgeEn : defaultEventsPageConfig.hero.badgeEn,
        titleAr: typeof heroVal.titleAr === 'string' ? heroVal.titleAr : defaultEventsPageConfig.hero.titleAr,
        titleFr: typeof heroVal.titleFr === 'string' ? heroVal.titleFr : defaultEventsPageConfig.hero.titleFr,
        titleEn: typeof heroVal.titleEn === 'string' ? heroVal.titleEn : defaultEventsPageConfig.hero.titleEn,
        subtitleAr: typeof heroVal.subtitleAr === 'string' ? heroVal.subtitleAr : defaultEventsPageConfig.hero.subtitleAr,
        subtitleFr: typeof heroVal.subtitleFr === 'string' ? heroVal.subtitleFr : defaultEventsPageConfig.hero.subtitleFr,
        subtitleEn: typeof heroVal.subtitleEn === 'string' ? heroVal.subtitleEn : defaultEventsPageConfig.hero.subtitleEn,
        descriptionAr: typeof heroVal.descriptionAr === 'string' ? heroVal.descriptionAr : defaultEventsPageConfig.hero.descriptionAr,
        descriptionFr: typeof heroVal.descriptionFr === 'string' ? heroVal.descriptionFr : defaultEventsPageConfig.hero.descriptionFr,
        descriptionEn: typeof heroVal.descriptionEn === 'string' ? heroVal.descriptionEn : defaultEventsPageConfig.hero.descriptionEn,
        imageUrl: typeof heroVal.imageUrl === 'string' ? heroVal.imageUrl : defaultEventsPageConfig.hero.imageUrl,
        hasHeroImage: typeof heroVal.hasHeroImage === 'boolean' ? heroVal.hasHeroImage : defaultEventsPageConfig.hero.hasHeroImage,
        primaryBtnTextAr: typeof heroVal.primaryBtnTextAr === 'string' ? heroVal.primaryBtnTextAr : defaultEventsPageConfig.hero.primaryBtnTextAr,
        primaryBtnTextFr: typeof heroVal.primaryBtnTextFr === 'string' ? heroVal.primaryBtnTextFr : defaultEventsPageConfig.hero.primaryBtnTextFr,
        primaryBtnTextEn: typeof heroVal.primaryBtnTextEn === 'string' ? heroVal.primaryBtnTextEn : defaultEventsPageConfig.hero.primaryBtnTextEn,
        primaryBtnUrl: typeof heroVal.primaryBtnUrl === 'string' ? heroVal.primaryBtnUrl : defaultEventsPageConfig.hero.primaryBtnUrl,
      },
      stats: Array.isArray(val.stats) && val.stats.length > 0
        ? (val.stats as EventsPageStatItem[])
            .filter((s): s is EventsPageStatItem => typeof s === 'object' && s !== null && typeof s.id === 'string')
            .map((s) => ({
              id: s.id,
              value: s.value || '',
              valueAr: s.valueAr || s.value || '',
              valueFr: s.valueFr || (s.value === 'فوري' ? 'Immédiat' : s.value || ''),
              valueEn: s.valueEn || (s.value === 'فوري' ? 'Instant' : s.value || ''),
              labelAr: s.labelAr || '',
              labelFr: s.labelFr || '',
              labelEn: s.labelEn || '',
              icon: s.icon || '📅',
            }))
        : defaultEventsPageConfig.stats,
      cta: {
        badgeAr: typeof ctaVal.badgeAr === 'string' ? ctaVal.badgeAr : defaultEventsPageConfig.cta.badgeAr,
        badgeFr: typeof ctaVal.badgeFr === 'string' ? ctaVal.badgeFr : defaultEventsPageConfig.cta.badgeFr,
        badgeEn: typeof ctaVal.badgeEn === 'string' ? ctaVal.badgeEn : defaultEventsPageConfig.cta.badgeEn,
        titleAr: typeof ctaVal.titleAr === 'string' ? ctaVal.titleAr : defaultEventsPageConfig.cta.titleAr,
        titleFr: typeof ctaVal.titleFr === 'string' ? ctaVal.titleFr : defaultEventsPageConfig.cta.titleFr,
        titleEn: typeof ctaVal.titleEn === 'string' ? ctaVal.titleEn : defaultEventsPageConfig.cta.titleEn,
        descAr: typeof ctaVal.descAr === 'string' ? ctaVal.descAr : defaultEventsPageConfig.cta.descAr,
        descFr: typeof ctaVal.descFr === 'string' ? ctaVal.descFr : defaultEventsPageConfig.cta.descFr,
        descEn: typeof ctaVal.descEn === 'string' ? ctaVal.descEn : defaultEventsPageConfig.cta.descEn,
        primaryBtnTextAr: typeof ctaVal.primaryBtnTextAr === 'string' ? ctaVal.primaryBtnTextAr : defaultEventsPageConfig.cta.primaryBtnTextAr,
        primaryBtnTextFr: typeof ctaVal.primaryBtnTextFr === 'string' ? ctaVal.primaryBtnTextFr : defaultEventsPageConfig.cta.primaryBtnTextFr,
        primaryBtnTextEn: typeof ctaVal.primaryBtnTextEn === 'string' ? ctaVal.primaryBtnTextEn : defaultEventsPageConfig.cta.primaryBtnTextEn,
        primaryBtnUrl: typeof ctaVal.primaryBtnUrl === 'string' ? ctaVal.primaryBtnUrl : defaultEventsPageConfig.cta.primaryBtnUrl,
        secondaryBtnTextAr: typeof ctaVal.secondaryBtnTextAr === 'string' ? ctaVal.secondaryBtnTextAr : defaultEventsPageConfig.cta.secondaryBtnTextAr,
        secondaryBtnTextFr: typeof ctaVal.secondaryBtnTextFr === 'string' ? ctaVal.secondaryBtnTextFr : defaultEventsPageConfig.cta.secondaryBtnTextFr,
        secondaryBtnTextEn: typeof ctaVal.secondaryBtnTextEn === 'string' ? ctaVal.secondaryBtnTextEn : defaultEventsPageConfig.cta.secondaryBtnTextEn,
        secondaryBtnUrl: typeof ctaVal.secondaryBtnUrl === 'string' ? ctaVal.secondaryBtnUrl : defaultEventsPageConfig.cta.secondaryBtnUrl,
      },
    }
  } catch {
    return defaultEventsPageConfig
  }
}

// ============================================================
// NEWS PAGE SETTINGS (صفحة الأخبار والبيانات الصحفية)
// ============================================================

export interface NewsPageStatItem {
  id: string
  value: string
  valueAr?: string
  valueFr?: string
  valueEn?: string
  labelAr: string
  labelFr: string
  labelEn: string
  icon: string
}

export interface NewsPageConfig {
  hero: {
    tagAr: string
    tagFr: string
    tagEn: string
    badgeAr: string
    badgeFr: string
    badgeEn: string
    titleAr: string
    titleFr: string
    titleEn: string
    subtitleAr: string
    subtitleFr: string
    subtitleEn: string
    descriptionAr: string
    descriptionFr: string
    descriptionEn: string
    imageUrl: string
    hasHeroImage: boolean
    primaryBtnTextAr: string
    primaryBtnTextFr: string
    primaryBtnTextEn: string
    primaryBtnUrl: string
  }
  stats: NewsPageStatItem[]
  cta: {
    badgeAr: string
    badgeFr: string
    badgeEn: string
    titleAr: string
    titleFr: string
    titleEn: string
    descAr: string
    descFr: string
    descEn: string
    primaryBtnTextAr: string
    primaryBtnTextFr: string
    primaryBtnTextEn: string
    primaryBtnUrl: string
    secondaryBtnTextAr: string
    secondaryBtnTextFr: string
    secondaryBtnTextEn: string
    secondaryBtnUrl: string
  }
}

export const defaultNewsPageConfig: NewsPageConfig = {
  hero: {
    tagAr: 'المركز الإعلامي والبيانات الرسمية',
    tagFr: 'Espace Presse & Actualités',
    tagEn: 'Media Center & Official Press',
    badgeAr: 'مستجدات الموسم الثقافي 2026 • AMYCC News',
    badgeFr: 'Actualités Culturelles 2026',
    badgeEn: 'Cultural News 2026',
    titleAr: 'الأخبار والبيانات الصحفية',
    titleFr: 'Actualités & Communiqués de Presse',
    titleEn: 'News, Insights & Press Releases',
    subtitleAr: 'تغطية شاملة للمبادرات الفنية، الورشات الإبداعية، والأنشطة الشبابية لجمعية روح الفنون والثقافة',
    subtitleFr: 'Couverture complète des initiatives artistiques, ateliers créatifs et événements jeunesse',
    subtitleEn: 'Comprehensive coverage of artistic initiatives, youth masterclasses, and community programs',
    descriptionAr:
      'تابعوا أحدث أخبار جمعية روح الفنون والثقافة، والبيانات الرسمية الموجهة لوسائل الإعلام، ومقالات التوثيق الثقافي والفني عبر ربوع المملكة المغربية.',
    descriptionFr:
      'Suivez toute l’actualité de l’AMYCC : annonces institutionnelles, dossiers de presse, bilans d’activités et reportages artistiques.',
    descriptionEn:
      'Discover the latest news from AMYCC: press announcements, media kits, impact reports, and inspiring stories from our cultural projects across Morocco.',
    imageUrl: '',
    hasHeroImage: false,
    primaryBtnTextAr: 'تصفح أحدث الأخبار والمقالات',
    primaryBtnTextFr: 'Consulter les actualités',
    primaryBtnTextEn: 'Browse Latest News',
    primaryBtnUrl: '#news-catalog',
  },
  stats: [
    {
      id: 'stat-articles',
      value: '+40',
      valueAr: '+40',
      valueFr: '+40',
      valueEn: '+40',
      labelAr: 'تغطية إعلامية ومقال موثق',
      labelFr: 'Articles et reportages publiés',
      labelEn: 'Documented Stories & Articles',
      icon: '📰',
    },
    {
      id: 'stat-releases',
      value: '100%',
      valueAr: '100%',
      valueFr: '100%',
      valueEn: '100%',
      labelAr: 'بيانات صحفية ومعلومات موثوقة',
      labelFr: 'Communiqués officiels vérifiés',
      labelEn: 'Verified Press Releases',
      icon: '🏛️',
    },
    {
      id: 'stat-regions',
      value: '12',
      valueAr: '12',
      valueFr: '12',
      valueEn: '12',
      labelAr: 'جهة مغربية مغطاة إعلامياً',
      labelFr: 'Régions marocaines couvertes',
      labelEn: 'Regions Covered Across Morocco',
      icon: '🇲🇦',
    },
    {
      id: 'stat-reach',
      value: 'دائم',
      valueAr: 'دائم',
      valueFr: 'Continu',
      valueEn: '24/7',
      labelAr: 'تحديث مستمر وتواصل إعلامي',
      labelFr: 'Veille médiatique & diffusion continue',
      labelEn: 'Continuous Media & Press Flow',
      icon: '📡',
    },
  ],
  cta: {
    badgeAr: 'العلاقات مع الصحافة والإعلام',
    badgeFr: 'Relations Presse & Médias',
    badgeEn: 'Press & Media Relations',
    titleAr: 'هل أنت صحفي أو مؤسسة إعلامية ترغب في تغطية أنشطتنا؟',
    titleFr: 'Journalistes et professionnels des médias : couvrez nos événements',
    titleEn: 'Media Inquiries & Press Kit Access',
    descAr:
      'تضع جمعية روح الفنون والثقافة رهن إشارة ممثلي وسائل الإعلام والمهتمين ملفاً صحفياً متكاملاً، وصوراً عالية الجودة، ومصادر للمقابلات الحصرية والتغطيات الميدانية.',
    descFr:
      'L’AMYCC met à disposition des journalistes un dossier de presse complet, des visuels haute résolution et des opportunités d’interviews exclusives.',
    descEn:
      'AMYCC provides accredited journalists and media organizations with comprehensive press kits, high-resolution visual assets, and exclusive interview access.',
    primaryBtnTextAr: 'تواصل مع الخلية الإعلامية',
    primaryBtnTextFr: 'Contacter l’équipe presse',
    primaryBtnTextEn: 'Contact Press Team',
    primaryBtnUrl: '/contact',
    secondaryBtnTextAr: 'اقتراح تغطية أو شراكة إعلامية',
    secondaryBtnTextFr: 'Proposer un partenariat média',
    secondaryBtnTextEn: 'Propose Media Partnership',
    secondaryBtnUrl: '/partnerships',
  },
}

export async function getNewsPageSettings(): Promise<NewsPageConfig> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'news_page')
      .maybeSingle()

    if (error || !data || !data.value) {
      return defaultNewsPageConfig
    }

    const val = data.value as Partial<NewsPageConfig>
    const heroVal = (val.hero || {}) as Partial<NewsPageConfig['hero']>
    const ctaVal = (val.cta || {}) as Partial<NewsPageConfig['cta']>

    return {
      hero: {
        tagAr: typeof heroVal.tagAr === 'string' ? heroVal.tagAr : defaultNewsPageConfig.hero.tagAr,
        tagFr: typeof heroVal.tagFr === 'string' ? heroVal.tagFr : defaultNewsPageConfig.hero.tagFr,
        tagEn: typeof heroVal.tagEn === 'string' ? heroVal.tagEn : defaultNewsPageConfig.hero.tagEn,
        badgeAr: typeof heroVal.badgeAr === 'string' ? heroVal.badgeAr : defaultNewsPageConfig.hero.badgeAr,
        badgeFr: typeof heroVal.badgeFr === 'string' ? heroVal.badgeFr : defaultNewsPageConfig.hero.badgeFr,
        badgeEn: typeof heroVal.badgeEn === 'string' ? heroVal.badgeEn : defaultNewsPageConfig.hero.badgeEn,
        titleAr: typeof heroVal.titleAr === 'string' ? heroVal.titleAr : defaultNewsPageConfig.hero.titleAr,
        titleFr: typeof heroVal.titleFr === 'string' ? heroVal.titleFr : defaultNewsPageConfig.hero.titleFr,
        titleEn: typeof heroVal.titleEn === 'string' ? heroVal.titleEn : defaultNewsPageConfig.hero.titleEn,
        subtitleAr: typeof heroVal.subtitleAr === 'string' ? heroVal.subtitleAr : defaultNewsPageConfig.hero.subtitleAr,
        subtitleFr: typeof heroVal.subtitleFr === 'string' ? heroVal.subtitleFr : defaultNewsPageConfig.hero.subtitleFr,
        subtitleEn: typeof heroVal.subtitleEn === 'string' ? heroVal.subtitleEn : defaultNewsPageConfig.hero.subtitleEn,
        descriptionAr: typeof heroVal.descriptionAr === 'string' ? heroVal.descriptionAr : defaultNewsPageConfig.hero.descriptionAr,
        descriptionFr: typeof heroVal.descriptionFr === 'string' ? heroVal.descriptionFr : defaultNewsPageConfig.hero.descriptionFr,
        descriptionEn: typeof heroVal.descriptionEn === 'string' ? heroVal.descriptionEn : defaultNewsPageConfig.hero.descriptionEn,
        imageUrl: typeof heroVal.imageUrl === 'string' ? heroVal.imageUrl : defaultNewsPageConfig.hero.imageUrl,
        hasHeroImage: typeof heroVal.hasHeroImage === 'boolean' ? heroVal.hasHeroImage : defaultNewsPageConfig.hero.hasHeroImage,
        primaryBtnTextAr: typeof heroVal.primaryBtnTextAr === 'string' ? heroVal.primaryBtnTextAr : defaultNewsPageConfig.hero.primaryBtnTextAr,
        primaryBtnTextFr: typeof heroVal.primaryBtnTextFr === 'string' ? heroVal.primaryBtnTextFr : defaultNewsPageConfig.hero.primaryBtnTextFr,
        primaryBtnTextEn: typeof heroVal.primaryBtnTextEn === 'string' ? heroVal.primaryBtnTextEn : defaultNewsPageConfig.hero.primaryBtnTextEn,
        primaryBtnUrl: typeof heroVal.primaryBtnUrl === 'string' ? heroVal.primaryBtnUrl : defaultNewsPageConfig.hero.primaryBtnUrl,
      },
      stats: Array.isArray(val.stats) && val.stats.length > 0
        ? (val.stats as NewsPageStatItem[])
            .filter((s): s is NewsPageStatItem => typeof s === 'object' && s !== null && typeof s.id === 'string')
            .map((s) => ({
              id: s.id,
              value: s.value || '',
              valueAr: s.valueAr || s.value || '',
              valueFr: s.valueFr || s.value || '',
              valueEn: s.valueEn || s.value || '',
              labelAr: s.labelAr || '',
              labelFr: s.labelFr || '',
              labelEn: s.labelEn || '',
              icon: s.icon || '📰',
            }))
        : defaultNewsPageConfig.stats,
      cta: {
        badgeAr: typeof ctaVal.badgeAr === 'string' ? ctaVal.badgeAr : defaultNewsPageConfig.cta.badgeAr,
        badgeFr: typeof ctaVal.badgeFr === 'string' ? ctaVal.badgeFr : defaultNewsPageConfig.cta.badgeFr,
        badgeEn: typeof ctaVal.badgeEn === 'string' ? ctaVal.badgeEn : defaultNewsPageConfig.cta.badgeEn,
        titleAr: typeof ctaVal.titleAr === 'string' ? ctaVal.titleAr : defaultNewsPageConfig.cta.titleAr,
        titleFr: typeof ctaVal.titleFr === 'string' ? ctaVal.titleFr : defaultNewsPageConfig.cta.titleFr,
        titleEn: typeof ctaVal.titleEn === 'string' ? ctaVal.titleEn : defaultNewsPageConfig.cta.titleEn,
        descAr: typeof ctaVal.descAr === 'string' ? ctaVal.descAr : defaultNewsPageConfig.cta.descAr,
        descFr: typeof ctaVal.descFr === 'string' ? ctaVal.descFr : defaultNewsPageConfig.cta.descFr,
        descEn: typeof ctaVal.descEn === 'string' ? ctaVal.descEn : defaultNewsPageConfig.cta.descEn,
        primaryBtnTextAr: typeof ctaVal.primaryBtnTextAr === 'string' ? ctaVal.primaryBtnTextAr : defaultNewsPageConfig.cta.primaryBtnTextAr,
        primaryBtnTextFr: typeof ctaVal.primaryBtnTextFr === 'string' ? ctaVal.primaryBtnTextFr : defaultNewsPageConfig.cta.primaryBtnTextFr,
        primaryBtnTextEn: typeof ctaVal.primaryBtnTextEn === 'string' ? ctaVal.primaryBtnTextEn : defaultNewsPageConfig.cta.primaryBtnTextEn,
        primaryBtnUrl: typeof ctaVal.primaryBtnUrl === 'string' ? ctaVal.primaryBtnUrl : defaultNewsPageConfig.cta.primaryBtnUrl,
        secondaryBtnTextAr: typeof ctaVal.secondaryBtnTextAr === 'string' ? ctaVal.secondaryBtnTextAr : defaultNewsPageConfig.cta.secondaryBtnTextAr,
        secondaryBtnTextFr: typeof ctaVal.secondaryBtnTextFr === 'string' ? ctaVal.secondaryBtnTextFr : defaultNewsPageConfig.cta.secondaryBtnTextFr,
        secondaryBtnTextEn: typeof ctaVal.secondaryBtnTextEn === 'string' ? ctaVal.secondaryBtnTextEn : defaultNewsPageConfig.cta.secondaryBtnTextEn,
        secondaryBtnUrl: typeof ctaVal.secondaryBtnUrl === 'string' ? ctaVal.secondaryBtnUrl : defaultNewsPageConfig.cta.secondaryBtnUrl,
      },
    }
  } catch {
    return defaultNewsPageConfig
  }
}

// ============================================================
// PARTNERSHIPS PAGE CONFIGURATION & CMS
// ============================================================

export type PartnerTier = 'institutional' | 'cultural' | 'educational' | 'civil_society' | 'sponsor'

export interface PartnerItemConfig {
  id: string
  nameAr: string
  nameFr: string
  nameEn: string
  tier: PartnerTier
  logoUrl: string
  websiteUrl?: string
  descriptionAr?: string
  descriptionFr?: string
  descriptionEn?: string
  active: boolean
  order?: number
}

export interface PartnershipPillarItem {
  id: string
  icon: string
  titleAr: string
  titleFr: string
  titleEn: string
  descriptionAr: string
  descriptionFr: string
  descriptionEn: string
  tagAr: string
  tagFr: string
  tagEn: string
}

export interface PartnershipStatItem {
  id: string
  value: string
  valueAr: string
  valueFr: string
  valueEn: string
  labelAr: string
  labelFr: string
  labelEn: string
  icon: string
}

export interface PartnershipBenefitItem {
  id: string
  icon: string
  titleAr: string
  titleFr: string
  titleEn: string
  descriptionAr: string
  descriptionFr: string
  descriptionEn: string
}

export interface PartnershipsPageConfig {
  hero: {
    tagAr: string
    tagFr: string
    tagEn: string
    badgeAr: string
    badgeFr: string
    badgeEn: string
    titleAr: string
    titleFr: string
    titleEn: string
    subtitleAr: string
    subtitleFr: string
    subtitleEn: string
    descriptionAr: string
    descriptionFr: string
    descriptionEn: string
    imageUrl: string
    hasHeroImage: boolean
    primaryBtnTextAr: string
    primaryBtnTextFr: string
    primaryBtnTextEn: string
    primaryBtnUrl: string
    brochureBtnTextAr: string
    brochureBtnTextFr: string
    brochureBtnTextEn: string
    brochureUrl: string
  }
  stats: PartnershipStatItem[]
  pillars: PartnershipPillarItem[]
  benefits: PartnershipBenefitItem[]
  partners: PartnerItemConfig[]
  cta: {
    badgeAr: string
    badgeFr: string
    badgeEn: string
    titleAr: string
    titleFr: string
    titleEn: string
    descriptionAr: string
    descriptionFr: string
    descriptionEn: string
    primaryBtnTextAr: string
    primaryBtnTextFr: string
    primaryBtnTextEn: string
    primaryBtnUrl: string
    email: string
    phone: string
  }
}

export const defaultPartnershipsPageConfig: PartnershipsPageConfig = {
  hero: {
    tagAr: 'التعاون المؤسساتي والشراكات',
    tagFr: 'Coopération & Partenariats',
    tagEn: 'Institutional Cooperation & Alliances',
    badgeAr: 'بناء جسور العمل الثقافي المشترك',
    badgeFr: 'Bâtir des synergies culturelles durables',
    badgeEn: 'Building Sustainable Cultural Alliances',
    titleAr: 'شراكات استراتيجية لتمكين الشباب وصون الفنون والتراث المغربي',
    titleFr: 'Des Partenariats Stratégiques au Service de la Création et de la Jeunesse',
    titleEn: 'Strategic Alliances for Youth Empowerment & Moroccan Heritage',
    subtitleAr: 'نعمل جنباً إلى جنب مع المراكز الثقافية، المؤسسات التعليمية، والفاعلين الجمعويين لتوسيع أثر العمل الفني والإبداعي في كافة جهات المملكة.',
    subtitleFr: 'En collaboration étroite avec les centres culturels, universités et acteurs associatifs pour démultiplier l’impact artistique et citoyen.',
    subtitleEn: 'Collaborating hand-in-hand with cultural venues, universities, and civil society to expand creative opportunities across Morocco.',
    descriptionAr: 'تؤمن جمعية روح الفنون والثقافة (AMYCC) بأن التنمية الثقافية المستدامة تقوم على التحالفات التشاركية والتنسيق الميداني الفعال، من خلال اتفاقيات تعاون واضحة تتيح تبادل الخبرات، تنشيط الفضاءات، وإنتاج المبادرات الهادفة.',
    descriptionFr: 'L’AMYCC s’engage à développer des partenariats vertueux fondés sur la co-création, le partage de ressources et le rayonnement culturel inclusif.',
    descriptionEn: 'AMYCC believes that transformative cultural development thrives on collaborative partnerships, field-tested methodologies, and shared vision.',
    imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80',
    hasHeroImage: true,
    primaryBtnTextAr: 'تقديم مقترح شراكة الآن',
    primaryBtnTextFr: 'Proposer un partenariat',
    primaryBtnTextEn: 'Submit Partnership Proposal',
    primaryBtnUrl: '#proposal-form',
    brochureBtnTextAr: 'تحميل الملف التعريفي (PDF)',
    brochureBtnTextFr: 'Dossier de Présentation (PDF)',
    brochureBtnTextEn: 'Institutional Brochure (PDF)',
    brochureUrl: '/docs/AMYCC-Partenariats-2026.pdf',
  },
  stats: [
    {
      id: 'stat-partners-count',
      value: '+25',
      valueAr: '+25',
      valueFr: '+25',
      valueEn: '+25',
      labelAr: 'مؤسسة ومركز شريك بالملتقيات',
      labelFr: 'Centres & institutions partenaires',
      labelEn: 'Partner Venues & Institutions',
      icon: '🏛️',
    },
    {
      id: 'stat-regions-covered',
      value: '12',
      valueAr: '12',
      valueFr: '12',
      valueEn: '12',
      labelAr: 'جهة وإقليم مغربي مشمول بالأنشطة',
      labelFr: 'Régions & territoires couverts',
      labelEn: 'Moroccan Regions Reached',
      icon: '📍',
    },
    {
      id: 'stat-direct-beneficiaries',
      value: '+15,000',
      valueAr: '+15,000',
      valueFr: '+15 000',
      valueEn: '+15,000',
      labelAr: 'مستفيد مباشر من المشاريع المشتركة',
      labelFr: 'Bénéficiaires de projets communs',
      labelEn: 'Direct Project Beneficiaries',
      icon: '👥',
    },
    {
      id: 'stat-engagement-rate',
      value: '100%',
      valueAr: '100%',
      valueFr: '100%',
      valueEn: '100%',
      labelAr: 'التزام مؤسساتي وتنسيق شفاف',
      labelFr: 'Engagement & synergie de terrain',
      labelEn: 'Committed Field Engagement',
      icon: '🤝',
    },
  ],
  pillars: [
    {
      id: 'pillar-cultural-centers',
      icon: '🏛️',
      titleAr: 'المراكز الثقافية وفضاءات العرض',
      titleFr: 'Centres Culturels & Salles de Spectacle',
      titleEn: 'Cultural Centers & Performing Venues',
      descriptionAr: 'احتضان الورشات التكوينية، التبادل اللوجيستي، والإنتاج المشترك للعروض المسرحية والموسيقية والمعارض التشكيلية.',
      descriptionFr: 'Accueil d’ateliers d’initiation, co-production de pièces théâtrales et concerts au sein des maisons de jeunes et théâtres.',
      descriptionEn: 'Hosting masterclasses, artistic co-productions, theatrical showcases, and sharing community stage spaces.',
      tagAr: 'برمجة فنية وإنتاج مشترك',
      tagFr: 'Co-programmation culturelle',
      tagEn: 'Joint Cultural Curation',
    },
    {
      id: 'pillar-educational',
      icon: '🎓',
      titleAr: 'المؤسسات التعليمية والجامعات',
      titleFr: 'Établissements Éducatifs & Universités',
      titleEn: 'Educational Institutes & Universities',
      descriptionAr: 'تنشيط الأندية الثقافية الطلابية، تنظيم دورات تدريبية معتمدة في الأداء التعبيري، ودعم أبحاث توثيق التراث المغربي.',
      descriptionFr: 'Animation de clubs d’expression artistique universitaires, masterclasses certifiantes et valorisation du patrimoine immatériel.',
      descriptionEn: 'Fostering campus arts clubs, offering certified theatrical workshops, and backing research into living heritage.',
      tagAr: 'تأطير وتكوين معتمد',
      tagFr: 'Formations certifiantes',
      tagEn: 'Youth Talent Incubation',
    },
    {
      id: 'pillar-civil-society',
      icon: '🤝',
      titleAr: 'منظمات المجتمع المدني والجمعيات',
      titleFr: 'Société Civile & Réseaux Associatifs',
      titleEn: 'Civil Society & Non-Profit Alliances',
      descriptionAr: 'التنسيق في قوافل التنشيط الثقافي، تعبئة متطوعي مبادرة "شباب في العمل"، وتبادل الممارسات الناجحة في التنمية الجمعوية.',
      descriptionFr: 'Coordination de caravanes artistiques de proximité, mobilisation bénévole Jeunesse en Action et mutualisation des savoir-faire.',
      descriptionEn: 'Teaming up for arts caravans, mobilizing Youth in Action volunteers, and scaling grassroots civic initiatives.',
      tagAr: 'تضامن وعمل تطوعي',
      tagFr: 'Bénévolat & action de terrain',
      tagEn: 'Grassroots Social Impact',
    },
    {
      id: 'pillar-private-sector',
      icon: '🏢',
      titleAr: 'القطاع الخاص والمؤسسات المانحة',
      titleFr: 'Secteur Privé & Mécénat Culturel',
      titleEn: 'Private Sector & Cultural CSR',
      descriptionAr: 'تفعيل برامج المسؤولية المجتمعية (CSR)، الرعاية الفنية للتظاهرات الثقافية، ودعم المنح التدريبية للمواهب الصاعدة.',
      descriptionFr: 'Engagement mécène responsable, soutien des festivals thématiques et bourses d’immersion artistique pour jeunes créateurs.',
      descriptionEn: 'Corporate sponsorship, CSR cultural investments, and grant backing for underprivileged emerging talents.',
      tagAr: 'رعاية ومسؤولية مجتمعية',
      tagFr: 'Mécénat d’entreprise & RSE',
      tagEn: 'Corporate Cultural Patronage',
    },
  ],
  benefits: [
    {
      id: 'benefit-reach',
      icon: '📍',
      titleAr: 'انتشار ميداني في ربوع المملكة',
      titleFr: 'Rayonnement territorial élargi',
      titleEn: 'Nationwide Moroccan Field Reach',
      descriptionAr: 'إمكانية إيصال البرامج والمبادرات المشتركة إلى دور الشباب والمراكز الثقافية في مختلف المدن والأقاليم المغربية.',
      descriptionFr: 'Déploiement agile dans les maisons de jeunes et centres d’animation à travers plusieurs préfectures du Royaume.',
      descriptionEn: 'Direct access to regional community centers, youth hubs, and performing venues across Moroccan territories.',
    },
    {
      id: 'benefit-youth-access',
      icon: '👥',
      titleAr: 'قاعدة شبابية ومجتمعية واسعة',
      titleFr: 'Bassin dynamique de talents & jeunes',
      titleEn: 'Dynamic Pool of Youth & Creators',
      descriptionAr: 'ربط مباشر مع الآلاف من الشباب والطلبة والمبدعين المتحمسين للمشاركة الفعالة والتطوع في التظاهرات.',
      descriptionFr: 'Accès privilégié à des milliers de passionnés d’art, étudiants et bénévoles mobilisés sur le terrain.',
      descriptionEn: 'Direct connection with energetic student volunteers, performers, and young audiences eager to co-create.',
    },
    {
      id: 'benefit-media',
      icon: '🌐',
      titleAr: 'إشعاع إعلامي ثلاثي اللغات',
      titleFr: 'Visibilité trilingue & communicationnelle',
      titleEn: 'Trilingual Media Visibility',
      descriptionAr: 'توثيق احترافي ونشر رقمي باللغات العربية والفرنسية والإنجليزية يبرز مساهمة الشركاء وهويتهم البصرية.',
      descriptionFr: 'Couverture médiatique soignée, mise en valeur des logos partenaires et valorisation dans nos publications officielles.',
      descriptionEn: 'High-impact coverage with official logo placement across press releases, portal catalog, and media channels.',
    },
    {
      id: 'benefit-monitoring',
      icon: '📑',
      titleAr: 'تتبع ميداني وتقارير دورية موثقة',
      titleFr: 'Suivi rigoureux & bilans d’impact',
      titleEn: 'Transparent Tracking & Reporting',
      descriptionAr: 'اعتماد منهجية عمل واضحة تشمل جدولة دقيقة، اجتماعات تنسيق منتظمة، وتقارير أدبية ورقمية شاملة لكل مشروع مشترك.',
      descriptionFr: 'Suivi transparent étape par étape, points d’étape réguliers et livrables clairs certifiant l’impact atteint.',
      descriptionEn: 'Clear execution milestones, regular coordination meetings, and detailed milestone outcome reporting.',
    },
  ],
  partners: [
    {
      id: 'partner-cultural-houses',
      nameAr: 'شبكة المراكز الثقافية ودور الشباب بالمغرب',
      nameFr: 'Réseau des Maisons de Jeunes & Centres Culturels',
      nameEn: 'Network of Moroccan Youth Cultural Centers',
      tier: 'cultural',
      logoUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=400&q=80',
      websiteUrl: 'https://amycc.org',
      descriptionAr: 'شراكة إطار لاحتضان التداريب والورشات التكوينية في فنون الأداء والمسرح التعبيري.',
      descriptionFr: 'Accord-cadre pour l’accueil des ateliers artistiques et représentations théâtrales de proximité.',
      descriptionEn: 'Framework agreement for hosting theatrical and expressive coaching masterclasses.',
      active: true,
      order: 1,
    },
    {
      id: 'partner-theatre-academy',
      nameAr: 'المعهد العالي للفن المسرحي والتنشيط الثقافي',
      nameFr: 'Institut Supérieur d’Art Dramatique et d’Animation Culturelle',
      nameEn: 'Higher Institute of Theatrical Arts (ISADAC Alumni Network)',
      tier: 'educational',
      logoUrl: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=400&q=80',
      websiteUrl: 'https://amycc.org',
      descriptionAr: 'تنسيق أكاديمي لتأطير المستفيدين من طرف خريجين وأساتذة متخصصين في الإخراج والأداء الركحي.',
      descriptionFr: 'Coopération académique pour le mentorat d’ateliers de scénographie et d’expression scénique.',
      descriptionEn: 'Academic coaching partnership offering professional scenic performance mentorship.',
      active: true,
      order: 2,
    },
    {
      id: 'partner-youth-initiatives',
      nameAr: 'اتحاد جمعيات المبادرات الشبابية والتطوع الثقافي',
      nameFr: 'Fédération des Initiatives Jeunesse & Bénévolat',
      nameEn: 'Federation of Youth Initiatives & Cultural Volunteering',
      tier: 'civil_society',
      logoUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=400&q=80',
      websiteUrl: 'https://amycc.org',
      descriptionAr: 'تبادل المتطوعين وتنسيق القوافل التوعوية والفنية في الأحياء والمناطق القروية.',
      descriptionFr: 'Coordination d’actions de bénévolat de proximité et de caravanes artistiques régionales.',
      descriptionEn: 'Joint deployment of Youth in Action volunteers and regional arts outreach caravans.',
      active: true,
      order: 3,
    },
    {
      id: 'partner-heritage-foundation',
      nameAr: 'مؤسسة صون التراث الموسيقي والفولكلور المغربي',
      nameFr: 'Fondation pour la Préservation du Patrimoine Musical Marocain',
      nameEn: 'Foundation for the Preservation of Moroccan Musical Heritage',
      tier: 'institutional',
      logoUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80',
      websiteUrl: 'https://amycc.org',
      descriptionAr: 'توثيق الإيقاعات التراثية الأصيلة ودعم المواهب الشابة في العزف التراثي والغناء الأندلسي والشعبي.',
      descriptionFr: 'Archivage des traditions sonores et soutien aux ensembles acoustiques émergents.',
      descriptionEn: 'Archiving traditional melodies and supporting emerging acoustic heritage ensembles.',
      active: true,
      order: 4,
    },
  ],
  cta: {
    badgeAr: 'دعوة مفتوحة لكافة الهيئات والمؤسسات',
    badgeFr: 'Appel permanent aux partenaires',
    badgeEn: 'Open Call for Institutional Collaboration',
    titleAr: 'هل ترغب في توقيع شراكة استراتيجية مع جمعية روح الفنون والثقافة؟',
    titleFr: 'Envie de co-construire un projet culturel à fort impact citoyen ?',
    titleEn: 'Ready to build a strategic cultural partnership with AMYCC?',
    descriptionAr: 'فريق العلاقات المؤسساتية والشراكات رهن إشارتكم لدراسة أي مقترح تعاون، توفير الدعم الفني، وصياغة اتفاقية إطار تلبي تطلعات الطرفين.',
    descriptionFr: 'Notre pôle partenariats se tient à votre entière disposition pour échanger sur vos projets et concevoir une convention adaptée.',
    descriptionEn: 'Our institutional alliances desk welcomes your collaborative proposal to co-create sustainable cultural impact.',
    primaryBtnTextAr: 'تقديم مقترح شراكة رسمي',
    primaryBtnTextFr: 'Déposer une proposition',
    primaryBtnTextEn: 'Submit Collaboration Request',
    primaryBtnUrl: '#proposal-form',
    email: 'contact@amycc.org',
    phone: '+212 5XX-XXXXXX',
  },
}

export async function getPartnershipsPageSettings(): Promise<PartnershipsPageConfig> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'partnerships_page')
      .single()

    if (!data || !data.value) {
      return defaultPartnershipsPageConfig
    }

    const val = data.value as Partial<PartnershipsPageConfig>
    const heroVal = (val.hero || {}) as Partial<PartnershipsPageConfig['hero']>
    const ctaVal = (val.cta || {}) as Partial<PartnershipsPageConfig['cta']>

    return {
      hero: {
        tagAr: typeof heroVal.tagAr === 'string' ? heroVal.tagAr : defaultPartnershipsPageConfig.hero.tagAr,
        tagFr: typeof heroVal.tagFr === 'string' ? heroVal.tagFr : defaultPartnershipsPageConfig.hero.tagFr,
        tagEn: typeof heroVal.tagEn === 'string' ? heroVal.tagEn : defaultPartnershipsPageConfig.hero.tagEn,
        badgeAr: typeof heroVal.badgeAr === 'string' ? heroVal.badgeAr : defaultPartnershipsPageConfig.hero.badgeAr,
        badgeFr: typeof heroVal.badgeFr === 'string' ? heroVal.badgeFr : defaultPartnershipsPageConfig.hero.badgeFr,
        badgeEn: typeof heroVal.badgeEn === 'string' ? heroVal.badgeEn : defaultPartnershipsPageConfig.hero.badgeEn,
        titleAr: typeof heroVal.titleAr === 'string' ? heroVal.titleAr : defaultPartnershipsPageConfig.hero.titleAr,
        titleFr: typeof heroVal.titleFr === 'string' ? heroVal.titleFr : defaultPartnershipsPageConfig.hero.titleFr,
        titleEn: typeof heroVal.titleEn === 'string' ? heroVal.titleEn : defaultPartnershipsPageConfig.hero.titleEn,
        subtitleAr: typeof heroVal.subtitleAr === 'string' ? heroVal.subtitleAr : defaultPartnershipsPageConfig.hero.subtitleAr,
        subtitleFr: typeof heroVal.subtitleFr === 'string' ? heroVal.subtitleFr : defaultPartnershipsPageConfig.hero.subtitleFr,
        subtitleEn: typeof heroVal.subtitleEn === 'string' ? heroVal.subtitleEn : defaultPartnershipsPageConfig.hero.subtitleEn,
        descriptionAr: typeof heroVal.descriptionAr === 'string' ? heroVal.descriptionAr : defaultPartnershipsPageConfig.hero.descriptionAr,
        descriptionFr: typeof heroVal.descriptionFr === 'string' ? heroVal.descriptionFr : defaultPartnershipsPageConfig.hero.descriptionFr,
        descriptionEn: typeof heroVal.descriptionEn === 'string' ? heroVal.descriptionEn : defaultPartnershipsPageConfig.hero.descriptionEn,
        imageUrl: typeof heroVal.imageUrl === 'string' ? heroVal.imageUrl : defaultPartnershipsPageConfig.hero.imageUrl,
        hasHeroImage: typeof heroVal.hasHeroImage === 'boolean' ? heroVal.hasHeroImage : defaultPartnershipsPageConfig.hero.hasHeroImage,
        primaryBtnTextAr: typeof heroVal.primaryBtnTextAr === 'string' ? heroVal.primaryBtnTextAr : defaultPartnershipsPageConfig.hero.primaryBtnTextAr,
        primaryBtnTextFr: typeof heroVal.primaryBtnTextFr === 'string' ? heroVal.primaryBtnTextFr : defaultPartnershipsPageConfig.hero.primaryBtnTextFr,
        primaryBtnTextEn: typeof heroVal.primaryBtnTextEn === 'string' ? heroVal.primaryBtnTextEn : defaultPartnershipsPageConfig.hero.primaryBtnTextEn,
        primaryBtnUrl: typeof heroVal.primaryBtnUrl === 'string' ? heroVal.primaryBtnUrl : defaultPartnershipsPageConfig.hero.primaryBtnUrl,
        brochureBtnTextAr: typeof heroVal.brochureBtnTextAr === 'string' ? heroVal.brochureBtnTextAr : defaultPartnershipsPageConfig.hero.brochureBtnTextAr,
        brochureBtnTextFr: typeof heroVal.brochureBtnTextFr === 'string' ? heroVal.brochureBtnTextFr : defaultPartnershipsPageConfig.hero.brochureBtnTextFr,
        brochureBtnTextEn: typeof heroVal.brochureBtnTextEn === 'string' ? heroVal.brochureBtnTextEn : defaultPartnershipsPageConfig.hero.brochureBtnTextEn,
        brochureUrl: typeof heroVal.brochureUrl === 'string' ? heroVal.brochureUrl : defaultPartnershipsPageConfig.hero.brochureUrl,
      },
      stats: Array.isArray(val.stats) && val.stats.length > 0
        ? (val.stats as PartnershipStatItem[])
            .filter((s): s is PartnershipStatItem => typeof s === 'object' && s !== null && typeof s.id === 'string')
            .map((s) => ({
              id: s.id,
              value: s.value || '',
              valueAr: s.valueAr || s.value || '',
              valueFr: s.valueFr || s.value || '',
              valueEn: s.valueEn || s.value || '',
              labelAr: s.labelAr || '',
              labelFr: s.labelFr || '',
              labelEn: s.labelEn || '',
              icon: s.icon || '🤝',
            }))
        : defaultPartnershipsPageConfig.stats,
      pillars: Array.isArray(val.pillars) && val.pillars.length > 0
        ? (val.pillars as PartnershipPillarItem[])
            .filter((p): p is PartnershipPillarItem => typeof p === 'object' && p !== null && typeof p.id === 'string')
            .map((p) => ({
              id: p.id,
              icon: p.icon || '🏛️',
              titleAr: p.titleAr || '',
              titleFr: p.titleFr || '',
              titleEn: p.titleEn || '',
              descriptionAr: p.descriptionAr || '',
              descriptionFr: p.descriptionFr || '',
              descriptionEn: p.descriptionEn || '',
              tagAr: p.tagAr || '',
              tagFr: p.tagFr || '',
              tagEn: p.tagEn || '',
            }))
        : defaultPartnershipsPageConfig.pillars,
      benefits: Array.isArray(val.benefits) && val.benefits.length > 0
        ? (val.benefits as PartnershipBenefitItem[])
            .filter((b): b is PartnershipBenefitItem => typeof b === 'object' && b !== null && typeof b.id === 'string')
            .map((b) => ({
              id: b.id,
              icon: b.icon || '✨',
              titleAr: b.titleAr || '',
              titleFr: b.titleFr || '',
              titleEn: b.titleEn || '',
              descriptionAr: b.descriptionAr || '',
              descriptionFr: b.descriptionFr || '',
              descriptionEn: b.descriptionEn || '',
            }))
        : defaultPartnershipsPageConfig.benefits,
      partners: Array.isArray(val.partners)
        ? (val.partners as PartnerItemConfig[])
            .filter((item): item is PartnerItemConfig => typeof item === 'object' && item !== null && typeof item.id === 'string')
            .map((item) => ({
              id: item.id,
              nameAr: item.nameAr || '',
              nameFr: item.nameFr || '',
              nameEn: item.nameEn || '',
              tier: item.tier || 'cultural',
              logoUrl: item.logoUrl || '',
              websiteUrl: item.websiteUrl || '',
              descriptionAr: item.descriptionAr || '',
              descriptionFr: item.descriptionFr || '',
              descriptionEn: item.descriptionEn || '',
              active: item.active !== false,
              order: typeof item.order === 'number' ? item.order : 1,
            }))
        : defaultPartnershipsPageConfig.partners,
      cta: {
        badgeAr: typeof ctaVal.badgeAr === 'string' ? ctaVal.badgeAr : defaultPartnershipsPageConfig.cta.badgeAr,
        badgeFr: typeof ctaVal.badgeFr === 'string' ? ctaVal.badgeFr : defaultPartnershipsPageConfig.cta.badgeFr,
        badgeEn: typeof ctaVal.badgeEn === 'string' ? ctaVal.badgeEn : defaultPartnershipsPageConfig.cta.badgeEn,
        titleAr: typeof ctaVal.titleAr === 'string' ? ctaVal.titleAr : defaultPartnershipsPageConfig.cta.titleAr,
        titleFr: typeof ctaVal.titleFr === 'string' ? ctaVal.titleFr : defaultPartnershipsPageConfig.cta.titleFr,
        titleEn: typeof ctaVal.titleEn === 'string' ? ctaVal.titleEn : defaultPartnershipsPageConfig.cta.titleEn,
        descriptionAr: typeof ctaVal.descriptionAr === 'string' ? ctaVal.descriptionAr : defaultPartnershipsPageConfig.cta.descriptionAr,
        descriptionFr: typeof ctaVal.descriptionFr === 'string' ? ctaVal.descriptionFr : defaultPartnershipsPageConfig.cta.descriptionFr,
        descriptionEn: typeof ctaVal.descriptionEn === 'string' ? ctaVal.descriptionEn : defaultPartnershipsPageConfig.cta.descriptionEn,
        primaryBtnTextAr: typeof ctaVal.primaryBtnTextAr === 'string' ? ctaVal.primaryBtnTextAr : defaultPartnershipsPageConfig.cta.primaryBtnTextAr,
        primaryBtnTextFr: typeof ctaVal.primaryBtnTextFr === 'string' ? ctaVal.primaryBtnTextFr : defaultPartnershipsPageConfig.cta.primaryBtnTextFr,
        primaryBtnTextEn: typeof ctaVal.primaryBtnTextEn === 'string' ? ctaVal.primaryBtnTextEn : defaultPartnershipsPageConfig.cta.primaryBtnTextEn,
        primaryBtnUrl: typeof ctaVal.primaryBtnUrl === 'string' ? ctaVal.primaryBtnUrl : defaultPartnershipsPageConfig.cta.primaryBtnUrl,
        email: typeof ctaVal.email === 'string' ? ctaVal.email : defaultPartnershipsPageConfig.cta.email,
        phone: typeof ctaVal.phone === 'string' ? ctaVal.phone : defaultPartnershipsPageConfig.cta.phone,
      },
    }
  } catch {
    return defaultPartnershipsPageConfig
  }
}

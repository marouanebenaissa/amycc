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
        }))
        .sort((a, b) => a.order - b.order),
    }
  } catch {
    return defaultAreasConfig
  }
}

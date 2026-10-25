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
  imageUrl: '/images/youth-in-action.png',
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
      imageUrl: typeof val.imageUrl === 'string' ? val.imageUrl : defaultFlagshipProgramConfig.imageUrl,
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

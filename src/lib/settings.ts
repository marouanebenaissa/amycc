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

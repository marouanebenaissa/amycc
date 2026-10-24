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

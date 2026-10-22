import { isValidLocale, type Locale, defaultLocale } from './config'

const dictionaries: Record<Locale, () => Promise<any>> = {
  ar: () => import('@/messages/ar.json').then((m) => m.default),
  fr: () => import('@/messages/fr.json').then((m) => m.default),
  en: () => import('@/messages/en.json').then((m) => m.default),
}

export type Dictionary = Awaited<ReturnType<typeof dictionaries['en']>>

export async function getDictionary(locale: string = defaultLocale): Promise<Dictionary> {
  const targetLocale = isValidLocale(locale) ? locale : defaultLocale
  return dictionaries[targetLocale]()
}

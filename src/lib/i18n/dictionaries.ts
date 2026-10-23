import { isValidLocale, type Locale, defaultLocale } from './config'
import enMessages from '@/messages/en.json'

export type Dictionary = typeof enMessages

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  ar: () => import('@/messages/ar.json').then((m) => m.default as Dictionary),
  fr: () => import('@/messages/fr.json').then((m) => m.default as Dictionary),
  en: () => import('@/messages/en.json').then((m) => m.default as Dictionary),
}

export async function getDictionary(locale: string = defaultLocale): Promise<Dictionary> {
  const targetLocale = isValidLocale(locale) ? locale : defaultLocale
  return dictionaries[targetLocale]()
}

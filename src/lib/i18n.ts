import en from '../../messages/en.json'

export type Locale = 'en'
export const defaultLocale: Locale = 'en'
export const locales: Locale[] = ['en']

const dictionaries: Record<Locale, typeof en> = { en }

export function getDictionary(locale: Locale = defaultLocale) {
  return dictionaries[locale] ?? dictionaries.en
}

export function t(path: string, locale: Locale = defaultLocale): string {
  const dict = getDictionary(locale) as Record<string, unknown>
  const value = path.split('.').reduce<unknown>((acc, key) => {
    if (typeof acc === 'object' && acc !== null && key in acc) {
      return (acc as Record<string, unknown>)[key]
    }
    return undefined
  }, dict)
  return typeof value === 'string' ? value : path
}

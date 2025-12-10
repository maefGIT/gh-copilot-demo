import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import fr from './locales/fr.json'
import de from './locales/de.json'

export type MessageSchema = typeof en

const i18n = createI18n<[MessageSchema], 'en' | 'fr' | 'de'>({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    fr,
    de
  }
})

export default i18n

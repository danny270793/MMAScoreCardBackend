import i18Next from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { en, es } from './langs'
import { capitalize, upper } from '../utils/strings'

export const i18n = i18Next
  .use(LanguageDetector)
  .use(initReactI18next)
  .use({
    type: 'postProcessor',
    name: 'capitalize',
    process: capitalize,
  })
  .use({
    type: 'postProcessor',
    name: 'upper',
    process: upper,
  })
  .init({
    resources: {
      en: {
        translation: en,
      },
      es: {
        translation: es,
      },
    },
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
  })

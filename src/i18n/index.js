import { createI18n } from 'vue-i18n'

import zhLocale from './zh'
import enLocale from './en'

// 语言库
const messages = {
  en: {
    ...enLocale,
  },
  zh: {
    ...zhLocale,
  },
}

// 默认语言
export function getLanguage() {
  const chooseLanguage = localStorage.getItem('__VEA__lang')
  if (chooseLanguage) return chooseLanguage

  // if has not choose language
  const language = (navigator.language || navigator.browserLanguage).toLowerCase()
  const locales = Object.keys(messages)

  for (const locale of locales) {
    if (language.indexOf(locale) > -1) {
      return locale
    }
  }
  return 'en'
}

const i18n = createI18n({
  legacy: false,
  messages,  // set locale messages
  locale: getLanguage(),		//默认显示的语言 
  fallbackLocale: 'en', // 预设的语言环境
  silentTranslationWarn: true, // 禁止本地化失败警告
  globalInjection: true, // 全局注入 $t 函数
  missingWarn: false,
  silentFallbackWarn: true, //抑制警告
})

export default i18n; // 将i18n暴露出去，在main.js中引入挂载
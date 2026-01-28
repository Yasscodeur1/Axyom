// app/get-dictionary.ts
import 'server-only' // S'assure que ce code ne tourne que côté serveur

const dictionaries = {
  en: () => import('../dictionaries/en.json').then((module) => module.default),
  fr: () => import('../dictionaries/fr.json').then((module) => module.default),
}

export const getDictionary = async (locale: 'en' | 'fr') => {
  // On vérifie si la langue existe, sinon on met "en" par défaut
  return dictionaries[locale] ? dictionaries[locale]() : dictionaries.en()
}
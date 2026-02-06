/**
 * Liste des pays européens disponibles pour la livraison
 * Codes ISO 3166-1 alpha-2
 */

export interface Country {
  code: string;
  flag: string;
  name: {
    fr: string;
    en: string;
  };
}

export const EUROPEAN_COUNTRIES: Country[] = [
  { code: "FR", flag: "🇫🇷", name: { fr: "France", en: "France" } },
  { code: "DE", flag: "🇩🇪", name: { fr: "Allemagne", en: "Germany" } },
  { code: "AT", flag: "🇦🇹", name: { fr: "Autriche", en: "Austria" } },
  { code: "BE", flag: "🇧🇪", name: { fr: "Belgique", en: "Belgium" } },
  { code: "BG", flag: "🇧🇬", name: { fr: "Bulgarie", en: "Bulgaria" } },
  { code: "CY", flag: "🇨🇾", name: { fr: "Chypre", en: "Cyprus" } },
  { code: "HR", flag: "🇭🇷", name: { fr: "Croatie", en: "Croatia" } },
  { code: "DK", flag: "🇩🇰", name: { fr: "Danemark", en: "Denmark" } },
  { code: "ES", flag: "🇪🇸", name: { fr: "Espagne", en: "Spain" } },
  { code: "EE", flag: "🇪🇪", name: { fr: "Estonie", en: "Estonia" } },
  { code: "FI", flag: "🇫🇮", name: { fr: "Finlande", en: "Finland" } },
  { code: "GR", flag: "🇬🇷", name: { fr: "Grèce", en: "Greece" } },
  { code: "HU", flag: "🇭🇺", name: { fr: "Hongrie", en: "Hungary" } },
  { code: "IE", flag: "🇮🇪", name: { fr: "Irlande", en: "Ireland" } },
  { code: "IS", flag: "🇮🇸", name: { fr: "Islande", en: "Iceland" } },
  { code: "IT", flag: "🇮🇹", name: { fr: "Italie", en: "Italy" } },
  { code: "LV", flag: "🇱🇻", name: { fr: "Lettonie", en: "Latvia" } },
  { code: "LT", flag: "🇱🇹", name: { fr: "Lituanie", en: "Lithuania" } },
  { code: "LU", flag: "🇱🇺", name: { fr: "Luxembourg", en: "Luxembourg" } },
  { code: "MT", flag: "🇲🇹", name: { fr: "Malte", en: "Malta" } },
  { code: "NO", flag: "🇳🇴", name: { fr: "Norvège", en: "Norway" } },
  { code: "NL", flag: "🇳🇱", name: { fr: "Pays-Bas", en: "Netherlands" } },
  { code: "PL", flag: "🇵🇱", name: { fr: "Pologne", en: "Poland" } },
  { code: "PT", flag: "🇵🇹", name: { fr: "Portugal", en: "Portugal" } },
  { code: "CZ", flag: "🇨🇿", name: { fr: "République Tchèque", en: "Czech Republic" } },
  { code: "RO", flag: "🇷🇴", name: { fr: "Roumanie", en: "Romania" } },
  { code: "GB", flag: "🇬🇧", name: { fr: "Royaume-Uni", en: "United Kingdom" } },
  { code: "SK", flag: "🇸🇰", name: { fr: "Slovaquie", en: "Slovakia" } },
  { code: "SI", flag: "🇸🇮", name: { fr: "Slovénie", en: "Slovenia" } },
  { code: "SE", flag: "🇸🇪", name: { fr: "Suède", en: "Sweden" } },
  { code: "CH", flag: "🇨🇭", name: { fr: "Suisse", en: "Switzerland" } },
];

/**
 * Obtenir le nom du pays selon la langue
 */
export const getCountryName = (code: string, lang: "fr" | "en"): string => {
  const country = EUROPEAN_COUNTRIES.find((c) => c.code === code);
  return country ? country.name[lang] : code;
};

/**
 * Obtenir le drapeau du pays
 */
export const getCountryFlag = (code: string): string => {
  const country = EUROPEAN_COUNTRIES.find((c) => c.code === code);
  return country ? country.flag : "🌍";
};

/**
 * Vérifier si le code pays est valide pour la livraison
 */
export const isValidCountry = (code: string): boolean => {
  return EUROPEAN_COUNTRIES.some((c) => c.code === code);
};

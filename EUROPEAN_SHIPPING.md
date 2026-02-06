# 🌍 Livraison dans Toute l'Europe - Configuration

## ✅ Modifications Effectuées

### 1. **Liste Complète des Pays Européens**

Vous pouvez maintenant livrer dans **31 pays européens** :

#### Union Européenne (27 pays)
- 🇫🇷 France
- 🇩🇪 Allemagne / Germany
- 🇦🇹 Autriche / Austria
- 🇧🇪 Belgique / Belgium
- 🇧🇬 Bulgarie / Bulgaria
- 🇨🇾 Chypre / Cyprus
- 🇭🇷 Croatie / Croatia
- 🇩🇰 Danemark / Denmark
- 🇪🇸 Espagne / Spain
- 🇪🇪 Estonie / Estonia
- 🇫🇮 Finlande / Finland
- 🇬🇷 Grèce / Greece
- 🇭🇺 Hongrie / Hungary
- 🇮🇪 Irlande / Ireland
- 🇮🇹 Italie / Italy
- 🇱🇻 Lettonie / Latvia
- 🇱🇹 Lituanie / Lithuania
- 🇱🇺 Luxembourg
- 🇲🇹 Malte / Malta
- 🇳🇱 Pays-Bas / Netherlands
- 🇵🇱 Pologne / Poland
- 🇵🇹 Portugal
- 🇨🇿 République Tchèque / Czech Republic
- 🇷🇴 Roumanie / Romania
- 🇸🇰 Slovaquie / Slovakia
- 🇸🇮 Slovénie / Slovenia
- 🇸🇪 Suède / Sweden

#### Hors UE
- 🇬🇧 Royaume-Uni / United Kingdom
- 🇨🇭 Suisse / Switzerland
- 🇮🇸 Islande / Iceland
- 🇳🇴 Norvège / Norway

### 2. **Formulaires Mis à Jour**

#### Page d'Inscription (`/components/auth/register-form.tsx`)
```tsx
// Avant : Input text
<Input 
  placeholder="France" 
/>

// Après : Select avec 31 pays
<select>
  <option value="">Sélectionnez un pays</option>
  <option value="FR">🇫🇷 France</option>
  <option value="DE">🇩🇪 Allemagne</option>
  // ... 29 autres pays
</select>
```

#### Page Checkout (`/components/checkout/checkout-form.tsx`)
```tsx
// Avant : 6 pays seulement
<select>
  <option value="France">France</option>
  <option value="Germany">Germany</option>
  <option value="Belgium">Belgium</option>
  <option value="Netherlands">Netherlands</option>
  <option value="Spain">Spain</option>
  <option value="Italy">Italy</option>
</select>

// Après : 31 pays européens
<select>
  <option value="FR">🇫🇷 France</option>
  <option value="DE">🇩🇪 Allemagne</option>
  // ... tous les pays
</select>
```

### 3. **Codes Pays Standardisés**

Utilisation des **codes ISO 3166-1 alpha-2** au lieu des noms complets :

| Avant | Après | Avantage |
|-------|-------|----------|
| "France" | "FR" | Standard international |
| "Germany" | "DE" | Compatible API shipping |
| "Belgium" | "BE" | Base de données normalisée |

**Valeur par défaut** : `FR` (France)

### 4. **Fichier de Constantes**

Nouveau fichier : `/lib/countries.ts`

```typescript
export interface Country {
  code: string;      // "FR", "DE", etc.
  flag: string;      // "🇫🇷", "🇩🇪", etc.
  name: {
    fr: string;      // "France", "Allemagne"
    en: string;      // "France", "Germany"
  };
}

export const EUROPEAN_COUNTRIES: Country[] = [
  { code: "FR", flag: "🇫🇷", name: { fr: "France", en: "France" } },
  // ... 30 autres pays
];

// Fonctions utilitaires
getCountryName(code: string, lang: "fr" | "en"): string
getCountryFlag(code: string): string
isValidCountry(code: string): boolean
```

### 5. **Composant Réutilisable**

Nouveau composant : `/components/ui/country-select.tsx`

```tsx
import { CountrySelect } from "@/components/ui/country-select";

<CountrySelect
  id="country"
  name="country"
  value={formData.country}
  onChange={handleChange}
  lang="fr"
  showPlaceholder={true}
  required={false}
/>
```

**Props disponibles** :
- `id`, `name`, `value`, `onChange` - Props standard
- `lang` - "fr" | "en" pour les traductions
- `disabled` - Désactiver le select
- `className` - Classes CSS personnalisées
- `required` - Champ requis
- `showPlaceholder` - Afficher "Sélectionnez un pays"

### 6. **Traductions Automatiques**

Les noms de pays s'adaptent selon la langue :

```tsx
// En français (lang="fr")
🇩🇪 Allemagne
🇪🇸 Espagne
🇬🇧 Royaume-Uni

// En anglais (lang="en")
🇩🇪 Germany
🇪🇸 Spain
🇬🇧 United Kingdom
```

### 7. **Drapeaux Emoji**

Chaque pays a son drapeau emoji pour une meilleure UX :

```
🇫🇷 France
🇩🇪 Allemagne
🇪🇸 Espagne
🇮🇹 Italie
🇬🇧 Royaume-Uni
```

## 🚀 Utilisation

### Dans un Formulaire

```tsx
"use client";

import { useState } from "react";
import { CountrySelect } from "@/components/ui/country-select";

export function MyForm({ lang }: { lang: "fr" | "en" }) {
  const [country, setCountry] = useState("FR");

  return (
    <CountrySelect
      id="delivery-country"
      name="country"
      value={country}
      onChange={(e) => setCountry(e.target.value)}
      lang={lang}
      className="w-full rounded-md border p-2"
    />
  );
}
```

### Validation Backend (Laravel)

```php
// Validation avec les codes ISO
$request->validate([
    'country' => 'required|string|in:FR,DE,AT,BE,BG,CY,HR,DK,ES,EE,FI,GR,HU,IE,IS,IT,LV,LT,LU,MT,NO,NL,PL,PT,CZ,RO,GB,SK,SI,SE,CH'
]);
```

### Calcul Frais de Livraison

```php
// Exemple de zones tarifaires
$shippingZones = [
    'zone1' => ['FR'],                          // 5€
    'zone2' => ['DE', 'BE', 'NL', 'LU'],       // 8€
    'zone3' => ['ES', 'IT', 'PT'],             // 12€
    'zone4' => ['GB', 'CH', 'NO'],             // 15€
    'zone5' => [...],                           // 10€ autres UE
];

function getShippingCost($countryCode) {
    // Logique selon le pays
}
```

## 📋 Données Envoyées

### Inscription
```json
{
  "first_name": "Jean",
  "last_name": "Dupont",
  "email": "jean@exemple.com",
  "country": "FR",  // ⭐ Code ISO au lieu de "France"
  // ... autres champs
}
```

### Checkout
```json
{
  "customer": {
    "country": "DE",  // ⭐ Code ISO
    "address": "Hauptstraße 123",
    "city": "Berlin",
    "postal_code": "10115"
  }
}
```

## 🎯 Avantages

### Pour l'Utilisateur
- ✅ **31 pays** disponibles au lieu de 6
- ✅ **Drapeaux visuels** pour reconnaissance rapide
- ✅ **Noms traduits** selon la langue du site
- ✅ **Interface claire** avec select au lieu d'input

### Pour le Business
- ✅ **Expansion européenne** facilitée
- ✅ **Zone de livraison élargie**
- ✅ **Codes standardisés** pour intégration shipping APIs
- ✅ **Validation simplifiée**

### Pour le Développement
- ✅ **Code réutilisable** (CountrySelect component)
- ✅ **Type-safe** avec TypeScript
- ✅ **Centralisé** dans `/lib/countries.ts`
- ✅ **Facilement extensible** (ajouter pays = 1 ligne)

## 🔧 Personnalisation

### Ajouter un Pays

Éditer `/lib/countries.ts` :

```typescript
export const EUROPEAN_COUNTRIES: Country[] = [
  // ... pays existants
  { 
    code: "MC", 
    flag: "🇲🇨", 
    name: { fr: "Monaco", en: "Monaco" } 
  },
];
```

### Modifier l'Ordre

Les pays sont affichés dans l'ordre du tableau. Pour mettre la France en premier :

```typescript
// Déjà fait ! France est en première position
{ code: "FR", flag: "🇫🇷", name: { fr: "France", en: "France" } },
```

### Filtrer par Zone UE

```typescript
// Dans countries.ts
export const EU_COUNTRIES = EUROPEAN_COUNTRIES.filter(c => 
  !['GB', 'CH', 'NO', 'IS'].includes(c.code)
);

export const NON_EU_COUNTRIES = EUROPEAN_COUNTRIES.filter(c => 
  ['GB', 'CH', 'NO', 'IS'].includes(c.code)
);
```

## 📱 Responsive

Le select fonctionne parfaitement sur :
- 📱 **Mobile** : Menu natif du système
- 💻 **Desktop** : Dropdown stylisé
- ⌨️ **Clavier** : Navigation avec flèches
- 🔍 **Recherche** : Taper la première lettre

## 🌐 Migration Base de Données

Si vous avez déjà des données avec noms complets :

```sql
-- Migration des anciens noms vers codes ISO
UPDATE customers SET country = 'FR' WHERE country = 'France';
UPDATE customers SET country = 'DE' WHERE country IN ('Germany', 'Allemagne');
UPDATE customers SET country = 'BE' WHERE country IN ('Belgium', 'Belgique');
UPDATE customers SET country = 'NL' WHERE country IN ('Netherlands', 'Pays-Bas');
UPDATE customers SET country = 'ES' WHERE country IN ('Spain', 'Espagne');
UPDATE customers SET country = 'IT' WHERE country IN ('Italy', 'Italie');
-- etc.
```

## ✨ Prochaines Étapes

1. **Frais de livraison dynamiques** selon le pays
2. **Estimation délai** de livraison par zone
3. **Restrictions produits** par pays (si nécessaire)
4. **Taxes/TVA** selon le pays
5. **Langues locales** (IT, ES, DE si souhaité)

---

🎊 **Vous pouvez maintenant livrer partout en Europe avec des codes pays standardisés !**

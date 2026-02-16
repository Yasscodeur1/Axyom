"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function ProfileForm({ lang, dict }: { lang: string; dict: any }) {
  const { user, refreshUser, token } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
      if (!apiUrl) {
        toast.error(lang === 'fr' ? "Configuration API manquante" : "API configuration missing");
        return;
      }

      const response = await fetch(`${apiUrl}/api/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        refreshUser(); // Recharger les données utilisateur
        toast.success(lang === 'fr' ? "Profil mis à jour !" : "Profile updated!");
      } else {
        toast.error(data.message || (lang === 'fr' ? "Erreur lors de la mise à jour" : "Update error"));
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(lang === 'fr' ? "Erreur lors de la mise à jour" : "Update error");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {lang === 'fr' ? "Chargement..." : "Loading..."}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Email (lecture seule) */}
      <div className="space-y-2">
        <Label htmlFor="email">{lang === 'fr' ? "Email" : "Email"}</Label>
        <Input
          id="email"
          type="email"
          value={user.email}
          disabled
          className="bg-secondary/50"
        />
        <p className="text-xs text-muted-foreground">
          {lang === 'fr' ? "L'email ne peut pas être modifié" : "Email cannot be changed"}
        </p>
      </div>

      {/* Nom et Prénom */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">{lang === 'fr' ? "Prénom" : "First Name"} *</Label>
          <Input
            id="first_name"
            name="first_name"
            defaultValue={user.first_name || ""}
            required
            placeholder={lang === 'fr' ? "Votre prénom" : "Your first name"}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_name">{lang === 'fr' ? "Nom" : "Last Name"} *</Label>
          <Input
            id="last_name"
            name="last_name"
            defaultValue={user.last_name || ""}
            required
            placeholder={lang === 'fr' ? "Votre nom" : "Your last name"}
          />
        </div>
      </div>

      {/* Téléphone */}
      <div className="space-y-2">
        <Label htmlFor="phone">{lang === 'fr' ? "Téléphone" : "Phone"}</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={user.phone || ""}
          placeholder="+33 6 12 34 56 78"
        />
      </div>

      {/* Adresse */}
      <div className="space-y-2">
        <Label htmlFor="address">{lang === 'fr' ? "Adresse" : "Address"}</Label>
        <Input
          id="address"
          name="address"
          defaultValue={user.address || ""}
          placeholder={lang === 'fr' ? "123 Rue Example" : "123 Example Street"}
        />
      </div>

      {/* Ville et Code Postal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">{lang === 'fr' ? "Ville" : "City"}</Label>
          <Input
            id="city"
            name="city"
            defaultValue={user.city || ""}
            placeholder={lang === 'fr' ? "Paris" : "New York"}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="postal_code">{lang === 'fr' ? "Code Postal" : "Postal Code"}</Label>
          <Input
            id="postal_code"
            name="postal_code"
            defaultValue={user.postal_code || ""}
            placeholder="75001"
          />
        </div>
      </div>

      {/* Pays */}
      <div className="space-y-2">
        <Label htmlFor="country">{lang === 'fr' ? "Pays" : "Country"}</Label>
        <select
          id="country"
          name="country"
          defaultValue={user.country || "FR"}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">{lang === 'fr' ? 'Sélectionnez un pays' : 'Select a country'}</option>
          <option value="FR">🇫🇷 France</option>
          <option value="DE">🇩🇪 {lang === 'fr' ? 'Allemagne' : 'Germany'}</option>
          <option value="AT">🇦🇹 {lang === 'fr' ? 'Autriche' : 'Austria'}</option>
          <option value="BE">🇧🇪 {lang === 'fr' ? 'Belgique' : 'Belgium'}</option>
          <option value="BG">�� {lang === 'fr' ? 'Bulgarie' : 'Bulgaria'}</option>
          <option value="CY">🇨🇾 {lang === 'fr' ? 'Chypre' : 'Cyprus'}</option>
          <option value="HR">�� {lang === 'fr' ? 'Croatie' : 'Croatia'}</option>
          <option value="DK">🇩🇰 {lang === 'fr' ? 'Danemark' : 'Denmark'}</option>
          <option value="ES">�🇸 {lang === 'fr' ? 'Espagne' : 'Spain'}</option>
          <option value="EE">🇪🇪 {lang === 'fr' ? 'Estonie' : 'Estonia'}</option>
          <option value="FI">🇫🇮 {lang === 'fr' ? 'Finlande' : 'Finland'}</option>
          <option value="GR">🇬� {lang === 'fr' ? 'Grèce' : 'Greece'}</option>
          <option value="HU">🇭🇺 {lang === 'fr' ? 'Hongrie' : 'Hungary'}</option>
          <option value="IE">�🇪 {lang === 'fr' ? 'Irlande' : 'Ireland'}</option>
          <option value="IS">�🇸 {lang === 'fr' ? 'Islande' : 'Iceland'}</option>
          <option value="IT">🇮🇹 {lang === 'fr' ? 'Italie' : 'Italy'}</option>
          <option value="LV">�� {lang === 'fr' ? 'Lettonie' : 'Latvia'}</option>
          <option value="LT">🇱🇹 {lang === 'fr' ? 'Lituanie' : 'Lithuania'}</option>
          <option value="LU">🇱🇺 Luxembourg</option>
          <option value="MT">🇲� {lang === 'fr' ? 'Malte' : 'Malta'}</option>
          <option value="NO">�� {lang === 'fr' ? 'Norvège' : 'Norway'}</option>
          <option value="NL">🇳🇱 {lang === 'fr' ? 'Pays-Bas' : 'Netherlands'}</option>
          <option value="PL">�� {lang === 'fr' ? 'Pologne' : 'Poland'}</option>
          <option value="PT">🇵🇹 Portugal</option>
          <option value="CZ">�🇿 {lang === 'fr' ? 'République Tchèque' : 'Czech Republic'}</option>
          <option value="RO">�� {lang === 'fr' ? 'Roumanie' : 'Romania'}</option>
          <option value="GB">�� {lang === 'fr' ? 'Royaume-Uni' : 'United Kingdom'}</option>
          <option value="SK">�� {lang === 'fr' ? 'Slovaquie' : 'Slovakia'}</option>
          <option value="SI">�� {lang === 'fr' ? 'Slovénie' : 'Slovenia'}</option>
          <option value="SE">🇸🇪 {lang === 'fr' ? 'Suède' : 'Sweden'}</option>
          <option value="CH">🇨🇭 Suisse / Switzerland</option>
        </select>
      </div>

      <Button type="submit" disabled={loading} className="w-full md:w-auto">
        {loading
          ? lang === 'fr' ? "Enregistrement..." : "Saving..."
          : lang === 'fr' ? "Sauvegarder les modifications" : "Save Changes"}
      </Button>
    </form>
  );
}
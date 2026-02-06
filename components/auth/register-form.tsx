"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, CheckCircle, AlertCircle, Eye, EyeOff, Phone, MapPin, Home, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { register as registerUser } from "@/lib/api/auth";
import { useAuth } from "@/components/auth/auth-context";

interface RegisterFormProps {
  lang: string;
  dict: any;
}

export default function RegisterForm({ lang, dict }: RegisterFormProps) {
  const { refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postal_code: "",
    country: "",
    password: "",
    password_confirmation: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    // Validation côté client
    if (formData.password.length < 8) {
      setErrorMessage(dict.auth.passwordTooShort);
      setSubmitStatus("error");
      setIsSubmitting(false);
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      setErrorMessage(dict.auth.passwordMismatch);
      setSubmitStatus("error");
      setIsSubmitting(false);
      return;
    }

    try {
      const data = await registerUser({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postal_code: formData.postal_code,
        country: formData.country,
      });

      // Rafraîchir le context d'authentification
      refreshUser();

      setSubmitStatus("success");
      setFormData({ 
        first_name: "", 
        last_name: "", 
        email: "", 
        phone: "",
        address: "",
        city: "",
        postal_code: "",
        country: "",
        password: "", 
        password_confirmation: "" 
      });
      
      // Redirection après 1.5 secondes
      setTimeout(() => {
        router.push(`/${lang}/orders`);
      }, 1500);
    } catch (error: any) {
      setSubmitStatus("error");
      setErrorMessage(error.message || dict.auth.errorRegistering);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
      {/* Info Section */}
      <div className="space-y-8">
        <div>
          <h2 className="font-serif text-2xl lg:text-3xl text-foreground mb-4">
            {dict.auth.registerSubtitle}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {dict.auth.registerDescription}
          </p>
        </div>

        {/* Benefits */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neon-cyan/10 mt-1">
              <CheckCircle className="h-4 w-4 text-neon-cyan" />
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-1">{dict.auth.benefit1Title}</h3>
              <p className="text-sm text-muted-foreground">{dict.auth.benefit1Desc}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neon-cyan/10 mt-1">
              <CheckCircle className="h-4 w-4 text-neon-cyan" />
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-1">{dict.auth.benefit2Title}</h3>
              <p className="text-sm text-muted-foreground">{dict.auth.benefit2Desc}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neon-cyan/10 mt-1">
              <CheckCircle className="h-4 w-4 text-neon-cyan" />
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-1">{dict.auth.benefit3Title}</h3>
              <p className="text-sm text-muted-foreground">{dict.auth.benefit3Desc}</p>
            </div>
          </div>
        </div>

        {/* Already have account */}
        <div className="pt-4 border-t border-border">
          <p className="text-muted-foreground">
            {dict.auth.alreadyHaveAccount}{" "}
            <Link href={`/${lang}/login`} className="text-neon-cyan hover:underline font-medium">
              {dict.auth.loginHere}
            </Link>
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="rounded-xl bg-card p-6 lg:p-8 border border-border">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Success Message */}
          {submitStatus === "success" && (
            <div className="rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 p-4 flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-neon-cyan shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">{dict.auth.registerSuccess}</p>
            </div>
          )}

          {/* Error Message */}
          {submitStatus === "error" && errorMessage && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{errorMessage}</p>
            </div>
          )}

          {/* Error Message */}
          {submitStatus === "error" && errorMessage && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{errorMessage}</p>
            </div>
          )}

          {/* Personal Information Section */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-neon-cyan" />
              {dict.auth.personalInfo || "Informations Personnelles"}
            </h3>
            <div className="space-y-4">

          {/* First Name */}
          <div className="space-y-2">
            <Label htmlFor="first_name">
              {dict.auth.firstName} <span className="text-neon-cyan">*</span>
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="first_name"
                name="first_name"
                type="text"
                value={formData.first_name}
                onChange={handleChange}
                placeholder={dict.auth.firstNamePlaceholder}
                className="pl-10"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <Label htmlFor="last_name">
              {dict.auth.lastName} <span className="text-neon-cyan">*</span>
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="last_name"
                name="last_name"
                type="text"
                value={formData.last_name}
                onChange={handleChange}
                placeholder={dict.auth.lastNamePlaceholder}
                className="pl-10"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">
              {dict.auth.email} <span className="text-neon-cyan">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={dict.auth.emailPlaceholder}
                className="pl-10"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>
            </div>
          </div>

          {/* Shipping Address Section */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2 border-t border-border pt-6">
              <MapPin className="h-5 w-5 text-neon-cyan" />
              {dict.auth.shippingInfo || "Adresse de Livraison"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {dict.auth.shippingInfoDesc || "Ces informations sont optionnelles mais recommandées pour faciliter vos futures commandes."}
            </p>
            <div className="space-y-4">

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">
              {dict.checkout.phone} <span className="text-muted-foreground text-xs">({dict.contact.optional})</span>
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+33 6 12 34 56 78"
                className="pl-10"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">
              {dict.checkout.address} <span className="text-muted-foreground text-xs">({dict.contact.optional})</span>
            </Label>
            <div className="relative">
              <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Rue de la Paix"
                className="pl-10"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* City and Postal Code Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="city">
                {dict.checkout.city} <span className="text-muted-foreground text-xs">({dict.contact.optional})</span>
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Paris"
                  className="pl-10"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Postal Code */}
            <div className="space-y-2">
              <Label htmlFor="postal_code">
                {dict.checkout.postalCode} <span className="text-muted-foreground text-xs">({dict.contact.optional})</span>
              </Label>
              <Input
                id="postal_code"
                name="postal_code"
                type="text"
                value={formData.postal_code}
                onChange={handleChange}
                placeholder="75001"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Country */}
          <div className="space-y-2">
            <Label htmlFor="country">
              {dict.checkout.country} <span className="text-muted-foreground text-xs">({dict.contact.optional})</span>
            </Label>
            <div className="relative">
              <Globe2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isSubmitting}
              >
                <option value="">{lang === 'fr' ? 'Sélectionnez un pays' : 'Select a country'}</option>
                <option value="FR">🇫🇷 France</option>
                <option value="DE">🇩🇪 {lang === 'fr' ? 'Allemagne' : 'Germany'}</option>
                <option value="AT">🇦🇹 {lang === 'fr' ? 'Autriche' : 'Austria'}</option>
                <option value="BE">🇧🇪 {lang === 'fr' ? 'Belgique' : 'Belgium'}</option>
                <option value="BG">🇧🇬 {lang === 'fr' ? 'Bulgarie' : 'Bulgaria'}</option>
                <option value="CY">🇨🇾 {lang === 'fr' ? 'Chypre' : 'Cyprus'}</option>
                <option value="HR">🇭🇷 {lang === 'fr' ? 'Croatie' : 'Croatia'}</option>
                <option value="DK">🇩🇰 {lang === 'fr' ? 'Danemark' : 'Denmark'}</option>
                <option value="ES">🇪🇸 {lang === 'fr' ? 'Espagne' : 'Spain'}</option>
                <option value="EE">🇪🇪 {lang === 'fr' ? 'Estonie' : 'Estonia'}</option>
                <option value="FI">🇫🇮 {lang === 'fr' ? 'Finlande' : 'Finland'}</option>
                <option value="GR">🇬🇷 {lang === 'fr' ? 'Grèce' : 'Greece'}</option>
                <option value="HU">🇭🇺 {lang === 'fr' ? 'Hongrie' : 'Hungary'}</option>
                <option value="IE">🇮🇪 {lang === 'fr' ? 'Irlande' : 'Ireland'}</option>
                <option value="IS">🇮🇸 {lang === 'fr' ? 'Islande' : 'Iceland'}</option>
                <option value="IT">🇮🇹 {lang === 'fr' ? 'Italie' : 'Italy'}</option>
                <option value="LV">🇱🇻 {lang === 'fr' ? 'Lettonie' : 'Latvia'}</option>
                <option value="LT">🇱🇹 {lang === 'fr' ? 'Lituanie' : 'Lithuania'}</option>
                <option value="LU">🇱🇺 Luxembourg</option>
                <option value="MT">🇲🇹 {lang === 'fr' ? 'Malte' : 'Malta'}</option>
                <option value="NO">🇳🇴 {lang === 'fr' ? 'Norvège' : 'Norway'}</option>
                <option value="NL">🇳🇱 {lang === 'fr' ? 'Pays-Bas' : 'Netherlands'}</option>
                <option value="PL">🇵🇱 {lang === 'fr' ? 'Pologne' : 'Poland'}</option>
                <option value="PT">🇵🇹 Portugal</option>
                <option value="CZ">🇨🇿 {lang === 'fr' ? 'République Tchèque' : 'Czech Republic'}</option>
                <option value="RO">🇷🇴 {lang === 'fr' ? 'Roumanie' : 'Romania'}</option>
                <option value="GB">🇬🇧 {lang === 'fr' ? 'Royaume-Uni' : 'United Kingdom'}</option>
                <option value="SK">🇸🇰 {lang === 'fr' ? 'Slovaquie' : 'Slovakia'}</option>
                <option value="SI">🇸🇮 {lang === 'fr' ? 'Slovénie' : 'Slovenia'}</option>
                <option value="SE">🇸🇪 {lang === 'fr' ? 'Suède' : 'Sweden'}</option>
                <option value="CH">🇨🇭 Suisse / Switzerland</option>
              </select>
            </div>
          </div>
            </div>
          </div>

          {/* Security Section */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2 border-t border-border pt-6">
              <Lock className="h-5 w-5 text-neon-cyan" />
              {dict.auth.securityInfo || "Sécurité du Compte"}
            </h3>
            <div className="space-y-4">

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">
              {dict.auth.password} <span className="text-neon-cyan">*</span>
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder={dict.auth.passwordPlaceholder}
                className="pl-10 pr-10"
                required
                disabled={isSubmitting}
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">{dict.auth.passwordHint}</p>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="password_confirmation">
              {dict.auth.confirmPassword} <span className="text-neon-cyan">*</span>
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password_confirmation"
                name="password_confirmation"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.password_confirmation}
                onChange={handleChange}
                placeholder={dict.auth.confirmPasswordPlaceholder}
                className="pl-10 pr-10"
                required
                disabled={isSubmitting}
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
            </div>
          </div>

          {/* Terms */}
          <div className="text-xs text-muted-foreground border-t border-border pt-6">
            {dict.auth.termsText}{" "}
            <Link href={`/${lang}/terms`} className="text-neon-cyan hover:underline">
              {dict.auth.termsLink}
            </Link>{" "}
            {dict.auth.and}{" "}
            <Link href={`/${lang}/privacy`} className="text-neon-cyan hover:underline">
              {dict.auth.privacyLink}
            </Link>
            .
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "w-full bg-foreground text-background hover:bg-neon-cyan transition-all",
              isSubmitting && "opacity-50 cursor-not-allowed"
            )}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                {dict.auth.registering}
              </span>
            ) : (
              dict.auth.createAccount
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

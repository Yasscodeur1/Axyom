"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, CreditCard, ShieldCheck, Truck, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/components/cart/cart-context";
import { useAuth } from "@/components/auth/auth-context";
import { OrderBump } from "@/components/checkout/order-bump";
import { SUBSCRIPTION_PRICE, FREE_SHIPPING_THRESHOLD } from "@/lib/types";
import { cn } from "@/lib/utils";

type CheckoutStep = "information" | "payment" | "confirmation";

interface CheckoutFormProps {
  lang: string;
  dict: any;
}

export function CheckoutForm({ lang, dict }: CheckoutFormProps) {
  const router = useRouter();
  const { items, subtotal, shippingCost, total, isSubscriber, hasFreeShipping, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState<CheckoutStep>("information");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  

  // Form state - pré-rempli avec les données utilisateur si connecté
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "FR",
    phone: "",
  });

  // Pré-remplir le formulaire avec les données de l'utilisateur connecté
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData({
        email: user.email || "",
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        address: user.address || "",
        city: user.city || "",
        postalCode: user.postal_code || "",
        country: user.country || "FR",
        phone: user.phone || "",
      });
    }
  }, [isAuthenticated, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
  };

  // Fonction pour envoyer la commande à Laravel et obtenir l'URL Stripe
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Préparer les données pour Laravel
    const payload = {
      customer: {
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone || null,
        address: formData.address,
        city: formData.city,
        postal_code: formData.postalCode,
        country: formData.country,
      },
      order: {
        items: items.map(item => ({
          product_id: item.product.id,
          product_name: item.product.name,
          product_slug: item.product.slug,
          price: item.product.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          image: item.product.images[0] || null,
        })),
        subtotal: subtotal,
        shipping_cost: shippingCost,
        total: total,
        is_subscriber: isSubscriber,
        subscription_fee: isSubscriber ? SUBSCRIPTION_PRICE : 0,
        grand_total: total + (isSubscriber ? SUBSCRIPTION_PRICE : 0),
        currency: "EUR",
        language: lang,
      }
    };

    try {
      // Vérifier que l'API URL est configurée
      const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
      if (!apiUrl) {
        alert("❌ Erreur de configuration : L'API Laravel n'est pas accessible.\n\nVeuillez démarrer votre serveur Laravel ou configurer NEXT_PUBLIC_API_URL dans .env.local");
        setIsProcessing(false);
        return;
      }

      console.log("🔍 Checkout API URL:", apiUrl);
      console.log("📦 Payload envoyé:", JSON.stringify(payload, null, 2));

      // Appel vers votre API Laravel
      const response = await fetch(`${apiUrl}/api/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      console.log("📥 Réponse Laravel:", data);

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la création de la commande");
      }

      // Si Laravel retourne une URL de paiement Stripe, rediriger
      if (data.checkout_url) {
        console.log("🔗 URL Stripe reçue:", data.checkout_url);
        
        // Valider que l'URL est bien une URL Stripe valide
        if (!data.checkout_url.startsWith('http://') && !data.checkout_url.startsWith('https://')) {
          throw new Error(`URL de paiement invalide: ${data.checkout_url}`);
        }

        try {
          // Valider que c'est une URL bien formée
          new URL(data.checkout_url);
          console.log("✅ Redirection vers Stripe...");
          window.location.href = data.checkout_url;
        } catch (urlError) {
          console.error("❌ URL malformée:", data.checkout_url);
          throw new Error(`L'URL de paiement est invalide: ${data.checkout_url}`);
        }
      } 
      // Sinon, afficher la confirmation (pour test)
      else if (data.order_number) {
        setOrderNumber(data.order_number);
        setStep("confirmation");
        clearCart();
      }

    } catch (error) {
      console.error("Erreur de paiement:", error);
      alert(error instanceof Error ? error.message : "Une erreur est survenue lors du paiement");
    } finally {
      setIsProcessing(false);
    }
  };

  // 2. Utilise useEffect pour la redirection
  useEffect(() => {
    console.log("🛒 Checkout - Items dans le panier:", items.length);
    console.log("📦 Items:", items);
    console.log("📍 Step actuel:", step);
    
    if (items.length === 0 && step !== "confirmation") {
      console.log("⚠️ Panier vide détecté - Redirection vers /cart");
      router.push(`/${lang}/cart`);
    }
  }, [items, step, router, lang]); 

  // 3. Affiche un "loader" ou rien pendant la redirection
  if (items.length === 0 && step !== "confirmation") {
    return <div className="py-20 text-center">Redirecting...</div>;
  }

  if (step === "confirmation") {
    return (
      <div className="max-w-lg mx-auto py-16 text-center">
        <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-neon-cyan/10">
          <Check className="h-10 w-10 text-neon-cyan" />
        </div>
        <h1 className="mt-6 font-serif text-3xl text-foreground">
          {dict.checkout?.orderConfirmed || "Order Confirmed"}
        </h1>
        <p className="mt-4 text-muted-foreground">
          {dict.checkout?.thankYou || "Thank you for your order! We have sent a confirmation email to"} {formData.email}.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {dict.checkout?.orderNumber || "Order number"}: #{orderNumber || Date.now().toString(36).toUpperCase()}
        </p>
        <Button asChild className="mt-8">
          <Link href={`/${lang}/products`}>{dict.cart?.continueShoppingButton || "Continue Shopping"}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
      {/* Form Section */}
      <div className="order-2 lg:order-1">
        <Link
          href={`/${lang}/cart`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {dict.checkout?.backToCart || "Back to cart"}
        </Link>

        {/* Step Indicator */}
        <div className="flex items-center gap-3 mb-8">
          <span
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
              step === "information"
                ? "bg-foreground text-background"
                : "bg-neon-cyan text-background"
            )}
          >
            {step === "information" ? "1" : <Check className="h-4 w-4" />}
          </span>
          <span className="h-px flex-1 bg-border" />
          <span
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
              step === "payment"
                ? "bg-foreground text-background"
                : "bg-secondary text-muted-foreground"
            )}
          >
            2
          </span>
        </div>

        {step === "information" && (
          <form onSubmit={handleContinueToPayment} className="space-y-6">
            <h2 className="font-serif text-2xl text-foreground">
              {dict.checkout?.contactAndShipping || "Contact & Shipping"}
            </h2>

            {/* Message si utilisateur connecté */}
            {isAuthenticated && user && (
              <div className="rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 p-4 flex items-start gap-3">
                <Check className="h-5 w-5 text-neon-cyan shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-foreground font-medium">
                    {lang === 'fr' ? 'Informations pré-remplies' : 'Pre-filled information'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {lang === 'fr' 
                      ? 'Vos informations de compte ont été automatiquement remplies. Vous pouvez les modifier si nécessaire.' 
                      : 'Your account information has been automatically filled. You can modify it if needed.'}
                  </p>
                </div>
              </div>
            )}

            {/* Contact */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">{dict.checkout?.email || "Email"}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  className="mt-1.5"
                  disabled={isAuthenticated && !!user?.email}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">{dict.checkout?.firstName || "First Name"}</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">{dict.checkout?.lastName || "Last Name"}</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">{dict.checkout?.address || "Address"}</Label>
                <Input
                  id="address"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  className="mt-1.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">{dict.checkout?.city || "City"}</Label>
                  <Input
                    id="city"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">{dict.checkout?.zipCode || "Postal Code"}</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    required
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="country">{dict.checkout?.country || "Country"}</Label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
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

              <div>
                <Label htmlFor="phone">
                  {dict.checkout?.phone || "Phone"} ({dict.contact?.optional || "optional"})
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-1.5"
                />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full h-14 text-base font-medium bg-foreground text-background hover:bg-neon-cyan transition-all"
            >
              {dict.checkout?.continueToPayment || "Continue to Payment"}
            </Button>
          </form>
        )}

        {step === "payment" && (
          <form onSubmit={handlePlaceOrder} className="space-y-6">
            <h2 className="font-serif text-2xl text-foreground">
              {dict.checkout?.payment || "Payment"}
            </h2>

            <div className="rounded-xl border border-neon-cyan/30 bg-neon-cyan/5 p-5">
              <p className="text-sm text-foreground mb-2 font-medium">
                {dict.checkout?.securePayment || "Secure Payment with Stripe"}
              </p>
              <p className="text-xs text-muted-foreground">
                {dict.checkout?.paymentInfo || "You will be redirected to Stripe to complete your payment securely."}
              </p>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-6 py-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5" />
                {dict.cart?.sslEncrypted || "SSL Secured"}
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                256-bit Encryption
              </span>
            </div>

            {/* Order Bump - Offre irrésistible */}
            <div className="mb-6">
              <OrderBump lang={lang} dict={dict} />
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => setStep("information")}
                className="h-14"
              >
                {dict.common?.back || "Back"}
              </Button>
              <Button
                type="submit"
                size="lg"
                disabled={isProcessing}
                className="flex-1 h-14 text-base font-medium bg-foreground text-background hover:bg-neon-cyan transition-all"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    {dict.common?.loading || "Processing..."}
                  </span>
                ) : (
                  <>
                    {dict.checkout?.pay || "Pay"} {(total + (isSubscriber ? SUBSCRIPTION_PRICE : 0)).toFixed(2)} EUR
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Order Summary */}
      <div className="order-1 lg:order-2">
        <div className="lg:sticky lg:top-28 rounded-xl bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            {dict.cart?.summary || "Order Summary"}
          </h2>

          {/* Items */}
          <div className="space-y-4 max-h-75 overflow-y-auto">
            {items.map((item) => (
              <div
                key={`${item.product.id}-${item.size}-${item.color}`}
                className="flex gap-3"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={item.product.images[0] || "/placeholder.svg"}
                    alt={item.product.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-xs font-medium text-background">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground line-clamp-1">{item.product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.size} / {item.color}
                  </p>
                </div>
                <span className="text-sm font-medium text-foreground">
                  {(item.product.price * item.quantity).toFixed(2)} EUR
                </span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-6 space-y-3 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{dict.cart?.subtotal || "Subtotal"}</span>
              <span className="text-foreground">{subtotal.toFixed(2)} EUR</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{dict.cart?.shipping || "Shipping"}</span>
              <span className={cn(hasFreeShipping && "text-neon-cyan")}>
                {hasFreeShipping ? (dict.cart?.free || "Free") : `${shippingCost.toFixed(2)} EUR`}
              </span>
            </div>
            {isSubscriber && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">{dict.cart?.membership || "AXYOM Membership"}</span>
                <span className="text-foreground">{SUBSCRIPTION_PRICE.toFixed(2)} EUR</span>
              </div>
            )}
            <div className="border-t border-border pt-3">
              <div className="flex justify-between text-base font-semibold">
                <span className="text-foreground">{dict.cart?.total || "Total"}</span>
                <span className="text-foreground">
                  {(total + (isSubscriber ? SUBSCRIPTION_PRICE : 0)).toFixed(2)} EUR
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="mt-6 flex items-center gap-2 rounded-lg bg-secondary p-3 text-xs text-muted-foreground">
            <Truck className="h-4 w-4 text-neon-cyan shrink-0" />
            <span>
              {hasFreeShipping
                ? (dict.checkout?.freeDeliveryQualified || "Your order qualifies for free delivery")
                : `${dict.checkout?.addMoreForFreeDelivery || "Add"} ${(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)} EUR ${dict.checkout?.moreForFreeDelivery || "more for free delivery"}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

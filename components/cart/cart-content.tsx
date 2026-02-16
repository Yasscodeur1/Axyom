"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, Sparkles, ArrowRight, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "./cart-context";
import { FREE_SHIPPING_THRESHOLD, SUBSCRIPTION_PRICE } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CartContentProps {
  lang: string;
  dict: any;
}

export function CartContent({ lang, dict }: CartContentProps) {
  // Debug: Vérifier que lang est bien reçu
  console.log("🔍 CartContent - Lang reçu:", lang, "| Type:", typeof lang);
  
  const {
    items,
    isSubscriber,
    removeItem,
    updateQuantity,
    toggleSubscription,
    subtotal,
    shippingCost,
    total,
    amountUntilFreeShipping,
    hasFreeShipping,
    validateStocks,
  } = useCart();

  const [isCheckingStocks, setIsCheckingStocks] = useState(false);
  const [stockCheckFailed, setStockCheckFailed] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [stockError, setStockError] = useState<string | null>(null);
  const router = useRouter();

  // Vérifier les stocks au montage du composant
  useEffect(() => {
    const checkStocks = async () => {
      if (items.length === 0) return;

      setIsCheckingStocks(true);
      setStockCheckFailed(false);

      try {
        // TOUJOURS utiliser l'API Next.js locale pour la vérification de stock
        const apiUrl = '/api/products/check-stocks';

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: items.map(item => ({
              id: item.product.id,
              qty: item.quantity
            }))
          })
        });

        const data = await response.json();

        if (!data.success || !response.ok) {
          // Afficher toast d'erreur
          toast.error(
            lang === 'fr' 
              ? '⚠️ Impossible de vérifier les stocks. Veuillez réessayer.' 
              : '⚠️ Unable to verify stock levels. Please try again.'
          );
          setStockCheckFailed(true);
          return;
        }

        // Vérifier si des quantités ont été ajustées
        let hasAdjustments = false;
        items.forEach(item => {
          const availableStock = data.availableStocks?.[item.product.id];
          if (availableStock !== undefined && availableStock < item.quantity) {
            hasAdjustments = true;
            // Mettre à jour automatiquement la quantité
            updateQuantity(item.product.id, item.size, item.color, availableStock);
          }
        });

        if (hasAdjustments) {
          toast.warning(
            lang === 'fr'
              ? '📦 Certains articles ont été ajustés selon la disponibilité.'
              : '📦 Some items have been adjusted based on availability.'
          );
        }

      } catch (error) {
        console.error('Erreur lors de la vérification des stocks:', error);
        toast.error(
          lang === 'fr'
            ? '❌ Erreur de connexion au serveur. Veuillez réessayer.'
            : '❌ Server connection error. Please try again.'
        );
        setStockCheckFailed(true);
      } finally {
        setIsCheckingStocks(false);
      }
    };

    checkStocks();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handler pour le bouton checkout avec vérification des stocks
  const handleCheckout = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsChecking(true);
    setStockError(null);

    console.log("🚀 Début checkout - Items:", items.length);
    console.log("🔍 Lang:", lang, "| Type:", typeof lang);

    try {
      // TOUJOURS utiliser l'API Next.js locale pour la vérification de stock
      // (Laravel n'a pas cette route, c'est une vérification côté frontend)
      const apiUrl = '/api/products/check-stocks';

      console.log("📡 API URL (stock check):", apiUrl);

      const payload = {
        items: items.map((item) => ({
          id: item.product.id,
          quantity: item.quantity,
        })),
      };

      console.log("📦 Payload:", JSON.stringify(payload, null, 2));

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.product.id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!data.success) {
        // Si le stock est insuffisant
        if (data.outOfStock && data.outOfStock.length > 0) {
          const names = data.outOfStock.map((p: any) => p.name).join(", ");
          setStockError(`${dict.cart.stockError || 'Stock insuffisant pour'}: ${names}`);
          
          // Mise à jour automatique des quantités dans le panier
          data.outOfStock.forEach((p: any) => {
            const item = items.find(i => i.product.id === p.id);
            if (item) {
              updateQuantity(p.id, item.size, item.color, p.available);
            }
          });

          toast.warning(
            lang === 'fr'
              ? '⚠️ Les quantités ont été ajustées selon le stock disponible.'
              : '⚠️ Quantities have been adjusted based on available stock.'
          );
        } else {
          setStockError(
            lang === 'fr' 
              ? '⚠️ Impossible de vérifier les stocks. Veuillez réessayer.'
              : '⚠️ Unable to verify stock levels. Please try again.'
          );
        }
        
        setIsChecking(false);
        return;
      }

      // Si le stock est OK, on redirige vers la page de paiement
      // Sécuriser la redirection
      const targetLang = lang || 'fr'; // Fallback si lang est undefined
      const targetUrl = `/${targetLang}/checkout`;
      const sanitizedUrl = targetUrl.replace(/\/+/g, '/'); // Supprime les doubles slashs
      
      console.log("✅ Stock OK - Navigation vers:", sanitizedUrl, "| Lang:", targetLang);
      
      // Utiliser router.push pour préserver le state du Context
      router.push(sanitizedUrl);
    } catch (error) {
      console.error("Erreur de vérification:", error);
      setStockError(dict.cart.errorOccurred || "Une erreur est survenue.");
      toast.error(
        lang === 'fr'
          ? '❌ Erreur de connexion au serveur.'
          : '❌ Server connection error.'
      );
      setIsChecking(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="mt-6 text-xl font-medium text-foreground">{dict.cart.empty}</h2>
        <p className="mt-2 text-muted-foreground">
          {dict.cart.emptyDescription}
        </p>
        <Button asChild className="mt-8">
          <Link href={`/${lang}/products`}>
            {dict.cart.startShopping}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    );
  }

  const progressPercentage = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  return (
    <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
      {/* Cart Items */}
      <div className="lg:col-span-2">
        {/* Free Shipping Progress */}
        {!isSubscriber && (
          <div className="mb-8 rounded-xl bg-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <Truck className="h-5 w-5 text-neon-cyan" />
              <span className="text-sm font-medium text-foreground">
                {hasFreeShipping
                  ? dict.cart.freeShippingUnlocked
                  : dict.cart.freeShippingProgress.replace('{amount}', amountUntilFreeShipping.toFixed(2))}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full bg-neon-cyan transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {dict.cart.freeDeliveryThreshold.replace('{threshold}', FREE_SHIPPING_THRESHOLD)}
            </p>
          </div>
        )}

        {/* Items List */}
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={`${item.product.id}-${item.size}-${item.color}`}
              className="flex gap-4 rounded-xl bg-card p-4 lg:p-5"
            >
              <Link
                href={`/${lang}/products/${item.product.slug}`}
                className="relative aspect-square w-24 lg:w-32 shrink-0 overflow-hidden rounded-lg"
              >
                <Image
                  src={item.product.images[0] || "/placeholder.svg"}
                  alt={item.product.name}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
                {item.product.stock === 0 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white text-xs font-bold uppercase tracking-wider">
                      {dict.cart.outOfStock}
                    </span>
                  </div>
                )}
              </Link>

              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link
                      href={`/${lang}/products/${item.product.slug}`}
                      className="font-medium text-foreground hover:text-neon-cyan transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    <div className="mt-1 flex flex-wrap gap-2 text-sm text-muted-foreground">
                      <span>{dict.cart.size}: {item.size}</span>
                      <span>|</span>
                      <span>{dict.cart.color}: {item.color}</span>
                      {item.product.stock !== undefined && (
                        <>
                          <span>|</span>
                          <span className={cn(
                            item.product.stock <= 5 && "text-orange-500 font-medium"
                          )}>
                            {item.product.stock <= 5 
                              ? `${lang === 'fr' ? 'Plus que' : 'Only'} ${item.product.stock} ${lang === 'fr' ? 'en stock' : 'left'}` 
                              : `${item.product.stock} ${lang === 'fr' ? 'en stock' : 'in stock'}`
                            }
                          </span>
                        </>
                      )}
                    </div>
                    {item.product.stock !== undefined && item.product.stock <= 5 && item.product.stock > 0 && (
                      <p className="mt-1 text-xs font-medium text-orange-500 flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        {dict.cart.onlyLeft.replace('{count}', item.product.stock.toString())}
                      </p>
                    )}
                    {item.product.stock !== undefined && item.product.stock === 0 && (
                      <p className="mt-1 text-xs font-medium text-destructive">
                        {dict.cart.outOfStock}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.product.id, item.size, item.color)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    aria-label={dict.cart.remove}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-auto pt-4 flex items-center justify-between">
                  <div className="flex items-center rounded-lg border border-border">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)
                      }
                      className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium text-foreground">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      disabled={item.product.stock !== undefined && item.quantity >= item.product.stock}
                      onClick={() =>
                        updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)
                      }
                      className={cn(
                        "flex h-8 w-8 items-center justify-center transition-colors",
                        item.product.stock !== undefined && item.quantity >= item.product.stock
                          ? "text-muted-foreground/30 cursor-not-allowed"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <span className="font-semibold text-foreground">
                    {(item.product.price * item.quantity).toFixed(2)} EUR
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="sticky top-28 rounded-xl bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">{dict.cart.summary}</h2>

          {/* Subscription Toggle */}
          <div className="mt-6">
            <button
              type="button"
              onClick={toggleSubscription}
              className={cn(
                "w-full rounded-xl border p-4 text-left transition-all",
                isSubscriber
                  ? "border-neon-cyan bg-neon-cyan/10"
                  : "border-border hover:border-neon-cyan/50"
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border mt-0.5",
                    isSubscriber
                      ? "border-neon-cyan bg-neon-cyan"
                      : "border-muted-foreground"
                  )}
                >
                  {isSubscriber && (
                    <span className="h-2 w-2 rounded-full bg-background" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-neon-cyan" />
                    <span className="font-medium text-foreground">{dict.cart.membership}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {dict.cart.membershipDescription.replace('{price}', SUBSCRIPTION_PRICE.toFixed(2))}
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Summary Lines */}
          <div className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{dict.cart.subtotal}</span>
              <span className="text-foreground">{subtotal.toFixed(2)} EUR</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{dict.cart.shipping}</span>
              <span className={cn(hasFreeShipping && "text-neon-cyan")}>
                {hasFreeShipping ? dict.cart.free : `${shippingCost.toFixed(2)} EUR`}
              </span>
            </div>
            {isSubscriber && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">{dict.cart.membershipMonthly}</span>
                <span className="text-foreground">{SUBSCRIPTION_PRICE.toFixed(2)} EUR</span>
              </div>
            )}
            <div className="border-t border-border pt-3">
              <div className="flex justify-between text-base font-semibold">
                <span className="text-foreground">{dict.cart.total}</span>
                <span className="text-foreground">
                  {(total + (isSubscriber ? SUBSCRIPTION_PRICE : 0)).toFixed(2)} EUR
                </span>
              </div>
            </div>
          </div>

          {/* Checkout Button Section */}
          <div className="space-y-4 mt-6">
            {/* Message d'erreur si erreur de vérification initiale */}
            {stockCheckFailed && (
              <div className="p-3 bg-destructive/10 border border-destructive rounded-lg">
                <p className="text-xs text-destructive text-center">
                  {lang === 'fr' 
                    ? '⚠️ Impossible de vérifier les stocks. Le paiement est temporairement désactivé.'
                    : '⚠️ Unable to verify stocks. Checkout is temporarily disabled.'
                  }
                </p>
              </div>
            )}
            
            {/* Message d'erreur si produits en rupture */}
            {items.some(item => item.product.stock === 0) && (
              <div className="p-3 bg-destructive/10 border border-destructive rounded-lg">
                <p className="text-xs text-destructive text-center">
                  {lang === 'fr'
                    ? '⚠️ Certains articles sont en rupture de stock. Veuillez les retirer.'
                    : '⚠️ Some items are out of stock. Please remove them.'
                  }
                </p>
              </div>
            )}

            {/* Message d'erreur dynamique lors du checkout */}
            {stockError && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium animate-in fade-in slide-in-from-top-1">
                <div className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  {stockError}
                </div>
              </div>
            )}

            <Button
              onClick={handleCheckout}
              disabled={isCheckingStocks || isChecking || stockCheckFailed || items.some(item => item.product.stock === 0)}
              size="lg"
              className={cn(
                "w-full h-14 text-base font-medium transition-all",
                isCheckingStocks || isChecking || stockCheckFailed || items.some(item => item.product.stock === 0)
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-foreground text-background hover:bg-neon-cyan"
              )}
            >
              {isCheckingStocks ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  {lang === 'fr' ? 'Vérification initiale...' : 'Initial checking...'}
                </span>
              ) : isChecking ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {dict.cart.checkingStocks || (lang === 'fr' ? 'Vérification...' : 'Checking...')}
                </span>
              ) : stockCheckFailed || items.some(item => item.product.stock === 0) ? (
                <span>
                  {lang === 'fr' ? 'Paiement indisponible' : 'Checkout unavailable'}
                </span>
              ) : (
                <>
                  {dict.cart.checkout}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span>{dict.cart.secureCheckout}</span>
            <span>|</span>
            <span>{dict.cart.sslEncrypted}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

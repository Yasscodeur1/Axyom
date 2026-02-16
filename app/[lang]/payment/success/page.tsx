"use client";

import { use, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { useCart } from "@/components/cart/cart-context";
import { Button } from "@/components/ui/button";

interface PaymentSuccessPageProps {
  params: Promise<{ lang: string }>;
}

export default function PaymentSuccessPage({ params }: PaymentSuccessPageProps) {
  const { lang } = use(params);
  const searchParams = useSearchParams();
  const session_id = searchParams.get("session_id");
  const order_number = searchParams.get("order_number") || searchParams.get("order_id");
  const { clearCart } = useCart();

  // Vider le panier dès que la page de succès est chargée
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        {/* Icône de succès */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-neon-cyan/10 mb-6">
          <CheckCircle className="w-12 h-12 text-neon-cyan" />
        </div>
        
        <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">
          {lang === 'fr' ? 'Paiement Réussi !' : 'Payment Successful!'}
        </h1>
        
        <p className="text-lg text-muted-foreground mb-8 max-w-md">
          {lang === 'fr' 
            ? 'Merci pour votre commande. Votre paiement a été traité avec succès.'
            : 'Thank you for your order. Your payment has been processed successfully.'}
        </p>

        {/* Numéro de commande */}
        {order_number && (
          <div className="bg-secondary/30 border border-border rounded-lg p-6 mb-8 max-w-md w-full">
            <p className="text-sm text-muted-foreground mb-2">
              {lang === 'fr' ? 'Numéro de commande' : 'Order Number'}
            </p>
            <p className="text-2xl font-mono font-bold text-foreground">
              #{order_number}
            </p>
          </div>
        )}

        {/* Session Stripe (si pas de numéro de commande) */}
        {session_id && !order_number && (
          <div className="bg-secondary/30 border border-border rounded-lg p-6 mb-8 max-w-md w-full">
            <p className="text-sm text-muted-foreground mb-2">
              {lang === 'fr' ? 'ID de session' : 'Session ID'}
            </p>
            <p className="text-sm font-mono text-foreground break-all">
              {session_id}
            </p>
          </div>
        )}

        {/* Informations */}
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-6 mb-8 max-w-md w-full">
          <Package className="w-8 h-8 text-blue-600 mx-auto mb-3" />
          <h2 className="font-semibold text-lg text-foreground mb-2">
            {lang === 'fr' ? 'Et maintenant ?' : 'What\'s Next?'}
          </h2>
          <p className="text-muted-foreground text-sm">
            {lang === 'fr' 
              ? 'Vous recevrez un email de confirmation avec les détails de votre commande et le suivi de livraison.'
              : 'You will receive a confirmation email with your order details and tracking information.'}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" variant="outline">
            <Link href={`/${lang}`}>
              {lang === 'fr' ? 'Retour à l\'accueil' : 'Back to Home'}
            </Link>
          </Button>
          
          <Button asChild size="lg" className="bg-foreground text-background hover:bg-neon-cyan">
            <Link href={`/${lang}/products`}>
              {lang === 'fr' ? 'Continuer le shopping' : 'Continue Shopping'}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}

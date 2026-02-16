import type { Metadata } from "next";
import Link from "next/link";
import { XCircle, ArrowLeft, ShoppingCart } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { getDictionary } from "@/lib/get-dictionary";
import { Button } from "@/components/ui/button";

interface PaymentCancelPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: PaymentCancelPageProps): Promise<Metadata> {
  const { lang } = await params;
  const titles = {
    en: "Payment Cancelled",
    fr: "Paiement Annulé",
  };
  const descriptions = {
    en: "Your payment was cancelled.",
    fr: "Votre paiement a été annulé.",
  };

  return {
    title: titles[lang as 'en' | 'fr'] || titles.en,
    description: descriptions[lang as 'en' | 'fr'] || descriptions.en,
  };
}

export default async function PaymentCancelPage({ params }: PaymentCancelPageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'fr');

  return (
    <>
      <Header lang={lang} dict={dict} />
      <main className="pt-24 pb-16 min-h-screen">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          {/* Icône d'annulation */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-100 mb-6">
              <XCircle className="w-12 h-12 text-orange-600" />
            </div>
            
            <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">
              {lang === 'fr' ? 'Paiement Annulé' : 'Payment Cancelled'}
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8">
              {lang === 'fr' 
                ? 'Votre paiement a été annulé. Aucun montant n\'a été débité.'
                : 'Your payment was cancelled. No charges were made.'}
            </p>

            {/* Informations */}
            <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900 rounded-lg p-6 mb-8">
              <ShoppingCart className="w-8 h-8 text-orange-600 mx-auto mb-3" />
              <h2 className="font-semibold text-lg text-foreground mb-2">
                {lang === 'fr' ? 'Vos articles sont toujours dans votre panier' : 'Your items are still in your cart'}
              </h2>
              <p className="text-muted-foreground text-sm">
                {lang === 'fr' 
                  ? 'Vous pouvez retourner à votre panier et réessayer quand vous êtes prêt.'
                  : 'You can return to your cart and try again when you\'re ready.'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="outline">
                <Link href={`/${lang}`}>
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  {lang === 'fr' ? 'Retour à l\'accueil' : 'Back to Home'}
                </Link>
              </Button>
              
              <Button asChild size="lg">
                <Link href={`/${lang}/cart`}>
                  <ShoppingCart className="mr-2 w-4 h-4" />
                  {lang === 'fr' ? 'Voir mon panier' : 'View Cart'}
                </Link>
              </Button>
            </div>

            {/* Aide */}
            <div className="mt-12 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground">
                {lang === 'fr' 
                  ? 'Besoin d\'aide ? Contactez notre service client.'
                  : 'Need help? Contact our customer service.'}
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer lang={lang} dict={dict} />
      <MobileNav lang={lang} dict={dict} />
    </>
  );
}

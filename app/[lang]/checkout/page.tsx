import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { getDictionary } from "@/lib/get-dictionary";

interface CheckoutPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: CheckoutPageProps): Promise<Metadata> {
  const { lang } = await params;
  const titles = {
    en: "Checkout",
    fr: "Paiement",
  };
  const descriptions = {
    en: "Complete your purchase securely.",
    fr: "Finalisez votre achat en toute sécurité.",
  };

  return {
    title: titles[lang as 'en' | 'fr'] || titles.en,
    description: descriptions[lang as 'en' | 'fr'] || descriptions.en,
  };
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'fr');

  return (
    <>
      <Header lang={lang} dict={dict} />
      <main className="pt-24 pb-8 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <CheckoutForm lang={lang} dict={dict} />
        </div>
      </main>
      <Footer lang={lang} dict={dict} />
      <MobileNav lang={lang} dict={dict} />
    </>
  );
}

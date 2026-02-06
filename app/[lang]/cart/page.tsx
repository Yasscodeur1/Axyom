import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Footer } from "@/components/layout/footer";
import { CartContent } from "@/components/cart/cart-content";
import { getDictionary } from "@/lib/get-dictionary";

interface CartPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: CartPageProps): Promise<Metadata> {
  const { lang } = await params;
  const titles = {
    en: "Shopping Cart",
    fr: "Panier d'Achat",
  };
  const descriptions = {
    en: "Review your cart and proceed to checkout.",
    fr: "Consultez votre panier et procédez au paiement.",
  };

  return {
    title: titles[lang as 'en' | 'fr'] || titles.en,
    description: descriptions[lang as 'en' | 'fr'] || descriptions.en,
  };
}

export default async function CartPage({ params }: CartPageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'fr');

  return (
    <>
      <Header lang={lang} dict={dict} />
      <main className="pt-24 pb-24 lg:pb-8">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h1 className="font-serif text-3xl lg:text-4xl text-foreground mb-8">{dict.cart.title}</h1>
          <CartContent lang={lang} dict={dict} />
        </div>
      </main>
      <Footer lang={lang} dict={dict} />
      <MobileNav lang={lang} dict={dict} />
    </>
  );
}

import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { WishlistContent } from "@/components/wishlist/wishlist-content";
import { getDictionary } from "@/lib/get-dictionary";

interface WishlistPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: WishlistPageProps): Promise<Metadata> {
  const { lang } = await params;
  const titles = {
    en: "My Wishlist",
    fr: "Mes Favoris",
  };
  const descriptions = {
    en: "Your favorite products.",
    fr: "Vos produits favoris.",
  };

  return {
    title: titles[lang as 'en' | 'fr'] || titles.en,
    description: descriptions[lang as 'en' | 'fr'] || descriptions.en,
  };
}

export default async function WishlistPage({ params }: WishlistPageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'fr');

  return (
    <>
      <Header lang={lang} dict={dict} />
      <main className="pt-24 pb-16 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-8">
            <h1 className="font-serif text-4xl text-foreground">
              {lang === 'fr' ? 'Mes Favoris' : 'My Wishlist'}
            </h1>
            <p className="text-muted-foreground mt-2">
              {lang === 'fr' 
                ? 'Retrouvez tous vos produits favoris' 
                : 'Find all your favorite products'}
            </p>
          </div>
          <WishlistContent lang={lang} dict={dict} />
        </div>
      </main>
      <Footer lang={lang} dict={dict} />
      <MobileNav lang={lang} dict={dict} />
    </>
  );
}

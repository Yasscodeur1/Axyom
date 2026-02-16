import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/home/hero";
import { ReferralBanner } from "@/components/home/referral-banner";
import { FeaturedProducts } from "@/components/home/featured-products";
import { Categories } from "@/components/home/categories";
import { SubscriptionBanner } from "@/components/home/subscription-banner";
import { Values } from "@/components/home/values";
import { getFeaturedProducts } from "@/lib/data/products";
import { getDictionary } from "@/lib/get-dictionary";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as 'en' | 'fr');
  const featuredProducts = await getFeaturedProducts(lang);

  return (
    <>
      <Header lang={lang} dict={dictionary} />
      <main>
        <Hero dict={dictionary} lang={lang} />
        
        {/* Bannière de parrainage */}
        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <ReferralBanner lang={lang} dict={dictionary} />
          </div>
        </section>

        <FeaturedProducts products={featuredProducts} lang={lang} dict={dictionary} />
        <Categories lang={lang} dict={dictionary} />
        <SubscriptionBanner lang={lang} dict={dictionary} />
        <Values dict={dictionary} />
      </main>
      <Footer lang={lang} dict={dictionary} />
      <MobileNav lang={lang} dict={dictionary} />
    </>
  );
}

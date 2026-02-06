import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Footer } from "@/components/layout/footer";
import { SubscriptionContent } from "@/components/subscription/subscription-content";
import { getDictionary } from "@/lib/get-dictionary";

interface SubscribePageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: SubscribePageProps): Promise<Metadata> {
  const { lang } = await params;
  const titles = {
    en: "NOVA Membership",
    fr: "Abonnement AXYOM",
  };
  const descriptions = {
    en: "Join NOVA Membership for unlimited free delivery, exclusive discounts, and early access to new collections.",
    fr: "Rejoignez notre abonnement pour la livraison gratuite illimitée, des réductions exclusives et un accès anticipé aux nouvelles collections.",
  };

  return {
    title: titles[lang as 'en' | 'fr'] || titles.en,
    description: descriptions[lang as 'en' | 'fr'] || descriptions.en,
  };
}

export default async function SubscribePage({ params }: SubscribePageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'fr');

  return (
    <>
      <Header lang={lang} dict={dict} />
      <main className="pt-24 pb-24 lg:pb-8">
        <SubscriptionContent lang={lang} dict={dict} />
      </main>
      <Footer lang={lang} dict={dict} />
      <MobileNav lang={lang} dict={dict} />
    </>
  );
}

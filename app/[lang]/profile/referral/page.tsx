import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import ReferralContent from "@/components/profile/referral-content";
import { getDictionary } from "@/lib/get-dictionary";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ReferralPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: ReferralPageProps): Promise<Metadata> {
  const { lang } = await params;
  const titles = {
    en: "Referral Program | AXYOMSHOP",
    fr: "Programme de Parrainage | AXYOMSHOP",
  };
  const descriptions = {
    en: "Invite your friends and earn rewards with our referral program.",
    fr: "Invitez vos amis et gagnez des récompenses avec notre programme de parrainage.",
  };

  return {
    title: titles[lang as 'en' | 'fr'] || titles.en,
    description: descriptions[lang as 'en' | 'fr'] || descriptions.en,
  };
}

export default async function ReferralPage({ params }: ReferralPageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'fr');

  return (
    <>
      <Header lang={lang} dict={dict} />
      <main className="pt-24 pb-16 min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          {/* Bouton retour */}
          <Link 
            href={`/${lang}/profile`}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-neon-cyan transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            {lang === 'fr' ? 'Retour au profil' : 'Back to profile'}
          </Link>

          <ReferralContent lang={lang} dict={dict} />
        </div>
      </main>
      <Footer lang={lang} dict={dict} />
      <MobileNav lang={lang} dict={dict} />
    </>
  );
}

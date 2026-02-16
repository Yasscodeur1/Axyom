import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ProfileForm } from "@/components/profile/profileForm";
import { getDictionary } from "@/lib/get-dictionary";
import { Gift } from "lucide-react";
import Link from "next/link";

interface ProfilePageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const { lang } = await params;
  const titles = {
    en: "My Profile",
    fr: "Mon Profil",
  };
  const descriptions = {
    en: "Manage your account information.",
    fr: "Gérez les informations de votre compte.",
  };

  return {
    title: titles[lang as 'en' | 'fr'] || titles.en,
    description: descriptions[lang as 'en' | 'fr'] || descriptions.en,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'fr');

  return (
    <>
      <Header lang={lang} dict={dict} />
      <main className="pt-24 pb-16 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-8">
            <h1 className="font-serif text-4xl text-foreground">
              {lang === 'fr' ? 'Mon Profil' : 'My Profile'}
            </h1>
            <p className="text-muted-foreground mt-2">
              {lang === 'fr' 
                ? 'Gérez vos informations personnelles' 
                : 'Manage your personal information'}
            </p>
          </div>

          {/* Lien vers le programme de parrainage */}
          <Link 
            href={`/${lang}/profile/referral`}
            className="mb-6 flex items-center gap-3 rounded-lg bg-linear-to-r from-neon-cyan/10 to-transparent border border-neon-cyan/30 p-4 hover:border-neon-cyan/50 transition-all group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neon-cyan/20 group-hover:bg-neon-cyan/30 transition-colors">
              <Gift className="h-5 w-5 text-neon-cyan" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">
                {lang === 'fr' ? 'Programme de Parrainage' : 'Referral Program'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {lang === 'fr' 
                  ? 'Partagez votre code et gagnez des récompenses' 
                  : 'Share your code and earn rewards'}
              </p>
            </div>
            <div className="text-neon-cyan">→</div>
          </Link>

          <ProfileForm lang={lang} dict={dict} />
        </div>
      </main>
      <Footer lang={lang} dict={dict} />
      <MobileNav lang={lang} dict={dict} />
    </>
  );
}

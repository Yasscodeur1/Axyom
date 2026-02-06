import ContactForm from "@/components/contactForm/contactFormulare";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Footer } from "@/components/layout/footer";
import { getDictionary } from "@/lib/get-dictionary";
import type { Metadata } from "next";

interface ContactPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: ContactPageProps): Promise<Metadata> {
  const { lang } = await params;
  const titles = {
    en: "Contact Us",
    fr: "Contactez-Nous",
  };
  const descriptions = {
    en: "Get in touch with our team for any inquiries or support.",
    fr: "Contactez notre équipe pour toute question ou assistance.",
  };

  return {
    title: titles[lang as 'en' | 'fr'] || titles.en,
    description: descriptions[lang as 'en' | 'fr'] || descriptions.en,
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'fr');        
    return (
        <>
        <Header lang={lang} dict={dict} />
        <main className="pt-24 pb-24 lg:pb-8">
            <div className="mx-auto max-w-7xl px-4 lg:px-8">
                <h1 className="font-serif text-3xl lg:text-4xl text-foreground mb-8">{dict.contact.title}</h1>
                <ContactForm lang={lang} dict={dict} />
            </div>
        </main>
        <Footer lang={lang} dict={dict} />
        <MobileNav lang={lang} dict={dict} />
        </>
    );
}   
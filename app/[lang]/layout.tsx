import React from "react"
import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Cormorant_Garamond } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { CartProvider } from "@/components/cart/cart-context";
import { getDictionary } from "@/lib/get-dictionary";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-serif",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as 'en' | 'fr');

  const titles = {
    en: "AXYOM | Future Fashion",
    fr: "AXYOM | Mode du Futur",
  };

  const descriptions = {
    en: "Experience the future of sustainable fashion. Premium quality clothing designed for tomorrow. Free delivery on orders over €59.",
    fr: "Découvrez l'avenir de la mode durable. Vêtements de qualité premium conçus pour demain. Livraison gratuite pour les commandes supérieures à 59 €.",
  };

  const keywords = {
    en: ["fashion", "luxury", "sustainable", "premium clothing", "AXYOM"],
    fr: ["mode", "luxe", "durable", "vêtements premium", "AXYOM"],
  };

  return {
    title: {
      default: titles[lang as 'en' | 'fr'] || titles.en,
      template: "%s | AXYOM",
    },
    description: descriptions[lang as 'en' | 'fr'] || descriptions.en,
    keywords: keywords[lang as 'en' | 'fr'] || keywords.en,
    openGraph: {
      type: "website",
      locale: lang === 'fr' ? "fr_FR" : "en_US",
      siteName: "AXYOM",
      title: titles[lang as 'en' | 'fr'] || titles.en,
      description: descriptions[lang as 'en' | 'fr'] || descriptions.en,
    },
    twitter: {
      card: "summary_large_image",
      title: titles[lang as 'en' | 'fr'] || titles.en,
      description: descriptions[lang as 'en' | 'fr'] || descriptions.en,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#0a0a14",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  
  return (
    <html lang={lang === 'fr' ? 'fr' : 'en'} className="dark">
      <body
        className={`${spaceGrotesk.variable} ${cormorant.variable} font-sans antialiased`}
      >
        <CartProvider>{children}</CartProvider>
        <Analytics />
      </body>
    </html>
  );
}

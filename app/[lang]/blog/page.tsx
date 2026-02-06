import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Footer } from "@/components/layout/footer";
import { BlogGrid } from "@/components/blog/blog-grid";
import { blogPosts, getAllCategories } from "@/lib/data/blog";
import { getDictionary } from "@/lib/get-dictionary";

interface BlogPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { lang } = await params;
  const titles = {
    en: "Journal",
    fr: "Journal",
  };
  const descriptions = {
    en: "Explore our journal for insights on sustainable fashion, style tips, and the future of clothing.",
    fr: "Explorez notre journal pour des conseils sur la mode durable, des astuces de style et l'avenir des vêtements.",
  };

  return {
    title: titles[lang as 'en' | 'fr'] || titles.en,
    description: descriptions[lang as 'en' | 'fr'] || descriptions.en,
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'fr');
  const categories = getAllCategories();

  return (
    <>
      <Header lang={lang} dict={dict} />
      <main className="pt-24 pb-24 lg:pb-8">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          {/* Header */}
          <div className="mb-12 text-center max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-[0.2em] text-neon-cyan">The Journal</span>
            <h1 className="mt-2 font-serif text-4xl lg:text-5xl text-foreground">
              Insights & Ideas
            </h1>
            <p className="mt-4 text-muted-foreground">
              Exploring the intersection of fashion, sustainability, and innovation.
            </p>
          </div>

          <BlogGrid posts={blogPosts} categories={categories} />
        </div>
      </main>
      <Footer lang={lang} dict={dict} />
      <MobileNav lang={lang} dict={dict} />
    </>
  );
}

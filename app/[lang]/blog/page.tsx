import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Footer } from "@/components/layout/footer";
import { BlogGrid } from "@/components/blog/blog-grid";
import { getDictionary } from "@/lib/get-dictionary";
import { blogPosts, getAllCategories } from "@/lib/data/blog";

interface BlogPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { lang } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
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
    alternates: {
      canonical: `/${lang}/blog`,
      languages: {
        'fr-FR': '/fr/blog',
        'en-US': '/en/blog',
      },
    },
    openGraph: {
      title: titles[lang as 'en' | 'fr'] || titles.en,
      description: descriptions[lang as 'en' | 'fr'] || descriptions.en,
      url: `${baseUrl}/${lang}/blog`,
      type: "website",
    },
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'fr');
  
  // Récupération dynamique depuis l'API Laravel
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  
  let posts = [];
  let categories = [];
  let usingFallback = false;
  
  try {
    const res = await fetch(`${apiUrl}/api/posts?lang=${lang}`, {
      next: { revalidate: 3600 } // Cache d'une heure (ISR)
    });
    
    if (res.ok) {
      const data = await res.json();
      posts = data.posts || [];
      categories = data.categories || [];
    } else {
      console.warn(`API posts endpoint not available (${res.status}), using fallback data`);
      usingFallback = true;
    }
  } catch (error) {
    console.warn('Error fetching posts from API, using fallback data:', error);
    usingFallback = true;
  }
  
  // Fallback vers les données statiques si l'API n'est pas disponible
  if (usingFallback || posts.length === 0) {
    posts = blogPosts;
    categories = getAllCategories();
  }

  return (
    <>
      <Header lang={lang} dict={dict} />
      <main className="pt-24 pb-24 lg:pb-8">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          {/* Header */}
          <div className="mb-12 text-center max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-[0.2em] text-neon-cyan">{dict.blog.subtitle}</span>
            <h1 className="mt-2 font-serif text-4xl lg:text-5xl text-foreground">
              {dict.blog.heading}
            </h1>
            <p className="mt-4 text-muted-foreground">
              {dict.blog.description}
            </p>
          </div>

          <BlogGrid posts={posts} categories={categories} lang={lang} dict={dict} />
        </div>
      </main>
      <Footer lang={lang} dict={dict} />
      <MobileNav lang={lang} dict={dict} />
    </>
  );
}

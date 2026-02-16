import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Footer } from "@/components/layout/footer";
import { BlogCard } from "@/components/blog/blog-card";
import { ProductCardMini } from "@/components/product/product-card-mini";
import { getDictionary } from "@/lib/get-dictionary";
import { getBlogPostBySlug, getRelatedPosts } from "@/lib/data/blog";

interface BlogPostPageProps {
  params: Promise<{ slug: string; lang: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug, lang } = await params;
  
  // Récupérer l'article depuis Laravel
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const res = await fetch(`${apiUrl}/api/posts/${slug}`);
  
  if (!res.ok) {
    return { title: "Post Not Found" };
  }
  
  const post = await res.json();

  if (!post) {
    return { title: "Post Not Found" };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `${baseUrl}/${lang}/blog/${slug}`,
      languages: {
        'fr-FR': `${baseUrl}/fr/blog/${slug}`,
        'en-US': `${baseUrl}/en/blog/${slug}`,
      },
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [
        {
          url: post.cover_image || post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: "article",
      publishedTime: post.published_at || post.publishedAt,
      authors: [post.author?.name || "AXYOMSHOP"],
      url: `${baseUrl}/${lang}/blog/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.cover_image || post.coverImage],
    },
  };
}

export async function generateStaticParams() {
  // Récupérer tous les slugs depuis Laravel pour la génération statique
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  
  try {
    const res = await fetch(`${apiUrl}/api/posts`);
    if (!res.ok) return [];
    
    const { posts } = await res.json();
    
    return posts.map((post: any) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error("Error fetching posts for static generation:", error);
    return [];
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug, lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'fr');
  
  // Récupérer l'article depuis Laravel
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  
  let post = null;
  let relatedPosts = [];
  let usingFallback = false;
  
  try {
    const res = await fetch(`${apiUrl}/api/posts/${slug}`, {
      next: { revalidate: 3600 } // Cache d'une heure
    });

    if (res.ok) {
      post = await res.json();
      
      // Récupérer les articles liés seulement si l'article existe
      try {
        const relatedRes = await fetch(`${apiUrl}/api/posts/${slug}/related`, {
          next: { revalidate: 3600 }
        });
        if (relatedRes.ok) {
          relatedPosts = await relatedRes.json();
        }
      } catch (err) {
        console.warn('Error fetching related posts:', err);
      }
    } else {
      console.warn(`API post endpoint not available (${res.status}), using fallback data`);
      usingFallback = true;
    }
  } catch (error) {
    console.warn('Error fetching post from API, using fallback data:', error);
    usingFallback = true;
  }

  // Fallback vers les données statiques si l'API n'est pas disponible
  if (usingFallback || !post) {
    post = getBlogPostBySlug(slug);
    if (post) {
      relatedPosts = getRelatedPosts(post);
    }
  }

  if (!post) {
    notFound();
  }
  
  const formattedDate = new Date(post.published_at || post.publishedAt).toLocaleDateString(lang === 'fr' ? "fr-FR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.cover_image || post.coverImage,
    author: {
      "@type": "Person",
      name: post.author?.name || "AXYOMSHOP",
    },
    datePublished: post.published_at || post.publishedAt,
  };

  return (
    <>
      <Header lang={lang} dict={dict} />
      <main className="pt-24 pb-24 lg:pb-8">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        <article className="mx-auto max-w-4xl px-4 lg:px-8">
          {/* Back Link */}
          <Link
            href="/blog"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Journal
          </Link>

          {/* Header */}
          <header className="text-center mb-10">
            <span className="inline-block rounded-full bg-neon-cyan/10 px-4 py-1.5 text-xs font-medium text-neon-cyan">
              {post.category}
            </span>
            <h1 className="mt-4 font-serif text-3xl lg:text-5xl text-foreground text-balance">
              {post.title}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              {post.excerpt}
            </p>

            {/* Meta */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center gap-3">
                <Image
                  src={post.author?.avatar || "/placeholder.svg"}
                  alt={post.author?.name || "Author"}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <span className="text-sm font-medium text-foreground">{post.author?.name || "AXYOMSHOP"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {formattedDate}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {post.read_time || post.readTime} min read
              </div>
            </div>
          </header>

          {/* Cover Image */}
          <div className="relative aspect-21/9 overflow-hidden rounded-2xl mb-12">
            <Image
              src={post.cover_image || post.coverImage || "/placeholder.svg"}
              alt={post.title}
              fill
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover"
              priority
            />
          </div>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none prose-headings:font-serif prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-neon-cyan prose-a:no-underline hover:prose-a:underline prose-li:text-muted-foreground">
            <div dangerouslySetInnerHTML={{ __html: formatContent(post.content) }} />
          </div>

          {/* Maillage Interne - Produits mentionnés */}
          {post.related_products && post.related_products.length > 0 && (
            <section className="mt-12 p-6 bg-neon-cyan/5 border border-neon-cyan/20 rounded-xl">
              <h4 className="font-serif text-lg mb-4 text-foreground">
                {lang === 'fr' ? 'Produits mentionnés dans cet article' : 'Products mentioned in this article'}
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {post.related_products.map((product: any) => (
                  <ProductCardMini key={product.id} product={product} lang={lang} />
                ))}
              </div>
            </section>
          )}

          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-wrap gap-2">
              {(post.tags || []).map((tag: string) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-20 mx-auto max-w-7xl px-4 lg:px-8">
            <h2 className="font-serif text-2xl lg:text-3xl text-foreground mb-8 text-center">
              Related Articles
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost: any) => (
                <BlogCard key={relatedPost.id} post={relatedPost} lang={lang} dict={dict} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer lang={lang} dict={dict} />
      <MobileNav lang={lang} dict={dict} />
    </>
  );
}

function formatContent(content: string): string {
  // Convert markdown-like content to HTML
  return content
    .split("\n\n")
    .map((paragraph) => {
      if (paragraph.startsWith("## ")) {
        return `<h2>${paragraph.slice(3)}</h2>`;
      }
      if (paragraph.startsWith("### ")) {
        return `<h3>${paragraph.slice(4)}</h3>`;
      }
      if (paragraph.startsWith("- ")) {
        const items = paragraph.split("\n").map((line) => `<li>${line.slice(2)}</li>`);
        return `<ul>${items.join("")}</ul>`;
      }
      if (paragraph.trim()) {
        // Handle bold text
        const processed = paragraph.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        return `<p>${processed}</p>`;
      }
      return "";
    })
    .join("");
}

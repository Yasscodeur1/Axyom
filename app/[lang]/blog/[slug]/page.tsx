import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Footer } from "@/components/layout/footer";
import { BlogCard } from "@/components/blog/blog-card";
import { blogPosts, getBlogPostBySlug, getRelatedPosts } from "@/lib/data/blog";
import { getDictionary } from "@/lib/get-dictionary";

interface BlogPostPageProps {
  params: Promise<{ slug: string; lang: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author.name],
    },
  };
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug, lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'fr');
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(post);
  const formattedDate = new Date(post.publishedAt).toLocaleDateString(lang === 'fr' ? "fr-FR" : "en-US", {
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
    image: post.coverImage,
    author: {
      "@type": "Person",
      name: post.author.name,
    },
    datePublished: post.publishedAt,
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
                  src={post.author.avatar || "/placeholder.svg"}
                  alt={post.author.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <span className="text-sm font-medium text-foreground">{post.author.name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {formattedDate}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {post.readTime} min read
              </div>
            </div>
          </header>

          {/* Cover Image */}
          <div className="relative aspect-21/9 overflow-hidden rounded-2xl mb-12">
            <Image
              src={post.coverImage || "/placeholder.svg"}
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

          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
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
              {relatedPosts.map((relatedPost) => (
                <BlogCard key={relatedPost.id} post={relatedPost} />
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

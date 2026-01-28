import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Footer } from "@/components/layout/footer";
import { BlogGrid } from "@/components/blog/blog-grid";
import { blogPosts, getAllCategories } from "@/lib/data/blog";

export const metadata: Metadata = {
  title: "Journal",
  description: "Explore our journal for insights on sustainable fashion, style tips, and the future of clothing.",
};

export default function BlogPage() {
  const categories = getAllCategories();

  return (
    <>
      <Header />
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
      <Footer />
      <MobileNav />
    </>
  );
}

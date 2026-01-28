import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Footer } from "@/components/layout/footer";
import { ProductGrid } from "@/components/product/product-grid";
import { products, getAllCategories } from "@/lib/data/products";
import { getDictionary } from "@/lib/get-dictionary";

interface ProductsPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ category?: string; collection?: string }>;
}

export async function generateMetadata({
  params,
}: ProductsPageProps): Promise<Metadata> {
  const { lang } = await params;
  const titles = {
    en: "Shop All Products",
    fr: "Tous les Produits",
  };
  const descriptions = {
    en: "Browse our collection of futuristic, sustainable fashion. Premium quality clothing designed for 2030 and beyond.",
    fr: "Parcourez notre collection de mode futuriste et durable. Vêtements de qualité premium conçus pour 2030 et au-delà.",
  };

  return {
    title: titles[lang as 'en' | 'fr'] || titles.en,
    description: descriptions[lang as 'en' | 'fr'] || descriptions.en,
  };
}

export default async function ProductsPage({ params, searchParams }: ProductsPageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'fr');
  const paramsData = await searchParams;
  const categories = getAllCategories();
  
  let filteredProducts = products;
  
  if (paramsData.category) {
    filteredProducts = products.filter(
      (p) => p.category.toLowerCase() === paramsData.category?.toLowerCase()
    );
  }
  
  if (paramsData.collection === "new") {
    filteredProducts = filteredProducts.filter((p) => p.isNew);
  } else if (paramsData.collection === "featured") {
    filteredProducts = filteredProducts.filter((p) => p.isFeatured);
  }

  const getTitle = () => {
    if (paramsData.category) {
      return paramsData.category.charAt(0).toUpperCase() + paramsData.category.slice(1);
    }
    if (paramsData.collection === "new") {
      return dict.products.title === "Our Collections" ? "New Arrivals" : "Nouveautés";
    }
    if (paramsData.collection === "featured") {
      return "Featured";
    }
    return dict.products.title;
  };

  return (
    <>
      <Header lang={lang} dict={dict} />
      <main className="pt-24 pb-24 lg:pb-8">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          {/* Header */}
          <div className="mb-8 lg:mb-12">
            <h1 className="font-serif text-3xl lg:text-5xl text-foreground">
              {getTitle()}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {filteredProducts.length} {lang === 'fr' ? 'produits' : 'products'}
            </p>
          </div>

          <ProductGrid 
            products={filteredProducts} 
            categories={categories}
            currentCategory={paramsData.category}
            lang={lang}
          />
        </div>
      </main>
      <Footer lang={lang} dict={dict} />
      <MobileNav lang={lang} dict={dict} />
    </>
  );
}

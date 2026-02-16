import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Footer } from "@/components/layout/footer";
import { ProductDetails } from "@/components/product/product-details";
import { ProductViewTracker } from "@/components/product/product-view-tracker";
import { ProductSchema } from "@/components/seo/product-schema";
import { getProducts, getProductBySlug } from "@/lib/data/products";
import { getDictionary } from "@/lib/get-dictionary";

interface ProductPageProps {
  params: Promise<{ slug: string; lang: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug, lang } = await params;
  const product = await getProductBySlug(slug, lang);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  
  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: product.name,
    description: product.shortDescription,
    alternates: {
      canonical: `/${lang}/products/${slug}`,
      languages: {
        'fr-FR': `/fr/products/${slug}`,
        'en-US': `/en/products/${slug}`,
      },
    },
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: [
        {
          url: product.images[0],
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      type: "website",
      url: `${baseUrl}/${lang}/products/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.shortDescription,
      images: [product.images[0]],
    },
  };
}

export async function generateStaticParams() {
  const products = await getProducts('fr'); // Par défaut français
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug, lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'fr');
  const product = await getProductBySlug(slug, lang);

  if (!product) {
    notFound();
  }

  // Get related products from the same category
  const allProducts = await getProducts(lang);
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <>
      <Header lang={lang} dict={dict} />
      <ProductViewTracker productId={product.id} />
      <main className="pt-24 pb-24 lg:pb-8">
        <ProductSchema product={product} lang={lang} />
        <ProductDetails product={product} relatedProducts={relatedProducts} lang={lang} dict={dict} />
      </main>
      <Footer lang={lang} dict={dict} />
      <MobileNav lang={lang} dict={dict} />
    </>
  );
}

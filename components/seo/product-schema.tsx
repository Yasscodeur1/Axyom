// components/seo/product-schema.tsx

interface ProductSchemaProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    shortDescription?: string;
    images: string[];
    price: number;
    inStock: boolean;
    stock?: number;
    rating?: number;
    reviewCount?: number;
    sku?: string;
  };
  lang: string;
}

export function ProductSchema({ product, lang }: ProductSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.sku || product.id,
    brand: {
      "@type": "Brand",
      name: "AXYOMSHOP",
    },
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/${lang}/products/${product.slug}`,
      priceCurrency: "EUR",
      price: product.price,
      itemCondition: "https://schema.org/NewCondition",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "AXYOMSHOP",
      },
    },
    ...(product.rating &&
      product.reviewCount && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: product.rating,
          reviewCount: product.reviewCount,
        },
      }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

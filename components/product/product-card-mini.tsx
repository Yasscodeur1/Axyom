"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

interface ProductCardMiniProps {
  product: {
    id: string | number;
    name?: string;
    name_fr?: string;
    name_en?: string;
    slug: string;
    price: number;
    images?: string[];
    image?: string;
    inStock?: boolean;
    in_stock?: boolean;
  };
  lang?: string;
}

export function ProductCardMini({ product, lang = "fr" }: ProductCardMiniProps) {
  const productName = product.name || product.name_fr || product.name_en || "Product";
  const productImage = product.images?.[0] || product.image || "/placeholder.svg";
  const isInStock = product.inStock ?? product.in_stock ?? true;

  return (
    <Link
      href={`/${lang}/products/${product.slug}`}
      className="group relative overflow-hidden rounded-lg border border-border bg-card hover:border-neon-cyan transition-all duration-300"
    >
      <div className="aspect-square relative overflow-hidden bg-card">
        <Image
          src={productImage}
          alt={productName}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {!isInStock && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <span className="text-sm font-medium text-muted-foreground">
              Rupture de stock
            </span>
          </div>
        )}
      </div>

      <div className="p-3">
        <h5 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-neon-cyan transition-colors">
          {productName}
        </h5>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">
            {product.price.toFixed(2)} EUR
          </span>
          <div className="h-8 w-8 rounded-full bg-neon-cyan/10 flex items-center justify-center group-hover:bg-neon-cyan/20 transition-colors">
            <ShoppingCart className="h-4 w-4 text-neon-cyan" />
          </div>
        </div>
      </div>
    </Link>
  );
}

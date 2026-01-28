"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  lang?: string;
  priority?: boolean;
}

export function ProductCard({ product, lang = "en", priority = false }: ProductCardProps) {
  return (
    <Link href={`/${lang}/products/${product.slug}`} className="group block">
      <div className="relative aspect-3/4 overflow-hidden rounded-lg bg-card">
        <Image
          src={product.images[0] || "/placeholder.svg"}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority={priority}
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="inline-flex items-center rounded-full bg-neon-cyan px-2.5 py-1 text-xs font-medium text-background">
              New
            </span>
          )}
          {product.originalPrice && (
            <span className="inline-flex items-center rounded-full bg-destructive px-2.5 py-1 text-xs font-medium text-destructive-foreground">
              Sale
            </span>
          )}
        </div>
        
        {/* Quick view overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="rounded-full border border-foreground px-6 py-2 text-sm font-medium text-foreground backdrop-blur-sm">
            View Product
          </span>
        </div>
      </div>
      
      <div className="mt-4 space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground group-hover:text-neon-cyan transition-colors line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-neon-cyan text-neon-cyan" />
            <span className="text-xs text-muted-foreground">{product.rating}</span>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground line-clamp-1">
          {product.shortDescription}
        </p>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">
            {product.price.toFixed(2)} EUR
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {product.originalPrice.toFixed(2)} EUR
            </span>
          )}
        </div>
        
        {/* Color options preview */}
        <div className="flex items-center gap-1.5 pt-1">
          {product.colors.slice(0, 4).map((color) => (
            <span
              key={color.name}
              className="h-3 w-3 rounded-full border border-border"
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
          {product.colors.length > 4 && (
            <span className="text-xs text-muted-foreground">
              +{product.colors.length - 4}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

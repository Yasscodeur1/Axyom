"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingUp, Sparkles } from "lucide-react";
import type { Product } from "@/lib/types";
import { products } from "@/lib/data/products";

interface TrendingProductsProps {
  lang: string;
  dict: any;
}

export function TrendingProducts({ lang, dict }: TrendingProductsProps) {
  // Récupérer les produits nouveaux ou en promotion
  const trendingProducts = products
    .filter((p) => p.isNew || p.originalPrice)
    .slice(0, 4);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-neon-cyan" />
        <h3 className="text-xl font-semibold text-foreground">
          {lang === 'fr' ? 'Tendances Actuelles' : 'Trending Now'}
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {trendingProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Link
              href={`/${lang}/products/${product.slug}`}
              className="group block"
            >
              <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary/30 mb-2">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {product.isNew && (
                  <span className="absolute top-2 right-2 bg-neon-cyan text-background text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {lang === 'fr' ? 'Nouveau' : 'New'}
                  </span>
                )}
                {product.originalPrice && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    {lang === 'fr' ? 'Promo' : 'Sale'}
                  </span>
                )}
              </div>
              <h4 className="text-sm font-medium text-foreground line-clamp-1 group-hover:text-neon-cyan transition-colors">
                {product.name}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm font-semibold text-foreground">
                  €{product.price}
                </p>
                {product.originalPrice && (
                  <p className="text-xs text-muted-foreground line-through">
                    €{product.originalPrice}
                  </p>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

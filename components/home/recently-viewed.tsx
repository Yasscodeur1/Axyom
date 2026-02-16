"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import type { Product } from "@/lib/types";
import { products } from "@/lib/data/products";
import { TrendingProducts } from "./trending-products";

interface RecentlyViewedProps {
  lang: string;
  dict: any;
}

export function RecentlyViewed({ lang, dict }: RecentlyViewedProps) {
  const [viewedProducts, setViewedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Récupérer les produits récemment vus depuis localStorage
    const recentlyViewed = localStorage.getItem("recently_viewed");
    if (recentlyViewed) {
      try {
        const viewedIds: string[] = JSON.parse(recentlyViewed);
        // Limiter à 4 produits
        const recentProducts = viewedIds
          .slice(0, 4)
          .map((id) => products.find((p) => p.id === id))
          .filter((p): p is Product => p !== undefined);
        setViewedProducts(recentProducts);
      } catch (error) {
        console.error("Error loading recently viewed:", error);
      }
    }
    setIsLoading(false);
  }, []);

  // Si pas de produits vus, afficher les tendances
  if (!isLoading && viewedProducts.length === 0) {
    return <TrendingProducts lang={lang} dict={dict} />;
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <Eye className="w-5 h-5 text-neon-cyan" />
          <h3 className="text-xl font-semibold text-foreground">
            {lang === 'fr' ? 'Récemment Consultés' : 'Recently Viewed'}
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-secondary/30 rounded-lg mb-2" />
              <div className="h-4 bg-secondary/30 rounded w-3/4 mb-1" />
              <div className="h-3 bg-secondary/30 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Eye className="w-5 h-5 text-neon-cyan" />
        <h3 className="text-xl font-semibold text-foreground">
          {lang === 'fr' ? 'Récemment Consultés' : 'Recently Viewed'}
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {viewedProducts.map((product, index) => (
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
                  <span className="absolute top-2 right-2 bg-neon-cyan text-background text-xs px-2 py-1 rounded-full font-medium">
                    {lang === 'fr' ? 'Nouveau' : 'New'}
                  </span>
                )}
              </div>
              <h4 className="text-sm font-medium text-foreground line-clamp-1 group-hover:text-neon-cyan transition-colors">
                {product.name}
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                €{product.price}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

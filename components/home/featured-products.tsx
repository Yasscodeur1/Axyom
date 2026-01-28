"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/lib/types";
import { motion } from "framer-motion";

interface FeaturedProductsProps {
  products: Product[];
  lang: string;
  dict: any;
}

export function FeaturedProducts({ products, lang, dict }: FeaturedProductsProps) {
  return (
    <section className="py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <motion.div 
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-neon-cyan">Curated Selection</span>
            <h2 className="mt-2 font-serif text-3xl lg:text-4xl text-foreground">{dict.featured.title}</h2>
          </div>
          <Button asChild variant="ghost" className="text-foreground/80 hover:text-neon-cyan group">
            <Link href={`/${lang}/products`}>
              {dict.featured.viewAll}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProductCard product={product} lang={lang} priority={index < 2} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

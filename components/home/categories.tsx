"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface CategoriesProps {
  lang: string;
  dict: any;
}

export function Categories({ lang, dict }: CategoriesProps) {
  const categories = [
    {
      name: dict.categories.outerwear,
      slug: "outerwear",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",
      itemCount: 24,
    },
    {
      name: dict.categories.knitwear,
      slug: "knitwear",
      image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80",
      itemCount: 18,
    },
    {
      name: "Footwear",
      slug: "footwear",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
      itemCount: 32,
    },
    {
      name: dict.categories.accessories,
      slug: "accessories",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
      itemCount: 45,
    },
  ];

  return (
    <section className="py-20 lg:py-32 bg-card">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs uppercase tracking-[0.2em] text-neon-cyan">Browse by</span>
          <h2 className="mt-2 font-serif text-3xl lg:text-4xl text-foreground">{dict.categories.title}</h2>
        </motion.div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link 
                href={`/${lang}/products?category=${category.slug}`}
                className="group relative block aspect-[3/4] overflow-hidden rounded-xl"
              >
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                <div className="absolute inset-0 bg-neon-cyan/0 transition-colors duration-300 group-hover:bg-neon-cyan/10" />
                
                <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
                  <h3 className="font-medium text-lg text-foreground group-hover:text-neon-cyan transition-colors">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {category.itemCount} items
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

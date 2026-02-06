"use client";

import { useState } from "react";
import Link from "next/link";
import { Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "./product-card";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface ProductGridProps {
  products: Product[];
  categories: string[];
  currentCategory?: string;
  lang?: string;
  dict: any;
}

type SortOption = "newest" | "price-low" | "price-high" | "rating";

export function ProductGrid({ products, categories, currentCategory, lang = "en", dict }: ProductGridProps) {
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-28">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
            {dict.products.filterByCategory}
          </h3>
          <nav className="space-y-2">
            <Link
              href={`/${lang}/products`}
              className={cn(
                "block text-sm transition-colors",
                !currentCategory
                  ? "text-neon-cyan"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {dict.products.allCategories}
            </Link>
            {categories.map((category) => (
              <Link
                key={category}
                href={`/${lang}/products?category=${category.toLowerCase()}`}
                className={cn(
                  "block text-sm transition-colors",
                  currentCategory?.toLowerCase() === category.toLowerCase()
                    ? "text-neon-cyan"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {category}
              </Link>
            ))}
          </nav>

          <div className="mt-8">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
              {lang === "fr" ? "Collections" : "Collections"}
            </h3>
            <nav className="space-y-2">
              <Link
                href={`/${lang}/products?collection=new`}
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {dict.footer.newArrivals}
              </Link>
              <Link
                href={`/${lang}/products?collection=featured`}
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {dict.footer.bestsellers}
              </Link>
            </nav>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Sort & Filter Bar */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
          {/* Mobile Filter Button */}
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="lg:hidden bg-transparent">
                <Filter className="h-4 w-4 mr-2" />
                {lang === "fr" ? "Filtrer" : "Filter"}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 bg-background">
              <SheetHeader>
                <SheetTitle>{lang === "fr" ? "Filtres" : "Filters"}</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
                  {dict.products.filterByCategory}
                </h3>
                <nav className="space-y-3">
                  <Link
                    href={`/${lang}/products`}
                    className={cn(
                      "block text-sm transition-colors",
                      !currentCategory
                        ? "text-neon-cyan"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    onClick={() => setIsFilterOpen(false)}
                  >
                    {dict.products.allCategories}
                  </Link>
                  {categories.map((category) => (
                    <Link
                      key={category}
                      href={`/${lang}/products?category=${category.toLowerCase()}`}
                      className={cn(
                        "block text-sm transition-colors",
                        currentCategory?.toLowerCase() === category.toLowerCase()
                          ? "text-neon-cyan"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                      onClick={() => setIsFilterOpen(false)}
                    >
                      {category}
                    </Link>
                  ))}
                </nav>

                <div className="mt-8">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
                    {lang === "fr" ? "Collections" : "Collections"}
                  </h3>
                  <nav className="space-y-3">
                    <Link
                      href={`/${lang}/products?collection=new`}
                      className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsFilterOpen(false)}
                    >
                      {dict.footer.newArrivals}
                    </Link>
                    <Link
                      href={`/${lang}/products?collection=featured`}
                      className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsFilterOpen(false)}
                    >
                      {dict.footer.bestsellers}
                    </Link>
                  </nav>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 ml-auto">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-transparent text-sm text-foreground border-none focus:outline-none cursor-pointer"
            >
              <option value="newest">{lang === "fr" ? "Plus récents" : "Newest"}</option>
              <option value="price-low">{lang === "fr" ? "Prix : Croissant" : "Price: Low to High"}</option>
              <option value="price-high">{lang === "fr" ? "Prix : Décroissant" : "Price: High to Low"}</option>
              <option value="rating">{lang === "fr" ? "Meilleures notes" : "Top Rated"}</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {sortedProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} lang={lang} priority={index < 4} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">
              {lang === "fr" 
                ? "Aucun produit trouvé dans cette catégorie." 
                : "No products found in this category."}
            </p>
            <Button asChild variant="outline" className="mt-4 bg-transparent">
              <Link href={`/${lang}/products`}>
                {lang === "fr" ? "Voir Tous les Produits" : "View All Products"}
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

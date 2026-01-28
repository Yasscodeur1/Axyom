"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Truck, ShieldCheck, ArrowRight, Minus, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "./product-card";
import { useCart } from "@/components/cart/cart-context";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/types";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ProductDetailsProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetails({ product, relatedProducts }: ProductDetailsProps) {
  const { addItem, isSubscriber } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addItem(product, quantity, selectedSize, selectedColor.name);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-card">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0"
              >
                <Image
                  src={product.images[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </motion.div>
            </AnimatePresence>
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isNew && (
                <span className="inline-flex items-center rounded-full bg-neon-cyan px-3 py-1.5 text-xs font-medium text-background">
                  New
                </span>
              )}
              {product.originalPrice && (
                <span className="inline-flex items-center rounded-full bg-destructive px-3 py-1.5 text-xs font-medium text-destructive-foreground">
                  Sale
                </span>
              )}
            </div>
          </div>
          
          {/* Thumbnails */}
          <div className="flex gap-3">
            {product.images.map((image, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedImage(index)}
                className={cn(
                  "relative aspect-square w-20 overflow-hidden rounded-lg border-2 transition-colors",
                  selectedImage === index
                    ? "border-neon-cyan"
                    : "border-transparent hover:border-border"
                )}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} view ${index + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          {/* Breadcrumb */}
          <nav className="mb-4 text-sm text-muted-foreground">
            <Link href="/products" className="hover:text-foreground transition-colors">Products</Link>
            <span className="mx-2">/</span>
            <Link href={`/products?category=${product.category.toLowerCase()}`} className="hover:text-foreground transition-colors">
              {product.category}
            </Link>
          </nav>

          <h1 className="font-serif text-3xl lg:text-4xl text-foreground">{product.name}</h1>
          
          {/* Rating */}
          <div className="mt-3 flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < Math.floor(product.rating)
                      ? "fill-neon-cyan text-neon-cyan"
                      : "fill-muted text-muted"
                  )}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-semibold text-foreground">
              {product.price.toFixed(2)} EUR
            </span>
            {product.originalPrice && (
              <span className="text-xl text-muted-foreground line-through">
                {product.originalPrice.toFixed(2)} EUR
              </span>
            )}
          </div>

          {/* Short Description */}
          <p className="mt-4 text-muted-foreground leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Color Selection */}
          <div className="mt-8">
            <h3 className="text-sm font-medium text-foreground">
              Color: <span className="text-muted-foreground">{selectedColor.name}</span>
            </h3>
            <div className="mt-3 flex gap-3">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    "relative h-10 w-10 rounded-full border-2 transition-all",
                    selectedColor.name === color.name
                      ? "border-neon-cyan scale-110"
                      : "border-transparent hover:scale-105"
                  )}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                >
                  {selectedColor.name === color.name && (
                    <Check className="absolute inset-0 m-auto h-5 w-5 text-foreground drop-shadow-md" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground">Size</h3>
              <button type="button" className="text-xs text-neon-cyan hover:underline">
                Size Guide
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "flex h-10 min-w-[3rem] items-center justify-center rounded-lg border px-4 text-sm font-medium transition-all",
                    selectedSize === size
                      ? "border-neon-cyan bg-neon-cyan/10 text-neon-cyan"
                      : "border-border bg-card text-foreground hover:border-foreground"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-foreground">Quantity</h3>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex items-center rounded-lg border border-border">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-10 w-10 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-medium text-foreground">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-10 w-10 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Add to Cart */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              onClick={handleAddToCart}
              disabled={isAdded}
              className={cn(
                "flex-1 h-14 text-base font-medium transition-all duration-300",
                isAdded
                  ? "bg-neon-cyan text-background"
                  : "bg-foreground text-background hover:bg-neon-cyan"
              )}
            >
              {isAdded ? (
                <>
                  <Check className="mr-2 h-5 w-5" />
                  Added to Cart
                </>
              ) : (
                "Add to Cart"
              )}
            </Button>
          </div>

          {/* Shipping Info */}
          <div className="mt-8 space-y-3 rounded-xl bg-card p-5">
            <div className="flex items-start gap-3">
              <Truck className="h-5 w-5 text-neon-cyan shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {isSubscriber ? "Free Delivery" : `Free delivery on orders over ${FREE_SHIPPING_THRESHOLD} EUR`}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isSubscriber ? "NOVA members enjoy free shipping on all orders" : "Or subscribe to NOVA for unlimited free delivery"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-neon-cyan shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Lifetime Warranty</p>
                <p className="text-xs text-muted-foreground mt-0.5">We stand behind every product</p>
              </div>
            </div>
          </div>

          {/* Full Description */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">Description</h3>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Tags */}
          <div className="mt-6 flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 lg:mt-32">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-neon-cyan">You may also like</span>
              <h2 className="mt-2 font-serif text-2xl lg:text-3xl text-foreground">Related Products</h2>
            </div>
            <Button asChild variant="ghost" className="text-foreground/80 hover:text-neon-cyan group">
              <Link href={`/products?category=${product.category.toLowerCase()}`}>
                View All
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

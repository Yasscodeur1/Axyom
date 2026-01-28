import type { Product } from "@/lib/types";

export const products: Product[] = [
  {
    id: "1",
    name: "Quantum Weave Jacket",
    slug: "quantum-weave-jacket",
    price: 289,
    originalPrice: 349,
    description:
      "The Quantum Weave Jacket represents the pinnacle of sustainable fashion technology. Crafted from recycled oceanic materials and infused with temperature-regulating nanotechnology, this jacket adapts to your body and environment. The minimalist silhouette features hidden magnetic closures and an integrated UV protection layer. Perfect for the conscious consumer who refuses to compromise on style or sustainability.",
    shortDescription: "Temperature-adaptive jacket with nano-tech fibers",
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
      "https://images.unsplash.com/photo-1559551409-dadc959f76b8?w=800&q=80",
    ],
    category: "Outerwear",
    tags: ["sustainable", "tech-wear", "bestseller"],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Obsidian", hex: "#1a1a2e" },
      { name: "Arctic", hex: "#e8e8e8" },
      { name: "Emerald", hex: "#2d5a4e" },
    ],
    inStock: true,
    rating: 4.9,
    reviewCount: 127,
    isFeatured: true,
    isNew: true,
  },
  {
    id: "2",
    name: "Neural Knit Sweater",
    slug: "neural-knit-sweater",
    price: 179,
    description:
      "Experience unparalleled comfort with the Neural Knit Sweater. Using our proprietary bio-responsive yarn, this sweater learns your comfort preferences over time. The seamless construction eliminates pressure points while the organic cotton blend ensures breathability. A statement piece that bridges the gap between high fashion and intelligent clothing.",
    shortDescription: "Bio-responsive yarn with adaptive comfort",
    images: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80",
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80",
    ],
    category: "Knitwear",
    tags: ["comfort", "organic", "smart-fabric"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Cream", hex: "#f5f5dc" },
      { name: "Charcoal", hex: "#36454f" },
      { name: "Rust", hex: "#b7410e" },
    ],
    inStock: true,
    rating: 4.8,
    reviewCount: 89,
    isFeatured: true,
  },
  {
    id: "3",
    name: "Aero Flow Pants",
    slug: "aero-flow-pants",
    price: 159,
    description:
      "The Aero Flow Pants redefine modern tailoring with their weightless feel and architectural silhouette. Constructed from our aerospace-grade fabric that weighs 40% less than traditional materials while offering superior durability. Features include invisible zipper pockets, adjustable hem technology, and a self-cleaning surface treatment.",
    shortDescription: "Lightweight pants with self-cleaning technology",
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80",
    ],
    category: "Bottoms",
    tags: ["lightweight", "technical", "minimalist"],
    sizes: ["28", "30", "32", "34", "36", "38"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Stone", hex: "#8b8680" },
      { name: "Navy", hex: "#000080" },
    ],
    inStock: true,
    rating: 4.7,
    reviewCount: 156,
    isFeatured: true,
  },
  {
    id: "4",
    name: "Horizon Silk Blouse",
    slug: "horizon-silk-blouse",
    price: 219,
    description:
      "The Horizon Silk Blouse embodies effortless elegance with a futuristic edge. Made from lab-grown silk that requires no silkworms, achieving the same luxurious feel with zero animal impact. The flowing silhouette features subtle holographic threads that catch light beautifully, creating an ethereal effect perfect for any occasion.",
    shortDescription: "Lab-grown silk with holographic accents",
    images: [
      "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=800&q=80",
      "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=800&q=80",
    ],
    category: "Tops",
    tags: ["silk", "elegant", "sustainable"],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Pearl", hex: "#f0ead6" },
      { name: "Midnight", hex: "#191970" },
      { name: "Blush", hex: "#de5d83" },
    ],
    inStock: true,
    rating: 4.9,
    reviewCount: 73,
    isNew: true,
  },
  {
    id: "5",
    name: "Zero-G Sneakers",
    slug: "zero-g-sneakers",
    price: 249,
    originalPrice: 299,
    description:
      "Step into the future with Zero-G Sneakers. Featuring our revolutionary cushioning system inspired by space engineering, these sneakers provide unprecedented comfort and support. The upper is constructed from recycled ocean plastics, while the sole incorporates algae-based foam. Built-in sensors track your movement patterns for optimal support.",
    shortDescription: "Space-engineered comfort with recycled materials",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80",
    ],
    category: "Footwear",
    tags: ["sneakers", "sustainable", "tech"],
    sizes: ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"],
    colors: [
      { name: "Cloud", hex: "#f8f8ff" },
      { name: "Shadow", hex: "#2f2f2f" },
      { name: "Electric", hex: "#00ffff" },
    ],
    inStock: true,
    rating: 4.8,
    reviewCount: 214,
    isFeatured: true,
  },
  {
    id: "6",
    name: "Chrono Minimalist Watch",
    slug: "chrono-minimalist-watch",
    price: 399,
    description:
      "The Chrono Minimalist Watch strips timekeeping to its essence. A single piece of synthetic sapphire crystal houses a movement powered by kinetic energy harvesting. No batteries, no charging, just pure design. The display uses e-ink technology for perfect visibility in any lighting condition while consuming virtually no power.",
    shortDescription: "Kinetic-powered e-ink timepiece",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80",
    ],
    category: "Accessories",
    tags: ["watch", "minimalist", "tech"],
    sizes: ["38mm", "42mm"],
    colors: [
      { name: "Silver", hex: "#c0c0c0" },
      { name: "Graphite", hex: "#383838" },
      { name: "Rose Gold", hex: "#b76e79" },
    ],
    inStock: true,
    rating: 5.0,
    reviewCount: 48,
    isNew: true,
  },
  {
    id: "7",
    name: "Void Cashmere Coat",
    slug: "void-cashmere-coat",
    price: 589,
    description:
      "The Void Cashmere Coat is the ultimate statement in luxury outerwear. Crafted from ethically sourced Mongolian cashmere that has been enhanced with graphene fibers for increased durability and heat retention. The oversized silhouette features hand-stitched details and a signature invisible closure system.",
    shortDescription: "Graphene-enhanced Mongolian cashmere",
    images: [
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80",
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&q=80",
    ],
    category: "Outerwear",
    tags: ["cashmere", "luxury", "winter"],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Void Black", hex: "#0d0d0d" },
      { name: "Camel", hex: "#c19a6b" },
      { name: "Heather", hex: "#9aa297" },
    ],
    inStock: true,
    rating: 4.9,
    reviewCount: 34,
    isFeatured: true,
  },
  {
    id: "8",
    name: "Pulse Training Set",
    slug: "pulse-training-set",
    price: 189,
    description:
      "The Pulse Training Set elevates athletic wear with cutting-edge performance technology. The compression fabric features embedded sensors that monitor muscle activity and body temperature, syncing with your devices for real-time feedback. Anti-microbial treatment keeps you fresh through the most intense workouts.",
    shortDescription: "Sensor-embedded performance activewear",
    images: [
      "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&q=80",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
    ],
    category: "Activewear",
    tags: ["athletic", "smart-fabric", "performance"],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Carbon", hex: "#2b2b2b" },
      { name: "Electric Blue", hex: "#0892d0" },
      { name: "Neon", hex: "#39ff14" },
    ],
    inStock: true,
    rating: 4.7,
    reviewCount: 91,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.isFeatured);
}

export function getNewProducts(): Product[] {
  return products.filter((p) => p.isNew);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );
}

export function getAllCategories(): string[] {
  return [...new Set(products.map((p) => p.category))];
}

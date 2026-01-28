export interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    originalPrice?: number;
    description: string;
    shortDescription: string;
    images: string[];
    category: string;
    tags: string[];
    sizes: string[];
    colors: { name: string; hex: string }[];
    inStock: boolean;
    rating: number;
    reviewCount: number;
    isFeatured?: boolean;
    isNew?: boolean;
  }
  
  export interface CartItem {
    product: Product;
    quantity: number;
    size: string;
    color: string;
  }
  
  export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    coverImage: string;
    author: {
      name: string;
      avatar: string;
    };
    publishedAt: string;
    category: string;
    tags: string[];
    readTime: number;
  }
  
  export const FREE_SHIPPING_THRESHOLD = 59;
  export const SHIPPING_COST = 4.99;
  export const SUBSCRIPTION_PRICE = 9.99;
  
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/auth-context";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-context";
import { toast } from "sonner";

interface WishlistProduct {
  id: string;
  product_id: string;
  name: string;
  slug: string;
  price: number;
  original_price?: number;
  image: string;
  in_stock: boolean;
}

export function WishlistContent({ lang, dict }: { lang: string; dict: any }) {
  const { isAuthenticated, token } = useAuth();
  const { addItem } = useCart();
  const router = useRouter();
  const [wishlist, setWishlist] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/${lang}/login?redirect=/${lang}/wishlist`);
      return;
    }

    fetchWishlist();
  }, [isAuthenticated, lang, router]);

  const fetchWishlist = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
      if (!apiUrl) {
        toast.error("Configuration API manquante");
        return;
      }

      const response = await fetch(`${apiUrl}/api/wishlist`, {
        headers: {
          "Accept": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur lors du chargement: ${response.status}`);
      }

      const data = await response.json();
      setWishlist(data.wishlist || data.data || []);
    } catch (error) {
      toast.error("Impossible de charger vos favoris");
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (wishlistId: string) => {
    setRemoving(wishlistId);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
      if (!apiUrl) {
        toast.error("Configuration API manquante");
        return;
      }

      const response = await fetch(`${apiUrl}/api/wishlist/${wishlistId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      setWishlist((prev) => prev.filter((item) => item.id !== wishlistId));
      toast.success(
        lang === "fr" ? "Retiré des favoris" : "Removed from wishlist"
      );
    } catch (error) {
      console.error("Remove from wishlist error:", error);
      toast.error("Impossible de retirer des favoris");
    } finally {
      setRemoving(null);
    }
  };

  const addToCart = (product: WishlistProduct) => {
    if (!product.in_stock) {
      toast.error(
        lang === "fr" ? "Produit en rupture de stock" : "Product out of stock"
      );
      return;
    }

    // Convertir en format Product pour le panier
    const cartProduct = {
      id: product.product_id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      originalPrice: product.original_price,
      images: [product.image],
      inStock: product.in_stock,
      // Valeurs par défaut nécessaires
      description: "",
      shortDescription: "",
      category: "",
      tags: [],
      sizes: ["M"], // Taille par défaut
      colors: [{ name: "Default", hex: "#000000" }],
      stock: 10,
      rating: 0,
      reviewCount: 0,
      isFeatured: false,
      isNew: false,
    };

    addItem(cartProduct, 1, "M", "Default");
    toast.success(lang === "fr" ? "Ajouté au panier" : "Added to cart");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-neon-cyan" />
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="text-center py-16">
        <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          {lang === "fr" ? "Aucun favori" : "No favorites"}
        </h2>
        <p className="text-muted-foreground mb-6">
          {lang === "fr"
            ? "Vous n'avez pas encore ajouté de produits à vos favoris"
            : "You haven't added any products to your wishlist yet"}
        </p>
        <Button asChild>
          <Link href={`/${lang}/products`}>
            {lang === "fr" ? "Découvrir nos produits" : "Discover our products"}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {wishlist.map((item) => (
        <div
          key={item.id}
          className="group relative bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
        >
          {/* Image */}
          <Link href={`/${lang}/products/${item.slug}`} className="block">
            <div className="relative aspect-square overflow-hidden bg-secondary/30">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              {!item.in_stock && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    {lang === "fr" ? "Rupture de stock" : "Out of stock"}
                  </span>
                </div>
              )}
            </div>
          </Link>

          {/* Bouton supprimer */}
          <button
            onClick={() => removeFromWishlist(item.id)}
            disabled={removing === item.id}
            className="absolute top-2 right-2 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-destructive hover:text-destructive-foreground transition-colors disabled:opacity-50"
          >
            {removing === item.id ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </button>

          {/* Informations */}
          <div className="p-4">
            <Link href={`/${lang}/products/${item.slug}`}>
              <h3 className="font-medium text-foreground line-clamp-2 mb-2 hover:text-neon-cyan transition-colors">
                {item.name}
              </h3>
            </Link>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg font-semibold text-foreground">
                €{item.price}
              </span>
              {item.original_price && (
                <span className="text-sm text-muted-foreground line-through">
                  €{item.original_price}
                </span>
              )}
            </div>

            <Button
              onClick={() => addToCart(item)}
              disabled={!item.in_stock}
              className="w-full"
              size="sm"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {lang === "fr" ? "Ajouter au panier" : "Add to cart"}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

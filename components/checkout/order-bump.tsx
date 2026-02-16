"use client";

import { useState, useEffect } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

interface OrderBumpProps {
  lang: string;
  dict: any;
}

// Produit Order Bump par défaut (fallback)
const DEFAULT_BUMP_PRODUCT = {
  id: "order-bump-warranty",
  name: "Extension de Garantie Premium 2 ans",
  name_fr: "Extension de Garantie Premium 2 ans",
  name_en: "Premium Warranty Extension 2 years",
  slug: "order-bump-warranty",
  description: "Protection complète contre les défauts et l'usure normale. Échange immédiat.",
  shortDescription: "Protection complète 2 ans avec échange immédiat.",
  description_fr: "Protection complète contre les défauts et l'usure normale. Échange immédiat.",
  description_en: "Full protection against defects and normal wear. Immediate replacement.",
  price: 29.99,
  images: ["https://images.unsplash.com/photo-1589254065878-42c9da997008?w=400&q=80"],
  category: "Services",
  tags: ["warranty", "insurance"],
  sizes: ["Standard"],
  colors: [{ name: "Standard", hex: "#000000" }],
  inStock: true,
  stock: 999,
  rating: 5,
  reviewCount: 0,
  isFeatured: false,
  isNew: false,
};

export function OrderBump({ lang, dict }: OrderBumpProps) {
  const { items, addItem, removeItem } = useCart();
  const [isChecked, setIsChecked] = useState(false);
  const [bumpProduct, setBumpProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Charger dynamiquement l'offre depuis l'API
  useEffect(() => {
    const fetchBump = async () => {
      if (items.length === 0) {
        setBumpProduct(DEFAULT_BUMP_PRODUCT);
        setLoading(false);
        return;
      }

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
        if (!apiUrl) {
          setBumpProduct(DEFAULT_BUMP_PRODUCT);
          setLoading(false);
          return;
        }

        const res = await fetch(`${apiUrl}/api/upsell/recommendation`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ 
            product_ids: items.map(item => item.product.id) 
          })
        });

        if (!res.ok) {
          setBumpProduct(DEFAULT_BUMP_PRODUCT);
          setLoading(false);
          return;
        }

        const data = await res.json();
        
        // Transformer la réponse Laravel en Product
        if (data && data.product) {
          const apiProduct = data.product;
          setBumpProduct({
            id: apiProduct.id.toString(),
            name: apiProduct[`name_${lang}`] || apiProduct.name_fr || apiProduct.name_en || apiProduct.name,
            slug: apiProduct.slug || apiProduct.id.toString(),
            description: apiProduct[`description_${lang}`] || apiProduct.description_fr || apiProduct.description_en || "",
            shortDescription: apiProduct.short_description || "",
            price: parseFloat(apiProduct.price),
            originalPrice: apiProduct.original_price ? parseFloat(apiProduct.original_price) : undefined,
            images: apiProduct.images || [],
            category: apiProduct.category || "Services",
            tags: apiProduct.tags || [],
            sizes: apiProduct.sizes || ["Standard"],
            colors: apiProduct.colors || [{ name: "Standard", hex: "#000000" }],
            inStock: (apiProduct.stock || 0) > 0,
            stock: apiProduct.stock || 0,
            rating: apiProduct.rating || 5,
            reviewCount: apiProduct.review_count || 0,
            isFeatured: apiProduct.is_featured || false,
            isNew: apiProduct.is_new || false,
          });
        } else {
          setBumpProduct(DEFAULT_BUMP_PRODUCT);
        }
      } catch (error) {
        console.error("Erreur lors du chargement de l'order bump:", error);
        setBumpProduct(DEFAULT_BUMP_PRODUCT);
      } finally {
        setLoading(false);
      }
    };

    fetchBump();
  }, [items, lang]);

  // Vérifier si le produit Order Bump est déjà dans le panier
  useEffect(() => {
    if (!bumpProduct) return;
    const exists = items.some((item) => item.product.id === bumpProduct.id);
    setIsChecked(exists);
  }, [items, bumpProduct]);

  const handleToggle = (checked: boolean) => {
    if (!bumpProduct) return;
    
    setIsChecked(checked);

    if (checked) {
      // Ajouter au panier avec les paramètres requis
      addItem(
        bumpProduct,
        1,
        bumpProduct.sizes[0] || "Standard",
        bumpProduct.colors[0]?.name || "Standard"
      );
    } else {
      // Retirer du panier
      removeItem(
        bumpProduct.id, 
        bumpProduct.sizes[0] || "Standard", 
        bumpProduct.colors[0]?.name || "Standard"
      );
    }
  };

  // Si en cours de chargement
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 rounded-lg border-2 border-dashed border-border bg-card/50">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Si aucun produit disponible
  if (!bumpProduct) {
    return null;
  }

  const title = lang === "fr" 
    ? (bumpProduct.name || DEFAULT_BUMP_PRODUCT.name_fr)
    : (bumpProduct.name || DEFAULT_BUMP_PRODUCT.name_en);
  
  const description = bumpProduct.description || DEFAULT_BUMP_PRODUCT.description;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border-2 border-dashed border-neon-cyan",
        "bg-neon-cyan/5 p-6 transition-all duration-300",
        isChecked && "bg-neon-cyan/10 border-solid shadow-lg shadow-neon-cyan/20",
        "animate-pulse-slow"
      )}
    >
      {/* Icône flottante animée */}
      <div className="absolute -top-2 -right-2 animate-bounce-slow">
        <div className="rounded-full bg-neon-cyan p-2 shadow-lg shadow-neon-cyan/50">
          <Sparkles className="h-5 w-5 text-background" />
        </div>
      </div>

      {/* Badge "Offre Spéciale" */}
      <div className="absolute top-3 left-3">
        <span className="inline-flex items-center rounded-full bg-linear-to-r from-neon-cyan to-neon-purple px-3 py-1 text-xs font-bold text-background uppercase tracking-wider">
          {lang === "fr" ? "Offre Spéciale" : "Special Offer"}
        </span>
      </div>

      <div className="mt-6 flex items-start gap-4">
        {/* Checkbox */}
        <div className="flex items-center pt-1">
          <Checkbox
            id="order-bump"
            checked={isChecked}
            onCheckedChange={handleToggle}
            className="h-6 w-6 border-2 border-neon-cyan data-[state=checked]:bg-neon-cyan data-[state=checked]:text-background"
          />
        </div>

        {/* Contenu */}
        <div className="flex-1">
          <Label
            htmlFor="order-bump"
            className="cursor-pointer space-y-2 text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {/* Titre */}
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-foreground">
                {lang === "fr" ? "✨ Oui, je protège mon achat !" : "✨ Yes, protect my purchase!"}
              </span>
              <span className="text-2xl font-extrabold text-neon-cyan">
                {bumpProduct.price.toFixed(2)}€
              </span>
            </div>

            {/* Titre du produit */}
            <p className="text-base font-semibold text-foreground/90">{title}</p>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>

            {/* Points clés */}
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="text-neon-cyan">✓</span>
                {lang === "fr" ? "Couverture de 2 ans" : "2-year coverage"}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-neon-cyan">✓</span>
                {lang === "fr" ? "Échange sans frais" : "Free replacement"}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-neon-cyan">✓</span>
                {lang === "fr" ? "Support prioritaire 24/7" : "24/7 priority support"}
              </li>
            </ul>

            {/* Badge économie */}
            <div className="inline-flex items-center gap-2 rounded-full bg-neon-purple/10 px-3 py-1 text-xs font-medium text-neon-purple">
              <Sparkles className="h-3 w-3" />
              {lang === "fr" ? "Économisez jusqu'à 200€ en réparations" : "Save up to €200 in repairs"}
            </div>
          </Label>
        </div>
      </div>

      {/* Effet de brillance animé */}
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-transparent via-neon-cyan/5 to-transparent -translate-x-full animate-shimmer" />
    </div>
  );
}

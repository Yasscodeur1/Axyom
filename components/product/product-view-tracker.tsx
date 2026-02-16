"use client";

import { useEffect } from "react";

interface ProductViewTrackerProps {
  productId: string;
}

export function ProductViewTracker({ productId }: ProductViewTrackerProps) {
  useEffect(() => {
    // Enregistrer le produit vu dans localStorage
    const recentlyViewed = localStorage.getItem("recently_viewed");
    let viewedIds: string[] = [];

    if (recentlyViewed) {
      try {
        viewedIds = JSON.parse(recentlyViewed);
      } catch (error) {
        console.error("Error parsing recently viewed:", error);
        viewedIds = [];
      }
    }

    // Retirer le produit s'il existe déjà (pour le remettre en premier)
    viewedIds = viewedIds.filter((id) => id !== productId);

    // Ajouter le produit en premier
    viewedIds.unshift(productId);

    // Limiter à 10 produits
    if (viewedIds.length > 10) {
      viewedIds = viewedIds.slice(0, 10);
    }

    // Sauvegarder dans localStorage
    localStorage.setItem("recently_viewed", JSON.stringify(viewedIds));
  }, [productId]);

  return null;
}

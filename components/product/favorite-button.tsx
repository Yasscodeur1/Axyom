"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useAuth } from "@/components/auth/auth-context";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FavoriteButtonProps {
  productId: string;
  initialIsFavorite?: boolean;
  className?: string;
}

export function FavoriteButton({
  productId,
  initialIsFavorite = false,
  className,
}: FavoriteButtonProps) {
  const { user, token, isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [loading, setLoading] = useState(false);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault(); // Évite de cliquer sur le lien du produit
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Vous devez être connecté pour ajouter des favoris");
      return;
    }

    if (!token) {
      toast.error("Token d'authentification manquant");
      return;
    }

    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
      if (!apiUrl) {
        toast.error("Configuration API manquante");
        setLoading(false);
        return;
      }

      const response = await fetch(`${apiUrl}/api/wishlist/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: productId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      setIsFavorite(data.is_favorite);
      toast.success(data.message || (data.is_favorite ? "Ajouté aux favoris" : "Retiré des favoris"));
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        toast.error("Impossible de se connecter au serveur. Vérifiez que Laravel est démarré.");
      } else {
        toast.error("Une erreur est survenue");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={cn(
        "group p-2 bg-background/80 backdrop-blur-sm border border-border hover:scale-110 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed",
        !className?.includes('rounded') && "rounded-full",
        className
      )}
      aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      <Heart
        className={cn(
          "h-5 w-5 transition-colors",
          isFavorite
            ? "fill-red-500 text-red-500"
            : "text-muted-foreground group-hover:text-red-400"
        )}
      />
    </button>
  );
}

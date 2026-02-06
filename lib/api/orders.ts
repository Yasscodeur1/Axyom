/**
 * Service de gestion des commandes
 * Récupération de l'historique et détails des commandes
 */

import { getAuthToken, removeAuthToken } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface OrderItem {
  id: number;
  product_id: string;
  product_name: string;
  product_slug: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image?: string;
}

export interface Order {
  id: number;
  order_number: string;
  customer_id: number;
  subtotal: number;
  shipping_cost: number;
  total: number;
  is_subscriber: boolean;
  currency: string;
  language: string;
  status: "pending" | "paid" | "shipped" | "completed" | "canceled";
  stripe_session_id?: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  customer?: {
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
    address: string;
    city: string;
    postal_code: string;
    country: string;
  };
}

/**
 * Récupérer l'historique des commandes de l'utilisateur connecté
 */
export const getMyOrders = async (): Promise<Order[]> => {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Vous devez être connecté pour voir vos commandes");
  }

  try {
    const response = await fetch(`${API_URL}/api/orders`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token invalide ou expiré
        removeAuthToken();
        throw new Error("Session expirée, veuillez vous reconnecter");
      }
      if (response.status === 404) {
        throw new Error("L'API des commandes n'est pas disponible. Vérifiez que votre backend Laravel est démarré.");
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erreur ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.orders || data; // Adapter selon la structure de votre API
  } catch (error) {
    // Erreur réseau (backend non démarré)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error("Impossible de contacter le serveur. Vérifiez que votre API Laravel est démarrée sur " + API_URL);
    }
    throw error;
  }
};

/**
 * Récupérer les détails d'une commande spécifique
 */
export const getOrderDetails = async (orderNumber: string): Promise<Order> => {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Vous devez être connecté pour voir cette commande");
  }

  const response = await fetch(`${API_URL}/api/orders/${orderNumber}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Session expirée, veuillez vous reconnecter");
    }
    if (response.status === 404) {
      throw new Error("Commande introuvable");
    }
    throw new Error("Erreur lors de la récupération de la commande");
  }

  return await response.json();
};

/**
 * Annuler une commande (si possible)
 */
export const cancelOrder = async (orderNumber: string): Promise<void> => {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Vous devez être connecté pour annuler une commande");
  }

  const response = await fetch(`${API_URL}/api/orders/${orderNumber}/cancel`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erreur lors de l'annulation de la commande");
  }
};

/**
 * Suivre une commande (tracking)
 */
export const trackOrder = async (orderNumber: string) => {
  const token = getAuthToken();

  const headers: HeadersInit = {
    "Accept": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/api/orders/${orderNumber}/track`, {
    headers,
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Commande introuvable");
    }
    throw new Error("Erreur lors du suivi de la commande");
  }

  return await response.json();
};

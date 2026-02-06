"use client";

import { useState, useEffect } from "react";
import { getMyOrders, getOrderDetails, type Order } from "@/lib/api/orders";
import { isAuthenticated } from "@/lib/api/auth";

/**
 * Hook pour récupérer l'historique des commandes
 */
export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    if (!isAuthenticated()) {
      setIsLoading(false);
      setError("Vous devez être connecté");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await getMyOrders();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    isLoading,
    error,
    refetch: fetchOrders,
  };
}

/**
 * Hook pour récupérer les détails d'une commande
 */
export function useOrderDetails(orderNumber: string) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderDetails = async () => {
    if (!isAuthenticated()) {
      setIsLoading(false);
      setError("Vous devez être connecté");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await getOrderDetails(orderNumber);
      setOrder(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (orderNumber) {
      fetchOrderDetails();
    }
  }, [orderNumber]);

  return {
    order,
    isLoading,
    error,
    refetch: fetchOrderDetails,
  };
}

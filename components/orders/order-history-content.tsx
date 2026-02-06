"use client";

import { useOrders } from "@/lib/hooks/useOrders";
import { Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

interface OrderHistoryContentProps {
  lang: string;
  dict: any;
}

export function OrderHistoryContent({ lang, dict }: OrderHistoryContentProps) {
  const { orders, isLoading, error, refetch } = useOrders();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "paid":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "shipped":
        return <Truck className="h-5 w-5 text-blue-500" />;
      case "completed":
        return <CheckCircle className="h-5 w-5 text-neon-cyan" />;
      case "canceled":
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Package className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const statusLabels: Record<string, { en: string; fr: string }> = {
      pending: { en: "Pending", fr: "En attente" },
      paid: { en: "Paid", fr: "Payé" },
      shipped: { en: "Shipped", fr: "Expédié" },
      completed: { en: "Completed", fr: "Terminé" },
      canceled: { en: "Canceled", fr: "Annulé" },
    };
    return statusLabels[status]?.[lang as "en" | "fr"] || status;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-neon-cyan border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-8 text-center">
        <XCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
        <p className="text-destructive font-medium mb-4">{error}</p>
        <button
          onClick={refetch}
          className="text-sm text-foreground hover:text-neon-cyan transition-colors underline"
        >
          {dict.common?.retry || "Réessayer"}
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-xl bg-card border border-border p-12 text-center">
        <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium text-foreground mb-2">
          {dict.orders?.noOrders || "Aucune commande"}
        </h3>
        <p className="text-muted-foreground mb-6">
          {dict.orders?.noOrdersDescription || "Vous n'avez pas encore passé de commande."}
        </p>
        <Link
          href={`/${lang}/products`}
          className="inline-flex items-center justify-center rounded-lg bg-foreground text-background px-6 py-3 font-medium hover:bg-neon-cyan transition-all"
        >
          {dict.orders?.startShopping || "Commencer vos achats"}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div
          key={order.id}
          className="rounded-xl bg-card border border-border p-6 hover:border-neon-cyan/50 transition-all"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-foreground">
                  {dict.orders?.orderNumber || "Commande"} #{order.order_number}
                </h3>
                <div className="flex items-center gap-2 text-sm">
                  {getStatusIcon(order.status)}
                  <span className={cn(
                    "font-medium",
                    order.status === "completed" && "text-neon-cyan",
                    order.status === "canceled" && "text-destructive",
                  )}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {new Date(order.created_at).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex flex-col items-start lg:items-end gap-2">
              <p className="text-2xl font-bold text-foreground">
                {order.total.toFixed(2)} {order.currency}
              </p>
              <Link
                href={`/${lang}/orders/${order.order_number}`}
                className="text-sm text-neon-cyan hover:underline"
              >
                {dict.orders?.viewDetails || "Voir les détails"} →
              </Link>
            </div>
          </div>

          {/* Order Items Preview */}
          <div className="flex gap-3 overflow-x-auto">
            {order.items.slice(0, 4).map((item, index) => (
              <div key={index} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.product_name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
                {item.quantity > 1 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-xs font-medium text-background">
                    {item.quantity}
                  </span>
                )}
              </div>
            ))}
            {order.items.length > 4 && (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-secondary text-sm font-medium text-muted-foreground">
                +{order.items.length - 4}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

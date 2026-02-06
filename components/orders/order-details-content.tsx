"use client";

import { useOrderDetails } from "@/lib/hooks/useOrders";
import { Package, Truck, MapPin, CreditCard, CheckCircle, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

interface OrderDetailsContentProps {
  orderNumber: string;
  lang: string;
  dict: any;
}

export function OrderDetailsContent({ orderNumber, lang, dict }: OrderDetailsContentProps) {
  const { order, isLoading, error, refetch } = useOrderDetails(orderNumber);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-6 w-6 text-yellow-500" />;
      case "paid":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case "shipped":
        return <Truck className="h-6 w-6 text-blue-500" />;
      case "completed":
        return <CheckCircle className="h-6 w-6 text-neon-cyan" />;
      case "canceled":
        return <XCircle className="h-6 w-6 text-destructive" />;
      default:
        return <Package className="h-6 w-6 text-muted-foreground" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const statusLabels: Record<string, { en: string; fr: string }> = {
      pending: { en: "Pending Payment", fr: "En attente de paiement" },
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
          {dict.common.retry}
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="rounded-xl bg-card border border-border p-12 text-center">
        <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium text-foreground mb-2">
          {dict.orders?.orderNotFound || "Commande introuvable"}
        </h3>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Order Status Card */}
      <div className="rounded-xl bg-card border-2 border-neon-cyan/50 p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {getStatusIcon(order.status)}
            <div>
              <p className="text-sm text-muted-foreground">{dict.orders.status}</p>
              <p className="text-xl font-semibold text-foreground">
                {getStatusLabel(order.status)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">
              {new Date(order.created_at).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(order.created_at).toLocaleTimeString(lang === "fr" ? "fr-FR" : "en-US")}
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl bg-card border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <Package className="h-5 w-5 text-neon-cyan" />
              {dict.orders.items}
            </h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.product_name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">
                      {item.product_name}
                    </h3>
                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                      {item.size && <span>Taille: {item.size}</span>}
                      {item.color && <span>Couleur: {item.color}</span>}
                      <span>Qté: {item.quantity}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-semibold text-foreground">
                      {item.price.toFixed(2)} {order.currency}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-muted-foreground">
                        {(item.price / item.quantity).toFixed(2)} {order.currency} / unité
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="rounded-xl bg-card border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-neon-cyan" />
              {dict.orders.shippingAddress}
            </h2>
            {order.customer && (
              <div className="space-y-1 text-muted-foreground">
                <p className="font-medium text-foreground">
                  {order.customer.first_name} {order.customer.last_name}
                </p>
                {order.customer.address && <p>{order.customer.address}</p>}
                {(order.customer.city || order.customer.postal_code) && (
                  <p>
                    {order.customer.postal_code} {order.customer.city}
                  </p>
                )}
                {order.customer.country && <p>{order.customer.country}</p>}
                {order.customer.phone && (
                  <p className="mt-2">
                    <span className="text-foreground">Tél:</span> {order.customer.phone}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          <div className="rounded-xl bg-card border border-border p-6 sticky top-4">
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-neon-cyan" />
              {dict.orders.orderSummary}
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-muted-foreground">
                <span>{dict.orders.subtotal}</span>
                <span>
                  {order.subtotal.toFixed(2)} {order.currency}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>{dict.orders.shipping}</span>
                <span>
                  {order.shipping_cost.toFixed(2)} {order.currency}
                </span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex justify-between text-foreground">
                  <span className="font-semibold">{dict.orders.total}</span>
                  <span className="text-2xl font-bold text-neon-cyan">
                    {order.total.toFixed(2)} {order.currency}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              {order.status !== "canceled" && order.status !== "completed" && (
                <button className="w-full rounded-lg bg-foreground text-background px-4 py-3 font-medium hover:bg-neon-cyan transition-all">
                  {dict.orders.trackOrder}
                </button>
              )}
              <Link
                href={`/${lang}/orders`}
                className="block w-full text-center rounded-lg border border-border px-4 py-3 font-medium hover:border-neon-cyan hover:text-neon-cyan transition-all"
              >
                {dict.common.back}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

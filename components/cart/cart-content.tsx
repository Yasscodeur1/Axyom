"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, Sparkles, ArrowRight, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "./cart-context";
import { FREE_SHIPPING_THRESHOLD, SUBSCRIPTION_PRICE } from "@/lib/types";
import { cn } from "@/lib/utils";

export function CartContent() {
  const {
    items,
    isSubscriber,
    removeItem,
    updateQuantity,
    toggleSubscription,
    subtotal,
    shippingCost,
    total,
    amountUntilFreeShipping,
    hasFreeShipping,
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="mt-6 text-xl font-medium text-foreground">Your cart is empty</h2>
        <p className="mt-2 text-muted-foreground">
          Looks like you have not added anything to your cart yet.
        </p>
        <Button asChild className="mt-8">
          <Link href="/products">
            Start Shopping
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    );
  }

  const progressPercentage = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  return (
    <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
      {/* Cart Items */}
      <div className="lg:col-span-2">
        {/* Free Shipping Progress */}
        {!isSubscriber && (
          <div className="mb-8 rounded-xl bg-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <Truck className="h-5 w-5 text-neon-cyan" />
              <span className="text-sm font-medium text-foreground">
                {hasFreeShipping
                  ? "You have unlocked free delivery!"
                  : `Only ${amountUntilFreeShipping.toFixed(2)} EUR away from free delivery`}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full bg-neon-cyan transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Free delivery on orders over {FREE_SHIPPING_THRESHOLD} EUR
            </p>
          </div>
        )}

        {/* Items List */}
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={`${item.product.id}-${item.size}-${item.color}`}
              className="flex gap-4 rounded-xl bg-card p-4 lg:p-5"
            >
              <Link
                href={`/products/${item.product.slug}`}
                className="relative aspect-square w-24 lg:w-32 shrink-0 overflow-hidden rounded-lg"
              >
                <Image
                  src={item.product.images[0] || "/placeholder.svg"}
                  alt={item.product.name}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              </Link>

              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="font-medium text-foreground hover:text-neon-cyan transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    <div className="mt-1 flex flex-wrap gap-2 text-sm text-muted-foreground">
                      <span>Size: {item.size}</span>
                      <span>|</span>
                      <span>Color: {item.color}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.product.id, item.size, item.color)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-auto pt-4 flex items-center justify-between">
                  <div className="flex items-center rounded-lg border border-border">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)
                      }
                      className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium text-foreground">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)
                      }
                      className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <span className="font-semibold text-foreground">
                    {(item.product.price * item.quantity).toFixed(2)} EUR
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="sticky top-28 rounded-xl bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">Order Summary</h2>

          {/* Subscription Toggle */}
          <div className="mt-6">
            <button
              type="button"
              onClick={toggleSubscription}
              className={cn(
                "w-full rounded-xl border p-4 text-left transition-all",
                isSubscriber
                  ? "border-neon-cyan bg-neon-cyan/10"
                  : "border-border hover:border-neon-cyan/50"
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border mt-0.5",
                    isSubscriber
                      ? "border-neon-cyan bg-neon-cyan"
                      : "border-muted-foreground"
                  )}
                >
                  {isSubscriber && (
                    <span className="h-2 w-2 rounded-full bg-background" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-neon-cyan" />
                    <span className="font-medium text-foreground">NOVA Membership</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Get free delivery on all orders for {SUBSCRIPTION_PRICE.toFixed(2)} EUR/month
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Summary Lines */}
          <div className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground">{subtotal.toFixed(2)} EUR</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className={cn(hasFreeShipping && "text-neon-cyan")}>
                {hasFreeShipping ? "Free" : `${shippingCost.toFixed(2)} EUR`}
              </span>
            </div>
            {isSubscriber && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Membership (monthly)</span>
                <span className="text-foreground">{SUBSCRIPTION_PRICE.toFixed(2)} EUR</span>
              </div>
            )}
            <div className="border-t border-border pt-3">
              <div className="flex justify-between text-base font-semibold">
                <span className="text-foreground">Total</span>
                <span className="text-foreground">
                  {(total + (isSubscriber ? SUBSCRIPTION_PRICE : 0)).toFixed(2)} EUR
                </span>
              </div>
            </div>
          </div>

          {/* Checkout Button */}
          <Button
            asChild
            size="lg"
            className="mt-6 w-full h-14 text-base font-medium bg-foreground text-background hover:bg-neon-cyan transition-all"
          >
            <Link href="/checkout">
              Proceed to Checkout
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>

          {/* Trust Badges */}
          <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span>Secure Checkout</span>
            <span>|</span>
            <span>SSL Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}

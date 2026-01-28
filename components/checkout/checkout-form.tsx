"use client";

import React from "react"

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, CreditCard, ShieldCheck, Truck, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/components/cart/cart-context";
import { SUBSCRIPTION_PRICE, FREE_SHIPPING_THRESHOLD } from "@/lib/types";
import { cn } from "@/lib/utils";

type CheckoutStep = "information" | "payment" | "confirmation";

export function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal, shippingCost, total, isSubscriber, hasFreeShipping, clearCart } = useCart();
  const [step, setStep] = useState<CheckoutStep>("information");
  const [isProcessing, setIsProcessing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "France",
    phone: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setStep("confirmation");
    setIsProcessing(false);
    clearCart();
  };

  if (items.length === 0 && step !== "confirmation") {
    router.push("/cart");
    return null;
  }

  if (step === "confirmation") {
    return (
      <div className="max-w-lg mx-auto py-16 text-center">
        <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-neon-cyan/10">
          <Check className="h-10 w-10 text-neon-cyan" />
        </div>
        <h1 className="mt-6 font-serif text-3xl text-foreground">Order Confirmed</h1>
        <p className="mt-4 text-muted-foreground">
          Thank you for your order! We have sent a confirmation email to {formData.email}.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Order number: #NOVA-{Date.now().toString(36).toUpperCase()}
        </p>
        <Button asChild className="mt-8">
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
      {/* Form Section */}
      <div className="order-2 lg:order-1">
        <Link
          href="/cart"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to cart
        </Link>

        {/* Step Indicator */}
        <div className="flex items-center gap-3 mb-8">
          <span
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
              step === "information"
                ? "bg-foreground text-background"
                : "bg-neon-cyan text-background"
            )}
          >
            {step === "information" ? "1" : <Check className="h-4 w-4" />}
          </span>
          <span className="h-px flex-1 bg-border" />
          <span
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
              step === "payment"
                ? "bg-foreground text-background"
                : "bg-secondary text-muted-foreground"
            )}
          >
            2
          </span>
        </div>

        {step === "information" && (
          <form onSubmit={handleContinueToPayment} className="space-y-6">
            <h2 className="font-serif text-2xl text-foreground">Contact & Shipping</h2>

            {/* Contact */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  className="mt-1.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  className="mt-1.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    required
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="country">Country</Label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="France">France</option>
                  <option value="Germany">Germany</option>
                  <option value="Belgium">Belgium</option>
                  <option value="Netherlands">Netherlands</option>
                  <option value="Spain">Spain</option>
                  <option value="Italy">Italy</option>
                </select>
              </div>

              <div>
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-1.5"
                />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full h-14 text-base font-medium bg-foreground text-background hover:bg-neon-cyan transition-all"
            >
              Continue to Payment
            </Button>
          </form>
        )}

        {step === "payment" && (
          <form onSubmit={handlePlaceOrder} className="space-y-6">
            <h2 className="font-serif text-2xl text-foreground">Payment</h2>

            <div className="rounded-xl border border-border p-5">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium text-foreground">Credit Card</span>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    className="mt-1.5"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      className="mt-1.5"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvc">CVC</Label>
                    <Input
                      id="cvc"
                      placeholder="123"
                      className="mt-1.5"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-6 py-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5" />
                SSL Secured
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                256-bit Encryption
              </span>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => setStep("information")}
                className="h-14"
              >
                Back
              </Button>
              <Button
                type="submit"
                size="lg"
                disabled={isProcessing}
                className="flex-1 h-14 text-base font-medium bg-foreground text-background hover:bg-neon-cyan transition-all"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Processing...
                  </span>
                ) : (
                  `Pay ${(total + (isSubscriber ? SUBSCRIPTION_PRICE : 0)).toFixed(2)} EUR`
                )}
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Order Summary */}
      <div className="order-1 lg:order-2">
        <div className="lg:sticky lg:top-28 rounded-xl bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Order Summary</h2>

          {/* Items */}
          <div className="space-y-4 max-h-[300px] overflow-y-auto">
            {items.map((item) => (
              <div
                key={`${item.product.id}-${item.size}-${item.color}`}
                className="flex gap-3"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={item.product.images[0] || "/placeholder.svg"}
                    alt={item.product.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-xs font-medium text-background">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground line-clamp-1">{item.product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.size} / {item.color}
                  </p>
                </div>
                <span className="text-sm font-medium text-foreground">
                  {(item.product.price * item.quantity).toFixed(2)} EUR
                </span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-6 space-y-3 border-t border-border pt-4 text-sm">
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
                <span className="text-muted-foreground">NOVA Membership</span>
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

          {/* Shipping Info */}
          <div className="mt-6 flex items-center gap-2 rounded-lg bg-secondary p-3 text-xs text-muted-foreground">
            <Truck className="h-4 w-4 text-neon-cyan shrink-0" />
            <span>
              {hasFreeShipping
                ? "Your order qualifies for free delivery"
                : `Add ${(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)} EUR more for free delivery`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

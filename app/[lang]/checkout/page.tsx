import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your purchase securely.",
};

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-8 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <CheckoutForm />
        </div>
      </main>
    </>
  );
}

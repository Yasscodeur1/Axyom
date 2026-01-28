import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Footer } from "@/components/layout/footer";
import { CartContent } from "@/components/cart/cart-content";

export const metadata: Metadata = {
  title: "Shopping Cart",
  description: "Review your cart and proceed to checkout.",
};

export default function CartPage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-24 lg:pb-8">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h1 className="font-serif text-3xl lg:text-4xl text-foreground mb-8">Shopping Cart</h1>
          <CartContent />
        </div>
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}

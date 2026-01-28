import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Footer } from "@/components/layout/footer";
import { SubscriptionContent } from "@/components/subscription/subscription-content";

export const metadata: Metadata = {
  title: "NOVA Membership",
  description:
    "Join NOVA Membership for unlimited free delivery, exclusive discounts, and early access to new collections.",
};

export default function SubscribePage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-24 lg:pb-8">
        <SubscriptionContent />
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}

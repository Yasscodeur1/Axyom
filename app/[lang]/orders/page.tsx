import { getDictionary } from "@/lib/get-dictionary";
import { OrderHistoryContent } from "@/components/orders/order-history-content";
import Link from "next/link";
import { Package } from "lucide-react";

export default async function OrdersPage({
  params,
}: {
  params: Promise<{ lang: "en" | "fr" }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/${lang}`}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-neon-cyan transition-colors mb-4"
          >
            ← {dict.common.backToHome}
          </Link>
          <div className="flex items-center gap-4">
            <Package className="h-8 w-8 text-neon-cyan" />
            <h1 className="text-4xl font-bold text-foreground">
              {dict.orders.title}
            </h1>
          </div>
          <p className="text-muted-foreground mt-2">
            {dict.orders.description}
          </p>
        </div>

        {/* Orders List */}
        <OrderHistoryContent lang={lang} dict={dict} />
      </div>
    </div>
  );
}

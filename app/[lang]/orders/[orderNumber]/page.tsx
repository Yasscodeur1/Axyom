import { getDictionary } from "@/lib/get-dictionary";
import { OrderDetailsContent } from "@/components/orders/order-details-content";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ lang: "en" | "fr"; orderNumber: string }>;
}) {
  const { lang, orderNumber } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/${lang}/orders`}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-neon-cyan transition-colors mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {dict.common.back}
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              {dict.orders.orderDetails}
            </h1>
            <p className="text-lg text-muted-foreground">
              {dict.orders.orderNumber} #{orderNumber}
            </p>
          </div>
        </div>

        {/* Order Details */}
        <OrderDetailsContent
          orderNumber={orderNumber}
          lang={lang}
          dict={dict}
        />
      </div>
    </div>
  );
}

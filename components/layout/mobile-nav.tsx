"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid3X3, Sparkles, BookOpen, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  lang: string;
  dict: any;
}

export function MobileNav({ lang, dict }: MobileNavProps) {
  const pathname = usePathname();
  const { itemCount } = useCart();

  const navItems = [
    { name: dict.navigation.home, href: `/${lang}`, icon: Home },
    { name: dict.navigation.shop, href: `/${lang}/products`, icon: Grid3X3 },
    { name: dict.navigation.subscribe, href: `/${lang}/subscribe`, icon: Sparkles },
    { name: dict.navigation.journal, href: `/${lang}/blog`, icon: BookOpen },
    { name: dict.navigation.cart, href: `/${lang}/cart`, icon: ShoppingBag },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass lg:hidden">
      <div className="flex items-center justify-around py-3 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== `/${lang}` && pathname.startsWith(item.href));
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors relative",
                isActive
                  ? "text-neon-cyan"
                  : "text-foreground/60 hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.name}</span>
              {item.name === dict.navigation.cart && itemCount > 0 && (
                <span className="absolute -top-1 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-neon-cyan text-[10px] font-bold text-background">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

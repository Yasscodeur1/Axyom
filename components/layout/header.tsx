"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ShoppingBag, Search, User, Globe } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface HeaderProps {
  lang: string;
  dict: any;
}

export function Header({ lang, dict }: HeaderProps) {
  const { itemCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: dict.navigation.shop, href: `/${lang}/products` },
    { name: dict.navigation.collections, href: `/${lang}/products?collection=new` },
    { name: dict.navigation.subscribe, href: `/${lang}/subscribe` },
    { name: dict.navigation.journal, href: `/${lang}/blog` },
  ];

  const otherLang = lang === 'en' ? 'fr' : 'en';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full bg-background border-border">
              <div className="flex items-center justify-between mb-8">
                <Link href={`/${lang}`} className="font-serif text-2xl tracking-wider" onClick={() => setIsOpen(false)}>
                  AXYOM
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <div className="flex flex-col gap-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-xl font-medium text-foreground/80 hover:text-neon-cyan transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href={`/${lang}`} className="font-serif text-2xl tracking-widest text-foreground hover:text-neon-cyan transition-colors">
            AXYOM
          </Link>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-10">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium uppercase tracking-wider text-foreground/80 hover:text-neon-cyan transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right side icons */}
        <div className="flex flex-1 items-center justify-end gap-2">
          <Button variant="ghost" size="icon" className="hidden lg:flex text-foreground/80 hover:text-neon-cyan">
            <Search className="h-5 w-5" />
            <span className="sr-only">{dict.navigation.search}</span>
          </Button>
          <Button variant="ghost" size="icon" className="hidden lg:flex text-foreground/80 hover:text-neon-cyan">
            <User className="h-5 w-5" />
            <span className="sr-only">{dict.navigation.account}</span>
          </Button>
          {/* Language selector */}
          <Link href={`/${otherLang}${typeof window !== 'undefined' ? window.location.pathname.replace(`/${lang}`, '') : ''}`}>
            <Button variant="ghost" size="icon" className="text-foreground/80 hover:text-neon-cyan" title={otherLang.toUpperCase()}>
              <Globe className="h-5 w-5" />
              <span className="sr-only">Change language</span>
            </Button>
          </Link>
          <Link href={`/${lang}/cart`}>
            <Button variant="ghost" size="icon" className="relative text-foreground/80 hover:text-neon-cyan">
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-neon-cyan text-xs font-medium text-background">
                  {itemCount}
                </span>
              )}
              <span className="sr-only">{dict.navigation.cart}</span>
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}

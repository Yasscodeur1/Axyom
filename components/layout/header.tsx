"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ShoppingBag, Search, User, Globe, Package, LogOut } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { useAuth } from "@/components/auth/auth-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useRouter, usePathname } from "next/navigation";

interface HeaderProps {
  lang: string;
  dict: any;
}

export function Header({ lang, dict }: HeaderProps) {
  const { itemCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true)
  }, [])

  // Fermer la recherche quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
        setSearchQuery("");
      }
    };

    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen]);
  
  if (!mounted) {
    return null
  }

  const handleLogout = async () => {
    await logout();
    router.push(`/${lang}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Rediriger vers la page de recherche avec le query
      router.push(`/${lang}/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsSearchOpen(false);
    }
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      // Focus sur l'input après l'animation
      setTimeout(() => {
        const input = document.getElementById("search-input");
        if (input) input.focus();
      }, 100);
    }
  };

  const navigation = [
    { name: dict.navigation.shop, href: `/${lang}/products` },
    { name: dict.navigation.collections, href: `/${lang}/products?collection=new` },
    { name: dict.navigation.subscribe, href: `/${lang}/subscribe` },
    { name: dict.navigation.journal, href: `/${lang}/blog` },
    { name: dict.navigation.contact, href: `/${lang}/contact` },
  ];

  const otherLang = lang === 'en' ? 'fr' : 'en';
  
  // Fonction pour changer la langue tout en restant sur la même page
  const switchLanguage = () => {
    // Récupérer le pathname actuel et remplacer la langue
    const currentPath = pathname || `/${lang}`;
    const newPath = currentPath.replace(`/${lang}`, `/${otherLang}`);
    router.push(newPath);
  };

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
                <Link href={`/${lang}`} className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                  <Image src="/Axyom.png" alt="AXYOM Logo" width={64} height={64} className="object-contain" />
                  <span className="font-serif text-2xl tracking-wider">AXYOM</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <div className="flex flex-col gap-6">
                {navigation.map((item, index) => (
                  <Link
                    key={`${item.href}-${index}`}
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
          <Link href={`/${lang}`} className="flex items-center gap-1 font-serif text-2xl tracking-widest text-foreground hover:text-neon-cyan transition-colors">
            <Image src="/Axyomshop1.png" alt="AXYOM Logo" width={172} height={72} className="object-contain" />
            {/* <span>XYOMSHOP</span> */}
          </Link>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-10">
          {navigation.map((item, index) => (
            <Link
              key={`${item.href}-${index}`}
              href={item.href}
              className="text-sm font-medium uppercase tracking-wider text-foreground/80 hover:text-neon-cyan transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right side icons */}
        <div className="flex flex-1 items-center justify-end gap-2">
          {/* Search bar with animation */}
          <div ref={searchRef} className="hidden lg:flex items-center gap-2">
            <form onSubmit={handleSearch} className="flex items-center">
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  isSearchOpen ? "w-64 opacity-100" : "w-0 opacity-0"
                )}
              >
                <Input
                  id="search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === 'fr' ? 'Rechercher...' : 'Search...'}
                  className="h-9 bg-background/50 border-border focus:border-neon-cyan"
                />
              </div>
              <Button
                type={isSearchOpen ? "submit" : "button"}
                variant="ghost"
                size="icon"
                onClick={isSearchOpen ? undefined : toggleSearch}
                className="text-foreground/80 hover:text-neon-cyan transition-colors"
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">{dict.navigation.search}</span>
              </Button>
            </form>
          </div>
          
          <Link href={`/${lang}/orders`}>
            <Button variant="ghost" size="icon" className="hidden lg:flex text-foreground/80 hover:text-neon-cyan">
              <Package className="h-5 w-5" />
              <span className="sr-only">{dict.orders?.title || "Orders"}</span>
            </Button>
          </Link>
          
          {/* User menu - différent si connecté ou non */}
          {isAuthenticated && user ? (
            <div className="hidden lg:flex items-center gap-2">
              <div className="text-sm text-foreground/80 px-2">
                {lang === 'fr' ? 'Bonjour' : 'Hello'}, <span className="text-neon-cyan font-medium">{user.first_name}</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleLogout}
                className="text-foreground/80 hover:text-destructive"
                title={lang === 'fr' ? 'Se déconnecter' : 'Logout'}
              >
                <LogOut className="h-5 w-5" />
                <span className="sr-only">{lang === 'fr' ? 'Se déconnecter' : 'Logout'}</span>
              </Button>
            </div>
          ) : (
            <Link href={`/${lang}/login`}>
              <Button variant="ghost" size="icon" className="hidden lg:flex text-foreground/80 hover:text-neon-cyan">
                <User className="h-5 w-5" />
                <span className="sr-only">{dict.navigation.account}</span>
              </Button>
            </Link>
          )}
          
          {/* Language selector */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={switchLanguage}
            className="text-foreground/80 hover:text-neon-cyan" 
            title={otherLang.toUpperCase()}
          >
            <Globe className="h-5 w-5" />
            <span className="sr-only">Change language</span>
          </Button>
          
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

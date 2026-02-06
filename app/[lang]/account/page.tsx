"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-context";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Footer } from "@/components/layout/footer";
import { User, Package, Crown, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

interface AccountPageProps {
  params: Promise<{ lang: string }>;
}

export default function AccountPage({ params }: AccountPageProps) {
  const router = useRouter();
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const [lang, setLang] = React.useState("fr");
  const [dict, setDict] = React.useState<any>(null);

  React.useEffect(() => {
    params.then(({ lang: paramLang }) => {
      setLang(paramLang);
      import(`@/dictionaries/${paramLang}.json`).then((module) => {
        setDict(module.default);
      });
    });
  }, [params]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/${lang}/login`);
    }
  }, [isAuthenticated, isLoading, router, lang]);

  if (isLoading || !dict) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neon-cyan border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    router.push(`/${lang}`);
  };

  return (
    <>
      <Header lang={lang} dict={dict} />
      <main className="min-h-screen bg-background py-12 px-4 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="font-serif text-4xl text-foreground">
              {lang === "fr" ? "Mon Compte" : "My Account"}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {lang === "fr" 
                ? "Gérez vos informations et vos commandes" 
                : "Manage your information and orders"}
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="rounded-xl bg-card p-6 space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b border-border">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neon-cyan/10">
                    <User className="h-6 w-6 text-neon-cyan" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                {user.is_member && (
                  <div className="rounded-lg bg-linear-to-r from-neon-cyan/20 to-green-500/20 border border-neon-cyan/30 p-4">
                    <div className="flex items-center gap-2 text-neon-cyan mb-2">
                      <Crown className="h-5 w-5" />
                      <span className="font-semibold">
                        {lang === "fr" ? "Membre Premium" : "Premium Member"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {lang === "fr" 
                        ? `Plan : ${user.subscription_plan === "annual" ? "Annuel" : "Mensuel"}`
                        : `Plan: ${user.subscription_plan === "annual" ? "Annual" : "Monthly"}`}
                    </p>
                    {user.subscription_expires_at && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {lang === "fr" ? "Expire le : " : "Expires: "}
                        {new Date(user.subscription_expires_at).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US")}
                      </p>
                    )}
                  </div>
                )}

                <nav className="space-y-1">
                  <Link
                    href={`/${lang}/orders`}
                    className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-neon-cyan/10 hover:text-neon-cyan transition-colors"
                  >
                    <Package className="h-4 w-4" />
                    {lang === "fr" ? "Mes Commandes" : "My Orders"}
                  </Link>
                  <Link
                    href={`/${lang}/subscribe`}
                    className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-neon-cyan/10 hover:text-neon-cyan transition-colors"
                  >
                    <Crown className="h-4 w-4" />
                    {lang === "fr" ? "Abonnement" : "Subscription"}
                  </Link>
                </nav>

                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  {lang === "fr" ? "Déconnexion" : "Logout"}
                </Button>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <div className="rounded-xl bg-card p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  {lang === "fr" ? "Informations Personnelles" : "Personal Information"}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {lang === "fr" ? "Prénom" : "First Name"}
                    </p>
                    <p className="font-medium text-foreground">{user.first_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {lang === "fr" ? "Nom" : "Last Name"}
                    </p>
                    <p className="font-medium text-foreground">{user.last_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground">{user.email}</p>
                  </div>
                  {user.phone && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {lang === "fr" ? "Téléphone" : "Phone"}
                      </p>
                      <p className="font-medium text-foreground">{user.phone}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping Address */}
              {(user.address || user.city || user.postal_code) && (
                <div className="rounded-xl bg-card p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    {lang === "fr" ? "Adresse de Livraison" : "Shipping Address"}
                  </h2>
                  <div className="space-y-2">
                    {user.address && (
                      <p className="text-foreground">{user.address}</p>
                    )}
                    <p className="text-foreground">
                      {user.postal_code && `${user.postal_code} `}
                      {user.city}
                    </p>
                    {user.country && (
                      <p className="text-foreground">{user.country}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer lang={lang} dict={dict} />
      <MobileNav lang={lang} dict={dict} />
    </>
  );
}
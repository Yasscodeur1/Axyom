"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Truck,
  Tag,
  Sparkles,
  Gift,
  Clock,
  Shield,
  X,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SUBSCRIPTION_PRICE } from "@/lib/types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useAuth } from "@/components/auth/auth-context";

interface SubscriptionContentProps {
  lang: string;
  dict: any;
}

export function SubscriptionContent({ lang, dict }: SubscriptionContentProps) {
  const router = useRouter();
  const { user, isAuthenticated: userIsAuthenticated } = useAuth();
  const [isAnnual, setIsAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isSubscribing, setIsSubscribing] = useState(false);

  const isMember = user?.is_member || false;
  const monthlyPrice = SUBSCRIPTION_PRICE;
  const annualPrice = monthlyPrice * 10; // 2 months free
  const currentPrice = isAnnual ? annualPrice : monthlyPrice;
  const savings = isAnnual ? monthlyPrice * 2 : 0;

  const handleSubscription = async () => {
    setIsSubscribing(true);
    
    // Récupérer le token d'authentification
    const token = localStorage.getItem("auth_token");

    if (!token) {
      // Rediriger vers la page de connexion
      router.push(`/${lang}/login?redirect=subscribe`);
      setIsSubscribing(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/create-subscription-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          plan: isAnnual ? "annual" : "monthly"
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirection vers la page de paiement Stripe
        window.location.href = data.url;
      } else {
        // Gère les erreurs renvoyées par Laravel
        alert(data.message || (lang === "fr" 
          ? "Une erreur est survenue lors de la création de la session de paiement." 
          : "An error occurred while creating the payment session."));
        setIsSubscribing(false);
      }
    } catch (error) {
      console.error("Erreur réseau ou serveur :", error);
      alert(lang === "fr" 
        ? "Impossible de contacter le serveur." 
        : "Unable to contact the server.");
      setIsSubscribing(false);
    }
  };

  const benefits = [
    {
      icon: Truck,
      title: dict.subscription.benefits.freeDelivery.title,
      description: dict.subscription.benefits.freeDelivery.description,
    },
    {
      icon: Tag,
      title: dict.subscription.benefits.discounts.title,
      description: dict.subscription.benefits.discounts.description,
    },
    {
      icon: Sparkles,
      title: dict.subscription.benefits.earlyAccess.title,
      description: dict.subscription.benefits.earlyAccess.description,
    },
    {
      icon: Gift,
      title: dict.subscription.benefits.birthday.title,
      description: dict.subscription.benefits.birthday.description,
    },
    {
      icon: Clock,
      title: dict.subscription.benefits.support.title,
      description: dict.subscription.benefits.support.description,
    },
    {
      icon: Shield,
      title: dict.subscription.benefits.returns.title,
      description: dict.subscription.benefits.returns.description,
    },
  ];

  const faq = [
    {
      question: dict.subscription.faq.cancel.question,
      answer: dict.subscription.faq.cancel.answer,
    },
    {
      question: dict.subscription.faq.start.question,
      answer: dict.subscription.faq.start.answer,
    },
    {
      question: dict.subscription.faq.pastOrders.question,
      answer: dict.subscription.faq.pastOrders.answer,
    },
    {
      question: dict.subscription.faq.sharing.question,
      answer: dict.subscription.faq.sharing.answer,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8">
      {/* Hero Section */}
      <motion.div
        className="text-center max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-neon-cyan/30 bg-neon-cyan/10 px-4 py-1.5 text-xs font-medium text-neon-cyan">
          <Sparkles className="h-3.5 w-3.5" />
          {dict.subscription.axyomMembership || "Axyomshop Membership"}
        </span>

        <h1 className="mt-6 font-serif text-4xl lg:text-6xl text-foreground">
          {dict.subscription.pageTitle}
          <br />
          <span className="text-neon-cyan">
            {dict.subscription.pageTitleAccent}
          </span>
        </h1>

        <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
          {dict.subscription.pageDescription}
        </p>
      </motion.div>

      {/* Pricing Toggle */}
      <motion.div
        className="mt-12 flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="flex items-center gap-4 rounded-full bg-card p-1.5">
          <button
            type="button"
            onClick={() => setIsAnnual(false)}
            className={cn(
              "rounded-full px-6 py-2 text-sm font-medium transition-all",
              !isAnnual
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {dict.subscription.monthly}
          </button>
          <button
            type="button"
            onClick={() => setIsAnnual(true)}
            className={cn(
              "rounded-full px-6 py-2 text-sm font-medium transition-all",
              isAnnual
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {dict.subscription.annual}
            <span className="ml-2 text-xs text-neon-cyan">
              {lang === "fr" ? "Économisez 2 mois" : "Save 2 months"}
            </span>
          </button>
        </div>
      </motion.div>

      {/* Pricing Card */}
      <motion.div
        className="mt-12 max-w-lg mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="relative rounded-2xl border border-neon-cyan/30 bg-card p-8 lg:p-10">
          {/* Badge */}
          {isAnnual && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center rounded-full bg-neon-cyan px-4 py-1 text-xs font-semibold text-background">
                {lang === "fr" ? "Meilleure Offre" : "Best Value"}
              </span>
            </div>
          )}

          <div className="text-center">
            <h2 className="text-xl font-semibold text-foreground">
              {dict.subscription.axyomMembership || "Axyomshop Membership"}
            </h2>
            <div className="mt-4 flex items-baseline justify-center gap-2">
              <span className="text-5xl font-bold text-foreground">
                {currentPrice.toFixed(2)}
              </span>
              <span className="text-muted-foreground">
                EUR /{" "}
                {isAnnual
                  ? lang === "fr"
                    ? "an"
                    : "year"
                  : lang === "fr"
                    ? "mois"
                    : "month"}
              </span>
            </div>
            {isAnnual && (
              <p className="mt-2 text-sm text-neon-cyan">
                {lang === "fr"
                  ? `Vous économisez ${savings.toFixed(2)} EUR par an`
                  : `You save ${savings.toFixed(2)} EUR per year`}
              </p>
            )}
          </div>

          {/* Features List */}
          <ul className="mt-8 space-y-4">
            {benefits.map((benefit) => (
              <li key={benefit.title} className="flex items-center gap-3">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-neon-cyan/10">
                  <Check className="h-3 w-3 text-neon-cyan" />
                </div>
                <span className="text-sm text-foreground">{benefit.title}</span>
              </li>
            ))}
          </ul>

          {isMember ? (
            <div className="mt-8 w-full rounded-lg bg-linear-to-r from-neon-cyan/20 to-green-500/20 border border-neon-cyan/30 p-6">
              <div className="flex items-center justify-center gap-3 text-neon-cyan">
                <Crown className="h-6 w-6" />
                <span className="font-semibold text-lg">
                  {lang === "fr" 
                    ? "Vous êtes déjà Membre Premium ✨" 
                    : "You are already a Premium Member ✨"}
                </span>
              </div>
              <div className="mt-3 space-y-1 text-center">
                {user?.subscription_plan && (
                  <p className="text-sm text-muted-foreground">
                    {lang === "fr" 
                      ? `Plan actuel : ${user.subscription_plan === "annual" ? "Annuel" : "Mensuel"}`
                      : `Current plan: ${user.subscription_plan === "annual" ? "Annual" : "Monthly"}`}
                  </p>
                )}
                {user?.subscription_expires_at && (
                  <p className="text-sm text-muted-foreground">
                    {lang === "fr" ? "Expire le : " : "Expires: "}
                    {new Date(user.subscription_expires_at).toLocaleDateString(
                      lang === "fr" ? "fr-FR" : "en-US",
                      { year: 'numeric', month: 'long', day: 'numeric' }
                    )}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <Button
              size="lg"
              onClick={handleSubscription}
              disabled={isSubscribing}
              className="mt-8 w-full h-14 text-base font-medium bg-neon-cyan text-background hover:bg-neon-cyan/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubscribing ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  {lang === "fr" ? "Traitement..." : "Processing..."}
                </span>
              ) : (
                lang === "fr" ? "Commencer l'Abonnement" : "Start Membership"
              )}
            </Button>
          )}

          <p className="mt-4 text-center text-xs text-muted-foreground">
            {lang === "fr"
              ? "Annulez à tout moment. Aucun engagement."
              : "Cancel anytime. No commitments."}
          </p>
        </div>
      </motion.div>

      {/* Benefits Grid */}
      <section className="mt-24">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-serif text-3xl lg:text-4xl text-foreground">
            {lang === "fr"
              ? "Tous les Avantages de l'Abonnement"
              : "All Membership Benefits"}
          </h2>
          <p className="mt-4 text-muted-foreground">
            {lang === "fr"
              ? "Tout ce qui est inclus dans votre abonnement Axyomshop"
              : "Everything included in your Axyomshop membership"}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              className="rounded-xl bg-card p-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neon-cyan/10">
                <benefit.icon className="h-6 w-6 text-neon-cyan" />
              </div>
              <h3 className="mt-4 font-medium text-foreground">
                {benefit.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mt-24 max-w-2xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-serif text-3xl lg:text-4xl text-foreground">
            {dict.subscription.faq.title}
          </h2>
        </motion.div>

        <div className="space-y-4">
          {faq.map((item, index) => (
            <motion.div
              key={item.question}
              className="rounded-xl bg-card overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="flex w-full items-center justify-between p-5 text-left"
              >
                <span className="font-medium text-foreground">
                  {item.question}
                </span>
                <span
                  className={cn(
                    "text-muted-foreground transition-transform",
                    openFaq === index && "rotate-45",
                  )}
                >
                  {openFaq === index ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <span className="text-xl">+</span>
                  )}
                </span>
              </button>
              {openFaq === index && (
                <div className="px-5 pb-5">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      {!isMember && (
        <motion.section
          className="mt-24 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-serif text-3xl lg:text-4xl text-foreground">
            {lang === "fr" ? "Prêt à Rejoindre ?" : "Ready to Join?"}
          </h2>
          <p className="mt-4 text-muted-foreground">
            {lang === "fr"
              ? "Commencez à profiter des avantages premium dès aujourd'hui. Annulez à tout moment."
              : "Start enjoying premium benefits today. Cancel anytime."}
          </p>
          <Button
            size="lg"
            onClick={handleSubscription}
            disabled={isSubscribing}
            className="mt-8 h-14 px-12 text-base font-medium bg-foreground text-background hover:bg-neon-cyan transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubscribing ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                {lang === "fr" ? "Traitement..." : "Processing..."}
              </span>
            ) : (
              lang === "fr"
                ? `Commencer pour ${monthlyPrice.toFixed(2)} EUR/mois`
                : `Get Started for ${monthlyPrice.toFixed(2)} EUR/month`
            )}
          </Button>
        </motion.section>
      )}
    </div>
  );
}

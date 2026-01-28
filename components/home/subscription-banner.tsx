"use client";

import Link from "next/link";
import { Truck, Sparkles, Tag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SUBSCRIPTION_PRICE } from "@/lib/types";
import { motion } from "framer-motion";

interface SubscriptionBannerProps {
  lang: string;
  dict: any;
}

export function SubscriptionBanner({ lang, dict }: SubscriptionBannerProps) {
  const benefits = [
    {
      icon: Truck,
      title: "Free Delivery Always",
      description: "No minimum order required",
    },
    {
      icon: Tag,
      title: "Exclusive Discounts",
      description: "Members-only pricing",
    },
    {
      icon: Sparkles,
      title: "Early Access",
      description: "Shop new drops first",
    },
  ];

  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-r from-card via-secondary to-card" />
      <div className="absolute inset-0 bg-neon-cyan/5" />
      
      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-100 bg-neon-cyan/10 rounded-full blur-100" />
      
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="glass rounded-2xl p-8 lg:p-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-neon-cyan/30 bg-neon-cyan/10 px-4 py-1.5 text-xs font-medium text-neon-cyan">
                <Sparkles className="h-3.5 w-3.5" />
                {dict.subscription.badge}
              </span>
              
              <h2 className="mt-6 font-serif text-3xl lg:text-5xl text-foreground">
                {dict.subscription.title}
                <span className="text-neon-cyan"> {dict.subscription.subtitle}</span>
              </h2>
              
              <p className="mt-4 text-muted-foreground leading-relaxed max-w-md">
                {dict.subscription.description}
              </p>
              
              <div className="mt-8 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-foreground">{dict.subscription.price}</span>
              </div>
              
              <Button asChild size="lg" className="mt-6 h-14 px-8 text-base bg-neon-cyan text-background hover:bg-neon-cyan/90 transition-all">
                <Link href={`/${lang}/subscribe`}>
                  {dict.subscription.button}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
            
            <motion.div 
              className="grid gap-6"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {benefits.map((benefit, index) => (
                <div 
                  key={benefit.title}
                  className="flex items-start gap-4 rounded-xl bg-background/50 p-5 backdrop-blur-sm"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-neon-cyan/10">
                    <benefit.icon className="h-6 w-6 text-neon-cyan" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{benefit.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

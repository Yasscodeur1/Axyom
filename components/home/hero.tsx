"use client";

import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAuth } from "@/components/auth/auth-context";
import { RecentlyViewed } from "./recently-viewed";
import { TrendingProducts } from "./trending-products";

interface HeroProps {
  dict: any;
  lang: string;
}

export function Hero({ dict, lang }: HeroProps) {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient - Blueish */}
      <div className="absolute inset-0 bg-linear-to-b from-background via-background to-card" />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />
      
      {/* Neon accent glow - Blue tinted */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600] h-[600] bg-neon-cyan/5 rounded-full blur-[120px]" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-32 w-full lg:px-8">
        {/* Grid layout: 50/50 on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* LEFT SIDE - Hero Content */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="inline-block mb-6 text-xs uppercase tracking-[0.3em] text-neon-cyan">
                {dict.hero.badge}
              </span>
            </motion.div>
            
            <motion.h1 
              className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl tracking-tight text-foreground text-balance"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            >
              {dict.hero.title}
              <br />
              <span className="text-neon-cyan">{dict.hero.titleAccent}</span>
            </motion.h1>
            
            <motion.p 
              className="mt-6 max-w-xl text-base lg:text-lg text-muted-foreground leading-relaxed text-balance mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              {dict.hero.description}
            </motion.p>
            
            <motion.div 
              className="mt-8 flex flex-col sm:flex-row items-center lg:items-start lg:justify-start justify-center gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            >
              <Button asChild size="lg" className="h-12 px-8 text-base font-medium bg-foreground text-background hover:bg-neon-cyan hover:text-background transition-all duration-300">
                <Link href={`/${lang}/products`}>
                  {dict.hero.exploreButton}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base font-medium border-foreground/20 hover:border-neon-cyan hover:text-neon-cyan transition-all duration-300 bg-transparent">
                <Link href={`/${lang}/subscribe`}>
                  {dict.hero.subscribeButton}
                </Link>
              </Button>
            </motion.div>
            
            <motion.div 
              className="mt-12 hidden lg:flex flex-col items-start gap-2 text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <span className="text-xs uppercase tracking-widest">{dict.hero.scrollText}</span>
              <ChevronDown className="h-5 w-5 animate-bounce" />
            </motion.div>
          </div>

          {/* RIGHT SIDE - Recently Viewed or Trending */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 lg:p-8 shadow-xl">
              {isAuthenticated ? (
                <RecentlyViewed lang={lang} dict={dict} />
              ) : (
                <TrendingProducts lang={lang} dict={dict} />
              )}
            </div>
          </motion.div>

        </div>

        {/* Mobile scroll indicator */}
        <motion.div 
          className="mt-16 flex lg:hidden flex-col items-center gap-2 text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <span className="text-xs uppercase tracking-widest">{dict.hero.scrollText}</span>
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
}

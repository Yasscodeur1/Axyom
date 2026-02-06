"use client";

import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface HeroProps {
  dict: any;
}

export function Hero({ dict }: HeroProps) {
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
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-32 text-center lg:px-8">
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
          className="font-serif text-5xl sm:text-6xl lg:text-8xl tracking-tight text-foreground text-balance"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
        >
          {dict.hero.title}
          <br />
          <span className="text-neon-cyan">{dict.hero.titleAccent}</span>
        </motion.h1>
        
        <motion.p 
          className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground leading-relaxed text-balance"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          {dict.hero.description}
        </motion.p>
        
        <motion.div 
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          <Button asChild size="lg" className="h-14 px-8 text-base font-medium bg-foreground text-background hover:bg-neon-cyan hover:text-background transition-all duration-300">
            <Link href="/products">
              {dict.hero.exploreButton}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-14 px-8 text-base font-medium border-foreground/20 hover:border-neon-cyan hover:text-neon-cyan transition-all duration-300 bg-transparent">
            <Link href="/subscribe">
              {dict.hero.subscribeButton}
            </Link>
          </Button>
        </motion.div>
        
        <motion.div 
          className="mt-16 flex flex-col items-center gap-2 text-muted-foreground"
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

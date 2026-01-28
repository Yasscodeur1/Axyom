"use client";

import { useState } from "react";
import { Check, Truck, Tag, Sparkles, Gift, Clock, Shield, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SUBSCRIPTION_PRICE } from "@/lib/types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const benefits = [
  {
    icon: Truck,
    title: "Unlimited Free Delivery",
    description: "Free shipping on every order, no minimum required. Save up to 60 EUR per year.",
  },
  {
    icon: Tag,
    title: "Exclusive Discounts",
    description: "Members-only pricing on select items. Get 10-20% off exclusive products.",
  },
  {
    icon: Sparkles,
    title: "Early Access",
    description: "Shop new collections 48 hours before everyone else.",
  },
  {
    icon: Gift,
    title: "Birthday Reward",
    description: "Receive a special gift on your birthday month.",
  },
  {
    icon: Clock,
    title: "Priority Support",
    description: "Skip the queue with dedicated member support.",
  },
  {
    icon: Shield,
    title: "Extended Returns",
    description: "60-day returns instead of the standard 30 days.",
  },
];

const faq = [
  {
    question: "Can I cancel anytime?",
    answer: "Yes, you can cancel your membership at any time. There are no long-term commitments or cancellation fees.",
  },
  {
    question: "When does my membership start?",
    answer: "Your membership starts immediately after sign-up. You will be charged monthly from your sign-up date.",
  },
  {
    question: "Does membership include past orders?",
    answer: "Membership benefits apply to all future orders. Past orders are not affected.",
  },
  {
    question: "Can I share my membership?",
    answer: "Membership is tied to your account and cannot be shared. Each member receives their own personalized benefits.",
  },
];

export function SubscriptionContent() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const monthlyPrice = SUBSCRIPTION_PRICE;
  const annualPrice = monthlyPrice * 10; // 2 months free
  const currentPrice = isAnnual ? annualPrice : monthlyPrice;
  const savings = isAnnual ? monthlyPrice * 2 : 0;

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
          NOVA Membership
        </span>
        
        <h1 className="mt-6 font-serif text-4xl lg:text-6xl text-foreground">
          Unlock Premium
          <br />
          <span className="text-neon-cyan">Benefits</span>
        </h1>
        
        <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
          Join thousands of members enjoying unlimited free delivery, exclusive discounts, 
          and early access to new collections.
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
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setIsAnnual(true)}
            className={cn(
              "rounded-full px-6 py-2 text-sm font-medium transition-all",
              isAnnual
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Annual
            <span className="ml-2 text-xs text-neon-cyan">Save 2 months</span>
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
                Best Value
              </span>
            </div>
          )}

          <div className="text-center">
            <h2 className="text-xl font-semibold text-foreground">NOVA Membership</h2>
            <div className="mt-4 flex items-baseline justify-center gap-2">
              <span className="text-5xl font-bold text-foreground">{currentPrice.toFixed(2)}</span>
              <span className="text-muted-foreground">EUR / {isAnnual ? "year" : "month"}</span>
            </div>
            {isAnnual && (
              <p className="mt-2 text-sm text-neon-cyan">
                You save {savings.toFixed(2)} EUR per year
              </p>
            )}
          </div>

          {/* Features List */}
          <ul className="mt-8 space-y-4">
            {[
              "Unlimited free delivery",
              "Exclusive member discounts",
              "48-hour early access",
              "Birthday reward",
              "Priority support",
              "60-day returns",
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-neon-cyan/10">
                  <Check className="h-3 w-3 text-neon-cyan" />
                </div>
                <span className="text-sm text-foreground">{feature}</span>
              </li>
            ))}
          </ul>

          <Button
            size="lg"
            className="mt-8 w-full h-14 text-base font-medium bg-neon-cyan text-background hover:bg-neon-cyan/90 transition-all"
          >
            Start Membership
          </Button>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Cancel anytime. No commitments.
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
          <h2 className="font-serif text-3xl lg:text-4xl text-foreground">All Membership Benefits</h2>
          <p className="mt-4 text-muted-foreground">Everything included in your NOVA membership</p>
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
              <h3 className="mt-4 font-medium text-foreground">{benefit.title}</h3>
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
          <h2 className="font-serif text-3xl lg:text-4xl text-foreground">Frequently Asked Questions</h2>
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
                <span className="font-medium text-foreground">{item.question}</span>
                <span className={cn(
                  "text-muted-foreground transition-transform",
                  openFaq === index && "rotate-45"
                )}>
                  {openFaq === index ? <X className="h-5 w-5" /> : <span className="text-xl">+</span>}
                </span>
              </button>
              {openFaq === index && (
                <div className="px-5 pb-5">
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <motion.section 
        className="mt-24 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="font-serif text-3xl lg:text-4xl text-foreground">Ready to Join?</h2>
        <p className="mt-4 text-muted-foreground">
          Start enjoying premium benefits today. Cancel anytime.
        </p>
        <Button
          size="lg"
          className="mt-8 h-14 px-12 text-base font-medium bg-foreground text-background hover:bg-neon-cyan transition-all"
        >
          Get Started for {monthlyPrice.toFixed(2)} EUR/month
        </Button>
      </motion.section>
    </div>
  );
}

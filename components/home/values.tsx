"use client";

import { Leaf, Recycle, Heart, Shield } from "lucide-react";
import { motion } from "framer-motion";

interface ValuesProps {
  dict: any;
}

export function Values({ dict }: ValuesProps) {
  const values = [
    {
      icon: Leaf,
      title: dict.values.sustainable.title,
      description: dict.values.sustainable.description,
    },
    {
      icon: Recycle,
      title: dict.values.innovative.title,
      description: dict.values.innovative.description,
    },
    {
      icon: Heart,
      title: dict.values.timeless.title,
      description: dict.values.timeless.description,
    },
    {
      icon: Shield,
      title: dict.values.luxury.title,
      description: dict.values.luxury.description,
    },
  ];

  return (
    <section className="py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs uppercase tracking-[0.2em] text-neon-cyan">Our Promise</span>
          <h2 className="mt-2 font-serif text-3xl lg:text-4xl text-foreground">{dict.values.title}</h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            Fashion that feels as good as it looks. We are committed to creating 
            beautiful clothing that respects people and planet.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              className="text-center group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary group-hover:bg-neon-cyan/10 transition-colors duration-300">
                <value.icon className="h-8 w-8 text-neon-cyan" />
              </div>
              <h3 className="mt-6 font-medium text-foreground">{value.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

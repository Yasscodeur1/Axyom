"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import type { BlogPost } from "@/lib/types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
  lang: string;
  dict: any;
}

export function BlogCard({ post, featured = false, lang, dict }: BlogCardProps) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (featured) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="md:col-span-2"
      >
        <Link href={`/${lang}/blog/${post.slug}`} className="group block">
          <div className="grid md:grid-cols-2 gap-6 rounded-2xl bg-card overflow-hidden">
            <div className="relative aspect-4/3 md:aspect-auto">
              <Image
                src={post.coverImage || "/placeholder.svg"}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority
              />
            </div>
            <div className="flex flex-col justify-center p-6 md:p-8">
              <span className="inline-block w-fit rounded-full bg-neon-cyan/10 px-3 py-1 text-xs font-medium text-neon-cyan">
                {dict.blog.categories[post.category as keyof typeof dict.blog.categories] || post.category}
              </span>
              <h2 className="mt-4 font-serif text-2xl lg:text-3xl text-foreground group-hover:text-neon-cyan transition-colors text-balance">
                {post.title}
              </h2>
              <p className="mt-3 text-muted-foreground line-clamp-2 leading-relaxed">
                {post.excerpt}
              </p>
              <div className="mt-6 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Image
                    src={post.author.avatar || "/placeholder.svg"}
                    alt={post.author.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <span className="text-sm text-foreground">{post.author.name}</span>
                </div>
                <span className="text-muted-foreground">|</span>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {post.readTime} {dict.blog.readTime}
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link href={`/${lang}/blog/${post.slug}`} className="group block">
        <div className="relative aspect-16/10 overflow-hidden rounded-xl">
          <Image
            src={post.coverImage || "/placeholder.svg"}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <span className="inline-block rounded-full bg-neon-cyan/10 backdrop-blur-sm px-3 py-1 text-xs font-medium text-neon-cyan">
              {dict.blog.categories[post.category as keyof typeof dict.blog.categories] || post.category}
            </span>
          </div>
        </div>
        <div className="mt-4">
          <h2 className="font-serif text-xl text-foreground group-hover:text-neon-cyan transition-colors text-balance">
            {post.title}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {post.excerpt}
          </p>
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>{formattedDate}</span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {post.readTime} {dict.blog.readTime}
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

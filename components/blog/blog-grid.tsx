"use client";

import { useState } from "react";
import { BlogCard } from "./blog-card";
import type { BlogPost } from "@/lib/types";
import { cn } from "@/lib/utils";

interface BlogGridProps {
  posts: BlogPost[];
  categories: string[];
}


export function BlogGrid({ posts, categories }: BlogGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredPosts = selectedCategory
    ? posts.filter((post) => post.category === selectedCategory)
    : posts;

  return (
    <div>
      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        <button
          type="button"
          onClick={() => setSelectedCategory(null)}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition-all",
            !selectedCategory
              ? "bg-foreground text-background"
              : "bg-card text-muted-foreground hover:text-foreground"
          )}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setSelectedCategory(category)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-all",
              selectedCategory === category
                ? "bg-foreground text-background"
                : "bg-card text-muted-foreground hover:text-foreground"
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Posts Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {filteredPosts.map((post, index) => (
          <BlogCard key={post.id} post={post} featured={index === 0 && !selectedCategory} />
        ))}
      </div>
    </div>
  );
}

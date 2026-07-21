"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/lib/cms";
import { asset } from "@/lib/site";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogIndex({
  posts,
  categories,
}: {
  posts: Post[];
  categories: string[];
}) {
  const [category, setCategory] = useState<string | null>(null);
  const visible = category ? posts.filter((p) => p.categories.includes(category)) : posts;

  return (
    <div>
      {/* Category bubbles */}
      <div className="flex flex-wrap gap-2.5" role="group" aria-label="Filter by category">
        <Bubble label="All topics" active={category === null} onClick={() => setCategory(null)} />
        {categories.map((c) => (
          <Bubble key={c} label={c} active={category === c} onClick={() => setCategory(category === c ? null : c)} />
        ))}
      </div>

      {/* Grid */}
      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        {visible.map((post) => (
          <article key={post.slug} className="group">
            <Link
              href={`/blog/${post.slug}`}
              className="relative block aspect-[16/9] overflow-hidden rounded-tile border border-line bg-paper-deep"
            >
              <Image
                src={asset(post.coverImage)}
                alt=""
                fill
                sizes="(max-width: 640px) 92vw, 440px"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <span className="absolute left-4 top-4 rounded-full bg-paper/95 px-3 py-1 text-[12px] font-semibold text-ink">
                {post.category}
              </span>
            </Link>
            <div className="mt-4">
              <p className="text-[13px] font-medium text-ink-soft">
                {formatDate(post.date)} · {post.readingTime} min read
              </p>
              <h3 className="mt-2 text-xl font-bold leading-snug tracking-tight">
                <Link href={`/blog/${post.slug}`} className="hover:text-accent">
                  {post.title}
                </Link>
              </h3>
              <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-ink-soft">
                {post.excerpt}
              </p>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-semibold text-teal hover:text-teal-deep"
              >
                Read more <span aria-hidden>→</span>
              </Link>
            </div>
          </article>
        ))}
      </div>

      {visible.length === 0 && (
        <p className="mt-10 rounded-tile border border-dashed border-line bg-card p-10 text-center text-[15px] text-ink-soft">
          No articles in this category yet — new pieces publish regularly.
        </p>
      )}
    </div>
  );
}

function Bubble({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-[14px] font-medium transition-colors ${
        active
          ? "border-ink bg-ink text-paper"
          : "border-line bg-card text-ink hover:border-ink"
      }`}
    >
      {label}
    </button>
  );
}

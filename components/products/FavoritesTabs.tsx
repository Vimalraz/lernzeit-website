"use client";

import { useState } from "react";
import type { Product } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

const TABS = [
  { key: "bestSeller", label: "Best sellers" },
  { key: "newArrival", label: "New arrivals" },
  { key: "mostGifted", label: "Most gifted" },
] as const;

export default function FavoritesTabs({ products }: { products: Product[] }) {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("bestSeller");
  const visible = products.filter((p) => p.badges[tab]);

  return (
    <div>
      <div
        className="inline-flex gap-1 rounded-full border border-line bg-card p-1.5"
        role="tablist"
        aria-label="Customer favorites"
      >
        {TABS.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full px-5 py-2.5 text-[14px] font-semibold transition-colors ${
              tab === t.key ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  );
}

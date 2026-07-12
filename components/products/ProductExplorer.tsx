"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

type AgeBand = { label: string; min: number; max: number };
type Filters = {
  ageBands: AgeBand[];
  learningNeeds: string[];
  useCases: string[];
};

export default function ProductExplorer({
  products,
  filters,
}: {
  products: Product[];
  filters: Filters;
}) {
  const [age, setAge] = useState<string | null>(null);
  const [need, setNeed] = useState<string | null>(null);
  const [useCase, setUseCase] = useState<string | null>(null);

  const visible = useMemo(() => {
    const band = filters.ageBands.find((b) => b.label === age);
    return products.filter((p) => {
      if (band && (p.age.max < band.min || p.age.min > band.max)) return false;
      if (need && !p.learningNeeds.includes(need)) return false;
      if (useCase && !p.useCases.includes(useCase)) return false;
      return true;
    });
  }, [products, filters.ageBands, age, need, useCase]);

  const hasFilters = age || need || useCase;

  return (
    <div>
      <div className="space-y-4">
        <FilterRow
          label="Age"
          options={filters.ageBands.map((b) => b.label)}
          value={age}
          onChange={setAge}
        />
        <FilterRow
          label="Learning need"
          options={filters.learningNeeds}
          value={need}
          onChange={setNeed}
        />
        <FilterRow
          label="Use case"
          options={filters.useCases}
          value={useCase}
          onChange={setUseCase}
        />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <p className="text-[14px] font-medium text-ink-soft" aria-live="polite">
          {visible.length} {visible.length === 1 ? "set" : "sets"}
          {hasFilters ? " match your filters" : ""}
        </p>
        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              setAge(null);
              setNeed(null);
              setUseCase(null);
            }}
            className="text-[14px] font-semibold text-accent hover:text-accent-deep"
          >
            Clear filters ×
          </button>
        )}
      </div>

      {visible.length > 0 ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-tile border border-dashed border-line bg-card p-12 text-center">
          <p className="text-lg font-semibold">No exact match — yet.</p>
          <p className="mt-2 text-[15px] text-ink-soft">
            Try removing a filter, or tell us what you're looking for — new
            sets are always in the works.
          </p>
        </div>
      )}
    </div>
  );
}

function FilterRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string | null;
  onChange: (v: string | null) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 w-28 flex-none text-[13px] font-semibold uppercase tracking-wider text-ink-soft">
        {label}
      </span>
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(active ? null : opt)}
            className={`rounded-full border px-4 py-2 text-[14px] font-medium transition-colors ${
              active
                ? "border-ink bg-ink text-paper"
                : "border-line bg-card text-ink hover:border-ink"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

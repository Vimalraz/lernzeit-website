import Link from "next/link";
import type { Product } from "@/lib/products";
import Stars from "@/components/ui/Stars";

export default function ComparisonTable({ products }: { products: Product[] }) {
  return (
    <div className="overflow-x-auto rounded-tile border border-line bg-card shadow-card">
      <table className="w-full min-w-[820px] border-collapse text-left">
        <thead>
          <tr className="border-b border-line bg-paper-deep/60 text-[13px] uppercase tracking-wider text-ink-soft">
            <th className="px-6 py-4 font-semibold">Set</th>
            <th className="px-4 py-4 font-semibold">Age</th>
            <th className="px-4 py-4 font-semibold">Cards</th>
            <th className="px-4 py-4 font-semibold">Focus</th>
            <th className="px-4 py-4 font-semibold">Level</th>
            <th className="px-4 py-4 font-semibold">Rating</th>
            <th className="px-4 py-4 font-semibold">Format</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.slug} className="border-b border-line last:border-0 hover:bg-paper/70">
              <td className="px-6 py-4">
                <Link
                  href={`/products/${p.slug}`}
                  className="font-semibold text-ink hover:text-accent"
                >
                  {p.title}
                </Link>
              </td>
              <td className="px-4 py-4 text-[14px] text-ink-soft">{p.age.label}</td>
              <td className="px-4 py-4 text-[14px] text-ink-soft">{p.comparison.cards}</td>
              <td className="px-4 py-4 text-[14px] text-ink-soft">{p.comparison.focus}</td>
              <td className="px-4 py-4">
                <span className="rounded-full bg-teal-soft px-2.5 py-1 text-[12px] font-semibold text-teal">
                  {p.difficulty}
                </span>
              </td>
              <td className="px-4 py-4">
                <Stars rating={p.rating} />
              </td>
              <td className="px-4 py-4 text-[14px] text-ink-soft">{p.comparison.format}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

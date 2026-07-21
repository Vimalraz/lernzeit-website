import Stars from "@/components/ui/Stars";

export type Review = {
  name: string;
  role: string;
  rating: number;
  title: string;
  text: string;
  product?: string; // optional — legacy field
  date?: string;   // optional — new Amazon review date
  verified: boolean;
};

export default function ReviewCard({ review: r }: { review: Review }) {
  return (
    <figure className="group relative flex h-full flex-col overflow-hidden rounded-tile border border-line bg-card p-6 shadow-card transition-all duration-[400ms] ease-[cubic-bezier(.21,.65,.36,1)] hover:-translate-y-1 hover:border-gold hover:shadow-lift">
      <span
        aria-hidden
        className="pointer-events-none absolute right-5 top-0 translate-y-2 font-display text-[72px] leading-none text-gold-soft opacity-0 transition-all duration-[400ms] ease-[cubic-bezier(.21,.65,.36,1)] group-hover:translate-y-0 group-hover:opacity-100"
      >
        &ldquo;
      </span>
      <div className="relative flex flex-1 flex-col">
        <div className="flex items-center justify-between">
          <Stars rating={r.rating} />
          {r.verified && (
            <span className="rounded-full bg-gold-soft px-2.5 py-1 text-[11px] font-semibold text-[#9a6a1c]">
              Verified Purchase
            </span>
          )}
        </div>
        <p className="mt-4 text-[15px] font-bold">{r.title}</p>
        <blockquote className="mt-2 flex-1 text-[14px] leading-relaxed text-ink-soft">
          "{r.text}"
        </blockquote>
        <figcaption className="mt-5 border-t border-line pt-4">
          <span className="block text-[14px] font-semibold">{r.name}</span>
          <span className="block text-[13px] text-ink-soft">
            {r.role}
            {r.date && <> · Reviewed {r.date}</>}
            {r.product && !r.date && <> · {r.product}</>}
          </span>
        </figcaption>
      </div>
    </figure>
  );
}

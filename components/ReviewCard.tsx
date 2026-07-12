import Stars from "@/components/ui/Stars";

export type Review = {
  name: string;
  role: string;
  rating: number;
  title: string;
  text: string;
  product: string;
  verified: boolean;
};

export default function ReviewCard({ review: r }: { review: Review }) {
  return (
    <figure className="flex h-full flex-col rounded-tile border border-line bg-card p-6 shadow-card">
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
        “{r.text}”
      </blockquote>
      <figcaption className="mt-5 border-t border-line pt-4">
        <span className="block text-[14px] font-semibold">{r.name}</span>
        <span className="block text-[13px] text-ink-soft">
          {r.role} · {r.product}
        </span>
      </figcaption>
    </figure>
  );
}

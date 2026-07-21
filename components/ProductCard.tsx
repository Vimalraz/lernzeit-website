import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { AmazonButton } from "@/components/ui/Buttons";
import Stars from "@/components/ui/Stars";
import { asset } from "@/lib/site";

export default function ProductCard({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  const badge = product.badges.bestSeller
    ? "Best seller"
    : product.badges.newArrival
      ? "New"
      : product.badges.mostGifted
        ? "Most gifted"
        : null;

  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-tile border border-line bg-card shadow-card transition-shadow duration-300 hover:shadow-lift ${className}`}
    >
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-paper-deep"
      >
        <Image
          src={asset(product.images[0])}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 340px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {badge && (
          <span className="absolute left-4 top-4 rounded-full bg-ink px-3 py-1 text-[12px] font-semibold text-paper">
            {badge}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full bg-teal-soft px-2.5 py-0.5 text-[12px] font-semibold text-teal">
            {product.age.label}
          </span>
          <Stars rating={product.rating} count={product.reviewCount} />
        </div>
        <h3 className="mt-3 text-lg font-bold tracking-tight text-ink">
          <Link href={`/products/${product.slug}`}>{product.title}</Link>
        </h3>
        <p className="mt-1.5 flex-1 text-[14px] leading-relaxed text-ink-soft">
          {product.tagline}
        </p>
        <div className="mt-5 flex items-center gap-4">
          <AmazonButton href={product.amazonUrl} className="!px-5 !py-2.5 !text-[14px]" />
          <Link
            href={`/products/${product.slug}`}
            className="text-[14px] font-semibold text-teal hover:text-teal-deep"
          >
            Learn more →
          </Link>
        </div>
      </div>
    </article>
  );
}

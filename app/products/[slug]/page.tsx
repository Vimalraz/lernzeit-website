import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/ui/Reveal";
import Stars from "@/components/ui/Stars";
import { AmazonButton, GhostButton } from "@/components/ui/Buttons";
import { getProduct, getProducts } from "@/lib/products";
import { site, asset } from "@/lib/site";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: product.title,
    description: product.tagline,
    openGraph: { images: [product.images[0]] },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const others = getProducts().filter((p) => p.slug !== product.slug);
  const sameNeed = others.filter((p) =>
    p.learningNeeds.some((n) => product.learningNeeds.includes(n)),
  );
  // Top up with popular sets so the section always shows three.
  const related = [
    ...sameNeed,
    ...others.filter((p) => !sameNeed.includes(p)),
  ].slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images.map((i) => `${site.url}${i}`),
    brand: { "@type": "Brand", name: "LernZeit" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
    offers: {
      "@type": "Offer",
      url: product.amazonUrl,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-16">
        <nav className="text-[14px] text-ink-soft" aria-label="Breadcrumb">
          <Link href="/products" className="hover:text-ink">
            Products
          </Link>
          <span className="mx-2" aria-hidden>
            /
          </span>
          <span className="font-medium text-ink">{product.title}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          {/* Gallery */}
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-tile border border-line bg-paper-deep">
              <Image
                src={asset(product.images[0])}
                alt={`${product.title} — main view`}
                fill
                priority
                sizes="(max-width: 1024px) 92vw, 560px"
                className="object-cover"
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {product.images.slice(1).map((img, i) => (
                <div
                  key={img}
                  className="relative aspect-[4/3] overflow-hidden rounded-card border border-line bg-paper-deep"
                >
                  <Image
                    src={asset(img)}
                    alt={`${product.title} — view ${i + 2}`}
                    fill
                    sizes="(max-width: 1024px) 45vw, 270px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </Reveal>

          {/* Details */}
          <Reveal delay={0.1}>
            <span className="rounded-full bg-teal-soft px-3 py-1 text-[13px] font-semibold text-teal">
              {product.age.label}
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              {product.title}
            </h1>
            <div className="mt-3">
              <Stars rating={product.rating} count={product.reviewCount} />
            </div>
            <p className="mt-4 font-display text-lg italic text-ink-soft">
              {product.tagline}
            </p>
            <p className="mt-4 text-[16px] leading-relaxed text-ink-soft">
              {product.description}
            </p>

            <ul className="mt-6 space-y-3">
              {product.benefits.map((b) => (
                <li key={b} className="flex items-start gap-3 text-[15px]">
                  <span
                    className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-teal-soft text-teal"
                    aria-hidden
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M4 12.5 9.5 18 20 6.5"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  {b}
                </li>
              ))}
            </ul>

            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 rounded-card border border-line bg-card p-5 text-[14px] sm:grid-cols-4">
              {[
                ["Cards", String(product.comparison.cards)],
                ["Focus", product.comparison.focus],
                ["Level", product.difficulty],
                ["Format", product.comparison.format],
              ].map(([dt, dd]) => (
                <div key={dt}>
                  <dt className="font-semibold uppercase tracking-wider text-ink-soft">
                    {dt}
                  </dt>
                  <dd className="mt-1 font-medium text-ink">{dd}</dd>
                </div>
              ))}
            </dl>

            {/* Best For */}
            {product.bestFor?.length > 0 && (
              <div className="mt-5 rounded-card border border-line bg-card p-5 text-[14px]">
                <dt className="font-semibold uppercase tracking-wider text-ink-soft">Best For</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {product.bestFor.map((bf) => (
                    <span key={bf} className="rounded-full bg-paper-deep px-3 py-1 text-[13px] font-medium text-ink">
                      {bf}
                    </span>
                  ))}
                </dd>
              </div>
            )}

            {/* Themes Included */}
            {product.themesIncluded && (
              <div className="mt-4 rounded-card border border-line bg-card p-5 text-[14px]">
                <dt className="font-semibold uppercase tracking-wider text-ink-soft">Themes Included</dt>
                <dd className="mt-1 text-[14px] leading-relaxed text-ink-soft">{product.themesIncluded}</dd>
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <AmazonButton href={product.amazonUrl} size="lg" />
              <GhostButton href="/products">Back to All Games</GhostButton>
            </div>
            {/* Amazon trust line */}
            <p className="mt-4 text-[13px] font-medium text-ink-soft">
              🔒 Checkout, delivery and returns are handled securely by Amazon.
            </p>
            {/* Shared feature strip */}
            <p className="mt-3 text-[12px] text-ink-soft/60">
              6 Ways to Play · Flip and Check · Double-Sided Lamination · Child-Safe Rounded Corners
            </p>
          </Reveal>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-24">
            <Reveal>
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                Families also love
              </h2>
            </Reveal>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <Reveal key={p.slug} delay={i * 0.08}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

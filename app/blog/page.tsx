import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import BlogIndex from "@/components/blog/BlogIndex";
import Reveal from "@/components/ui/Reveal";
import Stars from "@/components/ui/Stars";
import { AmazonButton } from "@/components/ui/Buttons";
import { getCategories, getPosts } from "@/lib/cms";
import { getProduct } from "@/lib/products";
import { asset } from "@/lib/site";
import featured from "@/content/featured-product.json";
import featuredBlog from "@/content/featured-blog.json";

export const metadata: Metadata = {
  title: "Learning Hub",
  description:
    "Practical, science-backed ideas for busy families — short reads on routines, learning science and screen-free childhood.",
};

// Static export: blog index is pre-rendered at build time.

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([getPosts(), getCategories()]);
  
  const spotlightIndex = posts.findIndex((p) => p.slug === featuredBlog.featuredSlug);
  const spotlight = spotlightIndex !== -1 ? posts[spotlightIndex] : posts[0];
  const rest = posts.filter((p) => p.slug !== spotlight?.slug);
  
  const featuredProduct = getProduct(featured.slug);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
      <Reveal>
        <p className="font-display text-[15px] font-semibold italic text-accent">
          Learning Hub
        </p>
        <h1 className="mt-3 max-w-2xl text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
          Short reads for busy parents raising curious kids.
        </h1>
      </Reveal>

      {/* Featured article spotlight */}
      {spotlight && (
        <Reveal delay={0.1} className="mt-12">
          <Link
            href={`/blog/${spotlight.slug}`}
            className="group grid overflow-hidden rounded-tile border border-line bg-card shadow-card transition-shadow hover:shadow-lift md:grid-cols-2"
          >
            <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[340px]">
              <Image
                src={asset(spotlight.coverImage)}
                alt=""
                fill
                priority
                sizes="(max-width: 768px) 92vw, 560px"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
            <div className="flex flex-col justify-center p-7 md:p-10">
              <p className="text-[13px] font-semibold uppercase tracking-wider text-accent">
                Featured article
              </p>
              <h2 className="mt-3 text-2xl font-bold leading-snug tracking-tight md:text-3xl">
                {spotlight.title}
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
                {spotlight.excerpt}
              </p>
              <p className="mt-4 text-[13px] font-medium text-ink-soft">
                {formatDate(spotlight.date)} · {spotlight.readingTime} min read
              </p>
              <span className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-ink px-6 py-3 text-[14px] font-semibold text-paper transition-colors group-hover:bg-accent">
                Read more <span aria-hidden>→</span>
              </span>
            </div>
          </Link>
        </Reveal>
      )}

      {/* Grid + featured product rail */}
      <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_300px]">
        <Reveal>
          <BlogIndex posts={rest.length ? rest : posts} categories={categories} />
        </Reveal>

        {featuredProduct && (
          <Reveal delay={0.1}>
            <aside className="lg:sticky lg:top-24">
              <div className="overflow-hidden rounded-tile border border-line bg-card shadow-card">
                <div className="bg-ink px-5 py-3">
                  <p className="text-[12px] font-semibold uppercase tracking-wider text-gold">
                    {featured.headline} · {featured.month}
                  </p>
                </div>
                <div className="relative aspect-[4/3]">
                  <Image
                    src={asset(featuredProduct.images[0])}
                    alt={featuredProduct.title}
                    fill
                    sizes="300px"
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold tracking-tight">
                    {featuredProduct.title}
                  </h3>
                  <div className="mt-2">
                    <Stars
                      rating={featuredProduct.rating}
                      count={featuredProduct.reviewCount}
                    />
                  </div>
                  <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">
                    {featured.note}
                  </p>
                  <div className="mt-5 flex flex-col gap-2.5">
                    <AmazonButton
                      href={featuredProduct.amazonUrl}
                      className="w-full !py-2.5 !text-[14px]"
                    />
                    <Link
                      href={`/products/${featuredProduct.slug}`}
                      className="text-center text-[14px] font-semibold text-teal hover:text-teal-deep"
                    >
                      Learn more →
                    </Link>
                  </div>
                </div>
              </div>
            </aside>
          </Reveal>
        )}
      </div>
    </div>
  );
}

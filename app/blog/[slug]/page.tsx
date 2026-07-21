import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/ui/Reveal";
import Stars from "@/components/ui/Stars";
import { AmazonButton } from "@/components/ui/Buttons";
import { getPost, getPosts } from "@/lib/cms";
import { getProduct } from "@/lib/products";
import { asset } from "@/lib/site";
import featured from "@/content/featured-product.json";

type Params = { slug: string };

// Static export: all blog pages are pre-rendered at build time via generateStaticParams.

export async function generateStaticParams(): Promise<Params[]> {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { images: [post.coverImage], type: "article" },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const featuredProduct = getProduct(featured.slug);

  return (
    <article className="mx-auto max-w-3xl px-5 py-12 md:px-8 md:py-16">
      <Reveal>
        <nav className="text-[14px] text-ink-soft" aria-label="Breadcrumb">
          <Link href="/blog" className="hover:text-ink">
            Learning Hub
          </Link>
          <span className="mx-2" aria-hidden>
            /
          </span>
          <span className="font-medium text-ink">{post.category}</span>
        </nav>

        <h1 className="mt-6 text-3xl font-bold leading-[1.15] tracking-tight md:text-[44px]">
          {post.title}
        </h1>
        <p className="mt-4 text-[14px] font-medium text-ink-soft">
          {new Date(post.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}{" "}
          · {post.readingTime} min read · {post.category}
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-tile border border-line bg-paper-deep">
          <Image
            src={asset(post.coverImage)}
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 92vw, 720px"
            className="object-cover"
          />
        </div>
      </Reveal>

      <div
        className="prose-lz mt-10"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />

      {/* Product CTA */}
      {featuredProduct && (
        <aside className="mt-14 overflow-hidden rounded-tile border border-line bg-paper-deep/60">
          <div className="grid sm:grid-cols-[200px_1fr]">
            <div className="relative aspect-[4/3] sm:aspect-auto">
              <Image
                src={asset(featuredProduct.images[0])}
                alt={featuredProduct.title}
                fill
                sizes="(max-width: 640px) 92vw, 200px"
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <p className="text-[12px] font-semibold uppercase tracking-wider text-accent">
                Put it into practice
              </p>
              <h2 className="mt-2 text-xl font-bold tracking-tight">
                {featuredProduct.title}
              </h2>
              <div className="mt-1.5">
                <Stars
                  rating={featuredProduct.rating}
                  count={featuredProduct.reviewCount}
                />
              </div>
              <p className="mt-2 text-[14px] text-ink-soft">
                {featuredProduct.tagline}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <AmazonButton
                  href={featuredProduct.amazonUrl}
                  className="!px-5 !py-2.5 !text-[14px]"
                />
                <Link
                  href={`/products/${featuredProduct.slug}`}
                  className="text-[14px] font-semibold text-teal hover:text-teal-deep"
                >
                  Learn more →
                </Link>
              </div>
            </div>
          </div>
        </aside>
      )}

      <div className="mt-10 border-t border-line pt-8">
        <Link
          href="/blog"
          className="text-[15px] font-semibold text-teal hover:text-teal-deep"
        >
          ← All articles
        </Link>
      </div>
    </article>
  );
}

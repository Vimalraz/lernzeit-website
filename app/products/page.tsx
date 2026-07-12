import type { Metadata } from "next";
import Image from "next/image";
import ProductExplorer from "@/components/products/ProductExplorer";
import GoalPicker from "@/components/products/GoalPicker";
import ComparisonTable from "@/components/products/ComparisonTable";
import FavoritesTabs from "@/components/products/FavoritesTabs";
import ContactForm from "@/components/forms/ContactForm";
import ReviewCard from "@/components/ReviewCard";
import Accordion from "@/components/ui/Accordion";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { AmazonButton } from "@/components/ui/Buttons";
import { getFilterOptions, getProducts } from "@/lib/products";
import { site } from "@/lib/site";
import reviews from "@/content/reviews.json";
import faq from "@/content/faq.json";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Premium flashcard sets for ages 1–12 — phonics, numbers, emotions, geography and more. Find the right set with our Learning Goal Picker.",
};

export default function ProductsPage() {
  const products = getProducts();
  const filters = getFilterOptions(products);

  return (
    <>
      {/* ——— Hero ——— */}
      <section className="grain relative overflow-hidden bg-teal-soft/60">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-14 pt-12 md:grid-cols-[1.2fr_1fr] md:px-8 md:pb-20 md:pt-16">
          <Reveal>
            <p className="font-display text-[15px] font-semibold italic text-accent">
              The Lernzeit collection
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
              Every set earns its place in your bag.
            </h1>
            <p className="mt-4 max-w-lg text-[17px] leading-relaxed text-ink-soft">
              Eleven flashcard sets across ages 1–12 — each one designed with
              real families, tested by real children, and sold securely on
              Amazon.
            </p>
          </Reveal>
          <Reveal delay={0.15} className="relative hidden aspect-[4/3] md:block">
            <Image
              src="/images/products/alphabet-adventures-2.svg"
              alt="A fanned spread of Lernzeit flashcards"
              fill
              priority
              sizes="(max-width: 1024px) 0px, 480px"
              className="rounded-tile object-cover shadow-lift"
            />
          </Reveal>
        </div>
      </section>

      {/* ——— Filterable grid ——— */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24" id="all">
        <Reveal>
          <SectionHeading
            eyebrow="Browse"
            title="Find it by age, need or moment"
            lede="Filter by your child's age, what you'd like to work on, or the moments you want to fill."
          />
        </Reveal>
        <div className="mt-10">
          <ProductExplorer products={products} filters={filters} />
        </div>
      </section>

      {/* ——— Goal picker ——— */}
      <section className="mx-auto max-w-6xl px-5 pb-16 md:px-8 md:pb-24" id="picker">
        <Reveal>
          <GoalPicker products={products} ageBands={filters.ageBands} />
        </Reveal>
      </section>

      {/* ——— Comparison ——— */}
      <section className="bg-paper-deep/60">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="Side by side"
              title="Compare the full range"
            />
          </Reveal>
          <Reveal delay={0.1} className="mt-10">
            <ComparisonTable products={products} />
          </Reveal>
        </div>
      </section>

      {/* ——— Customer favorites ——— */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <Reveal>
          <SectionHeading eyebrow="Customer favourites" title="What families reach for" />
        </Reveal>
        <Reveal delay={0.1} className="mt-8">
          <FavoritesTabs products={products} />
        </Reveal>
      </section>

      {/* ——— Bulk discounts ——— */}
      <section className="bg-teal text-white" id="bulk">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:px-8 md:py-24">
          <Reveal>
            <p className="font-display text-[15px] font-semibold italic text-gold">
              Schools & bulk orders
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-[36px]">
              Buying for a classroom, nursery or team?
            </h2>
            <p className="mt-4 max-w-md text-[16px] leading-relaxed text-white/80">
              We offer meaningful discounts for schools, tuition centres and
              corporate gifting from 10 sets up. Tell us what you need and
              we'll reply within two working days.
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="rounded-tile bg-paper p-6 text-ink md:p-8">
              <ContactForm
                kind="bulk"
                messagePlaceholder="Which sets, roughly how many, and when do you need them?"
                submitLabel="Request bulk pricing"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ——— Reviews ——— */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="From Amazon reviews"
            title="Parents put it better than we can"
          />
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {reviews.slice(0, 3).map((r, i) => (
            <Reveal key={r.name} delay={i * 0.08}>
              <ReviewCard review={r} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ——— FAQ ——— */}
      <section className="mx-auto max-w-3xl px-5 pb-16 md:px-8 md:pb-24">
        <Reveal>
          <SectionHeading align="center" eyebrow="Questions" title="Frequently asked" />
        </Reveal>
        <Reveal delay={0.1} className="mt-10">
          <Accordion items={faq} />
        </Reveal>
      </section>

      {/* ——— Final CTA ——— */}
      <section className="mx-auto max-w-6xl px-5 pb-24 md:px-8">
        <Reveal>
          <div className="rounded-tile border border-line bg-card px-8 py-12 text-center shadow-card">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Ready when you are.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[15px] text-ink-soft">
              Every purchase is handled by Amazon — Prime delivery, secure
              checkout, easy returns.
            </p>
            <AmazonButton
              href={site.amazonStoreUrl}
              size="lg"
              className="mt-6"
            >
              Shop securely on Amazon
            </AmazonButton>
          </div>
        </Reveal>
      </section>
    </>
  );
}

import Link from "next/link";
import HeroCardArrange from "@/components/hero/HeroCardArrange";
import ProductCard from "@/components/ProductCard";
import ReviewCard from "@/components/ReviewCard";
import Carousel from "@/components/ui/Carousel";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import Stars from "@/components/ui/Stars";
import { getFeaturedProducts } from "@/lib/products";
import { site } from "@/lib/site";
import reviews from "@/content/reviews.json";

export default function HomePage() {
  const featured = getFeaturedProducts();

  return (
    <>
      {/* ——— Hero ——— */}
      <section className="grain relative overflow-hidden min-h-screen flex flex-col">
        {/* Subtle gradient background */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(800px 600px at 78% 15%, var(--accent-soft) 0%, transparent 58%), radial-gradient(640px 480px at 8% 65%, var(--teal-soft) 0%, transparent 52%)",
          }}
        />

        {/* Main hero content */}
        <div className="relative mx-auto w-full max-w-5xl px-5 md:px-8 pt-24 pb-6 md:pt-28 flex-1 flex flex-col justify-center">

          {/* Text block — centred */}
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              {/* Heading — big, bold, tight */}
              <h1 className="mx-auto text-[44px] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink md:text-[60px] lg:text-[72px]">
                Turn spare minutes into little victories.
              </h1>

              {/* Sub text */}
              <p className="mx-auto mt-6 max-w-xl text-[16px] leading-relaxed text-ink-soft md:text-[18px]">
                Five minutes at breakfast. A card in the car. A ritual at
                bedtime. Learning that fits real family life — designed for
                working parents, loved by children.
              </p>
            </Reveal>

            {/* CTA buttons */}
            <Reveal delay={0.15}>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                {/* Primary CTA — solid black */}
                <Link
                  href="/products"
                  id="hero-cta-primary"
                  className="inline-flex items-center gap-2.5 rounded-full bg-ink px-7 py-3.5 text-[15px] font-semibold text-paper transition-all hover:bg-accent hover:shadow-lift active:scale-[0.97]"
                >
                  Explore flashcards
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </Link>

                {/* Secondary CTA — outlined */}
                <a
                  href={site.amazonStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="hero-cta-amazon"
                  className="inline-flex items-center gap-2 rounded-full border border-ink/20 bg-white/60 px-7 py-3.5 text-[15px] font-semibold text-ink backdrop-blur-sm transition-all hover:border-ink/50 hover:bg-white/90 active:scale-[0.97]"
                >
                  Shop on Amazon
                </a>
              </div>

              {/* Social proof */}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px] font-medium text-ink-soft">
                <Stars rating={4.8} />
                <span>2,700+ Amazon reviews</span>
                <span className="hidden sm:inline">·</span>
                <span className="hidden sm:inline">Sold &amp; delivered by Amazon</span>
              </div>
            </Reveal>
          </div>

          {/* Cards — below the text, centred */}
          <div className="mt-5 flex w-full justify-center overflow-visible">
            <Reveal delay={0.2} className="w-full">
              <HeroCardArrange />
            </Reveal>
          </div>
        </div>

        {/* ——— Bottom brand marquee strip ——— */}
        <div className="relative border-t border-line/60 bg-white/30 backdrop-blur-sm py-5 overflow-hidden">
          <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-widest text-ink-soft/60">
            Trusted by families worldwide
          </p>
          <div className="flex items-center gap-12 animate-marquee whitespace-nowrap px-8">
            {["Montessori Inspired", "Screen-Free Play", "Award Winning", "Eco-Friendly Cards", "Ages 1–12", "2,700+ Reviews", "Montessori Inspired", "Screen-Free Play", "Award Winning", "Eco-Friendly Cards", "Ages 1–12", "2,700+ Reviews"].map((t, i) => (
              <span key={i} className="inline-flex items-center gap-2 text-[14px] font-medium text-ink-soft/60">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="text-ink-soft/40">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Benefits: parents ——— */}
      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <SectionHeading
            eyebrow="For parents"
            title="You don't need more time. You need better minutes."
            lede="Every Lernzeit card is built so the busiest parent can open the box and begin — no prep, no printouts, no guilt."
          />
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PARENT_BENEFITS.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.1}>
              <div className="h-full rounded-tile border border-line bg-card p-7 shadow-card">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                  {b.icon}
                </span>
                <h3 className="mt-5 text-lg font-bold tracking-tight">{b.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                  {b.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ——— Benefits: children ——— */}
      <section className="bg-teal-soft/50">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <Reveal>
            <SectionHeading
              eyebrow="For children"
              title="It never feels like studying. That's the point."
              lede="Games, riddles and small wins — the kind of practice children ask for again tomorrow."
            />
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {CHILD_BENEFITS.map((b, i) => (
              <Reveal key={b.title} delay={i * 0.1}>
                <div className="h-full rounded-tile bg-card p-7 shadow-card">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-soft text-teal">
                    {b.icon}
                  </span>
                  <h3 className="mt-5 text-lg font-bold tracking-tight">{b.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                    {b.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Featured products carousel ——— */}
      <section id="featured" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Featured sets"
              title="Start with a family favourite"
            />
            <Link
              href="/products"
              className="text-[15px] font-semibold text-teal hover:text-teal-deep"
            >
              View all products →
            </Link>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="mt-10">
          <Carousel ariaLabel="Featured products">
            {featured.map((p) => (
              <div
                key={p.slug}
                className="w-[82%] flex-none snap-start sm:w-[46%] lg:w-[32%]"
              >
                <ProductCard product={p} className="h-full" />
              </div>
            ))}
          </Carousel>
        </Reveal>
      </section>

      {/* ——— Reviews ——— */}
      <section className="bg-paper-deep/60">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <Reveal>
            <SectionHeading
              align="center"
              eyebrow="From Amazon reviews"
              title="Trusted by thousands of families"
              lede="Real feedback from verified Amazon purchases."
            />
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r, i) => (
              <Reveal key={r.name} delay={(i % 3) * 0.08}>
                <ReviewCard review={r} />
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10 text-center">
            <a
              href={site.amazonStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[15px] font-semibold text-teal hover:text-teal-deep"
            >
              Read all reviews on Amazon ↗
            </a>
          </Reveal>
        </div>
      </section>

      {/* ——— How learning happens ——— */}
      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="How it works"
            title="How learning happens, three steps at a time"
          />
        </Reveal>
        <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-6">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.12}>
              <div className="flex flex-col items-center text-center">
                <div
                  className="flex h-28 w-24 items-center justify-center rounded-2xl text-4xl font-bold text-white shadow-lift"
                  style={{
                    backgroundColor: s.color,
                    transform: `rotate(${[-4, 3, -2][i]}deg)`,
                  }}
                >
                  {i + 1}
                </div>
                <h3 className="mt-6 text-lg font-bold tracking-tight">{s.title}</h3>
                <p className="mt-2 max-w-xs text-[15px] leading-relaxed text-ink-soft">
                  {s.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ——— Closing CTA ——— */}
      <section className="mx-auto max-w-6xl px-5 pb-24 md:px-8">
        <Reveal>
          <div className="grain relative overflow-hidden rounded-tile bg-ink px-8 py-14 text-center md:py-20">
            <div
              className="pointer-events-none absolute inset-0"
              aria-hidden
              style={{
                background:
                  "radial-gradient(480px 300px at 85% 10%, rgb(224 90 58 / 0.35) 0%, transparent 60%)",
              }}
            />
            <h2 className="relative mx-auto max-w-2xl text-3xl font-bold tracking-tight text-paper md:text-4xl">
              Tonight's ten minutes could be the ones they remember.
            </h2>
            <p className="relative mx-auto mt-4 max-w-lg text-[16px] text-paper/70">
              Find the right set for your child and shop securely on Amazon.
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/products"
                className="rounded-full bg-paper px-8 py-4 text-[16px] font-semibold text-ink transition-all hover:bg-accent hover:text-white"
              >
                Find their set
              </Link>
              <a
                href={site.amazonStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-paper/30 px-8 py-4 text-[16px] font-semibold text-paper transition-colors hover:border-paper"
              >
                Shop on Amazon
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

const PARENT_BENEFITS = [
  {
    title: "Zero-prep, by design",
    text: "The back of every card tells you exactly what to ask and how to play. Open the box, start the moment — even after your longest workday.",
    icon: <Glyph d="M12 8v4l3 3M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />,
  },
  {
    title: "Fits the gaps in your day",
    text: "Breakfast, the school run, the doctor's waiting room. Sessions are built for five to ten minutes — consistency beats marathon weekends.",
    icon: <Glyph d="M8 7V3m8 4V3M4 11h16M5 5h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />,
  },
  {
    title: "Progress you can actually see",
    text: "Levels, sorting systems and 'mastered' piles show growth without tests — so you always know it's working.",
    icon: <Glyph d="M4 20V10m6 10V4m6 16v-7m4 7H2" />,
  },
];

const CHILD_BENEFITS = [
  {
    title: "Feels like a game",
    text: "Riddles, tongue-twisters and mini challenges hide the repetition that makes knowledge stick.",
    icon: <Glyph d="M14.5 4.5 18 8l-9.5 9.5a2.5 2.5 0 0 1-3.5-3.5L14.5 4.5zM13 6l5 5M16 19h6m-3-3v6" />,
  },
  {
    title: "Confidence, card by card",
    text: "Each card is one small, winnable step. Small wins stack into the 'I can do this' feeling that changes everything.",
    icon: <Glyph d="M12 3l2.7 5.5 6 .9-4.3 4.2 1 6L12 16.8 6.6 19.6l1-6L3.3 9.4l6-.9L12 3z" />,
  },
  {
    title: "Wonder, without a screen",
    text: "Something to hold, flip, sort and carry around. Tactile learning that calms instead of overstimulates.",
    icon: <Glyph d="M7 4h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm5 12h.01" />,
  },
];

const STEPS = [
  {
    title: "Pick a moment",
    text: "Any ten spare minutes work — breakfast table, back seat, bath-time wind-down.",
    color: "var(--teal)",
  },
  {
    title: "Flip and play",
    text: "Your child flips the card; the back guides the game. You're the co-player, not the teacher.",
    color: "var(--accent)",
  },
  {
    title: "Watch it stick",
    text: "Little-and-often repetition moves knowledge into long-term memory — and cards into the proud 'mastered' pile.",
    color: "var(--gold)",
  },
];

function Glyph({ d }: { d: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d={d} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

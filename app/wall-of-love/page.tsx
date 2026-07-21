import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { site, asset } from "@/lib/site";

export const metadata: Metadata = {
  title: "Wall of Love — LernZeit",
  description:
    "Real Amazon reviews from Indian families who love LernZeit flashcard games. See what parents, teachers and grandparents are saying.",
};

const REVIEWS = [
  {
    type: "quote" as const,
    quote:
      "My daughter thoroughly enjoyed the product. Excellent card quality and the flashcard game is value for money. The 6 different gameplay variations — I haven't seen such stuff in other flashcard products.",
    name: "Ranjit George",
    role: "Father of Two, Pune",
  },
  {
    type: "quote" as const,
    quote:
      "Overall concept of teaching storytelling through flashcards actually works. It is actually effective. Packaging quality is very good after multiple use.",
    name: "Joseph",
    role: "Father of One, Bengaluru",
  },
  {
    type: "image" as const,
    src: "/hero/slide1.png",
    alt: "LernZeit Storytelling Flashcards",
  },
  {
    type: "quote" as const,
    quote:
      "The concept is good — it encourages kids to think and come up with their own questions instead of just answering. It also reduced screen time to a great extent.",
    name: "Gokulnath Raja",
    role: "Father of One, Salem",
  },
  {
    type: "image" as const,
    src: "/hero/slide3.png",
    alt: "LernZeit Question Quest Flashcards",
  },
  {
    type: "quote" as const,
    quote:
      "Very good flash cards that encourage creative thinking and reasoning in kids. The concepts are simple yet engaging, and they help children observe everyday objects in a thoughtful way.",
    name: "Srikrishna Bashyam",
    role: "Father of One, Bengaluru",
  },
  {
    type: "quote" as const,
    quote:
      "Cards are sturdy, colorful and simple enough. My son was able to read words and also get hints from the pictures behind, which was thoughtful.",
    name: "Nandita",
    role: "Mother of Two, Mumbai",
  },
  {
    type: "image" as const,
    src: "/hero/slide5.png",
    alt: "LernZeit Tenses Through Festivals",
  },
  {
    type: "quote" as const,
    quote:
      "It felt so nice to sit next to her and say, 'You know, in our time…' — these cards talk about Indian symbols, festivals and stories. Just sitting together, talking and laughing. That bonding time meant a lot to me.",
    name: "Sekar",
    role: "Grandfather of 4 kids, Trichy",
  },
];

export default function WallOfLovePage() {
  return (
    <>
      {/* ——— Hero ——— */}
      <section className="grain relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(600px 400px at 75% 0%, var(--accent-soft) 0%, transparent 60%), radial-gradient(500px 360px at 10% 55%, var(--teal-soft) 0%, transparent 55%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-5 pb-14 pt-32 text-center md:px-8 md:pb-16 md:pt-36">
          <Reveal>
            {/* Pill badge */}
            <span className="inline-flex items-center rounded-full border border-ink/20 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-ink/60">
              Wall of Love
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight md:text-[52px]">
              What parents are saying
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-[16px] leading-relaxed text-ink-soft">
              Every word here comes from a verified Amazon purchase — real families, real moments.
            </p>
            <a
              href={site.amazonStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2 rounded-full border border-ink/20 px-6 py-2.5 text-[14px] font-semibold text-ink transition-all hover:bg-ink hover:text-paper active:scale-[0.97]"
            >
              Read all reviews on Amazon ↗
            </a>
          </Reveal>
        </div>
      </section>

      {/* ——— Bento Grid ——— */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
        <div className="grid auto-rows-[280px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((item, i) => (
            <Reveal key={i} delay={(i % 3) * 0.07}>
              {item.type === "image" ? (
                /* Image card — full bleed photo */
                <div className="relative h-full w-full overflow-hidden rounded-[20px]">
                  <Image
                    src={asset(item.src)}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                  {/* subtle gradient overlay at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>
              ) : (
                /* Quote card */
                <div className="flex h-full flex-col justify-between rounded-[20px] border border-line bg-card p-7 shadow-card">
                  {/* Quote text */}
                  <p className="text-[17px] font-medium leading-relaxed tracking-[-0.01em] text-ink">
                    &ldquo;{item.quote}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="mt-6 flex items-center gap-3">
                    {/* Avatar placeholder circle */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-paper-deep text-[15px] font-bold text-ink-soft">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-ink">{item.name}</p>
                      <p className="text-[12px] text-ink-soft">{item.role}</p>
                    </div>
                    {/* Verified badge */}
                    <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-teal-soft px-2.5 py-1 text-[10px] font-semibold text-teal">
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M4 12.5 9.5 18 20 6.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Amazon
                    </span>
                  </div>
                </div>
              )}
            </Reveal>
          ))}
        </div>
      </section>

      {/* ——— Bottom CTA ——— */}
      <section className="mx-auto max-w-6xl px-5 pb-24 md:px-8">
        <Reveal>
          <div className="grain relative overflow-hidden rounded-[28px] bg-ink px-8 py-14 text-center md:py-20">
            <div
              className="pointer-events-none absolute inset-0"
              aria-hidden
              style={{
                background:
                  "radial-gradient(480px 300px at 85% 10%, rgb(224 90 58 / 0.35) 0%, transparent 60%)",
              }}
            />
            <h2 className="relative mx-auto max-w-2xl text-3xl font-bold tracking-tight text-paper md:text-4xl">
              Ready to create your own story?
            </h2>
            <p className="relative mx-auto mt-4 max-w-lg text-[16px] text-paper/70">
              Find the right LernZeit game for your child and shop securely on Amazon.
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/products"
                className="rounded-full bg-paper px-8 py-4 text-[16px] font-semibold text-ink transition-all hover:bg-accent hover:text-white"
              >
                Explore Games
              </Link>
              <a
                href={site.amazonStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-paper/30 px-8 py-4 text-[16px] font-semibold text-paper transition-colors hover:border-paper"
              >
                Shop on Amazon ↗
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

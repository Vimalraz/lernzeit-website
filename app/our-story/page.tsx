import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ContactForm from "@/components/forms/ContactForm";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Why two working parents started making flashcards — our mission, beliefs, and the promise we make to every family who trusts us.",
};

const BELIEFS = [
  {
    title: "Small moments beat big plans",
    text: "Ten focused minutes a day outlearns the weekend cram that never happens. We design for the minutes families actually have.",
  },
  {
    title: "Parents are teachers already",
    text: "You don't need training — you need good prompts. Every card back makes you the confident guide you already are.",
  },
  {
    title: "Confidence before curriculum",
    text: "A child who feels capable will chase knowledge on their own. Our difficulty curves protect the winning feeling.",
  },
  {
    title: "Screens can wait",
    text: "Childhood needs things to hold. Paper, weight, texture — learning that engages hands calms minds.",
  },
  {
    title: "Quality is respect",
    text: "Thick board, rounded corners, inks that last. If it's going to live in your home, it should be made with care.",
  },
];

export default function OurStoryPage() {
  return (
    <>
      {/* ——— Who we are ——— */}
      <section className="grain relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(600px 400px at 80% 0%, var(--gold-soft) 0%, transparent 60%), radial-gradient(500px 360px at 5% 60%, var(--teal-soft) 0%, transparent 55%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-5 pb-16 pt-14 text-center md:px-8 md:pb-24 md:pt-24">
          <Reveal>
            <p className="font-display text-[15px] font-semibold italic text-accent">
              Our story
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-[1.1] tracking-tight md:text-[52px]">
              We're working parents who refused to choose between career and
              curiosity.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-ink-soft">
              Lernzeit began at a kitchen table, after bedtime, between two
              exhausted parents and one question: why does helping your child
              learn feel like a second job?
            </p>
          </Reveal>
        </div>
      </section>

      {/* ——— Why we do this ——— */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <div className="grid items-start gap-12 md:grid-cols-2">
          <Reveal>
            <SectionHeading
              eyebrow="Why we do this"
              title="The guilt gap is real. We've lived it."
            />
            <div className="mt-6 space-y-5 text-[16px] leading-relaxed text-ink-soft">
              <p>
                We had the meetings, the commutes, the deadlines — and a
                nagging feeling that the best hours of our children's day were
                going to everyone but us. The learning apps promised help, but
                handed our kids more screen time and handed us more guilt.
              </p>
              <p>
                The workbooks sat unopened because after a ten-hour day,
                nobody has the energy to prepare a lesson. What we needed
                didn't exist: something beautiful, ready in five seconds,
                that made the little time we had <em>count</em>.
              </p>
              <p className="font-medium text-ink">
                So we made it. First for our own kitchen table — then, when
                other parents kept asking where our cards came from, for
                yours.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`relative aspect-square overflow-hidden rounded-card border border-line ${
                    i % 2 === 0 ? "mt-6" : ""
                  }`}
                >
                  <Image
                    src={`/images/story/making-${i}.svg`}
                    alt={`Behind the scenes of making Lernzeit cards, photo ${i}`}
                    fill
                    sizes="(max-width: 768px) 45vw, 280px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            <p className="mt-4 text-center text-[13px] text-ink-soft">
              Behind the scenes: sketching, wording, printing, and the
              all-important family playtest.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ——— Beliefs ——— */}
      <section className="bg-paper-deep/60">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
          <Reveal>
            <SectionHeading
              align="center"
              eyebrow="What we believe"
              title="Five beliefs behind every card"
            />
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {BELIEFS.map((b, i) => (
              <Reveal key={b.title} delay={(i % 3) * 0.08}>
                <div className="h-full rounded-tile border border-line bg-card p-7 shadow-card">
                  <span className="font-display text-3xl font-semibold italic text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-lg font-bold tracking-tight">{b.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                    {b.text}
                  </p>
                </div>
              </Reveal>
            ))}
            {/* Gita quote fills the sixth cell */}
            <Reveal delay={0.24}>
              <figure className="flex h-full flex-col justify-center rounded-tile bg-ink p-7 text-paper">
                <blockquote className="font-display text-xl italic leading-relaxed">
                  “In this world, there is nothing as purifying as knowledge.”
                </blockquote>
                <figcaption className="mt-4 text-[13px] font-medium uppercase tracking-wider text-paper/60">
                  Bhagavad Gita 4.38
                </figcaption>
                <p className="mt-3 text-[14px] leading-relaxed text-paper/70">
                  A verse we return to often — the belief that facilitating
                  learning is among the most meaningful things one can do.
                </p>
              </figure>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ——— What makes us different ——— */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <div className="grid gap-12 md:grid-cols-2">
          <Reveal>
            <SectionHeading
              eyebrow="What makes us different"
              title="Built for the parent, not just the child"
            />
            <p className="mt-5 text-[16px] leading-relaxed text-ink-soft">
              Most learning products are designed for children and merely
              purchased by parents. Ours are designed for both. The front of
              every card belongs to your child; the back belongs to you —
              prompts, games and encouragement written for someone who has
              exactly ten minutes and wants them to matter.
            </p>
            <ul className="mt-6 space-y-3 text-[15px]">
              {[
                "For working parents who want presence, not prep",
                "For grandparents and caregivers who want a ready-made way in",
                "For children aged 1–12, wherever they are on the journey",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 flex-none rounded-full bg-accent" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
            <Link
              href="/products"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-accent-deep"
            >
              See what we make <span aria-hidden>→</span>
            </Link>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="rounded-tile border border-line bg-card p-8 shadow-card">
              <p className="font-display text-[15px] font-semibold italic text-teal">
                Our promise
              </p>
              <ul className="mt-5 space-y-5">
                {[
                  ["Honest materials", "Cards that survive real childhood — or we make them better."],
                  ["Honest claims", "No '10x your child's IQ' nonsense. Just well-designed practice, honestly described."],
                  ["Honest listening", "Every review and message is read by a founder. Feedback has reshaped every product we sell."],
                  ["A hand extended", "A share of every purchase funds flashcard sets for classrooms that can't afford learning materials."],
                ].map(([t, d]) => (
                  <li key={t} className="flex gap-4">
                    <span
                      className="mt-1 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-teal-soft text-teal"
                      aria-hidden
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M4 12.5 9.5 18 20 6.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <div>
                      <p className="font-semibold">{t}</p>
                      <p className="mt-1 text-[14px] leading-relaxed text-ink-soft">{d}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ——— Founders ——— */}
      <section className="bg-teal-soft/50">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
          <Reveal>
            <SectionHeading
              align="center"
              eyebrow="Meet the makers"
              title="A small family team with tiny chief testers"
            />
          </Reveal>
          <div className="mx-auto mt-12 grid max-w-4xl gap-5 sm:grid-cols-2">
            {[
              {
                name: "Founder & Product",
                emoji: "✏️",
                bio: "Designs every card, obsesses over paper weight, and believes a rounded corner is a small act of kindness. (Real bio and photo coming soon.)",
              },
              {
                name: "Founder & Everything Else",
                emoji: "📦",
                bio: "Runs the numbers, the logistics and the late-night packing sessions. Chief believer that learning tools should feel like gifts. (Real bio and photo coming soon.)",
              },
            ].map((f, i) => (
              <Reveal key={f.name} delay={i * 0.1}>
                <div className="h-full rounded-tile bg-card p-8 text-center shadow-card">
                  <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-paper-deep text-3xl">
                    {f.emoji}
                  </span>
                  <h3 className="mt-5 text-lg font-bold tracking-tight">{f.name}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{f.bio}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <p className="mx-auto mt-10 max-w-2xl text-center text-[15px] leading-relaxed text-ink-soft">
              <strong className="text-ink">Growing with families.</strong> Every
              set is playtested by real households before it ships — and
              customer messages routinely turn into next year's products. If
              your family has an idea, we're listening.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ——— Contact + thank you ——— */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24" id="contact">
        <div className="grid gap-12 md:grid-cols-2">
          <Reveal>
            <SectionHeading
              eyebrow="Contact us"
              title="Talk to a founder, not a ticket queue"
              lede="Questions, feedback, wild product ideas — every message lands in our own inbox."
            />
            <p className="mt-6 text-[15px] text-ink-soft">
              Prefer email? Write to{" "}
              <a href={`mailto:${site.contactEmail}`} className="font-semibold text-teal hover:text-teal-deep">
                {site.contactEmail}
              </a>
            </p>
            <div className="mt-10 rounded-tile bg-gold-soft p-7">
              <p className="font-display text-lg italic leading-relaxed text-ink">
                Thank you for trusting two parents you've never met with
                something as precious as your child's curiosity. We don't take
                it lightly — not for a single card.
              </p>
              <p className="mt-3 text-[14px] font-semibold text-ink-soft">
                — The Lernzeit family
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="rounded-tile border border-line bg-card p-6 shadow-card md:p-8">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

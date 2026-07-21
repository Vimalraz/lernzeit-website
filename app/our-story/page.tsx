import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ContactForm from "@/components/forms/ContactForm";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { site, asset } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Why two working parents started making flashcards — our mission, beliefs, and the promise we make to every family who trusts us.",
};

const BELIEFS = [
  {
    title: "Curiosity before correction",
    text: "Children learn more deeply when they first have space to observe, wonder and try. Our cards invite them to think before they flip and check.",
  },
  {
    title: "Conversation before instruction",
    text: "Learning becomes meaningful when children explain ideas in their own words. Every game is designed to encourage questions, listening and shared discovery.",
  },
  {
    title: "Real life before rote learning",
    text: "Familiar routines, nature and everyday situations help children connect new ideas to the world around them—not simply memorise answers.",
  },
  {
    title: "Progress before perfection",
    text: "Children need achievable challenges, room to try again and reasons to feel proud. Growth matters more than getting everything right the first time.",
  },
  {
    title: "Quality shows care",
    text: "Clear illustrations, durable lamination and child-safe rounded corners are not finishing touches. They reflect the care every child deserves.",
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
              We created the learning games we wanted for our own children.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-ink-soft">
              As working parents, we needed activities that were screen-free, easy to begin and meaningful enough to hold our children's attention.
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
              title="We knew the kind of learning we wanted. We just couldn't find it."
            />
            <div className="mt-6 space-y-5 text-[16px] leading-relaxed text-ink-soft">
              <p>
                We wanted hands-on activities our children would genuinely enjoy—without another app, a stack of worksheets or a long setup.
              </p>
              <p>
                But most options asked for more time, more preparation or more screen use than our family could give. We needed something thoughtful enough to support real learning, yet simple enough to begin in the middle of an ordinary day.
              </p>
              <p>
                So we started sketching, testing and refining our own card games at home. First for our children, then for other families looking for the same thing: meaningful learning that feels natural, playful and possible.
              </p>
              <p className="font-medium text-ink">
                That need became LernZeit Creations.
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
                    src={asset(`/images/story/making-${i}.svg`)}
                    alt={`Behind the scenes of making LernZeit cards, photo ${i}`}
                    fill
                    sizes="(max-width: 768px) 45vw, 280px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            <p className="mt-4 text-center text-[13px] text-ink-soft">
              Behind the scenes: sketching, testing and refining every LernZeit game.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ——— Our Vision ——— */}
      <section className="grain relative overflow-hidden bg-ink">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(480px 300px at 85% 10%, rgb(224 90 58 / 0.3) 0%, transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-4xl px-5 py-16 text-center md:px-8 md:py-24">
          <Reveal>
            <p className="font-display text-[15px] font-semibold italic text-accent">
              Our vision
            </p>
            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-paper md:text-[48px]">
              To become India's go-to brand for lifelong learning.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-paper/70">
              Trusted by parents. Loved by children. Respected by educators.
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
                <div className="w-full aspect-[1523/2293] rounded-tile border border-line bg-card p-7 shadow-card flex flex-col justify-start">
                  <span className="font-display text-3xl font-semibold italic text-accent shrink-0">
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
              <figure className="w-full aspect-[1523/2293] flex flex-col justify-center rounded-tile bg-ink p-7 text-paper">
                <blockquote className="font-display text-[16px] leading-relaxed">
                  “न हि ज्ञानेन सदृशं पवित्रमिह विद्यते।<br />
                  तत्स्वयं योगसंसिद्धः कालेनात्मनि विन्दति॥”
                </blockquote>
                <figcaption className="mt-4 text-[13px] font-medium uppercase tracking-wider text-paper/60">
                  Bhagavad Gita 4.38
                </figcaption>
                <p className="mt-3 text-[14px] leading-relaxed text-paper/70">
                  Meaning: Nothing is as purifying as true knowledge. With sincere and steady practice, it gradually reveals itself from within.
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
              title="Designed for the child. Thought through for the parent."
            />
            <p className="mt-5 text-[16px] leading-relaxed text-ink-soft">
              Most flashcards give children something to look at. Ours create a complete learning moment.
            </p>
            <p className="mt-4 text-[16px] leading-relaxed text-ink-soft">
              The front invites the child to observe, think, speak, sort or arrange. A simple flip reveals the answer, next step or guidance—so parents can support learning without preparing a lesson.
            </p>
            <p className="mt-4 text-[16px] leading-relaxed text-ink-soft">
              Every game is built to be easy to begin, enjoyable to repeat and meaningful beyond the playtime itself.
            </p>
            <ul className="mt-6 space-y-3 text-[15px]">
              {[
                "For parents who want purposeful learning without lesson planning",
                "For children who learn best by seeing, speaking and doing",
                "For homes and classrooms that need durable, reusable activities",
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
              See Our Flashcard Games <span aria-hidden>→</span>
            </Link>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="rounded-tile border border-line bg-card p-8 shadow-card">
              <p className="font-display text-[15px] font-semibold italic text-teal">
                Our promise
              </p>
              <ul className="mt-5 space-y-5">
                {[
                  ["1. Thoughtful by design", "Every game supports a clear learning need—not simply another way to keep children occupied."],
                  ["2. Honest about outcomes", "No exaggerated claims or instant-learning promises. Just well-designed activities with clearly explained benefits."],
                  ["3. Made for real use", "Durable lamination, rounded corners and child-friendly cards designed for repeated play."],
                  ["4. Improved by listening", "Feedback from parents, teachers and children helps us refine every product we create."],
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
              title="Two parents, one shared purpose—and our most honest little testers."
            />
          </Reveal>
          <div className="mx-auto mt-12 grid max-w-4xl gap-5 sm:grid-cols-2">
            {[
              {
                name: "The ideas and learning",
                emoji: "✏️",
                bio: "Dreams up the games, writes the activities and keeps asking one question: will a child genuinely enjoy playing this?",
              },
              {
                name: "The details and delivery",
                emoji: "📦",
                bio: "Takes care of sourcing, production, quality and packaging—making sure every thoughtful idea becomes a product families can trust.",
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
              <strong className="text-ink">Growing alongside families.</strong> What children enjoy, what parents need and what educators observe continue to shape every game we create.
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
              title="Questions, ideas or feedback? We&apos;re listening."
              lede="Every message lands in our own inbox."
            />
            <div className="mt-10 rounded-tile bg-gold-soft p-7">
              <p className="font-display text-lg italic leading-relaxed text-ink">
                Creating for children is a responsibility we never take lightly. Your trust keeps us thoughtful, honest and always learning.
              </p>
              <p className="mt-3 text-[14px] font-semibold text-ink-soft">
                — The LernZeit Creations family
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

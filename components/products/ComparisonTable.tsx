import Link from "next/link";
import type { Product } from "@/lib/products";

const FAMILY_LABELS: Record<string, string> = {
  storytelling:     "Storytelling & Sequencing",
  question_quest:   "The Question Quest",
  everyday_objects: "Everyday Bharat",
  tenses:           "Tenses Through Festivals",
};

const FAMILY_WHAT: Record<string, string> = {
  storytelling:     "Arrange five-card stories, narrate events and explore daily-life and nature themes",
  question_quest:   "Observe real-life scenes, form questions and discuss possible answers",
  everyday_objects: "Identify, describe and connect familiar objects from everyday Indian life",
  tenses:           "Use familiar Indian festival scenes to recognise tenses and create sentences",
};

const FAMILY_BEST: Record<string, string> = {
  storytelling:     "Storytelling, sequencing, logical thinking and empathy",
  question_quest:   "Asking questions, observation, communication and speaking confidence",
  everyday_objects: "Vocabulary, Indian awareness, description and storytelling",
  tenses:           "Past, present and future tenses, grammar and sentence building",
};

const FAMILY_AVAILABLE: Record<string, string> = {
  storytelling:     "Single set",
  question_quest:   "Level 1, Level 2, Combo",
  everyday_objects: "Level 1, Level 2, Combo",
  tenses:           "Level 1, Level 2, Combo",
};

const FAMILY_AGE: Record<string, string> = {
  storytelling:     "4–8 years",
  question_quest:   "4–8 years; Level 2 from 5+",
  everyday_objects: "4+; Level 2 from 5+",
  tenses:           "5+",
};

const FAMILY_CARDS: Record<string, string> = {
  storytelling:     "40",
  question_quest:   "40 per level; 80 in Combo",
  everyday_objects: "40 per level; 80 in Combo",
  tenses:           "45 per level; 90 in Combo",
};

export default function ComparisonTable({ products }: { products: Product[] }) {
  // Get one representative product per family (prefer Level 1 or single)
  const seen = new Set<string>();
  const families: Product[] = [];
  for (const p of products) {
    if (!seen.has(p.familyId) && (p.level === "1" || p.level === "none")) {
      seen.add(p.familyId);
      families.push(p);
    }
  }

  const ORDER = ["storytelling", "question_quest", "everyday_objects", "tenses"];
  families.sort((a, b) => ORDER.indexOf(a.familyId) - ORDER.indexOf(b.familyId));

  return (
    <div className="overflow-x-auto rounded-tile border border-line bg-card shadow-card">
      <table className="w-full min-w-[860px] border-collapse text-left">
        <thead>
          <tr className="border-b border-line bg-paper-deep/60 text-[12px] uppercase tracking-wider text-ink-soft">
            <th className="px-6 py-4 font-semibold">Flashcard game</th>
            <th className="px-4 py-4 font-semibold">Recommended age</th>
            <th className="px-4 py-4 font-semibold">Cards</th>
            <th className="px-4 py-4 font-semibold">Best for</th>
            <th className="px-4 py-4 font-semibold">What children do</th>
            <th className="px-4 py-4 font-semibold">Available as</th>
          </tr>
        </thead>
        <tbody>
          {families.map((p) => (
            <tr key={p.familyId} className="border-b border-line last:border-0 hover:bg-paper/70">
              <td className="px-6 py-5">
                <Link
                  href={`/products/${p.slug}`}
                  className="font-semibold text-ink hover:text-accent"
                >
                  {FAMILY_LABELS[p.familyId] ?? p.title}
                </Link>
              </td>
              <td className="px-4 py-5 text-[14px] text-ink-soft">{FAMILY_AGE[p.familyId]}</td>
              <td className="px-4 py-5 text-[14px] text-ink-soft">{FAMILY_CARDS[p.familyId]}</td>
              <td className="px-4 py-5 text-[14px] text-ink-soft">{FAMILY_BEST[p.familyId]}</td>
              <td className="px-4 py-5 text-[14px] text-ink-soft">{FAMILY_WHAT[p.familyId]}</td>
              <td className="px-4 py-5">
                <span className="rounded-full bg-teal-soft px-2.5 py-1 text-[12px] font-semibold text-teal whitespace-nowrap">
                  {FAMILY_AVAILABLE[p.familyId]}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

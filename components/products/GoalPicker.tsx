"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

type AgeBand = { label: string; min: number; max: number };

const SKILLS = [
  "Reading & Phonics",
  "Numbers & Math",
  "Language & Vocabulary",
  "General Knowledge",
  "Emotional Growth",
  "Logic & Thinking",
];
const LEVELS = [
  { key: "Beginner", label: "Just starting out" },
  { key: "Growing", label: "Building confidence" },
  { key: "Confident", label: "Ready for a challenge" },
] as const;

export default function GoalPicker({
  products,
  ageBands,
}: {
  products: Product[];
  ageBands: AgeBand[];
}) {
  const [step, setStep] = useState(0);
  const [age, setAge] = useState<AgeBand | null>(null);
  const [skill, setSkill] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(null);

  const done = step === 3;

  const scored = done
    ? products
        .map((p) => {
          let score = 0;
          if (age && p.age.min <= age.max && p.age.max >= age.min) score += 3;
          if (skill && p.learningNeeds.includes(skill)) score += 3;
          if (level && p.difficulty === level) score += 1;
          return { p, score };
        })
        .sort((a, b) => b.score - a.score || b.p.reviewCount - a.p.reviewCount)
    : [];
  // Prefer sets matching both age and skill; only widen to partial matches when none do.
  const strong = scored.filter((m) => m.score >= 6);
  const matches = (strong.length ? strong : scored.filter((m) => m.score >= 3))
    .slice(0, 3)
    .map((m) => m.p);

  const reset = () => {
    setStep(0);
    setAge(null);
    setSkill(null);
    setLevel(null);
  };

  return (
    <div className="rounded-tile border border-line bg-card p-6 shadow-card md:p-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-display text-[15px] font-semibold italic text-accent">
            Learning Goal Picker
          </p>
          <h3 className="mt-1 text-2xl font-bold tracking-tight">
            Not sure where to start? Answer three questions.
          </h3>
        </div>
        {(step > 0 || done) && (
          <button
            type="button"
            onClick={reset}
            className="flex-none text-[14px] font-semibold text-ink-soft hover:text-ink"
          >
            Start over ↺
          </button>
        )}
      </div>

      {/* progress dots */}
      <div className="mt-6 flex gap-2" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i < step ? "w-10 bg-teal" : i === step && !done ? "w-10 bg-accent" : "w-6 bg-line"
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
            className="mt-8"
          >
            {step === 0 && (
              <StepChoices
                question="How old is your child?"
                options={ageBands.map((b) => b.label)}
                onPick={(label) => {
                  setAge(ageBands.find((b) => b.label === label) ?? null);
                  setStep(1);
                }}
              />
            )}
            {step === 1 && (
              <StepChoices
                question="What would you love to work on together?"
                options={SKILLS}
                onPick={(s) => {
                  setSkill(s);
                  setStep(2);
                }}
              />
            )}
            {step === 2 && (
              <StepChoices
                question="Where are they on this journey?"
                options={LEVELS.map((l) => l.label)}
                onPick={(label) => {
                  setLevel(LEVELS.find((l) => l.label === label)?.key ?? null);
                  setStep(3);
                }}
              />
            )}
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mt-8"
          >
            {matches.length > 0 ? (
              <>
                <p className="text-[15px] font-medium text-ink-soft">
                  Our pick{matches.length > 1 ? "s" : ""} for a{" "}
                  <strong className="text-ink">{age?.label}</strong> child
                  working on{" "}
                  <strong className="text-ink">{skill?.toLowerCase()}</strong>:
                </p>
                <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {matches.map((p) => (
                    <ProductCard key={p.slug} product={p} />
                  ))}
                </div>
              </>
            ) : (
              <p className="rounded-2xl bg-paper-deep p-6 text-[15px] text-ink-soft">
                We don't have a perfect match for that combination yet — but
                we're always designing new sets. Browse the full range above,
                or write to us and we'll point you to the closest fit.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StepChoices({
  question,
  options,
  onPick,
}: {
  question: string;
  options: string[];
  onPick: (option: string) => void;
}) {
  return (
    <fieldset>
      <legend className="text-lg font-bold tracking-tight">{question}</legend>
      <div className="mt-4 flex flex-wrap gap-3">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onPick(opt)}
            className="rounded-full border border-line bg-paper px-5 py-3 text-[15px] font-medium transition-colors hover:border-accent hover:bg-accent-soft"
          >
            {opt}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { asset } from "@/lib/site";
import type { Product } from "@/lib/products";

function trackEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window !== "undefined") {
    const dataLayer = (window as any).dataLayer || [];
    dataLayer.push({
      event: eventName,
      ...params,
    });
    if (typeof (window as any).gtag === "function") {
      (window as any).gtag("event", eventName, params);
    }
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

type FamilyId = "storytelling" | "question_quest" | "everyday_objects" | "tenses";

interface PickerProduct {
  product_id: string;
  family_id: FamilyId;
  product_name: string;
  level: "none" | "1" | "2" | "combo";
  age_min: number;
  age_max: number;
  amazon_url: string;
  image_url: string;
  short_description: string;
  is_combo: boolean;
  is_active: boolean;
  admin_priority: number;
  slug: string;
}

interface RecommendationResult {
  product: PickerProduct;
  score: number;
  label: "Best Match" | "Also a Good Fit";
  whyItFits: string;
  isGiftMode: boolean;
}

// ─── Scoring Constants ─────────────────────────────────────────────────────────

const AGE_SCORES: Record<FamilyId, (age: number) => number> = {
  storytelling: (age) => (age <= 7 ? 40 : age === 8 ? 30 : 10),
  question_quest: (age) => (age <= 8 ? 40 : 25),
  everyday_objects: (age) => (age <= 7 ? 40 : age === 8 ? 30 : 15),
  tenses: (age) => (age === 4 ? 10 : age <= 9 ? 40 : 25),
};

const LEARNING_SCORES: Record<string, Record<FamilyId, number>> = {
  "Tell stories & organise ideas":       { storytelling: 30, question_quest: 10, everyday_objects: 15, tenses: 5 },
  "Ask better questions":                { storytelling: 5,  question_quest: 30, everyday_objects: 10, tenses: 5 },
  "Build vocabulary & everyday awareness":{ storytelling: 10, question_quest: 10, everyday_objects: 30, tenses: 15 },
  "Understand English tenses":           { storytelling: 0,  question_quest: 0,  everyday_objects: 0,  tenses: 30 },
  "Strengthen logic & sequencing":       { storytelling: 30, question_quest: 20, everyday_objects: 10, tenses: 10 },
  "Speak with confidence":               { storytelling: 20, question_quest: 30, everyday_objects: 20, tenses: 15 },
};

const NOT_SURE_SCORES: Record<string, Record<FamilyId, number>> = {
  "4-5": { storytelling: 30, question_quest: 20, everyday_objects: 30, tenses: 5 },
  "6-7": { storytelling: 30, question_quest: 30, everyday_objects: 20, tenses: 20 },
  "8":   { storytelling: 20, question_quest: 25, everyday_objects: 20, tenses: 30 },
  "9-10":{ storytelling: 10, question_quest: 25, everyday_objects: 20, tenses: 30 },
};

const USE_CASE_SCORES: Record<string, Record<FamilyId, number>> = {
  "Quick 5–10 minute play":      { storytelling: 15, question_quest: 15, everyday_objects: 15, tenses: 10 },
  "Parent–child time":           { storytelling: 15, question_quest: 15, everyday_objects: 10, tenses: 10 },
  "Travel & waiting time":       { storytelling: 15, question_quest: 10, everyday_objects: 15, tenses: 10 },
  "Classroom or small-group use":{ storytelling: 15, question_quest: 15, everyday_objects: 15, tenses: 15 },
  "Homework & revision":         { storytelling: 5,  question_quest: 10, everyday_objects: 10, tenses: 15 },
  "Gifting":                     { storytelling: 10, question_quest: 15, everyday_objects: 15, tenses: 15 },
};

const WHY_IT_FITS: Record<FamilyId, string> = {
  storytelling:     "A strong match for helping your child organise ideas, build logical sequences and express stories clearly.",
  question_quest:   "Designed to help your child ask thoughtful questions, observe more closely and speak with confidence.",
  everyday_objects: "Helps your child build vocabulary and connect learning with familiar objects from everyday Indian life.",
  tenses:           "Makes past, present and future tenses easier to understand through familiar Indian festivals and sentence-building activities.",
};

const FAMILY_DISPLAY: Record<FamilyId, string> = {
  storytelling:     "Storytelling & Sequencing",
  question_quest:   "The Question Quest",
  everyday_objects: "Everyday Bharat",
  tenses:           "Tenses Through Festivals",
};

// ─── Score calculation ─────────────────────────────────────────────────────────

function getNotSureKey(age: number): string {
  if (age <= 5) return "4-5";
  if (age <= 7) return "6-7";
  if (age === 8) return "8";
  return "9-10";
}

function calcFamilyScore(
  family: FamilyId,
  age: number,
  learningNeeds: string[],
  useCases: string[],
  notSure: boolean,
): number {
  const ageScore = AGE_SCORES[family](age);

  let learningScore = 0;
  if (notSure) {
    learningScore = NOT_SURE_SCORES[getNotSureKey(age)][family];
  } else {
    const raw = learningNeeds.reduce(
      (sum, need) => sum + (LEARNING_SCORES[need]?.[family] ?? 0),
      0,
    );
    learningScore = Math.min(45, raw);
  }

  let useScore = 0;
  if (useCases.length === 1) {
    useScore = USE_CASE_SCORES[useCases[0]]?.[family] ?? 0;
  } else if (useCases.length === 2) {
    const s1 = USE_CASE_SCORES[useCases[0]]?.[family] ?? 0;
    const s2 = USE_CASE_SCORES[useCases[1]]?.[family] ?? 0;
    const higher = Math.max(s1, s2);
    const lower = Math.min(s1, s2);
    useScore = Math.min(20, higher + Math.round(lower * 0.5));
  }

  return ageScore + learningScore + useScore;
}

// ─── Level selection ───────────────────────────────────────────────────────────

function selectLevel(
  family: FamilyId,
  age: number,
  isGifting: boolean,
  products: PickerProduct[],
): PickerProduct | undefined {
  const familyProducts = products.filter(
    (p) => p.family_id === family && p.is_active,
  );

  // Combo override when gifting (except storytelling which has no combo)
  if (isGifting && family !== "storytelling") {
    return familyProducts.find((p) => p.level === "combo");
  }

  // Storytelling is always single
  if (family === "storytelling") {
    return familyProducts.find((p) => p.level === "none");
  }

  // Tenses: 4–6 → L1, 7–10 → L2
  if (family === "tenses") {
    const targetLevel = age <= 6 ? "1" : "2";
    return familyProducts.find((p) => p.level === targetLevel && !p.is_combo);
  }

  // Question Quest & Everyday Objects: 4–5 → L1, 6–10 → L2
  const targetLevel = age <= 5 ? "1" : "2";
  return familyProducts.find((p) => p.level === targetLevel && !p.is_combo);
}

// ─── Main Component ────────────────────────────────────────────────────────────

interface ProductPickerProps {
  products: Product[];
}

const AGES = [4, 5, 6, 7, 8, 9, 10];
const LEARNING_NEEDS = [
  "Tell stories & organise ideas",
  "Ask better questions",
  "Build vocabulary & everyday awareness",
  "Understand English tenses",
  "Strengthen logic & sequencing",
  "Speak with confidence",
  "Not sure yet",
];
const USE_CASES = [
  "Quick 5–10 minute play",
  "Parent–child time",
  "Travel & waiting time",
  "Classroom or small-group use",
  "Homework & revision",
  "Gifting",
];

export default function ProductPicker({ products }: ProductPickerProps) {
  const [selectedAge, setSelectedAge] = useState<number | null>(null);
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);
  const [selectedUseCases, setSelectedUseCases] = useState<string[]>([]);
  const [results, setResults] = useState<RecommendationResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [limitMsg, setLimitMsg] = useState("");
  const [started, setStarted] = useState(false);
  const isMounted = useRef(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Mount/Session storage loading & Viewed tracking
  useEffect(() => {
    trackEvent("product_picker_viewed");
    try {
      const age = sessionStorage.getItem("lz_picker_age");
      if (age) setSelectedAge(Number(age));
      const needs = sessionStorage.getItem("lz_picker_needs");
      if (needs) setSelectedNeeds(JSON.parse(needs));
      const usecases = sessionStorage.getItem("lz_picker_usecases");
      if (usecases) setSelectedUseCases(JSON.parse(usecases));
      const res = sessionStorage.getItem("lz_picker_results");
      if (res) setResults(JSON.parse(res));
      const hasStarted = sessionStorage.getItem("lz_picker_started");
      if (hasStarted) setStarted(JSON.parse(hasStarted));
    } catch (e) {
      console.error("Failed to load picker state from sessionStorage", e);
    }
    isMounted.current = true;
  }, []);

  // Sync to sessionStorage
  useEffect(() => {
    if (!isMounted.current) return;
    if (selectedAge !== null) {
      sessionStorage.setItem("lz_picker_age", String(selectedAge));
    } else {
      sessionStorage.removeItem("lz_picker_age");
    }
  }, [selectedAge]);

  useEffect(() => {
    if (!isMounted.current) return;
    sessionStorage.setItem("lz_picker_needs", JSON.stringify(selectedNeeds));
  }, [selectedNeeds]);

  useEffect(() => {
    if (!isMounted.current) return;
    sessionStorage.setItem("lz_picker_usecases", JSON.stringify(selectedUseCases));
  }, [selectedUseCases]);

  useEffect(() => {
    if (!isMounted.current) return;
    if (results !== null) {
      sessionStorage.setItem("lz_picker_results", JSON.stringify(results));
    } else {
      sessionStorage.removeItem("lz_picker_results");
    }
  }, [results]);

  useEffect(() => {
    if (!isMounted.current) return;
    sessionStorage.setItem("lz_picker_started", JSON.stringify(started));
  }, [started]);

  // Track product_recommendation_viewed
  useEffect(() => {
    if (results && results.length > 0) {
      results.forEach((rec, idx) => {
        trackEvent("product_recommendation_viewed", {
          selected_age: selectedAge,
          selected_learning_needs: selectedNeeds,
          selected_use_cases: selectedUseCases,
          recommended_family: rec.product.family_id,
          recommended_product: rec.product.product_name,
          recommended_level: rec.product.level,
          recommendation_rank: idx + 1,
          recommendation_score: rec.score,
          gift_mode: rec.isGiftMode,
        });
      });
    }
  }, [results]);

  const triggerStart = () => {
    if (!started) {
      setStarted(true);
      trackEvent("product_picker_started");
    }
  };

  // Convert Product[] to PickerProduct[]
  const pickerProducts: PickerProduct[] = products.map((p) => ({
    product_id: p.slug,
    family_id: p.familyId,
    product_name: p.title,
    level: p.level,
    age_min: p.age.min,
    age_max: p.age.max,
    amazon_url: p.amazonUrl,
    image_url: p.images[0],
    short_description: p.tagline,
    is_combo: p.isCombo,
    is_active: true,
    admin_priority: p.adminPriority,
    slug: p.slug,
  }));

  const notSure = selectedNeeds.includes("Not sure yet");
  const canSubmit = selectedAge !== null && selectedNeeds.length > 0;

  function toggleNeed(need: string) {
    triggerStart();
    let newNeeds: string[] = [];
    if (need === "Not sure yet") {
      newNeeds = selectedNeeds.includes("Not sure yet") ? [] : ["Not sure yet"];
      setSelectedNeeds(newNeeds);
      trackEvent("learning_need_selected", { selected_learning_needs: newNeeds });
      return;
    }
    if (notSure) return;
    if (selectedNeeds.includes(need)) {
      newNeeds = selectedNeeds.filter((n) => n !== need);
      setSelectedNeeds(newNeeds);
      setLimitMsg("");
      trackEvent("learning_need_selected", { selected_learning_needs: newNeeds });
      return;
    }
    if (selectedNeeds.length >= 2) {
      setLimitMsg("You can select up to two.");
      return;
    }
    newNeeds = [...selectedNeeds, need];
    setSelectedNeeds(newNeeds);
    setLimitMsg("");
    trackEvent("learning_need_selected", { selected_learning_needs: newNeeds });
  }

  function toggleUseCase(uc: string) {
    triggerStart();
    let newUseCases: string[] = [];
    if (selectedUseCases.includes(uc)) {
      newUseCases = selectedUseCases.filter((u) => u !== uc);
      setSelectedUseCases(newUseCases);
      setLimitMsg("");
      trackEvent("use_case_selected", { selected_use_cases: newUseCases });
      return;
    }
    if (selectedUseCases.length >= 2) {
      setLimitMsg("You can select up to two.");
      return;
    }
    newUseCases = [...selectedUseCases, uc];
    setSelectedUseCases(newUseCases);
    setLimitMsg("");
    trackEvent("use_case_selected", { selected_use_cases: newUseCases });
  }

  function handleAgeSelect(age: number) {
    triggerStart();
    setSelectedAge(age);
    trackEvent("age_selected", { selected_age: age });
  }

  function handleSubmit() {
    if (!canSubmit) return;
    setLoading(true);
    setResults(null);
    trackEvent("product_picker_submitted", {
      selected_age: selectedAge,
      selected_learning_needs: selectedNeeds,
      selected_use_cases: selectedUseCases,
    });

    setTimeout(() => {
      const age = selectedAge!;
      const isGifting = selectedUseCases.includes("Gifting");
      const families: FamilyId[] = ["storytelling", "question_quest", "everyday_objects", "tenses"];

      // Score each family
      const scores = families.map((fid) => ({
        fid,
        score: calcFamilyScore(fid, age, selectedNeeds, selectedUseCases, notSure),
      }));

      // Sort by score (tie-break by learning score, then age score, then admin priority)
      scores.sort((a, b) => b.score - a.score);

      const topScore = scores[0].score;
      const recs: RecommendationResult[] = [];

      for (let i = 0; i < scores.length && recs.length < 3; i++) {
        const { fid, score } = scores[i];

        // Threshold checks
        if (i === 1 && (score < 55 || topScore - score > 12)) continue;
        if (i === 2 && (score < 55 || topScore - score > 18)) continue;

        const product = selectLevel(fid, age, isGifting, pickerProducts);
        if (!product) continue;

        // Ensure only one per family
        if (recs.some((r) => r.product.family_id === fid)) continue;

        let whyFits = WHY_IT_FITS[fid];
        if (product.is_combo) {
          whyFits += " The Combo Pack includes both levels, making it a more complete and gift-ready learning journey.";
        }

        recs.push({
          product,
          score,
          label: recs.length === 0 ? "Best Match" : "Also a Good Fit",
          whyItFits: whyFits,
          isGiftMode: isGifting,
        });
      }

      setResults(recs);
      setLoading(false);

      // Smooth scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }, 300);
  }

  function handleReset() {
    setSelectedAge(null);
    setSelectedNeeds([]);
    setSelectedUseCases([]);
    setResults(null);
    setLimitMsg("");
    setStarted(false);
    trackEvent("product_picker_reset");
  }

  function handleDetailsClick(rec: RecommendationResult, rank: number) {
    trackEvent("product_details_clicked", {
      selected_age: selectedAge,
      selected_learning_needs: selectedNeeds,
      selected_use_cases: selectedUseCases,
      recommended_family: rec.product.family_id,
      recommended_product: rec.product.product_name,
      recommended_level: rec.product.level,
      recommendation_rank: rank,
      recommendation_score: rec.score,
      gift_mode: rec.isGiftMode,
    });
  }

  function handleAmazonClick(rec: RecommendationResult, rank: number) {
    trackEvent("amazon_product_clicked", {
      selected_age: selectedAge,
      selected_learning_needs: selectedNeeds,
      selected_use_cases: selectedUseCases,
      recommended_family: rec.product.family_id,
      recommended_product: rec.product.product_name,
      recommended_level: rec.product.level,
      recommendation_rank: rank,
      recommendation_score: rec.score,
      gift_mode: rec.isGiftMode,
    });
  }

  const fullProduct = (slug: string) => products.find((p) => p.slug === slug);

  return (
    <div id="product-picker" className="rounded-tile border border-line bg-card p-6 shadow-card md:p-10">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[12px] font-semibold uppercase tracking-wider text-accent">Browse</p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
          Find the right game for your child.
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
          Choose their age, learning goal and when they'll use it. We'll recommend up to three games that fit.
        </p>
      </div>

      {/* Step A — Age */}
      <fieldset className="mb-8">
        <legend className="mb-3 text-[14px] font-semibold text-ink">
          A. How old is your child?{" "}
          <span className="font-normal text-accent">*</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {AGES.map((age) => (
            <button
              key={age}
              type="button"
              aria-pressed={selectedAge === age}
              onClick={() => handleAgeSelect(age)}
              className={`min-h-[44px] rounded-full border px-4 py-2 text-[14px] font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                selectedAge === age
                  ? "border-accent bg-accent text-white"
                  : "border-line bg-paper text-ink hover:border-accent hover:text-accent"
              }`}
            >
              {age} years
            </button>
          ))}
        </div>
      </fieldset>

      {/* Step B — Learning Need */}
      <fieldset className="mb-8">
        <legend className="mb-3 text-[14px] font-semibold text-ink">
          B. What would you like to focus on?{" "}
          <span className="font-normal text-accent">*</span>{" "}
          <span className="font-normal text-ink-soft/60">(up to 2)</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {LEARNING_NEEDS.map((need) => {
            const isSelected = selectedNeeds.includes(need);
            const isDisabled = need === "Not sure yet" ? (selectedNeeds.length > 0 && !notSure) : notSure;
            return (
              <button
                key={need}
                type="button"
                aria-pressed={isSelected}
                disabled={isDisabled}
                onClick={() => toggleNeed(need)}
                className={`min-h-[44px] rounded-full border px-4 py-2 text-[14px] font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-40 ${
                  isSelected
                    ? "border-teal bg-teal text-white"
                    : "border-line bg-paper text-ink hover:border-teal hover:text-teal"
                }`}
              >
                {need}
              </button>
            );
          })}
        </div>
        {limitMsg && (
          <p role="alert" className="mt-2 text-[13px] text-accent">
            {limitMsg}
          </p>
        )}
      </fieldset>

      {/* Step C — Use Case (optional) */}
      <fieldset className="mb-8">
        <legend className="mb-3 text-[14px] font-semibold text-ink">
          C. When will you use it?{" "}
          <span className="font-normal text-ink-soft/60">(optional, up to 2)</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {USE_CASES.map((uc) => {
            const isSelected = selectedUseCases.includes(uc);
            return (
              <button
                key={uc}
                type="button"
                aria-pressed={isSelected}
                onClick={() => toggleUseCase(uc)}
                className={`min-h-[44px] rounded-full border px-4 py-2 text-[14px] font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  isSelected
                    ? "border-gold bg-gold-soft text-ink"
                    : "border-line bg-paper text-ink hover:border-gold hover:text-ink"
                }`}
              >
                {uc}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Submit / Reset */}
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          disabled={!canSubmit || loading}
          onClick={handleSubmit}
          className="min-h-[44px] rounded-full bg-accent px-8 py-3 text-[15px] font-semibold text-white transition-all hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Finding games…
            </span>
          ) : (
            "Find Their Games"
          )}
        </button>
        {results !== null && (
          <button
            type="button"
            onClick={handleReset}
            className="text-[14px] font-medium text-ink-soft underline-offset-2 hover:text-ink hover:underline"
          >
            Start Again
          </button>
        )}
      </div>

      {/* Results */}
      {results !== null && (
        <div ref={resultsRef} className="mt-10 border-t border-line pt-10">
          {results.length === 0 ? (
            <p className="text-ink-soft">No strong match found. Try adjusting your selections.</p>
          ) : (
            <>
              <h3 className="mb-6 text-[18px] font-bold tracking-tight">
                {results.length === 1 ? "Your recommendation" : `Your ${results.length} recommendations`}
              </h3>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((rec) => {
                  const fp = fullProduct(rec.product.slug);
                  return (
                    <div
                      key={rec.product.product_id}
                      className={`relative flex flex-col overflow-hidden rounded-tile border bg-paper shadow-card ${
                        rec.label === "Best Match" ? "border-accent" : "border-line"
                      }`}
                    >
                      {/* Label badge */}
                      <div
                        className={`px-4 py-2 text-[11px] font-semibold uppercase tracking-wider ${
                          rec.label === "Best Match"
                            ? "bg-accent text-white"
                            : "bg-paper-deep text-ink-soft"
                        }`}
                      >
                        {rec.label}
                      </div>

                      {/* Product image */}
                      <div className="relative aspect-[4/3] bg-paper-deep">
                        <Image
                          src={asset(rec.product.image_url)}
                          alt={rec.product.product_name}
                          fill
                          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 280px"
                          className="object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex flex-1 flex-col p-5">
                        {/* Age + level */}
                        <div className="mb-2 flex flex-wrap gap-2">
                          <span className="inline-flex items-center rounded-full bg-teal-soft px-2.5 py-0.5 text-[11px] font-semibold text-teal">
                            {fp?.age.label ?? `Ages ${rec.product.age_min}–${rec.product.age_max}`}
                          </span>
                          {rec.product.level !== "none" && (
                            <span className="inline-flex items-center rounded-full bg-gold-soft px-2.5 py-0.5 text-[11px] font-semibold text-[#9a6a1c]">
                              {rec.product.level === "combo" ? "Combo Pack" : `Level ${rec.product.level}`}
                            </span>
                          )}
                        </div>

                        <h4 className="text-[15px] font-bold leading-snug tracking-tight">
                          {rec.product.product_name}
                        </h4>

                        {/* Why it fits */}
                        <p className="mt-2 flex-1 text-[13px] leading-relaxed text-ink-soft">
                          <span className="font-semibold text-ink">Why it fits: </span>
                          {rec.whyItFits}
                        </p>

                        {/* Buttons */}
                        <div className="mt-4 flex flex-col gap-2">
                          <Link
                            href={`/products/${rec.product.slug}`}
                            onClick={() => handleDetailsClick(rec, results.indexOf(rec) + 1)}
                            className="rounded-full border border-ink bg-ink px-5 py-2.5 text-center text-[14px] font-semibold text-paper transition-colors hover:bg-accent hover:border-accent"
                          >
                            View Game Details
                          </Link>
                          <a
                            href={rec.product.amazon_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => handleAmazonClick(rec, results.indexOf(rec) + 1)}
                            className="rounded-full border border-line px-5 py-2.5 text-center text-[14px] font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
                          >
                            Shop on Amazon ↗
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

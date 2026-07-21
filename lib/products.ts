import fs from "fs";
import path from "path";

export type Product = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  benefits: string[];
  images: string[];
  amazonUrl: string;
  age: { min: number; max: number; label: string };
  learningNeeds: string[];
  useCases: string[];
  difficulty: "Beginner" | "Growing" | "Confident";
  badges: { bestSeller: boolean; newArrival: boolean; mostGifted: boolean };
  comparison: { cards: number; focus: string; format: string };
  bestFor: string[];
  themesIncluded: string;
  familyId: "storytelling" | "question_quest" | "everyday_objects" | "tenses";
  level: "none" | "1" | "2" | "combo";
  isCombo: boolean;
  adminPriority: number;
  rating: number;
  reviewCount: number;
};

const productsDir = path.join(process.cwd(), "content", "products");

/** All products, sorted by adminPriority then reviewCount. */
export function getProducts(): Product[] {
  return fs
    .readdirSync(productsDir)
    .filter((f) => f.endsWith(".json"))
    .map(
      (f) =>
        JSON.parse(fs.readFileSync(path.join(productsDir, f), "utf8")) as Product,
    )
    .sort((a, b) => {
      if (a.adminPriority !== b.adminPriority)
        return a.adminPriority - b.adminPriority;
      return b.reviewCount - a.reviewCount;
    });
}

export function getProduct(slug: string): Product | undefined {
  return getProducts().find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  const all = getProducts();
  const flagged = all.filter(
    (p) => p.badges.bestSeller || p.badges.mostGifted || p.badges.newArrival,
  );
  return (flagged.length >= 4 ? flagged : all).slice(0, 6);
}

/** Distinct filter vocabularies, derived from the data so new JSON values appear automatically. */
export function getFilterOptions(products: Product[]) {
  const uniq = (xs: string[]) => Array.from(new Set(xs));
  return {
    learningNeeds: uniq(products.flatMap((p) => p.learningNeeds)).sort(),
    useCases: uniq(products.flatMap((p) => p.useCases)).sort(),
    ageBands: [
      { label: "4–5 years", min: 4, max: 5 },
      { label: "6–7 years", min: 6, max: 7 },
      { label: "8–10 years", min: 8, max: 10 },
    ],
  };
}

/** Group products by family, useful for picker and comparison. */
export function getProductFamilies(products: Product[]) {
  const families: Record<string, Product[]> = {};
  for (const p of products) {
    if (!families[p.familyId]) families[p.familyId] = [];
    families[p.familyId].push(p);
  }
  return families;
}

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
  rating: number;
  reviewCount: number;
};

const productsDir = path.join(process.cwd(), "content", "products");

/** All products, best-known first. Add a product by dropping a JSON file into content/products/. */
export function getProducts(): Product[] {
  return fs
    .readdirSync(productsDir)
    .filter((f) => f.endsWith(".json"))
    .map(
      (f) =>
        JSON.parse(fs.readFileSync(path.join(productsDir, f), "utf8")) as Product,
    )
    .sort((a, b) => {
      if (a.badges.bestSeller !== b.badges.bestSeller)
        return a.badges.bestSeller ? -1 : 1;
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
      { label: "1–3 years", min: 1, max: 3 },
      { label: "4–6 years", min: 4, max: 6 },
      { label: "7–9 years", min: 7, max: 9 },
      { label: "10–12 years", min: 10, max: 12 },
    ],
  };
}

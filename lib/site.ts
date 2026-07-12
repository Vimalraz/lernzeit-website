/** Central place for brand facts and external links — swap placeholders here. */
export const site = {
  name: "Lernzeit",
  tagline: "Screen-free learning that fits real family life",
  description:
    "Lernzeit makes premium flashcards that turn ten spare minutes into meaningful learning — designed for working parents, loved by children.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://lernzeit.com",
  amazonStoreUrl:
    process.env.NEXT_PUBLIC_AMAZON_STORE_URL ??
    "https://www.amazon.com/stores/Lernzeit", // placeholder — replace with real brand page
  contactEmail: "hello@lernzeit.com", // placeholder
  instagramUrl: "https://www.instagram.com/lernzeit", // placeholder
} as const;

export const nav = [
  { label: "Home", href: "/" },
  { label: "Our Story", href: "/our-story" },
  { label: "Products", href: "/products" },
  { label: "Learning Hub", href: "/blog" },
] as const;

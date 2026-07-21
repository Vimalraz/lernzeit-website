/** Central place for brand facts and external links — swap placeholders here. */
export const site = {
  name: "LernZeit",
  tagline: "Screen-free learning that fits real family life",
  description:
    "LernZeit Creations makes educational flashcard games for children aged 4–10, helping them build language, thinking and everyday skills through play.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://lernzeit.com",
  amazonStoreUrl:
    process.env.NEXT_PUBLIC_AMAZON_STORE_URL ??
    "https://www.amazon.in/stores/LernZeit/page/EE0E082E-9D60-4856-855D-FF6A87C6EB14?ref_=cm_sw_r_ud_sf_stores_MW8KZZBAHJ6TEAV6JZW3",
  contactEmail: "lernzeitcreations@gmail.com",
  instagramUrl: "https://www.instagram.com/lernzeit", // placeholder — update when confirmed
  youtubeUrl: "https://www.youtube.com/@lernzeit", // placeholder — update with real channel URL
} as const;

export const nav = [
  { label: "Home", href: "/" },
  { label: "Our Story", href: "/our-story" },
  { label: "Products", href: "/products" },
  { label: "Learning Hub", href: "/blog" },
  { label: "Wall of Love", href: "/wall-of-love" },
] as const;

// ── Asset Path Helper for Subdirectory Deployments ────────────────────────
// When deployed on GitHub Pages under a subfolder, all absolute static asset
// paths (like "/cards/1-front.jpg") must be prefixed with the subfolder.
export const basePath = "/lernzeit-website";

export function asset(path: string): string {
  if (!path) return "";
  // Return external links or already prefixed paths directly
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (basePath && !clean.startsWith(basePath)) {
    return `${basePath}${clean}`;
  }
  return clean;
}

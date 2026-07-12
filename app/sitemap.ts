import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/cms";
import { getProducts } from "@/lib/products";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();
  const products = getProducts();

  return [
    { url: site.url, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/products`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/our-story`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.url}/blog`, changeFrequency: "daily", priority: 0.8 },
    ...products.map((p) => ({
      url: `${site.url}/products/${p.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...posts.map((p) => ({
      url: `${site.url}/blog/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}

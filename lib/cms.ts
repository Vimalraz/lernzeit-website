import fs from "fs";
import path from "path";

/**
 * Blog content adapter.
 * — With WP_API_URL set (e.g. https://cms.Lernzeit.com/wp-json/wp/v2), posts come
 *   from WordPress: publish in wp-admin and they appear here within a minute (ISR).
 * — Without it, posts come from content/sample-posts/*.json so the site works
 *   locally and before WordPress is installed.
 */
export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO
  category: string;
  coverImage: string;
  readingTime: number; // minutes
  contentHtml: string;
};

const WP_API_URL = process.env.WP_API_URL?.replace(/\/$/, "");
const sampleDir = path.join(process.cwd(), "content", "sample-posts");

const REVALIDATE_SECONDS = 60;

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function readingTimeOf(html: string): number {
  const words = stripHtml(html).split(" ").length;
  return Math.max(1, Math.round(words / 200));
}

/* ——— WordPress mapping ——— */

type WpPost = {
  slug: string;
  date: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url?: string }>;
    "wp:term"?: Array<Array<{ name: string; taxonomy: string }>>;
  };
};

function mapWpPost(wp: WpPost): Post {
  const media = wp._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
  const category =
    wp._embedded?.["wp:term"]
      ?.flat()
      .find((t) => t.taxonomy === "category")?.name ?? "Learning";
  return {
    slug: wp.slug,
    title: stripHtml(wp.title.rendered),
    excerpt: stripHtml(wp.excerpt.rendered),
    date: wp.date,
    category,
    coverImage: media ?? "/images/blog/ten-minute-learning-ritual.svg",
    readingTime: readingTimeOf(wp.content.rendered),
    contentHtml: wp.content.rendered,
  };
}

async function fetchWpPosts(): Promise<Post[]> {
  const res = await fetch(
    `${WP_API_URL}/posts?_embed=1&per_page=50&orderby=date&order=desc`,
    { next: { revalidate: REVALIDATE_SECONDS } },
  );
  if (!res.ok) throw new Error(`WordPress API error ${res.status}`);
  const posts = (await res.json()) as WpPost[];
  return posts.map(mapWpPost);
}

/* ——— Local fallback ——— */

type SamplePost = Omit<Post, "readingTime">;

function readSamplePosts(): Post[] {
  return fs
    .readdirSync(sampleDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const p = JSON.parse(
        fs.readFileSync(path.join(sampleDir, f), "utf8"),
      ) as SamplePost;
      return { ...p, readingTime: readingTimeOf(p.contentHtml) };
    })
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

/* ——— Public API ——— */

export async function getPosts(): Promise<Post[]> {
  if (WP_API_URL) {
    try {
      return await fetchWpPosts();
    } catch (err) {
      console.error("WordPress fetch failed, falling back to sample posts:", err);
    }
  }
  return readSamplePosts();
}

export async function getPost(slug: string): Promise<Post | undefined> {
  const posts = await getPosts();
  return posts.find((p) => p.slug === slug);
}

export async function getCategories(): Promise<string[]> {
  const posts = await getPosts();
  return Array.from(new Set(posts.map((p) => p.category))).sort();
}

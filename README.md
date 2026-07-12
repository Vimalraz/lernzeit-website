# Lernzeit Website

Marketing site for Lernzit flashcards: Next.js 15 frontend + headless WordPress blog.
Four pages — Home, Our Story, Products, Learning Hub (blog) — all driving Amazon purchases.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build check
```

No environment variables are required locally — the blog uses sample posts and
contact forms log to the console. See `.env.example` for all options.

---

## Editing content (no code knowledge needed)

### Add or edit a product
1. Copy any file in `content/products/` (e.g. `alphabet-adventures.json`), rename it to your new product's slug.
2. Fill in the fields — title, tagline, benefits, Amazon URL, age band, `learningNeeds`, `useCases`, difficulty (`Beginner` / `Growing` / `Confident`), badges, rating.
3. Put 3 product photos in `public/images/products/` and reference them in the `images` array (JPG/PNG/WebP all fine — just match the paths).
4. Done — the product appears in the grid, filters, comparison table, goal picker and sitemap automatically.

Placeholder art was generated with `node scripts/generate-placeholders.mjs`; replace those SVGs with real photos whenever ready.

### Change the featured product of the month (blog sidebar)
Edit `content/featured-product.json` — set `slug` to any product slug, update `month` and `note`.

### Reviews & FAQ
- `content/reviews.json` — the review cards on Home and Products (paste real Amazon feedback here).
- `content/faq.json` — the FAQ accordion on the Products page.

### Brand facts & links
`lib/site.ts` — Amazon store URL, contact email, Instagram, tagline.
Brand colors: swap the hex values at the top of `app/globals.css` (`--accent`, `--teal`, `--gold`).

---

## Blog via WordPress (wp-admin)

The Learning Hub reads posts from the WordPress REST API when `WP_API_URL` is set;
otherwise it falls back to the sample posts in `content/sample-posts/`.

### One-time setup (Hostinger)
1. In hPanel, create a subdomain, e.g. **cms.lernzit.com**, and use *Auto Installer → WordPress* on it.
2. In WordPress: set *Settings → Permalinks* to "Post name".
3. Write posts in wp-admin exactly as normal — set a **featured image** (used as the card/cover) and a **category** (used for the filter bubbles).
4. Set the env var on the frontend host: `WP_API_URL=https://cms.lernzit.com/wp-json/wp/v2`

New/edited posts appear on the site within ~60 seconds (ISR revalidation) — no redeploys.

### Discourage indexing of the CMS subdomain (optional but recommended)
In WordPress: *Settings → Reading → Discourage search engines* — the public site serves all content; the subdomain is only an editing backend.

---

## Deployment

Recommended: **WordPress on Hostinger + Next.js frontend on Vercel** (free tier).

1. Push this folder to a GitHub repository.
2. In [vercel.com](https://vercel.com), *Import Project* → select the repo → framework auto-detects Next.js.
3. Add environment variables from `.env.example` (at minimum `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_AMAZON_STORE_URL`; add `WP_API_URL` once WordPress exists).
4. Point the domain: in Hostinger DNS, add the records Vercel shows for `lernzit.com` (A `76.76.21.21` + CNAME `www` → `cname.vercel-dns.com`).
5. Keep `cms.lernzit.com` DNS pointing at Hostinger for WordPress.

Optional instant blog refresh: create a Vercel Deploy Hook and trigger it from a WP "on publish" webhook plugin — not required, ISR already picks up posts within a minute.

### Analytics & Search Console
- GA4: create a property, set `NEXT_PUBLIC_GA_ID=G-…` in Vercel. Loads automatically.
- Search Console: verify via the DNS method in Hostinger, or set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` with the HTML-tag token. `sitemap.xml` and `robots.txt` are generated automatically.

### Contact forms
Create a free form at [formspree.io](https://formspree.io), set `FORMSPREE_ENDPOINT`.
Both the contact form (Our Story) and bulk-enquiry form (Products) deliver through it.
The adapter lives in `lib/email.ts` if you later prefer Resend/SMTP.

---

## Before launch — placeholder swap list

- [ ] Real logo (`components/Logo.tsx`) and brand accent colors (`app/globals.css`)
- [ ] Real product photos in `public/images/products/` + real Amazon URLs in `content/products/*.json`
- [ ] Real Amazon store URL (`NEXT_PUBLIC_AMAZON_STORE_URL`)
- [ ] Real reviews in `content/reviews.json`
- [ ] Founder names, bios & photos (`app/our-story/page.tsx`, "Meet the makers")
- [ ] Behind-the-scenes photos in `public/images/story/`
- [ ] Contact email in `lib/site.ts`
- [ ] GA4 ID, Search Console verification, Formspree endpoint

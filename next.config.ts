import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Static export for Cloudflare Pages ──────────────────────────────────
  // Generates a fully pre-rendered HTML site in the `out/` folder.
  // Cloudflare Pages serves this directly — no Node.js server needed.
  output: "export",

  // Turbopack watch config (used when running `next dev --turbopack`).
  turbopack: {
    rules: {},
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: ["**/node_modules/**", "**/.playwright-mcp/**", "**/*.jpeg", "**/*.png"],
      };
    }
    return config;
  },
  images: {
    // Static export cannot use Next.js image optimisation server.
    // Cloudflare's own image resizing (or the raw files) are used instead.
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "**" }],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;

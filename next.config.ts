import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Static export for GitHub Pages ─────────────────────────────────────
  output: "export",

  // GitHub Pages serves the site at /lernzeit-website/ (the repo name).
  // basePath makes all internal links and asset URLs include this prefix.
  basePath: "/lernzeit-website",
  assetPrefix: "/lernzeit-website/",

  images: {
    // Static export has no image optimisation server; serve originals.
    unoptimized: true,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Disable ESLint and type-check during build for speed (CI handles these separately)
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;

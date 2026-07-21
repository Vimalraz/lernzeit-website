"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import { nav, site } from "@/lib/site";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center pt-4 px-5 pointer-events-none">
      {/* Pill navbar */}
      <div
        className={`pointer-events-auto w-full max-w-4xl transition-all duration-300 ${
          scrolled ? "shadow-[0_8px_32px_rgb(0_0_0/0.12)]" : "shadow-[0_4px_24px_rgb(0_0_0/0.08)]"
        }`}
        style={{
          borderRadius: "999px",
          background: "rgba(250, 247, 241, 0.72)",
          backdropFilter: "blur(20px) saturate(160%)",
          WebkitBackdropFilter: "blur(20px) saturate(160%)",
          border: "1px solid rgba(231, 223, 210, 0.55)",
        }}
      >
        {/* Three-column grid: logo | nav | cta — nav is always exactly centred */}
        <div className="grid h-[68px] items-center px-6" style={{ gridTemplateColumns: "1fr auto 1fr", columnGap: "16px" }}>
          {/* Logo — left */}
          <Logo />

          {/* Nav links — centre */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main">
            {nav.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`group relative whitespace-nowrap rounded-full px-4 py-2.5 text-[14px] tracking-tight transition-all duration-300 ease-out ${
                    active
                      ? "font-semibold text-paper"
                      : "font-medium text-ink-soft hover:-translate-y-0.5 hover:text-ink"
                  }`}
                >
                  {active && (
                    <span className="absolute inset-0 rounded-full bg-ink shadow-[0_6px_16px_-4px_rgba(27,23,18,0.4)]" />
                  )}
                  {!active && (
                    <span className="absolute inset-0 scale-90 rounded-full bg-paper-deep opacity-0 shadow-[0_4px_12px_-2px_rgba(27,23,18,0.12)] transition-all duration-300 ease-out group-hover:scale-100 group-hover:opacity-100" />
                  )}
                  <span className="relative">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* CTA — right (justify-self-end) */}
          <div className="flex items-center gap-3 justify-self-end">
            <a
              href={site.amazonStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative hidden shrink-0 items-center gap-2.5 overflow-hidden rounded-full bg-ink py-2.5 pl-5 pr-2.5 text-[13.5px] font-semibold text-paper transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-6px_rgba(27,23,18,0.5)] active:translate-y-0 active:scale-95 sm:inline-flex"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
              />
              <span className="relative whitespace-nowrap">Shop on Amazon</span>
              <span className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15 transition-all duration-300 ease-out group-hover:translate-x-0.5 group-hover:bg-accent">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </a>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="flex h-9 w-9 items-center justify-center rounded-full md:hidden hover:bg-paper-deep transition-colors"
            >
              <span className="relative block h-3.5 w-5">
                <span
                  className={`absolute left-0 top-0 h-0.5 w-full rounded bg-ink transition-transform duration-300 ${
                    open ? "translate-y-[7px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-[7px] h-0.5 w-full rounded bg-ink transition-opacity duration-200 ${
                    open ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-[14px] h-0.5 w-full rounded bg-ink transition-transform duration-300 ${
                    open ? "-translate-y-[7px] -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`pointer-events-auto w-full max-w-4xl mt-2 overflow-hidden transition-all duration-300 ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{
          borderRadius: "24px",
          background: "rgba(250, 247, 241, 0.92)",
          backdropFilter: "blur(20px) saturate(160%)",
          WebkitBackdropFilter: "blur(20px) saturate(160%)",
          border: "1px solid rgba(231, 223, 210, 0.55)",
        }}
      >
        <nav className="flex flex-col gap-1 px-5 pb-5 pt-3" aria-label="Mobile">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-2xl px-4 py-3 text-base font-medium text-ink hover:bg-paper-deep transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={site.amazonStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 rounded-full bg-ink px-5 py-3 text-center text-[15px] font-semibold text-paper"
          >
            Shop on Amazon
          </a>
        </nav>
      </div>
    </header>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Scroll-snap horizontal carousel with arrow controls. Children become snap items. */
export default function Carousel({
  children,
  ariaLabel,
}: {
  children: React.ReactNode;
  ariaLabel: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  useEffect(() => {
    update();
    const el = trackRef.current;
    el?.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.85), behavior: "smooth" });
  };

  return (
    <div className="relative" role="region" aria-label={ariaLabel}>
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>

      <div className="mt-5 flex justify-end gap-2.5">
        <ArrowButton dir="prev" onClick={() => scrollBy(-1)} disabled={!canPrev} />
        <ArrowButton dir="next" onClick={() => scrollBy(1)} disabled={!canNext} />
      </div>
    </div>
  );
}

function ArrowButton({
  dir,
  onClick,
  disabled,
}: {
  dir: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Previous products" : "Next products"}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-card text-ink transition-all hover:border-ink disabled:opacity-30 disabled:hover:border-line"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
        style={{ transform: dir === "prev" ? "rotate(180deg)" : undefined }}
      >
        <path
          d="M5 12h14m0 0-6-6m6 6-6 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

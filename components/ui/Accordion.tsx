"use client";

import { useState } from "react";

export default function Accordion({
  items,
}: {
  items: { q: string; a: string }[];
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="divide-y divide-line rounded-tile border border-line bg-card">
      {items.map((item, i) => {
        const open = openIdx === i;
        return (
          <div key={item.q} className="group relative transition-colors duration-300 ease-out hover:bg-teal-soft">
            <span
              aria-hidden
              className="pointer-events-none absolute left-0 top-0 h-full w-[3px] origin-bottom scale-y-0 bg-teal transition-transform duration-300 ease-out group-hover:scale-y-100"
            />
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpenIdx(open ? null : i)}
              className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left"
            >
              <span className="text-[16px] font-semibold tracking-tight">
                {item.q}
              </span>
              <span
                aria-hidden
                className={`flex h-8 w-8 flex-none items-center justify-center rounded-full border border-line text-lg ${
                  open
                    ? "rotate-45 border-accent text-accent transition-transform duration-300"
                    : "bg-card transition-all duration-[450ms] ease-[cubic-bezier(.34,1.56,.64,1)] group-hover:rotate-90 group-hover:border-teal group-hover:text-teal"
                }`}
              >
                +
              </span>
            </button>
            <div
              className={`grid transition-[grid-template-rows] duration-300 ${
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-6 text-[15px] leading-relaxed text-ink-soft">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

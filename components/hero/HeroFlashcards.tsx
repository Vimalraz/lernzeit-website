"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

/* Scripted intro, then interactive:
   step 0  nothing
   step 1  cards deal in (staggered)
   step 2  hand arrives over the middle card
   step 3  hand taps → middle card flips
   step 4  hand drags the third card to its slot
   step 5  hand leaves → cards become flippable + draggable by the user */

type CardDef = {
  id: string;
  front: string; // path relative to /public
  back: string;
};

const CARDS: CardDef[] = [
  { id: "c1", front: "/cards/1-front.jpg", back: "/cards/1-back.jpg" },
  { id: "c3", front: "/cards/3-front.jpg", back: "/cards/3-back.jpg" },
  { id: "c2", front: "/cards/2-front.jpg", back: "/cards/2-back.jpg" },
];

const SLOT_X = [-198, 0, 198];
const SLOT_ROT = [-5, 2.5, -3];
const CARD_W = 176;
const CARD_H = 248;

export default function HeroFlashcards() {
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const [order, setOrder] = useState<string[]>(["c1", "c3", "c2"]);
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const arenaRef = useRef<HTMLDivElement>(null);

  const interactive = step >= 5;

  useEffect(() => {
    if (reduceMotion) {
      setStep(5);
      setOrder(["c1", "c2", "c3"]);
      setFlipped({ c3: true });
      return;
    }
    const schedule: Array<[number, number]> = [
      [1, 300],
      [2, 1500],
      [3, 2250],
      [4, 3250],
      [5, 4450],
    ];
    const timers = schedule.map(([s, t]) => setTimeout(() => setStep(s), t));
    return () => timers.forEach(clearTimeout);
  }, [reduceMotion]);

  useEffect(() => {
    if (step === 3) setFlipped((f) => ({ ...f, c3: true }));
    if (step === 4) setOrder(["c1", "c2", "c3"]);
  }, [step]);

  // Hand choreography, in arena coordinates (0,0 = center)
  const hand =
    step < 2
      ? { x: 320, y: 340, opacity: 0 }
      : step === 2 || step === 3
        ? { x: 26, y: 60, opacity: 1 }
        : step === 4
          ? { x: SLOT_X[2] + 26, y: 74, opacity: 1 }
          : { x: 420, y: 380, opacity: 0 };

  return (
    <div className="flex flex-col items-center">
      {/* Fixed-size stage scaled down responsively */}
      <div className="origin-top scale-[0.52] sm:scale-[0.72] md:scale-90 lg:scale-100">
        <div
          ref={arenaRef}
          className="relative"
          style={{ width: 620, height: 320 }}
        >
          {CARDS.map((card) => {
            const slot = order.indexOf(card.id);
            const isDragged = step === 4 && card.id === "c2";
            const isFlipped = !!flipped[card.id];
            return (
              <motion.div
                key={card.id}
                className="absolute left-1/2 top-1/2"
                style={{
                  width: CARD_W,
                  height: CARD_H,
                  marginLeft: -CARD_W / 2,
                  marginTop: -CARD_H / 2,
                  zIndex: isDragged ? 30 : 10,
                }}
                initial={{ x: -40, y: -420, rotate: 18, opacity: 0 }}
                animate={
                  step >= 1
                    ? {
                        x: SLOT_X[slot],
                        y: 0,
                        rotate: SLOT_ROT[slot],
                        opacity: 1,
                        scale: isDragged ? 1.07 : 1,
                      }
                    : undefined
                }
                transition={{
                  type: "spring",
                  stiffness: 210,
                  damping: 22,
                  delay: step === 1 ? CARDS.indexOf(card) * 0.14 : 0,
                }}
                drag={interactive}
                dragConstraints={arenaRef}
                dragElastic={0.18}
                whileDrag={{ scale: 1.06, zIndex: 40 }}
              >
                <CardFace
                  card={card}
                  flipped={isFlipped}
                  interactive={interactive}
                  onFlip={() => {
                    if (interactive)
                      setFlipped((f) => ({ ...f, [card.id]: !f[card.id] }));
                  }}
                />
              </motion.div>
            );
          })}

          {/* The guiding hand */}
          <motion.div
            className="pointer-events-none absolute left-1/2 top-1/2 z-50"
            initial={{ x: 320, y: 340, opacity: 0 }}
            animate={hand}
            transition={{ type: "spring", stiffness: 130, damping: 18 }}
          >
            <motion.div
              animate={step === 3 ? { scale: [1, 0.82, 1] } : { scale: 1 }}
              transition={{ duration: 0.45 }}
            >
              <HandGlyph />
            </motion.div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {interactive && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-2 text-sm font-medium text-ink-soft sm:-mt-16 md:-mt-6 lg:mt-2"
          >
            Tap a card to flip it, drag it anywhere.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function CardFace({
  card,
  flipped,
  interactive,
  onFlip,
}: {
  card: CardDef;
  flipped: boolean;
  interactive: boolean;
  onFlip: () => void;
}) {
  return (
    <div className="perspective-1200 h-full w-full">
      <motion.div
        className="preserve-3d relative h-full w-full"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 22 }}
      >
        {/* ── Front face ── */}
        <div className="backface-hidden absolute inset-0 overflow-hidden rounded-2xl shadow-lift">
          <Image
            src={card.front}
            alt="Lernzeit flashcard front"
            fill
            sizes="176px"
            className="object-cover"
            draggable={false}
          />
          {/* Flip button */}
          {interactive && (
            <FlipButton flipped={false} onClick={onFlip} />
          )}
        </div>

        {/* ── Back face ── */}
        <div
          className="backface-hidden absolute inset-0 overflow-hidden rounded-2xl shadow-lift"
          style={{ transform: "rotateY(180deg)" }}
        >
          <Image
            src={card.back}
            alt="Lernzeit flashcard back"
            fill
            sizes="176px"
            className="object-cover"
            draggable={false}
          />
          {/* Flip button (mirrored so text reads right) */}
          {interactive && (
            <div style={{ transform: "scaleX(-1)" }}>
              <FlipButton flipped={true} onClick={onFlip} />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

/** Animated flip icon button — bottom-right corner of every card */
function FlipButton({
  flipped,
  onClick,
}: {
  flipped: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={flipped ? "Flip back" : "Flip card"}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="absolute bottom-2.5 right-2.5 z-20 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition-all hover:bg-black/60 hover:scale-110 active:scale-95"
    >
      <motion.div
        animate={{ rotate: flipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="flex items-center justify-center"
      >
        <FlipIcon />
      </motion.div>
    </button>
  );
}

function FlipIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="text-white"
    >
      {/* Circular arrows "flip" icon */}
      <path
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HandGlyph() {
  return (
    <svg width="64" height="78" viewBox="0 0 72 88" fill="none" aria-hidden>
      {/* index finger */}
      <rect x="26" y="2" width="15" height="48" rx="7.5" fill="var(--ink)" />
      {/* palm */}
      <rect x="14" y="30" width="46" height="44" rx="18" fill="var(--ink)" />
      {/* thumb */}
      <rect
        x="2"
        y="40"
        width="26"
        height="15"
        rx="7.5"
        fill="var(--ink)"
        transform="rotate(24 2 40)"
      />
      {/* sleeve */}
      <rect x="20" y="70" width="34" height="16" rx="8" fill="var(--accent)" />
    </svg>
  );
}

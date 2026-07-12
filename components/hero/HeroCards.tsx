"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

type CardDef = {
  id: string;
  front: string;
  back: string;
  label: string;
};

// 5 cards — all with proper front + back images now
const CARDS: CardDef[] = [
  { id: "c1", front: "/cards/1-front.jpg", back: "/cards/1-back.jpg", label: "Animals"  },
  { id: "c2", front: "/cards/2-front.jpg", back: "/cards/2-back.jpg", label: "Numbers"  },
  { id: "c3", front: "/cards/3-front.jpg", back: "/cards/3-back.jpg", label: "Alphabet" },
  { id: "c4", front: "/cards/4-front.jpg", back: "/cards/4-back.jpg", label: "Colours"  },
  { id: "c5", front: "/cards/5-front.jpg", back: "/cards/5-back.jpg", label: "Nature"   },
];

const CARD_W = 220;
const CARD_H = 308;

// Stack offsets — cards layer like a tidy physical deck, bottom-right to top-left
// Index 0 = deepest in stack (furthest back), index 4 = top of stack
const STACK_OFFSET = 10; // px between each layer (x and y)

// Each card's permanent resting slot in the stack
function basePos(stackDepth: number) {
  // stackDepth: 0 = front of stack, 4 = deepest
  const offset = stackDepth * STACK_OFFSET;
  return { x: offset, y: offset, rotate: 0, scale: 1 - stackDepth * 0.012 };
}

// The popped-out "active" card position — lifted above and slightly left
const ACTIVE_POS = { x: -24, y: -52, rotate: 0, scale: 1.06 };

export default function HeroCards() {
  const reduceMotion = useReducedMotion();
  const [entered,  setEntered]  = useState(false);
  // stackOrder[i] = which card is at stack depth i (0=front, 4=back)
  // Initially card 0 (c1) is at depth 0 = front/active
  const [active,   setActive]   = useState(0);
  const [flipped,  setFlipped]  = useState<Record<string, boolean>>({});

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), reduceMotion ? 0 : 250);
    return () => clearTimeout(t);
  }, [reduceMotion]);

  function pickCard(cardIdx: number) {
    if (cardIdx === active) {
      // tap the active (popped) card → flip it
      setFlipped(f => ({ ...f, [CARDS[cardIdx].id]: !f[CARDS[cardIdx].id] }));
    } else {
      // tap a stack card → bring it out, un-flip it, put everything else back
      setActive(cardIdx);
      setFlipped(f => ({ ...f, [CARDS[cardIdx].id]: false }));
    }
  }

  // Compute stack depth for each card (active card is "not in stack" = depth 0 visually)
  // Non-active cards fill depths 1–4 in their natural order
  function stackDepth(cardIdx: number): number {
    if (cardIdx === active) return -1; // not in stack
    const nonActive = CARDS
      .map((_, i) => i)
      .filter(i => i !== active);
    return nonActive.indexOf(cardIdx) + 1; // depths 1..4
  }

  return (
    <div
      className="relative flex items-center justify-center select-none"
      // Container sized to fit: stack spread (4*10=40px extra) + card + active lift (52px)
      style={{ width: CARD_W + 100, height: CARD_H + 120 }}
    >
      {/* Render deepest cards first so active card renders on top */}
      {[...CARDS].reverse().map((card, revIdx) => {
        const cardIdx   = CARDS.length - 1 - revIdx;
        const isActive  = cardIdx === active;
        const depth     = stackDepth(cardIdx);
        const bp        = isActive ? ACTIVE_POS : basePos(depth);
        const zIdx      = isActive ? 20 : (5 - depth);
        const isFlipped = isActive && !!flipped[card.id];

        return (
          <motion.div
            key={card.id}
            className="absolute cursor-pointer"
            style={{ width: CARD_W, height: CARD_H, zIndex: zIdx, left: 40, top: 52 }}
            initial={
              reduceMotion
                ? { opacity: 1, x: bp.x, y: bp.y, rotate: bp.rotate, scale: bp.scale }
                : { opacity: 0, x: bp.x, y: bp.y - 40, rotate: 0, scale: 0.9 }
            }
            animate={
              entered
                ? { opacity: 1, x: bp.x, y: bp.y, rotate: bp.rotate, scale: bp.scale }
                : {}
            }
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 28,
              delay: reduceMotion ? 0 : revIdx * 0.06,
            }}
            // Peek up on hover only for stack cards — shows they're clickable
            whileHover={
              !isActive
                ? {
                    y: bp.y - 14,
                    scale: bp.scale + 0.03,
                    transition: { type: "spring", stiffness: 400, damping: 22 },
                  }
                : {}
            }
            onClick={() => pickCard(cardIdx)}
          >
            <CardFace
              card={card}
              flipped={isFlipped}
              isActive={isActive}
              onFlip={e => {
                e.stopPropagation();
                setFlipped(f => ({ ...f, [card.id]: !f[card.id] }));
              }}
            />
          </motion.div>
        );
      })}

      {/* Subtle drop shadow under the stack */}
      <div
        className="absolute pointer-events-none rounded-2xl"
        style={{
          width: CARD_W + 40,
          height: 24,
          bottom: 4,
          left: 20,
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0.18) 0%, transparent 70%)",
          filter: "blur(6px)",
        }}
      />

      {/* Hint */}
      <AnimatePresence>
        {entered && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="absolute -bottom-7 left-0 right-0 text-center text-[12px] font-medium text-ink-soft/55 tracking-wide"
          >
            Tap a card from the stack · tap the front to flip
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Card face ─────────────────────────────────────────────── */

function CardFace({
  card, flipped, isActive, onFlip,
}: {
  card: CardDef;
  flipped: boolean;
  isActive: boolean;
  onFlip: (e: React.MouseEvent) => void;
}) {
  return (
    <div className="perspective-1200 h-full w-full">
      <motion.div
        className="preserve-3d relative h-full w-full"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
      >
        {/* ── Front ── */}
        <div className="backface-hidden absolute inset-0 overflow-hidden rounded-2xl shadow-lift ring-1 ring-black/8">
          <Image
            src={card.front}
            alt={`${card.label} flashcard front`}
            fill sizes="220px"
            className="object-cover"
            draggable={false}
            priority={isActive}
          />
          {/* Label pill */}
          <div className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur-sm px-3 py-[5px] text-[11px] font-semibold text-ink shadow-sm">
            {card.label}
          </div>
          {/* Flip button — only on active card */}
          {isActive && (
            <button
              type="button" aria-label="Flip card" onClick={onFlip}
              className="absolute bottom-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition-all hover:bg-black/60 hover:scale-110 active:scale-95"
            >
              <FlipIcon />
            </button>
          )}
        </div>

        {/* ── Back ── */}
        <div
          className="backface-hidden absolute inset-0 overflow-hidden rounded-2xl shadow-lift ring-1 ring-black/8"
          style={{ transform: "rotateY(180deg)" }}
        >
          <Image
            src={card.back}
            alt={`${card.label} flashcard back`}
            fill sizes="220px"
            className="object-cover"
            draggable={false}
          />
          {isActive && (
            <div style={{ transform: "scaleX(-1)" }}>
              <button
                type="button" aria-label="Flip back" onClick={onFlip}
                className="absolute bottom-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition-all hover:bg-black/60 hover:scale-110 active:scale-95"
              >
                <FlipIcon />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function FlipIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden className="text-white">
      <path
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

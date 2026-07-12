"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";
import Image from "next/image";

/* ────────────────────────────────────────────────────────────────
   Cardy-style draggable flashcards, reimagined as a tiny game:
   cards start scattered at playful angles, the player drags each one
   into a row of slots. Cards also flip. When all five sit in the
   correct 1→5 order, their borders turn green and a pair of CTA
   buttons fades in (jump to the product section / buy on Amazon).

   Coordinates below are in "design units". A measured factor `k`
   scales them to fit the viewport. Crucially, the scale is applied to
   the numbers and *inside* each card — never as a transform on an
   ancestor of the draggable — so framer-motion drag stays 1:1 with the
   cursor at every screen size.
   ──────────────────────────────────────────────────────────────── */

type CardDef = { id: string; front: string; back: string; label: string };

// Card index i must land in slot i to be "in order".
const CARDS: CardDef[] = [
  { id: "c1", front: "/cards/1-front.jpg", back: "/cards/1-back.jpg", label: "1 · Animals" },
  { id: "c2", front: "/cards/2-front.jpg", back: "/cards/2-back.jpg", label: "2 · Numbers" },
  { id: "c3", front: "/cards/3-front.jpg", back: "/cards/3-back.jpg", label: "3 · Alphabet" },
  { id: "c4", front: "/cards/4-front.jpg", back: "/cards/4-back.jpg", label: "4 · Colours" },
  { id: "c5", front: "/cards/5-front.jpg", back: "/cards/5-back.jpg", label: "5 · Nature" },
];

const CARD_W = 166;
const CARD_H = 232;
const GAP = 20;
const SLOT_STEP = CARD_W + GAP; // horizontal distance between slot centres
const SNAP_DIST = 130; // how close a drop must be (design units) to grab a slot

// Y is measured from the arena TOP (x still from the horizontal centre). The
// slot row lives near the top; loose cards scatter below it. Because the origin
// is the top edge, we can shrink the arena's height without shifting any card.
const ROW_CY = 118; // slot-row card-centre, from arena top
const STAGE_W = 940;
const STAGE_H = 348; // height while cards are still scattered
const STAGE_H_TIDY = 288; // collapsed height once every slot is filled
const K_MAX = 1;
const K_MIN = 0.34;

// Deliberately shuffled, out-of-order scatter (x from centre, y from top; deg).
// Cards begin as a loose fanned pile overlapping the slot row, so the colourful
// cards — not empty slots — fill the space right under the hero copy.
const SCATTER: Array<{ x: number; y: number; rotate: number }> = [
  { x: -300, y: 168, rotate: -9 }, // c1
  { x: -150, y: 128, rotate: 6 }, // c2
  { x: 10, y: 182, rotate: -5 }, // c3
  { x: 168, y: 132, rotate: 10 }, // c4
  { x: 312, y: 170, rotate: -8 }, // c5
];

function slotPos(slot: number) {
  return { x: (slot - 2) * SLOT_STEP, y: ROW_CY, rotate: 0 };
}

type Pos = { x: number; y: number; rotate: number };

export default function HeroCardArrange() {
  const reduceMotion = useReducedMotion();

  // One AnimationControls per card (fixed count → safe to call directly).
  const ctrl0 = useAnimationControls();
  const ctrl1 = useAnimationControls();
  const ctrl2 = useAnimationControls();
  const ctrl3 = useAnimationControls();
  const ctrl4 = useAnimationControls();
  const controls = [ctrl0, ctrl1, ctrl2, ctrl3, ctrl4];

  const wrapRef = useRef<HTMLDivElement>(null);
  const arenaRef = useRef<HTMLDivElement>(null);

  // Responsive scale factor, measured from the available width.
  const [k, setK] = useState(0.5);
  const kRef = useRef(k);
  kRef.current = k;

  // Authoritative geometry (design units) lives in refs so drag handlers
  // always read fresh values.
  const targetsRef = useRef<Pos[]>(SCATTER.map((s) => ({ ...s })));
  const slotOfCard = useRef<(number | null)[]>([null, null, null, null, null]);
  const cardInSlot = useRef<(number | null)[]>([null, null, null, null, null]);

  const [solved, setSolved] = useState(false);
  const [allPlaced, setAllPlaced] = useState(false); // every slot filled → collapse height
  const [flipped, setFlipped] = useState<boolean[]>([false, false, false, false, false]);
  const [ready, setReady] = useState(false);
  const [measured, setMeasured] = useState(false);

  // Measure available width → k (before paint, so the intro uses the right scale)
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      const next = Math.max(K_MIN, Math.min(K_MAX, w / STAGE_W));
      setK(next);
    };
    measure();
    setMeasured(true);
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Place / reposition cards. Waits for the first measurement, runs the intro
  // once, then just re-snaps to current logical spots on later resizes.
  const introDone = useRef(false);
  useEffect(() => {
    if (!measured) return;
    const kk = kRef.current;

    if (reduceMotion) {
      CARDS.forEach((_, i) => {
        const p = slotPos(i);
        slotOfCard.current[i] = i;
        cardInSlot.current[i] = i;
        targetsRef.current[i] = p;
        controls[i].set({ x: p.x * kk, y: p.y * kk, rotate: 0, opacity: 1, scale: 1 });
      });
      setSolved(true);
      setAllPlaced(true);
      setReady(true);
      return;
    }

    if (!introDone.current) {
      // First run: drop the cards into their scattered starting spots.
      introDone.current = true;
      CARDS.forEach((_, i) => {
        const s = targetsRef.current[i];
        controls[i].start({
          x: s.x * kk,
          y: s.y * kk,
          rotate: s.rotate,
          opacity: 1,
          scale: 1,
          transition: { type: "spring", stiffness: 190, damping: 20, delay: 0.15 + i * 0.11 },
        });
      });
      setReady(true);
    } else {
      // Later resizes: snap each card to its current logical spot at the new scale.
      CARDS.forEach((_, i) => {
        const t = targetsRef.current[i];
        controls[i].set({ x: t.x * kk, y: t.y * kk, rotate: t.rotate, opacity: 1, scale: 1 });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion, measured, k]);

  function recomputeSolved() {
    setAllPlaced(cardInSlot.current.every((c) => c !== null));
    setSolved(cardInSlot.current.every((c, s) => c === s));
  }

  function handleDragEnd(cardIdx: number, info: PanInfo) {
    const kk = kRef.current;
    const cur = targetsRef.current[cardIdx];
    // info.offset is in on-screen px; convert to design units.
    const dropX = cur.x + info.offset.x / kk;
    const dropY = cur.y + info.offset.y / kk;

    // Nearest slot — occupied ones included, so a drop can swap two cards.
    let best = -1;
    let bestD = Infinity;
    for (let s = 0; s < 5; s++) {
      const p = slotPos(s);
      const d = Math.hypot(dropX - p.x, dropY - p.y);
      if (d < bestD) {
        bestD = d;
        best = s;
      }
    }

    const prev = slotOfCard.current[cardIdx];
    let target: Pos;

    if (best >= 0 && bestD < SNAP_DIST) {
      const displaced = cardInSlot.current[best];
      if (displaced !== null && displaced !== cardIdx) {
        // Swap: the card already in this slot moves to where the dragged
        // card came from (its previous slot, or loose if it had none).
        if (prev !== null) {
          cardInSlot.current[prev] = displaced;
          slotOfCard.current[displaced] = prev;
          const dp = slotPos(prev);
          targetsRef.current[displaced] = dp;
          controls[displaced].start({
            x: dp.x * kk,
            y: dp.y * kk,
            rotate: 0,
            scale: 1,
            transition: { type: "spring", stiffness: 320, damping: 26 },
          });
        } else {
          slotOfCard.current[displaced] = null;
          const lp = { x: cur.x, y: cur.y, rotate: cur.rotate };
          targetsRef.current[displaced] = lp;
          controls[displaced].start({
            x: lp.x * kk,
            y: lp.y * kk,
            rotate: lp.rotate,
            scale: 1,
            transition: { type: "spring", stiffness: 320, damping: 26 },
          });
        }
      } else if (prev !== null) {
        cardInSlot.current[prev] = null;
      }
      cardInSlot.current[best] = cardIdx;
      slotOfCard.current[cardIdx] = best;
      target = slotPos(best);
    } else {
      // Rest wherever it was dropped (clamped), no longer in a slot.
      if (prev !== null) cardInSlot.current[prev] = null;
      slotOfCard.current[cardIdx] = null;
      const halfW = STAGE_W / 2 - CARD_W / 2 - 4; // x from centre
      const minY = CARD_H / 2 + 4; // y from top
      const maxY = STAGE_H - CARD_H / 2 - 4;
      target = {
        x: Math.max(-halfW, Math.min(halfW, dropX)),
        y: Math.max(minY, Math.min(maxY, dropY)),
        rotate: cur.rotate,
      };
    }

    targetsRef.current[cardIdx] = target;
    controls[cardIdx].start({
      x: target.x * kk,
      y: target.y * kk,
      rotate: target.rotate,
      scale: 1,
      transition: { type: "spring", stiffness: 320, damping: 26 },
    });
    recomputeSolved();
  }

  function toggleFlip(cardIdx: number) {
    setFlipped((f) => f.map((v, i) => (i === cardIdx ? !v : v)));
  }

  const cardW = CARD_W * k;
  const cardH = CARD_H * k;

  return (
    <div ref={wrapRef} className="flex w-full flex-col items-center">
      {/* Arena — sized in real px so nothing that wraps the draggable is scaled.
          Height collapses once every slot is filled, folding away the dead
          space below the row (the top-anchored origin keeps cards put). */}
      <div
        ref={arenaRef}
        className="relative"
        style={{
          width: STAGE_W * k,
          height: (allPlaced ? STAGE_H_TIDY : STAGE_H) * k,
          maxWidth: "100%",
          transition: "height 0.55s cubic-bezier(0.21, 0.65, 0.36, 1)",
        }}
      >
        {/* Slot guides (non-interactive) — safe to scale as a group */}
        <div
          className="pointer-events-none absolute left-1/2 top-0 z-0"
          style={{ transform: `scale(${k})`, transformOrigin: "top center" }}
        >
          {Array.from({ length: 5 }).map((_, s) => {
            const p = slotPos(s);
            return (
              <motion.div
                key={s}
                className="absolute rounded-2xl border-2 border-dashed"
                animate={{
                  borderColor: solved ? "var(--green)" : "rgba(27,23,18,0.16)",
                  opacity: solved ? 0.4 : 1,
                }}
                style={{ width: CARD_W, height: CARD_H, left: p.x - CARD_W / 2, top: p.y - CARD_H / 2 }}
              >
                <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 text-2xl font-bold text-ink/25">
                  {s + 1}
                </span>
              </motion.div>
            );
          })}
        </div>

        {CARDS.map((card, i) => (
          <motion.div
            key={card.id}
            className="group absolute left-1/2 top-0 cursor-grab touch-none active:cursor-grabbing"
            style={{ width: cardW, height: cardH, marginLeft: -cardW / 2, marginTop: -cardH / 2, zIndex: 10 + i }}
            initial={{ opacity: 0, x: SCATTER[i].x * k, y: (SCATTER[i].y - 70) * k, rotate: SCATTER[i].rotate, scale: 0.82 }}
            animate={controls[i]}
            drag={ready}
            dragConstraints={arenaRef}
            dragElastic={0.16}
            dragMomentum={false}
            whileDrag={{ scale: 1.07, zIndex: 60, cursor: "grabbing" }}
            onDragEnd={(_, info) => handleDragEnd(i, info)}
          >
            {/* Visual scale lives INSIDE the draggable, so it never affects drag */}
            <div style={{ width: CARD_W, height: CARD_H, transform: `scale(${k})`, transformOrigin: "top left" }}>
              <CardFace card={card} flipped={flipped[i]} solved={solved} onFlip={() => toggleFlip(i)} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Guidance / success line — text only, no CTAs */}
      <div className="mt-3 min-h-[3rem] px-4 text-center">
        <AnimatePresence mode="wait">
          {solved ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.45, ease: [0.21, 0.65, 0.36, 1] }}
            >
              <p className="text-[15px] font-semibold text-green">
                Perfect — that&apos;s a morning, sorted! 🎉
              </p>
              <p className="mt-1 text-[13px] text-ink-soft/80">
                Wake up → brush teeth → breakfast → pack the bag → out the door
              </p>
            </motion.div>
          ) : (
            <motion.p
              key="hint"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4 }}
              className="mx-auto max-w-md text-[13px] font-medium leading-relaxed tracking-wide text-ink-soft/75"
            >
              Put the cards in the order of a child&apos;s morning routine —
              from the moment they wake to out the door. Tap the corner icon to flip a card.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── Card face (front / back, flip, animated gradient border on solve) ── */

function CardFace({
  card,
  flipped,
  solved,
  onFlip,
}: {
  card: CardDef;
  flipped: boolean;
  solved: boolean;
  onFlip: () => void;
}) {
  return (
    <div className="perspective-1200 h-full w-full select-none">
      <motion.div
        className="preserve-3d relative h-full w-full"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
      >
        <Face src={card.front} alt={`${card.label} flashcard`} solved={solved} onFlip={onFlip} />
        <Face src={card.back} alt={`${card.label} flashcard back`} solved={solved} onFlip={onFlip} back />
      </motion.div>
    </div>
  );
}

function Face({
  src,
  alt,
  solved,
  onFlip,
  back = false,
}: {
  src: string;
  alt: string;
  solved: boolean;
  onFlip: () => void;
  back?: boolean;
}) {
  return (
    <div
      className={`backface-hidden absolute inset-0 rounded-2xl transition-shadow duration-500 ${
        solved ? "shadow-[0_16px_38px_-10px_rgba(34,160,107,0.55)]" : "shadow-lift"
      }`}
      style={back ? { transform: "rotateY(180deg)" } : undefined}
    >
      {/* Flowing gradient border — sits behind the image, fades in on solve */}
      <div
        className={`pointer-events-none absolute -inset-[3px] rounded-[19px] flip-ring transition-opacity duration-500 ${
          solved ? "opacity-100" : "opacity-0"
        }`}
      />
      <div className="relative h-full w-full overflow-hidden rounded-2xl ring-1 ring-black/10">
        <Image src={src} alt={alt} fill sizes="180px" className="object-cover" draggable={false} />
        {/* The back face's net rotation is identity (card 180° × face 180°), so
            its content is upright — no mirroring needed on either face. */}
        <FlipButton onFlip={onFlip} />
      </div>
    </div>
  );
}

/** Flip control — a little 3D card that spins once each time the card is hovered
 *  (CSS animation gated on `group-hover`, so it replays on every fresh hover). */
function FlipButton({ onFlip }: { onFlip: () => void }) {
  return (
    <button
      type="button"
      aria-label="Flip card"
      // Stop pointerdown so pressing the button never starts a drag.
      onPointerDownCapture={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        onFlip();
      }}
      className="absolute bottom-2.5 right-2.5 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/45 backdrop-blur-sm transition-transform hover:scale-110 active:scale-95"
    >
      <span className="block h-[18px] w-[14px]" style={{ perspective: 240 }}>
        <span className="relative block h-full w-full [transform-style:preserve-3d] group-hover:[animation:icon-flip_0.7s_ease-in-out]">
          {/* front face of the mini card */}
          <span className="absolute inset-0 flex items-end justify-center rounded-[3px] bg-white pb-[3px] [backface-visibility:hidden]">
            <span className="h-[2px] w-[8px] rounded-full bg-ink/45" />
          </span>
          {/* back face of the mini card */}
          <span
            className="absolute inset-0 rounded-[3px] bg-white/55 [backface-visibility:hidden]"
            style={{ transform: "rotateY(180deg)" }}
          />
        </span>
      </span>
    </button>
  );
}

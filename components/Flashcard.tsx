"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type FlashcardProps = {
  front: React.ReactNode;
  back: React.ReactNode;
  /** Controls size/positioning from the outside, e.g. "h-56 w-44" */
  className?: string;
  /** Controlled flip state; leave undefined for self-managed click-to-flip */
  flipped?: boolean;
  onFlip?: (flipped: boolean) => void;
  ariaLabel?: string;
};

/**
 * The LernZeit signature object: a 3D-flippable card.
 * Click / Enter / Space flips it. Wrap in motion.div for drag behaviors.
 */
export default function Flashcard({
  front,
  back,
  className = "",
  flipped,
  onFlip,
  ariaLabel = "Flashcard — activate to flip",
}: FlashcardProps) {
  const [internal, setInternal] = useState(false);
  const isFlipped = flipped ?? internal;

  const toggle = () => {
    const next = !isFlipped;
    if (flipped === undefined) setInternal(next);
    onFlip?.(next);
  };

  return (
    <div
      className={`perspective-1200 select-none ${className}`}
      role="button"
      tabIndex={0}
      aria-pressed={isFlipped}
      aria-label={ariaLabel}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      }}
    >
      <motion.div
        className="preserve-3d relative h-full w-full cursor-pointer"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
      >
        <div className="backface-hidden absolute inset-0">{front}</div>
        <div
          className="backface-hidden absolute inset-0"
          style={{ transform: "rotateY(180deg)" }}
        >
          {back}
        </div>
      </motion.div>
    </div>
  );
}

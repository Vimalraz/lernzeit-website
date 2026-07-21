import Link from "next/link";
import Flashcard from "@/components/Flashcard";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-5 py-24 text-center">
      <Flashcard
        className="h-64 w-44"
        ariaLabel="404 card — flip me"
        front={
          <div className="flex h-full w-full flex-col items-center justify-center rounded-tile border border-line bg-card shadow-lift">
            <span className="text-6xl font-bold tracking-tight">404</span>
            <span className="mt-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
              flip me
            </span>
          </div>
        }
        back={
          <div className="flex h-full w-full flex-col items-center justify-center rounded-tile bg-accent p-4 shadow-lift">
            <span className="font-display text-2xl italic text-white">
              Oops — wrong card!
            </span>
          </div>
        }
      />
      <h1 className="mt-10 text-3xl font-bold tracking-tight">
        This page seems to be missing from the deck.
      </h1>
      <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-soft">
        The page you're looking for doesn't exist or has moved. Let's get you
        back to the good stuff.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-ink px-8 py-4 text-[15px] font-semibold text-paper transition-colors hover:bg-accent"
      >
        Back to home
      </Link>
    </div>
  );
}

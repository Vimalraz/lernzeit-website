import Link from "next/link";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 active:scale-[0.98]";
const sizes = {
  md: "px-6 py-3 text-[15px]",
  lg: "px-8 py-4 text-[16px]",
} as const;

export function AmazonButton({
  href,
  size = "md",
  children = "Buy on Amazon",
  className = "",
}: {
  href: string;
  size?: keyof typeof sizes;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${sizes[size]} bg-ink text-paper hover:bg-accent hover:shadow-lift ${className}`}
    >
      <CartGlyph />
      {children}
    </a>
  );
}

export function GhostButton({
  href,
  size = "md",
  children,
  className = "",
}: {
  href: string;
  size?: keyof typeof sizes;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`${base} ${sizes[size]} border border-line bg-card text-ink hover:border-ink ${className}`}
    >
      {children}
    </Link>
  );
}

export function AccentLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1.5 text-[15px] font-semibold text-teal hover:text-teal-deep ${className}`}
    >
      {children}
      <span aria-hidden>→</span>
    </Link>
  );
}

function CartGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 4h2.4l2.2 11.2a2 2 0 0 0 2 1.8h7.9a2 2 0 0 0 2-1.6L21 8H6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="20.5" r="1.5" fill="currentColor" />
      <circle cx="17.5" cy="20.5" r="1.5" fill="currentColor" />
    </svg>
  );
}

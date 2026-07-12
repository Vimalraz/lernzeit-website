import Link from "next/link";
import Image from "next/image";

/** Lernzeit black logo — uses the official SVG asset from /public */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center ${className}`}
      aria-label="Lernzeit — home"
    >
      <Image
        src="/lernzit-logo-black.svg"
        alt="Lernzeit"
        width={110}
        height={48}
        className="h-9 w-auto"
        priority
      />
    </Link>
  );
}

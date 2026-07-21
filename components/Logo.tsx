import Link from "next/link";
import Image from "next/image";
import { asset } from "@/lib/site";

/** LernZeit logo — uses the official PNG asset from /public */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center ${className}`}
      aria-label="LernZeit — home"
    >
      <Image
        src={asset("/lernzit-logo-black.svg")}
        alt="LernZeit"
        width={220}
        height={95}
        className="h-11 w-auto sm:h-12"
        priority
      />
    </Link>
  );
}

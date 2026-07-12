import Link from "next/link";
import Logo from "@/components/Logo";
import { nav, site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-paper-deep/60">
      <div className="mx-auto max-w-6xl px-5 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
              {site.description}
            </p>
            <p className="mt-5 inline-flex items-center gap-2 text-[13px] font-medium text-teal">
              <LockIcon />
              All purchases handled securely by Amazon
            </p>
          </div>

          <div>
            <p className="text-[13px] font-semibold uppercase tracking-wider text-ink-soft">
              Explore
            </p>
            <ul className="mt-4 space-y-2.5">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[15px] text-ink hover:text-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[13px] font-semibold uppercase tracking-wider text-ink-soft">
              Connect
            </p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href={site.amazonStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[15px] text-ink hover:text-accent"
                >
                  Lernzeit on Amazon ↗
                </a>
              </li>
              <li>
                <a
                  href={site.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[15px] text-ink hover:text-accent"
                >
                  Instagram ↗
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.contactEmail}`}
                  className="text-[15px] text-ink hover:text-accent"
                >
                  {site.contactEmail}
                </a>
              </li>
              <li>
                <Link
                  href="/our-story#contact"
                  className="text-[15px] text-ink hover:text-accent"
                >
                  Contact us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-[13px] text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Lernzeit. All rights reserved.</p>
          <p>Made with care by parents, for parents.</p>
        </div>
      </div>
    </footer>
  );
}

function LockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="5"
        y="10"
        width="14"
        height="10"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M8 10V7a4 4 0 0 1 8 0v3"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

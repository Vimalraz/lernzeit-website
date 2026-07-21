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
            {/* Amazon trust line */}
            <div className="mt-5 inline-flex items-center gap-2 text-[13px] font-medium text-teal">
              <LockIcon />
              <span>All purchases handled securely by Amazon</span>
            </div>
            <p className="mt-4 text-[13px] font-medium text-ink-soft/60">
              Crafted with ❤️ in Bharat
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
                    className="w-fit bg-[linear-gradient(var(--accent-deep),var(--accent-deep))] bg-[length:0%_1.5px] bg-[position:0_100%] bg-no-repeat pb-px text-[15px] text-ink transition-all duration-300 ease-out hover:bg-[length:100%_1.5px] hover:text-accent-deep"
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
                  className="inline-flex items-center gap-2 w-fit bg-[linear-gradient(var(--accent-deep),var(--accent-deep))] bg-[length:0%_1.5px] bg-[position:0_100%] bg-no-repeat pb-px text-[15px] text-ink transition-all duration-300 ease-out hover:bg-[length:100%_1.5px] hover:text-accent-deep"
                >
                  <AmazonIcon />
                  LernZeit on Amazon ↗
                </a>
              </li>
              <li>
                <a
                  href={site.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 w-fit bg-[linear-gradient(var(--accent-deep),var(--accent-deep))] bg-[length:0%_1.5px] bg-[position:0_100%] bg-no-repeat pb-px text-[15px] text-ink transition-all duration-300 ease-out hover:bg-[length:100%_1.5px] hover:text-accent-deep"
                >
                  <InstagramIcon />
                  Instagram ↗
                </a>
              </li>
              <li>
                <a
                  href={site.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 w-fit bg-[linear-gradient(var(--accent-deep),var(--accent-deep))] bg-[length:0%_1.5px] bg-[position:0_100%] bg-no-repeat pb-px text-[15px] text-ink transition-all duration-300 ease-out hover:bg-[length:100%_1.5px] hover:text-accent-deep"
                >
                  <YouTubeIcon />
                  YouTube ↗
                </a>
              </li>
              <li>
                <Link
                  href="/our-story#contact"
                  className="w-fit bg-[linear-gradient(var(--accent-deep),var(--accent-deep))] bg-[length:0%_1.5px] bg-[position:0_100%] bg-no-repeat pb-px text-[15px] text-ink transition-all duration-300 ease-out hover:bg-[length:100%_1.5px] hover:text-accent-deep"
                >
                  Contact us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-[13px] text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 LernZeit Creations. All rights reserved.</p>
          <p>Crafted with ❤️ in Bharat</p>
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

function AmazonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6.5 17.5C10.5 20 15.5 20 19.5 17.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M17.5 16.5l2.5 1.5-1.5 2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 3C8.7 3 6 5.7 6 9c0 2.4 1.4 4.5 3.4 5.5L9 17h6l-.4-2.5C16.6 13.5 18 11.4 18 9c0-3.3-2.7-6-6-6z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="2" y="5" width="20" height="14" rx="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10 9l5 3-5 3V9z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

export default function Stars({
  rating,
  count,
  className = "",
}: {
  rating: number;
  count?: number;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 ${className}`}
      aria-label={`Rated ${rating} out of 5${count ? ` from ${count} reviews` : ""}`}
    >
      <span className="flex gap-0.5" aria-hidden>
        {[1, 2, 3, 4, 5].map((i) => (
          <svg key={i} width="14" height="14" viewBox="0 0 24 24">
            <path
              d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"
              fill={i <= Math.round(rating) ? "var(--gold)" : "var(--line)"}
            />
          </svg>
        ))}
      </span>
      <span className="text-[13px] font-semibold text-ink">{rating.toFixed(1)}</span>
      {count !== undefined && (
        <span className="text-[13px] text-ink-soft">({count.toLocaleString()})</span>
      )}
    </span>
  );
}

type Props = {
  eyebrow?: string;
  title: string;
  lede?: string;
  align?: "left" | "center";
  className?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
  className = "",
}: Props) {
  const centered = align === "center";
  return (
    <div
      className={`max-w-2xl ${centered ? "mx-auto text-center" : ""} ${className}`}
    >
      {eyebrow && (
        <p className="font-display text-[15px] font-semibold italic tracking-wide text-accent">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink md:text-[40px] md:leading-[1.15]">
        {title}
      </h2>
      {lede && (
        <p className="mt-4 text-[17px] leading-relaxed text-ink-soft">{lede}</p>
      )}
    </div>
  );
}

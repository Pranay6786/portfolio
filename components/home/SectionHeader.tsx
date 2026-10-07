/**
 * Framing shared by homepage sections 01-07: a mono kicker line reading
 * "{kicker} / {number}", the section title, then an optional subtitle and intro.
 */
export default function SectionHeader({
  titleId,
  number,
  kicker,
  title,
  subtitle,
  intro,
}: {
  titleId: string;
  number: string;
  kicker: string;
  title: string;
  subtitle?: string;
  intro?: string;
}) {
  return (
    <header className="mb-10 sm:mb-12">
      <p className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-faint">
        {kicker} / {number}
      </p>
      <h2
        id={titleId}
        className="mt-3 font-serif text-[1.75rem] font-semibold leading-[1.25] text-balance text-text"
      >
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-2 font-serif text-[1.1875rem] leading-snug text-muted">
          {subtitle}
        </p>
      ) : null}
      {intro ? (
        <p className="mt-4 max-w-[40rem] font-serif text-[1.0625rem] leading-[1.7] text-muted">
          {intro}
        </p>
      ) : null}
    </header>
  );
}

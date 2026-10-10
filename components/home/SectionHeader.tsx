/**
 * Framing shared by homepage sections 01-07: a mono kicker line reading
 * "{kicker} / {number}", the section title, then an optional subtitle and intro.
 * Left-aligned by default; `align="center"` centres the whole block.
 *
 * By default the header floats in on scroll through the reveal observer
 * (`data-reveal`). `entrance="load"` takes it off the observer and onto the
 * load stagger instead (`data-load-in`, timed in globals.css), for a header
 * that is on the first screen.
 */
export default function SectionHeader({
  titleId,
  number,
  kicker,
  title,
  subtitle,
  intro,
  align = "start",
  entrance = "reveal",
}: {
  titleId: string;
  number: string;
  kicker: string;
  title: string;
  subtitle?: string;
  intro?: string;
  align?: "start" | "center";
  entrance?: "reveal" | "load";
}) {
  const centred = align === "center";

  return (
    <header
      {...(entrance === "load" ? { "data-load-in": "section-header" } : { "data-reveal": "" })}
      className={centred ? "mb-10 text-center sm:mb-12" : "mb-10 sm:mb-12"}
    >
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
        <p
          className={
            centred
              ? "mx-auto mt-4 max-w-[40rem] font-serif text-[1.0625rem] leading-[1.7] text-muted"
              : "mt-4 max-w-[40rem] font-serif text-[1.0625rem] leading-[1.7] text-muted"
          }
        >
          {intro}
        </p>
      ) : null}
    </header>
  );
}

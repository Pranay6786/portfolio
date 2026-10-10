import Link from "next/link";
import MetricStrip from "@/components/MetricStrip";
import Pill from "@/components/home/Pill";
import type { CaseStudyFrontmatter } from "@/lib/content";

/** The card's surface: hairline border and padding, on the link or on a face. */
const FACE_CLASS =
  "rounded-[4px] border border-border p-6 group-hover:border-accent-dim group-focus-visible:border-accent-dim motion-safe:transition-[border-color] motion-safe:duration-150 sm:p-8";

/**
 * One case study as a card, built entirely from its frontmatter: subtitle as
 * the heading, then title, summary, badges and metric strip. The whole card
 * links to the study. On hover or keyboard focus the border turns accent-dim
 * and, unless the reader prefers reduced motion, the card rises 2px. Shared by
 * the homepage work section and the /work index, where it always sits under an
 * h2, so its heading is an h3.
 *
 * A library study with a `method` flips on hover and keyboard focus to show
 * it. The link stays the one outer element, with the same target, name and
 * 2px lift (the `translate` property, on the link). Inside it a wrapper turns
 * with `transform` - a different element and a different property, so the
 * two never fight. The front face is the card as it always was and sets the
 * height; the back face is absolutely positioned over it, so the card never
 * changes size. The border moves onto both faces and still turns accent-dim
 * on the link's hover. All flip styling is in globals.css under
 * [data-flip-card], inside `@media (hover: hover)` and the reduced-motion
 * guard. Every other card renders exactly as before.
 */
export default function WorkCard({ study }: { study: CaseStudyFrontmatter }) {
  const href = `/work/${study.slug}`;
  // Named by the heading and title only, not the whole card's text.
  const labelledBy = `card-${study.slug}-heading card-${study.slug}-title`;

  if (study.kind === "library" && study.method) {
    return (
      <Link
        href={href}
        aria-labelledby={labelledBy}
        data-flip-card=""
        className="group block motion-safe:transition-[translate] motion-safe:duration-150 motion-safe:hover:-translate-y-0.5 motion-safe:focus-visible:-translate-y-0.5"
      >
        <div data-flip-inner="" className="relative">
          <div data-flip-front="" className={FACE_CLASS}>
            <CardBody study={study} />
          </div>
          <div
            data-flip-back=""
            className={`${FACE_CLASS} absolute inset-0 flex flex-col justify-center bg-bg`}
          >
            <p className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-faint">
              Method
            </p>
            <p className="mt-3 font-serif text-[1.3125rem] leading-[1.35] text-balance text-text">
              {study.method}
            </p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      aria-labelledby={labelledBy}
      className="block rounded-[4px] border border-border p-6 hover:border-accent-dim focus-visible:border-accent-dim motion-safe:transition-[border-color,translate] motion-safe:duration-150 motion-safe:hover:-translate-y-0.5 motion-safe:focus-visible:-translate-y-0.5 sm:p-8"
    >
      <CardBody study={study} />
    </Link>
  );
}

/** The card's content: the front face of a flipping card, or the whole card. */
function CardBody({ study }: { study: CaseStudyFrontmatter }) {
  return (
    <>
      <h3
        id={`card-${study.slug}-heading`}
        className="font-serif text-[1.3125rem] font-semibold leading-[1.35] text-balance text-text"
      >
        {study.subtitle}
      </h3>
      <p id={`card-${study.slug}-title`} className="mt-2 font-sans text-[0.875rem] text-accent">
        {study.title}
      </p>
      <p className="mt-4 max-w-[40rem] font-serif text-[1.0625rem] leading-[1.7] text-text">
        {study.summary}
      </p>

      {study.liveUrl || study.badges.length > 0 ? (
        <ul className="mt-5 flex flex-wrap gap-2">
          {study.liveUrl ? (
            // A label, not a link: the whole card already links to the study.
            // The one pill in the accent, for a product anyone can use.
            <li className="inline-flex items-center gap-1.5 rounded-full border border-accent-dim bg-accent-tint px-2.5 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.08em] whitespace-nowrap text-accent">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
              Live
            </li>
          ) : null}
          {study.badges.map((badge) => (
            <Pill key={badge}>{badge}</Pill>
          ))}
        </ul>
      ) : null}

      {study.metricStrip ? (
        <div className="mt-4">
          <MetricStrip>{study.metricStrip}</MetricStrip>
        </div>
      ) : null}
    </>
  );
}

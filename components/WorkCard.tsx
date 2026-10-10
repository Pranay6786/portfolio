import Link from "next/link";
import MetricStrip from "@/components/MetricStrip";
import Pill from "@/components/home/Pill";
import type { CaseStudyFrontmatter } from "@/lib/content";

/**
 * One case study as a card, built entirely from its frontmatter: subtitle as
 * the heading, then title, summary, badges and metric strip. The whole card
 * links to the study. On hover or keyboard focus the border turns accent-dim
 * and, unless the reader prefers reduced motion, the card rises 2px. Shared by
 * the homepage work section and the /work index, where it always sits under an
 * h2, so its heading is an h3.
 */
export default function WorkCard({ study }: { study: CaseStudyFrontmatter }) {
  return (
    // Named by the heading and title only, not the whole card's text.
    <Link
      href={`/work/${study.slug}`}
      aria-labelledby={`card-${study.slug}-heading card-${study.slug}-title`}
      className="block rounded-[4px] border border-border p-6 hover:border-accent-dim focus-visible:border-accent-dim motion-safe:transition-[border-color,translate] motion-safe:duration-150 motion-safe:hover:-translate-y-0.5 motion-safe:focus-visible:-translate-y-0.5 sm:p-8"
    >
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
    </Link>
  );
}

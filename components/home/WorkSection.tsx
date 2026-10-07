import Link from "next/link";
import MetricStrip from "@/components/MetricStrip";
import Pill from "@/components/home/Pill";
import SectionHeader from "@/components/home/SectionHeader";
import TextLink from "@/components/home/TextLink";
import type { CaseStudyFrontmatter } from "@/lib/content";
import type { HomepageContent } from "@/lib/homepage";

/**
 * Selected work. Every card is built from the case study's own frontmatter, so
 * the homepage never carries a copy of a title, subtitle, summary, badge or
 * metric strip.
 */
export default function WorkSection({
  content,
  studies,
}: {
  content: HomepageContent["work"];
  studies: CaseStudyFrontmatter[];
}) {
  return (
    <section id="work" aria-labelledby="work-title" className="scroll-mt-14 py-16 sm:py-24">
      <SectionHeader
        titleId="work-title"
        number={content.number}
        kicker={content.kicker}
        title={content.title}
        intro={content.intro}
      />

      <ul className="flex flex-col gap-6">
        {studies.map((study) => (
          <li key={study.slug}>
            {/* Named by the heading and title only, not the whole card's text. */}
            <Link
              href={`/work/${study.slug}`}
              aria-labelledby={`card-${study.slug}-heading card-${study.slug}-title`}
              className="block rounded-[4px] border border-border p-6 hover:border-accent-dim sm:p-8"
            >
              <h3
                id={`card-${study.slug}-heading`}
                className="font-serif text-[1.3125rem] font-semibold leading-[1.35] text-balance text-text"
              >
                {study.subtitle}
              </h3>
              <p
                id={`card-${study.slug}-title`}
                className="mt-2 font-sans text-[0.875rem] text-muted"
              >
                {study.title}
              </p>
              <p className="mt-4 max-w-[40rem] font-serif text-[1.0625rem] leading-[1.7] text-text">
                {study.summary}
              </p>

              {study.badges.length > 0 ? (
                <ul className="mt-5 flex flex-wrap gap-2">
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
          </li>
        ))}
      </ul>

      <p className="mt-8">
        <TextLink href={content.allWorkHref}>{content.allWorkLabel}</TextLink>
      </p>
    </section>
  );
}

import type { Metadata } from "next";
import WorkCard from "@/components/WorkCard";
import { getAllCaseStudies, type CaseStudyKind } from "@/lib/content";
import { getWorkIndexContent } from "@/lib/work-index";

// Featured studies first, then the library.
const GROUP_ORDER: readonly CaseStudyKind[] = ["featured", "library"];

// Both strings come from content/work.json, so no copy lives here.
export function generateMetadata(): Metadata {
  const content = getWorkIndexContent();

  return {
    title: content.title,
    description: content.intro,
  };
}

export default function WorkIndexPage() {
  const content = getWorkIndexContent();
  // Already sorted by `order`; filtering keeps that sequence within each group.
  const studies = getAllCaseStudies().map((study) => study.frontmatter);

  const groups = GROUP_ORDER.map((kind) => ({
    kind,
    heading: content.groups[kind],
    studies: studies.filter((study) => study.kind === kind),
  })).filter((group) => group.studies.length > 0);

  return (
    <main className="mx-auto w-full max-w-[61rem] px-5 pt-12 pb-16 sm:px-6 sm:pt-20 sm:pb-24">
      <header className="mb-12 sm:mb-16">
        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-faint">
          {content.kicker}
        </p>
        <h1 className="mt-3 font-serif text-[2rem] font-semibold leading-[1.15] text-balance text-text sm:text-[2.375rem]">
          {content.title}
        </h1>
        <p className="mt-4 max-w-[40rem] font-serif text-[1.0625rem] leading-[1.7] text-muted">
          {content.intro}
        </p>
      </header>

      <div className="flex flex-col gap-14 sm:gap-16">
        {groups.map((group) => (
          <section key={group.kind} aria-labelledby={`group-${group.kind}`}>
            <h2
              id={`group-${group.kind}`}
              className="mb-6 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-faint"
            >
              {group.heading}
            </h2>
            <ul className="flex flex-col gap-6">
              {group.studies.map((study) => (
                <li key={study.slug}>
                  <WorkCard study={study} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}

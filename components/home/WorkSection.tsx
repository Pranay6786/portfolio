import SectionHeader from "@/components/home/SectionHeader";
import TextLink from "@/components/home/TextLink";
import WorkCard from "@/components/WorkCard";
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
    <section id="work" aria-labelledby="work-title" className="scroll-mt-20 py-16 sm:py-24">
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
            <WorkCard study={study} />
          </li>
        ))}
      </ul>

      <p className="mt-8">
        <TextLink href={content.allWorkHref}>{content.allWorkLabel}</TextLink>
      </p>
    </section>
  );
}

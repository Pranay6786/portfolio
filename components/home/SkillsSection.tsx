import Pill from "@/components/home/Pill";
import SectionHeader from "@/components/home/SectionHeader";
import type { HomepageContent } from "@/lib/homepage";

/**
 * Skill groups, one per row: the mono group title in a narrow left column and
 * its pills wrapping beside it, stacked below `sm`. One row per group never
 * leaves an orphan, whatever the number of groups, and the label-and-values
 * rows match the "Now" block and the education list.
 */
export default function SkillsSection({ content }: { content: HomepageContent["skills"] }) {
  return (
    <section id="skills" aria-labelledby="skills-title" className="scroll-mt-[6.25rem] py-16 sm:py-24">
      <SectionHeader
        titleId="skills-title"
        number={content.number}
        kicker={content.kicker}
        title={content.title}
      />

      <div className="flex flex-col gap-8">
        {content.groups.map((group) => (
          <div key={group.title} className="grid gap-3 sm:grid-cols-[11rem_1fr] sm:gap-6">
            <h3 className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-faint sm:pt-2">
              {group.title}
            </h3>
            <ul className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <Pill key={item}>{item}</Pill>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

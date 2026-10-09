import Pill from "@/components/home/Pill";
import SectionHeader from "@/components/home/SectionHeader";
import type { HomepageContent } from "@/lib/homepage";

/** Skill groups, each a mono heading over a wrap of pills. */
export default function SkillsSection({ content }: { content: HomepageContent["skills"] }) {
  return (
    <section id="skills" aria-labelledby="skills-title" className="scroll-mt-20 py-16 sm:py-24">
      <SectionHeader
        titleId="skills-title"
        number={content.number}
        kicker={content.kicker}
        title={content.title}
      />

      <div className="grid gap-10 sm:grid-cols-2">
        {content.groups.map((group) => (
          <div key={group.title}>
            <h3 className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-faint">
              {group.title}
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2">
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
